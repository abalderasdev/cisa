/* Variant toggler — solo para preview de Alberto/CISA
   Uso: añadir ?v=a | ?v=b | ?v=c a la URL para cambiar variantes
   Si no hay ?v= deja la variante que está en el HTML (default "a") */
(function () {
  const url = new URL(window.location.href);
  const v = url.searchParams.get('v');
  if (!v) return;
  // Solo aplicar a secciones con data-variant en la URL
  document.querySelectorAll('section[data-variant], div[data-variant]').forEach(function (el) {
    if (['a', 'b', 'c'].includes(v)) {
      el.setAttribute('data-variant', v);
    }
  });
  // Mostrar un pequeño indicador flotante solo en modo preview
  if (['a', 'b', 'c'].includes(v)) {
    const badge = document.createElement('div');
    badge.textContent = 'Variante ' + v.toUpperCase() + ' · ?v=' + v + ' para cambiar';
    badge.style.cssText = 'position:fixed;bottom:8px;left:8px;z-index:99999;background:#1F4D2A;color:white;font:600 11px/1 system-ui;padding:6px 10px;border-radius:6px;font-family:JetBrains Mono,monospace;letter-spacing:.05em;text-transform:uppercase;';
    document.body.appendChild(badge);
  }
})();
