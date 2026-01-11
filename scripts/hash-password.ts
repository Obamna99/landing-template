import bcrypt from "bcryptjs"
import { createLogger } from "../lib/logger"

const logger = createLogger("HashPassword")

// Script to generate password hash for manual insertion
async function hashPassword(password: string) {
  logger.info("Generating password hash")
  const hash = await bcrypt.hash(password, 10)
  logger.info("Password hash generated", {
    password: "*** (hidden)",
    hash,
  })
  return hash
}

// Generate hash for Admin123!
hashPassword("Admin123!")
