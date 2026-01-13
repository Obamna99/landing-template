"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Marquee from "react-fast-marquee"

// Client logos (using placeholder brand representations)
const clientLogos = [
  { name: "טק סטארטאפ", initial: "T" },
  { name: "פיננס פלוס", initial: "F" },
  { name: "ביוטי קו", initial: "B" },
  { name: "סמארט הום", initial: "S" },
  { name: "הלת' טק", initial: "H" },
  { name: "אקו סולושנס", initial: "E" },
  { name: "מדיה גרופ", initial: "M" },
  { name: "דיגיטל אדג'", initial: "D" },
]

const certifications = [
  {
    name: "Google Partner",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  {
    name: "Meta Business Partner",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0022 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
      </svg>
    ),
  },
  {
    name: "ISO 27001",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    name: "SSL מאובטח",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
]

const pressLogos = [
  "Calcalist",
  "Globes",
  "TheMarker",
  "Ynet",
  "Walla",
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
        {/* "As seen in" Press Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-sm text-slate-500 mb-6">כפי שנראינו ב:</p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            {pressLogos.map((logo, index) => (
              <motion.div
                key={logo}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-xl sm:text-2xl font-bold text-slate-300 hover:text-slate-400 transition-colors"
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Client Logos Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-10"
        >
          <p className="text-center text-sm text-slate-500 mb-6">מבית החברות שסומכות עלינו:</p>
          <Marquee
            speed={30}
            gradient={true}
            gradientColor="#ffffff"
            gradientWidth={60}
            pauseOnHover={true}
          >
            {clientLogos.map((logo, index) => (
              <div
                key={index}
                className="mx-6 sm:mx-8 flex items-center gap-3 bg-slate-50 rounded-xl px-5 py-3 border border-slate-100"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                  {logo.initial}
                </div>
                <span className="text-slate-700 font-medium">{logo.name}</span>
              </div>
            ))}
          </Marquee>
        </motion.div>

        {/* Certifications & Trust Seals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center items-center gap-4 sm:gap-6"
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-slate-600 hover:border-teal-200 hover:bg-teal-50 transition-colors"
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
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl px-6 py-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-right">
              <div className="font-bold text-amber-900">התחייבות לשביעות רצון</div>
              <div className="text-sm text-amber-700">לא מרוצים? נתקן או נחזיר—ללא שאלות</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
