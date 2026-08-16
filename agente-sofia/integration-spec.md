# Integration spec · Sofía en sitio estático CISA · v1.0

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
| `{AGENT_ID}` | `REPLACE_WITH_AGENT_ID` | Se llena al crear el agente en ElevenLabs. Aparece en la URL del embed: `https://elevenlabs.io/convai/embed.js?agent_id=abc123` |
| `{SERVER_URL}` | `REPLACE_WITH_SERVER_URL` | URL del proxy server-side (ver sección 6). Si ElevenLabs provee conexión directa, este parámetro puede omitirse. |

**Nota:** verificar en la documentación de ElevenLabs si el formato del script es exactamente `embed.js` o si conviene usar el `<elevenlabs-convai>` web component. La forma final se define cuando se cree el agente.

## 2. Variables de configuración del widget

Una vez cargado, el widget acepta configuración vía JavaScript:

```html
<script>
  window.SOFIA_CONFIG = {
    agentId: 'REPLACE_WITH_AGENT_ID',
    serverUrl: 'REPLACE_WITH_SERVER_URL',     // proxy server-side, nunca directo a ElevenLabs desde frontend si hay secretos
    position: 'bottom-left',                   // 'bottom-left' para no chocar con WhatsApp FAB
    primaryColor: '#1F4D2A',                   // brand-green-dark de DESIGN.md
    accentColor: '#2E7D32',                    // brand-green
    textColor: '#0F1419',                      // ink-900
    buttonLabel: '',                           // vacío = solo ícono
    avatarUrl: '/assets/logo-grupo-cisa.svg',  // logo oficial como avatar
    title: 'Sofía · Grupo CISA',
    subtitle: 'Asistente virtual · responde en minutos',
    autoOpen: false,                           // no abrir el chat automáticamente
    language: 'es-MX',
    voice: {
      enabled: true,                           // si el canal de voz está activo
      voiceId: 'REPLACE_WITH_VOICE_ID'         // ver open-questions.md Q1
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
  z-index: 40 !important;          /* debajo del header sticky (z-50) pero encima del contenido */
  width: 56px !important;
  height: 56px !important;
  border-radius: 8px !important;    /* 8px, no pill, consistente con el sistema */
  background-color: #1F4D2A !important;  /* brand-green-dark */
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

/* En móvil: ajustar margen inferior para no chocar con la barra de navegación si existe */
@media (max-width: 768px) {
  [data-elevenlabs-widget],
  .elevenlabs-widget,
  #elevenlabs-convai-trigger {
    bottom: 16px !important;
    left: 16px !important;
  }
}

/* Accesibilidad: focus visible */
[data-elevenlabs-widget]:focus-visible,
.elevenlabs-widget:focus-visible,
#elevenlabs-convai-trigger:focus-visible {
  outline: 3px solid #8BC34A !important;
  outline-offset: 3px !important;
}
```

> Los selectores exactos (`[data-elevenlabs-widget]`, `.elevenlabs-widget`, `#elevenlabs-convai-trigger`) se ajustan cuando se vea el HTML real del widget. La estrategia es idéntica: selectores que apunten al contenedor del botón y aplicar `!important` donde haga falta para sobreescribir los estilos por defecto del iframe / shadow DOM.

## 4. Triggers por página (mostrar / ocultar el widget)

Sofía **NO debe aparecer** en todas las páginas. La regla está definida en `README.md` sección 3. La implementación es simple: cada HTML incluye el `<script>` solo donde corresponde.

**Opción recomendada: condicional por página.**

```html
<!-- Al final de index.html, su-terreno.html, desarrollos.html, desarrollos/[slug].html,
     inversion.html, nosotros.html, 404.html -->
<script id="elevenlabs-convai" ... ></script>

<!-- En contacto.html, precalificar.html, gracias.html, aviso-de-privacidad.html: NO incluir el script -->
```

**Opción alternativa (más DRY, requiere JS central):** crear un archivo `assets/sofia-loader.js` que decida según `window.location.pathname`. Útil si se quiere mantener el patrón de HTML estático sin duplicar el `<script>` en cada página. Ejemplo:

```js
// assets/sofia-loader.js
(function () {
  var path = window.location.pathname;
  var excluded = ['/contacto', '/precalificar', '/gracias', '/aviso-de-privacidad'];
  var isExcluded = excluded.some(function (p) {
    return path === p || path === p + '.html' || path.indexOf(p + '/') === 0;
  });
  if (isExcluded) return;

  // Cargar el script de ElevenLabs
  var s = document.createElement('script');
  s.src = 'https://elevenlabs.io/convai/embed.js?agent_id=REPLACE_WITH_AGENT_ID&server_url=REPLACE_WITH_SERVER_URL';
  s.async = true;
  s.id = 'elevenlabs-convai';
  document.body.appendChild(s);
})();
```

Y en cada HTML, al final del `<body>`:

```html
<script src="/assets/sofia-loader.js" defer></script>
```

> Si se opta por el loader, igual hay que incluir el script en todas las páginas; la lógica de exclusión está centralizada. Esto es preferible si en el futuro se agregan más páginas excluidas o reglas de visibilidad.

## 5. Eventos emitidos por el widget (analytics)

Sofía debe emitir eventos que se integren con el sistema de analytics del sitio (Google Tag Manager / `window.dataLayer`).

**Eventos a implementar** (mapeo tentativo al dataLayer):

