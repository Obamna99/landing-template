"use client"

import { useState } from "react"
import { updatePersonalInfo } from "@/app/actions/candidate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save } from "lucide-react"
import { CitizenshipSelect } from "@/components/candidate/citizenship-select"
import { HebrewDatePicker } from "@/components/ui/hebrew-date-picker"

interface Citizenship {
  type: "standard" | "custom"
  label: string
  code?: string
}

interface PersonalInfoFormProps {
  candidate: any
}

export function PersonalInfoForm({ candidate }: PersonalInfoFormProps) {
  const [loading, setLoading] = useState(false)
  const [maritalStatus, setMaritalStatus] = useState<string>(candidate.marital_status || "")
  const [education, setEducation] = useState<string>(candidate.education || "")
  const [employmentStatus, setEmploymentStatus] = useState<string>(candidate.employment_status || "")
  const [dateOfBirth, setDateOfBirth] = useState<string>(() => {
    if (candidate.date_of_birth) {
      const date = new Date(candidate.date_of_birth)
      return date.toISOString().split('T')[0]
    }
    return ""
  })
  const [wasOfficer, setWasOfficer] = useState<string>(candidate.was_officer === true ? "yes" : candidate.was_officer === false ? "no" : "")
  const [over100ReserveDays, setOver100ReserveDays] = useState<string>(candidate.over_100_reserve_days === true ? "yes" : candidate.over_100_reserve_days === false ? "no" : "")
  const [citizenship, setCitizenship] = useState<Citizenship[]>(() => {
    // Initialize with default value or from candidate data
    try {
      if (candidate.citizenship) {
        // Handle both parsed JSON object and string
        const parsed = typeof candidate.citizenship === 'string' 
          ? JSON.parse(candidate.citizenship) 
          : candidate.citizenship
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as Citizenship[]
        }
      }
    } catch (e) {
      // If parsing fails, fall back to default
      console.warn("Failed to parse citizenship:", e)
    }
    // Default: ישראלית (Israel)
    return [{ type: "standard", label: "ישראלית", code: "IL" }]
  })
  const [idNumberError, setIdNumberError] = useState<string>("")
  const [phoneError, setPhoneError] = useState<string>("")
  const [addressError, setAddressError] = useState<string>("")
  const [cityError, setCityError] = useState<string>("")
  const [zipCodeError, setZipCodeError] = useState<string>("")
  const [citizenshipError, setCitizenshipError] = useState<string>("")
  const [maritalStatusError, setMaritalStatusError] = useState<string>("")
  const [educationError, setEducationError] = useState<string>("")
  const [employmentStatusError, setEmploymentStatusError] = useState<string>("")
  const [workplaceError, setWorkplaceError] = useState<string>("")
  const [dateOfBirthError, setDateOfBirthError] = useState<string>("")
  const [wasOfficerError, setWasOfficerError] = useState<string>("")
  const [over100ReserveDaysError, setOver100ReserveDaysError] = useState<string>("")
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    
    // Read values from form (uncontrolled inputs)
    const idNumber = (formData.get("idNumber") as string)?.trim() || ""
    const phone = (formData.get("phone") as string)?.trim() || ""
    const address = (formData.get("address") as string)?.trim() || ""
    const city = (formData.get("city") as string)?.trim() || ""
    const zipCode = (formData.get("zipCode") as string)?.trim() || ""
    const workplace = (formData.get("workplace") as string)?.trim() || ""
    
    // Validate required fields
    let hasErrors = false
    
    if (idNumber === "") {
      setIdNumberError("נא להזין מספר תעודת זהות")
      hasErrors = true
    } else {
      setIdNumberError("")
    }
    
    if (phone === "") {
      setPhoneError("נא להזין מספר טלפון")
      hasErrors = true
    } else {
      setPhoneError("")
    }
    
    if (address === "") {
      setAddressError("נא להזין כתובת")
      hasErrors = true
    } else {
      setAddressError("")
    }
    
    if (city === "") {
      setCityError("נא להזין עיר")
      hasErrors = true
    } else {
      setCityError("")
    }
    
    if (zipCode === "") {
      setZipCodeError("נא להזין מיקוד")
      hasErrors = true
    } else {
      setZipCodeError("")
    }
    
    if (maritalStatus.trim() === "") {
      setMaritalStatusError("נא לבחור סטטוס משפחתי")
      hasErrors = true
    } else {
      setMaritalStatusError("")
    }
    
    if (education.trim() === "") {
      setEducationError("נא לבחור השכלה")
      hasErrors = true
    } else {
      setEducationError("")
    }
    
    // Validate citizenship
    if (citizenship.length === 0) {
      setCitizenshipError("נא לבחור לפחות אזרחות אחת")
      hasErrors = true
    } else {
      setCitizenshipError("")
    }
    
    if (employmentStatus.trim() === "") {
      setEmploymentStatusError("נא לבחור סטטוס תעסוקתי")
      hasErrors = true
    } else {
      setEmploymentStatusError("")
    }
    
    if (employmentStatus === "שכיר" && workplace === "") {
      setWorkplaceError("נא להזין מקום עבודה")
      hasErrors = true
    } else {
      setWorkplaceError("")
    }
    
    if (dateOfBirth.trim() === "") {
      setDateOfBirthError("נא להזין תאריך לידה")
      hasErrors = true
    } else {
      setDateOfBirthError("")
    }
    
    if (wasOfficer.trim() === "") {
      setWasOfficerError("נא לבחור אם שירתת כקצין/ה")
      hasErrors = true
    } else {
      setWasOfficerError("")
    }
    
    if (over100ReserveDays.trim() === "") {
      setOver100ReserveDaysError("נא לבחור אם עשית מעל 100 ימי מילואים")
      hasErrors = true
    } else {
      setOver100ReserveDaysError("")
    }
    
    if (hasErrors) {
      return
    }

    setLoading(true)

    // Add controlled values
    formData.set("idNumber", idNumber)
    formData.set("phone", phone)
    formData.set("address", address)
    formData.set("city", city)
    formData.set("zipCode", zipCode)
    formData.set("maritalStatus", maritalStatus)
    formData.set("education", education)
    formData.set("employmentStatus", employmentStatus)
    formData.set("workplace", workplace)
    formData.set("dateOfBirth", dateOfBirth)
    formData.set("wasOfficer", wasOfficer)
    formData.set("over100ReserveDays", over100ReserveDays)
    formData.set("citizenship", JSON.stringify(citizenship))

    const result = await updatePersonalInfo(formData)

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: result.error,
      })
    } else {
      toast({
        title: "הצלחה",
        description: "הפרטים האישיים עודכנו בהצלחה",
      })
    }

    setLoading(false)
  }

  return (
    <Card className="border-2">
      <CardHeader className="px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <CardTitle className="text-xl sm:text-2xl text-right">פרטים אישיים</CardTitle>
        <CardDescription className="text-sm sm:text-base text-right">עדכן את הפרטים האישיים שלך</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="candidateId" value={candidate.id} />
        <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6 pb-4 sm:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="idNumber" className="text-sm sm:text-base text-right block">
                מספר תעודת זהות <span className="text-destructive">*</span>
              </Label>
              <Input
                id="idNumber"
                name="idNumber"
                defaultValue={candidate.id_number || ""}
                onInvalid={(e) => {
                  const target = e.target as HTMLInputElement
                  if (target.validity.tooShort || target.validity.tooLong) {
                    target.setCustomValidity("מספר תעודת זהות חייב להכיל בדיוק 9 ספרות")
                  } else if (target.validity.patternMismatch) {
                    target.setCustomValidity("מספר תעודת זהות יכול להכיל רק ספרות")
                  } else {
                    target.setCustomValidity("")
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement
                  target.setCustomValidity("")
                }}
                disabled={loading}
                className="h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
                dir="rtl"
                minLength={9}
                maxLength={9}
                inputMode="numeric"
                pattern="[0-9]*"
                aria-invalid={idNumberError !== ""}
              />
              {idNumberError && (
                <p className="text-xs sm:text-sm text-destructive text-right">{idNumberError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm sm:text-base text-right block">
                מספר טלפון <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                inputMode="tel"
                type="tel"
                defaultValue={candidate.phone || ""}
                onInvalid={(e) => {
                  const target = e.target as HTMLInputElement
                  if (target.validity.tooShort || target.validity.tooLong) {
                    target.setCustomValidity("מספר הטלפון חייב להכיל בדיוק 10 ספרות")
                  } else if (target.validity.patternMismatch) {
                    target.setCustomValidity("מספר הטלפון יכול להכיל רק ספרות")
                  } else {
                    target.setCustomValidity("")
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement
                  target.setCustomValidity("")
                }}
                disabled={loading}
                className="h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
                dir="rtl"
                minLength={10}
                maxLength={10}
                pattern="[0-9]*"
                aria-invalid={phoneError !== ""}
              />
              {phoneError && (
                <p className="text-xs sm:text-sm text-destructive text-right">{phoneError}</p>
              )}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address" className="text-sm sm:text-base text-right block">
                כתובת <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                defaultValue={candidate.address || ""}
                disabled={loading}
                className="h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
                dir="rtl"
                aria-invalid={addressError !== ""}
              />
              {addressError && (
                <p className="text-xs sm:text-sm text-destructive text-right">{addressError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm sm:text-base text-right block">
                עיר <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                name="city"
                defaultValue={candidate.city || ""}
                onInvalid={(e) => {
                  const target = e.target as HTMLInputElement
                  if (target.validity.patternMismatch) {
                    target.setCustomValidity("שם העיר יכול להכיל רק אותיות")
                  } else {
                    target.setCustomValidity("")
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement
                  target.setCustomValidity("")
                }}
                disabled={loading}
                className="h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
                dir="rtl"
                pattern="[א-תa-zA-Z\s]*"
                aria-invalid={cityError !== ""}
              />
              {cityError && (
                <p className="text-xs sm:text-sm text-destructive text-right">{cityError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm sm:text-base text-right block">
                מיקוד <span className="text-destructive">*</span>
              </Label>
              <Input
                id="zipCode"
                name="zipCode"
                defaultValue={candidate.zip_code || ""}
                onInvalid={(e) => {
                  const target = e.target as HTMLInputElement
                  if (target.validity.tooShort || target.validity.tooLong) {
                    target.setCustomValidity("מיקוד חייב להכיל בדיוק 7 ספרות")
                  } else if (target.validity.patternMismatch) {
                    target.setCustomValidity("מיקוד יכול להכיל רק ספרות")
                  } else {
                    target.setCustomValidity("")
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement
                  target.setCustomValidity("")
                }}
                disabled={loading}
                className="h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
                dir="rtl"
                minLength={7}
                maxLength={7}
                inputMode="numeric"
                pattern="[0-9]*"
                aria-invalid={zipCodeError !== ""}
              />
              {zipCodeError && (
                <p className="text-xs sm:text-sm text-destructive text-right">{zipCodeError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maritalStatus" className="text-sm sm:text-base text-right block">
                סטטוס משפחתי <span className="text-destructive">*</span>
              </Label>
              <Select
                value={maritalStatus}
                onValueChange={(value) => {
                  setMaritalStatus(value)
                  if (value.trim() !== "") {
                    setMaritalStatusError("")
                  }
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-full h-11 sm:h-12 text-sm sm:text-base touch-manipulation" dir="rtl" aria-invalid={maritalStatusError !== ""}>
                  <SelectValue placeholder="בחר סטטוס משפחתי" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="נשוי">נשוי</SelectItem>
                  <SelectItem value="גרוש">גרוש</SelectItem>
                  <SelectItem value="רווק">רווק</SelectItem>
                  <SelectItem value="אלמן">אלמן</SelectItem>
                  <SelectItem value="אחר">אחר</SelectItem>
                </SelectContent>
              </Select>
              {maritalStatusError && (
                <p className="text-xs sm:text-sm text-destructive text-right">{maritalStatusError}</p>
              )}
              <input type="hidden" name="maritalStatus" value={maritalStatus} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education" className="text-sm sm:text-base text-right block">
                השכלה <span className="text-destructive">*</span>
              </Label>
              <Select
                value={education}
                onValueChange={(value) => {
                  setEducation(value)
                  if (value.trim() !== "") {
                    setEducationError("")
                  }
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-full h-11 sm:h-12 text-sm sm:text-base touch-manipulation" dir="rtl" aria-invalid={educationError !== ""}>
                  <SelectValue placeholder="בחר השכלה" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="תיכונית חלקית">תיכונית חלקית</SelectItem>
                  <SelectItem value="תיכונית מלאה (בגרות מלאה)">תיכונית מלאה (בגרות מלאה)</SelectItem>
                  <SelectItem value="תעודת מקצוע">תעודת מקצוע</SelectItem>
                  <SelectItem value="לימודים על־תיכוניים לא אקדמיים">לימודים על־תיכוניים לא אקדמיים</SelectItem>
                  <SelectItem value="תואר ראשון">תואר ראשון</SelectItem>
                  <SelectItem value="תואר שני">תואר שני</SelectItem>
                  <SelectItem value="תואר שלישי">תואר שלישי</SelectItem>
                  <SelectItem value="אחר">אחר</SelectItem>
                </SelectContent>
              </Select>
              {educationError && (
                <p className="text-xs sm:text-sm text-destructive text-right">{educationError}</p>
              )}
              <input type="hidden" name="education" value={education} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="citizenship" className="text-sm sm:text-base text-right block">
                אזרחות <span className="text-destructive">*</span>
              </Label>
              <CitizenshipSelect
                value={citizenship}
                onChange={(value) => {
                  setCitizenship(value)
                  if (value.length > 0) {
                    setCitizenshipError("")
                  }
                }}
                error={citizenshipError}
                disabled={loading}
              />
              <p className="text-xs sm:text-sm text-muted-foreground text-right">
                ניתן לבחור יותר מאזרחות אחת. כפי שמופיע במסמכים הרשמיים.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentStatus" className="text-sm sm:text-base text-right block">
                סטטוס תעסוקתי <span className="text-destructive">*</span>
              </Label>
              <Select
                value={employmentStatus}
                onValueChange={(value) => {
                  setEmploymentStatus(value)
                  if (value.trim() !== "") {
                    setEmploymentStatusError("")
                  }
                  if (value !== "שכיר") {
                    setWorkplaceError("")
                  }
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-full h-11 sm:h-12 text-sm sm:text-base touch-manipulation" dir="rtl" aria-invalid={employmentStatusError !== ""}>
                  <SelectValue placeholder="בחר סטטוס תעסוקתי" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="שכיר">שכיר</SelectItem>
                  <SelectItem value="עצמאי / בעל חברה">עצמאי / בעל חברה</SelectItem>
                  <SelectItem value="סטודנט">סטודנט</SelectItem>
                  <SelectItem value="מובטל">מובטל</SelectItem>
                </SelectContent>
              </Select>
              {employmentStatusError && (
                <p className="text-xs sm:text-sm text-destructive text-right">{employmentStatusError}</p>
              )}
              <input type="hidden" name="employmentStatus" value={employmentStatus} />
            </div>
            {employmentStatus === "שכיר" && (
              <div className="space-y-2">
                <Label htmlFor="workplace" className="text-sm sm:text-base text-right block">
                  מקום עבודה <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="workplace"
                  name="workplace"
                  key={employmentStatus}
                  defaultValue={employmentStatus === "שכיר" ? candidate.workplace || "" : ""}
                  disabled={loading}
                  className="h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
                  dir="rtl"
                  placeholder="הזן מקום עבודה"
                  aria-invalid={workplaceError !== ""}
                />
                {workplaceError && (
                  <p className="text-xs sm:text-sm text-destructive text-right">{workplaceError}</p>
                )}
              </div>
            )}
            <HebrewDatePicker
              id="dateOfBirth"
              label="תאריך לידה"
              value={dateOfBirth}
              onChange={(value) => {
                setDateOfBirth(value)
                if (value.trim() !== "") {
                  setDateOfBirthError("")
                }
              }}
              disabled={loading}
              error={dateOfBirthError}
              required
            />
            <input type="hidden" name="dateOfBirth" value={dateOfBirth} />
            <div className="space-y-2">
              <Label htmlFor="wasOfficer" className="text-sm sm:text-base text-right block">
              ?שירתת כקצין/ה בזמן השירות הצבאי<span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className={`flex-1 h-11 sm:h-12 text-sm sm:text-base touch-manipulation ${
                    wasOfficer === "yes" 
                      ? "bg-[#FFD4A3] hover:bg-[#FFC88A] text-foreground border-[#FFD4A3]" 
                      : "bg-background text-foreground"
                  }`}
                  onClick={() => {
                    setWasOfficer("yes")
                    setWasOfficerError("")
                  }}
                  disabled={loading}
                  aria-invalid={wasOfficerError !== ""}
                >
                  כן
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`flex-1 h-11 sm:h-12 text-sm sm:text-base touch-manipulation ${
                    wasOfficer === "no" 
                      ? "bg-[#FFD4A3] hover:bg-[#FFC88A] text-foreground border-[#FFD4A3]" 
                      : "bg-background text-foreground"
                  }`}
                  onClick={() => {
                    setWasOfficer("no")
                    setWasOfficerError("")
                  }}
                  disabled={loading}
                  aria-invalid={wasOfficerError !== ""}
                >
                  לא
                </Button>
              </div>
              {wasOfficerError && (
                <p className="text-xs sm:text-sm text-destructive text-right">{wasOfficerError}</p>
              )}
              <input type="hidden" name="wasOfficer" value={wasOfficer} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="over100ReserveDays" className="text-sm sm:text-base text-right block">
              ?האם עשית מעל 100 ימי מילואים <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className={`flex-1 h-11 sm:h-12 text-sm sm:text-base touch-manipulation ${
                    over100ReserveDays === "yes" 
                      ? "bg-[#FFD4A3] hover:bg-[#FFC88A] text-foreground border-[#FFD4A3]" 
                      : "bg-background text-foreground"
                  }`}
                  onClick={() => {
                    setOver100ReserveDays("yes")
                    setOver100ReserveDaysError("")
                  }}
                  disabled={loading}
                  aria-invalid={over100ReserveDaysError !== ""}
                >
                  כן
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`flex-1 h-11 sm:h-12 text-sm sm:text-base touch-manipulation ${
                    over100ReserveDays === "no" 
                      ? "bg-[#FFD4A3] hover:bg-[#FFC88A] text-foreground border-[#FFD4A3]" 
                      : "bg-background text-foreground"
                  }`}
                  onClick={() => {
                    setOver100ReserveDays("no")
                    setOver100ReserveDaysError("")
                  }}
                  disabled={loading}
                  aria-invalid={over100ReserveDaysError !== ""}
                >
                  לא
                </Button>
              </div>
              {over100ReserveDaysError && (
                <p className="text-xs sm:text-sm text-destructive text-right">{over100ReserveDaysError}</p>
              )}
              <input type="hidden" name="over100ReserveDays" value={over100ReserveDays} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="linkedinUsername" className="text-sm sm:text-base text-right block">
                LinkedIn (אופציונלי)
              </Label>
              <Input
                id="linkedinUsername"
                name="linkedinUsername"
                defaultValue={candidate.linkedin_username || ""}
                disabled={loading}
                className="h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
                dir="rtl"
              />
            </div>
          </div>

          <div className="pt-2 sm:pt-4">
            <Button type="submit" className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold touch-manipulation" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  שומר...
                </>
              ) : (
                <>
                  <Save className="ml-2 h-5 w-5" />
                  שמור שינויים
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
