"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { uploadToR2, generateObjectKey, getR2PresignedPost, getR2PresignedPut, checkBucketSpace, invalidateBucketSizeCache } from "@/lib/r2"
import { createLogger } from "@/lib/logger"

const logger = createLogger("CandidateActions")

export async function updatePersonalInfo(formData: FormData) {
  try {
    const user = await requireAuth()
    const candidateIdStr = formData.get("candidateId") as string
    const candidateId = parseInt(candidateIdStr, 10)

    if (isNaN(candidateId)) {
      return { error: "מזהה מועמד לא תקין" }
    }

    logger.info("Updating personal info", { userId: user.id, candidateId })

    // Verify candidate belongs to user (only check existence, don't fetch all fields)
    const candidate = await sql`
      SELECT id FROM candidates WHERE id = ${candidateId} AND user_id = ${user.id} LIMIT 1
    `

    if (candidate.length === 0) {
      logger.warn("Candidate not found for user", { userId: user.id, candidateId })
      return { error: "לא נמצא מועמד" }
    }

    const phone = formData.get("phone") as string
    const idNumber = formData.get("idNumber") as string
    const address = formData.get("address") as string
    const city = formData.get("city") as string
    const zipCode = formData.get("zipCode") as string
    const linkedinUsername = formData.get("linkedinUsername") as string
    const maritalStatus = formData.get("maritalStatus") as string
    const education = formData.get("education") as string
    const employmentStatus = formData.get("employmentStatus") as string
    const workplace = formData.get("workplace") as string
    const dateOfBirthStr = formData.get("dateOfBirth") as string
    const wasOfficerStr = formData.get("wasOfficer") as string
    const over100ReserveDaysStr = formData.get("over100ReserveDays") as string
    const citizenshipJson = formData.get("citizenship") as string

    // Parse date of birth (can be null)
    let dateOfBirth: string | null = null
    if (dateOfBirthStr && dateOfBirthStr.trim() !== "") {
      try {
        dateOfBirth = new Date(dateOfBirthStr).toISOString().split('T')[0]
      } catch (e) {
        logger.warn("Failed to parse date of birth", { dateOfBirthStr, error: e })
        return { error: "תאריך לידה לא תקין" }
      }
    }

    // Parse boolean fields (can be null)
    const wasOfficer = wasOfficerStr === "yes" ? true : wasOfficerStr === "no" ? false : null
    const over100ReserveDays = over100ReserveDaysStr === "yes" ? true : over100ReserveDaysStr === "no" ? false : null

    // Parse citizenship JSON, default to [{"type":"standard","label":"ישראלית","code":"IL"}]
    let citizenship = null
    if (citizenshipJson) {
      try {
        const parsed = JSON.parse(citizenshipJson)
        if (Array.isArray(parsed) && parsed.length > 0) {
          citizenship = parsed
        }
      } catch (e) {
        logger.warn("Failed to parse citizenship JSON", { citizenshipJson, error: e })
        // Default to Israel if parsing fails
        citizenship = [{ type: "standard", label: "ישראלית", code: "IL" }]
      }
    }

    await sql`
      UPDATE candidates
      SET 
        phone = ${phone || null},
        id_number = ${idNumber || null},
        address = ${address || null},
        city = ${city || null},
        zip_code = ${zipCode || null},
        linkedin_username = ${linkedinUsername || null},
        marital_status = ${maritalStatus || null},
        education = ${education || null},
        employment_status = ${employmentStatus || null},
        workplace = ${employmentStatus === "שכיר" ? (workplace || null) : null},
        date_of_birth = ${dateOfBirth || null}::date,
        was_officer = ${wasOfficer !== null && wasOfficer !== undefined ? wasOfficer : null},
        over_100_reserve_days = ${over100ReserveDays !== null && over100ReserveDays !== undefined ? over100ReserveDays : null},
        citizenship = ${citizenship ? JSON.stringify(citizenship) : null}::jsonb,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${candidateId}
    `

    // Auto-complete "מילוי פרטים אישיים" task
    await sql`
      UPDATE tasks
      SET completed = true, completed_at = CURRENT_TIMESTAMP
      WHERE candidate_id = ${candidateId}
        AND title = 'מילוי פרטים אישיים'
        AND completed = false
    `

    // Recalculate progress
    const allTasks = await sql`
      SELECT completed FROM tasks WHERE candidate_id = ${candidateId}
    `
    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter((t: any) => t.completed === true).length
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    
    await sql`
      UPDATE candidates
      SET progress = ${progress}
      WHERE id = ${candidateId}
    `

    logger.success("Personal info updated successfully", {
      userId: user.id,
      candidateId,
      hasPhone: !!phone,
      hasAddress: !!address,
      hasCity: !!city,
    })

    revalidatePath("/candidate/dashboard")
    return { success: true }
  } catch (error) {
    logger.error("Update personal info error", error, {
      candidateId: formData.get("candidateId") as string,
    })
    return { error: "שגיאה בעדכון הפרטים" }
  }
}

