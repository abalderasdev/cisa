// api/sofia-config.js
//
// Vercel serverless function that returns the public Sofia widget config.
// Reads from environment variables so the team can update ElevenLabs
// agent_id and the WhatsApp fallback number without touching the
// front-end code or redeploying the static HTML.
//
// Vercel env vars to set (Project Settings → Environment Variables):
//   SOFIA_AGENT_ID            ElevenLabs agent_id (from their dashboard).
//                             Leave empty/unset to fall back to WhatsApp
//                             every time (current pre-launch behaviour).
//   SOFIA_WHATSAPP_NUMBER      E.164 format, e.g. 525517964940
//                             (no "+" prefix, no spaces).
//   SOFIA_FALLBACK_MESSAGE     Pre-filled WhatsApp message. Optional.
//
// The function is CORS-friendly (any origin) and short-cached at the
// edge for 60 seconds so we never hammer it.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, max-age=60, s-maxage=60'
};

const DEFAULTS = {
  agentId: 'REPLACE_WITH_AGENT_ID',
  whatsappNumber: '525517964940',
  fallbackMessage: 'Hola, necesito información sobre Grupo CISA.',
  fallbackTimeoutMs: 5000,
  source: 'defaults'
};

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(204).end();
  }
  if (req.method !== 'GET') {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const agentId = (process.env.SOFIA_AGENT_ID || '').trim();
  const whatsappNumber = (process.env.SOFIA_WHATSAPP_NUMBER || '').trim();
  const fallbackMessage = (process.env.SOFIA_FALLBACK_MESSAGE || '').trim();

  // Public payload: only things that are already meant to be in the
  // browser. The agent_id is public (it ships in the embed script URL);
  // the WhatsApp number is already printed in the HTML.
  const payload = {
    agentId: agentId || DEFAULTS.agentId,
    whatsappNumber: whatsappNumber || DEFAULTS.whatsappNumber,
    fallbackMessage: fallbackMessage || DEFAULTS.fallbackMessage,
    fallbackTimeoutMs: DEFAULTS.fallbackTimeoutMs,
    configured: Boolean(agentId),
    source: agentId ? 'env' : DEFAULTS.source
  };

  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  return res.status(200).json(payload);
};
