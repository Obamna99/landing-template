import { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { BuildForm } from "@/components/landing/build-form"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: `בנה את האתר שלך | ${siteConfig.name}`,
  description: "מלאו את הפרטים ונבנה עבורכם דף נחיתה מותאם. תמונות, טקסט, וידאו – הכל במקום אחד.",
}

export default function BuildPage() {
  return (
    <main id="main" className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-white via-teal-50/30 to-slate-50/50 overflow-x-hidden" tabIndex={-1}>
      <Header hideBranding />
      <div className="pt-24 sm:pt-28 pb-[max(5rem,env(safe-area-inset-bottom))] min-h-screen">
        <BuildForm />
      </div>
    </main>
  )
}
