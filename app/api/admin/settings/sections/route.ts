import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db, isDbConfigured } from "@/lib/db"
import { defaultSectionVisibility, SECTION_IDS } from "@/lib/sections"

/** In-memory section visibility when DB is not configured (session-only). */
let memorySectionVisibility: Record<string, boolean> | null = null

/** Protected: get section visibility (same shape as public). */
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request)
  if (authError) return authError
  const defaults = defaultSectionVisibility()
  if (!isDbConfigured) {
    const visibility = memorySectionVisibility ?? defaults
    return NextResponse.json(visibility)
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
  const defaults = defaultSectionVisibility()
  if (!isDbConfigured) {
    try {
      const body = await request.json()
      const current = memorySectionVisibility ?? defaults
      const visibility: Record<string, boolean> = { ...current }
      for (const id of SECTION_IDS) {
        if (typeof body[id] === "boolean") {
          visibility[id] = body[id]
        }
      }
      memorySectionVisibility = visibility
      return NextResponse.json(visibility)
    } catch (error) {
      console.error("Error updating section visibility (memory):", error)
      return NextResponse.json(defaults)
    }
  }
  try {
    const body = await request.json()
    const current = (await db.settings.getSectionVisibility()) || defaults
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
