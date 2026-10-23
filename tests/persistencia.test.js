'use strict';
// Persistencia del editor en vivo: base vieja, borradores, validación por campo, globales,
// envío en curso, enlaces y cobertura del marcado. GitHub y el navegador son SIMULADOS.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
process.env.EDITOR_SESSION_SECRET = 'x'.repeat(40);
const S = require('../api/_lib/session');
process.env.EDITOR_USERS = `ana:${S.hashPassword('clave-de-prueba-123', { N: 16384, r: 8, p: 1 })},bea:${S.hashPassword('clave-de-prueba-123', { N: 16384, r: 8, p: 1 })},caro:${S.hashPassword('clave-de-prueba-123', { N: 16384, r: 8, p: 1 })}`;
const { privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
process.env.GITHUB_APP_ID = '1';
process.env.GITHUB_APP_INSTALLATION_ID = '2';
process.env.GITHUB_APP_PRIVATE_KEY = privateKey.export({ type: 'pkcs1', format: 'pem' });
process.env.GITHUB_REPO = 'dueno/sitio';
const H = require('../api/_lib/html');
const editar = require('../api/editar');
const { prepare } = editar;

const ROOT = path.resolve(__dirname, '..');
const SVG = '<svg class="faq__icon" viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/></svg>';
const PAGE = `<!doctype html><html><head><title>t</title></head><body>
<header class="site-header"><a data-edit="global.header.nosotros" href="nosotros.html">Nosotros</a></header>
<main><h2 data-edit="index.modalidades.h2-1" id="mod-title">Empecemos a desarrollar juntos.&nbsp;</h2>
<p data-edit="index.hero.p-1" class="hero__bajada">
  Texto &amp; original con <span class="accent">acento</span>.
</p>
<details><summary data-edit="index.faq.summary-1" class="faq__question">¿Pierdo mi terreno?
  ${SVG}
</summary></details>
<span data-edit="index.obra.span-1" class="proj__chip"><span class="proj__chip-dot"></span>Terminada 2025</span>
<a data-edit="index.mod.a-1" href="su-terreno.html#precalificar" class="mod__cta">Empezar <span class="mod__cta-arrow" aria-hidden="true">→</span></a>
</main></body></html>`;
const SUB = `<!doctype html><html><head><title>s</title></head><body>
<header class="site-header"><a data-edit="global.header.nosotros" href="../nosotros.html">Nosotros</a></header><main><p data-edit="desarrollos-itzae.x.p-1">Itzae</p></main></body></html>`;

function mockGithub(repo) {
  const calls = []; const blobs = {}; let n = 0;
  const tree = Object.entries(repo).map(([p, c]) => { const sha = 'b' + (n++); blobs[sha] = c; return { path: p, type: 'blob', sha }; });
  global.fetch = async (url, opts = {}) => {
    const u = new URL(url); const m = opts.method || 'GET';
    calls.push({ m, path: u.pathname, body: opts.body ? JSON.parse(opts.body) : null });
    const ok = (j) => ({ ok: true, status: 200, text: async () => JSON.stringify(j) });
    if (u.hostname !== 'api.github.com') throw new Error('host inesperado ' + u.hostname);
    if (m === 'POST' && u.pathname === '/app/installations/2/access_tokens') return ok({ token: 'tok' });
    if (u.pathname === '/repos/dueno/sitio/git/ref/heads/main') return ok({ object: { sha: 'base1' } });
    if (u.pathname === '/repos/dueno/sitio/git/trees/base1') return ok({ tree });
    if (u.pathname.startsWith('/repos/dueno/sitio/git/blobs/')) return ok({ content: Buffer.from(blobs[u.pathname.split('/').pop()]).toString('base64') });
    if (u.pathname === '/repos/dueno/sitio/git/commits/base1') return ok({ tree: { sha: 't0' } });
    if (m === 'POST' && u.pathname === '/repos/dueno/sitio/git/trees') return ok({ sha: 't1' });
    if (m === 'POST' && u.pathname === '/repos/dueno/sitio/git/commits') return ok({ sha: 'c1' });
    if (m === 'POST' && u.pathname === '/repos/dueno/sitio/git/refs') return ok({});
    if (m === 'POST' && u.pathname === '/repos/dueno/sitio/pulls') return ok({ html_url: 'https://github.com/dueno/sitio/pull/1' });
    return { ok: false, status: 404, text: async () => '{"message":"Not Found"}' };
  };
  return calls;
}
const written = (calls) => { const t = calls.find((c) => c.m === 'POST' && c.path.endsWith('/git/trees')); return t ? Object.fromEntries(t.body.tree.map((f) => [f.path, f.content])) : null; };

function call(handler, { body, user = 'ana', ip = '7.7.7.7', cookie = true }) {
  return new Promise((resolve) => {
    const { Readable } = require('stream');
    const req = Readable.from([JSON.stringify(body)]);
    Object.assign(req, { method: 'POST', url: '/api/editar', socket: {}, headers: { host: 'sitio.test', origin: 'https://sitio.test', 'content-type': 'application/json', 'x-forwarded-for': ip, ...(cookie ? { cookie: 'cisa_sess=' + S.newSessionToken(user) } : {}) } });
    const res = { statusCode: 200, setHeader() {}, end: (b) => resolve({ status: res.statusCode, body: JSON.parse(b) }) };
    handler(req, res);
  });
}
const post = (cambios, o = {}) => call(editar, { body: { pagina: o.pagina || '/', cambios }, ...o });
const inner = (html, id) => H.current(html, id).html;

/* ---------- Servidor ---------- */

test('base vieja: rechaza SOLO ese id y no pisa main (caso real del PR #12)', async () => {
  const calls = mockGithub({ 'index.html': PAGE });
  // La página publicada estaba atrasada: mostraba el texto anterior al PR #12.
  const r = await post([
    { id: 'index.modalidades.h2-1', html: 'Busca tu camino para trabajar con Grupo CISA hoy.', original: 'Busca tu camino para trabajar con Grupo CISA.' },
    { id: 'index.hero.p-1', html: 'Nuevo texto', original: inner(PAGE, 'index.hero.p-1') },
  ], { ip: '7.0.0.1' });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.deepEqual(r.body.aplicados, ['index.hero.p-1']);
  assert.equal(r.body.rechazados[0].id, 'index.modalidades.h2-1');
  assert.match(r.body.rechazados[0].motivo, /cambió desde que abriste la página, recarga/);
  const out = written(calls)['index.html'];
  assert.equal(inner(out, 'index.modalidades.h2-1'), 'Empecemos a desarrollar juntos.&nbsp;');
  assert.equal(inner(out, 'index.hero.p-1'), 'Nuevo texto');
});

test('base vieja: si TODO se rechaza no hay PR y la respuesta es error (409)', async () => {
  const calls = mockGithub({ 'index.html': PAGE });
  const r = await post([{ id: 'index.modalidades.h2-1', html: 'x', original: 'otro texto' }], { ip: '7.0.0.2' });
  assert.equal(r.status, 409);
  assert.equal(r.body.ok, false);
  assert.equal(r.body.rechazados.length, 1);
  assert.ok(!written(calls), 'no abre PR');
});

test('original: se normaliza igual que la fuente (entidades, espacios, &nbsp;) y se acepta "previo"', () => {
  const p = (original, previo) => prepare({ pagina: '/', cambios: [{ id: 'index.hero.p-1', html: 'Nuevo', original, previo }] });
  const page = { path: 'index.html', sha: 's' };
  const run = (x) => editar.applyAll(x, page, [page], async () => PAGE, 'main');
  return Promise.all([
    // innerHTML del navegador: &amp; igual, espacios distintos
    run(p('Texto &amp; original con <span class="accent">acento</span>.')).then((r) => assert.deepEqual(r.aplicados, ['index.hero.p-1'])),
    // ya se había enviado en esta sesión (PR mergeado): "previo" coincide con main
    run(p('lo que había antes', ' Texto &amp; original   con <span class="accent">acento</span>. ')).then((r) => assert.deepEqual(r.aplicados, ['index.hero.p-1'])),
    // sin original (editor viejo en caché): se rechaza, no se aplica a ciegas
    run(p(undefined)).then((r) => assert.match(r.rechazados[0].motivo, /Recarga la página/)),
  ]).then(() => {
    assert.ok(H.same('Empecemos a desarrollar juntos.&nbsp;', 'Empecemos a desarrollar juntos.\u00a0'));
    assert.ok(!H.same('Empecemos', 'Busca tu camino'));
  });
});

test('validación por campo: aplica los válidos y devuelve los rechazados con motivo', async () => {
  const calls = mockGithub({ 'index.html': PAGE });
  const o = (id) => inner(PAGE, id);
  const r = await post([
    { id: 'index.hero.p-1', html: 'Válido', original: o('index.hero.p-1') },
    { id: 'index.modalidades.h2-1', html: '<br>', original: o('index.modalidades.h2-1') },
    { id: 'A"B', html: 'x', original: 'x' },
    { id: 'index.no.existe', html: 'x', original: 'x' },
  ], { ip: '7.0.0.3' });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.deepEqual(r.body.aplicados, ['index.hero.p-1']);
  const why = Object.fromEntries(r.body.rechazados.map((x) => [x.id, x.motivo]));
  assert.match(why['index.modalidades.h2-1'], /vacío/);
  assert.match(why['AB'] || why['A"B'], /inválido/);
  assert.match(why['index.no.existe'], /ya no existe/);
  assert.equal(inner(written(calls)['index.html'], 'index.hero.p-1'), 'Válido');
});

test('global.*: id inexistente se reporta (no ok silencioso); el existente cambia todas las páginas', async () => {
  let calls = mockGithub({ 'index.html': PAGE, 'desarrollos/itzae.html': SUB });
  const gone = await post([{ id: 'global.header.no-existe', html: 'X', original: 'X' }], { ip: '7.0.0.4' });
  assert.equal(gone.status, 409);
  assert.equal(gone.body.ok, false);
  assert.match(gone.body.rechazados[0].motivo, /ya no existe/);
  assert.ok(!written(calls));

  calls = mockGithub({ 'index.html': PAGE, 'desarrollos/itzae.html': SUB });
  const r = await post([{ id: 'global.header.nosotros', html: 'Contacto', original: 'Nosotros', href: 'contacto.html', hrefOriginal: 'nosotros.html' }], { ip: '7.0.0.5' });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  const w = written(calls);
  assert.ok(w['index.html'].includes('<a data-edit="global.header.nosotros" href="contacto.html">Contacto</a>'));
  // el href relativo se ajusta a la profundidad de cada página (el error del PR #12/#14)
  assert.ok(w['desarrollos/itzae.html'].includes('<a data-edit="global.header.nosotros" href="../contacto.html">Contacto</a>'));
});

test('enlaces: href seguro se aplica; javascript: y base vieja se rechazan; sin href no se inventa', async () => {
  let calls = mockGithub({ 'index.html': PAGE });
  const o = inner(PAGE, 'index.mod.a-1');
  let r = await post([{ id: 'index.mod.a-1', html: o, original: o, href: 'contacto.html', hrefOriginal: 'su-terreno.html#precalificar' }], { ip: '7.0.0.6' });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.ok(written(calls)['index.html'].includes('<a data-edit="index.mod.a-1" href="contacto.html" class="mod__cta">'));
  calls = mockGithub({ 'index.html': PAGE });
  r = await post([
    { id: 'index.mod.a-1', html: o, original: o, href: 'javascript:alert(1)', hrefOriginal: 'su-terreno.html#precalificar' },
    { id: 'global.header.nosotros', html: 'Nosotros', original: 'Nosotros', href: 'x.html', hrefOriginal: 'viejo.html' },
    { id: 'index.hero.p-1', html: 'x', original: inner(PAGE, 'index.hero.p-1'), href: 'x.html', hrefOriginal: null },
  ], { ip: '7.0.0.7' });
  assert.equal(r.status, 409);
  const why = Object.fromEntries(r.body.rechazados.map((x) => [x.id, x.motivo]));
  assert.match(why['index.mod.a-1'], /Enlace no permitido/);
  assert.match(why['global.header.nosotros'], /enlace cambió/);
  assert.match(why['index.hero.p-1'], /no es un enlace/);
  assert.equal(H.rebaseHref('contacto.html#a', 'index.html', 'contenido/01.html'), '../contacto.html#a');
  assert.equal(H.rebaseHref('../index.html', 'desarrollos/itzae.html', 'index.html'), 'index.html');
  assert.equal(H.rebaseHref('https://wa.me/1', 'index.html', 'a/b.html'), 'https://wa.me/1');
  assert.equal(H.rebaseHref('../../fuera.html', 'index.html', 'index.html'), null);
});

test('adornos: svg, flechas aria-hidden y puntos vacíos se conservan al editar', () => {
  const r = H.applyEdits(PAGE, { 'index.faq.summary-1': '¿Pierdo la propiedad?', 'index.obra.span-1': 'En obra', 'index.mod.a-1': 'Empezar ya' });
  assert.ok(r.html.includes(`<summary data-edit="index.faq.summary-1" class="faq__question">¿Pierdo la propiedad?${SVG}\n</summary>`));
  assert.ok(r.html.includes('<span class="proj__chip-dot"></span>En obra</span>'));
  assert.ok(r.html.includes('>Empezar ya<span class="mod__cta-arrow" aria-hidden="true">→</span></a>'));
  assert.equal(H.current(PAGE, 'index.faq.summary-1').html.trim(), '¿Pierdo mi terreno?');
});

test('límite: cuenta PRs abiertos, no intentos; mensaje claro', async () => {
  for (let i = 0; i < 12; i++) { // 12 intentos rechazados no gastan cupo
    mockGithub({ 'index.html': PAGE });
    const r = await post([{ id: 'index.hero.p-1', html: 'x', original: 'otro' }], { user: 'bea', ip: `8.0.0.${i}` });
    assert.equal(r.status, 409);
  }
  for (let i = 0; i < 10; i++) {
    mockGithub({ 'index.html': PAGE });
    const r = await post([{ id: 'index.hero.p-1', html: 'v' + i, original: inner(PAGE, 'index.hero.p-1') }], { user: 'bea', ip: `8.1.0.${i}` });
    assert.equal(r.status, 200, JSON.stringify(r.body));
  }
  mockGithub({ 'index.html': PAGE });
  const r = await post([{ id: 'index.hero.p-1', html: 'otro', original: inner(PAGE, 'index.hero.p-1') }], { user: 'bea', ip: '8.2.0.1' });
  assert.equal(r.status, 429);
  assert.match(r.body.error, /10 PRs.*última hora.*siguen guardados/);
});

test('401: sesión vencida avisa que los cambios siguen guardados', async () => {
  const r = await post([{ id: 'index.hero.p-1', html: 'x', original: 'x' }], { cookie: false });
  assert.equal(r.status, 401);
  assert.match(r.body.error, /siguen guardados/);
});

/* ---------- Marcado ---------- */

test('marcado: solo agrega data-edit (texto y diseño idénticos), es idempotente y cubre adornos', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mark-'));
  fs.mkdirSync(path.join(tmp, 'scripts'));
  fs.copyFileSync(path.join(ROOT, 'scripts', 'mark_editable.js'), path.join(tmp, 'scripts', 'mark_editable.js'));
  const src = `<!doctype html><html><head><title>x</title></head><body><main>
<section id="faq"><details><summary class="faq__question">¿Pregunta?
  ${SVG}
</summary><div class="faq__answer">Respuesta <strong>clara</strong>.</div></details></section>
<section class="hero"><div class="hero__proof-item"><span class="hero__proof-value num">15,000</span><span class="hero__proof-label">m² construidos</span></div>
<span class="tipowidget__counter">TIPOLOGÍA <b data-counter>01</b> / 05</span><a class="mod__cta" data-agent-open role="button">Hablar <span class="mod__cta-arrow">→</span></a>
<span class="arrow">→</span></section></main><footer class="footer"><span>© 2026 Grupo CISA.</span></footer></body></html>`;
  fs.writeFileSync(path.join(tmp, 'p.html'), src);
  const env = { ...process.env, NODE_PATH: path.join(ROOT, 'node_modules') };
  execFileSync(process.execPath, [path.join(tmp, 'scripts', 'mark_editable.js')], { env });
  const out = fs.readFileSync(path.join(tmp, 'p.html'), 'utf8');
  const strip = (s) => s.replace(/ data-edit="[^"]*"/g, '').replace(/<script>\/\*cisa-editor-loader\*\/.*?<\/script>\n/, '');
  assert.equal(strip(out), src);
  const ids = Object.keys(H.listIds(out)).sort();
  assert.deepEqual(ids, ['global.footer.2026-grupo-cisa', 'p.faq.div-1', 'p.faq.summary-1', 'p.hero.a-1', 'p.hero.span-1', 'p.hero.span-2']);
  execFileSync(process.execPath, [path.join(tmp, 'scripts', 'mark_editable.js')], { env });
  assert.equal(fs.readFileSync(path.join(tmp, 'p.html'), 'utf8'), out, 'idempotente');
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('marcado real: index.html cubre cifras, modalidades, fichas y FAQ', () => {
  const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const has = (re) => assert.match(src, re);
  has(/<span data-edit="index\.hero\.span-\d+" class="hero__proof-value num">15,000<\/span>/);
  has(/<span data-edit="index\.mod\.span-\d+" class="mod__label">Ruta principal<\/span>/);
  has(/<a data-edit="index\.mod\.a-\d+" data-agent-open role="button" tabindex="0" class="mod__cta">Hablar con el agente/);
  has(/<div data-edit="index\.obra\.div-\d+" class="proj__stat-label">Unidades<\/div>/);
  has(/<summary data-edit="index\.faq\.summary-1" class="faq__question">¿Pierdo la propiedad de mi terreno\?/);
  has(/<div data-edit="index\.faq\.div-1" class="faq__answer">No lo vende/);
  const out = execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'mark_editable.js'), '--check']).toString();
  assert.match(out, /28 páginas, 0 nodos marcados/);
});

