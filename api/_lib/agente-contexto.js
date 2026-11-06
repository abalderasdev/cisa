'use strict';

const fs = require('fs');
const path = require('path');

let cache = null;

function cargarArchivos() {
  if (cache) return cache;

  const nombres = [
    'system-prompt.md',
    'knowledge-base.md',
    'flows.md',
    'handoff-to-human.md'
  ];

  const contenido = nombres.map((nombre) => {
    const ruta = path.join(__dirname, '..', '..', 'agente-cisa', nombre);

    try {
      return fs.readFileSync(ruta, 'utf8');
    } catch (error) {
      throw new Error(
        `No se pudo cargar el archivo de contexto "${nombre}" desde "${ruta}": ${error.message}`
      );
    }
  });

  cache = {
    systemPrompt: contenido[0],
    knowledgeBase: contenido[1],
    flows: contenido[2],
    handoffToHuman: contenido[3]
  };

  return cache;
}

function instrucciones() {
  const contexto = cargarArchivos();

  return [
    contexto.systemPrompt,
    '\n\n# Base de conocimiento\n\n',
    contexto.knowledgeBase,
    '\n\n# Flujos\n\n',
    contexto.flows,
    '\n\n# Escalamiento a humano\n\n',
    contexto.handoffToHuman
  ].join('');
}

function instruccionesVoz() {
  return (
    instrucciones() +
    '\n\nEstás en conversación de voz: responde en frases breves en español de México.'
  );
}

module.exports = {
  instrucciones,
  instruccionesVoz
};
