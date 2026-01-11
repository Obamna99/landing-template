"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const trustItems = [
  {
    title: "ניסיון מוכח",
    description: "שנים של ניסיון בתחום עם מאות לקוחות מרוצים",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: "שירות אישי",
    description: "צוות מקצועי זמין עבורכם לכל שאלה או בקשה",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    title: "מחירים הוגנים",
    description: "שקיפות מלאה במחירים ללא הפתעות",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="about"
      ref={ref}
      className="py-16 sm:py-24 bg-white"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 text-center mb-8 sm:mb-12">
            עלינו
          </h2>

          <div className="bg-gradient-to-br from-neutral-50 to-orange-50/30 rounded-2xl p-6 sm:p-8 md:p-12 shadow-lg border border-neutral-200/50 mb-8 sm:mb-12">
            <p className="text-base sm:text-lg md:text-xl text-neutral-700 leading-relaxed text-center max-w-3xl mx-auto">
              אנחנו צוות של מומחים עם תשוקה אמיתית למה שאנחנו עושים. המטרה שלנו היא לספק את השירות הטוב ביותר ללקוחות שלנו, תוך שמירה על סטנדרטים גבוהים של איכות ומקצועיות.
              <br /><br />
              אנחנו מאמינים ביחסים ארוכי טווח עם הלקוחות שלנו ופועלים בשקיפות מלאה. כל פרויקט מקבל יחס אישי ומותאם לצרכים הספציפיים שלכם.
            </p>
          </div>

          {/* Trust Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {trustItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-neutral-200/50 text-center hover:shadow-lg transition-all duration-300 group"
                whileHover={{ y: -4 }}
              >
                <div className="text-orange-500 mb-3 sm:mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
