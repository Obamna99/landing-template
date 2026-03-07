"use client"

const DEFAULT_PRIMARY = "#0d9488"
const DEFAULT_SECONDARY = "#f59e0b"

export type PreviewThemeProps = {
  primaryColor?: string
  secondaryColor?: string
  children: React.ReactNode
}

export function PreviewTheme({ primaryColor, secondaryColor, children }: PreviewThemeProps) {
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
    .preview-theme .via-teal-300 { --tw-gradient-stops: var(--tw-gradient-from), var(--theme-primary), var(--tw-gradient-to) !important; }
    .preview-theme .bg-gradient-to-br.from-teal-500,
    .preview-theme [class*="from-teal"] { --tw-gradient-from: var(--theme-primary) !important; }
    .preview-theme [class*="to-teal"] { --tw-gradient-to: var(--theme-primary) !important; }
    .preview-theme .text-teal-600,
    .preview-theme .text-teal-700,
    .preview-theme .text-teal-500,
    .preview-theme .text-teal-300 { color: var(--theme-primary) !important; }
    .preview-theme .border-teal-500,
    .preview-theme .border-teal-200,
    .preview-theme .border-teal-100,
    .preview-theme .border-teal-300,
    .preview-theme .border-4.border-teal-500,
    .preview-theme .border-3.border-teal-500 { border-color: var(--theme-primary) !important; }
    .preview-theme .focus\\:border-teal-500:focus { border-color: var(--theme-primary) !important; }
    .preview-theme .focus\\:ring-teal-200:focus,
    .preview-theme .focus\\:ring-teal-300:focus,
    .preview-theme .focus\\:ring-teal-500:focus { --tw-ring-color: var(--theme-primary) !important; }
    .preview-theme .ring-teal-200 { --tw-ring-color: color-mix(in srgb, var(--theme-primary) 40%, white) !important; }
    .preview-theme .gradient-text { color: var(--theme-primary) !important; }
    .preview-theme .shadow-teal-500\\/20,
    .preview-theme .shadow-teal-500\\/25,
    .preview-theme .shadow-teal-500\\/5,
    .preview-theme .shadow-teal-500\\/30 { box-shadow: 0 0 0 1px color-mix(in srgb, var(--theme-primary) 20%, transparent), 0 10px 15px -3px color-mix(in srgb, var(--theme-primary) 15%, transparent), 0 4px 6px -4px color-mix(in srgb, var(--theme-primary) 15%, transparent) !important; }
    .preview-theme .hover\\:bg-teal-500:hover,
    .preview-theme .hover\\:bg-teal-600:hover { background-color: var(--theme-primary) !important; }
    .preview-theme .hover\\:text-teal-600:hover,
    .preview-theme .hover\\:text-teal-700:hover { color: var(--theme-primary) !important; }
    .preview-theme .hover\\:bg-teal-50:hover { background-color: color-mix(in srgb, var(--theme-primary) 12%, white) !important; }
    .preview-theme .hover\\:from-teal-500:hover,
    .preview-theme .hover\\:to-teal-400:hover { background-image: linear-gradient(to right, var(--theme-primary), var(--theme-primary)) !important; }
    .preview-theme .bg-amber-400,
    .preview-theme .bg-amber-500,
    .preview-theme .bg-amber-100 { background-color: var(--theme-secondary) !important; }
    .preview-theme .bg-amber-50 { background-color: color-mix(in srgb, var(--theme-secondary) 15%, white) !important; }
    .preview-theme .bg-amber-500\\/5,
    .preview-theme .bg-amber-500\\/20 { background-color: color-mix(in srgb, var(--theme-secondary) 5%, transparent) !important; }
    .preview-theme .from-amber-400,
    .preview-theme .from-amber-500,
    .preview-theme .to-amber-400,
    .preview-theme .to-amber-500 { --tw-gradient-from: var(--theme-secondary) !important; --tw-gradient-to: var(--theme-secondary) !important; }
    .preview-theme .text-amber-400,
    .preview-theme .text-amber-500,
    .preview-theme .text-amber-600,
    .preview-theme .text-amber-700 { color: var(--theme-secondary) !important; }
    .preview-theme .border-amber-500,
    .preview-theme .border-amber-100 { border-color: var(--theme-secondary) !important; }
    .preview-theme .to-teal-100 { --tw-gradient-to: color-mix(in srgb, var(--theme-primary) 15%, white) !important; }
  `

  return (
    <div
      className="preview-theme min-h-screen"
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
