# PENDIENTES-FINAL · CISA sitio web
**Fecha:** 17 ago 2026 · **Sprint actual:** Blog + Sofia + Detalles + Hero video + Widget 3 estados
**Branch activo:** `main` (mergeado de staging)

---

## Resumen ejecutivo

El sitio está deployado y funcional. Lo que falta se divide en 3 categorías: lo que solo CISA puede proveer (datos y materiales), lo que es decisión de Alberto (cuentas, dominios), y lo que queda por pulir visualmente o técnicamente (yo lo puedo hacer).

**Estado del sitio en main:**

| Bloque | Estado |
|---|---|
| Sistema de diseño (paleta, tipografía, base 17px) | ✅ Listo |
| 6 páginas principales (index, su-terreno, desarrollos, inversion, nosotros, contacto) | ✅ Listas |
| 3 páginas de detalle de desarrollos (Panorama Algarín, Residencial Fraile, Itzaé) | ✅ Listas, con placeholders honestos para datos CISA |
| Blog: índice + 15 artículos (8 grupo A + 7 grupo B) | ✅ Listo |
| Sistema de formularios con memoria persistente + WhatsApp | ✅ Listo |
| Spec operativa del agente Sofia (7 archivos) | ✅ Listo |
| Widget de Sofia 3 estados (idle escribiendo / hover saluda / click ElevenLabs) | ✅ Listo (con `agent_id` placeholder) |
| Widget de Sofia con video introductorio modal | ⚠️ Archivado — el nuevo approach lo reemplaza |
| Hero: video del terreno con 5 overlays de métricas de mercado | ✅ Listo |
| Impeccable live (browser overlay + chat con Mavis + CLI) | ✅ Configurado |
| Staging con banner amarillo + token separado | ✅ Pusheado y pusheable |

---

## A) Bloqueado por CISA — fotos y datos del cliente

Esto NO lo puedo hacer yo. Espera input de CISA (dirección de proyecto / dirección legal / dirección comercial).

### Equipo
- [ ] 5 fotos profesionales del equipo (1 por persona)
- [ ] 5 nombres completos
- [ ] 5 cargos exactos
- [ ] 1 biografía corta (1 línea) por persona

→ Se actualiza en `index.html` sección "Equipo" y en `nosotros.html` sección homónima.

### Testimonios
- [ ] Testimonio de un propietario de CISA (nombre + historia real + foto con permiso)
- [ ] Formato sugerido: "Tenía un terreno en X. Aporté. Hoy tengo Y m² construidos en Z desarrollo."

→ Va en bloque "Una historia que ya ocurrió" (placeholder actual en `index.html`).

### Datos reales de proyectos (las 3 páginas de detalle)

| Dato | Quién lo tiene | Para cuándo |
|---|---|---|
| Unidades disponibles por tipología (precio/preventa) | CISA dirección comercial | Antes de preventa abierta |
| Banco fiduciario (Itzaé) | CISA dirección legal | Antes de preventa abierta |
| Mes de solicitud de RVOE (Itzaé) | CISA dirección de obra | Antes de preventa |
| Coordenadas geográficas de cada terreno | CISA proyectos | Cuando esté |
| Mapa embebido (Google Maps iframe) | CISA proyectos | Cuando esté |
| Fecha de última visita de obra (Avance) | CISA dirección de obra | Mensual |
| Foto de avance de obra (Avance) | CISA dirección de obra | Mensual |
| Amenidades finales confirmadas | CISA dirección de proyecto | Antes de preventa |

→ Mientras CISA no mande esto, las páginas muestran `[DATO FALTANTE: <campo>]` en su lugar. Honesto, editable.

### Aliados
- [ ] Confirmación de aliados actuales: CARVIG, Péndulo, Capitalta, Kimbra, Fundación Nuestra Historia
- [ ] Logos en alta resolución (SVG o PNG 600×600 mínimo)

→ Va en bloque "Aliados" del home (pendiente de crear, ~½ día de trabajo).

