# Open questions · Sofía · v1.0

> Lista de cosas que CISA tiene que confirmar antes de que Sofía salga a producción.
> Cada pregunta incluye: por qué importa, qué opciones hay, recomendación de ABDev.
> No todas bloquean el deploy; las críticas se marcan con `[BLOQUEANTE]`.

---

## Q1. ¿Voz de Sofía: masculina o femenina? [BLOQUEANTE]

**Por qué importa:** ElevenLabs permite elegir entre voces de catálogo o clonar una voz. La elección define el tono audible de las conversaciones por voz (no afecta el chat de texto).

**Opciones:**

- **Voz femenina de catálogo** (ej. "Aria", "Sarah", "River") — más frecuente en asistentes virtuales, especialmente en real estate.
- **Voz masculina de catálogo** (ej. "Adam", "Josh", "Arnold") — menos frecuente pero coherente con un equipo comercial masculino.
- **Voz clonada de una persona real de CISA** — más personal, pero requiere que la persona done ~30 minutos de grabación limpia y firme una autorización.
- **Voz genérica sin nombre** — se puede configurar una voz neutra que no personalice.

**Recomendación ABDev:** voz femenina de catálogo, cálida pero institucional (no aniñada). Coherente con el nombre "Sofía" y con el tono de los 4 ejes de voz (sólido sin ser solemne).

**Quién decide:** CISA (dirección / área de marketing).

**Impacto si no se decide:** no se puede configurar el agente en ElevenLabs; el resto de la spec queda lista pero no operativa.

---

## Q2. ¿Idioma: solo español México o también inglés? [BLOQUEANTE]

**Por qué importa:** el modelo de ElevenLabs y el system prompt están configurados para un idioma. Agregar inglés requiere duplicar la KB y probar las dos rutas.

**Contexto del proyecto:**

- `PENDIENTES-WEB.md` sección 2.6 dice: "Solo español (México). No hay versión en inglés."
- El público meta (dueño de terreno 45-70, socio de capital mexicano) es hispanohablante.
- CISA opera en México.

**Recomendación ABDev:** solo español México. Consistente con el alcance del sitio y con la audiencia. Si en el futuro hay interés de capital extranjero, se agrega.

**Quién decide:** CISA.

---

## Q3. ¿Quién es el "humano" al que Sofía transfiere? [BLOQUEANTE]

**Por qué importa:** el handoff manda el payload a un nombre, WhatsApp, correo o CRM específico. Sin destinatario, la transferencia no funciona.

**Opciones:**

- **Una persona del equipo comercial.** Captura nombre, WhatsApp, correo.
- **Un buzón general** (`atencion@grupocisa.mx` o similar) que distribuye internamente.
- **Un CRM con asignación automática** (HubSpot, Pipedrive, Zoho).
- **WhatsApp Business con respuesta automática** que notifica al equipo.

**Información que CISA debe proveer:**

- Nombre del asesor principal (o de los asesores, si hay varios)
- WhatsApp del asesor (o WhatsApp Business compartido)
- Correo del asesor
- Horario de atención (ver Q4)
- Si hay varios asesores, ¿cómo se reparten? (¿Por tipo de lead? ¿Por zona? ¿Round-robin?)

**Recomendación ABDev:** empezar con un buzón general + WhatsApp Business. Cuando CISA defina el equipo y el proceso, refinar.

**Quién decide:** CISA (dirección comercial).

---

## Q4. ¿Horario de atención humano? [BLOQUEANTE]

**Por qué importa:** define cuándo el SLA de 48 horas hábiles corre y cuándo Sofía se queda "sola" hasta el siguiente día hábil.

**Opciones:**

- **Lunes a viernes, 9:00 a 18:00 hora CDMX** (estándar mexicano).
- **Lunes a sábado, 9:00 a 14:00** (medio día sábado).
- **24/7 con equipo rotativo** (poco probable, alto costo).
- **Solo con cita previa** (sofía agenda en calendario, sin respuesta inmediata).

**Recomendación ABDev:** lunes a viernes 9:00 a 18:00 hora CDMX. Sofía atiende 24/7 pero las transferencias se procesan en horario. Fuera de horario, se captura y se procesa al siguiente día hábil. SLA = 48 horas hábiles desde el siguiente día hábil.

**Quién decide:** CISA.

---

## Q5. ¿Sofía debe actuar también en WhatsApp Business, no solo en el sitio?

**Por qué importa:** el alcance actual es solo el sitio web. Si Sofía también responde en WhatsApp, el modelo de atención cambia (mensajes asincrónicos, multimedia, etc.) y se necesita una integración adicional con la API de WhatsApp Business.

**Opciones:**

- **Solo en el sitio** (alcance v1, recomendado para empezar).
- **Solo en el sitio + botón "hablar por WhatsApp con Sofía"** (redirige a wa.me con un prefijo de mensaje).
- **Sofía integrada al WhatsApp Business** (responde mensajes entrantes; requiere aprobación de Meta + configuración técnica mayor).

