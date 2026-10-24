# WTM Santa Cruz · Día de la Mujer Boliviana — guía de desarrollo

Landing de una sola página en HTML, CSS y JavaScript vanilla. No tiene build step,
dependencias, CDN ni fuentes remotas, así que funciona sin red.

## Servir el sitio

```sh
cd /Users/kenjikv/Documents/Personal/Presentations/wtm_speaker
python3 -m http.server 8080
# abrir http://127.0.0.1:8080/
```

Cualquier servidor estático sirve (Netlify, Cloudflare Pages, `npx serve`, nginx).
Abrir `index.html` con doble clic (`file://`) también funciona, pero conviene probar
siempre con un servidor.

> `python3 -m http.server` no acepta peticiones por rango (HTTP 206), y sin eso el
> navegador no puede saltar dentro del video. `scroll-video.js` lo detecta con una
> prueba real y, si hace falta, carga el video como Blob en memoria. En producción
> (Netlify, Cloudflare) los rangos funcionan y el video se usa directo.

## Qué archivo tocar

| Quiero cambiar…                                  | Archivo                       |
| ------------------------------------------------ | ----------------------------- |
| Cualquier texto, enlace, fecha, agenda, FAQ, red | `assets/js/contenido.js`      |
| Imágenes y video                                 | `assets/img/`, `assets/video/` (rutas abajo) |
| Colores, tipografía, espaciado, layout           | `assets/css/styles.css`       |
| Estructura y orden de secciones                  | `index.html`                  |
| Comportamiento del video con scroll              | `assets/js/scroll-video.js`   |
| Menú, acordeón, cuenta regresiva, contadores     | `assets/js/main.js`           |

**Metadatos para redes:** los rastreadores de Facebook, WhatsApp, LinkedIn y X no
ejecutan JavaScript. `main.js` aplica `meta.*` en el navegador, pero las etiquetas
`<title>`, `description`, `og:*` y `twitter:*` de `index.html` también deben llevar
el texto final. Si cambias `meta` en `contenido.js`, copia esos valores en el `<head>`.

> **Sincronización manual obligatoria.** `index.html` y `contenido.js` no se generan uno
> del otro: `<title>`, `description`, `og:title`, `og:description`, `twitter:title`,
> `twitter:description` (y los `alt` de la imagen) deben coincidir **carácter por
> carácter** con `meta.titulo`, `meta.descripcion` y `meta.ogImagenAlt`. Al servir desde
> `localhost` o `127.0.0.1`, `main.js` muestra un `console.warn` si el `<title>` estático
> no coincide con `meta.titulo`; en producción no avisa. Comprobación rápida:
> `curl -s http://127.0.0.1:8080/ | grep -E "<title>|og:title|og:description|twitter:title|description"`.
>
> **`og:url` y canonical están ausentes a propósito**: todavía no hay dominio de
> publicación y `meta.url` está vacío. Cuando exista, pon la URL pública en `meta.url`
> (main.js las añade en el navegador) **y** escribe a mano en el `<head>` de `index.html`
> `<meta property="og:url" content="…">` y `<link rel="canonical" href="…">`, porque los
> rastreadores no ejecutan JS.

## Assets esperados

| Ruta                          | Uso                                  | Si falta                               |
| ----------------------------- | ------------------------------------ | -------------------------------------- |
| `assets/video/hero.mp4`       | Video del hero ligado al scroll      | Póster + gradiente animado; el hero ocupa una pantalla |
| `assets/img/hero-poster.jpg`  | Póster del hero (1920×1080)          | Gradiente cálido de CSS                |
| `assets/img/textil.jpg`       | Acento decorativo en «Por qué»       | Gradiente con trama                    |
| `assets/img/comunidad.jpg`    | Sección WTM                          | Gradiente con trama                    |
| `assets/img/charla.jpg`       | Tarjeta del evento                   | Gradiente con trama                    |
| `assets/img/taller.jpg`       | Banda de la sección Cifras           | Gradiente con trama                    |
| `assets/img/og.jpg`           | `og:image` / `twitter:image`         | La vista previa en redes queda sin imagen |

Las rutas de las imágenes de sección y del video también están en `contenido.js`
(`*.imagen.src`, `hero.video`), así que puedes cambiarlas desde ahí.

### Recomendaciones para `hero.mp4`

- H.264 + `yuv420p`, sin audio, `+faststart`. Entre 6 y 12 s, 1280×720 o 1920×1080.
- **Keyframes frecuentes:** el scrubbing salta por el video sin parar, y con GOP largos
  se traba. Lo ideal es un keyframe por cuadro o cada pocos cuadros:

```sh
ffmpeg -i original.mp4 -an -c:v libx264 -pix_fmt yuv420p -crf 23 -preset slow \
  -g 1 -movflags +faststart assets/video/hero.mp4
```

Con `-g 1` el archivo pesa más. `-g 6` es un buen equilibrio si pesa demasiado.

## Cómo funciona el video con scroll (`scroll-video.js`)

1. Sin `prefers-reduced-motion: reduce`, pone el `src` del video (`muted`, `playsinline`,
   `preload=auto`, sin `autoplay` ni `loop`).
