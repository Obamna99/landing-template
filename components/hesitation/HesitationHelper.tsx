"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { hesitationHelperConfig, siteConfig, heroConfig, howItWorksConfig } from "@/lib/config"
import { getDefaultWhatsAppUrl } from "@/lib/utils/whatsapp"

export function HesitationHelper() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const lastActivityRef = useRef<number>(0)

  // Prevent hydration mismatch - initialize Date.now() only on client
  useEffect(() => {
    setMounted(true)
    lastActivityRef.current = Date.now()
  }, [])

  // Track user activity - update last activity time
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
    
    // Hide if currently visible (user is active) but not if summary is showing
    if (isVisible && !showSummary) {
      setIsVisible(false)
      setIsExpanded(false)
    }
  }, [isVisible, showSummary])

  // Check inactivity periodically
  const checkInactivity = useCallback(() => {
    if (isDismissed || !hesitationHelperConfig.enabled) return
    
    const timeSinceActivity = Date.now() - lastActivityRef.current
    
    if (timeSinceActivity >= hesitationHelperConfig.hesitationDelay && !isVisible) {
      const randomMessage = hesitationHelperConfig.messages[
        Math.floor(Math.random() * hesitationHelperConfig.messages.length)
      ]
      setCurrentMessage(randomMessage)
      setIsVisible(true)
    }
  }, [isDismissed, isVisible])

  // Track user activity and check inactivity periodically
  useEffect(() => {
    if (!mounted || !hesitationHelperConfig.enabled || isDismissed) return

    const handleActivity = (e?: Event) => {
      // Don't count clicks on the hesitation helper itself as activity
      if (e?.target && e.target instanceof HTMLElement && e.target.closest('[data-hesitation-helper]')) {
        return
      }
      updateActivity()
    }

    // Listen to user activity (excluding mousemove which is too sensitive)
    window.addEventListener("scroll", handleActivity, { passive: true })
    window.addEventListener("click", handleActivity, { passive: true })
    window.addEventListener("keydown", handleActivity, { passive: true })
    window.addEventListener("touchstart", handleActivity, { passive: true })

    // Check inactivity every 2 seconds
    const checkInterval = setInterval(() => {
      checkInactivity()
    }, 2000)

    // Initial check
    checkInactivity()

    return () => {
      window.removeEventListener("scroll", handleActivity)
      window.removeEventListener("click", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("touchstart", handleActivity)
      
      clearInterval(checkInterval)
    }
  }, [mounted, updateActivity, checkInactivity, isDismissed])

  // Auto-hide after user becomes active again
  useEffect(() => {
    if (isVisible && !showSummary) {
      const hideTimer = setTimeout(() => {
        if (Date.now() - lastActivityRef.current < 1000) {
          setIsVisible(false)
          setIsExpanded(false)
        }
      }, 3000)

      return () => clearTimeout(hideTimer)
    }
  }, [isVisible, showSummary])

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering activity handler
    setIsExpanded(true)
    // Don't update activity - clicking IS the activity we want
  }

  const handlePrimaryAction = () => {
    // Show summary instead of performing action
    // Ensure expanded is true when showing summary
    setIsExpanded(true)
    setShowSummary(true)
  }

  const handleContactFromSummary = () => {
    const contactElement = document.getElementById("contact")
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setIsVisible(false)
    setIsExpanded(false)
    setShowSummary(false)
    updateActivity()
  }

  const handleWhatsAppFromSummary = () => {
    window.open(getDefaultWhatsAppUrl(), "_blank")
    setIsVisible(false)
    setIsExpanded(false)
    setShowSummary(false)
    updateActivity()
  }

  const handleBackFromSummary = () => {
    setShowSummary(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsExpanded(false)
    setShowSummary(false)
    setIsDismissed(true)
    sessionStorage.setItem("hesitation-helper-dismissed", "true")
  }

  // Check if dismissed in session storage
  useEffect(() => {
    const dismissed = sessionStorage.getItem("hesitation-helper-dismissed") === "true"
    if (dismissed) {
      setIsDismissed(true)
    }
  }, [])

  // Don't render until mounted to prevent hydration errors
  if (!mounted || !hesitationHelperConfig.enabled || isDismissed) return null

  // Position classes
  const horizontalClass = hesitationHelperConfig.position === "left" ? "left-4 sm:left-6" : "right-4 sm:right-6"
  
  const verticalClasses = {
    top: "top-24",
    middle: "top-1/2 -translate-y-1/2",
    bottom: "bottom-36 sm:bottom-28", // Above floating CTA and chatbot
  }
  const verticalClass = verticalClasses[hesitationHelperConfig.verticalPosition]

  return (
    <AnimatePresence>
      {isVisible && (
        <div className={`fixed ${horizontalClass} ${verticalClass} z-[60]`} data-hesitation-helper>
          {/* Collapsed Icon */}
          {!isExpanded && (
            <motion.button
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 180 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              onClick={handleIconClick}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 transition-all duration-200 flex items-center justify-center hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="עזרה"
            >
              <span className="text-2xl">{hesitationHelperConfig.icon}</span>
              
              {/* Pulse animation */}
              <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75" />
            </motion.button>
          )}

          {/* Expanded Card */}
          {isExpanded && !showSummary && (
            <motion.div
              key="initial-card"
              initial={{ opacity: 0, x: hesitationHelperConfig.position === "right" ? 50 : -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: hesitationHelperConfig.position === "right" ? 50 : -50, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 w-72 sm:w-80 relative overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-teal-400" />
              
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-3 left-3 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="סגור"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="pt-2">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-xl flex-shrink-0 shadow-lg shadow-amber-500/20">
                    {hesitationHelperConfig.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">אני כאן לעזור!</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{currentMessage}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handlePrimaryAction}
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    {hesitationHelperConfig.primaryAction.text}
                  </button>
                  
                  {hesitationHelperConfig.secondaryAction.dismiss && (
                    <button
                      onClick={handleDismiss}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      {hesitationHelperConfig.secondaryAction.text}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Summary View */}
          {isExpanded && showSummary && (
            <motion.div
              key="summary-card"
              initial={{ opacity: 0, x: hesitationHelperConfig.position === "right" ? 50 : -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: hesitationHelperConfig.position === "right" ? 50 : -50, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 w-72 sm:w-80 relative overflow-hidden max-h-[85vh] overflow-y-auto"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-teal-400" />
              
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-3 left-3 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
                aria-label="סגור"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Back button */}
              <button
                onClick={handleBackFromSummary}
                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
                aria-label="חזור"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Summary Content */}
              <div className="pt-2">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-lg flex-shrink-0 shadow-lg shadow-teal-500/20">
                    📋
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1 text-base">סיכום קצר</h3>
                    <p className="text-xs text-slate-500">מה אנחנו עושים בקצרה</p>
                  </div>
                </div>

                {/* What we do */}
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <h4 className="font-semibold text-slate-900 text-sm mb-2">מה אנחנו עושים?</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">{siteConfig.description}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{heroConfig.subheadline}</p>
                </div>

                {/* Stats */}
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <h4 className="font-semibold text-slate-900 text-sm mb-2">המספרים שלנו</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-teal-600">{siteConfig.stats.clients}</div>
                      <div className="text-xs text-slate-500">{siteConfig.stats.clientsLabel}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-teal-600">{siteConfig.stats.years}</div>
                      <div className="text-xs text-slate-500">{siteConfig.stats.yearsLabel}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-teal-600">{siteConfig.stats.satisfaction}</div>
                      <div className="text-xs text-slate-500">{siteConfig.stats.satisfactionLabel}</div>
                    </div>
                  </div>
                </div>

                {/* How it works - simplified */}
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <h4 className="font-semibold text-slate-900 text-sm mb-2">איך זה עובד?</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">{howItWorksConfig.subheadline}</p>
                  <div className="space-y-2">
                    {howItWorksConfig.steps.slice(0, 3).map((step, idx) => (
                      <div key={step.id} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-slate-900">{step.title}</div>
                          <div className="text-xs text-slate-500">{step.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-900 text-sm mb-2">למה לבחור בנו?</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-teal-500 text-xs mt-0.5">✓</span>
                      <span className="text-xs text-slate-600">עיצוב מותאם אישית - התמונות, הצבעים והסגנון שלך</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-teal-500 text-xs mt-0.5">✓</span>
                      <span className="text-xs text-slate-600">מערכת מיילים מקצועית - אלפי מיילים בחודש במחיר נמוך</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-teal-500 text-xs mt-0.5">✓</span>
                      <span className="text-xs text-slate-600">מחיר שמנצח - זול משמעותית מהמתחרים</span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={handleContactFromSummary}
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    בואו נדבר
                  </button>
                  <button
                    onClick={handleWhatsAppFromSummary}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.369 1.262.59 1.694.755.712.27 1.36.232 1.871.141.571-.099 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  )
}
