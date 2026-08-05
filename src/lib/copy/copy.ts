// Copy base de la demo.
// Fuente: MENSAJE-MAESTRO-GrupoCISA.docx + COPY-Home-y-SuTerreno.md
// Lo que aparece entre [corchetes] son placeholders que CISA debe confirmar.

export const copy = {
  marca: {
    nombre: 'Grupo CISA',
    telefono: '[+52 ...]',
    whatsapp: '[WhatsApp Business]',
    correo: '[contacto@cisa.mx]'
  },

  // Bloque 1 · Hero
  hero: {
    titular: '«Ese terreno lleva años parado y venderlo se siente como regalarlo.»',
    subtitulo:
      'Hay una tercera opción: aportarlo a un desarrollo y cobrar en metros construidos, conservando participación en el proyecto. Grupo CISA diseña, gestiona, financia, construye y comercializa. Empiece por saber qué puede construirse en el suyo.',
    ctaPrimario: 'Hablar con el agente',
    ctaSecundario: 'Ver propiedades disponibles',
    ctaCompromiso: 'Disponible 24/7 · Voz y texto · Sin compromiso'
  },

  // Bloque 2 · El agente (pieza WOW)
  agente: {
    titular: 'Habla con nosotros. Al instante.',
    parrafo:
      'No es un chatbot. Es un agente con voz, entrenado con todo lo que sabemos de desarrollo inmobiliario. Le preguntas lo que quieras en tu lenguaje, él responde en el suyo.',
    bullets: [
      'Pregúntale por tu terreno y te dice qué opciones hay',
      'Pregúntale por una propiedad y te da precio, ubicación, disponibilidad',
      'Pregúntale por inversión y te explica cómo funciona',
      'Si necesitas hablar con una persona, te conecta'
    ],
    cta: 'Empezar conversación',
    puedeHacer: [
      'Resolver dudas sobre el modelo de aportación, co-desarrollo, construcción e inversión',
      'Dar información de cualquier propiedad o desarrollo del catálogo',
      'Agendar una llamada con un asesor humano',
      'Registrar tu contacto para seguimiento'
    ],
    noHace: [
      'Valuar tu terreno sin factibilidad',
      'Prometerte cifras de rendimiento',
      'Comprometer fechas de entrega',
      'Darte información que no esté validada por CISA'
    ]
  },

  // Bloque 3 · Modalidades (antes era nuevaOportunidad)
  modalidades: {
    titular: 'Cuatro formas de trabajar contigo',
    parrafo:
      'No somos para todos. Somos para quien quiere hacer las cosas en serio, con un equipo que se hace responsable de principio a fin.',
    items: [
      {
        numero: '01',
        titulo: 'Aportación de terreno',
        descripcion:
          'Tienes un terreno urbano o periurbano. Nosotros lo desarrollamos. Tú conservas participación en el proyecto.'
      },
      {
        numero: '02',
        titulo: 'Co-desarrollo',
        descripcion:
          'Tienes un terreno y capital, o solo capital. Buscamos un socio para estructurar el proyecto juntos.'
      },
      {
        numero: '03',
        titulo: 'Construcción por encargo',
        descripcion:
          'Ya tienes el proyecto, las licencias, el financiamiento. Necesitas quien construya con orden y con fecha cierta.'
      },
      {
        numero: '04',
        titulo: 'Inversión en proyectos',
        descripcion:
          'Quieres participar en un desarrollo sin operar. Evaluamos juntos en qué proyecto, con qué riesgo, bajo qué figura.'
      }
    ]
  },

  // Bloque 2 · Nueva oportunidad
  nuevaOportunidad: {
    titular: 'Vender un terreno es una operación. Desarrollarlo es un negocio.',
    parrafo:
      'Una venta ocurre una sola vez. Un desarrollo convierte el mismo predio en varias unidades, y usted participa en el resultado en lugar de despedirse de él.',
    pasos: [
      {
        titulo: 'Usted aporta el terreno',
        descripcion:
          'No lo vende. Lo aporta bajo una figura jurídica que deja por escrito qué pone cada parte y qué recibe. Usted conserva su participación en el proyecto.'
      },
      {
        titulo: 'Nosotros desarrollamos',
        descripcion:
          'Factibilidad, proyecto arquitectónico, esquema legal y financiero, licencias, construcción y comercialización. Un solo equipo responsable de todas las etapas.'
      },
      {
        titulo: 'Usted recibe metros y participación',
        descripcion:
          'En lugar de una venta única, patrimonio construido: departamentos, locales o la participación que se acuerde antes de iniciar.'
      }
    ]
  },

  // Bloque 3 · Prueba
  prueba: {
    titular: 'No es una propuesta teórica. Es lo que hacemos.',
    parrafo: 'Obra propia, en desarrollo y entregada, en el Valle de México y en Querétaro.',
    proyectos: [
      {
        nombre: 'Bosques de Calacoaya',
        ubicacion: 'Atizapán, Edo. Méx.',
        descripcion: '24 departamentos de 120 m² y 11 casas de 183 m²',
        estatus: '[estatus y fecha]'
      },
      {
        nombre: 'Viaducto 14',
        ubicacion: 'Ciudad de México',
        descripcion: '24 departamentos de 67 m² y 1 local comercial',
        estatus: '[estatus y fecha]'
      },
      {
        nombre: 'Bomadica',
        ubicacion: 'Querétaro',
        descripcion: 'Torre de consultorios médicos y locales comerciales',
        estatus: '[estatus y fecha]'
      },
      {
        nombre: 'Cumbres del Lago',
        ubicacion: 'Querétaro',
        descripcion: 'Residencia de 190 m²',
        estatus: '[estatus y fecha]'
      }
    ]
  },

  // Bloque 4 · El método
  metodo: {
    titular: 'Siete etapas. En todo momento sabe en cuál está su proyecto.',
    parrafo:
      'Publicamos el proceso completo porque es la parte que casi nadie explica, y es justo donde nacen todas las dudas.',
    etapas: [
      { numero: '01', nombre: 'Aportación del terreno', detalle: 'Se define qué aporta cada parte y bajo qué figura.' },
      { numero: '02', nombre: 'Conceptualización y factibilidad', detalle: 'Qué se puede construir ahí y si tiene sentido económico.' },
      { numero: '03', nombre: 'Proyecto arquitectónico', detalle: 'El desarrollo toma forma y superficie vendible.' },
      { numero: '04', nombre: 'Esquema legal', detalle: 'Contratos, permisos y licencias.' },
      { numero: '05', nombre: 'Esquema financiero', detalle: 'Cómo se financia la obra y cómo se reparte el resultado.' },
      { numero: '06', nombre: 'Construcción', detalle: 'Obra con avance documentado y fechado.' },
      { numero: '07', nombre: 'Preventa y entrega', detalle: 'Comercialización y escrituración.' }
    ]
  },

  // Footer
  footer: {
    aviso:
      'Esta es una demo de dirección de arte. Copy, fotografía, proyectos y datos de contacto son placeholders. La versión final se construye con los materiales confirmados por Grupo CISA.'
  }
} as const
