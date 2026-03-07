import { LandingWithReveal } from "@/components/landing/landing-with-reveal"
import { LandingWidgets } from "@/components/landing/landing-widgets"
import { db, isDbConfigured } from "@/lib/db"
import { defaultSectionVisibility } from "@/lib/sections"

async function getSectionVisibility(): Promise<Record<string, boolean>> {
  const defaults = defaultSectionVisibility()
  if (!isDbConfigured) return defaults
  try {
    const stored = await db.settings.getSectionVisibility()
    return { ...defaults, ...(stored || {}) }
  } catch {
    return defaults
  }
}

export default async function LandingPage() {
  const visibility = await getSectionVisibility()
  return (
    <>
      <LandingWithReveal visibility={visibility} />
      <LandingWidgets />
    </>
  )
}
