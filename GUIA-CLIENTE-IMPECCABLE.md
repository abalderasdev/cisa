# Guía del Cliente · Cómo usar Impeccable en el sitio de Grupo CISA

> **Para:** el equipo de Grupo CISA que va a hacer cambios al sitio.
> **Por:** ABDev · Alberto Balderas · agosto 2026.
> **Qué es esto:** una herramienta visual que te deja cambiar textos y elementos del sitio directamente en el navegador, sin tocar código.

---

## ¿Qué es Impeccable, en una línea?

Es un **botón flotante** que aparece en la esquina inferior derecha del sitio cuando está activo. Te deja **seleccionar cualquier elemento de la página** (un titular, un botón, una descripción) y **cambiarlo en vivo**, ya sea escribiéndolo tú o pidiéndole a la IA que te proponga 3 opciones.

Cuando terminas y das "Apply", el cambio **se guarda en el archivo del sitio**. El equipo de ABDev lo sube a producción y el sitio público se actualiza en 1-2 minutos.

---

## Antes de empezar (una sola vez, 5 minutos)

Necesitas:

1. **Una terminal abierta.** En Windows: PowerShell o Símbolo del sistema. En Mac: Terminal.
2. **Pegar este comando y dar Enter:**

```bash
cd "C:\Users\abald\.abm\CISA\CISA_"
node .claude/skills/impeccable/scripts/live.mjs
```

3. **Esperar** a que diga algo como:

```
✓ Impeccable live ready
  → http://localhost:8400 (servidor helper)
  → Token: 69d77af5-…
  → Archivos: index.html, su-terreno.html, …
```

4. **Abrir el sitio** en el navegador:

```
https://cisa-git-main-abalderasdev-5621s-projects.vercel.app/
```

(o el dominio `cisa.abdev.click` cuando esté listo)

5. **Verificar** que en la esquina inferior derecha aparece un **botón flotante con el logo de Impeccable**. Si lo ves, ya está activo.

> **Si el botón no aparece:** recarga la página con `Ctrl+R` o `F5`. Si sigue sin aparecer, contacta a Alberto.

---

## Las 2 formas de hacer un cambio

Hay dos formas. Las dos llegan al mismo lugar: el archivo del sitio. La diferencia es **quién decide el texto**.

### Forma 1 · Edición manual (la más fácil)

**Úsala cuando ya sabes exactamente qué texto va.**

```
1. Pasa el mouse sobre lo que quieres cambiar
   → Se ilumina con un borde punteado verde

2. Click en el elemento
   → Aparece una barrita abajo a la derecha

3. Mira arriba a la derecha del elemento
   → Hay un botoncito flotante que dice "Edit content"

4. Click en "Edit content"
   → Se abre un campo de texto con el contenido actual ya escrito

5. Borra y escribe el texto nuevo

6. Arriba del campo, click "Apply" (o "Save" si quieres dejarlo pendiente)

7. Recarga la página con Ctrl+R
   → El cambio ya está visible
```

**Tiempo:** menos de 1 minuto por elemento.

### Forma 2 · Con ayuda de la IA (cuando no estás seguro)

**Úsala cuando quieres ver opciones antes de decidir.**

```
1. Pasa el mouse sobre lo que quieres cambiar
   → Se ilumina con un borde punteado verde

2. Click en el elemento
   → Aparece la barrita abajo a la derecha

3. En el campo de prompt, escribe lo que quieres
   Ejemplos:
     "Hazlo más directo, sin tanto adjetivo"
     "Que se sienta más institucional, menos informal"
     "Más cercano al lector, en segunda persona"
     "Aplica la plantilla P3 con la voz del mensaje maestro"

4. Click "Go" (o Shift+Enter)
   → Espera 5-15 segundos

5. Aparecen 3 versiones diferentes del mismo elemento

6. Click en la que más te guste
   → Se aplica al instante

7. Si ninguna te gusta: click "Discard" y vuelve a empezar con otro prompt

8. Recarga la página con Ctrl+R
   → El cambio ya está visible
```

