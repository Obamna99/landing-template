"use client"

import { motion } from "framer-motion"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 sm:mb-12">
          {/* Business Info */}
          <div className="col-span-1 sm:col-span-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">שם העסק</h3>
            <p className="text-neutral-400 leading-relaxed max-w-md text-sm sm:text-base">
              פתרונות מקצועיים לעסקים בכל הגדלים. אנחנו כאן כדי לעזור לכם להצליח ולצמוח.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm sm:text-base">קישורים מהירים</h4>
            <ul className="space-y-2">
              {[
                { id: "how-it-works", label: "איך זה עובד" },
                { id: "about", label: "עלינו" },
                { id: "faq", label: "שאלות נפוצות" },
                { id: "contact", label: "צור קשר" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      const element = document.getElementById(link.id)
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" })
                      }
                    }}
                    className="text-neutral-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded-sm text-sm sm:text-base"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Placeholders */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm sm:text-base">עקבו אחרינו</h4>
            <div className="flex gap-3 sm:gap-4">
              {["Facebook", "LinkedIn", "Instagram"].map((social) => (
                <button
                  key={social}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                  aria-label={social}
                >
                  <span className="text-xs text-neutral-400">{social[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 pt-6 sm:pt-8 text-center">
          <p className="text-neutral-500 text-xs sm:text-sm">
            © {currentYear} שם העסק. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  )
}
