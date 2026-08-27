import { NextResponse } from "next/server";

function authorized(request: Request) {
  const expected = process.env.WAYLUME_ADMIN_TOKEN;
  return Boolean(expected && request.headers.get("x-admin-token") === expected);
}

async function proxy(request: Request, method: "GET" | "POST") {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const siteUrl = process.env.CONVEX_SITE_URL;
  const token = process.env.WAYLUME_ADMIN_TOKEN;
  if (!siteUrl || !token) return NextResponse.json({ error: "Admin backend is not configured" }, { status: 503 });

  const response = await fetch(`${siteUrl}/admin/promotions`, {
    method,
    headers: { "Content-Type": "application/json", "x-admin-token": token },
    body: method === "POST" ? await request.text() : undefined,
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function GET(request: Request) { return proxy(request, "GET"); }
export async function POST(request: Request) { return proxy(request, "POST"); }
