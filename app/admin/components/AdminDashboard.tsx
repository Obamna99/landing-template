"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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
}

type Tab = "dashboard" | "reviews" | "leads" | "email"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [reviews, setReviews] = useState<Review[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [emailStats, setEmailStats] = useState<EmailStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Reviews filter
  const [showInactive, setShowInactive] = useState(true) // Show all by default

  // Email campaign form
  const [emailSubject, setEmailSubject] = useState("")
  const [emailTitle, setEmailTitle] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [reviewsRes, leadsRes, emailRes] = await Promise.all([
        fetch("/api/reviews?all=true"), // Get all reviews including inactive
        fetch("/api/leads"),
        fetch("/api/admin/email"),
      ])

      if (reviewsRes.ok) setReviews(await reviewsRes.json())
      if (leadsRes.ok) setLeads(await leadsRes.json())
      if (emailRes.ok) setEmailStats(await emailRes.json())
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
          content: `<p>${emailContent.replace(/\n/g, "</p><p>")}</p>`,
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

  const tabs = [
    { id: "dashboard" as Tab, label: "סקירה כללית", icon: "📊" },
    { id: "reviews" as Tab, label: "ביקורות", icon: "⭐" },
    { id: "leads" as Tab, label: "לידים", icon: "👥" },
    { id: "email" as Tab, label: "אימייל", icon: "📧" },
  ]

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold">ש</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">פאנל ניהול</h1>
              <p className="text-xs text-slate-500">שם העסק</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm text-slate-600 hover:text-teal-600 transition-colors"
            >
              צפייה באתר ←
            </a>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              התנתקות
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-500/20"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-500 mt-4">טוען נתונים...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-3xl font-bold text-slate-900">{reviews.length}</div>
                  <div className="text-sm text-slate-500">ביקורות</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="text-3xl mb-2">👥</div>
                  <div className="text-3xl font-bold text-slate-900">{leads.length}</div>
                  <div className="text-sm text-slate-500">לידים</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="text-3xl mb-2">📧</div>
                  <div className="text-3xl font-bold text-slate-900">{emailStats?.activeSubscribers || 0}</div>
                  <div className="text-sm text-slate-500">נרשמים פעילים</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="text-3xl mb-2">🌟</div>
                  <div className="text-3xl font-bold text-slate-900">
                    {reviews.filter((r) => r.featured).length}
                  </div>
                  <div className="text-sm text-slate-500">ביקורות מומלצות</div>
                </div>

                {/* Recent Leads */}
                <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4">לידים אחרונים</h3>
                  {leads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <div className="font-medium text-slate-900">{lead.fullName}</div>
                        <div className="text-sm text-slate-500">{lead.email}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.status === "new" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {lead.status === "new" ? "חדש" : lead.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Recent Campaigns */}
                <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4">קמפיינים אחרונים</h3>
                  {emailStats?.recentCampaigns.length ? (
                    emailStats.recentCampaigns.map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div>
                          <div className="font-medium text-slate-900">{campaign.subject}</div>
                          <div className="text-sm text-slate-500">
                            {new Date(campaign.sentAt).toLocaleDateString("he-IL")}
                          </div>
                        </div>
                        <span className="text-sm text-slate-600">
                          {campaign.recipientCount} נמענים
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">אין קמפיינים עדיין</p>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
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
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase w-[200px]">שם</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase w-[100px]">חברה</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">תוכן</th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase w-[80px]">דירוג</th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase w-[100px]">מומלץ</th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase w-[100px]">פעיל</th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase w-[60px]">מחק</th>
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
                              ? 'bg-amber-50/50 hover:bg-amber-50' 
                              : !review.active 
                                ? 'bg-slate-50/50 opacity-60 hover:opacity-80' 
                                : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {review.imageUrl ? (
                                <img
                                  src={review.imageUrl}
                                  alt=""
                                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold flex-shrink-0">
                                  {review.name.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-medium text-slate-900 truncate flex items-center gap-1">
                                  {review.name}
                                  {review.featured && <span className="text-amber-500">⭐</span>}
                                </div>
                                <div className="text-xs text-slate-500 truncate">{review.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{review.company || '-'}</td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-slate-600 line-clamp-2">{review.content}</p>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < review.rating ? "text-amber-400" : "text-slate-200"}>★</span>
                              ))}
                            </div>
                          </td>
                          {/* Featured Toggle - Attractive Button */}
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => toggleReviewFeatured(review.id, review.featured)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                review.featured
                                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md hover:shadow-lg hover:from-amber-500 hover:to-amber-600"
                                  : "bg-slate-100 text-slate-500 hover:bg-amber-100 hover:text-amber-700"
                              }`}
                            >
                              {review.featured ? "⭐ מומלץ" : "הוסף מומלץ"}
                            </button>
                          </td>
                          {/* Active Toggle - Proper Switch */}
                          <td className="px-4 py-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <button
                                onClick={() => toggleReviewActive(review.id, review.active)}
                                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-200 ${
                                  review.active 
                                    ? "bg-gradient-to-r from-green-400 to-green-500 shadow-inner" 
                                    : "bg-slate-200"
                                }`}
                                dir="ltr"
                              >
                                <span
                                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-200 ${
                                    review.active ? "translate-x-8" : "translate-x-1"
                                  }`}
                                />
                              </button>
                              <span className={`text-[10px] font-medium ${review.active ? 'text-green-600' : 'text-slate-400'}`}>
                                {review.active ? 'מוצג' : 'מוסתר'}
                              </span>
                            </div>
                          </td>
                          {/* Delete */}
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => deleteReview(review.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                  <div className="text-center py-12 text-slate-500">
                    אין ביקורות עדיין
                  </div>
                )}
              </div>
            )}

            {/* Leads Tab */}
            {activeTab === "leads" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">לידים</h3>
                  <span className="text-sm text-slate-500">{leads.length} לידים</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">שם</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">אימייל</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">טלפון</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">סוג עסק</th>
                        <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase">סטטוס</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">תאריך</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-900">{lead.fullName}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            <a href={`mailto:${lead.email}`} className="text-teal-600 hover:underline">
                              {lead.email}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            <a href={`tel:${lead.phone}`} className="text-teal-600 hover:underline">
                              {lead.phone}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{lead.businessType || "-"}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              lead.status === "new"
                                ? "bg-green-100 text-green-700"
                                : lead.status === "contacted"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                            }`}>
                              {lead.status === "new" ? "חדש" : lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {new Date(lead.createdAt).toLocaleDateString("he-IL")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Email Tab */}
            {activeTab === "email" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stats */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
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
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-6">שליחת קמפיין</h3>
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
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none transition-all"
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
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none transition-all"
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
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:outline-none transition-all resize-none"
                      />
                    </div>
                    <button
                      onClick={sendEmailCampaign}
                      disabled={sendingEmail || !emailStats?.activeSubscribers}
                      className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white py-3.5 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingEmail
                        ? "שולח..."
                        : `שלח ל-${emailStats?.activeSubscribers || 0} נרשמים`}
                    </button>
                    <p className="text-xs text-slate-500 text-center">
                      האימייל יישלח דרך Amazon SES לכל הנרשמים הפעילים
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
