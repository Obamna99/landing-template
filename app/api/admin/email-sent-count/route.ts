import { NextResponse } from "next/server"
import { getEmailSentCountForCurrentMonth } from "@/lib/email-sent-count"

/** GET - Emails sent this month (resets every month). Used on admin login and dashboard. */
export async function GET() {
  try {
    const { count, month } = await getEmailSentCountForCurrentMonth()
    return NextResponse.json({ count, month })
  } catch (error) {
    console.error("Error reading email sent count:", error)
    return NextResponse.json({ count: 0, month: new Date().toISOString().slice(0, 7) })
  }
}
