// api/editar.js
// Recibe cambios del editor en vivo y abre un PR en GitHub (vía GitHub App).
//   POST /api/editar  {pagina: "/desarrollos/itzae.html", cambios: [{id, html, original, previo?, href?, hrefOriginal?}], nota?}
// - Requiere sesión válida (cookie firmada) y Origin del mismo sitio.
// - Sanitiza cada texto (solo texto + b/strong/i/em/br, <a href> seguro y <span class>).
// - Reemplaza SOLO el contenido del nodo con ese data-edit usando parse5 y valida el resultado.
// - Los ids "global.*" se aplican en todos los .html que los contengan (menú/footer).
// - Nunca escribe en main: crea la rama edicion/<fecha>-<usuario> y un PR.
'use strict';
const S = require('./_lib/session');
const RL = require('./_lib/ratelimit');
const H = require('./_lib/html');
const GH = require('./_lib/github');

const MAX_BODY = 192 * 1024; // cada cambio viaja con su texto original (protección contra base vieja)
const MAX_CHANGES = 60;
const ID_RE = /^[a-z0-9][a-z0-9._-]{0,119}$/;

function json(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') {
    if (JSON.stringify(req.body).length > MAX_BODY) throw new H.HttpError(413, 'Petición demasiado grande');
    return req.body;
  }
  let raw = '';
  for await (const c of req) { raw += c; if (raw.length > MAX_BODY) throw new H.HttpError(413, 'Petición demasiado grande'); }
  try { return JSON.parse(raw); } catch { throw new H.HttpError(400, 'JSON inválido'); }
}
const PR_LIMIT = 10; // PRs por usuario por hora (se cuentan PRs abiertos, no intentos)
const REQ_LIMIT_IP = 60; // peticiones por IP por hora (anti abuso)

