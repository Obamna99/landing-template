"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { trustedByConfig } from "@/lib/config"

// Professional company logos - using text-based logos for easy customization
const clientLogos = [
  { name: "TechCorp", color: "from-blue-600 to-blue-700" },
  { name: "GrowthLabs", color: "from-emerald-600 to-emerald-700" },
  { name: "ScaleUp", color: "from-purple-600 to-purple-700" },
  { name: "InnovateCo", color: "from-orange-600 to-orange-700" },
  { name: "FutureTech", color: "from-cyan-600 to-cyan-700" },
  { name: "NextGen", color: "from-pink-600 to-pink-700" },
  { name: "DataFlow", color: "from-indigo-600 to-indigo-700" },
  { name: "CloudBase", color: "from-teal-600 to-teal-700" },
]

const certifications = [
  {
    name: "Google Partner",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  {
    name: "Meta Partner",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0022 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
      </svg>
    ),
  },
  {
    name: "HubSpot Partner",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.984v-.066A2.198 2.198 0 0017.233.836h-.066a2.198 2.198 0 00-2.198 2.198v.066c0 .87.506 1.62 1.237 1.978v2.856a5.5 5.5 0 00-2.506 1.296l-6.58-5.117a2.2 2.2 0 00.053-.463A2.206 2.206 0 105.13 6.33l6.377 4.96a5.506 5.506 0 00-.015 5.429l-2.616 2.616a1.918 1.918 0 00-1.078-.331 1.927 1.927 0 101.928 1.928c0-.39-.117-.752-.317-1.056l2.621-2.621a5.502 5.502 0 107.134-9.325zm-1.03 7.777a2.698 2.698 0 11.002-5.396 2.698 2.698 0 01-.002 5.396z"/>
      </svg>
    ),
  },
  {
    name: "SSL מאובטח",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
]

const pressLogos = ["Forbes Israel", "Calcalist", "Globes", "TheMarker", "Geektime"]

export function TrustBadges() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <section
      ref={ref}
      className="py-12 sm:py-16 bg-white border-y border-slate-100"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* "As seen in" Press Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-sm text-slate-500 mb-6">כפי שנראינו ב:</p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            {pressLogos.map((logo, index) => (
              <motion.div
                key={logo}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="text-lg sm:text-xl font-bold text-slate-300 hover:text-slate-400 transition-colors cursor-default"
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Client Logos - CSS-only Infinite Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <p className="text-center text-sm text-slate-500 mb-6">{trustedByConfig.title}</p>
          
          {/* Marquee Container */}
          <div className="relative overflow-hidden">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            {/* Scrolling Track */}
            <div className="flex animate-marquee hover:pause-animation">
              {/* First set of logos */}
              {clientLogos.map((logo, index) => (
                <div
                  key={`first-${index}`}
                  className="flex-shrink-0 mx-4 sm:mx-6"
                >
                  <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-5 py-3 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${logo.color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                      {logo.name.charAt(0)}
                    </div>
                    <span className="text-slate-700 font-medium whitespace-nowrap">{logo.name}</span>
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {clientLogos.map((logo, index) => (
                <div
                  key={`second-${index}`}
                  className="flex-shrink-0 mx-4 sm:mx-6"
                >
                  <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-5 py-3 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${logo.color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                      {logo.name.charAt(0)}
                    </div>
                    <span className="text-slate-700 font-medium whitespace-nowrap">{logo.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Certifications & Trust Seals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-3 sm:gap-4"
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-50 border border-slate-100 text-slate-600 hover:border-teal-200 hover:bg-teal-50/50 transition-colors cursor-default"
            >
              <span className="text-teal-600">{cert.icon}</span>
              <span className="text-sm font-medium">{cert.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Guarantee Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl px-6 py-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-right">
              <div className="font-bold text-amber-900">{trustedByConfig.guarantee.title}</div>
              <div className="text-sm text-amber-700">{trustedByConfig.guarantee.description}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CSS for marquee animation */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
          will-change: transform;
        }
        
        .animate-marquee:hover,
        .pause-animation {
          animation-play-state: paused;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
