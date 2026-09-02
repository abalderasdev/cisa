/* ============================================================================
   AGENT CISA · FAB controller
   ============================================================================
   - Loop clip idle (con celular)
   - Saludo automático cada 8-12s (clip wave, sin salida)
   - Hover → clip de interacción con cursor
   - Click → monta widget ElevenLabs y abre chat
   - Mouse-tracking sutil (parallax de 8px)
   ============================================================================ */
(function () {
  'use strict';

  var fab   = document.getElementById('agent-cisa-fab');
  var video = document.getElementById('agent-cisa-fab-video');
  if (!fab || !video) return;

  // -------- Paths --------------------------------------------------------
  var IDLE_SRC  = 'assets/agent-cisa-idle.mp4';
  var WAVE_SRC  = 'assets/agent-cisa-wave.mp4';
  var HOVER_SRC = 'assets/agent-cisa-hover.mp4';

  // -------- State --------------------------------------------------------
  var state = 'idle';                // idle | wave | hover | opening | open
  var waveTimer = null;
  var lastInteraction = 0;
  var WAVE_MIN_MS = 8000;            // 8s mínimo entre saludos
  var WAVE_MAX_MS = 12000;           // 12s máximo
  var PAUSE_WAVE_AFTER_INTERACTION = 6000;

  // -------- Boot: load idle and start loop -------------------------------
  try {
    video.src = IDLE_SRC;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  } catch (e) { /* noop */ }

  // -------- Mouse-tracking sutil (parallax de 8px) -----------------------
  var maxOffset = 8;
  var rafPending = false;
  var mouseX = 0, mouseY = 0;

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(applyParallax);
    }
  }
  function applyParallax() {
    rafPending = false;
    var w = window.innerWidth;
    var h = window.innerHeight;
    // Mapear la posición del cursor a un offset [-maxOffset, maxOffset]
    var nx = (mouseX / w) * 2 - 1;   // -1 a 1
    var ny = (mouseY / h) * 2 - 1;
    var tx = (-nx * maxOffset).toFixed(2);
    var ty = (-ny * maxOffset).toFixed(2);
    fab.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
  }
  document.addEventListener('mousemove', onMouseMove, { passive: true });

  // -------- Clip switcher ------------------------------------------------
  function switchTo(src, loop) {
    if (!src) return;
    if (video.getAttribute('src') !== src) {
      try {
        video.setAttribute('src', src);
      } catch (e) { /* IE fallback */ }
      try { video.src = src; } catch (e) {}
    }
    video.loop = !!loop;
    try { video.currentTime = 0; } catch (e) {}
    var pp = video.play();
    if (pp && pp.catch) pp.catch(function () {});
  }

  function playIdle() {
    if (state === 'opening' || state === 'open') return;
    state = 'idle';
    fab.setAttribute('data-state', 'idle');
    switchTo(IDLE_SRC, true);
  }
  function playWave() {
    if (state === 'opening' || state === 'open') return;
    state = 'wave';
    fab.setAttribute('data-state', 'wave');
    switchTo(WAVE_SRC, false);
    video.onended = function () {
      video.onended = null;
      playIdle();
      scheduleNextWave();
    };
  }
  function playHover() {
    if (state === 'opening' || state === 'open') return;
    if (state === 'hover') return;  // ya está en hover
    state = 'hover';
    fab.setAttribute('data-state', 'hover');
    switchTo(HOVER_SRC, true);     // loop mientras esté hover
  }
  function stopHover() {
    if (state !== 'hover') return;
    video.onended = null;
    playIdle();
  }

  // -------- Saludo automático cada 8-12s ---------------------------------
  function scheduleNextWave() {
    if (waveTimer) clearTimeout(waveTimer);
    var delay = WAVE_MIN_MS + Math.floor(Math.random() * (WAVE_MAX_MS - WAVE_MIN_MS));
    waveTimer = setTimeout(function () {
      // No saludar si hubo interacción reciente
      var sinceInteraction = Date.now() - lastInteraction;
      if (state === 'idle' && sinceInteraction > PAUSE_WAVE_AFTER_INTERACTION) {
        playWave();
      } else {
        scheduleNextWave();
      }
    }, delay);
  }
  scheduleNextWave();

  // -------- Hover handlers -----------------------------------------------
  fab.addEventListener('mouseenter', function () {
    lastInteraction = Date.now();
    if (state === 'wave') return;       // no interrumpir saludo
    playHover();
  });
  fab.addEventListener('mouseleave', function () {
    lastInteraction = Date.now();
    if (state === 'wave') return;
    stopHover();
  });

  // -------- Click: monta widget ElevenLabs y abre chat -------------------
  var widgetBootstrapped = false;

  function bootstrapElevenLabs() {
    if (widgetBootstrapped) return Promise.resolve();
    widgetBootstrapped = true;
    return fetch('/api/agent-config', { credentials: 'omit', cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; })
      .then(function (cfg) {
        var agentId = (cfg && cfg.agentId) || 'REPLACE_WITH_AGENT_ID';
        // Si no hay agent_id configurado, ir a fallback (WhatsApp)
        if (agentId === 'REPLACE_WITH_AGENT_ID') {
          throw new Error('agent_id not configured');
        }
        // Crear host off-screen para evitar FAB nativo de ElevenLabs
        var host = document.createElement('div');
        host.id = 'agent-cisa-widget-host';
        host.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:0;height:0;overflow:hidden;';
        document.body.appendChild(host);

        var widget = document.createElement('elevenlabs-convai');
        widget.id = 'agent-cisa-widget';
        widget.setAttribute('agent-id', agentId);
        widget.setAttribute('avatar-image-url', new URL('assets/agent-cisa-avatar.jpg', location.href).href);
        widget.setAttribute('action-text', 'Hablar con CISA');
        widget.setAttribute('language', 'es');
        host.appendChild(widget);

        // Cargar el script de ElevenLabs
        return new Promise(function (resolve, reject) {
          if (window.customElements && customElements.get && customElements.get('elevenlabs-convai')) {
            resolve();
            return;
          }
          var s = document.createElement('script');
          s.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
          s.async = true;
          s.onload = function () { resolve(); };
          s.onerror = function () { reject(new Error('elevenlabs-script-load-failed')); };
          document.head.appendChild(s);
        });
      });
  }

  // Lógica de apertura compartida entre el FAB y los triggers data-agent-open
  function openAgent() {
    state = 'opening';
    fab.setAttribute('data-state', 'opening');
    lastInteraction = Date.now();
    if (waveTimer) { clearTimeout(waveTimer); waveTimer = null; }

    // 1) Si ya hay un widget ElevenLabs montado, abrirlo
    var existing = document.querySelector('elevenlabs-convai');
    if (existing && window.customElements && customElements.get && customElements.get('elevenlabs-convai')) {
      try {
        if (typeof existing.startConversation === 'function') existing.startConversation();
        else if (typeof existing.open === 'function') existing.open();
        else existing.click();
        setTimeout(function () { state = 'open'; fab.setAttribute('data-state', 'open'); }, 600);
        return;
      } catch (e) { /* sigue */ }
    }

    // 2) Bootstrap on-demand y abrir
    bootstrapElevenLabs()
      .then(function () {
        var w = document.querySelector('elevenlabs-convai');
        if (w) {
          try {
            if (typeof w.startConversation === 'function') w.startConversation();
            else w.click();
          } catch (e) { /* noop */ }
        }
        setTimeout(function () { state = 'open'; fab.setAttribute('data-state', 'open'); }, 800);
      })
      .catch(function () {
        // Fallback: WhatsApp
        window.open(
          'https://wa.me/525517964940?text=Hola%2C%20vengo%20del%20sitio%20de%20Grupo%20CISA%20y%20quiero%20informaci%C3%B3n.',
          '_blank',
          'noopener,noreferrer'
        );
        setTimeout(function () { playIdle(); scheduleNextWave(); }, 1200);
      });
  }

  fab.addEventListener('click', openAgent);

  // -------- Accesibilidad: Enter / Space abre el chat --------------------
  fab.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openAgent();
    }
  });

  // -------- Triggers data-agent-open (CTAs, footer, modalidades) ----------
  // Cualquier elemento con [data-agent-open] abre el chat. Atamos click y
  // teclado para que sea accesible aunque la página no haya definido un
  // handler propio. Soporta múltiples elementos en la misma página.
  var agentTriggers = document.querySelectorAll('[data-agent-open]');
  agentTriggers.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openAgent();
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openAgent();
      }
    });
  });

  // -------- Visibility: pausar saludo si la pestaña no es visible -------
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (waveTimer) { clearTimeout(waveTimer); waveTimer = null; }
    } else {
      if (!waveTimer) scheduleNextWave();
    }
  });

  // -------- Log de diagnóstico -------------------------------------------
  if (window.console && console.info) {
    console.info('[cisa-fab] mounted', { state: state });
  }
})();
