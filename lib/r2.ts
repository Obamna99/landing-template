/**
 * R2 Storage Operations - Optimized for Minimal Operations
 * 
 * Operation Strategy:
 * - Users: Only upload documents (Class A operations - 1 per upload)
 * - Users: Never read/download files (saves Class B operations)
 * - Admin: Can download files (Class B operations - only when needed)
 * 
 * Optimizations:
 * - Bucket size checking uses Cloudflare REST API (FREE, not an R2 operation)
 * - Bucket size cached for 15 minutes to minimize API calls
 * - Presigned URLs cached to avoid regeneration (admin downloads)
 * - All operations logged with operation class tracking
 * - Bucket size logged on every checkBucketSpace call
 * 
 * Operation Limits:
 * - Class A: 1M/month (PUT operations - uploads)
 * - Class B: 10M/month (GET operations - downloads)
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { createLogger } from "./logger"

const logger = createLogger("R2")

// Validate R2 environment variables
if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME || !process.env.R2_MAX_BUCKET_SIZE_MB) {
  logger.warn("Missing R2 environment variables. R2 functionality will not work.", {
    hasEndpoint: !!process.env.R2_ENDPOINT,
    hasAccessKey: !!process.env.R2_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.R2_SECRET_ACCESS_KEY,
    hasBucketName: !!process.env.R2_BUCKET_NAME,
    hasMaxBucketSize: !!process.env.R2_MAX_BUCKET_SIZE_MB,
  })
}

// Validate Cloudflare API credentials (required for efficient bucket size checking)
if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
  logger.error("CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required for bucket size checking")
  throw new Error("CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN environment variables are required")
}

// Initialize S3 client for Cloudflare R2
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME || ""

// Validate R2_MAX_BUCKET_SIZE_MB is set (required)
if (!process.env.R2_MAX_BUCKET_SIZE_MB) {
  logger.error("R2_MAX_BUCKET_SIZE_MB environment variable is required but not set")
  throw new Error("R2_MAX_BUCKET_SIZE_MB environment variable is required")
}

const MAX_BUCKET_SIZE_MB = parseInt(process.env.R2_MAX_BUCKET_SIZE_MB, 10)

if (isNaN(MAX_BUCKET_SIZE_MB) || MAX_BUCKET_SIZE_MB <= 0) {
  logger.error("R2_MAX_BUCKET_SIZE_MB must be a positive number", {
    providedValue: process.env.R2_MAX_BUCKET_SIZE_MB,
  })
  throw new Error("R2_MAX_BUCKET_SIZE_MB must be a positive number")
}

// Option to disable bucket size checking to save Class A operations
// Set R2_ENABLE_BUCKET_SIZE_CHECK=false to disable
const ENABLE_BUCKET_SIZE_CHECK = process.env.R2_ENABLE_BUCKET_SIZE_CHECK !== "false"

// Cloudflare API credentials for bucket usage endpoint (required - more efficient than ListObjectsV2)
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!

// Cache for bucket size to avoid expensive operations on every upload
// Cache expires after 15 minutes (longer cache to reduce Class A operations)
interface BucketSizeCache {
  sizeBytes: number
  timestamp: number
}

let bucketSizeCache: BucketSizeCache | null = null
const BUCKET_SIZE_CACHE_TTL = 15 * 60 * 1000 // 15 minutes in milliseconds (reduced from 5 to save operations)

// Cache for presigned URLs to avoid regenerating them (admin downloads)
// Cache expires when URL expires (1 hour default)
interface PresignedUrlCache {
  url: string
  expiresAt: number
}

const presignedUrlCache = new Map<string, PresignedUrlCache>()
const PRESIGNED_URL_CACHE_CLEANUP_INTERVAL = 60 * 60 * 1000 // Clean up expired URLs every hour

/**
 * Upload a file to Cloudflare R2
 * @param file - The file to upload
 * @param objectKey - The unique key/name for the object in R2
 * @returns The object key (which serves as the object ID)
 */
