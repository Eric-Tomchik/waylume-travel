import { NextResponse } from "next/server";

/** Public feed of advisor-approved Fora deals. Only published deals are returned. */
export async function GET(request: Request) {
  const siteUrl = process.env.CONVEX_SITE_URL;
  if (!siteUrl) return NextResponse.json({ deals: [] }, { status: 200 });
  const limit = new URL(request.url).searchParams.get("limit") || "60";
  const response = await fetch(`${siteUrl}/fora-deals?limit=${encodeURIComponent(limit)}`, { cache: "no-store" });
  const data = await response.json().catch(() => ({ deals: [] }));
  return NextResponse.json(data, { status: response.ok ? 200 : 502 });
}
