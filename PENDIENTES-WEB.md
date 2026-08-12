# Pendientes · Web CISA · v1.0

> **Estado al 12 de agosto de 2026.** Documento operativo.
> Separa con claridad qué está dentro del alcance, qué no, qué está bloqueado por CISA y qué está bloqueado por decisión de Alberto.
> Actualízalo cada vez que algo cambie de estado.

---

## 1. ✅ DENTRO DEL ALCANCE (sí se hace en este proyecto)

### 1.1 Formularios con memoria persistente → envío por WhatsApp

**Qué es exactamente.**
Los tres formularios del sitio (precalificador en `/su-terreno`, solicitud en `/inversion`, contacto general en `/contacto`) no son un form HTML que muere si el usuario cierra la pestaña. Cada campo que el visitante escribe **se guarda automáticamente en `localStorage` del navegador**, con tres reglas:

1. **Persistencia entre visitas.** Si el dueño de terreno abre el precalificador, llena 4 campos, se le cierra la app, vuelve 3 días después: los 4 campos siguen ahí.
2. **Borrador siempre editable.** El form es editable en cualquier momento hasta que el usuario decide "enviar". El borrador vive en su navegador, no en un servidor.
3. **Envío por WhatsApp como acción principal.** En el último paso, el botón final **NO** es "Enviar formulario" (eso requiere backend, Formspree, validación server-side, CAPTCHA). Es **"Enviar por WhatsApp"**, que arma un mensaje pre-formateado con todos los campos capturados y abre `wa.me/525517964940?text=<mensaje codificado>`.

**Por qué se eligió este patrón (no el form tradicional).**

| Problema del form tradicional | Cómo lo resuelve el patrón memoria + WhatsApp |
|--------------------------------|----------------------------------------------|
| Requiere backend, Formspree, dominio verificado, CAPTCHA | Cero backend. Solo HTML + 200 líneas de JS. |
| El prospecto abandona y se pierde | El borrador sigue en su navegador, vuelve cuando quiera |
| El equipo comercial no recibe contexto estructurado | El WhatsApp llega con campos etiquetados (Superficie: 320 m², Ubicación: Atizapán, etc.) |
| Depende de que el form "llegue" y del timing del correo | El WhatsApp es inmediato y asincrónico, la persona responde cuando puede |
| Hay que recordar al usuario lo que iba contestando | El navegador lo recuerda por él |
| Riesgo de GDPR/protección de datos | Los datos viven **en el navegador del visitante**, no en servidor. Privacidad por diseño. |

**Lo que ya está hecho.**

- [x] Estructura HTML de los 3 forms con todos los campos (incluido `/su-terreno#precalificar` con sus 7 pasos)
- [x] Honeypot anti-spam (campo `_gotcha` oculto en CSS)
- [x] Meta datos Formspree listos (asunto, página de gracias) — solo falta crear la cuenta y reemplazar IDs
- [x] Estilo accesible: label visible (no solo placeholder), focus ring, errores legibles

**Lo que falta (dentro del alcance).**

- [ ] **Script de memoria persistente en `localStorage`** (estimado 2–3 h de trabajo)
  - Guardar cada `input`/`select`/`textarea` al evento `input` o `change`
  - Restaurar al cargar la página
  - Botón "Borrar borrador" en cada form
  - Indicador visual de "Borrador guardado · 12 ago 2026 10:34"
- [ ] **Generador de mensaje WhatsApp** (estimado 1–2 h)
  - En el último paso de cada form, transformar todos los campos a texto con etiquetas
  - Codificar para URL (`encodeURIComponent`)
  - Abrir `wa.me/525517964940?text=<texto>` en pestaña nueva
  - Mostrar preview del mensaje antes de abrir WhatsApp
- [ ] **Página de gracias post-envío** (estimado 1 h)
  - `index.html#gracias`, `inversion.html#gracias`, `contacto.html#gracias`
  - Copy: "Recibimos su información. Le respondemos en 48 horas hábiles. Mientras tanto…"
  - Enlace a `/contenido` para nutrir al prospecto
- [ ] **Limpiar `localStorage` tras envío confirmado** (300 líneas más, 30 min)
  - Para que no reaparezca el borrador en la próxima visita
- [ ] **Fallback si JS deshabilitado** (30 min)
  - Mostrar mensaje "Active JavaScript para usar este formulario, o escríbanos directo a WhatsApp"
  - Link wa.me/525517964940 visible

**Total estimado para cerrar 1.1:** 5–7 horas de trabajo en HTML/JS.

### 1.2 SEO técnico básico

- [ ] Retirar `noindex` de las 6 páginas (bloqueo raíz actual)
- [ ] Generar `sitemap.xml` y `robots.txt` correctos
- [ ] Meta description única por página (no duplicada)
- [ ] Datos estructurados `Organization` y `RealEstateAgent` (schema.org)
- [ ] Open Graph + Twitter Cards para que las fichas se vean bien al compartir
- [ ] Verificar todas las URLs canónicas

### 1.3 Avance de obra con fotos fechadas

