/**
 * Unified database layer: uses Supabase if configured, otherwise Neon (Prisma) if DATABASE_URL is set.
 * API routes should import { db, isDbConfigured } from "@/lib/db".
 */

import { db as dbSupabase, isSupabaseConfigured } from "@/lib/supabase"
import { dbNeon } from "@/lib/db-neon"

const isNeonConfigured = !!(
  process.env.DATABASE_URL &&
  process.env.DATABASE_URL.startsWith("postgres")
)

export const isDbConfigured = isSupabaseConfigured || isNeonConfigured

export const db = isSupabaseConfigured ? dbSupabase : isNeonConfigured ? dbNeon : dbSupabase
