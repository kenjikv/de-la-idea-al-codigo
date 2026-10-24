/*
 * contenido.js — ÚNICA fuente de verdad de textos, enlaces y datos del sitio.
 *
 * main.js lee este objeto y pinta el DOM. Para cambiar cualquier texto, enlace,
 * fecha o imagen, edita SOLO este archivo (la forma completa está en README-DEV.md).
 *
 * Datos verificados el 24-oct-2026:
 * - Evento, sede y dirección: página de registro https://luma.com/5odhuh0l
 * - Efeméride: D.S. 7352 de 5-oct-1965, elevado a Ley 339 de 11-oct-1967 (lexivox.org)
 * - Cifras: ver contenido/INVESTIGACION.md (UNESCO, CEPAL, BID/FEM, AGETIC)
 *
 * PENDIENTE DE CONFIRMAR con las organizadoras: hora exacta de inicio y fin,
 * agenda real con horarios, y nombres de las ponentes.
 */
window.WTM_CONTENIDO = {
  meta: {
    titulo: "Break the Pattern · Women Techmakers Santa Cruz",
    descripcion:
      "Break the Pattern: Women Techmakers Santa Cruz celebra el Día de la Mujer Boliviana en la Universidad Evangélica Boliviana. Registro gratuito.",
    // Se usa en og:url y en el enlace canónico si no está vacío.
    url: "",
    ogImagen: "assets/img/og.jpg",
    ogImagenAlt:
      "Ingeniera boliviana de pie en un espacio de trabajo tecnológico de Santa Cruz de la Sierra al atardecer",
    themeColor: "#0A0B14",
  },

  sitio: {
    marca: "WTM",
    marcaLugar: "Santa Cruz",
    marcaAria: "Women Techmakers Santa Cruz, ir al inicio",
    saltarContenido: "Saltar al contenido",
    menuAbrir: "Abrir menú",
    menuCerrar: "Cerrar menú",
    navAria: "Secciones",
    nav: [
      { texto: "Por qué", href: "#por-que" },
      { texto: "WTM", href: "#wtm" },
      { texto: "Evento", href: "#evento" },
      { texto: "Agenda", href: "#agenda" },
      { texto: "Cifras", href: "#cifras" },
      { texto: "Preguntas", href: "#faq" },
    ],
    noscript:
      "Este sitio necesita JavaScript para mostrar su contenido. El registro al evento está en luma.com/5odhuh0l",
    // Cualquier enlace que termine en "-pendiente" muestra este aviso en lugar de navegar.
    avisoPendiente: "Este enlace aún no está disponible. Muy pronto.",
    avisoCerrar: "Cerrar aviso",
  },

  // Un solo destino para todos los botones de registro.
  registro: {
    texto: "Regístrate",
    url: "https://luma.com/5odhuh0l",
    nuevaPestana: true,
  },

  hero: {
    antetitulo: "Women Techmakers Santa Cruz · Día de la Mujer Boliviana",
    titulo: "Break the Pattern",
    subtitulo:
      "Un encuentro para visibilizar el aporte de las mujeres en el ecosistema digital de Santa Cruz e impulsar nuevas oportunidades en ciencia y tecnología.",
    ctaPrimario: { texto: "Regístrate en Luma", usaRegistro: true },
    ctaSecundario: { texto: "Conoce la historia", href: "#por-que" },
    indicadorScroll: "Desliza",
    video: {
      src: "assets/video/hero.mp4",
      poster: "assets/img/hero-poster.jpg",
    },
  },

  porQue: {
    numero: "01",
    antetitulo: "Por qué el 11 de octubre",
    titulo: "Adela Zamudio rompió el patrón primero",
    parrafos: [
      "El Día de la Mujer Boliviana se conmemora cada 11 de octubre en tributo al natalicio de Adela Zamudio, poeta, educadora y pionera del pensamiento libre en el país. Fue instituido mediante el Decreto Supremo 7352 del 5 de octubre de 1965 y elevado a rango de ley con la Ley 339 del 11 de octubre de 1967, en homenaje a una intelectual que desafió los prejuicios de su tiempo.",
      "Zamudio comprendió que la educación era la herramienta más poderosa para alcanzar la autonomía civil y profesional de la mujer. Fundó el primer liceo laico femenino en Cochabamba y confrontó con su poesía crítica las estructuras desiguales de su sociedad. Hoy su memoria convoca a las nuevas generaciones a conquistar espacios en la ciencia, la investigación y la innovación tecnológica.",
    ],
    cita:
      "«Nacer hombre», el poema con que Zamudio denunció la desigualdad, sigue describiendo barreras que esta comunidad trabaja por desarmar.",
    citaAutora: "",
    imagen: {
      src: "assets/img/textil.jpg",
      // Decorativa: alt vacío y aria-hidden.
      alt: "",
      ancho: 1344,
      alto: 752,
    },
  },

  wtm: {
    numero: "02",
    antetitulo: "La comunidad",
    titulo: "¿Qué es Women Techmakers?",
    parrafo:
      "Women Techmakers es una iniciativa global creada por Google para visibilizar, conectar y formar a mujeres en áreas tecnológicas. A través de comunidades locales, embajadoras y eventos colaborativos, el programa ofrece recursos técnicos, talleres y redes de mentoría. En Santa Cruz de la Sierra trabajamos junto a Google Developer Groups para crear un entorno cercano e inclusivo donde cada participante descubra herramientas prácticas, expanda sus capacidades técnicas y desarrolle proyectos con impacto real.",
    tarjetas: [
      {
        titulo: "Visión de futuro",
        texto:
          "Fomentamos una industria digital equitativa donde las mujeres lideren proyectos innovadores y conviertan desafíos técnicos en soluciones concretas.",
      },
      {
        titulo: "Comunidad de apoyo",
        texto:
          "Construimos una red colaborativa y abierta para compartir conocimientos, intercambiar experiencias y generar alianzas en el ecosistema cruceño.",
      },
      {
        titulo: "Oportunidades reales",
        texto:
          "Facilitamos el acceso a talleres prácticos, becas, eventos globales y mentorías continuas para impulsar tu desarrollo técnico y profesional.",
      },
    ],
    imagen: {
      src: "assets/img/comunidad.jpg",
      alt:
        "Grupo de mujeres bolivianas reunidas en torno a una laptop durante un encuentro de la comunidad en Santa Cruz de la Sierra",
      ancho: 1024,
      alto: 688,
    },
  },

  evento: {
    numero: "03",
    antetitulo: "El evento",
    titulo: "Nos vemos en la Universidad Evangélica Boliviana",
    // Sin hora confirmada por las organizadoras: dejamos la cuenta regresiva apagada
    // y mostramos el mensaje de evento.cuentaRegresiva.sinFecha.
    fechaISO: "",
    // Día local del evento (AAAA-MM-DD), sin hora. Con fechaISO vacío, a partir del día
    // siguiente se muestra cuentaRegresiva.pasado en lugar de sinFecha.
    fechaDia: "2026-10-24",
    fechaTexto: "Sábado 24 de octubre de 2026",
    hora: "Horario confirmado en tu registro de Luma",
    lugar: "Universidad Evangélica Boliviana",
    direccion:
      "Barrio Cruz del Sur 117, Av. Moscú y Sexto Anillo, Santa Cruz de la Sierra",
    mapaUrl:
      "https://www.google.com/maps/search/?api=1&query=Universidad+Evang%C3%A9lica+Boliviana+Santa+Cruz+de+la+Sierra",
    mapaTexto: "Ver en el mapa",
    modalidad:
      "Presencial y gratuito. El registro en Luma requiere aprobación de las organizadoras.",
    etiquetas: {
      fecha: "Fecha",
      hora: "Hora",
      lugar: "Lugar",
      modalidad: "Modalidad",
    },
    cuentaRegresiva: {
      titulo: "Faltan",
      unidades: { dias: "días", horas: "horas", minutos: "min", segundos: "seg" },
      sinFecha:
        "Es hoy, sábado 24 de octubre. Revisa el horario exacto en tu confirmación de Luma.",
      pasado:
        "Gracias por acompañarnos. Pronto compartiremos el próximo encuentro de la comunidad.",
    },
    cta: { texto: "Quiero asistir", usaRegistro: true },
    imagen: {
      src: "assets/img/charla.jpg",
      alt:
        "Expositora dirigiéndose al público desde el escenario en una conferencia de tecnología",
      ancho: 1024,
      alto: 688,
    },
  },

  agenda: {
    numero: "04",
    antetitulo: "Agenda",
    titulo: "Así se vive la jornada",
    bloques: [
      {
        hora: "01",
        titulo: "Apertura y conferencia magistral",
        descripcion:
          "Acreditación, bienvenida y una mirada al panorama actual del liderazgo femenino en la transformación digital.",
        ponente: "",
      },
      {
        hora: "02",
        titulo: "Panel de líderes bolivianas",
        descripcion:
          "Conversatorio con referentes locales sobre desafíos superados, trayectoria profesional y desarrollo de talento técnico en Bolivia.",
        ponente: "",
      },
      {
        hora: "03",
        titulo: "Taller práctico de tecnología",
        descripcion:
          "Sesión guiada de aprendizaje interactivo enfocada en herramientas digitales modernas y resolución colaborativa de problemas.",
        ponente: "",
      },
      {
        hora: "04",
        titulo: "Espacio de conexión comunitaria",
        descripcion:
          "Dinámica para intercambiar contactos, dialogar con las expositoras y descubrir iniciativas de colaboración dentro del ecosistema.",
        ponente: "",
      },
      {
        hora: "05",
        titulo: "Conclusiones y cierre",
        descripcion:
          "Resumen de los aprendizajes de la jornada, agradecimiento a las participantes y anuncio de los próximos pasos de la comunidad.",
        ponente: "",
      },
    ],
  },

  cifras: {
    numero: "05",
    antetitulo: "Por qué importa",
    titulo: "Las cifras que venimos a cambiar",
    items: [
      {
        valor: 330,
        prefijo: "+",
        sufijo: "",
        etiqueta: "personas ya registradas en Luma al 24 de octubre de 2026",
      },
      {
        valor: 30,
        prefijo: "",
        sufijo: " %",
        etiqueta:
          "de la matrícula en informática y telecomunicaciones en Bolivia son mujeres (AGETIC / UNICEF Bolivia, 2022)",
      },
      {
        // Con parte decimal, el contador muestra un decimal (29,2 %).
        valor: 29.2,
        prefijo: "",
        sufijo: " %",
        etiqueta:
          "de participación femenina en la fuerza de trabajo STEM de la región (Foro Económico Mundial / BID, 2023)",
      },
      {
        valor: 40,
        prefijo: "",
        sufijo: " %",
        etiqueta:
          "de las mujeres de América Latina no cuenta con acceso efectivo a internet (CEPAL, 2022)",
      },
    ],
    imagen: {
      src: "assets/img/taller.jpg",
      alt:
        "Manos de una participante escribiendo código en una laptop durante un taller práctico",
      ancho: 1024,
      alto: 688,
    },
  },

  faq: {
    numero: "06",
    antetitulo: "Preguntas frecuentes",
    titulo: "Lo que nos suelen preguntar",
    preguntas: [
      {
        pregunta: "¿El evento tiene costo?",
        respuesta:
          "No. La participación es gratuita y abierta a todo público interesado. Como el aforo de la sede es limitado, es indispensable completar tu registro en Luma para asegurar tu lugar.",
      },
      {
        pregunta: "¿A quién está dirigida esta jornada?",
        respuesta:
          "A estudiantes, profesionales, investigadoras, emprendedoras y a cualquier persona con interés por la tecnología, sin importar su área de formación ni su nivel de experiencia.",
      },
      {
        pregunta: "¿Necesito saber programar?",
        respuesta:
          "No hace falta experiencia técnica previa. Las charlas y los talleres están pensados para aportar tanto a quienes dan sus primeros pasos como a quienes ya tienen trayectoria en tecnología.",
      },
      {
        pregunta: "¿Mi registro queda confirmado al instante?",
        respuesta:
          "No de inmediato: Luma pide la aprobación de las organizadoras. Recibirás un correo de confirmación cuando tu inscripción sea aprobada, así que revisa también tu carpeta de spam.",
      },
      {
        pregunta: "¿Qué debo llevar?",
        respuesta:
          "Tu documento de identidad para el ingreso, un cuaderno para tomar apuntes y, si quieres participar en las dinámicas prácticas, tu computadora portátil con el cargador.",
      },
      {
        pregunta: "¿Cómo llego a la sede?",
        respuesta:
          "La Universidad Evangélica Boliviana está en el Barrio Cruz del Sur 117, avenida Moscú y Sexto Anillo, en Santa Cruz de la Sierra. En la sección del evento encuentras el enlace directo al mapa.",
      },
    ],
  },

  ctaFinal: {
    titulo: "Rompe el patrón con nosotras",
    parrafo:
      "Sé parte de una jornada diseñada para inspirar tu crecimiento, ampliar tu red de contactos y fortalecer tu liderazgo profesional. Tu perspectiva es clave para transformar el entorno digital de Santa Cruz.",
    boton: { texto: "Registrarme en Luma", usaRegistro: true },
  },

  footer: {
    redesTitulo: "Síguenos",
    // icono: instagram | facebook | linkedin | x | youtube | tiktok | web
    redes: [
      {
        nombre: "Instagram",
        url: "https://www.instagram.com/gdg.santacruz/",
        icono: "instagram",
      },
      {
        nombre: "Facebook",
        url: "https://www.facebook.com/wtmsantacruz",
        icono: "facebook",
      },
      { nombre: "Enlaces WTM", url: "https://linktr.ee/wtmsc", icono: "web" },
      {
        nombre: "Comunidad GDG",
        url: "https://gdg.community.dev/gdg-santa-cruz/",
        icono: "web",
      },
    ],
    credito:
      "Organizan Women Techmakers Santa Cruz y Google Developer Groups Santa Cruz.",
    legal:
      "Women Techmakers es un programa de Google. Este sitio es una iniciativa de la comunidad local y no constituye un sitio oficial de Google.",
    volverArriba: "Volver arriba",
  },
};
