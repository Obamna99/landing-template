"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { siteConfig, headerConfig } from "@/lib/config"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  const handleNavClick = (id: string) => {
    setActiveLink(id)
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleCTAClick = () => {
    setMobileMenuOpen(false)
    const formSection = document.getElementById("contact")
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      toast({
        title: "צרו קשר",
        description: "מלאו את הטופס למטה לקבלת הצעה",
      })
    }
  }

  const phoneHref = `tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, '')}`

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-200/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Business Name/Logo - Right side in RTL */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {/* Logo Mark */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <span className="text-white font-bold text-lg">{siteConfig.branding.logoText}</span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight block">
                {siteConfig.name}
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">{siteConfig.tagline}</span>
            </div>
          </motion.div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {headerConfig.navLinks.map((link) => (
              <motion.button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-offset-2 ${
                  activeLink === link.id
                    ? "text-teal-700 bg-teal-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {link.label}
              </motion.button>
            ))}
          </nav>

          {/* Desktop CTA Button - Left side in RTL */}
          <div className="hidden md:flex items-center gap-3">
            {/* Phone number */}
            <a
              href={phoneHref}
              className="text-sm text-slate-600 hover:text-teal-600 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{siteConfig.contact.phone}</span>
            </a>
            
            <motion.button
              onClick={handleCTAClick}
              className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-5 lg:px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-teal-500/20 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {headerConfig.ctaButton}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-offset-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="תפריט"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-xl"
            >
              <nav className="flex flex-col py-4 space-y-1">
                {headerConfig.navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className="text-right px-4 py-3 text-slate-700 hover:text-teal-600 hover:bg-teal-50 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-inset rounded-lg min-h-[48px]"
                  >
                    {link.label}
                  </button>
                ))}
                
                {/* Phone in mobile */}
                <a
                  href={phoneHref}
                  className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:text-teal-600 font-medium transition-colors min-h-[48px]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {siteConfig.contact.phone}
                </a>
                
                <motion.button
                  onClick={handleCTAClick}
                  className="mx-4 mt-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 min-h-[48px]"
                  whileTap={{ scale: 0.98 }}
                >
                  {headerConfig.ctaButton}
                </motion.button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
