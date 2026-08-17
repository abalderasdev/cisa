/* ================================================================
   SOFIA WIDGET · Grupo CISA · Three-state FAB
   v2.0 · ABDev · Alberto Balderas
   Spec: agente-sofia/integration-spec.md

   Behaviors implemented:
   - FAB: round button (72px desktop, 60px mobile) bottom-left.
   - Idle state: <video> inside the FAB loops the writing clip
     (sofia-writing-loop.mp4) muted, autoplay, playsinline.
   - Hover state: on mouseenter, swap the <video> src to the greeting
     clip (sofia-greeting.mp4) and play it once. On mouseleave, after
     800ms, return to the writing loop.
   - Touch: a single tap on mobile fires the hover so the greeting
     plays; a second tap (or any tap after the first idle beat) fires
     the click.
   - Click state: when ElevenLabs agent_id is configured, load the
     official convai embed and let it open inline (the script attaches
     its own UI). When it is not configured yet, open WhatsApp as the
     fallback channel.
   - Pulse ring around the FAB draws attention without being annoying.
   - Excluded on /contacto, /precalificar, /gracias, /aviso-de-privacidad
     (per spec section 4). CSS is also auto-injected.
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
    agentId:        'REPLACE_WITH_AGENT_ID', // from ElevenLabs dashboard
    whatsappNumber: '525517964940',
    fallbackMessage:'Hola, necesito información sobre Grupo CISA.',
    writingVideo:   'assets/sofia-writing-loop.mp4',
    greetingVideo:  'assets/sofia-greeting.mp4',
    poster:         'assets/sofia-avatar.jpg',
    // ms to wait after mouseleave before swapping back to writing loop
    returnToIdleMs: 800
  };

  // === Inject CSS if not already ===
  if (!document.querySelector('link[href*="sofia-widget.css"]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/sofia-widget.css';
    document.head.appendChild(link);
  }

  // === Build the FAB ===
  var fab = document.createElement('button');
  fab.className = 'sofia-fab';
  fab.setAttribute('type', 'button');
  fab.setAttribute('aria-label', 'Hablar con Sofía, asistente virtual de Grupo CISA');

  // Inner structure: pulse ring > video > online dot
  fab.innerHTML =
    '<span class="sofia-fab__ring" aria-hidden="true"></span>' +
    '<span class="sofia-fab__inner">' +
      '<video class="sofia-fab__video" autoplay loop muted playsinline ' +
             'preload="auto" poster="' + SOFIA_CONFIG.poster + '" ' +
             'aria-hidden="true">' +
        '<source src="' + SOFIA_CONFIG.writingVideo + '" type="video/mp4">' +
      '</video>' +
    '</span>' +
    '<span class="sofia-fab__dot" aria-hidden="true"></span>';
  document.body.appendChild(fab);

  var video = fab.querySelector('.sofia-fab__video');
  var inGreeting = false;
  var returnTimer = null;
  var conversationStarted = false;

  function playWriting() {
    if (video.src && video.src.indexOf(SOFIA_CONFIG.writingVideo) !== -1) {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      return;
    }
    video.loop = true;
    video.src = SOFIA_CONFIG.writingVideo;
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  function playGreeting() {
    if (video.src && video.src.indexOf(SOFIA_CONFIG.greetingVideo) !== -1) {
      video.currentTime = 0;
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      return;
    }
    video.loop = false;
    video.src = SOFIA_CONFIG.greetingVideo;
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  // === Hover behavior (mouse) ===
  fab.addEventListener('mouseenter', function () {
    if (returnTimer) { clearTimeout(returnTimer); returnTimer = null; }
    if (inGreeting) return;
    inGreeting = true;
    playGreeting();
  });

  fab.addEventListener('mouseleave', function () {
    if (!inGreeting) return;
    inGreeting = false;
    returnTimer = setTimeout(function () {
      returnTimer = null;
      if (inGreeting) return; // user hovered again during the wait
      playWriting();
    }, SOFIA_CONFIG.returnToIdleMs);
  });

  // === Touch behavior (mobile single-tap = hover; double-tap = click) ===
  var lastTap = 0;
  fab.addEventListener('touchstart', function (e) {
    var now = Date.now();
    if (now - lastTap < 350) {
      // Double tap: treat as click
      e.preventDefault();
      fab.click();
      lastTap = 0;
    } else {
      // Single tap: trigger greeting
      if (returnTimer) { clearTimeout(returnTimer); returnTimer = null; }
      if (!inGreeting) {
        inGreeting = true;
        playGreeting();
      }
      lastTap = now;
      // After a moment without a second tap, return to writing loop
      setTimeout(function () {
        if (lastTap === now && inGreeting) {
          inGreeting = false;
          playWriting();
        }
      }, 1500);
    }
  }, { passive: true });

  // === Click behavior ===
  fab.addEventListener('click', function (e) {
    // Avoid double-firing on touch devices (touchstart already handled double-tap)
    if (e && e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents && lastTap && Date.now() - lastTap < 500) {
      return;
    }
    if (conversationStarted) return;
    conversationStarted = true;
    fab.classList.add('sofia-fab--loading');

    // Analytics
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'sofia_fab_clicked',
      page_path: window.location.pathname,
      has_agent_id: !!SOFIA_CONFIG.agentId && SOFIA_CONFIG.agentId !== 'REPLACE_WITH_AGENT_ID'
    });

    var hasRealAgent = SOFIA_CONFIG.agentId && SOFIA_CONFIG.agentId !== 'REPLACE_WITH_AGENT_ID';

    if (hasRealAgent) {
      // Load the official ElevenLabs convai embed; it attaches its own
      // UI to the body. We mark the FAB as active so it can be re-opened
      // if the visitor closes the agent panel.
      var s = document.createElement('script');
      s.src = 'https://elevenlabs.io/convai/embed.js?agent_id=' + encodeURIComponent(SOFIA_CONFIG.agentId);
      s.async = true;
      s.id = 'elevenlabs-convai';
      s.addEventListener('load', function () {
        fab.classList.remove('sofia-fab--loading');
        fab.classList.add('sofia-fab--active');
        window.dispatchEvent(new Event('sofia_el_loaded'));
        window.dataLayer.push({ event: 'sofia_el_loaded' });
      });
      s.addEventListener('error', function () {
        fab.classList.remove('sofia-fab--loading');
        window.dataLayer.push({ event: 'sofia_el_load_error' });
        openWhatsAppFallback();
      });
      document.body.appendChild(s);

      // Safety fallback: if ElevenLabs script doesn't fire any event in
      // 8s, treat as unavailable and open WhatsApp.
      setTimeout(function () {
        if (!fab.classList.contains('sofia-fab--active')) {
          fab.classList.remove('sofia-fab--loading');
          openWhatsAppFallback();
        }
      }, 8000);
    } else {
      // No agent_id yet -> WhatsApp fallback.
      openWhatsAppFallback();
    }
  });

  function openWhatsAppFallback() {
    var url = 'https://wa.me/' + SOFIA_CONFIG.whatsappNumber +
              '?text=' + encodeURIComponent(SOFIA_CONFIG.fallbackMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
    fab.classList.remove('sofia-fab--loading');
    fab.classList.add('sofia-fab--active');
    window.dataLayer.push({ event: 'sofia_whatsapp_fallback_opened' });
  }

  // === Visibility / lifecycle ===
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      video.pause();
    } else {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    }
  });

  // Preload the greeting clip after idle so the hover swap is instant
  setTimeout(function () {
    var preload = new Image();
    preload.src = SOFIA_CONFIG.greetingVideo;
  }, 4000);
})();
