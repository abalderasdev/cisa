# Editor en vivo (textos) — Grupo CISA

Permite que personas autorizadas editen títulos, párrafos, listas y botones **directamente sobre la página publicada**. Cada envío abre un **Pull Request** en `Capitalta-web/cisa`. Vercel genera la vista previa y **nada se publica sin el merge** de Alberto.

## Cómo funciona

1. Cada texto editable tiene `data-edit="<id estable>"`, p. ej. `index.hero.p-1`. Los del menú (`header.site-header`) y del pie (`footer.footer`) usan ids `global.header.*` / `global.footer.*`, y un cambio ahí se aplica en **todas** las páginas que tengan ese id.
   - Los marca `node scripts/mark_editable.js`. Es idempotente: los ids existentes no cambian y al volver a correrlo solo se marcan los textos nuevos. `--check` solo reporta.
   - Solo se marcan los elementos cuyo contenido es texto con formato simple (`b/strong/i/em/br`, `<a href>`, `<span class>`). Los que llevan iconos SVG, imágenes o atributos especiales no se marcan.
2. Cada página trae un **loader inline de ~300 bytes**. Solo descarga `/assets/editor.js` si existe la cookie `cisa_ed=1` (se pone al iniciar sesión) o si la URL tiene `?editar=1`. Para los visitantes no hay ninguna petición extra ni cambio visual.
3. **Login con usuario y contraseña.** En `https://<sitio>/?editar=1` aparece un formulario pequeño. Los usuarios y sus hashes **scrypt** vienen de la variable `EDITOR_USERS`; ninguna contraseña en texto plano se guarda ni viaja fuera del formulario HTTPS. Un login correcto crea una cookie `HttpOnly` firmada con HMAC que dura 8 h. Para quitarle el acceso a alguien, basta con borrarlo de `EDITOR_USERS`: su sesión deja de valer de inmediato.
   - Protección: verificación con `crypto.timingSafeEqual`, el mismo tiempo de cálculo aunque el usuario no exista y un mensaje genérico ("Usuario o contraseña incorrectos"). También se revisa el `Origin` y hay un límite de 20 intentos por IP cada 15 min.
   - Tras 5 fallos seguidos, ese usuario queda **bloqueado 15 min**, y cada fallo tarda más en responder (250 ms → 4 s).
4. **`assets/editor.js`** activa `contenteditable` solo en `[data-edit]`, pega siempre como texto plano, guarda un borrador en el navegador y ofrece **Enviar a revisión / Descartar / Salir**. Los adornos en los bordes de un texto (iconos `svg`, flechas `aria-hidden`, puntos vacíos) no son editables y se conservan tal cual. En un enlace (`<a data-edit href>`) aparece en la barra el campo **Enlace** para cambiar su destino.
5. **`api/editar.js`** valida la sesión y el `Origin`, aplica un límite de **10 PRs por hora por usuario** (los envíos rechazados no cuentan) y 60 peticiones por hora por IP, y limita el tamaño (192 KB por petición, 60 cambios y 4000 caracteres por texto). Después sanitiza, lee el HTML de `main` desde GitHub y reemplaza **solo el contenido del nodo** usando los offsets del parser `parse5`, sin regex y sin tocar ningún otro byte. Valida que el documento siga teniendo los mismos nodos editables y crea la rama `edicion/<fecha>-<usuario>-xxxx`, un commit y un PR. **Nunca escribe en `main`.**

## Que no se pierda ningún cambio

- **Base vieja.** Cada cambio viaja con el texto `original` que se veía al editar. El servidor lo compara (con la misma normalización de entidades y espacios) con el texto actual en `main`. Si no coincide, **rechaza solo ese texto** con «Este texto cambió desde que abriste la página, recarga» y nunca lo sobrescribe. Pasa sobre todo cuando un PR se mergeó pero el sitio todavía no se ha vuelto a publicar.
- **Validación por campo.** Los textos válidos se aplican y abren el PR. Los rechazados (vacíos, enlace no permitido, id que ya no existe, base vieja) vuelven con su motivo, se marcan **en rojo** en la página (el motivo aparece al pasar el cursor y en la barra) y se quedan en el borrador. Si no se aplicó nada, la respuesta es un error 409 y no se abre PR.
- **Ids `global.*`.** También se verifican: un id global que no existe se rechaza en lugar de ignorarse. Un cambio de destino en un enlace global se ajusta a la profundidad de cada página (`contacto.html` / `../contacto.html`).
- **Borrador.** Se guarda en el navegador por página (`/` e `/index.html` comparten borrador). Si al entrar respondes **Cancelar** a «¿Recuperarlos?», el borrador **se conserva** para después. Solo se borra con **Descartar** o cuando el servidor confirma que ese texto se aplicó. Si la sesión vence (401), el editor pide entrar otra vez **sin recargar** la página y sin perder nada.
- **Envío en curso.** Mientras se envía, el botón queda deshabilitado. Lo que edites en ese momento queda pendiente para el siguiente envío.
- **Mensajes.** La barra dice cuántos textos se aplicaron, la liga al PR y cuáles se rechazaron y por qué.

