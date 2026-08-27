import { NextResponse } from "next/server";
import { getConvexServerClient, travelRequestGetForAdmin } from "@/lib/convexServer";

type Day = { day: number; title: string; details: string };

function fallbackDraft(destination: string, tripType: string, dates?: string, travelers?: string, notes?: string) {
  const context = [dates ? `Travel window: ${dates}.` : "Dates are flexible.", travelers ? `${travelers} traveler(s).` : "", notes ? `Traveler priorities: ${notes}` : ""].filter(Boolean).join(" ");
  const days: Day[] = [
    { day: 1, title: `Arrival in ${destination}`, details: `Arrival, transfer/check-in, and a relaxed orientation period. ${context}` },
    { day: 2, title: "Signature experience", details: `Reserve the strongest destination-defining activity appropriate for a ${tripType.toLowerCase()} while leaving buffer for confirmed supplier timing.` },
    { day: 3, title: "Flexible discovery", details: "Blend a curated activity with open time for dining, shopping, beach/resort time, or local exploration based on traveler preferences." },
    { day: 4, title: "Advisor-selected highlight", details: "Use supplier research to place a high-value excursion, cruise activity, resort feature, or cultural experience here once availability is confirmed." },
    { day: 5, title: "Departure or extension", details: "Check out, allow appropriate transfer time, and confirm final transportation details. Extend the pattern for longer trips as needed." },
  ];
  return { title: `${destination} — ${tripType} draft`, summary: `A planning-first itinerary framework for ${destination}. It is intentionally supplier-neutral until live availability and booking details are confirmed.`, days, source: "draft-builder" };
}

export async function POST(request: Request) {
  const adminSecret = process.env.WAYLUME_ADMIN_TOKEN;
  if (!adminSecret || request.headers.get("x-admin-token") !== adminSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (!body.travelRequestId) return NextResponse.json({ error: "travelRequestId is required" }, { status: 400 });
    const client = getConvexServerClient();
    const trip = await client.query(travelRequestGetForAdmin, { adminSecret, id: String(body.travelRequestId) });
    if (!trip) return NextResponse.json({ error: "Trip request not found" }, { status: 404 });

    const providerUrl = process.env.WAYLUME_ITINERARY_DRAFT_WEBHOOK_URL;
    if (providerUrl) {
      try {
        const response = await fetch(providerUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(process.env.WAYLUME_ITINERARY_DRAFT_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.WAYLUME_ITINERARY_DRAFT_WEBHOOK_SECRET}` } : {}) },
          body: JSON.stringify({ destination: trip.destination, dates: trip.dates, travelers: trip.travelers, budget: trip.budget, tripType: trip.tripType, notes: trip.notes }),
        });
        const generated = await response.json();
        if (response.ok && generated.title && generated.summary && Array.isArray(generated.days)) {
          return NextResponse.json({ draft: { title: String(generated.title), summary: String(generated.summary), days: generated.days, source: "ai" } });
        }
      } catch {
        // Provider failure falls back to a deterministic draft so the advisor workflow remains usable.
      }
    }

    return NextResponse.json({ draft: fallbackDraft(trip.destination, trip.tripType, trip.dates, trip.travelers, trip.notes) });
  } catch {
    return NextResponse.json({ error: "Unable to build itinerary draft" }, { status: 400 });
  }
}
