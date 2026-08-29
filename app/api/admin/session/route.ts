import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken, verifyAdminSessionToken } from "@/lib/adminSession";
import { allowRequest, requestFingerprint } from "@/lib/rateLimit";
import { verifyPasscode } from "@/lib/adminPasscode";
import { getConvexServerClient, adminSettingsGetCredential } from "@/lib/convexServer";

/** True when the advisor has set their own passcode in Settings and it matches. */
async function matchesStoredPasscode(supplied: string, adminSecret: string) {
  try {
    const credential = await getConvexServerClient().query(adminSettingsGetCredential, { adminSecret });
    if (!credential) return false;
    return await verifyPasscode(supplied, credential.hash, credential.salt);
  } catch {
    return false;
  }
}

function equalSecret(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function readCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") || "";
  return cookie.split(";").map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

export async function GET(request: Request) {
  return NextResponse.json({ authenticated: verifyAdminSessionToken(readCookie(request, ADMIN_SESSION_COOKIE)) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const rate = allowRequest(`admin-login:${requestFingerprint(request)}`, 5, 15 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: "Too many sign-in attempts. Try again later." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });

  const expected = process.env.WAYLUME_ADMIN_TOKEN;
  if (!expected) return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  const supplied = String(body.passcode || "");
  const authorized = Boolean(supplied) && (equalSecret(supplied, expected) || await matchesStoredPasscode(supplied, expected));
  if (!authorized) return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
