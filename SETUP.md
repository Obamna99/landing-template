# Landing Template - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Your Site

#### Edit `lib/config.ts` to customize:
- Business name, tagline, description
- Contact information (phone, email, address, WhatsApp)
- Social media links
- All text content for every section
- FAQ questions and answers
- Stats and social proof numbers
- SEO metadata

**No need to edit individual components - all text comes from the config file!**

### 3. Set Up Database

#### Option A: Supabase (Recommended for Production) 🌟

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **Project Settings > API** and copy your URL and anon key
3. Create `.env.local` with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Run this SQL in Supabase SQL Editor (see full script below)

#### Option B: Neon (PostgreSQL) 🌐

You can use [Neon](https://neon.tech) (serverless Postgres) instead of Supabase:

1. Create a free project at [neon.tech](https://neon.tech)
2. Copy the connection string from the dashboard (use the **pooled** connection for serverless)
3. Create `.env.local` with:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
   ```
4. Run:
   ```bash
   npm run db:push
   npm run db:seed
   ```
   This creates the tables and seeds sample reviews.

**Note:** If both Supabase and `DATABASE_URL` (Postgres) are set, the app uses Supabase. Use only one.  
If you use **only Supabase** and don’t set `DATABASE_URL`, `prisma generate` (and thus `npm run build`) may fail; set a placeholder in `.env` if needed, e.g. `DATABASE_URL="postgresql://localhost/dummy"` — the app will still use Supabase for data.

### 4. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database - Choose one:
# Option 1: Supabase (recommended)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Option 2: Neon (or any Postgres) - use pooled connection string from Neon dashboard
# DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"

# Admin Authentication
ADMIN_PASSWORD="your-secure-password"
JWT_SECRET="your-jwt-secret-key-at-least-32-characters-long"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Amazon SES (optional - for email campaigns + lead notifications)
# When set: campaign sends work in admin; new leads trigger a notification email to site contact.
# When missing: admin shows "Email not configured" and send is disabled; no lead notification.
AWS_REGION="eu-west-1"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
SES_FROM_EMAIL="noreply@yourdomain.com"   # Must be verified in SES
```

---

## 🗄️ Supabase Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_type TEXT,
  business_size TEXT,
  urgency TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscribers table
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  business_type TEXT,
  business_size TEXT,
  source TEXT,
  status TEXT DEFAULT 'active',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  image_url TEXT,
  result TEXT,
  result_label TEXT,
  featured BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT TRUE,
  active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings (section visibility, etc.)
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies (public can submit leads, read reviews)
CREATE POLICY "Allow public insert on leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on subscribers" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on reviews" ON reviews FOR SELECT USING (active = true);
CREATE POLICY "Allow public read on site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public write on site_settings" ON site_settings FOR ALL WITH CHECK (true);

-- Insert sample reviews
INSERT INTO reviews (name, role, company, content, rating, result, result_label, active, display_order) VALUES
('Sarah Cohen', 'Marketing Director', 'TechFlow', 'Working with this team transformed our digital presence. Results exceeded expectations.', 5, '+340%', 'Traffic Growth', true, 1),
('David Levi', 'CEO', 'ScaleUp Inc', 'Professional, responsive, and truly understand business growth. Highly recommended.', 5, '52', 'Monthly Leads', true, 2),
('Maya Goldberg', 'Founder', 'InnovateCo', 'From strategy to execution, they delivered exactly what we needed. Game changer.', 5, '4.2x', 'ROI', true, 3);
```

#### Option B (Neon): Create tables with Prisma

If you're using Neon (or any Postgres via `DATABASE_URL`), run:

```bash
npm run db:push
npm run db:seed
```

No SQL needed — the schema is in `prisma/schema.prisma`.

---

#### Generate a bcrypt password hash:
```bash
# Using Node.js
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10))"

# Or use an online bcrypt generator
```

### 4. Initialize Database
```bash
# Push schema to database
npm run db:push

# Seed with sample reviews
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

---

## 📧 Amazon SES Setup (Email Campaigns)

