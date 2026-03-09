"use client"

const DEFAULT_PRIMARY = "#0d9488"
const DEFAULT_SECONDARY = "#f59e0b"

export type PreviewThemeProps = {
  primaryColor?: string
  secondaryColor?: string
  children: React.ReactNode
  className?: string
}

export function PreviewTheme({ primaryColor, secondaryColor, children, className }: PreviewThemeProps) {
  const primary = primaryColor?.trim() || DEFAULT_PRIMARY
  const secondary = secondaryColor?.trim() || DEFAULT_SECONDARY

  const themeStyles = `
    .preview-theme {
      --theme-primary: ${primary};
      --theme-secondary: ${secondary};
    }
    .preview-theme .bg-teal-500,
    .preview-theme .bg-teal-600,
    .preview-theme .bg-teal-100 { background-color: var(--theme-primary) !important; }
    .preview-theme .bg-teal-50 { background-color: color-mix(in srgb, var(--theme-primary) 12%, white) !important; }
    .preview-theme .bg-teal-500\\/5 { background-color: color-mix(in srgb, var(--theme-primary) 5%, transparent) !important; }
    .preview-theme .bg-teal-500\\/20 { background-color: color-mix(in srgb, var(--theme-primary) 20%, transparent) !important; }
    .preview-theme .from-teal-500,
    .preview-theme .from-teal-600,
    .preview-theme .to-teal-400,
    .preview-theme .to-teal-500,
    .preview-theme .to-teal-600 { --tw-gradient-from: var(--theme-primary) !important; --tw-gradient-to: var(--theme-primary) !important; }
    .preview-theme .via-teal-300,
    .preview-theme .via-teal-500,
    .preview-theme .via-teal-600 { --tw-gradient-stops: var(--tw-gradient-from), var(--theme-primary), var(--tw-gradient-to) !important; }
    .preview-theme .bg-gradient-to-br.from-teal-500,
    .preview-theme [class*="from-teal"] { --tw-gradient-from: var(--theme-primary) !important; }
    .preview-theme .from-teal-500\\/10,
    .preview-theme .from-teal-500\\/5 { --tw-gradient-from: color-mix(in srgb, var(--theme-primary) 10%, transparent) !important; }
    .preview-theme [class*="to-teal"] { --tw-gradient-to: var(--theme-primary) !important; }
    .preview-theme .text-teal-600,
    .preview-theme .text-teal-700,
    .preview-theme .text-teal-500,
    .preview-theme .text-teal-400,
    .preview-theme .text-teal-300 { color: var(--theme-primary) !important; }
    .preview-theme .text-green-500,
    .preview-theme .text-green-400,
    .preview-theme .text-green-600,
    .preview-theme .text-green-700 { color: var(--theme-primary) !important; }
    .preview-theme .bg-green-500 { background-color: var(--theme-primary) !important; }
    .preview-theme .bg-green-500\\/20 { background-color: color-mix(in srgb, var(--theme-primary) 20%, transparent) !important; }
    .preview-theme .border-teal-500,
    .preview-theme .border-teal-200,
    .preview-theme .border-teal-100,
    .preview-theme .border-teal-300,
    .preview-theme .border-4.border-teal-500,
    .preview-theme .border-3.border-teal-500 { border-color: var(--theme-primary) !important; }
    .preview-theme .focus\\:border-teal-500:focus { border-color: var(--theme-primary) !important; }
    .preview-theme .focus\\:ring-teal-200:focus,
    .preview-theme .focus\\:ring-teal-300:focus,
    .preview-theme .focus\\:ring-teal-500:focus,
    .preview-theme .focus\\:ring-teal-400:focus { --tw-ring-color: var(--theme-primary) !important; }
    .preview-theme .ring-teal-200 { --tw-ring-color: color-mix(in srgb, var(--theme-primary) 40%, white) !important; }
    .preview-theme .gradient-text {
      background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%) !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      color: transparent !important;
    }
    .preview-theme .shadow-teal-500\\/20,
    .preview-theme .shadow-teal-500\\/25,
    .preview-theme .shadow-teal-500\\/5,
    .preview-theme .shadow-teal-500\\/30 { box-shadow: 0 0 0 1px color-mix(in srgb, var(--theme-primary) 20%, transparent), 0 10px 15px -3px color-mix(in srgb, var(--theme-primary) 15%, transparent), 0 4px 6px -4px color-mix(in srgb, var(--theme-primary) 15%, transparent) !important; }
    .preview-theme .shadow-amber-500\\/20 { box-shadow: 0 10px 15px -3px color-mix(in srgb, var(--theme-secondary) 20%, transparent), 0 4px 6px -4px color-mix(in srgb, var(--theme-secondary) 15%, transparent) !important; }
    .preview-theme .hover\\:bg-teal-500:hover,
    .preview-theme .hover\\:bg-teal-600:hover { background-color: var(--theme-primary) !important; }
    .preview-theme .hover\\:text-teal-600:hover,
    .preview-theme .hover\\:text-teal-700:hover { color: var(--theme-primary) !important; }
    .preview-theme .hover\\:bg-teal-50:hover { background-color: color-mix(in srgb, var(--theme-primary) 12%, white) !important; }
    .preview-theme .hover\\:from-teal-500:hover,
    .preview-theme .hover\\:to-teal-400:hover { background-image: linear-gradient(to right, var(--theme-primary), var(--theme-primary)) !important; }
    .preview-theme .bg-amber-400,
    .preview-theme .bg-amber-500,
    .preview-theme .bg-amber-100,
    .preview-theme .bg-amber-200 { background-color: var(--theme-secondary) !important; }
    .preview-theme .bg-amber-50 { background-color: color-mix(in srgb, var(--theme-secondary) 15%, white) !important; }
    .preview-theme .bg-amber-500\\/5,
    .preview-theme .bg-amber-500\\/20,
    .preview-theme .bg-amber-400\\/5,
    .preview-theme .bg-amber-400\\/30 { background-color: color-mix(in srgb, var(--theme-secondary) 5%, transparent) !important; }
    .preview-theme .from-amber-400,
    .preview-theme .from-amber-500,
    .preview-theme .to-amber-400,
    .preview-theme .to-amber-500,
    .preview-theme .via-amber-300 { --tw-gradient-stops: var(--tw-gradient-from), var(--theme-secondary), var(--tw-gradient-to) !important; }
    .preview-theme [class*="from-amber"] { --tw-gradient-from: var(--theme-secondary) !important; }
    .preview-theme [class*="to-amber"] { --tw-gradient-to: var(--theme-secondary) !important; }
    .preview-theme .to-amber-500\\/90 { --tw-gradient-to: color-mix(in srgb, var(--theme-secondary) 90%, transparent) !important; }
    .preview-theme .hero-cta-primary span[class*="from-teal"] {
      background-image: linear-gradient(to right, var(--theme-primary), var(--theme-primary), color-mix(in srgb, var(--theme-secondary) 90%, transparent)) !important;
    }
    .preview-theme .text-amber-400,
    .preview-theme .text-amber-500,
    .preview-theme .text-amber-600,
    .preview-theme .text-amber-700,
    .preview-theme .text-amber-300 { color: var(--theme-secondary) !important; }
    .preview-theme .border-amber-500,
    .preview-theme .border-amber-100,
    .preview-theme .border-amber-200,
    .preview-theme .border-amber-400 { border-color: var(--theme-secondary) !important; }
    .preview-theme .ring-amber-400,
    .preview-theme .ring-amber-400\\/50 { --tw-ring-color: var(--theme-secondary) !important; }
    .preview-theme .focus-visible\\:ring-amber-400:focus-visible { --tw-ring-color: var(--theme-secondary) !important; }
    .preview-theme .hover\\:from-amber-400:hover,
    .preview-theme .hover\\:to-amber-300:hover { --tw-gradient-from: var(--theme-secondary) !important; --tw-gradient-to: var(--theme-secondary) !important; }
    .preview-theme .to-teal-100 { --tw-gradient-to: color-mix(in srgb, var(--theme-primary) 15%, white) !important; }
    .preview-theme .bg-teal-400 { background-color: var(--theme-primary) !important; }
    .preview-theme .hover\\:text-teal-400:hover { color: var(--theme-primary) !important; }
    .preview-theme .hover\\:border-teal-300:hover { border-color: var(--theme-primary) !important; }
    .preview-theme .hover\\:bg-green-50:hover { background-color: color-mix(in srgb, var(--theme-primary) 8%, white) !important; }
    .preview-theme .hover\\:text-green-700:hover { color: var(--theme-primary) !important; }
    .preview-theme .ring-teal-100 { --tw-ring-color: color-mix(in srgb, var(--theme-primary) 20%, white) !important; }
    .preview-theme .ring-teal-500 { --tw-ring-color: var(--theme-primary) !important; }
    .preview-theme .border-teal-400 { border-color: var(--theme-primary) !important; }
    .preview-theme .hero-cta-primary span.relative,
.preview-theme .hero-cta-primary .drop-shadow-sm {
      color: #f1f5f9 !important;
    }
    .site-theme-dark.dark .preview-theme .hero-cta-primary span.relative,
    .site-theme-dark.dark .preview-theme .hero-cta-primary .drop-shadow-sm {
      color: #e2e8f0 !important;
    }
    .preview-theme .hero-interactive-bg {
      background: linear-gradient(135deg, #f8fafc 0%, color-mix(in srgb, var(--theme-primary) 12%, white) 25%, color-mix(in srgb, var(--theme-secondary) 10%, white) 60%, #f5f5f4 100%) !important;
    }
    .preview-theme .hero-mesh-gradient {
      background: linear-gradient(135deg, oklch(0.98 0.01 85) 0%, color-mix(in srgb, var(--theme-primary) 38%, transparent) 30%, oklch(0.97 0.015 70 / 0.35) 55%, color-mix(in srgb, var(--theme-primary) 18%, transparent) 80%, oklch(0.985 0.01 85) 100%) !important;
      background-size: 220% 220%;
      animation: hero-mesh-shift 18s ease-in-out infinite;
    }
    .preview-theme [data-theme-blob="primary"] {
      background: linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 8%, transparent) 0%, color-mix(in srgb, var(--theme-primary) 4%, transparent) 100%) !important;
    }
    .preview-theme [data-theme-blob="secondary"] {
      background: linear-gradient(135deg, color-mix(in srgb, var(--theme-secondary) 6%, transparent) 0%, color-mix(in srgb, var(--theme-secondary) 3%, transparent) 100%) !important;
    }
    .preview-theme.site-theme-dark.dark .hero-interactive-bg {
      background: linear-gradient(135deg, oklch(0.12 0.02 250) 0%, color-mix(in srgb, var(--theme-primary) 18%, black) 50%, oklch(0.14 0.015 250) 100%) !important;
    }
    /* FAQ "Still have questions?" CTA: keep light background so heading/subtext stay readable */
    .preview-theme .faq-cta-box {
      background: linear-gradient(to bottom right, color-mix(in srgb, var(--theme-primary) 14%, white), color-mix(in srgb, var(--theme-primary) 20%, white)) !important;
      border-color: color-mix(in srgb, var(--theme-primary) 35%, white) !important;
    }
    .preview-theme .faq-cta-heading { color: #0f172a !important; }
    .preview-theme .faq-cta-subtext { color: #475569 !important; }
    /* WhatsApp button: theme-harmonious blend of primary + secondary, darkened slightly so white text always reads well */
    .preview-theme .faq-whatsapp-btn {
      background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-primary) 50%, var(--theme-secondary) 50%) 85%, black 15%) !important;
    }
    .preview-theme .faq-whatsapp-btn:hover {
      background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-primary) 45%, var(--theme-secondary) 55%) 80%, black 20%) !important;
    }
    /* Footer: keep brand and description readable (light text on dark footer) */
    .preview-theme footer .footer-brand-name,
    .preview-theme footer .footer-brand-tagline,
    .preview-theme footer .footer-description {
      color: #e2e8f0 !important;
    }
    .preview-theme footer .footer-brand-name { color: #fff !important; }
    .preview-theme footer .footer-whatsapp-icon {
      background-color: color-mix(in srgb, color-mix(in srgb, var(--theme-primary) 50%, var(--theme-secondary) 50%) 85%, black 15%) !important;
    }
    .preview-theme footer .footer-whatsapp-icon:hover {
      background-color: color-mix(in srgb, var(--theme-primary) 90%, white 10%) !important;
    }
  `

  return (
    <div
      className={`preview-theme ${className ?? "min-h-screen"}`}
      style={
        {
          ["--theme-primary" as string]: primary,
          ["--theme-secondary" as string]: secondary,
        } as React.CSSProperties
      }
    >
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      {children}
    </div>
  )
}
