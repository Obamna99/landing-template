/**
 * ========================================
 * SITE CONFIGURATION
 * ========================================
 * 
 * This is the central configuration file for the entire website.
 * Modify these values to customize the site for different clients.
 * No need to edit individual components - all text comes from here.
 * 
 * 🎯 TEMPLATE READY - Replace placeholder values with client data
 */

export const siteConfig = {
  // ========================================
  // BASIC INFO - Update for each client
  // ========================================
  name: "Starter",
  tagline: "Launch Your Business Forward",
  description: "We help ambitious businesses grow faster with data-driven strategies, cutting-edge technology, and proven results. Transform your vision into measurable success.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://starter.agency",
  locale: "he",
  direction: "rtl" as const,
  
  // ========================================
  // CONTACT INFO
  // ========================================
  contact: {
    phone: "03-123-4567",
    email: "hello@starter.agency",
    address: "מגדל אלקטרה, רחוב יגאל אלון 98, תל אביב",
    whatsapp: "972312345678",
  },
  
  // ========================================
  // SOCIAL LINKS
  // ========================================
  social: {
    facebook: "https://facebook.com/starteragency",
    instagram: "https://instagram.com/starteragency",
    linkedin: "https://linkedin.com/company/starteragency",
    twitter: "https://twitter.com/starteragency",
  },
  
  // ========================================
  // BRANDING
  // ========================================
  branding: {
    logo: "/logo.svg",
    logoText: "S",
    primaryColor: "teal",
    accentColor: "amber",
  },
  
  // ========================================
  // STATS / SOCIAL PROOF NUMBERS
  // ========================================
  stats: {
    clients: "200+",
    clientsLabel: "לקוחות פעילים",
    years: "8",
    yearsLabel: "שנות מומחיות",
    satisfaction: "97%",
    satisfactionLabel: "שיעור שימור",
    support: "24/7",
    supportLabel: "תמיכה",
  },
}

// ========================================
// HERO SECTION
// ========================================
export const heroConfig = {
  badge: "הפלטפורמה לצמיחה עסקית",
  headline: {
    line1: "הפכו את החזון שלכם",
    highlight: "לתוצאות מדידות",
  },
  subheadline: "אנחנו מלווים עסקים שאפתניים מהרעיון ועד להצלחה מוכחת—עם אסטרטגיה חכמה, ביצוע מדויק ותוצאות שמדברות בעד עצמן.",
  cta: {
    primary: {
      text: "קבלו הצעה מותאמת",
      href: "#contact",
    },
    secondary: {
      text: "איך זה עובד?",
      href: "#how-it-works",
    },
  },
  trustText: "מצטרפים ל-200+ עסקים שכבר צומחים",
}

// ========================================
// HOW IT WORKS SECTION
// ========================================
export const howItWorksConfig = {
  badge: "התהליך שלנו",
  headline: "מסלול ברור",
  headlineHighlight: " להצלחה",
  subheadline: "ארבעה שלבים מובנים שלוקחים אתכם מהמצב הנוכחי לתוצאות שרציתם",
  ctaText: "התייעצות ראשונית",
  ctaHighlight: " ללא עלות",
  ctaButton: "קבעו שיחת היכרות",
  steps: [
    {
      id: 1,
      title: "שיחת אבחון",
      description: "פגישה ממוקדת להבנת העסק, האתגרים והמטרות. נבנה תמונת מצב ברורה.",
      duration: "30 דק'",
      highlight: "חינם",
      icon: "chat",
    },
    {
      id: 2,
      title: "תכנית פעולה",
      description: "מפת דרכים מותאמת אישית עם יעדים מדידים, ציר זמן ותקציב ברור.",
      duration: "5 ימי עסקים",
      highlight: null,
      icon: "clipboard",
    },
    {
      id: 3,
      title: "הטמעה מקצועית",
      description: "הצוות שלנו מבצע את התכנית עם עדכונים שוטפים ושקיפות מלאה.",
      duration: "לפי תכנית",
      highlight: null,
      icon: "lightning",
    },
    {
      id: 4,
      title: "מדידה ואופטימיזציה",
      description: "ניטור ביצועים, התאמות נדרשות וליווי שוטף להצלחה ארוכת טווח.",
      duration: "מתמשך",
      highlight: "97% שביעות רצון",
      icon: "chart",
    },
  ],
}

