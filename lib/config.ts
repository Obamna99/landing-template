/**
 * ========================================
 * SITE CONFIGURATION
 * ========================================
 * 
 * This is the central configuration file for the entire website.
 * Modify these values to customize the site for different projects.
 * No need to edit individual components - all text comes from here.
 */

export const siteConfig = {
  // ========================================
  // BASIC INFO
  // ========================================
  name: "שם העסק",
  tagline: "פתרונות מקצועיים לעסקים",
  description: "אנחנו מספקים פתרונות מקצועיים ושירותים איכותיים לעסקים בכל התחומים",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  locale: "he",
  direction: "rtl" as const,
  
  // ========================================
  // CONTACT INFO
  // ========================================
  contact: {
    phone: "050-1234567",
    email: "info@example.com",
    address: "תל אביב, ישראל",
    whatsapp: "972501234567", // Without + or spaces
  },
  
  // ========================================
  // SOCIAL LINKS
  // ========================================
  social: {
    facebook: "https://facebook.com/yourbusiness",
    instagram: "https://instagram.com/yourbusiness",
    linkedin: "https://linkedin.com/company/yourbusiness",
    twitter: "https://twitter.com/yourbusiness",
  },
  
  // ========================================
  // BRANDING
  // ========================================
  branding: {
    logo: "/logo.svg", // Path to logo file
    logoText: "ש", // Fallback letter for logo
    primaryColor: "teal",
    accentColor: "amber",
  },
  
  // ========================================
  // STATS / SOCIAL PROOF NUMBERS
  // ========================================
  stats: {
    clients: "500+",
    clientsLabel: "לקוחות מרוצים",
    years: "12",
    yearsLabel: "שנות ניסיון",
    satisfaction: "98%",
    satisfactionLabel: "שביעות רצון",
    support: "24/7",
    supportLabel: "תמיכה",
  },
}

// ========================================
// HERO SECTION
// ========================================
export const heroConfig = {
  badge: "הפתרון המקצועי לעסקים",
  headline: {
    line1: "הפכו את העסק שלכם",
    highlight: "למכונת צמיחה",
  },
  subheadline: "אנחנו עוזרים לעסקים לצמוח עם פתרונות מותאמים אישית, שירות יוצא דופן ותוצאות מוכחות.",
  cta: {
    primary: {
      text: "בואו נדבר",
      href: "#contact",
    },
    secondary: {
      text: "איך זה עובד?",
      href: "#how-it-works",
    },
  },
  trustText: "מעל 1000 עסקים כבר צומחים איתנו",
}

// ========================================
// HOW IT WORKS SECTION
// ========================================
export const howItWorksConfig = {
  badge: "התהליך שלנו",
  headline: "פשוט, ברור,",
  headlineHighlight: " ויעיל",
  subheadline: "ארבעה צעדים פשוטים מהפגישה הראשונה לתוצאות מוכחות",
  ctaText: "מוכנים להתחיל? השיחה הראשונה",
  ctaHighlight: " עלינו",
  ctaButton: "תאמו שיחה עכשיו",
  steps: [
    {
      id: 1,
      title: "שיחת היכרות",
      description: "15 דקות להבין את העסק, האתגרים והמטרות שלכם. ללא עלות וללא התחייבות.",
      duration: "15 דק'",
      highlight: "חינם",
      icon: "chat", // Icon key
    },
    {
      id: 2,
      title: "אסטרטגיה מותאמת",
      description: "נבנה תכנית פעולה מפורטת עם יעדים ברורים, KPIs ולוחות זמנים.",
      duration: "3-5 ימים",
      highlight: null,
      icon: "clipboard",
    },
    {
      id: 3,
      title: "ביצוע מקצועי",
      description: "הצוות המנוסה שלנו מתחיל לעבוד. תקבלו עדכונים שוטפים ושקיפות מלאה.",
      duration: "מתמשך",
      highlight: null,
      icon: "lightning",
    },
    {
      id: 4,
      title: "צמיחה מתמדת",
      description: "ניתוח תוצאות, אופטימיזציה מתמשכת וליווי להצלחה ארוכת טווח.",
      duration: "לאורך זמן",
      highlight: "98% שביעות רצון",
      icon: "chart",
    },
  ],
}

