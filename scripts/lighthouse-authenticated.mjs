#!/usr/bin/env node
/**
 * Run Lighthouse on /admin (after login) and /build (after client auth if BUILD_CLIENT_TOKEN set).
 * Requires: server running, .env.local with ADMIN_USERNAME, ADMIN_PASSWORD.
 * Optional: BUILD_CLIENT_TOKEN for /build when protected.
 */
import { spawnSync } from "child_process"
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "fs"
import { tmpdir } from "os"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { config } from "dotenv"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

config({ path: join(root, ".env.local") })

const BASE = process.env.SITE_URL?.replace(/\/$/, "") || "http://localhost:3000"

function parseSetCookie(header) {
  if (!header) return null
  const match = header.match(/admin_token=([^;]+)/)
  return match ? match[1].trim() : null
}

function parseClientBuildCookie(header) {
  if (!header) return null
  const match = header.match(/client_build_token=([^;]+)/)
  return match ? match[1].trim() : null
}

async function getAdminCookie() {
  const username = process.env.ADMIN_USERNAME || "admin"
  const password = process.env.ADMIN_PASSWORD || "admin123"
  const res = await fetch(`${BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    redirect: "manual",
  })
  const setCookie = res.headers.get("set-cookie")
  const token = parseSetCookie(setCookie)
  if (!token) throw new Error("Admin login failed: no admin_token cookie")
  return token
}

async function getBuildCookie() {
  const token = process.env.BUILD_CLIENT_TOKEN
  if (!token) return null
  const res = await fetch(`${BASE}/api/client/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: token.trim() }),
    redirect: "manual",
  })
  const setCookie = res.headers.get("set-cookie")
  return parseClientBuildCookie(setCookie)
}

function runLighthouse(url, cookieValue, outputPath) {
  let tempDir = null
  if (cookieValue) {
    tempDir = mkdtempSync(join(tmpdir(), "lh-"))
    const headersPath = join(tempDir, "headers.json")
    writeFileSync(headersPath, JSON.stringify({ Cookie: cookieValue }))
  }
  const args = [
    "lighthouse",
    url,
    "--output=json",
    `--output-path=${outputPath}`,
    "--chrome-flags=--headless=new --no-sandbox",
    "--only-categories=performance",
    "--quiet",
  ]
  if (tempDir) args.push(`--extra-headers=${join(tempDir, "headers.json")}`)
  const r = spawnSync("npx", ["-y", ...args], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  })
  if (tempDir) {
    try { rmSync(tempDir, { recursive: true }) } catch {}
  }
  return r.status === 0
}

function getScore(jsonPath) {
  try {
    const data = JSON.parse(readFileSync(jsonPath, "utf8"))
    const score = data.categories?.performance?.score
    return score != null ? Math.round(score * 100) : null
  } catch {
    return null
  }
}

async function main() {
  console.log("Base URL:", BASE)
  console.log("Fetching admin cookie...")
  const adminToken = await getAdminCookie()
  console.log("Admin cookie obtained.")
  const adminCookieStr = `admin_token=${adminToken}`

  const adminPath = join(root, "lighthouse-admin.json")
  console.log("Running Lighthouse on /admin...")
  runLighthouse(`${BASE}/admin`, adminCookieStr, adminPath)
  const adminScore = getScore(adminPath)
  console.log("Admin performance score:", adminScore ?? "N/A")

  const buildPath = join(root, "lighthouse-build.json")
  const buildToken = await getBuildCookie()
  const buildCookieStr = buildToken ? `client_build_token=${buildToken}` : null
  if (buildToken) console.log("Build cookie obtained.")
  console.log("Running Lighthouse on /build...")
  runLighthouse(`${BASE}/build`, buildCookieStr, buildPath)
  const buildScore = getScore(buildPath)
  console.log("Build performance score:", buildScore ?? "N/A")

  console.log("\n--- Results ---")
  console.log("/admin:", adminScore)
  console.log("/build:", buildScore)
  process.exit(adminScore !== null && buildScore !== null && adminScore >= 93 && buildScore >= 93 ? 0 : 1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
