import { siteConfig } from "@/lib/config"

/**
 * Normalize phone to WhatsApp international format (972... for Israel)
 * Accepts "0501234567", "972501234567", "+972 50-123-4567", etc.
 */
export function toWhatsAppNumber(phone: string | undefined): string {
  if (!phone || !phone.trim()) return siteConfig.contact.whatsapp
  const digits = phone.replace(/\D/g, "")
  if (digits.startsWith("972")) return digits
  if (digits.startsWith("0")) return "972" + digits.slice(1)
  return "972" + digits
}

/**
 * Generate a WhatsApp URL with optional pre-filled message
 * @param number - WhatsApp number (international format or local 0xx)
 * @param message - Optional message to pre-fill
 * @returns WhatsApp URL string
 */
export const getWhatsAppUrl = (number?: string, message?: string): string => {
  const whatsappNumber = number ? toWhatsAppNumber(number) : siteConfig.contact.whatsapp
  const defaultMessage = message ?? siteConfig.contact.whatsappDefaultMessage
  const encodedMessage = defaultMessage ? encodeURIComponent(defaultMessage) : ""
  
  return `https://wa.me/${whatsappNumber}${encodedMessage ? `?text=${encodedMessage}` : ""}`
}

/**
 * Get WhatsApp URL using site config defaults
 * @param customMessage - Optional custom message (uses default if not provided)
 * @returns WhatsApp URL string
 */
export const getDefaultWhatsAppUrl = (customMessage?: string): string => {
  return getWhatsAppUrl(siteConfig.contact.whatsapp, customMessage)
}
