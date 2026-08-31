import { proxyAdmin } from "@/lib/adminProxy";

export async function GET(request: Request) { return proxyAdmin(request, "/admin/fora-policies", "GET"); }
export async function PATCH(request: Request) { return proxyAdmin(request, "/admin/fora-policies", "PATCH"); }
export async function POST(request: Request) { return proxyAdmin(request, "/admin/fora-policies/import", "POST"); }
