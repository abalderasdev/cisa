# Cómo usar impeccable · Guía para CISA (3 comandos)

**Tiempo total:** 5 minutos. Una sola vez, la primera.

Impeccable es el sistema de edición en vivo que les permite a ustedes
(cualquier persona del equipo CISA) hacer cambios al sitio web
directamente desde el navegador, sin tener que pedirle a ABDev.

---

## Requisitos previos

1. **Node.js** (versión 18 o superior). Si no lo tienen:
   - Windows: descargar de https://nodejs.org y elegir LTS
   - Mac: `brew install node` o el instalador de nodejs.org
   - Linux: `sudo apt install nodejs npm` (o equivalente)
2. **Una cuenta de GitHub** con acceso al repositorio `abalderasdev/cisa`.
   Si todavía no la tienen, pedir a Alberto el acceso.

---

## 3 comandos para empezar

Abrir la terminal (en Windows: PowerShell; en Mac/Linux: Terminal) y correr:

```bash
# 1. Clonar el repositorio (la primera vez; después solo `git pull`)
git clone https://github.com/abalderasdev/cisa.git
cd cisa

# 2. Instalar las dependencias (solo la primera vez; ~10 segundos)
#    (No tiene dependencias externas, este paso es opcional pero valida que todo esté bien)
npm install

# 3. Arrancar el servidor impeccable
npm run dev
```

Después de unos segundos van a ver en la terminal algo como:

```
[impeccable] live server ready
[impeccable] url:  http://localhost:8400/
[impeccable] url:  http://192.168.1.42:8400/
[impeccable] token: 7a8c3f-2d91-4b6e-...
[impeccable] press Ctrl+C to stop
```

**Abrir en el navegador:** `http://localhost:8400/`

---

## Qué ven cuando lo abren

La primera vez que cargan la página, el browser inyecta automáticamente
un overlay (esquina inferior derecha, un punto verde pulsante). Eso
significa que impeccable está conectado.

**Click en cualquier elemento de la página** (texto, imagen, botón)
y aparece un menú pequeño con 3 opciones:

- **Edit content** — edita el texto directamente
- **Go (con IA)** — le pide a la IA que mejore o reescriba ese texto,
  y les da 3 variantes para elegir
- **Cancel** — cierra el menú

Los cambios se guardan en un archivo local (`/tmp/impeccable-cisa/` o
equivalente en Windows). **No se publican automáticamente al sitio
público**. Cuando terminen de hacer cambios, los commitean con git:

```bash
git add -A
git commit -m "Cambios del equipo CISA"
git push origin main
```

(esos cambios pasan al repo. Si el repo está conectado a Vercel, en 1
minuto se reflejan en `https://cisa1.vercel.app/`)

---

## 3 puertas de impeccable

Impeccable tiene 3 formas de usarlo, no solo el browser overlay:

| Puerta | Cómo se usa | Para qué sirve |
|---|---|---|
| **A. Browser overlay** | Click en elementos de la página | Editar copy, imágenes, links |
| **B. Chat con Mavis** | Hablar con Mavis (Alberto puede presentarles) | Cambios grandes, preguntas, pedir resúmenes |
| **C. Terminal** | `node .impeccable/scripts/doctor.mjs` o `audit` | Auditoría técnica del sitio, detectar problemas |

---

## Resolver problemas comunes

**No se ve el overlay verde (punto pulsante) en el browser:**
- Verificar que la terminal muestra `[impeccable] live server ready`
- Verificar que están en `http://localhost:8400/` (no `https://`)
- Si están en `https://cisa1.vercel.app/` (producción), el overlay NO
  aparece porque solo funciona en localhost.

**El browser dice "ERR_CONNECTION_REFUSED":**
- El servidor impeccable no está corriendo. Volver a correr `npm run dev`.

**"npm: command not found":**
- Node.js no está instalado. Ver requisitos previos arriba.

**"fatal: not a git repository":**
- No están dentro de la carpeta `cisa/`. Correr `cd cisa` primero.

**El token cambia cada vez que arrancan el servidor. ¿Está bien?**
- Sí. El token solo se usa para identificar la sesión de edición.
  No afecta al sitio público, solo al overlay en localhost.

**Los cambios se guardan pero no aparecen en el sitio público:**
- Falta hacer `git push origin main`. Ver paso "commitean con git" arriba.

---

## Si quieren parar el servidor

`Ctrl+C` en la terminal donde corre `npm run dev`.

Para volver a arrancarlo: `npm run dev` (desde la carpeta `cisa/`).

---

## Estructura de carpetas (para referencia)

```
cisa/
├── index.html, su-terreno.html, ...   (las páginas del sitio)
├── contenido/                          (15 artículos del blog)
├── desarrollos/                        (3 páginas de detalle)
├── assets/                             (imágenes, videos, CSS, JS)
├── docs/                               (specs y decisiones)
├── .impeccable/                        (sistema de edición en vivo)
│   ├── SKILL.md                        (doc técnica de impeccable)
│   └── scripts/                        (servidor + herramientas)
├── COPY.md, DESIGN.md, PRODUCT.md      (sistemas de marca)
├── PENDIENTES-FINAL.md                 (qué falta)
├── INFORME-AVANCE-CISA.md              (informe para el equipo CISA)
└── package.json                        (este archivo, con `npm run dev`)
```

---

## Contacto

Si algo no funciona, escribirle a Alberto por WhatsApp o email.
Incluir el mensaje de error que aparece en la terminal.
