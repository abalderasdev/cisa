/* ================================================================
   SOFIA WIDGET · Grupo CISA · Modal-based trigger
   v1.7.2 · ABDev · Alberto Balderas

   v1.7.2 change: the `<elevenlabs-convai>` custom element is now
   created ONLY after `customElements.get('elevenlabs-convai')`
   returns the registered class. Before this, we created the
   element on mountWidget() and the browser kept it as a plain
   HTMLElement because the script had not yet registered the
   upgrade. As a result, the custom methods (startConversation,
   endSession, etc.) never appeared on the instance and the
   widget silently fell back to "no podemos conectar" even
   though the script itself was loading fine. v1.7.2 fixes the
   upgrade path so the methods become available as soon as the
   class is registered.

   v1.7.1 change: when the ElevenLabs widget fires a "permission
   denied" error (typically because the agent has an unsupported
   audio tag like [warmly] in the first message, or is not
   published), we now listen for the `elevenlabs-agent:error`
   custom event and surface a clearer message to the user instead
   of just the generic "no podemos conectar".

   v1.7 changes:
   - ElevenLabs widget-embed script is now loaded EAGERLY on page
     load (not on modal open). The bundle is heavy (React + WebGL +
     Orb shaders) and the previous 5s fallback timer expired before
     it finished downloading. Loading eagerly gives it as much time
     as the user spends reading the page.
   - Fallback timer raised from 5s → 30s.
   - New "in-section" mode: a button with [data-sofia-section] in
     the #agente section transforms the section instead of opening
     the modal. The intro video fades out, the voice-orb fades in,
     and the page stays scrolled to the section while the user
     talks to Sofia. This removes the visual duplication of having
     the same video playing in both the section and the modal.
   - Any element with [data-sofia-open] still opens the floating
     modal (used by the green FAB).
   ================================================================ */
