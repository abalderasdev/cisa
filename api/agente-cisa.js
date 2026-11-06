'use strict';

const { hit, clientIp } = require('./_lib/ratelimit');
const contexto = require('./_lib/agente-contexto');

const LIMITS = {
  MAX_MESSAGES: 20,
  MAX_CHARS: 2000,
  MAX_TTS_CHARS: 1200,
  MAX_AUDIO_BYTES: 720000,
  MIN_AUDIO_BYTES: 4800
};

const RATE_LIMITS = {
  chat: { limite: 20, ventana: 60 },
  tts: { limite: 20, ventana: 60 },
  voz: { limite: 6, ventana: 60 }
};

function registrarAviso(action, codigo) {
  console.warn('[agente-cisa]', action, codigo);
}

function responderError(res, estado, error, extra = {}) {
  return res.status(estado).json({ error, ...extra });
}

function parseBody(body) {
  if (body && typeof body === 'object' && !Array.isArray(body)) {
    return body;
  }

  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body);

      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed;
      }
    } catch (_) {
      // El error se reporta como JSON inválido.
    }
  }

  return null;
}

function origenPermitido(req) {
  const origin = req.headers.origin;

  if (!origin) return true;

  let hostOrigen;

  try {
    hostOrigen = new URL(origin).host;
  } catch (_) {
    return false;
  }

  if (hostOrigen === req.headers.host) return true;

  const permitidos = String(process.env.AGENTE_CISA_ORIGINS || '')
    .split(',')
    .map((valor) => valor.trim())
    .filter(Boolean);

  return permitidos.some((permitido) => {
    try {
      return new URL(permitido).origin === new URL(origin).origin;
    } catch (_) {
      return false;
    }
  });
}

async function consultarMinimaxTexto(messages) {
  const apiKey = process.env.MINIMAX_API_KEY;

  if (!apiKey) {
    return { error: 'not_configured' };
  }

  let response;

  try {
    response = await fetch('https://api.minimax.io/anthropic/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.MINIMAX_TEXT_MODEL || 'MiniMax-M3',
        max_tokens: 700,
        system: contexto.instrucciones(),
        messages
      }),
      signal: AbortSignal.timeout(25000)
    });
  } catch (_) {
    return { error: 'provider_error' };
  }

  if (!response.ok) {
    return { error: 'provider_error', status: response.status };
  }

  let payload;

  try {
    payload = await response.json();
  } catch (_) {
    return { error: 'provider_error', status: response.status };
  }

  if (!payload || !Array.isArray(payload.content)) {
    return { error: 'provider_error', status: response.status };
  }

  const texto = payload.content
    .filter((bloque) => bloque && bloque.type === 'text' && typeof bloque.text === 'string')
    .map((bloque) => bloque.text)
    .join('')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .trim();

  if (!texto) {
    return { error: 'provider_error', status: response.status };
  }

  return { texto };
}

async function consultarMinimaxTts(text) {
  const apiKey = process.env.MINIMAX_API_KEY;

  if (!apiKey) {
    return { error: 'not_configured' };
  }

  let response;

  try {
    response = await fetch('https://api.minimax.io/v1/t2a_v2', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.MINIMAX_TTS_MODEL || 'speech-2.8-turbo',
        text,
        stream: false,
        language_boost: 'Spanish',
        output_format: 'hex',
        voice_setting: {
          voice_id: process.env.MINIMAX_TTS_VOICE || 'Spanish_SereneWoman',
          speed: 1,
          vol: 1,
          pitch: 0
        },
        audio_setting: {
          sample_rate: 24000,
          bitrate: 64000,
          format: 'mp3',
          channel: 1
        }
      }),
      signal: AbortSignal.timeout(25000)
    });
  } catch (_) {
    return { error: 'provider_error' };
  }

  if (!response.ok) {
    return { error: 'provider_error', status: response.status };
  }

  let payload;

  try {
    payload = await response.json();
  } catch (_) {
    return { error: 'provider_error', status: response.status };
  }

  const baseResp = payload && payload.base_resp;

  if (!baseResp || baseResp.status_code !== 0) {
    return { error: 'provider_error', status: response.status };
  }

  const audioHex = payload.data && payload.data.audio;

  if (typeof audioHex !== 'string' || !/^[0-9a-f]+$/i.test(audioHex)) {
    return { error: 'provider_error', status: response.status };
  }

  let audio;

  try {
    audio = Buffer.from(audioHex, 'hex');
  } catch (_) {
    return { error: 'provider_error', status: response.status };
  }

  if (!audio.length) {
    return { error: 'provider_error', status: response.status };
  }

  return { audio: audio.toString('base64') };
}

