# Grupo CISA · Web Next.js · Handoff

> Migración del demo HTML estático (`web-demo-v2/`) a Next.js 16 (App Router) + Tailwind v4 + TypeScript. Listo para deploy en Vercel.

---

## 1. Qué se entregó

Seis páginas navegables, mismas rutas que el demo estático:

| Ruta | Archivo | Equivalente en demo v2 |
|------|---------|------------------------|
| `/` | `app/page.tsx` | `index.html` |
| `/su-terreno` | `app/su-terreno/page.tsx` | `su-terreno.html` |
| `/desarrollos` | `app/desarrollos/page.tsx` | `desarrollos.html` |
| `/inversion` | `app/inversion/page.tsx` | `inversion.html` |
| `/nosotros` | `app/nosotros/page.tsx` | `nosotros.html` |
| `/contacto` | `app/contacto/page.tsx` | `contacto.html` |

Más layout principal y 4 componentes compartidos:

- `app/layout.tsx` — root con header, footer, FAB, skip link, fuentes
- `components/SiteHeader.tsx` — header sticky con logo oficial + nav + CTA
- `components/SiteFooter.tsx` — footer 4 columnas en dark
- `components/WhatsAppFAB.tsx` — botón flotante de WhatsApp
- `components/SkipLink.tsx` — skip a `#main` para accesibilidad

Las 7 rutas (6 páginas + 404) están **prerenderizadas como static** en build. `next start` las sirve en milisegundos.

---

## 2. Stack

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | **Next.js 16.3** con App Router | Última estable, prerender estático, deploy trivial en Vercel |
| Lenguaje | **TypeScript 5** | Tipado fuerte, menos bugs |
| Estilos | **Tailwind v4** con `@theme` en CSS | Config inline, sin tailwind.config.js, rápido |
| Tipografía | **Manrope + JetBrains Mono** vía `next/font/google` | Auto-hospedaje, sin layout shift, swap |
| Iconos | **Lucide** (pendiente instalar) o SVG inline | Sin emoji, control de stroke y tamaño |
| Deploy target | **Vercel** | ABDev ya tiene otros proyectos ahí |

---

## 3. Sistema de diseño aplicado

**Fuente de verdad:** `C:\Users\abald\.abm\CISA\CISA_\03-identidad-visual\DESIGN-SYSTEM-CISA.md`

Tokens definidos en `app/globals.css` con `@theme`:

