// api/_lib/html.js
// Sanitizado y reemplazo de nodos marcados con data-edit.
// Usa parse5 (parser HTML conforme al estándar) con offsets de código fuente
// para tocar SOLO el contenido del nodo marcado y dejar intacto el resto del archivo.
'use strict';
const path = require('path');
const { parse, parseFragment } = require('parse5');

const MAX_LEN = 4000; // caracteres de HTML sanitizado por campo
const ALLOWED = new Set(['b', 'strong', 'i', 'em', 'a', 'br', 'span']);
const VOID = new Set(['br']);

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escAttr(s) {
  return esc(s).replace(/"/g, '&quot;');
}

// Solo http(s), mailto, tel, anclas y rutas relativas sin esquema.
function safeHref(href) {
  const h = String(href || '').trim();
  if (!h || h.length > 500) return null;
  if (/[\u0000-\u001f\s]/.test(h.replace(/ /g, ''))) return null;
  if (/^(https?:|mailto:|tel:)/i.test(h)) return h;
  if (/^[a-z][a-z0-9+.-]*:/i.test(h)) return null; // javascript:, data:, vbscript:, etc.
  if (h.startsWith('//')) return null;
  return h; // relativa: /x, x.html, #ancla, ?q
}

function safeClass(c) {
  const v = String(c || '').trim();
  return /^[A-Za-z0-9_\- ]{1,100}$/.test(v) ? v : null;
}

function attr(node, name) {
  const a = (node.attrs || []).find((x) => x.name === name);
  return a ? a.value : null;
}

// Convierte HTML arbitrario del navegador en HTML seguro:
// texto + <b>/<strong>/<i>/<em>/<br>, <a href> seguro y <span class> (para
// conservar los acentos tipográficos existentes como <span class="accent">).
// Todo lo demás se descarta conservando su texto.
function sanitize(input) {
  const frag = parseFragment(String(input == null ? '' : input));
  let out = '';
  const walk = (nodes) => {
    for (const n of nodes) {
      if (n.nodeName === '#text') out += esc(n.value);
      else if (n.nodeName === '#comment') continue;
      else if (n.tagName === 'script' || n.tagName === 'style' || n.tagName === 'template') continue;
      else if (ALLOWED.has(n.tagName)) {
        const t = n.tagName;
        let attrs = '';
        if (t === 'a') {
          const h = safeHref(attr(n, 'href'));
          if (h) attrs += ` href="${escAttr(h)}"`;
          if (h && /^https?:/i.test(h)) attrs += ' target="_blank" rel="noopener noreferrer"';
        } else if (t === 'span') {
          const c = safeClass(attr(n, 'class'));
          if (!c) { walk(n.childNodes || []); continue; }
          attrs += ` class="${escAttr(c)}"`;
        }
        if (VOID.has(t)) { out += `<${t}>`; continue; }
        out += `<${t}${attrs}>`;
        walk(n.childNodes || []);
        out += `</${t}>`;
      } else if (n.tagName === 'div' || n.tagName === 'p') {
        // contenteditable mete <div>/<p> al dar Enter: lo convertimos en <br>.
        if (out && !out.endsWith('<br>')) out += '<br>';
        walk(n.childNodes || []);
      } else {
        walk(n.childNodes || []);
      }
    }
  };
  walk(frag.childNodes);
  out = out.replace(/(<br>)+$/, '');
  if (out.length > MAX_LEN) throw new HttpError(413, `Texto demasiado largo (máx. ${MAX_LEN})`);
  return out;
}

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function walkElements(node, fn) {
  for (const c of node.childNodes || []) {
    if (c.tagName) fn(c);
    walkElements(c.tagName === 'template' ? c.content : c, fn);
  }
}

function parseDoc(html) {
  return parse(html, { sourceCodeLocationInfo: true });
}

const textOf = (n) => n.nodeName === '#text' ? n.value : (n.childNodes || []).map(textOf).join('');

// Adorno en el borde de un nodo editable: <svg>, aria-hidden="true" o un elemento vacío
// (p. ej. <span class="dot"></span>). Se conserva tal cual y NO forma parte del texto editable.
// La misma regla existe en el editor (editor.js) y en el script de marcado.
function isDecor(n) {
  if (!n.tagName) return false;
  if (n.tagName === 'svg' || attr(n, 'aria-hidden') === 'true') return true;
  if (n.tagName === 'br' || n.tagName === 'img') return false;
  return textOf(n) === '' && !(n.childNodes || []).some((c) => c.tagName);
}
const blank = (n) => n.nodeName === '#comment' || (n.nodeName === '#text' && !n.value.trim());

// Hijos [desde, hasta) que forman el texto editable (sin los adornos de los bordes).
function editableChildren(el) {
  const kids = el.childNodes || [];
  let a = 0; let b = kids.length;
  for (let i = 0; i < kids.length; i++) { if (isDecor(kids[i])) a = i + 1; else if (!blank(kids[i])) break; }
  for (let i = kids.length - 1; i >= a; i--) { if (isDecor(kids[i])) b = i; else if (!blank(kids[i])) break; }
  return { kids, a, b };
}

// Offsets [start, end) del texto editable del nodo dentro del archivo fuente.
function editableRange(el) {
  const loc = el.sourceCodeLocation;
  const { kids, a, b } = editableChildren(el);
  const start = a > 0 ? kids[a - 1].sourceCodeLocation.endOffset : loc.startTag.endOffset;
  const end = b < kids.length ? kids[b].sourceCodeLocation.startOffset : loc.endTag.startOffset;
  return { start, end };
}

// Devuelve { id: count } de todos los data-edit del documento.
function listIds(html) {
  const counts = {};
  walkElements(parseDoc(html), (el) => {
    const id = attr(el, 'data-edit');
    if (id) counts[id] = (counts[id] || 0) + 1;
  });
  return counts;
}

function targetsOf(doc, id) {
  const targets = [];
  walkElements(doc, (el) => { if (attr(el, 'data-edit') === id) targets.push(el); });
  return targets;
}

// Texto editable y href actuales del PRIMER nodo con ese id, o null si no existe.
function current(html, id) {
  const el = targetsOf(parseDoc(html), id)[0];
  if (!el || !el.sourceCodeLocation || !el.sourceCodeLocation.endTag) return el ? { html: null, href: null } : null;
  const r = editableRange(el);
  return { html: html.slice(r.start, r.end), href: el.tagName === 'a' ? attr(el, 'href') : null, tag: el.tagName };
}

// Normaliza para comparar lo que vio el navegador (innerHTML) con la fuente de main:
// mismo sanitizado del servidor (entidades, atributos, <div>/<p> -> <br>) y espacios colapsados.
function norm(s) {
  let v;
  try { v = sanitize(s); } catch { v = String(s == null ? '' : s); }
  return v.replace(/\s+/g, ' ').trim();
}
function same(a, b) { return a != null && b != null && norm(a) === norm(b); }

// Reemplaza el texto editable (y opcionalmente el href) de TODOS los nodos con data-edit === id
// (normalmente uno; los globales pueden repetirse, p. ej. menú de escritorio).
// edit: string (html) o { html, href }. Retorna { html, replaced }.
function replaceNode(html, id, edit) {
  const e = typeof edit === 'string' ? { html: edit } : edit;
  const targets = targetsOf(parseDoc(html), id);
  if (!targets.length) return { html, replaced: 0 };
  const ops = []; // {s, e, str}
  for (const el of targets) {
    const loc = el.sourceCodeLocation;
    if (!loc || !loc.startTag || !loc.endTag) throw new HttpError(422, `Nodo ${id} sin etiqueta de cierre`);
    let nested = false;
    walkElements(el, (d) => { if (attr(d, 'data-edit')) nested = true; });
    if (nested) throw new HttpError(422, `Nodo ${id} contiene otros nodos editables`);
    if (e.html != null) { const r = editableRange(el); ops.push({ s: r.start, e: r.end, str: e.html }); }
    if (e.href != null) {
      if (el.tagName !== 'a') throw new HttpError(422, `El nodo ${id} no es un enlace`);
      const h = ` href="${escAttr(e.href)}"`;
      const al = loc.startTag.attrs && loc.startTag.attrs.href;
      if (al) ops.push({ s: al.startOffset - 1, e: al.endOffset, str: h }); // incluye el espacio previo
      else { const p = loc.startTag.startOffset + 2; ops.push({ s: p, e: p, str: h }); } // "<a" + href
    }
  }
  // Reemplazar de atrás hacia adelante para no invalidar offsets.
  ops.sort((a, b) => b.s - a.s);
  let out = html;
  for (const o of ops) out = out.slice(0, o.s) + o.str + out.slice(o.e);
  return { html: out, replaced: targets.length };
}

// Verifica que el documento resultante siga parseando con la misma estructura
// de nodos editables, y que cada nodo editado contenga exactamente lo pedido.
function validate(before, after, edits) {
  const a = listIds(before);
  const b = listIds(after);
  const ka = Object.keys(a).sort().join('|');
  const kb = Object.keys(b).sort().join('|');
  if (ka !== kb) throw new HttpError(422, 'El cambio alteró la estructura de nodos editables');
  for (const k of Object.keys(a)) if (a[k] !== b[k]) throw new HttpError(422, `Conteo distinto para ${k}`);
  const doc = parseDoc(after);
  walkElements(doc, (el) => {
    const id = attr(el, 'data-edit');
    if (!id || !(id in edits)) return;
    const e = typeof edits[id] === 'string' ? { html: edits[id] } : edits[id];
    const r = editableRange(el);
    if (e.html != null && after.slice(r.start, r.end) !== e.html) throw new HttpError(422, `El nodo ${id} no quedó como se esperaba`);
    if (e.href != null && attr(el, 'href') !== e.href) throw new HttpError(422, `El enlace de ${id} no quedó como se esperaba`);
  });
  return true;
}

// Aplica un conjunto de cambios { id: htmlSanitizado | {html, href} } a un documento.
function applyEdits(html, edits) {
  let out = html;
  const applied = [];
  for (const [id, edit] of Object.entries(edits)) {
    const r = replaceNode(out, id, edit);
    if (r.replaced) { out = r.html; applied.push(id); }
  }
  if (applied.length) {
    const sub = {};
    for (const id of applied) sub[id] = edits[id];
    validate(html, out, sub);
  }
  return { html: out, applied };
}

// Un href relativo escrito en la página `from` (p. ej. "contacto.html" en index.html)
// apuntado desde la página `to` (p. ej. "../contacto.html" en desarrollos/itzae.html).
// Absolutos, raíz (/x), anclas (#x) y consultas (?x) no cambian. null si sale del sitio.
function rebaseHref(href, from, to) {
  const h = String(href);
  if (/^([a-z][a-z0-9+.-]*:|\/|#|\?)/i.test(h)) return h;
  const m = h.match(/^([^?#]*)(.*)$/);
  const abs = path.posix.normalize(path.posix.join(path.posix.dirname(from), m[1]));
  if (abs.startsWith('..')) return null;
  let rel = path.posix.relative(path.posix.dirname(to), abs) || path.posix.basename(abs);
  if (m[1].endsWith('/') && !rel.endsWith('/')) rel += '/';
  return rel + m[2];
}

module.exports = { sanitize, safeHref, replaceNode, listIds, validate, applyEdits, current, same, norm, isDecor, editableRange, rebaseHref, HttpError, MAX_LEN };
