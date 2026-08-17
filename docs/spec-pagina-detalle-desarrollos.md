# Spec · Página de detalle de desarrollos

**Status:** v0.1 · agosto 2026
**Para:** CISA / ABDev
**Aplica a:** los 3 desarrollos vigentes (Panorama Algarín, Residencial Fraile, Itzaé) y a cualquiera que se sume

---

## Por qué existe esta página

`desarrollos.html` muestra la lista de los 3 desarrollos vigentes como tarjetas (dev-cards). Cada tarjeta prometía un botón "Ver desarrollo" que apuntaba a anchors inexistentes (`#panorama`, `#fraile`, `#itzae-ficha`). Estaban rotos.

La página de detalle es la respuesta a la pregunta que se hace el visitante cuando ya vio la tarjeta y quiere saber: ¿cuánto?, ¿cuándo?, ¿dónde exactamente?, ¿qué incluye?, ¿qué documentos tienen?

## Estructura común (10 bloques)

Todas las páginas de detalle siguen el mismo esqueleto. Solo cambian los datos.

1. **Hero** — nombre, ubicación, línea de producto, estado, código, trimestre de actualización, banner de estado actual
2. **Resumen** — 1 párrafo lede que cuenta la historia del proyecto (no repite la tarjeta)
3. **Ficha técnica** — 6 celdas con datos duros (producto, niveles, entrega, unidades, ubicación, línea)
4. **Avance de obra** — barra de progreso + % + fecha de última visita + nota sobre periodicidad
5. **Tipologías** — 1-3 cards con nombre, m², recámaras, baños, precio
6. **Amenidades y zonas comunes** — lista de 5-8 amenidades
7. **Ubicación y contexto** — párrafo + lista de ventajas + slot para mapa embebido
8. **Documentos** — tabla con 3-4 documentos del expediente y su estado real
9. **Cómo se compra** — 5 pasos numerados del proceso
10. **Otros desarrollos vigentes** — cross-link a los otros 2-3 proyectos
11. **CTA final** — WhatsApp + "Si tiene un terreno, precalifíquelo"

## Datos que CISA debe proporcionar (bloqueado)

Marcados en el HTML como `[DATO FALTANTE: <campo>]` para que sean honestos y editables:

| Campo | Por qué falta | Quién lo tiene |
|---|---|---|
| Unidades disponibles (precio/preventa) | Decisión comercial | CISA dirección comercial |
| Coordenadas / mapa embebido | Información de cada terreno | CISA proyectos |
| Banco fiduciario (Itzaé) | Contrato específico | CISA dirección legal |
| Mes de solicitud de RVOE | Calendario interno | CISA dirección de obra |
| Fecha de última visita de obra | Operativo, requiere visita | CISA dirección de obra |
| Foto de avance | Operativo | CISA dirección de obra |
| Lista de amenidades finales | Puede cambiar | CISA dirección de proyecto |
| Avance de obra % | Operativo | CISA dirección de obra |

## Decisiones de diseño

- **Una página por desarrollo, no SPA.** Cada uno es un `.html` separado en `desarrollos/<slug>.html`. Más simple, más rápido, mejor para SEO y para que CISA pueda editar el archivo directo.
- **Slugs kebab-case**: `panorama-algarin.html`, `residencial-fraile.html`, `itzae.html` (sin acento en el archivo, con acento en el contenido).
- **CSS local**, no en stylesheet compartido. Las 10 secciones del detalle son específicas; no contaminan el resto del sitio. (Si se replica para 5+ desarrollos, se puede extraer a `assets/dev-detail.css`.)
- **Reutilizar la nav y el footer** de las otras páginas para que la experiencia sea coherente.
- **No meter el widget de Sofia en /desarrollos/<slug>**: el visitante está en modo "evaluar", no "hablar con asistente". Se queda el CTA de WhatsApp como único canal.
- **El placeholder de mapa es honesto**: dice "[DATO FALTANTE: mapa embebido]" en lugar de inventar uno. Cuando CISA mande coordenadas, se reemplaza con iframe de Google Maps.
- **Avance de obra en 3 estados**: 8% (en trámite), 0% (preventa), 100% (entregada). El % es simbólico para que el visitante entienda dónde está el proyecto en su ciclo.
- **Documentos con estado honesto**: "En gestión", "Pendiente", "Disponible", "Cerrado" — no se miente sobre qué se tiene y qué no.
- **Cross-link a "otros desarrollos"** para que la navegación no se quede en una sola página.

## Pendientes para producción (no bloqueantes)

- [ ] CISA envía coordenadas/mapa → reemplazar placeholder
- [ ] CISA envía unidades disponibles y precios finales → actualizar tipologías
- [ ] CISA envía foto de avance → agregar a bloque Avance de obra
- [ ] Si CISA quiere mostrar preventa, agregar módulo de "apartar unidad" con Stripe / Conekta
- [ ] SEO: meta description única por desarrollo, schema.org `Residence` o `ApartmentComplex`
- [ ] Accesibilidad: revisar que las tablas tengan scope y headers, que el banner tenga role="status"
- [ ] Si se agregan más de 3 desarrollos, mover CSS a `assets/dev-detail.css` para no inflar cada HTML

## Cómo extender

Para agregar un nuevo desarrollo:

1. Agregar entrada al dict `PROJECTS` en `gen-detalles.py`
2. Agregar dev-card en `desarrollos.html`
3. Correr `python gen-detalles.py`
4. Commit + push

El script vive en `tools/gen-detalles.py` (lo movemos de `/tmp/` cuando se estabilice).

## Lo que NO entra

- **Galería de fotos del desarrollo** (render del proyecto). Esto requiere material del estudio de arquitectura. CISA lo tiene y debe enviarlo. Cuando llegue, se agrega un bloque "Galería" entre Avance de obra y Tipologías.
- **Tours virtuales 360°**. Requiere Matterport u otro proveedor, no está en alcance.
- **Calculadora de hipoteca**. Se puede integrar como widget externo (Hipoteca Verde, BBVA, etc.) pero no es orgánico al flujo de preventa.
- **Sistema de agendamiento de visitas en línea**. Calendly o similar; se puede agregar más adelante.
