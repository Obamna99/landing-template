import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-jwt-secret-key-min-32-chars-long-here"
)

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export interface AdminSession {
  username: string
  exp: number
}

// Validate admin credentials
export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

// Create JWT token
export async function createToken(username: string): Promise<string> {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)
  
  return token
}

// Verify JWT token
export async function verifyToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as AdminSession
  } catch {
    return null
  }
}

// Get session from cookies
export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value
  
  if (!token) return null
  
  return verifyToken(token)
}

// Check if user is authenticated (for use in server components)
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

// Middleware helper for API routes
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get("admin_token")?.value
  
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  
  const session = await verifyToken(token)
  
  if (!session) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    )
  }
  
  return null // Continue to handler
}
