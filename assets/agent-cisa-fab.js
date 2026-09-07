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

  // -------- Clips --------------------------------------------------------
  // El reposo era el clip del personaje mirando el celular: nunca levantaba
  // la vista. Ahora reposa de frente y el del celular queda como reaccion
  // al cursor. Los nombres de archivo no cambian, solo el papel que juegan.
  var IDLE_SRC  = '/assets/agent-cisa-hover.mp4';   // reposo: de frente
  var WAVE_SRC  = '/assets/agent-cisa-wave.mp4';    // saludo automatico
  var HOVER_SRC = '/assets/agent-cisa-idle.mp4';    // reaccion al cursor

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

  // -------- Apertura y cierre del asistente ------------------------------
  // El widget de ElevenLabs se dibuja fijo en la esquina inferior derecha,
  // la misma que ocupa este FAB, y con z-index menor. Sin esto, el FAB le
  // tapaba sus botones ("Iniciar llamada" y "Mensaje") y no habia forma de
  // volver. Ahora: al abrir, el FAB se aparta; para regresar, un boton de
  // cierre propio que desmonta el widget y devuelve el personaje.
  var host = null;          // contenedor del widget
  var botonCerrar = null;   // nuestro control de regreso
  var abierto = false;

  function ocultarFab() {
    fab.classList.add('is-away');
    fab.setAttribute('aria-expanded', 'true');
    fab.setAttribute('tabindex', '-1');
    if (waveTimer) { clearTimeout(waveTimer); waveTimer = null; }
  }

  function mostrarFab() {
    fab.classList.remove('is-away');
    fab.setAttribute('aria-expanded', 'false');
    fab.removeAttribute('tabindex');
  }

  function ponerBotonCerrar() {
    if (botonCerrar) return;
    botonCerrar = document.createElement('button');
    botonCerrar.type = 'button';
    botonCerrar.id = 'agent-cisa-close';
    botonCerrar.setAttribute('aria-label', 'Cerrar el asistente y volver');
    botonCerrar.innerHTML = '<span aria-hidden="true">×</span> Cerrar asistente';
    botonCerrar.addEventListener('click', cerrarAgente);
    // La barra del sitio es sticky y su alto cambia entre movil y escritorio.
    // Se mide una vez para que el boton quede siempre debajo de ella.
    var barra = document.querySelector('.site-header');
    if (barra) {
      document.documentElement.style.setProperty(
        '--cisa-header-h', Math.round(barra.getBoundingClientRect().height) + 'px');
    }
    document.body.appendChild(botonCerrar);
    // Que el foco caiga en algo util al abrir con teclado.
    try { botonCerrar.focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }

  function quitarBotonCerrar() {
    if (botonCerrar && botonCerrar.parentNode) botonCerrar.parentNode.removeChild(botonCerrar);
    botonCerrar = null;
  }

  // Vuelve al estado de reposo pase lo que pase. playIdle() se niega a
  // correr en 'opening'/'open', asi que aqui se destraba primero.
  function volverAReposo() {
    abierto = false;
    state = 'idle';
    mostrarFab();
    playIdle();
    scheduleNextWave();
  }

  function cerrarAgente() {
    quitarBotonCerrar();
    if (host && host.parentNode) host.parentNode.removeChild(host);
    host = null;
    // Se desmonta entero para que la proxima apertura arranque limpia.
    volverAReposo();
  }

  function montarWidget() {
    return fetch('/api/sofia-config', { credentials: 'omit', cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; })
      .then(function (cfg) {
        var agentId = (cfg && cfg.agentId) || 'REPLACE_WITH_AGENT_ID';
        if (agentId === 'REPLACE_WITH_AGENT_ID') {
          throw new Error('agent_id sin configurar');
        }
        host = document.createElement('div');
        host.id = 'agent-cisa-widget-host';
        document.body.appendChild(host);

        var widget = document.createElement('elevenlabs-convai');
        widget.id = 'agent-cisa-widget';
        widget.setAttribute('agent-id', agentId);
        widget.setAttribute('avatar-image-url', new URL('/assets/agent-cisa-avatar.jpg', location.origin).href);
        widget.setAttribute('action-text', 'Hablar con CISA');
        widget.setAttribute('language', 'es');
        host.appendChild(widget);

        return new Promise(function (resolve, reject) {
          if (window.customElements && customElements.get && customElements.get('elevenlabs-convai')) {
            resolve();
            return;
          }
          var s = document.createElement('script');
          s.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
          s.async = true;
          s.onload = function () { resolve(); };
          s.onerror = function () { reject(new Error('no cargo el script de elevenlabs')); };
          document.head.appendChild(s);
        });
      });
  }

  function irAWhatsApp() {
    window.open(
      'https://wa.me/525517964940?text=Hola%2C%20vengo%20del%20sitio%20de%20Grupo%20CISA%20y%20quiero%20informaci%C3%B3n.',
      '_blank',
      'noopener,noreferrer'
    );
  }

  function openAgent() {
    // Con el asistente ya abierto, el FAB no vuelve a disparar nada.
    if (abierto) return;

    state = 'opening';
    fab.setAttribute('data-state', 'opening');
    lastInteraction = Date.now();
    if (waveTimer) { clearTimeout(waveTimer); waveTimer = null; }

    montarWidget()
      .then(function () {
        var w = document.querySelector('elevenlabs-convai');
        if (w) {
          try {
            if (typeof w.startConversation === 'function') w.startConversation();
            else if (typeof w.open === 'function') w.open();
          } catch (e) { /* el widget abre igual con su propio boton */ }
        }
        abierto = true;
        state = 'open';
        fab.setAttribute('data-state', 'open');
        ocultarFab();
        ponerBotonCerrar();
      })
      .catch(function () {
        // Sin agente disponible, WhatsApp. Y el FAB vuelve a reposo:
        // antes se quedaba clavado en 'opening' para siempre.
        if (host && host.parentNode) host.parentNode.removeChild(host);
        host = null;
        irAWhatsApp();
        setTimeout(volverAReposo, 1200);
      });
  }

  fab.addEventListener('click', openAgent);

  // -------- Accesibilidad: Enter / Space abre; Escape cierra -------------
  fab.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openAgent();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && abierto) cerrarAgente();
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
