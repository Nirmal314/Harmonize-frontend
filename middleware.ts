import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.JWT_SECRET,
  });

  const { pathname } = request.nextUrl;

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  if (pathname !== "/login" && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
