/** Section IDs used for admin-controlled visibility. Must match app/page.tsx SectionWrapper sectionId. */
export const SECTION_IDS = [
  "hero",
  "trust",
  "video",
  "how-it-works",
  "about",
  "transformation",
  "reviews",
  "faq",
  "contact",
] as const

export type SectionId = (typeof SECTION_IDS)[number]

/** Extra landing options stored in the same visibility blob (admin toggles). */
export const LANDING_OPTION_KEYS = ["floatingCta", "progressiveReveal"] as const

export const SECTION_LABELS: Record<SectionId, string> = {
  hero: "היירו",
  trust: "אמון",
  video: "וידאו",
  "how-it-works": "איך זה עובד",
  about: "אודות",
  transformation: "טרנספורמציה",
  reviews: "ביקורות",
  faq: "שאלות נפוצות",
  contact: "יצירת קשר",
}

export function defaultSectionVisibility(): Record<string, boolean> {
  const acc = SECTION_IDS.reduce(
    (a, id) => {
      a[id] = true
      return a
    },
    {} as Record<string, boolean>
  )
  acc.floatingCta = false
  acc.progressiveReveal = false
  return acc
}
