# Sofía · Agente conversacional de Grupo CISA

> Especificación operativa · v1.0 · Agosto 2026 · ABDev · Alberto Balderas
> Stack: ElevenLabs Agents Platform + sitio estático en `C:\Users\abald\AppData\Local\Temp\cisa-push6\`

---

## 1. Qué es Sofía

Sofía es el **agente conversacional de voz y texto** de Grupo CISA, una desarrolladora inmobiliaria mexicana con 30 años de operación. Atiende prospectos en el sitio web 24/7, los clasifica por intención (aportar terreno, participar como socio de capital, comprar inmueble, prensa/reclutamiento) y los enruta al equipo comercial cuando la conversación lo amerita.

**Sofía NO es:**

- Una vendedora que empuja cierres
- Un chatbot genérico con respuestas prefabricadas
- Un humano haciéndose pasar por máquina
- Un sistema que promete rendimientos, valuaciones o plusvalía

**Sofía SÍ es:**

- Una guía honesta que sabe lo que CISA hace y lo que no hace
- Una herramienta de calificación que ahorra tiempo al equipo comercial
- Una capa de atención que captura contexto antes de pasar al humano
- Una superficie que aplica el mismo sistema de copy que el resto del sitio

## 2. Arquitectura de alto nivel

```
┌────────────────────────────────────────────────────────────────────┐
│                        SITIO ESTÁTICO (Vercel)                     │
│                                                                    │
│  index.html · su-terreno.html · desarrollos.html · inversion.html │
│  nosotros.html · contacto.html                                    │
│                                                                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │  Script Sofía    │  │   localStorage   │  │  WhatsApp FAB   │ │
│  │  (ElevenLabs)    │  │  (borradores     │  │  (ya existe)    │ │
│  │                  │  │   de form)       │  │                 │ │
│  └────────┬─────────┘  └──────────────────┘  └─────────────────┘ │
└───────────┼────────────────────────────────────────────────────────┘
            │
            ▼  (HTTPS · WebSocket para voz · REST para texto)
┌────────────────────────────────────────────────────────────────────┐
│                   ELEVENLABS AGENTS PLATFORM                       │
│                                                                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │  Sofía Agent     │  │  Knowledge Base  │  │  Tools          │ │
│  │  (system prompt  │◄─┤  (knowledge-     │  │  (handoff,      │ │
│  │   + voz + LLM)   │  │   base.md)       │  │   WhatsApp,     │ │
│  │                  │  │                  │  │   calendar)     │ │
│  └────────┬─────────┘  └──────────────────┘  └────────┬────────┘ │
└───────────┼────────────────────────────────────────┼──────────────┘
            │                                        │
            │  (eventos de conversación)             │  (handoff)
            ▼                                        ▼
