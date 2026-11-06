'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const fs = require('node:fs');
const path = require('node:path');

process.env.MINIMAX_API_KEY = 'mm-prueba-NO-REAL';
process.env.XAI_API_KEY = 'xai-prueba-NO-REAL';

const handler = require('../api/agente-cisa');

const audio = Buffer.alloc(9600).toString('base64');
const sockets = [];
let ipSeq = 100;

class FakeWS extends EventEmitter {
  constructor(url, opts) {
    super();
    this.url = url;
    this.opts = opts || {};
    this.sent = [];
    this.terminated = false;
    this.closed = false;
    this.mode = FakeWS.mode || 'ok';
    sockets.push(this);

    setImmediate(() => {
      this.emit('open');

      if (this.mode === 'silencio') {
        this.emit('message', Buffer.from(JSON.stringify({ type: 'session.created' })));
        return;
      }

      this.onSend = (str) => {
        let msg;
        try {
          msg = JSON.parse(str);
        } catch {
          return;
        }

        if (msg.type === 'session.update') {
          this.emit(
            'message',
            Buffer.from(
              JSON.stringify({
                type: 'session.updated',
                session: { instructions: msg.session.instructions }
              })
            )
          );
          return;
        }

        if (msg.type === 'response.create') {
          if (this.mode === 'error') {
            this.emit(
              'message',
              Buffer.from(
                JSON.stringify({ type: 'error', error: { message: 'x' } })
              )
            );
            return;
          }

          if (this.mode === 'cierre') {
            this.emit('close');
            return;
          }

          const events = [
            {
              type: 'conversation.item.input_audio_transcription.completed',
              transcript: 'pregunta de prueba'
            },
            {
              type: 'response.output_audio_transcript.delta',
              delta: 'Respuesta '
            },
            {
              type: 'response.output_audio_transcript.delta',
              delta: 'de prueba'
            },
            {
              type: 'response.output_audio.delta',
              delta: Buffer.from([1, 0, 2, 0]).toString('base64')
            },
            {
              type: 'session.updated',
              session: { instructions: 'SECRETO-INTERNO' }
            },
            { type: 'response.done' }
          ];

          for (const event of events) {
            this.emit('message', Buffer.from(JSON.stringify(event)));
          }
        }
      };
      this.emit('message', Buffer.from(JSON.stringify({ type: 'session.created' })));
    });
  }

  send(str) {
    this.sent.push(JSON.parse(str));
    if (this.onSend) this.onSend(str);
  }

  terminate() {
    this.terminated = true;
  }

  close() {
    this.closed = true;
  }
}

FakeWS.mode = 'ok';

function makeRes() {
  return {
    statusCode: undefined,
    body: undefined,
    headers: {},
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    end(body) {
      if (body !== undefined) this.body = body;
      return this;
    }
  };
}

async function invoke(body, options = {}) {
  const req = {
    method: options.method || 'POST',
    headers: options.headers || {
      'content-type': 'application/json',
      host: 'sitio.test',
      origin: 'https://sitio.test',
      'x-forwarded-for': options.ip || `203.0.113.${++ipSeq}`
    },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  };

  const res = makeRes();
  await handler(req, res);
  return res;
}

function sentTypes(socket) {
  return socket.sent.map((msg) => msg.type);
}

function sentOfType(socket, type) {
  return socket.sent.filter((msg) => msg.type === type);
}

test.afterEach(() => {
  handler.relayOpts = undefined;
  FakeWS.mode = 'ok';
  sockets.length = 0;
});

test('éxito: devuelve audio, transcripciones y no filtra secretos', async (t) => {
  handler.relayOpts = { WebSocket: FakeWS, timeoutMs: 1000 };

  const res = await invoke({ action: 'voz', audio });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(Object.keys(res.body).sort(), [
    'audio',
    'format',
    'sampleRate',
    'transcript',
    'userTranscript'
  ]);
  assert.equal(res.body.audio, Buffer.from([1, 0, 2, 0]).toString('base64'));
  assert.equal(res.body.format, 'pcm16');
  assert.equal(res.body.sampleRate, 24000);
  assert.equal(res.body.transcript, 'Respuesta de prueba');
  assert.equal(res.body.userTranscript, 'pregunta de prueba');

  const serialized = JSON.stringify(res.body);
  for (const secret of [
    'xai-prueba-NO-REAL',
    'SECRETO-INTERNO',
    'instructions',
    'session',
    'token',
    'wss://',
    'Base de conocimiento'
  ]) {
    assert.equal(serialized.includes(secret), false, secret);
  }

  const promptPath = path.join(
    __dirname,
    '..',
    'agente-cisa',
    'system-prompt.md'
  );
  const line = fs
    .readFileSync(promptPath, 'utf8')
    .split(/\r?\n/)
    .map((value) => value.trim())
    .find(
      (value) =>
        value.length > 40 &&
        !value.startsWith('#') &&
        !value.startsWith('>')
    );
  assert.ok(line);
  assert.equal(serialized.includes(line), false);
});

