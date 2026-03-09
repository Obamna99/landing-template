import { notFound } from "next/navigation"
import { getLeadForPreview } from "@/lib/lead-preview"
import { toWhatsAppNumber } from "@/lib/utils/whatsapp"
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
  const lead = await getLeadForPreview(id)
  if (!lead) notFound()

  let sections: Record<string, unknown> = {}
  try {
    const raw = lead.sections_json
    if (raw != null && raw !== "") {
      sections =
        typeof raw === "string"
          ? (JSON.parse(raw) as Record<string, unknown>)
          : (raw as Record<string, unknown>)
      if (!sections || typeof sections !== "object" || Array.isArray(sections)) sections = {}
    }
  } catch {
    sections = {}
  }

  const siteSection = sections.site as { tagline?: string } | undefined
  const headerOverride = sections.header as import("@/components/landing/header").HeaderOverride | undefined
  const heroOverride = sections.hero as {
    headlineLine1?: string
    highlight?: string
    subheadline?: string
    features?: Array<{ title: string; description: string }>
    ctaPrimaryText?: string
    ctaSecondaryText?: string
    ctaNote?: string
    trustText?: string
    valueCardTitle?: string
    valueCardHighlight?: string
  } | undefined
  const aboutOverride = sections.about as import("@/components/landing/about").AboutOverride | undefined
  const videoOverride = sections.video as import("@/components/landing/video-section").VideoOverride | undefined
  const faqRaw = sections.faq
  const faqOverride = Array.isArray(faqRaw)
    ? { questions: faqRaw as { question: string; answer: string }[] }
    : (faqRaw as import("@/components/landing/faq").FAQOverride | undefined)
  const footerOverride = sections.footer as import("@/components/landing/footer").FooterOverride | undefined
  const reviewsSectionOverride = sections.reviewsSection as import("@/components/landing/reviews").ReviewsSectionOverride | undefined
  const caseStudyOverride = sections.caseStudy as import("@/components/landing/reviews").CaseStudyOverride | undefined
  const reviewsOverride = reviewsSectionOverride || caseStudyOverride ? { ...reviewsSectionOverride, ...caseStudyOverride } : undefined
  const howItWorksOverride = sections.howItWorks as import("@/components/landing/how-it-works").HowItWorksOverride | undefined
  const theme = sections.theme as { primaryColor?: string; secondaryColor?: string; themeMode?: "light" | "dark" } | undefined
  const isDark = theme?.themeMode === "dark"

  const headerSection = sections.header as { navLinks?: Array<{ id: string; label: string }>; ctaButton?: string } | undefined
  const ownerWhatsapp = toWhatsAppNumber(footerOverride?.social?.whatsapp || lead.phone || "")
  const previewBranding =
    lead.site_name || siteSection?.tagline || headerSection?.navLinks || headerSection?.ctaButton || lead.phone
      ? {
          siteName: lead.site_name || "תצוגה מקדימה",
          tagline: siteSection?.tagline,
          contactPhone: lead.phone,
          whatsappNumber: ownerWhatsapp,
          navLinks: headerSection?.navLinks,
          ctaButton: headerSection?.ctaButton,
        }
      : undefined
  const faqOverrideWithOwner = faqOverride
    ? { ...(typeof faqOverride === "object" ? faqOverride : { questions: (faqOverride as { questions?: unknown }).questions }), whatsappNumber: ownerWhatsapp }
    : undefined

  return (
    <div
      className={`preview-page ${isDark ? "dark site-theme-dark bg-slate-900 text-slate-100" : "bg-white text-slate-900"}`}
    >
      <PreviewTheme primaryColor={theme?.primaryColor} secondaryColor={theme?.secondaryColor}>
        <main id="main" className="min-h-screen bg-background text-foreground" tabIndex={-1}>
          <Header hideBranding override={headerOverride} previewBranding={previewBranding} />
          <Hero override={heroOverride} hideStats />
          <HowItWorks override={howItWorksOverride} />
          <About override={aboutOverride} />
          <VideoSection override={videoOverride} />
          <Reviews override={reviewsOverride} />
          <FAQ override={faqOverrideWithOwner ?? faqOverride ?? undefined} />
          <div className="py-8 text-center text-sm text-slate-500 border-t border-slate-100 dark:border-slate-700">
            תצוגה מקדימה • פרטי יצירת קשר: {lead.email} | {lead.phone}
          </div>
          <div id="contact">
            <Footer override={footerOverride} previewBranding={previewBranding} />
          </div>
        </main>
      </PreviewTheme>
    </div>
  )
}
