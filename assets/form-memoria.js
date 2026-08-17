/* ================================================================
   FORMULARIOS CON MEMORIA PERSISTENTE + ENVIO POR WHATSAPP
   Grupo CISA · ABDev · v1.0
   Spec: PENDIENTES-WEB.md seccion 1.1
   ================================================================

   Comportamiento:
   - Cada input/textarea/select con name en cualquier <form> de la pagina
     se guarda automaticamente en localStorage al cambiar.
   - Al recargar la pagina, los valores se restauran.
   - Indicador visual "Borrador guardado" se actualiza con timestamp.
   - Boton "Borrar borrador" en cada form.
   - Al submit, el form NO se envia a Formspree.
     En su lugar, se genera un mensaje pre-formateado con todos los campos
     y se abre wa.me/525517964940?text=<mensaje> en pestana nueva.
   - Despues del envio, se limpia el localStorage del form.

   Si Formspree es necesario, se puede agregar opcionalmente: el form
   puede hacer submit normal ademas del WhatsApp.

   Excluye: campos _gotcha (honeypot), _subject, _next (Formspree meta).
   ================================================================ */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '525517964940';
  var STORAGE_PREFIX = 'cisa_form_';
  var SAVE_DEBOUNCE_MS = 400;

  // === Helpers ===
  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  }

  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // === Identify form ===
  function getFormId(form) {
    if (form.id) return form.id;
    // Fallback: derive from page + index
    var forms = document.querySelectorAll('form');
    var idx = Array.prototype.indexOf.call(forms, form);
    var path = window.location.pathname.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    return STORAGE_PREFIX + path + (idx > 0 ? '_' + idx : '');
  }

  // === Saved indicator ===
  function ensureIndicator(form) {
    if (form.querySelector('.form-memoria-indicator')) return form.querySelector('.form-memoria-indicator');
    var ind = document.createElement('div');
    ind.className = 'form-memoria-indicator';
    ind.setAttribute('aria-live', 'polite');
    ind.innerHTML = '<span class="form-memoria-dot" aria-hidden="true"></span><span class="form-memoria-text">Borrador listo en este navegador</span>';
    var submit = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submit && submit.parentNode) {
      submit.parentNode.insertBefore(ind, submit);
    } else {
      form.appendChild(ind);
    }
    return ind;
  }

  function updateIndicator(form) {
    var ind = form.querySelector('.form-memoria-indicator');
    if (!ind) return;
    var text = ind.querySelector('.form-memoria-text');
    var dot = ind.querySelector('.form-memoria-dot');
    if (!text) return;
    var now = new Date();
    var hh = String(now.getHours()).padStart(2, '0');
    var mm = String(now.getMinutes()).padStart(2, '0');
    text.textContent = 'Borrador guardado · ' + hh + ':' + mm;
    if (dot) dot.classList.add('form-memoria-dot--saved');
  }

  // === Save / load ===
  function getFormStorage(form) {
    var id = getFormId(form);
    try {
      return JSON.parse(localStorage.getItem(id) || '{}');
    } catch (e) {
      return {};
    }
  }

  function setFormStorage(form, data) {
    var id = getFormId(form);
    try {
      localStorage.setItem(id, JSON.stringify(data));
    } catch (e) {
      // localStorage lleno o deshabilitado, no hacer nada
    }
  }

  function clearFormStorage(form) {
    var id = getFormId(form);
    try {
      localStorage.removeItem(id);
    } catch (e) {}
  }

  // === Restore values on load ===
  function restoreForm(form) {
    var data = getFormStorage(form);
    if (Object.keys(data).length === 0) return false;
    var inputs = form.querySelectorAll('input, textarea, select');
    var restored = 0;
    inputs.forEach(function (el) {
      if (!el.name) return;
      if (el.name === '_gotcha' || el.name === '_subject' || el.name === '_next') return;
      if (data[el.name] === undefined) return;
      if (el.type === 'checkbox') {
        el.checked = data[el.name];
      } else if (el.type === 'radio') {
        el.checked = (el.value === data[el.name]);
      } else {
        el.value = data[el.name];
      }
      restored++;
    });
    if (restored > 0) {
      updateIndicator(form);
      return true;
    }
    return false;
  }

  // === Save on change ===
  var saveForm = debounce(function (form) {
    var inputs = form.querySelectorAll('input, textarea, select');
    var data = {};
    inputs.forEach(function (el) {
      if (!el.name) return;
      if (el.name === '_gotcha' || el.name === '_subject' || el.name === '_next') return;
      if (el.type === 'checkbox') {
        data[el.name] = el.checked;
      } else if (el.type === 'radio') {
        if (el.checked) data[el.name] = el.value;
      } else {
        data[el.name] = el.value;
      }
    });
    setFormStorage(form, data);
    updateIndicator(form);
  }, SAVE_DEBOUNCE_MS);

  // === Build WhatsApp message ===
  function buildMessage(form) {
    var data = getFormStorage(form);
    var lines = [];
    var pageUrl = window.location.href;
    var pageName = document.title || window.location.pathname;
    var hasDatos = false;

    // Header con contexto
    lines.push('Hola, le escribo desde el sitio de Grupo CISA (' + pageName + ').');

    // Recolectar campos en orden
    var inputs = form.querySelectorAll('input, textarea, select');
    var fieldOrder = [];
    inputs.forEach(function (el) {
      if (!el.name) return;
      if (el.name === '_gotcha' || el.name === '_subject' || el.name === '_next') return;
      var label = findLabel(el);
      var value = (el.tagName === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio')) ?
        (el.checked ? 'Sí' : 'No') : el.value;
      if (value && String(value).trim() !== '') {
        fieldOrder.push({ label: label, value: value });
        hasDatos = true;
      }
    });

    if (hasDatos) {
      lines.push('');
      lines.push('Datos:');
      fieldOrder.forEach(function (f) {
        if (f.label) {
          lines.push('· ' + f.label + ': ' + f.value);
        } else {
          lines.push('· ' + f.value);
        }
      });
    }

    lines.push('');
    lines.push('Quedo atento(a). Gracias.');
    lines.push('');
    lines.push('-- Enviado desde ' + pageUrl);

    return lines.join('\n');
  }

  function findLabel(el) {
    // 1. <label for="...">
    if (el.id) {
      var lbl = document.querySelector('label[for="' + el.id + '"]');
      if (lbl) return lbl.textContent.trim().replace(/[*:]$/, '');
    }
    // 2. <label> wrapping the element
    var parent = el.parentNode;
    while (parent && parent !== document.body) {
      if (parent.tagName === 'LABEL') {
        return parent.textContent.trim().replace(/[*:]$/, '');
      }
      parent = parent.parentNode;
    }
    // 3. placeholder
    if (el.placeholder) return el.placeholder;
    // 4. name formatted
    return el.name.replace(/[_-]/g, ' ');
  }

  // === Inject UI: clear button ===
  function ensureClearButton(form) {
    if (form.querySelector('.form-memoria-clear')) return;
    var ind = form.querySelector('.form-memoria-indicator');
    if (!ind) return;
    var clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'form-memoria-clear';
    clear.textContent = 'Borrar borrador';
    clear.setAttribute('aria-label', 'Borrar el borrador guardado en este navegador');
    ind.appendChild(clear);
    clear.addEventListener('click', function () {
      if (!confirm('¿Borrar todos los campos del formulario? Esta acción no se puede deshacer.')) return;
      var inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(function (el) {
        if (el.name === '_gotcha' || el.name === '_subject' || el.name === '_next') return;
        if (el.type === 'checkbox' || el.type === 'radio') {
          el.checked = false;
        } else {
          el.value = '';
        }
      });
      clearFormStorage(form);
      if (ind) {
        var text = ind.querySelector('.form-memoria-text');
        if (text) text.textContent = 'Borrador borrado';
        var dot = ind.querySelector('.form-memoria-dot');
        if (dot) dot.classList.remove('form-memoria-dot--saved');
      }
    });
  }

  // === Inject submit override ===
  function wireSubmit(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Guardar estado final
      saveForm(form);

      // Honeypot: si está lleno, es bot
      var honeypot = form.querySelector('[name="_gotcha"]');
      if (honeypot && honeypot.value !== '') {
        // silently drop
        return;
      }

      // Construir mensaje y abrir WhatsApp
      var msg = buildMessage(form);
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);

      // Analytics
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'form_whatsapp_submit',
        form_id: getFormId(form),
        page_path: window.location.pathname
      });

      window.open(url, '_blank', 'noopener,noreferrer');

      // Limpiar borrador después del envío exitoso
      setTimeout(function () {
        clearFormStorage(form);
        var ind = form.querySelector('.form-memoria-indicator');
        if (ind) {
          var text = ind.querySelector('.form-memoria-text');
          if (text) text.textContent = 'Enviado por WhatsApp · borrador borrado';
        }
      }, 1500);
    });
  }

  // === Init: process every form on the page ===
  function init() {
    var forms = document.querySelectorAll('form');
    forms.forEach(function (form) {
      // Skip forms without a real submit
      var submit = form.querySelector('button[type="submit"], input[type="submit"]');
      if (!submit) return;

      ensureIndicator(form);
      ensureClearButton(form);
      restoreForm(form);

      form.addEventListener('input', function (e) {
        if (e.target.matches('input, textarea, select')) {
          saveForm(form);
        }
      });
      form.addEventListener('change', function (e) {
        if (e.target.matches('input, textarea, select')) {
          saveForm(form);
        }
      });

      wireSubmit(form);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
