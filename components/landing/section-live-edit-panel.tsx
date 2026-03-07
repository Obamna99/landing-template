"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { PreviewTheme } from "@/components/landing/preview-theme"
import { Hero } from "@/components/landing/hero"
import { About } from "@/components/landing/about"
import { VideoSection } from "@/components/landing/video-section"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"

export type SectionsForPreview = {
  hero: { headlineLine1: string; highlight: string; subheadline: string }
  about: {
    headline: string
    headlineHighlight?: string
    subheadline: string
    founder: { quote: string; imageUrl: string; name: string; role: string; linkedin: string }
  }
  features: Array<{ title: string; description: string }>
  video: { videoId: string; customVideoUrl: string }
  faq: Array<{ question: string; answer: string }>
  footer: {
    phone: string
    email: string
    address: string
    hoursWeekdays?: string
    hoursFriday?: string
    description: string
    copyright: string
    termsUrl?: string
    privacyUrl?: string
    quickLinks?: Array<{ label: string; href: string }>
    social: { facebook: string; instagram: string; linkedin: string; whatsapp: string }
  }
  theme: { primaryColor: string; secondaryColor: string; themeMode?: "light" | "dark" }
  journeyNotes?: string
}

const SECTION_LABELS: Record<number, { label: string; icon: string }> = {
  1: { label: "פרטי התקשרות", icon: "📞" },
  2: { label: "תוכן לאתר", icon: "📦" },
  3: { label: "היירו", icon: "🎯" },
  4: { label: "אודות", icon: "👤" },
  5: { label: "וידאו", icon: "🎬" },
  6: { label: "שאלות נפוצות", icon: "❓" },
  7: { label: "פוטר ויצירת קשר", icon: "📞" },
}

/** Step number -> section id to scroll to and highlight in the demo */
const STEP_TO_SECTION: Record<number, string> = {
  1: "hero",
  2: "hero",
  3: "hero",
  4: "about",
  5: "video",
  6: "faq",
  7: "footer",
}

function DemoSitePreview({
  currentStep,
  sections,
  mobile = false,
}: {
  currentStep: number
  sections: SectionsForPreview
  mobile?: boolean
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    hero: heroRef,
    about: aboutRef,
    video: videoRef,
    faq: faqRef,
    footer: footerRef,
  }

  const activeSection = STEP_TO_SECTION[currentStep] ?? "hero"

  useEffect(() => {
    const ref = sectionRefs[activeSection]?.current
    if (ref && scrollRef.current) {
      const timer = setTimeout(() => {
        ref.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [currentStep, activeSection])

  const primary = sections.theme?.primaryColor?.trim() || "#0d9488"
  const secondary = sections.theme?.secondaryColor?.trim() || "#f59e0b"
  const themeMode = sections.theme?.themeMode || "light"
  const isDark = themeMode === "dark"

  const highlightClass = "ring-2 ring-teal-500 ring-offset-2 rounded-xl transition-all duration-300"

  return (
    <div className={isDark ? "dark site-theme-dark" : ""}>
      <PreviewTheme primaryColor={primary} secondaryColor={secondary}>
        <div
          ref={scrollRef}
          className={`overflow-auto rounded-xl border shadow-inner ${mobile ? "max-h-[55dvh] min-h-[280px]" : "max-h-[70vh]"} ${isDark ? "border-slate-600 bg-[var(--background)]" : "border-slate-200 bg-white"}`}
          style={{ minHeight: mobile ? 280 : 320 }}
        >
        <div ref={heroRef} className={activeSection === "hero" ? highlightClass : ""} data-section="hero">
          <Hero
            override={{
              headlineLine1: sections.hero?.headlineLine1,
              highlight: sections.hero?.highlight,
              subheadline: sections.hero?.subheadline,
              features: sections.features,
            }}
            hideStats={false}
          />
        </div>
        <div ref={aboutRef} className={activeSection === "about" ? highlightClass : ""} data-section="about">
          <About
            override={{
              headline: sections.about?.headline,
              headlineHighlight: sections.about?.headlineHighlight,
              subheadline: sections.about?.subheadline,
              founder: sections.about?.founder,
            }}
          />
        </div>
        <div ref={videoRef} className={activeSection === "video" ? highlightClass : ""} data-section="video">
          <VideoSection
            override={{
              videoId: sections.video?.videoId,
              customVideoUrl: sections.video?.customVideoUrl,
            }}
          />
        </div>
        <div ref={faqRef} className={activeSection === "faq" ? highlightClass : ""} data-section="faq">
          <FAQ override={{ questions: sections.faq ?? [] }} />
        </div>
        <div ref={footerRef} className={activeSection === "footer" ? highlightClass : ""} data-section="footer">
          <Footer
            override={{
              phone: sections.footer?.phone,
              email: sections.footer?.email,
              address: sections.footer?.address,
              hoursWeekdays: sections.footer?.hoursWeekdays,
              hoursFriday: sections.footer?.hoursFriday,
              description: sections.footer?.description,
              copyright: sections.footer?.copyright,
              termsUrl: sections.footer?.termsUrl,
              privacyUrl: sections.footer?.privacyUrl,
              quickLinks: sections.footer?.quickLinks,
              social: sections.footer?.social,
            }}
          />
        </div>
        </div>
      </PreviewTheme>
    </div>
  )
}

export function SectionLiveEditPanel({
  currentStep,
  sections,
  className = "",
  mobile = false,
}: {
  currentStep: number
  sections: SectionsForPreview
  className?: string
  mobile?: boolean
}) {
  const info = currentStep >= 1 && currentStep <= 7 ? SECTION_LABELS[currentStep] : null

  if (!info) return null

  return (
    <motion.aside
      initial={{ opacity: 0, x: mobile ? 0 : 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={`shrink-0 ${className}`}
    >
      <div className={mobile ? "relative" : "sticky top-24 md:top-28"}>
        <div className="relative rounded-2xl border-2 border-teal-200/80 bg-gradient-to-b from-teal-50/90 to-white p-4 shadow-xl shadow-teal-500/10 overflow-hidden">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.1 }}
            className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md z-10"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            LIVE
          </motion.div>

          <div className="flex items-center justify-center gap-2 mb-3 pt-2">
            <span className="text-2xl" aria-hidden>
              {info.icon}
            </span>
            <p className="text-sm font-bold text-teal-800">עורכים כעת: {info.label}</p>
          </div>
          <p className="text-center text-xs text-slate-500 mb-3">
            האתר שלכם — תצוגה חיה
          </p>

          <DemoSitePreview currentStep={currentStep} sections={sections} mobile={mobile} />

          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-teal-400/10 to-amber-400/5 -z-10 pointer-events-none" />
        </div>
      </div>
    </motion.aside>
  )
}
