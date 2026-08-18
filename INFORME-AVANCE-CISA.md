# Informe de avance · Sitio web Grupo CISA
**Para:** Equipo CISA · Dirección de proyecto, dirección legal, dirección comercial
**De:** ABDev · Alberto Balderas (desarrollo) + Mavis (asistente de desarrollo)
**Fecha:** 18 ago 2026
**URL pública:** `https://cisa1.vercel.app/`

---

## 1. Lo que ya está publicado y operativo

El sitio base está deployado y funcionando. Cualquier visitante puede navegar todas las páginas, leer los artículos del blog, ver los desarrollos, abrir el formulario de precalificación y abrir el agente virtual.

**Estructura del sitio (8 páginas + blog + secciones):**

| Sección | URL | Qué hace |
|---|---|---|
| Inicio | `/` | Hero con video del terreno + 5 métricas de mercado, 4 modalidades, desarrollos vigentes, agente, equipo, FAQ, CTA |
| Su terreno | `/su-terreno.html` | 8 etapas del método de aportación, formulario de precalificación con memoria persistente |
| Desarrollos | `/desarrollos.html` | Los 3 proyectos vigentes como tarjetas con estado, unidades y entregables |
| Detalle de cada desarrollo | `/desarrollos/panorama-algarin.html` y 2 más | Ficha técnica completa, tipologías, amenidades, ubicación, documentos, proceso |
| Inversión | `/inversion.html` | Para socios de capital, narrativa y CTA |
| Nosotros | `/nosotros.html` | Método, equipo, certificaciones |
| Contacto | `/contacto.html` | Datos de contacto, horarios, mapa |
| Contenido (blog) | `/contenido.html` | 15 artículos publicados, filtro por categoría |
| 15 artículos | `/contenido/01-…15-…html` | Para dueños de terreno, compradores e inversionistas |

**Funcionalidades activas:**
- Formularios con memoria persistente: lo que el visitante escribe no se pierde si cierra el navegador. Al enviar, se genera un mensaje pre-formateado a WhatsApp `+52 55 1796 4940`.
- Widget del agente virtual (Sofía) en la esquina inferior derecha: click abre WhatsApp como canal de atención mientras se conecta el agente de ElevenLabs (pendiente de configurar).
- Diseño responsive mobile-first, base 17px para el público 45-70 años.
- Accesibilidad WCAG AA básica: skip links, focus visible, ARIA roles, contraste mínimo 4.5:1.
- 3 entradas al sistema de edición en vivo (impeccable): desde el browser, desde chat con Mavis, desde terminal. Documentado en `GUIA-CLIENTE-IMPECCABLE.md`.

---

## 2. Lo que depende de ustedes (CISA)

Esto es lo único que no podemos avanzar sin su información. Está dividido en 3 categorías: datos del equipo, datos de los desarrollos, y configuración del agente.

### 2.1 Equipo humano

Necesitamos para publicar la sección "Equipo" del sitio y la página "Nosotros":

- [ ] **5 fotos profesionales** del equipo (1 por persona, formato JPG o PNG, mínimo 800×800 px). Si tienen fotógrafo interno, perfecto. Si no, podemos sugerir uno o usar fotos existentes de LinkedIn con permiso.
- [ ] **5 nombres completos** (nombre + apellido).
- [ ] **5 cargos exactos** tal como quieren que aparezcan.
- [ ] **1 línea de biografía** por persona (qué hace, en qué destaca, hace cuánto en CISA).

Tiempo estimado de сбор: 1-2 horas con quien tenga acceso al expediente del equipo.

### 2.2 Testimonio de propietario

Para el bloque "Una historia que ya ocurrió" (placeholder actual con datos genéricos):

- [ ] **Testimonio escrito** de un propietario que haya aportado terreno a un desarrollo de CISA. Formato sugerido: nombre, ubicación del terreno, qué le ofrecieron, qué recibió (m² construidos, participación), y una frase sobre su experiencia.
- [ ] **Foto del propietario** con permiso expreso de uso de imagen (puede ser la misma persona o no, según la dinámica del testimonio).
- [ ] **Firma de autorización** de uso de testimonio en sitio web (les proporcionamos plantilla).

Tiempo estimado: 1 sesión con el propietario que mejor represente el modelo.

### 2.3 Datos reales de los 3 desarrollos vigentes

Las páginas de detalle (`/desarrollos/panorama-algarin.html`, `residencial-fraile.html`, `itzae.html`) ya existen con la estructura completa. Solo falta reemplazar los placeholders `[DATO FALTANTE: …]` con información real.

**Para los 3 desarrollos:**