export async function toggleTask(taskId: number, completed: boolean) {
  try {
    const user = await requireAuth()

    logger.info("Toggling task", { userId: user.id, taskId, completed })

    // Verify task belongs to user
    const task = await sql`
      SELECT t.* FROM tasks t
      JOIN candidates c ON t.candidate_id = c.id
      WHERE t.id = ${taskId} AND c.user_id = ${user.id}
    `

    if (task.length === 0) {
      logger.warn("Task not found for user", { userId: user.id, taskId })
      return { error: "לא נמצאה משימה" }
    }

    const candidateId = task[0].candidate_id

    // Update task (minimal DB work - just the update)
    await sql`
      UPDATE tasks
      SET 
        completed = ${completed},
        completed_at = ${completed ? "CURRENT_TIMESTAMP" : null}
      WHERE id = ${taskId}
    `

    // Fetch all tasks and calculate progress in code (minimizes DB processing)
    const allTasks = await sql`
      SELECT completed FROM tasks WHERE candidate_id = ${candidateId}
    `
    
    // Calculate progress in application code
    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter((t: any) => t.completed === true).length
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Update progress (simple UPDATE, no calculations)
    await sql`
      UPDATE candidates
      SET progress = ${progress}
      WHERE id = ${candidateId}
    `

    logger.success("Task toggled successfully", {
      userId: user.id,
      taskId,
      completed,
      candidateId,
      progress,
    })

    revalidatePath("/candidate/dashboard")
    return { success: true }
  } catch (error) {
    logger.error("Toggle task error", error, { taskId, completed })
    return { error: "שגיאה בעדכון המשימה" }
  }
}

/**
 * Get a presigned POST URL for direct client upload to R2
 * This bypasses Vercel's 4.5MB serverless function limit
 */
