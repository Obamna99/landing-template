#!/usr/bin/env node
/**
 * Submit a stock market investing course demo build via the same API as the build form.
 * Prints the preview URL so you can open it in the browser.
 *
 * Prerequisites: dev server running (npm run dev), database configured.
 * Run: node scripts/submit-investing-course-build.mjs
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";

// Stock market / finance / trading photos (Unsplash)
const PHOTOS = [
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
  "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
];

const sectionsJson = {
  header: {
    name: "משקיעים חכמים",
    logoText: "מ",
    tagline: "קורס השקעות בשוק ההון – מהמתחילים עד לעצמאות פיננסית",
    navLinks: [
      { id: "how-it-works", label: "איך הקורס עובד" },
      { id: "about", label: "על הקורס" },
      { id: "reviews", label: "ביקורות" },
      { id: "faq", label: "שאלות נפוצות" },
    ],
    ctaButton: "הרשמה לקורס",
    phone: "",
  },
  hero: {
    headlineLine1: "הקורס שמלמד אתכם",
    highlight: " להשיג עצמאות פיננסית",
    subheadline: "למדו לנתח מניות, לבנות תיק השקעות ולנהל סיכונים — מהבסיס ועד להשקעה הראשונה שלכם. ידע שמשרת אתכם לכל החיים.",
    ctaPrimaryText: "רוצים ללמוד להשקיע? הירשמו לקורס",
    ctaSecondaryText: "איך הקורס עובד?",
    ctaNote: "הרשמה ללא התחייבות • גישה מלאה לתוכן",
    trustText: "מצטרפים ל-500+ בוגרים שלמדו להשקיע בעצמם",
    features: [
      { title: "ניתוח מניות", description: "קריאת דוחות כספיים, הערכת שווי וזיהוי הזדמנויות", icon: "chart" },
      { title: "תיק השקעות", description: "בניית תיק מגוון, ניהול סיכונים והתאמה למטרות", icon: "shield" },
      { title: "עצמאות פיננסית", description: "כלים מעשיים להגדלת ההון לאורך שנים", icon: "trophy" },
    ],
  },
  about: {
    headline: "על הקורס",
    headlineHighlight: " משקיעים חכמים",
    subheadline: "קורס השקעות בשוק ההון למתחילים ומתקדמים. לומדים לנתח מניות, לבחור אגרות חוב, להבין אופציות ולבנות תיק השקעות מנוהל.",
    founder: {
      quote: "השקעה נכונה מתחילה בידע. הקורס נותן את הכלים להחליט בעצמכם.",
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
      name: "משקיעים חכמים",
      role: "קורס השקעות בשוק ההון",
      linkedin: "",
    },
    journeyTitle: "תוכנית הלימוד",
    timeline: [
      { year: "שבוע 1–2", text: "יסודות שוק ההון, מניות ואג\"ח" },
      { year: "שבוע 3–4", text: "ניתוח דוחות כספיים והערכת שווי" },
      { year: "שבוע 5–6", text: "בניית תיק והפחתת סיכונים" },
      { year: "שבוע 7–8", text: "אופציות, ETF ועצמאות פיננסית" },
    ],
    trustItems: [
      { title: "בוגרים", description: "מאות בוגרים שהחלו להשקיע.", stat: "500+", statLabel: "בוגרים", icon: "users" },
      { title: "שעות תוכן", description: "וידאו, תרגילים ומעקב.", stat: "24", statLabel: "שעות", icon: "clock" },
      { title: "תמיכה", description: "פורום וקבוצת וואטסאפ.", stat: "24/7", statLabel: "תמיכה", icon: "chat" },
    ],
    journeyCtaText: "מוכנים להתחיל להשקיע?",
    journeyCtaButton: "הרשמה לקורס",
  },
  features: [
    { title: "ניתוח מניות", description: "קריאת דוחות כספיים, הערכת שווי וזיהוי הזדמנויות", icon: "chart" },
    { title: "תיק השקעות", description: "בניית תיק מגוון, ניהול סיכונים והתאמה למטרות", icon: "shield" },
    { title: "עצמאות פיננסית", description: "כלים מעשיים להגדלת ההון לאורך שנים", icon: "trophy" },
  ],
  video: {
    videoId: "",
    customVideoUrl: "",
    badge: "מבוא חינם",
    headline: "למה להשקיע",
    headlineHighlight: " בשוק ההון?",
    subheadline: "צפו במבוא קצר על יתרונות ההשקעה לאורך זמן, ריבית דריבית והתאמת האסטרטגיה למטרות שלכם.",
    highlights: [
      { icon: "chart", text: "ניתוח" },
      { icon: "shield", text: "סיכון" },
      { icon: "trophy", text: "תשואה" },
    ],
    ctaText: "רוצים לצפות בכל הקורס?",
    ctaButton: "הרשמה",
  },
  faq: [
    {
      question: "האם צריך ידע מוקדם בהשקעות?",
      answer: "לא. הקורס מתאים למתחילים. מתחילים מיסודות שוק ההון ומתקדמים צעד־צעד לניתוח מניות ובניית תיק.",
    },
    {
      question: "כמה זמן נגיש הקורס?",
      answer: "לאחר ההרשמה יש גישה מלאה לתוכן לצפייה בכל עת. ניתן לחזור על השיעורים ולעדכן ידע.",
    },
    {
      question: "האם יש תמיכה במהלך הקורס?",
      answer: "כן. יש פורום שאלות, קבוצת וואטסאפ לבוגרים ומפגשי זום להעמקה ושאלות.",
    },
  ],
  howItWorks: {
    badge: "איך זה עובד",
    headline: "מהרשמה",
    headlineHighlight: " להשקעה ראשונה",
    subheadline: "ארבעה שלבים פשוטים: הרשמה, צפייה בשיעורים, תרגול במודל ויישום בתיק האמיתי שלכם.",
    steps: [
      { id: 1, title: "הרשמה והתחברות", description: "נרשמים לקורס ומקבלים גישה לפלטפורמה. כל החומרים זמינים מיד.", duration: "דקות", highlight: "מיידי", icon: "check" },
      { id: 2, title: "צפייה ולימוד", description: "צופים בשיעורים לפי הקצב שלכם. וידאו, מצגות ותרגילים מעשיים.", duration: "4–8 שבועות", highlight: "בקצב שלכם", icon: "play" },
      { id: 3, title: "תרגול במודל", description: "מתאמנים על ניתוח מניות ובניית תיק בסביבת סימולציה לפני השקעת כסף אמיתי.", duration: "1–2 שבועות", highlight: "ללא סיכון", icon: "chart" },
      { id: 4, title: "השקעה ראשונה", description: "מקבלים ליווי בבחירת ברוקר ובהשקעה הראשונה בתיק האמיתי שלכם.", duration: "תמיכה צמודה", highlight: "בטוח", icon: "trophy" },
    ],
    ctaText: "מוכנים להתחיל?",
    ctaHighlight: " הרשמה לקורס",
    ctaButton: "הרשמה",
    ctaButtonUrl: "#contact",
  },
  reviewsSection: {
    badge: "בוגרי הקורס",
    headline: "התוצאות",
    headlineHighlight: " מדברות",
    subheadline: "מאות משקיעים שהתחילו את הדרך אצלנו משתפים את החוויה ואת ההתקדמות שלהם.",
    stats: [
      { value: "500+", label: "בוגרים" },
      { value: "24", label: "שעות תוכן" },
      { value: "4.9", label: "דירוג ממוצע" },
    ],
    reviews: [],
  },
  caseStudy: {
    title: "סיפור הצלחה",
    company: "בוגר הקורס – תיק השקעות",
    industry: "השקעות בשוק ההון",
    challenge: "לא היה ניסיון בהשקעות ורציתי ללמוד לפני שמשקיע שקל.",
    solution: "הקורס נתן יסודות ברורים, תרגול במודל ואז התחלתי להשקיע בהדרגה. היום יש לי תיק מגוון שאני מנהל בעצמי.",
    quote: "הקורס שינה לי את החשיבה על כסף. למדתי לנתח מניות ולבנות תיק – והכל בקצב שלי.",
    author: "דוד, בוגר 2024",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    results: [
      { metric: "תיק פעיל", label: "מנוהל עצמאית" },
      { metric: "8 שבועות", label: "עד השקעה ראשונה" },
      { metric: "מגוון", label: "מניות + אג\"ח" },
    ],
    ctaText: "רוצים תוצאות דומות?",
  },
  footer: {
    phone: "03-1234567",
    email: "info@invest-smart.co.il",
    address: "משקיעים חכמים – קורס השקעות בשוק ההון",
    hoursWeekdays: "א'-ה': 09:00-18:00",
    hoursFriday: "ו': 09:00-13:00",
    quickLinks: [
      { label: "איך הקורס עובד", href: "#how-it-works" },
      { label: "על הקורס", href: "#about" },
      { label: "שאלות נפוצות", href: "#faq" },
      { label: "צור קשר", href: "#contact" },
    ],
    social: { facebook: "", instagram: "", linkedin: "", whatsapp: "" },
    termsUrl: "",
    privacyUrl: "",
    description: "קורס השקעות בשוק ההון למתחילים ומתקדמים. לומדים לנתח מניות, לבנות תיק ולנהל סיכונים – בדרך לעצמאות פיננסית.",
    copyright: "© {{year}} משקיעים חכמים. קורס השקעות בשוק ההון.",
  },
  theme: {
    primaryColor: "#1e40af",
    secondaryColor: "#0f766e",
    themeMode: "light",
  },
};

const body = {
  fullName: "Investing Course Demo",
  email: "demo-investing@example.com",
  phone: "0500000000",
  businessType: "education",
  businessSize: "small",
  urgency: "normal",
  message: "Demo – stock market investing course site",
  siteName: "משקיעים חכמים",
  siteDescription: "קורס השקעות בשוק ההון – מהמתחילים עד לעצמאות פיננסית",
  siteContent: "ניתוח מניות, תיק השקעות, ניהול סיכונים ועצמאות פיננסית.",
  photoUrls: PHOTOS,
  videoUrls: [],
  sectionsJson,
};

async function main() {
  console.log("Submitting investing course demo (build form payload) to", BASE + "/api/leads");
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
  console.log("\n✅ Investing course demo created.\n");
  console.log("Preview URL (open in browser):");
  console.log(previewUrl);
  console.log("\nOpen the URL above to see the stock market investing course site.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
