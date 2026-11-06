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

    mic.addEventListener('click', function () {
      if (voice) {
        stopVoice();
      } else {
        startVoice();
      }
    });

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

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia ||
      !window.AudioContext ||
      !window.AudioWorkletNode
    ) {
      showMicrophoneFallback();
      return;
    }

    var session = {
      active: true,
      socket: null,
      stream: null,
      context: null,
      source: null,
      worklet: null,
      sourceNodes: [],
      pendingSource: null,
      playbackStartedAt: 0,
      playbackEndsAt: 0,
      playhead: 0,
      echoTimer: null,
      voiceTimer: null,
      sessionTimer: null,
      createdTimer: null,
      transcript: '',
      userTranscript: '',
      sentTranscript: false,
      sentAssistant: false,
      chunkTimer: null,
      micChunks: [],
      serverSession: null,
      sessionCreated: false
    };
    voice = session;

    elements.mic.setAttribute('aria-pressed', 'true');
    setState('listening');

    var timeout = window.setTimeout(function () {
      if (!session.active) return;
      stopVoice();
      showMicrophoneFallback();
    }, 30000);

    fetch('/api/agente-cisa', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'voz' })
    })
      .then(function (response) {
        if (!response.ok) throw new Error('voz');
        return response.json();
      })
      .then(function (data) {
        window.clearTimeout(timeout);
        if (!data || !data.url || !data.token || !data.session) {
          throw new Error('voz');
        }

        session.serverSession = data.session;

        session.sessionTimer = window.setTimeout(function () {
          stopVoice();
        }, 5 * 60 * 1000);

        return setupMicrophone(session, data);
      })
      .catch(function () {
        window.clearTimeout(timeout);
        stopVoice();
        showMicrophoneFallback();
      });
  }

  function setupMicrophone(session, data) {
    return navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      })
      .then(function (stream) {
        if (!session.active) {
          stream.getTracks().forEach(function (track) {
            track.stop();
          });
          throw new Error('sesión cancelada');
        }

        session.stream = stream;
        session.context = new AudioContext({ sampleRate: 24000 });

        return session.context.audioWorklet
          .addModule('/assets/agent-cisa-mic-worklet.js')
          .then(function () {
            if (!session.active) throw new Error('sesión cancelada');

            session.socket = new WebSocket(data.url, [
              'xai-client-secret.' + data.token
            ]);
            session.socket.binaryType = 'arraybuffer';

            session.socket.addEventListener('open', function () {
              session.createdTimer = window.setTimeout(function () {
                if (!session.sessionCreated) {
                  stopVoice();
                  showMicrophoneFallback();
                }
              }, 6000);
            });

            session.socket.addEventListener('message', function (event) {
              handleVoiceEvent(session, event);
            });

            session.socket.addEventListener('error', function () {
              if (session.active) {
                stopVoice();
                showMicrophoneFallback();
              }
            });

            session.socket.addEventListener('close', function () {
              if (session.active && !session.closing) {
                stopVoice();
                showMicrophoneFallback();
              }
            });

            session.source = session.context.createMediaStreamSource(stream);
            session.worklet = new AudioWorkletNode(session.context, 'cisa-mic');
            session.worklet.port.onmessage = function (event) {
              handleAudioChunk(session, event.data);
            };
            session.source.connect(session.worklet);

            session.chunkTimer = window.setInterval(function () {
              flushAudio(session);
            }, 100);
          });
      })
      .catch(function () {
        if (session.active) {
          stopVoice();
          showMicrophoneFallback();
        }
      });
  }

  function handleVoiceEvent(session, event) {
    if (!session.active || typeof event.data !== 'string') return;

    var data;
    try {
      data = JSON.parse(event.data);
    } catch (error) {
      return;
    }

    if (data.type === 'session.created') {
      session.sessionCreated = true;
      window.clearTimeout(session.createdTimer);

      if (session.socket && session.socket.readyState === WebSocket.OPEN) {
        session.socket.send(
          JSON.stringify({
            type: 'session.update',
            session: session.serverSession || {}
          })
        );
        setState('listening');
      }
      return;
    }

    if (data.type === 'session.updated') {
      setState('listening');
      return;
    }

    if (data.type === 'response.output_audio.delta') {
      if (typeof data.delta === 'string') {
        flushPlayback(session, data.delta);
      }
      return;
    }

    if (data.type === 'response.output_audio_transcript.delta') {
      if (typeof data.delta === 'string') session.transcript += data.delta;
      return;
    }

    if (
      data.type === 'response.output_audio_transcript.done' ||
      data.type === 'response.done'
    ) {
      if (session.transcript && !session.sentAssistant) {
        addMessage('assistant', session.transcript, true);
        session.sentAssistant = true;
      }

      if (data.type === 'response.done') {
        session.transcript = '';
        session.sentAssistant = false;
      }
      return;
    }

    if (data.type === 'conversation.item.input_audio_transcription.completed') {
      if (typeof data.transcript === 'string' && data.transcript.trim()) {
        addMessage('user', data.transcript.trim(), true);
      }
      return;
    }

    if (data.type === 'input_audio_buffer.speech_started') {
      stopPlayback(session);
      return;
    }

    if (data.type === 'error') {
      stopVoice();
      showMicrophoneFallback();
    }
  }

  function handleAudioChunk(session, samples) {
    if (!session.active || !samples || !samples.length) return;

    if (!session.sessionCreated) return;

    if (Date.now() < session.playbackEndsAt + 300) return;

    var pcm = floatToPcm16(samples);
    session.micChunks.push(new Int16Array(pcm.buffer.slice(0)));
  }

  function flushAudio(session) {
    if (!session.active || !session.sessionCreated) return;

    if (!session.micChunks.length) return;

    if (Date.now() < session.playbackEndsAt + 300) {
      session.micChunks = [];
      return;
    }

    if (!session.socket || session.socket.readyState !== WebSocket.OPEN) {
      session.micChunks = [];
      return;
    }

    var totalLength = 0;
    var i;

    for (i = 0; i < session.micChunks.length; i += 1) {
      totalLength += session.micChunks[i].length;
    }

    var merged = new Int16Array(totalLength);
    var offset = 0;

    for (i = 0; i < session.micChunks.length; i += 1) {
      merged.set(session.micChunks[i], offset);
      offset += session.micChunks[i].length;
    }

    session.micChunks = [];

    var base64 = arrayBufferToBase64(merged.buffer);

    session.socket.send(
      JSON.stringify({
        type: 'input_audio_buffer.append',
        audio: base64
      })
    );
  }

  function flushPlayback(session, base64) {
    if (!session.active || !session.context || !base64) return;

    var bytes = base64ToArrayBuffer(base64);
    var samples = new Int16Array(bytes);
    if (!samples.length) return;

    var buffer = session.context.createBuffer(1, samples.length, 24000);
    var channel = buffer.getChannelData(0);

    for (var i = 0; i < samples.length; i += 1) {
      channel[i] = samples[i] / 32768;
    }

    var source = session.context.createBufferSource();
    source.buffer = buffer;
    source.connect(session.context.destination);
    session.sourceNodes.push(source);

    var currentTime = session.context.currentTime;
    var startAt = Math.max(currentTime, session.playhead);

    session.playhead = startAt + buffer.duration;
    session.playbackEndsAt =
      Date.now() + (session.playhead - currentTime) * 1000;

    source.start(startAt);
    session.pendingSource = source;
    session.playbackStartedAt = Date.now();
    setState('speaking');

    source.onended = function () {
      var index = session.sourceNodes.indexOf(source);
      if (index !== -1) session.sourceNodes.splice(index, 1);

      if (
        session.active &&
        !session.sourceNodes.length &&
        session.context &&
        session.playhead <= session.context.currentTime + 0.01
      ) {
        setState('listening');
      }
    };
  }

  function stopPlayback(session) {
    session.sourceNodes.forEach(function (source) {
      try {
        source.stop();
      } catch (error) {
        // Fuente ya finalizada.
      }
    });

    session.sourceNodes = [];
    session.pendingSource = null;
    session.playbackStartedAt = 0;
    session.playbackEndsAt = 0;
    session.playhead = 0;

    if (session.context) {
      session.playhead = session.context.currentTime;
    }
  }

  function stopVoice() {
    if (!voice) return;

    var session = voice;
    voice = null;
    session.active = false;
    session.closing = true;

    window.clearTimeout(session.createdTimer);
    window.clearTimeout(session.sessionTimer);
    window.clearInterval(session.chunkTimer);

    stopPlayback(session);
    session.micChunks = [];

    if (session.worklet) {
      session.worklet.port.onmessage = null;
      try {
        session.worklet.disconnect();
      } catch (error) {
        // El nodo puede estar desconectado.
      }
    }

    if (session.source) {
      try {
        session.source.disconnect();
      } catch (error) {
        // La fuente puede estar desconectada.
      }
    }

    if (session.stream) {
      session.stream.getTracks().forEach(function (track) {
        track.stop();
      });
    }

    if (session.socket) {
      try {
        session.socket.close();
      } catch (error) {
        // El socket puede estar cerrado.
      }
    }

    if (session.context && session.context.state !== 'closed') {
      session.context.close().catch(function () {
        // Cierre de contexto.
      });
    }

    elements.mic.setAttribute('aria-pressed', 'false');
    setState('idle');
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
