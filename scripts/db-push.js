// Load .env.local so Prisma sees DATABASE_URL when run via npm run db:push
require("dotenv").config({ path: ".env.local" })
require("dotenv").config({ path: ".env" })
const { execSync } = require("child_process")
execSync("npx prisma db push", { stdio: "inherit", env: process.env })
