import { proxyAdmin } from "@/lib/adminProxy";
export async function GET(request: Request) { return proxyAdmin(request, "/admin/suppliers", "GET"); }
export async function POST(request: Request) { return proxyAdmin(request, "/admin/suppliers", "POST"); }