/* ---------- Navegador (editor.js en jsdom) ---------- */
let JSDOM; try { ({ JSDOM } = require('jsdom')); } catch { JSDOM = null; }
const CLIENT = fs.readFileSync(path.join(ROOT, 'assets', 'editor.js'), 'utf8');
const BODY = `<h1 data-edit="a">Uno</h1><p data-edit="b">Dos</p>
<summary data-edit="f">Pregunta ${SVG}</summary><a data-edit="l" href="nosotros.html">Nosotros</a>`;
const tick = () => new Promise((r) => setTimeout(r, 15));

async function browser({ path: p = '/', draft, confirmAns = true, answers = [] } = {}) {
  const dom = new JSDOM(`<!doctype html><body>${BODY}</body>`, { url: 'https://sitio.test' + p, runScripts: 'outside-only' });
  const w = dom.window; const sent = []; const pending = [];
  if (draft) w.localStorage.setItem(draft.key, JSON.stringify(draft.list));
  w.confirm = () => confirmAns; w.document.execCommand = () => {};
  w.fetch = (url, o) => {
    if (url.includes('accion=sesion')) return Promise.resolve({ status: 200, json: () => Promise.resolve({ ok: true, usuario: 'ana' }) });
    if (url.includes('accion=entrar')) return Promise.resolve({ status: 200, json: () => Promise.resolve({ ok: true, usuario: 'ana' }) });
    sent.push(JSON.parse(o.body));
    const a = answers.shift() || ((b) => ({ ok: true, pr: 'https://gh/pr/1', aplicados: b.cambios.map((c) => c.id), sinCambio: [], rechazados: [] }));
    const body = JSON.parse(o.body);
    return new Promise((res) => pending.push(() => { const j = typeof a === 'function' ? a(body) : a; res({ status: j.__status || 200, json: () => Promise.resolve(j) }); }));
  };
  w.eval(CLIENT);
  await tick();
  const q = (s) => w.document.querySelector(s);
  return {
    w, sent, q,
    flush: async () => { pending.splice(0).forEach((f) => f()); await tick(); },
    type: (id, html) => { const n = q(`[data-edit="${id}"]`); n.innerHTML = html; n.dispatchEvent(new w.Event('input', { bubbles: true })); },
    btn: () => q('[data-send]'), status: () => q('[data-s]').textContent,
    draft: (k = 'cisa-editor-borrador:/') => JSON.parse(w.localStorage.getItem(k) || 'null'),
  };
}

