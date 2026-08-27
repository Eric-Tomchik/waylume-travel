import { NextResponse } from "next/server";
import { allowRequest, requestFingerprint } from "@/lib/rateLimit";
import { validateTripRequest } from "@/lib/tripRequestValidation";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 32768) return NextResponse.json({ error: "Request too large" }, { status: 413 });

  const configuredOrigin = process.env.WAYLUME_SITE_ORIGIN;
  const origin = request.headers.get("origin");
  if (configuredOrigin && origin && origin !== configuredOrigin) return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });

  const rate = allowRequest(requestFingerprint(request));
  if (!rate.allowed) return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });

  try {
    const validation = validateTripRequest(await request.json());
    if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 });

    const convexSiteUrl = process.env.CONVEX_SITE_URL;
    if (!convexSiteUrl) return NextResponse.json({ error: "Trip request service is not configured" }, { status: 503 });

    const response = await fetch(`${convexSiteUrl}/trip-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
