# Scripts

## Submit Wikipedia build and get preview URL

Fills the build form with Wikipedia-themed content and gives you a preview URL to inspect.

**Requirements**

- Dev server running: `npm run dev` (or `pnpm dev`)
- Database configured (Supabase or Neon) so the preview page can load the lead

**Run**

```bash
node scripts/submit-wikipedia-build.mjs
```

**Output**

- Prints something like: `http://localhost:3000/preview/abc-123`
- Open that URL in your browser to see the result and decide what to change

**Customize**

- Edit `scripts/submit-wikipedia-build.mjs`: change `sectionsJson`, `photoUrls`, or contact fields.
- To use another base URL (e.g. staging): `BASE_URL=https://staging.example.com node scripts/submit-wikipedia-build.mjs`

**Photos**

- The script uses free Unsplash image URLs (Wikipedia/books theme). You can replace `WIKIPEDIA_PHOTOS` with your own image URLs.
