import type React from "react"
import type { Metadata, Viewport } from "next"
import { Heebo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { siteConfig, seoConfig } from "@/lib/config"
import "./globals.css"

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: seoConfig.title,
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: `${siteConfig.locale}_IL`,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: seoConfig.title,
    description: seoConfig.description,
    images: [
      {
        url: seoConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.title,
    description: seoConfig.description,
    creator: seoConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={siteConfig.locale} dir={siteConfig.direction} className="scroll-smooth">
      <head>
        {/* Preconnect for external images (next/font self-hosts fonts) */}
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className={`${heebo.className} font-sans antialiased`} suppressHydrationWarning>
        <a href="#main" className="skip-to-main">
          דלג לתוכן הראשי
        </a>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
