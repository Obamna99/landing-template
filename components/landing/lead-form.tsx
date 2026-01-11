"use client"

import { useState, FormEvent } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { useToast } from "@/hooks/use-toast"

export function LeadForm() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
    consent: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "שדה חובה"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "שדה חובה"
    } else if (!/^[0-9-+\s()]+$/.test(formData.phone)) {
      newErrors.phone = "מספר טלפון לא תקין"
    }

    if (!formData.email.trim()) {
      newErrors.email = "שדה חובה"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "כתובת אימייל לא תקינה"
    }

    if (!formData.consent) {
      newErrors.consent = "יש לאשר קבלת מידע ועדכונים"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Simulate form submission
      toast({
        title: "תודה רבה!",
        description: "קיבלנו את הפרטים שלכם ונחזור אליכם בהקדם.",
      })

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        message: "",
        consent: false,
      })
      setErrors({})
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="py-16 sm:py-24 bg-white"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 text-center mb-4">
            צרו קשר
          </h2>
          <p className="text-center text-neutral-600 mb-8 sm:mb-12 text-base sm:text-lg px-4">
            השאירו פרטים ונחזור אליכם עם הצעה מותאמת אישית
          </p>

          <motion.form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl border border-neutral-200/50 p-6 sm:p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-5 sm:space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-neutral-900 mb-2"
                >
                  שם מלא
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-base ${
                    errors.fullName
                      ? "border-red-300 focus:border-red-500"
                      : "border-neutral-200 focus:border-orange-500"
                  } focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors text-neutral-900`}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                />
                {errors.fullName && (
                  <p id="fullName-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-neutral-900 mb-2"
                >
                  טלפון
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-base ${
                    errors.phone
                      ? "border-red-300 focus:border-red-500"
                      : "border-neutral-200 focus:border-orange-500"
                  } focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors text-neutral-900`}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-neutral-900 mb-2"
                >
                  אימייל
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-base ${
                    errors.email
                      ? "border-red-300 focus:border-red-500"
                      : "border-neutral-200 focus:border-orange-500"
                  } focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors text-neutral-900`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-neutral-900 mb-2"
                >
                  ספרו לנו על העסק שלכם (אופציונלי)
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors text-neutral-900 text-base resize-none"
                  placeholder="מה תחום העסק? מה האתגרים העיקריים?"
                />
              </div>

              {/* Consent Checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => handleChange("consent", e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-2 border-neutral-300 text-orange-500 focus:ring-2 focus:ring-orange-200 focus:ring-offset-0 cursor-pointer"
                    aria-invalid={!!errors.consent}
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                  />
                  <span className="text-sm text-neutral-700 flex-1">
                    אני מאשר/ת קבלת מידע ועדכונים
                  </span>
                </label>
                {errors.consent && (
                  <p id="consent-error" className="mt-1 text-sm text-red-600 mr-8" role="alert">
                    {errors.consent}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                שלחו לי הצעה
              </motion.button>

              {/* Privacy Note */}
              <p className="text-xs text-neutral-500 text-center mt-4 px-4">
                הפרטים שלכם מאובטחים ולא יועברו לגורמים חיצוניים. אנחנו משתמשים במידע רק למטרות יצירת קשר.
              </p>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}
