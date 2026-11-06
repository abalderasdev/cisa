'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const AGENTE_PATH = path.join(ROOT, 'api', 'agente-cisa.js');

// Claves falsas: las pruebas nunca usan claves reales del entorno.
process.env.MINIMAX_API_KEY = 'mm-prueba-NO-REAL';
process.env.XAI_API_KEY = 'xai-prueba-NO-REAL';

function mockRes() {
  return {
    statusCode: undefined,
    body: undefined,
    headers: Object.create(null),
    status(n) {
      this.statusCode = n;
      return this;
    },
    json(o) {
      this.body = o;
      return this;
    },
    end() {
      return this;
    },
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
      return this;
    },
  };
}

function mockReq({
  method = 'POST',
  headers = {},
  body,
} = {}) {
  return {
    method,
    headers: {
      'content-type': 'application/json',
      host: 'sitio.test',
      'x-forwarded-for': `ip-${Math.random().toString(36).slice(2)}-${Date.now()}`,
      ...headers,
    },
    body,
  };
}

function response(data, status = 200, headers = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get(name) {
        const key = Object.keys(headers).find(
          (header) => header.toLowerCase() === name.toLowerCase(),
        );
        return key ? headers[key] : null;
      },
    },
    async text() {
      return typeof data === 'string' ? data : JSON.stringify(data);
    },
    async json() {
      return typeof data === 'string' ? JSON.parse(data) : data;
    },
  };
}

