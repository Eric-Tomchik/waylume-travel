import { proxyAdmin } from "@/lib/adminProxy";
export async function GET(request: Request) { return proxyAdmin(request, "/admin/fora-deals", "GET"); }
export async function PATCH(request: Request) { return proxyAdmin(request, "/admin/fora-deals", "PATCH"); }
export async function POST(request: Request) { return proxyAdmin(request, "/admin/fora-deals/import", "POST"); }
