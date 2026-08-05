# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Propietarios de terrenos urbanos o periurbanos que necesitan conocer sus opciones antes de vender o aportar su predio.
- Socios de capital que quieren revisar proyectos inmobiliarios y solicitar información.
- Compradores que buscan casas, departamentos, locales, terrenos o desarrollos.

## Product Purpose

La plataforma presenta a Grupo CISA, organiza sus desarrollos y propiedades, genera conversaciones calificadas y explica el proceso de aportar un terreno, invertir o comprar. El éxito inicial es que cada visitante identifique su ruta y pueda iniciar una conversación por formulario o WhatsApp.

## Positioning

Grupo CISA ofrece una tercera vía para propietarios de terrenos: estudiar el potencial de desarrollo antes de decidir entre vender, conservar o aportar. La plataforma convierte esa diferencia de negocio en una experiencia clara y medible.

## Operating Context

- La home es una superficie comercial en modo Persuade.
- WhatsApp es el canal operativo prioritario para continuar conversaciones.
- El contenido debe derivarse del mensaje maestro de Grupo CISA.
- El equipo de CISA deberá actualizar inventario, precios, estatus y avances de obra en la plataforma final.
- ABDev desarrolla la arquitectura digital y explica el sistema; Grupo CISA atiende las operaciones inmobiliarias.

## Capabilities and Constraints

- Primera iteración: home navegable con formularios y CTA de WhatsApp.
- Demo actual: Vite, React, TypeScript, Tailwind v4 y Motion.
- Migración prevista: Next.js, Supabase y Vercel.
- No inventar precios, disponibilidad, rendimientos, plazos, certificaciones ni condiciones legales.
- Los datos no confirmados deben quedar marcados como pendientes o solicitarse al equipo de CISA.
- La experiencia debe funcionar en escritorio y móvil, con foco en lectura clara y acciones accesibles.

## Brand Commitments

- Nombre: Grupo CISA.
- Voz: sólida, no solemne; técnica, no críptica; transparente, no ingenua.
- Tratamiento: usted.
- Frase estratégica: “Vender un terreno es una operación. Desarrollarlo es un negocio.”
- Promesa: empezar por conocer qué puede construirse en un terreno, sin costo y sin compromiso de aportarlo.
- Dirección visual aprobada: Levantamiento.
- El logotipo y la paleta final requieren validación de materiales oficiales.

## Evidence on Hand

- `cisa/00-CONTEXTO-MAESTRO.md`
- `cisa/web-demo/src/`
- `CISA-home-copy-F3.md`
- `CISA-home-wireframe-F2.md`
- PDF `CISA 2026 (1).pdf`
- Sitio público actual: `https://www.gcisa.mx/`
- Falta recibir fotografías finales, logo vectorial, datos del equipo, inventario validado y esquema jurídico revisado.

## Product Principles

1. Una persona debe reconocer su ruta en segundos.
2. La plataforma debe explicar antes de pedir confianza.
3. Cada afirmación comercial debe poder comprobarse.
4. WhatsApp debe sentirse como continuación natural, no como salida improvisada.
5. La interacción distintiva debe explicar el modelo de CISA, no decorar la página.

## Accessibility & Inclusion

- Contraste legible y foco de teclado visible.
- Formularios con etiquetas, errores explicativos y recuperación clara.
- La experiencia no dependerá únicamente de animación, color o WebGL.
- El contenido esencial permanecerá disponible aunque se reduzca el movimiento.
