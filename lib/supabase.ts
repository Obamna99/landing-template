import { createClient, SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

// Only create client if credentials are available
let supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }
  
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  
  return supabase
}

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Type definitions for our database tables
export interface Lead {
  id?: string
  full_name: string
  email: string
  phone: string
  business_type?: string
  business_size?: string
  urgency?: string
  message?: string
  status?: "new" | "contacted" | "qualified" | "converted" | "closed"
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface Subscriber {
  id?: string
  email: string
  name?: string
  phone?: string
  business_type?: string
  business_size?: string
  source?: string
  status?: "active" | "unsubscribed" | "bounced"
  subscribed_at?: string
  unsubscribed_at?: string
  created_at?: string
  updated_at?: string
}

export interface Review {
  id?: string
  name: string
  role?: string
  company?: string
  content: string
  rating?: number
  image_url?: string
  result?: string
  result_label?: string
  featured?: boolean
  verified?: boolean
  active?: boolean
  display_order?: number
  created_at?: string
  updated_at?: string
}

export interface EmailCampaign {
  id?: string
  subject: string
  content: string
  recipient_count: number
  status?: "draft" | "sending" | "sent" | "failed"
  sent_at?: string
  created_at?: string
}

// Database operations
export const db = {
  // Leads
  leads: {
    async create(lead: Lead) {
      const client = getSupabase()
      if (!client) throw new Error("Supabase not configured")
      
      const { data, error } = await client
        .from("leads")
        .insert([{
          full_name: lead.full_name,
          email: lead.email,
          phone: lead.phone,
          business_type: lead.business_type,
          business_size: lead.business_size,
          urgency: lead.urgency,
          message: lead.message,
          status: "new",
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async getAll() {
      const client = getSupabase()
      if (!client) throw new Error("Supabase not configured")
      
      const { data, error } = await client
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) throw error
      return data
    },

    async updateStatus(id: string, status: Lead["status"]) {
      const client = getSupabase()
      if (!client) throw new Error("Supabase not configured")
      
      const { data, error } = await client
        .from("leads")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
  },

  // Subscribers
  subscribers: {
    async upsert(subscriber: Subscriber) {
      const client = getSupabase()
      if (!client) throw new Error("Supabase not configured")
      
      const { data, error } = await client
        .from("subscribers")
        .upsert([{
          email: subscriber.email,
          name: subscriber.name,
          phone: subscriber.phone,
          business_type: subscriber.business_type,
          business_size: subscriber.business_size,
          source: subscriber.source || "contact-form",
          status: "active",
        }], { onConflict: "email" })
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async getAll() {
      const client = getSupabase()
      if (!client) throw new Error("Supabase not configured")
      
      const { data, error } = await client
        .from("subscribers")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) throw error
      return data
    },

    async getActive() {
      const client = getSupabase()
      if (!client) throw new Error("Supabase not configured")
      
      const { data, error } = await client
        .from("subscribers")
        .select("email, name")
        .eq("status", "active")
      
      if (error) throw error
      return data
    },

    async count(status?: string) {
      const client = getSupabase()
      if (!client) throw new Error("Supabase not configured")
      
      let query = client.from("subscribers").select("*", { count: "exact", head: true })
      if (status) {
        query = query.eq("status", status)
      }
      
      const { count, error } = await query
      if (error) throw error
      return count || 0
    },
  },

  // Reviews
  reviews: {
    async getActive() {
      const client = getSupabase()
      if (!client) throw new Error("Supabase not configured")
      
      const { data, error } = await client
        .from("reviews")
        .select("*")
        .eq("active", true)
        .order("display_order", { ascending: true })
      
      if (error) throw error
      return data
    },

    async getById(id: string) {
      const client = getSupabase()
      if (!client) throw new Error("Supabase not configured")
      
      const { data, error } = await client
        .from("reviews")
        .select("*")
        .eq("id", id)
        .single()
      
      if (error) throw error
      return data
    },

    async create(review: Review) {
      const client = getSupabase()
      if (!client) throw new Error("Supabase not configured")
      
      const { data, error } = await client
        .from("reviews")
        .insert([review])
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, review: Partial<Review>) {
      const client = getSupabase()
      if (!client) throw new Error("Supabase not configured")
      
      const { data, error } = await client
        .from("reviews")
        .update({ ...review, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id: string) {
      const client = getSupabase()
      if (!client) throw new Error("Supabase not configured")
      
      const { error } = await client
        .from("reviews")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      return { success: true }
    },
  },

  // Email Campaigns
  emailCampaigns: {
    async create(campaign: EmailCampaign) {
      const client = getSupabase()
      if (!client) throw new Error("Supabase not configured")
      
      const { data, error } = await client
        .from("email_campaigns")
        .insert([{
          subject: campaign.subject,
          content: campaign.content,
          recipient_count: campaign.recipient_count,
          status: campaign.status || "sent",
          sent_at: new Date().toISOString(),
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async getRecent(limit = 5) {
      const client = getSupabase()
      if (!client) throw new Error("Supabase not configured")
      
      const { data, error } = await client
        .from("email_campaigns")
        .select("*")
        .order("sent_at", { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return data
    },
  },
}
