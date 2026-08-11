# Grupo CISA · Demo Web v2 · Handoff

> Demo estática para revisión. Antes de migrar a Next.js + backend.

---

## 1. Qué se entrega

Seis páginas HTML estáticas con sistema de diseño compartido. Demo navegable sin servidor.

| # | Archivo | Rol | Estado |
|---|---------|-----|--------|
| 1 | `index.html` | Home | Listo |
| 2 | `su-terreno.html` | Aportación de terreno (página estrella) | Listo |
| 3 | `desarrollos.html` | 3 proyectos vigentes + filtros | Listo |
| 4 | `inversion.html` | Participación en proyectos (segundo público) | Listo |
| 5 | `nosotros.html` | Credibilidad: método + equipo | Listo |
| 6 | `contacto.html` | Contacto directo + form general | Listo |

Cada página incluye:
- Header sticky con logo oficial y CTA "Precificar mi terreno"
- WhatsApp FAB flotante
- Footer de 4 columnas
- Skip link para accesibilidad
- Estilos completos con variables CSS centralizadas

---

## 2. Cómo abrirlo

Doble click en `index.html`. No requiere servidor.

Las páginas se enlazan entre sí por rutas relativas (`./su-terreno.html`, etc.). Los assets (logo, futuras imágenes) viven en `assets/`.

Para preview en servidor local (opcional, recomendado antes de pantalla grande):

```bash
cd "C:\Users\abald\.abm\CISA\CISA_\web-demo-v2"
python -m http.server 8000
# Abrir http://localhost:8000
```

---

## 3. Sistema de diseño

Documentado aparte. Ver:

```
C:\Users\abald\.abm\CISA\CISA_\03-identidad-visual\DESIGN-SYSTEM-CISA.md
```

Resumen ejecutivo:

- **Paleta:** verde oscuro `#1F4D2A` (primario), verde medio `#2E7D32` (CTAs), verde claro `#8BC34A` (acentos), neutros ink-50→ink-950
- **Tipografía:** Manrope (títulos y cuerpo, weights 400-800) + JetBrains Mono (metadatos)
- **Base:** 17px (no 16), pensando en público 45-70 años
- **Motion:** transiciones 200-300ms, easing cubic-bezier(0.4, 0, 0.2, 1), sin scroll-jacking
- **Accesibilidad:** skip link, focus visible, contraste AA, ARIA en landmarks

Personalidad aplicada:
- "Levantamiento" — retícula de plano arquitectónico como motivo visual
- Sólida, técnica, transparente, novedosa (no aspiracional)
- Cero glassmorphism, cero emojis, cero testimonios inventados

---

## 4. Stack y limitaciones actuales

| Aspecto | Estado actual | Limitación |
|---------|---------------|-----------|
| HTML | Estático (`.html` puro) | SEO, analytics y forms requieren backend |
| CSS | Inline en cada archivo con variables `:root` | Duplicación ~200 líneas por página (aceptable en demo) |
| JS | Solo FAB scroll, form, menú móvil | No hay build step ni framework |
| Imágenes | Solo logo SVG | Proyectos sin renders (placeholders geométricos) |
| Responsive | Mobile-first con breakpoints 480/768/1024 | Verificado en desktop; mobile en proceso |
| Formularios | UI completa, no envían a ningún lado | Requieren backend o servicio (Formspree, Resend) |
| SEO | Meta tags básicos, sin sitemap/robots | Pendiente para migración |
| Accesibilidad | AA, focus visible, skip link | Falta auditoría con lector de pantalla |

---

## 5. Datos placeholder que CISA debe confirmar

Marcados en el HTML como placeholders. No se inventaron.

| Dato | Valor actual | Acción |
|------|--------------|--------|
| Nombres equipo | `[NM]` × 5 | Confirmar nombres, cargos, fotos |
| Gerente general | `[NOMBRE]` | Confirmar nombre real |
| 5 fotos equipo | Pendientes | Solicitar a CISA |
| Números telefónicos | 55 1796 4940 / 55 5361 3771 ext. 251, 237 | Verificar que siguen activos |
| Correo | contacto@grupocisa.mx | Verificar |
| Direcciones redes | instagram.com/grupocisamx, etc. | Verificar URLs reales |
| Año trayectoria | "30 años en el mercado" | Confirmar año de fundación |
| Estados de operación | CDMX, Estado de México, Querétaro, Quintana Roo, Guanajuato, Mérida, Cancún | Confirmar lista final |
| Aliados mencionados | CARVIG, Péndulo Arquitectos, Capitalta, Konfirma, Fundación Nuestra Historia | Confirmar menciones |
| Certificación ISO | "ISO 9001:2015 en el proceso" | Confirmar alcance real |
| Proyectos (Panorama Algarín, Residencial Fraile, Itzaé) | Datos básicos placeholder | Reemplazar con datos reales: ubicación, unidades, m², fechas, amenidades, precio m² |
| Frase "30 años" | Usada en home | Confirmar exactitud |

