"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { videoConfig } from "@/lib/config"

export function VideoSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isPlaying, setIsPlaying] = useState(false)

  // Generate the correct embed URL based on provider
  const getEmbedUrl = () => {
    switch (videoConfig.provider) {
      case "youtube":
        return `https://www.youtube.com/embed/${videoConfig.videoId}?autoplay=1&rel=0&modestbranding=1`
      case "vimeo":
        return `https://player.vimeo.com/video/${videoConfig.videoId}?autoplay=1&title=0&byline=0&portrait=0`
      case "custom":
        return videoConfig.customVideoUrl || ""
      default:
        return ""
    }
  }

  // Generate thumbnail URL
  const getThumbnailUrl = () => {
    if (videoConfig.thumbnail) return videoConfig.thumbnail
    
    switch (videoConfig.provider) {
      case "youtube":
        return `https://img.youtube.com/vi/${videoConfig.videoId}/maxresdefault.jpg`
      case "vimeo":
        // Vimeo requires API call for thumbnail, using placeholder
        return "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=675&fit=crop"
      default:
        return "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=675&fit=crop"
    }
  }

  if (!videoConfig.show) return null

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
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-block text-teal-600 font-semibold text-sm uppercase tracking-wider mb-3"
            >
              {videoConfig.badge}
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {videoConfig.headline}
              <span className="gradient-text">{videoConfig.headlineHighlight}</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {videoConfig.subheadline}
            </p>
          </div>

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 group"
          >
            {/* Decorative gradient border */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-transparent to-amber-500/20 pointer-events-none z-10 rounded-3xl" />
            
            <div className="aspect-video relative">
              {!isPlaying ? (
                // Custom thumbnail with play button
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  {/* Thumbnail */}
                  <div className="absolute inset-0">
                    <img
                      src={getThumbnailUrl()}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover opacity-60"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  </div>
                  
                  {/* Play button */}
                  <motion.button
                    onClick={() => setIsPlaying(true)}
                    className="relative z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl hover:bg-white transition-all group/play"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Play video"
                  >
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600 mr-[-3px] group-hover/play:text-teal-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    
                    {/* Pulse effect */}
                    <div className="absolute inset-0 rounded-full border-4 border-white/40 animate-ping opacity-75" />
                  </motion.button>
                  
                  {/* Duration badge */}
                  <div className="absolute bottom-4 right-4 z-20 bg-black/70 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full font-medium">
                    1:30
                  </div>
                  
                  {/* Branding overlay */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                // Video Embed
                videoConfig.provider === "custom" && videoConfig.customVideoUrl ? (
                  <video
                    className="w-full h-full object-cover"
                    src={videoConfig.customVideoUrl}
                    autoPlay
                    controls
                    playsInline
                  />
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={getEmbedUrl()}
                    title="Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              )}
            </div>
          </motion.div>

          {/* Video highlights */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {videoConfig.highlights.map((item) => (
              <div
                key={item.text}
                className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
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
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-slate-600 mb-4">
              רוצים אתר כזה לעסק שלכם?
            </p>
            <motion.button
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors"
              whileHover={{ x: -4 }}
            >
              <span>דברו איתנו</span>
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
