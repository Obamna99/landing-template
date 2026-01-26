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

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <TrustBadges />
      <VideoSection />
      <HowItWorks />
      <About />
      <Transformation />
      <Reviews />
      <FAQ />
      <LeadForm />
      <Footer />
      <FloatingCTA />
      <ChatbotWidget />
    </main>
  )
}
