"use client"

import { useState, FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailsThisMonth, setEmailsThisMonth] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/admin/email-sent-count")
      .then((res) => res.ok && res.json())
      .then((data) => data && typeof data.count === "number" && setEmailsThisMonth(data.count))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Login failed")
      }

      router.push("/admin")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass =
    "w-full px-4 py-3 min-h-[48px] text-base rounded-lg border border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 text-slate-900"

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-6 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] overflow-x-hidden">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-slate-100/80 p-6 sm:p-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Logo */}
          <motion.div className="text-center mb-6 sm:mb-8" variants={item}>
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/25 mb-3 sm:mb-4">
              <span className="text-white font-bold text-xl sm:text-2xl">ש</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">ניהול האתר</h1>
            <p className="text-slate-500 text-sm mt-1">התחברו לפאנל הניהול</p>
          </motion.div>

          {/* Error Message - announced to screen readers */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
                role="alert"
                aria-live="assertive"
              >
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                שם משתמש
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                required
                autoFocus
                autoComplete="username"
              />
            </motion.div>

            <motion.div variants={item}>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                סיסמה
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
                autoComplete="current-password"
              />
            </motion.div>

            <motion.div variants={item}>
              <button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                aria-label={isLoading ? "מתחבר למערכת" : "התחברות"}
                className="w-full min-h-[48px] bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white py-3.5 rounded-xl font-bold text-base sm:text-lg shadow-lg shadow-teal-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:opacity-60 touch-manipulation hover:shadow-teal-500/30 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2"
              >
                {isLoading ? "מתחבר..." : "התחברות"}
              </button>
            </motion.div>
          </motion.form>

          {/* Email sent this month counter (resets every month) */}
          <AnimatePresence>
            {emailsThisMonth !== null && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-sm text-slate-500 mt-4 py-2 px-3 rounded-lg bg-slate-50 border border-slate-100"
              >
                מיילים שנשלחו החודש: <span className="font-semibold text-slate-700">{emailsThisMonth}</span>
              </motion.p>
            )}
          </AnimatePresence>

          {/* Back to site */}
          <motion.p
            variants={item}
            className="text-center text-sm text-slate-500 mt-6"
          >
            <a href="/" className="text-teal-600 hover:text-teal-700 font-medium min-h-[44px] inline-flex items-center justify-center touch-manipulation transition-colors duration-200">
              חזרה לאתר →
            </a>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}
