# Grupo CISA · Sitio web

> Sitio web de **Grupo CISA**, desarrolladora inmobiliaria mexicana con 30 años en el mercado.
> Demo HTML estático, listo para revisar con `impeccable` y deployar a Vercel sin build.

---

## Cómo abrirlo

**Doble click en `index.html`** y se abre en el navegador. Sin servidor, sin build.

Para servirlo en localhost (necesario para algunas herramientas de revisión como `impeccable`):

```bash
# Python 3 (ya viene instalado en Windows)
python -m http.server 8000

# Abre http://localhost:8000 en el navegador
```

---

## Estructura

```
.
├── index.html              Home (9 bloques)
├── su-terreno.html         Aportación de terreno (página estrella, 9 bloques)
├── desarrollos.html        3 proyectos vigentes + filtros + 4 líneas de producto
├── inversion.html          Participación en proyectos (5 pasos + form)
├── nosotros.html           Empresa + método 8 etapas + equipo + aliados
├── contacto.html           3 canales de contacto + form general
├── assets/
│   ├── logo-grupo-cisa.svg         Logo oficial (vectorizado)
│   ├── logo-grupo-cisa-dark.svg    Variante dark
│   └── logo-cisa.png               Legacy, ya no se usa
├── preview-{home,…}.png    Screenshots de las 6 páginas
├── HANDOFF.md              Documento de handoff con decisiones y pendientes
└── README.md               Este archivo
```

---

## Stack visual

- **Tipografía:** Manrope (sans) + JetBrains Mono (metadatos)
- **Paleta:** Verde institucional `#1F4D2A` · Verde medio `#2E7D32` · Verde claro `#8BC34A` · Neutros ink-50 → ink-950
- **Base:** 17px (público meta 45-70 años)
- **Motion:** transiciones 200-300ms, sin scroll-jacking
- **Cero emojis, cero glassmorphism, cero testimonios inventados**

---

## Deploy a Vercel

Este proyecto es **HTML estático puro**. Vercel lo detecta automáticamente y lo sirve sin build.

1. Abre [vercel.com/new](https://vercel.com/new)
2. Login con `abalderas.dev@gmail.com`
3. Importa `abalderasdev/cisa`
4. Framework Preset: **"Other"** (no detecta Next.js, esto es HTML estático)
5. Root Directory: **`.`** (raíz, ya está)
6. Build Command: dejar vacío
7. Output Directory: dejar vacío
8. Click **Deploy** — tarda ~10 segundos

La URL pública será tipo `cisa.vercel.app` (o el subdominio que elijas).

Para dominio custom `grupocisa.mx`: Settings → Domains → agregar dominio → configurar DNS en tu registrador.

---

## Revisión con `impeccable`

`impeccable` es la skill de ABDev para auditoría de interfaces. Funciona mejor con el sitio servido en un puerto. Pasos:

1. Servir el sitio: `python -m http.server 8000`
2. Cargar `impeccable` apuntando a `http://localhost:8000`
3. Revisar cada página: home, su-terreno, desarrollos, inversion, nosotros, contacto
4. Iterar copy/visual en los HTMLs según el feedback

Ver [`HANDOFF.md`](./HANDOFF.md) para el detalle de decisiones de diseño y pendientes.

---

## Pendientes

- [ ] **Validar copy y datos con CISA** — equipos, fotos, números de unidades, aliados, certificaciones siguen siendo placeholders honestos
- [ ] **Forms funcionales** — UI lista en las 6 páginas, no envían. Necesitan Formspree/Resend o backend
- [ ] **ElevenLabs agent** — el botón "Hablar con el agente" apunta a WhatsApp por ahora
- [ ] **Auditoría accesibilidad** — skip link + focus visible listos, falta test con NVDA/VoiceOver
- [ ] **Mobile real** — verificado en desktop 1280×900, falta captura en device
- [ ] **Dominio `grupocisa.mx`** — configurar DNS y SSL en Vercel

---

## Equipo

- **Alberto Balderas** (ABDev) — dirección, desarrollo, copy
- **Grupo CISA** — cliente, validaciones, datos

Plataforma web desarrollada por **ABDev** · Ciudad de México · 2026.
