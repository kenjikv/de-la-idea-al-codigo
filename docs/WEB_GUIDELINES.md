# Web Guidelines

Al crear una especificación web, revisa estos puntos y aplica los que correspondan a la
funcionalidad. Si falta definir un comportamiento, consúltalo antes de asumirlo.

- **Navegadores y motores:** contemplar Chrome, Safari (incluido iOS) y Firefox. Definir
  qué pasa cuando una capacidad no existe en un motor y comprobarla con una prueba real,
  no adivinando por el user agent.
- **Anchos y adaptación visual:** contemplar anchos de 320 a 1920 px, orientación, zoom al
  200 % y textos más grandes. Evitar scroll horizontal, contenido cortado y controles
  inalcanzables.
- **Carga y rendimiento:** definir qué se ve primero y qué puede esperar. Considerar el
  peso de imágenes y video, la carga diferida, el primer contenido visible y que la
  interfaz no se bloquee mientras llegan los medios.
- **Red lenta, primera visita y caché:** diferenciar la primera visita (sin caché, con el
  CDN recién publicado) de las siguientes. Contemplar red lenta, recursos que no llegan y
  servidores que no aceptan peticiones por rango.
- **Estados de interfaz:** contemplar carga, contenido, vacío, error y alternativas
  visibles. No dejar huecos en blanco ni pantallas negras mientras algo carga.
- **Recarga, historial y anclas:** considerar recargar a mitad de página, volver atrás,
  abrir un enlace directo a una sección (`#ancla`) y la cabecera fija que tapa los
  títulos. Definir qué posición de lectura se conserva.
- **Enlaces y acciones:** definir destino, pestaña nueva y qué pasa con enlaces que aún no
  existen. Evitar enlaces vacíos o `#` sueltos.
- **Accesibilidad:** considerar teclado, orden y visibilidad del foco, lector de pantalla,
  etiquetas, jerarquía de encabezados, contraste AA y áreas táctiles. No comunicar
  información solo con color o con movimiento.
- **Movimiento y animación:** respetar `prefers-reduced-motion`. Definir la alternativa
  quieta de cada animación o video.
- **Sin JavaScript:** definir qué ve una persona o un rastreador que no ejecuta JavaScript.
- **Metadatos y redes:** título, descripción e imagen para compartir (`og:*`,
  `twitter:*`), URL canónica e idioma. Los rastreadores de redes no ejecutan JavaScript.
- **Privacidad y terceros:** definir si hay cookies, analítica, formularios o
  peticiones a terceros. No exponer datos personales ni enviar datos sin necesidad.
- **Contenido y fuentes:** toda cifra o dato histórico con su fuente y año. Definir qué
  hacer con datos sin confirmar.
- **Idioma, fechas y zona horaria:** idioma del contenido, formato de fechas y números, y
  la zona horaria con la que se calcula un evento (America/La_Paz).
- **Publicación:** qué archivos se publican y cuáles no, dónde, y cómo se comprueba que
  lo publicado es lo verificado.
- **Validación web:** incluir pruebas en varios anchos, con teclado, con movimiento
  reducido, con red lenta o recursos fallidos, al recargar y en el sitio publicado.
  Complementar las pruebas automáticas con revisiones en dispositivos y navegadores
  reales cuando lo que se valida dependa de ellos.

Estos puntos no amplían el alcance por sí solos. Incorpora a `SPEC.md` los requisitos y
criterios de aceptación que salgan de los puntos aplicables y de las decisiones
confirmadas.
