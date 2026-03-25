import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "./helpers/credential.helpers";

export default function proxy(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  const publicRoutes = ["/signup", "/login"];
  const protectedRoutes = ["/profile"];

  const isPublic = publicRoutes.includes(currentPath);
  const isProtected = protectedRoutes.some((route) =>
    currentPath.startsWith(route),
  );

  const token = request.cookies.get("token")?.value || "";

  let decodedToken = null;

  try {
    decodedToken = verifyJwtToken(token);
  } catch (error) {
    decodedToken = null;
  }

  const url = request.nextUrl.clone();

  if (isPublic && decodedToken) {
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  if (isProtected && !decodedToken) {
    url.pathname = "/login";
    url.searchParams.set("from", currentPath);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile/:path", "/login", "/signup"],
};
