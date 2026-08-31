import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getConvexServerClient, itineraryListAll, itineraryListByRequest, itineraryUpsert } from "@/lib/convexServer";

function getAdminSecret(request: Request) {
  const expected = process.env.WAYLUME_ADMIN_TOKEN;
  return expected && isAdminRequest(request) ? expected : null;
}

export async function GET(request: Request) {
  const adminSecret = getAdminSecret(request);
  if (!adminSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const requestId = new URL(request.url).searchParams.get("requestId");
  try {
    const client = getConvexServerClient();
    // Without a trip id the screen lists every itinerary.
    const itineraries = requestId
      ? await client.query(itineraryListByRequest, { adminSecret, travelRequestId: requestId })
      : await client.query(itineraryListAll, { adminSecret });
    return NextResponse.json({ itineraries }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to load itineraries" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const adminSecret = getAdminSecret(request);
  if (!adminSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (!body.travelRequestId || !body.title || !body.summary || !Array.isArray(body.days)) return NextResponse.json({ error: "Trip, title, summary, and days are required" }, { status: 400 });
    const validSources = new Set(["manual", "draft-builder", "ai"]);
    const client = getConvexServerClient();
    const id = await client.mutation(itineraryUpsert, {
      adminSecret,
      id: body.id || undefined,
      travelRequestId: body.travelRequestId,
      title: String(body.title).slice(0, 160),
      summary: String(body.summary).slice(0, 4000),
      days: body.days.slice(0, 31).map((day: { day: unknown; title: unknown; details: unknown }) => ({ day: Number(day.day), title: String(day.title).slice(0, 160), details: String(day.details).slice(0, 5000) })),
      published: Boolean(body.published),
      source: validSources.has(String(body.source)) ? body.source : "manual",
    });
    return NextResponse.json({ ok: true, id }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Unable to save itinerary" }, { status: 400 });
  }
}
