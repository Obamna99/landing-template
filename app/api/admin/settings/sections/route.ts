import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db, isDbConfigured } from "@/lib/db"
import { defaultSectionVisibility, SECTION_IDS } from "@/lib/sections"

/** Protected: get section visibility (same shape as public). */
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request)
  if (authError) return authError
  const defaults = defaultSectionVisibility()
  if (!isDbConfigured) {
    return NextResponse.json(defaults)
  }
  try {
    const stored = await db.settings.getSectionVisibility()
    const visibility = { ...defaults, ...(stored || {}) }
    return NextResponse.json(visibility)
  } catch (error) {
    console.error("Error fetching section visibility:", error)
    return NextResponse.json(defaults)
  }
}

/** Protected: update section visibility. Body: { [sectionId]: boolean, ... } */
export async function PATCH(request: NextRequest) {
  const authError = await requireAuth(request)
  if (authError) return authError
  if (!isDbConfigured) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    )
  }
  try {
    const body = await request.json()
    const current = (await db.settings.getSectionVisibility()) || defaultSectionVisibility()
    const visibility: Record<string, boolean> = { ...current }
    for (const id of SECTION_IDS) {
      if (typeof body[id] === "boolean") {
        visibility[id] = body[id]
      }
    }
    await db.settings.updateSectionVisibility(visibility)
    return NextResponse.json(visibility)
  } catch (error) {
    console.error("Error updating section visibility:", error)
    return NextResponse.json(
      { error: "Failed to update section visibility" },
      { status: 500 }
    )
  }
}
