"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { aboutConfig } from "@/lib/config"

// Icon mapping
const iconMap: Record<string, ReactNode> = {
  badge: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  user: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  chart: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
}

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="about"
      ref={ref}
      className="py-12 sm:py-16 lg:py-24 bg-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-teal-50/50 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block text-teal-600 font-semibold text-sm uppercase tracking-wider mb-3"
            >
              {aboutConfig.badge}
            </motion.span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
              {aboutConfig.headline}
              <span className="gradient-text">{aboutConfig.headlineHighlight}</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto px-4">
              {aboutConfig.subheadline}
            </p>
          </div>

          {/* Founder Story Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative bg-gradient-to-br from-slate-50 via-white to-teal-50/30 rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg border border-slate-100 mb-12 sm:mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              {/* Founder Image */}
              <div className="lg:col-span-2 flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                    <img
                      src={aboutConfig.founder.image}
                      alt={aboutConfig.founder.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl -z-10" />
                  <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg -z-10" />
                </div>
              </div>
              
              {/* Story Content */}
              <div className="lg:col-span-3">
                <blockquote className="text-lg sm:text-xl text-slate-700 leading-relaxed mb-6">
                  <span className="text-4xl text-teal-300 font-serif leading-none">"</span>
                  {aboutConfig.founder.quote}
                </blockquote>
                
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-bold text-slate-900 text-lg">{aboutConfig.founder.name}</div>
                    <div className="text-slate-500 text-sm">{aboutConfig.founder.role}</div>
                  </div>
                  {aboutConfig.founder.linkedin && (
                    <>
                      <div className="h-8 w-px bg-slate-200" />
                      <a 
                        href={aboutConfig.founder.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                      >
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        <span className="text-sm text-slate-500">עקבו אחריי</span>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timeline - Our Journey */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-10 sm:mb-14 lg:mb-16"
          >
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 text-center mb-6 sm:mb-8">המסע שלנו</h3>
            
            {/* Desktop Timeline */}
            <div className="hidden sm:block relative">
              {/* Timeline container with fixed height for proper dot positioning */}
              <div className="relative pt-6">
                {/* Timeline line - positioned at top where dots will be */}
                <div className="absolute top-6 left-4 right-4 lg:left-8 lg:right-8 h-0.5 bg-gradient-to-l from-teal-500 via-teal-300 to-amber-400" />
                
                <div className="grid grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {aboutConfig.timeline.map((milestone, index) => (
                    <motion.div
                      key={milestone.year}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="relative flex flex-col items-center"
                    >
                      {/* Dot on timeline - centered at top */}
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white border-3 sm:border-4 border-teal-500 z-10 shadow-sm" />
                      
                      {/* Card below the dot */}
                      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-md border border-slate-100 mt-4 w-full text-center hover:shadow-lg transition-shadow">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text mb-1 sm:mb-2">{milestone.year}</div>
                        <p className="text-[10px] sm:text-xs lg:text-sm text-slate-600 leading-relaxed">{milestone.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Mobile Timeline - Vertical */}
            <div className="sm:hidden space-y-4">
              {aboutConfig.timeline.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white rounded-xl p-4 shadow-md border border-slate-100 flex items-center gap-4">
                    <div className="text-2xl font-bold gradient-text flex-shrink-0">{milestone.year}</div>
                    <div className="h-8 w-px bg-slate-200" />
                    <p className="text-xs text-slate-600 leading-relaxed">{milestone.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trust Strip - Enhanced */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {aboutConfig.trustItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                className="group relative bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center hover:shadow-xl transition-all duration-300 overflow-hidden"
                whileHover={{ y: -6 }}
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  {/* Stat Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-br from-teal-500 to-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                    {item.stat} {item.statLabel}
                  </div>
                  
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {iconMap[item.icon] || iconMap.badge}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA - Why Wait */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-12 sm:mt-16 text-center"
          >
            <p className="text-lg text-slate-600 mb-4">
              {aboutConfig.ctaText}
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
              <span>{aboutConfig.ctaButton}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