test('cliente: Cancelar en "¿Recuperarlos?" NO borra el borrador; Descartar sí', { skip: !JSDOM && 'jsdom no instalado' }, async () => {
  const list = [{ id: 'a', html: 'Uno de ayer', original: 'Uno' }];
  const b = await browser({ draft: { key: 'cisa-editor-borrador:/', list }, confirmAns: false });
  assert.deepEqual(b.draft(), list);
  assert.match(b.status(), /1 en borrador sin recuperar/);
  b.type('b', 'Dos nuevo'); // editar otra cosa no pisa el borrador viejo
  assert.deepEqual(b.draft().map((x) => x.id).sort(), ['a', 'b']);
  b.w.confirm = () => true; b.q('[data-undo]').click();
  assert.equal(b.draft(), null);
});

test('cliente: "/" e "/index.html" comparten borrador y se recupera con su original', { skip: !JSDOM && 'jsdom no instalado' }, async () => {
  const list = [{ id: 'a', html: 'Uno editado', original: 'Uno viejo' }];
  const b = await browser({ path: '/index.html', draft: { key: 'cisa-editor-borrador:/', list } });
  assert.equal(b.q('[data-edit="a"]').innerHTML, 'Uno editado');
  b.btn().click(); await b.flush();
  assert.equal(b.sent[0].cambios[0].original, 'Uno viejo', 'manda lo que vio al editar, no lo publicado hoy');
});

