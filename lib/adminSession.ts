import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "waylume_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

type SessionPayload = { exp: number };

function secret() {
  return process.env.WAYLUME_ADMIN_SESSION_SECRET || process.env.WAYLUME_ADMIN_TOKEN || "";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createAdminSessionToken() {
  if (!secret()) throw new Error("Admin session secret is not configured");
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS } satisfies SessionPayload)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token || !secret()) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    return typeof decoded.exp === "number" && decoded.exp > Date.now();
  } catch {
    return false;
  }
}