function validarMensajes(messages, opciones = {}) {
  const { permitirCualquierRolUltimo = false, maximo = LIMITS.MAX_MESSAGES } = opciones;

  if (!Array.isArray(messages) || messages.length === 0) {
    return { error: 'bad_request' };
  }

  const mensajes = messages.slice(-maximo);

  for (const message of mensajes) {
    if (
      !message ||
      !['user', 'assistant'].includes(message.role) ||
      typeof message.content !== 'string'
    ) {
      return { error: 'bad_request' };
    }

    if (!message.content.trim()) {
      return { error: 'bad_request' };
    }

    if (message.content.length > LIMITS.MAX_CHARS) {
      return { error: 'input_too_long' };
    }
  }

  if (!permitirCualquierRolUltimo && mensajes[mensajes.length - 1].role !== 'user') {
    return { error: 'bad_request' };
  }

  return {
    messages: mensajes.map((message) => ({
      role: message.role,
      content: message.content
    }))
  };
}

function validarChat(body) {
  return validarMensajes(body.messages);
}

function validarAudio(audio) {
  if (
    typeof audio !== 'string' ||
    !audio.length ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(audio) ||
    audio.length % 4 !== 0
  ) {
    return { error: 'bad_audio' };
  }

  // Rechaza audio demasiado largo antes de decodificarlo.
  if (Math.floor((audio.length * 3) / 4) - (audio.match(/=+$/) || [''])[0].length > LIMITS.MAX_AUDIO_BYTES) {
    return { error: 'audio_too_long' };
  }

  let bytes;

  try {
    bytes = Buffer.from(audio, 'base64');
  } catch (_) {
    return { error: 'bad_audio' };
  }

  if (!bytes.length || bytes.length % 2 !== 0) {
    return { error: 'bad_audio' };
  }

  if (bytes.length < LIMITS.MIN_AUDIO_BYTES) {
    return { error: 'bad_audio' };
  }

  if (bytes.length > LIMITS.MAX_AUDIO_BYTES) {
    return { error: 'audio_too_long' };
  }

  return { audio: bytes };
}

function recortarTexto(texto) {
  return typeof texto === 'string' ? texto.trim() : '';
}