export async function uploadToR2(file: File, objectKey: string): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Body: buffer,
      ContentType: file.type,
    })

    await r2Client.send(command)
    
    // Log R2 Class A operation (PUT)
    logger.r2Operation("ClassA", "File uploaded to R2", {
      objectKey,
      fileSize: file.size,
      fileSizeMB: Math.round((file.size / (1024 * 1024)) * 100) / 100,
      contentType: file.type,
    })
    
    logger.upload("File uploaded successfully to R2", {
      objectKey,
      fileSize: file.size,
      contentType: file.type,
    })
    
    return objectKey
  } catch (error) {
    logger.error("Failed to upload file to R2", error, {
      objectKey,
      fileSize: file.size,
      contentType: file.type,
    })
    throw new Error("Failed to upload file to R2")
  }
}

/**
 * Get a presigned URL for downloading a file from R2
 * Uses caching to avoid regenerating URLs for the same object
 * @param objectKey - The object key/ID in R2
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @param useCache - Whether to use cached URL if available (default: true)
 * @returns A presigned URL that can be used to download the file
 */
export async function getR2PresignedUrl(objectKey: string, expiresIn: number = 3600, useCache: boolean = true): Promise<string> {
  try {
    // Check cache first (only for admin downloads, not for user reads)
    if (useCache) {
      const cached = presignedUrlCache.get(objectKey)
      if (cached && cached.expiresAt > Date.now()) {
        logger.debug("Returning cached presigned URL", {
          objectKey,
          expiresIn: Math.round((cached.expiresAt - Date.now()) / 1000),
        })
        return cached.url
      }
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
    })

    const url = await getSignedUrl(r2Client, command, { expiresIn })
    
    // Cache the URL (presigned URL generation is free, but caching reduces computation)
    if (useCache) {
      presignedUrlCache.set(objectKey, {
        url,
        expiresAt: Date.now() + (expiresIn * 1000) - 60000, // Cache expires 1 minute before URL expires
      })
    }
    
    // Note: Presigned URL generation is FREE (not an R2 operation)
    // The actual GET when URL is used counts as Class B operation
    logger.download("Generated presigned download URL", {
      objectKey,
      expiresIn,
      cached: false,
    })
    
    return url
  } catch (error) {
    logger.error("Failed to generate presigned download URL", error, {
      objectKey,
      expiresIn,
    })
    throw new Error("Failed to generate download URL")
  }
}

/**
 * Generate a presigned PUT URL for direct client uploads to R2
 * R2 doesn't fully support presigned POST, so we use PUT instead
 * @param objectKey - The object key/name for the object in R2
 * @param contentType - The content type of the file
 * @param expiresIn - URL expiration time in seconds (default: 5 minutes)
 * @returns Presigned PUT URL
 */
export async function getR2PresignedPut(
  objectKey: string,
  contentType: string,
  expiresIn: number = 300
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      ContentType: contentType,
    })

    const url = await getSignedUrl(r2Client, command, { expiresIn })
    
    logger.upload("Generated presigned PUT URL for direct upload", {
      objectKey,
      contentType,
      expiresIn,
      url: url.substring(0, 100) + "...", // Log partial URL
      endpoint: process.env.R2_ENDPOINT,
      bucket: BUCKET_NAME,
    })
    
    return url
  } catch (error) {
    logger.error("Failed to generate presigned PUT URL", error, {
      objectKey,
      contentType,
      expiresIn,
    })
    throw new Error("Failed to generate upload URL")
  }
}

/**
 * Generate a presigned POST URL for direct client uploads to R2
 * Note: R2 may have limited support for presigned POST, consider using presigned PUT instead
 * @param objectKey - The object key/name for the object in R2
 * @param contentType - The content type of the file
 * @param maxSizeMB - Maximum file size in MB (default: 10)
 * @param expiresIn - URL expiration time in seconds (default: 5 minutes)
 * @returns Presigned POST data including URL and fields
 */