// ========================================
// ABOUT SECTION
// ========================================
export const aboutConfig = {
  badge: "מי אנחנו",
  headline: "לא סוכנות רגילה.",
  headlineHighlight: " שותפים לצמיחה.",
  subheadline: "אנחנו צוות של מומחים שמאמינים שכל עסק ראוי ליחס אישי ולתוצאות אמיתיות",
  
  founder: {
    name: "שם המייסד",
    role: "מייסד ומנכ\"ל",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    quote: "הקמתי את הסוכנות מתוך אמונה פשוטה: עסקים ראויים לשותפים אמיתיים, לא לספקי שירות. כל לקוח הוא סיפור הצלחה בהמתנה, ואנחנו כאן כדי לכתוב אותו יחד.",
    linkedin: "https://linkedin.com/in/founder",
  },
  
  timeline: [
    { year: "2016", text: "הקמת הסוכנות עם חזון ברור—להפוך עסקים טובים למצוינים" },
    { year: "2018", text: "חצינו את רף 50 הלקוחות והרחבנו את הצוות" },
    { year: "2021", text: "השקנו את מערך השירותים הדיגיטליים המלא" },
    { year: "2024", text: "200+ לקוחות פעילים, 8 שנות מומחיות מצטברת" },
  ],
  
  trustItems: [
    {
      title: "מומחיות מוכחת",
      description: "צוות מנוסה עם רקורד של הצלחות בעשרות תחומים ותעשיות שונות",
      stat: "200+",
      statLabel: "פרויקטים",
      icon: "badge",
    },
    {
      title: "גישה אישית",
      description: "כל לקוח מקבל מנהל לקוח ייעודי שמכיר את העסק לעומק",
      stat: "24/7",
      statLabel: "זמינות",
      icon: "user",
    },
    {
      title: "תוצאות מדידות",
      description: "דשבורד שקוף עם KPIs ברורים ודוחות ביצועים חודשיים",
      stat: "97%",
      statLabel: "שימור לקוחות",
      icon: "chart",
    },
  ],
  
  ctaText: "מוכנים לגלות איך נוכל לעזור לעסק שלכם?",
  ctaButton: "בואו נדבר",
}

// ========================================
// REVIEWS SECTION
// ========================================
export const reviewsConfig = {
  badge: "מה אומרים עלינו",
  headline: "הלקוחות מדברים.",
  headlineHighlight: " התוצאות מוכיחות.",
  subheadline: "סיפורי הצלחה אמיתיים מעסקים שעברו את המסע איתנו",
  
  stats: [
    { key: "clients", label: "לקוחות מרוצים" },
    { key: "rating", label: "דירוג ממוצע" },
    { key: "recommend", value: "97%", label: "ממליצים עלינו" },
  ],
  
  caseStudy: {
    show: true,
    title: "תיק עבודות מודגש",
    company: "TechFlow Solutions",
    industry: "SaaS B2B",
    challenge: "מוצר מצוין ללא נוכחות שיווקית, תנועה אורגנית אפסית",
    solution: "אסטרטגיית תוכן + SEO טכני + קמפיינים ממוקדים",
    quote: "תוך 6 חודשים עברנו מאפס לידים ל-50+ פניות איכותיות בחודש. ROI שאי אפשר להתווכח איתו.",
    author: "גל, VP Marketing",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    results: [
      { metric: "340%", label: "גידול בתנועה" },
      { metric: "52", label: "לידים חודשיים" },
      { metric: "4.2x", label: "ROI על השקעה" },
    ],
    ctaText: "רוצים תוצאות דומות?",
  },
}

// ========================================
// VIDEO SECTION
// ========================================
export const videoConfig = {
  show: true,
  badge: "ראו אותנו בפעולה",
  headline: "הכירו את",
  headlineHighlight: " הגישה שלנו",
  subheadline: "90 שניות שיעשו לכם סדר—למה עסקים בוחרים לעבוד איתנו",
  
  // Easy video swap - just change this ID
  // YouTube: use video ID (e.g., "dQw4w9WgXcQ")
  // Vimeo: use video ID (e.g., "123456789")
  provider: "youtube" as "youtube" | "vimeo" | "custom",
  videoId: "dQw4w9WgXcQ", // Replace with your video ID
  
  // Custom video URL (for self-hosted videos)
  customVideoUrl: null as string | null,
  
  // Thumbnail (optional - leave null for auto-generated)
  thumbnail: null as string | null,
  
  // Video highlights shown below
  highlights: [
    { icon: "🎯", text: "הגישה" },
    { icon: "👥", text: "הצוות" },
    { icon: "📈", text: "התוצאות" },
  ],
}

