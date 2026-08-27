import { NextResponse } from "next/server";
import { getConvexServerClient, itineraryListByRequest, itineraryUpsert } from "@/lib/convexServer";

function getAdminSecret(request: Request) {
  const expected = process.env.WAYLUME_ADMIN_TOKEN;
  const supplied = request.headers.get("x-admin-token");
  return expected && supplied === expected ? expected : null;
}

export async function GET(request: Request) {
  const adminSecret = getAdminSecret(request);
  if (!adminSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const requestId = new URL(request.url).searchParams.get("requestId");
  if (!requestId) return NextResponse.json({ error: "requestId is required" }, { status: 400 });
  try {
    const client = getConvexServerClient();
    const itineraries = await client.query(itineraryListByRequest, { adminSecret, travelRequestId: requestId });
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
      title: String(body.title),
      summary: String(body.summary),
      days: body.days.map((day: { day: unknown; title: unknown; details: unknown }) => ({ day: Number(day.day), title: String(day.title), details: String(day.details) })),
      published: Boolean(body.published),
      source: validSources.has(String(body.source)) ? body.source : "manual",
    });
    return NextResponse.json({ ok: true, id }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Unable to save itinerary" }, { status: 400 });
  }
}
