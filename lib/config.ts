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
  name: "MailFlow",
  tagline: "דפי נחיתה מעוצבים + שיווק במייל בזול ובאיכות גבוהה",
  description: "אנחנו בונים דפי נחיתה מרהיבים ומותאמים אישית לעסק שלך, עם מערכת שיווק במייל במחירים שמנצחים את המתחרים. האתר שאתה רואה עכשיו? זה בדיוק מה שתקבל.",
  // Used in email unsubscribe links and canonical URLs. Must be a reachable public URL.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mailflow.co.il",
  locale: "he",
  direction: "rtl" as const,
  
  // ========================================
  // CONTACT INFO
  // ========================================
  contact: {
    phone: "0526555139",
    email: "oser130309@gmail.com",
    address: "תל אביב, ישראל",
    whatsapp: "972526555139",  // Format: 972 + phone without leading 0
    whatsappDefaultMessage: "היי, ראיתי את האתר שלכם ואשמח לשמוע עוד פרטים",
  },
  
  // ========================================
  // SOCIAL LINKS
  // ========================================
  social: {
    facebook: "https://facebook.com/mailflow",
    instagram: "https://instagram.com/mailflow",
    linkedin: "https://linkedin.com/company/mailflow",
    twitter: "https://twitter.com/mailflow",
  },
  
  // ========================================
  // BRANDING
  // ========================================
  branding: {
    logo: "/logo.svg",
    logoText: "M",
    primaryColor: "teal",
    accentColor: "amber",
  },
  
  // ========================================
  // STATS / SOCIAL PROOF NUMBERS
  // ========================================
  stats: {
    clients: "150+",
    clientsLabel: "אתרים שהקמנו",
    years: "50K+",
    yearsLabel: "מיילים בחודש",
    satisfaction: "98%",
    satisfactionLabel: "לקוחות מרוצים",
    support: "24/7",
    supportLabel: "תמיכה",
  },
}

// ========================================
// HERO SECTION
// ========================================
export const heroConfig = {
  badge: "דפי נחיתה + שיווק במייל",
  headline: {
    line1: "האתר שמאפשר לכם",
    highlight: "",
  },
  subheadline: "דף נחיתה מעוצב שמביא לקוחות, עם מערכת מיילים שחוסכת לכם כסף. פשוט, יפה, ומשתלם.",
  cta: {
    primary: {
      text: "רוצים דף נחיתה? דברו איתנו",
      href: "#contact",
    },
    secondary: {
      text: "איך זה עובד?",
      href: "#how-it-works",
    },
  },
  trustText: "מצטרפים ל-150+ עסקים עם דפי נחיתה מרהיבים",
}

// ========================================
// HOW IT WORKS SECTION
// ========================================
export const howItWorksConfig = {
  badge: "התהליך שלנו",
  headline: "מאתר ישן",
  headlineHighlight: " לדף נחיתה שמוכר",
  subheadline: "ארבעה שלבים פשוטים ותוך ימים ספורים יש לך אתר מרהיב + מערכת שיווק במייל",
  ctaText: "שיחת היכרות",
  ctaHighlight: " ללא עלות",
  ctaButton: "בואו נדבר",
  steps: [
    {
      id: 1,
      title: "שיחת היכרות",
      description: "מבינים את העסק שלך, התחום, קהל היעד והסגנון שמתאים לך. נראה לך דוגמאות ונבחר כיוון.",
      duration: "20 דק'",
      highlight: "חינם",
      icon: "chat",
    },
    {
      id: 2,
      title: "עיצוב ומיתוג",
      description: "מתאימים את העיצוב לזהות המותג שלך: בחירת צבעים, טיפוגרפיה, תמונות מקצועיות וכתיבת תוכן שיווקי שמדבר ישירות לקהל היעד שלך.",
      duration: "3-5 ימים",
      highlight: "מותאם אישית",
      icon: "clipboard",
    },
    {
      id: 3,
      title: "חיבור מערכת המיילים",
      description: "מגדירים מערכת מיילים מקצועית עם הדומיין שלך. תשלחו אלפי מיילים בחודש בעלות נמוכה משמעותית מהמתחרים.",
      duration: "יום אחד",
      highlight: "חיסכון משמעותי",
      icon: "lightning",
    },
    {
      id: 4,
      title: "העלאה לאוויר",
      description: "האתר עולה, המיילים מוכנים לשליחה, ואתם מתחילים לקבל לידים. אנחנו כאן לתמיכה שוטפת.",
      duration: "מיידי",
      highlight: null,
      icon: "chart",
    },
  ],
}