// ========================================
// ABOUT SECTION
// ========================================
export const aboutConfig = {
  badge: "הסיפור שלנו",
  headline: "לא עוד חברה.",
  headlineHighlight: " משפחה של מומחים.",
  subheadline: "כי כשמכירים את הלקוחות שלנו בשם—התוצאות מדברות בעד עצמן",
  
  founder: {
    name: "דני כהן",
    role: "מייסד ומנכ\"ל",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    quote: "התחלתי את הדרך לפני 12 שנה עם אמונה פשוטה: כל עסק ראוי לקבל את אותו היחס שהייתי רוצה לעסק שלי. היום, עם צוות של 25 מומחים, אנחנו עדיין שומרים על האמונה הזו—כל לקוח הוא שותף, לא מספר.",
    linkedin: "https://linkedin.com/in/founder",
  },
  
  timeline: [
    { year: "2012", text: "הקמת החברה—התחלנו עם חזון ומחשב נייד" },
    { year: "2016", text: "הלקוח ה-100—הבנו שמשהו עובד" },
    { year: "2020", text: "הרחבה לשירותים דיגיטליים מלאים" },
    { year: "2024", text: "500+ לקוחות מרוצים ועדיין מתקדמים" },
  ],
  
  trustItems: [
    {
      title: "ניסיון מוכח",
      description: "12 שנים של הצלחות מוכחות עם מאות לקוחות מרוצים בכל התחומים",
      stat: "500+",
      statLabel: "לקוחות",
      icon: "badge",
    },
    {
      title: "שירות אישי",
      description: "צוות ייעודי לכל לקוח—תמיד מישהו שמכיר אתכם ואת העסק שלכם לעומק",
      stat: "24/7",
      statLabel: "תמיכה",
      icon: "user",
    },
    {
      title: "תוצאות מדידות",
      description: "לא הבטחות—מספרים. דוחות שקופים ו-KPIs ברורים לכל פרויקט",
      stat: "98%",
      statLabel: "שביעות רצון",
      icon: "chart",
    },
  ],
  
  ctaText: "רוצים לשמוע איך נוכל לעזור לעסק שלכם?",
  ctaButton: "בואו נכיר",
}

// ========================================
// REVIEWS SECTION
// ========================================
export const reviewsConfig = {
  badge: "ביקורות אמיתיות",
  headline: "לקוחות מספרים.",
  headlineHighlight: " המספרים מוכיחים.",
  subheadline: "אל תאמינו לנו—תאמינו ללקוחות שכבר עברו את המסע",
  
  stats: [
    { key: "clients", label: "לקוחות מרוצים" },
    { key: "rating", label: "דירוג ממוצע" },
    { key: "recommend", value: "98%", label: "ממליצים עלינו" },
  ],
  
  caseStudy: {
    show: true,
    title: "סיפור הצלחה מעורר השראה",
    company: "סטארטאפ X",
    industry: "טכנולוגיה",
    challenge: "אפס נוכחות דיגיטלית, תקציב מוגבל",
    solution: "אסטרטגיית תוכן + פרסום ממוקד",
    quote: "מסטארטאפ עם רעיון לחברה רווחית—תוך 8 חודשים בלבד.",
    author: "רון, מייסד",
    image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&h=400&fit=crop",
    results: [
      { metric: "500%", label: "גידול בתנועה" },
      { metric: "₪2M", label: "הכנסות שנתיות" },
      { metric: "45", label: "לקוחות חדשים" },
    ],
    ctaText: "רוצים תוצאות דומות?",
  },
}

