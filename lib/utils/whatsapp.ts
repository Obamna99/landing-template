import { siteConfig } from "@/lib/config"

/**
 * Generate a WhatsApp URL with optional pre-filled message
 * @param number - WhatsApp number in international format (e.g., "972501234567")
 * @param message - Optional message to pre-fill
 * @returns WhatsApp URL string
 */
export const getWhatsAppUrl = (number?: string, message?: string): string => {
  const whatsappNumber = number || siteConfig.contact.whatsapp
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
