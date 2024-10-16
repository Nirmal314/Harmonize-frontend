import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.JWT_SECRET,
  });

  console.log("[middleware] token: ", token);

  const { pathname } = request.nextUrl;

  if (pathname === "/" && token) {
    // console.log("[middleware] pathname = '/'");
    // console.log("[middleware] token found.");
    // console.log("redirecting to /playlists instead of /");

    return NextResponse.redirect(new URL("/playlists", request.url));
  }

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  if (pathname !== "/" && !token) {
    // console.log(`[middleware] pathname = ${pathname}`);
    // console.log("[middleware] token not found.");
    // console.log(`redirecting to / instead of ${pathname}`);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
