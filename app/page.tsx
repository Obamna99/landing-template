import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { VideoSection } from "@/components/landing/video-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { About } from "@/components/landing/about"
import { Reviews } from "@/components/landing/reviews"
import { InteractiveElements } from "@/components/landing/interactive-elements"
import { FAQ } from "@/components/landing/faq"
import { LeadForm } from "@/components/landing/lead-form"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <VideoSection />
      <HowItWorks />
      <About />
      <Reviews />
      <InteractiveElements />
      <FAQ />
      <LeadForm />
      <Footer />
    </main>
  )
}
