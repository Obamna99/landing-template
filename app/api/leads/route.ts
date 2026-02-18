import { NextRequest, NextResponse } from "next/server"
import { db, isDbConfigured } from "@/lib/db"
import { sendEmail, createLeadNotificationEmail, isEmailConfigured } from "@/lib/email"
import { siteConfig, emailConfig } from "@/lib/config"

// GET - Fetch all leads (admin only)
export async function GET() {
  try {
    if (!isDbConfigured) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const leads = await db.leads.getAll()
    return NextResponse.json(leads)
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    )
  }
}

// POST - Create a new lead (from contact form)
export async function POST(request: NextRequest) {
  try {
    if (!isDbConfigured) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.fullName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    // Create lead
    const lead = await db.leads.create({
      full_name: body.fullName,
      email: body.email,
      phone: body.phone,
      business_type: body.businessType,
      business_size: body.businessSize,
      urgency: body.urgency,
      message: body.message,
    })
    
    // Also create/update subscriber
    try {
      await db.subscribers.upsert({
        email: body.email,
        name: body.fullName,
        phone: body.phone,
        business_type: body.businessType,
        business_size: body.businessSize,
        source: "contact-form",
      })
    } catch {
      // Subscriber creation is optional
    }

    // Notify site contact email when SES is configured
    if (isEmailConfigured) {
      try {
        const notifyTo = siteConfig.contact.email
        const html = createLeadNotificationEmail({
          fullName: body.fullName,
          email: body.email,
          phone: body.phone,
          businessType: body.businessType,
          message: body.message,
        })
        await sendEmail({
          to: notifyTo,
          subject: emailConfig.templates.leadNotification.subject,
          htmlContent: html,
        })
      } catch {
        // Don't fail the request if notification email fails
      }
    }

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    )
  }
}
