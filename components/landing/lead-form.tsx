"use client"

import { useState, FormEvent, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import confetti from "canvas-confetti"
import { useToast } from "@/hooks/use-toast"
import { SectionLiveEditPanel } from "@/components/landing/section-live-edit-panel"
import { footerConfig, aboutConfig, headerConfig, siteConfig, reviewsConfig, howItWorksConfig } from "@/lib/config"
import { FEATURE_ICON_OPTIONS } from "@/lib/icon-options"

// Contact form (main page): leave your data so the site owner can contact you — 3 steps only
const formStepsContact = [
  { id: 1, label: "פרטי התקשרות" },
  { id: 2, label: "על העסק שלך" },
  { id: 3, label: "כמעט סיימנו" },
]
// Build form (/build): minimal contact + site content + section content — 7 steps
const formStepsBuild = [
  { id: 1, label: "היירו" },
  { id: 2, label: "תוכן לאתר" },
  { id: 3, label: "אודות" },
  { id: 4, label: "וידאו" },
  { id: 5, label: "שאלות נפוצות" },
  { id: 6, label: "פוטר ויצירת קשר" },
  { id: 7, label: "פרטי התקשרות" },
]
const MAX_PHOTO_FILES = 20
const MAX_VIDEO_FILES = 20

// Lightweight animation variants (no blur, short duration)
const stepDirection = { forward: 1, back: -1 }
const slideVariants = {
  enter: (d: number) => ({ opacity: 0, x: d * 12 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -12 }),
}
const stepTransition = { type: "tween", duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }
const staggerContainer = { hidden: {}, show: { transition: { staggerChildren: 0.03, delayChildren: 0.04 } } }
const staggerItem = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }
const progressSpring = { type: "spring", stiffness: 260, damping: 26 }

// Build form: which section of the site this step edits (for popup) — Hero first, contact last
const buildStepSectionInfo: Record<number, { label: string; icon: string; desc: string }> = {
  1: { label: "היירו", icon: "🎯", desc: "כותרת ראשית ותת-כותרת" },
  2: { label: "תוכן לאתר", icon: "📦", desc: "תמונות, טקסט, צבעים ומה תקבלו" },
  3: { label: "אודות", icon: "👤", desc: "כרטיס אודות וציטוט" },
  4: { label: "וידאו", icon: "🎬", desc: "סרטון באזור הוידאו" },
  5: { label: "שאלות נפוצות", icon: "❓", desc: "שאלות ותשובות" },
  6: { label: "פוטר ויצירת קשר", icon: "📞", desc: "פרטי קשר וזכויות יוצרים" },
  7: { label: "פרטי התקשרות", icon: "📞", desc: "שם, אימייל וטלפון" },
}

