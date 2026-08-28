export type TripRequestPayload = {
  name: string;
  email: string;
  destination: string;
  dates?: string;
  travelers: string;
  budget?: string;
  tripType: string;
  notes?: string;
  website?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export function validateTripRequest(input: unknown) {
  if (!input || typeof input !== "object") return { ok: false as const, error: "Invalid request payload" };
  const body = input as Record<string, unknown>;
  if (clean(body.website, 200)) return { ok: false as const, error: "Unable to process request" };

  const payload: TripRequestPayload = {
    name: clean(body.name, 100),
    email: clean(body.email, 254).toLowerCase(),
    destination: clean(body.destination, 120),
    dates: clean(body.dates, 100) || undefined,
    travelers: clean(body.travelers, 20) || "2",
    budget: clean(body.budget, 50) || undefined,
    tripType: clean(body.tripType, 60) || "Vacation Package",
    notes: clean(body.notes, 2000) || undefined,
  };

  if (!payload.name || !payload.destination || !payload.email) return { ok: false as const, error: "Name, email, and destination are required" };
  if (!emailPattern.test(payload.email)) return { ok: false as const, error: "Enter a valid email address" };
  return { ok: true as const, payload };
}
