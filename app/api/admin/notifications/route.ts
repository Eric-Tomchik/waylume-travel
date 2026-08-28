import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { deliverNotification } from "@/lib/notificationProvider";
import { getConvexServerClient, notificationsEnqueue, notificationsList, notificationsMarkResult } from "@/lib/convexServer";

function adminSecretFor(request: Request) {
  const token = process.env.WAYLUME_ADMIN_TOKEN;
  return token && isAdminRequest(request) ? token : null;
}

export async function GET(request: Request) {
  const adminSecret = adminSecretFor(request);
  if (!adminSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const client = getConvexServerClient();
    const notifications = await client.query(notificationsList, { adminSecret, limit: 100 });
    return NextResponse.json({ notifications }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to load notifications" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const adminSecret = adminSecretFor(request);
  if (!adminSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (!body.recipient || !body.message || !["email", "sms"].includes(body.channel)) return NextResponse.json({ error: "Valid channel, recipient, and message are required" }, { status: 400 });
    const client = getConvexServerClient();
    const id = await client.mutation(notificationsEnqueue, {
      adminSecret,
      channel: body.channel,
      recipient: String(body.recipient).trim().slice(0, 254),
      subject: body.subject ? String(body.subject).slice(0, 200) : undefined,
      message: String(body.message).slice(0, 10000),
      relatedTravelRequestId: body.relatedTravelRequestId ? String(body.relatedTravelRequestId) : undefined,
    });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to queue notification" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const adminSecret = adminSecretFor(request);
  if (!adminSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (!body.id || !body.channel || !body.recipient || !body.message) return NextResponse.json({ error: "Complete queued notification data is required" }, { status: 400 });
    const result = await deliverNotification({
      channel: body.channel,
      recipient: String(body.recipient),
      subject: body.subject ? String(body.subject) : undefined,
      message: String(body.message),
    });
    const client = getConvexServerClient();
    await client.mutation(notificationsMarkResult, {
      adminSecret,
      id: String(body.id),
      status: result.ok ? "sent" : "failed",
      provider: result.provider,
      providerMessageId: result.id,
      failureReason: result.error,
    });
    return NextResponse.json({ ok: result.ok, provider: result.provider, error: result.error }, { status: result.ok ? 200 : result.error?.includes("No compatible") ? 503 : 502 });
  } catch {
    return NextResponse.json({ error: "Notification delivery failed" }, { status: 502 });
  }
}
