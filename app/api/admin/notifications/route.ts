import { NextResponse } from "next/server";
import { getConvexServerClient, notificationsEnqueue, notificationsList, notificationsMarkResult } from "@/lib/convexServer";

function adminSecretFor(request: Request) {
  const expected = process.env.WAYLUME_ADMIN_TOKEN;
  return expected && request.headers.get("x-admin-token") === expected ? expected : null;
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
      recipient: String(body.recipient).trim(),
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
  const webhookUrl = process.env.WAYLUME_NOTIFICATION_WEBHOOK_URL;
  if (!webhookUrl) return NextResponse.json({ error: "Notification delivery provider is not configured" }, { status: 503 });
  try {
    const body = await request.json();
    if (!body.id || !body.channel || !body.recipient || !body.message) return NextResponse.json({ error: "Complete queued notification data is required" }, { status: 400 });
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(process.env.WAYLUME_NOTIFICATION_WEBHOOK_SECRET ? { "Authorization": `Bearer ${process.env.WAYLUME_NOTIFICATION_WEBHOOK_SECRET}` } : {}) },
      body: JSON.stringify({ channel: body.channel, recipient: body.recipient, subject: body.subject, message: body.message }),
    });
    const result = await response.json().catch(() => ({}));
    const client = getConvexServerClient();
    await client.mutation(notificationsMarkResult, {
      adminSecret,
      id: String(body.id),
      status: response.ok ? "sent" : "failed",
      provider: "webhook",
      providerMessageId: result.id ? String(result.id) : undefined,
      failureReason: response.ok ? undefined : `Delivery endpoint returned ${response.status}`,
    });
    return NextResponse.json({ ok: response.ok }, { status: response.ok ? 200 : 502 });
  } catch {
    return NextResponse.json({ error: "Notification delivery failed" }, { status: 502 });
  }
}
