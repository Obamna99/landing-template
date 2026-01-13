import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET - Fetch all leads (admin only)
export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    })
    
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
    const body = await request.json()
    
    // Validate required fields
    if (!body.fullName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    const lead = await prisma.lead.create({
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
      await prisma.subscriber.upsert({
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
      // Subscriber creation is optional, don't fail the lead
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