test('exige Origin del mismo host', async (t) => {
  handler.relayOpts = { WebSocket: FakeWS, timeoutMs: 1000 };

  const res = await invoke(
    { action: 'voz', audio },
    {
      headers: {
        'content-type': 'application/json',
        host: 'sitio.test',
        'x-forwarded-for': '203.0.113.11'
      }
    }
  );
  assert.equal(res.statusCode, 403);
});

test('rechaza base64 inválido, bytes impares y audio demasiado corto', async (t) => {
  handler.relayOpts = { WebSocket: FakeWS, timeoutMs: 1000 };

  let res = await invoke({ action: 'voz', audio: 'no-es-base64!' });
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'bad_audio' });

  res = await invoke({ action: 'voz', audio: Buffer.from([1, 2, 3]).toString('base64') });
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'bad_audio' });

  res = await invoke({
    action: 'voz',
    audio: Buffer.alloc(4799).toString('base64')
  });
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'bad_audio' });
});

test('rechaza audio mayor de 720000 bytes', async (t) => {
  handler.relayOpts = { WebSocket: FakeWS, timeoutMs: 1000 };

  const res = await invoke({
    action: 'voz',
    audio: Buffer.alloc(720001).toString('base64')
  });
  assert.equal(res.statusCode, 413);
  assert.deepEqual(res.body, { error: 'audio_too_long' });
});

test('sin XAI_API_KEY devuelve fallback de WhatsApp', async (t) => {
  const previous = process.env.XAI_API_KEY;
  delete process.env.XAI_API_KEY;
  t.after(() => {
    process.env.XAI_API_KEY = previous;
  });

  handler.relayOpts = { WebSocket: FakeWS, timeoutMs: 1000 };

  const res = await invoke({ action: 'voz', audio });
  assert.equal(res.statusCode, 503);
  assert.deepEqual(res.body, { error: 'not_configured', fallback: 'whatsapp' });
});

test('aplica rate limit de seis peticiones por IP y minuto', async (t) => {
  handler.relayOpts = { WebSocket: FakeWS, timeoutMs: 1000 };

  for (let i = 0; i < 6; i += 1) {
    const res = await invoke(
      { action: 'voz', audio },
      {
        ip: '198.51.100.25',
        headers: {
          'content-type': 'application/json',
          host: 'sitio.test',
          origin: 'https://sitio.test',
          'x-forwarded-for': '198.51.100.25'
        }
      }
    );
    assert.equal(res.statusCode, 200);
  }

  const res = await invoke(
    { action: 'voz', audio },
    {
      ip: '198.51.100.25',
      headers: {
        'content-type': 'application/json',
        host: 'sitio.test',
        origin: 'https://sitio.test',
        'x-forwarded-for': '198.51.100.25'
      }
    }
  );
  assert.equal(res.statusCode, 429);
  assert.deepEqual(res.body, { error: 'rate_limited' });
});

test('autentica el WebSocket en el servidor y mantiene el orden del protocolo', async (t) => {
  handler.relayOpts = { WebSocket: FakeWS, timeoutMs: 1000 };

  const res = await invoke({ action: 'voz', audio });
  assert.equal(res.statusCode, 200);
  assert.ok(sockets.length >= 1);

  const socket = sockets[0];
  assert.ok(socket.url.startsWith('wss://api.x.ai/v1/realtime'));
  assert.equal(
    socket.opts.headers.Authorization,
    'Bearer xai-prueba-NO-REAL'
  );

  const first = socket.sent[0];
  assert.equal(first.type, 'session.update');
  assert.equal(first.session.turn_detection, null);
  assert.ok(first.session.instructions.includes('Base de conocimiento'));

  const types = sentTypes(socket);
  const appendIndex = types.indexOf('input_audio_buffer.append');
  const commitIndex = types.indexOf('input_audio_buffer.commit');
  const responseIndex = types.indexOf('response.create');
  assert.ok(appendIndex >= 0);
  assert.ok(commitIndex > appendIndex);
  assert.ok(responseIndex > commitIndex);
  assert.equal(socket.terminated || socket.closed, true);
});

