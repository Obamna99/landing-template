"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { howItWorksConfig } from "@/lib/config"

// Icon mapping
const iconMap: Record<string, ReactNode> = {
  chat: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  clipboard: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  lightning: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  chart: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
}

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const steps = howItWorksConfig.steps

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block text-teal-600 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3"
          >
            {howItWorksConfig.badge}
          </motion.span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
            {howItWorksConfig.headline}
            <span className="gradient-text">{howItWorksConfig.headlineHighlight}</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            {howItWorksConfig.subheadline}
          </p>
        </motion.div>

        {/* Steps - Desktop Timeline */}
        <div className="hidden lg:block">
          {/* Row 1: Top cards (steps 2 and 4, indices 1 and 3) */}
          <div className="grid grid-cols-4 gap-6 mb-4">
            {steps.map((step, index) => {
              const isTopCard = index % 2 === 1 // indices 1, 3 are top cards
              if (!isTopCard) return <div key={step.id} /> // Empty placeholder
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: -30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      {iconMap[step.icon] || iconMap.chat}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">שלב {step.id}</span>
                        {step.highlight && (
                          <span className="inline-block bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{step.highlight}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{step.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {step.duration}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Row 2: Timeline with connectors and dots */}
          <div className="relative h-16 my-2">
            {/* Horizontal line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-l from-teal-500 via-teal-300 to-amber-400 rounded-full -translate-y-1/2" />
            
            {/* Dots and vertical connectors */}
            <div className="grid grid-cols-4 gap-6 h-full">
              {steps.map((step, index) => {
                const isTopCard = index % 2 === 1
                return (
                  <div key={step.id} className="relative flex justify-center">
                    {/* Vertical connector */}
                    <div className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-teal-400 ${
                      isTopCard ? 'top-0 h-1/2' : 'bottom-0 h-1/2'
                    }`} />
                    {/* Dot */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-4 border-teal-500 shadow-md z-10" />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Row 3: Bottom cards (steps 1 and 3, indices 0 and 2) */}
          <div className="grid grid-cols-4 gap-6 mt-4">
            {steps.map((step, index) => {
              const isBottomCard = index % 2 === 0 // indices 0, 2 are bottom cards
              if (!isBottomCard) return <div key={step.id} /> // Empty placeholder
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      {iconMap[step.icon] || iconMap.chat}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">שלב {step.id}</span>
                        {step.highlight && (
                          <span className="inline-block bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{step.highlight}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{step.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {step.duration}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Steps - Mobile/Tablet */}
        <div className="lg:hidden">
          {/* Horizontal scrollable cards for tablet */}
          <div className="hidden sm:flex gap-4 overflow-x-auto pb-4 px-1 snap-x snap-mandatory scrollbar-hide">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="flex-shrink-0 w-[280px] snap-center"
              >
                <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-100 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                      {iconMap[step.icon] || iconMap.chat}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                          שלב {step.id}
                        </span>
                        {step.highlight && (
                          <span className="inline-block bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {step.highlight}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    {step.description}
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {step.duration}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Vertical stack for mobile */}
          <div className="sm:hidden space-y-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                className="relative"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-14 right-5.5 w-0.5 h-[calc(100%+0.75rem)] bg-gradient-to-b from-teal-300 to-teal-100" />
                )}
                
                <div className="bg-white rounded-xl p-4 shadow-md border border-slate-100 relative">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center shadow-md">
                        <div className="scale-75">{iconMap[step.icon] || iconMap.chat}</div>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">
                          שלב {step.id}
                        </span>
                        {step.highlight && (
                          <span className="inline-block bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            {step.highlight}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-sm font-bold text-slate-900 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">
                        {step.description}
                      </p>
                      
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {step.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-8 sm:mt-12 lg:mt-16 text-center"
        >
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-3 sm:mb-4">
            {howItWorksConfig.ctaText}
            <span className="font-semibold text-teal-600">{howItWorksConfig.ctaHighlight}</span>
          </p>
          <motion.button
            onClick={() => {
              const element = document.getElementById("contact")
              if (element) element.scrollIntoView({ behavior: "smooth", block: "start" })
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg shadow-lg shadow-teal-500/20 hover:shadow-xl transition-all duration-300 active:scale-95"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>{howItWorksConfig.ctaButton}</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