| Evento | Cuándo se dispara | Payload sugerido |
|--------|-------------------|------------------|
| `sofia_widget_loaded` | El widget termina de cargar | `{ agent_id, page_path }` |
| `sofia_widget_opened` | El visitante hace clic en el botón y abre el chat | `{ page_path, source: 'click' \| 'auto' }` |
| `sofia_widget_closed` | El visitante cierra el chat | `{ duration_seconds, message_count }` |
| `sofia_conversation_started` | El LLM responde el primer mensaje | `{ page_path, flow_detected: 'terreno' \| 'capital' \| 'general' \| null }` |
| `sofia_lead_qualified` | El flujo A (dueño de terreno) o B (socio de capital) llega a la captura de datos | `{ flow: 'terreno' \| 'capital', data_keys: ['zona', 'superficie', ...] }` |
| `sofia_handoff_requested` | Se activa el handoff a humano | `{ trigger: 'user_request' \| 'frustration' \| 'out_of_scope' \| 'flow_completed' \| 'limit_reached', conversation_id }` |
| `sofia_article_recommended` | Sofía recomienda un artículo del blog | `{ article_slug }` |
| `sofia_error` | El widget falla (ElevenLabs caído, timeout, error de red) | `{ error_code, error_message }` |

**Implementación:** el widget de ElevenLabs expone eventos vía callbacks o `window.postMessage`. Conectar esos eventos a `window.dataLayer.push({...})` para que GTM los recoja.

```js
// Ejemplo (pseudocódigo, ajustar al SDK real de ElevenLabs)
window.elevenLabsWidget = window.elevenLabsWidget || {};
window.elevenLabsWidget.on = function (eventName, callback) {
  // ElevenLabs emite; nosotros mandamos al dataLayer
  var handler = function (data) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'sofia_' + eventName,
      ...data
    });
    callback && callback(data);
  };
  // bind al event bus real de ElevenLabs
};
```

**Importante:** el mapeo exacto de eventos al SDK de ElevenLabs se valida cuando se cree el agente. Este spec es la intención, no la implementación final.

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

El mensaje pre-llenado en WhatsApp debe ser contextual cuando se posible:

- En `/su-terreno` → `Hola, tengo un terreno y quiero saber si aplica para desarrollo con CISA.`
- En `/inversion` → `Hola, me interesa participar como socio de capital en un proyecto de CISA.`
- En cualquier otra página → `Hola, necesito información sobre Grupo CISA.`

Esto se puede implementar pasando el `href` correcto por página o, mejor, con JS que detecte la URL:

```js
// sofia-fallback.js
(function () {
  var path = window.location.pathname;
  var msg = 'Hola, necesito información sobre Grupo CISA.';
  if (path.indexOf('su-terreno') >= 0) {
    msg = 'Hola, tengo un terreno y quiero saber si aplica para desarrollo con CISA.';
  } else if (path.indexOf('inversion') >= 0) {
    msg = 'Hola, me interesa participar como socio de capital en un proyecto de CISA.';
  }
  var encoded = encodeURIComponent(msg);
  var a = document.getElementById('sofia-fallback');
  if (a) a.href = 'https://wa.me/525517964940?text=' + encoded;
})();
```

## 7. Variables de entorno · dónde va la API key

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

**Recomendación: Vercel Functions.** Es el mismo host que el sitio. Un solo lugar para deployar, un solo dashboard para secrets.

**Esqueleto del proxy** (`/api/sofia/conversation.js` o similar):

```js
// /api/sofia/message.js
export default async function handler(req, res) {
  const { message, conversationId } = req.body;

  const response = await fetch('https://api.elevenlabs.io/v1/convai/conversations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY  // ← variable de entorno, nunca en cliente
    },
    body: JSON.stringify({ agent_id: process.env.ELEVENLABS_AGENT_ID, message, conversation_id: conversationId })
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

> El widget de ElevenLabs que se carga en el frontend NO necesita la API key si todo el tráfico pasa por el proxy. El embed público de ElevenLabs puede funcionar con el agent_id solo, pero **si se quiere evitar exponer el agent_id** también, se enruta todo por el proxy. Decisión que se toma al momento de integración.

## 8. Manejo de errores y timeouts

- **Timeout de carga del widget:** 5 segundos (ver sección 6). Si no carga, fallback a WhatsApp.
- **Timeout de respuesta del LLM:** 30 segundos. Si excede, mostrar mensaje de "Un momento, estoy consultando" y reintentar una vez. Si reintenta y falla, ofrecer transferencia a humano o WhatsApp.
- **Error de red:** capturar en `sofia_error` event, ofrecer fallback.
- **Pérdida de sesión:** si la conversación se corta (recarga de página, etc.), Sofía recuerda el contexto solo si el visitante no cerró la pestaña. Si cerró, empieza de nuevo (por diseño, para no violar privacidad).

## 9. Cumplimiento de privacidad y cookies

- **Sin cookies de tracking** en el frontend del widget. ElevenLabs puede setear las suyas; verificar en su documentación.
- **Sin almacenamiento en `localStorage`** del lado de Sofía. La memoria es solo de sesión. Los borradores de formulario sí usan `localStorage`; ese sistema es separado.
- **Aviso de privacidad:** el sitio debe tener un enlace a `/aviso-de-privacidad` cerca del widget o en el footer. El aviso debe mencionar que el sitio usa un agente conversacional de IA provisto por ElevenLabs, y que las conversaciones pueden ser revisadas por el equipo de CISA para mejorar el servicio.
- **Botón de "no quiero continuar"** dentro del widget: el visitante debe poder cerrar el chat y borrar la conversación. El widget estándar de ElevenLabs lo provee.

## 10. Pruebas mínimas antes de producción

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

## 11. Checklist de deploy

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

---

*ABDev · Alberto Balderas · Agosto 2026*
*Spec forward-looking: el agente sale de alcance del proyecto actual (`PENDIENTES-WEB.md` sección 2.3). Este spec define cómo se integra cuando se reactive.*
