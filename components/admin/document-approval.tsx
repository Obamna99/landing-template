"use client"

import { useState } from "react"
import { approveDocument, rejectDocument, getDocumentDownloadUrl } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { FileText, Check, X, Download, Loader2 } from "lucide-react"

interface DocumentApprovalProps {
  documents: any[]
}

const documentTypes = [
  { value: "drivers_license", label: "רשיון נהיגה" },
  { value: "passport", label: "דרכון" },
  { value: "id_card", label: "תעודת זהות" },
  { value: "bank_account_confirmation", label: "אישור ניהול חשבון בנק באנגלית" },
]

export function DocumentApproval({ documents }: DocumentApprovalProps) {
  const { toast } = useToast()
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set())

  async function handleApprove(documentId: number) {
    const result = await approveDocument(documentId)

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: result.error,
      })
    } else {
      toast({
        title: "הצלחה",
        description: "המסמך אושר בהצלחה",
      })
    }
  }

  async function handleReject(documentId: number) {
    const result = await rejectDocument(documentId)

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: result.error,
      })
    } else {
      toast({
        title: "הצלחה",
        description: "המסמך נדחה",
      })
    }
  }

  async function handleDownload(documentId: number) {
    setDownloadingIds((prev) => new Set(prev).add(documentId))
    
    try {
      const result = await getDocumentDownloadUrl(documentId)

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "שגיאה",
          description: result.error,
        })
      } else if (result?.url) {
        // Open the presigned URL in a new tab to download
        window.open(result.url, "_blank")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "שגיאה בהורדת המסמך",
      })
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev)
        next.delete(documentId)
        return next
      })
    }
  }

  return (
    <Card className="border-2">
      <CardHeader className="px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <CardTitle className="text-xl sm:text-2xl">מסמכים ממתינים לאישור</CardTitle>
        <CardDescription className="text-sm sm:text-base">אשר או דחה מסמכים שהועלו על ידי מועמדים</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
        {documents.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-muted-foreground">
            <FileText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50" />
            <p className="text-base sm:text-lg">אין מסמכים ממתינים לאישור</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="p-3 sm:p-4 rounded-lg border-2">
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base sm:text-lg truncate">{doc.file_name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                        {documentTypes.find((t) => t.value === doc.document_type)?.label || doc.document_type}
                      </p>
                      <p className="text-xs sm:text-sm">
                        <span className="font-medium">מועמד:</span> {doc.first_name} {doc.last_name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        הועלה ב-{new Date(doc.uploaded_at).toLocaleDateString("he-IL")}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs sm:text-sm flex-shrink-0">ממתין לאישור</Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    variant="default"
                    className="flex-1 sm:flex-1 h-10 sm:h-11 text-sm sm:text-base touch-manipulation bg-[#FFD4A3] hover:bg-[#FFC080] text-gray-900"
                    onClick={() => handleApprove(doc.id)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    אשר
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 sm:flex-1 h-10 sm:h-11 text-sm sm:text-base touch-manipulation bg-gray-200 hover:bg-gray-300 text-gray-700 border-gray-300" 
                    onClick={() => handleReject(doc.id)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    דחה
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 sm:flex-initial h-10 sm:h-11 text-sm sm:text-base touch-manipulation"
                    onClick={() => handleDownload(doc.id)}
                    disabled={downloadingIds.has(doc.id) || !doc.object_id}
                  >
                    {downloadingIds.has(doc.id) ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">הורד</span>
                    <span className="sm:hidden">הורד</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
