import { NextResponse } from "next/server";

export function middleware(request) {
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    .trim();
  const hostname = (forwardedHost || request.headers.get("host"))?.split(":")[0];

  if (hostname?.startsWith("www.") || request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    if (hostname?.startsWith("www.")) {
      url.hostname = hostname.slice(4);
    }
    if (url.pathname === "/") {
      url.pathname = "/home";
    }
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};