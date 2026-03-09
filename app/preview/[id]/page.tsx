import { notFound } from "next/navigation"
import { db, isDbConfigured } from "@/lib/db"
import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { About } from "@/components/landing/about"
import { VideoSection } from "@/components/landing/video-section"
import { Reviews } from "@/components/landing/reviews"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"
import { PreviewTheme } from "@/components/landing/preview-theme"

type Params = { params: Promise<{ id: string }> }

export default async function PreviewPage({ params }: Params) {
  const { id } = await params
  if (!isDbConfigured) notFound()
  const lead = await db.leads.getById(id)
  if (!lead) notFound()

  let sections: Record<string, unknown> = {}
  try {
    if (lead.sections_json) {
      sections = typeof lead.sections_json === "string" ? JSON.parse(lead.sections_json) : lead.sections_json
    }
  } catch {
    sections = {}
  }

  const headerOverride = sections.header as import("@/components/landing/header").HeaderOverride | undefined
  const heroOverride = sections.hero as { headlineLine1?: string; highlight?: string; subheadline?: string; features?: Array<{ title: string; description: string }> } | undefined
  const aboutOverride = sections.about as { headline?: string; headlineHighlight?: string; subheadline?: string; founder?: { quote?: string; imageUrl?: string; name?: string; role?: string; linkedin?: string } } | undefined
  const videoOverride = sections.video as import("@/components/landing/video-section").VideoOverride | undefined
  const faqRaw = sections.faq
  const faqOverride = Array.isArray(faqRaw)
    ? { questions: faqRaw as { question: string; answer: string }[] }
    : (faqRaw as { questions?: { question: string; answer: string }[] } | undefined)
  const footerOverride = sections.footer as import("@/components/landing/footer").FooterOverride | undefined
  const reviewsSectionOverride = sections.reviewsSection as import("@/components/landing/reviews").ReviewsSectionOverride | undefined
  const caseStudyOverride = sections.caseStudy as import("@/components/landing/reviews").CaseStudyOverride | undefined
  const reviewsOverride = reviewsSectionOverride || caseStudyOverride ? { ...reviewsSectionOverride, ...caseStudyOverride } : undefined
  const howItWorksOverride = sections.howItWorks as import("@/components/landing/how-it-works").HowItWorksOverride | undefined
  const theme = sections.theme as { primaryColor?: string; secondaryColor?: string; themeMode?: "light" | "dark" } | undefined
  const isDark = theme?.themeMode === "dark"

  return (
    <div className={isDark ? "dark site-theme-dark" : ""}>
      <PreviewTheme primaryColor={theme?.primaryColor} secondaryColor={theme?.secondaryColor}>
        <main id="main" className="min-h-screen bg-background" tabIndex={-1}>
          <Header hideBranding override={headerOverride} />
          <Hero override={heroOverride} hideStats />
          <HowItWorks override={howItWorksOverride} />
          <About override={aboutOverride} />
          <VideoSection override={videoOverride} />
          <Reviews override={reviewsOverride} />
          <FAQ override={faqOverride ?? undefined} />
          <div className="py-8 text-center text-sm text-slate-500 border-t border-slate-100 dark:border-slate-700">
            תצוגה מקדימה • פרטי יצירת קשר: {lead.email} | {lead.phone}
          </div>
          <div id="contact">
            <Footer override={footerOverride} />
          </div>
        </main>
      </PreviewTheme>
    </div>
  )
}
