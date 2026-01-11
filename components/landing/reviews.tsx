"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Marquee from "react-fast-marquee"

interface Review {
  id: number
  name: string
  description: string
  image: string
}

const reviews: Review[] = [
  {
    id: 1,
    name: "שרה כהן",
    description: "שירות מעולה מההתחלה ועד הסוף. הצוות מקצועי ואדיב, ממליצה בחום!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "דוד לוי",
    description: "מקצועיים, אמינים ויסודיים. קיבלתי בדיוק את מה שחיפשתי ואף יותר.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "מיכל אברהם",
    description: "התוצאות מדברות בעד עצמן. העסק שלי צמח משמעותית בזכותם.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "יוסי מזרחי",
    description: "תמיכה יוצאת מן הכלל ואיכות מעולה. ממליץ לכל מי שמחפש שירות אמיתי.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "רונית שמעון",
    description: "תהליך שקוף ופשוט, והתוצאות פשוט מדהימות. חברה שאפשר לסמוך עליה.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "אלון גולן",
    description: "שיתוף פעולה מצוין מתחילת הדרך. הבינו את הצרכים שלי מהר מאוד.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 7,
    name: "נועה ברק",
    description: "תשומת לב יוצאת דופן לפרטים הקטנים. רואים שהם באמת אכפתיים.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 8,
    name: "עומר דהן",
    description: "ההחלטה הטובה ביותר שקיבלתי לעסק שלי. מומלץ מאוד!",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 9,
    name: "תמר אשכנזי",
    description: "צוות מקצועי שמבין את הצרכים של הלקוחות. ממליצה בחום לכולם!",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 10,
    name: "איתי פרידמן",
    description: "הפתרון המושלם לעסק שלי. חסכתי המון זמן וכסף בזכותם.",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 11,
    name: "ליאת מור",
    description: "שירות ברמה הגבוהה ביותר. תמיד זמינים ומוכנים לעזור.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 12,
    name: "גיא רוזנברג",
    description: "עבודה מקצועית ויסודית. הם באמת דואגים להצלחה של הלקוחות.",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 13,
    name: "מאיה חיים",
    description: "גיליתי אותם דרך חבר והם שינו לי את העסק. פשוט מדהימים!",
    image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=150&h=150&fit=crop&crop=face",
  },
]

function ReviewCard({ review }: { review: Review }) {
  return (
    <div 
      className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-neutral-200/50 mx-2 sm:mx-3 hover:shadow-xl transition-shadow duration-300" 
      dir="rtl"
    >
      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <img
          src={review.image}
          alt={review.name}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-orange-100"
        />
        <div>
          <h4 className="font-semibold text-neutral-900 text-base sm:text-lg">{review.name}</h4>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      <p className="text-neutral-600 leading-relaxed text-sm sm:text-[15px]">&ldquo;{review.description}&rdquo;</p>
    </div>
  )
}

export function Reviews() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="reviews"
      ref={ref}
      className="py-16 sm:py-24 bg-gradient-to-b from-white to-neutral-50 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            מה אומרים עלינו
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto px-4">
            הלקוחות שלנו הם השגרירים הטובים ביותר שלנו
          </p>
        </motion.div>
      </div>

      {/* Marquee with react-fast-marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Marquee
          speed={40}
          pauseOnHover={true}
          gradient={true}
          gradientColor="white"
          gradientWidth={100}
        >
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </Marquee>
      </motion.div>
    </section>
  )
}
