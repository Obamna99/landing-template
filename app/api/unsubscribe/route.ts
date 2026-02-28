import { NextRequest, NextResponse } from "next/server"
import { db, isDbConfigured } from "@/lib/db"
import { verifyUnsubscribeToken } from "@/lib/unsubscribe"

/** GET - One-click unsubscribe via token (from email link) */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")
  if (token) {
    if (!isDbConfigured) {
      return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 })
    }
    const email = await verifyUnsubscribeToken(token)
    if (!email) {
      return NextResponse.json({ ok: false, error: "Invalid or expired link" }, { status: 400 })
    }
    try {
      await db.subscribers.unsubscribeByEmail(email)
      await db.leads.updateStatusByEmail(email, "unsubscribed")
      return NextResponse.json({ ok: true, email })
    } catch (e) {
      console.error("Unsubscribe error:", e)
      return NextResponse.json({ ok: false, error: "Failed to unsubscribe" }, { status: 500 })
    }
  }
  return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 })
}

/** POST - Unsubscribe by email (form submission when no token) */
export async function POST(request: NextRequest) {
  if (!isDbConfigured) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 })
  }
  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 })
  }
  const email = typeof body?.email === "string" ? body.email.trim() : ""
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Valid email required" }, { status: 400 })
  }
  try {
    await db.subscribers.unsubscribeByEmail(email)
    await db.leads.updateStatusByEmail(email, "unsubscribed")
    return NextResponse.json({ ok: true, email })
  } catch (e) {
    console.error("Unsubscribe error:", e)
    return NextResponse.json({ ok: false, error: "Failed to unsubscribe" }, { status: 500 })
  }
}
