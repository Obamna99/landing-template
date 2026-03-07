"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { TrustBadges } from "@/components/landing/trust-badges"
import { VideoSection } from "@/components/landing/video-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { About } from "@/components/landing/about"
import { Transformation } from "@/components/landing/transformation"
import { Reviews } from "@/components/landing/reviews"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"
import { FloatingCTA } from "@/components/landing/floating-cta"
import { LeadForm } from "@/components/landing/lead-form"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { RevealButton } from "@/components/landing/reveal-button"

const PHASE_LABELS: Record<number, string> = {
  1: "גלו עוד",
  2: "המשיכו לגלות",
  3: "עוד קצת",
}

type LandingWithRevealProps = {
  visibility: Record<string, boolean>
}

const phaseSlideVariants = {
  hidden: {
    opacity: 0,
    y: 56,
    scale: 0.98,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 0.61, 0.36, 1],
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25 },
  },
}

const phaseChildVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] },
  },
}

export function LandingWithReveal({ visibility }: LandingWithRevealProps) {
  const progressiveReveal = visibility.progressiveReveal === true
  const [revealedPhase, setRevealedPhase] = useState(progressiveReveal ? 0 : 3)
  const phase1Ref = useRef<HTMLDivElement>(null)
  const phase2Ref = useRef<HTMLDivElement>(null)
  const phase3Ref = useRef<HTMLDivElement>(null)

  const effectivePhase = progressiveReveal ? revealedPhase : 3

  const revealNext = (phase: number) => {
    setRevealedPhase((p) => (p < phase ? phase : p))
  }

  useEffect(() => {
    if (!progressiveReveal || revealedPhase < 1) return
    const ref = revealedPhase === 1 ? phase1Ref : revealedPhase === 2 ? phase2Ref : phase3Ref
    const t = setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 380)
    return () => clearTimeout(t)
  }, [progressiveReveal, revealedPhase])

  // Section id -> minimum phase that contains it (so we reveal before scrolling)
  const sectionPhase: Record<string, number> = {
    "how-it-works": 2,
    about: 2,
    transformation: 2,
    reviews: 3,
    faq: 3,
    contact: 3,
  }

  useEffect(() => {
    const onScrollToContact = () => {
      setRevealedPhase(3)
      setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" }), 400)
    }
    window.addEventListener("scroll-to-contact", onScrollToContact)
    return () => window.removeEventListener("scroll-to-contact", onScrollToContact)
  }, [])

  useEffect(() => {
    const onScrollToSection = (e: Event) => {
      const { id } = (e as CustomEvent<{ id: string }>).detail
      if (!id) return
      const phase = sectionPhase[id]
      const doScroll = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
      if (phase != null && progressiveReveal) {
        setRevealedPhase((p) => (p < phase ? phase : p))
        setTimeout(doScroll, phase === 2 ? 450 : 400)
      } else {
        doScroll()
      }
    }
    window.addEventListener("scroll-to-section", onScrollToSection)
    return () => window.removeEventListener("scroll-to-section", onScrollToSection)
  }, [progressiveReveal])

  return (
    <main id="main" className="min-h-screen min-h-[100dvh] overflow-x-hidden" tabIndex={-1}>
      <Header />

      <SectionWrapper sectionId="hero" sectionName="היירו" isFirst visible={visibility.hero}>
        <Hero
          onPrimaryCTAClick={() => {
            setRevealedPhase(3)
            setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" }), 120)
          }}
        />
      </SectionWrapper>

      {/* Phase 1: Trust + Video */}
      {progressiveReveal && effectivePhase < 1 && (
        <RevealButton label={PHASE_LABELS[1]} onReveal={() => revealNext(1)} />
      )}
      <AnimatePresence>
        {effectivePhase >= 1 && (
          <motion.div
            ref={phase1Ref}
            key="phase1"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={phaseSlideVariants}
            className="phase-reveal-focus relative space-y-0 scroll-mt-24"
          >
            <motion.div variants={phaseChildVariants}>
              <SectionWrapper sectionId="trust" sectionName="אמון" visible={visibility.trust}>
                <TrustBadges />
              </SectionWrapper>
            </motion.div>
            <motion.div variants={phaseChildVariants}>
              <SectionWrapper sectionId="video" sectionName="וידאו" visible={visibility.video}>
                <VideoSection />
              </SectionWrapper>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {progressiveReveal && effectivePhase >= 1 && effectivePhase < 2 && (
        <RevealButton label={PHASE_LABELS[2]} onReveal={() => revealNext(2)} />
      )}
      <AnimatePresence>
        {effectivePhase >= 2 && (
          <motion.div
            ref={phase2Ref}
            key="phase2"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={phaseSlideVariants}
            className="phase-reveal-focus relative space-y-0 scroll-mt-24"
          >
            {[
              { id: "how-it-works", name: "איך זה עובד", vis: visibility["how-it-works"], C: HowItWorks },
              { id: "about", name: "אודות", vis: visibility.about, C: About },
              { id: "transformation", name: "טרנספורמציה", vis: visibility.transformation, C: Transformation },
            ].map(({ id, name, vis, C }) => (
              <motion.div key={id} variants={phaseChildVariants}>
                <SectionWrapper sectionId={id} sectionName={name} visible={vis}>
                  <C />
                </SectionWrapper>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {progressiveReveal && effectivePhase >= 2 && effectivePhase < 3 && (
        <RevealButton label={PHASE_LABELS[3]} onReveal={() => revealNext(3)} />
      )}
      <AnimatePresence>
        {effectivePhase >= 3 && (
          <motion.div
            ref={phase3Ref}
            key="phase3"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={phaseSlideVariants}
            className="phase-reveal-focus relative space-y-0 scroll-mt-24"
          >
            {[
              { id: "reviews", name: "ביקורות", vis: visibility.reviews, C: Reviews },
              { id: "faq", name: "שאלות נפוצות", vis: visibility.faq, C: FAQ },
              { id: "contact", name: "יצירת קשר", vis: visibility.contact, C: LeadForm },
            ].map(({ id, name, vis, C }) => (
              <motion.div key={id} id={id === "contact" ? "contact" : undefined} variants={phaseChildVariants}>
                <SectionWrapper sectionId={id} sectionName={name} visible={vis}>
                  <C />
                </SectionWrapper>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer only after all content is revealed (or always in full-scroll mode) */}
      <AnimatePresence>
        {effectivePhase >= 3 && (
          <motion.div
            key="footer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
      {visibility.floatingCta === true && <FloatingCTA />}
    </main>
  )
}
