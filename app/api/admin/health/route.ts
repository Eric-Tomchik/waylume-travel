import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const expected = process.env.WAYLUME_ADMIN_TOKEN;
  if (!expected || request.headers.get("x-admin-token") !== expected) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    web: true,
    convexConfigured: Boolean(process.env.CONVEX_SITE_URL),
    adminTokenConfigured: Boolean(process.env.WAYLUME_ADMIN_TOKEN),
  });
}
