"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { BuildLogout } from "@/components/landing/build-logout"

const LeadForm = dynamic(
  () => import("@/components/landing/lead-form").then((m) => m.LeadForm),
  { ssr: true, loading: () => <div className="min-h-[400px] flex items-center justify-center text-slate-500">טוען...</div> }
)

export function BuildForm() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 build-form-lcp">
      <div className="flex justify-end mb-4 sm:mb-6">
        <BuildLogout />
      </div>
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 build-form-lcp">
          בנה את <span className="gradient-text">האתר שלך</span>
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto build-form-lcp" style={{ animationDelay: "0.05s" }}>
          מלאו את כל השלבים – פרטים, תוכן לכל אזור באתר, ותצוגה מקדימה תהיה זמינה מיד.
        </p>
      </div>
      <LeadForm buildPage />
    </div>
  )
}
