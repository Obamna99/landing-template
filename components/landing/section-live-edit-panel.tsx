"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { PreviewTheme } from "@/components/landing/preview-theme"
import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { About } from "@/components/landing/about"
import { VideoSection } from "@/components/landing/video-section"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"
import { getFeatureIcon } from "@/lib/icon-options"

export type SectionsForPreview = {
  header?: {
    name: string
    logoText: string
    logoUrl?: string
    tagline: string
    navLinks: Array<{ id: string; label: string }>
    ctaButton: string
    phone: string
  }
  hero: { headlineLine1: string; highlight: string; subheadline: string }
  about: {
    headline: string
    headlineHighlight?: string
    subheadline: string
    founder: { quote: string; imageUrl: string; name: string; role: string; linkedin: string }
    journeyTitle?: string
    timeline?: Array<{ year: string; text: string }>
    trustItems?: Array<{ title: string; description: string; stat?: string | null; statLabel?: string | null; icon: string }>
    journeyCtaText?: string
    journeyCtaButton?: string
  }
  features: Array<{ title: string; description: string; icon?: string }>
  video: {
    videoId: string
    customVideoUrl: string
    badge?: string
    headline?: string
    headlineHighlight?: string
    subheadline?: string
    highlights?: Array<{ icon: string; text: string }>
    ctaText?: string
    ctaButton?: string
  }
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
  1: { label: "היירו", icon: "🎯" },
  2: { label: "תוכן לאתר", icon: "📦" },
  3: { label: "אודות", icon: "👤" },
  4: { label: "וידאו", icon: "🎬" },
  5: { label: "שאלות נפוצות", icon: "❓" },
  6: { label: "פוטר ויצירת קשר", icon: "📞" },
  7: { label: "פרטי התקשרות", icon: "📞" },
}

/** Step number -> section id (Hero first, contact last) */
const STEP_TO_SECTION: Record<number, string> = {
  1: "hero",
  2: "hero",
  3: "about",
  4: "video",
  5: "faq",
  6: "footer",
  7: "footer",
}