export async function getR2PresignedPost(
  objectKey: string,
  contentType: string,
  maxSizeMB: number = 10,
  expiresIn: number = 300
): Promise<{ url: string; fields: Record<string, string> }> {
  try {
    const { url, fields } = await createPresignedPost(r2Client, {
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Conditions: [
        ["content-length-range", 0, maxSizeMB * 1024 * 1024], // Max size in bytes
        // Removed Content-Type condition as browser may modify it for multipart/form-data
      ],
      Fields: {
        "Content-Type": contentType,
      },
      Expires: expiresIn,
    })

    // Log the full URL for debugging (it's safe as it's a presigned URL with expiration)
    logger.upload("Generated presigned POST URL for direct upload", {
      objectKey,
      contentType,
      maxSizeMB,
      expiresIn,
      url: url, // Log full URL for debugging
      fields: Object.keys(fields), // Log field names only
      endpoint: process.env.R2_ENDPOINT,
      bucket: BUCKET_NAME,
    })
    
    return { url, fields }
  } catch (error) {
    logger.error("Failed to generate presigned POST URL", error, {
      objectKey,
      contentType,
      maxSizeMB,
      expiresIn,
    })
    throw new Error("Failed to generate upload URL")
  }
}

/**
 * Get the total size of all objects in the R2 bucket using Cloudflare API
 * This uses the bucket usage endpoint which is more efficient than ListObjectsV2
 * and doesn't count as an R2 Class A operation!
 * @param forceRefresh - Force refresh the cache (default: false)
 * @returns Total size in bytes
 */
export async function getBucketSize(forceRefresh: boolean = false): Promise<number> {
  // Return cached value if still valid and not forcing refresh
  if (!forceRefresh && bucketSizeCache) {
    const age = Date.now() - bucketSizeCache.timestamp
    if (age < BUCKET_SIZE_CACHE_TTL) {
      logger.debug("Returning cached bucket size", {
        sizeBytes: bucketSizeCache.sizeBytes,
        sizeMB: Math.round((bucketSizeCache.sizeBytes / (1024 * 1024)) * 100) / 100,
        cacheAge: Math.round(age / 1000),
      })
      return bucketSizeCache.sizeBytes
    }
  }

  // Use Cloudflare API (most efficient - doesn't count as R2 operation)
  // Credentials are required and validated at module load time
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/r2/buckets/${BUCKET_NAME}/usage`,
      {
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      logger.error("Cloudflare API returned error", new Error(errorText), {
        status: response.status,
        statusText: response.statusText,
        accountId: CLOUDFLARE_ACCOUNT_ID,
        bucket: BUCKET_NAME,
      })
      throw new Error(`Cloudflare API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const result = data.result

    // API returns sizes as strings (use BigInt for safety with large numbers)
    const payloadBytes = BigInt(result.payloadSize || "0")
    const metadataBytes = BigInt(result.metadataSize || "0")
    const totalSize = Number(payloadBytes + metadataBytes)

    // Update cache
    bucketSizeCache = {
      sizeBytes: totalSize,
      timestamp: Date.now(),
    }

    const sizeMB = Math.round((totalSize / (1024 * 1024)) * 100) / 100

    logger.info("Bucket size retrieved from Cloudflare API", {
      sizeBytes: totalSize,
      sizeMB,
      objectCount: result.objectCount,
      payloadBytes: payloadBytes.toString(),
      metadataBytes: metadataBytes.toString(),
      maxSizeMB: MAX_BUCKET_SIZE_MB,
      usagePercent: Math.round((sizeMB / MAX_BUCKET_SIZE_MB) * 100 * 100) / 100,
    })

    return totalSize
  } catch (error) {
    logger.error("Failed to get bucket size from Cloudflare API", error, {
      accountId: CLOUDFLARE_ACCOUNT_ID,
      bucket: BUCKET_NAME,
    })
    // If we have a cached value, return it even if expired
    if (bucketSizeCache) {
      logger.warn("Using expired cache due to error", {
        cachedSizeBytes: bucketSizeCache.sizeBytes,
      })
      return bucketSizeCache.sizeBytes
    }
    throw new Error("Failed to get bucket size from Cloudflare API")
  }
}

/**
 * Check if bucket has space for a new upload
 * @param fileSizeBytes - Size of the file to upload in bytes
 * @returns Object with allowed status and current bucket size
 */
