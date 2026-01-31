"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "framer-motion"
import { useState, useRef } from "react"
import { siteConfig, faqConfig } from "@/lib/config"

export function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [openId, setOpenId] = useState<number | null>(0) // First one open by default

  const toggleQuestion = (index: number) => {
    setOpenId(openId === index ? null : index)
  }

  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}`

  return (
    <section
      id="faq"
      ref={ref}
      className="py-20 sm:py-28 lg:py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block text-teal-600 font-semibold text-sm uppercase tracking-wider mb-3"
            >
              {faqConfig.badge}
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {faqConfig.headline}
              <span className="gradient-text">{faqConfig.headlineHighlight}</span>
            </h2>
            <p className="text-lg text-slate-600">
              {faqConfig.subheadline}
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3 sm:space-y-4">
            {faqConfig.questions.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${
                  openId === index
                    ? "border-teal-200 shadow-lg shadow-teal-500/5"
                    : "border-slate-100 hover:border-slate-200 hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 text-right flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-inset transition-colors"
                  aria-expanded={openId === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className={`text-base sm:text-lg font-semibold flex-1 pl-4 transition-colors ${
                    openId === index ? "text-teal-700" : "text-slate-900"
                  }`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openId === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mr-2 sm:mr-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      openId === index
                        ? "bg-teal-100 text-teal-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openId === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-slate-600 leading-relaxed text-sm sm:text-base border-t border-slate-100 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Still have questions? CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 sm:mt-12 text-center"
          >
            <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-2xl p-6 sm:p-8 border border-teal-100">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                עדיין יש שאלות?
              </h3>
              <p className="text-slate-600 mb-4">
                {faqConfig.ctaText}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  onClick={() => {
                    const element = document.getElementById("contact")
                    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" })
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{faqConfig.ctaButton}</span>
                </motion.button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
