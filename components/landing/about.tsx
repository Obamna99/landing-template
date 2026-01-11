"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const trustItems = [
  {
    title: "שקיפות",
    description: "כל התהליכים והתנאים ברורים ומוגדרים מראש",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: "פרטיות",
    description: "המידע שלך מוגן ומאובטח, אנחנו מקפידים על אבטחת מידע מקסימלית",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "תמיכה אישית",
    description: "צוות מקצועי זמין עבורך לכל שאלה או בקשה",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
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
      className="py-24 bg-white"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 text-center mb-12">
            עלינו
          </h2>

          <div className="bg-gradient-to-br from-neutral-50 to-orange-50/30 rounded-2xl p-8 md:p-12 shadow-lg border border-neutral-200/50 mb-12">
            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed text-center max-w-3xl mx-auto">
              אנחנו צוות של חוקרים ומפתחים המתמחים בבניית מודלי פרדיקציה מתקדמים לעולם האיקומרס.
              המטרה שלנו היא ליצור כלים חכמים שיעזרו לעסקים להבין טוב יותר את השוק ולקבל החלטות מושכלות.
              אנחנו מאמינים בשקיפות, בפרטיות ובשותפות אמיתית עם כל מי שמצטרף אלינו לדרך.
            </p>
          </div>

          {/* Trust Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                className="bg-white rounded-2xl p-6 shadow-md border border-neutral-200/50 text-center hover:shadow-lg transition-all duration-300 group"
                whileHover={{ y: -4 }}
              >
                <div className="text-orange-500 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
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

