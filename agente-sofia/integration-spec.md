# Integration spec · Sofía en sitio estático CISA · v1.1

> Especificación técnica para integrar el widget de ElevenLabs en las 6 HTMLs del sitio.
> Audiencia: dev de ABDev (Alberto) o futuro dev que mantenga el sitio.
> Stack del sitio: HTML estático, CSS con variables `:root`, JS vanilla. Sin build, sin framework. Deploy: Vercel.

---

## 1. Script tag de ElevenLabs

El widget se carga como `<script async>` al final del `<body>` de cada página donde Sofía debe aparecer.

```html
<!-- Sofía · ElevenLabs Agent -->
<script
  id="elevenlabs-convai"
  src="https://elevenlabs.io/convai/embed.js?agent_id={AGENT_ID}&server_url={SERVER_URL}"
  async
  type="text/javascript"
></script>
```

**Placeholders a reemplazar:**

| Variable | Valor actual | Dónde se obtiene |
|----------|--------------|------------------|
| `{AGENT_ID}` | `REPLACE_WITH_AGENT_ID` | Se llena al crear el agente en ElevenLabs. Aparece en la URL del embed. |
| `{SERVER_URL}` | `REPLACE_WITH_SERVER_URL` | URL del proxy server-side (ver sección 8). Si ElevenLabs provee conexión directa, este parámetro puede omitirse. |

**Nota:** verificar en la documentación de ElevenLabs si el formato del script es exactamente `embed.js` o si conviene usar el `<elevenlabs-convai>` web component. La forma final se define cuando se cree el agente.

## 2. Variables de configuración del widget

Una vez cargado, el widget acepta configuración vía JavaScript:

```html
<script>
  window.SOFIA_CONFIG = {
    agentId: 'REPLACE_WITH_AGENT_ID',
    serverUrl: 'REPLACE_WITH_SERVER_URL',
    position: 'bottom-left',
    primaryColor: '#1F4D2A',
    accentColor: '#2E7D32',
    textColor: '#0F1419',
    buttonLabel: '',
    avatarUrl: '/assets/sofia-avatar.jpg',
    introVideoUrl: '/assets/sofia-intro.mp4',
    title: 'Sofía · Grupo CISA',
    subtitle: 'Asistente virtual · responde en minutos',
    autoOpen: false,
    language: 'es-MX',
    voice: {
      enabled: true,
      voiceId: 'REPLACE_WITH_VOICE_ID'
    }
  };
</script>
```

> Las claves exactas pueden variar según la versión del SDK de ElevenLabs. Este objeto se mapea al `window.elevenlabsConfig` o equivalente real cuando se integre. Consultar docs de ElevenLabs al momento de integración.

## 3. CSS para evitar choque con WhatsApp FAB

El sitio ya tiene un WhatsApp FAB en `bottom-right` (color `#25D366`, 56px). El widget de Sofía va a `bottom-left` y se separa del borde con suficiente margen para que ambos sean accesibles sin superponerse.

```css
/* Botón flotante de Sofía · a la izquierda del WhatsApp FAB */
[data-elevenlabs-widget],
.elevenlabs-widget,
#elevenlabs-convai-trigger {
  position: fixed !important;
  bottom: 20px !important;
  left: 20px !important;
  right: auto !important;
  z-index: 40 !important;
  width: 56px !important;
  height: 56px !important;
  border-radius: 8px !important;
  background-color: #1F4D2A !important;
  box-shadow: 0 2px 8px rgba(15, 20, 25, 0.15) !important;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

[data-elevenlabs-widget]:hover,
.elevenlabs-widget:hover,
#elevenlabs-convai-trigger:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 20, 25, 0.2);
}

@media (max-width: 768px) {
  [data-elevenlabs-widget],
  .elevenlabs-widget,
  #elevenlabs-convai-trigger {
    bottom: 16px !important;
    left: 16px !important;
  }
}

[data-elevenlabs-widget]:focus-visible,
.elevenlabs-widget:focus-visible,
#elevenlabs-convai-trigger:focus-visible {
  outline: 3px solid #8BC34A !important;
  outline-offset: 3px !important;
}
```

## 4. Triggers por página (mostrar / ocultar el widget)

Sofía **NO debe aparecer** en todas las páginas. La regla está definida en `README.md` sección 3. La implementación es simple: cada HTML incluye el `<script>` solo donde corresponde.

**Opción recomendada: condicional por página.**

```html
<!-- Al final de index.html, su-terreno.html, desarrollos.html, desarrollos/[slug].html,
     inversion.html, nosotros.html, 404.html -->
<script id="elevenlabs-convai" ... ></script>

<!-- En contacto.html, precalificar.html, gracias.html, aviso-de-privacidad.html: NO incluir el script -->
```

