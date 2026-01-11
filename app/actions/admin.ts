"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { getR2PresignedUrl } from "@/lib/r2"
import { createLogger } from "@/lib/logger"

const logger = createLogger("AdminActions")

export async function updateCandidateStatus(candidateId: number, status: string) {
  try {
    const admin = await requireAdmin()

    logger.admin("Updating candidate status", {
      adminId: admin.id,
      candidateId,
      status,
    })

    await sql`
      UPDATE candidates
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${candidateId}
    `

    logger.success("Candidate status updated successfully", {
      adminId: admin.id,
      candidateId,
      status,
    })

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    logger.error("Update candidate status error", error, {
      candidateId,
      status,
    })
    return { error: "שגיאה בעדכון הסטטוס" }
  }
}

export async function approveDocument(documentId: number) {
  try {
    const admin = await requireAdmin()

    logger.admin("Approving document", {
      adminId: admin.id,
      documentId,
    })

    await sql`
      UPDATE documents
      SET status = 'approved'
      WHERE id = ${documentId}
    `

    // Log admin activity
    await sql`
      INSERT INTO admin_logs (admin_id, action, target_type, target_id, details)
      VALUES (${admin.id}, 'approve_document', 'document', ${documentId}, 'אישר מסמך')
    `

    logger.success("Document approved successfully", {
      adminId: admin.id,
      documentId,
    })

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    logger.error("Approve document error", error, {
      adminId: admin.id,
      documentId,
    })
    return { error: "שגיאה באישור המסמך" }
  }
}

export async function rejectDocument(documentId: number) {
  try {
    const admin = await requireAdmin()

    logger.admin("Rejecting document", {
      adminId: admin.id,
      documentId,
    })

    await sql`
      UPDATE documents
      SET status = 'rejected'
      WHERE id = ${documentId}
    `

    // Log admin activity
    await sql`
      INSERT INTO admin_logs (admin_id, action, target_type, target_id, details)
      VALUES (${admin.id}, 'reject_document', 'document', ${documentId}, 'דחה מסמך')
    `

    logger.success("Document rejected successfully", {
      adminId: admin.id,
      documentId,
    })

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    logger.error("Reject document error", error, {
      adminId: admin.id,
      documentId,
    })
    return { error: "שגיאה בדחיית המסמך" }
  }
}

export async function getDocumentDownloadUrl(documentId: number) {
  try {
    const admin = await requireAdmin()

    logger.download("Requesting document download URL", {
      adminId: admin.id,
      documentId,
    })

    const documents = await sql`
      SELECT object_id FROM documents WHERE id = ${documentId}
    `

    if (documents.length === 0 || !documents[0].object_id) {
      logger.warn("Document not found for download", {
        adminId: admin.id,
        documentId,
      })
      return { error: "מסמך לא נמצא" }
    }

    const objectId = documents[0].object_id as string
    // Use cached presigned URL if available (useCache=true by default)
    // Note: Presigned URL generation is FREE, but caching reduces computation
    // The actual GET when URL is used counts as Class B operation
    const presignedUrl = await getR2PresignedUrl(objectId, 3600, true)

    // Log R2 Class B operation (will occur when admin actually downloads)
    logger.r2Operation("ClassB", "Presigned download URL generated for admin", {
      adminId: admin.id,
      documentId,
      objectId,
    })

    logger.success("Document download URL generated successfully", {
      adminId: admin.id,
      documentId,
      objectId,
    })

    return { url: presignedUrl }
  } catch (error) {
    logger.error("Get document download URL error", error, {
      documentId,
    })
    return { error: "שגיאה ביצירת קישור הורדה" }
  }
}
