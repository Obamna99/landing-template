import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { sql } from "./db"
import { createLogger } from "./logger"

const logger = createLogger("Auth")

export interface User {
  id: number
  email: string
  role: "admin" | "candidate"
  created_at: string
}

export interface Session {
  userId: number
  email: string
  role: "admin" | "candidate"
}

const SESSION_COOKIE_NAME = "session"
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  logger.debug("Hashing password")
  return bcrypt.hash(password, 10)
}

// Verify password using bcrypt
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  logger.debug("Verifying password")
  const isValid = await bcrypt.compare(password, hash)
  logger.debug(`Password verification ${isValid ? "succeeded" : "failed"}`)
  return isValid
}

// Create session
export async function createSession(user: User): Promise<void> {
  const session: Session = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  })
  
  logger.auth("Session created", {
    userId: user.id,
    email: user.email,
    role: user.role,
  })
}

// Get current session
export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

    if (!sessionCookie?.value) {
      return null
    }

    const session = JSON.parse(sessionCookie.value) as Session
    return session
  } catch {
    return null
  }
}

// Delete session
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  logger.auth("Session deleted")
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  if (!session) return null

  try {
    const result = await sql`
      SELECT id, email, role, created_at
      FROM users
      WHERE id = ${session.userId}
      LIMIT 1
    `

    if (result.length === 0) {
      logger.debug("Current user not found in database", { userId: session.userId })
      return null
    }
    
    const user = result[0] as User
    logger.debug("Current user fetched successfully", { userId: user.id, email: user.email, role: user.role })
    return user
  } catch (error) {
    logger.error("Error fetching current user", error, { userId: session.userId })
    return null
  }
}

// Require authentication
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    logger.warn("Authentication required but user not found")
    throw new Error("Unauthorized")
  }
  return user
}

// Require admin role
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== "admin") {
    logger.warn("Admin access required but user is not admin", {
      userId: user.id,
      email: user.email,
      role: user.role,
    })
    throw new Error("Forbidden: Admin access required")
  }
  logger.admin("Admin access granted", { userId: user.id, email: user.email })
  return user
}
