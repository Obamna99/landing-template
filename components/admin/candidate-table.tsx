"use client"

import { useState } from "react"
import { updateCandidateStatus } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Eye, Mail, Phone, MapPin } from "lucide-react"

interface CandidateTableProps {
  candidates: any[]
}

export function CandidateTable({ candidates }: CandidateTableProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const { toast } = useToast()

  async function handleStatusChange(candidateId: number, newStatus: string) {
    const result = await updateCandidateStatus(candidateId, newStatus)

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: result.error,
      })
    } else {
      toast({
        title: "הצלחה",
        description: "סטטוס המועמד עודכן בהצלחה",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "ממתין", variant: "secondary" as const },
      in_progress: { label: "בתהליך", variant: "default" as const },
      completed: { label: "הושלם", variant: "default" as const },
      approved: { label: "אושר", variant: "default" as const },
    }
    return statusMap[status as keyof typeof statusMap] || statusMap.pending
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {candidates.map((candidate) => {
        const statusBadge = getStatusBadge(candidate.status)
        return (
          <div key={candidate.id} className="p-3 sm:p-4 rounded-lg border-2 hover:border-primary/50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="font-bold text-base sm:text-lg truncate">
                    {candidate.first_name} {candidate.last_name}
                  </h3>
                  <Badge variant={statusBadge.variant} className="w-fit text-xs sm:text-sm">{statusBadge.label}</Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 truncate">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{candidate.email}</span>
                  </span>
                  {candidate.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      {candidate.phone}
                    </span>
                  )}
                  {candidate.address && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      {candidate.address}
                      {candidate.zip_code && `, ${candidate.zip_code}`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-3">
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                  <span className="text-muted-foreground">התקדמות</span>
                  <span className="font-bold">{candidate.progress}%</span>
                </div>
                <Progress value={candidate.progress} className="h-2" />
              </div>
              <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0">
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-muted-foreground">משימות</div>
                  <div className="font-bold text-sm sm:text-base">
                    {candidate.completed_tasks}/{candidate.total_tasks}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-muted-foreground">מסמכים</div>
                  <div className="font-bold text-sm sm:text-base">{candidate.document_count}</div>
                  {candidate.pending_documents > 0 && (
                    <Badge variant="destructive" className="mt-1 text-[10px] sm:text-xs">
                      {candidate.pending_documents} ממתינים
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Select
                defaultValue={candidate.status}
                onValueChange={(value) => handleStatusChange(candidate.id, value)}
              >
                <SelectTrigger className="w-full sm:w-40 h-10 sm:h-11 text-sm sm:text-base touch-manipulation">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">ממתין</SelectItem>
                  <SelectItem value="in_progress">בתהליך</SelectItem>
                  <SelectItem value="completed">הושלם</SelectItem>
                  <SelectItem value="approved">אושר</SelectItem>
                </SelectContent>
              </Select>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setSelectedCandidate(candidate)} className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base touch-manipulation hover:bg-primary hover:text-primary-foreground">
                    <Eye className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">צפה בפרטים</span>
                    <span className="sm:hidden">פרטים</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl">
                      {candidate.first_name} {candidate.last_name}
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">פרטי מועמד מלאים</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">דואר אלקטרוני</p>
                        <p className="font-medium text-sm sm:text-base break-all">{candidate.email}</p>
                      </div>
                      {candidate.phone && (
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">טלפון</p>
                          <p className="font-medium text-sm sm:text-base">{candidate.phone}</p>
                        </div>
                      )}
                      {candidate.id_number && (
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">תעודת זהות</p>
                          <p className="font-medium text-sm sm:text-base">{candidate.id_number}</p>
                        </div>
                      )}
                      {(candidate.address || candidate.city || candidate.zip_code) && (
                        <div className="col-span-1 sm:col-span-2">
                          <p className="text-xs sm:text-sm text-muted-foreground">כתובת מלאה</p>
                          <p className="font-medium text-sm sm:text-base">
                            {[candidate.address, candidate.city, candidate.zip_code].filter(Boolean).join(", ")}
                          </p>
                        </div>
                      )}
                      {candidate.marital_status && (
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">סטטוס משפחתי</p>
                          <p className="font-medium text-sm sm:text-base">{candidate.marital_status}</p>
                        </div>
                      )}
                      {candidate.education && (
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">השכלה</p>
                          <p className="font-medium text-sm sm:text-base">{candidate.education}</p>
                        </div>
                      )}
                      {candidate.employment_status && (
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">סטטוס תעסוקתי</p>
                          <p className="font-medium text-sm sm:text-base">{candidate.employment_status}</p>
                        </div>
                      )}
                      {candidate.employment_status === "שכיר" && candidate.workplace && (
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">מקום עבודה</p>
                          <p className="font-medium text-sm sm:text-base">{candidate.workplace}</p>
                        </div>
                      )}
                      {candidate.date_of_birth && (
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">תאריך לידה</p>
                          <p className="font-medium text-sm sm:text-base">
                            {new Date(candidate.date_of_birth).toLocaleDateString('he-IL')}
                          </p>
                        </div>
                      )}
                      {candidate.was_officer !== null && candidate.was_officer !== undefined && (
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">אם היה קצין בזמן השירות הצבאי</p>
                          <p className="font-medium text-sm sm:text-base">{candidate.was_officer ? "כן" : "לא"}</p>
                        </div>
                      )}
                      {candidate.over_100_reserve_days !== null && candidate.over_100_reserve_days !== undefined && (
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">אם עשה מעל 100 ימי מילואים</p>
                          <p className="font-medium text-sm sm:text-base">{candidate.over_100_reserve_days ? "כן" : "לא"}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )
      })}
    </div>
  )
}
