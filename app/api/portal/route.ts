import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { getConvexServerClient, portalResolveAccess } from "@/lib/convexServer";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token || token.length < 32) return NextResponse.json({ error: "Invalid access link" }, { status: 400 });
  try {
    const client = getConvexServerClient();
    const portal = await client.query(portalResolveAccess, { tokenHash: hashToken(token) });
    if (!portal) return NextResponse.json({ error: "This access link is invalid or expired" }, { status: 401 });
    return NextResponse.json({ portal }, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Traveler portal is unavailable" }, { status: 503 });
  }
}
