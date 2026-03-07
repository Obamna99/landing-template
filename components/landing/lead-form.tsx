"use client"

import { useState, FormEvent, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import confetti from "canvas-confetti"
import { useToast } from "@/hooks/use-toast"
import { SectionLiveEditPanel } from "@/components/landing/section-live-edit-panel"
import { footerConfig } from "@/lib/config"

// Contact form (main page): leave your data so the site owner can contact you — 3 steps only
const formStepsContact = [
  { id: 1, label: "פרטי התקשרות" },
  { id: 2, label: "על העסק שלך" },
  { id: 3, label: "כמעט סיימנו" },
]
// Build form (/build): minimal contact + site content + section content — 7 steps
const formStepsBuild = [
  { id: 1, label: "פרטי התקשרות" },
  { id: 2, label: "תוכן לאתר" },
  { id: 3, label: "היירו" },
  { id: 4, label: "אודות" },
  { id: 5, label: "וידאו" },
  { id: 6, label: "שאלות נפוצות" },
  { id: 7, label: "פוטר ויצירת קשר" },
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

// Build form: which section of the site this step edits (for popup)
const buildStepSectionInfo: Record<number, { label: string; icon: string; desc: string }> = {
  1: { label: "פרטי התקשרות", icon: "📞", desc: "שם, אימייל וטלפון" },
  2: { label: "תוכן לאתר", icon: "📦", desc: "תמונות, טקסט, צבעים ומה תקבלו" },
  3: { label: "היירו", icon: "🎯", desc: "כותרת ראשית ותת-כותרת" },
  4: { label: "אודות", icon: "👤", desc: "כרטיס אודות וציטוט" },
  5: { label: "וידאו", icon: "🎬", desc: "סרטון באזור הוידאו" },
  6: { label: "שאלות נפוצות", icon: "❓", desc: "שאלות ותשובות" },
  7: { label: "פוטר ויצירת קשר", icon: "📞", desc: "פרטי קשר וזכויות יוצרים" },
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
    hero: { headlineLine1: "", highlight: "", subheadline: "" },
    about: {
      headline: "",
      headlineHighlight: "",
      subheadline: "",
      founder: { quote: "", imageUrl: "", name: "", role: "", linkedin: "" },
    },
    features: [
      { title: "עיצוב מותאם אישית", description: "התמונות שלך, הצבעים שלך, הסגנון שלך" },
      { title: "מערכת מיילים מקצועית", description: "שלחו אלפי מיילים בקלות ובמחיר נמוך" },
      { title: "מחיר שמנצח", description: "זול משמעותית מהמתחרים" },
    ],
    video: { videoId: "", customVideoUrl: "" },
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
    theme: {
      primaryColor: "#0d9488",
      secondaryColor: "#f59e0b",
      themeMode: "light" as "light" | "dark",
    },
  })
  const [sectionAboutImageFile, setSectionAboutImageFile] = useState<File | null>(null)
  const aboutImageObjectUrlRef = useRef<string | null>(null)

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

    if (step === 1) {
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

        const sectionsJson = buildPage
          ? {
              hero: { ...sections.hero, features: sections.features },
              about: aboutPayload,
              video: videoPayload,
              faq: sections.faq.filter((f) => f.question.trim() || f.answer.trim()),
              features: sections.features,
              footer: sections.footer,
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
            siteName: formData.siteName || undefined,
            siteDescription: formData.siteDescription || undefined,
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
            ? "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative flex flex-col md:flex-row md:flex-row-reverse gap-6 md:gap-8 lg:gap-10 items-stretch build-form-theme"
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
        {/* Desktop: side panel (right in RTL); Mobile: hidden (preview shown below form) */}
        {buildPage && currentStep >= 1 && (
          <SectionLiveEditPanel
            currentStep={currentStep}
            sections={sections}
            className="hidden md:block w-full min-w-[320px] max-w-[420px] lg:min-w-[360px] xl:min-w-[380px] shrink-0 order-1"
          />
        )}
        <div className={buildPage ? "flex-1 min-w-0 max-w-2xl order-2 w-full" : ""}>
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
                  {/* Step 1: Personal Details */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
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

                      <div className="rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-4 sm:p-5">
                        <h4 className="text-base font-bold text-slate-800 mb-3">צבעים עיקריים לאתר</h4>
                        <p className="text-sm text-slate-600 mb-4">בחרו צבע ראשי (כפתורים, כותרות) וצבע משני (הדגשות, אקסנט).</p>
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
                                id="primaryColorPicker"
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
                                id="secondaryColorPicker"
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

                      <div>
                        <label htmlFor="siteName" className="block text-sm font-semibold text-slate-700 mb-2">
                          שם האתר / העסק (אופציונלי)
                        </label>
                        <input
                          type="text"
                          id="siteName"
                          placeholder="למשל: פיצריה דלישס"
                          value={formData.siteName}
                          onChange={(e) => handleChange("siteName", e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all text-slate-900 placeholder:text-slate-400"
                        />
                      </div>

                      <div>
                        <label htmlFor="siteDescription" className="block text-sm font-semibold text-slate-700 mb-2">
                          משפט או שניים על העסק (אופציונלי)
                        </label>
                        <input
                          type="text"
                          id="siteDescription"
                          placeholder="למשל: פיצה טרייה ומשלוחים מהירים"
                          value={formData.siteDescription}
                          onChange={(e) => handleChange("siteDescription", e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-teal-500 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all text-slate-900 placeholder:text-slate-400"
                        />
                      </div>

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
                          <input
                            type="text"
                            value={sections.features[i]?.title ?? ""}
                            onChange={(e) => {
                              const next = [...sections.features]
                              next[i] = { ...(next[i] ?? { title: "", description: "" }), title: e.target.value }
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
                              next[i] = { ...(next[i] ?? { title: "", description: "" }), description: e.target.value }
                              setSections((s) => ({ ...s, features: next }))
                            }}
                            placeholder="תיאור קצר"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      ))}

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

                  {/* Step 3 (build): Hero */}
                  {buildPage && currentStep === 3 && (
                    <motion.div
                      key="step3build"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      className="space-y-5"
                    >
                      <h3 className="text-lg font-bold text-slate-900 mb-4">טקסט אזור ההיירו (אופציונלי)</h3>
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
                    </motion.div>
                  )}

                  {/* Step 4 (build): About */}
                  {buildPage && currentStep === 4 && (
                    <motion.div
                      key="step4build"
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
                    </motion.div>
                  )}

                  {/* Step 5 (build): Video */}
                  {buildPage && currentStep === 5 && (
                    <motion.div
                      key="step5build"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      className="space-y-5"
                    >
                      <h3 className="text-lg font-bold text-slate-900 mb-4">וידאו (אופציונלי)</h3>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">מזהה סרטון YouTube</label>
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
                    </motion.div>
                  )}

                  {/* Step 6 (build): FAQ — 1–8 questions to match site */}
                  {buildPage && currentStep === 6 && (
                    <motion.div
                      key="step6build"
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
                  {buildPage && currentStep === 7 && (
                    <motion.div
                      key="step7build"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                      className="space-y-5"
                    >
                      <h3 className="text-lg font-bold text-slate-900 mb-4">פוטר ויצירת קשר באתר (אופציונלי)</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">טלפון</label>
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
                          <label className="block text-sm font-semibold text-slate-700 mb-2">WhatsApp (מספר: 972501234567)</label>
                          <input
                            type="text"
                            value={sections.footer.social.whatsapp}
                            onChange={(e) => setSections((s) => ({ ...s, footer: { ...s.footer, social: { ...s.footer.social, whatsapp: e.target.value } } }))}
                            placeholder="972501234567"
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
                    hero: { headlineLine1: "", highlight: "", subheadline: "" },
                    about: {
                      headline: "",
                      headlineHighlight: "",
                      subheadline: "",
                      founder: { quote: "", imageUrl: "", name: "", role: "", linkedin: "" },
                    },
                    features: [
                      { title: "עיצוב מותאם אישית", description: "התמונות שלך, הצבעים שלך, הסגנון שלך" },
                      { title: "מערכת מיילים מקצועית", description: "שלחו אלפי מיילים בקלות ובמחיר נמוך" },
                      { title: "מחיר שמנצח", description: "זול משמעותית מהמתחרים" },
                    ],
                    video: { videoId: "", customVideoUrl: "" },
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
            className="md:hidden w-full order-3 mt-6"
            mobile
          />
        )}
      </div>
    </section>
  )
}
