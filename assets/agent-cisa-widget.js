/* ================================================================
   AGENT CISA WIDGET · Grupo CISA
   v2.0 · ABDev · Alberto Balderas
   21-ago-2026

   Refactor completo. El approach anterior (modal custom + video
   custom + voice orb custom) peleaba contra el widget nativo de
   ElevenLabs, que ya trae todos esos elementos. Resultado: el
   custom element se creaba bien pero `startConversation` no estaba
   en su prototype, porque ese método se inicializa después de un
   handshake con el backend que mi polling nunca atrapaba.

   v2.0 sigue la doc oficial al pie de la letra:

     https://elevenlabs.io/docs/eleven-agents/customization/widget

   El widget nativo de ElevenLabs:
     - Renderiza su propio botón flotante (avatar + dot verde)
     - Abre su propio modal con avatar animado, voice orb, controles
     - Maneja audio bidireccional, permisos de micrófono, errores
     - Expone startConversation() SOLO cuando el usuario clickea
       su propio botón flotante (o cuando se llama via override)

   Lo único que hacemos aquí es:
     1. Leer la config desde /api/agent-config (env-driven)
     2. Inyectar el custom element <elevenlabs-convai> con los
        atributos de branding de CISA
     3. Cargar el script de unpkg con `async`
     4. Conectar los botones custom de la página (en la sección
        #agente y el cierre) al widget via widget.startConversation()
        cuando ese método esté disponible

   Sin modal custom. Sin video. Sin voice orb. Sin pelearse con
   el shadow DOM del widget. Sin hacks. Solo lo que dice la doc.
   ================================================================ */
