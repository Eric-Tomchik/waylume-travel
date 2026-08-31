import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { deliverNotification } from "@/lib/notificationProvider";
import {
  getConvexServerClient,
  notificationsEnqueue,
  notificationsMarkResult,
  portalCreateAccess,
  quoteGetForAdmin,
  quoteMarkSentForAdmin,
} from "@/lib/convexServer";
import { HOST_AGENCY } from "@/lib/hostAgency";

type QuoteRecord = {
  _id: string;
  travelRequestId: string;
  title: string;
  summary: string;
  amount?: number;
  currency: string;
  supplierName?: string;
  expiresAt?: number;
  status: string;
};

type TripRecord = { _id: string; name: string; email: string; destination: string; dates?: string };

function adminSecretFor(request: Request) {
  const expected = process.env.WAYLUME_ADMIN_TOKEN;
  return expected && isAdminRequest(request) ? expected : null;
}

function makeToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: createHash("sha256").update(token).digest("hex") };
}

function siteOrigin(request: Request) {
  const configured = process.env.WAYLUME_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  return new URL(request.url).origin;
}

function money(amount: number | undefined, currency: string) {
  if (amount === undefined) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD" }).format(amount);
}

function composeEmail(quote: QuoteRecord, trip: TripRecord, portalUrl: string) {
  const price = money(quote.amount, quote.currency);
  const lines = [
    `Hi ${trip.name.split(" ")[0] || "there"},`,
    "",
    `Here is the option I've put together for your trip to ${trip.destination}${trip.dates ? ` (${trip.dates})` : ""}.`,
    "",
    quote.title,
    quote.supplierName ? `Supplier: ${quote.supplierName}` : null,
    price ? `Estimated total: ${price}` : null,
    quote.expiresAt ? `Please review by: ${new Date(quote.expiresAt).toLocaleDateString("en-US", { dateStyle: "long" })}` : null,
    "",
    quote.summary,
    "",
    "Review the full details and let me know your decision here — you can accept or decline with one click inside your private trip portal:",
    portalUrl,
    "",
    "Accepting records your preference for me to move forward; it does not by itself issue a ticket, charge a card, or finalize a supplier booking. Final pricing, availability, and booking terms remain subject to supplier confirmation.",
    "",
    "This secure link is personal to you — please don't forward it.",
    "",
    "Warmly,",
    "Eric Tomchik",
    "Waylume Travel",
    HOST_AGENCY.disclosure,
  ];
  return lines.filter(line => line !== null).join("\n");
}

export async function POST(request: Request) {
  const adminSecret = adminSecretFor(request);
  if (!adminSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { quoteId?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (!body.quoteId) return NextResponse.json({ error: "quoteId is required" }, { status: 400 });

  const client = getConvexServerClient();

  let record: { quote: QuoteRecord; trip: TripRecord | null } | null;
  try {
    record = await client.query(quoteGetForAdmin, { adminSecret, id: body.quoteId });
  } catch {
    return NextResponse.json({ error: "Unable to load the quote" }, { status: 400 });
  }
  if (!record?.quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

  const { quote, trip } = record;
  const recipient = String(body.email || trip?.email || "").trim().toLowerCase();
  if (!recipient) return NextResponse.json({ error: "No traveler email is on file for this trip." }, { status: 400 });
  if (!trip) return NextResponse.json({ error: "This quote is not linked to a trip inquiry." }, { status: 400 });

  // A fresh single-traveler portal link, valid past the quote expiry so the
  // accept/decline buttons still work while the option is live.
  const { token, tokenHash } = makeToken();
  const minimum = Date.now() + 14 * 24 * 60 * 60 * 1000;
  const expiresAt = Math.max(minimum, (quote.expiresAt ?? 0) + 7 * 24 * 60 * 60 * 1000);
  try {
    await client.mutation(portalCreateAccess, { adminSecret, email: recipient, tokenHash, travelRequestId: quote.travelRequestId, expiresAt });
  } catch {
    return NextResponse.json({ error: "Unable to create the traveler portal link" }, { status: 400 });
  }

  const portalUrl = `${siteOrigin(request)}/portal?token=${encodeURIComponent(token)}&quote=${encodeURIComponent(quote._id)}`;
  const subject = `Your ${trip.destination} option from Waylume Travel: ${quote.title}`;
  const message = composeEmail(quote, { ...trip, email: recipient }, portalUrl);

  // Log the send attempt first so a delivery failure is still visible in Notifications.
  let notificationId: string | null = null;
  try {
    notificationId = await client.mutation(notificationsEnqueue, {
      adminSecret,
      channel: "email",
      recipient,
      subject,
      message,
      relatedTravelRequestId: quote.travelRequestId,
    });
  } catch {
    notificationId = null;
  }

  const delivery = await deliverNotification({ channel: "email", recipient, subject, message });

  if (notificationId) {
    try {
      await client.mutation(notificationsMarkResult, {
        adminSecret,
        id: notificationId,
        status: delivery.ok ? "sent" : "failed",
        provider: delivery.provider,
        providerMessageId: delivery.id,
        failureReason: delivery.ok ? undefined : delivery.error,
      });
    } catch {
      /* the queue entry stays as-is; delivery result is still returned below */
    }
  }

  // The quote is now with the traveler either way — the link is live even if the
  // email provider is not configured yet and Eric sends the link himself.
  try {
    await client.mutation(quoteMarkSentForAdmin, { adminSecret, id: quote._id });
  } catch {
    /* status update is best effort */
  }

  return NextResponse.json(
    {
      ok: true,
      delivered: delivery.ok,
      recipient,
      portalUrl,
      expiresAt,
      error: delivery.ok ? undefined : delivery.error,
    },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
