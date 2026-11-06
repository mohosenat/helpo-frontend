import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

const authURL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5000";

const JWKS = createRemoteJWKSet(new URL("/api/auth/jwks", authURL));

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("helpo-auth")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, JWKS);

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy authentication failed:", error);

    const response = NextResponse.redirect(new URL("/login", request.url));

    response.cookies.delete("helpo-auth");

    return response;
  }
}

export const config = {
  matcher: [
    "/dashboard/create/:path*",
    "/dashboard/joined",
    "/dashboard/manage",
    "/dashboard/profile",
    "/events/:id",
  ],
};
