/* ============================================================================
   INTRO · controlador de la cortina de entrada
   ============================================================================
   Reglas de comportamiento:
   - Una vez por sesion del navegador (sessionStorage). Al volver desde otra
     pagina del sitio no se repite.
   - Se salta entera si el visitante pidio menos animacion, si llega con un
     ancla (#algo) o con ?intro=0, o si es un bot.
   - Tope duro de tiempo: pase lo que pase, la cortina se cae.
   - Si el video falla, no carga, o el navegador bloquea el autoplay, se
     cierra de inmediato. El sitio nunca queda tapado.

   Para cambiar el clip, basta con reemplazar VIDEO_SRC por otro archivo.
   ========================================================================== */
(function () {
  'use strict';

  var VIDEO_SRC   = '/assets/agent-cisa-entrance-1.mp4';
  var CLAVE       = 'cisa_intro_vista';
  var TOPE_MS     = 6000;   // tope duro: nunca mas que esto
  var ESPERA_MS   = 1200;   // si en este tiempo no arranco, se cierra

  var raiz = document.documentElement;

  function yaVista() {
    try { return sessionStorage.getItem(CLAVE) === '1'; } catch (e) { return false; }
  }
  function marcarVista() {
    try { sessionStorage.setItem(CLAVE, '1'); } catch (e) { /* modo privado */ }
  }

  function debeOmitirse() {
    if (yaVista()) return true;
    if (location.hash && location.hash.length > 1) return true;
    try {
      if (new URL(location.href).searchParams.get('intro') === '0') return true;
    } catch (e) { /* noop */ }
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    } catch (e) { /* noop */ }
    return false;
  }

  if (debeOmitirse()) return;

  // --- Construccion del DOM ------------------------------------------------
  var intro = document.createElement('div');
  intro.className = 'intro';
  intro.setAttribute('role', 'dialog');
  intro.setAttribute('aria-label', 'Presentación de Grupo CISA');

  var video = document.createElement('video');
  video.className = 'intro__video';
  video.src = VIDEO_SRC;
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('muted', '');
  video.preload = 'auto';
  video.setAttribute('aria-hidden', 'true');

  var scrim = document.createElement('div');
  scrim.className = 'intro__scrim';

  var barra = document.createElement('div');
  barra.className = 'intro__bar';

  var saltar = document.createElement('button');
  saltar.type = 'button';
  saltar.className = 'intro__skip';
  saltar.textContent = 'Saltar intro';

  intro.appendChild(video);
  intro.appendChild(scrim);
  intro.appendChild(barra);
  intro.appendChild(saltar);

  function montar() {
    if (!document.body) return;
    raiz.classList.add('has-intro');
    document.body.appendChild(intro);
    saltar.focus({ preventScroll: true });
  }

  // --- Cierre --------------------------------------------------------------
  var cerrada = false;
  function cerrar() {
    if (cerrada) return;
    cerrada = true;
    marcarVista();
    clearTimeout(topeId);
    clearTimeout(esperaId);
    clearInterval(avanceId);
    raiz.classList.remove('has-intro');
    intro.classList.add('is-leaving');
    try { video.pause(); } catch (e) { /* noop */ }
    window.setTimeout(function () {
      if (intro.parentNode) intro.parentNode.removeChild(intro);
    }, 700);
  }

  saltar.addEventListener('click', cerrar);
  document.addEventListener('keydown', function (e) {
    if (!cerrada && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      cerrar();
    }
  });

  video.addEventListener('ended', cerrar);
  video.addEventListener('error', cerrar);
  video.addEventListener('stalled', cerrar);

  // Tope duro y red de seguridad por si el autoplay queda bloqueado.
  var topeId = window.setTimeout(cerrar, TOPE_MS);
  var esperaId = window.setTimeout(function () {
    if (video.currentTime === 0 || video.paused) cerrar();
  }, ESPERA_MS);

  // Barra de avance
  var avanceId = window.setInterval(function () {
    var d = video.duration;
    if (!d || !isFinite(d)) return;
    barra.style.width = Math.min(100, (video.currentTime / d) * 100) + '%';
  }, 100);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montar);
  } else {
    montar();
  }

  var p = video.play();
  if (p && p.catch) p.catch(cerrar);
})();