### Certificación ISO y trayectoria
- [ ] Número de certificado ISO 9001:2015
- [ ] Fecha de expedición
- [ ] Alcance exacto del certificado
- [ ] Año de fundación confirmado (placeholder actual: "30 AÑOS")

→ Se actualiza en hero, footer y sección "Nosotros".

### Estados de operación de cada desarrollo
- [ ] Estatus final de Bosques de Calacoaya, Viaducto 14, Bomadica, Cumbres del Lago
- [ ] Decidir si entran al sitio (histórico) o solo los 3 vigentes

### Sofia (ElevenLabs) · 15 open-questions
Documento completo en `agente-sofia/open-questions.md`. Las 4 bloqueantes:

1. **Voz** — voz masculina o femenina, registro, español neutro vs mexicano
2. **Idioma** — solo español o bilingüe (es/en)
3. **Humano** — cuándo escalar a humano (horario, criterios, contacto)
4. **Horario** — 24/7 o solo horario de oficina

Mientras no estén resueltas, el widget funciona con `agentId: 'REPLACE_WITH_AGENT_ID'` y abre WhatsApp como fallback al click. Cuando CISA defina, se actualiza esa línea en `sofia-widget.js` y se contrata ElevenLabs para crear el agente real.

---

## B) Bloqueado por Alberto — decisiones y cuentas

### Cuentas externas
- [ ] Renovar `abdev.click` en Namecheap (vencido) — sin esto `cisa.abdev.click` no resuelve
- [ ] Crear cuenta Formspree si se quiere backend real de forms (alternativa actual: `localStorage` + WhatsApp, suficiente)
- [ ] Contratar ElevenLabs Creator o Pro cuando CISA defina las 4 bloqueantes de Sofia

### Decisiones de producto
- [ ] ¿Widget de Sofia con `agent_id` placeholder YA activo en main, o esperar a que CISA defina?
- [ ] ¿Galería de fotos de avance en cada desarrollo? Requiere material de CISA + 1-2 días de implementación
- [ ] ¿Bloque de aliados en home? ½ día de trabajo + decisión de CISA sobre cuáles
- [ ] ¿Testimonios adicionales (3-5) cuando se acumulen? Se agregan a `index.html` y `nosotros.html`
- [ ] ¿Calculadora de hipoteca? Integración con banco, decisión de producto
- [ ] ¿Módulo de citas (Calendly) en cada desarrollo? Útil para preventa

---

## C) Pendiente de implementación (yo lo puedo hacer)

Esto es lo que puedo avanzar sin esperar a nadie. Lo arranco en orden de impacto.

### Alta prioridad (1-2 días)
- [ ] **SEO técnico** — quitar `noindex` de las 6 páginas, `sitemap.xml`, `robots.txt`, meta descriptions únicas por página, schema.org (`LocalBusiness` en home, `Residence` en cada detalle, `FAQPage` donde aplique)
- [ ] **Accesibilidad WCAG AA** — auditoría de contraste, foco visible, navegación por teclado, ARIA, skip link (ya hay), NVDA + VoiceOver pass
- [ ] **Pre-flight `dataLayer` en cada CTA** — push de eventos a `window.dataLayer` en cada botón importante (precalificar, ver desarrollo, contactar, abrir Sofia, abrir WhatsApp). Ya hay algunos pero falta consistencia

### Media prioridad (3-5 días)
- [ ] **Limpiar CSS huérfano** del index.html — el bloque Agente tiene CSS de la versión chat estática que ya no se usa
- [ ] **Limpiar widget antiguo** — el `_archive/sofia-intro.mp4` puede quedarse ahí o moverse fuera del repo
- [ ] **JSON-LD de preventa** en Itzaé (schema.org `Offer` con disponibilidad y precio)
- [ ] **Cross-link a blog** desde páginas de detalle — los desarrollos pueden linkear al artículo de "Vivir en Atizapán/Calacoaya" si aplica
- [ ] **Bloque "Por qué CISA" en cada detalle** — 3 bullets que aplican al proyecto específico (certificación ISO, trayectoria, modelo de aportación)
- [ ] **Versión de las 3 páginas de detalle en `nosotros.html` como templates de CISA** — para que CISA entienda la estructura y complete lo que falta

