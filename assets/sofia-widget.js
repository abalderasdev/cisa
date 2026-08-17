/* ================================================================
   SOFIA WIDGET · Grupo CISA · ElevenLabs conversational agent
   v1.0 · ABDev · Alberto Balderas
   Spec: agente-sofia/integration-spec.md

   Behaviors implemented:
   - Floating button (bottom-left) opens modal
   - Modal shows intro video on first open
   - Replaces video with "ready" state after intro
   - Two CTAs: "Hablar por WhatsApp" (primary) + placeholder for ElevenLabs
   - Fallback if ElevenLabs unavailable after 5s: show WhatsApp CTA
   - Closes on Esc, on backdrop click, on close button
   - Pauses video when modal closes
   - Hides on excluded pages (contacto, gracias, aviso-de-privacidad, precalificar)
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

  // === Config ===
  var SOFIA_CONFIG = {
    agentId: 'REPLACE_WITH_AGENT_ID',     // from ElevenLabs dashboard
    avatarUrl: 'assets/sofia-avatar.jpg',
    introVideoUrl: 'assets/sofia-intro.mp4',
    whatsappNumber: '525517964940',
    fallbackMessage: 'Hola, necesito información sobre Grupo CISA.',
    fallbackTimeoutMs: 5000
  };

  // === Inject HTML ===
  var trigger = document.createElement('button');
  trigger.className = 'sofia-trigger';
  trigger.setAttribute('aria-label', 'Hablar con Sofía, asistente virtual de Grupo CISA');
  trigger.setAttribute('type', 'button');
  trigger.innerHTML =
    '<span class="sofia-trigger__inner">' +
      '<span class="sofia-trigger__avatar-wrap">' +
        '<img class="sofia-trigger__avatar" src="' + SOFIA_CONFIG.avatarUrl + '" alt="" width="36" height="36" />' +
        '<span class="sofia-trigger__dot" aria-hidden="true"></span>' +
      '</span>' +
      '<span class="sofia-trigger__label">Hablar con Sofía</span>' +
    '</span>';
  document.body.appendChild(trigger);

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
               'autoplay muted playsinline></video>' +
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

  // === State ===
  var video = modal.querySelector('#sofia-modal-video');
  var status = modal.querySelector('#sofia-modal-status');
  var talkBtn = modal.querySelector('#sofia-modal-talk');
  var closeBtn = modal.querySelector('.sofia-modal__close');
  var fallbackTimer = null;
  var opened = false;
  var elevenLabsReady = false;

  // === Behaviors ===
  function openModal() {
    if (opened) return;
    opened = true;
    modal.removeAttribute('hidden');
    requestAnimationFrame(function () {
      modal.setAttribute('data-open', 'true');
    });
    // play video
    if (video && video.pause) {
      video.currentTime = 0;
      var playPromise = video.play();
      if (playPromise && playPromise.catch) playPromise.catch(function () {});
    }
    // start fallback timer
    fallbackTimer = setTimeout(function () {
      if (!elevenLabsReady) {
        status.textContent = 'En este momento no podemos conectar. Te dejamos WhatsApp.';
        status.classList.remove('sofia-modal__status--ready');
        talkBtn.disabled = true;
        talkBtn.textContent = 'No disponible ahora';
      }
    }, SOFIA_CONFIG.fallbackTimeoutMs);

    // listen for sofia ready
    window.addEventListener('sofia_widget_loaded', onSofiaReady, { once: true });

    // dispatch analytics
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'sofia_widget_opened',
      page_path: window.location.pathname,
      source: 'click'
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
    // For now (placeholder agent_id), show note
    status.textContent = 'En producción: aquí se conecta ElevenLabs con agent_id ' + SOFIA_CONFIG.agentId;
  });

  // === Load ElevenLabs script (will be no-op until agent_id is real) ===
  if (SOFIA_CONFIG.agentId && SOFIA_CONFIG.agentId !== 'REPLACE_WITH_AGENT_ID') {
    var s = document.createElement('script');
    s.src = 'https://elevenlabs.io/convai/embed.js?agent_id=' + encodeURIComponent(SOFIA_CONFIG.agentId);
    s.async = true;
    s.id = 'elevenlabs-convai';
    s.addEventListener('load', function () {
      window.dispatchEvent(new Event('sofia_widget_loaded'));
    });
    s.addEventListener('error', function () {
      window.dispatchEvent(new Event('sofia_error'));
    });
    document.body.appendChild(s);
  }

  // === Load widget CSS if not already ===
  if (!document.querySelector('link[href*="sofia-widget.css"]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/sofia-widget.css';
    document.head.appendChild(link);
  }
})();