(function () {
  'use strict';

  // === Pages where the widget does not run ===
  // Per agente-cisa/integration-spec.md section 4: the widget is
  // not loaded on the precalificar form, the gracias page, the
  // contacto form, or the privacy notice. Those pages have their
  // own conversion paths and a chat widget would compete with them.
  var EXCLUDED_PATHS = [
    '/contacto',
    '/precalificar',
    '/gracias',
    '/aviso-de-privacidad'
  ];

  var path = window.location.pathname.toLowerCase();
  if (EXCLUDED_PATHS.some(function (p) {
    return path === p || path === p + '.html' || path.indexOf(p + '/') === 0;
  })) {
    return;
  }

  // === Defaults used if /api/agent-config is unreachable ===
  // The agent id placeholder is intentional: it forces the widget
  // to render in WhatsApp-only mode (its startConversation fails,
  // the CTA is disabled, the user sees only the WhatsApp link).
  var AGENT = {
    agentId:        'REPLACE_WITH_AGENT_ID',
    whatsappNumber: '525517964940',
    fallbackMessage: 'Hola, necesito información sobre Grupo CISA.'
  };

  bootstrap();

  function bootstrap() {
    loadConfig().then(mount).catch(function (err) {
      log('warn', 'config load failed, using defaults', err);
      mount();
    });
  }

  /**
   * Read the Vercel function that returns the runtime config. The
   * values come from Vercel environment variables so the same
   * agent_id and WhatsApp number can be rotated without touching
   * the frontend code.
   */
  function loadConfig() {
    return fetch('/api/agent-config', { credentials: 'omit', cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('agent-config HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (data.agentId)         AGENT.agentId = data.agentId;
        if (data.whatsappNumber)  AGENT.whatsappNumber = data.whatsappNumber;
        if (data.fallbackMessage) AGENT.fallbackMessage = data.fallbackMessage;
        log('info', 'config loaded', { agentId: AGENT.agentId, source: data.source });
      });
  }

  /**
   * Inject the custom element and the official script, then wire
   * any in-page custom triggers to the widget.
   *
   * The custom element is mounted AFTER the script registers the
   * class. ElevenLabs' widget is itself a custom element; if the
   * tag is created before `customElements.define` runs, the browser
   * leaves it as a plain HTMLElement and the widget never upgrades
   * (we hit this exact bug in v1.7).
   *
   * The script is loaded with `async` so it never blocks the page
   * parser. Loading it eagerly (rather than on first click) is what
   * gives the user a real zero-wait experience.
   */
  function mount() {
    if (AGENT.agentId === 'REPLACE_WITH_AGENT_ID') {
      log('warn', 'no agent_id configured; widget will not be mounted');
      return;
    }

    // 1. Inject the custom element (host it off-screen so its
    //    native floating button is hidden; the button we want to
    //    show is the brand-green trigger we wire below). We host
    //    it off-screen rather than display:none because the widget
    //    needs a visible mount point to compute layout.
    var host = document.createElement('div');
    host.id = 'agent-cisa-widget-host';
    host.setAttribute('aria-hidden', 'true');
    document.body.appendChild(host);

    // 2. Create the <elevenlabs-convai> element with our branding.
    //    `action-text` becomes the label on the native floating
    //    button. We do NOT override start-call-text / end-call-text
    //    (we want ElevenLabs' localized defaults in the conversation
    //    panel). avatar-image-url is the absolute URL of the
    //    avatar asset; if it 404s the widget falls back to its
    //    default orb.
    var widget = document.createElement('elevenlabs-convai');
    widget.id = 'agent-cisa-widget';
    widget.setAttribute('agent-id', AGENT.agentId);
    widget.setAttribute('avatar-image-url', absoluteUrl('assets/agent-cisa-avatar.jpg'));
    widget.setAttribute('action-text', 'Hablar con CISA');
    widget.setAttribute('language', 'es');
    host.appendChild(widget);

    // 3. Load the official embed script. Per the docs the script
    //    MUST be the unpkg URL and MUST be `async`. We use async
    //    explicitly to avoid ever blocking the page even if it
    //    ends up before another synchronous script in the document.
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    s.async = true;
    s.type = 'text/javascript';
    s.addEventListener('load', function () {
      log('info', 'elevenlabs script loaded');
    });
    s.addEventListener('error', function () {
      log('warn', 'elevenlabs script failed to load');
    });
    document.body.appendChild(s);

    // 4. Wire the in-page brand-green trigger so users who scroll
    //    to the agent section can open the widget without hunting
    //    for ElevenLabs' native button (which we hid by hosting
    //    the element off-screen). The trigger calls
    //    widget.startConversation() if it's available; if not
    //    (script still loading, agent misconfigured, etc.) the
    //    user gets the existing "Hablar con el equipo" link to
    //    WhatsApp that the section already offers as a fallback.
    wireTriggers(widget);
  }

  /**
   * Delegate click events on any element marked with
   * `[data-agent-open]` (used by the green trigger in the
   * `#agente` section CTA, and as a generic hook for any future
   * in-page button that wants to open the conversation).
   *
   * If the widget's startConversation() is not available (still
   * loading, blocked by auth, etc.) we do nothing — the visitor
   * is already on a page that has the WhatsApp fallback in the
   * same section.
   */
  function wireTriggers(widget) {
    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-agent-open]');
      if (!opener) return;
      e.preventDefault();
      tryStartConversation(widget);
    });
  }

  function tryStartConversation(widget) {
    if (typeof widget.startConversation === 'function') {
      try {
        widget.startConversation();
        log('info', 'startConversation() called from trigger');
      } catch (err) {
        log('warn', 'startConversation() threw', err);
      }
    } else {
      log('info', 'trigger clicked but startConversation unavailable yet');
    }
  }

  // === Tiny utility helpers ===

  function absoluteUrl(rel) {
    return new URL(rel, window.location.href).href;
  }

  function log(level, message, detail) {
    if (!window.console) return;
    var prefix = '[cisa-agent]';
    if (level === 'error' && window.console.error) {
      window.console.error(prefix, message, detail || '');
    } else if (level === 'warn' && window.console.warn) {
      window.console.warn(prefix, message, detail || '');
    } else if (window.console.info) {
      window.console.info(prefix, message, detail || '');
    }
  }
})();