test('cliente: envío en curso mantiene el botón deshabilitado y lo editado mientras tanto queda pendiente', { skip: !JSDOM && 'jsdom no instalado' }, async () => {
  const b = await browser();
  b.type('a', 'Uno v1'); b.btn().click();
  assert.equal(b.btn().disabled, true);
  b.type('b', 'Dos durante el envío');
  b.type('a', 'Uno v2');
  assert.equal(b.btn().disabled, true, 'refresh() no lo rehabilita');
  b.btn().click(); // ignorado
  await b.flush();
  assert.equal(b.sent.length, 1);
  assert.deepEqual(b.sent[0].cambios.map((c) => [c.id, c.html, c.original]), [['a', 'Uno v1', 'Uno']]);
  assert.equal(b.btn().disabled, false);
  assert.deepEqual(b.draft().map((x) => [x.id, x.html]), [['a', 'Uno v2'], ['b', 'Dos durante el envío']]);
  b.btn().click(); await b.flush();
  const a2 = b.sent[1].cambios.find((c) => c.id === 'a');
  assert.deepEqual([a2.original, a2.previo], ['Uno', 'Uno v1']);
});

test('cliente: rechazados en rojo con motivo, se quedan en el borrador; aplicados salen', { skip: !JSDOM && 'jsdom no instalado' }, async () => {
  const b = await browser({ answers: [{ ok: true, pr: 'https://gh/pr/9', aplicados: ['a'], sinCambio: [], rechazados: [{ id: 'b', motivo: 'Este texto cambió desde que abriste la página, recarga' }] }] });
  b.type('a', 'Uno nuevo'); b.type('b', 'Dos nuevo');
  b.btn().click(); await b.flush();
  const nb = b.q('[data-edit="b"]');
  assert.ok(nb.classList.contains('cisa-ed-rejected'));
  assert.match(nb.getAttribute('title'), /recarga/);
  assert.ok(!b.q('[data-edit="a"]').classList.contains('cisa-ed-changed'));
  assert.deepEqual(b.draft().map((x) => x.id), ['b']);
  assert.match(b.status(), /1 aplicado.*ver PR.*1 no se guardó.*«Dos nuevo» — Este texto cambió/);
  assert.ok(b.q('[data-s] a[href="https://gh/pr/9"]'));
});