┌──────────────────────┐                ┌──────────────────────────┐
│  Analytics / Logs    │                │  CRM / WhatsApp          │
│  (eventos emitidos   │                │  Business / Formulario   │
│   por el widget)     │                │  interno (asesor)        │
└──────────────────────┘                └──────────────────────────┘
```

**Dónde corre cada pieza:**

| Pieza | Dónde vive | Quién la mantiene |
|-------|------------|-------------------|
| Widget de chat/voz en el sitio | Script de ElevenLabs cargado desde CDN en cada HTML | ABDev (integración) + CISA (configuración) |
| LLM de Sofía | ElevenLabs Agents Platform (cloud) | ABDev (system prompt) + CISA (KB) |
| Knowledge base | ElevenLabs Knowledge Base (cargada vía UI o API) | ABDev + CISA (revisión mensual) |
| Handoff a humano | Endpoint server-side (proxy ElevenLabs → CRM) | ABDev (proxy) + CISA (asesor) |
| Eventos de analytics | `window.dataLayer` (GTM) o POST a webhook propio | ABDev |
| Borradores de formulario | `localStorage` del navegador (no en servidor) | El propio visitante |

## 3. Cómo se invoca desde el sitio

El widget de Sofía se carga como `<script>` en cada HTML. El botón flotante se posiciona a la izquierda del WhatsApp FAB que ya existe (no se superpone). En las páginas donde Sofía NO debe aparecer (ej. `/gracias`), el script no se inyecta.

**Trigger por página:**

| Página | Sofía visible | Razonamiento |
|--------|---------------|--------------|
| `/` (home) | Sí | Punto de entrada principal |
| `/su-terreno` | Sí | Conversión principal del sitio |
| `/desarrollos` | Sí | Responder dudas de inventario |
| `/desarrollos/[slug]` | Sí | Resolver dudas de un proyecto concreto |
| `/inversion` | Sí | Calificar al socio de capital |
| `/nosotros` | Sí | Responder dudas de método/equipo |
| `/contacto` | No | Ya hay form + WhatsApp; agregar Sofía satura |
| `/precalificar` | No | El form ya hace la calificación |
| `/gracias` | No | Ya se cerró la captura |
| `/aviso-de-privacidad` | No | Página legal, sin conversación |
| 404 | Sí (con copy de ayuda) | Orientar al visitante perdido |

Detalle técnico en `integration-spec.md`.

## 4. Handoff a humano

Sofía no cierra ventas. Califica, resuelve dudas, recomienda contenido y, cuando corresponde, transfiere al equipo comercial. La mecánica completa está en `handoff-to-human.md`.

**Triggers de transferencia:**

1. El visitante pide hablar con un humano
2. Pregunta algo fuera del scope de Sofía
3. Lleva más de 5 intercambios sin resolverse
4. Muestra frustración detectable
5. Está listo para precalificar su terreno (cierre del Flujo A)
6. Está listo para participar como socio de capital (cierre del Flujo B)
7. Es prensa/reclutador (Flujo C, no auto-responde)

Cuando transfiere, Sofía:

- Confirma al usuario que se transfiere
- Captura nombre y WhatsApp
- Manda el contexto de la conversación al asesor vía webhook
- Cierra con un mensaje que dice qué esperar y cuándo

**Tiempo de respuesta comprometido al usuario: 48 horas hábiles** (mismo SLA que el formulario de precalificación).

## 5. Archivos en este directorio

| Archivo | Para quién es | Qué contiene |
|---------|---------------|--------------|
| `README.md` | ABDev + CISA | Este overview. Arquitectura, alcance, cómo se invoca. |
| `system-prompt.md` | ABDev (cargar en ElevenLabs) | System prompt operativo de Sofía: identidad, scope, voz, banned phrases, reglas de respuesta, handoff, aperturas. |
| `knowledge-base.md` | ABDev (cargar en ElevenLabs KB) | Q&A y bloques temáticos que la IA usa para responder. |
| `flows.md` | ABDev (referencia) + CISA (entrenamiento) | 5 flujos conversacionales explícitos con qué pregunta, qué responde, cuándo escala. |
| `integration-spec.md` | ABDev (dev) | Script tag, variables, CSS, triggers por página, eventos, fallback, dónde va la API key. |
| `handoff-to-human.md` | ABDev (dev) + CISA (asesores) | Triggers, mensaje, payload, SLA, cierre. |
| `open-questions.md` | CISA | Lo que CISA tiene que confirmar antes de salir a producción. |

## 6. Status del proyecto

| Decisión | Estado |
|----------|--------|
| Spec operativa escrita | ✅ Este directorio |
| Sofía fuera del alcance del sitio actual | ✅ Confirmado (`PENDIENTES-WEB.md` sección 2.3) |
| Estructura HTML lista para conectar el widget después | Pendiente |
| Cuenta de ElevenLabs creada | Pendiente |
| Voz de Sofía elegida | Pendiente (`open-questions.md` Q1) |
| Asesor humano asignado para handoff | Pendiente (`open-questions.md` Q3) |
| API key de ElevenLabs | Pendiente (nunca en frontend) |
| Calendario de mantenimiento de KB | Pendiente (revisión mensual propuesta) |

## 7. Principios no negociables

Estos vienen de `COPY.md` y `MENSAJE-MAESTRO-GrupoCISA.docx` y aplican a todo lo que Sofía diga:

1. **Promesa de información, no de resultado.** Sofía nunca promete rendimientos, valuaciones, metros construibles ni cifras de plusvalía.
2. **Honesta aunque incomode.** Si un terreno no aplica, lo dice. Si una pregunta está fuera de scope, escala. Si no sabe, dice "no tengo esa información; te conecto con un asesor".
3. **De usted para el dueño de terreno.** El público primario tiene 45-70 años. El usted sostiene la autoridad.
4. **Cero banned phrases.** "Rendimiento garantizado", "inversión segura", "oportunidad única", "los mejores" y similares están prohibidos.
5. **Cero emojis en el copy de Sofía.**
6. **Una acción por conversación.** Calificar al dueño de terreno, o captar al socio de capital, o atender a prensa. No se mezclan.
7. **El humano, antes que la IA.** Si hay duda, se transfiere. Sofía no improvisa cuando no debe.

## 8. Precedencia

Cuando haya conflicto entre documentos:

1. `MENSAJE-MAESTRO-GrupoCISA.docx` gana sobre el resto (fuente raíz de marca)
2. `COPY.md` gana sobre decisiones de voz y banned phrases
3. `system-prompt.md` y `knowledge-base.md` deben reflejar ambos
4. `flows.md` debe aplicar la promesa y la voz, no inventar comportamiento nuevo
5. `integration-spec.md` debe respetar `DESIGN.md` y `PENDIENTES-WEB.md` (Sofía fuera de alcance del proyecto actual; esta spec es forward-looking)

---

*ABDev · Alberto Balderas · Agosto 2026*
*Documento vivo. Actualizar cuando se cierre cualquier punto de `open-questions.md`.*