// ========================================
// VIDEO SECTION
// ========================================
export const videoConfig = {
  show: true,
  badge: "צפו בסרטון",
  headline: "ראו איך אנחנו",
  headlineHighlight: " עובדים",
  subheadline: "בשני דקות תבינו למה לקוחות בוחרים בנו שוב ושוב",
  videoId: "dQw4w9WgXcQ", // YouTube video ID
  thumbnail: null, // Optional custom thumbnail URL
}

// ========================================
// FAQ SECTION
// ========================================
export const faqConfig = {
  badge: "שאלות נפוצות",
  headline: "יש שאלות?",
  headlineHighlight: " יש לנו תשובות.",
  subheadline: "כל מה שצריך לדעת לפני שמתחילים",
  ctaText: "לא מצאתם תשובה? דברו איתנו ישירות",
  ctaButton: "צרו קשר",
  
  questions: [
    {
      question: "כמה זמן לוקח לראות תוצאות?",
      answer: "רוב הלקוחות שלנו רואים תוצאות ראשונות תוך 30-60 יום. התוצאות המלאות מגיעות בדרך כלל תוך 3-6 חודשים, תלוי בהיקף הפרויקט ובמטרות שהוגדרו.",
    },
    {
      question: "מה העלות של השירותים?",
      answer: "המחירים שלנו מותאמים אישית לכל לקוח בהתאם לצרכים והיקף הפרויקט. נשמח לתת לכם הצעת מחיר מפורטת לאחר שיחת היכרות קצרה.",
    },
    {
      question: "האם יש התחייבות לתקופה מסוימת?",
      answer: "אנחנו מאמינים בשקיפות ובגמישות. רוב החבילות שלנו הן חודשיות ללא התחייבות ארוכת טווח. אנחנו סומכים על האיכות שלנו.",
    },
    {
      question: "איך מתחילים?",
      answer: "פשוט מאוד! מלאו את הטופס למטה או התקשרו אלינו. נקבע שיחת היכרות קצרה (15 דקות) להבין את הצרכים שלכם, ומשם נבנה יחד תכנית פעולה.",
    },
    {
      question: "מה קורה אם אני לא מרוצה?",
      answer: "שביעות הרצון שלכם היא בראש סדר העדיפויות שלנו. אם משהו לא עובד, נעשה הכל כדי לתקן. יש לנו מדיניות החזר כספי ברורה למקרים שנדרש.",
    },
  ],
}

// ========================================
// CONTACT FORM SECTION
// ========================================
export const contactConfig = {
  badge: "בואו נתחיל",
  headline: "מוכנים",
  headlineHighlight: " לעשות את הצעד?",
  subheadline: "פגישת היכרות קצרה, ללא עלות וללא התחייבות",
  
  liveActivity: {
    show: true,
    text: "אנשים ממלאים את הטופס עכשיו",
    minUsers: 2,
    maxUsers: 5,
  },
  
  steps: [
    { id: 1, label: "פרטים אישיים" },
    { id: 2, label: "על העסק" },
    { id: 3, label: "סיום" },
  ],
  
  step1: {
    title: "נתחיל בהכרות קצרה",
    fields: {
      fullName: { label: "איך קוראים לך?", placeholder: "השם המלא שלך" },
      phone: { label: "מספר הטלפון שלך", placeholder: "050-1234567" },
      email: { label: "כתובת המייל שלך", placeholder: "your@email.com" },
    },
  },
  
  step2: {
    title: "ספר/י לנו על העסק",
    businessTypes: [
      { value: "service", label: "שירותים", emoji: "💼" },
      { value: "ecommerce", label: "מסחר אונליין", emoji: "🛒" },
      { value: "tech", label: "טכנולוגיה", emoji: "💻" },
      { value: "other", label: "אחר", emoji: "✨" },
    ],
    businessSizes: [
      { value: "solo", label: "עצמאי" },
      { value: "small", label: "1-5 עובדים" },
      { value: "medium", label: "6-20 עובדים" },
      { value: "large", label: "20+ עובדים" },
    ],
    urgencyOptions: [
      { value: "asap", label: "בהקדם האפשרי 🔥" },
      { value: "month", label: "תוך חודש" },
      { value: "exploring", label: "רק בודק/ת" },
    ],
  },
  
  step3: {
    title: "כמעט סיימנו!",
    messageLabel: "רוצה להוסיף משהו? (אופציונלי)",
    messagePlaceholder: "ספר/י לנו על האתגרים או המטרות של העסק...",
    consentText: "אני מאשר/ת קבלת מידע ועדכונים. הפרטים מאובטחים ולא יועברו לצד שלישי.",
    whatHappensNext: {
      title: "מה קורה עכשיו?",
      items: [
        "נחזור אליך תוך 24 שעות",
        "שיחת היכרות קצרה (15 דק')",
        "הצעה מותאמת אישית",
      ],
    },
  },
  
  submitButton: "שלחו לי הצעה!",
  successMessage: {
    title: "מעולה, {{name}}! 🎉",
    description: "קיבלנו את הפרטים שלך ונחזור אליך תוך 24 שעות",
    tip: "98% מהלקוחות שלנו רואים תוצאות ראשונות תוך 30 יום. אתם בידיים טובות! 💪",
  },
  
  privacyNote: "הפרטים שלכם מאובטחים ומוצפנים. לא נשתף עם צד שלישי.",
}

