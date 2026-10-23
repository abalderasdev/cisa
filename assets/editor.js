/* assets/editor.js — Editor en vivo de Grupo CISA.
 * Solo lo descarga el loader inline de cada página cuando existe la cookie
 * cisa_ed=1 (puesta al iniciar sesión) o con ?editar=1. Los visitantes normales
 * nunca lo cargan. La sesión real es una cookie HttpOnly que valida el servidor.
 */
(function () {
  'use strict';
  if (window.__cisaEditor) return;
  window.__cisaEditor = true;

  var API_AUTH = '/api/auth';
  var API_EDIT = '/api/editar';
  var bar, statusEl, sendBtn;

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var CSS = [
    '.cisa-ed-bar{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147483000;display:flex;gap:8px;align-items:center;flex-wrap:wrap;max-width:calc(100vw - 24px);background:#111;color:#fff;font:14px/1.3 system-ui,sans-serif;padding:10px 12px;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.35)}',
    '.cisa-ed-bar button,.cisa-ed-bar input{font:inherit;border-radius:8px;border:0;padding:8px 12px}',
    '.cisa-ed-bar button{cursor:pointer;background:#333;color:#fff}.cisa-ed-bar button.pri{background:#1f8a4c}.cisa-ed-bar button:disabled{opacity:.5;cursor:default}',
    '.cisa-ed-bar input{background:#fff;color:#111;min-width:220px}.cisa-ed-bar a{color:#8fe3b0}',
    '[data-edit].cisa-ed-on{outline:1px dashed rgba(31,138,76,.6);outline-offset:2px;cursor:text}',
    '[data-edit].cisa-ed-on:hover,[data-edit].cisa-ed-on:focus{outline:2px solid #1f8a4c}',
    '[data-edit].cisa-ed-changed{outline:2px solid #e0a100 !important;background:rgba(224,161,0,.08)}',
    '[data-edit].cisa-ed-rejected{outline:2px solid #d93025 !important;background:rgba(217,48,37,.08)}'
  ].join('');

  var cssLoaded = false;
  function mountBar() {
    if (!cssLoaded) { document.head.appendChild(el('style', {}, CSS)); cssLoaded = true; }
    bar = el('div', { class: 'cisa-ed-bar', role: 'region', 'aria-label': 'Editor de textos' });
    document.body.appendChild(bar);
  }

  function api(url, opts) {
    opts = opts || {};
    opts.credentials = 'same-origin';
    opts.headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    return fetch(url, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { j.__status = r.status; return j; });
    });
  }

  /* ---------- Login ---------- */
  function showLogin() {
    mountBar();
    bar.innerHTML = '<span>Editor CISA</span>' +
      '<input name="usuario" placeholder="usuario" autocomplete="username" autocapitalize="none" required style="min-width:140px">' +
      '<input name="contrasena" type="password" placeholder="contraseña" autocomplete="current-password" required style="min-width:160px">' +
      '<button class="pri" type="button">Entrar</button><button type="button" data-x>✕</button><span data-msg role="alert"></span>';
    // Sin <form>: los scripts del sitio (form-memoria) interceptan los submit.
    var form = { usuario: bar.querySelector('[name=usuario]'), contrasena: bar.querySelector('[name=contrasena]'), querySelector: function (q) { return bar.querySelector(q); } };
    var msg = bar.querySelector('[data-msg]');
    bar.querySelector('[data-x]').onclick = function () { bar.remove(); };
    function submit() {
      var b = form.querySelector('.pri'); b.disabled = true; msg.textContent = '';
      api(API_AUTH + '?accion=entrar', { method: 'POST', body: JSON.stringify({ usuario: form.usuario.value, contrasena: form.contrasena.value }) })
        .then(function (j) {
          if (j.ok) { bar.remove(); bar = null; if (window.__cisaEdOn) showBar({ usuario: j.usuario }); else enable({ usuario: j.usuario }); return; }
          form.contrasena.value = ''; msg.textContent = j.error || 'No se pudo entrar'; b.disabled = false;
        })
        .catch(function () { msg.textContent = 'Sin conexión'; b.disabled = false; });
    }
    bar.querySelector('.pri').onclick = submit;
    bar.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); submit(); } });
    form.usuario.focus();
  }

  /* ---------- Edición ---------- */
  function nodes() { return Array.prototype.slice.call(document.querySelectorAll('[data-edit]')); }
  function byId(id) { return nodes().filter(function (n) { return n.getAttribute('data-edit') === id; }); }
  function idOf(n) { return n.getAttribute('data-edit'); }

  // Adornos en los bordes (svg, aria-hidden, elementos vacíos): no son parte del texto.
  // Misma regla que api/_lib/html.js (isDecor) y scripts/mark_editable.js.
  function isDecor(c) {
    if (c.nodeType !== 1) return false;
    var t = c.tagName.toLowerCase();
    if (t === 'svg' || c.getAttribute('aria-hidden') === 'true') return true;
    if (t === 'br' || t === 'img') return false;
    return c.textContent === '' && !c.children.length;
  }
  function blank(c) { return c.nodeType === 8 || (c.nodeType === 3 && !c.nodeValue.trim()); }
  function span(n) {
    var k = n.childNodes, a = 0, b = k.length, i;
    for (i = 0; i < k.length; i++) { if (isDecor(k[i])) a = i + 1; else if (!blank(k[i])) break; }
    for (i = k.length - 1; i >= a; i--) { if (isDecor(k[i])) b = i; else if (!blank(k[i])) break; }
    return { kids: k, a: a, b: b };
  }
  function getVal(n) {
    var s = span(n), box = document.createElement('div');
    for (var i = s.a; i < s.b; i++) box.appendChild(s.kids[i].cloneNode(true));
    return box.innerHTML;
  }
  function setVal(n, html) {
    var s = span(n), kids = Array.prototype.slice.call(s.kids), after = kids[s.b] || null;
    for (var i = s.a; i < s.b; i++) n.removeChild(kids[i]);
    var t = document.createElement('template'); t.innerHTML = html;
    n.insertBefore(t.content, after);
  }
  function getHref(n) { return n.tagName === 'A' ? n.getAttribute('href') : null; }

  // Página normalizada: "/", "/index.html" y "/index" comparten borrador.
  function pageKey(p) { return String(p).replace(/\/index(\.html)?$/, '/').replace(/\.html$/, '') || '/'; }
  var DRAFT_KEY = 'cisa-editor-borrador:' + pageKey(location.pathname);
  var originals = {}; // id -> texto en la página al cargar (o el último aplicado)
  var bases = {};     // id -> texto que vio el usuario al editar (se manda como "original")
  var prev = {};      // id -> último texto aplicado en un PR en esta sesión (se manda como "previo")
  var hrefOrig = {}, hrefBase = {}, hrefPrev = {};
  var parked = {};    // borrador no recuperado: se conserva hasta Descartar o hasta aplicarse
  var rejected = {};  // id -> motivo del último rechazo
  var sending = false;

  function changes() {
    var seen = {}, out = [];
    nodes().forEach(function (n) {
      var id = idOf(n);
      if (seen[id]) return; seen[id] = 1;
      var html = getVal(n), href = getHref(n);
      var hrefChanged = href !== null && href !== hrefOrig[id];
      if (html === originals[id] && !hrefChanged) return;
      var c = { id: id, html: html, original: bases[id] };
      if (prev[id] != null) c.previo = prev[id];
      if (hrefChanged) { c.href = href; c.hrefOriginal = hrefBase[id]; if (hrefPrev[id] != null) c.hrefPrevio = hrefPrev[id]; }
      out.push(c);
    });
    return out;
  }

  function saveDraft(c) {
    var all = {}, k;
    for (k in parked) all[k] = parked[k];
    c.forEach(function (x) { all[x.id] = x; });
    var list = []; for (k in all) list.push(all[k]);
    try { list.length ? localStorage.setItem(DRAFT_KEY, JSON.stringify(list)) : localStorage.removeItem(DRAFT_KEY); } catch (e) {}
    return list.length;
  }

  function refresh() {
    var c = changes();
    var ids = {}; c.forEach(function (x) { ids[x.id] = 1; });
    nodes().forEach(function (n) {
      var id = idOf(n);
      n.classList.toggle('cisa-ed-changed', !!ids[id]);
      n.classList.toggle('cisa-ed-rejected', !!rejected[id]);
      if (rejected[id]) n.setAttribute('title', 'No se guardó: ' + rejected[id]); else if (n.getAttribute('title') && n.getAttribute('title').indexOf('No se guardó: ') === 0) n.removeAttribute('title');
    });
    var total = saveDraft(c);
    if (!sending) {
      var np = total - c.length;
      statusEl.textContent = (c.length ? c.length + ' cambio(s) sin enviar' : 'Sin cambios') + (np > 0 ? ' · ' + np + ' en borrador sin recuperar' : '');
    }
    sendBtn.disabled = sending || !c.length;
  }

  function sync(src) { // mismo id repetido en la página (p. ej. menú duplicado)
    var id = idOf(src), v = getVal(src), h = getHref(src);
    byId(id).forEach(function (n) { if (n === src) return; setVal(n, v); if (h !== null && n.tagName === 'A') n.setAttribute('href', h); });
  }

  function enable(session) {
    window.__cisaEdOn = true;
    nodes().forEach(function (n) {
      var id = idOf(n);
      if (!(id in originals)) { originals[id] = bases[id] = getVal(n); hrefOrig[id] = hrefBase[id] = getHref(n); }
      n.setAttribute('contenteditable', 'true');
      n.setAttribute('spellcheck', 'true');
      n.classList.add('cisa-ed-on');
      var s = span(n);
      for (var i = 0; i < s.kids.length; i++) if ((i < s.a || i >= s.b) && s.kids[i].nodeType === 1) s.kids[i].setAttribute('contenteditable', 'false');
    });

    // No navegar al hacer clic en ligas/botones mientras se edita.
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.cisa-ed-on')) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    // Pegar siempre como texto plano.
    document.addEventListener('paste', function (e) {
      if (!e.target.closest || !e.target.closest('.cisa-ed-on')) return;
      e.preventDefault();
      var t = (e.clipboardData || window.clipboardData).getData('text/plain').replace(/\s+/g, ' ');
      document.execCommand('insertText', false, t);
    }, true);
    // Enter no crea bloques nuevos (Shift+Enter = salto de línea en párrafos).
    document.addEventListener('keydown', function (e) {
      var n = e.target.closest && e.target.closest('.cisa-ed-on');
      if (!n || e.key !== 'Enter') return;
      e.preventDefault();
      if (e.shiftKey && /^(P|LI|BLOCKQUOTE|DD|TD)$/.test(n.tagName)) document.execCommand('insertLineBreak');
    }, true);
    document.addEventListener('input', function (e) {
      var n = e.target.closest && e.target.closest('.cisa-ed-on');
      if (n) { delete rejected[idOf(n)]; sync(n); refresh(); }
    }, true);
    // Enlace: al entrar a un <a data-edit> aparece su destino en la barra.
    document.addEventListener('focusin', function (e) {
      var n = e.target.closest && e.target.closest('.cisa-ed-on');
      if (!n || !bar || !bar.querySelector('[data-href]')) return;
      var box = bar.querySelector('[data-hrefbox]'), inp = bar.querySelector('[data-href]');
      if (n.tagName === 'A' && n.hasAttribute('href')) { box.hidden = false; inp.value = n.getAttribute('href') || ''; inp.setAttribute('data-for', idOf(n)); }
      else box.hidden = true;
    }, true);

    // Restaurar borrador local, si existe. Si no se recupera, se conserva (no se borra).
    try {
      var d = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]');
      if (d.length && confirm('Hay ' + d.length + ' cambio(s) guardados en este navegador. ¿Recuperarlos?\n(Si eliges Cancelar se conservan para después.)')) {
        d.forEach(function (c) {
          if (!(c.id in originals)) { parked[c.id] = c; return; } // ese texto ya no está en la página
          byId(c.id).forEach(function (n) { setVal(n, c.html); if (c.href != null && n.tagName === 'A') n.setAttribute('href', c.href); });
          if (c.original != null) bases[c.id] = c.original;
          if (c.previo != null) prev[c.id] = c.previo;
          if (c.hrefOriginal != null) hrefBase[c.id] = c.hrefOriginal;
          if (c.hrefPrevio != null) hrefPrev[c.id] = c.hrefPrevio;
        });
      } else d.forEach(function (c) { parked[c.id] = c; });
    } catch (e) {}
    showBar(session);
    window.addEventListener('beforeunload', function (e) { if (changes().length) { e.preventDefault(); e.returnValue = ''; } });
  }

  function showBar(session) {
    mountBar();
    bar.innerHTML = '<span title="' + esc(session.usuario) + '">✎ Editando</span><span data-s role="status"></span>' +
      '<span data-hrefbox hidden>Enlace: <input data-href placeholder="contacto.html" maxlength="500" style="min-width:180px"></span>' +
      '<input data-nota placeholder="Nota para revisión (opcional)" maxlength="500">' +
      '<button class="pri" data-send>Enviar a revisión</button><button data-undo>Descartar</button><button data-out>Salir</button>';
    statusEl = bar.querySelector('[data-s]');
    sendBtn = bar.querySelector('[data-send]');
    bar.querySelector('[data-href]').addEventListener('input', function () {
      var id = this.getAttribute('data-for'), v = this.value.trim();
      if (!id || !v) return;
      byId(id).forEach(function (n) { if (n.tagName === 'A') n.setAttribute('href', v); });
      delete rejected[id];
      refresh();
    });
    bar.querySelector('[data-undo]').onclick = function () {
      if (!confirm('¿Descartar todos los cambios de esta página (incluido el borrador guardado)?')) return;
      nodes().forEach(function (n) {
        var id = idOf(n);
        setVal(n, originals[id]);
        if (hrefOrig[id] != null && n.tagName === 'A') n.setAttribute('href', hrefOrig[id]);
      });
      parked = {}; rejected = {};
      try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
      refresh();
    };
    bar.querySelector('[data-out]').onclick = function () {
      api(API_AUTH + '?accion=salir', { method: 'POST' }).then(function () { location.href = location.pathname; });
    };
    sendBtn.onclick = send;
    refresh();
  }

  function label(id) {
    var n = byId(id)[0], t = n ? n.textContent.replace(/\s+/g, ' ').trim() : id;
    return '«' + (t.length > 40 ? t.slice(0, 40) + '…' : t) + '»';
  }

  // Marca como guardados (en main o en un PR) los ids indicados, con el texto que se mandó.
  function settle(ids, sent) {
    ids.forEach(function (id) {
      var x = sent[id]; if (!x) return;
      originals[id] = prev[id] = x.html;
      if (x.href != null) hrefOrig[id] = hrefPrev[id] = x.href;
      delete parked[id]; delete rejected[id];
    });
  }

  function send() {
    var c = changes();
    if (!c.length || sending) return;
    sending = true;
    sendBtn.disabled = true;
    statusEl.textContent = 'Enviando ' + c.length + ' cambio(s)…';
    var sent = {}; c.forEach(function (x) { sent[x.id] = x; });
    api(API_EDIT, { method: 'POST', body: JSON.stringify({ pagina: location.pathname, cambios: c, nota: bar.querySelector('[data-nota]').value }) })
      .then(function (j) {
        sending = false;
        var ap = j.aplicados || [], same = j.sinCambio || [], rj = j.rechazados || [];
        settle(ap.concat(same), sent);
        rj.forEach(function (r) { rejected[r.id] = r.motivo; });
        refresh();
        var msg = [];
        if (j.ok && j.pr) msg.push('✔ ' + ap.length + ' aplicado(s) · <a href="' + esc(j.pr) + '" target="_blank" rel="noopener">ver PR</a>');
        if (same.length) msg.push(same.length + ' ya estaba(n) así en el sitio fuente');
        if (rj.length) msg.push('✖ ' + rj.length + ' no se guardó/guardaron (en rojo): ' + rj.map(function (r) { return esc(label(r.id) + ' — ' + r.motivo); }).join('; '));
        if (!j.ok && !rj.length && !same.length) msg.push(esc(j.error || 'Error al enviar') + ' · tus cambios siguen guardados aquí');
        statusEl.innerHTML = msg.join(' · ');
        if (j.__status === 401) setTimeout(showLoginAgain, 1500);
      })
      .catch(function () { sending = false; refresh(); statusEl.textContent = 'Sin conexión; tus cambios siguen guardados aquí.'; });
  }
  // Volver a entrar SIN recargar: el estado y el borrador se conservan.
  function showLoginAgain() { if (bar) bar.remove(); bar = null; showLogin(); }

  function start() {
    api(API_AUTH + '?accion=sesion').then(function (s) {
      if (s.ok) enable(s);
      else if (/[?&]editar=1(&|$)/.test(location.search)) showLogin();
      else document.cookie = 'cisa_ed=; Path=/; Max-Age=0'; // bandera vieja: no volver a cargar
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