**Tiempo:** 1-2 minutos por elemento.

---

## Cambiar de página

¿Ya terminaste en `/su-terreno.html` y quieres ir a `/contacto.html`?

```
1. Cambia la URL en el navegador
   → De: …/su-terreno.html
   → A:  …/contacto.html

2. La nueva página carga
   → El botón flotante de Impeccable sigue apareciendo

3. Tus cambios sin aplicar de la página anterior
   → SIGUEN GUARDADOS por 15 minutos
   → Si vuelves dentro de 15 min, los puedes aplicar
   → Si pasa de 15 min, se pierden
```

**Regla:** si vas a cambiar de página, primero da "Apply" a lo que tengas pendiente, o avísale a Alberto para que él termine.

---

## ¿Qué pasa después de dar "Apply"?

Esto es importante. El cambio pasa por **3 etapas** antes de verse en el sitio público:

```
Apply (en el browser)
    ↓
1. El archivo HTML se modifica en el servidor local
   → Tú ves el cambio inmediatamente en la página
   → Si te equivocas, dínle a Alberto en los siguientes 5 min
    ↓
2. Alberto revisa y aprueba el cambio
   → Él mira el archivo, valida que esté bien
   → Si algo está mal, lo corrige
    ↓
3. Se sube al sitio público (Vercel)
   → Esto es automático, no tienes que hacer nada
   → Tarda 1-2 minutos
   → Cualquier persona que abra el sitio público ve el cambio
```

**No tienes que hacer nada más.** Tu trabajo termina en el paso 1. Los pasos 2 y 3 los hace ABDev / Vercel automáticamente.

---

## ¿Cómo sé que mi cambio sí se aplicó?

Tienes 3 formas de verificar:

1. **En el navegador:** el cambio se ve al instante en la página donde estás trabajando.
2. **En el sitio público:** abre la URL pública (la que ven los clientes) en otra pestaña o celular. En 1-2 minutos el cambio aparece ahí también.
3. **Preguntándole a Alberto:** él puede confirmar revisando el archivo. Si no estás seguro, mándale WhatsApp.

Si pasaron más de 5 minutos y no se ve en el sitio público → escríbele a Alberto. Algo se atascó.

---

## Lo que SÍ puedes hacer

- ✅ Cambiar textos de cualquier elemento visible
  - Titulares, subtítulos, descripciones
  - Texto de botones (por ejemplo: "Precalificar mi terreno" → "Solicitar información")
  - Etiquetas de formularios
  - Mensajes de error
  - Textos legales
- ✅ Cambiar atributos de elementos
  - El texto alternativo de las imágenes (descripción para ciegos)
  - El destino de un enlace (a dónde lleva)
  - El texto de ayuda que aparece al pasar el mouse
- ✅ Cambiar el estilo de un elemento
  - Color, tamaño, espaciado
  - En la pestaña "Style" del overlay
- ✅ Agregar o quitar elementos dentro de un bloque
  - Por ejemplo: agregar un bullet más a una lista
- ✅ Iterar el mismo elemento varias veces
  - Si no te gusta la primera versión, vuelve a pedir

---

## Lo que NO puedes hacer (todavía)

- ❌ Cambiar el logo de Grupo CISA
- ❌ Agregar páginas nuevas
- ❌ Borrar páginas existentes
- ❌ Cambiar el diseño completo del sitio
- ❌ Modificar los datos reales de proyectos (unidades, fechas, etc.)
  - Para eso escríbele a Alberto con los datos verificados
- ❌ Cambiar el correo o teléfono de contacto
  - Para eso escríbele a Alberto

Si necesitas algo de esta lista, **no intentes con Impeccable**. Escríbele a Alberto y lo hace él directamente. Forzarlo en Impeccable puede romper algo.

---

## Cosas importantes que debes saber