## Por qué usuario y contraseña (decisión de Alberto)

- No depende de ningún servicio externo: ni proveedor de correo ni de identidad. Tampoco agrega peso para los visitantes.
- Los hashes usan **scrypt** del módulo `crypto` de Node: no requiere dependencias y funciona en Vercel. Parámetros: N=32768, r=8, p=1, sal aleatoria de 16 bytes y hash de 32 bytes.
- Las contraseñas deben tener al menos 12 caracteres, y la herramienta para generar el hash lo exige.

## Generar el hash de un usuario (en tu computadora)

```bash
git clone https://github.com/Capitalta-web/cisa && cd cisa && git checkout editor-en-vivo
npm run hash-password -- alberto
# Contraseña: ********   Repite la contraseña: ********
# -> alberto:scrypt$32768$8$1$<sal>$<hash>
```

Copia esa línea completa en `EDITOR_USERS`. Si son varios usuarios, sepáralos con comas: `alberto:scrypt$...,cliente:scrypt$...`. La contraseña nunca sale de tu computadora. Para cambiarla, genera un hash nuevo y reemplaza la línea de ese usuario.

## Variables de entorno (Vercel → cisa → Settings → Environment Variables)

Márcalas como **Sensitive** y ponlas en Production y Preview.

| Variable | Obligatoria | Valor |
|---|---|---|
| `EDITOR_SESSION_SECRET` | Sí | Cadena aleatoria de 32 caracteres o más: `openssl rand -base64 48` |
| `EDITOR_USERS` | Sí | `usuario:scrypt$…` separados por coma, generados con `npm run hash-password -- <usuario>` |
| `GITHUB_APP_ID` | Sí | App ID de la GitHub App |
| `GITHUB_APP_INSTALLATION_ID` | Sí | Id de la instalación en `Capitalta-web/cisa` |
| `GITHUB_APP_PRIVATE_KEY` | Sí | Contenido del `.pem`. Se acepta con saltos reales o con `\n` |
| `GITHUB_REPO` | No | Por defecto `Capitalta-web/cisa` |
| `GITHUB_BASE_BRANCH` | No | Por defecto `main` |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Recomendado | Rate limit y bloqueo de login **globales** entre instancias. Sin ellas se cuentan por instancia, en memoria, como mejor esfuerzo |

## Crear la GitHub App

1. GitHub → Settings → Developer settings → **GitHub Apps → New GitHub App**.
   - Nombre: `cisa-editor`. Homepage: la URL del sitio. **Webhook: desactivado**.
   - **Repository permissions:** *Contents: Read and write* y *Pull requests: Read and write*. *Metadata: Read* se agrega solo. Ningún otro permiso: sin Workflows, sin Administration.
   - "Where can this app be installed": **Only on this account** (créala en la organización Capitalta-web, o hazla instalable ahí).
2. Copia el **App ID** y genera una **private key** (.pem) desde *Private keys → Generate*.
3. **Install App** → solo el repositorio `Capitalta-web/cisa`. El número final de la URL de la instalación (`/settings/installations/<ID>`) es `GITHUB_APP_INSTALLATION_ID`.
4. Recomendado: protege `main` con PR obligatorio para que nadie, incluida la App, pueda escribir directo.

## Uso

1. Abre `https://<sitio>/?editar=1` y entra con tu usuario y contraseña.
2. Haz clic sobre cualquier texto con contorno punteado y edítalo. Los cambios quedan marcados en ámbar. *Shift+Enter* inserta un salto de línea en párrafos, y *Ctrl+B / Ctrl+I* ponen negritas y cursivas.
3. **Enviar a revisión** → aparece la liga al PR. Revisa la vista previa de Vercel y haz merge para publicar.

## Desarrollo

- `npm test` corre las pruebas del sanitizer, del reemplazo de nodos, de la sesión y del marcado de las 28 páginas.
- `npm run mark-editable` marca los textos nuevos después de agregar contenido.
- Los ids son estables una vez escritos en el HTML. Si un texto se borra o se mueve en `main`, ese id vuelve como rechazado («ya no existe») y los demás cambios se aplican.
- `mark_editable.js` también marca `span`/`div` con texto directo (cifras, etiquetas, fichas, respuestas del FAQ) y elementos con adornos en los bordes (`summary` con icono, CTAs con flecha). Solo agrega atributos `data-edit`: el texto y el diseño no cambian. No marca opciones de `<select>`, texto que cambia un script (`data-counter`) ni marcadores de plantilla (`__X__`).
