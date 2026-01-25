"use client"

import { useState, FormEvent, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { useToast } from "@/hooks/use-toast"

// Form steps for progressive disclosure
const formSteps = [
  { id: 1, label: "פרטי התקשרות" },
  { id: 2, label: "על העסק שלך" },
  { id: 3, label: "כמעט סיימנו" },
]

export function LeadForm() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { toast } = useToast()

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
  })

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

    if (step === 2) {
      if (!formData.businessType) {
        newErrors.businessType = "בחרו סוג עסק"
      }
    }

    if (step === 3) {
      if (!formData.consent) {
        newErrors.consent = "נא לאשר קבלת מידע"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (validateStep(currentStep)) {
      setIsSubmitting(true)
      
      try {
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
          }),
        })
        
        if (!response.ok) {
          throw new Error("Failed to submit")
        }
        
        setIsSuccess(true)
        toast({
          title: "מעולה! קיבלנו את הפרטים 🎉",
          description: "נחזור אליך תוך 24 שעות ונתחיל לתכנן את האתר שלך",
        })
      } catch (error) {
        toast({
          title: "אופס! משהו השתבש",
          description: "נסו שוב מאוחר יותר או צרו קשר בטלפון",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const progress = (currentStep / 3) * 100

  return (
    <section
      id="contact"
      ref={ref}
      className="py-16 sm:py-24 bg-gradient-to-b from-white via-teal-50/20 to-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block text-teal-600 font-semibold text-sm uppercase tracking-wider mb-3"
            >
              רוצים אתר כזה?
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              בואו נדבר על
              <span className="gradient-text"> האתר שלכם</span>
            </h2>
            <p className="text-slate-600 text-lg">
              שיחה קצרה, ללא עלות, ותוך שבוע יש לכם אתר חדש
            </p>
          </div>

          {/* Social Proof - Live Activity */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-6"
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
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Progress Bar */}
              <div className="h-1.5 bg-slate-100">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-400"
                  initial={{ width: "33.33%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Step Indicator */}
              <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  {formSteps.map((step) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-2 ${
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

              <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {/* Step 1: Personal Details */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
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
                          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
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
                          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
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
                          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Business Details */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
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

                  {/* Step 3: Final */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
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
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                    >
                      <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span>חזרה</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <motion.button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-900 px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all disabled:opacity-70"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
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
                קיבלנו את הפרטים ונחזור אליך תוך 24 שעות
              </p>
              
              <div className="bg-teal-50 rounded-xl p-4 text-right mb-6">
                <h4 className="font-semibold text-teal-800 mb-2">בינתיים, תדמיינו:</h4>
                <p className="text-sm text-teal-700">
                  האתר הזה שאתם רואים עכשיו—רק עם הלוגו שלכם, התמונות שלכם והצבעים שלכם. זה מה שתקבלו! 💪
                </p>
              </div>
              
              <button
                onClick={() => {
                  setIsSuccess(false)
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
                  })
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
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center text-sm text-slate-500 mt-6 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            הפרטים שלכם מאובטחים ומוצפנים. לא נשתף עם צד שלישי.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
