"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

const VIDEO_ID = "dQw4w9WgXcQ" // Placeholder - replace with actual video ID

export function VideoSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section
      id="video"
      ref={ref}
      className="py-16 sm:py-24 bg-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block text-teal-600 font-semibold text-sm uppercase tracking-wider mb-3"
            >
              צפו בסרטון
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              הכירו אותנו
              <span className="gradient-text"> ב-90 שניות</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              גלו מה מייחד אותנו ואיך נוכל לעזור לעסק שלכם לצמוח
            </p>
          </div>

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 group"
          >
            {/* Decorative gradient border */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-transparent to-amber-500 opacity-20 pointer-events-none" />
            
            <div className="aspect-video relative">
              {!isPlaying ? (
                // Custom thumbnail with play button
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  {/* Background image placeholder */}
                  <div className="absolute inset-0 opacity-30">
                    <img
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=675&fit=crop"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Play button */}
                  <motion.button
                    onClick={() => setIsPlaying(true)}
                    className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:bg-white transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600 mr-[-4px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    
                    {/* Pulse effect */}
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
                  </motion.button>
                  
                  {/* Duration badge */}
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                    1:30
                  </div>
                </div>
              ) : (
                // YouTube Embed
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                  title="הכירו את העסק שלנו"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </motion.div>

          {/* Video highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {[
              { icon: "🎯", text: "הגישה שלנו" },
              { icon: "👥", text: "הצוות" },
              { icon: "📈", text: "התוצאות" },
            ].map((item, index) => (
              <div
                key={item.text}
                className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <span className="text-2xl block mb-1">{item.icon}</span>
                <span className="text-sm text-slate-600 font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA under video */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-8"
          >
            <p className="text-slate-600 mb-4">
              אהבתם את מה שראיתם?
            </p>
            <motion.button
              onClick={() => {
                const element = document.getElementById("contact")
                if (element) element.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
              whileHover={{ x: -4 }}
            >
              <span>בואו נדבר</span>
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
