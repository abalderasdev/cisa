'use strict';

const { hit, clientIp } = require('./_lib/ratelimit');
const contexto = require('./_lib/agente-contexto');

const LIMITS = {
  MAX_MESSAGES: 20,
  MAX_CHARS: 2000,
  MAX_TTS_CHARS: 1200
};

const RATE_LIMITS = {
  chat: { limite: 20, ventana: 60 },
  tts: { limite: 20, ventana: 60 },
  voz: { limite: 3, ventana: 60 }
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

async function crearTokenVoz() {
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey) {
    return { error: 'not_configured' };
  }

  let response;

  try {
    response = await fetch('https://api.x.ai/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        expires_after: { seconds: 60 }
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

  if (!payload || typeof payload.value !== 'string' || !payload.value) {
    return { error: 'provider_error', status: response.status };
  }

  return {
    token: payload.value,
    expiresAt: payload.expires_at
  };
}

function validarChat(body) {
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return { error: 'bad_request' };
  }

  const messages = body.messages.slice(-LIMITS.MAX_MESSAGES);

  for (const message of messages) {
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

  if (messages[messages.length - 1].role !== 'user') {
    return { error: 'bad_request' };
  }

  return {
    messages: messages.map((message) => ({
      role: message.role,
      content: message.content
    }))
  };
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
      20,
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

  const resultado = await crearTokenVoz();

  if (resultado.error === 'not_configured') {
    registrarAviso(action, 503);
    return responderError(res, 503, 'not_configured', { fallback: 'whatsapp' });
  }

  if (resultado.error) {
    registrarAviso(action, 502);
    return responderError(res, 502, 'provider_error', { fallback: 'whatsapp' });
  }

  return res.status(200).json({
    token: resultado.token,
    expiresAt: resultado.expiresAt,
    url:
      'wss://api.x.ai/v1/realtime?model=' +
      encodeURIComponent(process.env.XAI_VOICE_MODEL || 'grok-voice-latest'),
    session: {
      instructions: contexto.instruccionesVoz(),
      voice: process.env.XAI_VOICE || 'Ara',
      turn_detection: { type: 'server_vad' },
      audio: {
        input: {
          format: { type: 'audio/pcm', rate: 24000 }
        },
        output: {
          format: { type: 'audio/pcm', rate: 24000 }
        }
      }
    }
  });
};

module.exports.LIMITS = LIMITS;
