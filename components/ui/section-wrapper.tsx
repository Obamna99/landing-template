"use client"

import { useState, useEffect, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SectionWrapperProps {
  children: ReactNode
  sectionId: string
  sectionName: string
  /** When set, visibility is controlled by admin (server). No visitor toggle bar. */
  visible?: boolean
  showToggle?: boolean
  isFirst?: boolean
}

export function SectionWrapper({
  children,
  sectionId,
  sectionName,
  visible: serverVisible,
  showToggle = true,
  isFirst = false,
}: SectionWrapperProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Admin-controlled visibility: no toggle bar, just show/hide
  if (serverVisible !== undefined) {
    if (!serverVisible) return null
    return <>{children}</>
  }

  // Visitor-controlled (legacy): toggle bar + sessionStorage
  useEffect(() => {
    setMounted(true)
    sessionStorage.removeItem(`section-hidden-${sectionId}`)
  }, [sectionId])

  const handleToggle = () => {
    const newState = !isVisible
    setIsVisible(newState)
    if (!newState) {
      sessionStorage.setItem(`section-hidden-${sectionId}`, "true")
    } else {
      sessionStorage.removeItem(`section-hidden-${sectionId}`)
    }
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {showToggle && (
        <div className={`${isVisible ? 'sticky top-16 z-30' : `relative z-20 ${isFirst && 'mt-16'}`} border-b ${isVisible ? 'bg-white/60 backdrop-blur-sm border-slate-100' : 'bg-slate-100 border-slate-200'}`}>
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
            {/* Left side - section name */}
            <span className={`text-xs font-medium ${isVisible ? 'text-slate-400' : 'text-slate-600'}`}>
              {sectionName}
            </span>
            
            {/* Right side - toggle */}
            <button
              onClick={handleToggle}
              className="flex items-center gap-2 text-xs hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors"
              title={isVisible ? `הסתר ${sectionName}` : `הצג ${sectionName}`}
            >
              <span className={`${isVisible ? 'text-slate-500' : 'text-teal-600 font-medium'}`}>
                {isVisible ? 'הסתר' : 'הצג'}
              </span>
              {/* Toggle Switch */}
              <div
                className={`relative w-8 h-4 rounded-full transition-colors duration-200 ${
                  isVisible ? "bg-teal-500" : "bg-slate-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-200 ${
                    isVisible ? "right-0.5" : "left-0.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Section Content */}
      <AnimatePresence mode="wait" initial={false}>
        {isVisible && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
