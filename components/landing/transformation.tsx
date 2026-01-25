"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"

const beforeAfterItems = [
  {
    before: {
      title: "לפני",
      items: [
        "אתר ישן ואיטי",
        "לא מותאם למובייל",
        "עלויות גבוהות על שיווק במייל",
        "עיצוב גנרי שנראה כמו כולם",
        "פחות פניות מהאתר",
      ],
    },
    after: {
      title: "אחרי",
      items: [
        "דף נחיתה מהיר ומודרני",
        "מושלם על כל מסך ומכשיר",
        "חיסכון משמעותי על מיילים",
        "עיצוב מותאם אישית לעסק שלך",
        "יותר פניות ולידים איכותיים",
      ],
    },
  },
]

const transformationStories = [
  {
    emoji: "💆",
    label: "מכון יופי",
    before: "עלויות גבוהות על מיילים",
    after: "חיסכון משמעותי על מיילים",
    time: "שבוע",
    growth: "חיסכון",
  },
  {
    emoji: "🏠",
    label: "סוכן נדל\"ן",
    before: "5 פניות מהאתר בחודש",
    after: "35 פניות מהאתר בחודש",
    time: "חודש",
    growth: "+600%",
  },
  {
    emoji: "🍽️",
    label: "מסעדה",
    before: "אתר שנטען תוך 3 שניות",
    after: "דף שנטען בפחות משניה",
    time: "5 ימים",
    growth: "מהיר x7",
  },
]

export function Transformation() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeStory, setActiveStory] = useState(0)

  return (
    <section
      id="transformation"
      ref={ref}
      className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-teal-50/30 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block text-teal-600 font-semibold text-sm uppercase tracking-wider mb-3"
          >
            לפני ואחרי
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            מאתר ישן ואיטי—
            <span className="gradient-text"> לדף נחיתה שמוכר</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            הנה מה שקורה כשמחליפים את האתר הישן בדף נחיתה מקצועי
          </p>
        </motion.div>

        {/* Before → After Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16"
        >
          {/* Before Card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-red-50 to-slate-50 rounded-3xl p-6 sm:p-8 border border-red-100 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">לפני</h3>
                  <p className="text-sm text-slate-500">האתר הישן</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {beforeAfterItems[0].before.items.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white/60 rounded-xl"
                  >
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Arrow connector - visible on md+ */}
            <div className="hidden md:block absolute top-1/2 -left-4 -translate-y-1/2 z-10">
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center shadow-lg"
              >
                <svg className="w-4 h-4 text-white rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* After Card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">אחרי</h3>
                  <p className="text-sm text-slate-500">עם דף נחיתה חדש</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {beforeAfterItems[0].after.items.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white/60 rounded-xl"
                  >
                    <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile arrow (visible on small screens) */}
        <div className="flex justify-center -mt-4 mb-8 md:hidden">
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center shadow-lg"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>

        {/* Real Transformation Stories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-8">
            מספרים שמדברים בעד עצמם
          </h3>
          
          {/* Story Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
            {transformationStories.map((story, index) => (
              <motion.button
                key={story.label}
                onClick={() => setActiveStory(index)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-medium text-sm transition-all ${
                  activeStory === index
                    ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-lg">{story.emoji}</span>
                <span>{story.label}</span>
              </motion.button>
            ))}
          </div>
          
          {/* Active Story Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6"
            >
              {/* Before metric */}
              <div className="bg-red-50 rounded-2xl p-5 text-center border border-red-100">
                <p className="text-sm text-red-600 font-medium mb-2">לפני</p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">
                  {transformationStories[activeStory].before}
                </p>
              </div>
              
              {/* Arrow */}
              <div className="hidden sm:flex items-center justify-center">
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg className="w-8 h-8 text-teal-500 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.div>
              </div>
              
              {/* After metric */}
              <div className="bg-teal-50 rounded-2xl p-5 text-center border border-teal-100">
                <p className="text-sm text-teal-600 font-medium mb-2">אחרי</p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">
                  {transformationStories[activeStory].after}
                </p>
              </div>
              
              {/* Results */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-5 text-center border border-amber-200">
                <div className="text-3xl sm:text-4xl font-bold text-amber-600 mb-1">
                  {transformationStories[activeStory].growth}
                </div>
                <p className="text-sm text-amber-700">
                  תוך {transformationStories[activeStory].time}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-10 sm:mt-12 text-center"
        >
          <p className="text-lg text-slate-600 mb-4">
            האתר הבא יכול להיות <span className="font-semibold text-slate-800">שלכם</span>
          </p>
          <motion.button
            onClick={() => {
              const element = document.getElementById("contact")
              if (element) element.scrollIntoView({ behavior: "smooth", block: "start" })
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-teal-500/20 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>רוצים דף נחיתה כזה?</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
