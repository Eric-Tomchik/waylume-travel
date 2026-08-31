import { proxyAdmin } from "@/lib/adminProxy";
export async function POST(request: Request) { return proxyAdmin(request, "/admin/fora-deals/bulk", "POST"); }
