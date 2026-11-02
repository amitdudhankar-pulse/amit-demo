// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";
// import { Paths } from "./contants";

// export function middleware(request: NextRequest) {
//   const params = new URLSearchParams(request.url);
//   // console.log(params.entries);
//   return NextResponse.redirect(
//     Paths.Frontend.HOME.href + "/" + (params.get("redirect") ?? "")
//   );
// }

// export const config = {
//   matcher: "/login",
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Paths } from "./contants";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  /**
   * 1️⃣ Handle Google OAuth callback landing on frontend
   * Directus already created session at this point
   */
  if (pathname.startsWith("/auth/login/google/callback")) {
    return NextResponse.redirect(
      new URL(Paths.Frontend.HOME.href, request.url)
    );
  }

  /**
   * 2️⃣ Handle your existing /login?redirect=...
   */
  if (pathname === "/login") {
    const redirectTo = searchParams.get("redirect") ?? "";
    return NextResponse.redirect(
      new URL(`${Paths.Frontend.HOME.href}/${redirectTo}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/auth/login/google/callback"],
};
