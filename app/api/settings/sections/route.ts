import { NextResponse } from "next/server"
import { db, isDbConfigured } from "@/lib/db"
import { defaultSectionVisibility } from "@/lib/sections"

/** Public: get section visibility for the landing page. Returns all true if DB not configured. */
export async function GET() {
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
