(function () {
  'use strict';

  var FAB_ID = 'agent-cisa-fab';
  var HISTORY_KEY = 'cisa-agente-historial-v1';
  var HISTORY_MAX = 40;
  var CHAT_CONTEXT_MAX = 20;
  var HISTORY_TTL = 30 * 24 * 60 * 60 * 1000;
  var WHATSAPP_URL =
    'https://wa.me/525517964940?text=' +
    encodeURIComponent('Hola, vengo del sitio de Grupo CISA y quiero información.');

  var images = {
    idle: '/assets/agent-cisa/cisa-idle.png',
    listen: '/assets/agent-cisa/cisa-listen.png',
    speak: '/assets/agent-cisa/cisa-speak.png'
  };

  var fab = document.getElementById(FAB_ID);
  if (!fab) return;

  var panel = null;
  var elements = {};
  var history = [];
  var historyLoaded = false;
  var chatBusy = false;
  var chatAbort = null;
  var voice = null;
  var lastAssistantText = '';
  var storageAvailable = true;

  preloadImages();

  fab.addEventListener('click', function () {
    if (panel && !panel.hidden) {
      closePanel();
    } else {
      openPanel();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && panel && !panel.hidden) {
      event.preventDefault();
      closePanel();
    }
  });

  function preloadImages() {
    Object.keys(images).forEach(function (key) {
      var image = new Image();
      image.src = images[key];
    });
  }

  function create(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === 'string') node.textContent = text;
    return node;
  }

  function button(className, text, label) {
    var node = create('button', className, text);
    node.type = 'button';
    if (label) node.setAttribute('aria-label', label);
    return node;
  }

  function openPanel() {
    if (!panel) {
      createPanel();
      document.body.appendChild(panel);
    }

    panel.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    loadHistory();
    renderHistory();

    window.setTimeout(function () {
      if (elements.textarea) elements.textarea.focus();
    }, 0);
  }

  function closePanel() {
    if (!panel || panel.hidden) return;
    stopVoice();
    panel.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    setState('idle');
    fab.focus();
  }

  function createPanel() {
    panel = create('section', 'agent-cisa-panel');
    panel.id = 'agent-cisa-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-labelledby', 'agent-cisa-panel-title');
    panel.hidden = true;

    var header = create('header', 'agent-cisa-panel__header');
    var avatar = create('img', 'agent-cisa-panel__avatar');
    avatar.src = images.idle;
    avatar.alt = 'CISA';
    avatar.width = 48;
    avatar.height = 48;

    var headingWrap = create('div', 'agent-cisa-panel__identity');
    var heading = create('h2', 'agent-cisa-panel__title', 'CISA');
    heading.id = 'agent-cisa-panel-title';
    var subtitle = create('p', 'agent-cisa-panel__subtitle', 'Asistente virtual de Grupo CISA');
    headingWrap.appendChild(heading);
    headingWrap.appendChild(subtitle);

    var close = button('agent-cisa-panel__close', '×', 'Cerrar chat');
    close.addEventListener('click', closePanel);
    header.appendChild(avatar);
    header.appendChild(headingWrap);
    header.appendChild(close);

    var tools = create('div', 'agent-cisa-panel__tools');
    var reset = button('agent-cisa-panel__new', 'Nueva conversación');
    reset.addEventListener('click', newConversation);
    tools.appendChild(reset);

    var body = create('div', 'agent-cisa-panel__body');
    var messages = create('div', 'agent-cisa-messages');
    messages.id = 'agent-cisa-messages';
    messages.setAttribute('role', 'log');
    messages.setAttribute('aria-live', 'polite');
    messages.setAttribute('aria-relevant', 'additions');

    var notice = create(
      'p',
      'agent-cisa-notice',
      'CISA es un asistente virtual: orienta, no vende ni da valuaciones. Para atención personal escribe por WhatsApp.'
    );

    body.appendChild(messages);
    body.appendChild(notice);

    var form = create('form', 'agent-cisa-form');
    var textarea = create('textarea', 'agent-cisa-textarea');
    textarea.maxLength = 2000;
    textarea.rows = 3;
    textarea.placeholder = 'Escribe tu pregunta…';
    textarea.setAttribute('aria-label', 'Mensaje para CISA');

    var controls = create('div', 'agent-cisa-controls');
    var send = button('agent-cisa-send', 'Enviar');
    send.disabled = false;

    var mic = button('agent-cisa-mic', 'Micrófono', 'Activar micrófono');
    mic.setAttribute('aria-pressed', 'false');

    var tts = button('agent-cisa-tts', 'Leer en voz alta');
    tts.disabled = true;

    controls.appendChild(send);
    controls.appendChild(mic);
    controls.appendChild(tts);

    form.appendChild(textarea);
    form.appendChild(controls);

    var whatsapp = create('a', 'agent-cisa-whatsapp', 'Escribir por WhatsApp');
    whatsapp.href = WHATSAPP_URL;
    whatsapp.target = '_blank';
    whatsapp.rel = 'noopener';

    panel.appendChild(header);
    panel.appendChild(tools);
    panel.appendChild(body);
    panel.appendChild(form);
    panel.appendChild(whatsapp);

    elements = {
      avatar: avatar,
      messages: messages,
      textarea: textarea,
      form: form,
      send: send,
      mic: mic,
      tts: tts
    };

    textarea.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        submitChat();
      }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      submitChat();
    });

    mic.addEventListener('click', toggleVoice);

    tts.addEventListener('click', function () {
      speakWithTts();
    });
  }

  function loadHistory() {
    if (historyLoaded) return;
    historyLoaded = true;

    try {
      var raw = window.localStorage.getItem(HISTORY_KEY);
      if (!raw) return;

      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.messages)) return;

      var now = Date.now();
      if (
        typeof parsed.timestamp !== 'number' ||
        now - parsed.timestamp > HISTORY_TTL ||
        !Array.isArray(parsed.messages)
      ) {
        window.localStorage.removeItem(HISTORY_KEY);
        return;
      }

      history = parsed.messages
        .filter(function (item) {
          return (
            item &&
            (item.role === 'user' || item.role === 'assistant') &&
            typeof item.content === 'string'
          );
        })
        .slice(-HISTORY_MAX);
    } catch (error) {
      storageAvailable = false;
    }
  }

  function saveHistory() {
    if (!storageAvailable) return;

    try {
      window.localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          messages: history.slice(-HISTORY_MAX)
        })
      );
    } catch (error) {
      storageAvailable = false;
    }
  }

  function renderHistory() {
    elements.messages.textContent = '';

    if (!history.length) {
      addMessage(
        'assistant',
        'Hola, soy CISA. Te oriento sobre Grupo CISA, sus desarrollos y cómo funciona la inversión. ¿En qué te ayudo?',
        false
      );
    } else {
      history.forEach(function (item) {
        addMessage(item.role, item.content, false);
      });
    }

    updateTtsButton();
    scrollMessages();
  }

  function addMessage(role, content, persist) {
    var row = create('div', 'agent-cisa-message-row agent-cisa-message-row--' + role);
    var bubble = create('div', 'agent-cisa-message agent-cisa-message--' + role, content);
    row.appendChild(bubble);
    elements.messages.appendChild(row);
    scrollMessages();

    if (persist) {
      history.push({ role: role, content: content });
      history = history.slice(-HISTORY_MAX);
      saveHistory();
    }

    if (role === 'assistant' && content) {
      lastAssistantText = content;
      updateTtsButton();
    }
  }

  function addSystemMessage(content) {
    var row = create('div', 'agent-cisa-message-row agent-cisa-message-row--system');
    var bubble = create('div', 'agent-cisa-message agent-cisa-message--system', content);
    var link = create('a', 'agent-cisa-system-link', 'Continuar por WhatsApp');
    link.href = WHATSAPP_URL;
    link.target = '_blank';
    link.rel = 'noopener';
    bubble.appendChild(document.createElement('br'));
    bubble.appendChild(link);
    row.appendChild(bubble);
    elements.messages.appendChild(row);
    scrollMessages();
  }

  function scrollMessages() {
    elements.messages.scrollTop = elements.messages.scrollHeight;
  }

  function newConversation() {
    stopVoice();
    history = [];
    if (storageAvailable) {
      try {
        window.localStorage.removeItem(HISTORY_KEY);
      } catch (error) {
        storageAvailable = false;
      }
    }
    lastAssistantText = '';
    renderHistory();
    elements.textarea.focus();
  }

  function setState(state) {
    fab.setAttribute('data-state', state);
    var source = images.idle;
    if (state === 'listening') source = images.listen;
    if (state === 'speaking') source = images.speak;
    if (elements.avatar) elements.avatar.src = source;

    var still = fab.querySelector('.agent-fab__still');
    if (still) still.src = source;
  }

  function submitChat() {
    if (chatBusy) return;

    var content = elements.textarea.value.trim();
    if (!content) return;

    chatBusy = true;
    elements.send.disabled = true;
    elements.textarea.value = '';
    addMessage('user', content, true);
    setState('thinking');

    var thinking = create(
      'div',
      'agent-cisa-message-row agent-cisa-message-row--assistant',
      'CISA está escribiendo…'
    );
    thinking.id = 'agent-cisa-thinking';
    elements.messages.appendChild(thinking);
    scrollMessages();

    var controller = new AbortController();
    chatAbort = controller;
    var timeout = window.setTimeout(function () {
      controller.abort();
    }, 30000);

    fetch('/api/agente-cisa', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'chat',
        messages: history.slice(-CHAT_CONTEXT_MAX)
      }),
      signal: controller.signal
    })
      .then(function (response) {
        if (!response.ok) {
          return response.json().catch(function () {
            return {};
          }).then(function (data) {
            throw data;
          });
        }
        return response.json();
      })
      .then(function (data) {
        window.clearTimeout(timeout);
        removeThinking();
        chatBusy = false;
        chatAbort = null;
        elements.send.disabled = false;
        setState('idle');

        if (!data || data.fallback === 'whatsapp' || typeof data.reply !== 'string') {
          throw new Error('fallback');
        }

        addMessage('assistant', data.reply, true);
      })
      .catch(function () {
        window.clearTimeout(timeout);
        removeThinking();
        chatBusy = false;
        chatAbort = null;
        elements.send.disabled = false;
        setState('idle');
        addSystemMessage(
          'No pude responder en este momento. Puedes continuar por WhatsApp.'
        );
      });
  }

  function removeThinking() {
    var thinking = document.getElementById('agent-cisa-thinking');
    if (thinking && thinking.parentNode) thinking.parentNode.removeChild(thinking);
  }

  function updateTtsButton() {
    if (elements.tts) elements.tts.disabled = !lastAssistantText;
  }

  function speakWithTts() {
    var text = lastAssistantText.slice(0, 1200).trim();
    if (!text) return;

    var audio = new Audio();
    var objectUrl;

    elements.tts.disabled = true;
    setState('speaking');

    fetch('/api/agente-cisa', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'tts',
        text: text
      })
    })
      .then(function (response) {
        if (!response.ok) throw new Error('tts');
        return response.json();
      })
      .then(function (data) {
        if (!data || typeof data.audio !== 'string') throw new Error('tts');
        objectUrl = 'data:' + (data.mime || 'audio/mpeg') + ';base64,' + data.audio;
        audio.src = objectUrl;
        return audio.play();
      })
      .then(function () {
        return new Promise(function (resolve) {
          audio.addEventListener('ended', resolve, { once: true });
          audio.addEventListener('error', resolve, { once: true });
        });
      })
      .catch(function () {
        addSystemMessage(
          'No pude leer la respuesta en voz alta. Puedes escribir aquí o seguir por WhatsApp.'
        );
      })
      .then(function () {
        if (objectUrl && objectUrl.indexOf('data:') !== 0) URL.revokeObjectURL(objectUrl);
        elements.tts.disabled = !lastAssistantText;
        if (!voice || !voice.active) setState('idle');
      });
  }

  function startVoice() {
    if (voice) return;

    var AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia ||
      !AudioContextClass ||
      !window.AudioWorkletNode
    ) {
      showMicrophoneFallback();
      return;
    }

    var session = {
      active: true,
      phase: 'starting',
      stream: null,
      context: null,
      source: null,
      worklet: null,
      chunks: [],
      sampleRate: 24000,
      recordingTimer: null,
      requestController: null,
      requestTimer: null,
      playbackSource: null
    };

    voice = session;

    navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1
        }
      })
      .then(function (stream) {
        if (!session.active) {
          stopStream(stream);
          throw new Error('Sesión cancelada');
        }

        session.stream = stream;
        session.context = new AudioContextClass({ sampleRate: 24000 });
        session.sampleRate = session.context.sampleRate;

        return session.context.audioWorklet.addModule(
          '/assets/agent-cisa-mic-worklet.js'
        );
      })
      .then(function () {
        if (!session.active || !session.context) {
          throw new Error('Sesión cancelada');
        }

        session.source = session.context.createMediaStreamSource(
          session.stream
        );
        session.worklet = new AudioWorkletNode(
          session.context,
          'cisa-mic'
        );

        session.worklet.port.onmessage = function (event) {
          if (!session.active) return;

          var samples = event.data;
          if (!(samples instanceof Float32Array) || !samples.length) return;

          var pcm = resampleFloat32(samples, session.sampleRate, 24000);
          session.chunks.push(floatToPcm16(pcm));
        };

        session.source.connect(session.worklet);

        session.phase = 'recording';
        elements.mic.setAttribute('aria-pressed', 'true');
        setState('listening');

        session.recordingTimer = window.setTimeout(function () {
          if (session.active && session.phase === 'recording') {
            sendVoiceTurn();
          }
        }, 14500);
      })
      .catch(function () {
        if (!session.active) return;

        stopVoice();
        showMicrophoneFallback();
      });
  }

  function toggleVoice() {
    if (!voice) {
      startVoice();
      return;
    }

    if (voice.phase === 'recording') {
      sendVoiceTurn();
      return;
    }

    stopVoice();
  }

  function sendVoiceTurn() {
    if (!voice || voice.phase !== 'recording') return;

    var session = voice;
    session.phase = 'thinking';

    stopCapture(session);

    var pcm = concatPcm16(session.chunks);
    session.chunks = [];

    elements.mic.setAttribute('aria-pressed', 'false');

    if (pcm.byteLength < 4800) {
      finishVoice(session);
      return;
    }

    var controller =
      typeof AbortController !== 'undefined'
        ? new AbortController()
        : null;

    session.requestController = controller;
    session.requestTimer = window.setTimeout(function () {
      if (controller) controller.abort();
    }, 35000);

    var messages = history.slice(-10).map(function (item) {
      return {
        role: item.role,
        content: item.content
      };
    });

    var requestOptions = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'voz',
        audio: arrayBufferToBase64(pcm.buffer),
        messages: messages
      })
    };

    if (controller) requestOptions.signal = controller.signal;

    setState('thinking');

    fetch('/api/agente-cisa', requestOptions)
      .then(function (response) {
        if (!response.ok) throw new Error('Respuesta no válida');

        return response.json();
      })
      .then(function (data) {
        if (!session.active) return;

        if (
          !data ||
          typeof data.audio !== 'string' ||
          !data.audio ||
          data.format !== 'pcm16' ||
          data.sampleRate !== 24000
        ) {
          throw new Error('Respuesta no válida');
        }

        if (
          typeof data.userTranscript === 'string' &&
          data.userTranscript.trim()
        ) {
          addMessage('user', data.userTranscript.trim(), true);
        }

        if (
          typeof data.transcript === 'string' &&
          data.transcript.trim()
        ) {
          addMessage('assistant', data.transcript.trim(), true);
        }

        return playVoiceResponse(session, data.audio);
      })
      .catch(function () {
        if (!session.active) return;

        stopVoice();
        showMicrophoneFallback();
      });
  }

  function playVoiceResponse(session, base64Audio) {
    var bytes = base64ToArrayBuffer(base64Audio);
    var pcm = new Int16Array(bytes);

    if (!pcm.length) {
      throw new Error('Audio vacío');
    }

    var AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      throw new Error('AudioContext no disponible');
    }

    var context = session.context;

    if (
      !context ||
      context.state === 'closed' ||
      context.sampleRate !== 24000
    ) {
      context = new AudioContextClass({ sampleRate: 24000 });
      session.context = context;
    }

    var buffer = context.createBuffer(1, pcm.length, 24000);
    var channel = buffer.getChannelData(0);

    for (var i = 0; i < pcm.length; i += 1) {
      channel[i] = pcm[i] / 32768;
    }

    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);

    session.phase = 'speaking';
    session.playbackSource = source;
    setState('speaking');

    return new Promise(function (resolve, reject) {
      source.onended = function () {
        if (!session.active) {
          resolve();
          return;
        }

        session.playbackSource = null;
        finishVoice(session);
        resolve();
      };

      source.onerror = function () {
        reject(new Error('Error de reproducción'));
      };

      var startPlayback = function () {
        if (!session.active) return;

        try {
          source.start();
        } catch (error) {
          reject(error);
        }
      };

      if (context.state === 'suspended') {
        context.resume().then(startPlayback).catch(reject);
      } else {
        startPlayback();
      }
    });
  }

  function stopVoice() {
    var session = voice;

    voice = null;

    if (session) {
      session.active = false;

      window.clearTimeout(session.recordingTimer);
      window.clearTimeout(session.requestTimer);

      if (session.requestController) {
        session.requestController.abort();
      }

      stopCapture(session);
      stopPlayback(session);
      closeAudioContext(session.context);
    }

    elements.mic.setAttribute('aria-pressed', 'false');
    setState('idle');
  }

  function stopCapture(session) {
    window.clearTimeout(session.recordingTimer);
    session.recordingTimer = null;

    if (session.worklet) {
      session.worklet.port.onmessage = null;

      try {
        session.worklet.disconnect();
      } catch (error) {
        // El nodo puede estar desconectado.
      }

      session.worklet = null;
    }

    if (session.source) {
      try {
        session.source.disconnect();
      } catch (error) {
        // La fuente puede estar desconectada.
      }

      session.source = null;
    }

    if (session.stream) {
      stopStream(session.stream);
      session.stream = null;
    }
  }

  function stopPlayback(session) {
    if (!session.playbackSource) return;

    var source = session.playbackSource;
    session.playbackSource = null;

    try {
      source.onended = null;
      source.stop();
    } catch (error) {
      // La fuente puede estar finalizada.
    }

    try {
      source.disconnect();
    } catch (error) {
      // La fuente puede estar desconectada.
    }
  }

  function finishVoice(session) {
    if (!session || !session.active) return;

    window.clearTimeout(session.recordingTimer);
    window.clearTimeout(session.requestTimer);

    session.requestController = null;
    session.playbackSource = null;
    session.chunks = [];

    closeAudioContext(session.context);
    session.context = null;

    if (voice === session) voice = null;

    elements.mic.setAttribute('aria-pressed', 'false');
    setState('idle');
  }

  function stopStream(stream) {
    if (!stream || !stream.getTracks) return;

    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }

  function closeAudioContext(context) {
    if (!context || context.state === 'closed') return;

    try {
      context.close().catch(function () {
        // El contexto puede cerrarse durante la cancelación.
      });
    } catch (error) {
      // El contexto puede estar cerrado.
    }
  }

  function concatPcm16(chunks) {
    var totalLength = 0;
    var i;

    for (i = 0; i < chunks.length; i += 1) {
      totalLength += chunks[i].length;
    }

    var merged = new Int16Array(totalLength);
    var offset = 0;

    for (i = 0; i < chunks.length; i += 1) {
      merged.set(chunks[i], offset);
      offset += chunks[i].length;
    }

    return merged;
  }

  function resampleFloat32(samples, sourceRate, targetRate) {
    if (!sourceRate || sourceRate === targetRate) return samples;

    var targetLength = Math.max(
      1,
      Math.round((samples.length * targetRate) / sourceRate)
    );
    var result = new Float32Array(targetLength);
    var ratio = (samples.length - 1) / (targetLength - 1 || 1);

    for (var i = 0; i < targetLength; i += 1) {
      var position = i * ratio;
      var lower = Math.floor(position);
      var upper = Math.min(lower + 1, samples.length - 1);
      var weight = position - lower;

      result[i] =
        samples[lower] * (1 - weight) + samples[upper] * weight;
    }

    return result;
  }
  function showMicrophoneFallback() {
    addSystemMessage(
      'El micrófono no está disponible. Puedes escribir aquí o seguir por WhatsApp.'
    );
  }

  function floatToPcm16(input) {
    var output = new Int16Array(input.length);
    for (var i = 0; i < input.length; i += 1) {
      var sample = Math.max(-1, Math.min(1, input[i]));
      output[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    }
    return output;
  }

  function arrayBufferToBase64(buffer) {
    var bytes = new Uint8Array(buffer);
    var binary = '';
    for (var i = 0; i < bytes.byteLength; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  function base64ToArrayBuffer(base64) {
    var binary = window.atob(base64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
})();
