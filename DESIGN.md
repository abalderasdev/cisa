# Grupo CISA · DESIGN

> Source of truth: `03-identidad-visual/DESIGN-SYSTEM-CISA.md`. This file is the live working subset that Impeccable references.

## Identity in one line

**Levantamiento.** Architectural drafting aesthetic. The terrain — drawn as a polygon — is the protagonist. The "elevation" of plan-to-volume is the visual metaphor for what CISA does to a piece of land.

## Color

| Token | Hex | Where |
|-------|-----|-------|
| `brand-green-dark` | `#1F4D2A` | Header on dark, primary CTAs, closing band |
| `brand-green` | `#2E7D32` | Acentos, badges, isotipo |
| `brand-green-light` | `#8BC34A` | Highlights, hover, polygon overlay |
| `brand-green-tint` | `#E8F5E9` | Section backgrounds, hero overlays |
| `ink-900` | `#0F1419` | Body text |
| `ink-700` | `#2A2E33` | Secondary text |
| `ink-500` | `#5C636A` | Tertiary, metadata |
| `ink-100` | `#DADCE0` | Borders, separators |
| `ink-50` | `#F2F4F2` | Alternate section bg, subtle hover |
| `paper` | `#FFFFFF` | Default bg |
| `success` | `#16A34A` | "Available" badges |
| `warning` | `#B45309` | "En trámite" / "Preventa" |
| `whatsapp` | `#25D366` | WhatsApp CTA + FAB |

Contrast (all WCAG-passing):
- `brand-green-dark` on white → 9.4:1 (AAA)
- `brand-green` on white → 5.7:1 (AA)
- `ink-900` on white → 18.5:1 (AAA)
- `ink-700` on white → 9.7:1 (AAA)

## Typography

- **Sans:** Manrope (400/500/600/700/800), via Google Fonts
- **Mono:** JetBrains Mono (500/600), for metadata, codes, coordinates
- **Base:** 17px (NOT 16 — audience is 45-70)
- **Hero h1:** `clamp(40px, 7vw, 96px)`, weight 900, line-height 0.95, letter-spacing -0.04em
- **h2:** `clamp(32px, 4.5vw, 56px)`, weight 800, line-height 1.02
- **h3:** 22px, weight 700
- **h4:** 18px, weight 700
- **Body:** 17px, weight 400, line-height 1.65
- **Captions:** 14px, weight 500
- **Labels (uppercase):** 11-12px, weight 600, letter-spacing 0.05em

**Why not Inter:** it's the AI-generated default; detectors flag it as over-used. Manrope is humanist, modern, screen-optimized, equally good for headlines and body.

## Spacing (4px scale)

4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128
(`space-1` through `space-32`)

- Section padding: 72px mobile, 112px desktop
- Container: max 1320px, padding 20/32/48
- Card padding: 24-32px

## Components

### Button (`.btn`)

- `primary` — `brand-green-dark` bg, white text. Max 1 per view.
- `secondary` — transparent bg, `ink-900` border + text
- `secondary--green` — same but with `brand-green-dark`
- `whatsapp` — `#25D366` bg
- `ghost` — no border, subtle
- Sizes: default (48px), `lg` (56px), `xl` (64px)
- Border radius: 8px (NOT pill — institutional, not playful)
- Hover: `translateY(-1px)` + color shift, 150ms
- Active: `scale(0.98)` 100ms
- Focus: 3px `brand-green-light` outline, 3px offset

### Section

- `section` (default): 72-112px vertical padding
- `section--alt`: `bg-section` (#F2F4F2)
- `section--dark`: `bg-dark` (#0A0F0C) for closing band
- `section--cream`: `cream` (#F8F8F4)

### Site header (sticky)

- `position: sticky; top: 0; z-index: 50`
- `rgba(255,255,255,0.85)` + `backdrop-filter: saturate(180%) blur(12px)` — frosted
- 1px bottom border `ink-100`
- Logo left, nav center (5 items), CTA right
- Nav: `display: none` mobile, `flex` at 1024px+
- Links: `ink-700`, hover `brand-green-dark`, 15px weight 500

### Skip link

- `position: absolute; top: -100px`
- Visible on `:focus`, `top: 8px`
- Background `ink-900`, white text

### Form fields

- Border 1.5px `ink-300`, focus `brand-green-dark` + 3px `brand-green-light` ring
- Border radius 8px
- Padding 12px 14px
- Font 16px minimum (avoids iOS zoom)
- Label always visible (not just placeholder)
- Required indicator: red asterisk
- Honeypot field for Formspree spam protection

### Cards

- `card-default`: 1px `ink-100` border, 32px padding, 12px radius
- `card-feature`: 1px `ink-100` border, 24px padding, 12px radius
- `card-development`: image + body + footer, status chip overlay
- No shadow by default; subtle shadow on hover (2px lift)

### Badges (status chips)

- `success` bg/text-10: "Terminada 2025"
- `warning` bg/text-10: "En trámite"
- `info` bg/text-10: "Preventa"
- `danger` bg/text-10: "Vendido"
- Pill (999px radius), 11-12px weight 600 uppercase

### WhatsApp FAB

- Fixed bottom-right
- 56px circle, `whatsapp` color
- Icon: official WhatsApp path
- Hover: scale 1.06 + shadow

## Motion

- Hover transitions: 150ms
- Section reveals: 400-600ms
- Signature (polygon): 800-1000ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Respect `prefers-reduced-motion`

## Layout patterns

- **Hero:** 2-column on desktop (text + polygon), 1-column mobile. Polygon is the signature.
- **Modalidades:** 1 primary (dark bg) + 3 secondary (white). Asymmetric hierarchy.
- **Method (timeline):** 1-2-4 columns responsive. Number big (`brand-green`), label weight 600, time in mono.
- **Proyectos (dev-cards):** 3 columns desktop, 1 mobile. Image + chip + body + stats + CTAs.
- **FAQ:** single-column accordion with `<details>` for accessibility.
- **Closing (dark band):** 3 columns of CTAs + 3 columns of contact info.

## Anti-patterns (never)

- Glassmorphism / `backdrop-blur` with opacity < 80% (the header blur is OK because it's 0.85)
- Gradients on backgrounds (use solid colors only)
- Dramatic shadows (`shadow-2xl` or more)
- Marquees, auto-playing carousels
- Skeleton loaders that flash
- Emojis in UI (allowed only in microcopy with justification)
- Stock photos of families, handshakes, generic skyscrapers
- High-contrast, saturated, or aggressive filters
- Hero with full-bleed background image + text overlay (cliché, low contrast)

## What must be preserved when refining

- The polygon as hero signature — never replace with a stock image
- The "Levantamiento" retícula (`.terrain__bg` grid lines) — it's the brand
- 17px base — don't shrink for "modernity"
- Manrope, not Inter
- No testimonials until CISA provides real ones
- No emojis in UI
- The "Lo que sí / Lo que nunca" asymmetry in `inversion.html` (it's the trust signal)
