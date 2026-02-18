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
  return SECTION_IDS.reduce(
    (acc, id) => {
      acc[id] = true
      return acc
    },
    {} as Record<string, boolean>
  )
}