- [ ] Crear bloque en `/desarrollos/[slug]` con timeline de avance (% por mes)
- [ ] Sección específica de "Avance de obra" con fotos fechadas (placeholder hasta que CISA envíe)
- [ ] Status chips actualizados por proyecto (Terminada 2025 / En trámite / Preventa / Vendido)

### 1.4 Inventario destacado en home

- [ ] Bloque "Inventario destacado" en home con 4–6 propiedades con precio visible
- [ ] Conecta con `/desarrollos` cuando exista `/desarrollos/[slug]`

### 1.5 Accesibilidad mínima

- [ ] Auditoría con NVDA + VoiceOver en las 6 páginas
- [ ] Verificar contraste WCAG AA en todos los textos
- [ ] Navegación por teclado completa
- [ ] ARIA labels en iconos y elementos interactivos
- [ ] Skip link funcional en todas las páginas

### 1.6 12 artículos de contenido orgánico (Módulo 6)

- [ ] Grupo A (8 artículos para dueños de terreno):
  1. Qué hacer con un terreno heredado entre varios hermanos
  2. Vender o aportar su terreno: cómo se comparan de verdad
  3. Cómo saber qué se puede construir en su terreno
  4. Qué revisa un desarrollador antes de aceptar un predio
  5. Cómo leer el uso de suelo en el Estado de México
  6. Cuánto cuesta tener un terreno parado (predial, riesgo, costo de oportunidad)
  7. Qué es la aportación de terreno y bajo qué figura se formaliza
  8. Terreno en copropiedad: qué hace falta para poder desarrollarlo
- [ ] Grupo B (4 artículos para compradores e inversionistas):
  1. Cómo funciona una preventa inmobiliaria y qué revisar antes de apartar
  2. Qué documentos exigir en una compra en preventa
  3. Vivir en Atizapán y Calacoaya: servicios, escuelas y conectividad
  4. Comprar directo al desarrollador vs. a través de un intermediario

### 1.7 Blog (CMS ligero en HTML)

- [ ] Página `/contenido` con índice de artículos
- [ ] Página `/contenido/[slug]` por artículo
- [ ] Conversión de los 12 artículos de markdown a HTML

---

## 2. ❌ FUERA DEL ALCANCE (NO se hace en este proyecto)

### 2.1 Herramientas de cálculo de viabilidad de terreno en aportación

**Qué NO se hace.**

- Calculadora de "cuánto me tocaría si aporto mi terreno"
- Simulador de "qué se puede construir aquí" con input de superficie + uso de suelo
- Estimador de plusvalía, retorno o metros construibles
- Algoritmo de pre-clasificación de factibilidad

**Por qué NO está en alcance.**

1. **Riesgo legal.** Prometer cifras, metros construibles o cualquier cálculo sin factibilidad real firmada por un desarrollador + arquitecto + abogado expone a CISA a litigio. Ya está documentado en el mensaje maestro: "La promesa es de información, no de resultado".
2. **Riesgo comercial.** Si un cálculo da 3,800 m² construibles y luego la factibilidad real da 2,200, se rompió la confianza. CISA no quiere ese escenario.
3. **Riesgo técnico.** Una calculadora "honesta" requiere integración con: uso de suelo real por municipio, COS/CUS por zona, restricciones ambientales, afectaciones, patrimonio, etc. No es viable como feature simple en HTML estático sin backend.
4. **No es lo que vende.** El mensaje central es: "Empiece por saber qué puede construirse en su terreno". El "saber" lo da CISA en una llamada o en una visita. El form con memoria + WhatsApp es la pieza que **canaliza la conversación**, no la que la resuelve.

**Qué se hace en su lugar (dentro del alcance).**

- El precalificador con memoria persistente + WhatsApp (sección 1.1) recoge los datos básicos y los entrega a un asesor humano.
- CISA responde con un **escenario** en 48 horas hábiles, no con una cifra.
- El asesor es quien dice, con información verificada: "su terreno entra en el perfil / no entra / necesitamos visitarlo".
- En `/inversion` (capital) **tampoco** hay simulador. Se explica el modelo y se ofrece la conversación.

**Si en el futuro CISA pide una calculadora**, eso es un proyecto nuevo, no parte de este. Mínimo: 6–8 semanas, con backend, abogado, fuente de datos verificada, disclaimer legal y disclaimers firmados.

### 2.2 CMS (Content Management System)

- [ ] No se construye un panel de administración para que CISA edite contenido sin código
- [ ] Para cambiar copy/proyectos/aliados, Alberto actualiza el HTML y pushea (o lo hace CISA a través de Alberto/ABDev)

**Por qué:** el alcance es un sitio estático que se itera con ABDev. Un CMS agrega superficie de error, mantenimiento y seguridad que no aporta al negocio. CISA no va a escribir código. La velocidad de cambio de copy en este proyecto no lo amerita.

### 2.3 Agente ElevenLabs en producción

- [ ] El botón flotante apunta a WhatsApp, no a un agente conversacional de IA
- [ ] Estructura HTML/CSS lista para conectar el widget si se decide después
- [ ] API key de ElevenLabs no se conecta en este proyecto

