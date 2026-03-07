import { notFound } from "next/navigation"
import { db, isDbConfigured } from "@/lib/db"
import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { About } from "@/components/landing/about"
import { VideoSection } from "@/components/landing/video-section"
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

  const heroOverride = sections.hero as { headlineLine1?: string; highlight?: string; subheadline?: string; features?: Array<{ title: string; description: string }> } | undefined
  const aboutOverride = sections.about as { headline?: string; headlineHighlight?: string; subheadline?: string; founder?: { quote?: string; imageUrl?: string; name?: string; role?: string; linkedin?: string } } | undefined
  const videoOverride = sections.video as { videoId?: string; customVideoUrl?: string } | undefined
  const faqRaw = sections.faq
  const faqOverride = Array.isArray(faqRaw)
    ? { questions: faqRaw as { question: string; answer: string }[] }
    : (faqRaw as { questions?: { question: string; answer: string }[] } | undefined)
  const footerOverride = sections.footer as import("@/components/landing/footer").FooterOverride | undefined
  const theme = sections.theme as { primaryColor?: string; secondaryColor?: string; themeMode?: "light" | "dark" } | undefined
  const isDark = theme?.themeMode === "dark"

  return (
    <div className={isDark ? "dark site-theme-dark" : ""}>
      <PreviewTheme primaryColor={theme?.primaryColor} secondaryColor={theme?.secondaryColor}>
        <main id="main" className="min-h-screen bg-background" tabIndex={-1}>
          <Header hideBranding />
          <Hero override={heroOverride} hideStats />
          <About override={aboutOverride} />
          <VideoSection override={videoOverride} />
          <FAQ override={faqOverride ?? undefined} />
          <div className="py-8 text-center text-sm text-slate-500 border-t border-slate-100 dark:border-slate-700">
            תצוגה מקדימה • פרטי יצירת קשר: {lead.email} | {lead.phone}
          </div>
          <Footer override={footerOverride} />
        </main>
      </PreviewTheme>
    </div>
  )
}
