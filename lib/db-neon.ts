/**
 * Neon (or any PostgreSQL) database adapter using Prisma.
 * Same interface as the Supabase db so the app can use either.
 * Set DATABASE_URL (e.g. Neon connection string) to use this.
 */

import { PrismaClient } from "@prisma/client"
import type { Lead, Subscriber, Review, EmailCampaign } from "@/lib/supabase"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

function toRecord(r: { updated_at?: Date; created_at?: Date } & Record<string, unknown>) {
  const { updated_at, created_at, ...rest } = r
  return {
    ...rest,
    ...(created_at && { created_at: created_at instanceof Date ? created_at.toISOString() : created_at }),
    ...(updated_at && { updated_at: updated_at instanceof Date ? updated_at.toISOString() : updated_at }),
  }
}

export const dbNeon = {
  leads: {
    async create(lead: Lead) {
      const row = await prisma.lead.create({
        data: {
          full_name: lead.full_name,
          email: lead.email,
          phone: lead.phone,
          business_type: lead.business_type,
          business_size: lead.business_size,
          urgency: lead.urgency,
          message: lead.message,
          status: lead.status || "new",
        },
      })
      return toRecord(row) as Lead & { id: string; created_at: string; updated_at: string }
    },
    async getAll() {
      const rows = await prisma.lead.findMany({ orderBy: { created_at: "desc" } })
      return rows.map(toRecord)
    },
    async updateStatus(id: string, status: Lead["status"]) {
      const row = await prisma.lead.update({
        where: { id },
        data: { status: status ?? undefined },
      })
      return toRecord(row)
    },
  },
  subscribers: {
    async upsert(subscriber: Subscriber) {
      const row = await prisma.subscriber.upsert({
        where: { email: subscriber.email },
        create: {
          email: subscriber.email,
          name: subscriber.name,
          phone: subscriber.phone,
          business_type: subscriber.business_type,
          business_size: subscriber.business_size,
          source: subscriber.source || "contact-form",
          status: "active",
        },
        update: {
          name: subscriber.name,
          phone: subscriber.phone,
          business_type: subscriber.business_type,
          business_size: subscriber.business_size,
          source: subscriber.source || "contact-form",
          status: "active",
        },
      })
      return toRecord(row)
    },
    async getAll() {
      const rows = await prisma.subscriber.findMany({ orderBy: { created_at: "desc" } })
      return rows.map(toRecord)
    },
    async getActive() {
      const rows = await prisma.subscriber.findMany({
        where: { status: "active" },
        select: { email: true, name: true },
      })
      return rows
    },
    async count(status?: string) {
      const where = status ? { status } : {}
      return prisma.subscriber.count({ where })
    },
  },
  reviews: {
    async getActive() {
      const rows = await prisma.review.findMany({
        where: { active: true },
        orderBy: { display_order: "asc" },
      })
      return rows.map(toRecord)
    },
    async getById(id: string) {
      const row = await prisma.review.findUnique({ where: { id } })
      return row ? toRecord(row) : null
    },
    async create(review: Review) {
      const row = await prisma.review.create({
        data: {
          name: review.name,
          role: review.role,
          company: review.company,
          content: review.content,
          rating: review.rating ?? 5,
          image_url: review.image_url,
          result: review.result,
          result_label: review.result_label,
          featured: review.featured ?? false,
          verified: review.verified ?? true,
          active: review.active ?? true,
          display_order: review.display_order ?? 0,
        },
      })
      return toRecord(row)
    },
    async update(id: string, review: Partial<Review>) {
      const row = await prisma.review.update({
        where: { id },
        data: {
          ...(review.name !== undefined && { name: review.name }),
          ...(review.role !== undefined && { role: review.role }),
          ...(review.company !== undefined && { company: review.company }),
          ...(review.content !== undefined && { content: review.content }),
          ...(review.rating !== undefined && { rating: review.rating }),
          ...(review.image_url !== undefined && { image_url: review.image_url }),
          ...(review.result !== undefined && { result: review.result }),
          ...(review.result_label !== undefined && { result_label: review.result_label }),
          ...(review.featured !== undefined && { featured: review.featured }),
          ...(review.verified !== undefined && { verified: review.verified }),
          ...(review.active !== undefined && { active: review.active }),
          ...(review.display_order !== undefined && { display_order: review.display_order }),
        },
      })
      return toRecord(row)
    },
    async delete(id: string) {
      await prisma.review.delete({ where: { id } })
      return { success: true }
    },
  },
  emailCampaigns: {
    async create(campaign: EmailCampaign) {
      const row = await prisma.emailCampaign.create({
        data: {
          subject: campaign.subject,
          content: campaign.content,
          recipient_count: campaign.recipient_count,
          status: campaign.status || "sent",
        },
      })
      return toRecord(row)
    },
    async getRecent(limit = 5) {
      const rows = await prisma.emailCampaign.findMany({
        orderBy: { sent_at: "desc" },
        take: limit,
      })
      return rows.map((r) => ({
        id: r.id,
        subject: r.subject,
        recipient_count: r.recipient_count,
        recipientCount: r.recipient_count,
        sent_at: r.sent_at instanceof Date ? r.sent_at.toISOString() : r.sent_at,
        sentAt: r.sent_at instanceof Date ? r.sent_at.toISOString() : r.sent_at,
      }))
    },
  },

  settings: {
    async getSectionVisibility() {
      const row = await prisma.siteSetting.findUnique({
        where: { key: "section_visibility" },
      })
      if (!row?.value) return null
      try {
        return JSON.parse(row.value) as Record<string, boolean>
      } catch {
        return null
      }
    },
    async updateSectionVisibility(visibility: Record<string, boolean>) {
      await prisma.siteSetting.upsert({
        where: { key: "section_visibility" },
        create: { key: "section_visibility", value: JSON.stringify(visibility) },
        update: { value: JSON.stringify(visibility) },
      })
    },
  },
}
