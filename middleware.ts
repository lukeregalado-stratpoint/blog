import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected =
    pathname === "/blog/new" || /^\/blog\/[^/]+\/edit$/.test(pathname);

  if (isProtected) {
    const authed = await isAuthenticated(request);
    if (!authed) {
      return NextResponse.rewrite(new URL("/404", request.url));
      // if not admin, return 404
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/new", "/blog/:slug/edit"],
};