import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl = process.env.CONVEX_SITE_URL;
  if (!siteUrl) return NextResponse.json({ promotions: [] }, { status: 200 });
  const response = await fetch(`${siteUrl}/promotions`, { cache: "no-store" });
  const data = await response.json().catch(() => ({ promotions: [] }));
  return NextResponse.json(data, { status: response.ok ? 200 : 502 });
}
