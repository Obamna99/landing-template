# Landing Page Template

> 📱 **Mobile-First Template** — This app is designed with a mobile-first approach. All components are built to provide an optimal experience on mobile devices first, then progressively enhanced for larger screens.

A modern, animated landing page template built with Next.js 16, React 19, Tailwind CSS 4, and Framer Motion.

## Features

- 📱 **Mobile-First Design** — Built for mobile devices first, scales up beautifully
- ⚡ **Next.js 16** with App Router
- 🎨 **Tailwind CSS 4** for styling
- ✨ **Framer Motion** animations
- 📱 **Fully responsive** design
- 🌍 **RTL support** (Hebrew)
- 🔔 **Toast notifications** for form feedback
- 📊 **Vercel Analytics** ready
- 🎛️ **Interactive Elements** — Toggles, quizzes, and sliders for user engagement

## Getting Started

1. **Install dependencies:**

```bash
npm install
```

2. **Run the development server:**

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles & CSS variables
│   ├── layout.tsx       # Root layout with fonts
│   └── page.tsx         # Landing page entry point
├── components/
│   ├── landing/         # Landing page sections
│   │   ├── header.tsx   # Navigation header
│   │   ├── hero.tsx     # Hero section
│   │   ├── video-section.tsx
│   │   ├── how-it-works.tsx
│   │   ├── about.tsx
│   │   ├── faq.tsx
│   │   ├── lead-form.tsx # Contact form
│   │   └── footer.tsx
│   └── ui/
│       ├── toast.tsx    # Toast component
│       └── toaster.tsx  # Toast provider
├── hooks/
│   └── use-toast.ts     # Toast hook
├── lib/
│   └── utils.ts         # Utility functions (cn)
└── public/              # Static assets
```

## Customization

### Colors & Theme

Edit the CSS variables in `app/globals.css` to customize the color palette:

```css
:root {
  --primary: oklch(0.65 0.18 45);      /* Main brand color */
  --secondary: oklch(0.97 0.01 60);    /* Secondary color */
  --accent: oklch(0.55 0.15 200);      /* Accent color */
  /* ... more variables */
}
```

### Fonts

The template uses the Heebo font for Hebrew/Latin text. Update in `app/layout.tsx`:

```tsx
import { Heebo } from "next/font/google"

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
})
```

### Content

Each landing section is a separate component in `components/landing/`. Edit them to update:

- **Header** - Navigation links and logo
- **Hero** - Main headline and CTA
- **Video Section** - Embedded video content
- **How It Works** - Process/steps section
- **About** - Company/product information
- **Reviews** - Infinite scrolling testimonials carousel (pauses on hover)
- **FAQ** - Frequently asked questions
- **Lead Form** - Contact/signup form
- **Footer** - Footer links and info

> **Note:** All content on this site is in Hebrew (RTL). The reviews section features an infinite scroll marquee with edge fading effects.

## Deployment

### Vercel (Recommended)

```bash
npm run build
```

Deploy with [Vercel](https://vercel.com) for the best Next.js experience.

### Other Platforms

The app can be deployed to any platform supporting Node.js:

```bash
npm run build
npm run start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

MIT
