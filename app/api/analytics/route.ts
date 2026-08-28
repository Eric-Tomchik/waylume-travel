import { NextResponse } from "next/server";
import { getConvexServerClient, analyticsTrack } from "@/lib/convexServer";

const allowedEvents = new Set([
  "page_view",
  "planner_started",
  "planner_match",
  "trip_request_started",
  "trip_request_submitted",
  "portal_opened",
  "quote_viewed",
  "itinerary_viewed",
  "ai_concierge_opened",
  "ai_message_sent",
  "ai_advisor_handoff",
]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!allowedEvents.has(String(body.event)) || !body.surface) return NextResponse.json({ error: "Unsupported event" }, { status: 400 });
    const client = getConvexServerClient();
    await client.mutation(analyticsTrack, {
      event: String(body.event),
      surface: String(body.surface).slice(0, 80),
      travelRequestId: body.travelRequestId ? String(body.travelRequestId) : undefined,
      quoteId: body.quoteId ? String(body.quoteId) : undefined,
      metadata: body.metadata ? JSON.stringify(body.metadata).slice(0, 1000) : undefined,
    });
    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}
