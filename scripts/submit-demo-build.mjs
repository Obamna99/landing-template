#!/usr/bin/env node
/**
 * Submit SPORTS demo build-form data via POST /api/leads.
 * Server must be running. Result: lead id + preview URL.
 * All sections filled with sports-only content; different colors; no email/landing template copy.
 */
import { config } from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, "..", ".env.local") })

const BASE = process.env.SITE_URL?.replace(/\/$/, "") || "http://localhost:3000"

const sportsDemoPayload = {
  fullName: "ספורט דמו",
  email: "sports@example.com",
  phone: "0509876543",
  businessType: "small",
  businessSize: "1-10",
  urgency: "soon",
  message: "בקשה לתצוגת דמו – אתר ספורט.",
  siteName: "ספורט פלוס",
  siteDescription: "אתר מועדון ספורט, אימונים ופעילות גופנית.",
  siteContent: "תוכן אתר: אימונים, לוח זמנים, הרשמה לחוגים.",
  photoUrls: [],
  videoUrls: [],
  sectionsJson: {
    site: {
      tagline: "מועדון ספורט ואימונים – כושר לכולם",
    },
    header: {
      navLinks: [
        { id: "about", label: "אודות" },
        { id: "video", label: "סרטון" },
        { id: "faq", label: "שאלות" },
      ],
      ctaButton: "הרשמו לאימון ניסיון",
    },
    hero: {
      headlineLine1: "המועדון שמביא לכם",
      highlight: "כושר, אימונים, בריאות",
      subheadline: "הצטרפו למועדון הספורט המוביל. אימונים בקבוצות קטנות, מאמנים מקצועיים ומתקנים מעולים.",
      ctaPrimaryText: "הרשמו לאימון ניסיון",
      ctaSecondaryText: "לוח זמנים",
      trustText: "מעל 500 מתאמנים פעילים במועדון",
      valueCardTitle: "מה תקבלו?",
      valueCardHighlight: " אימון שמתאים לכם.",
      features: [
        { title: "אימונים בקבוצות", description: "אימוני כוח, יוגה, פילטיס וספינינג." },
        { title: "מאמנים מוסמכים", description: "ליווי אישי ותוכניות אימון מותאמות." },
        { title: "מתקנים חדשים", description: "ציוד מתקדם ואווירה נעימה." },
      ],
    },
    about: {
      headline: "קצת על המועדון",
      headlineHighlight: "ספורט פלוס",
      subheadline: "מזה עשור אנחנו מביאים כושר ובריאות לקהילה. הצוות שלנו מומחה באימונים אישיים וקבוצתיים.",
      founder: {
        quote: "הספורט שינה את החיים שלי – ואני כאן כדי לעזור לכם להשיג את המטרות שלכם.",
        imageUrl: "",
        name: "דני כהן",
        role: "מנהל המועדון",
        linkedin: "",
      },
    },
    video: {
      videoId: "",
      customVideoUrl: "",
      badge: "סרטון המועדון",
      headline: "רואים את המתקנים",
      headlineHighlight: " ואת האווירה",
      subheadline: "סיור וירטואלי במועדון – מתקנים, אימונים וצוות.",
      highlights: [
        { icon: "🏋️", text: "אולם כושר" },
        { icon: "🧘", text: "חוגי יוגה ופילטיס" },
        { icon: "⏱️", text: "שעות גמישות" },
      ],
    },
    faq: {
      questions: [
        { question: "איך מתחילים?", answer: "פשוט הירשמו לאימון ניסיון חינם. נקבע פגישה ונבנה יחד תוכנית מתאימה." },
        { question: "מה שעות הפעילות?", answer: "א'-ה' 06:00–23:00, ו' 06:00–14:00, שבת סגור." },
        { question: "יש חוגים לילדים?", answer: "כן – אימוני כושר לילדים, שחייה ואומנויות לחימה." },
      ],
      badge: "שאלות נפוצות",
      headline: "יש שאלות?",
      headlineHighlight: " הנה התשובות.",
      subheadline: "כל מה שצריך לדעת על המועדון וההרשמה",
      ctaText: "לא מצאתם תשובה? צרו קשר",
      ctaButton: "שלחו הודעה",
    },
    features: [
      { title: "אימונים בקבוצות", description: "אימוני כוח, יוגה, פילטיס וספינינג." },
      { title: "מאמנים מוסמכים", description: "ליווי אישי ותוכניות אימון מותאמות." },
      { title: "מתקנים חדשים", description: "ציוד מתקדם ואווירה נעימה." },
    ],
    footer: {
      phone: "0509876543",
      email: "sports@example.com",
      address: "רחוב הספורט 15, תל אביב",
      hoursWeekdays: "א'-ה': 06:00-23:00",
      hoursFriday: "ו': 06:00-14:00",
      quickLinks: [
        { label: "לוח זמנים", href: "#schedule" },
        { label: "אודות", href: "#about" },
      ],
      social: { facebook: "", instagram: "", linkedin: "", whatsapp: "" },
      termsUrl: "",
      privacyUrl: "",
      description: "מועדון ספורט פלוס – כושר, אימונים ובריאות.",
      copyright: "© ספורט פלוס",
    },
    journeyNotes: "דמו אתר ספורט – כל השדות מולאו.",
    theme: {
      primaryColor: "#15803d",
      secondaryColor: "#2563eb",
      themeMode: "light",
    },
  },
}

async function main() {
  console.log("Submitting SPORTS demo build to", BASE + "/api/leads")
  const res = await fetch(`${BASE}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sportsDemoPayload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`POST /api/leads failed: ${res.status} ${text}`)
  }
  const lead = await res.json()
  const id = lead.id ?? lead.lead_id
  console.log("\n--- Sports demo submission done ---")
  console.log("Lead ID:", id)
  console.log("Preview URL:", id ? `${BASE}/preview/${id}` : "(no id)")
  console.log("\nOpen in browser:", id ? `${BASE}/preview/${id}` : "N/A")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
