import { NextResponse } from "next/server"

const COOKIE_NAME = "client_build_token"

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.set("client_build_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/build",
    maxAge: 0,
  })
  return res
}
