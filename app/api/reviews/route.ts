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

// GET - Fetch all active reviews
export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const reviews = await db.reviews.getActive()
      
      // Transform Supabase snake_case to camelCase for frontend compatibility
      const transformedReviews = reviews?.map((review: any) => ({
        id: review.id,
        name: review.name,
        role: review.role,
        company: review.company,
        content: review.content,
        rating: review.rating,
        imageUrl: review.image_url,
        result: review.result,
        resultLabel: review.result_label,
        featured: review.featured,
        verified: review.verified,
        active: review.active,
        order: review.display_order,
        createdAt: review.created_at,
        updatedAt: review.updated_at,
      })) || []
      
      return NextResponse.json(transformedReviews)
    } else {
      // Fallback to Prisma
      const prismaClient = await getPrisma()
      const reviews = await prismaClient.review.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      })
      
      return NextResponse.json(reviews)
    }
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
    
    // Validate required fields
    if (!body.name || !body.content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 }
      )
    }
    
    if (isSupabaseConfigured) {
      const review = await db.reviews.create({
        name: body.name,
        role: body.role,
        company: body.company,
        content: body.content,
        rating: body.rating || 5,
        image_url: body.imageUrl,
        result: body.result,
        result_label: body.resultLabel,
        featured: body.featured || false,
        verified: body.verified ?? true,
        active: body.active ?? true,
        display_order: body.order || 0,
      })
      
      return NextResponse.json(review, { status: 201 })
    } else {
      // Fallback to Prisma
      const prismaClient = await getPrisma()
      
      const review = await prismaClient.review.create({
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
    }
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    )
  }
}
