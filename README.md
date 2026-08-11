# Grupo CISA · Plataforma web

> Repositorio del proyecto web de **Grupo CISA**, desarrolladora inmobiliaria mexicana con 30 años en el mercado. Este repo contiene la **evolución completa** del proyecto, desde la dirección de arte hasta el sitio final.

---

## ¿Qué hay aquí?

Tres versiones del proyecto, una por fase. Cada carpeta se mantiene independiente y se puede deployar por separado.

| Carpeta | Versión | Stack | Estado | Para qué |
|---------|---------|-------|--------|----------|
| [`direction-demo/`](./direction-demo) | Demo de dirección de arte | Vite + React 18 + R3F + Tailwind v4 | **Preservado** (Fase 1) | Prueba visual de las dos direcciones de arte propuestas a CISA. Ya no se desarrolla. |
| [`site-html/`](./site-html) | Sitio final HTML estático | HTML + CSS + JS vanilla | **Demo v2 cerrada** (Fase 2a) | Iteración rápida de copy/visual sin build. Listo para abrir con doble click. |
| [`site-next/`](./site-next) | Sitio final Next.js | Next.js 16 + React 19 + Tailwind v4 + TypeScript | **Listo para deploy** (Fase 2b) | Producción. Mismo contenido que `site-html/` en React con prerender estático. |

---

## La historia

**Fase 1 · Dirección de arte** (`direction-demo/`)
Antes de construir el sitio, se le presentaron a CISA **dos direcciones de arte** para elegir:
- **Levantamiento** (recomendada, la que eligieron) — metáfora del plano arquitectónico que se levanta en volumen. Retícula técnica visible, numeración como en plano, paleta papel/tinta/bronce.
- **Patrimonio** — metáfora del legado familiar. Marfil, verde profundo, latón. Whitespace generoso, bloques centrados.

Se construyó una demo en Vite + React Three Fiber para que la junta pudiera **ver y sentir** la diferencia. La dirección recomendada fue Levantamiento. Esta demo se preserva intacta como referencia histórica.

**Fase 2a · Sitio final HTML estático** (`site-html/`)
Una vez elegida la dirección, se construyó el sitio en **HTML estático** para iterar copy y visual rápidamente. Esta versión:
- Replica el sistema de diseño "Levantamiento" con tokens centrales.
- Tiene 6 páginas navegables: home, su-terreno, desarrollos, inversión, nosotros, contacto.
- Usa Manrope como tipografía principal (no Inter — detector AI-flag lo marca como sobre-usado).
- Logo oficial vectorizado (SVG) integrado en header y footer de todas las páginas.
- Cero emojis, cero glassmorphism, cero testimonios inventados.

**Fase 2b · Sitio final Next.js** (`site-next/`)
Migración del HTML estático a Next.js 16 para producción. Stack:
- Next.js 16.3 (App Router) + React 19
- Tailwind v4 con `@theme` en CSS
- TypeScript estricto
- Manrope + JetBrains Mono vía `next/font/google`
- Build con `--webpack` (Turbopack falla con `lightningcss.win32-x64-msvc.node` en Windows — workaround documentado)
- 7 rutas prerenderizadas como static
- Listo para deploy a Vercel

---

## Decisiones de diseño que no se ven en el código

| Decisión | Por qué |
|----------|---------|
| Manrope en lugar de Inter | Inter está sobre-usado en sitios AI-generated (detector de craft-floor lo flaggea). Manrope es humanista, moderna, optimizada para pantalla. |
| Base 17px en cuerpo, no 16 | Público meta 45-70 años. 17px es más cómodo de leer sin ser exagerado. |
| Cero emojis, cero glassmorphism, cero testimonios inventados | Línea editorial de marca: sólida, técnica, transparente. Cero adornos vacíos. |
| Modalidades asimétricas (1 dark + 3 light) | En lugar de 4 cards iguales, crea jerarquía visual. La ruta principal (Aportación de terreno) domina. |
| Hero "El terreno es el protagonista" | El polígono del terreno domina el hero, el agente es un bloque integrado, no WOW. |
| 5 capas de personalización + 10 pendientes | Sistema de copy documenta todo lo que falta, no se oculta. |