2. Espera `loadedmetadata`. Si no llega en **6 s** o hay error, cae al póster.
3. **Prueba real de scrubbing:** mueve `currentTime` y verifica en `seeked` que cambió.
   Si falla, reintenta una vez como Blob. Si vuelve a fallar (p. ej. Safari en iOS),
   cae al póster. No se usa el user agent.
4. Si la prueba pasa, el hero crece a `300vh` y el escenario queda `sticky`. El video
   solo se muestra cuando ya tiene un cuadro pintado, así que nunca hay un hueco negro.
5. Cada cuadro (`requestAnimationFrame`) calcula
   `progreso = clamp(-top / (altoHero - viewport), 0, 1)` y
   `objetivo = progreso × duración`, lo suaviza con lerp 0.12 y solo asigna
   `currentTime` si la diferencia supera 1/60 s y el video no está en `seeking`.
6. Un `IntersectionObserver` detiene el bucle cuando el hero sale de pantalla.
7. El texto del hero tiene solo dos estados estables: legible, con el velo oscuro a
   plena fuerza, u oculto. Al pasar el 78 % del recorrido se retira con una transición
   de 0,25 s (vuelve por debajo del 76 %) y recién entonces el velo se aclara para dejar
   ver el video. Oculto, el grupo lleva `aria-hidden="true"`, sus enlaces `tabindex="-1"`
   y no recibe clics; si el foco está dentro, no se oculta hasta que salga.
8. **Altura y recarga:** cuando el hero cambia de altura (crece a `300vh` o vuelve al
   póster), solo se compensa `scrollY` si la persona ya estaba debajo del hero; dentro
   del hero se queda donde estaba y el progreso se recalcula. El anclaje de scroll
   nativo se apaga durante ese cambio para que no sume su propia compensación. Con
   `history.scrollRestoration = "manual"`, la posición se guarda en `sessionStorage`
   (`pagehide`) y, al recargar, se restaura primero contra el hero de `cargando` y otra
   vez con la altura definitiva si la persona no se movió entretanto.

El estado queda en atributos de la sección `#hero`, útiles para depurar:
`data-video-modo="cargando|scrub|poster"` y, en modo póster,
`data-video-motivo="reduce|error|tiempo|sin-scrub|sin-soporte"`.

## Forma completa de `WTM_CONTENIDO`

`assets/js/contenido.js` define un único objeto global, `window.WTM_CONTENIDO`.
Todos los campos son obligatorios salvo los marcados como *opcional*. Un texto vacío
(`""`) oculta su elemento en vez de dejar un hueco.