export async function checkBucketSpace(fileSizeBytes: number): Promise<{
  allowed: boolean
  currentSizeBytes: number
  currentSizeMB: number
  maxSizeMB: number
  wouldExceed: boolean
}> {
  // Skip check if disabled to save Class A operations
  if (!ENABLE_BUCKET_SIZE_CHECK) {
    logger.debug("Bucket size check disabled, allowing upload", {
      fileSizeBytes,
    })
    return {
      allowed: true,
      currentSizeBytes: 0,
      currentSizeMB: 0,
      maxSizeMB: MAX_BUCKET_SIZE_MB,
      wouldExceed: false,
    }
  }

  const currentSizeBytes = await getBucketSize()
  const currentSizeMB = Math.round((currentSizeBytes / (1024 * 1024)) * 100) / 100
  const maxSizeBytes = MAX_BUCKET_SIZE_MB * 1024 * 1024
  const newSizeBytes = currentSizeBytes + fileSizeBytes
  const wouldExceed = newSizeBytes > maxSizeBytes
  const allowed = !wouldExceed

  // Log bucket size every time checkBucketSpace is called
  const fileSizeMB = Math.round((fileSizeBytes / (1024 * 1024)) * 100) / 100
  const usagePercent = Math.round((currentSizeMB / MAX_BUCKET_SIZE_MB) * 100 * 100) / 100
  
  logger.bucketSize("Bucket space check", {
    currentSizeBytes,
    currentSizeMB,
    fileSizeBytes,
    fileSizeMB,
    maxSizeMB: MAX_BUCKET_SIZE_MB,
    newSizeMB: Math.round((newSizeBytes / (1024 * 1024)) * 100) / 100,
    usagePercent,
    allowed,
    wouldExceed,
  })

  if (!allowed) {
    // Critical log when bucket limit is exceeded
    logger.critical("Bucket size limit exceeded - upload blocked", {
      currentSizeBytes,
      currentSizeMB,
      fileSizeBytes,
      fileSizeMB,
      maxSizeBytes,
      maxSizeMB: MAX_BUCKET_SIZE_MB,
      newSizeBytes,
      newSizeMB: Math.round((newSizeBytes / (1024 * 1024)) * 100) / 100,
      usagePercent,
    })
  }

  return {
    allowed,
    currentSizeBytes,
    currentSizeMB,
    maxSizeMB: MAX_BUCKET_SIZE_MB,
    wouldExceed,
  }
}

/**
 * Invalidate the bucket size cache
 * Call this after successful uploads to keep cache fresh
 */
export function invalidateBucketSizeCache(): void {
  bucketSizeCache = null
  logger.debug("Bucket size cache invalidated")
}

/**
 * Clean up expired presigned URLs from cache
 * Should be called periodically to prevent memory leaks
 */
export function cleanupPresignedUrlCache(): void {
  const now = Date.now()
  let cleaned = 0
  for (const [key, value] of presignedUrlCache.entries()) {
    if (value.expiresAt <= now) {
      presignedUrlCache.delete(key)
      cleaned++
    }
  }
  if (cleaned > 0) {
    logger.debug("Cleaned up expired presigned URLs", { cleaned, remaining: presignedUrlCache.size })
  }
}

// Set up periodic cleanup of expired presigned URLs (only in Node.js environment)
// In serverless environments, this may not persist, but that's okay - cache will be rebuilt
if (typeof process !== "undefined" && typeof setInterval !== "undefined") {
  setInterval(cleanupPresignedUrlCache, PRESIGNED_URL_CACHE_CLEANUP_INTERVAL)
}

/**
 * Generate a unique object key for a document
 * @param candidateId - The candidate ID
 * @param documentType - The type of document
 * @param fileName - The original file name
 * @returns A unique object key
 */
export function generateObjectKey(candidateId: number, documentType: string, fileName: string): string {
  const timestamp = Date.now()
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
  const extension = fileName.split(".").pop()
  return `documents/${candidateId}/${documentType}/${timestamp}-${sanitizedFileName}`
}

