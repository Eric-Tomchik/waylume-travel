import { NextRequest, NextResponse } from "next/server";

/**
 * The apex domain and www both resolved with 200s, so Google saw two copies of
 * every page. Everything is canonicalised on www.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  if (host === "waylumetravel.com") {
    const url = new URL(request.url);
    url.host = "www.waylumetravel.com";
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|svg|ico|txt|xml)$).*)"],
};