// "/", "/desarrollos/itzae", "/desarrollos/itzae.html" -> "desarrollos/itzae.html"
function normalizePage(p) {
  let v = String(p || '').split(/[?#]/)[0];
  try { v = decodeURIComponent(v); } catch { throw new H.HttpError(400, 'Página inválida'); }
  v = v.replace(/^\/+/, '');
  if (!v || v.endsWith('/')) v += 'index.html';
  if (!v.endsWith('.html')) v += '.html';
  if (v.includes('..') || !/^[a-z0-9/_.-]+$/i.test(v)) throw new H.HttpError(400, 'Página inválida');
  return v;
}

const str = (v) => (typeof v === 'string' ? v : null);

// Valida y sanitiza el payload CAMPO POR CAMPO: un texto malo no tumba a los demás.
// Retorna { pagina, local, global, extra, rejected, nota }. Exportada para pruebas.
function prepare(body) {
  const pagina = normalizePage(body && body.pagina);
  const cambios = Array.isArray(body && body.cambios) ? body.cambios : [];
  if (!cambios.length) throw new H.HttpError(400, 'Sin cambios');
  if (cambios.length > MAX_CHANGES) throw new H.HttpError(413, `Máximo ${MAX_CHANGES} cambios por envío`);
  const local = {}; const global = {}; const extra = {}; const rejected = [];
  for (const c of cambios) {
    const id = String(c && c.id || '');
    if (!ID_RE.test(id)) { rejected.push({ id: id.slice(0, 40), motivo: 'Identificador inválido' }); continue; }
    try {
      if (typeof c.html !== 'string' || c.html.length > H.MAX_LEN * 2) throw new H.HttpError(413, `Texto inválido o muy largo (máx. ${H.MAX_LEN})`);
      const clean = H.sanitize(c.html);
      if (!clean.replace(/<[^>]*>/g, '').trim()) throw new H.HttpError(400, 'El texto quedó vacío; escribe algo o descarta el cambio');
      const x = { original: str(c.original), previo: str(c.previo), href: null, hrefOriginal: str(c.hrefOriginal), hrefPrevio: str(c.hrefPrevio) };
      if (c.href != null) {
        x.href = typeof c.href === 'string' ? H.safeHref(c.href) : null;
        if (!x.href) throw new H.HttpError(400, 'Enlace no permitido (usa http(s), mailto, tel o una ruta del sitio)');
      }
      delete local[id]; delete global[id];
      (id.startsWith('global.') ? global : local)[id] = clean;
      extra[id] = x;
    } catch (e) {
      if (!e.status || e.status >= 500) throw e;
      rejected.push({ id, motivo: e.message });
    }
  }
  const nota = String(body.nota || '').replace(/[\u0000-\u001f]/g, ' ').slice(0, 500);
  return { pagina, local, global, extra, rejected, nota };
}

// Aplica los cambios ya preparados sobre los archivos de la rama base, id por id.
// files: [{path, sha}], read(sha) -> contenido. Retorna { changed: Map(path->html), aplicados, sinCambio, rechazados }.
// Exportada para pruebas.
async function applyAll(p, page, files, read, base) {
  const rechazados = [...p.rejected];
  const aplicados = []; const sinCambio = [];
  const reject = (id, motivo) => rechazados.push({ id, motivo });
  const orig = new Map(); const docs = new Map();
  const load = async (f) => { if (!docs.has(f.path)) { const s = await read(f.sha); orig.set(f.path, s); docs.set(f.path, s); } return docs.get(f.path); };
  await load(page);
  const globals = Object.keys(p.global);
  const others = [];
  if (globals.length) {
    for (const f of files) {
      if (f.path === page.path) continue;
      const src = await load(f);
      if (globals.some((id) => src.includes(`data-edit="${id}"`))) others.push(f);
    }
  }
  const all = { ...p.local, ...p.global };
  for (const id of Object.keys(all)) {
    const x = p.extra[id];
    const cur = H.current(docs.get(page.path), id);
    if (!cur) { reject(id, `Este texto ya no existe en ${base}; recarga la página`); continue; }
    if (x.original == null) { reject(id, 'Recarga la página: el editor se actualizó y falta el texto original'); continue; }
    if (!H.same(x.original, cur.html) && !H.same(x.previo, cur.html)) {
      reject(id, 'Este texto cambió desde que abriste la página, recarga (el sitio publicado puede estar atrasado respecto a ' + base + ')');
      continue;
    }
    if (x.href != null) {
      if (cur.tag !== 'a' || cur.href == null) { reject(id, 'Este texto no es un enlace con destino'); continue; }
      if (cur.href !== x.hrefOriginal && cur.href !== x.hrefPrevio) { reject(id, 'El enlace cambió desde que abriste la página, recarga'); continue; }
    }
    const targets = id.startsWith('global.') ? [page, ...others] : [page];
    try {
      const next = new Map();
      for (const f of targets) {
        const edit = { html: all[id] };
        if (x.href != null) {
          edit.href = id.startsWith('global.') ? H.rebaseHref(x.href, page.path, f.path) : x.href;
          if (!edit.href) throw new H.HttpError(400, 'El enlace apunta fuera del sitio');
        }
        const src = docs.get(f.path);
        const r = H.applyEdits(src, { [id]: edit });
        if (r.applied.length && r.html !== src) next.set(f.path, r.html);
      }
      if (!next.size) { sinCambio.push(id); continue; }
      for (const [k, v] of next) docs.set(k, v);
      aplicados.push(id);
    } catch (e) {
      if (!e.status || e.status >= 500) throw e;
      reject(id, e.message);
    }
  }
  const changed = new Map();
  for (const [k, v] of docs) if (v !== orig.get(k)) changed.set(k, v);
  return { changed, aplicados, sinCambio, rechazados };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Método no permitido' });
  try {
    if (!S.sameOrigin(req)) return json(res, 403, { error: 'Origen no permitido' });
    if (!String(req.headers['content-type'] || '').includes('application/json')) return json(res, 415, { error: 'Se espera JSON' });
    const sess = S.getSession(req);
    if (!sess) return json(res, 401, { error: 'Sesión vencida, vuelve a entrar. Tus cambios siguen guardados en este navegador.' });
    const user = sess.sub;
    if (!(await RL.hit('edit-ip:' + RL.clientIp(req), REQ_LIMIT_IP, 3600))) {
      return json(res, 429, { error: 'Demasiados envíos desde esta conexión. Espera unos minutos; tus cambios siguen guardados en este navegador.' });
    }
    if ((await RL.count('edit-pr:' + user)) >= PR_LIMIT) {
      return json(res, 429, { error: `Ya se abrieron ${PR_LIMIT} PRs con tu usuario en la última hora. Tus cambios siguen guardados en este navegador; envíalos más tarde (o junta varios en un solo envío).` });
    }

    const p = prepare(await readJson(req));
    const { pagina, nota } = p;
    const gh = await GH.client();
    const base = gh.base || 'main';
    const baseSha = await gh.baseSha();
    const files = await gh.listHtml(baseSha);
    const page = files.find((f) => f.path === pagina);
    if (!page) throw new H.HttpError(404, 'Página no encontrada en el repositorio');

    const { changed, aplicados, sinCambio, rechazados } = await applyAll(p, page, files, (sha) => gh.readBlob(sha), base);
    if (!changed.size) {
      const partes = [];
      if (sinCambio.length) partes.push(`${sinCambio.length} ya estaba(n) igual en ${base}`);
      if (rechazados.length) partes.push(`${rechazados.length} rechazado(s)`);
      return json(res, 409, { ok: false, error: `No se aplicó ningún cambio (${partes.join(', ')}).`, aplicados, sinCambio, rechazados });
    }

    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 13);
    const who = user.split('@')[0].replace(/[^a-z0-9]/gi, '').slice(0, 20) || 'editor';
    const branch = `edicion/${stamp}-${who}-${Math.random().toString(36).slice(2, 6)}`;
    const body = [
      `Edición de textos desde el editor en vivo.`,
      '',
      `- **Quién:** ${user}`,
      `- **Cuándo:** ${new Date().toISOString()}`,
      `- **Página:** \`${pagina}\``,
      `- **Textos aplicados:** ${aplicados.map((i) => '`' + i + '`').join(', ')}`,
      sinCambio.length ? `- **Ya estaban así en ${base}:** ${sinCambio.map((i) => '`' + i + '`').join(', ')}` : '',
      rechazados.length ? `- **Rechazados (no incluidos):** ${rechazados.map((r) => '`' + r.id + '` (' + r.motivo + ')').join('; ')}` : '',
      `- **Archivos:** ${[...changed.keys()].map((f) => '`' + f + '`').join(', ')}`,
      nota ? `\n> ${nota}` : '',
      '',
      'Revisa la vista previa de Vercel de este PR antes de hacer merge. El merge publica en producción.',
    ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');
    const pr = await gh.openPr({
      branch,
      parentSha: baseSha,
      files: [...changed].map(([path, content]) => ({ path, content })),
      message: `Editor en vivo: ${aplicados.length} texto(s) en ${pagina}\n\nPor: ${user}`,
      title: `Edición de textos: ${pagina} (${user})`,
      body,
    });
    await RL.hit('edit-pr:' + user, PR_LIMIT, 3600);
    console.log('[editor] PR', pr.html_url, user, pagina, aplicados.join(','), rechazados.length ? 'rechazados=' + rechazados.map((r) => r.id).join(',') : '');
    return json(res, 200, { ok: true, pr: pr.html_url, rama: branch, archivos: [...changed.keys()], aplicados, sinCambio, rechazados });
  } catch (e) {
    console.error('[editor/editar]', e.message);
    return json(res, e.status || 500, { error: e.status && e.status < 500 ? e.message : 'Error del servidor: ' + (e.status === 502 ? 'GitHub no respondió como se esperaba' : 'revisa la configuración') });
  }
};
module.exports.prepare = prepare;
module.exports.normalizePage = normalizePage;
module.exports.applyAll = applyAll;