To enable email campaigns from the admin dashboard, you need to set up Amazon SES:

### Step 1: Create an AWS Account
1. Go to [aws.amazon.com](https://aws.amazon.com) and create an account
2. Log into the AWS Management Console

### Step 2: Verify Your Domain or Email in SES

#### Option A: Verify a Domain (Recommended for production)
1. Open the [Amazon SES Console](https://console.aws.amazon.com/ses)
2. Choose your region (e.g., `eu-west-1` for Ireland)
3. Go to **Verified identities** → **Create identity**
4. Choose **Domain** and enter your domain name
5. Follow the instructions to add DNS records to your domain
6. Wait for verification (usually a few minutes to hours)

#### Option B: Verify an Email Address (For testing)
1. Go to **Verified identities** → **Create identity**
2. Choose **Email address**
3. Enter your email address
4. Click the verification link sent to that email

### Step 3: Create IAM Credentials

1. Open the [IAM Console](https://console.aws.amazon.com/iam)
2. Go to **Users** → **Add users**
3. Enter a username (e.g., `ses-email-sender`)
4. Select **Programmatic access**
5. Click **Next: Permissions**
6. Choose **Attach policies directly**
7. Search for and select **AmazonSESFullAccess**
8. Complete the user creation
9. **Copy the Access Key ID and Secret Access Key** (you won't see these again!)

### Step 4: Update Environment Variables

```env
AWS_REGION="eu-west-1"           # Your SES region
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
SES_FROM_EMAIL="hello@yourdomain.com"  # Must be verified!
```

### Step 5: Exit Sandbox Mode (For Production)

By default, SES is in "sandbox mode" which limits you to sending only to verified emails.

To send to any email address:
1. Go to the SES Console → **Account dashboard**
2. Click **Request production access**
3. Fill out the form explaining your use case
4. Wait for AWS approval (usually 24-48 hours)

### Troubleshooting SES

| Issue | Solution |
|-------|----------|
| "Email address is not verified" | Verify the `SES_FROM_EMAIL` address in SES Console |
| "Sending denied" | Check if you're in sandbox mode; verify recipient emails |
| "Access Denied" | Check IAM permissions for your access key |
| Emails going to spam | Set up SPF, DKIM, and DMARC records for your domain |

### Testing SES from local

1. **Set `.env`** (restart dev server after changes):
   ```env
   AWS_REGION="eu-west-1"
   AWS_ACCESS_KEY_ID="your-access-key"
   AWS_SECRET_ACCESS_KEY="your-secret-key"
   SES_FROM_EMAIL="noreply@yourdomain.com"   # Must be verified in SES
   ```
2. **SES Sandbox:** In sandbox mode you can only send **to** verified addresses. In SES Console → Verified identities, add the **recipient** email (e.g. your personal Gmail) as a verified identity so you can receive test emails.
3. **Admin → Email tab:** Use **"שלח מייל בדיקה"** (Send test email): enter an email address and click the button. Check that inbox (and spam). No database or subscribers needed.
4. **Contact form:** With DB and SES configured, submit the contact form on the landing page. A lead is created and a notification email is sent to `siteConfig.contact.email`. That recipient must be verified in SES if in sandbox.
5. **Campaigns:** Need at least one active subscriber (e.g. submit the contact form once so the email is added as a subscriber). Then Admin → Email → fill campaign fields and send. Again, in sandbox all recipients must be verified.

---

## 🔧 Configuration Reference

### `lib/config.ts` Sections

| Section | Description |
|---------|-------------|
| `siteConfig` | Basic site info, contact, social links, branding |
| `heroConfig` | Hero section headline, subheadline, CTAs |
| `howItWorksConfig` | Process steps with icons and descriptions |
| `aboutConfig` | Company story, founder info, timeline |
| `reviewsConfig` | Reviews section text and case study |
| `videoConfig` | Video section with YouTube embed |
| `faqConfig` | FAQ questions and answers |
| `contactConfig` | Contact form labels and messages |
| `footerConfig` | Footer links and copyright |
| `headerConfig` | Navigation links and CTA button |
| `floatingCtaConfig` | Mobile floating button settings |
| `seoConfig` | SEO title, description, keywords |
| `emailConfig` | Email templates and settings |
| `transformationConfig` | Before/After section |
| `trustBadgesConfig` | Client logos section |

---

## 📊 Admin Dashboard

Access at: `/admin`

### Features
- **Dashboard**: View stats (leads, reviews, subscribers)
- **Reviews**: Toggle active/featured, edit, delete reviews
- **Leads**: View contact form submissions
- **Email**: Send campaigns to subscribers via SES

### Default Credentials
Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env`

---

## 📁 Database Commands

```bash
# Push schema changes to database
npm run db:push

# Seed database with sample data
npm run db:seed

# Reset database (warning: deletes all data)
npm run db:reset

# Open Prisma Studio (database GUI)
npm run db:studio
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

### Environment Variables for Production

Update these for production:
```env
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
DATABASE_URL="file:./prisma/prod.db"  # Or use a cloud database
```

### Database Options for Production

| Provider | Type | Notes |
|----------|------|-------|
| **Turso** | SQLite Cloud | Same schema, just change `DATABASE_URL` |
| **PlanetScale** | MySQL | Change provider in `schema.prisma` |
| **Supabase** | PostgreSQL | Change provider in `schema.prisma` |
| **Neon** | PostgreSQL | Serverless, free tier available |

---

## 📂 Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard
│   │   ├── login/          # Login page
│   │   └── components/     # Dashboard components
│   ├── api/
│   │   ├── admin/          # Admin API routes (login, email)
│   │   ├── leads/          # Leads API
│   │   └── reviews/        # Reviews API
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main landing page
├── components/
│   ├── landing/            # Landing page sections
│   │   ├── hero.tsx
│   │   ├── about.tsx
│   │   ├── how-it-works.tsx
│   │   ├── reviews.tsx
│   │   ├── faq.tsx
│   │   ├── lead-form.tsx
│   │   ├── footer.tsx
│   │   └── ...
│   └── ui/                 # UI components (toast, etc.)
├── lib/
│   ├── config.ts           # ⭐ MAIN CONFIG FILE - Edit this!
│   ├── auth.ts             # Authentication utilities
│   ├── db.ts               # Prisma database client
│   ├── email.ts            # Email service (SES)
│   └── utils.ts            # Helper utilities
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Seed script
│   └── dev.db              # SQLite database file
└── .env                    # Environment variables
```

---

## 🔒 Security Checklist

- [ ] Change `ADMIN_USERNAME` from default
- [ ] Use a strong, bcrypt-hashed `ADMIN_PASSWORD`
- [ ] Set a random 32+ character `JWT_SECRET`
- [ ] Use HTTPS in production
- [ ] Verify SES email/domain ownership
- [ ] Request SES production access before launch
- [ ] Review and customize all text in `lib/config.ts`

---

## 🎨 Customization Tips

### Change Theme Colors
Edit the gradient classes in components (e.g., `from-teal-600 to-teal-500`) or update Tailwind config.

### Add New Sections
1. Create a new component in `components/landing/`
2. Import and add it to `app/page.tsx`
3. Add relevant config to `lib/config.ts`

### Modify Form Fields
Edit `components/landing/lead-form.tsx` and update the `Lead` model in `prisma/schema.prisma`.

### Change Language/Direction
Update `siteConfig.locale` and `siteConfig.direction` in `lib/config.ts`.

---

## 🤝 API Reference

### Public Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reviews` | GET | Fetch active reviews |
| `/api/leads` | POST | Submit contact form |

### Protected Endpoints (Require Auth)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/login` | POST | Admin login |
| `/api/admin/logout` | POST | Admin logout |
| `/api/admin/session` | GET | Check auth status |
| `/api/leads` | GET | Fetch all leads |
| `/api/reviews` | POST | Create review |
| `/api/reviews/[id]` | PATCH | Update review |
| `/api/reviews/[id]` | DELETE | Delete review |
| `/api/admin/email` | POST | Send email campaign |
| `/api/admin/email` | GET | Fetch email history |
