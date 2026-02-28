import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-jwt-secret-key-min-32-chars-long-here"
)

const UNSUB_EXPIRY = "30d"

export async function createUnsubscribeToken(email: string): Promise<string> {
  return new SignJWT({ email: email.trim().toLowerCase(), purpose: "unsubscribe" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(UNSUB_EXPIRY)
    .sign(JWT_SECRET)
}

export async function verifyUnsubscribeToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (payload.purpose !== "unsubscribe" || typeof payload.email !== "string") return null
    return payload.email
  } catch {
    return null
  }
}