**Opción alternativa (más DRY):** crear un archivo `assets/sofia-loader.js` que decida según `window.location.pathname`.

```js
// assets/sofia-loader.js
(function () {
  var path = window.location.pathname;
  var excluded = ['/contacto', '/precalificar', '/gracias', '/aviso-de-privacidad'];
  var isExcluded = excluded.some(function (p) {
    return path === p || path === p + '.html' || path.indexOf(p + '/') === 0;
  });
  if (isExcluded) return;

  var s = document.createElement('script');
  s.src = 'https://elevenlabs.io/convai/embed.js?agent_id=REPLACE_WITH_AGENT_ID&server_url=REPLACE_WITH_SERVER_URL';
  s.async = true;
  s.id = 'elevenlabs-convai';
  document.body.appendChild(s);
})();
```

## 5. Eventos emitidos por el widget (analytics)

Sofía debe emitir eventos que se integren con el sistema de analytics del sitio (Google Tag Manager / `window.dataLayer`).

**Eventos a implementar:**

| Evento | Cuándo se dispara | Payload sugerido |
|--------|-------------------|------------------|
| `sofia_widget_loaded` | El widget termina de cargar | `{ agent_id, page_path }` |
| `sofia_widget_opened` | El visitante hace clic en el botón y abre el chat | `{ page_path, source: 'click' \| 'auto' }` |
| `sofia_widget_closed` | El visitante cierra el chat | `{ duration_seconds, message_count }` |
| `sofia_conversation_started` | El LLM responde el primer mensaje | `{ page_path, flow_detected: 'terreno' \| 'capital' \| 'general' \| null }` |
| `sofia_lead_qualified` | El flujo A o B llega a la captura de datos | `{ flow: 'terreno' \| 'capital', data_keys: ['zona', 'superficie', ...] }` |
| `sofia_handoff_requested` | Se activa el handoff a humano | `{ trigger: 'user_request' \| 'frustration' \| 'out_of_scope' \| 'flow_completed' \| 'limit_reached', conversation_id }` |
| `sofia_article_recommended` | Sofía recomienda un artículo del blog | `{ article_slug }` |
| `sofia_error` | El widget falla (ElevenLabs caído, timeout, error de red) | `{ error_code, error_message }` |

## 6. Fallback si ElevenLabs está caído

Si el script de ElevenLabs no carga en 5 segundos, o si el widget reporta un error de conexión, se muestra un **fallback al WhatsApp directo** con mensaje pre-formateado.

```html
<!-- Después del script de Sofía -->
<script>
  (function () {
    var loaded = false;
    var FALLBACK_TIMEOUT_MS = 5000;

    window.addEventListener('sofia_widget_loaded', function () {
      loaded = true;
    });

    window.addEventListener('sofia_error', function () {
      showFallback();
    });

    setTimeout(function () {
      if (!loaded) showFallback();
    }, FALLBACK_TIMEOUT_MS);

    function showFallback() {
      var btn = document.getElementById('sofia-fallback');
      if (btn) btn.style.display = 'flex';
    }
  })();
</script>

<!-- Botón fallback, oculto por defecto -->
<a
  id="sofia-fallback"
  href="https://wa.me/525517964940?text=Hola%2C%20necesito%20informaci%C3%B3n%20sobre%20Grupo%20CISA"
  target="_blank"
  rel="noopener"
  style="display: none; position: fixed; bottom: 20px; left: 20px; z-index: 40;
         background-color: #1F4D2A; color: white; padding: 12px 20px;
         border-radius: 8px; text-decoration: none; font-family: Manrope, sans-serif;
         font-size: 15px; font-weight: 600;
         box-shadow: 0 2px 8px rgba(15, 20, 25, 0.15);"
>
  Hablar con CISA por WhatsApp
</a>
```

Mensajes contextuales según la URL:

- `/su-terreno` → "Hola, tengo un terreno y quiero saber si aplica para desarrollo con CISA."
- `/inversion` → "Hola, me interesa participar como socio de capital en un proyecto de CISA."
- Cualquier otra → "Hola, necesito información sobre Grupo CISA."

## 7. Assets de Sofía

Sofía tiene **avatar** y **video introductorio** listos en el repo, esperando solo que se cree el agente en ElevenLabs para activarse.

### 7.1 Avatar (foto de perfil)