### 1. Si haces algo y se ve raro antes de dar Apply
Usa `Ctrl+Z` en el campo de texto. Deshace carácter por carácter.

### 2. Si diste Apply y se ve raro
Dile a Alberto **inmediatamente** por WhatsApp. Él puede revertir el cambio en el archivo en menos de 5 minutos (es una operación de `git checkout`).

### 3. Si el botón flotante desaparece
- Recarga la página (`Ctrl+R`).
- Si sigue sin aparecer, el servidor local se cayó. Pídele a Alberto que lo reinicie.

### 4. Si dos personas quieren usar Impeccable al mismo tiempo
**No se puede.** Solo una persona a la vez. Coordínense por WhatsApp antes de empezar.

¿La solución? La segunda persona puede pedirle sus cambios a Alberto por chat (sin meterse al navegador) y Alberto los aplica. Más lento, pero funciona.

### 5. El servidor local se apaga solo cada 30 minutos
Por configuración. Si lo dejaste prendido y vuelve a usarlo más tarde, **avísale a Alberto** para que lo reinicie.

### 6. Tus cambios se guardan en una "caja temporal" por 15 minutos
Si haces cambios y das "Save" (no "Apply"), quedan guardados por 15 minutos. Si en ese tiempo te sales, se pierden. **"Apply" es el botón importante.** "Save" es opcional, para los que quieren acumular varios cambios antes de aplicarlos.

---

## Atajos de teclado que te van a servir

| Atajo | Qué hace |
|-------|----------|
| `Ctrl+R` o `F5` | Recarga la página |
| `Ctrl+Z` | Deshace en el campo de texto (antes de Apply) |
| `Ctrl+Y` | Rehace en el campo de texto |
| `Esc` | Cierra el overlay sin aplicar |
| `Shift+Enter` | Atajo para "Go" (modo con IA) |
| `Tab` | Salta al siguiente campo en un formulario |

---

## Ejemplo paso a paso: cambiar el texto del hero de Su Terreno

**Situación:** quieres cambiar el titular "Su terreno no tiene que venderse para empezar a producir" por algo más corto.

```
1. Abrir  https://cisa-git-main-abalderasdev-5621s-projects.vercel.app/su-terreno.html
2. Esperar a que cargue la página
3. Pasa el mouse sobre el titular
   → Se ilumina con borde punteado verde
4. Click en el titular
   → Aparece la barrita abajo a la derecha
   → Aparece el badge "Edit content" arriba a la derecha del titular
5. Click en "Edit content"
   → Se abre el campo de texto con el titular actual escrito
6. Borra el texto actual
7. Escribe: "Convierta su terreno en un desarrollo."
8. Click "Apply"
9. Recarga la página (Ctrl+R)
   → El nuevo titular aparece
10. Abre en otra pestaña la URL pública
    → En 1-2 minutos el cambio está visible
```

Listo. Cambiaste un titular en 2 minutos sin tocar código.

---

## Si tienes dudas o algo no funciona

**Escríbele a Alberto por WhatsApp:** `55 1796 4940`

Dile:
- Qué intentaste hacer
- Qué pasó (qué dice la pantalla, qué error te dio, qué se ve raro)
- Una captura de pantalla si puedes

Alberto responde en menos de 24 horas hábiles. Si es urgente (algo se rompió), mándale un audio.

---

## Resumen visual

```
┌─────────────────────────────────────────────────────┐
│         IMPECCABLE EN 3 PASOS                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. CLICK  →  Selecciona lo que quieres cambiar    │
│                                                     │
│  2. EDITA  →  Manual (ya sabes qué)                │
│              o                                      │
│              IA (quieres ver opciones)              │
│                                                     │
│  3. APPLY  →  Listo. Alberto lo sube en 1-2 min.   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Eso es todo. Cualquier otra cosa, pregúntale a Alberto.

---

*Documento preparado por ABDev · Alberto Balderas · para Grupo CISA · agosto 2026.*
*Versión 1.0 · 1 página · lectura de 5 minutos.*