// ========================================
// FAQ SECTION
// ========================================
export const faqConfig = {
  badge: "שאלות נפוצות",
  headline: "יש שאלות?",
  headlineHighlight: " הנה התשובות.",
  subheadline: "כל מה שצריך לדעת לפני שמתחילים לעבוד יחד",
  ctaText: "לא מצאתם תשובה? אנחנו כאן",
  ctaButton: "שלחו הודעה",
  
  questions: [
    {
      question: "כמה זמן עד שרואים תוצאות?",
      answer: "תלוי בפרויקט ובמטרות. תוצאות ראשונות בדרך כלל נראות תוך 4-8 שבועות, עם תמונה מלאה תוך 3-6 חודשים. אנחנו מציבים יעדי ביניים ברורים כדי שתראו התקדמות מהיום הראשון.",
    },
    {
      question: "מה כולל התמחור?",
      answer: "התמחור מותאם אישית לצרכים ולהיקף הפרויקט. כל הצעה כוללת פירוט מלא של השירותים, ללא עלויות נסתרות. נשמח לתת הצעה מפורטת לאחר שיחת היכרות קצרה.",
    },
    {
      question: "יש התחייבות לתקופה מסוימת?",
      answer: "אנחנו מציעים גמישות מלאה. רוב החבילות הן חודשיות ללא התחייבות ארוכת טווח. יש גם אפשרות לתכניות שנתיות עם הטבות מיוחדות.",
    },
    {
      question: "איך מתחילים?",
      answer: "פשוט! מלאו את הטופס או התקשרו. נקבע שיחת היכרות קצרה (30 דקות) להבין את הצרכים, ותוך 5 ימי עסקים תקבלו הצעה מותאמת.",
    },
    {
      question: "מה ההבדל בינכם לסוכנויות אחרות?",
      answer: "שלושה דברים: ראשית, אנחנו שותפים לצמיחה ולא ספקי שירות—ההצלחה שלכם היא ההצלחה שלנו. שנית, שקיפות מלאה עם דשבורד זמין 24/7. שלישית, צוות ייעודי שמכיר את העסק שלכם לעומק.",
    },
    {
      question: "מה אם אני לא מרוצה?",
      answer: "שביעות הרצון שלכם בראש סדר העדיפויות. יש לנו מדיניות ברורה: אם משהו לא עובד, נתקן. ואם עדיין לא מרוצים—יש מדיניות החזר כספי יחסי לתקופה שנותרה.",
    },
  ],
}

// ========================================
// CONTACT FORM SECTION
// ========================================
export const contactConfig = {
  badge: "בואו נדבר",
  headline: "מוכנים",
  headlineHighlight: " לצעד הבא?",
  subheadline: "שיחת היכרות קצרה, ללא עלות וללא התחייבות",
  
  liveActivity: {
    show: true,
    text: "אנשים פונים אלינו עכשיו",
    minUsers: 2,
    maxUsers: 5,
  },
  
  steps: [
    { id: 1, label: "פרטים אישיים" },
    { id: 2, label: "על העסק" },
    { id: 3, label: "סיום" },
  ],
  
  step1: {
    title: "נעים להכיר!",
    fields: {
      fullName: { label: "שם מלא", placeholder: "איך קוראים לך?" },
      phone: { label: "טלפון", placeholder: "050-000-0000" },
      email: { label: "אימייל", placeholder: "your@email.com" },
    },
  },
  
  step2: {
    title: "ספרו לנו על העסק",
    businessTypes: [
      { value: "service", label: "שירותים", emoji: "💼" },
      { value: "ecommerce", label: "E-Commerce", emoji: "🛒" },
      { value: "saas", label: "SaaS / Tech", emoji: "💻" },
      { value: "local", label: "עסק מקומי", emoji: "📍" },
      { value: "other", label: "אחר", emoji: "✨" },
    ],
    businessSizes: [
      { value: "solo", label: "עצמאי" },
      { value: "small", label: "2-10 עובדים" },
      { value: "medium", label: "11-50 עובדים" },
      { value: "large", label: "50+ עובדים" },
    ],
    urgencyOptions: [
      { value: "asap", label: "בהקדם 🔥" },
      { value: "month", label: "תוך חודש" },
      { value: "quarter", label: "תוך רבעון" },
      { value: "exploring", label: "בודק אפשרויות" },
    ],
  },
  
  step3: {
    title: "עוד צעד אחד קטן",
    messageLabel: "משהו נוסף שחשוב לנו לדעת? (אופציונלי)",
    messagePlaceholder: "ספרו על האתגרים, המטרות או כל דבר שיעזור לנו להבין טוב יותר...",
    consentText: "אני מאשר/ת קבלת עדכונים. הפרטים מאובטחים ולא יועברו לצד שלישי.",
    whatHappensNext: {
      title: "מה קורה אחרי?",
      items: [
        "ניצור קשר תוך יום עסקים אחד",
        "שיחת אבחון ממוקדת (30 דק')",
        "הצעה מותאמת תוך 5 ימי עסקים",
      ],
    },
  },
  
  submitButton: "שלחו ונדבר!",
  successMessage: {
    title: "מעולה, {{name}}! 🎉",
    description: "קיבלנו את הפרטים ונחזור אליכם תוך יום עסקים",
    tip: "בינתיים, 97% מהלקוחות שלנו ממשיכים איתנו לטווח ארוך. סימן שאתם בידיים טובות! 💪",
  },
  
  privacyNote: "הפרטים שלכם מאובטחים ומוצפנים בתקן הגבוה ביותר.",
}

