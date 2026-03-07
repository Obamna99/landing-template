import { NextRequest, NextResponse } from "next/server"

const COOKIE_NAME = "client_build_token"
const COOKIE_VALUE = "1" // Presence indicates validated client

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = typeof body.token === "string" ? body.token.trim() : ""
    const expected = process.env.BUILD_CLIENT_TOKEN?.trim()

    if (!expected) {
      return NextResponse.json(
        { error: "Client access is not configured (missing BUILD_CLIENT_TOKEN)" },
        { status: 503 }
      )
    }

    if (!token || token !== expected) {
      return NextResponse.json({ error: "הקוד שגוי" }, { status: 401 })
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/build",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return res
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