test('cliente: 409 sin nada aplicado no limpia el borrador; 401 vuelve a entrar sin recargar ni perder nada', { skip: !JSDOM && 'jsdom no instalado' }, async () => {
  const b = await browser({ answers: [
    { __status: 409, ok: false, error: 'No se aplicó ningún cambio (1 rechazado(s)).', aplicados: [], sinCambio: [], rechazados: [{ id: 'a', motivo: 'Este texto ya no existe en main; recarga la página' }] },
    { __status: 401, error: 'Sesión vencida, vuelve a entrar. Tus cambios siguen guardados en este navegador.' },
  ] });
  b.type('a', 'Uno nuevo');
  b.btn().click(); await b.flush();
  assert.deepEqual(b.draft().map((x) => x.id), ['a']);
  b.type('a', 'Uno nuevo 2');
  b.btn().click(); await b.flush();
  await new Promise((r) => setTimeout(r, 1600));
  assert.ok(b.q('[name=usuario]'), 'aparece el login');
  assert.deepEqual(b.draft().map((x) => x.html), ['Uno nuevo 2']);
  b.q('.cisa-ed-bar .pri').click(); await tick();
  assert.ok(b.q('[data-send]'), 'regresa la barra de edición sin recargar');
  assert.equal(b.q('[data-edit="a"]').innerHTML, 'Uno nuevo 2');
  assert.match(b.status(), /1 cambio\(s\) sin enviar/);
});

