import { proxyAdmin } from "@/lib/adminProxy";
export async function GET(request: Request) { return proxyAdmin(request, "/admin/quotes", "GET"); }
export async function POST(request: Request) { return proxyAdmin(request, "/admin/quotes", "POST"); }
export async function PATCH(request: Request) { return proxyAdmin(request, "/admin/quotes", "PATCH"); }
