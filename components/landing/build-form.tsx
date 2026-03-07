"use client"

import { motion } from "framer-motion"
import { LeadForm } from "@/components/landing/lead-form"
import { BuildLogout } from "@/components/landing/build-logout"

const titleVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] } },
}

export function BuildForm() {
  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex justify-end mb-4 sm:mb-6">
        <BuildLogout />
      </div>
      <motion.div
        className="text-center mb-8 sm:mb-10"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
        }}
      >
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2"
          variants={titleVariants}
        >
          בנה את <span className="gradient-text">האתר שלך</span>
        </motion.h1>
        <motion.p
          className="text-slate-600 text-lg max-w-2xl mx-auto"
          variants={titleVariants}
        >
          מלאו את כל השלבים – פרטים, תוכן לכל אזור באתר, ותצוגה מקדימה תהיה זמינה מיד.
        </motion.p>
      </motion.div>
      <LeadForm buildPage />
    </motion.div>
  )
}
