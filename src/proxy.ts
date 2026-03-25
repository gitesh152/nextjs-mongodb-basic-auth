import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "./helpers/credential.helpers";

export default function proxy(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  const publicRoutes = ["/signup", "/login"];
  const protectedRoutes = ["/profile"];

  const isPublic = publicRoutes.some((route) => currentPath.startsWith(route));

  const isProtected = protectedRoutes.some((route) =>
    currentPath.startsWith(route),
  );

  const token = request.cookies.get("token")?.value;

  let decodedToken = null;

  if (token) {
    try {
      decodedToken = verifyJwtToken(token);
    } catch (error) {
      console.error("Invalid JWT token:", error);
      decodedToken = null;
    }
  }

  const url = request.nextUrl.clone();

  // 🚫 Logged-in user trying to access login/signup
  if (isPublic && decodedToken) {
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  // 🔒 Unauthenticated user trying to access protected route
  if (isProtected && !decodedToken) {
    url.pathname = "/login";
    url.searchParams.set("from", currentPath);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile/:path*", "/login", "/signup"],
};
