"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { socialProofConfig } from "@/lib/config"

interface Notification {
  id: string
  name: string
  city: string
  businessType: string
  action: string
  timeAgo: number
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateNotification(): Notification {
  const person = getRandomItem(socialProofConfig.names)
  const city = getRandomItem(socialProofConfig.cities)
  const businessType = getRandomItem(socialProofConfig.businessTypes)
  const action = getRandomItem(socialProofConfig.actions)
  const timeAgo = getRandomItem(socialProofConfig.timeAgoOptions)
  
  return {
    id: `notif-${Date.now()}`,
    name: person.name,
    city,
    businessType,
    action,
    timeAgo,
  }
}

export function SocialProofNotification() {
  const [mounted, setMounted] = useState(false)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Prevent hydration mismatch - only render after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const showNotification = useCallback(() => {
    if (isDismissed) return
    
    const newNotification = generateNotification()
    setNotification(newNotification)
    setIsVisible(true)
    
    // Hide after display duration
    setTimeout(() => {
      setIsVisible(false)
    }, socialProofConfig.displayDuration)
  }, [isDismissed])

  useEffect(() => {
    if (!socialProofConfig.enabled) return
    
    // Check if user dismissed notifications this session
    const dismissed = sessionStorage.getItem("social-proof-dismissed") === "true"
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Initial delay
    const initialTimer = setTimeout(() => {
      showNotification()
    }, socialProofConfig.initialDelay)

    // Set up recurring notifications
    let intervalTimer: NodeJS.Timeout

    const scheduleNext = () => {
      const delay = getRandomInt(socialProofConfig.intervalMin, socialProofConfig.intervalMax)
      intervalTimer = setTimeout(() => {
        showNotification()
        scheduleNext()
      }, delay)
    }

    // Start recurring after initial
    const startRecurring = setTimeout(() => {
      scheduleNext()
    }, socialProofConfig.initialDelay + socialProofConfig.displayDuration + 2000)

    return () => {
      clearTimeout(initialTimer)
      clearTimeout(startRecurring)
      if (intervalTimer) clearTimeout(intervalTimer)
    }
  }, [showNotification])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    sessionStorage.setItem("social-proof-dismissed", "true")
  }

  // Don't render until mounted to prevent hydration errors
  if (!mounted || !socialProofConfig.enabled || isDismissed) return null

  // Position classes - mobile optimized to avoid conflicts
  const positionClasses = {
    "bottom-left": "bottom-20 left-4 sm:bottom-6 sm:left-6", // Above floating CTA on mobile
    "bottom-right": "bottom-20 right-4 sm:bottom-6 sm:right-6", // Above floating CTA on mobile
    "top-left": "top-20 left-4 sm:top-24 sm:left-6",
    "top-right": "top-20 right-4 sm:top-24 sm:right-6",
  }

  return (
    <AnimatePresence>
      {isVisible && notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`fixed ${positionClasses[socialProofConfig.position]} z-50 max-w-xs sm:max-w-sm`}
        >
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-3 flex items-center gap-2.5 relative max-w-[240px]">
            {/* Small avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {notification.name.charAt(0)}
            </div>
            
            {/* Simplified content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-700 leading-tight">
                <span className="font-semibold">{notification.businessType}</span>
                {" מ"}
                <span className="font-semibold">{notification.city}</span>
                {" "}
                {notification.action}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                לפני {notification.timeAgo} דק'
              </p>
            </div>
            
            {/* Small close button */}
            <button
              onClick={handleDismiss}
              className="p-0.5 text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0"
              aria-label="סגור"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