export function LeadForm({ buildPage = false }: { buildPage?: boolean }) {
  const ref = useRef(null)
  const directionRef = useRef(1)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { toast } = useToast()
  const formSteps = buildPage ? formStepsBuild : formStepsContact
  const totalSteps = formSteps.length

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    businessType: "",
    businessSize: "",
    urgency: "",
    message: "",
    consent: false,
    siteName: "",
    siteDescription: "",
    siteContent: "",
    photoUrls: [] as string[],
    videoUrls: [] as string[],
  })
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [videoFiles, setVideoFiles] = useState<File[]>([])
  const [sectionVideoFile, setSectionVideoFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [createdLeadId, setCreatedLeadId] = useState<string | null>(null)

  // Section content (for build page / preview)
  const [sections, setSections] = useState({
    header: {
      name: "",
      logoText: "",
      logoUrl: "",
      tagline: "",
      navLinks: (headerConfig.navLinks || []).map((l) => ({ id: l.id, label: l.label })),
      ctaButton: "",
      phone: "",
    },
    site: { tagline: "" },
    hero: {
      headlineLine1: "",
      highlight: "",
      subheadline: "",
      ctaPrimaryText: "",
      ctaSecondaryText: "",
      ctaNote: "",
      trustText: "",
      valueCardTitle: "",
      valueCardHighlight: "",
    },
    about: {
      headline: "",
      headlineHighlight: "",
      subheadline: "",
      founder: { quote: "", imageUrl: "", name: "", role: "", linkedin: "" },
      badge: "",
      journeyTitle: "המסע שלנו",
      timeline: [...(aboutConfig.timeline || [])],
      trustItems: (aboutConfig.trustItems || []).map((t) => ({ ...t, icon: (t as { icon?: string }).icon })),
      ctaText: aboutConfig.ctaText ?? "רוצים אתר כזה לעסק שלכם?",
      ctaButton: aboutConfig.ctaButton ?? "בואו נדבר",
    },
    features: [
      { title: "עיצוב מותאם אישית", description: "התמונות שלך, הצבעים שלך, הסגנון שלך", icon: "check" },
      { title: "מערכת מיילים מקצועית", description: "שלחו אלפי מיילים בקלות ובמחיר נמוך", icon: "mail" },
      { title: "מחיר שמנצח", description: "זול משמעותית מהמתחרים", icon: "currency" },
    ],
    video: {
      videoId: "",
      customVideoUrl: "",
      badge: "צפו בסרטון",
      headline: "כך נראה התהליך",
      headlineHighlight: " מהתחלה ועד הסוף",
      subheadline: "מהרגע שאתם פונים אלינו ועד שהאתר עולה לאוויר—תהליך מקצועי, מהיר ושקוף",
      highlights: [
        { icon: "✨", text: "עיצוב מקצועי" },
        { icon: "⚡", text: "תהליך מהיר" },
        { icon: "🎯", text: "תוצאות מוכחות" },
      ],
      ctaText: "רוצים אתר כזה לעסק שלכם?",
      ctaButton: "דברו איתנו",
    },
    faq: [
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
    ],
    footer: {
      phone: "",
      email: "",
      address: "",
      hoursWeekdays: "א'-ה': 09:00-18:00",
      hoursFriday: "ו': 09:00-13:00",
      quickLinks: [...(footerConfig.quickLinks || [])] as { label: string; href: string }[],
      social: { facebook: "", instagram: "", linkedin: "", whatsapp: "" },
      termsUrl: "",
      privacyUrl: "",
      description: "",
      copyright: "",
    },
    journeyNotes: "",
    reviewsSection: {
      badge: reviewsConfig.badge,
      headline: reviewsConfig.headline,
      headlineHighlight: reviewsConfig.headlineHighlight ?? "",
      subheadline: reviewsConfig.subheadline,
      stats: [
        { value: "150+", label: "לקוחות מרוצים" },
        { value: "5.0", label: "דירוג ממוצע" },
        { value: "98%", label: "ממליצים עלינו" },
      ],
      reviews: [],
    },
    caseStudy: reviewsConfig.caseStudy
      ? {
          title: reviewsConfig.caseStudy.title,
          company: reviewsConfig.caseStudy.company,
          industry: reviewsConfig.caseStudy.industry,
          challenge: reviewsConfig.caseStudy.challenge,
          solution: reviewsConfig.caseStudy.solution,
          quote: reviewsConfig.caseStudy.quote,
          author: reviewsConfig.caseStudy.author,
          image: reviewsConfig.caseStudy.image ?? "",
          results: [...(reviewsConfig.caseStudy.results || [])],
          ctaText: reviewsConfig.caseStudy.ctaText ?? "",
        }
      : {
          title: "לקוח לדוגמה",
          company: "",
          industry: "",
          challenge: "",
          solution: "",
          quote: "",
          author: "",
          image: "",
          results: [
            { metric: "300%", label: "יותר פניות" },
            { metric: "40%", label: "חיסכון בעלויות" },
            { metric: "1.2 שנ'", label: "טעינת עמוד" },
          ],
          ctaText: "רוצים תוצאות דומות?",
        },
    howItWorks: {
      badge: howItWorksConfig.badge,
      headline: howItWorksConfig.headline,
      headlineHighlight: howItWorksConfig.headlineHighlight ?? "",
      subheadline: howItWorksConfig.subheadline,
      steps: (howItWorksConfig.steps || []).map((s) => ({ id: s.id, title: s.title, description: s.description, duration: s.duration, highlight: s.highlight ?? "", icon: s.icon })),
      ctaText: howItWorksConfig.ctaText ?? "",
      ctaHighlight: howItWorksConfig.ctaHighlight ?? "",
      ctaButton: howItWorksConfig.ctaButton ?? "",
      ctaButtonUrl: (howItWorksConfig as { ctaButtonUrl?: string }).ctaButtonUrl ?? "/client",
    },
    theme: {
      primaryColor: "#0d9488",
      secondaryColor: "#f59e0b",
      themeMode: "light" as "light" | "dark",
    },
  })
  const [sectionAboutImageFile, setSectionAboutImageFile] = useState<File | null>(null)
  const [sectionHeaderLogoFile, setSectionHeaderLogoFile] = useState<File | null>(null)
  const headerLogoObjectUrlRef = useRef<string | null>(null)
  const aboutImageObjectUrlRef = useRef<string | null>(null)
  const [uploadPreviewPhotoUrls, setUploadPreviewPhotoUrls] = useState<string[]>([])
  const [uploadPreviewVideoUrl, setUploadPreviewVideoUrl] = useState<string | null>(null)
  const uploadPreviewUrlsRef = useRef<{ photos: string[]; video: string | null }>({ photos: [], video: null })

  // Object URLs for step-2 preview: photos and video (revoke on change/unmount)
  useEffect(() => {
    const prev = uploadPreviewUrlsRef.current
    prev.photos.forEach((u) => URL.revokeObjectURL(u))
    if (prev.video) URL.revokeObjectURL(prev.video)
    const photos = photoFiles.map((f) => URL.createObjectURL(f))
    const video = videoFiles.length > 0 ? URL.createObjectURL(videoFiles[0]) : null
    uploadPreviewUrlsRef.current = { photos, video }
    setUploadPreviewPhotoUrls(photos)
    setUploadPreviewVideoUrl(video)
    return () => {
      photos.forEach((u) => URL.revokeObjectURL(u))
      if (video) URL.revokeObjectURL(video)
    }
  }, [photoFiles, videoFiles])

  // Preview selected founder image in live demo (object URL); revoke on change/unmount
  useEffect(() => {
    if (!sectionAboutImageFile) {
      if (aboutImageObjectUrlRef.current) {
        URL.revokeObjectURL(aboutImageObjectUrlRef.current)
        aboutImageObjectUrlRef.current = null
      }
      setSections((s) => ({ ...s, about: { ...s.about, founder: { ...s.about.founder, imageUrl: "" } } }))
      return
    }
    const url = URL.createObjectURL(sectionAboutImageFile)
    aboutImageObjectUrlRef.current = url
    setSections((s) => ({ ...s, about: { ...s.about, founder: { ...s.about.founder, imageUrl: url } } }))
    return () => {
      URL.revokeObjectURL(url)
      if (aboutImageObjectUrlRef.current === url) aboutImageObjectUrlRef.current = null
    }
  }, [sectionAboutImageFile])

  // Preview selected header logo in live demo (object URL); revoke on change/unmount
  useEffect(() => {
    if (!sectionHeaderLogoFile) {
      if (headerLogoObjectUrlRef.current) {
        URL.revokeObjectURL(headerLogoObjectUrlRef.current)
        headerLogoObjectUrlRef.current = null
      }
      setSections((s) => (s.header.logoUrl?.startsWith("blob:") ? { ...s, header: { ...s.header, logoUrl: "" } } : s))
      return
    }
    const url = URL.createObjectURL(sectionHeaderLogoFile)
    headerLogoObjectUrlRef.current = url
    setSections((s) => ({ ...s, header: { ...s.header, logoUrl: url } }))
    return () => {
      URL.revokeObjectURL(url)
      if (headerLogoObjectUrlRef.current === url) headerLogoObjectUrlRef.current = null
    }
  }, [sectionHeaderLogoFile])

  const colorPresets = {
    primary: [
      { name: "טורקיז", value: "#0d9488" },
      { name: "כחול", value: "#2563eb" },
      { name: "סגול", value: "#7c3aed" },
      { name: "ורוד", value: "#db2777" },
      { name: "ירוק", value: "#059669" },
    ],
    secondary: [
      { name: "כתום", value: "#f59e0b" },
      { name: "אדום", value: "#dc2626" },
      { name: "תכלת", value: "#0ea5e9" },
      { name: "צהוב", value: "#eab308" },
      { name: "סגול", value: "#a855f7" },
    ],
  }

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [typingUsers, setTypingUsers] = useState(0)

  // Simulate other users typing (social proof)
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers(Math.floor(Math.random() * 4) + 2)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    // Contact details: step 1 on contact form, step 7 on build form
    const isContactStep = (step === 1 && !buildPage) || (buildPage && step === 7)
    if (isContactStep) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "איך קוראים לך?"
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "צריכים מספר ליצירת קשר"
      } else if (!/^[0-9-+\s()]+$/.test(formData.phone)) {
        newErrors.phone = "מספר לא תקין"
      }
      if (!formData.email.trim()) {
        newErrors.email = "לאן נשלח את ההצעה?"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "כתובת לא תקינה"
      }
    }

    if (!buildPage && step === 2) {
      if (!formData.businessType) {
        newErrors.businessType = "בחרו סוג עסק"
      }
    }

    if (!buildPage && step === 3) {
      if (!formData.consent) {
        newErrors.consent = "נא לאשר קבלת מידע"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const fireStepConfetti = () => {
    if (typeof window === "undefined" || prefersReducedMotion()) return
    const count = 80
    const defaults = { origin: { y: 0.75 }, zIndex: 9999 }
    confetti({ ...defaults, particleCount: count, spread: 55, scalar: 0.9 })
    confetti({ ...defaults, particleCount: count * 0.4, spread: 100, scalar: 1.1, colors: ["#0d9488", "#14b8a6", "#f59e0b", "#fbbf24"] })
    setTimeout(() => {
      confetti({ ...defaults, particleCount: count * 0.3, angle: 60, spread: 55 })
      confetti({ ...defaults, particleCount: count * 0.3, angle: 120, spread: 55 })
    }, 120)
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      fireStepConfetti()
      directionRef.current = stepDirection.forward
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handleBack = () => {
    directionRef.current = stepDirection.back
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const uploadFiles = async (files: File[], type: "photo" | "video") => {
    if (!files.length) return []
    const fd = new FormData()
    files.forEach((f) => fd.append("files", f))
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || "Upload failed")
    }
    const { urls } = await res.json()
    return urls as string[]
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (validateStep(currentStep)) {
      setIsSubmitting(true)
      setUploadProgress(null)

      try {
        let photoUrls = formData.photoUrls
        let videoUrls = formData.videoUrls

        if (photoFiles.length > 0) {
          setUploadProgress("מעלה תמונות...")
          photoUrls = await uploadFiles(photoFiles, "photo")
        }
        if (videoFiles.length > 0) {
          setUploadProgress("מעלה סרטונים...")
          videoUrls = await uploadFiles(videoFiles, "video")
        }

        let videoPayload = sections.video
        if (buildPage && sectionVideoFile) {
          setUploadProgress("מעלה סרטון לאזור וידאו...")
          const sectionVideoUrls = await uploadFiles([sectionVideoFile], "video")
          if (sectionVideoUrls[0]) {
            videoPayload = { ...sections.video, customVideoUrl: sectionVideoUrls[0] }
          }
        }

        let aboutPayload = sections.about
        if (buildPage && sectionAboutImageFile) {
          setUploadProgress("מעלה תמונת אודות...")
          const aboutImageUrls = await uploadFiles([sectionAboutImageFile], "photo")
          if (aboutImageUrls[0]) {
            aboutPayload = {
              ...sections.about,
              founder: { ...sections.about.founder, imageUrl: aboutImageUrls[0] },
            }
          }
        }

        let headerPayload = sections.header
        if (buildPage && sectionHeaderLogoFile) {
          setUploadProgress("מעלה לוגו...")
          const logoUrls = await uploadFiles([sectionHeaderLogoFile], "photo")
          if (logoUrls[0]) {
            headerPayload = { ...sections.header, logoUrl: logoUrls[0] }
          }
        }

        const sectionsJson = buildPage
          ? {
              header: headerPayload,
              site: { tagline: sections.site?.tagline ?? "" },
              hero: { ...sections.hero, features: sections.features },
              about: aboutPayload,
              video: videoPayload,
              faq: sections.faq.filter((f) => f.question.trim() || f.answer.trim()),
              features: sections.features,
              footer: sections.footer,
              reviewsSection: sections.reviewsSection ? { ...sections.reviewsSection, reviews: (sections.reviewsSection.reviews || []).filter((r) => (r.name || "").trim() || (r.content || "").trim()) } : undefined,
              caseStudy: sections.caseStudy,
              howItWorks: sections.howItWorks ? { ...sections.howItWorks, steps: (sections.howItWorks.steps || []).slice(0, 4).map((s, i) => ({ ...s, id: i + 1 })) } : undefined,
              journeyNotes: sections.journeyNotes || undefined,
              theme: { ...sections.theme, themeMode: sections.theme.themeMode || "light" },
            }
          : undefined

        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            businessType: formData.businessType,
            businessSize: formData.businessSize,
            urgency: formData.urgency,
            message: formData.message,
            siteName: (buildPage ? sections.hero?.headlineLine1 : formData.siteName) || undefined,
            siteDescription: (buildPage ? sections.hero?.subheadline : formData.siteDescription) || undefined,
            siteContent: formData.siteContent || undefined,
            photoUrls: photoUrls.length ? photoUrls : undefined,
            videoUrls: videoUrls.length ? videoUrls : undefined,
            sectionsJson,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to submit")
        }

        const lead = await response.json()
        if (buildPage && lead?.id) setCreatedLeadId(lead.id)

        setIsSuccess(true)
        // Big celebration confetti on full form submit (respects prefers-reduced-motion)
        if (typeof window !== "undefined" && !prefersReducedMotion()) {
          const d = { origin: { y: 0.7 }, zIndex: 9999 }
          confetti({ ...d, particleCount: 120, spread: 70, scalar: 1 })
          confetti({ ...d, particleCount: 60, spread: 100, scalar: 1.2, colors: ["#0d9488", "#14b8a6", "#f59e0b", "#fbbf24"] })
          setTimeout(() => {
            confetti({ ...d, particleCount: 50, angle: 60, spread: 55 })
            confetti({ ...d, particleCount: 50, angle: 120, spread: 55 })
          }, 150)
        }
        toast({
          title: "מעולה! קיבלנו את הפרטים 🎉",
          description: buildPage
            ? "אפשר לצפות בתצוגה המקדימה של האתר שלכם"
            : "נחזור אליך תוך 24 שעות ונתחיל לתכנן את האתר שלך",
        })
      } catch (error) {
        toast({
          title: "אופס! משהו השתבש",
          description: error instanceof Error ? error.message : "נסו שוב מאוחר יותר או צרו קשר בטלפון",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
        setUploadProgress(null)
      }
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    // Sync content fields to preview so they show in the live preview without switching steps
    if (buildPage && typeof value === "string") {
      if (field === "siteName") {
        setSections((s) => ({ ...s, hero: { ...s.hero, headlineLine1: value } }))
      } else if (field === "siteDescription") {
        setSections((s) => ({ ...s, hero: { ...s.hero, subheadline: value } }))
      } else if (field === "siteContent") {
        setSections((s) => ({ ...s, about: { ...s.about, subheadline: value } }))
      }
    }
  }

  const progress = (currentStep / totalSteps) * 100

  return (
    <section
      id="contact"
      ref={ref}
      aria-labelledby="contact-heading"
      className="py-20 sm:py-28 lg:py-32 bg-gradient-to-b from-white via-teal-50/20 to-white relative overflow-hidden"
    >
      <h2 id="contact-heading" className="sr-only">
        {buildPage ? "טופס בניית אתר – מלאו את הפרטים" : "צרו קשר – השאירו פרטים ונחזור אליכם"}
      </h2>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div
        className={
          buildPage
            ? "w-full px-4 md:px-4 lg:px-6 relative flex flex-col md:flex-row md:gap-4 lg:gap-6 items-stretch build-form-theme md:min-h-[80vh] md:max-h-[calc(100vh-5rem)]"
            : "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative"
        }
        style={
          buildPage
            ? ({
                ["--form-primary"]: sections.theme?.primaryColor || "#0d9488",
                ["--form-secondary"]: sections.theme?.secondaryColor || "#f59e0b",
              } as React.CSSProperties)
            : undefined
        }
      >
        {/* Desktop: preview fills left (yellow area), form narrow column on right (red area) */}
        {buildPage && currentStep >= 1 && (
          <SectionLiveEditPanel
            currentStep={currentStep}
            sections={sections}
            previewPhotoUrls={uploadPreviewPhotoUrls}
            previewVideoUrl={uploadPreviewVideoUrl}
            className="hidden md:flex flex-1 min-w-0 min-h-0 order-2"
          />
        )}
        <div className={buildPage ? "w-full md:w-[380px] md:max-w-[28%] md:shrink-0 md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-6rem)] md:overflow-y-auto order-1" : ""}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="inline-block text-teal-600 font-semibold text-sm uppercase tracking-wider mb-3"
            >
              {buildPage ? "רוצים אתר כזה?" : "יצירת קשר"}
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {buildPage ? (
                <>בואו נדבר על <span className="gradient-text">האתר שלכם</span></>
              ) : (
                <>השאירו פרטים <span className="gradient-text">ונחזור אליכם</span></>
              )}
            </h2>
            <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
              {buildPage ? "שיחה קצרה, ללא עלות, ותוך שבוע יש לכם אתר חדש" : "מלאו את הפרטים ובעל האתר יצור איתכם קשר"}
            </p>
          </div>

          {/* Social Proof - Live Activity */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex items-center justify-center gap-2 mb-6"
            aria-hidden
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm text-slate-500">
              <span className="font-medium text-slate-700">{typingUsers} בעלי עסקים</span> מתעניינים עכשיו
            </span>
          </motion.div>

          {!isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Progress Bar - accessible progress indicator */}
              <div
                className="h-1.5 bg-slate-100"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-label={`שלב ${currentStep} מתוך ${totalSteps}`}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-400"
                  initial={{ width: `${100 / totalSteps}%` }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </div>

              {/* Step Indicator - scroll on very small screens */}
              <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-slate-100 overflow-x-auto" aria-label="מתקדם בטופס">
                <div className="flex justify-between items-center min-w-0 gap-1 sm:gap-2">
                  {formSteps.map((step) => (
                    <div
                      key={step.id}
                      aria-current={step.id === currentStep ? "step" : undefined}
                      className={`flex items-center gap-1 sm:gap-2 shrink-0 ${
                        step.id === currentStep
                          ? "text-teal-600"
                          : step.id < currentStep
                          ? "text-slate-400"
                          : "text-slate-300"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                          step.id === currentStep
                            ? "bg-teal-100 text-teal-600"
                            : step.id < currentStep
                            ? "bg-teal-500 text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {step.id < currentStep ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          step.id
                        )}
                      </div>
                      <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section editing popup - build form only, steps 2-7 (lightweight) */}
              {buildPage && currentStep >= 1 && buildStepSectionInfo[currentStep] && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`section-popup-${currentStep}`}
                    initial={{ opacity: 0, y: -12, scale: 0.96 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { type: "spring", stiffness: 400, damping: 28 },
                    }}
                    exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.18 } }}
                    className="mx-6 mt-2 mb-0 flex justify-center"
                  >
                    <div className="relative inline-flex items-center gap-3 rounded-xl border border-teal-200/80 bg-teal-50/80 px-4 py-2.5 shadow-sm">
                      <span className="text-xl" aria-hidden>
                        {buildStepSectionInfo[currentStep].icon}
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-teal-800">
                          עורכים כעת: {buildStepSectionInfo[currentStep].label}
                        </p>
                        <p className="text-xs text-teal-600/90">
                          {buildStepSectionInfo[currentStep].desc}
                        </p>
                      </div>
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-teal-400 opacity-80" aria-hidden />
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {/* Step 1 (contact form) or Step 7 (build form): Personal Details / Contact */}
                  {((currentStep === 1 && !buildPage) || (buildPage && currentStep === 7)) && (
                    <motion.div
                      key="step1contact"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      className="space-y-5"
                    >
                      <h3 className="text-lg font-bold text-slate-900 mb-4">נתחיל בהכרות קצרה</h3>
                      
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                          איך קוראים לך?
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          placeholder="השם המלא שלך"
                          value={formData.fullName}
                          onChange={(e) => handleChange("fullName", e.target.value)}
                          className={`w-full px-4 py-3.5 rounded-xl border-2 text-base ${
                            errors.fullName
                              ? "border-red-300 focus:border-red-500 bg-red-50"
                              : "border-slate-200 focus:border-teal-500 bg-slate-50"
                          } focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all text-slate-900 placeholder:text-slate-400`}
                        />
                        {errors.fullName && (
                          <p role="alert" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                          מספר הטלפון שלך
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          placeholder="050-1234567"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          className={`w-full px-4 py-3.5 rounded-xl border-2 text-base ${
                            errors.phone
                              ? "border-red-300 focus:border-red-500 bg-red-50"
                              : "border-slate-200 focus:border-teal-500 bg-slate-50"
                          } focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all text-slate-900 placeholder:text-slate-400`}
                        />
                        {errors.phone && (
                          <p role="alert" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                          כתובת המייל שלך
                        </label>
                        <input
                          type="email"
                          id="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className={`w-full px-4 py-3.5 rounded-xl border-2 text-base ${
                            errors.email
                              ? "border-red-300 focus:border-red-500 bg-red-50"
                              : "border-slate-200 focus:border-teal-500 bg-slate-50"
                          } focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all text-slate-900 placeholder:text-slate-400`}
                        />
                        {errors.email && (
                          <p role="alert" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Business (contact form) or Site content (build form) */}
                  {currentStep === 2 && !buildPage && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      className="space-y-5"
                    >
                      <h3 className="text-lg font-bold text-slate-900 mb-4">ספר/י לנו על העסק</h3>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          סוג העסק שלך
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { value: "service", label: "שירותים", emoji: "💼" },
                            { value: "ecommerce", label: "חנות אונליין", emoji: "🛒" },
                            { value: "realEstate", label: "נדל\"ן", emoji: "🏠" },
                            { value: "health", label: "בריאות / יופי", emoji: "💆" },
                            { value: "food", label: "מסעדות / אוכל", emoji: "🍽️" },
                            { value: "other", label: "אחר", emoji: "✨" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleChange("businessType", option.value)}
                              className={`p-4 rounded-xl border-2 text-right transition-all ${
                                formData.businessType === option.value
                                  ? "border-teal-500 bg-teal-50 text-teal-700"
                                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                              }`}
                            >
                              <span className="text-2xl block mb-1">{option.emoji}</span>
                              <span className="font-medium">{option.label}</span>
                            </button>
                          ))}
                        </div>
                        {errors.businessType && (
                          <p className="mt-2 text-sm text-red-600">{errors.businessType}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          גודל העסק
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: "solo", label: "עצמאי" },
                            { value: "small", label: "1-5 עובדים" },
                            { value: "medium", label: "6-20 עובדים" },
                            { value: "large", label: "20+ עובדים" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleChange("businessSize", option.value)}
                              className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                                formData.businessSize === option.value
                                  ? "border-teal-500 bg-teal-50 text-teal-700"
                                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          מתי תרצו להתחיל?
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: "asap", label: "בהקדם האפשרי 🔥" },
                            { value: "month", label: "תוך חודש" },
                            { value: "exploring", label: "רק בודק/ת" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleChange("urgency", option.value)}
                              className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                                formData.urgency === option.value
                                  ? "border-teal-500 bg-teal-50 text-teal-700"
                                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 (build): Site content & uploads */}
                  {buildPage && currentStep === 2 && (
                    <motion.div
                      key="step2build"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      className="space-y-5"
                    >
                      <h3 className="text-lg font-bold text-slate-900 mb-4">תוכן לאתר – תמונות, טקסט וסרטונים</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        העלו מה שיש לכם (אופציונלי). נשתמש בזה כדי לבנות את האתר בדיוק כמו שאתם רוצים.
                      </p>

                      <div>
                        <label htmlFor="siteContent" className="block text-sm font-semibold text-slate-700 mb-2">
                          טקסט נוסף – אודות, שירותים, מבצעים (אופציונלי)
                        </label>
                        <textarea
                          id="siteContent"
                          rows={4}
                          value={formData.siteContent}
                          onChange={(e) => handleChange("siteContent", e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all text-slate-900 bg-slate-50 resize-none placeholder:text-slate-400"
                          placeholder="כל טקסט שתרצו שיופיע באתר – נשתמש בזה כבסיס לתוכן."
                        />
                      </div>

                      <h4 className="text-base font-bold text-slate-800 mt-6 mb-2">מה תקבלו? – שלוש כרטיסיות (אופציונלי)</h4>
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-4 space-y-2">
                          <div className="flex gap-2 items-center flex-wrap">
                            <label className="text-sm font-medium text-slate-700 shrink-0">אייקון:</label>
                            <select
                              value={sections.features[i]?.icon ?? (i === 0 ? "check" : i === 1 ? "mail" : "currency")}
                              onChange={(e) => {
                                const next = [...sections.features]
                                next[i] = { ...(next[i] ?? { title: "", description: "", icon: "" }), icon: e.target.value }
                                setSections((s) => ({ ...s, features: next }))
                              }}
                              className="px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 text-slate-900 bg-white min-w-[140px]"
                            >
                              {FEATURE_ICON_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <input
                            type="text"
                            value={sections.features[i]?.title ?? ""}
                            onChange={(e) => {
                              const next = [...sections.features]
                              next[i] = { ...(next[i] ?? { title: "", description: "", icon: "" }), title: e.target.value }
                              setSections((s) => ({ ...s, features: next }))
                            }}
                            placeholder={`כותרת כרטיס ${i + 1}`}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
                          />
                          <input
                            type="text"
                            value={sections.features[i]?.description ?? ""}
                            onChange={(e) => {
                              const next = [...sections.features]
                              next[i] = { ...(next[i] ?? { title: "", description: "", icon: "" }), description: e.target.value }
                              setSections((s) => ({ ...s, features: next }))
                            }}
                            placeholder="תיאור קצר"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      ))}

                      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4 mt-6">
                        <h4 className="text-base font-bold text-slate-800">תוצאות וביקורות – כותרת, שלושה מדדים וביקורות</h4>
                        <p className="text-xs text-slate-600">כותרת הבלוק (תוצאות שמדברות...), שלושת המספרים למעלה וביקורות (אופציונלי).</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">תגית (באדג׳)</label>
                            <input type="text" value={sections.reviewsSection?.badge ?? ""} onChange={(e) => setSections((s) => ({ ...s, reviewsSection: { ...s.reviewsSection, badge: e.target.value } }))} placeholder="הלקוחות שלנו מספרים" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">כותרת (חלק ראשון)</label>
                            <input type="text" value={sections.reviewsSection?.headline ?? ""} onChange={(e) => setSections((s) => ({ ...s, reviewsSection: { ...s.reviewsSection, headline: e.target.value } }))} placeholder="תוצאות שמדברות" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">כותרת (חלק מודגש)</label>
                            <input type="text" value={sections.reviewsSection?.headlineHighlight ?? ""} onChange={(e) => setSections((s) => ({ ...s, reviewsSection: { ...s.reviewsSection, headlineHighlight: e.target.value } }))} placeholder=" בעד עצמן" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">תת־כותרת</label>
                            <input type="text" value={sections.reviewsSection?.subheadline ?? ""} onChange={(e) => setSections((s) => ({ ...s, reviewsSection: { ...s.reviewsSection, subheadline: e.target.value } }))} placeholder="עסקים שעבדנו איתם משתפים..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">שלושה מדדים (ערך + תווית)</label>
                            <div className="space-y-2">
                              {[0, 1, 2].map((i) => {
                                const st = sections.reviewsSection?.stats?.[i] ?? { value: "", label: "" }
                                return (
                                <div key={i} className="flex gap-2 items-center">
                                  <input type="text" value={st.value} onChange={(e) => { const next = [...(sections.reviewsSection?.stats ?? [])]; while (next.length <= i) next.push({ value: "", label: "" }); next[i] = { ...next[i], value: e.target.value }; setSections((s) => ({ ...s, reviewsSection: { ...s.reviewsSection, stats: next } })) }} placeholder="150+" className="w-20 px-2 py-2 rounded-lg border border-slate-200 text-slate-900 text-center" />
                                  <input type="text" value={st.label} onChange={(e) => { const next = [...(sections.reviewsSection?.stats ?? [])]; while (next.length <= i) next.push({ value: "", label: "" }); next[i] = { ...next[i], label: e.target.value }; setSections((s) => ({ ...s, reviewsSection: { ...s.reviewsSection, stats: next } })) }} placeholder="לקוחות מרוצים" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-slate-900" />
                                </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 pt-2">
                          <label className="block text-sm font-bold text-slate-700">ביקורות (אופציונלי) – אם ריק, יוצגו ביקורות ברירת מחדל</label>
                          {[0, 1, 2, 3, 4, 5].map((i) => {
                            const r = sections.reviewsSection?.reviews?.[i] ?? { name: "", role: "", company: "", content: "", rating: 5, result: "", resultLabel: "", imageUrl: "" }
                            return (
                              <div key={i} className="bg-white rounded-lg p-3 border border-slate-200 space-y-2">
                                <div className="text-xs font-bold text-slate-500 mb-1">ביקורת {i + 1}</div>
                                <div className="flex flex-wrap gap-2">
                                  <input type="text" value={r.name} onChange={(e) => { const next = [...(sections.reviewsSection?.reviews ?? [])]; while (next.length <= i) next.push({ name: "", role: "", company: "", content: "", rating: 5, result: "", resultLabel: "", imageUrl: "" }); next[i] = { ...next[i], name: e.target.value }; setSections((s) => ({ ...s, reviewsSection: { ...s.reviewsSection, reviews: next } })) }} placeholder="שם" className="w-28 px-2 py-2 rounded-lg border border-slate-200 text-slate-900" />
                                  <input type="text" value={r.role ?? ""} onChange={(e) => { const next = [...(sections.reviewsSection?.reviews ?? [])]; while (next.length <= i) next.push({ name: "", role: "", company: "", content: "", rating: 5, result: "", resultLabel: "", imageUrl: "" }); next[i] = { ...next[i], role: e.target.value }; setSections((s) => ({ ...s, reviewsSection: { ...s.reviewsSection, reviews: next } })) }} placeholder="תפקיד" className="w-24 px-2 py-2 rounded-lg border border-slate-200 text-slate-900" />
                                  <input type="text" value={r.company ?? ""} onChange={(e) => { const next = [...(sections.reviewsSection?.reviews ?? [])]; while (next.length <= i) next.push({ name: "", role: "", company: "", content: "", rating: 5, result: "", resultLabel: "", imageUrl: "" }); next[i] = { ...next[i], company: e.target.value }; setSections((s) => ({ ...s, reviewsSection: { ...s.reviewsSection, reviews: next } })) }} placeholder="חברה" className="w-28 px-2 py-2 rounded-lg border border-slate-200 text-slate-900" />
                                  <input type="number" min={1} max={5} value={r.rating} onChange={(e) => { const next = [...(sections.reviewsSection?.reviews ?? [])]; while (next.length <= i) next.push({ name: "", role: "", company: "", content: "", rating: 5, result: "", resultLabel: "", imageUrl: "" }); next[i] = { ...next[i], rating: parseInt(e.target.value, 10) || 5 }; setSections((s) => ({ ...s, reviewsSection: { ...s.reviewsSection, reviews: next } })) }} className="w-14 px-2 py-2 rounded-lg border border-slate-200 text-slate-900" />
                                  <input type="text" value={r.result ?? ""} onChange={(e) => { const next = [...(sections.reviewsSection?.reviews ?? [])]; while (next.length <= i) next.push({ name: "", role: "", company: "", content: "", rating: 5, result: "", resultLabel: "", imageUrl: "" }); next[i] = { ...next[i], result: e.target.value }; setSections((s) => ({ ...s, reviewsSection: { ...s.reviewsSection, reviews: next } })) }} placeholder="תוצאה (150%)" className="w-20 px-2 py-2 rounded-lg border border-slate-200 text-slate-900" />
                                  <input type="text" value={r.resultLabel ?? ""} onChange={(e) => { const next = [...(sections.reviewsSection?.reviews ?? [])]; while (next.length <= i) next.push({ name: "", role: "", company: "", content: "", rating: 5, result: "", resultLabel: "", imageUrl: "" }); next[i] = { ...next[i], resultLabel: e.target.value }; setSections((s) => ({ ...s, reviewsSection: { ...s.reviewsSection, reviews: next } })) }} placeholder="תווית" className="w-24 px-2 py-2 rounded-lg border border-slate-200 text-slate-900" />
                                </div>
                                <input type="url" value={r.imageUrl ?? ""} onChange={(e) => { const next = [...(sections.reviewsSection?.reviews ?? [])]; while (next.length <= i) next.push({ name: "", role: "", company: "", content: "", rating: 5, result: "", resultLabel: "", imageUrl: "" }); next[i] = { ...next[i], imageUrl: e.target.value }; setSections((s) => ({ ...s, reviewsSection: { ...s.reviewsSection, reviews: next } })) }} placeholder="קישור לתמונת פרופיל" className="w-full px-2 py-2 rounded-lg border border-slate-200 text-slate-900 text-sm" />
                                <textarea rows={2} value={r.content} onChange={(e) => { const next = [...(sections.reviewsSection?.reviews ?? [])]; while (next.length <= i) next.push({ name: "", role: "", company: "", content: "", rating: 5, result: "", resultLabel: "", imageUrl: "" }); next[i] = { ...next[i], content: e.target.value }; setSections((s) => ({ ...s, reviewsSection: { ...s.reviewsSection, reviews: next } })) }} placeholder="תוכן הביקורת" className="w-full px-2 py-2 rounded-lg border border-slate-200 text-slate-900 text-sm resize-none" />
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-amber-50/50 p-4 space-y-3 mt-6">
                        <h4 className="text-base font-bold text-slate-800">לקוח לדוגמה (Case Study) – התאמה לתוכן האתר</h4>
                        <p className="text-xs text-slate-600">כדי שהבלוק הזה יתאים לוויקיפדיה או לכל נושא אחר – ערכו את השדות למטה.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">כותרת הבלוק</label>
                            <input type="text" value={sections.caseStudy?.title ?? ""} onChange={(e) => setSections((s) => ({ ...s, caseStudy: { ...s.caseStudy, title: e.target.value } }))} placeholder="לקוח לדוגמה" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">שם המיזם / החברה</label>
                            <input type="text" value={sections.caseStudy?.company ?? ""} onChange={(e) => setSections((s) => ({ ...s, caseStudy: { ...s.caseStudy, company: e.target.value } }))} placeholder="סטודיו לעיצוב פנים" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">תחום / קטגוריה</label>
                            <input type="text" value={sections.caseStudy?.industry ?? ""} onChange={(e) => setSections((s) => ({ ...s, caseStudy: { ...s.caseStudy, industry: e.target.value } }))} placeholder="עיצוב ואדריכלות" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">האתגר</label>
                            <input type="text" value={sections.caseStudy?.challenge ?? ""} onChange={(e) => setSections((s) => ({ ...s, caseStudy: { ...s.caseStudy, challenge: e.target.value } }))} placeholder="אתר ישן ואיטי, לא מותאם למובייל..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">הפתרון</label>
                            <input type="text" value={sections.caseStudy?.solution ?? ""} onChange={(e) => setSections((s) => ({ ...s, caseStudy: { ...s.caseStudy, solution: e.target.value } }))} placeholder="דף נחיתה מודרני + מערכת מיילים..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">ציטוט</label>
                            <textarea rows={2} value={sections.caseStudy?.quote ?? ""} onChange={(e) => setSections((s) => ({ ...s, caseStudy: { ...s.caseStudy, quote: e.target.value } }))} placeholder="האתר החדש נראה פי 10 יותר טוב..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 resize-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">מחבר הציטוט</label>
                            <input type="text" value={sections.caseStudy?.author ?? ""} onChange={(e) => setSections((s) => ({ ...s, caseStudy: { ...s.caseStudy, author: e.target.value } }))} placeholder="מיכל, בעלת הסטודיו" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">טקסט כפתור CTA</label>
                            <input type="text" value={sections.caseStudy?.ctaText ?? ""} onChange={(e) => setSections((s) => ({ ...s, caseStudy: { ...s.caseStudy, ctaText: e.target.value } }))} placeholder="רוצים תוצאות דומות?" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">קישור לתמונת רקע (אופציונלי)</label>
                            <input type="url" value={sections.caseStudy?.image ?? ""} onChange={(e) => setSections((s) => ({ ...s, caseStudy: { ...s.caseStudy, image: e.target.value } }))} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">שלוש מדדים (ערך + תווית)</label>
                            <div className="space-y-2">
                              {(sections.caseStudy?.results ?? []).slice(0, 3).map((r, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                  <input type="text" value={r.metric} onChange={(e) => { const next = [...(sections.caseStudy?.results ?? [])]; next[i] = { ...next[i], metric: e.target.value }; setSections((s) => ({ ...s, caseStudy: { ...s.caseStudy, results: next } })) } } placeholder="300%" className="w-20 px-2 py-2 rounded-lg border border-slate-200 text-slate-900 text-center" />
                                  <input type="text" value={r.label} onChange={(e) => { const next = [...(sections.caseStudy?.results ?? [])]; next[i] = { ...next[i], label: e.target.value }; setSections((s) => ({ ...s, caseStudy: { ...s.caseStudy, results: next } })) } } placeholder="יותר פניות" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-slate-900" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4 mt-6">
                        <h4 className="text-base font-bold text-slate-800">איך זה עובד – כותרת וארבעה שלבים</h4>
                        <p className="text-xs text-slate-600">התאימו את הבלוק לנושא האתר (למשל נבחרת כדורעף: שלבי אימון, משחק וכו׳).</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">תגית (באדג׳)</label>
                            <input type="text" value={sections.howItWorks?.badge ?? ""} onChange={(e) => setSections((s) => ({ ...s, howItWorks: { ...s.howItWorks, badge: e.target.value } }))} placeholder="התהליך שלנו" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">כותרת (חלק ראשון)</label>
                            <input type="text" value={sections.howItWorks?.headline ?? ""} onChange={(e) => setSections((s) => ({ ...s, howItWorks: { ...s.howItWorks, headline: e.target.value } }))} placeholder="מאתר ישן" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">כותרת (חלק מודגש)</label>
                            <input type="text" value={sections.howItWorks?.headlineHighlight ?? ""} onChange={(e) => setSections((s) => ({ ...s, howItWorks: { ...s.howItWorks, headlineHighlight: e.target.value } }))} placeholder=" לדף נחיתה שמוכר" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">תת־כותרת</label>
                            <input type="text" value={sections.howItWorks?.subheadline ?? ""} onChange={(e) => setSections((s) => ({ ...s, howItWorks: { ...s.howItWorks, subheadline: e.target.value } }))} placeholder="ארבעה שלבים פשוטים..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">טקסט CTA</label>
                            <input type="text" value={sections.howItWorks?.ctaText ?? ""} onChange={(e) => setSections((s) => ({ ...s, howItWorks: { ...s.howItWorks, ctaText: e.target.value } }))} placeholder="שיחת היכרות" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">הדגשת CTA</label>
                            <input type="text" value={sections.howItWorks?.ctaHighlight ?? ""} onChange={(e) => setSections((s) => ({ ...s, howItWorks: { ...s.howItWorks, ctaHighlight: e.target.value } }))} placeholder=" ללא עלות" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">כפתור CTA</label>
                            <input type="text" value={sections.howItWorks?.ctaButton ?? ""} onChange={(e) => setSections((s) => ({ ...s, howItWorks: { ...s.howItWorks, ctaButton: e.target.value } }))} placeholder="בואו נדבר" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">קישור כפתור CTA (לאן הכפתור מוביל)</label>
                            <input type="text" value={sections.howItWorks?.ctaButtonUrl ?? ""} onChange={(e) => setSections((s) => ({ ...s, howItWorks: { ...s.howItWorks, ctaButtonUrl: e.target.value } }))} placeholder="/client או https://example.com/link" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400" />
                          </div>
                        </div>
                        <div className="space-y-4 pt-2">
                          <label className="block text-sm font-bold text-slate-700">ארבעה שלבים – כותרת, תיאור, משך, הדגשה, אייקון</label>
                          {[0, 1, 2, 3].map((i) => {
                            const step = sections.howItWorks?.steps?.[i] ?? { id: i + 1, title: "", description: "", duration: "", highlight: "", icon: "chat" }
                            return (
                              <div key={i} className="bg-white rounded-lg p-4 border border-slate-200 space-y-2">
                                <div className="text-xs font-bold text-slate-500 mb-1">שלב {i + 1}/4</div>
                                <div className="flex flex-wrap gap-2">
                                  <input type="text" value={step.title} onChange={(e) => { const next = [...(sections.howItWorks?.steps ?? [])]; while (next.length <= i) next.push({ id: next.length + 1, title: "", description: "", duration: "", highlight: "", icon: "chat" }); next[i] = { ...next[i], title: e.target.value }; setSections((s) => ({ ...s, howItWorks: { ...s.howItWorks, steps: next } })) }} placeholder="כותרת שלב" className="flex-1 min-w-[140px] px-3 py-2 rounded-lg border border-slate-200 text-slate-900" />
                                  <select value={step.icon} onChange={(e) => { const next = [...(sections.howItWorks?.steps ?? [])]; while (next.length <= i) next.push({ id: next.length + 1, title: "", description: "", duration: "", highlight: "", icon: "chat" }); next[i] = { ...next[i], icon: e.target.value }; setSections((s) => ({ ...s, howItWorks: { ...s.howItWorks, steps: next } })) }} className="px-3 py-2 rounded-lg border border-slate-200 text-slate-900 bg-white">
                                    <option value="chat">צ׳אט</option>
                                    <option value="clipboard">לוח</option>
                                    <option value="lightning">ברק</option>
                                    <option value="chart">גרף</option>
                                    <option value="rocket">רקטה</option>
                                  </select>
                                  <input type="text" value={step.duration} onChange={(e) => { const next = [...(sections.howItWorks?.steps ?? [])]; while (next.length <= i) next.push({ id: next.length + 1, title: "", description: "", duration: "", highlight: "", icon: "chat" }); next[i] = { ...next[i], duration: e.target.value }; setSections((s) => ({ ...s, howItWorks: { ...s.howItWorks, steps: next } })) }} placeholder="20 דק'" className="w-24 px-2 py-2 rounded-lg border border-slate-200 text-slate-900 text-center" />
                                  <input type="text" value={step.highlight ?? ""} onChange={(e) => { const next = [...(sections.howItWorks?.steps ?? [])]; while (next.length <= i) next.push({ id: next.length + 1, title: "", description: "", duration: "", highlight: "", icon: "chat" }); next[i] = { ...next[i], highlight: e.target.value }; setSections((s) => ({ ...s, howItWorks: { ...s.howItWorks, steps: next } })) }} placeholder="הדגשה (חינם)" className="w-28 px-2 py-2 rounded-lg border border-slate-200 text-slate-900" />
                                </div>
                                <textarea rows={2} value={step.description} onChange={(e) => { const next = [...(sections.howItWorks?.steps ?? [])]; while (next.length <= i) next.push({ id: next.length + 1, title: "", description: "", duration: "", highlight: "", icon: "chat" }); next[i] = { ...next[i], description: e.target.value }; setSections((s) => ({ ...s, howItWorks: { ...s.howItWorks, steps: next } })) }} placeholder="תיאור שלב" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 resize-none text-sm" />
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          תמונות (לוגו, מוצרים, צוות) – JPEG, PNG, WebP עד 50MB. ניתן לגרור מכמה תיקיות.
                        </label>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          multiple
                          onChange={(e) => {
                            const list = e.target.files ? Array.from(e.target.files) : []
                            setPhotoFiles((prev) => [...prev, ...list].slice(0, MAX_PHOTO_FILES))
                            e.target.value = ""
                          }}
                          className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-teal-50 file:text-teal-700 file:font-medium hover:file:bg-teal-100"
                        />
                        {photoFiles.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-teal-600">{photoFiles.length} תמונות נבחרו</p>
                            <ul className="text-xs text-slate-500 space-y-0.5 max-h-24 overflow-y-auto">
                              {photoFiles.map((f, i) => (
                                <li key={i} className="flex items-center justify-between gap-2">
                                  <span className="truncate">{f.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => setPhotoFiles((p) => p.filter((_, j) => j !== i))}
                                    className="text-red-600 hover:text-red-700 shrink-0"
                                    aria-label="הסר"
                                  >
                                    ×
                                  </button>
                                </li>
                              ))}
                            </ul>
                            <button
                              type="button"
                              onClick={() => setPhotoFiles([])}
                              className="text-sm text-slate-500 hover:text-slate-700 underline"
                            >
                              נקה הכל
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          סרטונים (אופציונלי) – MP4, WebM, MOV עד 50MB. ניתן לגרור מכמה תיקיות.
                        </label>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          multiple
                          onChange={(e) => {
                            const list = e.target.files ? Array.from(e.target.files) : []
                            setVideoFiles((prev) => [...prev, ...list].slice(0, MAX_VIDEO_FILES))
                            e.target.value = ""
                          }}
                          className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-teal-50 file:text-teal-700 file:font-medium hover:file:bg-teal-100"
                        />
                        {videoFiles.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-teal-600">{videoFiles.length} סרטונים נבחרו</p>
                            <ul className="text-xs text-slate-500 space-y-0.5 max-h-24 overflow-y-auto">
                              {videoFiles.map((f, i) => (
                                <li key={i} className="flex items-center justify-between gap-2">
                                  <span className="truncate">{f.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => setVideoFiles((p) => p.filter((_, j) => j !== i))}
                                    className="text-red-600 hover:text-red-700 shrink-0"
                                    aria-label="הסר"
                                  >
                                    ×
                                  </button>
                                </li>
                              ))}
                            </ul>
                            <button
                              type="button"
                              onClick={() => setVideoFiles([])}
                              className="text-sm text-slate-500 hover:text-slate-700 underline"
                            >
                              נקה הכל
                            </button>
                          </div>
                        )}
                      </div>

                      {uploadProgress && (
                        <p className="text-sm text-teal-600 flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {uploadProgress}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Final (contact) or Hero (build) */}
                  {currentStep === 3 && !buildPage && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      className="space-y-5"
                    >
                      <h3 className="text-lg font-bold text-slate-900 mb-4">כמעט סיימנו!</h3>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                          רוצה להוסיף משהו? (אופציונלי)
                        </label>
                        <textarea
                          id="message"
                          rows={3}
                          value={formData.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all text-slate-900 bg-slate-50 text-base resize-none placeholder:text-slate-400"
                          placeholder="יש לך אתר קיים? מה הסגנון שאתה מחפש? כמה מיילים אתה שולח בחודש?"
                        />
                      </div>

                      {/* Consent */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.consent}
                            onChange={(e) => handleChange("consent", e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-2 border-slate-300 text-teal-500 focus:ring-2 focus:ring-teal-200 cursor-pointer"
                          />
                          <span className="text-sm text-slate-600 flex-1">
                            אני מאשר/ת קבלת מידע ועדכונים. הפרטים מאובטחים ולא יועברו לצד שלישי.
                          </span>
                        </label>
                        {errors.consent && (
                          <p className="mt-2 text-sm text-red-600">{errors.consent}</p>
                        )}
                      </div>

                      {/* Summary */}
                      <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                        <h4 className="font-semibold text-teal-800 mb-2">מה קורה אחרי?</h4>
                        <ul className="text-sm text-teal-700 space-y-1">
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            ניצור קשר תוך 24 שעות
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            שיחת היכרות (20 דק') - נבין מה אתה צריך
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            הצעת מחיר מפורטת תוך יומיים
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 1 (build): Colors first, then Header + Hero */}
                  {buildPage && currentStep === 1 && (
                    <motion.div
                      key="step1build"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      className="space-y-6"
                    >
                      <div className="rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-4 sm:p-5">
                        <h4 className="text-base font-bold text-slate-800 mb-3">צבעים עיקריים לאתר</h4>
                        <p className="text-sm text-slate-600 mb-4">בחרו צבע ראשי וצבע משני — הם שולטים בכל האקסנטים: לוגו בכותרת, כפתור CTA, כותרת מודגשת (גרדיאנט), אייקוני כרטיסים, כפתור הראשי בהיירו ורקע עדין.</p>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">מצב האתר – בהיר או כהה</label>
                            <p className="text-sm text-slate-600 mb-2">בחרו אם האתר יוצג במצב בהיר (רקע לבן) או כהה (רקע כהה).</p>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => setSections((s) => ({ ...s, theme: { ...s.theme, themeMode: "light" } }))}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                                  sections.theme.themeMode !== "dark"
                                    ? "border-teal-500 bg-teal-50 text-teal-800 ring-2 ring-teal-200"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                }`}
                              >
                                <span className="w-5 h-5 rounded-full bg-white border-2 border-slate-300 shadow-inner" />
                                בהיר
                              </button>
                              <button
                                type="button"
                                onClick={() => setSections((s) => ({ ...s, theme: { ...s.theme, themeMode: "dark" } }))}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                                  sections.theme.themeMode === "dark"
                                    ? "border-teal-500 bg-slate-800 text-white ring-2 ring-teal-200"
                                    : "border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300"
                                }`}
                              >
                                <span className="w-5 h-5 rounded-full bg-slate-700 border-2 border-slate-500 shadow-inner" />
                                כהה
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">צבע ראשי (Primary)</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {colorPresets.primary.map((preset) => (
                                <button
                                  key={preset.value}
                                  type="button"
                                  onClick={() => setSections((s) => ({ ...s, theme: { ...s.theme, primaryColor: preset.value } }))}
                                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                                    sections.theme.primaryColor === preset.value ? "border-slate-800 scale-110 ring-2 ring-offset-2 ring-slate-400" : "border-slate-300 hover:scale-105"
                                  }`}
                                  style={{ backgroundColor: preset.value }}
                                  title={preset.name}
                                  aria-label={preset.name}
                                />
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                id="primaryColorPickerStep1"
                                value={sections.theme.primaryColor}
                                onChange={(e) => setSections((s) => ({ ...s, theme: { ...s.theme, primaryColor: e.target.value } }))}
                                className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                              />
                              <input
                                type="text"
                                value={sections.theme.primaryColor}
                                onChange={(e) => setSections((s) => ({ ...s, theme: { ...s.theme, primaryColor: e.target.value } }))}
                                placeholder="#0d9488"
                                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono text-slate-800"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">צבע משני (Secondary)</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {colorPresets.secondary.map((preset) => (
                                <button
                                  key={preset.value}
                                  type="button"
                                  onClick={() => setSections((s) => ({ ...s, theme: { ...s.theme, secondaryColor: preset.value } }))}
                                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                                    sections.theme.secondaryColor === preset.value ? "border-slate-800 scale-110 ring-2 ring-offset-2 ring-slate-400" : "border-slate-300 hover:scale-105"
                                  }`}
                                  style={{ backgroundColor: preset.value }}
                                  title={preset.name}
                                  aria-label={preset.name}
                                />
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                id="secondaryColorPickerStep1"
                                value={sections.theme.secondaryColor}
                                onChange={(e) => setSections((s) => ({ ...s, theme: { ...s.theme, secondaryColor: e.target.value } }))}
                                className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300"
                              />
                              <input
                                type="text"
                                value={sections.theme.secondaryColor}
                                onChange={(e) => setSections((s) => ({ ...s, theme: { ...s.theme, secondaryColor: e.target.value } }))}
                                placeholder="#f59e0b"
                                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono text-slate-800"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-2">ניווט וכותרת (הראש של האתר)</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">שם העסק בכותרת</label>
                          <input
                            type="text"
                            value={sections.header.name}
                            onChange={(e) => setSections((s) => ({ ...s, header: { ...s.header, name: e.target.value } }))}
                            placeholder={siteConfig.name}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">אות לוגו (במעגל, אם אין תמונה)</label>
                          <input
                            type="text"
                            maxLength={2}
                            value={sections.header.logoText}
                            onChange={(e) => setSections((s) => ({ ...s, header: { ...s.header, logoText: e.target.value } }))}
                            placeholder={siteConfig.branding.logoText}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">לוגו (תמונה)</label>
                        <p className="text-xs text-slate-500 mb-2">קישור לתמונה או העלאת קובץ. אם מוגדר – יוצג במקום האות במעגל.</p>
                        <div className="space-y-2">
                          <input
                            type="url"
                            value={sections.header.logoUrl?.startsWith("blob:") ? "" : (sections.header.logoUrl || "")}
                            onChange={(e) => {
                              const v = e.target.value.trim()
                              if (!v || !v.startsWith("blob:")) {
                                setSectionHeaderLogoFile(null)
                                setSections((s) => ({ ...s, header: { ...s.header, logoUrl: v } }))
                              }
                            }}
                            placeholder="https://example.com/logo.png"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              setSectionHeaderLogoFile(file ?? null)
                              e.target.value = ""
                            }}
                            className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-teal-50 file:text-teal-700 file:font-medium hover:file:bg-teal-100"
                          />
                          {sectionHeaderLogoFile && (
                            <p className="text-sm text-teal-600">
                              נבחר: {sectionHeaderLogoFile.name}
                              <button type="button" onClick={() => setSectionHeaderLogoFile(null)} className="mr-2 text-red-600 hover:text-red-700">הסר</button>
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">תגית / סיסמה (מתחת לשם)</label>
                        <input
                          type="text"
                          value={sections.header.tagline}
                          onChange={(e) => setSections((s) => ({ ...s, header: { ...s.header, tagline: e.target.value } }))}
                          placeholder={siteConfig.tagline}
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">קישורי ניווט (טקסט בלבד)</label>
                        <div className="space-y-2">
                          {(sections.header.navLinks || []).map((link, i) => (
                            <div key={link.id} className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 w-20 shrink-0">{link.id}</span>
                              <input
                                type="text"
                                value={link.label}
                                onChange={(e) => {
                                  const next = [...(sections.header.navLinks || [])]
                                  next[i] = { ...next[i], label: e.target.value }
                                  setSections((s) => ({ ...s, header: { ...s.header, navLinks: next } }))
                                }}
                                placeholder={headerConfig.navLinks[i]?.label}
                                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">טלפון בכותרת</label>
                          <input
                            type="tel"
                            value={sections.header.phone}
                            onChange={(e) => setSections((s) => ({ ...s, header: { ...s.header, phone: e.target.value } }))}
                            placeholder={siteConfig.contact.phone}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">טקסט כפתור CTA (רוצה אתר כזה?)</label>
                          <input
                            type="text"
                            value={sections.header.ctaButton}
                            onChange={(e) => setSections((s) => ({ ...s, header: { ...s.header, ctaButton: e.target.value } }))}
                            placeholder={headerConfig.ctaButton}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-4 pt-2 border-t border-slate-200">טקסט אזור ההיירו (אופציונלי)</h3>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">שורת כותרת ראשית</label>
                        <input
                          type="text"
                          value={sections.hero.headlineLine1}
                          onChange={(e) => setSections((s) => ({ ...s, hero: { ...s.hero, headlineLine1: e.target.value } }))}
                          placeholder="האתר שמאפשר לכם"
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">הדגשה (מילה בולטת)</label>
                        <input
                          type="text"
                          value={sections.hero.highlight}
                          onChange={(e) => setSections((s) => ({ ...s, hero: { ...s.hero, highlight: e.target.value } }))}
                          placeholder="עד 3 מילים מתחלפות, מופרדות בפסיק (למשל: למכור, להתבלט, לצמוח)"
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                        <p className="mt-1 text-xs text-slate-500">מילה אחת תוצג קבוע; 2–3 מילים יתחלפו אוטומטית.</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">תת-כותרת</label>
                        <input
                          type="text"
                          value={sections.hero.subheadline}
                          onChange={(e) => setSections((s) => ({ ...s, hero: { ...s.hero, subheadline: e.target.value } }))}
                          placeholder="דף נחיתה מעוצב שמביא לקוחות..."
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">כפתור ראשי (טקסט)</label>
                        <input
                          type="text"
                          value={sections.hero.ctaPrimaryText ?? ""}
                          onChange={(e) => setSections((s) => ({ ...s, hero: { ...s.hero, ctaPrimaryText: e.target.value } }))}
                          placeholder="רוצים דף נחיתה? דברו איתנו"
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">כפתור משני (טקסט)</label>
                        <input
                          type="text"
                          value={sections.hero.ctaSecondaryText ?? ""}
                          onChange={(e) => setSections((s) => ({ ...s, hero: { ...s.hero, ctaSecondaryText: e.target.value } }))}
                          placeholder="איך זה עובד?"
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">טקסט אמון (תג סוציאלי)</label>
                        <input
                          type="text"
                          value={sections.hero.trustText ?? ""}
                          onChange={(e) => setSections((s) => ({ ...s, hero: { ...s.hero, trustText: e.target.value } }))}
                          placeholder="מצטרפים ל-150+ עסקים עם דפי נחיתה"
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">כותרת כרטיס ערך (מה תקבלו?)</label>
                        <input
                          type="text"
                          value={sections.hero.valueCardTitle ?? ""}
                          onChange={(e) => setSections((s) => ({ ...s, hero: { ...s.hero, valueCardTitle: e.target.value } }))}
                          placeholder="מה תקבלו?"
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">המשך כותרת כרטיס (מודגש)</label>
                        <input
                          type="text"
                          value={sections.hero.valueCardHighlight ?? ""}
                          onChange={(e) => setSections((s) => ({ ...s, hero: { ...s.hero, valueCardHighlight: e.target.value } }))}
                          placeholder="הכל בחבילה אחת."
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 (build): About */}
                  {buildPage && currentStep === 3 && (
                    <motion.div
                      key="step3build"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      className="space-y-5"
                    >
                      <h3 className="text-lg font-bold text-slate-900 mb-4">אזור אודות (אופציונלי)</h3>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">כותרת</label>
                        <input
                          type="text"
                          value={sections.about.headline}
                          onChange={(e) => setSections((s) => ({ ...s, about: { ...s.about, headline: e.target.value } }))}
                          placeholder="לא סוכנות שיווק."
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">כותרת מודגשת (המשך הכותרת בצבע)</label>
                        <input
                          type="text"
                          value={sections.about.headlineHighlight}
                          onChange={(e) => setSections((s) => ({ ...s, about: { ...s.about, headlineHighlight: e.target.value } }))}
                          placeholder="בונים דף נחיתה שמוכר."
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">תיאור קצר</label>
                        <textarea
                          rows={3}
                          value={sections.about.subheadline}
                          onChange={(e) => setSections((s) => ({ ...s, about: { ...s.about, subheadline: e.target.value } }))}
                          placeholder="אנחנו מתמחים בדבר אחד..."
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400 resize-none"
                        />
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mt-6 mb-2">כרטיס אודות / ציטוט (אופציונלי)</h4>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">ציטוט / מסר מרכזי</label>
                        <textarea
                          rows={3}
                          value={sections.about.founder.quote}
                          onChange={(e) => setSections((s) => ({ ...s, about: { ...s.about, founder: { ...s.about.founder, quote: e.target.value } } }))}
                          placeholder="ראינו עסקים משלמים הון..."
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">תמונה לכרטיס (צוות/חברה)</label>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => {
                            setSectionAboutImageFile(e.target.files?.[0] ?? null)
                            e.target.value = ""
                          }}
                          className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-teal-50 file:text-teal-700 file:font-medium hover:file:bg-teal-100"
                        />
                        {sectionAboutImageFile && (
                          <p className="mt-1.5 text-sm text-teal-600">
                            נבחר: {sectionAboutImageFile.name}
                            <button type="button" onClick={() => setSectionAboutImageFile(null)} className="mr-2 text-red-600 hover:text-red-700">הסר</button>
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">שם החברה / האדם</label>
                          <input
                            type="text"
                            value={sections.about.founder.name}
                            onChange={(e) => setSections((s) => ({ ...s, about: { ...s.about, founder: { ...s.about.founder, name: e.target.value } } }))}
                            placeholder="צוות MailFlow"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">תפקיד / תיאור</label>
                          <input
                            type="text"
                            value={sections.about.founder.role}
                            onChange={(e) => setSections((s) => ({ ...s, about: { ...s.about, founder: { ...s.about.founder, role: e.target.value } } }))}
                            placeholder="מומחי דפי נחיתה"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">קישור ל-LinkedIn (אופציונלי)</label>
                        <input
                          type="url"
                          value={sections.about.founder.linkedin}
                          onChange={(e) => setSections((s) => ({ ...s, about: { ...s.about, founder: { ...s.about.founder, linkedin: e.target.value } } }))}
                          placeholder="https://linkedin.com/..."
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mt-6 mb-2">המסע שלנו – טיימליין (4 כרטיסים)</h4>
                      <div className="space-y-3">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className="bg-slate-50 rounded-xl p-4 space-y-2">
                            <input
                              type="text"
                              value={sections.about.timeline?.[i]?.year ?? ""}
                              onChange={(e) => {
                                const next = [...(sections.about.timeline ?? [])]
                                while (next.length <= i) next.push({ year: "", text: "" })
                                next[i] = { ...next[i], year: e.target.value }
                                setSections((s) => ({ ...s, about: { ...s.about, timeline: next } }))
                              }}
                              placeholder={`כותרת ${i + 1} (למשל: מחיר)`}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
                            />
                            <input
                              type="text"
                              value={sections.about.timeline?.[i]?.text ?? ""}
                              onChange={(e) => {
                                const next = [...(sections.about.timeline ?? [])]
                                while (next.length <= i) next.push({ year: "", text: "" })
                                next[i] = { ...next[i], text: e.target.value }
                                setSections((s) => ({ ...s, about: { ...s.about, timeline: next } }))
                              }}
                              placeholder="תיאור קצר"
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
                            />
                          </div>
                        ))}
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mt-6 mb-2">שלוש כרטיסי אמון (הכל מותאם, מחיר הוגן, עיצוב)</h4>
                      <div className="space-y-3">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="bg-slate-50 rounded-xl p-4 space-y-2">
                            <input
                              type="text"
                              value={sections.about.trustItems?.[i]?.title ?? ""}
                              onChange={(e) => {
                                const next = [...(sections.about.trustItems ?? [])]
                                while (next.length <= i) next.push({ title: "", description: "", stat: null, statLabel: null, icon: "badge" })
                                next[i] = { ...next[i], title: e.target.value }
                                setSections((s) => ({ ...s, about: { ...s.about, trustItems: next } }))
                              }}
                              placeholder="כותרת כרטיס"
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
                            />
                            <input
                              type="text"
                              value={sections.about.trustItems?.[i]?.description ?? ""}
                              onChange={(e) => {
                                const next = [...(sections.about.trustItems ?? [])]
                                while (next.length <= i) next.push({ title: "", description: "", stat: null, statLabel: null, icon: "badge" })
                                next[i] = { ...next[i], description: e.target.value }
                                setSections((s) => ({ ...s, about: { ...s.about, trustItems: next } }))
                              }}
                              placeholder="תיאור"
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={sections.about.trustItems?.[i]?.stat ?? ""}
                                onChange={(e) => {
                                  const next = [...(sections.about.trustItems ?? [])]
                                  while (next.length <= i) next.push({ title: "", description: "", stat: null, statLabel: null, icon: "badge" })
                                  next[i] = { ...next[i], stat: e.target.value || null }
                                  setSections((s) => ({ ...s, about: { ...s.about, trustItems: next } }))
                                }}
                                placeholder="תג (למשל: 150+)"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
                              />
                              <input
                                type="text"
                                value={sections.about.trustItems?.[i]?.statLabel ?? ""}
                                onChange={(e) => {
                                  const next = [...(sections.about.trustItems ?? [])]
                                  while (next.length <= i) next.push({ title: "", description: "", stat: null, statLabel: null, icon: "badge" })
                                  next[i] = { ...next[i], statLabel: e.target.value || null }
                                  setSections((s) => ({ ...s, about: { ...s.about, trustItems: next } }))
                                }}
                                placeholder="תג (למשל: אתרים)"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">כותרת אזור המסע</label>
                          <input
                            type="text"
                            value={sections.about.journeyTitle ?? ""}
                            onChange={(e) => setSections((s) => ({ ...s, about: { ...s.about, journeyTitle: e.target.value } }))}
                            placeholder="המסע שלנו"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">תג כותרת אודות</label>
                          <input
                            type="text"
                            value={sections.about.badge ?? ""}
                            onChange={(e) => setSections((s) => ({ ...s, about: { ...s.about, badge: e.target.value } }))}
                            placeholder="למה אנחנו"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">טקסט CTA אודות</label>
                          <input
                            type="text"
                            value={sections.about.ctaText ?? ""}
                            onChange={(e) => setSections((s) => ({ ...s, about: { ...s.about, ctaText: e.target.value } }))}
                            placeholder="רוצים אתר כזה לעסק שלכם?"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">כפתור CTA אודות</label>
                          <input
                            type="text"
                            value={sections.about.ctaButton ?? ""}
                            onChange={(e) => setSections((s) => ({ ...s, about: { ...s.about, ctaButton: e.target.value } }))}
                            placeholder="בואו נדבר"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">הערות לעיצוב והתאמה (אופציונלי)</label>
                        <textarea
                          rows={2}
                          value={sections.journeyNotes}
                          onChange={(e) => setSections((s) => ({ ...s, journeyNotes: e.target.value }))}
                          placeholder="צרכים מיוחדים, צבעים, העדפות..."
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400 resize-none"
                        />
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mt-8 mb-3">המסע שלנו – כותרת ו־4 כרטיסים</h4>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">כותרת אזור המסע</label>
                        <input
                          type="text"
                          value={sections.about.journeyTitle ?? ""}
                          onChange={(e) => setSections((s) => ({ ...s, about: { ...s.about, journeyTitle: e.target.value } }))}
                          placeholder="המסע שלנו"
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-slate-700">ארבעת הכרטיסים (שנה/כותרת + תיאור)</p>
                        {(sections.about.timeline || []).map((m, i) => (
                          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-2">
                            <input
                              type="text"
                              value={m.year}
                              onChange={(e) => {
                                const next = [...(sections.about.timeline || [])]
                                next[i] = { ...next[i], year: e.target.value }
                                setSections((s) => ({ ...s, about: { ...s.about, timeline: next } }))
                              }}
                              placeholder="כותרת (למשל: עיצוב)"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                            />
                            <input
                              type="text"
                              value={m.text}
                              onChange={(e) => {
                                const next = [...(sections.about.timeline || [])]
                                next[i] = { ...next[i], text: e.target.value }
                                setSections((s) => ({ ...s, about: { ...s.about, timeline: next } }))
                              }}
                              placeholder="תיאור"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                            />
                          </div>
                        ))}
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mt-6 mb-3">שלוש כרטיסי אמון (עם אייקון ותגית)</h4>
                      {(sections.about.trustItems || []).map((item, i) => (
                        <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-2">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const next = [...(sections.about.trustItems || [])]
                              next[i] = { ...next[i], title: e.target.value }
                              setSections((s) => ({ ...s, about: { ...s.about, trustItems: next } }))
                            }}
                            placeholder="כותרת"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                          />
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              const next = [...(sections.about.trustItems || [])]
                              next[i] = { ...next[i], description: e.target.value }
                              setSections((s) => ({ ...s, about: { ...s.about, trustItems: next } }))
                            }}
                            placeholder="תיאור"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={item.stat ?? ""}
                              onChange={(e) => {
                                const next = [...(sections.about.trustItems || [])]
                                next[i] = { ...next[i], stat: e.target.value || null }
                                setSections((s) => ({ ...s, about: { ...s.about, trustItems: next } }))
                              }}
                              placeholder="תגית (למשל: 150+)"
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                            />
                            <input
                              type="text"
                              value={item.statLabel ?? ""}
                              onChange={(e) => {
                                const next = [...(sections.about.trustItems || [])]
                                next[i] = { ...next[i], statLabel: e.target.value || null }
                                setSections((s) => ({ ...s, about: { ...s.about, trustItems: next } }))
                              }}
                              placeholder="תווית (למשל: אתרים)"
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                            />
                            <input
                              type="text"
                              value={item.icon}
                              onChange={(e) => {
                                const next = [...(sections.about.trustItems || [])]
                                next[i] = { ...next[i], icon: e.target.value }
                                setSections((s) => ({ ...s, about: { ...s.about, trustItems: next } }))
                              }}
                              placeholder="badge/chart/user"
                              className="w-24 px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                              title="badge, chart או user"
                            />
                          </div>
                        </div>
                      ))}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">משפט מעל כפתור הקריאה (המסע)</label>
                        <input
                          type="text"
                          value={sections.about.journeyCtaText ?? ""}
                          onChange={(e) => setSections((s) => ({ ...s, about: { ...s.about, journeyCtaText: e.target.value } }))}
                          placeholder="רוצים אתר כזה לעסק שלכם?"
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">טקסט כפתור הקריאה</label>
                        <input
                          type="text"
                          value={sections.about.journeyCtaButton ?? ""}
                          onChange={(e) => setSections((s) => ({ ...s, about: { ...s.about, journeyCtaButton: e.target.value } }))}
                          placeholder="בואו נדבר"
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4 (build): Video */}
                  {buildPage && currentStep === 4 && (
                    <motion.div
                      key="step4build"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      className="space-y-5"
                    >
                      <h3 className="text-lg font-bold text-slate-900 mb-4">אזור הוידאו</h3>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">תגית קטנה מעל הכותרת</label>
                        <input
                          type="text"
                          value={sections.video.badge}
                          onChange={(e) => setSections((s) => ({ ...s, video: { ...s.video, badge: e.target.value } }))}
                          placeholder="צפו בסרטון"
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">כותרת ראשית</label>
                        <input
                          type="text"
                          value={sections.video.headline}
                          onChange={(e) => setSections((s) => ({ ...s, video: { ...s.video, headline: e.target.value } }))}
                          placeholder="כך נראה התהליך"
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">המשך הכותרת (מודגש בצבע)</label>
                        <input
                          type="text"
                          value={sections.video.headlineHighlight}
                          onChange={(e) => setSections((s) => ({ ...s, video: { ...s.video, headlineHighlight: e.target.value } }))}
                          placeholder=" מהתחלה ועד הסוף"
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">תיאור / תת-כותרת</label>
                        <textarea
                          rows={2}
                          value={sections.video.subheadline}
                          onChange={(e) => setSections((s) => ({ ...s, video: { ...s.video, subheadline: e.target.value } }))}
                          placeholder="מהרגע שאתם פונים אלינו..."
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">מזהה סרטון YouTube (אופציונלי)</label>
                        <input
                          type="text"
                          value={sections.video.videoId}
                          onChange={(e) => setSections((s) => ({ ...s, video: { ...s.video, videoId: e.target.value } }))}
                          placeholder="lM02vNMRRB0 (רק ה-ID מהקישור)"
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">או העלו סרטון מהמחשב</label>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            setSectionVideoFile(file ?? null)
                            e.target.value = ""
                          }}
                          className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-teal-50 file:text-teal-700 file:font-medium hover:file:bg-teal-100"
                        />
                        {sectionVideoFile && (
                          <p className="mt-1.5 text-sm text-teal-600 flex items-center gap-2">
                            סרטון נבחר: {sectionVideoFile.name}
                            <button
                              type="button"
                              onClick={() => setSectionVideoFile(null)}
                              className="text-red-600 hover:text-red-700"
                            >
                              הסר
                            </button>
                          </p>
                        )}
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                        <h4 className="text-sm font-bold text-slate-800">שלוש הכפתורים מתחת לסרטון – בחרו אייקון וטקסט</h4>
                        {(sections.video.highlights || []).map((h, i) => (
                          <div key={i} className="flex flex-wrap gap-2 items-center">
                            <select
                              value={FEATURE_ICON_OPTIONS.some((o) => o.value === h.icon) ? h.icon : "__emoji__"}
                              onChange={(e) => {
                                const v = e.target.value
                                const next = [...(sections.video.highlights || [])]
                                next[i] = { ...next[i], icon: v === "__emoji__" ? (FEATURE_ICON_OPTIONS.some((o) => o.value === next[i]?.icon) ? "✨" : (next[i]?.icon || "✨")) : v }
                                setSections((s) => ({ ...s, video: { ...s.video, highlights: next } }))
                              }}
                              className="px-3 py-2 rounded-lg border border-slate-200 text-slate-900 bg-white min-w-[140px]"
                            >
                              {FEATURE_ICON_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                              <option value="__emoji__">אחר (אימוג׳י)</option>
                            </select>
                            {(!h.icon || FEATURE_ICON_OPTIONS.some((o) => o.value === h.icon)) ? null : (
                              <input
                                type="text"
                                value={h.icon}
                                onChange={(e) => {
                                  const next = [...(sections.video.highlights || [])]
                                  next[i] = { ...next[i], icon: e.target.value }
                                  setSections((s) => ({ ...s, video: { ...s.video, highlights: next } }))
                                }}
                                placeholder="אימוג׳י"
                                className="w-12 px-2 py-2 rounded-lg border border-slate-200 text-center text-lg"
                              />
                            )}
                            <input
                              type="text"
                              value={h.text}
                              onChange={(e) => {
                                const next = [...(sections.video.highlights || [])]
                                next[i] = { ...next[i], text: e.target.value }
                                setSections((s) => ({ ...s, video: { ...s.video, highlights: next } }))
                              }}
                              placeholder="טקסט"
                              className="flex-1 min-w-[120px] px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">משפט מעל כפתור הקריאה (אופציונלי)</label>
                        <input
                          type="text"
                          value={sections.video.ctaText}
                          onChange={(e) => setSections((s) => ({ ...s, video: { ...s.video, ctaText: e.target.value } }))}
                          placeholder="רוצים אתר כזה לעסק שלכם?"
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">טקסט כפתור הקריאה</label>
                        <input
                          type="text"
                          value={sections.video.ctaButton}
                          onChange={(e) => setSections((s) => ({ ...s, video: { ...s.video, ctaButton: e.target.value } }))}
                          placeholder="דברו איתנו"
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 6 (build): FAQ — 1–8 questions to match site */}
                  {buildPage && currentStep === 5 && (
                    <motion.div
                      key="step5build"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      className="space-y-5"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-lg font-bold text-slate-900">שאלות נפוצות (אופציונלי)</h3>
                        {sections.faq.length < 8 && (
                          <button
                            type="button"
                            onClick={() => setSections((s) => ({ ...s, faq: [...s.faq, { question: "", answer: "" }] }))}
                            className="text-sm font-medium text-teal-600 hover:text-teal-700"
                          >
                            + הוסף שאלה
                          </button>
                        )}
                      </div>
                      {sections.faq.map((item, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-4 space-y-2 relative">
                          {sections.faq.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setSections((s) => ({ ...s, faq: s.faq.filter((_, j) => j !== i) }))}
                              className="absolute top-3 left-3 text-slate-400 hover:text-red-600 text-sm"
                              aria-label="הסר שאלה"
                            >
                              הסר
                            </button>
                          )}
                          <input
                            type="text"
                            value={item.question}
                            onChange={(e) => {
                              const next = [...sections.faq]
                              next[i] = { ...next[i], question: e.target.value }
                              setSections((s) => ({ ...s, faq: next }))
                            }}
                            placeholder={`שאלה ${i + 1}`}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
                          />
                          <textarea
                            rows={2}
                            value={item.answer}
                            onChange={(e) => {
                              const next = [...sections.faq]
                              next[i] = { ...next[i], answer: e.target.value }
                              setSections((s) => ({ ...s, faq: next }))
                            }}
                            placeholder="תשובה"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-teal-500 text-slate-900 placeholder:text-slate-400 resize-none"
                          />
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Step 7 (build): Footer */}
                  {buildPage && currentStep === 6 && (
                    <motion.div
                      key="step6build"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      className="space-y-5"
                    >
                      <h3 className="text-lg font-bold text-slate-900 mb-4">פוטר ויצירת קשר באתר (אופציונלי)</h3>
                      <p className="text-sm text-slate-600 mb-3">הטלפון ומספר ה-WhatsApp שלכם ישמשו לכל קישורי הוואטסאפ באתר הבנוי (כותרת, שאלות נפוצות, פוטר).</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">טלפון (בעלים / ליצירת קשר)</label>
                          <input
                            type="text"
                            value={sections.footer.phone}
                            onChange={(e) => setSections((s) => ({ ...s, footer: { ...s.footer, phone: e.target.value } }))}
                            placeholder="0526555139"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">אימייל</label>
                          <input
                            type="email"
                            value={sections.footer.email}
                            onChange={(e) => setSections((s) => ({ ...s, footer: { ...s.footer, email: e.target.value } }))}
                            placeholder="contact@example.com"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">כתובת</label>
                        <input
                          type="text"
                          value={sections.footer.address}
                          onChange={(e) => setSections((s) => ({ ...s, footer: { ...s.footer, address: e.target.value } }))}
                          placeholder="תל אביב, ישראל"
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">שעות פעילות (א'-ה')</label>
                          <input
                            type="text"
                            value={sections.footer.hoursWeekdays}
                            onChange={(e) => setSections((s) => ({ ...s, footer: { ...s.footer, hoursWeekdays: e.target.value } }))}
                            placeholder="א'-ה': 09:00-18:00"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">שישי</label>
                          <input
                            type="text"
                            value={sections.footer.hoursFriday}
                            onChange={(e) => setSections((s) => ({ ...s, footer: { ...s.footer, hoursFriday: e.target.value } }))}
                            placeholder="ו': 09:00-13:00"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">תיאור קצר בפוטר</label>
                        <textarea
                          rows={2}
                          value={sections.footer.description}
                          onChange={(e) => setSections((s) => ({ ...s, footer: { ...s.footer, description: e.target.value } }))}
                          placeholder="טקסט על החברה..."
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400 resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">קישור תנאי שימוש</label>
                          <input
                            type="url"
                            value={sections.footer.termsUrl}
                            onChange={(e) => setSections((s) => ({ ...s, footer: { ...s.footer, termsUrl: e.target.value } }))}
                            placeholder="/terms"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">קישור מדיניות פרטיות</label>
                          <input
                            type="url"
                            value={sections.footer.privacyUrl}
                            onChange={(e) => setSections((s) => ({ ...s, footer: { ...s.footer, privacyUrl: e.target.value } }))}
                            placeholder="/privacy"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">זכויות יוצרים (למשל: © 2026 שם החברה)</label>
                        <input
                          type="text"
                          value={sections.footer.copyright}
                          onChange={(e) => setSections((s) => ({ ...s, footer: { ...s.footer, copyright: e.target.value } }))}
                          placeholder="© 2026 החברה שלי. כל הזכויות שמורות."
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mt-4 mb-2">קישורים מהירים בפוטר (כמו בתפריט)</h4>
                      <p className="text-sm text-slate-500 mb-3">הקישורים שמופיעים בפוטר — תווית וכתובת (למשל #how-it-works)</p>
                      {(sections.footer.quickLinks || []).map((link, i) => (
                        <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => {
                              const next = [...(sections.footer.quickLinks || [])]
                              next[i] = { ...next[i], label: e.target.value }
                              setSections((s) => ({ ...s, footer: { ...s.footer, quickLinks: next } }))
                            }}
                            placeholder="תווית (למשל: איך זה עובד)"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) => {
                              const next = [...(sections.footer.quickLinks || [])]
                              next[i] = { ...next[i], href: e.target.value }
                              setSections((s) => ({ ...s, footer: { ...s.footer, quickLinks: next } }))
                            }}
                            placeholder="קישור (#how-it-works או https://...)"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      ))}
                      <h4 className="text-base font-bold text-slate-800 mt-4 mb-2">רשתות חברתיות (אופציונלי)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Facebook</label>
                          <input
                            type="url"
                            value={sections.footer.social.facebook}
                            onChange={(e) => setSections((s) => ({ ...s, footer: { ...s.footer, social: { ...s.footer.social, facebook: e.target.value } } }))}
                            placeholder="https://facebook.com/..."
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Instagram</label>
                          <input
                            type="url"
                            value={sections.footer.social.instagram}
                            onChange={(e) => setSections((s) => ({ ...s, footer: { ...s.footer, social: { ...s.footer.social, instagram: e.target.value } } }))}
                            placeholder="https://instagram.com/..."
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">LinkedIn</label>
                          <input
                            type="url"
                            value={sections.footer.social.linkedin}
                            onChange={(e) => setSections((s) => ({ ...s, footer: { ...s.footer, social: { ...s.footer.social, linkedin: e.target.value } } }))}
                            placeholder="https://linkedin.com/..."
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">WhatsApp (מספר בעלים – 0501234567 או 972501234567)</label>
                          <input
                            type="text"
                            value={sections.footer.social.whatsapp}
                            onChange={(e) => setSections((s) => ({ ...s, footer: { ...s.footer, social: { ...s.footer.social, whatsapp: e.target.value } } }))}
                            placeholder="0501234567"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-100 flex-wrap">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      aria-label="חזרה לשלב הקודם"
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium transition-colors min-h-[44px] px-2 touch-manipulation focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 rounded-lg"
                    >
                      <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span>חזרה</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < totalSteps ? (
                    <motion.button
                      type="button"
                      onClick={handleNext}
                      aria-label="המשך לשלב הבא"
                      className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-5 sm:px-6 py-3 min-h-[48px] rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all touch-manipulation focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span>המשך</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                      aria-label={isSubmitting ? "שולח את הטופס" : "שליחת הטופס"}
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-900 px-6 sm:px-8 py-3.5 min-h-[48px] rounded-xl font-bold shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
                      whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>שולח...</span>
                        </>
                      ) : (
                        <>
                          <span>שלחו לי הצעה!</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </form>
            </motion.div>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.1 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30"
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                מעולה, {formData.fullName.split(" ")[0]}! 🎉
              </h3>
              <p className="text-slate-600 text-lg mb-6">
                {buildPage && createdLeadId
                  ? "קיבלנו את הפרטים. צפו בתצוגה המקדימה של האתר שלכם:"
                  : "קיבלנו את הפרטים ונחזור אליך תוך 24 שעות"}
              </p>
              
              {buildPage && createdLeadId && (
                <div className="mb-6">
                  <a
                    href={`/preview/${createdLeadId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-colors"
                  >
                    צפייה בתצוגה מקדימה
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <p className="text-sm text-slate-500 mt-2">
                    ניתן להריץ את האתר גם על פורט אחר (למשל 3001) ולפתוח את הקישור הזה לתצוגה מקדימה.
                  </p>
                </div>
              )}
              
              <div className="bg-teal-50 rounded-xl p-4 text-right mb-6">
                <h4 className="font-semibold text-teal-800 mb-2">בינתיים, תדמיינו:</h4>
                <p className="text-sm text-teal-700">
                  האתר הזה שאתם רואים עכשיו—רק עם הלוגו שלכם, התמונות שלכם והצבעים שלכם. זה מה שתקבלו! 💪
                </p>
              </div>
              
              <button
                onClick={() => {
                  setIsSuccess(false)
                  setCreatedLeadId(null)
                  setCurrentStep(1)
                  setFormData({
                    fullName: "",
                    phone: "",
                    email: "",
                    businessType: "",
                    businessSize: "",
                    urgency: "",
                    message: "",
                    consent: false,
                    siteName: "",
                    siteDescription: "",
                    siteContent: "",
                    photoUrls: [],
                    videoUrls: [],
                  })
                  setSections({
                    header: {
                      name: "",
                      logoText: "",
                      logoUrl: "",
                      tagline: "",
                      navLinks: (headerConfig.navLinks || []).map((l) => ({ id: l.id, label: l.label })),
                      ctaButton: "",
                      phone: "",
                    },
                    site: { tagline: "" },
                    hero: {
                      headlineLine1: "",
                      highlight: "",
                      subheadline: "",
                      ctaPrimaryText: "",
                      ctaSecondaryText: "",
                      ctaNote: "",
                      trustText: "",
                      valueCardTitle: "",
                      valueCardHighlight: "",
                    },
                    about: {
                      headline: "",
                      headlineHighlight: "",
                      subheadline: "",
                      founder: { quote: "", imageUrl: "", name: "", role: "", linkedin: "" },
                      badge: "",
                      journeyTitle: "המסע שלנו",
                      timeline: [...(aboutConfig.timeline || [])],
                      trustItems: (aboutConfig.trustItems || []).map((t) => ({ ...t, icon: (t as { icon?: string }).icon })),
                      ctaText: aboutConfig.ctaText ?? "רוצים אתר כזה לעסק שלכם?",
                      ctaButton: aboutConfig.ctaButton ?? "בואו נדבר",
                    },
                    features: [
                      { title: "עיצוב מותאם אישית", description: "התמונות שלך, הצבעים שלך, הסגנון שלך", icon: "check" },
                      { title: "מערכת מיילים מקצועית", description: "שלחו אלפי מיילים בקלות ובמחיר נמוך", icon: "mail" },
                      { title: "מחיר שמנצח", description: "זול משמעותית מהמתחרים", icon: "currency" },
                    ],
                    video: {
                      videoId: "",
                      customVideoUrl: "",
                      badge: "צפו בסרטון",
                      headline: "כך נראה התהליך",
                      headlineHighlight: " מהתחלה ועד הסוף",
                      subheadline: "מהרגע שאתם פונים אלינו ועד שהאתר עולה לאוויר—תהליך מקצועי, מהיר ושקוף",
                      highlights: [
                        { icon: "✨", text: "עיצוב מקצועי" },
                        { icon: "⚡", text: "תהליך מהיר" },
                        { icon: "🎯", text: "תוצאות מוכחות" },
                      ],
                      ctaText: "רוצים אתר כזה לעסק שלכם?",
                      ctaButton: "דברו איתנו",
                    },
                    faq: [
                      { question: "", answer: "" },
                      { question: "", answer: "" },
                      { question: "", answer: "" },
                    ],
                    reviewsSection: { badge: reviewsConfig.badge, headline: reviewsConfig.headline, headlineHighlight: reviewsConfig.headlineHighlight ?? "", subheadline: reviewsConfig.subheadline, stats: [{ value: "150+", label: "לקוחות מרוצים" }, { value: "5.0", label: "דירוג ממוצע" }, { value: "98%", label: "ממליצים עלינו" }], reviews: [] },
                    caseStudy: reviewsConfig.caseStudy
                      ? { title: reviewsConfig.caseStudy.title, company: reviewsConfig.caseStudy.company, industry: reviewsConfig.caseStudy.industry, challenge: reviewsConfig.caseStudy.challenge, solution: reviewsConfig.caseStudy.solution, quote: reviewsConfig.caseStudy.quote, author: reviewsConfig.caseStudy.author, image: reviewsConfig.caseStudy.image ?? "", results: [...(reviewsConfig.caseStudy.results || [])], ctaText: reviewsConfig.caseStudy.ctaText ?? "" }
                      : { title: "לקוח לדוגמה", company: "", industry: "", challenge: "", solution: "", quote: "", author: "", image: "", results: [{ metric: "300%", label: "יותר פניות" }, { metric: "40%", label: "חיסכון בעלויות" }, { metric: "1.2 שנ'", label: "טעינת עמוד" }], ctaText: "רוצים תוצאות דומות?" },
                    howItWorks: { badge: howItWorksConfig.badge, headline: howItWorksConfig.headline, headlineHighlight: howItWorksConfig.headlineHighlight ?? "", subheadline: howItWorksConfig.subheadline, steps: (howItWorksConfig.steps || []).map((s) => ({ id: s.id, title: s.title, description: s.description, duration: s.duration, highlight: s.highlight ?? "", icon: s.icon })), ctaText: howItWorksConfig.ctaText ?? "", ctaHighlight: howItWorksConfig.ctaHighlight ?? "", ctaButton: howItWorksConfig.ctaButton ?? "", ctaButtonUrl: (howItWorksConfig as { ctaButtonUrl?: string }).ctaButtonUrl ?? "/client" },
                    footer: {
                      phone: "",
                      email: "",
                      address: "",
                      hoursWeekdays: "א'-ה': 09:00-18:00",
                      hoursFriday: "ו': 09:00-13:00",
                      quickLinks: [...(footerConfig.quickLinks || [])],
                      social: { facebook: "", instagram: "", linkedin: "", whatsapp: "" },
                      termsUrl: "",
                      privacyUrl: "",
                      description: "",
                      copyright: "",
                    },
                    journeyNotes: "",
                    theme: { primaryColor: "#0d9488", secondaryColor: "#f59e0b", themeMode: "light" },
                  })
                  setPhotoFiles([])
                  setVideoFiles([])
                  setSectionVideoFile(null)
                  setSectionAboutImageFile(null)
                }}
                className="text-teal-600 hover:text-teal-700 font-medium underline"
              >
                שליחת פנייה נוספת
              </button>
            </motion.div>
          )}

          {/* Privacy Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-center text-sm text-slate-500 mt-6 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            הפרטים שלכם מאובטחים ומוצפנים. לא נשתף עם צד שלישי.
          </motion.p>
        </motion.div>
        </div>

        {/* Mobile: live preview below form (full width, scrollable) */}
        {buildPage && currentStep >= 1 && (
          <SectionLiveEditPanel
            currentStep={currentStep}
            sections={sections}
            previewPhotoUrls={uploadPreviewPhotoUrls}
            previewVideoUrl={uploadPreviewVideoUrl}
            className="md:hidden w-full order-3 mt-6"
            mobile
          />
        )}
      </div>
    </section>
  )
}
