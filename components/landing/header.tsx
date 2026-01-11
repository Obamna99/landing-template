"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

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
        title: "קבלת מידע נוסף",
        description: "נא למלא את הטופס למטה",
      })
    }
  }

  const navLinks = [
    { id: "how-it-works", label: "איך זה עובד" },
    { id: "about", label: "עלינו" },
    { id: "faq", label: "שאלות נפוצות" },
    { id: "contact", label: "צור קשר" },
  ]

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-neutral-200/50"
          : "bg-white/60 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Business Name - Right side in RTL */}
          <motion.div
            className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            שם העסק
          </motion.div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="relative text-neutral-700 hover:text-neutral-900 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-2 rounded-sm px-2 py-1"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {link.label}
                {activeLink === link.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 right-0 left-0 h-0.5 bg-orange-500 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Desktop CTA Button - Left side in RTL */}
          <div className="hidden md:block">
            <motion.button
              onClick={handleCTAClick}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-2xl font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              קבל מידע נוסף
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-2 rounded-lg"
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
              className="md:hidden overflow-hidden border-t border-neutral-200/50"
            >
              <nav className="flex flex-col py-4 space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className="text-right px-4 py-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-inset rounded-lg"
                  >
                    {link.label}
                  </button>
                ))}
                <motion.button
                  onClick={handleCTAClick}
                  className="mx-4 mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-medium text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  whileTap={{ scale: 0.98 }}
                >
                  קבל מידע נוסף
                </motion.button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

