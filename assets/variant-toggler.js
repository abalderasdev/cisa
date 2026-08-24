/* Variant toggler — UI de preview para Alberto/CISA
   - Crea un toggle visual fijo en la esquina con 3 botones (A / B / C)
   - Click cambia el data-variant de las secciones que lo soporten
   - Lee ?variant=X de la URL para deep-link
   - Solo se muestra cuando hay secciones con data-variant (modo preview) */
(function () {
  const url = new URL(window.location.href);
  let current = url.searchParams.get('variant') || 'a';
  if (!['a', 'b', 'c'].includes(current)) current = 'a';

  // Espera a que el DOM esté listo
  function apply(v) {
    current = v;
    document.querySelectorAll('section[data-variant], div[data-variant]').forEach(function (el) {
      el.setAttribute('data-variant', v);
    });
    var btns = document.querySelectorAll('[data-variant-btn]');
    btns.forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-variant-btn') === v);
    });
    // Actualiza la URL sin recargar (para screenshot/share)
    try {
      var u = new URL(window.location.href);
      u.searchParams.set('variant', v);
      history.replaceState(null, '', u.toString());
    } catch (e) { /* noop */ }
  }

  function buildToggle() {
    // Solo aparece si hay al menos una sección con data-variant
    var targets = document.querySelectorAll('section[data-variant], div[data-variant]');
    if (!targets.length) return;

    var wrap = document.createElement('div');
    wrap.className = 'variant-toggle';
    wrap.setAttribute('role', 'toolbar');
    wrap.setAttribute('aria-label', 'Cambiar variante de diseño (solo preview)');
    wrap.innerHTML = [
      '<div class="variant-toggle__label">VARIANTE</div>',
      '<div class="variant-toggle__btns">',
      '  <button type="button" data-variant-btn="a" class="variant-toggle__btn">A</button>',
      '  <button type="button" data-variant-btn="b" class="variant-toggle__btn">B</button>',
      '  <button type="button" data-variant-btn="c" class="variant-toggle__btn">C</button>',
      '</div>',
      '<div class="variant-toggle__hint">Click para previsualizar</div>'
    ].join('\n');
    document.body.appendChild(wrap);

    wrap.querySelectorAll('[data-variant-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        apply(btn.getAttribute('data-variant-btn'));
      });
    });

    apply(current);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildToggle);
  } else {
    buildToggle();
  }
})();
