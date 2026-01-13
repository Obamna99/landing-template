import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET - Fetch reviews (use ?all=true for admin to see inactive reviews)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")
    const all = searchParams.get("all") === "true" // Include inactive reviews
    
    const reviews = await prisma.review.findMany({
      where: {
        // Only filter by active if not requesting all
        ...(!all && { active: true }),
        ...(featured === "true" && { featured: true }),
      },
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
      ...(limit && { take: parseInt(limit) }),
    })
    
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}

// POST - Create a new review (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const review = await prisma.review.create({
      data: {
        name: body.name,
        role: body.role,
        company: body.company,
        content: body.content,
        rating: body.rating || 5,
        imageUrl: body.imageUrl,
        result: body.result,
        resultLabel: body.resultLabel,
        featured: body.featured || false,
        verified: body.verified ?? true,
        active: body.active ?? true,
        order: body.order || 0,
      },
    })
    
    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    )
  }
}
