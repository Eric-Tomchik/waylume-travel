import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";

export function isAuthorized(request: Request) {
  return isAdminRequest(request);
}

export async function proxyAdmin(request: Request, path: string, method: "GET" | "POST" | "PATCH") {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const siteUrl = process.env.CONVEX_SITE_URL;
  const token = process.env.WAYLUME_ADMIN_TOKEN;
  if (!siteUrl || !token) return NextResponse.json({ error: "Admin backend is not configured" }, { status: 503 });

  const incoming = new URL(request.url);
  const target = new URL(`${siteUrl}${path}`);
  incoming.searchParams.forEach((value, key) => target.searchParams.set(key, value));

  const response = await fetch(target, {
    method,
    headers: { "Content-Type": "application/json", "x-admin-token": token },
    body: method === "GET" ? undefined : await request.text(),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