async function relayVoz({ audio, messages }, opts = {}) {
  const WebSocket = opts.WebSocket || require('ws');
  const timeoutMs = opts.timeoutMs === undefined ? 22000 : opts.timeoutMs;
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey) {
    const error = new Error('not_configured');
    error.code = 'not_configured';
    throw error;
  }

  if (!Buffer.isBuffer(audio)) {
    const error = new Error('bad_audio');
    error.code = 'bad_audio';
    throw error;
  }

  return new Promise((resolve, reject) => {
    let socket;
    let settled = false;
    let timer = null;
    let sessionUpdated = false;
    let responseDone = false;
    let outputBuffers = [];
    let outputBytes = 0;
    let transcript = '';
    let userTranscript = '';

    const finish = (fn, value) => {
      if (settled) return;

      settled = true;

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      try {
        if (socket) {
          if (typeof socket.terminate === 'function') {
            socket.terminate();
          } else if (typeof socket.close === 'function') {
            socket.close();
          }
        }
      } catch (_) {
        // El cierre es best-effort.
      }

      fn(value);
    };

    const fail = (code) => {
      const error = new Error(code);
      error.code = code;
      finish(reject, error);
    };

    const succeed = () => {
      const responseAudio = Buffer.concat(outputBuffers);
      const responseTranscript = recortarTexto(transcript);
      const visitorTranscript = recortarTexto(userTranscript);

      if (!responseAudio.length && !responseTranscript) {
        fail('provider_error');
        return;
      }

      finish(resolve, {
        audio: responseAudio.toString('base64'),
        transcript: responseTranscript,
        userTranscript: visitorTranscript
      });
    };

    const send = (payload) => {
      if (!socket || typeof socket.send !== 'function') return;

      try {
        socket.send(JSON.stringify(payload));
      } catch (_) {
        fail('provider_error');
      }
    };

    const sendSessionUpdate = () => {
      send({
        type: 'session.update',
        session: {
          instructions: contexto.instruccionesVoz(),
          voice: process.env.XAI_VOICE || 'Ara',
          turn_detection: null,
          audio: {
            input: {
              format: {
                type: 'audio/pcm',
                rate: 24000
              }
            },
            output: {
              format: {
                type: 'audio/pcm',
                rate: 24000
              }
            }
          }
        }
      });
    };

    const sendConversation = () => {
      for (const message of messages || []) {
        send({
          type: 'conversation.item.create',
          item: {
            type: 'message',
            role: message.role,
            content: [
              {
                type: message.role === 'user' ? 'input_text' : 'text',
                text: message.content
              }
            ]
          }
        });
      }

      const chunkSize = 96000;

      for (let offset = 0; offset < audio.length; offset += chunkSize) {
        const chunk = audio.subarray(offset, Math.min(offset + chunkSize, audio.length));

        send({
          type: 'input_audio_buffer.append',
          audio: chunk.toString('base64')
        });
      }

      send({ type: 'input_audio_buffer.commit' });
      send({ type: 'response.create' });
    };

    const handleEvent = (raw) => {
      let event;

      try {
        event = JSON.parse(typeof raw === 'string' ? raw : Buffer.from(raw).toString('utf8'));
      } catch (_) {
        return;
      }

      if (!event || typeof event !== 'object') return;

      if (event.type === 'session.created') {
        sendSessionUpdate();
        return;
      }

      if (event.type === 'session.updated') {
        // Solo cuenta la confirmación que ya trae nuestras instrucciones.
        if (!sessionUpdated && event.session && event.session.instructions) {
          sessionUpdated = true;
          sendConversation();
        }
        return;
      }

      if (event.type === 'response.output_audio.delta') {
        if (typeof event.delta !== 'string') return;

        let delta;

        try {
          delta = Buffer.from(event.delta, 'base64');
        } catch (_) {
          return;
        }

        if (!delta.length) return;

        if (outputBytes + delta.length > 2880000) {
          const remaining = 2880000 - outputBytes;

          if (remaining > 0) {
            outputBuffers.push(delta.subarray(0, remaining));
            outputBytes += remaining;
          }

          succeed();
          return;
        }

        outputBuffers.push(delta);
        outputBytes += delta.length;
        return;
      }

      if (event.type === 'response.output_audio_transcript.delta') {
        if (typeof event.delta === 'string') {
          transcript += event.delta;
        }
        return;
      }

      if (event.type === 'conversation.item.input_audio_transcription.completed') {
        if (typeof event.transcript === 'string') {
          userTranscript += event.transcript;
        }
        return;
      }

      if (event.type === 'error') {
        fail('provider_error');
        return;
      }

      if (event.type === 'response.done') {
        responseDone = true;
        succeed();
      }
    };

    try {
      socket = new WebSocket(
        'wss://api.x.ai/v1/realtime?model=' +
          encodeURIComponent(process.env.XAI_VOICE_MODEL || 'grok-voice-latest'),
        {
          headers: {
            Authorization: 'Bearer ' + apiKey
          }
        }
      );
    } catch (_) {
      fail('provider_error');
      return;
    }

    timer = setTimeout(() => {
      fail('timeout');
    }, timeoutMs);

    socket.on('open', () => {
      // La actualización de sesión se envía al recibir session.created.
    });

    socket.on('message', (data) => {
      handleEvent(data);
    });

    socket.on('error', () => {
      fail('provider_error');
    });

    socket.on('close', () => {
      if (!responseDone && !settled) {
        fail('provider_error');
      }
    });
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return responderError(res, 405, 'method_not_allowed');
  }

  const contentType = String(req.headers['content-type'] || '');

  if (!contentType.toLowerCase().includes('application/json')) {
    return responderError(res, 415, 'unsupported_media_type');
  }

  const body = parseBody(req.body);

  if (!body) {
    return responderError(res, 400, 'bad_request');
  }

  const action = body.action;

  if (!['chat', 'tts', 'voz'].includes(action)) {
    return responderError(res, 400, 'bad_request');
  }

  const origenValido = origenPermitido(req);

  if (!origenValido || (action === 'voz' && !req.headers.origin)) {
    return responderError(res, 403, 'origin_not_allowed');
  }

  const ip = clientIp(req);
  const limite = RATE_LIMITS[action];
  const permitido = await hit(`agente:${action}:${ip}`, limite.limite, limite.ventana);

  if (!permitido) {
    registrarAviso(action, 429);
    return responderError(res, 429, 'rate_limited');
  }

  if (action === 'voz') {
    const permitidoDia = await hit(
      `agente:voz-dia:${ip}`,
      60,
      86400
    );

    if (!permitidoDia) {
      registrarAviso(action, 429);
      return responderError(res, 429, 'rate_limited');
    }
  }

  if (action === 'chat') {
    const validacion = validarChat(body);

    if (validacion.error) {
      return responderError(res, 400, validacion.error);
    }

    const resultado = await consultarMinimaxTexto(validacion.messages);

    if (resultado.error === 'not_configured') {
      registrarAviso(action, 503);
      return responderError(res, 503, 'not_configured', { fallback: 'whatsapp' });
    }

    if (resultado.error) {
      registrarAviso(action, 502);
      return responderError(res, 502, 'provider_error', { fallback: 'whatsapp' });
    }

    return res.status(200).json({ reply: resultado.texto });
  }

  if (action === 'tts') {
    if (typeof body.text !== 'string' || !body.text.trim()) {
      return responderError(res, 400, 'bad_request');
    }

    if (body.text.length > LIMITS.MAX_TTS_CHARS) {
      return responderError(res, 400, 'input_too_long');
    }

    const resultado = await consultarMinimaxTts(body.text);

    if (resultado.error === 'not_configured') {
      registrarAviso(action, 503);
      return responderError(res, 503, 'not_configured', { fallback: 'whatsapp' });
    }

    if (resultado.error) {
      registrarAviso(action, 502);
      return responderError(res, 502, 'provider_error', { fallback: 'whatsapp' });
    }

    return res.status(200).json({
      audio: resultado.audio,
      mime: 'audio/mpeg'
    });
  }

  const validacionAudio = validarAudio(body.audio);

  if (validacionAudio.error) {
    if (validacionAudio.error === 'audio_too_long') {
      return responderError(res, 413, 'audio_too_long');
    }

    return responderError(res, 400, 'bad_audio');
  }

  let historial = [];

  // Historial vacío equivale a no enviar historial.
  if (body.messages !== undefined && !(Array.isArray(body.messages) && body.messages.length === 0)) {
    const validacionMensajes = validarMensajes(body.messages, {
      permitirCualquierRolUltimo: true,
      maximo: 10
    });

    if (validacionMensajes.error) {
      return responderError(res, 400, validacionMensajes.error);
    }

    historial = validacionMensajes.messages;
  }

  if (!process.env.XAI_API_KEY) {
    registrarAviso(action, 503);
    return responderError(res, 503, 'not_configured', { fallback: 'whatsapp' });
  }

  let resultado;

  try {
    resultado = await relayVoz(
      {
        audio: validacionAudio.audio,
        messages: historial
      },
      module.exports.relayOpts || {}
    );
  } catch (error) {
    if (error && error.code === 'timeout') {
      registrarAviso(action, 504);
      return responderError(res, 504, 'timeout', { fallback: 'whatsapp' });
    }

    registrarAviso(action, 502);
    return responderError(res, 502, 'provider_error', { fallback: 'whatsapp' });
  }

  return res.status(200).json({
    audio: resultado.audio,
    format: 'pcm16',
    sampleRate: 24000,
    transcript: resultado.transcript,
    userTranscript: resultado.userTranscript
  });
};

module.exports.LIMITS = LIMITS;
module.exports.relayVoz = relayVoz;