test('cliente: adornos fuera del texto y destino del enlace editable', { skip: !JSDOM && 'jsdom no instalado' }, async () => {
  const b = await browser();
  const f = b.q('[data-edit="f"]');
  assert.equal(f.querySelector('svg').getAttribute('contenteditable'), 'false');
  const svgBefore = f.querySelector('svg').outerHTML;
  f.firstChild.nodeValue = 'Otra pregunta '; f.dispatchEvent(new b.w.Event('input', { bubbles: true }));
  const l = b.q('[data-edit="l"]');
  l.dispatchEvent(new b.w.FocusEvent('focusin', { bubbles: true }));
  const inp = b.q('[data-href]');
  assert.equal(b.q('[data-hrefbox]').hidden, false);
  inp.value = 'contacto.html'; inp.dispatchEvent(new b.w.Event('input'));
  b.btn().click(); await b.flush();
  const byId = Object.fromEntries(b.sent[0].cambios.map((c) => [c.id, c]));
  assert.equal(byId.f.html, 'Otra pregunta '); // el svg no viaja: lo conserva el servidor
  assert.equal(f.querySelector('svg').outerHTML, svgBefore);
  assert.deepEqual([byId.l.href, byId.l.hrefOriginal, byId.l.html], ['contacto.html', 'nosotros.html', 'Nosotros']);
});
