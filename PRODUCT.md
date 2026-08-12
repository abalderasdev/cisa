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

## Reference files in this repo

- **`DESIGN.md`** — design system, tokens, components, anti-patterns (the visual authority)
- **`COPY.md`** — copy system: voice, banned words, microcopy rules, 7 desire blocks, QA checklist (the verbal authority)
- `02-copy/SISTEMA-COPY-ABDEV.md` — full copy method source
- `02-copy/COPY-Home-y-SuTerreno.md` — full home + su-terreno copy drafts

Impeccable: when iterating copy, **COPY.md wins on voice and message decisions**; PRODUCT.md wins on durable product and audience decisions; DESIGN.md wins on visual decisions.

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

For the full breakdown see `PENDIENTES-WEB.md` in this repo.

**Dentro del alcance (sí se hace):**

- Formularios con **memoria persistente en `localStorage`** y **envío por WhatsApp** (sin backend, sin Formspree). Borrador que sobrevive cierre de pestaña; botón final abre `wa.me/525517964940?text=<campos etiquetados>`.
- SEO técnico básico: retirar `noindex`, sitemap, meta descriptions, schema.org, OG/Twitter cards.
- Avance de obra con fotos fechadas (estructura lista, contenido placeholder).
- Inventario destacado en home.
- Accesibilidad WCAG AA: contraste, foco visible, navegación por teclado, ARIA, skip link.
- 12 artículos de contenido orgánico (Módulo 6) — 8 para dueños de terreno, 4 para compradores.
- Blog estático en HTML con `/contenido` y `/contenido/[slug]`.

**Fuera del alcance (NO se hace en este proyecto):**

- **Herramientas de cálculo de viabilidad** de terreno en aportación (estimador de metros construibles, plusvalía, retorno). Prohibido por riesgo legal y comercial; documentado en mensaje maestro.
- **CMS** para que CISA edite contenido sin código. Cero backend. Alberto/ABDev itera el HTML.
- **Agente ElevenLabs en producción**. El botón apunta a WhatsApp. Estructura lista para conectar después.
- **Autenticación de usuarios / área privada**.
- **E-commerce / pagos en línea** (el CTA final es siempre WhatsApp o contacto con asesor).
- **Multi-idioma** (solo español México).

**Bloqueado por CISA (cliente):** nombres reales del equipo, fotos, testimonio de propietario, datos reales de proyectos, aliados confirmados, certificación ISO alcance real, año de fundación, estados de operación, renders, brochure, correo en dominio propio.

**Bloqueado por Alberto (tú):** decidir si se va con Formspree vs patrón memoria + WhatsApp, aprobar el logo cuando se necesite, auditoría accesibilidad con NVDA/VoiceOver, screenshot mobile real en device, decisión sobre subdominio `cisa.abdev.click`, política de retención de borradores.
