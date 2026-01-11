"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Clock, CheckCircle2 } from "lucide-react"

interface AdminStatsProps {
  candidates: any[]
  stats: any
}

export function AdminStats({ candidates, stats }: AdminStatsProps) {
  const avgProgress =
    candidates.length > 0 ? Math.round(candidates.reduce((acc, c) => acc + c.progress, 0) / candidates.length) : 0

  const recentCandidates = candidates.slice(0, 5)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <Card className="border-2">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="truncate">התקדמות ממוצעת</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-3xl sm:text-4xl font-bold">{avgProgress}%</div>
            <Progress value={avgProgress} className="h-2 sm:h-3" />
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="truncate">דורש תשומת לב</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-3xl sm:text-4xl font-bold">{Number(stats.pending_count) + Number(stats.in_progress_count)}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">מועמדים ממתינים ובתהליך</p>
          </CardContent>
        </Card>

        <Card className="border-2 sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
              <span className="truncate">שיעור השלמה</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-3xl sm:text-4xl font-bold">
              {Number(stats.total_count) > 0 ? Math.round((Number(stats.approved_count) / Number(stats.total_count)) * 100) : 0}%
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">מועמדים שאושרו מתוך הכלל</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Candidates */}
      <Card className="border-2">
        <CardHeader className="px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <CardTitle className="text-xl sm:text-2xl">מועמדים אחרונים</CardTitle>
          <CardDescription className="text-sm sm:text-base">5 המועמדים האחרונים שנרשמו למערכת</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-3 sm:space-y-4">
            {recentCandidates.map((candidate) => (
              <div key={candidate.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border-2 gap-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base sm:text-lg truncate">
                      {candidate.first_name} {candidate.last_name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{candidate.email}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      נרשם ב-{new Date(candidate.created_at).toLocaleDateString("he-IL")}
                    </p>
                  </div>
                </div>
                <div className="text-right sm:text-left flex-shrink-0">
                  <div className="text-xl sm:text-2xl font-bold mb-1">{candidate.progress}%</div>
                  <Progress value={candidate.progress} className="w-full sm:w-24 h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
