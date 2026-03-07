"use client"

import { useRouter } from "next/navigation"

export function BuildLogout() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/client/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="יציאה וחזרה לדף הבית"
      className="text-sm text-slate-500 hover:text-slate-700 font-medium px-3 py-2 min-h-[44px] rounded-lg hover:bg-slate-100 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2"
    >
      יציאה
    </button>
  )
}
