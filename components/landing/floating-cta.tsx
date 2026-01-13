"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { siteConfig, floatingCtaConfig, headerConfig } from "@/lib/config"

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isContactVisible, setIsContactVisible] = useState(false)

  useEffect(() => {
    if (!floatingCtaConfig.show) return

    const handleScroll = () => {
      // Show after scrolling past hero section (about 100vh)
      const scrollY = window.scrollY
      const heroHeight = window.innerHeight
      
      setIsVisible(scrollY > heroHeight * 0.6)
      
      // Hide when contact form is visible
      const contactSection = document.getElementById("contact")
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect()
        setIsContactVisible(rect.top < window.innerHeight && rect.bottom > 0)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleCTAClick = () => {
    if (floatingCtaConfig.type === "whatsapp") {
      const message = encodeURIComponent(floatingCtaConfig.message)
      window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=${message}`, "_blank")
    } else if (floatingCtaConfig.type === "phone") {
      window.location.href = `tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`
    } else {
      const element = document.getElementById("contact")
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  // Don't show when contact form is visible or when near top, or if disabled in config
  if (!floatingCtaConfig.show || !isVisible || isContactVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:hidden safe-area-inset-bottom"
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-200 p-3">
          <div className="flex items-center gap-3">
            {/* Mini stats */}
            <div className="flex-1 flex items-center gap-2">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {[
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div className="text-xs">
                <div className="font-medium text-slate-900">{siteConfig.stats.clients} {siteConfig.stats.clientsLabel}</div>
                <div className="text-slate-500 flex items-center gap-1">
                  <span className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-2.5 h-2.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </span>
                  4.9
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <motion.button
              onClick={handleCTAClick}
              className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-teal-500/20 whitespace-nowrap"
              whileTap={{ scale: 0.97 }}
            >
              {floatingCtaConfig.text || headerConfig.ctaButton}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
