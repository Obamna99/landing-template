import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ניהול | שם העסק",
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
    <div dir="rtl" lang="he">
      {children}
    </div>
  )
}