export async function getUploadUrl(candidateId: string, documentType: string, fileName: string, fileType: string, fileSize: number) {
  try {
    const user = await requireAuth()

    logger.upload("Requesting upload URL", {
      userId: user.id,
      candidateId,
      documentType,
      fileName,
      fileType,
      fileSize,
    })

    // Verify candidate belongs to user (only check existence, don't fetch all fields)
    const candidate = await sql`
      SELECT id FROM candidates WHERE id = ${candidateId} AND user_id = ${user.id} LIMIT 1
    `

    if (candidate.length === 0) {
      logger.warn("Candidate not found for user", { userId: user.id, candidateId })
      return { error: "לא נמצא מועמד" }
    }

    // Validate file size (10MB limit)
    const maxSizeMB = 10
    if (fileSize > maxSizeMB * 1024 * 1024) {
      logger.warn("File size exceeds limit", {
        userId: user.id,
        candidateId,
        fileName,
        fileSize,
        maxSizeMB,
      })
      return { error: `גודל הקובץ חורג מהמגבלה (${maxSizeMB}MB)` }
    }

    // Check bucket size before allowing upload
    // This uses cached value if available (15 min TTL) to minimize Class A operations
    const bucketCheck = await checkBucketSpace(fileSize)
    if (!bucketCheck.allowed) {
      logger.critical("Upload blocked due to bucket size limit", {
        userId: user.id,
        candidateId,
        fileName,
        fileSize,
        currentSizeMB: bucketCheck.currentSizeMB,
        maxSizeMB: bucketCheck.maxSizeMB,
      })
      return { 
        error: `האיחסון מלא. נפח נוכחי: ${bucketCheck.currentSizeMB.toFixed(2)}MB / ${bucketCheck.maxSizeMB}MB` 
      }
    }

    // Generate unique object key for R2
    const objectKey = generateObjectKey(parseInt(candidateId), documentType, fileName)

    // Generate presigned PUT URL for direct upload
    // R2 doesn't support presigned POST - only PUT, GET, HEAD, DELETE
    const url = await getR2PresignedPut(objectKey, fileType)

    logger.success("Upload URL generated successfully", {
      userId: user.id,
      candidateId,
      documentType,
      fileName,
      objectKey,
    })

    return { 
      success: true, 
      uploadUrl: url, 
      fields: {},
      objectKey,
      method: "PUT"
    }
  } catch (error) {
    logger.error("Get upload URL error", error, {
      candidateId,
      documentType,
      fileName,
      fileSize,
    })
    return { error: "שגיאה ביצירת קישור העלאה" }
  }
}

/**
 * Save document metadata after successful R2 upload
 */
export async function saveDocumentMetadata(
  candidateId: string,
  documentType: string,
  fileName: string,
  objectKey: string,
  fileSize: number
) {
  try {
    const user = await requireAuth()
    const candidateIdNum = parseInt(candidateId, 10)

    if (isNaN(candidateIdNum)) {
      return { error: "מזהה מועמד לא תקין" }
    }

    logger.upload("Saving document metadata", {
      userId: user.id,
      candidateId: candidateIdNum,
      documentType,
      fileName,
      objectKey,
      fileSize,
    })

    // Verify candidate belongs to user (only check existence, don't fetch all fields)
    const candidate = await sql`
      SELECT id FROM candidates WHERE id = ${candidateIdNum} AND user_id = ${user.id} LIMIT 1
    `

    if (candidate.length === 0) {
      logger.warn("Candidate not found for user", { userId: user.id, candidateId: candidateIdNum })
      return { error: "לא נמצא מועמד" }
    }

    // Store metadata in database
    await sql`
      INSERT INTO documents (candidate_id, document_type, file_name, file_url, object_id, file_size)
      VALUES (${candidateIdNum}, ${documentType}, ${fileName}, ${objectKey}, ${objectKey}, ${fileSize})
    `

    // Auto-complete relevant tasks based on document type
    if (documentType === "drivers_license") {
      // Complete "העלאת תמונת רישיון נהיגה" task
      await sql`
        UPDATE tasks
        SET completed = true, completed_at = CURRENT_TIMESTAMP
        WHERE candidate_id = ${candidateIdNum}
          AND (title LIKE '%רישיון נהיגה%' OR title LIKE '%רישיון%')
          AND completed = false
      `
    } else if (documentType === "bank_account_confirmation" || documentType === "passport" || documentType === "id_card") {
      // Complete "חתימה והעלאת מסמכים משפטיים" task for legal documents
      await sql`
        UPDATE tasks
        SET completed = true, completed_at = CURRENT_TIMESTAMP
        WHERE candidate_id = ${candidateIdNum}
          AND (title LIKE '%מסמכים משפטיים%' OR title LIKE '%חתימה%')
          AND completed = false
      `
    }

    // Recalculate progress
    const allTasks = await sql`
      SELECT completed FROM tasks WHERE candidate_id = ${candidateIdNum}
    `
    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter((t: any) => t.completed === true).length
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    
    await sql`
      UPDATE candidates
      SET progress = ${progress}
      WHERE id = ${candidateIdNum}
    `

    logger.success("Document metadata saved successfully", {
      userId: user.id,
      candidateId: candidateIdNum,
      documentType,
      fileName,
      objectKey,
    })

    // Invalidate bucket size cache after successful upload
    // This ensures the next upload check uses fresh data
    invalidateBucketSizeCache()

    revalidatePath("/candidate/dashboard")
    return { success: true }
  } catch (error) {
    logger.error("Save document metadata error", error, {
      candidateId,
      documentType,
      fileName,
      objectKey,
    })
    return { error: "שגיאה בשמירת פרטי המסמך" }
  }
}

