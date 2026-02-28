import { redirect } from "next/navigation"
import { db, isDbConfigured } from "@/lib/db"
import { verifyUnsubscribeToken } from "@/lib/unsubscribe"
import { UnsubscribeClient } from "./UnsubscribeClient"

type Props = { searchParams: Promise<{ token?: string; done?: string; error?: string }> }

export default async function UnsubscribePage({ searchParams }: Props) {
  const params = await searchParams

  // One-click: server processes token and redirects so the client just sees success
  if (params.token) {
    const email = await verifyUnsubscribeToken(params.token)
    if (email && isDbConfigured) {
      await db.subscribers.unsubscribeByEmail(email)
      await db.leads.updateStatusByEmail(email, "unsubscribed")
      redirect("/unsubscribe?done=1")
    }
    if (!email) {
      redirect("/unsubscribe?error=invalid")
    }
  }

  return (
    <UnsubscribeClient
      initialDone={params.done === "1"}
      initialError={params.error === "invalid" ? "הקישור לא תקף או שפג תוקפו." : undefined}
    />
  )
}
