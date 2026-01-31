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

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <SectionWrapper sectionId="hero" sectionName="היירו" isFirst>
        <Hero />
      </SectionWrapper>
      
      <SectionWrapper sectionId="trust" sectionName="אמון">
        <TrustBadges />
      </SectionWrapper>
      
      <SectionWrapper sectionId="video" sectionName="וידאו">
        <VideoSection />
      </SectionWrapper>
      
      <SectionWrapper sectionId="how-it-works" sectionName="איך זה עובד">
        <HowItWorks />
      </SectionWrapper>
      
      <SectionWrapper sectionId="about" sectionName="אודות">
        <About />
      </SectionWrapper>
      
      <SectionWrapper sectionId="transformation" sectionName="טרנספורמציה">
        <Transformation />
      </SectionWrapper>
      
      <SectionWrapper sectionId="reviews" sectionName="ביקורות">
        <Reviews />
      </SectionWrapper>
      
      <SectionWrapper sectionId="faq" sectionName="שאלות נפוצות">
        <FAQ />
      </SectionWrapper>
      
      <SectionWrapper sectionId="contact" sectionName="יצירת קשר">
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
