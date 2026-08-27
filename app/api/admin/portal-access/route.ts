import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { getConvexServerClient, portalCreateAccess, portalListAccess, portalRevokeAccess } from "@/lib/convexServer";

function adminSecretFor(request: Request) {
  const expected = process.env.WAYLUME_ADMIN_TOKEN;
  return expected && request.headers.get("x-admin-token") === expected ? expected : null;
}

function makeToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: createHash("sha256").update(token).digest("hex") };
}

export async function GET(request: Request) {
  const adminSecret = adminSecretFor(request);
  if (!adminSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const requestId = new URL(request.url).searchParams.get("requestId");
  if (!requestId) return NextResponse.json({ error: "requestId is required" }, { status: 400 });
  try {
    const client = getConvexServerClient();
    const access = await client.query(portalListAccess, { adminSecret, travelRequestId: requestId });
    return NextResponse.json({ access }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to load portal access" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const adminSecret = adminSecretFor(request);
  if (!adminSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (!body.email || !body.travelRequestId) return NextResponse.json({ error: "Email and travelRequestId are required" }, { status: 400 });
    const { token, tokenHash } = makeToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const client = getConvexServerClient();
    await client.mutation(portalCreateAccess, { adminSecret, email: String(body.email).trim().toLowerCase(), travelRequestId: String(body.travelRequestId), tokenHash, expiresAt });
    if (body.revokeAccessId) await client.mutation(portalRevokeAccess, { adminSecret, id: String(body.revokeAccessId) });
    return NextResponse.json({ portalPath: `/portal?token=${encodeURIComponent(token)}`, expiresAt }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to create traveler access link" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const adminSecret = adminSecretFor(request);
  if (!adminSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "Portal access id is required" }, { status: 400 });
    const client = getConvexServerClient();
    await client.mutation(portalRevokeAccess, { adminSecret, id: String(body.id) });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to revoke portal access" }, { status: 400 });
  }
}
