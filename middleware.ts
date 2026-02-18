import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get("admin_token")?.value

  // /admin (exact or trailing slash) - require auth
  if (path === "/admin" || path === "/admin/") {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    const session = await verifyToken(token)
    if (!session) {
      const res = NextResponse.redirect(new URL("/admin/login", request.url))
      res.cookies.delete("admin_token")
      return res
    }
    return NextResponse.next()
  }

  // /admin/login - redirect to dashboard if already authenticated
  if (path === "/admin/login") {
    if (token) {
      const session = await verifyToken(token)
      if (session) {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/", "/admin/login"],
}
