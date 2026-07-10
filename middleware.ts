import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/blog/new")) {
    const authed = await isAuthenticated();
    if (!authed) {
      // 404 instead of redirect, so the route's existence isn't revealed
      return NextResponse.rewrite(new URL("/404", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/new"],
};