function DemoSitePreview({
  currentStep,
  sections,
  mobile = false,
  previewPhotoUrls = [],
  previewVideoUrl = null,
}: {
  currentStep: number
  sections: SectionsForPreview
  mobile?: boolean
  previewPhotoUrls?: string[]
  previewVideoUrl?: string | null
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  const activeSection = STEP_TO_SECTION[currentStep] ?? "hero"

  const primary = sections.theme?.primaryColor?.trim() || "#0d9488"
  const secondary = sections.theme?.secondaryColor?.trim() || "#f59e0b"
  const themeMode = sections.theme?.themeMode || "light"
  const isDark = themeMode === "dark"

  const highlightClass = "ring-2 ring-teal-500 ring-offset-2 rounded-xl transition-all duration-300"

  // Step 2 compact view: only headline, subheadline, and three feature cards (no scroll)
  const defaultFeatures = [
    { title: "עיצוב מותאם אישית", description: "התמונות שלך, הצבעים שלך, הסגנון שלך", icon: "check" },
    { title: "מערכת מיילים מקצועית", description: "שלחו אלפי מיילים בקלות ובמחיר נמוך", icon: "mail" },
    { title: "מחיר שמנצח", description: "זול משמעותית מהמתחרים", icon: "currency" },
  ]
  const featureCards = (sections.features?.length >= 3 ? sections.features.slice(0, 3).map((f, i) => ({ ...defaultFeatures[i], ...f })) : defaultFeatures) as Array<{ title: string; description: string; icon?: string }>
  const compactHeroStep2 = currentStep === 2 && activeSection === "hero"

  // Render only the active section so the client sees exactly what they're editing, no scroll
  const renderSection = () => {
    switch (activeSection) {
      case "hero":
        if (compactHeroStep2) {
          return (
            <div ref={heroRef} className={`${highlightClass} p-4 sm:p-5`} data-section="hero">
              <div className="space-y-4" dir="rtl">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {sections.hero?.headlineLine1 || "שם האתר / העסק"}
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">
                  {sections.hero?.subheadline || "משפט או שניים על העסק"}
                </p>
                {sections.about?.subheadline?.trim() && (
                  <p className="text-slate-500 text-xs sm:text-sm border-r-2 border-teal-200/60 pr-2 mt-1">
                    {sections.about.subheadline}
                  </p>
                )}
                {(previewPhotoUrls.length > 0 || previewVideoUrl) && (
                  <div className="mt-4 space-y-4">
                    {previewPhotoUrls.length > 0 && (
                      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50/50 p-3">
                        <p className="text-xs font-medium text-slate-500 mb-2">תמונות שתעלו – איך שיופיעו באתר</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                          {previewPhotoUrls.map((url, i) => (
                            <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                              <img
                                src={url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {previewVideoUrl && (
                      <div className="rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
                        <p className="text-xs font-medium text-slate-400 px-3 py-2 bg-slate-800/80">סרטון שתעלו – איך שיופיע באתר</p>
                        <div className="aspect-video">
                          <video
                            src={previewVideoUrl}
                            controls
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {featureCards.map((f, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center text-center p-3 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm"
                    >
                      <div className={`w-10 h-10 rounded-lg text-white flex items-center justify-center mb-2 ${i === 1 ? "bg-gradient-to-br from-amber-500 to-amber-600" : "bg-gradient-to-br from-teal-500 to-teal-600"}`}>
                        {getFeatureIcon(f.icon, "w-5 h-5") ?? getFeatureIcon(["check", "mail", "currency"][i], "w-5 h-5")}
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mb-0.5">{f.title}</h3>
                      <p className="text-xs text-slate-600">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }
        return (
          <>
            {sections.header && (
              <Header override={sections.header} preview hideBranding={false} />
            )}
            <div ref={heroRef} className={highlightClass} data-section="hero">
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
          </>
        )
      case "about":
        return (
          <div ref={aboutRef} className={highlightClass} data-section="about">
            <About override={sections.about ? { ...sections.about } : undefined} />
          </div>
        )
      case "video":
        return (
          <div ref={videoRef} className={highlightClass} data-section="video">
            <VideoSection override={sections.video ? { ...sections.video } : undefined} />
          </div>
        )
      case "faq":
        return (
          <div ref={faqRef} className={highlightClass} data-section="faq">
            <FAQ override={{ questions: sections.faq ?? [] }} />
          </div>
        )
      case "footer":
        return (
          <div ref={footerRef} className={highlightClass} data-section="footer">
            <Footer
              key={`footer-${sections.footer?.phone ?? ""}-${sections.footer?.email ?? ""}-${(sections.footer?.quickLinks?.length ?? 0)}`}
              override={sections.footer ? { ...sections.footer } : undefined}
            />
          </div>
        )
      default:
        return (
          <div ref={heroRef} className={highlightClass} data-section="hero">
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
        )
    }
  }

  const isCompactView = compactHeroStep2
  const previewSizeClass = mobile
    ? "min-h-[280px]"
    : isCompactView
      ? "min-h-0"
      : "flex-1 min-h-0"
  const fillPreview = !mobile && !isCompactView

  return (
    <div className={`${isDark ? "dark site-theme-dark" : ""} ${fillPreview ? "flex flex-col flex-1 min-h-0" : ""}`}>
      <PreviewTheme primaryColor={primary} secondaryColor={secondary} className={fillPreview ? "min-h-0 flex-1 flex flex-col" : undefined}>
        <div
          ref={scrollRef}
          className={`overflow-y-auto overflow-x-hidden rounded-xl border shadow-inner ${previewSizeClass} ${fillPreview ? "flex-1 min-h-0" : ""} ${isDark ? "border-slate-600 bg-[var(--background)]" : "border-slate-200 bg-white"}`}
          style={mobile ? { minHeight: 280 } : isCompactView ? undefined : undefined}
        >
          {renderSection()}
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
  previewPhotoUrls,
  previewVideoUrl,
}: {
  currentStep: number
  sections: SectionsForPreview
  className?: string
  mobile?: boolean
  previewPhotoUrls?: string[]
  previewVideoUrl?: string | null
}) {
  const info = currentStep >= 1 && currentStep <= 7 ? SECTION_LABELS[currentStep] : null

  if (!info) return null

  return (
    <motion.aside
      initial={{ opacity: 0, x: mobile ? 0 : 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={`${className} ${!mobile ? "flex flex-col min-h-0 md:sticky md:top-24 md:max-h-[calc(100vh-6rem)]" : ""}`}
    >
      <div className={mobile ? "relative" : "flex flex-col flex-1 min-h-0 sticky top-24 md:top-28"}>
        <div className="relative flex flex-col flex-1 min-h-0 rounded-2xl border-2 border-teal-200/80 bg-gradient-to-b from-teal-50/90 to-white p-4 shadow-xl shadow-teal-500/10 overflow-hidden">
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

          <div className="flex-1 min-h-0 flex flex-col">
            <DemoSitePreview currentStep={currentStep} sections={sections} mobile={mobile} previewPhotoUrls={previewPhotoUrls} previewVideoUrl={previewVideoUrl} />
          </div>

          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-teal-400/10 to-amber-400/5 -z-10 pointer-events-none" />
        </div>
      </div>
    </motion.aside>
  )
}
