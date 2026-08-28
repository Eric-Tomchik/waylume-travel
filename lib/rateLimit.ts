type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();
let calls = 0;

function pruneExpired(now: number) {
  calls += 1;
  if (calls % 100 !== 0 && buckets.size < 1000) return;
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
  if (buckets.size > 5000) buckets.clear();
}

export function allowRequest(key: string, limit = 6, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  pruneExpired(now);
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
