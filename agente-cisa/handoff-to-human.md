# Handoff a humano · Sofía · v1.0

> Protocolo de transferencia de la conversación de Sofía a un asesor humano de CISA.
> Define: cuándo se transfiere, qué se le dice al usuario, qué payload se manda al backend, y cómo se cierra.

---

## 1. Triggers de transferencia

Sofía transfiere al equipo comercial cuando se cumple **cualquiera** de estas condiciones:

| # | Trigger | Cómo lo detecta Sofía | Flujo asociado |
|---|---------|------------------------|----------------|
| 1 | El visitante pide hablar con un humano explícitamente | Frase directa: "quiero hablar con alguien", "pásame con un asesor", "necesito una llamada" | E (frustración) o D (general) |
| 2 | El visitante pregunta algo fuera del scope de Sofía | Cualquier pregunta listada en `knowledge-base.md` Sección 10 | El flujo que esté activo (A, B o D) |
| 3 | Lleva más de 5 intercambios sin resolverse | Sofía lleva el contador; cualquier flujo | El flujo que esté activo |
| 4 | El visitante muestra frustración detectable | Frases listadas en `flows.md` Flujo E paso E1 | E |
| 5 | El flujo A (dueño de terreno) llega a la captura final | Sofía ya confirmó los 7 datos del precalificador | A |
| 6 | El flujo B (socio de capital) llega a la captura final | Sofía ya confirmó perfil + capital + experiencia + timing | B |
| 7 | El flujo C (prensa / reclutador) se activa | Visitante declara perfil o pregunta por el equipo | C |
| 8 | Pregunta por un proyecto, aliado o persona no confirmado en la KB | Sofía valida contra `knowledge-base.md` y no encuentra | El flujo que esté activo |
| 9 | El visitante pide algo que requiere abogado o contador | Preguntas legales o fiscales específicas | El flujo que esté activo |

## 2. Mensaje que se muestra al usuario

Cuando Sofía activa el handoff, sigue esta secuencia textual.

### Paso 1 · Empatía breve (1 línea)

> "Entiendo, esto necesita una conversación con un asesor del equipo."

Variantes aceptables:

- "Con gusto, le conecto con un asesor."
- "Para esto es mejor hablar directamente con el equipo."
- "Esa respuesta la tiene el equipo comercial; se la paso."

**Regla:** UNA línea. No pedir perdón múltiples veces. No justificarse. No prometer que la respuesta será inmediata.

### Paso 2 · Solicitud de datos (1 línea + pregunta)

> "¿Me permite su nombre y un WhatsApp para que un asesor le contacte en las próximas horas?"

Variantes aceptables:

- "¿Me deja su nombre completo y un número de WhatsApp?"
- "¿Con qué nombre y teléfono le localizamos?"

**Regla:** solo nombre y WhatsApp. NO pedir correo en este punto (si lo da, bien; si no, no insistir). NO pedir más datos de calificación (esos los captura el asesor en la llamada).

### Paso 3 · Confirmación del SLA (1 línea)

Una vez capturados nombre y WhatsApp:

> "Recibido. Un asesor le escribe en menos de 48 horas hábiles. ¿Le parece bien?"

Variantes:

- "Le contactan en menos de 48 horas hábiles."
- "Le responden por WhatsApp en menos de 48 horas hábiles."

**Regla:** decir "48 horas hábiles" exactamente, igual que el formulario. No decir "en breve", "lo más pronto posible", "mañana". Cumplirlo.

### Paso 4 · Cierre de despedida (cuando la transferencia se completó)

Después de que el backend confirma que el payload se envió:

> "Listo. Un asesor del equipo le contacta. Mientras tanto, si quiere leer sobre [tema detectado en la conversación], le recomiendo [artículo del blog si aplica]. Que tenga buen día."

Variantes para los flujos específicos:

- **Flujo A (terreno):** "Mientras tanto, si quiere leer más sobre cómo funciona la aportación, está el artículo [artículo 07 del blog] en /contenido/que-es-aportacion-de-terreno."
- **Flujo B (capital):** "Mientras tanto, el detalle del modelo está en /inversion."
- **Flujo C (prensa):** "El equipo le contacta por correo en menos de 48 horas hábiles."
- **Flujo D (general):** Sin recomendación específica, solo despedida.

**Regla:** una sola recomendación, opcional, solo si aplica. No recargar.

## 3. Payload que se manda al backend

Cuando Sofía transfiere, manda un POST al endpoint configurado con este payload:

