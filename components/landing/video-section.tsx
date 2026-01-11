"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const VIDEO_ID = "dQw4w9WgXcQ" // Placeholder - replace with actual video ID

export function VideoSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      id="video"
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
            הכירו אותנו בסרטון קצר
          </h2>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-200/50 bg-neutral-100">
            <div className="aspect-video">
              {/* YouTube Embed */}
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${VIDEO_ID}?rel=0&modestbranding=1`}
                title="הכירו את העסק שלנו"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center text-neutral-600 mt-4 sm:mt-6 text-sm sm:text-base px-4"
          >
            צפו בסרטון כדי להכיר את הצוות שלנו ואת השירותים שאנחנו מציעים
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
