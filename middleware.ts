import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Always allow NextAuth routes and signup API
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAdminPath = pathname.startsWith("/admin");
  const isTeacherPath = pathname.startsWith("/teacher");
  const isStudentPath = pathname.startsWith("/student");

  // Redirect unauthenticated users trying to access protected routes
  if ((isAdminPath || isTeacherPath || isStudentPath) && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Role-based access control
  if (token) {
    const role = token.role as string;

    // Admin routes - only admin can access
    if (isAdminPath && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Teacher routes - only teachers can access
    if (isTeacherPath && role !== "TEACHER") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Student routes - only students can access
    if (isStudentPath && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/api/:path*",
  ],
};
