import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { sendEmail, createCampaignEmailTemplate, isEmailConfigured } from "@/lib/email"
import { createUnsubscribeToken } from "@/lib/unsubscribe"

/** GET - Safe credential check (no values exposed). Use to verify .env.local is loaded and lengths are correct. */
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request)
  if (authError) return authError

  const id = process.env.AWS_ACCESS_KEY_ID ?? ""
  const secret = process.env.AWS_SECRET_ACCESS_KEY ?? ""
  const idLen = id.trim().length
  const secretLen = secret.trim().length
  const hasNewline = secret.includes("\n") || secret.includes("\r")
  return NextResponse.json({
    configured: isEmailConfigured,
    AWS_ACCESS_KEY_ID: { set: idLen > 0, length: idLen, expectedLength: 20 },
    AWS_SECRET_ACCESS_KEY: { set: secretLen > 0, length: secretLen, expectedLength: 40, hasNewlineOrCarriageReturn: hasNewline },
    AWS_REGION: process.env.AWS_REGION || "(default eu-west-1)",
    SES_FROM_EMAIL: process.env.SES_FROM_EMAIL ? "set" : "missing",
    hint: idLen !== 20 || secretLen !== 40 || hasNewline
      ? "Access key ID is usually 20 chars, secret 40. Remove any quotes or newlines from .env.local and restart the dev server."
      : "Lengths look correct. If send still fails, create a new access key in IAM and replace both values."
  })
}

/** POST - Send a single test email to verify SES (no DB or subscribers required). */
export async function POST(request: NextRequest) {
  const authError = await requireAuth(request)
  if (authError) return authError

  if (!isEmailConfigured) {
    return NextResponse.json(
      {
        error:
          "SES not configured. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and SES_FROM_EMAIL in .env. See SETUP.md.",
      },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const to = typeof body?.to === "string" ? body.to.trim() : ""
    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return NextResponse.json(
        { error: "Valid email address (to) is required" },
        { status: 400 }
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const token = await createUnsubscribeToken(to)
    const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${encodeURIComponent(token)}`
    let htmlContent = createCampaignEmailTemplate(
      "בדיקת חיבור",
      "<p>זהו מייל בדיקה מ־SES. אם קיבלת אותו – החיבור עובד.</p>",
      "לחזרה לאתר",
      siteUrl
    )
    htmlContent = htmlContent.replace(/\{\{unsubscribe_url\}\}/g, unsubscribeUrl)
    const result = await sendEmail({
      to,
      subject: "בדיקת חיבור SES – " + new Date().toLocaleDateString("he-IL"),
      htmlContent,
    })

    if (!result.success) {
      const hint =
        result.error?.includes("Invalid AWS credentials")
          ? " Check GET /api/admin/email/test for a credential diagnostic. Ensure .env.local has no quotes around values, no trailing newline in the secret, and you restarted the dev server."
          : ""
      return NextResponse.json(
        { error: (result.error || "Failed to send. In SES sandbox, the recipient email must be verified.") + hint },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, to })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send test email" },
      { status: 500 }
    )
  }
}
