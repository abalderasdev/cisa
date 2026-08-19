/* ================================================================
   SOFIA WIDGET · Grupo CISA · Modal-based trigger
   v1.5 · ABDev · Alberto Balderas

   v1.5 change: switched ElevenLabs integration from the deprecated
   `https://elevenlabs.io/convai/embed.js?agent_id=XXX` endpoint
   (which 404s as of 2025) to the official approach using the
   `<elevenlabs-convai>` custom element + the unpkg widget-embed
   script. The custom element is mounted off-screen (so its built-in
   floating button never appears) and we drive the conversation via
   `widget.startConversation()` when the user clicks the primary CTA
   in our modal. ElevenLabs' own modal opens on top of everything
   when a conversation starts; our modal hides itself at that point.

   v1.4 change: load ElevenLabs script on first modal open (not on
   mount) to avoid the race where the script's `sofia_widget_loaded`
   event fired before we registered the listener.
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
    // Try to upgrade SOFIA_CONFIG with env-driven values. If it fails,
    // we still mount the widget with the defaults above.
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
        // Tag the page so external scripts / debug can see which mode we are in
        document.documentElement.setAttribute(
          'data-sofia-agent',
          data.configured ? 'live' : 'fallback'
        );
        // Expose the config for the console and for analytics.
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

    // === Build the modal ===
    var modal = document.createElement('div');
    modal.className = 'sofia-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'sofia-modal-title');
    modal.setAttribute('aria-describedby', 'sofia-modal-status');
    modal.setAttribute('data-open', 'false');
    modal.setAttribute('hidden', '');
    modal.innerHTML =
      '<div class="sofia-modal__panel">' +
        '<div class="sofia-modal__header">' +
          '<div>' +
            '<h2 class="sofia-modal__title" id="sofia-modal-title">Hola, soy Sofía</h2>' +
            '<p class="sofia-modal__subtitle">Asistente virtual de Grupo CISA</p>' +
          '</div>' +
          '<button class="sofia-modal__close" type="button" aria-label="Cerrar">×</button>' +
        '</div>' +
        '<div class="sofia-modal__body">' +
          '<video class="sofia-modal__video" id="sofia-modal-video" ' +
                 'src="' + SOFIA_CONFIG.introVideoUrl + '" ' +
                 'poster="' + SOFIA_CONFIG.avatarUrl + '" ' +
                 'autoplay loop muted playsinline></video>' +
          '<p class="sofia-modal__status" id="sofia-modal-status">Conectando con Sofía…</p>' +
          '<div class="sofia-modal__actions">' +
            '<button class="sofia-modal__cta" type="button" id="sofia-modal-talk" disabled>' +
              'Hablar con Sofía' +
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
      '</div>';
    document.body.appendChild(modal);

    // === Element references ===
    var video     = modal.querySelector('#sofia-modal-video');
    var status    = modal.querySelector('#sofia-modal-status');
    var talkBtn   = modal.querySelector('#sofia-modal-talk');
    var closeBtn  = modal.querySelector('.sofia-modal__close');
    var fallbackTimer = null;
    var opened = false;
    var elevenLabsReady = false;
    var elevenLabsScriptLoading = false;

    // === Open / close ===
    function openModal() {
      if (opened) return;
      opened = true;
      modal.removeAttribute('hidden');
      requestAnimationFrame(function () {
        modal.setAttribute('data-open', 'true');
      });
      if (video && video.play) {
        video.currentTime = 0;
        var pp = video.play();
        if (pp && pp.catch) pp.catch(function () {});
      }
      // Start the safety timeout only if ElevenLabs is not already ready
      // and the script is not already loading. If neither, we'll just show
      // the WhatsApp CTA after the timeout.
      if (!elevenLabsReady) {
        startFallbackTimer();
      }
      // Load ElevenLabs the first time the user opens the modal. This
      // avoids the race where the embed script loads on page load and
      // fires 'sofia_widget_loaded' before the user opens the modal and
      // registers the listener.
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
      modal.setAttribute('data-open', 'false');
      setTimeout(function () {
        modal.setAttribute('hidden', '');
      }, 220);
      if (video && video.pause) video.pause();
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'sofia_widget_closed' });
    }

    function onSofiaReady() {
      elevenLabsReady = true;
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      if (video && video.pause) video.pause();
      status.textContent = 'Lista para escucharte.';
      status.classList.add('sofia-modal__status--ready');
      talkBtn.disabled = false;
      talkBtn.textContent = 'Iniciar conversación';
    }

    // === Wire events ===
    trigger.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && opened) closeModal();
    });
    talkBtn.addEventListener('click', function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'sofia_conversation_start_clicked' });
      if (SOFIA_CONFIG.agentId === 'REPLACE_WITH_AGENT_ID') {
        status.textContent = 'En producción: aquí se conecta ElevenLabs con agent_id configurado vía Vercel env var SOFIA_AGENT_ID.';
        return;
      }
      var widget = document.getElementById('sofia-elevenlabs-widget');
      if (widget && typeof widget.startConversation === 'function') {
        status.textContent = 'Conectando con Sofía…';
        try {
          widget.startConversation();
          if (window.console && console.info) {
            console.info('[sofia] widget.startConversation() called');
          }
          window.dataLayer.push({ event: 'sofia_conversation_started' });
        } catch (err) {
          if (window.console && console.warn) {
            console.warn('[sofia] startConversation failed', err);
          }
          status.textContent = 'No se pudo iniciar. Te dejamos WhatsApp.';
          window.dataLayer.push({ event: 'sofia_start_failed', reason: String(err) });
        }
      } else {
        status.textContent = 'Aún no está lista. Espera un momento o usa WhatsApp.';
        if (window.console && console.warn) {
          console.warn('[sofia] widget element not ready, startConversation unavailable');
        }
      }
    });

    // === Load ElevenLabs script + custom element on first open ===
    function ensureElevenLabsLoaded() {
      if (elevenLabsScriptLoading) return;
      if (elevenLabsReady) return;
      if (!SOFIA_CONFIG.agentId || SOFIA_CONFIG.agentId === 'REPLACE_WITH_AGENT_ID') {
        // No real agent_id. Keep the modal in WhatsApp-only mode and
        // make sure the CTA is disabled so visitors don't think it works.
        status.textContent = 'Aún no configurado. Escríbenos por WhatsApp.';
        talkBtn.disabled = true;
        talkBtn.textContent = 'No disponible aún';
        return;
      }
      elevenLabsScriptLoading = true;

      // === Step 1: inject the custom element (off-screen, hidden) ===
      // The custom element is what actually connects to ElevenLabs. We
      // mount it invisibly (CSS in sofia-widget.css hides its built-in
      // floating button) and drive the conversation via startConversation().
      var widget = document.getElementById('sofia-elevenlabs-widget');
      if (!widget) {
        widget = document.createElement('elevenlabs-convai');
        widget.id = 'sofia-elevenlabs-widget';
        widget.setAttribute('agent-id', SOFIA_CONFIG.agentId);
        widget.setAttribute('avatar-image-url', new URL(SOFIA_CONFIG.avatarUrl, window.location.href).href);
        widget.setAttribute('action-text', 'Hablar con Sofía');
        widget.setAttribute('start-call-text', 'Iniciar conversación');
        widget.setAttribute('end-call-text', 'Terminar');
        widget.setAttribute('dismissible', 'true');
        // We drive the widget programmatically; the native button is hidden by CSS.
        document.body.appendChild(widget);
      }

      // === Step 2: register event listeners BEFORE loading the script ===
      // Per ElevenLabs docs, the custom element fires these custom events.
      widget.addEventListener('conversationStarted', function () {
        if (window.console && console.info) {
          console.info('[sofia] conversation started with ElevenLabs');
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'sofia_elevenlabs_conversation_started' });
        // Hide our modal so ElevenLabs' own UI takes the screen
        modal.setAttribute('data-open', 'false');
        setTimeout(function () { modal.setAttribute('hidden', ''); }, 220);
      });
      widget.addEventListener('conversationEnded', function () {
        if (window.console && console.info) {
          console.info('[sofia] conversation ended');
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'sofia_elevenlabs_conversation_ended' });
        // Re-open our modal so the user can retry or switch to WhatsApp
        modal.removeAttribute('hidden');
        requestAnimationFrame(function () { modal.setAttribute('data-open', 'true'); });
        status.textContent = 'Conversación terminada. ¿Quieres intentarlo de nuevo o prefieres WhatsApp?';
        status.classList.remove('sofia-modal__status--ready');
      });

      // === Step 3: load the official unpkg script (registers the custom element) ===
      if (document.getElementById('elevenlabs-convai-script')) {
        // Script already injected (e.g. duplicate click); just wire ready state.
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

      // === Step 4: wait for custom element to upgrade, then enable the CTA ===
      function waitForCustomElement() {
        if (window.customElements && customElements.whenDefined) {
          customElements.whenDefined('elevenlabs-convai').then(function () {
            onSofiaReady();
          }).catch(function (e) {
            if (window.console && console.warn) {
              console.warn('[sofia] whenDefined failed', e);
            }
            // Fallback: poll for startConversation availability
            pollForStartConversation(0);
          });
        } else {
          // Browser without customElements.whenDefined (shouldn't happen on modern browsers)
          pollForStartConversation(0);
        }
      }

      function pollForStartConversation(attempts) {
        if (widget && typeof widget.startConversation === 'function') {
          onSofiaReady();
          return;
        }
        if (attempts > 30) {
          if (window.console && console.warn) {
            console.warn('[sofia] startConversation never appeared after 30 polls');
          }
          return;
        }
        setTimeout(function () { pollForStartConversation(attempts + 1); }, 100);
      }
    }

    function startFallbackTimer() {
      if (fallbackTimer) return;
      fallbackTimer = setTimeout(function () {
        if (!elevenLabsReady) {
          status.textContent = 'En este momento no podemos conectar. Te dejamos WhatsApp.';
          status.classList.remove('sofia-modal__status--ready');
          talkBtn.disabled = true;
          talkBtn.textContent = 'No disponible ahora';
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
