#!/usr/bin/env node
/**
 * Submit a Japanese volleyball team demo build via the same API as the build form.
 * Prints the preview URL so you can open it in the browser.
 *
 * Prerequisites: dev server running (npm run dev), database configured.
 * Run: node scripts/submit-japan-volleyball-build.mjs
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";

const PHOTOS = [
  "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80",
  "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800&q=80",
  "https://images.unsplash.com/photo-1592659762305-9510a2d8c2c0?w=800&q=80",
];

const sectionsJson = {
  header: {
    name: "נבחרת יפן בכדורעף",
    logoText: "日",
    tagline: "גאים לייצג את יפן על המגרש",
    navLinks: [
      { id: "how-it-works", label: "איך זה עובד" },
      { id: "about", label: "הנבחרת" },
      { id: "reviews", label: "הישגים" },
      { id: "faq", label: "שאלות נפוצות" },
    ],
    ctaButton: "עקבו אחרינו",
    phone: "",
  },
  hero: {
    headlineLine1: "נבחרת יפן",
    highlight: "בכדורעף",
    subheadline: "נבחרת הכדורעף של יפן — מהירות, טכניקה ועבודה צוותית. אחת הנבחרות החזקות בעולם.",
    features: [
      { title: "מהירות", description: "סגנון משחק מהיר ואינטנסיבי אופייני ליפן", icon: "lightning" },
      { title: "טכניקה", description: "מעברים מדויקים והגנה מעולה", icon: "star" },
      { title: "עבודה צוותית", description: "כימיה ורוח קבוצה ברמה הגבוהה ביותר", icon: "users" },
    ],
  },
  about: {
    headline: "על הנבחרת",
    headlineHighlight: " היפנית",
    subheadline: "נבחרת יפן בכדורעף הגברים והנשים מייצגת מסורת של מצוינות. מדליות אולימפיות, אליפויות אסיה ומשחק תמידי שמכבד את היריב.",
    founder: {
      quote: "We play for Japan. Every point is for our country and our fans.",
      imageUrl: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=400&q=80",
      name: "נבחרת יפן",
      role: "נבחרת לאומית בכדורעף",
      linkedin: "",
    },
    journeyTitle: "הדרך שלנו",
    timeline: [
      { year: "1964", text: "כדורעף נכנס לאולימפיאדת טוקיו" },
      { year: "1972", text: "מדליית זהב אולימפית לנבחרת הגברים" },
      { year: "היום", text: "מתמודדים בצמרת העולמית" },
      { year: "עתיד", text: "פריז 2024 ומעבר" },
    ],
    trustItems: [
      { title: "אולימפיאדה", description: "הופעות ומדליות במשחקים האולימפיים.", stat: "10+", statLabel: "אולימפיאדות", icon: "trophy" },
      { title: "אסיה", description: "אלופי אסיה ומדליות באליפות.", stat: "זהב", statLabel: "אסיה", icon: "flag" },
      { title: "עולם", description: "דירוג גבוה בדירוג FIVB העולמי.", stat: "Top 5", statLabel: "עולם", icon: "chart" },
    ],
    journeyCtaText: "רוצים לעקוב אחרי הנבחרת?",
    journeyCtaButton: "לוח משחקים",
  },
  features: [
    { title: "מהירות", description: "סגנון משחק מהיר ואינטנסיבי אופייני ליפן", icon: "lightning" },
    { title: "טכניקה", description: "מעברים מדויקים והגנה מעולה", icon: "star" },
    { title: "עבודה צוותית", description: "כימיה ורוח קבוצה ברמה הגבוהה ביותר", icon: "users" },
  ],
  video: {
    videoId: "",
    customVideoUrl: "",
    badge: "צפו בנבחרת",
    headline: "נבחרת יפן",
    headlineHighlight: " בפעולה",
    subheadline: "היכונו למהירות, לטכניקה ולרוח הקבוצה של נבחרת יפן בכדורעף.",
    highlights: [
      { icon: "lightning", text: "מהיר" },
      { icon: "shield", text: "הגנה" },
      { icon: "users", text: "צוות" },
    ],
    ctaText: "עקבו אחרי כל משחק",
    ctaButton: "לוח משחקים",
  },
  faq: [
    {
      question: "מתי נוסדה נבחרת יפן בכדורעף?",
      answer: "הנבחרת היפנית משתתפת בתחרויות בינלאומיות מזה עשרות שנים וזכתה במדליות אולימפיות ובאליפויות אסיה.",
    },
    {
      question: "מה הישגי הנבחרת?",
      answer: "מדליית זהב אולימפית (1972), מדליות באליפויות העולם ואליפויות אסיה, ודירוג קבוע בצמרת הדירוג העולמי.",
    },
    {
      question: "איפה אפשר לראות משחקים?",
      answer: "המשחקים משודרים בטלוויזיה וברשת. עקבו בדף הרשמי ללוח משחקים ועדכונים.",
    },
  ],
  howItWorks: {
    badge: "הדרך שלנו",
    headline: "מאימון",
    headlineHighlight: " למשחק",
    subheadline: "ארבעה שלבים בדרך להצלחה של נבחרת יפן בכדורעף.",
    steps: [
      { id: 1, title: "אימון יומי", description: "אימונים ממוקדים בטכניקה, מהירות ועבודה צוותית. ההכנה המנטלית והפיזית היא הבסיס.", duration: "3–4 שעות", highlight: "בסיס", icon: "chat" },
      { id: 2, title: "ניתוח יריבים", description: "צפייה בסרטונים, תכנון taktics והתאמת הקבוצה ליריב. כל משחק דורש הכנה ייחודית.", duration: "1–2 ימים", highlight: "טקטיקה", icon: "clipboard" },
      { id: 3, title: "משחק", description: "היציאה למגרש עם ריכוז מלא. עבודת צוות, תקשורת ורוח לחימה עד לצפצוף האחרון.", duration: "2–3 שעות", highlight: "משחק", icon: "lightning" },
      { id: 4, title: "ניתוח וחזרה", description: "סקירת המשחק, למידה והכנה למשחק הבא. שיפור מתמיד ושאיפה לצמרת.", duration: "מיידי", highlight: null, icon: "chart" },
    ],
    ctaText: "רוצים לעקוב?",
    ctaHighlight: " לוח משחקים",
    ctaButton: "לוח משחקים",
    ctaButtonUrl: "https://www.jva.or.jp/en/",
  },
  caseStudy: {
    title: "הישג לדוגמה",
    company: "נבחרת יפן בכדורעף",
    industry: "כדורעף בינלאומי",
    challenge: "החזרת הנבחרת לצמרת העולמית אחרי שנים קשות.",
    solution: "אימונים ממוקדים, סגנון משחק מהיר וטכניקה יפנית.",
    quote: "הנבחרת הוכיחה שהיא יכולה להתמודד עם הטובות בעולם. הגענו להישגים יפים.",
    author: "התאחדות הכדורעף היפנית",
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=400&fit=crop",
    results: [
      { metric: "Top 5", label: "דירוג עולם" },
      { metric: "זהב", label: "אסיה" },
      { metric: "10+", label: "אולימפיאדות" },
    ],
    ctaText: "רוצים לראות משחק?",
  },
  footer: {
    phone: "",
    email: "volleyball@japan.sport",
    address: "Japan Volleyball Association",
    hoursWeekdays: "א'-ה': 09:00-18:00",
    hoursFriday: "ו': 09:00-13:00",
    quickLinks: [
      { label: "איך זה עובד", href: "#how-it-works" },
      { label: "הנבחרת", href: "#about" },
      { label: "שאלות נפוצות", href: "#faq" },
      { label: "צור קשר", href: "#contact" },
    ],
    social: { facebook: "", instagram: "", linkedin: "", whatsapp: "" },
    termsUrl: "",
    privacyUrl: "",
    description: "נבחרת יפן בכדורעף — גאים לייצג את יפן על המגרש.",
    copyright: "© {{year}} Japan Volleyball. Demo site.",
  },
  theme: {
    primaryColor: "#bc002d",
    secondaryColor: "#1e293b",
    themeMode: "light",
  },
};

const body = {
  fullName: "Japan Volleyball Demo",
  email: "demo-japan-volleyball@example.com",
  phone: "0500000000",
  businessType: "sports",
  businessSize: "large",
  urgency: "normal",
  message: "Demo – Japanese volleyball team site",
  siteName: "נבחרת יפן בכדורעף",
  siteDescription: "גאים לייצג את יפן על המגרש",
  siteContent: "נבחרת הכדורעף של יפן — מהירות, טכניקה ועבודה צוותית.",
  photoUrls: PHOTOS,
  videoUrls: [],
  sectionsJson,
};

async function main() {
  console.log("Submitting Japanese volleyball demo (build form payload) to", BASE + "/api/leads");
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
  console.log("\n✅ Demo created.\n");
  console.log("Preview URL (open in browser):");
  console.log(previewUrl);
  console.log("\nOpen the URL above to see the Japanese volleyball team demo.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
