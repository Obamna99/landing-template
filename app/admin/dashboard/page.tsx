import { requireAdmin } from "@/lib/auth"
import { sql } from "@/lib/db"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminDashboardPage() {
  const user = await requireAdmin()

  // Fetch raw data only - all calculations done in code to minimize DB work
  const candidatesRaw = await sql`
    SELECT 
      c.*,
      u.email
    FROM candidates c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.created_at DESC
  `

  // Fetch all tasks and documents in simple queries (no aggregations)
  const allTasks = await sql`
    SELECT candidate_id, completed FROM tasks
  `
  const allDocuments = await sql`
    SELECT candidate_id, status FROM documents
  `

  // Calculate stats in code (minimizes DB processing)
  const candidates = candidatesRaw.map((candidate: any) => {
    const candidateTasks = allTasks.filter((t: any) => t.candidate_id === candidate.id)
    const candidateDocs = allDocuments.filter((d: any) => d.candidate_id === candidate.id)
    
    return {
      ...candidate,
      completed_tasks: candidateTasks.filter((t: any) => t.completed === true).length,
      total_tasks: candidateTasks.length,
      document_count: candidateDocs.length,
      pending_documents: candidateDocs.filter((d: any) => d.status === 'pending').length,
    }
  })

  // Fetch pending documents
  const pendingDocuments = await sql`
    SELECT 
      d.*,
      d.object_id,
      c.first_name,
      c.last_name,
      c.id as candidate_id
    FROM documents d
    JOIN candidates c ON d.candidate_id = c.id
    WHERE d.status = 'pending'
    ORDER BY d.uploaded_at DESC
  `

  // Calculate statistics in code (minimizes DB processing)
  const stats = {
    pending_count: candidatesRaw.filter((c: any) => c.status === 'pending').length,
    in_progress_count: candidatesRaw.filter((c: any) => c.status === 'in_progress').length,
    completed_count: candidatesRaw.filter((c: any) => c.status === 'completed').length,
    approved_count: candidatesRaw.filter((c: any) => c.status === 'approved').length,
    total_count: candidatesRaw.length,
  }

  return (
    <AdminDashboard
      candidates={candidates}
      pendingDocuments={pendingDocuments}
      stats={stats}
      adminEmail={user.email}
    />
  )
}
