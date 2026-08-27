import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/adminSession";

function cookieValue(request: Request, name: string) {
  const cookie = request.headers.get("cookie") || "";
  return cookie.split(";").map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

export function isAdminRequest(request: Request) {
  const expected = process.env.WAYLUME_ADMIN_TOKEN;
  const headerAuthorized = Boolean(expected && request.headers.get("x-admin-token") === expected);
  if (headerAuthorized) return true;
  return verifyAdminSessionToken(cookieValue(request, ADMIN_SESSION_COOKIE));
}