```json
{
  "conversation_id": "conv_8x7y2n",
  "timestamp": "2026-08-15T14:32:18Z",
  "page_path": "/su-terreno",
  "page_title": "Su terreno · Grupo CISA",
  "user": {
    "name": "Juan Pérez García",
    "whatsapp": "+52 55 1234 5678",
    "email": null
  },
  "flow": "terreno",                              // terreno | capital | prensa | general | frustration
  "trigger": "flow_completed",                     // user_request | out_of_scope | limit_reached | frustration | flow_completed | unconfirmed
  "qualification_data": {
    "zona": "Atizapán de Zaragoza",
    "superficie_rango": "500-1000 m²",
    "uso_suelo": "No lo sé",
    "situacion_juridica": "Escriturado",
    "quien_decide": "Familia",
    "intencion": "Aportar y recibir metros"
  },
  "conversation_summary": "El visitante tiene un terreno en Atizapán, mide entre 500 y 1,000 m², no conoce el uso de suelo, está escriturado y la decisión la toma con la familia. Su intención es aportarlo a un desarrollo. Preguntó por el tiempo del proceso y por el riesgo comercial. Se le explicó el modelo de aportación y los criterios de reparto sin cifras. Se sintió cómodo y pidió continuar con un asesor.",
  "articles_recommended": [
    "/contenido/que-es-aportacion-de-terreno"
  ],
  "agent_assigned": "asesor-default",              // por definir en open-questions.md
  "metadata": {
    "user_agent": "Mozilla/5.0...",
    "language": "es-MX",
    "session_duration_seconds": 412,
    "message_count": 14
  }
}
```

**Notas sobre el payload:**

- `conversation_id` lo genera ElevenLabs al iniciar la conversación; se mantiene a lo largo de la sesión.
- `flow` y `trigger` los determina el sistema de flows (ver `flows.md`).
- `qualification_data` se construye a partir de lo capturado en el flujo A o B. En flujos C, D y E viene vacío o con datos mínimos.
- `conversation_summary` lo genera el LLM al cierre de la conversación. NO es copia literal del chat; es un resumen ejecutivo para que el asesor entre a la llamada con contexto.
- `articles_recommended` lista los slugs de los artículos que Sofía recomendó durante la conversación.
- `agent_assigned` por ahora es `asesor-default`. Cuando se definan múltiples asesores, se enruta según el flow (terreno → asesor A, capital → asesor B, prensa → buzón general).
- `metadata` se popula del lado del cliente o del servidor; útil para auditoría.

## 4. Endpoint backend

El endpoint que recibe el payload puede ser:

| Opción | URL ejemplo | Quién lo mantiene |
|--------|-------------|-------------------|
| **Vercel Function dedicada** | `https://cisa.vercel.app/api/sofia/handoff` | ABDev |
| **Webhook de WhatsApp Business** | URL provista por Meta al configurar la cuenta | ABDev + CISA (cuenta de WhatsApp Business) |
| **Webhook de CRM** (HubSpot, Pipedrive, etc.) | URL provista por el CRM | ABDev + CISA |
| **Formulario interno** (endpoint que recibe y manda correo) | `https://cisa.vercel.app/api/contacto-interno` | ABDev |

**Recomendación inicial:** Vercel Function. Cuando CISA decida qué CRM usar, se cambia el destino sin tocar la lógica de Sofía.