/**
 * Legacy upload function - kept for backward compatibility
 * Note: This will fail on Vercel for files > 4.5MB
 * Use getUploadUrl + direct client upload instead
 */
export async function uploadDocument(formData: FormData) {
  try {
    const user = await requireAuth()
    const candidateId = formData.get("candidateId") as string
    const documentType = formData.get("documentType") as string
    const file = formData.get("file") as File

    if (!file) {
      return { error: "לא נבחר קובץ" }
    }

    // Verify candidate belongs to user (only check existence, don't fetch all fields)
    const candidate = await sql`
      SELECT id FROM candidates WHERE id = ${candidateId} AND user_id = ${user.id} LIMIT 1
    `

    if (candidate.length === 0) {
      return { error: "לא נמצא מועמד" }
    }

    // Validate file size (10MB limit)
    const maxSizeMB = 10
    if (file.size > maxSizeMB * 1024 * 1024) {
      logger.warn("File size exceeds limit", {
        userId: user.id,
        candidateId,
        fileName: file.name,
        fileSize: file.size,
        maxSizeMB,
      })
      return { error: `גודל הקובץ חורג מהמגבלה (${maxSizeMB}MB)` }
    }

    // Check bucket size before allowing upload (uses REST API, not R2 operation)
    const bucketCheck = await checkBucketSpace(file.size)
    if (!bucketCheck.allowed) {
      logger.critical("Upload blocked due to bucket size limit", {
        userId: user.id,
        candidateId,
        fileName: file.name,
        fileSize: file.size,
        currentSizeMB: bucketCheck.currentSizeMB,
        maxSizeMB: bucketCheck.maxSizeMB,
      })
      return { 
        error: `האיחסון מלא. נפח נוכחי: ${bucketCheck.currentSizeMB.toFixed(2)}MB / ${bucketCheck.maxSizeMB}MB` 
      }
    }

    // Generate unique object key for R2
    const objectKey = generateObjectKey(parseInt(candidateId), documentType, file.name)
    
    // Upload to Cloudflare R2 (Class A operation - but now we know bucket has space)
    const objectId = await uploadToR2(file, objectKey)

    const fileName = file.name
    const fileSize = file.size
    // Store the R2 object key as the file URL (we'll generate presigned URLs when needed)
    const fileUrl = objectKey

    await sql`
      INSERT INTO documents (candidate_id, document_type, file_name, file_url, object_id, file_size)
      VALUES (${candidateId}, ${documentType}, ${fileName}, ${fileUrl}, ${objectId}, ${fileSize})
    `

    // Invalidate bucket size cache after successful upload
    invalidateBucketSizeCache()

    logger.success("Document uploaded successfully", {
      userId: user.id,
      candidateId,
      documentType,
      fileName,
      objectKey,
      fileSize,
    })

    revalidatePath("/candidate/dashboard")
    return { success: true }
  } catch (error) {
    logger.error("Upload document error", error, {
      candidateId: formData.get("candidateId") as string,
      documentType: formData.get("documentType") as string,
    })
    return { error: "שגיאה בהעלאת המסמך" }
  }
}
