import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: `ניהול | ${siteConfig.name}`,
  description: "פאנל ניהול האתר",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div dir="rtl" lang="he" className="min-h-screen pb-[env(safe-area-inset-bottom)]">
      {children}
    </div>
  )
}
