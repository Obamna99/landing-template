import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"

const FILENAME = "email-sent-count.json"

function getMonthKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}

async function getData(): Promise<Record<string, number>> {
  const dir = path.join(process.cwd(), ".data")
  await mkdir(dir, { recursive: true })
  const filePath = path.join(dir, FILENAME)
  try {
    const raw = await readFile(filePath, "utf-8")
    const data = JSON.parse(raw)
    if (data && typeof data === "object" && !Array.isArray(data)) return data as Record<string, number>
  } catch {
    // file missing or invalid
  }
  return {}
}

/**
 * Increment the email-sent count for the current month. Call this after each successful send.
 * @param count Number of emails sent in this call (e.g. 1 for single, N for bulk batch)
 */
export async function incrementEmailSentCount(count: number = 1): Promise<void> {
  if (count < 1) return
  const data = await getData()
  const key = getMonthKey()
  data[key] = (data[key] ?? 0) + count
  const dir = path.join(process.cwd(), ".data")
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, FILENAME), JSON.stringify(data, null, 2), "utf-8")
}

/**
 * Get the number of emails sent in the current month. Resets conceptually every new month.
 */
export async function getEmailSentCountForCurrentMonth(): Promise<{ count: number; month: string }> {
  const data = await getData()
  const month = getMonthKey()
  const count = data[month] ?? 0
  return { count, month }
}
