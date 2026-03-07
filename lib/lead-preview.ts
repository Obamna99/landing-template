/**
 * Load a lead by id for the preview page. Uses DB when configured, otherwise .data/leads.json.
 */
import path from "path"
import { readFile } from "fs/promises"
import { db, isDbConfigured } from "@/lib/db"

export type LeadForPreview = {
  id: string
  email: string
  phone: string
  site_name?: string | null
  sections_json?: string | Record<string, unknown> | null
}

export async function getLeadForPreview(id: string): Promise<LeadForPreview | null> {
  if (isDbConfigured) {
    const lead = await db.leads.getById(id)
    return lead as LeadForPreview | null
  }

  const filePath = path.join(process.cwd(), ".data", "leads.json")
  try {
    const raw = await readFile(filePath, "utf-8")
    const list = JSON.parse(raw)
    if (!Array.isArray(list)) return null
    const found = list.find((item: { id?: string }) => String(item?.id) === String(id))
    if (!found) return null
    const sectionsJson = found.sections_json ?? (found as { sectionsJson?: unknown }).sectionsJson ?? null
    return {
      id: found.id,
      email: found.email ?? "",
      phone: found.phone ?? "",
      site_name: found.site_name ?? (found as { siteName?: string }).siteName ?? null,
      sections_json: sectionsJson,
    }
  } catch {
    return null
  }
}
