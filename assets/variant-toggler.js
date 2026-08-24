/* Variant toggler — UI de revisión A/B/C persistente
   - 3 botones flotantes (A / B / C) en la esquina inferior derecha
   - Guarda la elección en localStorage (persiste entre páginas y sesiones)
   - Aplica a TODAS las secciones con data-variant
   - Funciona en localhost, Vercel, cualquier URL — sin servidor, sin query params
   - Default: 'a' (la versión actual) */
(function () {
  const STORAGE_KEY = 'cisa-design-variant';
  const VALID = ['a', 'b', 'c'];

  function getVariant() {
    // URL param tiene prioridad para deep-link (testing/screenshots)
    let v = null;
    try {
      const url = new URL(window.location.href);
      const qp = url.searchParams.get('variant');
      if (VALID.includes(qp)) v = qp;
    } catch (e) { /* noop */ }
    if (v) return v;
    // Si no hay URL param, leemos de localStorage (persistente)
    try { v = localStorage.getItem(STORAGE_KEY) || 'a'; } catch (e) { /* noop */ }
    if (!VALID.includes(v)) v = 'a';
    return v;
  }

  function setVariant(v) {
    if (!VALID.includes(v)) return;
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* noop */ }
    apply(v);
  }

  function apply(v) {
    document.querySelectorAll('section[data-variant], div[data-variant]').forEach(function (el) {
      el.setAttribute('data-variant', v);
    });
    document.querySelectorAll('[data-variant-btn]').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-variant-btn') === v);
    });
    // Marca en body para que CSS pueda condicionar comportamiento
    document.body.setAttribute('data-design-variant', v);
  }

  function build() {
    var targets = document.querySelectorAll('section[data-variant], div[data-variant]');
    if (!targets.length) return;

    var current = getVariant();
    apply(current);

    var wrap = document.createElement('div');
    wrap.className = 'variant-toggle';
    wrap.setAttribute('role', 'toolbar');
    wrap.setAttribute('aria-label', 'Cambiar versión de diseño');
    wrap.innerHTML = [
      '<div class="variant-toggle__label">VERSIÓN DE DISEÑO</div>',
      '<div class="variant-toggle__btns">',
      '  <button type="button" data-variant-btn="a" class="variant-toggle__btn" title="Versión A · actual (cream)"><span>A</span><small>actual</small></button>',
      '  <button type="button" data-variant-btn="b" class="variant-toggle__btn" title="Versión B · verde oscuro CISA"><span>B</span><small>verde oscuro</small></button>',
      '  <button type="button" data-variant-btn="c" class="variant-toggle__btn" title="Versión C · verde + café, esquinas redondeadas"><span>C</span><small>orgánica</small></button>',
      '</div>',
      '<div class="variant-toggle__hint">Click para previsualizar · persiste</div>'
    ].join('\n');
    document.body.appendChild(wrap);

    wrap.querySelectorAll('[data-variant-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setVariant(btn.getAttribute('data-variant-btn'));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