- Paleta de marca: `--color-brand-green-dark` (#1F4D2A), `--color-brand-green` (#2E7D32), `--color-brand-green-light` (#8BC34A), `--color-brand-green-tint` (#E8F5E9)
- Neutros: `--color-ink-{50…950}` (12 niveles)
- Estados: `--color-success`, `--color-warning`, `--color-danger`, `--color-info`
- WhatsApp: `--color-whatsapp` (#25D366)
- Tipografía: `--font-sans` (Manrope), `--font-mono` (JetBrains Mono)
- Base 17px (no 16) por público 45-70

Componentes base replicados del demo:
- `.btn` + variantes (`--primary`, `--secondary`, `--secondary--green`, `--whatsapp`, `--ghost`, `--lg`, `--xl`)
- `.container` (max 1320px, padding responsive)
- `.section` con modificadores `--alt`, `--dark`, `--cream`
- `.site-header` sticky con blur sutil
- `.skip-link` para accesibilidad

Estilos específicos de cada página van con `<style>{...}</style>` al final del componente o inline en `style={{}}`. No usé CSS Modules para evitar overhead en este tamaño de proyecto.

---

## 4. Cómo correrlo

### Local

```bash
cd "C:\Users\abald\.abm\CISA\CISA_\web-demo-next"
npm install        # solo la primera vez
npm run dev        # dev server en http://localhost:3000
```

### Build de producción

```bash
npm run build      # genera .next/ optimizado
npm start          # sirve el build en :3000
```

### Tomar screenshots (referencia)

```bash
node shot.js preview    # genera preview/next-{home,su-terreno,...}.png
```

`shot.js` ya está en el root del proyecto.

---

## 5. Deploy a Vercel

### Opción A · Git + Vercel Dashboard (recomendado)

1. Crear repo en GitHub: `abalderasdev/grupocisa-web`
2. Subir el contenido de `web-demo-next/` (sin `node_modules`, `.next`, `preview`)
3. Conectar repo en Vercel dashboard
4. Configurar:
   - Framework: Next.js (autodetectado)
   - Build command: `npm run build` (default)
   - Output: `.next` (default)
   - Root: `.` (default)
5. Deploy

### Opción B · CLI

```bash
npm i -g vercel
cd "C:\Users\abald\.abm\CISA\CISA_\web-demo-next"
vercel              # primer deploy (preview)
vercel --prod       # promover a producción
```

### Dominio personalizado

En Vercel dashboard: Settings → Domains → agregar `grupocisa.mx` (y `www.`).

DNS: configurar A record a `76.76.21.21` o CNAME a `cname.vercel-dns.com` en el registrador del dominio.

### HTTPS

Vercel lo maneja automático con cert Let's Encrypt.

---

## 6. Lo que SÍ está vs lo que NO está

### Sí está

- 6 páginas con copy idéntico al demo v2
- Header sticky, footer 4 columnas, WhatsApp FAB
- Logo oficial vectorizado (SVG) en header y footer
- Sistema de diseño aplicado (paleta, tipografía, escala, motion)
- Skip link para accesibilidad
- Responsive mobile-first
- Metadata y Open Graph por página
- Theme color (#1F4D2A) configurado vía `viewport` export
- Build limpio, 7 rutas estáticas
- Screenshot de las 6 páginas

### NO está (próximas iteraciones)

| Falta | Por qué | Prioridad |
|-------|---------|-----------|
| **Forms funcionales** | UI lista, no envían. Necesitan backend o servicio tipo Formspree/Resend | Alta |
| **ElevenLabs agent embebido** | Solo el botón "Hablar con el agente" apunta a WhatsApp. Pendiente conectar widget | Media |
| **Google Analytics / Plausible** | No tracking aún | Media |
| **CMS para que CISA edite proyectos** | Por ahora el copy está en el código. Migrar a Sanity/Contentful para no-technical editing | Baja |
| **Refactor a CSS Modules** | Inline `<style>` y `style={{}}` funciona pero es verboso. Aceptable en este tamaño | Baja |
| **Verificación responsive en device real** | Screenshots tomados en 1280x900 desktop. Falta mobile real | Media |
| **Auditoría accesibilidad** | Skip link + focus visible, pero falta test con NVDA/VoiceOver | Media |
| **Datos placeholder confirmados con CISA** | Equipos, fotos, aliados, números de unidades, certificaciones siguen siendo placeholders | Alta |

---

## 7. Decisiones técnicas importantes

| Decisión | Razón |
|----------|-------|
| **Build con `--webpack`** | Turbopack da error con `lightningcss.win32-x64-msvc.node` en este Windows. Webpack es estable. Ver `package.json`. |
| **Tailwind v4 con `@theme` en CSS** | Nueva sintaxis oficial, sin `tailwind.config.js`. Más rápido, menos config. |
| **Inline `<style>` + `style={{}}` en lugar de CSS Modules** | En este tamaño (6 páginas, ~200 líneas de CSS único) es más legible. Refactor a Modules solo si crece. |
| **Componentes compartidos mínimos** (4) | Solo lo que se repite: header, footer, FAB, skip link. El resto vive en cada page.tsx. |
| **Sin librería de íconos** | SVG inline copy-paste del demo. Funciona. Si crece, instalar `lucide-react`. |
| **Static export (prerender)** | Las 6 páginas no necesitan ser dinámicas. Más rápido y barato en Vercel. |
| **Metadata + Viewport separados** | Next 16 lo exige. `themeColor` y `colorScheme` van en `viewport`, el resto en `metadata`. |

---

## 8. Estructura del proyecto

```
C:\Users\abald\.abm\CISA\CISA_\web-demo-next\
├── app/
│   ├── layout.tsx              Root: fuentes, header, footer, FAB
│   ├── page.tsx                Home (9 bloques)
│   ├── globals.css             Tokens del sistema + reset + base
│   ├── su-terreno/page.tsx     Aportación de terreno (página estrella)
│   ├── desarrollos/page.tsx    3 proyectos + filtros + 4 líneas
│   ├── inversion/page.tsx      Participación en proyectos + 5 pasos + form
│   ├── nosotros/page.tsx       Empresa + 8 etapas + equipo + aliados
│   └── contacto/page.tsx       3 canales + form general
├── components/
│   ├── SiteHeader.tsx
│   ├── SiteFooter.tsx
│   ├── WhatsAppFAB.tsx
│   └── SkipLink.tsx
├── public/
│   ├── logo-grupo-cisa.svg         Logo oficial
│   └── logo-grupo-cisa-dark.svg    Mismo SVG (preparado para inversión)
├── preview/
│   ├── next-home.png
│   ├── next-su-terreno.png
│   ├── next-desarrollos.png
│   ├── next-inversion.png
│   ├── next-nosotros.png
│   └── next-contacto.png
├── shot.js                    Script Playwright para screenshots
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── HANDOFF-NEXT.md            Este archivo
└── .next/                     Build output (no commitear)
```

---

## 9. Comparación con el demo v2

| Aspecto | Demo v2 (HTML) | Next.js v1 |
|---------|----------------|------------|
| Páginas | 6 HTML estáticos | 6 React con prerender estático |
| CSS | Inline en cada HTML | Centralizado en `globals.css` con tokens |
| Componentes compartidos | Duplicados en cada HTML | Una vez en `components/` |
| Build | Ninguno (doble click) | `npm run build` (~3s) |
| Deploy | Cualquier static host | Vercel (gratis) o cualquier Node host |
| SEO | Manual | `metadata` API + Open Graph por página |
| Forms | JS simulado, no envía | UI lista, pendiente backend |
| Mantenimiento | Editar 6 archivos | Editar 1 |
| Iteración copy | Rápida (1 archivo) | Rápida (1 archivo) |
| Iteración diseño | Lenta (6 archivos) | Rápida (tokens centralizados) |

**Decisión recomendada:** mantener el demo v2 como referencia visual rápida (doble click para abrir), usar Next.js para producción real.

---

## 10. Pendientes priorizados

### Ahora (esta semana)

- [ ] Validar el build con Alberto
- [ ] Conectar a repo GitHub
- [ ] Deploy a Vercel (preview primero)
- [ ] Configurar dominio `grupocisa.mx`

### Antes de producción

- [ ] Backend para forms (Formspree recomendado por simplicidad)
- [ ] Integración ElevenLabs widget (cuando el agente esté listo)
- [ ] Validar copy y datos con CISA
- [ ] Auditoría de accesibilidad (NVDA + axe)
- [ ] Screenshots mobile real en device

### Post-producción

- [ ] Analytics (Plausible)
- [ ] CMS para que CISA edite proyectos sin código
- [ ] Optimización de imágenes cuando haya renders reales
- [ ] Refactor a CSS Modules si el proyecto crece