- [ ] **Unidades disponibles por tipología** (cuántas quedan, si hay preventa abierta, si están agotadas).
- [ ] **Precios actuales** desde $X MXN por tipología.
- [ ] **Fechas clave reales** (RVOE obtenido, Preventel, fecha de inicio de obra, fecha de entrega, fecha de última visita de obra).
- [ ] **Lista final de amenidades** confirmadas (puede diferir de la lista actual).
- [ ] **Banco fiduciario** del fideicomiso de preventa (para Itzaé).
- [ ] **Coordenadas geográficas** del terreno (latitud y longitud, o dirección exacta para embeber Google Maps).

**Por desarrollo individual:**

| Dato | Panorama Algarín | Residencial Fraile | Itzaé |
|---|---|---|---|
| Unidades disponibles por tipología | [ ] | [ ] | [ ] |
| Precio desde por tipología | [ ] | [ ] | [ ] |
| Estatus real (en trámite / preventa / entregada) | [ ] | [ ] | [ ] |
| Mes de solicitud de RVOE | [ ] | [ ] | [ ] |
| Fecha de última visita de obra | [ ] | [ ] | [ ] |
| Foto de avance (si hay) | [ ] | [ ] | [ ] |
| Coordenadas / mapa | [ ] | [ ] | [ ] |

Tiempo estimado: 1 sesión con dirección comercial + dirección de obra.

### 2.4 Aliados estratégicos

Para el bloque "Aliados" en la página de inicio (pendiente de crear):

- [ ] **Confirmación de los 5 aliados**: CARVIG, Péndulo, Capitalta, Kimbra, Fundación Nuestra Historia. ¿Siguen siendo aliados actuales? ¿Falta alguno? ¿Sobra alguno?
- [ ] **Logos en alta resolución** de cada aliado (formato SVG preferido, o PNG con fondo transparente, mínimo 600×600 px).
- [ ] **Breve descripción** (1 línea) de qué hace cada uno y desde cuándo trabajan con CISA.

Tiempo estimado: 1 hora con dirección comercial o administrativa.

### 2.5 Certificación ISO 9001:2015

- [ ] **Número de certificado** ISO 9001:2015.
- [ ] **Fecha de expedición** y de **vigencia**.
- [ ] **Alcance exacto** del certificado (qué procesos cubre, qué unidades operativas).
- [ ] Si la certificación cubre los 4 estados de operación (CDMX, EdoMex, Qro, Qroo) o solo algunos.

Tiempo estimado: 30 minutos con dirección de calidad o administrativa.

### 2.6 Datos institucionales

- [ ] **Año de fundación** confirmado (placeholder actual: "30 años").
- [ ] **Trayectoria concreta**: número de desarrollos entregados, número de unidades construidas, número de clientes atendidos, m² totales.
- [ ] **Estados de operación finales** de cada proyecto histórico: Bosques de Calacoaya, Viaducto 14, Bomadica, Cumbres del Lago. ¿Entran al sitio como "histórico" o solo los 3 vigentes?

Tiempo estimado: 1 hora con dirección general o administrativa.

### 2.7 Configuración del agente virtual (Sofía)

El widget flotante del agente ya está integrado en todas las páginas (excepto contacto, precalificar, gracias y aviso de privacidad). Al hacer click, actualmente abre WhatsApp como canal de atención. Para que abra una conversación real con voz:

- [ ] **Voz** del agente: ¿masculina o femenina? ¿Registro formal o cercano? ¿Español neutro o mexicano?
- [ ] **Idioma**: ¿solo español o bilingüe (español + inglés)?
- [ ] **Horario** de atención: ¿24/7 o solo en horario de oficina? Si es oficina, ¿cuál?
- [ ] **Escalado a humano**: ¿en qué momento el agente transfiere a una persona real? ¿A qué número/email?
- [ ] **Datos de entrenamiento** que quieren que el agente sepa: preguntas frecuentes, objeciones típicas, promociones vigentes, documentos que puede pedir.
- [ ] **Tono y personalidad**: ¿qué palabras puede decir? ¿cuáles NO? (revisar el documento `agente-sofia/system-prompt.md` que ya está en el repo).

Tiempo estimado: 1 sesión de 2 horas con dirección comercial y el equipo de atención al cliente.

---

## 3. Documentos que requieren su visto bueno

Estos son los archivos que les entregamos hoy para que los revisen y aprueben formalmente antes de cualquier modificación al sitio público.

