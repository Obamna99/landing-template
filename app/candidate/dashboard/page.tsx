import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { CandidateDashboard } from "@/components/candidate/candidate-dashboard"

export default async function CandidateDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "candidate") {
    redirect("/admin/dashboard")
  }

  // Fetch candidate data
  const candidateResult = await sql`
    SELECT 
      c.*,
      u.email
    FROM candidates c
    JOIN users u ON c.user_id = u.id
    WHERE c.user_id = ${user.id}
    LIMIT 1
  `

  if (candidateResult.length === 0) {
    return <div>לא נמצא פרופיל מועמד</div>
  }

  const candidate = candidateResult[0]

  // Fetch tasks
  const tasks = await sql`
    SELECT * FROM tasks 
    WHERE candidate_id = ${candidate.id}
    ORDER BY created_at ASC
  `

  // Fetch documents
  const documents = await sql`
    SELECT *, object_id FROM documents 
    WHERE candidate_id = ${candidate.id}
    ORDER BY uploaded_at DESC
  `

  return <CandidateDashboard candidate={candidate} tasks={tasks} documents={documents} />
}
