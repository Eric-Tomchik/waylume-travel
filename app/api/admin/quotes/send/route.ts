import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { deliverNotification } from "@/lib/notificationProvider";
import {
  getConvexServerClient,
  notificationsEnqueue,
  notificationsMarkResult,
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

function money(amount: number | undefined, currency: string) {
  if (amount === undefined) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD" }).format(amount);
}

function composeEmail(quote: QuoteRecord, trip: TripRecord) {
  const price = money(quote.amount, quote.currency);
  const lines = [
    `Hi ${trip.name.split(" ")[0] || "there"},`,
    "",
    `Here is the option I've put together for your trip to ${trip.destination}${trip.dates ? ` (${trip.dates})` : ""}.`,
    "",
    quote.title,
    quote.supplierName ? `Supplier: ${quote.supplierName}` : null,
    price ? `Estimated total: ${price}` : null,
    quote.expiresAt ? `Please let me know by: ${new Date(quote.expiresAt).toLocaleDateString("en-US", { dateStyle: "long" })}` : null,
    "",
    quote.summary,
    "",
    "Just reply to this email to let me know whether you'd like to move forward, or if you'd like me to look at alternatives — I'll take it from there.",
    "",
    "Pricing and availability are subject to supplier confirmation; this note does not issue a ticket, charge a card, or finalize a booking.",
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

  const subject = `Your ${trip.destination} option from Waylume Travel: ${quote.title}`;
  const message = composeEmail(quote, { ...trip, email: recipient });

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

  // Only move draft -> sent when the email actually left the building.
  if (delivery.ok) {
    try {
      await client.mutation(quoteMarkSentForAdmin, { adminSecret, id: quote._id });
    } catch {
      /* status update is best effort */
    }
  }

  return NextResponse.json(
    {
      ok: true,
      delivered: delivery.ok,
      recipient,
      error: delivery.ok ? undefined : delivery.error || "The email provider rejected this message.",
    },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
