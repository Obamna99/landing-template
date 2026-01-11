"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "framer-motion"
import { useState, useRef } from "react"

const faqs = [
  {
    id: 1,
    question: "מה זה אומר 'להקים חנות על שמך'?",
    answer: "אנחנו מקימים עבורך חנות איקומרס מלאה על שמך, עם כל הפרטים האישיים וההגדרות הנדרשות. החנות תירשם על שמך ותהיה בבעלותך, אבל אנחנו נטפל בכל התפעול והניהול הטכני.",
  },
  {
    id: 2,
    question: "מה זה אומר 'הפרדה מלאה בין חנויות'?",
    answer: "כל חנות פועלת באופן עצמאי לחלוטין - אין קשר בין החנויות השונות. זה מבטיח שהמדגמים שלנו יהיו בלתי מוטים סטטיסטית, כי כל חנות מייצגת מקרה נפרד ובלתי תלוי.",
  },
  {
    id: 3,
    question: "מה כולל הטיפול בבירוקרטיה?",
    answer: "אנחנו לוקחים על עצמנו את כל התהליכים המורכבים: רישום העסק, טיפול בהרשאות, הגדרות טכניות, תמיכה שוטפת וכל מה שקשור לניהול היום-יומי של החנות. אתה לא צריך לעשות כלום.",
  },
  {
    id: 4,
    question: "איך עובד התגמול?",
    answer: "תקבל שובר BuyMe בסך 230 ש\"ח מיד עם פתיחת החנות, ובנוסף תקבל אחוזים מההכנסות שאנחנו מייצרים מהחנות שלך. התגמול משולם באופן קבוע ומפורט.",
  },
  {
    id: 5,
    question: "מה קורה למידע שלי?",
    answer: "המידע שלך מאובטח ומוגן. אנחנו מקפידים על פרטיות מקסימלית ומשתמשים במידע רק למטרות הנדרשות להקמת החנות ולניהול השותפות. אנחנו לא משתפים את המידע עם גורמים חיצוניים.",
  },
]

export function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [openId, setOpenId] = useState<number | null>(null)

  const toggleQuestion = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section
      id="faq"
      ref={ref}
      className="py-24 bg-gradient-to-b from-neutral-50 to-white"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 text-center mb-12">
            שאלות נפוצות
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md border border-neutral-200/50 overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(faq.id)}
                  className="w-full px-6 py-5 text-right flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-inset"
                  aria-expanded={openId === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span className="text-lg font-semibold text-neutral-900 flex-1">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="mr-4 text-neutral-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-neutral-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

