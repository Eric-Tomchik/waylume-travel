type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export function allowRequest(key: string, limit = 6, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (existing.count >= limit) return { allowed: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function requestFingerprint(request: Request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
