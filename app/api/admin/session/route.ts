import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value
  
  if (!token) {
    return NextResponse.json({ authenticated: false })
  }
  
  const session = await verifyToken(token)
  
  if (!session) {
    return NextResponse.json({ authenticated: false })
  }
  
  return NextResponse.json({
    authenticated: true,
    username: session.username,
  })
}