---

## Sistema de diseño

El sistema de diseño fuente de verdad está en:
- [`03-identidad-visual/DESIGN-SYSTEM-CISA.md`](../03-identidad-visual/DESIGN-SYSTEM-CISA.md) — versión completa, 14 secciones.
- En `site-next/`: tokens implementados en `app/globals.css` con `@theme`.
- En `site-html/`: variables CSS en el `:root` de cada página.

**Paleta:**
- Verde institucional: `#1F4D2A` (CTAs, header dark)
- Verde medio: `#2E7D32` (acentos, isotipo)
- Verde claro: `#8BC34A` (highlights, polígono)
- Verde tint: `#E8F5E9` (fondos alternos)
- Neutros: ink-50 → ink-950 (12 niveles)

**Tipografía:** Manrope (sans, 400-800) + JetBrains Mono (mono, metadatos).

**Espaciado:** escala de 4px.

**Motion:** 150-300ms en hover/transiciones, 400-600ms en scroll reveal. Respetar `prefers-reduced-motion`.

---

## Cómo usar este repo

### Si quieres ver el sitio final rápido

Doble click en `site-html/index.html`. Se abre en el navegador sin servidor, sin build.

### Si quieres el sitio en producción

```bash
cd site-next
npm install
npm run build
npm start
```

Abre en `http://localhost:3000`. Ver `site-next/HANDOFF-NEXT.md` para deploy a Vercel.

### Si quieres ver la dirección de arte

```bash
cd direction-demo
npm install
npm run dev
```

Abre en `http://localhost:5173`. Ver `direction-demo/README.md` para detalle.

---

## Pendientes

### Antes de producción

- [ ] **Forms funcionales** — UI lista en las 6 páginas, no envían. Necesitan backend o Formspree/Resend.
- [ ] **ElevenLabs agent** — botón "Hablar con el agente" apunta a WhatsApp. Pendiente conectar widget cuando el agente esté listo.
- [ ] **Validar copy y datos con CISA** — equipos, fotos, números de unidades, aliados, certificaciones siguen siendo placeholders.
- [ ] **Auditoría accesibilidad** — skip link + focus visible listo, falta test con NVDA/VoiceOver.
- [ ] **Screenshots mobile real** — verificados en desktop 1280×900. Falta mobile real en device.
- [ ] **Dominio `grupocisa.mx`** — configurar DNS y SSL en Vercel.

### Post-producción

- [ ] Analytics (Plausible o Umami, privacy-first).
- [ ] CMS para que CISA edite proyectos sin código (Sanity o Contentful).
- [ ] Optimización de imágenes cuando haya renders reales de obra.

---

## Stack consolidado

| Capa | Tecnología | Dónde |
|------|-----------|-------|
| Lenguaje | TypeScript 5 | `site-next/`, `direction-demo/` |
| Framework | Next.js 16 / Vite 6 | según fase |
| UI | React 18/19 | según fase |
| Estilos | Tailwind v4 con `@theme` en CSS | `site-next/`, `direction-demo/` |
| 3D (solo demo) | React Three Fiber + drei | `direction-demo/` |
| Animación (solo demo) | Motion + Lenis + GSAP ScrollTrigger | `direction-demo/` |
| Tipografía | Manrope + JetBrains Mono | vía `next/font/google` en `site-next/`, Google Fonts en `site-html/` |
| Iconos | SVG inline | todo |
| Deploy | Vercel | target principal |

---

## Equipo

- **Alberto Balderas** (ABDev) — dirección, desarrollo, copy.
- **Grupo CISA** — cliente, validaciones, datos.

Plataforma web y dirección de arte desarrolladas por **ABDev** · Ciudad de México · 2026.