**Recomendación ABDev:** v1 solo en el sitio. El botón de WhatsApp FAB sigue siendo directo al equipo humano. Evaluar la integración a WhatsApp Business después de 2-3 meses de operación, con datos reales.

**Quién decide:** CISA + ABDev (evalúan costo-beneficio).

---

## Q6. ¿Política de datos: qué se queda en el navegador, qué se va al servidor?

**Por qué importa:** la ley mexicana (LFPDPPP) exige informar al usuario qué se recopila, con qué fines y cómo se protegen sus datos. El aviso de privacidad debe estar alineado.

**Decisiones por tomar:**

- **Memoria de la conversación:** ¿cuánto tiempo se guarda en el servidor de ElevenLabs? (Por defecto, según plan de ElevenLabs; ABDev recomienda 30 días y luego borrar del dashboard.)
- **Datos en `localStorage` del navegador:** los borradores de formulario (no de Sofía) ya usan `localStorage`. ¿Sofía también los usa? (Recomendación ABDev: NO. Sofía solo memoria de sesión.)
- **Cookies:** ElevenLabs puede setear cookies de sesión. Verificar en su documentación.
- **Logs del backend:** ¿cuánto tiempo se retienen los payloads de handoff? (Recomendación ABDev: 90 días para análisis, después archivar o borrar.)
- **Transferencia internacional:** ElevenLabs almacena datos en su infraestructura (cloud). ¿CISA está de acuerdo? (Por defecto sí, pero el aviso debe mencionarlo.)

**Recomendación ABDev:** política conservadora. Sofía NO persiste en `localStorage`. La conversación se guarda en ElevenLabs por 30 días (luego se borra manualmente). Los payloads de handoff se guardan en el backend de CISA por 90 días para análisis. Todo documentado en el aviso de privacidad.

**Quién decide:** CISA + ABDev (asesoría legal recomendada).

---

## Q7. ¿Sofía puede agendar citas directamente en un calendario (Google Calendar de la empresa)?

**Por qué importa:** si Sofía agenda, la experiencia es más fluida (no hay paso extra con el humano). Pero requiere integración con Google Calendar, gestión de disponibilidad, y manejo de zonas horarias.

**Opciones:**

- **Sofía no agenda.** Solo transfiere al humano y el humano agenda.
- **Sofía agenda con un asesor humano en Google Calendar.** Requiere OAuth, scopes de Calendar, manejo de slots disponibles.
- **Sofía agenda con un calendario público** (Cal.com, Calendly) sin intervención humana.

**Recomendación ABDev:** v1 sin agendamiento. El humano agenda. Razón: el agendamiento añade complejidad técnica y de privacidad (acceso al calendario) que se justifica solo si el volumen de transferencias lo demanda. Empezar sin agendamiento; revisar a los 2 meses.

**Quién decide:** CISA + ABDev.

---

## Q8. ¿Integración con CRM que ya tengan?

**Por qué importa:** si CISA ya usa un CRM (HubSpot, Pipedrive, Zoho, Monday, Airtable, etc.), el payload de handoff debería llegar ahí, no a un correo.

**Decisiones por tomar:**

- ¿Qué CRM usan o quieren usar?
- ¿Tienen API disponible?
- ¿Quién mantiene las credenciales?
- ¿Hay un webhook configurado o se configura desde cero?

**Recomendación ABDev:** si CISA no tiene CRM, empezar con un endpoint simple (Vercel Function que manda correo). Migrar a CRM cuando CISA lo decida. No invertir tiempo en CRM hasta confirmar que van a usar uno.

**Quién decide:** CISA.

---

## Q9. ¿Alcance real de la certificación ISO 9001:2015?

**Por qué importa:** la KB dice que CISA tiene ISO 9001:2015. El aviso de Sofía dice "certificación en su proceso". Si el alcance real es más específico (ej. "proceso de construcción" o "gestión comercial"), se debe ajustar.

**Información que CISA debe proveer:**

- Alcance exacto del certificado.
- Año de certificación.
- Entidad certificadora.
- Si el certificado es público o requiere NDA.

**Recomendación ABDev:** si el alcance es general ("proceso"), Sofía puede decir "certificación ISO 9001:2015 en su proceso". Si el alcance es específico, decir "certificación ISO 9001:2015 en [alcance]". No inventar.

**Quién decide:** CISA.

---

## Q10. ¿Años exactos desde 1994 al día de hoy? ¿Han validado la cifra "30 años"?

**Por qué importa:** la KB dice "30 años desde 1994". Dependiendo de cuándo se lance Sofía, podrían ser 31 o 32.

**Información que CISA debe confirmar:**

- Año de fundación exacto.
- Si han operado continuamente desde entonces o hubo interrupciones.