// ========================================
// FOOTER
// ========================================
export const footerConfig = {
  description: "אנחנו כאן כדי לעזור לעסק שלכם לצמוח. צוות של מומחים עם ניסיון של שנים בתחום.",
  
  quickLinks: [
    { label: "איך זה עובד", href: "#how-it-works" },
    { label: "עלינו", href: "#about" },
    { label: "ביקורות", href: "#reviews" },
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
    { id: "about", label: "עלינו" },
    { id: "reviews", label: "ביקורות" },
    { id: "faq", label: "שאלות נפוצות" },
  ],
  ctaButton: "התחילו עכשיו",
}

// ========================================
// FLOATING CTA
// ========================================
export const floatingCtaConfig = {
  show: true,
  text: "דברו איתנו",
  type: "whatsapp" as "whatsapp" | "phone" | "scroll", // whatsapp, phone, or scroll to contact
  message: "שלום, אשמח לשמוע פרטים נוספים על השירותים שלכם", // WhatsApp message
}

// ========================================
// SEO / METADATA
// ========================================
export const seoConfig = {
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: ["עסקים", "שיווק", "פתרונות", "שירותים", "ייעוץ"],
  ogImage: "/og-image.jpg",
  twitterHandle: "@yourbusiness",
}

// ========================================
// EMAIL SETTINGS
// ========================================
export const emailConfig = {
  fromName: siteConfig.name,
  fromEmail: process.env.SES_FROM_EMAIL || "noreply@example.com",
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
// TRUST BADGES (optional logos section)
// ========================================
export const trustBadgesConfig = {
  show: true,
  title: "עובדים עם החברות המובילות",
  logos: [
    { name: "Company 1", logo: "/logos/company1.svg" },
    { name: "Company 2", logo: "/logos/company2.svg" },
    { name: "Company 3", logo: "/logos/company3.svg" },
    { name: "Company 4", logo: "/logos/company4.svg" },
    { name: "Company 5", logo: "/logos/company5.svg" },
  ],
}

// ========================================
// TRANSFORMATION SECTION (Before/After)
// ========================================
export const transformationConfig = {
  show: true,
  badge: "השינוי",
  headline: "מאיפה שאתם היום",
  headlineHighlight: " לאן שתגיעו",
  
  before: {
    title: "לפני",
    items: [
      "תחושת תקיעות בעסק",
      "חוסר בהירות בכיוון",
      "בזבוז זמן על דברים לא נכונים",
      "תוצאות לא עקביות",
    ],
  },
  
  after: {
    title: "אחרי",
    items: [
      "צמיחה עקבית ומתמשכת",
      "אסטרטגיה ברורה וממוקדת",
      "יעילות מקסימלית",
      "תוצאות מוכחות ומדידות",
    ],
  },
  
  ctaText: "מוכנים לשינוי?",
}
