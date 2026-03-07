"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type RevealButtonProps = {
  label: string
  onReveal: () => void
  disabled?: boolean
}

export function RevealButton({ label, onReveal, disabled }: RevealButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    if (disabled || isLoading) return
    setIsLoading(true)
    const t = setTimeout(() => {
      setIsLoading(false)
      onReveal()
    }, 480)
    return () => clearTimeout(t)
  }

  return (
    <div className="flex justify-center py-12 sm:py-16">
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={disabled || isLoading}
        aria-label={label}
        className="reveal-btn-icon group relative w-20 h-20 sm:w-24 sm:h-24 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center overflow-visible"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
        whileHover={!isLoading ? { scale: 1.15 } : {}}
        whileTap={!isLoading ? { scale: 0.9 } : {}}
      >
        {/* Outer glow – soft shadow pulse */}
        <motion.span
          className="absolute inset-[-4px] rounded-full bg-gradient-to-br from-teal-400/40 to-amber-400/30 blur-md"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Ring 1 */}
        <motion.span
          className="absolute inset-[-2px] rounded-full border-2 border-teal-400/70"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Ring 2 */}
        <motion.span
          className="absolute inset-[-2px] rounded-full border-2 border-amber-400/50"
          animate={{
            scale: [1.15, 1.55, 1.15],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        {/* Ring 3 */}
        <motion.span
          className="absolute inset-[-2px] rounded-full border-2 border-teal-300/40"
          animate={{
            scale: [1.3, 1.7, 1.3],
            opacity: [0.25, 0, 0.25],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Fill on click */}
        <motion.span
          className="absolute inset-0 rounded-full bg-teal-500 z-0"
          initial={{ scale: 0 }}
          animate={{ scale: isLoading ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        />

        {/* Main circle – gradient */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 via-teal-500 to-amber-500 shadow-xl shadow-teal-500/35 group-hover:shadow-2xl group-hover:shadow-teal-500/45 transition-shadow duration-300 z-[1]" />

        {/* Shine overlay */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/35 via-white/5 to-transparent z-[2] pointer-events-none" />

        {/* Icon: chevron down (no text) */}
        <span className="relative z-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0 }}
                className="reveal-btn-spinner w-6 h-6 sm:w-8 sm:h-8 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <motion.span
                key="icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white drop-shadow-md"
              >
                <svg className="w-8 h-8 sm:w-10 sm:h-10 group-hover:translate-y-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>
    </div>
  )
}