// ========================================
// ABOUT SECTION
// ========================================
export const aboutConfig = {
  badge: "למה אנחנו",
  headline: "לא סוכנות שיווק.",
  headlineHighlight: " בונים לך אתר שמוכר.",
  subheadline: "אנחנו מתמחים בדבר אחד: דפי נחיתה מרהיבים עם מערכת מיילים במחיר הוגן",
  
  founder: {
    name: "צוות MailFlow",
    role: "מומחי דפי נחיתה ושיווק במייל",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop",
    quote: "ראינו עסקים משלמים הון על אתרים בינוניים ועוד יותר על שיווק במייל. החלטנו לעשות את זה אחרת—עיצוב ברמה הכי גבוהה, מחירי מייל הכי נמוכים בשוק. פשוט.",
    linkedin: "https://linkedin.com/company/mailflow",
  },
  
  timeline: [
    { year: "עיצוב", text: "דפי נחיתה מודרניים, רספונסיביים, עם אנימציות חלקות וחוויית משתמש מושלמת" },
    { year: "התאמה", text: "כל אתר מותאם לעסק שלך—תמונות, צבעים, טקסטים ותוכן" },
    { year: "מיילים", text: "מערכת מיילים מקצועית שעובדת בצורה אמינה ומגיעה לתיבת הדואר" },
    { year: "מחיר", text: "עלות נמוכה משמעותית מכל מה שאתם משלמים היום. נדבר על זה בשיחה." },
  ],
  
  trustItems: [
    {
      title: "עיצוב ברמה עולמית",
      description: "האתר שאתה רואה עכשיו? זה בדיוק מה שתקבל. ללא הפתעות.",
      stat: "150+",
      statLabel: "אתרים",
      icon: "badge",
    },
    {
      title: "מחיר שלא תמצא",
      description: "מערכת מיילים במחיר שלא תמצאו אצל אף מתחרה. תבדקו ותשוו—נדבר על זה בשיחה.",
      stat: "98%",
      statLabel: "לקוחות מרוצים",
      icon: "chart",
    },
    {
      title: "הכל מותאם לך",
      description: "התמונות שלך, הלוגו שלך, הטקסטים שלך, הצבעים שלך. אנחנו רק עושים את זה יפה.",
      stat: "100%",
      statLabel: "התאמה",
      icon: "user",
    },
  ],
  
  ctaText: "רוצים אתר כזה לעסק שלכם?",
  ctaButton: "בואו נדבר",
}

