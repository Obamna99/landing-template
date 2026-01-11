import { prisma } from "./prisma"
import { Prisma } from "@prisma/client"
import { createLogger } from "./logger"

const logger = createLogger("Database")

if (!process.env.DATABASE_URL) {
  logger.error("DATABASE_URL environment variable is not set")
  throw new Error("DATABASE_URL environment variable is not set")
}

// SQL template literal helper that uses Prisma with Neon adapter
// This maintains compatibility with the existing sql`...` syntax
export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  try {
    // Convert template literal to Prisma.sql format
    const query = Prisma.sql(strings, ...values)
    const result = await prisma.$queryRaw(query)
    
    logger.db("Query executed successfully", {
      queryType: "raw",
      resultCount: Array.isArray(result) ? result.length : 0,
    })
    
    return result as any[]
  } catch (error) {
    logger.error("Database query failed", error, {
      queryType: "raw",
    })
    throw error
  }
}

// Helper function to execute queries with error handling
export async function query<T>(queryString: string, params?: any[]): Promise<T[]> {
  try {
    let result: T[]
    if (params && params.length > 0) {
      // For parameterized queries, we need to use $queryRawUnsafe with proper formatting
      // Note: This is less safe than Prisma.sql but maintains compatibility
      result = await prisma.$queryRawUnsafe(queryString, ...params) as T[]
    } else {
      result = await prisma.$queryRawUnsafe(queryString) as T[]
    }
    
    logger.db("Query executed successfully", {
      queryType: "unsafe",
      hasParams: !!(params && params.length > 0),
    })
    
    return result
  } catch (error) {
    logger.error("Database query failed", error, {
      queryType: "unsafe",
      hasParams: !!(params && params.length > 0),
    })
    throw error
  }
}