**Esqueleto del endpoint** (`/api/sofia/handoff.js`):

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body;

  // 1. Validar payload mínimo
  if (!payload.user || !payload.user.whatsapp) {
    return res.status(400).json({ error: 'Missing user.whatsapp' });
  }

  // 2. Mandar al CRM / WhatsApp Business / correo interno
  // (la implementación varía según la elección de CISA)
  await sendToCrm(payload);
  await sendConfirmationEmail(payload);
  await notifySlack(payload); // opcional, notificar al equipo en canal dedicado

  // 3. Responder 200
  res.status(200).json({ ok: true, ticket_id: generateTicketId() });
}
```

## 5. Tiempo de respuesta comprometido

**Sofía promete al usuario: 48 horas hábiles** para que un asesor le contacte.

**Definición de "48 horas hábiles":**

- Lunes a viernes, 9:00 a 18:00 hora CDMX.
- Excluye fines de semana y días festivos federales de México.
- Si la transferencia ocurre a las 17:00 del viernes, el plazo corre desde las 9:00 del lunes.
- Si la transferencia ocurre a las 10:00 del martes, el plazo vence a las 10:00 del jueves.

**Por qué 48 horas y no menos:**

- Es el mismo SLA que el formulario de precalificación (`/precalificar`) y el formulario de contacto (`/contacto`).
- Da espacio al equipo para revisar la conversación y preparar la llamada con contexto, no improvisar.
- Es una promesa cumplible; decir "le contactamos en 24 horas" y fallar daña más la marca que decir 48 y cumplir.

**Quién mide el cumplimiento:**

- ABDev propone un cron que se ejecute cada hora y alerte a un canal de Slack / correo si hay transferencias con más de 36 horas hábiles sin respuesta del asesor.
- CISA nombra un responsable del SLA (recomendado: la persona que reciba las transferencias).

## 6. Mensaje de cierre al usuario (cuando ya se transfirió)

Una vez que el backend confirma que el payload se envió (HTTP 200), Sofía muestra el mensaje final.

### Mensaje estándar (cualquier flujo)

> "Listo, [nombre del visitante]. Un asesor del equipo le contacta por WhatsApp en menos de 48 horas hábiles. Mientras tanto, [recomendación opcional]. Que tenga buen día."

### Variantes por flujo

**Flujo A (terreno):**

> "Listo, [nombre]. Un asesor le escribe por WhatsApp en menos de 48 horas hábiles con un primer escenario para su terreno. Mientras tanto, si quiere leer más sobre cómo funciona la aportación, está en /contenido/que-es-aportacion-de-terreno. Que tenga buen día."

**Flujo B (capital):**

> "Listo, [nombre]. Un asesor le contacta por WhatsApp en menos de 48 horas hábiles con el detalle de los proyectos abiertos. El modelo general está en /inversion por si quiere revisarlo. Que tenga buen día."

**Flujo C (prensa):**

> "Listo, [nombre]. El equipo le contacta por correo en menos de 48 horas hábiles. Si tiene una fecha límite para la publicación, puede indicarla en su próximo mensaje. Que tenga buen día."

**Flujo E (frustración):**

> "Listo, [nombre]. Un asesor le contacta por WhatsApp en menos de 48 horas hábiles. Gracias por su paciencia."

### Reglas del cierre

- Una sola despedida. No agregar "si necesita algo más, aquí estoy" (genera expectativa de respuesta inmediata).
- Incluir el nombre del visitante SOLO si lo dio. Si no, no inventar.
- La recomendación opcional (artículo del blog) aparece solo si el visitante mostró interés en un tema educativo. No recargar.
- El mensaje cierra la sesión. Sofía no espera más input; el chat queda abierto pero inactivo.

## 7. Lo que NO debe pasar en el handoff

1. **Sofía NO cierra la venta.** Ni intenta convencer al visitante de avanzar.
2. **Sofía NO promete un horario específico** ("mañana a las 10"). El SLA es 48 horas hábiles, sin hora.
3. **Sofía NO comparte datos de otros visitantes** ni hace comparaciones.
4. **Sofía NO pide datos sensibles** (CURP, RFC, datos bancarios, número de escritura, contraseñas).
5. **Sofía NO transfiere al número equivocado.** Si el visitante es prensa, va al buzón general. Si es frustración, va a un asesor de atención. Si es calificación, va al equipo comercial.
6. **El payload NO contiene datos inventados.** Si un campo no se capturó, queda `null` o se omite.
7. **El sistema NO debe fallar silenciosamente.** Si el endpoint devuelve error, Sofía muestra un mensaje de "Hubo un problema al contactarle; le respondemos por correo en contacto@grupocisa.mx en menos de 48 horas hábiles" y registra el error en logs.

## 8. Plantilla del correo interno (cuando no hay CRM)

Si CISA no tiene CRM configurado al momento del lanzamiento, el backend manda un correo a una casilla interna con esta plantilla:

```
Asunto: [CISA · Sofía] Nuevo lead · {flow} · {timestamp}

Hola, equipo CISA:

Sofía transfirió una conversación. Resumen:

- Visitante: {user.name}
- WhatsApp: {user.whatsapp}
- Correo: {user.email}
- Página de origen: {page_path}
- Flujo: {flow}
- Trigger: {trigger}

Datos de calificación:
{qualification_data, formateado en bullets}

Resumen de la conversación:
{conversation_summary}

Artículos recomendados al visitante:
{articles_recommended, en lista}

Conversación completa (ID: {conversation_id}):
[link al dashboard de ElevenLabs]

SLA: contactar en menos de 48 horas hábiles.

—
Sofía · Grupo CISA · sistema automatizado
```

Destinatario propuesto: `atencion@grupocisa.mx` o el correo del equipo comercial. [CONFIRMAR CON CISA]

## 9. Métricas del handoff

Para mejorar el sistema, ABDev propone medir:

| Métrica | Cómo se calcula | Meta |
|---------|-----------------|------|
| Tasa de handoff por flujo | Transferencias del flujo / conversaciones iniciadas del flujo | — (baseline) |
| Tiempo de respuesta del asesor | Timestamp de respuesta del asesor − timestamp del handoff | 100% < 48 horas hábiles |
| Tasa de "no aplica" después del handoff | Leads marcados como "no aplica" por el asesor / total de leads | — (baseline, esperar 2 meses) |
| Tasa de "sí aplica" → cita agendada | Citas agendadas / leads marcados como "sí aplica" | — (baseline) |
| Handoff fallido | Errores del endpoint / total de handoffs | 0% ideal, < 1% aceptable |

Las métricas se miden desde el backend; el dashboard de GTM puede mostrar las principales. Revisión mensual sugerida.

---

*ABDev · Alberto Balderas · Agosto 2026*
*Auditable contra `system-prompt.md` (sección handoff), `flows.md` (secuencias) y `integration-spec.md` (eventos).*
