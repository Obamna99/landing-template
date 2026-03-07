import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB per file
const MAX_FILES = 20
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"]

/** Sanitize filename for safe filesystem use (no path traversal). */
function safeFileName(name: string, index: number): string {
  const ext = path.extname(name) || ""
  const base = path.basename(name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80) || "file"
  return `${index}-${base}${ext}`
}

/** Local fallback: write to public/uploads/leads/ (works in dev; Vercel serverless has read-only fs). */
async function uploadToLocal(files: File[], baseUrl: string): Promise<string[]> {
  const dirName = `leads-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const uploadDir = path.join(process.cwd(), "public", "uploads", "leads", dirName)
  await mkdir(uploadDir, { recursive: true })
  const urls: string[] = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!(file instanceof File)) continue
    const fileName = safeFileName(file.name, i)
    const filePath = path.join(uploadDir, fileName)
    const buf = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buf)
    urls.push(`${baseUrl}/uploads/leads/${dirName}/${fileName}`)
  }
  return urls
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    if (!files?.length) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      )
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} files allowed` },
        { status: 400 }
      )
    }

    for (const file of files) {
      if (!(file instanceof File)) continue
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds 50MB limit` },
          { status: 400 }
        )
      }
      const type = file.type
      const isImage = ALLOWED_IMAGE_TYPES.includes(type)
      const isVideo = ALLOWED_VIDEO_TYPES.includes(type)
      if (!isImage && !isVideo) {
        return NextResponse.json(
          { error: `File type not allowed: ${file.name}. Use images (JPEG, PNG, GIF, WebP) or videos (MP4, WebM, MOV).` },
          { status: 400 }
        )
      }
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN
    let urls: string[]

    if (token) {
      const prefix = `leads/${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      urls = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!(file instanceof File)) continue
        const blob = await put(`${prefix}/${i}-${file.name}`, file, {
          access: "public",
          addRandomSuffix: true,
        })
        urls.push(blob.url)
      }
    } else {
      const origin = request.nextUrl.origin
      urls = await uploadToLocal(files, origin)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}