test('envía como máximo los últimos diez mensajes del historial', async (t) => {
  handler.relayOpts = { WebSocket: FakeWS, timeoutMs: 1000 };

  const res = await invoke({
    action: 'voz',
    audio,
    messages: [
      { role: 'user', content: 'hola' },
      { role: 'assistant', content: 'qué tal' }
    ]
  });
  assert.equal(res.statusCode, 200);
  assert.equal(sentOfType(sockets[0], 'conversation.item.create').length, 2);

  sockets.length = 0;
  const messages = Array.from({ length: 12 }, (_, index) => ({
    role: index % 2 === 0 ? 'user' : 'assistant',
    content: `mensaje ${index}`
  }));
  const res2 = await invoke({ action: 'voz', audio, messages });
  assert.equal(res2.statusCode, 200);
  assert.equal(sentOfType(sockets[0], 'conversation.item.create').length, 10);

  sockets.length = 0;
  const res3 = await invoke({ action: 'voz', audio, messages: [] });
  assert.equal(res3.statusCode, 200);
  assert.equal(sentOfType(sockets[0], 'conversation.item.create').length, 0);
});

test('traduce un error del proveedor a 502 y termina el socket', async (t) => {
  FakeWS.mode = 'error';
  handler.relayOpts = { WebSocket: FakeWS, timeoutMs: 1000 };

  const res = await invoke({ action: 'voz', audio });
  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body, { error: 'provider_error', fallback: 'whatsapp' });
  assert.equal(sockets[0].terminated || sockets[0].closed, true);
});

test('traduce un cierre inesperado a 502', async (t) => {
  FakeWS.mode = 'cierre';
  handler.relayOpts = { WebSocket: FakeWS, timeoutMs: 1000 };

  const res = await invoke({ action: 'voz', audio });
  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body, { error: 'provider_error', fallback: 'whatsapp' });
});

test('devuelve 504 cuando el proveedor no responde antes del timeout', async (t) => {
  FakeWS.mode = 'silencio';
  handler.relayOpts = { WebSocket: FakeWS, timeoutMs: 50 };

  const res = await invoke({ action: 'voz', audio });
  assert.equal(res.statusCode, 504);
  assert.deepEqual(res.body, { error: 'timeout', fallback: 'whatsapp' });
  assert.equal(sockets[0].terminated || sockets[0].closed, true);
});

test('relayVoz directo propaga provider_error', async (t) => {
  FakeWS.mode = 'error';

  await assert.rejects(
    () =>
      handler.relayVoz(
        {
          audio: Buffer.from(audio, 'base64'),
          messages: []
        },
        { WebSocket: FakeWS, timeoutMs: 1000 }
      ),
    (error) => {
      assert.equal(error.code, 'provider_error');
      return true;
    }
  );
});

test('no escribe transcripción ni clave API en console.warn', async (t) => {
  FakeWS.mode = 'error';
  handler.relayOpts = { WebSocket: FakeWS, timeoutMs: 1000 };

  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (...args) => warnings.push(args.join(' '));
  t.after(() => {
    console.warn = originalWarn;
  });

  await invoke({ action: 'voz', audio });
  const output = warnings.join('\n');
  assert.equal(output.includes('pregunta de prueba'), false);
  assert.equal(output.includes('xai-prueba-NO-REAL'), false);
});

test('los recursos del cliente estático no exponen credenciales ni protocolo del proveedor', async () => {
  const root = path.join(__dirname, '..');
  const fab = fs.readFileSync(
    path.join(root, 'assets', 'agent-cisa-fab.js'),
    'utf8'
  );
  const worklet = fs.readFileSync(
    path.join(root, 'assets', 'agent-cisa-mic-worklet.js'),
    'utf8'
  );

  for (const content of [fab, worklet]) {
    for (const forbidden of [
      'WebSocket',
      'api.x.ai',
      'xai-client-secret',
      'client_secrets',
      'instructions'
    ]) {
      assert.equal(content.includes(forbidden), false, forbidden);
    }
  }

  assert.match(fab, /action:\s*['"]voz['"]/);
  assert.ok(fab.includes('/api/agente-cisa'));
});