function uniqueIp() {
  return `ip-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

async function loadHandler() {
  delete require.cache[require.resolve(AGENTE_PATH)];
  return require(AGENTE_PATH);
}

async function runHandler(handler, req, res = mockRes()) {
  await handler(req, res);
  return res;
}

function installFetch(t, implementation) {
  const original = global.fetch;
  global.fetch = implementation;
  t.after(() => {
    global.fetch = original;
  });
}

function walkFiles(dir, result = []) {
  if (!fs.existsSync(dir)) return result;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        [
          'node_modules',
          '.git',
          '.impeccable',
          'preview',
          '_archive',
        ].includes(entry.name)
      ) {
        continue;
      }
      walkFiles(full, result);
    } else {
      result.push(full);
    }
  }

  return result;
}

test('exporta los límites declarados', async (t) => {
  const { LIMITS } = await loadHandler();
  assert.deepEqual(LIMITS, {
    MAX_MESSAGES: 20,
    MAX_CHARS: 2000,
    MAX_TTS_CHARS: 1200,
  });
});

test('OPTIONS devuelve 204 y Cache-Control no-store', async (t) => {
  const handler = await loadHandler();
  const res = await runHandler(
    handler,
    mockReq({
      method: 'OPTIONS',
      body: {},
    }),
  );

  assert.equal(res.statusCode, 204);
  assert.equal(res.headers['cache-control'], 'no-store');
});

test('rechaza métodos distintos de POST y OPTIONS con Allow POST', async (t) => {
  const handler = await loadHandler();
  const res = await runHandler(
    handler,
    mockReq({
      method: 'GET',
      body: {},
    }),
  );

  assert.equal(res.statusCode, 405);
  assert.deepEqual(res.body, { error: 'method_not_allowed' });
  assert.equal(res.headers.allow, 'POST');
  assert.equal(res.headers['cache-control'], 'no-store');
});

test('exige Content-Type application/json', async (t) => {
  const handler = await loadHandler();
  const res = await runHandler(
    handler,
    mockReq({
      headers: { 'content-type': 'text/plain' },
      body: '{}',
    }),
  );

  assert.equal(res.statusCode, 415);
  assert.equal(res.headers['cache-control'], 'no-store');
});

test('rechaza JSON inválido con bad_request', async (t) => {
  const handler = await loadHandler();
  const res = await runHandler(
    handler,
    mockReq({ body: '{no es json' }),
  );

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'bad_request' });
});

test('rechaza acciones desconocidas con bad_request', async (t) => {
  const handler = await loadHandler();
  const res = await runHandler(
    handler,
    mockReq({ body: { action: 'desconocida' } }),
  );

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'bad_request' });
});

test('bloquea Origin cuyo host no coincide con Host', async (t) => {
  const handler = await loadHandler();
  const res = await runHandler(
    handler,
    mockReq({
      headers: { origin: 'https://otro.test' },
      body: { action: 'chat', messages: [] },
    }),
  );

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { error: 'origin_not_allowed' });
});

test('acepta Origin cuyo host coincide con Host', async (t) => {
  const handler = await loadHandler();
  installFetch(t, async () =>
    response({
      content: [{ type: 'text', text: 'Hola' }],
    }),
  );

  const res = await runHandler(
    handler,
    mockReq({
      headers: { origin: 'https://sitio.test' },
      body: {
        action: 'chat',
        messages: [{ role: 'user', content: 'Hola' }],
      },
    }),
  );

  assert.equal(res.statusCode, 200);
});

test('permite Origin configurado en AGENTE_CISA_ORIGINS', async (t) => {
  const handler = await loadHandler();
  process.env.AGENTE_CISA_ORIGINS = 'https://permitido.test';
  t.after(() => {
    delete process.env.AGENTE_CISA_ORIGINS;
  });

  installFetch(t, async () =>
    response({
      content: [{ type: 'text', text: 'Hola' }],
    }),
  );

  const res = await runHandler(
    handler,
    mockReq({
      headers: {
        origin: 'https://permitido.test',
        host: 'otro.test',
      },
      body: {
        action: 'chat',
        messages: [{ role: 'user', content: 'Hola' }],
      },
    }),
  );

  assert.equal(res.statusCode, 200);
});

test('voz sin Origin devuelve 403', async (t) => {
  const handler = await loadHandler();
  const res = await runHandler(
    handler,
    mockReq({
      body: {
        action: 'voz',
        messages: [{ role: 'user', content: 'Hola' }],
      },
    }),
  );

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { error: 'origin_not_allowed' });
});

test('chat recorta más de 20 mensajes a los últimos 20', async (t) => {
  const handler = await loadHandler();
  let fetchedBody;

  installFetch(t, async (url, options) => {
    assert.equal(url, 'https://api.minimax.io/anthropic/v1/messages');
    fetchedBody = JSON.parse(options.body);
    return response({
      content: [{ type: 'text', text: 'Hola' }],
    });
  });

  const messages = Array.from({ length: 25 }, (_, index) => ({
    role: index % 2 === 0 ? 'user' : 'assistant',
    content: `Mensaje ${index}`,
  }));
  messages[messages.length - 1] = {
    role: 'user',
    content: 'Mensaje 24',
  };

  const res = await runHandler(
    handler,
    mockReq({
      headers: { 'x-forwarded-for': uniqueIp() },
      body: { action: 'chat', messages },
    }),
  );

  assert.equal(res.statusCode, 200);
  assert.equal(fetchedBody.messages.length, 20);
  assert.equal(fetchedBody.messages[0].content, 'Mensaje 5');
  assert.equal(fetchedBody.messages[19].content, 'Mensaje 24');
});

test('chat envía las cabeceras y el system prompt largo con CISA', async (t) => {
  const handler = await loadHandler();
  let fetchedOptions;
  let fetchedUrl;

  installFetch(t, async (url, options) => {
    fetchedUrl = url;
    fetchedOptions = options;
    return response({
      content: [
        { type: 'thinking', thinking: 'x' },
        { type: 'text', text: 'Hola' },
      ],
    });
  });

  const res = await runHandler(
    handler,
    mockReq({
      headers: { 'x-forwarded-for': uniqueIp() },
      body: {
        action: 'chat',
        messages: [{ role: 'user', content: 'Hola' }],
      },
    }),
  );

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { reply: 'Hola' });
  assert.equal(
    fetchedUrl,
    'https://api.minimax.io/anthropic/v1/messages',
  );
  assert.equal(fetchedOptions.method, 'POST');
  assert.equal(
    fetchedOptions.headers['x-api-key'],
    'mm-prueba-NO-REAL',
  );

  const body = JSON.parse(fetchedOptions.body);
  assert.equal(typeof body.system, 'string');
  assert.ok(body.system.length > 5000);
  assert.match(body.system, /CISA/i);
});

test('chat rechaza contenido mayor de 2000 caracteres', async (t) => {
  const handler = await loadHandler();
  const res = await runHandler(
    handler,
    mockReq({
      headers: { 'x-forwarded-for': uniqueIp() },
      body: {
        action: 'chat',
        messages: [{ role: 'user', content: 'x'.repeat(2001) }],
      },
    }),
  );

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'input_too_long' });
});

test('chat rechaza roles inválidos', async (t) => {
  const handler = await loadHandler();
  const res = await runHandler(
    handler,
    mockReq({
      headers: { 'x-forwarded-for': uniqueIp() },
      body: {
        action: 'chat',
        messages: [{ role: 'system', content: 'Hola' }],
      },
    }),
  );

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'bad_request' });
});

test('chat exige que el último mensaje sea del usuario', async (t) => {
  const handler = await loadHandler();
  const res = await runHandler(
    handler,
    mockReq({
      headers: { 'x-forwarded-for': uniqueIp() },
      body: {
        action: 'chat',
        messages: [
          { role: 'user', content: 'Hola' },
          { role: 'assistant', content: 'Respuesta' },
        ],
      },
    }),
  );

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'bad_request' });
});

test('chat sin MINIMAX_API_KEY devuelve 503 y fallback de WhatsApp', async (t) => {
  const handler = await loadHandler();
  delete process.env.MINIMAX_API_KEY;
  t.after(() => { process.env.MINIMAX_API_KEY = 'mm-prueba-NO-REAL'; });

  const res = await runHandler(
    handler,
    mockReq({
      headers: { 'x-forwarded-for': uniqueIp() },
      body: {
        action: 'chat',
        messages: [{ role: 'user', content: 'Hola' }],
      },
    }),
  );

  assert.equal(res.statusCode, 503);
  assert.deepEqual(res.body, {
    error: 'not_configured',
    fallback: 'whatsapp',
  });
});

test('chat convierte respuesta 500 del proveedor en 502', async (t) => {
  const handler = await loadHandler();
  installFetch(t, async () => response({ error: 'fallo' }, 500));

  const res = await runHandler(
    handler,
    mockReq({
      headers: { 'x-forwarded-for': uniqueIp() },
      body: {
        action: 'chat',
        messages: [{ role: 'user', content: 'Hola' }],
      },
    }),
  );

  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body, {
    error: 'provider_error',
    fallback: 'whatsapp',
  });
});

test('chat convierte una excepción de fetch en 502', async (t) => {
  const handler = await loadHandler();
  installFetch(t, async () => {
    throw new Error('fallo de red');
  });

  const res = await runHandler(
    handler,
    mockReq({
      headers: { 'x-forwarded-for': uniqueIp() },
      body: {
        action: 'chat',
        messages: [{ role: 'user', content: 'Hola' }],
      },
    }),
  );

  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body, {
    error: 'provider_error',
    fallback: 'whatsapp',
  });
});

test('tts devuelve el audio Base64 y el MIME esperado', async (t) => {
  const handler = await loadHandler();
  let fetchedUrl;
  let fetchedOptions;

  installFetch(t, async (url, options) => {
    fetchedUrl = url;
    fetchedOptions = options;
    return response({
      base_resp: { status_code: 0 },
      data: { audio: '48656c6c6f' },
    });
  });

  const res = await runHandler(
    handler,
    mockReq({
      headers: { 'x-forwarded-for': uniqueIp() },
      body: { action: 'tts', text: 'Hola' },
    }),
  );

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    audio: Buffer.from('Hello').toString('base64'),
    mime: 'audio/mpeg',
  });
  assert.equal(fetchedUrl, 'https://api.minimax.io/v1/t2a_v2');
  assert.equal(fetchedOptions.method, 'POST');
});

test('tts rechaza texto mayor de 1200 caracteres', async (t) => {
  const handler = await loadHandler();
  const res = await runHandler(
    handler,
    mockReq({
      headers: { 'x-forwarded-for': uniqueIp() },
      body: { action: 'tts', text: 'x'.repeat(1201) },
    }),
  );

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'input_too_long' });
});

test('tts con status_code 1004 devuelve 502', async (t) => {
  const handler = await loadHandler();
  installFetch(t, async () =>
    response({
      base_resp: { status_code: 1004 },
      data: {},
    }),
  );

  const res = await runHandler(
    handler,
    mockReq({
      headers: { 'x-forwarded-for': uniqueIp() },
      body: { action: 'tts', text: 'Hola' },
    }),
  );

  assert.equal(res.statusCode, 502);
});

test('voz obtiene un secreto efímero y no expone XAI_API_KEY', async (t) => {
  const handler = await loadHandler();
  let fetchedUrl;
  let fetchedOptions;

  installFetch(t, async (url, options) => {
    fetchedUrl = url;
    fetchedOptions = options;
    return response({
      value: 'efimero-123',
      expires_at: 1,
    });
  });

  const res = await runHandler(
    handler,
    mockReq({
      headers: {
        origin: 'https://sitio.test',
        host: 'sitio.test',
        'x-forwarded-for': uniqueIp(),
      },
      body: {
        action: 'voz',
        messages: [{ role: 'user', content: 'Hola' }],
      },
    }),
  );

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.token, 'efimero-123');
  assert.ok(res.body.url.startsWith('wss://api.x.ai/v1/realtime'));
  assert.equal(typeof res.body.session.instructions, 'string');
  assert.ok(res.body.session.instructions.length > 0);
  assert.equal(
    fetchedUrl,
    'https://api.x.ai/v1/realtime/client_secrets',
  );
  assert.equal(
    fetchedOptions.headers.Authorization,
    'Bearer xai-prueba-NO-REAL',
  );

  const serialized = JSON.stringify(res.body);
  assert.ok(!serialized.includes('xai-prueba-NO-REAL'));
});

test('voz sin XAI_API_KEY devuelve 503', async (t) => {
  const handler = await loadHandler();
  delete process.env.XAI_API_KEY;
  t.after(() => { process.env.XAI_API_KEY = 'xai-prueba-NO-REAL'; });

  const res = await runHandler(
    handler,
    mockReq({
      headers: {
        origin: 'https://sitio.test',
        host: 'sitio.test',
        'x-forwarded-for': uniqueIp(),
      },
      body: {
        action: 'voz',
        messages: [{ role: 'user', content: 'Hola' }],
      },
    }),
  );

  assert.equal(res.statusCode, 503);
});

test('el rate limit de chat permite 20 peticiones y bloquea la 21', async (t) => {
  const handler = await loadHandler();
  const ip = uniqueIp();

  installFetch(t, async () =>
    response({
      content: [{ type: 'text', text: 'Hola' }],
    }),
  );

  for (let index = 0; index < 20; index += 1) {
    const res = await runHandler(
      handler,
      mockReq({
        headers: { 'x-forwarded-for': ip },
        body: {
          action: 'chat',
          messages: [{ role: 'user', content: `Mensaje ${index}` }],
        },
      }),
    );
    assert.equal(res.statusCode, 200, `petición ${index + 1}`);
  }

  const res = await runHandler(
    handler,
    mockReq({
      headers: { 'x-forwarded-for': ip },
      body: {
        action: 'chat',
        messages: [{ role: 'user', content: 'Exceso' }],
      },
    }),
  );

  assert.equal(res.statusCode, 429);
  assert.deepEqual(res.body, { error: 'rate_limited' });
});

test('el rate limit de voz permite 3 peticiones y bloquea la 4', async (t) => {
  const handler = await loadHandler();
  const ip = uniqueIp();

  installFetch(t, async () =>
    response({
      value: 'efimero-123',
      expires_at: 1,
    }),
  );

  for (let index = 0; index < 3; index += 1) {
    const res = await runHandler(
      handler,
      mockReq({
        headers: {
          origin: 'https://sitio.test',
          host: 'sitio.test',
          'x-forwarded-for': ip,
        },
        body: {
          action: 'voz',
          messages: [{ role: 'user', content: `Mensaje ${index}` }],
        },
      }),
    );
    assert.equal(res.statusCode, 200, `petición ${index + 1}`);
  }

  const res = await runHandler(
    handler,
    mockReq({
      headers: {
        origin: 'https://sitio.test',
        host: 'sitio.test',
        'x-forwarded-for': ip,
      },
      body: {
        action: 'voz',
        messages: [{ role: 'user', content: 'Exceso' }],
      },
    }),
  );

  assert.equal(res.statusCode, 429);
  assert.deepEqual(res.body, { error: 'rate_limited' });
});

test('los console.warn no incluyen el texto del visitante', async (t) => {
  const handler = await loadHandler();
  const originalWarn = console.warn;
  const warnings = [];
  console.warn = (...args) => {
    warnings.push(args.map(String).join(' '));
  };
  t.after(() => {
    console.warn = originalWarn;
  });

  installFetch(t, async () => {
    throw new Error('MENSAJE-PRIVADO-123');
  });

  const res = await runHandler(
    handler,
    mockReq({
      headers: { 'x-forwarded-for': uniqueIp() },
      body: {
        action: 'chat',
        messages: [{ role: 'user', content: 'MENSAJE-PRIVADO-123' }],
      },
    }),
  );

  assert.equal(res.statusCode, 502);
  assert.ok(
    warnings.every((warning) => !warning.includes('MENSAJE-PRIVADO-123')),
  );
});

test('los archivos estáticos no contienen referencias prohibidas', () => {
  const files = walkFiles(ROOT);
  const inspected = files.filter((file) => {
    const relative = path.relative(ROOT, file);
    return (
      relative === path.join('assets', 'agent-cisa-fab.js') ||
      relative === path.join('assets', 'agent-cisa-fab.css') ||
      relative.endsWith('.html')
    );
  });

  assert.ok(inspected.length > 0);

  const forbidden = [
    /elevenlabs/i,
    /sofia-config/i,
    /SOFIA_AGENT_ID/i,
    /convai/i,
    /MINIMAX_API_KEY/i,
    /XAI_API_KEY/i,
    /api\.minimax\.io/i,
    /sk-[A-Za-z0-9]{20,}/,
  ];

  for (const file of inspected) {
    const content = fs.readFileSync(file, 'utf8');
    for (const pattern of forbidden) {
      assert.ok(
        !pattern.test(content),
        `${path.relative(ROOT, file)} contiene ${pattern}`,
      );
    }
  }
});

test('el cliente de Agente CISA contiene los recursos esperados y evita patrones inseguros', () => {
  const file = path.join(ROOT, 'assets', 'agent-cisa-fab.js');
  const content = fs.readFileSync(file, 'utf8');

  assert.ok(content.includes('https://wa.me/525517964940'));
  assert.ok(content.includes('/api/agente-cisa'));
  assert.ok(content.includes('cisa-idle.png'));
  assert.ok(content.includes('cisa-listen.png'));
  assert.ok(content.includes('cisa-speak.png'));
  assert.ok(!content.includes('mousemove'));
  assert.ok(!content.includes('.mp4'));
  assert.ok(!content.includes('innerHTML'));
});

test('no existe api/sofia-config.js', () => {
  assert.equal(fs.existsSync(path.join(ROOT, 'api', 'sofia-config.js')), false);
});

test('existen las tres imágenes de Agente CISA', () => {
  for (const name of ['cisa-idle.png', 'cisa-listen.png', 'cisa-speak.png']) {
    assert.equal(
      fs.existsSync(path.join(ROOT, 'assets', 'agent-cisa', name)),
      true,
      `falta ${name}`,
    );
  }
});

test('vercel.json incluye agente-cisa y configura el CSP requerido', () => {
  const vercel = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'),
  );

  const includeFiles =
    vercel.functions['api/agente-cisa.js'].includeFiles;
  assert.ok([].concat(includeFiles).some((entry) => String(entry).includes('agente-cisa')));

  const csp = JSON.stringify(vercel.headers);

  assert.ok(!/elevenlabs/i.test(csp));
  assert.ok(csp.includes('wss://api.x.ai'));
});

test('los botones agent-cisa-fab no contienen un video', () => {
  const htmlFiles = walkFiles(ROOT).filter((file) => file.endsWith('.html'));

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('id="agent-cisa-fab"')) {
      assert.ok(
        !content.includes('agent-fab__video'),
        `${path.relative(ROOT, file)} contiene agent-fab__video`,
      );
    }
  }
});
