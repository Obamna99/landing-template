# Site Animation Plan (Executed)

Inspiration from: Framer Motion docs, scroll-triggered patterns (useScroll/useTransform), blur-reveal and stagger best practices.

## 1. Hero

- **Parallax background blobs**: `useScroll` on the hero section with `offset: ["start start", "end start"]`; `useTransform(scrollYProgress, [0, 1], ["0%", "25%"]` etc. applied to each blob’s `y` so they move at different speeds on scroll (depth effect).
- **Blur headline reveal**: Headline container animates from `opacity: 0, filter: "blur(12px)"` to `opacity: 1, filter: "blur(0px)"` with ~0.6s duration. Subheadline has a separate blur + `y` reveal with delay.
- **Feature cards**: Added `whileHover={{ y: -4 }}` and `hover:shadow-lg` for a light lift on hover.

## 2. Section scroll reveals

- **Shared variants**: Added `lib/animation-variants.ts` with `fadeUp`, `fadeUpStaggerContainer`, `fadeUpStaggerItem`, `viewportOnce` for reuse (sections already use `useInView` + manual variants).
- **About**: Trust cards use `whileHover={{ y: -6 }}` and `transition-shadow` for hover lift.
- **Video**: Section header uses blur-in on badge and headline (`filter: "blur(8px)"` → `blur(0)`); highlight cards have staggered entrance and `whileHover={{ y: -4 }}`.
- **How It Works**: Desktop step cards use `whileHover={{ y: -4 }}`.
- **FAQ**: Question items use a subtle blur-in (`blur(4px)` → `blur(0)`) with staggered delay (0.15 + index * 0.07).
- **Transformation**: Story tab buttons get staggered entrance and `whileHover={{ y: -2 }}`.
- **TrustBadges**: Certification pills get `whileHover={{ scale: 1.04, y: -2 }}` and slightly tuned stagger timing.

## 3. Micro-interactions

- Hero feature cards, About trust items, Video highlights, HowItWorks cards: hover lift (`y: -4` to `-6`) and shadow transition.
- FAQ items: blur-in on scroll into view.
- Transformation story tabs: entrance stagger + hover lift.
- TrustBadges certs: scale + lift on hover.

## 4. Technical notes

- **Parallax**: Hero ref + `useScroll({ target: heroRef })`; each blob gets a `useTransform` for `y`; blobs are `motion.div` with `style={{ y: blobStyles[index] }}`.
- **Blur**: Framer Motion’s `filter` is animated (e.g. `blur(12px)` → `blur(0px)`). Use sparingly for key headlines/CTAs.
- **Stagger**: Delays like `0.15 + index * 0.07` or `0.35 + index * 0.06` for lists; parent `whileInView` or `isInView` drives visibility.
- **Performance**: All animations use CSS transforms and opacity; `will-change` already on blobs. No layout thrashing.

## Files changed

- `components/landing/hero.tsx` – parallax blobs, blur headline/subheadline, feature card hover
- `components/landing/about.tsx` – trust card hover lift
- `components/landing/video-section.tsx` – header blur reveal, highlight cards stagger + hover
- `components/landing/how-it-works.tsx` – step card hover lift
- `components/landing/faq.tsx` – FAQ item blur-in + stagger
- `components/landing/transformation.tsx` – story tab stagger + hover
- `components/landing/trust-badges.tsx` – cert pill hover + stagger ease
- `lib/animation-variants.ts` – shared variants (for future use)