(function () {
  'use strict';

  // === Excluded pages (per spec section 4) ===
  var EXCLUDED = [
    '/contacto',
    '/precalificar',
    '/gracias',
    '/aviso-de-privacidad'
  ];
  var path = window.location.pathname.toLowerCase();
  var isExcluded = EXCLUDED.some(function (p) {
    return path === p || path === p + '.html' || path.indexOf(p + '/') === 0;
  });
  if (isExcluded) return;

  // === Defaults (used if /api/sofia-config is unreachable) ===
  var SOFIA_CONFIG = {
    agentId:          'REPLACE_WITH_AGENT_ID',
    avatarUrl:        'assets/sofia-avatar.jpg',
    introVideoUrl:    'assets/sofia-intro.mp4',
    whatsappNumber:   '525517964940',
    fallbackMessage:  'Hola, necesito información sobre Grupo CISA.',
    fallbackTimeoutMs: 30000
  };

  // === Bootstrap ===
  bootstrap();

  function bootstrap() {
    // Load config first, then mount the widget. The ElevenLabs script
    // is heavy, so we don't load it immediately — we wait for the user
    // to scroll near the FAB or near the #agente section. That gives
    // the script time to download before the user actually clicks,
    // without penalizing the initial page load.
    fetchConfig().then(function () {
      mountWidget();
      scheduleScriptLoad();
    }).catch(function () {
      mountWidget();
      scheduleScriptLoad();
    });
  }

  function scheduleScriptLoad() {
    if (!SOFIA_CONFIG.agentId || SOFIA_CONFIG.agentId === 'REPLACE_WITH_AGENT_ID') return;
    if (document.getElementById('elevenlabs-convai-script')) return;

    // Trigger 1: the FAB enters the viewport (user scrolled enough
    // that they could plausibly click it).
    var fab = document.querySelector('.sofia-trigger');
    // Trigger 2: the #agente section enters the viewport.
    var agenteSection = document.getElementById('agente');

    var triggered = false;
    function trigger() {
      if (triggered) return;
      triggered = true;
      loadElevenLabsScriptEagerly();
      // Also disconnect observers
      if (fab && fab._sofiaObs) fab._sofiaObs.disconnect();
      if (agenteSection && agenteSection._sofiaObs) agenteSection._sofiaObs.disconnect();
    }

    if ('IntersectionObserver' in window) {
      if (fab) {
        var obs1 = new IntersectionObserver(function (entries) {
          if (entries.some(function (e) { return e.isIntersecting; })) trigger();
        }, { threshold: 0.1 });
        obs1.observe(fab);
        fab._sofiaObs = obs1;
      }
      if (agenteSection) {
        var obs2 = new IntersectionObserver(function (entries) {
          if (entries.some(function (e) { return e.isIntersecting; })) trigger();
        }, { threshold: 0.1 });
        obs2.observe(agenteSection);
        agenteSection._sofiaObs = obs2;
      }
    } else {
      // Fallback: just load after a 2s delay.
      setTimeout(trigger, 2000);
    }

    // Hard fallback: if the user has not scrolled at all within 8s,
    // load the script anyway. This handles the case where the page is
    // short (no scroll possible) or the user immediately clicks the
    // FAB without scrolling.
    setTimeout(trigger, 8000);
  }

  function fetchConfig() {
    return fetch('/api/sofia-config', { credentials: 'omit', cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('sofia-config HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (!data) throw new Error('sofia-config empty body');
        if (data.agentId)         SOFIA_CONFIG.agentId = data.agentId;
        if (data.whatsappNumber)  SOFIA_CONFIG.whatsappNumber = data.whatsappNumber;
        if (data.fallbackMessage) SOFIA_CONFIG.fallbackMessage = data.fallbackMessage;
        if (data.fallbackTimeoutMs) SOFIA_CONFIG.fallbackTimeoutMs = data.fallbackTimeoutMs;
        document.documentElement.setAttribute(
          'data-sofia-agent',
          data.configured ? 'live' : 'fallback'
        );
        SOFIA_CONFIG._source = data.source || 'unknown';
        SOFIA_CONFIG._configured = Boolean(data.configured);
        if (window.console && console.info) {
          console.info('[sofia] config loaded from /api/sofia-config', {
            agentId: SOFIA_CONFIG.agentId,
            configured: SOFIA_CONFIG._configured,
            source: SOFIA_CONFIG._source
          });
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'sofia_config_loaded',
          agent_configured: SOFIA_CONFIG._configured,
          agent_id: SOFIA_CONFIG.agentId,
          source: SOFIA_CONFIG._source
        });
      })
      .catch(function (err) {
        if (window.console && console.warn) {
          console.warn('[sofia] could not load /api/sofia-config, using defaults', err);
        }
        document.documentElement.setAttribute('data-sofia-agent', 'fallback');
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'sofia_config_failed', reason: String(err) });
      });
  }

  function loadElevenLabsScriptEagerly() {
    if (!SOFIA_CONFIG.agentId || SOFIA_CONFIG.agentId === 'REPLACE_WITH_AGENT_ID') return;
    if (document.getElementById('elevenlabs-convai-script')) return;
    if (window.console && console.info) {
      console.info('[sofia] loading elevenlabs script eagerly in background…');
    }
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    s.async = true;
    s.id = 'elevenlabs-convai-script';
    s.addEventListener('load', function () {
      if (window.console && console.info) {
        console.info('[sofia] elevenlabs script loaded (eager)');
      }
      // Listen for permission-denied errors that the widget fires
      // when the agent config is invalid (e.g. audio tag in
      // first_message, unpublished agent, missing voice). These
      // surface as custom events on `document`.
      document.addEventListener('elevenlabs-agent:error', function (e) {
        var msg = (e && e.detail && e.detail.message) || 'unknown';
        if (window.console && console.error) {
          console.error('[sofia] ElevenLabs agent error: ' + msg);
        }
        if (typeof msg === 'string' && /permission/i.test(msg)) {
          // Show a clearer message to the user and steer them to WhatsApp.
          setAgentErrorState('El agente necesita un ajuste en su configuración. Mientras tanto, escríbenos por WhatsApp.');
        } else {
          setAgentErrorState('En este momento no podemos conectar. Te dejamos WhatsApp.');
        }
      });
      waitForStartConversation();
    });
    s.addEventListener('error', function () {
      if (window.console && console.warn) {
        console.warn('[sofia] elevenlabs script failed to load (eager)');
      }
    });
    document.body.appendChild(s);
  }

  // === Surface agent-side errors on the modal and section status ===
  function setAgentErrorState(message) {
    var modalStatus = document.querySelector('#sofia-modal-status');
    if (modalStatus) {
      modalStatus.textContent = message;
      modalStatus.classList.remove('sofia-modal__status--ready');
    }
    var talkBtn = document.querySelector('#sofia-modal-talk');
    if (talkBtn) {
      talkBtn.disabled = true;
      var txt = talkBtn.querySelector('.sofia-modal__cta-text');
      if (txt) txt.textContent = 'No disponible ahora';
    }
    var sectionStatus = document.querySelector('#agente .sofia-section__status');
    if (sectionStatus) {
      sectionStatus.textContent = 'Sofía necesita un ajuste de configuración. Te dejamos WhatsApp.';
      sectionStatus.classList.remove('sofia-section__status--ready');
    }
    // Drop the FAB dot so the user does not think the agent is online.
    var dot = document.querySelector('.sofia-trigger__dot');
    if (dot) dot.setAttribute('data-sofia-dot-state', 'error');
  }

  function waitForStartConversation() {
    // The custom element is registered when the script runs. We now
    // (v1.7.2) CREATE the element only after the class is registered,
    // so the browser upgrades it on construction and the custom
    // methods are available immediately.
    if (!window.customElements || !window.customElements.get) {
      // Old browser — fall back to the old create-then-poll approach.
      createWidgetElementEarly();
      return pollForStartConversation(0);
    }
    var attempts = 0;
    var maxAttempts = 200; // ~20s
    (function poll() {
      var ceClass = window.customElements.get('elevenlabs-convai');
      if (ceClass) {
        if (!document.getElementById('sofia-elevenlabs-widget')) {
          var host = document.getElementById('sofia-widget-host');
          if (host) {
            var w = document.createElement('elevenlabs-convai');
            w.id = 'sofia-elevenlabs-widget';
            w.setAttribute('agent-id', SOFIA_CONFIG.agentId);
            w.setAttribute('avatar-image-url', new URL(SOFIA_CONFIG.avatarUrl, window.location.href).href);
            w.setAttribute('action-text', 'Hablar con Sofía');
            w.setAttribute('start-call-text', 'Iniciar conversación');
            w.setAttribute('end-call-text', 'Terminar');
            w.setAttribute('dismissible', 'true');
            host.appendChild(w);
            if (window.console && console.info) {
              console.info('[sofia] created <elevenlabs-convai> AFTER class registration (v1.7.2 fix)');
            }
          }
        }
        // Now poll for the startConversation method on the (now upgraded)
        // instance.
        return pollForStartConversation(0);
      }
      if (attempts++ > maxAttempts) {
        if (window.console && console.warn) {
          console.warn('[sofia] customElements.get("elevenlabs-convai") never resolved after 20s');
        }
        return;
      }
      setTimeout(poll, 100);
    })();
  }

  function pollForStartConversation(attempts) {
    var widget = document.getElementById('sofia-elevenlabs-widget');
    if (widget && typeof widget.startConversation === 'function') {
      if (window.console && console.info) {
        console.info('[sofia] startConversation available (eager load)');
      }
      onSofiaReady();
      return;
    }
    if (attempts++ > 200) {
      if (window.console && console.warn) {
        console.warn('[sofia] startConversation never appeared after 20s polling');
      }
      return;
    }
    setTimeout(function () { pollForStartConversation(attempts); }, 100);
  }

  // Legacy fallback for browsers without customElements.get support.
  // Creates the element early and polls for the method to appear after
  // the script eventually registers the class.
  function createWidgetElementEarly() {
    var host = document.getElementById('sofia-widget-host');
    if (!host) return;
    if (document.getElementById('sofia-elevenlabs-widget')) return;
    var w = document.createElement('elevenlabs-convai');
    w.id = 'sofia-elevenlabs-widget';
    w.setAttribute('agent-id', SOFIA_CONFIG.agentId);
    w.setAttribute('avatar-image-url', new URL(SOFIA_CONFIG.avatarUrl, window.location.href).href);
    w.setAttribute('action-text', 'Hablar con Sofía');
    w.setAttribute('start-call-text', 'Iniciar conversación');
    w.setAttribute('end-call-text', 'Terminar');
    w.setAttribute('dismissible', 'true');
    host.appendChild(w);
  }

  function mountWidget() {
    // === Inject CSS ===
    if (!document.querySelector('link[href*="sofia-widget.css"]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'assets/sofia-widget.css';
      document.head.appendChild(link);
    }

    // === Build the FAB trigger (bottom-right) ===
    var trigger = document.createElement('button');
    trigger.className = 'sofia-trigger';
    trigger.setAttribute('type', 'button');
    trigger.setAttribute('aria-label', 'Hablar con Sofía, asistente virtual de Grupo CISA');
    trigger.innerHTML =
      '<span class="sofia-trigger__avatar-wrap">' +
        '<img class="sofia-trigger__avatar" src="' + SOFIA_CONFIG.avatarUrl + '" alt="" width="36" height="36" />' +
        '<span class="sofia-trigger__dot" aria-hidden="true"></span>' +
      '</span>' +
      '<span class="sofia-trigger__label">Hablar con Sofía</span>';
    document.body.appendChild(trigger);

    // === Build the modal (intro state + active state) ===
    var modal = document.createElement('div');
    modal.className = 'sofia-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'sofia-modal-title');
    modal.setAttribute('aria-describedby', 'sofia-modal-status');
    modal.setAttribute('data-state', 'intro');
    modal.setAttribute('data-open', 'false');
    modal.setAttribute('hidden', '');
    modal.innerHTML =
      '<div class="sofia-modal__panel">' +
        '<div class="sofia-modal__intro">' +
          '<div class="sofia-modal__header">' +
            '<div class="sofia-modal__id">' +
              '<img class="sofia-modal__avatar" src="' + SOFIA_CONFIG.avatarUrl + '" alt="" width="44" height="44" />' +
              '<div>' +
                '<h2 class="sofia-modal__title" id="sofia-modal-title">Hola, soy Sofía</h2>' +
                '<p class="sofia-modal__subtitle">Asistente virtual de Grupo CISA</p>' +
              '</div>' +
            '</div>' +
            '<button class="sofia-modal__close" type="button" data-sofia-close aria-label="Cerrar">×</button>' +
          '</div>' +
          '<div class="sofia-modal__body">' +
            '<div class="sofia-modal__video-wrap">' +
              '<video class="sofia-modal__video" id="sofia-modal-video" ' +
                     'src="' + SOFIA_CONFIG.introVideoUrl + '" ' +
                     'poster="' + SOFIA_CONFIG.avatarUrl + '" ' +
                     'autoplay loop muted playsinline></video>' +
            '</div>' +
            '<p class="sofia-modal__status" id="sofia-modal-status">Conectando con Sofía…</p>' +
            '<div class="sofia-modal__actions">' +
              '<button class="sofia-modal__cta" type="button" id="sofia-modal-talk" disabled>' +
                '<span class="sofia-modal__cta-text">Hablar con Sofía</span>' +
              '</button>' +
              '<a class="sofia-modal__cta sofia-modal__cta--secondary" ' +
                 'href="https://wa.me/' + SOFIA_CONFIG.whatsappNumber + '?text=' +
                 encodeURIComponent(SOFIA_CONFIG.fallbackMessage) + '" ' +
                 'target="_blank" rel="noopener noreferrer">' +
                'Escríbenos por WhatsApp' +
              '</a>' +
            '</div>' +
            '<p class="sofia-modal__note">Respondemos en menos de 48 horas hábiles.</p>' +
          '</div>' +
        '</div>' +
        '<div class="sofia-modal__active" aria-hidden="true">' +
          '<div class="sofia-modal__active-header">' +
            '<img class="sofia-modal__active-avatar" src="' + SOFIA_CONFIG.avatarUrl + '" alt="" width="40" height="40" />' +
            '<div class="sofia-modal__active-meta">' +
              '<div class="sofia-modal__active-name">Sofía</div>' +
              '<div class="sofia-modal__active-state" data-voice-state="connecting">Conectando…</div>' +
            '</div>' +
            '<button class="sofia-modal__close" type="button" data-sofia-end aria-label="Terminar conversación">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
                '<path d="M18 6L6 18M6 6l12 12"/>' +
              '</svg>' +
            '</button>' +
          '</div>' +
          '<div class="sofia-modal__orb" data-voice-state="connecting">' +
            '<span class="sofia-modal__orb-ring"></span>' +
            '<span class="sofia-modal__orb-ring"></span>' +
            '<span class="sofia-modal__orb-ring"></span>' +
            '<span class="sofia-modal__orb-core"></span>' +
          '</div>' +
          '<div class="sofia-modal__active-actions">' +
            '<button class="sofia-modal__mic" type="button" data-sofia-mute aria-label="Silenciar micrófono">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
                '<path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>' +
                '<path d="M19 10v2a7 7 0 01-14 0v-2"/>' +
                '<line x1="12" y1="19" x2="12" y2="23"/>' +
                '<line x1="8" y1="23" x2="16" y2="23"/>' +
              '</svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    // === Build the clipped host for the ElevenLabs custom element ===
    // Shadow DOM is opaque to outside CSS. We host the widget inside
    // a wrapper that uses `clip-path: inset(100%)` so the native FAB
    // never paints. The custom element stays functional — its methods
    // are reachable from the outside.
    var widgetHost = document.createElement('div');
    widgetHost.id = 'sofia-widget-host';
    widgetHost.setAttribute('aria-hidden', 'true');
    document.body.appendChild(widgetHost);

    // Inject the custom element into the host (only when we have a
    // real agent id).
    //
    // IMPORTANT (v1.7.2): we MUST NOT create the <elevenlabs-convai>
    // element before the ElevenLabs script has registered it. If we
    // do, the browser creates it as a plain HTMLElement and the
    // upgrade happens too late — the custom methods (startConversation,
    // endSession, etc.) never appear on the instance and the widget
    // silently fails. We now create the element lazily, only after
    // the script has loaded AND customElements.get('elevenlabs-convai')
    // is truthy.
    var widget = null;

    // === Element references ===
    var introBlock  = modal.querySelector('.sofia-modal__intro');
    var activeBlock = modal.querySelector('.sofia-modal__active');
    var video       = modal.querySelector('#sofia-modal-video');
    var status      = modal.querySelector('#sofia-modal-status');
    var talkBtn     = modal.querySelector('#sofia-modal-talk');
    var voiceState  = modal.querySelector('.sofia-modal__active-state');
    var orb         = modal.querySelector('.sofia-modal__orb');
    var introClose  = modal.querySelector('.sofia-modal__intro [data-sofia-close]');
    var endBtn      = modal.querySelector('[data-sofia-end]');
    var fallbackTimer = null;
    var opened = false;
    var elevenLabsReady = false;

    function setState(next) {
      if (next === 'active') {
        modal.setAttribute('data-state', 'active');
        introBlock.setAttribute('aria-hidden', 'true');
        activeBlock.setAttribute('aria-hidden', 'false');
      } else {
        modal.setAttribute('data-state', 'intro');
        introBlock.setAttribute('aria-hidden', 'false');
        activeBlock.setAttribute('aria-hidden', 'true');
      }
    }

    function setVoiceState(voiceNext) {
      if (voiceState) {
        voiceState.setAttribute('data-voice-state', voiceNext);
        var labels = {
          connecting: 'Conectando…',
          listening:  'Te escucha',
          speaking:   'Hablando',
          thinking:   'Pensando',
          muted:      'Silenciado',
          ended:      'Conversación terminada'
        };
        voiceState.textContent = labels[voiceNext] || voiceNext;
      }
    }

    // === Section mode: transform the #agente section in place ===
    function startInSection(sectionEl) {
      if (!sectionEl) return;
      if (window.console && console.info) {
        console.info('[sofia] in-section mode starting');
      }
      // If the script is not yet loading, load it now.
      if (!document.getElementById('elevenlabs-convai-script')) {
        loadElevenLabsScriptEagerly();
      }
      // Mark section as in conversation mode
      sectionEl.setAttribute('data-sofia-conversation', 'true');
      // Pause the section video if present
      var sectionVideo = sectionEl.querySelector('video');
      if (sectionVideo && sectionVideo.pause) {
        try { sectionVideo.pause(); } catch (_) {}
        sectionVideo.setAttribute('data-sofia-was-autoplay', '1');
      }
      // Hide the section CTA while we are in the conversation
      var sectionCta = sectionEl.querySelector('[data-sofia-section]');
      if (sectionCta) sectionCta.setAttribute('data-sofia-hidden', 'true');
      // Show the in-section status block if present
      var statusBlock = sectionEl.querySelector('[data-sofia-section-status]');
      if (statusBlock) statusBlock.removeAttribute('hidden');
      // Update section status to ready/connecting
      var sectionStatus = sectionEl.querySelector('.sofia-section__status');
      if (sectionStatus) sectionStatus.textContent = 'Conectando…';
      // Try to start the conversation
      setVoiceState('connecting');
      if (widget && typeof widget.startConversation === 'function') {
        try {
          widget.startConversation();
          if (window.console && console.info) {
            console.info('[sofia] widget.startConversation() called (in-section)');
          }
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'sofia_in_section_started' });
        } catch (err) {
          if (window.console && console.warn) {
            console.warn('[sofia] startConversation (in-section) failed', err);
          }
          if (sectionStatus) {
            sectionStatus.textContent = 'No se pudo conectar. Te dejamos WhatsApp.';
          }
          stopInSection(sectionEl);
        }
      } else {
        if (sectionStatus) {
          sectionStatus.textContent = 'Aún no está lista. Espera un momento o usa WhatsApp.';
        }
        if (window.console && console.warn) {
          console.warn('[sofia] widget not ready when in-section triggered');
        }
      }
    }

    function stopInSection(sectionEl) {
      if (!sectionEl) return;
      sectionEl.removeAttribute('data-sofia-conversation');
      var sectionVideo = sectionEl.querySelector('video');
      if (sectionVideo && sectionVideo.play && sectionVideo.getAttribute('data-sofia-was-autoplay') === '1') {
        try { sectionVideo.play(); } catch (_) {}
        sectionVideo.removeAttribute('data-sofia-was-autoplay');
      }
      var sectionCta = sectionEl.querySelector('[data-sofia-section]');
      if (sectionCta) sectionCta.removeAttribute('data-sofia-hidden');
      var statusBlock = sectionEl.querySelector('[data-sofia-section-status]');
      if (statusBlock) statusBlock.setAttribute('hidden', '');
    }

    // === Open / close modal ===
    function openModal() {
      if (opened) return;
      // If the script is not yet loading (user clicked before the
      // IntersectionObserver fired), load it now.
      if (!document.getElementById('elevenlabs-convai-script')) {
        loadElevenLabsScriptEagerly();
      }
      opened = true;
      modal.removeAttribute('hidden');
      requestAnimationFrame(function () {
        modal.setAttribute('data-open', 'true');
      });
      if (video && video.play) {
        try {
          video.currentTime = 0;
          var pp = video.play();
          if (pp && pp.catch) pp.catch(function () {});
        } catch (_) {}
      }
      if (!elevenLabsReady) {
        startFallbackTimer();
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'sofia_widget_opened',
        page_path: window.location.pathname,
        source: 'click',
        agent_configured: SOFIA_CONFIG.agentId !== 'REPLACE_WITH_AGENT_ID'
      });
    }

    function closeModal() {
      modal.setAttribute('data-open', 'false');
      setState('intro');
      setTimeout(function () { modal.setAttribute('hidden', ''); }, 240);
      if (video && video.pause) {
        try { video.pause(); } catch (_) {}
      }
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      opened = false;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'sofia_widget_closed' });
    }

    function onSofiaReady() {
      elevenLabsReady = true;
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      status.textContent = 'Lista para escucharte.';
      status.classList.add('sofia-modal__status--ready');
      talkBtn.disabled = false;
      talkBtn.querySelector('.sofia-modal__cta-text').textContent = 'Iniciar conversación';
      // Update any in-section status too
      var sectionStatus = document.querySelector('#agente .sofia-section__status');
      if (sectionStatus) {
        sectionStatus.textContent = 'Lista para escucharte. Click para hablar.';
        sectionStatus.classList.add('sofia-section__status--ready');
      }
    }

    // === Wire events ===
    trigger.addEventListener('click', openModal);
    introClose.addEventListener('click', closeModal);
    endBtn.addEventListener('click', function () {
      if (widget && typeof widget.endConversation === 'function') {
        try { widget.endConversation(); } catch (_) {}
      }
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal && modal.getAttribute('data-state') === 'intro') closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && opened) closeModal();
    });

    // Click delegation: any [data-sofia-open] opens the modal,
    // any [data-sofia-section] transforms its enclosing section.
    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-sofia-open]');
      if (opener) {
        e.preventDefault();
        openModal();
        return;
      }
      var sectionOpener = e.target.closest('[data-sofia-section]');
      if (sectionOpener) {
        e.preventDefault();
        var section = sectionOpener.closest('section') || document.getElementById('agente');
        startInSection(section);
        return;
      }
      var sectionStopper = e.target.closest('[data-sofia-section-stop]');
      if (sectionStopper) {
        e.preventDefault();
        var section2 = sectionStopper.closest('section') || document.getElementById('agente');
        stopInSection(section2);
        if (widget && typeof widget.endConversation === 'function') {
          try { widget.endConversation(); } catch (_) {}
        }
        return;
      }
    });

    // === Talk button: collapse modal and start conversation ===
    talkBtn.addEventListener('click', function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'sofia_conversation_start_clicked' });
      if (SOFIA_CONFIG.agentId === 'REPLACE_WITH_AGENT_ID') {
        status.textContent = 'En producción: agent_id configurado vía Vercel env var SOFIA_AGENT_ID.';
        return;
      }
      if (!widget || typeof widget.startConversation !== 'function') {
        status.textContent = 'Aún no está lista. Espera un momento o usa WhatsApp.';
        if (window.console && console.warn) {
          console.warn('[sofia] widget element not ready, startConversation unavailable');
        }
        return;
      }
      status.textContent = 'Conectando…';
      setVoiceState('connecting');
      try {
        widget.startConversation();
        if (window.console && console.info) {
          console.info('[sofia] widget.startConversation() called (modal)');
        }
        window.dataLayer.push({ event: 'sofia_conversation_started' });
        setState('active');
      } catch (err) {
        if (window.console && console.warn) {
          console.warn('[sofia] startConversation failed', err);
        }
        status.textContent = 'No se pudo iniciar. Te dejamos WhatsApp.';
        setState('intro');
        window.dataLayer.push({ event: 'sofia_start_failed', reason: String(err) });
      }
    });

    // === Wire conversation events on the custom element ===
    if (widget) {
      widget.addEventListener('conversationStarted', function () {
        if (window.console && console.info) {
          console.info('[sofia] conversation started with ElevenLabs');
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'sofia_elevenlabs_conversation_started' });
        setVoiceState('listening');
        // Also reflect in section status
        var sectionStatus = document.querySelector('#agente .sofia-section__status');
        if (sectionStatus) sectionStatus.textContent = 'Te escucha. Habla con Sofía.';
      });
      widget.addEventListener('conversationEnded', function () {
        if (window.console && console.info) {
          console.info('[sofia] conversation ended');
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'sofia_elevenlabs_conversation_ended' });
        setVoiceState('ended');
        // If in section mode, return section to its normal state
        var section = document.getElementById('agente');
        if (section && section.getAttribute('data-sofia-conversation') === 'true') {
          stopInSection(section);
        }
        // If in modal mode, return modal to intro
        if (opened) {
          setState('intro');
          status.textContent = 'Conversación terminada. ¿Quieres intentarlo de nuevo o prefieres WhatsApp?';
          status.classList.remove('sofia-modal__status--ready');
          talkBtn.disabled = false;
          talkBtn.querySelector('.sofia-modal__cta-text').textContent = 'Iniciar conversación';
        }
      });
    }

    function startFallbackTimer() {
      if (fallbackTimer) return;
      fallbackTimer = setTimeout(function () {
        if (!elevenLabsReady) {
          status.textContent = 'En este momento no podemos conectar. Te dejamos WhatsApp.';
          status.classList.remove('sofia-modal__status--ready');
          talkBtn.disabled = true;
          talkBtn.querySelector('.sofia-modal__cta-text').textContent = 'No disponible ahora';
          // Also reflect in section status
          var sectionStatus = document.querySelector('#agente .sofia-section__status');
          if (sectionStatus) {
            sectionStatus.textContent = 'En este momento no podemos conectar.';
          }
        }
      }, SOFIA_CONFIG.fallbackTimeoutMs);
    }

    // === Hide the trigger when #agente is in view ===
    var agenteSection = document.getElementById('agente');
    if (agenteSection && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
            trigger.classList.add('sofia-trigger--hidden');
          } else {
            trigger.classList.remove('sofia-trigger--hidden');
          }
        });
      }, { threshold: [0, 0.15, 0.3, 0.5, 0.8, 1] });
      observer.observe(agenteSection);
    }
  }
})();
