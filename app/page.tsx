import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { TrustBadges } from "@/components/landing/trust-badges"
import { VideoSection } from "@/components/landing/video-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { About } from "@/components/landing/about"
import { Transformation } from "@/components/landing/transformation"
import { Reviews } from "@/components/landing/reviews"
import { FAQ } from "@/components/landing/faq"
import { LeadForm } from "@/components/landing/lead-form"
import { Footer } from "@/components/landing/footer"
import { FloatingCTA } from "@/components/landing/floating-cta"
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget"
import { SocialProofNotification } from "@/components/social-proof/SocialProofNotification"
import { HesitationHelper } from "@/components/hesitation/HesitationHelper"
import { SectionWrapper } from "@/components/ui/section-wrapper"
import { db, isDbConfigured } from "@/lib/db"
import { defaultSectionVisibility } from "@/lib/sections"

async function getSectionVisibility(): Promise<Record<string, boolean>> {
  const defaults = defaultSectionVisibility()
  if (!isDbConfigured) return defaults
  try {
    const stored = await db.settings.getSectionVisibility()
    return { ...defaults, ...(stored || {}) }
  } catch {
    return defaults
  }
}

export default async function LandingPage() {
  const visibility = await getSectionVisibility()
  return (
    <main className="min-h-screen">
      <Header />

      <SectionWrapper sectionId="hero" sectionName="היירו" isFirst visible={visibility.hero}>
        <Hero />
      </SectionWrapper>

      <SectionWrapper sectionId="trust" sectionName="אמון" visible={visibility.trust}>
        <TrustBadges />
      </SectionWrapper>

      <SectionWrapper sectionId="video" sectionName="וידאו" visible={visibility.video}>
        <VideoSection />
      </SectionWrapper>

      <SectionWrapper sectionId="how-it-works" sectionName="איך זה עובד" visible={visibility["how-it-works"]}>
        <HowItWorks />
      </SectionWrapper>

      <SectionWrapper sectionId="about" sectionName="אודות" visible={visibility.about}>
        <About />
      </SectionWrapper>

      <SectionWrapper sectionId="transformation" sectionName="טרנספורמציה" visible={visibility.transformation}>
        <Transformation />
      </SectionWrapper>

      <SectionWrapper sectionId="reviews" sectionName="ביקורות" visible={visibility.reviews}>
        <Reviews />
      </SectionWrapper>

      <SectionWrapper sectionId="faq" sectionName="שאלות נפוצות" visible={visibility.faq}>
        <FAQ />
      </SectionWrapper>

      <SectionWrapper sectionId="contact" sectionName="יצירת קשר" visible={visibility.contact}>
        <LeadForm />
      </SectionWrapper>

      <Footer />
      <FloatingCTA />
      <ChatbotWidget />
      <SocialProofNotification />
      <HesitationHelper />
    </main>
  )
}