---

## 6. Próximos pasos sugeridos

### Fase 1 · Antes de migrar (ahora)

1. **Validar copy y datos con CISA** — Alberto envía el demo al cliente para revisión de hechos.
2. **Capturar mobile real** — Tomar screenshots en iPhone/Android reales (no se pudo automatizar con `--viewport`).
3. **Auditoría de accesibilidad** — Lectura con NVDA o VoiceOver, verificación de contraste de toda la paleta.
4. **Limpieza de residuos** — Eliminar `replace-*.py`, `mobile-shot.mjs`, previews viejos. Solo dejar los 6 HTML + assets + 6 previews actuales.

### Fase 2 · Migración a Next.js (después de aprobación)

Stack objetivo: Next.js 14 (App Router) + TypeScript + CSS Modules o Tailwind con tokens del DESIGN-SYSTEM.

- Traducción mecánica de HTML → JSX. Mantener el mismo sistema de variables.
- Componentes reutilizables: Header, Footer, FAB, dev-card, contact-card, step-card, banner.
- Forms funcionales con Resend o Formspree.
- SEO completo: sitemap, robots, Open Graph, schema.org para organización.
- Deploy en Vercel (hosting de ABDev ya configurado para otros proyectos).

### Fase 3 · Producción

- CMS ligero (Sanity o Contentful) para que CISA edite proyectos sin tocar código.
- Analytics: Plausible o Umami (privacy-first).
- WhatsApp Business API + ElevenLabs agent embebido (preparado, no bloqueante).

---

## 7. Decisiones de diseño (para futura referencia)

| Decisión | Por qué |
|----------|---------|
| HTML estático primero | Iteración 5-10x más rápida que Next.js para revisión visual |
| Manrope en lugar de Inter | Detector de "AI-generated UI" en craft-floor: Inter está sobre-usado |
| Hero "El terreno es el protagonista" | Dirección de arte confirmada; agente aparece integrado, no como WOW |
| Modalidades asimétricas (1 dark + 3 light) | En lugar de 4 cards iguales, crea jerarquía |
| Eyebrows arriba de h2 eliminados | Baneado por detector de craft-floor |
| Marquee inferior reemplazado por strip estático | Detector lo flageó como distraction |
| Logo brush manual descartado | SVG oficial vectorizado por Alberto en VTracer es el definitivo |
| Tipografía 17px base | Audiencia 45-70 años, lectura más cómoda |
| Cero emojis | Línea editorial de marca (sólida, no informal) |
| Cero testimonios | Inventados serían falta ética; reales requieren proceso con CISA |

---

## 8. Archivos del proyecto

```
C:\Users\abald\.abm\CISA\CISA_\web-demo-v2\
├── index.html              Home
├── su-terreno.html         Aportación de terreno
├── desarrollos.html        Proyectos vigentes
├── inversion.html          Participación en proyectos
├── nosotros.html           Empresa y método
├── contacto.html           Contacto directo
├── HANDOFF.md              Este archivo
├── assets\
│   ├── logo-grupo-cisa.svg         Logo oficial (VTracer de Alberto, 748×261)
│   ├── logo-grupo-cisa-dark.svg    Variante dark (mismo SVG)
│   └── logo-cisa.png               Residuo, ya no se usa
├── preview-*.png           Screenshots de cada página (referencia visual)
├── replace-*.py            Scripts de generación (residuos, borrar en limpieza)
└── mobile-shot.mjs         Intento de screenshot mobile (residuo, borrar)
```

Documentación relacionada (fuera de esta carpeta):

```
C:\Users\abald\.abm\CISA\CISA_\03-identidad-visual\DESIGN-SYSTEM-CISA.md   Sistema de diseño
C:\Users\abald\.abm\CISA\CISA_\03-identidad-visual\logo\                   Logo y assets de marca
C:\Users\abald\.abm\CISA\CISA_\01-estrategia\00-CONTEXTO-MAESTRO.md        Contexto estratégico
C:\Users\abald\.abm\CISA\CISA_\02-copy\                                   Sistema de copy + plantillas
```

---

## 9. Log de iteraciones (resumen)

| Versión | Cambio |
|---------|--------|
| v0 | Wireframe F2/F3 firmado, copy base |
| v1 | HTML inicial con logo PNG intermedio |
| v1.5 | Polish impecable (craft-floor aplicado) |
| v2 | Logo oficial vectorizado integrado, 3 páginas nuevas (inversión, nosotros, contacto) |
| v2.1 | Fix de inconsistencia copy: 7→8 etapas del método |

---

## 10. Contacto del proyecto

Alberto Balderas · ABDev · `abalderasdev@gmail.com`
Cliente: Grupo CISA · `contacto@grupocisa.mx`
