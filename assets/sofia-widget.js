/* ================================================================
   SOFIA WIDGET · Grupo CISA · Modal-based trigger
   v1.6 · ABDev · Alberto Balderas

   v1.6 changes (UX rework):
   - Modal has two visual states: `intro` (large, with intro video)
     and `active` (compact pill, with voice-animation orb). When the
     conversation starts the modal collapses to `active` so the page
     stays visible behind the conversation. No dark overlay in active.
   - Intro video plays in loop until the modal is closed, NOT when
     ElevenLabs finishes loading. This stops the "video cuts at 1s"
     bug from v1.5.
   - "Ready" is now reached only when `widget.startConversation` is
     actually a function on the custom element instance (not just when
     `customElements.whenDefined` resolves). This stops the
     "Aún no está lista" false negative on the first click.
   - The native ElevenLabs FAB is now clipped away with a wrapper
     `<div>` styled with `clip-path: inset(100%)` so its shadow-DOM
     button is also clipped (shadow DOM is opaque to outside CSS).
   - Any element with `[data-sofia-open]` opens the modal without
     scrolling. The "Hablar con el agente" button in the #agente
     section was changed from `<a href="#">` to
     `<button data-sofia-open>` so it no longer jumps to top.
   - When the conversation ends, the modal returns to the `intro`
     state with a friendly message (no auto-reopen of a stuck dialog).

   v1.5 change: switched ElevenLabs integration to the official
   `<elevenlabs-convai>` custom element + unpkg widget-embed script.
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
    fallbackTimeoutMs: 5000
  };

  // === Bootstrap: load config from Vercel function, then mount widget ===
  bootstrap();

  function bootstrap() {
    fetchConfig().then(mountWidget).catch(mountWidget);
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

  function mountWidget() {
    // === Inject CSS if not already ===
    if (!document.querySelector('link[href*="sofia-widget.css"]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'assets/sofia-widget.css';
      document.head.appendChild(link);
    }

    // === Build the trigger button (horizontal pill, text + dot) ===
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

    // === Build the modal (two states: intro | active) ===
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
        // === INTRO state: video + status + CTAs ===
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
        // === ACTIVE state: voice animation orb + end-call control ===
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

    // === Build a clipped wrapper for the ElevenLabs custom element ===
    // Shadow DOM is opaque to outside CSS, so we have to clip the
    // host element visually. `clip-path: inset(100%)` removes the
    // element from rendering while keeping it functional, and
    // `clip-path` is honored across the shadow boundary.
    var widgetHost = document.createElement('div');
    widgetHost.id = 'sofia-widget-host';
    widgetHost.setAttribute('aria-hidden', 'true');
    document.body.appendChild(widgetHost);

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
    var muteBtn     = modal.querySelector('[data-sofia-mute]');
    var fallbackTimer = null;
    var opened = false;
    var elevenLabsReady = false;
    var elevenLabsScriptLoading = false;
    var widget = null;       // <elevenlabs-convai>
    var session = null;     // active conversation

    // === Set state ===
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
      if (voiceState) voiceState.setAttribute('data-voice-state', voiceNext);
      if (orb) orb.setAttribute('data-voice-state', voiceNext);
      if (voiceState) {
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

    // === Open / close ===
    function openModal() {
      if (opened) return;
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
      ensureElevenLabsLoaded();
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'sofia_widget_opened',
        page_path: window.location.pathname,
        source: 'click',
        agent_configured: SOFIA_CONFIG.agentId !== 'REPLACE_WITH_AGENT_ID'
      });
    }

    function closeModal() {
      // If a conversation is active, end it first.
      if (session && typeof session.endSession === 'function') {
        try { session.endSession(); } catch (_) {}
        session = null;
      }
      modal.setAttribute('data-open', 'false');
      setState('intro');
      setTimeout(function () {
        modal.setAttribute('hidden', '');
      }, 240);
      // Pause intro video only when the modal is fully closed.
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
      // DO NOT pause the intro video here. v1.5 paused it when the
      // script finished loading, which cut playback at ~1s. The video
      // now plays uninterrupted until the modal closes.
      status.textContent = 'Lista para escucharte.';
      status.classList.add('sofia-modal__status--ready');
      talkBtn.disabled = false;
      talkBtn.querySelector('.sofia-modal__cta-text').textContent = 'Iniciar conversación';
    }

    // === Wire events ===
    trigger.addEventListener('click', openModal);
    introClose.addEventListener('click', closeModal);
    endBtn.addEventListener('click', function () {
      if (session && typeof session.endSession === 'function') {
        try { session.endSession(); } catch (_) {}
      }
    });
    muteBtn.addEventListener('click', function () {
      if (!session) return;
      // The ElevenLabs SDK exposes a muted property on the
      // microphone track; toggling is a UX nicety, not a hard req.
      var nextMuted = muteBtn.getAttribute('data-muted') !== 'true';
      muteBtn.setAttribute('data-muted', String(nextMuted));
      setVoiceState(nextMuted ? 'muted' : 'listening');
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal && modal.getAttribute('data-state') === 'intro') closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && opened) closeModal();
    });

    // Any element with [data-sofia-open] opens the modal without scrolling.
    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-sofia-open]');
      if (!opener) return;
      e.preventDefault();
      openModal();
    });

    // === Talk button: collapse modal and start conversation ===
    talkBtn.addEventListener('click', function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'sofia_conversation_start_clicked' });
      if (SOFIA_CONFIG.agentId === 'REPLACE_WITH_AGENT_ID') {
        status.textContent = 'En producción: aquí se conecta ElevenLabs con agent_id configurado vía Vercel env var SOFIA_AGENT_ID.';
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
          console.info('[sofia] widget.startConversation() called');
        }
        window.dataLayer.push({ event: 'sofia_conversation_started' });
        // Move the modal to the compact `active` state. The page stays
        // visible behind it; the dark overlay is removed in CSS for
        // data-state="active".
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

    // === Load ElevenLabs script + custom element on first open ===
    function ensureElevenLabsLoaded() {
      if (elevenLabsScriptLoading) return;
      if (elevenLabsReady) return;
      if (!SOFIA_CONFIG.agentId || SOFIA_CONFIG.agentId === 'REPLACE_WITH_AGENT_ID') {
        status.textContent = 'Aún no configurado. Escríbenos por WhatsApp.';
        talkBtn.disabled = true;
        talkBtn.querySelector('.sofia-modal__cta-text').textContent = 'No disponible aún';
        return;
      }
      elevenLabsScriptLoading = true;

      // === Inject the custom element into the clipped host ===
      widget = widgetHost.querySelector('elevenlabs-convai');
      if (!widget) {
        widget = document.createElement('elevenlabs-convai');
        widget.id = 'sofia-elevenlabs-widget';
        widget.setAttribute('agent-id', SOFIA_CONFIG.agentId);
        widget.setAttribute('avatar-image-url', new URL(SOFIA_CONFIG.avatarUrl, window.location.href).href);
        widget.setAttribute('action-text', 'Hablar con Sofía');
        widget.setAttribute('start-call-text', 'Iniciar conversación');
        widget.setAttribute('end-call-text', 'Terminar');
        widget.setAttribute('dismissible', 'true');
        widgetHost.appendChild(widget);
      }

      // === Register event listeners BEFORE loading the script ===
      widget.addEventListener('conversationStarted', function () {
        if (window.console && console.info) {
          console.info('[sofia] conversation started with ElevenLabs');
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'sofia_elevenlabs_conversation_started' });
        setVoiceState('listening');
      });
      widget.addEventListener('conversationEnded', function () {
        if (window.console && console.info) {
          console.info('[sofia] conversation ended');
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'sofia_elevenlabs_conversation_ended' });
        setVoiceState('ended');
        // Return to the intro state with a friendly message.
        setState('intro');
        status.textContent = 'Conversación terminada. ¿Quieres intentarlo de nuevo o prefieres WhatsApp?';
        status.classList.remove('sofia-modal__status--ready');
        talkBtn.disabled = false;
        talkBtn.querySelector('.sofia-modal__cta-text').textContent = 'Iniciar conversación';
      });

      // === Load the official unpkg script (registers the custom element) ===
      if (document.getElementById('elevenlabs-convai-script')) {
        waitForCustomElement();
        return;
      }
      var s = document.createElement('script');
      s.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      s.async = true;
      s.id = 'elevenlabs-convai-script';
      s.addEventListener('load', function () {
        if (window.console && console.info) {
          console.info('[sofia] elevenlabs convai-widget-embed script loaded');
        }
        waitForCustomElement();
      });
      s.addEventListener('error', function () {
        elevenLabsScriptLoading = false;
        if (window.console && console.warn) {
          console.warn('[sofia] elevenlabs convai-widget-embed script failed to load');
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'sofia_elevenlabs_script_failed' });
        window.dispatchEvent(new Event('sofia_error'));
      });
      document.body.appendChild(s);

      // === Wait for startConversation to be a real function ===
      // customElements.whenDefined only means the class is registered,
      // not that the instance method exists. We poll for the actual
      // method on the element so the CTA only enables when truly ready.
      function waitForCustomElement() {
        var attempts = 0;
        var maxAttempts = 100; // ~10s at 100ms intervals
        (function poll() {
          if (widget && typeof widget.startConversation === 'function') {
            onSofiaReady();
            return;
          }
          if (attempts++ > maxAttempts) {
            if (window.console && console.warn) {
              console.warn('[sofia] startConversation never appeared after 10s');
            }
            return;
          }
          setTimeout(poll, 100);
        })();
      }
    }

    function startFallbackTimer() {
      if (fallbackTimer) return;
      fallbackTimer = setTimeout(function () {
        if (!elevenLabsReady) {
          status.textContent = 'En este momento no podemos conectar. Te dejamos WhatsApp.';
          status.classList.remove('sofia-modal__status--ready');
          talkBtn.disabled = true;
          talkBtn.querySelector('.sofia-modal__cta-text').textContent = 'No disponible ahora';
        }
      }, SOFIA_CONFIG.fallbackTimeoutMs);
    }

    // === Hide the trigger when #agente is in view (Sofia already on screen) ===
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
