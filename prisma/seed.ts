import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Generic, professionally written reviews for seeding
const seedReviews = [
  {
    name: "שרה כהן",
    role: "מנכ\"לית",
    company: "טק-סטארט",
    content: "לפני שנה היינו סטארטאפ עם חזון אבל בלי כיוון שיווקי. היום? 3X בהכנסות ותיק לקוחות שגדל כל חודש. הצוות הבין את הצרכים שלנו מהרגע הראשון.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    result: "+300%",
    resultLabel: "גידול בהכנסות",
    featured: true,
    order: 1,
  },
  {
    name: "דוד לוי",
    role: "בעלים",
    company: "לוי נכסים",
    content: "האסטרטגיה שבנו יחד שינתה לי את העסק לחלוטין. יותר לידים איכותיים, פחות זמן על שיווק שלא עובד. ממליץ בחום לכל בעל עסק.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    result: "+180%",
    resultLabel: "לידים איכותיים",
    order: 2,
  },
  {
    name: "מיכל אברהם",
    role: "מייסדת",
    company: "סטודיו מיכל",
    content: "מהחודש השני כבר ראיתי תוצאות משמעותיות. לא האמנתי שאפשר לגדול כל כך מהר ועדיין לשמור על איכות השירות. צוות מקצועי ברמה הגבוהה ביותר.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    result: "60 יום",
    resultLabel: "עד לתוצאות",
    order: 3,
  },
  {
    name: "יוסי מזרחי",
    role: "מנהל שיווק",
    company: "פוד טק בע\"מ",
    content: "הצוות הבין את האתגרים שלנו מהפגישה הראשונה. היחס האישי והזמינות עשו את כל ההבדל. ההשקעה בשירות החזירה את עצמה פי כמה.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    result: "+250%",
    resultLabel: "ROI על פרסום",
    order: 4,
  },
  {
    name: "רונית שמעון",
    role: "יזמית",
    company: "ביוטי פלוס",
    content: "השקענו בהרבה פתרונות שיווק לפני—אבל פה לראשונה הרגשתי שמישהו באמת מבין את הקהל שלי ויודע איך להגיע אליו בצורה אותנטית.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    result: "+95%",
    resultLabel: "שיפור בהמרות",
    featured: true,
    order: 5,
  },
  {
    name: "אלון גולן",
    role: "CTO",
    company: "קוד מאסטר",
    content: "שיתוף פעולה מצוין מתחילת הדרך. הצוות תמיד זמין, מקצועי ומביא רעיונות חדשים לשולחן. אין תחושה של ספק רגיל אלא של שותף אמיתי.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    result: "24/7",
    resultLabel: "תמיכה אמיתית",
    order: 6,
  },
  {
    name: "נועה ברק",
    role: "מנהלת פיתוח עסקי",
    company: "הלת' טק",
    content: "תשומת לב יוצאת דופן לפרטים הקטנים. רואים שהם באמת אכפתיים ורוצים שנצליח. כל פגישה מביאה ערך אמיתי ותובנות חדשות.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    result: "+400%",
    resultLabel: "תנועה אורגנית",
    order: 7,
  },
  {
    name: "עומר דהן",
    role: "בעלים",
    company: "דהן ושות'",
    content: "ההחלטה הטובה ביותר שקיבלתי לעסק שלי. התוצאות הגיעו מהר יותר ממה שציפיתי והשירות עלה על כל הציפיות. ממליץ לכל מי שרציני לגבי הצמיחה.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    result: "3 שבועות",
    resultLabel: "עד ל-ROI חיובי",
    order: 8,
  },
  {
    name: "תמר אשכנזי",
    role: "סמנכ\"לית שיווק",
    company: "גלובל טרייד",
    content: "צוות מקצועי שמבין את הצרכים של הלקוחות. ממליצה בחום לכולם! העבודה המשותפת הייתה חוויה מצוינת מהתחלה ועד הסוף.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654982?w=150&h=150&fit=crop&crop=face",
    result: "+320%",
    resultLabel: "הכנסות שנתיות",
    order: 9,
  },
  {
    name: "איתי פרידמן",
    role: "מנהל תפעול",
    company: "לוג'יסטיקה פלוס",
    content: "הפתרון המושלם לעסק שלי. חסכתי המון זמן וכסף בזכותם. מה שהכי אהבתי זה השקיפות המלאה והדוחות המפורטים שאני מקבל כל חודש.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    result: "40%",
    resultLabel: "חיסכון בעלויות",
    order: 10,
  },
  {
    name: "ליאת מור",
    role: "מנהלת מכירות",
    company: "סייבר סולושנס",
    content: "שירות ברמה הגבוהה ביותר. תמיד זמינים ומוכנים לעזור. הצוות לקח את הזמן להבין את המורכבות של התעשייה שלנו וזה באמת הרגיש.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    result: "+200%",
    resultLabel: "סגירות עסקאות",
    order: 11,
  },
  {
    name: "גיא רוזנברג",
    role: "מייסד-שותף",
    company: "אפליקיישן לאב",
    content: "עבודה מקצועית ויסודית. הם באמת דואגים להצלחה של הלקוחות שלהם. אחרי שנה של עבודה משותפת, אני יכול להגיד שזו הייתה אחת ההשקעות הטובות שעשיתי.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
    result: "10X",
    resultLabel: "צמיחה במשתמשים",
    featured: true,
    order: 12,
  },
  {
    name: "מאיה חיים",
    role: "בעלת עסק",
    company: "מאיה קייטרינג",
    content: "גיליתי אותם דרך חברה והם שינו לי את העסק מהיסוד. פשוט מדהימים! מהמיתוג ועד השיווק, הכל נעשה ברמה הגבוהה ביותר.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=150&h=150&fit=crop&crop=face",
    result: "+500%",
    resultLabel: "הזמנות חודשיות",
    order: 13,
  },
]

async function main() {
  console.log("🌱 Starting database seed...")

  // Clear existing reviews
  await prisma.review.deleteMany()
  console.log("🗑️  Cleared existing reviews")

  // Insert seed reviews
  for (const review of seedReviews) {
    await prisma.review.create({
      data: review,
    })
  }

  console.log(`✅ Seeded ${seedReviews.length} reviews`)

  // Create a sample subscriber for testing
  await prisma.subscriber.deleteMany()
  await prisma.subscriber.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      source: "seed",
    },
  })
  console.log("✅ Created sample subscriber")

  console.log("🎉 Database seeding completed!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