// ========================================
// REVIEWS SECTION
// ========================================
export const reviewsConfig = {
  badge: "הלקוחות שלנו מספרים",
  headline: "תוצאות שמדברות",
  headlineHighlight: " בעד עצמן",
  subheadline: "עסקים שעבדנו איתם משתפים את החוויה שלהם ואת התוצאות שהשיגו",
  
  stats: [
    { key: "clients", label: "לקוחות מרוצים" },
    { key: "rating", label: "דירוג ממוצע" },
    { key: "recommend", value: "98%", label: "ממליצים עלינו" },
  ],
  
  caseStudy: {
    show: true,
    title: "לקוח לדוגמה",
    company: "סטודיו לעיצוב פנים",
    industry: "עיצוב ואדריכלות",
    challenge: "אתר ישן ואיטי, לא מותאם למובייל, עלויות גבוהות על שיווק במייל",
    solution: "דף נחיתה מודרני + מערכת מיילים משתלמת",
    quote: "האתר החדש נראה פי 10 יותר טוב מהישן, ואני חוסך המון על מיילים. למה לא עשיתי את זה קודם?",
    author: "מיכל, בעלת הסטודיו",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop",
    results: [
      { metric: "300%", label: "יותר פניות" },
      { metric: "משמעותי", label: "חיסכון" },
      { metric: "1.2 שנ'", label: "טעינת עמוד" },
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
  headline: "כך נראה התהליך",
  headlineHighlight: " מהתחלה ועד הסוף",
  subheadline: "מהרגע שאתם פונים אלינו ועד שהאתר עולה לאוויר—תהליך מקצועי, מהיר ושקוף",
  
  // Easy video swap - just change this ID
  // YouTube: use video ID (e.g., "dQw4w9WgXcQ")
  // Vimeo: use video ID (e.g., "123456789")
  provider: "youtube" as "youtube" | "vimeo" | "custom",
  videoId: "lM02vNMRRB0", // Copyright-free calm background footage
  
  // Custom video URL (for self-hosted videos)
  customVideoUrl: null as string | null,
  
  // Thumbnail (optional - leave null for auto-generated)
  thumbnail: null as string | null,
  
  // Video highlights shown below
  highlights: [
    { icon: "✨", text: "עיצוב מקצועי" },
    { icon: "⚡", text: "תהליך מהיר" },
    { icon: "🎯", text: "תוצאות מוכחות" },
  ],
}

// ========================================
// FAQ SECTION
// ========================================
export const faqConfig = {
  badge: "שאלות נפוצות",
  headline: "יש שאלות?",
  headlineHighlight: " הנה התשובות.",
  subheadline: "כל מה שצריך לדעת על דפי הנחיתה ומערכת המיילים שלנו",
  ctaText: "לא מצאתם תשובה? אנחנו כאן",
  ctaButton: "שלחו הודעה",
  
  questions: [
    {
      question: "מה בדיוק אני מקבל?",
      answer: "אתה מקבל דף נחיתה בדיוק כמו האתר הזה שאתה רואה עכשיו—רק עם התמונות שלך, הטקסטים שלך, הלוגו שלך והצבעים שלך. בנוסף, מערכת שליחת מיילים מקצועית שמאפשרת לך לשלוח אלפי מיילים בעלות נמוכה משמעותית ממה שאתה משלם היום.",
    },
    {
      question: "כמה זה עולה?",
      answer: "הקמת האתר היא תשלום חד פעמי. שליחת מיילים עולה הרבה פחות ממה שאתם משלמים היום—זה בטוח. נשמח לתת הצעת מחיר מפורטת בשיחה קצרה.",
    },
    {
      question: "כמה זמן לוקח?",
      answer: "בדרך כלל 5-7 ימי עסקים מרגע שמתחילים. שיחת היכרות (20 דק'), אתם שולחים לנו את החומרים (תמונות, טקסטים, לוגו), אנחנו בונים ומתאימים, ותוך שבוע האתר באוויר.",
    },
    {
      question: "למה המחיר שלכם נמוך יותר?",
      answer: "אנחנו משתמשים במערכת מיילים מקצועית שבה משתמשות גם חברות ענק. אתם משלמים רק על מה ששולחים, בלי מנויים חודשיים יקרים. תבדקו כמה אתם משלמים היום ותופתעו מההבדל.",
    },
    {
      question: "אני יכול לערוך את האתר בעצמי?",
      answer: "האתר בנוי על טכנולוגיה מודרנית. אם יש לך מפתח, הוא יכול לערוך הכל. אם לא—אנחנו מציעים חבילות תחזוקה שכוללות עדכונים שוטפים לפי הצורך.",
    },
    {
      question: "מה אם יש לי כבר אתר?",
      answer: "מצוין! אנחנו יכולים להחליף את האתר הקיים בדף נחיתה חדש. רוב הלקוחות שלנו הגיעו עם אתרים ישנים ואיטיים ושדרגו לעיצוב מודרני ומהיר.",
    },
  ],
}

// ========================================
// CONTACT FORM SECTION
// ========================================
export const contactConfig = {
  badge: "בואו נדבר",
  headline: "רוצים אתר",
  headlineHighlight: " כמו שלנו?",
  subheadline: "שיחת היכרות קצרה, ללא עלות וללא התחייבות",
  
  liveActivity: {
    show: true,
    text: "אנשים מתעניינים עכשיו",
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
      { value: "ecommerce", label: "חנות אונליין", emoji: "🛒" },
      { value: "realEstate", label: "נדל\"ן", emoji: "🏠" },
      { value: "health", label: "בריאות / יופי", emoji: "💆" },
      { value: "food", label: "מסעדות / אוכל", emoji: "🍽️" },
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
    messagePlaceholder: "יש לך אתר קיים? מה הסגנון שאתה מחפש? כמה מיילים אתה שולח בחודש?",
    consentText: "אני מאשר/ת קבלת עדכונים. הפרטים מאובטחים ולא יועברו לצד שלישי.",
    whatHappensNext: {
      title: "מה קורה אחרי?",
      items: [
        "ניצור קשר תוך 24 שעות",
        "שיחת היכרות קצרה (20 דק')",
        "הצעת מחיר מפורטת תוך יומיים",
      ],
    },
  },
  
  submitButton: "שלחו ונדבר!",
  successMessage: {
    title: "מעולה, {{name}}! 🎉",
    description: "קיבלנו את הפרטים ונחזור אליכם תוך 24 שעות",
    tip: "בינתיים, תדמיינו את האתר הזה עם הלוגו שלכם והתמונות שלכם. זה מה שתקבלו! 💪",
  },
  
  privacyNote: "הפרטים שלכם מאובטחים ומוצפנים בתקן הגבוה ביותר.",
}

// ========================================
// FOOTER
// ========================================
export const footerConfig = {
  description: "אנחנו בונים דפי נחיתה מרהיבים ומחברים אותם למערכת שיווק במייל הכי משתלמת בשוק. האתר שאתם רואים? זה מה שתקבלו.",
  
  quickLinks: [
    { label: "איך זה עובד", href: "#how-it-works" },
    { label: "למה אנחנו", href: "#about" },
    { label: "לקוחות מספרים", href: "#reviews" },
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
    { id: "about", label: "למה אנחנו" },
    { id: "reviews", label: "לקוחות" },
    { id: "faq", label: "שאלות נפוצות" },
  ],
  ctaButton: "רוצה אתר כזה?",
}

// ========================================
// FLOATING CTA
// ========================================
export const floatingCtaConfig = {
  show: true,
  text: "רוצה אתר כזה?",
  type: "whatsapp" as "whatsapp" | "phone" | "scroll",
  message: "היי, ראיתי את האתר שלכם ואני מעוניין בדף נחיתה דומה לעסק שלי",
}

// ========================================
// SEO / METADATA
// ========================================
export const seoConfig = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: ["דף נחיתה", "עיצוב אתרים", "שיווק במייל", "email marketing", "landing page", "בניית אתרים"],
  ogImage: "/og-image.jpg",
  twitterHandle: "@mailflow",
}

// ========================================
// EMAIL SETTINGS
// ========================================
export const emailConfig = {
  fromName: siteConfig.name,
  fromEmail: process.env.SES_FROM_EMAIL || "hello@mailflow.co.il",
  replyTo: siteConfig.contact.email,
  
  templates: {
    welcome: {
      subject: `ברוכים הבאים ל${siteConfig.name}!`,
    },
    leadNotification: {
      subject: "פנייה חדשה התקבלה!",
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
  title: "הלקוחות שלנו",
  subtitle: "מצטרפים למעל 150 עסקים שכבר עובדים איתנו",
  
  // Add your client logos here
  // Format: { name: "Company Name", logo: "/logos/company.svg" }
  logos: [
    { name: "סטודיו אדר", logo: "/placeholder-logo.svg" },
    { name: "מרפאת שיניים ד\"ר כהן", logo: "/placeholder-logo.svg" },
    { name: "נדל\"ן פלוס", logo: "/placeholder-logo.svg" },
    { name: "מסעדת השף", logo: "/placeholder-logo.svg" },
    { name: "יועצי עסקים 360", logo: "/placeholder-logo.svg" },
    { name: "חנות האופנה", logo: "/placeholder-logo.svg" },
  ],
  
  certifications: [
    { name: "מערכת מאובטחת", icon: "ssl" },
    { name: "תמיכה מלאה", icon: "support" },
    { name: "אחריות על העבודה", icon: "guarantee" },
  ],
  
  guarantee: {
    title: "לא מרוצים? מחזירים כסף",
    description: "אם העיצוב לא מוצא חן בעיניכם—מחזירים את הכסף. פשוט.",
  },
}

// ========================================
// TRANSFORMATION SECTION
// ========================================
export const transformationConfig = {
  show: true,
  badge: "לפני ואחרי",
  headline: "מאתר ישן ואיטי",
  headlineHighlight: " לדף נחיתה שמוכר",
  
  before: {
    title: "לפני",
    items: [
      "אתר ישן ואיטי",
      "לא מותאם למובייל",
      "עלויות גבוהות על שיווק במייל",
      "עיצוב גנרי שנראה כמו כולם",
    ],
  },
  
  after: {
    title: "אחרי",
    items: [
      "דף נחיתה מהיר ומודרני",
      "מושלם על כל מסך",
      "חיסכון משמעותי על מיילים",
      "עיצוב מותאם אישית לעסק שלך",
    ],
  },
  
  ctaText: "מוכנים לשדרוג?",
}

// ========================================
// CHATBOT WIDGET
// ========================================
export const chatbotConfig = {
  enabled: true,
  
  // Appearance
  title: "יש לנו תשובות",
  subtitle: "שאלו אותנו הכל",
  botName: "הצוות שלנו",
  botAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", // Young woman avatar
  
  // Messages
  placeholder: "הקלידו שאלה...",
  fallbackMessage: "לא מצאתי תשובה מתאימה. רוצים לדבר עם נציג?",
  
  // Time-based greetings
  greetings: {
    morning: "בוקר טוב! איך אפשר לעזור לכם היום?",      // 5:00 - 11:59
    afternoon: "צהריים טובים! איך אפשר לעזור?",          // 12:00 - 16:59
    evening: "ערב טוב! איך אפשר לעזור לכם?",             // 17:00 - 20:59
    night: "לילה טוב! איך אפשר לעזור?",                  // 21:00 - 4:59
  },
  
  // Proactive popup settings
  proactivePopup: {
    enabled: true,
    delay: 15000, // Show after 15 seconds on page
    message: "יש שאלות? אני כאן לעזור! 💬",
    scrollTrigger: 50, // Or after scrolling 50% of page
  },
  
  // Feedback settings
  feedback: {
    enabled: true,
    helpfulText: "התשובה עזרה?",
    thankYouText: "תודה על המשוב!",
  },
  
  // Fallback action when no answer found
  fallbackCTA: {
    type: "whatsapp" as "whatsapp" | "contact" | "phone",
    text: "דברו איתנו בוואטסאפ",
  },
  
  // Quick question buttons (indexes reference faqConfig.questions)
  quickQuestions: [
    { label: "מה אני מקבל?", questionIndex: 0 },
    { label: "כמה זה עולה?", questionIndex: 1 },
    { label: "כמה זמן לוקח?", questionIndex: 2 },
  ],
  
  // Follow-up suggestions after FAQ answers (questionIndex -> suggested follow-ups)
  followUpQuestions: {
    0: [1, 2],      // After "מה אני מקבל" -> suggest "כמה זה עולה" and "כמה זמן לוקח"
    1: [2, 3],      // After "כמה זה עולה" -> suggest "כמה זמן לוקח" and "למה המחיר נמוך"
    2: [0, 1],      // After "כמה זמן לוקח" -> suggest "מה אני מקבל" and "כמה זה עולה"
    3: [1, 4],      // After "למה המחיר נמוך" -> suggest "כמה זה עולה" and "אפשר לערוך"
    4: [5, 0],      // After "אפשר לערוך" -> suggest "יש לי אתר" and "מה אני מקבל"
    5: [1, 2],      // After "יש לי אתר" -> suggest "כמה זה עולה" and "כמה זמן לוקח"
  } as Record<number, number[]>,
  
  // Default responses for common phrases (checked before FAQ)
  defaultResponses: [
    {
      triggers: ["שלום", "היי", "הי", "hello", "hi", "בוקר טוב", "ערב טוב", "מה נשמע", "מה קורה"],
      response: "שלום! שמחים שפניתם אלינו. איך אפשר לעזור לכם היום?",
    },
    {
      triggers: ["מי אתם", "מה אתם", "ספרו על עצמכם", "על החברה", "מה זה"],
      response: "אנחנו MailFlow - מתמחים בבניית דפי נחיתה מרהיבים ומערכות שיווק במייל במחירים משתלמים. האתר שאתם רואים עכשיו? זה בדיוק מה שתקבלו!",
    },
    {
      triggers: ["תודה", "תודה רבה", "thanks", "thank you", "מעולה", "אחלה"],
      response: "בשמחה! אם יש עוד שאלות, אנחנו כאן. רוצים לקבוע שיחת היכרות?",
    },
    {
      triggers: ["ביי", "להתראות", "bye", "שלום וברכה"],
      response: "להתראות! אם תצטרכו משהו, אנחנו תמיד כאן. יום נפלא!",
    },
    {
      triggers: ["עזרה", "help", "צריך עזרה"],
      response: "בטח! אפשר לשאול אותי על המחירים, זמני אספקה, מה כלול בשירות, או כל שאלה אחרת. מה מעניין אתכם?",
    },
    {
      triggers: ["טלפון", "להתקשר", "מספר טלפון", "איך יוצרים קשר"],
      response: "אפשר ליצור איתנו קשר בטלפון או דרך וואטסאפ. מה נוח לכם יותר?",
    },
  ],
  
  // Chatbot position
  position: "left" as "left" | "right",
}

// ========================================
// SOCIAL PROOF NOTIFICATIONS
// ========================================
export const socialProofConfig = {
  enabled: true,
  
  // Timing
  initialDelay: 15000,     // First notification after 15 seconds
  intervalMin: 30000,      // Minimum 30 seconds between notifications
  intervalMax: 90000,      // Maximum 90 seconds between notifications
  displayDuration: 3500,   // Show each notification for 3.5 seconds
  
  // Position - top-left on mobile to avoid conflicts, bottom-right on desktop
  position: "top-left" as "bottom-left" | "bottom-right" | "top-left" | "top-right",
  
  // Content templates
  actions: [
    "הצטרף",
    "נרשם",
    "שלח פנייה",
    "ביקש הצעת מחיר",
  ],
  
  // Random names and cities for realistic notifications
  names: [
    { name: "יוסי", gender: "male" },
    { name: "דני", gender: "male" },
    { name: "אבי", gender: "male" },
    { name: "משה", gender: "male" },
    { name: "דוד", gender: "male" },
    { name: "רוני", gender: "male" },
    { name: "עומר", gender: "male" },
    { name: "איתי", gender: "male" },
    { name: "מיכל", gender: "female" },
    { name: "שירה", gender: "female" },
    { name: "נועה", gender: "female" },
    { name: "רונית", gender: "female" },
    { name: "אורית", gender: "female" },
    { name: "דנה", gender: "female" },
  ],
  
  cities: [
    "תל אביב",
    "ירושלים",
    "חיפה",
    "באר שבע",
    "רמת גן",
    "פתח תקווה",
    "נתניה",
    "אשדוד",
    "הרצליה",
    "רעננה",
    "כפר סבא",
    "ראשון לציון",
    "חולון",
    "בת ים",
  ],
  
  // Business types for context
  businessTypes: [
    "בעל עסק",
    "יזם",
    "בעל חנות",
    "מנהל שיווק",
    "עצמאי",
    "בעל מסעדה",
    "מעצב",
    "יועץ",
  ],
  
  // Time ago options (in minutes)
  timeAgoOptions: [2, 3, 5, 7, 10, 12, 15, 18, 22, 25, 30],
}

// ========================================
// HESITATION HELPER (Proactive Assistant)
// ========================================
export const hesitationHelperConfig = {
  enabled: true,
  
  // When to show (user inactivity in milliseconds)
  hesitationDelay: 8000,  // Show after 8 seconds of no activity
  
  // Position
  position: "right" as "left" | "right",
  verticalPosition: "bottom" as "top" | "middle" | "bottom", // Changed to bottom to avoid conflicts
  
  // Messages
  messages: [
    "רוצה שאסכם לך את העיקר?",
    "יש שאלות? אני כאן לעזור",
    "רוצה לשמוע על המחירים?",
    "בואו נדבר - שיחה קצרה ללא התחייבות",
  ],
  
  // Actions
  primaryAction: {
    text: "כן, ספר לי",
    type: "scroll" as "scroll" | "whatsapp" | "contact",
    target: "#contact", // For scroll type
  },
  
  secondaryAction: {
    text: "לא תודה",
    dismiss: true,
  },
  
  // Icon
  icon: "💡", // Can be emoji or custom icon
}
