"use server"

import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { prisma } from "@/lib/prisma"
import { hashPassword, verifyPassword, createSession, deleteSession } from "@/lib/auth"
import { createLogger } from "@/lib/logger"

const logger = createLogger("AuthActions")

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string

  if (!email || !password || !firstName || !lastName) {
    return { error: "כל השדות הם חובה" }
  }

  if (password.length < 8) {
    return { error: "הסיסמה חייבת להכיל לפחות 8 תווים" }
  }

  try {
    logger.auth("Signup attempt", { email })
    
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      logger.warn("Signup failed: user already exists", { email })
      return { error: 'משתמש עם כתובת דוא"ל זו כבר קיים' }
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const userResult = await sql`
      INSERT INTO users (email, password_hash, role)
      VALUES (${email}, ${passwordHash}, 'candidate')
      RETURNING id, email, role, created_at
    `

    const user = userResult[0]

    // Create candidate profile
    await sql`
      INSERT INTO candidates (user_id, first_name, last_name, status, progress)
      VALUES (${user.id}, ${firstName}, ${lastName}, 'pending', 0)
    `

    // Create default tasks for new candidate
    const defaultTasks = [
      { title: "מילוי פרטים אישיים", description: "השלמת טופס פרטים אישיים" },
      { title: "תזמון פגישת זום", description: "קביעת מועד לפגישת זום" },
      { title: "העלאת תמונת רישיון נהיגה", description: "העלאת צילום רישיון נהיגה" },
      { title: "חתימה והעלאת מסמכים משפטיים", description: "חתימה והעלאת מסמכים משפטיים נדרשים" },
    ]

    const candidateResult = await sql`
      SELECT id FROM candidates WHERE user_id = ${user.id}
    `

    const candidateId = candidateResult[0].id

    // Bulk insert all tasks using Prisma's createMany
    await prisma.task.createMany({
      data: defaultTasks.map(task => ({
        candidateId,
        title: task.title,
        description: task.description,
      })),
    })

    // Create session
    await createSession(user)

    logger.success("User signup completed successfully", {
      userId: user.id,
      email: user.email,
      candidateId: candidateResult[0].id,
      tasksCreated: defaultTasks.length,
    })

    redirect("/candidate/dashboard")
  } catch (error) {
    // Re-throw redirect errors (they're expected in Next.js)
    if (error instanceof Error && (error as any).digest?.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    logger.error("Signup error", error, { email })
    return { error: "שגיאה ביצירת חשבון. אנא נסה שוב." }
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "כל השדות הם חובה" }
  }

  try {
    logger.auth("Signin attempt", { email })
    
    // Find user
    const result = await sql`
      SELECT id, email, password_hash, role, created_at
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `

    if (result.length === 0) {
      logger.warn("Signin failed: user not found", { email })
      return { error: 'דוא"ל או סיסמה שגויים' }
    }

    const user = result[0]

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash as string)

    if (!isValidPassword) {
      logger.warn("Signin failed: invalid password", { email, userId: user.id as number })
      return { error: 'דוא"ל או סיסמה שגויים' }
    }

    // Create session
    await createSession({
      id: user.id as number,
      email: user.email as string,
      role: user.role as "admin" | "candidate",
      created_at: user.created_at as string,
    })

    logger.success("User signin completed successfully", {
      userId: user.id as number,
      email: user.email as string,
      role: user.role as "admin" | "candidate",
    })

    // Redirect based on role
    if (user.role === "admin") {
      redirect("/admin/dashboard")
    } else {
      redirect("/candidate/dashboard")
    }
  } catch (error) {
    // Re-throw redirect errors (they're expected in Next.js)
    if (error instanceof Error && (error as any).digest?.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    logger.error("Signin error", error, { email })
    return { error: "שגיאה בהתחברות. אנא נסה שוב." }
  }
}

export async function signOut() {
  logger.auth("Signout initiated")
  await deleteSession()
  redirect("/login")
}
