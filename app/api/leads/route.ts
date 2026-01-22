import { NextRequest, NextResponse } from "next/server"
import { db, isSupabaseConfigured } from "@/lib/supabase"

// Lazy load Prisma only if needed
let prisma: any = null
async function getPrisma() {
  if (!prisma) {
    const { default: prismaClient } = await import("@/lib/db")
    prisma = prismaClient
  }
  return prisma
}

// GET - Fetch all leads (admin only)
export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const leads = await db.leads.getAll()
      return NextResponse.json(leads)
    } else {
      // Fallback to Prisma
      const prismaClient = await getPrisma()
      const leads = await prismaClient.lead.findMany({
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(leads)
    }
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
    const body = await request.json()
    
    // Validate required fields
    if (!body.fullName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    if (isSupabaseConfigured) {
      // Use Supabase
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
      
      return NextResponse.json(lead, { status: 201 })
    } else {
      // Fallback to Prisma
      const prismaClient = await getPrisma()
      
      const lead = await prismaClient.lead.create({
        data: {
          fullName: body.fullName,
          email: body.email,
          phone: body.phone,
          businessType: body.businessType,
          businessSize: body.businessSize,
          urgency: body.urgency,
          message: body.message,
        },
      })
      
      // Optionally also create a subscriber
      try {
        await prismaClient.subscriber.upsert({
          where: { email: body.email },
          update: {
            name: body.fullName,
            phone: body.phone,
            businessType: body.businessType,
            businessSize: body.businessSize,
          },
          create: {
            email: body.email,
            name: body.fullName,
            phone: body.phone,
            businessType: body.businessType,
            businessSize: body.businessSize,
            source: "contact-form",
          },
        })
      } catch {
        // Subscriber creation is optional
      }
      
      return NextResponse.json(lead, { status: 201 })
    }
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    )
  }
}