### Baja prioridad (cuando se pueda)
- [ ] **Testimonios acumulables** — si CISA manda 1 testimonio, lo meto en home. Si mandan 5, hago un carrusel
- [ ] **Galería de fotos por desarrollo** — cuando CISA mande material, lo meto entre Avance de obra y Tipologías
- [ ] **Tour virtual 360°** — Matterport o similar, decisión de producto
- [ ] **Blog第二批 (8-15 artículos adicionales)** — priorizar con base en tráfico de los primeros 15

---

## D) Listo y deployado (referencia rápida)

| Commit | Qué hace |
|---|---|
| `7c057a2` | Sofia writing-loop + greeting videos + glue script |
| `94305c2` | Hero video con 5 overlays de métricas (HTML legible) |
| `deb78b3` | Reemplazo del SVG del hero por video |
| `d33449b` | 3 páginas de detalle de desarrollos + spec |
| `855fe1c` | Link "Contenido" en nav de las 6 páginas |
| `6b001ab` | Widget fix + 3 anchors rotos + video Sofia en sección Agente + form scroll |

---

## E) Decisiones tomadas (para no volver a discutirlas)

| Decisión | Razón |
|---|---|
| HTML estático en raíz del repo (no Next.js) | Iteración 5-10x más rápida, Vercel sirve sin build |
| Manrope en lugar de Inter | Detector impeccable flaggea Inter como AI-default |
| Forms con `localStorage` + WhatsApp, sin Formspree | Sin backend, sin cookies, privacidad por diseño |
| Widget de Sofia con video en lugar de avatar+texto | Más vivo, mejor engagement, 3 estados naturales |
| "Sofia" en copy, "Sofía" con tilde solo en copy del sitio | Branding consistente con tilde correcta en español |
| Impeccable live excluido en /contacto, /precalificar, /gracias, /aviso-de-privacidad | Páginas transaccionales, no se itera con el cliente ahí |
| Hero video + 5 overlays HTML, no texto en el video | La IA no puede generar texto legible en video |
| Staging branch con banner amarillo permanente | Iteración del cliente sin miedo a romper producción |
| Push desde terminal de Alberto, no desde Mavis bash | Manager helper de Windows bloquea auth en Mavis |
| Header backdrop-filter permitido | Funcional para legibilidad del sticky header, no decorativo |
| Cero emojis en UI | Detector impeccable + guía de marca |
| Cero palabras prohibidas del COPY.md | Mensaje maestro firmado |

---

## Cómo retomar mañana (workflow)

1. **Alberto:** abrir la URL de staging y validar cambios
2. **Alberto:** anotar lo que quiere ajustar (puede usar impeccable live si quiere, o decírmelo por chat)
3. **Yo:** aplico ajustes, commit a staging, le aviso
4. **Alberto:** `git push origin staging` desde su terminal
5. **Cuando esté estable:** merge a main + push

Si CISA envía datos, abro el archivo correspondiente (ej. panorama-algarin.html), reemplazo el placeholder `[DATO FALTANTE: ...]` con el dato real, commit, push. Cada cambio toma entre 30 segundos y 5 minutos según el alcance.

---

## Contacto operativo

- **Sitio:** https://cisa-git-main-abalderasdev-5621s-projects.vercel.app/
- **Staging:** https://cisa-git-staging-abalderasdev-5621s-projects.vercel.app/ (banner amarillo permanente)
- **Repo:** https://github.com/abalderasdev/cisa
- **Branch actual:** `main`
- **Spec Sofia:** `agente-sofia/README.md`
- **Sistema de copy:** `COPY.md` v2.0
- **Impeccable:** `.impeccable/live/config.json` + `GUIA-CLIENTE-IMPECCABLE.md`