**Por qué:** requiere modelo conversacional entrenado con base de conocimiento real, validación legal de respuestas, fallback a humano, métricas. Es un proyecto en sí mismo.

### 2.4 Autenticación de usuarios / área privada

- [ ] No hay login, registro, dashboard de clientes, portal de inversionistas
- [ ] No hay extranet de propietarios para ver avance de obra personalizado

### 2.5 E-commerce / pagos en línea

- [ ] No se procesan pagos de apartados ni enganches
- [ ] El CTA final es siempre WhatsApp o, en preventa, contacto con asesor

### 2.6 Multi-idioma

- [ ] Solo español (México)
- [ ] No hay versión en inglés, francés u otro idioma

---

## 3. ⏸️ BLOQUEADO por input de CISA (cliente)

No podemos avanzar hasta que CISA envíe. **El form con memoria + WhatsApp funciona sin esto**, pero el sitio no se siente "verdad" hasta que llegue.

- [ ] Nombres reales del equipo (5 personas, cargos)
- [ ] Fotos reales del equipo
- [ ] Testimonio de propietario para el bloque "Una historia que ya ocurrió" en `/su-terreno`
- [ ] Datos reales de proyectos (unidades, niveles, año de entrega, avance de obra)
- [ ] Aliados confirmados: CARVIG, Péndulo, Capitalta, Kimbra, Fundación Nuestra Historia
- [ ] Certificación ISO 9001:2015 — alcance real (no asumimos "toda la operación")
- [ ] Año de fundación exacto / trayectoria
- [ ] Estados de operación finales de cada desarrollo (Bosques de Calacoaya, Viaducto 14, Bomadica, Cumbres del Lago)
- [ ] Renders reales de los proyectos
- [ ] Brochure en PDF actualizado
- [ ] Correo en dominio propio (no Gmail)
- [ ] Decisión sobre 1 testimonio de propietario (el bloque que más mueve la aguja)

---

## 4. ⏸️ BLOQUEADO por decisión de Alberto (tú)

- [ ] Crear cuenta Formspree y reemplazar `REPLACE_WITH_FORM_ID` en los 3 forms (si decides ir con Formspree; la otra opción es el patrón memoria + WhatsApp y olvidarse de Formspree)
- [ ] Aprobar el logo final (cuando sea necesario vectorizarlo o re-renderizarlo)
- [ ] Confirmar que el patrón memoria + WhatsApp (sin backend) es suficiente vs. backend con Formspree
- [ ] Auditoría accesibilidad con NVDA + VoiceOver (no es solo QA: requiere instalar lectores y probar)
- [ ] Screenshot mobile real en device físico (no solo viewport del browser)
- [ ] Decisión sobre subdominio `cisa.abdev.click` (Vercel está asignando, pero requiere tu confirmación final)
- [ ] Política de retención: cuánto tiempo se guardan los borradores en `localStorage` antes de expirar (propuesta: 30 días)

---

## 5. 🚀 PRÓXIMO SPRINT (orden recomendado)

Si tuvieras 1 semana para empujar el sitio, en este orden:

1. **Form con memoria persistente + WhatsApp** (sección 1.1) — 5–7 h. Es lo que más valor da y lo único que CISA puede "usar" mañana aunque los placeholders sigan.
2. **SEO técnico básico** (sección 1.2) — 3–4 h. Quitar `noindex`, sitemap, meta descriptions, schema.org. Sin esto, todo el trabajo de contenido orgánico posterior no rankea.
3. **Avance de obra con fotos fechadas** (sección 1.3) — depende de input de CISA, pero el wireframe se puede hacer ya.
4. **Accesibilidad mínima** (sección 1.5) — 4 h, en paralelo.
5. **Inventario destacado en home** (sección 1.4) — depende de placeholders de CISA, pero la estructura se puede dejar lista.

**Total sprint 1:** ~15–20 horas de trabajo en HTML/JS, sin esperar a nadie.

---

## 6. 🛑 Riesgos activos

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Alberto quiere calculadora, cliente quiere calculadora | Rompe promesa legal y agrega 6+ semanas | Mensaje maestro lo prohíbe explícitamente. Si insisten, propuesta de proyecto nuevo. |
| CISA tarda en enviar nombres/fotos/proyectos | Sitio se queda con placeholders indefinidamente | El form con memoria + WhatsApp funciona 100% con placeholders. No bloquea. |
| Vercel cambia política de free tier o dominio | Migración a Cloudflare Pages o GitHub Pages | HTML estático es portable a cualquier host. 1 día de migración. |
| Formspree cambia API o cierra | Si vamos con Formspree, riesgo. Si vamos con memoria + WhatsApp, riesgo cero. | La decisión de 1.1 elimina este riesgo por completo. |
| CISA pide autenticación o portal | Fuera de alcance. Proyecto nuevo. | Documentado en 2.4. |

---

*Actualizado: 12 ago 2026 · ABDev · Alberto Balderas*