| Campo | Valor |
|-------|-------|
| Path local | `assets/sofia-avatar.jpg` |
| URL en producción | `https://cisa.abdev.click/assets/sofia-avatar.jpg` (o el dominio de Vercel) |
| Formato | JPG, 900×1600 px (vertical 9:16) |
| Peso | 65 KB |
| Origen | Foto base entregada por el cliente. Vectorizada/retoque pendiente si se requiere. |
| Uso | Foto de perfil en el widget de ElevenLabs, en la firma de los mensajes de WhatsApp Business, en el modal de bienvenida del sitio |

### 7.2 Video introductorio

| Campo | Valor |
|-------|-------|
| Path local | `assets/sofia-intro.mp4` |
| URL en producción | `https://cisa.abdev.click/assets/sofia-intro.mp4` |
| Formato | MP4 (H.264), 768P, 6 segundos |
| Peso | 482 KB |
| Loop | Una vez, sin loop. Silenciado. |
| Generado desde | `assets/sofia-avatar.jpg` como primer frame |
| Uso | Se reproduce automáticamente al iniciar una conversación. Sin audio en el video — el audio lo pone ElevenLabs cuando habla. |

### 7.3 Comportamiento esperado

- Al cargar la página donde Sofía debe aparecer: el video no se reproduce todavía (lazy load).
- Al click del usuario en el widget de Sofía:
  1. Se abre el modal
  2. Se reproduce `sofia-intro.mp4` una vez en el área del avatar
  3. Inicia la conversación de voz con ElevenLabs
  4. Al terminar la intro, el video se pausa y queda como poster mientras ElevenLabs responde
- En mobile: el video ocupa el área del avatar, no se expande a pantalla completa
- Si el usuario cierra el widget: el video se pausa
- Si el usuario regresa: el video se reproduce de nuevo desde el inicio

### 7.4 Especificaciones técnicas

```html
<video
  id="sofia-intro"
  src="assets/sofia-intro.mp4"
  poster="assets/sofia-avatar.jpg"
  autoplay
  muted
  playsinline
  aria-label="Sofía se presenta"
></video>
```

CSS necesario:

```css
#sofia-intro {
  width: 100%;
  max-width: 280px;
  aspect-ratio: 9 / 16;
  border-radius: 12px;
  object-fit: cover;
  background: var(--brand-green-tint, #E8F5E9);
}
```

### 7.5 Decisiones pendientes

- [ ] Si el video debe tener audio (voz de Sofía saludando "Hola, soy Sofía, ¿en qué te ayudo?"). ElevenLabs puede generarlo cuando se cree el agente.
- [ ] Si el video se reproduce en TODAS las páginas o solo en `/su-terreno.html` (donde el CTA principal es precalificar).
- [ ] Si debe haber un video alternativo más corto (3 seg) para mostrar cuando la conversación ya está activa.
- [ ] Optimización a WebM (VP9) además de MP4 para navegadores que lo prefieran (ahorra ~30% de peso).
- [ ] Validar el avatar con Alberto — si la foto necesita retoque (encuadre, fondo, color) antes de salir a producción.

## 8. Variables de entorno · dónde va la API key

**La API key de ElevenLabs NUNCA va en el frontend.** El sitio es estático y todo el código se sirve al cliente. Si la key queda expuesta en el HTML o en el JS, cualquiera puede extraerla y abusar de la cuenta de ElevenLabs de CISA.

**Patrón obligatorio: proxy server-side.**

```
Frontend (HTML estático)
   ↓ llama a
Proxy server-side (función serverless)
   ↓ usa
ElevenLabs API (con API key en variable de entorno)
```

**Opciones de hosting para el proxy:**

| Plataforma | Cómo se deploya | Costo |
|------------|-----------------|-------|
| **Vercel Functions** | Mismo proyecto que el sitio, carpeta `/api`. Variables en Vercel dashboard. | Free tier suficiente para tráfico bajo |
| **Cloudflare Workers** | Archivo `worker.js`, deploy con `wrangler`. Variables en dashboard. | Free tier: 100,000 req/día |
| **Supabase Edge Functions** | Si en el futuro se migra a Supabase, función Deno. | Free tier generoso |

**Recomendación: Vercel Functions.** Es el mismo host que el sitio.

**Esqueleto del proxy** (`/api/sofia/message.js`):

```js
export default async function handler(req, res) {
  const { message, conversationId } = req.body;

  const response = await fetch('https://api.elevenlabs.io/v1/convai/conversations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY
    },
    body: JSON.stringify({
      agent_id: process.env.ELEVENLABS_AGENT_ID,
      message,
      conversation_id: conversationId
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
```

**Variables de entorno a configurar en Vercel:**

