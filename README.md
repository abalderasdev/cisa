# CISA · Demo de dirección de arte

Demo interna para Grupo CISA con las **dos direcciones de arte** que se le presentan al cliente para elegir antes de construir el sitio nuevo.

> Esta demo no es el sitio final. Es la prueba visual de que el copy real, animado sobre la pila real, se ve y se siente distinto en cada dirección.

---

## Las dos direcciones

| | Levantamiento (recomendada) | Patrimonio |
|---|---|---|
| **URL local** | `/levantamiento` | `/patrimonio` |
| **Metáfora** | El plano arquitectónico que se levanta en volumen | El legado familiar que se proyecta al futuro |
| **Paleta** | Papel cálido · tinta azul oscuro · acento bronce | Marfil · verde profundo · acento latón |
| **Tipografía** | Fraunces (serif de contraste) + Inter | Cormorant Garamond + Inter |
| **Layout** | Retícula técnica visible, numeración como en plano | Generoso whitespace, bloques centrados, timeline con peso |
| **Signature 3D** | Wireframe con líneas finas, polígono que se subdivide en volumen | Material sólido latón + verde, volumen edificable con peso |
| **Tono** | Técnico, preciso · "somos ingenieros" | Cálido, patrimonial · "somos familia" |

La **dirección recomendada es Levantamiento**: es la única que un competidor no puede copiar sin copiar también el modelo de negocio. La retícula, la numeración de etapas y el polígono que se transforma en volumen son el mensaje maestro de CISA hecho interfaz.

---

## Stack

- **Vite 6** + **React 18** + **TypeScript** — más ligero que Next.js para una demo, mismo resultado visual
- **Tailwind v4** + **CSS variables** para tokens — el mismo sistema que se usará en producción
- **Motion** (sucesor de Framer Motion) — animaciones de entrada y microinteracciones
- **Lenis** — scroll suave
- **GSAP ScrollTrigger** — animaciones atadas al scroll
- **React Three Fiber + drei** — el momento signature 3D (polígono → volumen)
- **Wouter** — router minimalista

Para el sitio final de producción se migrará a **Next.js** con la misma base de tokens, componentes y animaciones. Nada de lo que se escribe aquí se desecha.

---

## Estructura

```
cisa-demo/
├── src/
│   ├── app/
│   │   ├── home.tsx            → portada con selector
│   │   ├── levantamiento.tsx   → dirección 01
│   │   └── patrimonio.tsx      → dirección 02
│   ├── components/
│   │   ├── shared/             → Button, Container, Section, SignatureMoment
│   │   ├── levantamiento/      → Hero, NuevaOportunidad, Prueba, Metodo, Footer
│   │   └── patrimonio/         → mismas piezas, con tokens de Patrimonio
│   ├── lib/
│   │   ├── copy/copy.ts        → textos del mensaje maestro
│   │   └── tokens/             → levantamiento.css, patrimonio.css
│   └── styles/global.css       → Tailwind import + base
├── vercel.json                 → rewrites para SPA
└── README.md
```

---

## Cómo correr en local

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo
npm run dev
# Abre http://localhost:5173

# 3. Build de producción
npm run build

# 4. Preview del build
npm run preview
```

Las URLs son:
- `http://localhost:5173/` — selector de dirección
- `http://localhost:5173/levantamiento` — dirección 01
- `http://localhost:5173/patrimonio` — dirección 02

---

## Cómo desplegar en Vercel

```bash
# 1. Login (solo la primera vez)
vercel login

# 2. Deploy a preview
vercel

# 3. Deploy a producción
vercel --prod
```

El archivo `vercel.json` ya está configurado con los rewrites necesarios para que las rutas funcionen como SPA. Cada deploy genera una URL tipo `cisa-demo.vercel.app`.

Para tener **dos URLs separadas** (una por dirección) hay que desplegar dos veces con configuración de dominios distintos, o usar Vercel project aliases. La forma más rápida para la demo es dejar las dos rutas en una sola URL (`cisa-demo.vercel.app/levantamiento` y `cisa-demo.vercel.app/patrimonio`).

---

## Lo que está placeholder

Marcado explícitamente con `[corchetes]` o texto "FOTO" en la demo:

- Logotipo y colores oficiales de CISA
- Fotografía real de obra de los 4 proyectos
- Datos de contacto (teléfono, WhatsApp, correo)
- Estatus y fecha de cada proyecto
- Nombre del director de CISA en el copy del hero (la frase "Vender es una operación, desarrollar es un negocio" debe validarse con él)

Nada de esto se publica en la versión final sin confirmación del cliente. **Principio ABDev:** no se publica nada que la empresa no haya confirmado.

---

## Lo que demuestra la demo

1. **Las dos direcciones son viables y distintas.** Si en junta solo se diferencian en color, fallamos; la demo tiene que mostrar que cada dirección lee distinto.
2. **El copy real funciona.** Cada bloque está escrito con la copy del mensaje maestro, sin lorem ipsum.
3. **El stack de producción se sostiene.** Lo que se ve aquí es lo que se va a construir, con la misma calidad de animación y diseño.
4. **El signature moment es el diferenciador.** El polígono que se transforma en volumen es la materialización de la promesa: "su terreno, así se ve desarrollado".

---

## Notas para la junta con CISA

- **La pregunta a la junta no es cuál les gusta, sino cuál se parece más a cómo quieren que los perciba un dueño de terreno que no los conoce.** Esa diferencia cambia la respuesta.
- **Se enseña en un celular, no en una laptop.** El público de originación decide desde el teléfono.
- **Lleva las dos URLs abiertas.** No recortes la demo a screenshots. El movimiento del signature moment es la pieza que convence.
- **No prometas lo que no puedes cumplir.** La frase de hero, las cifras de obra y los datos de contacto están en la demo como propuesta, no como verdad publicada.

---

*ABDev · Alberto Balderas · Ciudad de México · 2026*
