import { proxyAdmin } from "@/lib/adminProxy";
export async function GET(request: Request) { return proxyAdmin(request, "/admin/dashboard", "GET"); }
