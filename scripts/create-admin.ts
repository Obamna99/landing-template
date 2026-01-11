import 'dotenv/config'
import { prisma } from "../lib/prisma"
import { Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"
import { createLogger } from "../lib/logger"

const logger = createLogger("CreateAdmin")

if (!process.env.DATABASE_URL) {
  logger.error("DATABASE_URL environment variable is not set")
  logger.error("Please create a .env file with DATABASE_URL or set it as an environment variable")
  process.exit(1)
}

// Validate DATABASE_URL format
if (process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1')) {
  logger.error("DATABASE_URL appears to be pointing to localhost")
  logger.error("Please set DATABASE_URL to your Neon database connection string")
  logger.error("Format: postgresql://user:password@host/database?sslmode=require")
  process.exit(1)
}

async function createAdminUser(email: string, password: string) {
  try {
    logger.info("Creating admin user", { email })
    
    // Check if user already exists using Prisma
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    })

    if (existingUser) {
      logger.warn("User already exists", { email, userId: existingUser.id })
      return
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert admin user using Prisma
    const result = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'admin'
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    })

    logger.success("Admin user created successfully", {
      userId: result.id,
      email: result.email,
      role: result.role,
    })
    
    logger.info("Admin credentials", {
      email,
      password: "*** (hidden)",
    })
  } catch (error) {
    logger.error("Error creating admin user", error, { email })
    throw error
  }
}

// Example usage - you can modify these credentials
const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com"
const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!"

createAdminUser(adminEmail, adminPassword)