| Documento | Ubicación | Qué contiene | Acción de ustedes |
|---|---|---|---|
| `COPY.md` v2.0 | raíz del repo | Sistema completo de copy: 5 fases, P0-P8, avatares, palabras prohibidas, mapeo de páginas | Revisar y firmar que el tono y las palabras son las correctas |
| `SISTEMA-COPY-ABDEV.md` v2.0 | `01-estrategia/` | Base teórica del sistema de copy | Lectura de contexto (no requiere firma) |
| `DESIGN.md` | raíz del repo | Sistema de diseño: paleta, tipografía, espaciado, componentes | Revisar y firmar que los colores y la tipografía son los correctos |
| `PENDIENTES-WEB.md` | raíz del repo | Alcance del sprint actual con tri-split (en alcance / fuera / bloqueado) | Revisar y firmar que el alcance del sprint está completo |
| `PENDIENTES-FINAL.md` | raíz del repo | Resumen completo de todo lo que falta (este sprint + los pendientes de ustedes) | Lectura de contexto |
| `agente-sofia/system-prompt.md` | `agente-sofia/` | Lo que el agente virtual puede y no puede decir | Revisar y aprobar antes de configurar ElevenLabs |
| `agente-sofia/knowledge-base.md` | `agente-sofia/` | Base de conocimiento del agente: FAQ, datos de CISA, objeciones | Revisar y completar con la info que falta |
| `agente-sofia/open-questions.md` | `agente-sofia/` | 15 preguntas abiertas para configurar el agente | Responder cada una |
| `agente-sofia/integration-spec.md` | `agente-sofia/` | Cómo se conecta el widget con ElevenLabs | Lectura técnica (no requiere firma) |
| `docs/spec-pagina-detalle-desarrollos.md` | `docs/` | Estructura de las páginas de detalle de desarrollos | Revisar y firmar que la estructura captura lo que necesitan |
| `GUIA-CLIENTE-IMPECCABLE.md` | raíz del repo | Manual de 1 página para que ustedes usen el sistema de edición en vivo | Lectura (no requiere firma) |

Si alguno de estos documentos tiene algo que no represente fielmente la marca o el mensaje de CISA, por favor márquenos los puntos específicos. Cualquier cambio se puede hacer en menos de 24 horas.

---

## 4. Resumen de tiempos

| Qué | Su tiempo | Nuestro tiempo |
|---|---|---|
| Datos del equipo | 1-2 horas | 1-2 horas implementación |
| Testimonio | 1 sesión con propietario | 2 horas implementación |
| Datos de 3 desarrollos | 1 sesión con dirección comercial | 4-6 horas implementación |
| Aliados | 1 hora con dirección comercial | 1-2 horas implementación |
| Certificación ISO | 30 minutos | 30 minutos implementación |
| Datos institucionales | 1 hora | 1 hora implementación |
| Configuración del agente | 1 sesión de 2 horas | 1 día configurar ElevenLabs + ½ día integrar |
| **Total** | **~7-8 horas distribuidas en 1 semana** | **~3-4 días de trabajo una vez recibida la info** |

---

## 5. Cómo seguir

1. **Esta semana:** nos reunimos (o llamada) para revisar este documento y priorizar qué desbloqueamos primero.
2. **Cada bloque de datos que nos envíen** lo integramos en 24-48 horas y les notificamos por email cuando esté en producción.
3. **Cualquier ajuste de copy, color, layout o sección** lo pueden pedir directamente en el chat de edición en vivo (impeccable) sin tener que esperar a una reunión.
4. **Cuando esté todo lo crítico cargado:** agendamos una sesión de revisión final con el equipo directivo antes del lanzamiento público formal.

---

**Contacto operativo:**

- Alberto Balderas (ABDev) — `abalderas.dev@gmail.com` — desarrollo principal
- Mavis (asistente) — chat directo con Alberto, o por el canal que prefieran

**Repositorio:** `https://github.com/abalderasdev/cisa`
**Staging (entorno de pruebas):** `https://cisa-git-staging-abalderasdev-5621s-projects.vercel.app/` (banner amarillo permanente, sin Deployment Protection)
**Producción:** `https://cisa1.vercel.app/` (requiere desactivar Deployment Protection en Vercel, ver sección 6)

---

## 6. Bloqueo técnico que requiere su acción

**Deployment Protection de Vercel está activado.** Esto significa que cualquier visitante (incluidos ustedes) sin sesión de Vercel abierta ve la página de login de Vercel en lugar del sitio de CISA.

**Para arreglar (1 minuto, una sola vez):**

1. Entrar a https://vercel.com/abalderasdev-5621s-projects/cisa
2. Settings → Deployment Protection
3. Seleccionar "Public Access" (o "Standard Protection" si quieren password)
4. Esperar 1 minuto a que Vercel propague

Sin este cambio, ni ustedes ni sus clientes pueden ver el sitio. Es la única acción que está bloqueando la revisión en vivo.

---

**ABDev · agosto 2026**
