"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/landing/header"

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] as const, staggerChildren: 0.06, delayChildren: 0.12 },
  },
}
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }

export default function ClientPage() {
  const router = useRouter()
  const [token, setToken] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const res = await fetch("/api/client/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || "הקוד שגוי")
      }
      router.push("/build")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "הקוד שגוי")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main id="main" className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-white via-teal-50/30 to-slate-50/50 overflow-x-hidden" tabIndex={-1}>
      <Header />
      <div className="pt-24 sm:pt-28 pb-[max(5rem,env(safe-area-inset-bottom))] px-4">
        <motion.div
          className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-100/80 p-6 sm:p-8"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <motion.div className="text-center mb-6" variants={item}>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">הזן את הקוד שקיבלת</h1>
            <p className="text-slate-600 text-sm">אחרי האימות תוכל למלא את טופס בניית האתר</p>
          </motion.div>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
                role="alert"
                aria-live="assertive"
              >
                <div id="token-error" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.form onSubmit={handleSubmit} className="space-y-4" variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <label htmlFor="token" className="block text-sm font-medium text-slate-700 mb-2">
                קוד גישה
              </label>
              <input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="הדבק את הקוד כאן"
                className="w-full px-4 py-3 min-h-[48px] rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:ring-offset-0 text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                required
                autoFocus
                autoComplete="one-time-code"
                aria-describedby={error ? "token-error" : undefined}
              />
            </motion.div>
            <motion.div variants={item}>
              <button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                aria-label={isLoading ? "בודק קוד גישה" : "המשך לטופס"}
                className="w-full py-3.5 min-h-[48px] rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold shadow-lg shadow-teal-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-teal-500/30 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2"
              >
                {isLoading ? "בודק..." : "המשך לטופס"}
              </button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </main>
  )
}
