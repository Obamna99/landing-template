import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { LoginForm } from "@/components/auth/login-form"
import { ArrowRight } from "lucide-react"

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user) {
    if (user.role === "admin") {
      redirect("/admin/dashboard")
    } else {
      redirect("/candidate/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-3 sm:p-4 relative">
      <Link
        href="/"
        className="absolute top-6 right-6 flex items-center gap-2.5 text-neutral-700 hover:text-neutral-900 bg-white/80 backdrop-blur-sm border border-neutral-200/50 shadow-sm hover:shadow-md rounded-2xl px-5 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-2 hover:bg-white group"
      >
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
        <span className="font-semibold text-sm">חזרה לדף הבית</span>
      </Link>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
