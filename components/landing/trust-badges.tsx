"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { trustedByConfig } from "@/lib/config"

// Client logos - replace /placeholder-logo.svg with actual client logo images
// Add your client logos to /public/logos/ folder
const clientLogos = [
  { name: "לקוח 1", logo: "/placeholder-logo.svg" },
  { name: "לקוח 2", logo: "/placeholder-logo.svg" },
  { name: "לקוח 3", logo: "/placeholder-logo.svg" },
  { name: "לקוח 4", logo: "/placeholder-logo.svg" },
  { name: "לקוח 5", logo: "/placeholder-logo.svg" },
  { name: "לקוח 6", logo: "/placeholder-logo.svg" },
]

const certifications = [
  {
    name: "אבטחה מלאה",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    name: "תמיכה מלאה",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    name: "אחריות על העבודה",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
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

export function TrustBadges() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <section
      ref={ref}
      className="py-12 sm:py-16 bg-white border-y border-slate-100"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">{trustedByConfig.title}</h3>
          <p className="text-sm text-slate-500">{trustedByConfig.subtitle}</p>
        </motion.div>

        {/* Client Logos - Infinite Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          
          {/* Marquee Container */}
          <div className="relative overflow-hidden py-4">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            {/* Scrolling Track */}
            <div className="marquee-container">
              <div className="marquee-track">
                {/* First set of logos */}
                {clientLogos.map((logo, index) => (
                  <div
                    key={`first-${index}`}
                    className="marquee-item"
                  >
                    <div className="relative h-10 w-24 sm:h-12 sm:w-32 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300">
                      <Image
                        src={logo.logo}
                        alt={logo.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {clientLogos.map((logo, index) => (
                  <div
                    key={`second-${index}`}
                    className="marquee-item"
                  >
                    <div className="relative h-10 w-24 sm:h-12 sm:w-32 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300">
                      <Image
                        src={logo.logo}
                        alt={logo.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
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

      </div>

      {/* CSS for marquee animation */}
      <style jsx global>{`
        .marquee-container {
          overflow: hidden;
          width: 100%;
        }
        
        .marquee-track {
          display: flex;
          width: fit-content;
          animation: scroll 20s linear infinite;
        }
        
        .marquee-item {
          flex-shrink: 0;
          padding: 0 24px;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
