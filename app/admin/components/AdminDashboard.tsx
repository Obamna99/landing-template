"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Star, Users, Mail, LayoutGrid, ExternalLink, LogOut, Menu, X } from "lucide-react"
import { SECTION_IDS, SECTION_LABELS, defaultSectionVisibility } from "@/lib/sections"
import { siteConfig } from "@/lib/config"
import DashboardTabContent from "./DashboardTabContent"

interface Review {
  id: string
  name: string
  role: string | null
  company: string | null
  content: string
  rating: number
  imageUrl: string | null
  result: string | null
  resultLabel: string | null
  featured: boolean
  active: boolean
  order: number
  createdAt: string
}

interface Lead {
  id: string
  fullName: string
  email: string
  phone: string
  businessType: string | null
  status: string
  createdAt: string
}

interface EmailStats {
  totalSubscribers: number
  activeSubscribers: number
  recentCampaigns: Array<{
    id: string
    subject: string
    recipientCount: number
    sentAt: string
  }>
  emailConfigured?: boolean
}

type Tab = "dashboard" | "reviews" | "leads" | "email" | "layout"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [reviews, setReviews] = useState<Review[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [emailStats, setEmailStats] = useState<EmailStats | null>(null)
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean> | null>(null)
  const [layoutError, setLayoutError] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Reviews filter
  const [showInactive, setShowInactive] = useState(true) // Show all by default

  // Email campaign form
  const [emailSubject, setEmailSubject] = useState("")
  const [emailTitle, setEmailTitle] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [sendingEmail, setSendingEmail] = useState(false)
  const [testEmailTo, setTestEmailTo] = useState("")
  const [sendingTestEmail, setSendingTestEmail] = useState(false)
  const [testEmailMessage, setTestEmailMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [reviewsRes, leadsRes, emailRes, sectionsRes] = await Promise.all([
        fetch("/api/reviews?all=true"), // Get all reviews including inactive
        fetch("/api/leads"),
        fetch("/api/admin/email"),
        fetch("/api/admin/settings/sections"),
      ])

      if (reviewsRes.ok) setReviews(await reviewsRes.json())
      if (leadsRes.ok) setLeads(await leadsRes.json())
      if (emailRes.ok) setEmailStats(await emailRes.json())
      if (sectionsRes.ok) setSectionVisibility(await sectionsRes.json())
    } catch (error) {
      console.error("Error loading data:", error)
    }
    setIsLoading(false)
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  const toggleReviewActive = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      })
      loadData()
    } catch (error) {
      console.error("Error toggling review:", error)
    }
  }

  const toggleReviewFeatured = async (id: string, featured: boolean) => {
    try {
      await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !featured }),
      })
      loadData()
    } catch (error) {
      console.error("Error toggling featured:", error)
    }
  }

  const deleteReview = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק ביקורת זו?")) return
    
    try {
      await fetch(`/api/reviews/${id}`, { method: "DELETE" })
      loadData()
    } catch (error) {
      console.error("Error deleting review:", error)
    }
  }

  const toggleSectionVisibility = async (sectionId: string, current: boolean) => {
    const prev = sectionVisibility ?? defaultSectionVisibility()
    const next = { ...prev, [sectionId]: !current }
    setSectionVisibility(next)
    try {
      const res = await fetch("/api/admin/settings/sections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [sectionId]: !current }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSectionVisibility(data)
      } else {
        if (res.status === 503) {
          setLayoutError("השינויים לא נשמרו (מערכת ללא מסד נתונים)")
        } else {
          setSectionVisibility(sectionVisibility ?? prev)
          setLayoutError(data?.error || "שגיאה בשמירה")
        }
        setTimeout(() => setLayoutError(""), 4000)
      }
    } catch {
      setSectionVisibility(sectionVisibility ?? prev)
      setLayoutError("שגיאה בשמירה")
      setTimeout(() => setLayoutError(""), 4000)
    }
  }

  const sendTestEmail = async () => {
    const to = testEmailTo.trim()
    if (!to) {
      setTestEmailMessage({ type: "error", text: "הזן כתובת אימייל" })
      return
    }
    setTestEmailMessage(null)
    setSendingTestEmail(true)
    try {
      const res = await fetch("/api/admin/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setTestEmailMessage({ type: "success", text: `נשלח בהצלחה ל־${to}. בדוק תיבת דואר (וגם ספאם).` })
        setTestEmailTo("")
      } else {
        setTestEmailMessage({ type: "error", text: data?.error || "שליחה נכשלה" })
      }
    } catch {
      setTestEmailMessage({ type: "error", text: "שגיאה בשליחה" })
    }
    setSendingTestEmail(false)
  }

  const sendEmailCampaign = async () => {
    if (!emailSubject || !emailTitle || !emailContent) {
      alert("נא למלא את כל השדות")
      return
    }

    if (!confirm(`לשלוח את הקמפיין ל-${emailStats?.activeSubscribers} נמענים?`)) return

    setSendingEmail(true)
    try {
      const response = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: emailSubject,
          title: emailTitle,
          content: "<p>" + emailContent.replace(/\n/g, "</p><p>") + "</p>",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`נשלחו ${data.sent} מיילים בהצלחה!`)
        setEmailSubject("")
        setEmailTitle("")
        setEmailContent("")
        loadData()
      } else {
        alert(data.error || "שגיאה בשליחת הקמפיין")
      }
    } catch (error) {
      alert("שגיאה בשליחת הקמפיין")
    }
    setSendingEmail(false)
  }

  const navItems: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: "dashboard", label: "סקירה כללית", icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { id: "reviews", label: "ביקורות", icon: <Star className="w-5 h-5 shrink-0" /> },
    { id: "leads", label: "לידים", icon: <Users className="w-5 h-5 shrink-0" /> },
    { id: "email", label: "אימייל", icon: <Mail className="w-5 h-5 shrink-0" /> },
    { id: "layout", label: "מבנה האתר", icon: <LayoutGrid className="w-5 h-5 shrink-0" /> },
  ]
  const activeTabLabel = navItems.find((n) => n.id === activeTab)?.label ?? "סקירה כללית"

  const closeSidebar = () => setSidebarOpen(false)
  const openSidebar = () => setSidebarOpen(true)
  const setTab = (id: Tab) => {
    setActiveTab(id)
    closeSidebar()
  }

  const inputClass =
    "w-full px-4 py-3 min-h-[44px] text-base rounded-lg border border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 transition-all text-slate-900"

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-slate-200 flex-shrink-0 shrink-0">
        <button
          type="button"
          onClick={openSidebar}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 touch-manipulation"
          aria-label="תפריט"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex-1 min-w-0 flex flex-col items-center">
          <span className="text-sm font-bold text-slate-900 truncate w-full text-center">{siteConfig.name}</span>
          <span className="text-xs text-teal-600 font-medium truncate w-full text-center">{activeTabLabel}</span>
        </div>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">{siteConfig.name.charAt(0)}</span>
        </div>
      </header>

      {/* Sidebar - drawer on mobile, fixed on desktop (right for RTL) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
          aria-hidden
          onClick={closeSidebar}
        />
      )}
      <aside
        className={`
          w-64 flex-shrink-0 bg-slate-50 border-l border-slate-200 flex flex-col
          fixed top-0 bottom-0 right-0 z-50 transform transition-transform duration-200 ease-out
          md:static md:transform-none md:z-auto
          ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between md:justify-start bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white font-bold text-lg">{siteConfig.name.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-900 truncate">{siteConfig.name}</h1>
              <p className="text-xs text-slate-500">פאנל ניהול</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 touch-manipulation"
            aria-label="סגור תפריט"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors border touch-manipulation ${
                activeTab === item.id
                  ? "bg-teal-100 text-teal-800 border-teal-200 border-s-2 border-s-teal-500"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200 space-y-1 bg-white bg-opacity-80">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-3 min-h-[44px] rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors touch-manipulation"
          >
            <ExternalLink className="w-5 h-5 shrink-0" />
            צפייה באתר
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 min-h-[44px] rounded-lg text-sm text-red-600 hover:bg-red-50 font-medium transition-colors touch-manipulation"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            התנתקות
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto min-w-0 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-8 md:pb-10">

        {isLoading ? (
          <div className="space-y-6">
            <div className="h-8 w-48 rounded-lg bg-slate-200 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100">
                  <div className="h-8 w-8 rounded-lg bg-slate-200 animate-pulse mb-3" />
                  <div className="h-8 w-12 rounded bg-slate-200 animate-pulse mb-2" />
                  <div className="h-4 w-20 rounded bg-slate-100 animate-pulse" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-3">
                <div className="h-5 w-32 rounded bg-slate-200 animate-pulse" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 rounded-lg bg-slate-100 animate-pulse" />
                ))}
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-3">
                <div className="h-5 w-32 rounded bg-slate-200 animate-pulse" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 rounded-lg bg-slate-100 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <DashboardTabContent
                reviewsCount={reviews.length}
                featuredCount={reviews.filter((r) => r.featured).length}
                leads={leads}
                leadsCount={leads.length}
                emailStats={emailStats}
              />
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">ביקורות</h2>
                <p className="text-sm text-slate-500 sm:hidden">גלול לצד לצפייה בכל העמודות</p>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">ניהול ביקורות</h3>
                    <p className="text-sm text-slate-500">
                      <span className="text-amber-600">{reviews.filter(r => r.featured).length} מומלצות</span>
                      {' • '}
                      <span className="text-green-600">{reviews.filter(r => r.active && !r.featured).length} פעילות</span>
                      {' • '}
                      <span className="text-slate-400">{reviews.filter(r => !r.active).length} מושבתות</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showInactive}
                        onChange={(e) => setShowInactive(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-slate-600">הצג מושבתות</span>
                    </label>
                  </div>
                </div>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-[700px]">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                      <tr>
                        <th className="text-right px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase w-[140px] sm:w-[200px] bg-slate-50">שם</th>
                        <th className="text-right px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase w-[80px] sm:w-[100px] bg-slate-50">חברה</th>
                        <th className="text-right px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase min-w-[120px] bg-slate-50">תוכן</th>
                        <th className="text-center px-2 sm:px-4 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase w-[60px] sm:w-[80px] bg-slate-50">דירוג</th>
                        <th className="text-center px-2 sm:px-4 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase w-[80px] sm:w-[100px] bg-slate-50">מומלץ</th>
                        <th className="text-center px-2 sm:px-4 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase w-[70px] sm:w-[100px] bg-slate-50">פעיל</th>
                        <th className="text-center px-2 sm:px-4 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase w-[50px] sm:w-[60px] bg-slate-50">מחק</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reviews
                        .filter(r => showInactive || r.active)
                        // Sort: Featured first, then Active, then Inactive
                        .sort((a, b) => {
                          // Featured reviews first
                          if (a.featured && !b.featured) return -1
                          if (!a.featured && b.featured) return 1
                          // Then active reviews
                          if (a.active && !b.active) return -1
                          if (!a.active && b.active) return 1
                          // Then by order/date
                          return 0
                        })
                        .map((review) => (
                        <tr 
                          key={review.id} 
                          className={`transition-colors ${
                            review.featured
                              ? "bg-amber-50 hover:bg-amber-50"
                              : !review.active
                                ? "bg-slate-50 opacity-60 hover:opacity-80"
                                : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="px-3 sm:px-4 py-2 sm:py-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              {review.imageUrl ? (
                                <img
                                  src={review.imageUrl}
                                  alt=""
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-sm flex-shrink-0">
                                  {review.name.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-medium text-slate-900 truncate flex items-center gap-1 text-sm">
                                  {review.name}
                                  {review.featured && <span className="text-amber-500">⭐</span>}
                                </div>
                                <div className="text-xs text-slate-500 truncate">{review.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-600">{review.company || '-'}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 max-w-[140px] sm:max-w-none">{review.content}</p>
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                            <div className="flex justify-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < review.rating ? "text-amber-400" : "text-slate-200"}>★</span>
                              ))}
                            </div>
                          </td>
                          {/* Featured Toggle - Attractive Button */}
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                            <button
                              onClick={() => toggleReviewFeatured(review.id, review.featured)}
                              className={`min-h-[44px] min-w-[44px] sm:min-w-0 flex items-center justify-center mx-auto px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all touch-manipulation ${
                                review.featured
                                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md hover:shadow-lg hover:from-amber-500 hover:to-amber-600"
                                  : "bg-slate-100 text-slate-500 hover:bg-amber-100 hover:text-amber-700"
                              }`}
                            >
                              {review.featured ? "⭐ מומלץ" : "מומלץ"}
                            </button>
                          </td>
                          {/* Active Toggle - Proper Switch */}
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                            <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                              <button
                                onClick={() => toggleReviewActive(review.id, review.active)}
                                className={`relative inline-flex h-7 w-12 sm:h-7 sm:w-14 items-center rounded-full transition-all duration-200 touch-manipulation ${
                                  review.active 
                                    ? "bg-gradient-to-r from-green-400 to-green-500 shadow-inner" 
                                    : "bg-slate-200"
                                }`}
                                dir="ltr"
                              >
                                <span
                                  className={`inline-block h-4 w-5 sm:h-5 sm:w-5 transform rounded-full bg-white shadow-md transition-all duration-200 ${
                                    review.active ? "translate-x-6 sm:translate-x-8" : "translate-x-1"
                                  }`}
                                />
                              </button>
                              <span className={`text-[10px] font-medium ${review.active ? 'text-green-600' : 'text-slate-400'}`}>
                                {review.active ? 'מוצג' : 'מוסתר'}
                              </span>
                            </div>
                          </td>
                          {/* Delete */}
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                            <button
                              onClick={() => deleteReview(review.id)}
                              className="min-h-[44px] min-w-[44px] flex items-center justify-center mx-auto p-1.5 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                              title="מחק ביקורת"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {reviews.length === 0 && (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    אין ביקורות עדיין
                  </div>
                )}
                </div>
              </div>
            )}

            {/* Leads Tab */}
            {activeTab === "leads" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">לידים</h2>
                <p className="text-sm text-slate-500 sm:hidden">גלול לצד לצפייה בכל העמודות</p>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">לידים</h3>
                  <span className="text-xs sm:text-sm text-slate-500">{leads.length} לידים</span>
                </div>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                      <tr>
                        <th className="text-right px-3 sm:px-6 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase bg-slate-50">שם</th>
                        <th className="text-right px-3 sm:px-6 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase bg-slate-50">אימייל</th>
                        <th className="text-right px-3 sm:px-6 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase bg-slate-50">טלפון</th>
                        <th className="text-right px-3 sm:px-6 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase hidden md:table-cell bg-slate-50">סוג עסק</th>
                        <th className="text-center px-3 sm:px-6 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase bg-slate-50">סטטוס</th>
                        <th className="text-right px-3 sm:px-6 py-2 sm:py-3 text-xs font-medium text-slate-500 uppercase bg-slate-50">תאריך</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {leads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center text-slate-500 text-sm">
                            אין לידים עדיין
                          </td>
                        </tr>
                      ) : leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-slate-900 text-sm">{lead.fullName}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600">
                            <a href={`mailto:${lead.email}`} className="text-teal-600 hover:underline break-all">
                              {lead.email}
                            </a>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600">
                            <a href={`tel:${lead.phone}`} className="text-teal-600 hover:underline">
                              {lead.phone}
                            </a>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600 hidden md:table-cell">{lead.businessType || "-"}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              lead.status === "new"
                                ? "bg-green-100 text-green-700"
                                : lead.status === "unsubscribed"
                                ? "bg-slate-200 text-slate-600"
                                : lead.status === "contacted"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                            }`}>
                              {lead.status === "new"
                                ? "חדש"
                                : lead.status === "unsubscribed"
                                ? "הוסר מהרשימה"
                                : lead.status}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-500">
                            {lead.createdAt
                              ? (() => {
                                  const d = new Date(lead.createdAt)
                                  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("he-IL")
                                })()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </div>
              </div>
            )}

            {/* Email Tab */}
            {activeTab === "email" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900">אימייל</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Stats */}
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-6">סטטיסטיקות</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-slate-900">
                        {emailStats?.totalSubscribers || 0}
                      </div>
                      <div className="text-sm text-slate-500">סה"כ נרשמים</div>
                    </div>
                    <div className="bg-teal-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-teal-700">
                        {emailStats?.activeSubscribers || 0}
                      </div>
                      <div className="text-sm text-teal-600">נרשמים פעילים</div>
                    </div>
                  </div>

                  <h4 className="font-medium text-slate-900 mt-6 mb-4">קמפיינים אחרונים</h4>
                  <div className="space-y-3">
                    {emailStats?.recentCampaigns.length ? (
                      emailStats.recentCampaigns.map((campaign) => (
                        <div key={campaign.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <div className="font-medium text-slate-900 text-sm">{campaign.subject}</div>
                            <div className="text-xs text-slate-500">
                              {new Date(campaign.sentAt).toLocaleDateString("he-IL")}
                            </div>
                          </div>
                          <span className="text-sm text-slate-600">{campaign.recipientCount}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm">לא נשלחו קמפיינים עדיין</p>
                    )}
                  </div>
                </div>

                {/* Send Campaign Form */}
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-4">בדיקת חיבור SES</h3>
                  <p className="text-sm text-slate-500 mb-3">
                    שלח מייל בדיקה כדי לוודא ש־SES מוגדר נכון. ב־Sandbox יש לשלוח רק לכתובת מאומתת.
                  </p>
                  <div className="flex flex-wrap items-end gap-2 mb-4">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-medium text-slate-500 mb-1">שליחה אל</label>
                      <input
                        type="email"
                        value={testEmailTo}
                        onChange={(e) => setTestEmailTo(e.target.value)}
                        placeholder="your@email.com"
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={sendTestEmail}
                      disabled={sendingTestEmail || emailStats?.emailConfigured === false}
                      className="min-h-[44px] px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                    >
                      {sendingTestEmail ? "שולח..." : "שלח מייל בדיקה"}
                    </button>
                  </div>
                  {testEmailMessage && (
                    <div
                      className={`mb-4 p-3 rounded-lg text-sm ${
                        testEmailMessage.type === "success"
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {testEmailMessage.text}
                    </div>
                  )}
                  {emailStats?.emailConfigured === false && (
                    <div className="mb-4 p-3 rounded-lg bg-slate-100 text-slate-600 text-sm">
                      הגדר ב־.env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SES_FROM_EMAIL (ו־AWS_REGION אם צריך).
                    </div>
                  )}

                  <h3 className="font-bold text-slate-900 mb-4 mt-6">שליחת קמפיין</h3>
                  {emailStats?.emailConfigured === false && (
                    <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                      <strong>חיבור אימייל לא מוגדר.</strong> כדי לשלוח קמפיינים הגדר Amazon SES: הוסף ל-.env את המשתנים AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY ו-SES_FROM_EMAIL. ראה SETUP.md להנחיות.
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        נושא האימייל
                      </label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="למשל: חדשות מרגשות מהעסק שלנו!"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        כותרת
                      </label>
                      <input
                        type="text"
                        value={emailTitle}
                        onChange={(e) => setEmailTitle(e.target.value)}
                        placeholder="הכותרת הראשית באימייל"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        תוכן ההודעה
                      </label>
                      <textarea
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        placeholder="כתבו כאן את תוכן ההודעה..."
                        rows={6}
                        className={`${inputClass} resize-none min-h-[120px]`}
                      />
                    </div>
                    <button
                      onClick={sendEmailCampaign}
                      disabled={sendingEmail || !emailStats?.activeSubscribers || emailStats?.emailConfigured === false}
                      className="w-full min-h-[48px] bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white py-3.5 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                    >
                      {sendingEmail
                        ? "שולח..."
                        : `שלח ל-${emailStats?.activeSubscribers || 0} נרשמים`}
                    </button>
                    {emailStats?.emailConfigured === false && (
                      <p className="text-xs text-slate-500 text-center">
                        הגדר SES כדי לאפשר שליחת קמפיינים
                      </p>
                    )}
                  </div>
                </div>
              </div>
              </div>
            )}

            {/* Layout Tab */}
            {activeTab === "layout" && (() => {
              const visibility = sectionVisibility ?? defaultSectionVisibility()
              return (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900">מבנה האתר</h2>
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-2">הפעל או השבת אזורים</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    הפעל או השבת אזורים בדף הנחיתה. השינויים יופיעו מיד באתר.
                  </p>
                  {layoutError && (
                    <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                      {layoutError}
                    </div>
                  )}
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium mb-6"
                  >
                    צפייה באתר →
                  </a>
                  <div className="space-y-3">
                    {SECTION_IDS.map((id) => {
                      const visible = visibility[id] !== false
                      const label = SECTION_LABELS[id as keyof typeof SECTION_LABELS] || id
                      return (
                        <div
                          key={id}
                          className="flex items-center justify-between py-3 px-4 min-h-[52px] rounded-xl border border-slate-200 hover:bg-slate-50"
                        >
                          <span className="font-medium text-slate-900">{label}</span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={visible}
                            onClick={() => toggleSectionVisibility(id, visible)}
                            className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors touch-manipulation ${
                              visible ? "bg-teal-500" : "bg-slate-200"
                            }`}
                            dir="ltr"
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                                visible ? "translate-x-7" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
                </div>
              )
            })()}
          </>
        )}
        </div>
      </div>
    </div>
  )
}
