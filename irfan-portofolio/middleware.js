import { NextResponse } from "next/server";

export function middleware(request) {
  const hostname = request.headers.get("host")?.split(":")[0];

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