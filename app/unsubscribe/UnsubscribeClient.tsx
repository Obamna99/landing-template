"use client"

import { useState, FormEvent } from "react"
import Link from "next/link"
import { siteConfig } from "@/lib/config"

type Props = {
  initialDone?: boolean
  initialError?: string
}

export function UnsubscribeClient({ initialDone, initialError }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    initialDone ? "success" : initialError ? "error" : "idle"
  )
  const [errorMessage, setErrorMessage] = useState(initialError ?? "")
  const [email, setEmail] = useState("")
  const [formEmail, setFormEmail] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formEmail.trim()) return
    setStatus("loading")
    setErrorMessage("")
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formEmail.trim() }),
      })
      const data = await res.json()
      if (data.ok) {
        setStatus("success")
        setEmail(data.email || formEmail)
      } else {
        setStatus("error")
        setErrorMessage(data.error || "שגיאה בהסרה.")
      }
    } catch {
      setStatus("error")
      setErrorMessage("שגיאה בהסרה. נסו שוב.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-slate-900">הסרה מרשימת התפוצה</h1>
            <p className="text-slate-500 text-sm mt-1">{siteConfig.name}</p>
          </div>

          {status === "loading" && (
            <p className="text-center text-slate-600 py-4">מעבד...</p>
          )}

          {status === "success" && (
            <div className="text-center py-4">
              <p className="text-green-700 font-medium">הוסרת בהצלחה מרשימת התפוצה.</p>
              {email && <p className="text-slate-500 text-sm mt-1">{email}</p>}
              <Link
                href="/"
                className="inline-block mt-4 text-teal-600 hover:underline font-medium"
              >
                ← חזרה לאתר
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="mb-4">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {errorMessage}
              </div>
              <p className="text-slate-600 text-sm mt-3">ניתן להזין אימייל למטה להסרה.</p>
            </div>
          )}

          {status === "idle" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  אימייל להסרה
                </label>
                <input
                  type="email"
                  id="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 text-slate-900"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
              >
                הסר אותי מהרשימה
              </button>
            </form>
          )}

          {status !== "loading" && status !== "success" && (
            <p className="text-center mt-6">
              <Link href="/" className="text-slate-500 hover:text-teal-600 text-sm">
                חזרה לאתר
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