```js
window.WTM_CONTENIDO = {
  meta: {
    titulo: String,          // <title>, og:title, twitter:title
    descripcion: String,     // meta description, og/twitter description
    url: String,             // opcional: URL pública -> og:url y canonical ("" = no se agrega)
    ogImagen: String,        // ruta de la imagen para redes, p. ej. "assets/img/og.jpg"
    ogImagenAlt: String,
    themeColor: String,      // color de la barra del navegador, p. ej. "#0A0B14"
  },

  sitio: {
    marca: String,           // logo tipográfico, p. ej. "WTM"
    marcaLugar: String,      // p. ej. "Santa Cruz"
    marcaAria: String,       // nombre accesible del logo-enlace
    saltarContenido: String, // texto del skip link
    menuAbrir: String,       // etiqueta accesible del botón hamburguesa (cerrado)
    menuCerrar: String,      // etiqueta accesible del botón hamburguesa (abierto)
    navAria: String,         // nombre accesible de <nav>
    nav: [{ texto: String, href: "#id-de-seccion" }],
    noscript: String,        // referencia; el <noscript> de index.html es estático
    avisoPendiente: String,  // aviso de los enlaces "#...-pendiente" (ver abajo)
    avisoCerrar: String,     // etiqueta accesible del botón que cierra el aviso
  },

  registro: {
    texto: String,           // texto del botón de la cabecera
    url: String,             // destino de TODOS los botones de registro
    nuevaPestana: Boolean,   // true = target="_blank" (recomendado para formularios externos)
  },

  hero: {
    antetitulo: String,
    titulo: String,          // el único <h1> de la página
    subtitulo: String,
    ctaPrimario:   { texto: String, usaRegistro: true },
    ctaSecundario: { texto: String, href: "#por-que" },
    indicadorScroll: String, // texto del indicador "Desliza"
    video: { src: "assets/video/hero.mp4", poster: "assets/img/hero-poster.jpg" },
  },

  porQue: {
    numero: String,          // índice editorial, p. ej. "01"
    antetitulo: String,
    titulo: String,
    parrafos: [String, String],
    cita: String,            // "" oculta la cita
    citaAutora: String,
    imagen: Imagen,          // decorativa: alt ""
  },

  wtm: {
    numero: String, antetitulo: String, titulo: String,
    parrafo: String,
    tarjetas: [{ titulo: String, texto: String }],  // 3 tarjetas
    imagen: Imagen,
  },

  evento: {
    numero: String, antetitulo: String, titulo: String,
    fechaISO: String,        // "2027-10-11T09:00:00-04:00"; "" = hora por confirmar
    fechaDia: String,        // "2026-10-24": día local del evento, sin hora. Solo se usa
                             // si fechaISO está vacío: hasta ese día (incluido) se muestra
                             // sinFecha y desde el día siguiente, pasado. "" = siempre sinFecha
    fechaTexto: String,      // como se muestra, p. ej. "Lunes 11 de octubre"
    hora: String,
    lugar: String,
    direccion: String,
    mapaUrl: String,         // opcional: "" = sin enlace al mapa
    mapaTexto: String,
    modalidad: String,
    etiquetas: { fecha: String, hora: String, lugar: String, modalidad: String },
    cuentaRegresiva: {
      titulo: String,        // p. ej. "Faltan"
      unidades: { dias: String, horas: String, minutos: String, segundos: String },
      sinFecha: String,      // fechaISO vacía o inválida y fechaDia hoy, futura o vacía
      pasado: String,        // la fecha ya pasó (fechaISO, o fechaDia anterior a hoy)
    },
    cta: { texto: String, usaRegistro: true },
    imagen: Imagen,
  },

  agenda: {
    numero: String, antetitulo: String, titulo: String,
    bloques: [{              // 5 bloques
      hora: String,          // p. ej. "09:30"
      titulo: String,
      descripcion: String,   // opcional ("" = no se muestra)
      ponente: String,       // opcional ("" = no se muestra)
    }],
  },

  cifras: {
    numero: String, antetitulo: String, titulo: String,
    items: [{                // 4 cifras
      valor: Number,         // número final del conteo, p. ej. 1200 o 29.2; con parte
                             // decimal se muestra exactamente un decimal ("29,2")
      prefijo: String,       // p. ej. "+"
      sufijo: String,        // p. ej. " años" o "%"
      etiqueta: String,
    }],
    imagen: Imagen,
  },

  faq: {
    numero: String, antetitulo: String, titulo: String,
    preguntas: [{ pregunta: String, respuesta: String }],  // 6 preguntas
  },

  ctaFinal: {
    titulo: String,
    parrafo: String,
    boton: { texto: String, usaRegistro: true },
  },

  footer: {
    redesTitulo: String,
    redes: [{
      nombre: String,        // texto visible y accesible
      url: String,
      icono: "instagram" | "facebook" | "linkedin" | "x" | "youtube" | "tiktok" | "web",
    }],
    credito: String,
    legal: String,
    volverArriba: String,
  },
};

// Imagen = { src: String, alt: String, ancho: Number, alto: Number }
//   alt ""  -> imagen decorativa (alt vacío + aria-hidden)
//   ancho/alto: dimensiones reales del archivo (evitan saltos de layout)
//   src ""  -> se muestra el gradiente de respaldo
```

### Enlaces de un CTA

Cada CTA es `{ texto, usaRegistro: true }` (usa `registro.url`) o
`{ texto, href, nuevaPestana? }` con su propio destino. Los enlaces de sección usan
`"#id"` de una sección existente: `hero`, `por-que`, `wtm`, `evento`, `agenda`,
`cifras`, `faq`, `cta-final`.

### Enlaces pendientes

Mientras no exista el enlace real, cualquier `url`/`href` que termine en `-pendiente`
(p. ej. `#registro-pendiente`, `#instagram-pendiente`) muestra el aviso
`sitio.avisoPendiente` y no navega. Así no queda ningún botón muerto. Antes de
publicar, busca `-pendiente` y `[BORRADOR]` en `contenido.js`: no debería quedar
ninguno.

## Accesibilidad y movimiento

- Un solo `h1`, jerarquía h2/h3, landmarks `header`/`nav`/`main`/`footer`, skip link a `#contenido`.
- Menú móvil: `aria-expanded`, foco atrapado, cierre con Escape o al elegir una opción;
  el resto de la página queda `inert` mientras está abierto.
- FAQ: botones con `aria-expanded`/`aria-controls`, paneles `role="region"`;
  flechas, Inicio y Fin mueven el foco entre preguntas.
- Con `prefers-reduced-motion: reduce` no hay scrubbing (solo póster), ni conteo
  animado, ni revelado, ni scroll suave.
- Contraste: el velo del hero mantiene el texto por encima de AA incluso sobre un
  cuadro blanco (medido de 320 a 1440 px). En modo scrub el texto nunca queda a media
  opacidad: o se lee con el velo a pleno, o está oculto (ver paso 7 del video).

## Especificaciones y reglas para agentes

El proyecto sigue un flujo guiado por especificaciones con el formato de
[Curso-SDD-Mobile](https://github.com/ArisGuimera/Curso-SDD-Mobile) adaptado a web:

- [`AGENTS.md`](AGENTS.md): reglas del proyecto para agentes de IA (`CLAUDE.md` lo importa).
- [`docs/`](docs/README.md): plantillas, guía web, reglas genéricas y prompts para cada etapa.
- `docs/features/landing-wtm/` y `docs/features/video-scroll-portada/`: `SPEC.md`,
  `PLAN.md` y `TASKS.md` de cada funcionalidad, con la evidencia de validación.