// ========================================
// FOOTER
// ========================================
export const footerConfig = {
  description: "אנחנו כאן כדי להפוך עסקים טובים למצוינים. צוות מומחים, גישה אישית ותוצאות מוכחות.",
  
  quickLinks: [
    { label: "איך זה עובד", href: "#how-it-works" },
    { label: "מי אנחנו", href: "#about" },
    { label: "המלצות", href: "#reviews" },
    { label: "שאלות נפוצות", href: "#faq" },
    { label: "צור קשר", href: "#contact" },
  ],
  
  legalLinks: [
    { label: "תנאי שימוש", href: "/terms" },
    { label: "מדיניות פרטיות", href: "/privacy" },
  ],
  
  copyright: "© {{year}} {{name}}. כל הזכויות שמורות.",
}

// ========================================
// HEADER / NAVIGATION
// ========================================
export const headerConfig = {
  navLinks: [
    { id: "how-it-works", label: "איך זה עובד" },
    { id: "about", label: "מי אנחנו" },
    { id: "reviews", label: "המלצות" },
    { id: "faq", label: "שאלות נפוצות" },
  ],
  ctaButton: "דברו איתנו",
}

// ========================================
// FLOATING CTA
// ========================================
export const floatingCtaConfig = {
  show: true,
  text: "דברו איתנו",
  type: "whatsapp" as "whatsapp" | "phone" | "scroll",
  message: "היי, אשמח לשמוע פרטים על השירותים שלכם",
}

// ========================================
// SEO / METADATA
// ========================================
export const seoConfig = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: ["סוכנות דיגיטל", "שיווק דיגיטלי", "צמיחה עסקית", "אסטרטגיה שיווקית", "SaaS", "B2B"],
  ogImage: "/og-image.jpg",
  twitterHandle: "@starteragency",
}

// ========================================
// EMAIL SETTINGS
// ========================================
export const emailConfig = {
  fromName: siteConfig.name,
  fromEmail: process.env.SES_FROM_EMAIL || "hello@starter.agency",
  replyTo: siteConfig.contact.email,
  
  templates: {
    welcome: {
      subject: `ברוכים הבאים ל${siteConfig.name}!`,
    },
    leadNotification: {
      subject: "ליד חדש התקבל!",
    },
    campaign: {
      footerText: `© ${new Date().getFullYear()} ${siteConfig.name}. כל הזכויות שמורות.`,
      unsubscribeText: "להסרה מרשימת התפוצה",
    },
  },
}

// ========================================
// TRUSTED BY LOGOS - Easy to swap
// ========================================
export const trustedByConfig = {
  title: "נבחרנו על ידי חברות מובילות",
  subtitle: "עובדים עם עסקים שרוצים לצמוח",
  
  // Add your client logos here
  // Format: { name: "Company Name", logo: "/logos/company.svg" }
  logos: [
    { name: "TechCorp", logo: "/placeholder-logo.svg" },
    { name: "GrowthLabs", logo: "/placeholder-logo.svg" },
    { name: "ScaleUp", logo: "/placeholder-logo.svg" },
    { name: "InnovateCo", logo: "/placeholder-logo.svg" },
    { name: "FutureTech", logo: "/placeholder-logo.svg" },
    { name: "NextGen", logo: "/placeholder-logo.svg" },
  ],
  
  certifications: [
    { name: "Google Partner", icon: "google" },
    { name: "Meta Partner", icon: "meta" },
    { name: "HubSpot Partner", icon: "hubspot" },
  ],
  
  guarantee: {
    title: "הבטחת שביעות רצון",
    description: "לא מרוצים? נתקן או נחזיר—פשוט וברור",
  },
}

// ========================================
// TRANSFORMATION SECTION
// ========================================
export const transformationConfig = {
  show: true,
  badge: "הטרנספורמציה",
  headline: "מהמצב הנוכחי",
  headlineHighlight: " לתוצאות שרציתם",
  
  before: {
    title: "לפני",
    items: [
      "תחושת תקיעות ואי ודאות",
      "פיזור משאבים לכל הכיוונים",
      "קושי למדוד החזר השקעה",
      "תוצאות לא עקביות",
    ],
  },
  
  after: {
    title: "אחרי",
    items: [
      "כיוון ברור ויעדים מוגדרים",
      "מיקוד במה שבאמת עובד",
      "דשבורד שקוף עם מדדים ברורים",
      "צמיחה עקבית וצפויה",
    ],
  },
  
  ctaText: "מוכנים לטרנספורמציה?",
}
