import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";

function authorized(request: Request) {
  // Accepts either the x-admin-token header or a signed advisor session cookie.
  return isAdminRequest(request);
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const siteUrl = process.env.CONVEX_SITE_URL;
  const token = process.env.WAYLUME_ADMIN_TOKEN;
  if (!siteUrl || !token) return NextResponse.json({ error: "Admin backend is not configured" }, { status: 503 });

  const response = await fetch(`${siteUrl}/admin/leads`, { headers: { "x-admin-token": token }, cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function PATCH(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const siteUrl = process.env.CONVEX_SITE_URL;
  const token = process.env.WAYLUME_ADMIN_TOKEN;
  if (!siteUrl || !token) return NextResponse.json({ error: "Admin backend is not configured" }, { status: 503 });

  const body = await request.text();
  const response = await fetch(`${siteUrl}/admin/leads`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "x-admin-token": token },
    body,
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const siteUrl = process.env.CONVEX_SITE_URL;
  const token = process.env.WAYLUME_ADMIN_TOKEN;
  if (!siteUrl || !token) return NextResponse.json({ error: "Admin backend is not configured" }, { status: 503 });

  const body = await request.text();
  const response = await fetch(`${siteUrl}/admin/leads`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", "x-admin-token": token },
    body,
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