| Variable | Valor ejemplo | Quién la pone |
|----------|---------------|---------------|
| `ELEVENLABS_API_KEY` | `xi-...` (string largo) | Alberto (ABDev), desde el dashboard de ElevenLabs de CISA |
| `ELEVENLABS_AGENT_ID` | `agent_abc123` | Alberto, al crear el agente |
| `ELEVENLABS_SERVER_URL` | `https://cisa.vercel.app/api/sofia` | Alberto, según el dominio |

## 9. Manejo de errores y timeouts

- **Timeout de carga del widget:** 5 segundos (ver sección 6). Si no carga, fallback a WhatsApp.
- **Timeout de respuesta del LLM:** 30 segundos. Si excede, mostrar mensaje de "Un momento, estoy consultando" y reintentar una vez. Si reintenta y falla, ofrecer transferencia a humano o WhatsApp.
- **Error de red:** capturar en `sofia_error` event, ofrecer fallback.
- **Pérdida de sesión:** si la conversación se corta (recarga de página, etc.), Sofía recuerda el contexto solo si el visitante no cerró la pestaña. Si cerró, empieza de nuevo (por diseño, para no violar privacidad).

## 10. Cumplimiento de privacidad y cookies

- **Sin cookies de tracking** en el frontend del widget. ElevenLabs puede setear las suyas; verificar en su documentación.
- **Sin almacenamiento en `localStorage`** del lado de Sofía. La memoria es solo de sesión.
- **Aviso de privacidad:** el sitio debe tener un enlace a `/aviso-de-privacidad` cerca del widget o en el footer. El aviso debe mencionar que el sitio usa un agente conversacional de IA provisto por ElevenLabs, y que las conversaciones pueden ser revisadas por el equipo de CISA para mejorar el servicio.
- **Botón de "no quiero continuar"** dentro del widget: el visitante debe poder cerrar el chat y borrar la conversación.

## 11. Pruebas mínimas antes de producción

| Test | Qué se valida |
|------|---------------|
| Carga del widget en cada página donde debe aparecer | Botón visible, sin errores en consola |
| Carga del widget en cada página donde NO debe aparecer | Script no se ejecuta, no hay botón |
| Posición del widget vs. WhatsApp FAB | Sin superposición, ambos clickeables |
| Apertura de conversación | El LLM responde el saludo en menos de 5 segundos |
| Flujo A completo (dueño de terreno) | Llega al handoff con datos correctos |
| Flujo B completo (socio de capital) | Llega al handoff con datos correctos |
| Flujo C (prensa) | Captura y transfiere sin auto-responder |
| Flujo D (general) | Recomienda artículo o transfiere a WhatsApp |
| Flujo E (frustración) | Transfiere inmediatamente |
| Fallback (ElevenLabs caído) | Aparece el botón de WhatsApp con mensaje contextual |
| Mobile (375px, 412px) | Botón no tapa contenido, abre correctamente |
| Accesibilidad (NVDA / VoiceOver) | Botón tiene aria-label, foco visible, mensajes se anuncian |

## 12. Checklist de deploy

Antes de marcar como listo para producción:

- [ ] `AGENT_ID` real (no `REPLACE_WITH_AGENT_ID`)
- [ ] `SERVER_URL` del proxy configurado
- [ ] Variables de entorno en Vercel (`ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID`)
- [ ] KB cargada en ElevenLabs con el contenido de `knowledge-base.md`
- [ ] System prompt cargado en ElevenLabs con el contenido de `system-prompt.md`
- [ ] Voz de Sofía elegida y configurada
- [ ] Webhook de handoff al CRM / WhatsApp Business configurado y probado
- [ ] Asesor humano asignado y notificado
- [ ] Fallback a WhatsApp probado (simular caída de ElevenLabs)
- [ ] Eventos de analytics conectados a GTM
- [ ] Pruebas de los 5 flujos hechas con QA humano
- [ ] Pruebas en mobile hechas en device real
- [ ] Auditoría de accesibilidad básica hecha
- [ ] Aviso de privacidad actualizado mencionando el agente conversacional
- [ ] Política de retención de conversaciones definida (propuesta: 30 días, después se borra del dashboard de ElevenLabs)
- [ ] Avatar JPG validado por Alberto (encuadre, color, fondo)
- [ ] Video introductorio MP4 validado por Alberto (gesto, duración, lighting)

---

*ABDev · Alberto Balderas · Agosto 2026*
*Spec forward-looking: el agente sale de alcance del proyecto actual (`PENDIENTES-WEB.md` sección 2.3). Este spec define cómo se integra cuando se reactive.*
*v1.1 · agrega sección 7 (Assets: avatar + video introductorio) y referencia en sección 2 (SOFIA_CONFIG.avatarUrl, .introVideoUrl).*
