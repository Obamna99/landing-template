"use client"

import dynamic from "next/dynamic"

const ChatbotWidget = dynamic(
  () => import("@/components/chatbot/ChatbotWidget").then((m) => m.ChatbotWidget),
  { ssr: false }
)
const SocialProofNotification = dynamic(
  () => import("@/components/social-proof/SocialProofNotification").then((m) => m.SocialProofNotification),
  { ssr: false }
)
const HesitationHelper = dynamic(
  () => import("@/components/hesitation/HesitationHelper").then((m) => m.HesitationHelper),
  { ssr: false }
)

export function LandingWidgets() {
  return (
    <>
      <ChatbotWidget />
      <SocialProofNotification />
      <HesitationHelper />
    </>
  )
}
