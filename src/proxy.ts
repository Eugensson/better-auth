import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const protectedRoutes = ["/profile", "/admin/dashboard"];

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = !!session;
  const isOnProtectedRoute = protectedRoutes.includes(request.nextUrl.pathname);
  const isOnAuthRoute = request.nextUrl.pathname.startsWith("/auth");

  if (isOnProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isOnAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}
