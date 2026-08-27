import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { getConvexServerClient, portalCreateAccess } from "@/lib/convexServer";

export async function POST(request: Request) {
  const adminSecret = process.env.WAYLUME_ADMIN_TOKEN;
  if (!adminSecret || request.headers.get("x-admin-token") !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body.email || !body.travelRequestId) {
      return NextResponse.json({ error: "Email and travelRequestId are required" }, { status: 400 });
    }
    const token = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const client = getConvexServerClient();
    await client.mutation(portalCreateAccess, {
      adminSecret,
      email: String(body.email).trim().toLowerCase(),
      travelRequestId: String(body.travelRequestId),
      tokenHash,
      expiresAt,
    });
    return NextResponse.json({ portalPath: `/portal?token=${encodeURIComponent(token)}`, expiresAt }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to create traveler access link" }, { status: 400 });
  }
}
