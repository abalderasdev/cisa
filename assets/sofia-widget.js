/* ================================================================
   SOFIA WIDGET · Grupo CISA · Modal-based trigger
   v1.3 · ABDev · Alberto Balderas

   v1.3 change: SOFIA_CONFIG is loaded from /api/sofia-config (a
   Vercel serverless function) so the team can update the ElevenLabs
   agent_id and the WhatsApp fallback number via Vercel Environment
   Variables without redeploying. Falls back to hardcoded defaults
   if the function is unreachable or returns an error.

   Behaviors implemented:
   - Floating button (bottom-right) opens modal
   - Modal shows intro video on open (sofia-intro.mp4, autoplay loop muted)
   - Two CTAs in modal: "Hablar con Sofía" (primary, ElevenLabs when
     configured, disabled otherwise) + WhatsApp link (always available).
   - Fallback if ElevenLabs is unavailable after 5s: show WhatsApp CTA.
   - Closes on Esc, on backdrop click, on close button.
   - Pauses video when modal closes.
   - Hides on excluded pages (contacto, gracias, aviso-de-privacidad,
     precalificar) per spec section 4.
   - When the visitor scrolls into the #agente section, the button
     fades out and becomes non-interactive (Sofia is already on screen).
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
      window.dataLayer.push({ event: 'sofia_conversation_started' });
      if (SOFIA_CONFIG.agentId === 'REPLACE_WITH_AGENT_ID') {
        status.textContent = 'En producción: aquí se conecta ElevenLabs con agent_id configurado vía Vercel env var SOFIA_AGENT_ID.';
      } else {
        status.textContent = 'Iniciando conversación con ElevenLabs agent_id ' + SOFIA_CONFIG.agentId + '…';
      }
    });

    // === Load ElevenLabs script on first open ===
    function ensureElevenLabsLoaded() {
      if (elevenLabsScriptLoading) return;
      if (document.getElementById('elevenlabs-convai')) {
        // Script tag already in DOM (e.g. a previous click already started it).
        // Just register the listener and let the existing script fire.
        elevenLabsScriptLoading = true;
        return;
      }
      if (!SOFIA_CONFIG.agentId || SOFIA_CONFIG.agentId === 'REPLACE_WITH_AGENT_ID') {
        // No real agent_id. Keep the modal in WhatsApp-only mode and
        // make sure the CTA is disabled so visitors don't think it works.
        status.textContent = 'Aún no configurado. Escríbenos por WhatsApp.';
        talkBtn.disabled = true;
        talkBtn.textContent = 'No disponible aún';
        return;
      }
      elevenLabsScriptLoading = true;
      // Always register the listener BEFORE injecting the script so we
      // never miss the 'sofia_widget_loaded' event.
      window.addEventListener('sofia_widget_loaded', onSofiaReady, { once: true });
      var s = document.createElement('script');
      s.src = 'https://elevenlabs.io/convai/embed.js?agent_id=' + encodeURIComponent(SOFIA_CONFIG.agentId);
      s.async = true;
      s.id = 'elevenlabs-convai';
      s.addEventListener('load', function () {
        if (window.console && console.info) {
          console.info('[sofia] elevenlabs embed script loaded');
        }
        // If the script auto-fires the event before we registered the
        // listener (shouldn't happen, but defensive), our listener above
        // would miss it. Instead, dispatch ourselves with a small delay.
        setTimeout(function () {
          if (!elevenLabsReady) {
            window.dispatchEvent(new Event('sofia_widget_loaded'));
          }
        }, 50);
      });
      s.addEventListener('error', function () {
        elevenLabsScriptLoading = false;
        if (window.console && console.warn) {
          console.warn('[sofia] elevenlabs embed script failed to load');
        }
        window.dispatchEvent(new Event('sofia_error'));
      });
      document.body.appendChild(s);
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
