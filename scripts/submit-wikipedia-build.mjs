#!/usr/bin/env node
/**
 * Submit a Wikipedia-themed build to the leads API and print the preview URL.
 *
 * Prerequisites:
 * - Dev server running: npm run dev (or pnpm dev)
 * - Database configured (Supabase or Neon) so /preview/[id] can load the lead
 *
 * Run: node scripts/submit-wikipedia-build.mjs
 * Or: BASE_URL=https://your-domain.com node scripts/submit-wikipedia-build.mjs
 *
 * Uses free Unsplash images. For custom content (e.g. MCPS), edit the payload below.
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";

// Free-to-use Unsplash URLs (Wikipedia / knowledge / books theme)
const WIKIPEDIA_PHOTOS = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80", // books
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80", // library
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80", // books
];

const sectionsJson = {
  header: {
    name: "Wikipedia",
    logoText: "W",
    tagline: "האנציקלופדיה החופשית",
    navLinks: [
      { id: "how-it-works", label: "איך זה עובד" },
      { id: "about", label: "למה אנחנו" },
      { id: "reviews", label: "לקוחות" },
      { id: "faq", label: "שאלות נפוצות" },
    ],
    ctaButton: "תרמו לוויקיפדיה",
    phone: "02-1234567",
  },
  hero: {
    headlineLine1: "Wikipedia",
    highlight: "ידע חופשי לכולם",
    subheadline: "מיזם רב-לשוני לחיבור אנציקלופדיה חופשית, פתוחה ומשותפת. כולם יכולים לערוך.",
    features: [
      { title: "תוכן חופשי", description: "מיליוני ערכים במאות שפות, נגישים לכולם" },
      { title: "עריכה שיתופית", description: "כל אחד יכול לתרום ולהוסיף ידע" },
      { title: "מקור אמין", description: "מבוסס מקורות, שקוף ופתוח" },
    ],
  },
  about: {
    headline: "על ויקיפדיה",
    headlineHighlight: " והמיזם",
    subheadline: "ויקיפדיה היא אנציקלופדיה חופשית שנבנית ומתוחזקת על ידי מתנדבים מכל העולם.",
    founder: {
      quote: "Imagine a world in which every single person on the planet is given free access to the sum of all human knowledge.",
      imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80",
      name: "ג'ימי ויילס",
      role: "מייסד ויקיפדיה",
      linkedin: "",
    },
    journeyTitle: "המסע שלנו",
    timeline: [
      { year: "2001", text: "השקת ויקיפדיה באנגלית" },
      { year: "2003", text: "ויקיפדיה העברית עלתה לאוויר" },
      { year: "היום", text: "מיליוני ערכים, מאות שפות" },
      { year: "עתיד", text: "ידע חופשי נגיש לכל אדם" },
    ],
    trustItems: [
      { title: "ערכים", description: "מיליוני ערכים חופשיים.", stat: "60M+", statLabel: "ערכים", icon: "badge" },
      { title: "שפות", description: "זמין במאות שפות.", stat: "300+", statLabel: "שפות", icon: "chart" },
      { title: "מתנדבים", description: "נבנה על ידי קהילה גלובלית.", stat: "100%", statLabel: "חינם", icon: "user" },
    ],
    journeyCtaText: "רוצים לתרום לוויקיפדיה?",
    journeyCtaButton: "התחילו לערוך",
  },
  features: [
    { title: "תוכן חופשי", description: "מיליוני ערכים במאות שפות, נגישים לכולם" },
    { title: "עריכה שיתופית", description: "כל אחד יכול לתרום ולהוסיף ידע" },
    { title: "מקור אמין", description: "מבוסס מקורות, שקוף ופתוח" },
  ],
  video: {
    videoId: "",
    customVideoUrl: "",
    badge: "צפו בסרטון",
    headline: "איך ויקיפדיה עובדת",
    headlineHighlight: " מאחורי הקלעים",
    subheadline: "מיליוני עורכים מתנדבים בונים את מקור הידע החופשי הגדול בעולם.",
    highlights: [
      { icon: "✏️", text: "עריכה קלה" },
      { icon: "🌍", text: "רב-לשוני" },
      { icon: "📚", text: "ידע חופשי" },
    ],
    ctaText: "רוצים לתרום?",
    ctaButton: "הצטרפו אלינו",
  },
  faq: [
    {
      question: "מהי ויקיפדיה?",
      answer: "ויקיפדיה היא אנציקלופדיה חופשית באינטרנט, שנכתבת ומתוחזקת על ידי מתנדבים מכל העולם.",
    },
    {
      question: "האם אפשר לערוך ערכים?",
      answer: "כן. כל אחד יכול ליצור חשבון ולערוך ערכים, בהתאם לכללי האתר ומדיניות התוכן.",
    },
    {
      question: "איך ויקיפדיה ממומנת?",
      answer: "ויקיפדיה ממומנת בתרומות מהציבור ובמענקים. אין פרסומות.",
    },
  ],
  caseStudy: {
    title: "מיזם לדוגמה",
    company: "ויקיפדיה העברית",
    industry: "אנציקלופדיה חופשית",
    challenge: "צורך במקור מידע חופשי, נגיש ומהימן בשפה העברית.",
    solution: "אנציקלופדיה שיתופית שמתעדכנת על ידי קהילת מתנדבים.",
    quote: "ויקיפדיה שינתה את הדרך שבה אנשים מחפשים מידע. ידע חופשי לכולם.",
    author: "קהילת ויקיפדיה",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
    results: [
      { metric: "60M+", label: "ערכים" },
      { metric: "300+", label: "שפות" },
      { metric: "100%", label: "חינם" },
    ],
    ctaText: "רוצים לתרום?",
  },
  footer: {
    phone: "02-1234567",
    email: "contact@wikipedia.org",
    address: "ויקימדיה ישראל",
    hoursWeekdays: "א'-ה': 09:00-18:00",
    hoursFriday: "ו': 09:00-13:00",
    quickLinks: [
      { label: "איך זה עובד", href: "#how-it-works" },
      { label: "למה אנחנו", href: "#about" },
      { label: "שאלות נפוצות", href: "#faq" },
      { label: "צור קשר", href: "#contact" },
    ],
    social: { facebook: "", instagram: "", linkedin: "", whatsapp: "" },
    termsUrl: "https://foundation.wikimedia.org/wiki/Terms_of_Use",
    privacyUrl: "https://foundation.wikimedia.org/wiki/Privacy_policy",
    description: "האנציקלופדיה החופשית שנבנית על ידי כולם.",
    copyright: "© {{year}} Wikimedia. תוכן תחת רישיון CC BY-SA.",
  },
  theme: {
    primaryColor: "#0d9488",
    secondaryColor: "#f59e0b",
    themeMode: "light",
  },
};

const body = {
  fullName: "Wikipedia Build Test",
  email: "test-wikipedia@example.com",
  phone: "0500000000",
  businessType: "education",
  businessSize: "large",
  urgency: "normal",
  message: "Build test – Wikipedia theme",
  siteName: "Wikipedia",
  siteDescription: "האנציקלופדיה החופשית",
  siteContent: "מיזם רב-לשוני לחיבור אנציקלופדיה חופשית.",
  photoUrls: WIKIPEDIA_PHOTOS,
  videoUrls: [],
  sectionsJson,
};

async function main() {
  console.log("Submitting Wikipedia build to", BASE + "/api/leads");
  const res = await fetch(BASE + "/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Error:", res.status, err);
    process.exit(1);
  }

  const lead = await res.json();
  const id = lead.id;
  if (!id) {
    console.error("No lead id in response:", lead);
    process.exit(1);
  }

  const previewUrl = `${BASE}/preview/${id}`;
  console.log("\nPreview URL (open in browser):");
  console.log(previewUrl);
  console.log("\nCopy the URL above to inspect the result and say what to change.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
