"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useInView } from "framer-motion"
import { siteConfig, heroConfig } from "@/lib/config"
import { getFeatureIcon } from "@/lib/icon-options"

// Animated counter component - optimized
function AnimatedCounter({ target, suffix = "", duration = 1500 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime: number
    let animationFrame: number
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Smoother easing
      const easeOutExpo = 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(easeOutExpo * target))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration])
  
  return <span className="counter-number">{count.toLocaleString()}{suffix}</span>
}

// Rotating text words - design & sales related (default when no override)
const rotatingWords = ["למכור", "להתבלט", "לצמוח", "להרשים"]

/** Parse 1–3 words from highlight string (comma or slash separated). */
function parseHighlightWords(value: string | undefined): string[] {
  if (!value?.trim()) return []
  const parts = value.split(/[,/]+|\s+/).map((s) => s.trim()).filter(Boolean)
  return parts.slice(0, 3)
}

export type HeroOverride = {
  headlineLine1?: string
  highlight?: string
  subheadline?: string
  features?: Array<{ title: string; description: string; icon?: string }>
  ctaPrimaryText?: string
  ctaSecondaryText?: string
  ctaNote?: string
  trustText?: string
}

export function Hero({ override, hideStats = false, onPrimaryCTAClick }: { override?: HeroOverride; hideStats?: boolean; onPrimaryCTAClick?: () => void }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const headlineLine1 = override?.headlineLine1 ?? heroConfig.headline.line1
  const highlightWords = useMemo(() => parseHighlightWords(override?.highlight), [override?.highlight])
  const wordsToRotate = highlightWords.length > 0 ? highlightWords : rotatingWords
  const highlightText = wordsToRotate.length > 1
    ? wordsToRotate[currentWordIndex % wordsToRotate.length]
    : wordsToRotate[0] ?? rotatingWords[currentWordIndex]
  const subheadline = override?.subheadline ?? heroConfig.subheadline

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const blobY0 = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const blobY1 = useTransform(scrollYProgress, [0, 1], ["0%", "45%"])
  const blobY2 = useTransform(scrollYProgress, [0, 1], ["0%", "35%"])
  const blobY3 = useTransform(scrollYProgress, [0, 1], ["0%", "55%"])

  const floatingBlobs = useMemo(() => [
    { id: 0, size: 400, x: 10, y: 20, hue: 195 },
    { id: 1, size: 350, x: 80, y: 60, hue: 70 },
    { id: 2, size: 300, x: 50, y: 80, hue: 195 },
    { id: 3, size: 250, x: 20, y: 50, hue: 70 },
  ], [])

  // Rotate words only when we have 2+ words to rotate
  useEffect(() => {
    if (wordsToRotate.length < 2) return
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % wordsToRotate.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [wordsToRotate.length])

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const stats = useMemo(() => [
    { 
      value: parseInt(siteConfig.stats.clients.replace(/\D/g, '')), 
      suffix: siteConfig.stats.clients.includes('+') ? '+' : '', 
      label: siteConfig.stats.clientsLabel 
    },
    { 
      value: parseInt(siteConfig.stats.years), 
      suffix: '', 
      label: siteConfig.stats.yearsLabel 
    },
    { 
      value: parseInt(siteConfig.stats.satisfaction.replace(/\D/g, '')), 
      suffix: '%', 
      label: siteConfig.stats.satisfactionLabel 
    },
  ], [])

  const blobStyles = [blobY0, blobY1, blobY2, blobY3]
  const valueCardRef = useRef<HTMLDivElement>(null)
  const valueCardInView = useInView(valueCardRef, { once: true, amount: 0.2 })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  useEffect(() => {
    if (typeof window === "undefined") return
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      mouseX.set(x * 24)
      mouseY.set(y * 24)
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [mouseX, mouseY])

  return (
    <section ref={heroRef} className="hero-interactive-bg relative min-h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20 pb-[env(safe-area-inset-bottom)]">
      {/* Animated gradient base */}
      <div className="absolute inset-0 hero-mesh-gradient pointer-events-none" aria-hidden />

      {/* Parallax + mouse-reactive blobs */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ x: mouseX, y: mouseY }}
      >
        {floatingBlobs.map((blob, index) => (
          <motion.div
            key={blob.id}
            className="absolute rounded-full blur-3xl will-change-transform animate-blob"
            data-theme-blob={blob.hue === 195 ? "primary" : "secondary"}
            style={{
              width: blob.size,
              height: blob.size,
              background: blob.hue === 195 
                ? "linear-gradient(135deg, oklch(0.45 0.12 195 / 0.08) 0%, oklch(0.55 0.14 180 / 0.04) 100%)"
                : "linear-gradient(135deg, oklch(0.72 0.17 70 / 0.06) 0%, oklch(0.68 0.15 80 / 0.03) 100%)",
              left: `${blob.x}%`,
              top: `${blob.y}%`,
              animationDelay: `${index * -6}s`,
              animationDuration: "25s",
              y: blobStyles[index],
            }}
          />
        ))}
      </motion.div>

      {/* Subtle grid + noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="hero-noise absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-soft-light" aria-hidden />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 lg:py-28 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        {/* Main Headline - blur reveal */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.08 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="hero-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 leading-[1.1] tracking-tight">
            {headlineLine1}
            <br />
            <span className="relative inline-block">
              {wordsToRotate.length > 1 ? (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWordIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                    className="gradient-text inline-block"
                  >
                    {highlightText}
                  </motion.span>
                </AnimatePresence>
              ) : (
                <span className="gradient-text">{highlightText}</span>
              )}
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
            className="hero-subheadline text-lg sm:text-xl md:text-2xl text-slate-600 font-light max-w-3xl mx-auto px-4 leading-relaxed"
          >
            {subheadline}
          </motion.p>
        </motion.div>

        {!hideStats && (
          <>
            {/* Social Proof Badge - Moved below headline */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
              className="relative z-0 flex justify-center mb-6 sm:mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-teal-100 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-sm">
                <div className="flex -space-x-1.5 rtl:space-x-reverse">
                  {[
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="hero-trust text-[10px] sm:text-xs font-medium text-slate-700">
                    {override?.trustText ?? heroConfig.trustText}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Stats Strip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="relative z-0 grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto mb-8 sm:mb-10"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.1 + index * 0.03 }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        {/* Value Proposition Card – scroll-triggered animation */}
        <motion.div
          ref={valueCardRef}
          initial={{ opacity: 0, y: 32 }}
          animate={valueCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
          className="hero-value-card relative z-0 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/60 p-6 sm:p-8 md:p-10 mb-8 sm:mb-10 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-transparent rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-amber-500/10 to-transparent rounded-tl-full" />
          
          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={valueCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 0.61, 0.36, 1] }}
              className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 text-center"
            >
              מה תקבלו? 
              <span className="text-teal-600"> הכל בחבילה אחת.</span>
            </motion.h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {(() => {
                const defaultFeatures = [
                  { title: "עיצוב מותאם אישית", description: "התמונות שלך, הצבעים שלך, הסגנון שלך", icon: "check" },
                  { title: "מערכת מיילים מקצועית", description: "שלחו אלפי מיילים בקלות ובמחיר נמוך", icon: "mail" },
                  { title: "מחיר שמנצח", description: "זול משמעותית מהמתחרים", icon: "currency" },
                ]
                const features = (override?.features && override.features.length >= 3)
                  ? override.features.slice(0, 3).map((f, i) => ({ ...defaultFeatures[i], ...f }))
                  : defaultFeatures
                const defaultIconKeys = ["check", "mail", "currency"] as const
                return features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 28, scale: 0.96 }}
                  animate={valueCardInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.96 }}
                  transition={{ duration: 0.5, delay: 0.15 + index * 0.1, ease: [0.22, 0.61, 0.36, 1] }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="flex flex-col items-center text-center p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center mb-3 shadow-lg ${index === 1 ? "bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/20" : "bg-gradient-to-br from-teal-500 to-teal-600 shadow-teal-500/20"}`}>
                    {getFeatureIcon(feature.icon, "w-6 h-6") ?? getFeatureIcon(defaultIconKeys[index], "w-6 h-6")}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </motion.div>
              ))
              })()}
            </div>
          </div>
        </motion.div>

        {/* CTA Section – ensure button is never hidden by stats/card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-20 text-center mt-2"
        >
          {/* CTA Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <motion.button
              onClick={() => {
                if (onPrimaryCTAClick) {
                  onPrimaryCTAClick()
                } else {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              }}
              className="hero-cta-primary relative z-10 group px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl text-white w-full sm:w-auto overflow-hidden focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-white"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-teal-600 via-teal-500 to-amber-500/90 opacity-95 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out" />
              <span className="relative z-10 drop-shadow-sm">{override?.ctaPrimaryText ?? heroConfig.cta.primary.text}</span>
            </motion.button>
            
            <motion.button
              onClick={scrollToHowItWorks}
              className="group bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-teal-300 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 w-full sm:w-auto flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{override?.ctaSecondaryText ?? heroConfig.cta.secondary.text}</span>
              <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
          </div>

          {/* Trust Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="hero-cta-note mt-6 text-sm text-slate-500 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {override?.ctaNote ?? "שיחה קצרה ללא עלות"}
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <div className="w-6 h-10 rounded-full border-2 border-slate-300 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-slate-400"
          />
        </div>
      </motion.div>
    </section>
  )
}
