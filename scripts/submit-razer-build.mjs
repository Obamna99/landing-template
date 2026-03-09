#!/usr/bin/env node
/**
 * Submit a Razer (gaming company) demo build via the same API as the build form.
 * Prints the preview URL so you can open it in the browser.
 *
 * Prerequisites: dev server running (npm run dev), database configured.
 * Run: node scripts/submit-razer-build.mjs
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";

const PHOTOS = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
  "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
];

const sectionsJson = {
  header: {
    name: "Razer",
    logoText: "R",
    tagline: "For Gamers. By Gamers.",
    navLinks: [
      { id: "how-it-works", label: "איך זה עובד" },
      { id: "about", label: "המוצרים" },
      { id: "reviews", label: "ביקורות" },
      { id: "faq", label: "שאלות נפוצות" },
    ],
    ctaButton: "לחנות",
    phone: "",
  },
  hero: {
    headlineLine1: "ביצועים",
    highlight: " לגיימרים",
    subheadline: "מקלדות, עכברים, אוזניות ומערכות RGB — הציוד שמביא את הניצחון. Razer — For Gamers. By Gamers.",
    features: [
      { title: "RGB Chroma", description: "מיליוני צבעים, סנכרון עם כל המערכת", icon: "star" },
      { title: "ביצועים", description: "חיישנים מדויקים, זמן תגובה מינימלי", icon: "lightning" },
      { title: "ניצחון", description: "הציוד שמשנה את המשחק", icon: "trophy" },
    ],
  },
  about: {
    headline: "על Razer",
    headlineHighlight: " — For Gamers. By Gamers.",
    subheadline: "Razer מייצרת ציוד גיימינג מוביל: מקלדות מכניות, עכברים קלים, אוזניות עם אודיו מדויק ומערכות תאורת Chroma RGB. כל מוצר מעוצב לניצחון.",
    founder: {
      quote: "We are the leading brand for gamers. Every product is built to win.",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80",
      name: "Razer",
      role: "Gaming Peripherals & Hardware",
      linkedin: "",
    },
    journeyTitle: "הדרך שלנו",
    timeline: [
      { year: "2005", text: "נוסדה בסן דייגו, קליפורניה" },
      { year: "2010", text: "השקת Razer BlackWidow ומקלדות מכניות" },
      { year: "היום", text: "מובילים בשוק הציוד לגיימרים" },
      { year: "עתיד", text: "חומרה, תוכנה וקהילה גלובלית" },
    ],
    trustItems: [
      { title: "מוצרים", description: "מקלדות, עכברים, אוזניות ועוד.", stat: "100+", statLabel: "מוצרים", icon: "package" },
      { title: "גיימרים", description: "מיליוני גיימרים ברחבי העולם.", stat: "M+", statLabel: "גיימרים", icon: "users" },
      { title: "Chroma", description: "תאורת RGB מתקדמת בכל מוצר.", stat: "16.8M", statLabel: "צבעים", icon: "star" },
    ],
    journeyCtaText: "מוכנים לשדרג את המשחק?",
    journeyCtaButton: "לחנות",
  },
  features: [
    { title: "RGB Chroma", description: "מיליוני צבעים, סנכרון עם כל המערכת", icon: "star" },
    { title: "ביצועים", description: "חיישנים מדויקים, זמן תגובה מינימלי", icon: "lightning" },
    { title: "ניצחון", description: "הציוד שמשנה את המשחק", icon: "trophy" },
  ],
  video: {
    videoId: "",
    customVideoUrl: "",
    badge: "Razer Chroma",
    headline: "תאורה",
    headlineHighlight: " שמשנה את החדר",
    subheadline: "16.8 מיליון צבעים, סנכרון עם משחקים ואפליקציות. Chroma RGB — זה לא רק אור, זה חוויית גיימינג.",
    highlights: [
      { icon: "star", text: "Chroma RGB" },
      { icon: "lightning", text: "ביצועים" },
      { icon: "shield", text: "אמין" },
    ],
    ctaText: "גלו את כל הצבעים",
    ctaButton: "לחנות",
  },
  faq: [
    {
      question: "מה זה Razer Chroma?",
      answer: "Chroma היא מערכת תאורת RGB של Razer — מיליוני צבעים, סנכרון בין מקלדת, עכבר, אוזניות ומשטח, ואינטגרציה עם משחקים ואפליקציות.",
    },
    {
      question: "אילו מוצרים יש ל-Razer?",
      answer: "מקלדות מכניות (BlackWidow, Huntsman), עכברים (DeathAdder, Viper), אוזניות (Kraken, BlackShark), משטחים, webcams ועוד. כולם עם Chroma RGB.",
    },
    {
      question: "איפה קונים מוצרי Razer?",
      answer: "באתר הרשמי של Razer, בחנויות אלקטרוניקה ובשותפים מורשים. משלוחים לישראל זמינים.",
    },
  ],
  howItWorks: {
    badge: "איך בוחרים ציוד",
    headline: "ממשחק casual",
    headlineHighlight: " לפרו",
    subheadline: "ארבעה צעדים לבחירת הציוד הנכון — מקלדת, עכבר, אוזניות ומשטח. Razer מתאימה לכל סגנון משחק.",
    steps: [
      { id: 1, title: "בחרו מקלדת", description: "מכנית או membrana, עם או בלי NumPad. Razer BlackWidow ו-Huntsman מובילות בשוק.", duration: "דקות", highlight: "מקלדת", icon: "keyboard" },
      { id: 2, title: "בחרו עכבר", description: "קל, מדויק, עם חיישן 20K DPI. DeathAdder, Viper ו-Basilisk — לכל יד ולכל משחק.", duration: "דקות", highlight: "עכבר", icon: "target" },
      { id: 3, title: "הוסיפו אוזניות", description: "אודיו 7.1, מיקרופון ברור, נוחות לשעות. Kraken ו-BlackShark נבחרות על ידי גיימרים.", duration: "דקות", highlight: "אוזניות", icon: "headphones" },
      { id: 4, title: "הדליקו Chroma", description: "סנכרנו את כל הציוד עם תאורת RGB — צבע אחד או אפקטים דינמיים לפי משחק.", duration: "מיידי", highlight: "RGB", icon: "star" },
    ],
    ctaText: "רוצים להתחיל?",
    ctaHighlight: " לחנות",
    ctaButton: "לחנות",
    ctaButtonUrl: "https://www.razer.com",
  },
  reviewsSection: {
    badge: "גיימרים על Razer",
    headline: "הציוד",
    headlineHighlight: " שמנצח",
    subheadline: "מיליוני גיימרים בוחרים ב-Razer — ביצועים, אמינות ותאורת Chroma שמשנה את החדר.",
    stats: [
      { value: "100+", label: "מוצרים" },
      { value: "M+", label: "גיימרים" },
      { value: "16.8M", label: "צבעי Chroma" },
    ],
    reviews: [],
  },
  caseStudy: {
    title: "הישג לדוגמה",
    company: "Razer BlackWidow V4",
    industry: "מקלדות מכניות",
    challenge: "גיימרים מחפשים מקלדת מכנית מהירה, אמינה ועם RGB מלא.",
    solution: "BlackWidow V4 — מפתחות אופטיים, Chroma RGB, גוף אלומיניום וסנכרון עם Razer Synapse.",
    quote: "המקלדת הזו שינתה את המשחק. התגובה מיידית, ה-RGB מהמם, והאיכות מרגישה פרימיום.",
    author: "גיימר פרו, ישראל",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop",
    results: [
      { metric: "0.2ms", label: "זמן תגובה" },
      { metric: "Chroma", label: "RGB מלא" },
      { metric: "2Y", label: "אחריות" },
    ],
    ctaText: "רוצים מקלדת כזו?",
  },
  footer: {
    phone: "",
    email: "support@razer.com",
    address: "Razer Inc. — For Gamers. By Gamers.",
    hoursWeekdays: "א'-ה': 09:00-18:00",
    hoursFriday: "ו': 09:00-13:00",
    quickLinks: [
      { label: "איך זה עובד", href: "#how-it-works" },
      { label: "המוצרים", href: "#about" },
      { label: "שאלות נפוצות", href: "#faq" },
      { label: "צור קשר", href: "#contact" },
    ],
    social: { facebook: "https://facebook.com/razer", instagram: "https://instagram.com/razer", linkedin: "https://linkedin.com/company/razer", whatsapp: "" },
    termsUrl: "https://www.razer.com/legal",
    privacyUrl: "https://www.razer.com/privacy-policy",
    description: "Razer — ציוד גיימינג מוביל. מקלדות, עכברים, אוזניות, Chroma RGB. For Gamers. By Gamers.",
    copyright: "© {{year}} Razer Inc. Demo site.",
  },
  theme: {
    primaryColor: "#00FF41",
    secondaryColor: "#0d0d0d",
    themeMode: "dark",
  },
};

const body = {
  fullName: "Razer Demo",
  email: "demo-razer@example.com",
  phone: "0500000000",
  businessType: "gaming",
  businessSize: "large",
  urgency: "normal",
  message: "Demo – Razer gaming company site",
  siteName: "Razer",
  siteDescription: "For Gamers. By Gamers.",
  siteContent: "מקלדות, עכברים, אוזניות ו-Chroma RGB.",
  photoUrls: PHOTOS,
  videoUrls: [],
  sectionsJson,
};

async function main() {
  console.log("Submitting Razer gaming demo (build form payload) to", BASE + "/api/leads");
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
  console.log("\n✅ Razer demo created.\n");
  console.log("Preview URL (open in browser):");
  console.log(previewUrl);
  console.log("\nOpen the URL above to see the Razer gaming company demo.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
