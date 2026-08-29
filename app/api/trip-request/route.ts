import { NextResponse } from "next/server";
import { allowRequest, requestFingerprint } from "@/lib/rateLimit";
import { validateTripRequest } from "@/lib/tripRequestValidation";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 32768) return NextResponse.json({ error: "Request too large" }, { status: 413 });

  const allowedOrigins = (process.env.WAYLUME_SITE_ORIGIN ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const origin = request.headers.get("origin");
  if (allowedOrigins.length > 0 && origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  }

  const rate = allowRequest(requestFingerprint(request));
  if (!rate.allowed) return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });

  try {
    const validation = validateTripRequest(await request.json());
    if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 });

    const convexSiteUrl = process.env.CONVEX_SITE_URL;
    const intakeSecret = process.env.WAYLUME_INTAKE_SECRET;
    if (!convexSiteUrl || !intakeSecret) return NextResponse.json({ error: "Trip request service is not configured" }, { status: 503 });

    const response = await fetch(`${convexSiteUrl}/trip-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-waylume-intake-secret": intakeSecret },
      body: JSON.stringify(validation.payload),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json({ error: data?.error ?? "Unable to save trip request" }, { status: response.status });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