**Recomendación ABDev:** Sofía debe usar "más de 30 años" o la cifra exacta que CISA confirme. Nunca inventar.

**Quién decide:** CISA.

---

## Q11. ¿Lista final de aliados confirmada? ¿Se pueden mencionar públicamente?

**Por qué importa:** la KB lista 5 aliados tentativos (CARVIG, Péndulo Arquitectos, Capitalta, Konfirma, Fundación Nuestra Historia). Sofía solo puede mencionar los que CISA confirme.

**Información que CISA debe proveer:**

- Por cada aliado: nombre correcto, tipo de alianza, si se puede mencionar públicamente, qué rol juega en los proyectos de CISA.

**Recomendación ABDev:** si CISA no confirma un aliado, Sofía no lo menciona. Si le preguntan, dice "ese aliado no aparece en nuestro sitio público en este momento".

**Quién decide:** CISA.

---

## Q12. ¿Lista final de desarrollos y datos por proyecto?

**Por qué importa:** la KB tiene placeholders para Bosques de Calacoaya, Viaducto 14, Bomadica, Cumbres del Lago. Sofía solo puede hablar de los datos confirmados.

**Información que CISA debe proveer por cada desarrollo:**

- Ubicación exacta.
- Tipología (departamentos, casas, locales, etc.).
- Número de unidades.
- Superficie.
- Estatus actual (preventa / en obra / terminada / año).
- Avance de obra con fotos fechadas.
- Amenidades.
- Rango de precio o precio de lista.
- Si CISA es dueño del proyecto o lo comercializa para terceros.

**Recomendación ABDev:** si CISA no confirma un dato, Sofía no lo dice. Si le preguntan, escala a humano.

**Quién decide:** CISA.

---

## Q13. ¿Número de etapas: 7 u 8?

**Por qué importa:** el mensaje maestro dice "siete etapas". Algunas piezas internas del sitio mencionan "ocho etapas". La KB usa 7 (consistente con el mensaje maestro).

**Recomendación ABDev:** alinear a 7 etapas (aportación → conceptualización y factibilidad → proyecto arquitectónico → esquema legal → esquema financiero → construcción → preventa y entrega). Si CISA confirma que son 8, ajustar la KB y el system prompt.

**Quién decide:** CISA.

---

## Q14. ¿Equipos de operación confirmados? (estados y ciudades)

**Por qué importa:** la KB dice que CISA opera en CDMX, Estado de México, Querétaro, Quintana Roo, Guanajuato, Mérida y Cancún. Es una lista larga. Sofía debe confirmar antes de decirle a un visitante "sí operamos en [ciudad]".

**Recomendación ABDev:** si CISA no confirma una ciudad, Sofía no la menciona como zona de operación. Si le preguntan por una ciudad no confirmada, dice "por el momento no operamos en esa zona; si su terreno está ahí, podemos explorar opciones".

**Quién decide:** CISA.

---

## Q15. ¿Tono del aviso de privacidad para el agente de IA?

**Por qué importa:** el aviso de privacidad actual probablemente no menciona al agente conversacional. Hay que actualizarlo.

**Texto propuesto a incluir:**

> "Este sitio utiliza un agente conversacional de inteligencia artificial provisto por ElevenLabs ("Sofía") para orientar a los visitantes. Las conversaciones pueden ser procesadas por el equipo de Grupo CISA para dar seguimiento a las solicitudes. Los datos que usted comparte durante la conversación (nombre, WhatsApp, información sobre su terreno o proyecto) se utilizan únicamente para los fines descritos en este aviso y no se comparten con terceros. Si prefiere no interactuar con el agente, puede contactarnos directamente por WhatsApp al 55 1796 4940 o por correo a contacto@grupocisa.mx."

**Recomendación ABDev:** incluir este párrafo en el aviso de privacidad. Pasarlo por revisión legal antes de publicar.

**Quién decide:** CISA + abogado.

---

## Resumen de bloqueantes

| # | Pregunta | Bloqueante |
|---|----------|-----------|
| Q1 | Voz de Sofía | Sí |
| Q2 | Idioma | Sí |
| Q3 | Quién es el humano al que transfiere | Sí |
| Q4 | Horario de atención | Sí |
| Q9 | Alcance ISO | No (ajustar copy) |
| Q10 | Años exactos | No (ajustar copy) |
| Q11 | Aliados | No (KB no los menciona) |
| Q12 | Desarrollos y datos | No (KB usa placeholders) |
| Q13 | 7 u 8 etapas | No (default 7) |
| Q14 | Zonas de operación | No (KB tiene lista tentativa) |
| Q15 | Aviso de privacidad | No (revisión legal) |

---

*ABDev · Alberto Balderas · Agosto 2026*
*Este documento se actualiza cuando CISA responde cada pregunta. La columna "Bloqueante" se reevalúa en cada ciclo.*
