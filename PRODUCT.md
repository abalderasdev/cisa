# Grupo CISA · PRODUCT

## What it is

**Web platform for Grupo CISA**, a Mexican real estate developer with 30 years in the market. The site tells three audiences (terrain owners, capital investors, press/recruiters) what CISA does and gives each a direct, honest way to start a conversation.

## Who it's for

| Audience | What they need | Primary CTA |
|----------|---------------|-------------|
| **Terrain owner 45-70** with idle land | A third option between selling cheap and waiting indefinitely. Wants to know if their land has development potential without committing. | Precalificar mi terreno |
| **Capital investor** with money to deploy | A project, not an instrument. Project-by-project documentation, no generic returns promised. | Ver proyectos abiertos |
| **Press, recruiter, ally** | Quick contact, real names, real context. | Form general / WhatsApp |

The lead is a *terrain owner*. The product prioritizes them. Capital comes second. Press is incidental.

## Core message

> "Vender un terreno es una operación. Desarrollarlo, un negocio."

The site is built around this third option: **aportar el terreno** to a development, keep participation, get built meters.

## Voice (anti-patterns to avoid)

- "Inversión segura", "rendimiento garantizado", "oportunidad única" — NEVER
- Testimonials without real name + photo + date — NEVER
- Stock photos of skyscrapers, families, handshakes — NEVER
- Emojis in UI copy — NEVER
- Glassmorphism, neon, dramatic shadows — NEVER

## Constraints

- **Readability for 45-70 age:** 17px base, high contrast, clear hierarchy
- **Honest copy:** every claim must be verifiable; placeholder data is labeled
- **Multi-audience without fragmentation:** same home, different paths
- **Mobile-first:** the lead audience decides from a phone
- **Vercel serves HTML static** (no build step) for fast iteration

## How success looks like

- A terrain owner with idle land reaches the precalificacion form in ≤ 3 clicks from home
- An investor reads the methodology (8 stages with time) and trusts it because it's specific
- Press finds a real name and a real number to call
- Forms reach CISA's commercial team in < 48 business hours
- Vercel serves with no build, deploy on every push to main

## What is NOT in scope

- Forms actually sending data (placeholder ready, needs Formspree config)
- ElevenLabs agent widget (button points to WhatsApp)
- CMS for CISA to edit projects without code
- Real photos, real team names, real testimonials (all placeholders, awaiting client input)
- Analytics, SEO sitemap, schema.org
