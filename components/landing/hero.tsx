"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

type Blob = {
  id: number
  size: number
  x: number
  y: number
  duration: number
  delay: number
}

export function Hero() {
  const router = useRouter()
  const [floatingBlobs, setFloatingBlobs] = useState<Blob[]>([])

  // Generate blobs only on client to avoid hydration mismatch
  useEffect(() => {
    setFloatingBlobs(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        size: Math.random() * 200 + 100,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 20,
        delay: Math.random() * 5,
      }))
    )
  }, [])

  const handleSignIn = () => {
    router.push("/login")
  }

  const handleSignUp = () => {
    router.push("/signup")
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-50 via-orange-50/30 to-neutral-100 pt-20">
      {/* Animated Background Blobs */}
      {floatingBlobs.length > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingBlobs.map((blob) => (
            <motion.div
              key={blob.id}
              className="absolute rounded-full blur-3xl opacity-[0.03]"
              style={{
                width: blob.size,
                height: blob.size,
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                left: `${blob.x}%`,
                top: `${blob.y}%`,
              }}
              animate={{
                x: [0, 50, -30, 0],
                y: [0, -40, 30, 0],
              }}
              transition={{
                duration: blob.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: blob.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Subtle Noise Overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6 leading-tight tracking-tight">
            מודלים חכמים לאיקומרס
            <br />
            <span className="text-orange-500">שותפות אסטרטגית</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 font-light max-w-2xl mx-auto">
            בונים את העתיד של המסחר הדיגיטלי יחד
          </p>
        </motion.div>

        {/* Premium Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-200/50 p-8 md:p-12 mb-12"
        >
          <p
            className="text-neutral-700 text-lg md:text-xl leading-relaxed whitespace-pre-line"
            dir="rtl"
          >
            אנחנו בונים מודלים של פרדיקציה לעולם האיקומרס ומחפשים אותך כשותף לדרך, על מנת שהמדגמים שלנו יהיו בלתי מוטים סטטטיסטית אנחנו מייצרים הפרדה מלאה בין החנויות עליהם אנחנו מריצים את הבדיקות שלנו. כאן אתה נכנס לתמונה :)
            <br />
            <br />
            תמורת האפשרות להקים חנות על שמך אנחנו נשמח להציע לך שובר BuyMe בסך 230 ש"ח + אחוזים מההכנסות שאנחנו מייצרים. כל הבירוקרטיה מקצה לקצה - עלינו.
            <br />
            <br />
            מזמינים אותך לצפות בסרטון ולקבל מידע נוסף:
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            onClick={handleSignIn}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            התחבר
          </motion.button>
          <motion.button
            onClick={handleSignUp}
            className="bg-white hover:bg-neutral-50 text-neutral-900 border-2 border-neutral-200 hover:border-neutral-300 px-8 py-4 rounded-2xl font-semibold text-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2 w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            הירשם
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

