/* ================================================================
   SOFIA VIDEO SWITCH · Grupo CISA
   v1.0 · ABDev · Alberto Balderas

   Comportamiento:
   - Loop: el <video id="sofia-agent-video"> en /index.html#agente
     reproduce sofia-writing-loop.mp4 en loop, muted.
   - Al hacer click en el botón "Hablar con el agente" (en la misma
     sección), se hace lo siguiente:
       1. Se cambia el src del <video> a sofia-greeting.mp4.
       2. Se quita el loop y se reproduce una sola vez (muteado).
       3. Tras 1.2s (a que ella mire a cámara y sonría), se dispara
          el trigger del widget flotante de Sofía, que abre el modal
          y carga el agente de ElevenLabs.
   - El audio que el visitante escucha viene del agente de ElevenLabs,
     no del video. El video de saludo es solo un gesto visual.
   - Si el visitante cierra el modal del widget, el video del bloque
     #agente queda en el último frame del saludo (no regresa al loop
     automáticamente; el bloque sigue ahí, debajo del modal).
   ================================================================ */
(function () {
  'use strict';

  // === Selectores ===
  var video = document.getElementById('sofia-agent-video');
  if (!video) return; // No estamos en /index.html#agente; salir.

  // Botón "Hablar con el agente" en la sección #agente
  var ctaBtn = document.querySelector('#agente a.btn--primary, #agente .btn--primary');
  if (!ctaBtn) return;

  // Trigger del widget flotante (creado dinámicamente por sofia-widget.js)
  var widgetTrigger = null;

  function findWidgetTrigger(retries) {
    widgetTrigger = document.querySelector('.sofia-trigger');
    if (!widgetTrigger && retries > 0) {
      setTimeout(function () { findWidgetTrigger(retries - 1); }, 200);
    }
  }
  // El widget puede cargarse antes o después; buscamos con reintentos.
  findWidgetTrigger(20); // hasta ~4s

  // === Paths de los videos ===
  var VIDEO_LOOP = 'assets/sofia-writing-loop.mp4';
  var VIDEO_GREETING = 'assets/sofia-greeting.mp4';
  var DELAY_BEFORE_WIDGET_MS = 1200; // tiempo para que se vea el saludo

  var hasSwitched = false;

  // === Handler del click ===
  ctaBtn.addEventListener('click', function (e) {
    e.preventDefault();

    if (hasSwitched) return; // Idempotente: si ya cambió, no repetir.
    hasSwitched = true;

    // 1. Cambiar el video al saludo (muteado, sin loop, una vez)
    try {
      video.pause();
      video.loop = false;
      video.muted = true; // el saludo es solo visual; el audio viene del agente
      video.src = VIDEO_GREETING;
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          // Autoplay bloqueado: el visitante verá el poster, no es crítico.
        });
      }
    } catch (err) {
      // Si el video falla, seguimos con el widget.
    }

    // 2. Tras 1.2s, abrir el modal del widget flotante.
    setTimeout(function () {
      // Si el trigger ya cargó, hacer click. Si no, esperar un poco más.
      var attempts = 0;
      var tryOpen = function () {
        var t = document.querySelector('.sofia-trigger');
        if (t) {
          t.click();
        } else if (attempts < 10) {
          attempts++;
          setTimeout(tryOpen, 200);
        }
        // Si tras 2s no hay trigger, el widget no se cargó en esta página;
        // el visitante verá el saludo y puede hacer click en el FAB manualmente.
      };
      tryOpen();
    }, DELAY_BEFORE_WIDGET_MS);

    // 3. Analytics
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'sofia_agente_section_clicked',
      page_path: window.location.pathname,
      section: 'agente',
      video_switched_to: 'greeting'
    });
  });
})();
