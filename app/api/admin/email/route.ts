import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { sendBulkEmail, createCampaignEmailTemplate } from "@/lib/email"
import { db, isSupabaseConfigured } from "@/lib/supabase"

// GET - Get subscribers count and stats
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request)
  if (authError) return authError
  
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const [totalSubscribers, activeSubscribers, recentCampaigns] = await Promise.all([
      db.subscribers.count(),
      db.subscribers.count("active"),
      db.emailCampaigns.getRecent(5),
    ])
    
    return NextResponse.json({
      totalSubscribers,
      activeSubscribers,
      recentCampaigns,
    })
  } catch (error) {
    console.error("Error fetching email stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}

// POST - Send email campaign
export async function POST(request: NextRequest) {
  const authError = await requireAuth(request)
  if (authError) return authError
  
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { subject, title, content, ctaText, ctaUrl } = body
    
    if (!subject || !title || !content) {
      return NextResponse.json(
        { error: "Subject, title, and content are required" },
        { status: 400 }
      )
    }
    
    // Get active subscribers
    const subscribers = await db.subscribers.getActive()
    
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: "No active subscribers found" },
        { status: 400 }
      )
    }
    
    // Create email HTML
    const htmlContent = createCampaignEmailTemplate(title, content, ctaText, ctaUrl)
    
    // Send emails - map null names to undefined for type compatibility
    const mappedSubscribers = subscribers.map(s => ({
      email: s.email,
      name: s.name ?? undefined,
    }))
    const { success, failed } = await sendBulkEmail(mappedSubscribers, subject, htmlContent)
    
    // Log campaign
    await db.emailCampaigns.create({
      subject,
      content: htmlContent,
      recipient_count: subscribers.length,
      status: failed === 0 ? "sent" : "sent",
    })
    
    return NextResponse.json({
      success: true,
      sent: success,
      failed,
      total: subscribers.length,
    })
  } catch (error) {
    console.error("Error sending campaign:", error)
    return NextResponse.json(
      { error: "Failed to send campaign" },
      { status: 500 }
    )
  }
}
