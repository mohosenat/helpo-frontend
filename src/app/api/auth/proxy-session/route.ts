import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

const authURL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5000";

const JWKS = createRemoteJWKSet(new URL("/api/auth/jwks", authURL));

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 401 },
      );
    }

    const { payload } = await jwtVerify(token, JWKS);

    if (!payload.email || !payload.exp) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const maxAge = payload.exp - Math.floor(Date.now() / 1000);

    if (maxAge <= 0) {
      return NextResponse.json({ message: "Token expired" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("helpo-auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return response;
  } catch (error) {
    console.error("Proxy session error:", error);

    return NextResponse.json(
      { message: "Session verification failed" },
      { status: 401 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("helpo-auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
