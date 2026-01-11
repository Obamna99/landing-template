"use client"

import { useState, useRef } from "react"
import { getUploadUrl, saveDocumentMetadata } from "@/app/actions/candidate"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Upload, File, FileText, Loader2, CheckCircle2, Clock, XCircle, X } from "lucide-react"
import { createLogger } from "@/lib/logger"

const logger = createLogger("DocumentUpload")

interface DocumentUploadProps {
  candidateId: number
  documents: any[]
}

const documentTypes = [
  { value: "drivers_license", label: "רשיון נהיגה" },
  { value: "passport", label: "דרכון" },
  { value: "id_card", label: "תעודת זהות" },
  { value: "bank_account_confirmation", label: "אישור ניהול חשבון בנק באנגלית" },
]

export function DocumentUpload({ candidateId, documents }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [documentType, setDocumentType] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      
      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFilePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setFilePreview(null)
      }
    }
  }

  function handleRemoveFile() {
    setSelectedFile(null)
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()

    if (!documentType) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "יש לבחור סוג מסמך",
      })
      return
    }

    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "יש לבחור קובץ",
      })
      return
    }

    setUploading(true)

    try {
      // Step 1: Get presigned POST URL from server
      logger.upload("Requesting upload URL", {
        candidateId,
        documentType,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
      })

      const urlResult = await getUploadUrl(
        candidateId.toString(),
        documentType,
        selectedFile.name,
        selectedFile.type,
        selectedFile.size
      )

      logger.debug("Upload URL result received", {
        hasUrl: !!urlResult.uploadUrl,
        hasFields: !!urlResult.fields,
        hasObjectKey: !!urlResult.objectKey,
        hasError: !!urlResult.error,
      })

      if (urlResult?.error) {
        toast({
          variant: "destructive",
          title: "שגיאה",
          description: urlResult.error,
        })
        setUploading(false)
        return
      }

      if (!urlResult.uploadUrl || !urlResult.objectKey) {
        logger.error("Invalid upload URL result", undefined, {
          candidateId,
          documentType,
          fileName: selectedFile.name,
          result: urlResult,
        })
        toast({
          variant: "destructive",
          title: "שגיאה",
          description: "שגיאה ביצירת קישור העלאה",
        })
        setUploading(false)
        return
      }

      // Step 2: Upload directly to R2 from client
      const uploadMethod = urlResult.method || (urlResult.fields && Object.keys(urlResult.fields).length > 0 ? "POST" : "PUT")
      
      logger.upload("Uploading to R2", {
        candidateId,
        documentType,
        fileName: selectedFile.name,
        objectKey: urlResult.objectKey,
        method: uploadMethod,
      })

      let uploadResponse: Response

      if (uploadMethod === "PUT") {
        // Use PUT method - simpler, more reliable for R2
        uploadResponse = await fetch(urlResult.uploadUrl, {
          method: "PUT",
          body: selectedFile,
          headers: {
            "Content-Type": selectedFile.type,
          },
        })
      } else {
        // Use POST method with FormData (presigned POST)
        const formData = new FormData()
        
        // Add all presigned fields first (order matters for S3/R2)
        if (urlResult.fields) {
          Object.entries(urlResult.fields).forEach(([key, value]) => {
            formData.append(key, value)
          })
        }
        
        // Add the file - the field name doesn't matter for presigned POST
        formData.append("file", selectedFile)

        logger.debug("FormData prepared for upload", {
          candidateId,
          documentType,
          fileName: selectedFile.name,
          fieldCount: Array.from(formData.entries()).length,
        })

        uploadResponse = await fetch(urlResult.uploadUrl, {
          method: "POST",
          body: formData,
          // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
        })
      }

      logger.debug("Upload response received", {
        candidateId,
        documentType,
        fileName: selectedFile.name,
        ok: uploadResponse.ok,
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
      })

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        logger.error("Upload failed", new Error(errorText), {
          candidateId,
          documentType,
          fileName: selectedFile.name,
          objectKey: urlResult.objectKey,
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
        })
        throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`)
      }

      logger.success("File uploaded to R2 successfully", {
        candidateId,
        documentType,
        fileName: selectedFile.name,
        objectKey: urlResult.objectKey,
      })

      // Step 3: Save metadata to database
      const saveResult = await saveDocumentMetadata(
        candidateId.toString(),
        documentType,
        selectedFile.name,
        urlResult.objectKey,
        selectedFile.size
      )

      if (saveResult?.error) {
        toast({
          variant: "destructive",
          title: "שגיאה",
          description: saveResult.error,
        })
      } else {
        toast({
          title: "הצלחה",
          description: "המסמך הועלה בהצלחה",
        })
        logger.success("Document upload completed successfully", {
          candidateId,
          documentType,
          fileName: selectedFile.name,
        })

        setDocumentType("")
        setSelectedFile(null)
        setFilePreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    } catch (error) {
      logger.error("Upload error", error, {
        candidateId,
        documentType,
        fileName: selectedFile?.name,
      })
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "שגיאה בהעלאת המסמך",
      })
    } finally {
      setUploading(false)
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600">אושר</Badge>
      case "rejected":
        return <Badge variant="destructive">נדחה</Badge>
      default:
        return <Badge variant="secondary">ממתין לאישור</Badge>
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Upload Form */}
      <Card className="border-2">
        <CardHeader className="px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <CardTitle className="text-xl sm:text-2xl text-right">העלאת מסמכים</CardTitle>
          <CardDescription className="text-sm sm:text-base text-right">העלה את המסמכים הנדרשים לתהליך הקליטה</CardDescription>
        </CardHeader>
        <form onSubmit={handleUpload}>
          <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-2">
              <Label htmlFor="documentType" className="text-sm sm:text-base text-right block">
                סוג מסמך
              </Label>
              <div className="flex justify-end">
                <Select value={documentType} onValueChange={setDocumentType} disabled={uploading}>
                  <SelectTrigger size="sm" className="h-9 text-sm touch-manipulation w-fit cursor-pointer text-right [&>svg]:order-last" dir="rtl">
                    <SelectValue placeholder="בחר סוג מסמך" />
                  </SelectTrigger>
                <SelectContent dir="rtl">
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-sm sm:text-base text-right pl-8 pr-2 [&>span]:left-2 [&>span]:right-auto">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file" className="text-sm sm:text-base text-right block">
                קובץ
              </Label>
              {/* Always render the file input, but keep it hidden */}
              <input
                ref={fileInputRef}
                type="file"
                id="file"
                name="file"
                required
                disabled={uploading}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              {selectedFile ? (
                <div className="border-2 rounded-lg p-4 sm:p-6">
                  <div className="flex items-start gap-4">
                    {filePreview ? (
                      <div className="flex-shrink-0">
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 bg-muted flex items-center justify-center">
                        <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 text-right">
                      <p className="font-semibold text-sm sm:text-base truncate">{selectedFile.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {formatFileSize(selectedFile.size)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedFile.type || "סוג קובץ לא ידוע"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      disabled={uploading}
                      className="flex-shrink-0 p-2 hover:bg-muted rounded-lg transition-colors touch-manipulation"
                      aria-label="הסר קובץ"
                    >
                      <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <label
                      htmlFor="file"
                      className="cursor-pointer touch-manipulation text-sm sm:text-base text-primary hover:underline inline-block"
                    >
                      בחר קובץ אחר
                    </label>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-6 sm:p-8 text-center hover:border-primary/50 transition-colors">
                  <label htmlFor="file" className="cursor-pointer touch-manipulation">
                    <Upload className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                    <p className="font-medium mb-2 text-sm sm:text-base">לחץ לבחירת קובץ</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">PDF, DOC, DOCX, JPG, PNG - עד 10MB</p>
                  </label>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold touch-manipulation" disabled={uploading || !documentType || !selectedFile}>
              {uploading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  מעלה...
                </>
              ) : (
                <>
                  <Upload className="ml-2 h-5 w-5" />
                  העלה מסמך
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Card>

      {/* Documents List */}
      <Card className="border-2">
        <CardHeader className="px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <CardTitle className="text-xl sm:text-2xl text-right">המסמכים שלי</CardTitle>
          <CardDescription className="text-sm sm:text-base text-right">רשימת כל המסמכים שהעלית</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
          {documents.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <FileText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50" />
              <p className="text-base sm:text-lg">עדיין לא העלית מסמכים</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border-2">
                  <File className="h-8 w-8 sm:h-10 sm:w-10 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate text-right">{doc.file_name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground text-right">
                      {documentTypes.find((t) => t.value === doc.document_type)?.label || doc.document_type}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground text-right">
                      הועלה ב-{new Date(doc.uploaded_at).toLocaleDateString("he-IL")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getStatusIcon(doc.status)}
                    {getStatusBadge(doc.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
