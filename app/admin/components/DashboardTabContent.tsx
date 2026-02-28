"use client"

interface Lead {
  id: string
  fullName: string
  email: string
  status: string
}

interface EmailStats {
  activeSubscribers: number
  recentCampaigns: Array<{
    id: string
    subject: string
    recipientCount: number
    sentAt: string
  }>
}

interface DashboardTabContentProps {
  reviewsCount: number
  featuredCount: number
  leads: Lead[]
  leadsCount: number
  emailStats: EmailStats | null
}

export default function DashboardTabContent({
  reviewsCount,
  featuredCount,
  leads,
  leadsCount,
  emailStats,
}: DashboardTabContentProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">סקירה כללית</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-2xl mb-3">⭐</div>
          <div className="text-xl sm:text-3xl font-bold text-slate-900">{reviewsCount}</div>
          <div className="text-xs sm:text-sm text-slate-500">ביקורות</div>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-2xl mb-3">👥</div>
          <div className="text-xl sm:text-3xl font-bold text-slate-900">{leadsCount}</div>
          <div className="text-xs sm:text-sm text-slate-500">לידים</div>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-2xl mb-3">📧</div>
          <div className="text-xl sm:text-3xl font-bold text-slate-900">{emailStats?.activeSubscribers ?? 0}</div>
          <div className="text-xs sm:text-sm text-slate-500">נרשמים פעילים</div>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-2xl mb-3">🌟</div>
          <div className="text-xl sm:text-3xl font-bold text-slate-900">{featuredCount}</div>
          <div className="text-xs sm:text-sm text-slate-500">ביקורות מומלצות</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
          <h3 className="font-bold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">לידים אחרונים</h3>
          {leads.slice(0, 5).map((lead) => (
            <div key={lead.id} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
              <div>
                <div className="font-medium text-slate-900">{lead.fullName}</div>
                <div className="text-sm text-slate-500">{lead.email}</div>
              </div>
              <span
                className={
                  "px-2 py-1 rounded-full text-xs font-medium " +
                  (lead.status === "new" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600")
                }
              >
                {lead.status === "new" ? "חדש" : lead.status}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
          <h3 className="font-bold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">קמפיינים אחרונים</h3>
          {emailStats?.recentCampaigns?.length ? (
            emailStats.recentCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <div>
                  <div className="font-medium text-slate-900">{campaign.subject}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(campaign.sentAt).toLocaleDateString("he-IL")}
                  </div>
                </div>
                <span className="text-sm text-slate-600">{campaign.recipientCount} נמענים</span>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">לא נשלחו קמפיינים עדיין</p>
          )}
        </div>
      </div>
    </div>
  )
}
