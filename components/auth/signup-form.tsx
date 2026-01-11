"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { signUp } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Loader2 } from "lucide-react"

export function SignupForm() {
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formDataObj = new FormData()
    formDataObj.append("firstName", formData.firstName)
    formDataObj.append("lastName", formData.lastName)
    formDataObj.append("email", formData.email)
    formDataObj.append("password", formData.password)

    const result = await signUp(formDataObj)

    if (result?.error) {
      setError(result.error)
      // Clear only the password field on error
      setFormData((prev) => ({ ...prev, password: "" }))
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Card className="border-2 shadow-2xl backdrop-blur-sm bg-card/95 w-full">
        <CardHeader className="space-y-3 text-center px-4 sm:px-6 pt-6 pb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <UserPlus className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
              הרשמה למערכת
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">צור חשבון חדש כדי להתחיל את תהליך הקליטה</CardDescription>
          </motion.div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 sm:space-y-5 px-4 sm:px-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="text-sm">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm sm:text-base font-medium">
                  שם פרטי
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  required
                  disabled={loading}
                  className="h-11 sm:h-12 text-base touch-manipulation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm sm:text-base font-medium">
                  שם משפחה
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  required
                  disabled={loading}
                  className="h-11 sm:h-12 text-base touch-manipulation"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-sm sm:text-base font-medium">
                דואר אלקטרוני
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                disabled={loading}
                className="h-11 sm:h-12 text-base touch-manipulation"
                dir="rtl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="space-y-2"
            >
              <Label htmlFor="password" className="text-sm sm:text-base font-medium">
                סיסמה
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="לפחות 8 תווים"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                required
                disabled={loading}
                className="h-11 sm:h-12 text-base touch-manipulation"
                dir="rtl"
              />
            </motion.div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:gap-4 px-4 sm:px-6 pb-6 pt-0 mt-4 sm:mt-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
              <Button
                type="submit"
                className="w-full h-11 sm:h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-colors touch-manipulation"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    יוצר חשבון...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    הרשם
                  </>
                )}
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
              className="text-center text-xs sm:text-sm text-muted-foreground"
            >
              כבר יש לך חשבון?{" "}
              <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                התחבר
              </Link>
            </motion.div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
