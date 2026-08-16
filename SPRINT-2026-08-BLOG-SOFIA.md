# Sprint 2026-08 · Blog + Sofia · SPEC maestro

> **Fecha de inicio:** 16 ago 2026 · **Orquestador:** Mavis · **Owner:** Alberto Balderas
> **Rama de trabajo:** `staging` (ya tiene banner amarillo + token nuevo, pendiente push)
> **Objetivo:** entregar el sistema de blog con 15 artículos publicados y la especificación operativa de Sofia (agente IA de ElevenLabs).

---

## 1 · Estado de los agentes

| # | Agente | task_id | Qué hace | Estado |
|---|--------|---------|----------|--------|
| 1 | **coder** | `bg_2a2957f7` | Sistema de blog HTML/CSS (índice + 15 artículos en HTML) | corriendo |
| 2 | **general** | `bg_219470e4` | 8 artículos Grupo A (markdown) — dueños de terreno | corriendo |
| 3 | **general** | `bg_f443d02b` | 7 artículos Grupo B (markdown) — compradores + bonus | corriendo |
| 4 | **general** | `bg_3c39bbb3` | Sofia ElevenLabs spec (7 archivos operativos) | corriendo |

**Monitoreo:** cron self-reminder `db5fe0c9-d5b6-40e4-97c5-d371c138959b` cada 5 min, se auto-elimina cuando los 4 agentes terminan.

---

## 2 · Entregables por bloque

### 2.1 Sistema de blog (coder)

**Archivos a generar** (en `C:\Users\abald\AppData\Local\Temp\cisa-push6\`):

```
contenido.html                      # Índice de los 15 artículos, filtros por audiencia
contenido/
  _plantilla.html                   # Plantilla reutilizable
  01-heredar-terreno-entre-hermanos.html
  02-vender-o-aportar-terreno-comparacion.html
  03-como-saber-que-se-puede-construir.html
  04-que-revisa-desarrollador-antes-de-aceptar.html
  05-leer-uso-de-suelo-edomex.html
  06-cuanto-cuesta-terreno-parado.html
  07-que-es-aportacion-de-terreno.html
  08-terreno-copropiedad-requisitos.html
  09-como-funciona-preventa-inmobiliaria.html
  10-documentos-preventa-inmobiliaria.html
  11-vivir-en-atizapan-calacoaya.html
  12-comprar-directo-desarrollador-vs-intermediario.html
  13-como-verificar-avance-de-obra.html
  14-guia-zonas-norte-valle-mexico.html
  15-cinco-senales-terreno-con-potencial.html
```

**Estructura por artículo:**
- Breadcrumb: Inicio / Contenido / [título]
- Kicker audience label
- H1 con una de las 5 fórmulas de titular
- Dek 1-2 líneas
- Byline: Por Grupo CISA · fecha · X min lectura
- Hero image placeholder
- Body 1200-1800 words
- 2 pull quotes
- 1-2 listas
- 1-3 internal links a /su-terreno, /desarrollos, /inversion, /contacto
- CTA al final
- Header + footer + WhatsApp FAB reutilizados
- Skip link
- 17px base, Manrope, paleta green de DESIGN.md

### 2.2 Artículos Grupo A (general)

**Archivos a generar** (en `blog/grupo-a/`):

```
01-heredar-terreno-entre-hermanos.md
02-vender-o-aportar-terreno-comparacion.md
03-como-saber-que-se-puede-construir.md
04-que-revisa-desarrollador-antes-de-aceptar.html
05-leer-uso-de-suelo-edomex.md
06-cuanto-cuesta-terreno-parado.md
07-que-es-aportacion-de-terreno.md
08-terreno-copropiedad-requisitos.md
```

**Reglas de copy aplicadas:**
- 7 bloques del deseo en orden
- Nivel de consciencia declarado (default 2)
- 5 preguntas del avatar respondidas a lo largo
- Headlines H2 con una de las 5 fórmulas
- Dolor en 5 escenas concretas
- Sin banned words
- Sin emojis
- 1500-2200 words por artículo
- YAML front matter
- CTA final a /su-terreno#precalificar

### 2.3 Artículos Grupo B (general)

**Archivos a generar** (en `blog/grupo-b/`):

```
09-como-funciona-preventa-inmobiliaria.md
10-documentos-preventa-inmobiliaria.md
11-vivir-en-atizapan-calacoaya.md
12-comprar-directo-desarrollador-vs-intermediario.md
13-como-verificar-avance-de-obra.md
14-guia-zonas-norte-valle-mexico.md
15-cinco-senales-terreno-con-potencial.md
```

**Reglas de copy aplicadas:**
- 7 bloques del deseo en orden
- Nivel de consciencia declarado (2-3)
- 5 preguntas del avatar adaptadas a comprador
- Diferenciador CISA reforzado
- Sin banned words
- Sin emojis
- 1300-2000 words por artículo
- YAML front matter
- CTA final a /desarrollos o /inversion

### 2.4 Sofia ElevenLabs spec (general)

**Archivos a generar** (en `agente-sofia/`):

```
README.md                  # Overview del sistema
system-prompt.md           # System prompt operativo
knowledge-base.md          # RAG knowledge base (Q&A)
flows.md                   # 5 flujos conversacionales
integration-spec.md        # Spec técnica para el dev
handoff-to-human.md        # Protocolo de transferencia
open-questions.md          # Lo que CISA tiene que confirmar
```

---

## 3 · Después de los agentes

1. **Yo (Mavis) reviso:** que cada archivo exista, que respete el sistema de copy, que no haya placeholders
2. **Yo convierto markdown → HTML** si quedaron en md y los necesito en HTML
3. **Yo integro el widget de Sofia** en las 6 HTMLs (botón flotante que no choque con WhatsApp FAB)
4. **Yo commiteo + pusheo a staging** (cuando Alberto me dé luz)
5. **Alberto prueba** en `https://cisa-git-staging-...vercel.app/`
6. **Iteramos** lo que haga falta
7. **Merge a main** cuando esté pulido

---

## 4 · Riesgos activos

| # | Riesgo | Mitigación |
|---|--------|-----------|
| 1 | Sub-agents escriben contenido genérico o con banned words | QA checklist mental aplicado a cada artículo; revisión de Mavis antes de merge |
| 2 | Sistema de blog no linkea correctamente con /su-terreno, /inversion | El coder recibe los paths exactos en su prompt |
| 3 | Widget de Sofia choca con WhatsApp FAB | integration-spec.md define posición no superpuesta |
| 4 | Push de staging sigue pendiente | Se lo recuerdo a Alberto en cada milestone |
| 5 | Custom domain sigue caído | URL de Vercel directa funciona; CNAME de Namecheap por configurar |
| 6 | Voz de Sofia no decidida | Marcado en open-questions.md, no bloquea la spec |

---

## 5 · Cierre del sprint (definición de "hecho")

- [ ] 15 artículos publicados en `contenido/[slug].html` (no en markdown, no en placeholders)
- [ ] `contenido.html` índice funcional con filtros
- [ ] Cada artículo linkea correctamente a los pilares /su-terreno, /desarrollos, /inversion
- [ ] 7 archivos de Sofia listos en `agente-sofia/`
- [ ] Widget de Sofia integrado en staging (placeholder del agent_id)
- [ ] Push de staging completado por Alberto
- [ ] Vercel redesplegó staging con los nuevos archivos
- [ ] CISA puede probar el blog + revisar el spec de Sofia
- [ ] Decisiones de `open-questions.md` documentadas (no resueltas, solo documentadas)

---

*Orquestador: Mavis · Owner: Alberto Balderas · Fecha: 16 ago 2026*
