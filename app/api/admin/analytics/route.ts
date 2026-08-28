import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getConvexServerClient, analyticsSummary } from "@/lib/convexServer";

export async function GET(request: Request) {
  const adminSecret = process.env.WAYLUME_ADMIN_TOKEN;
  if (!adminSecret || !isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const days = Math.max(1, Math.min(Number(new URL(request.url).searchParams.get("days") || 30), 365));
  try {
    const client = getConvexServerClient();
    const summary = await client.query(analyticsSummary, { adminSecret, days });
    return NextResponse.json(summary, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to load analytics" }, { status: 400 });
  }
}
