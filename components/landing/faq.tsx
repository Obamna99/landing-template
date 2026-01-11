"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "framer-motion"
import { useState, useRef } from "react"

const faqs = [
  {
    id: 1,
    question: "מה השירותים שאתם מציעים?",
    answer: "אנחנו מציעים מגוון רחב של שירותים מקצועיים המותאמים לצרכי העסק שלכם. השירותים שלנו כוללים ייעוץ עסקי, פיתוח אסטרטגיה, שיווק דיגיטלי, ועוד. צרו איתנו קשר כדי לשמוע על כל האפשרויות.",
  },
  {
    id: 2,
    question: "כמה זמן לוקח התהליך?",
    answer: "משך הזמן תלוי בסוג הפרויקט והיקפו. פרויקטים קטנים יכולים להסתיים תוך מספר שבועות, בעוד פרויקטים גדולים יותר עשויים לקחת מספר חודשים. בפגישת ההיכרות נוכל לתת לכם הערכת זמן מדויקת יותר.",
  },
  {
    id: 3,
    question: "מה המחירים שלכם?",
    answer: "המחירים שלנו מותאמים לכל פרויקט בנפרד בהתאם לצרכים ולהיקף העבודה. אנחנו מציעים שקיפות מלאה במחירים וללא הפתעות. השאירו פרטים ונחזור אליכם עם הצעת מחיר מפורטת.",
  },
  {
    id: 4,
    question: "איך מתחילים?",
    answer: "התהליך מתחיל בפגישת היכרות קצרה (ללא עלות) בה נבין את הצרכים שלכם. לאחר מכן נבנה תכנית פעולה מותאמת ונציג הצעת מחיר. לאחר אישור, נתחיל לעבוד על הפרויקט שלכם מיד.",
  },
  {
    id: 5,
    question: "האם יש לכם ניסיון בתחום שלי?",
    answer: "עבדנו עם עסקים ממגוון רחב של תחומים ותעשיות. הניסיון המגוון שלנו מאפשר לנו להביא פרספקטיבה רחבה ופתרונות יצירתיים לכל לקוח. בפגישת ההיכרות נשמח לשתף דוגמאות רלוונטיות.",
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
      className="py-16 sm:py-24 bg-gradient-to-b from-neutral-50 to-white"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 text-center mb-8 sm:mb-12">
            שאלות נפוצות
          </h2>

          <div className="space-y-3 sm:space-y-4">
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
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 text-right flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-inset"
                  aria-expanded={openId === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span className="text-base sm:text-lg font-semibold text-neutral-900 flex-1 pl-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="mr-2 sm:mr-4 text-neutral-500 flex-shrink-0"
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
                      <div className="px-5 sm:px-6 pb-4 sm:pb-5 text-neutral-600 leading-relaxed text-sm sm:text-base">
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
