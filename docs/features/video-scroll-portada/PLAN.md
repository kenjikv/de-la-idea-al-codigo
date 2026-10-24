# PLAN: Video de la portada ligado al scroll

**SPEC de referencia:** [docs/features/video-scroll-portada/SPEC.md](SPEC.md)
**Versión de la spec revisada:** 24-oct-2026, aprobada de nuevo con la decisión sobre la primera visita con red lenta
**Estado:** Aprobado <!-- Borrador | En revisión | Aprobado -->

<!-- PARA LA PERSONA
Copia esta plantilla como PLAN.md junto a la SPEC.md aprobada. Este documento define la
solución técnica. Una vez aprobado, el agente deriva TASKS.md.
-->

<!-- PARA EL AGENTE
- Lee la SPEC.md aprobada, AGENTS.md y WEB_GUIDELINES.md. Si falta un documento o la spec
  no está aprobada, dilo antes de avanzar.
- Revisa el repositorio. Cita rutas verificadas y distingue las nuevas propuestas.
- Propón una solución proporcional al alcance y coherente con el proyecto. Reutiliza lo
  existente y justifica dependencias nuevas o cambios de arquitectura.
- Distingue hechos, decisiones confirmadas y propuestas. Consulta lo no resuelto con pocas
  preguntas por vez.
- Cita requisitos y criterios por su identificador, sin copiar la spec.
- Si una decisión cambia el comportamiento o el alcance, vuelve a la spec y pide
  confirmación. No resuelvas una duda de producto con una suposición técnica.
- Conserva estos comentarios. No implementes durante la planificación.
- Pide la aprobación antes de marcar el plan como Aprobado. La autorización para
  implementar debe ser explícita.
-->

## Contexto técnico verificado

<!-- Qué existe hoy y cómo participa en la funcionalidad. -->

| Archivo o componente existente | Ruta verificada | Responsabilidad y uso previsto |
| --- | --- | --- |
| Portada | `index.html` (`#hero`) | Contiene el texto, el póster y el elemento de video |
| Contenido de la portada | `assets/js/contenido.js` (`hero.video`) | Rutas del video y del póster |
| Estilos de la portada | `assets/css/styles.css` (`.hero`, `.hero__velo`, `.hero__contenido`) | Velo oscuro, texto y escenario |
| Póster | `assets/img/hero-poster.jpg` | Imagen fija de `landing-wtm` (T03) |

**Convenciones y patrón de referencia:** las de `AGENTS.md`. Sin dependencias en el
navegador. El estado se expone en atributos `data-` para depurar y probar.

## Solución propuesta

<!-- Enfoque y motivos. Responsabilidades y recorrido de datos y eventos hasta la
interfaz. Usa un diagrama si aclara. -->

El scroll mueve `currentTime`; el video nunca se reproduce. Una máquina de estados en
`#hero[data-video-modo]` decide si el efecto se activa:

```
            ┌─ movimiento reducido ───────────────────────────────► poster/reduce
cargando ───┼─ sin IntersectionObserver o requestAnimationFrame ──► poster/sin-soporte
            ├─ error del video ───────────────────────────────────► poster/error
            ├─ sin metadatos en 6 s ──────────────────────────────► poster/tiempo
            └─ metadatos ─► prueba real de salto (2,5 s)
                              ├─ funciona ─────────────────────────► scrub
                              └─ falla ─► carga completa en memoria (6 s) ─► nueva prueba
                                                                     └─ falla ─► poster/sin-scrub
```

En `scrub`, la portada mide 300vh y el video queda fijo (`sticky`). En cada cuadro de
animación se calcula el progreso del recorrido, se suaviza (interpolación 0,12) y se
asigna `currentTime` solo si la diferencia supera 1/60 s y el video no está buscando.
Un `IntersectionObserver` detiene el bucle fuera de la portada. Detectar el navegador
por su nombre se descartó: la prueba real de salto mide lo que de verdad funciona.

## Archivos y componentes afectados

<!-- Distingue lo que se reutiliza, modifica o crea. Las rutas nuevas son propuestas.
Señala el impacto sobre contratos o componentes compartidos. -->

| Archivo o componente | Acción | Cambio y responsabilidad | Requisito relacionado |
| --- | --- | --- | --- |
| `assets/js/scroll-video.js` | Crear | Máquina de estados, bucle, texto y restauración de la posición | RF-01–RF-07 |
| `assets/css/styles.css` | Modificar | Estados `hero--scrub` y `hero--texto-oculto`; velo; transición de 0,25 s | RF-04 |
| `assets/js/contenido.js` | Modificar | `hero.video.src` y `hero.video.poster` | RF-03 |
| `assets/video/hero.mp4` | Crear | H.264 1280 × 720, 24 fps, 241 cuadros, todos clave, sin audio, `+faststart` | RF-01, RF-06 |
| `assets/img/hero-poster.jpg` | Reutilizar | Imagen fija y alternativa | RF-03 |

Módulos: no aplica.

## Datos y contratos

<!-- Completa solo lo aplicable. Si un punto no aplica, di por qué. -->

- **Contratos de contenido y configuración:** `WTMScrollVideo.iniciar({ hero, video,
  poster, src, posterSrc })`. Estado observable: `data-video-modo` (`cargando`, `scrub`,
  `poster`) y `data-video-motivo` (`reduce`, `error`, `tiempo`, `sin-scrub`,
  `sin-soporte`).
- **Origen de los datos mostrados y transformaciones:** video de Seedance 2.5 recodificado
  con ffmpeg: Seedance entrega HEVC con fotogramas clave espaciados, que traban el salto.
- **Almacenamiento en el navegador:** `sessionStorage` (clave `wtm-scroll:<ruta>`) guarda
  la posición al salir de la página para restaurarla al recargar.
- **Servicios externos y enlaces de salida:** ninguno.
- **Compatibilidad con contenido existente:** el texto y el botón de la portada no cambian.

## Estado, eventos y errores

<!-- Cómo se implementan los comportamientos aprobados. Cita RF/CA y aplica los puntos
de WEB_GUIDELINES.md que correspondan. -->

- **Estado de la interfaz y navegación:** el texto se retira al pasar 0,78 del recorrido y
  vuelve por debajo de 0,76. Retirado lleva `aria-hidden="true"` y sus enlaces
  `tabindex="-1"`. No se retira mientras el foco está dentro. El velo se aclara solo con el
  texto ya retirado (CA-05).
- **Recarga, historial y posición de lectura:** `history.scrollRestoration = "manual"`. La
  posición se guarda en `pagehide` y se restaura dos veces: con la portada corta de
  `cargando` y con la altura definitiva. Al cambiar el alto de la portada solo se
  compensa `scrollY` si la persona ya estaba debajo de ella, y el anclaje nativo del
  navegador se apaga durante el cambio (CA-06, CA-07).
- **Eventos, temporizadores y cancelación:** límites de 6 s para cargar y 2,5 s para la
  prueba de salto. El bucle de animación se detiene fuera de la portada (CA-09). Un
  oyente de `play` pausa el video si algo intenta reproducirlo (CA-08).
- **Errores, alternativas y tiempos de espera:** todo error termina en `poster` con su
  motivo; el video solo se muestra cuando ya tiene un cuadro pintado (CA-03).
- **Otros puntos web aplicables y su solución:** cambio en vivo de la preferencia de
  movimiento reducido (CA-04); servidores sin peticiones por rango (carga en memoria).

## Dependencias, configuración y agentes

<!-- Librerías, servicios, hosting o configuración afectados. Justifica cada incorporación.
Indica si hacen falta subagentes y la responsabilidad acotada de cada uno. -->

- Ninguna dependencia en el navegador.
- ffmpeg, solo para preparar el video:
  `ffmpeg -i original.mp4 -an -c:v libx264 -pix_fmt yuv420p -crf 23 -preset slow -g 1 -movflags +faststart assets/video/hero.mp4`
- **Agentes:** skill de Higgsfield con Seedance 2.5 para el video; Claude Code (Opus 5.5)
  para recodificar e implementar; Codex (GPT-6-Astra) para el QA independiente.

## Estrategia de validación

<!-- Una fila por criterio de la spec. Elige el método capaz de demostrarlo: prueba
automática en navegador, comprobación por línea de comandos o prueba manual. Incluye
regresiones. Una captura no demuestra recarga, red ni accesibilidad. -->

| Criterio | Método y prueba existente o propuesta | Entorno y datos necesarios | Evidencia prevista |
| --- | --- | --- | --- |
| CA-01 | Playwright: 6 posiciones de bajada, `video.currentTime` tras 1 s | Chrome; servidor con y sin rangos | Tabla de tiempos y error |
| CA-02 | Playwright: 5 posiciones de subida | Igual que CA-01 | Tabla de tiempos |
| CA-03 | Playwright con `page.route`: 404, petición retenida y servidor sin salto | Chrome | Modo y motivo; alto de la portada |
| CA-04 | Playwright con `reducedMotion: 'reduce'` | Chrome | 0 peticiones del video; modo `poster/reduce` |
| CA-05 | Opacidad del texto y del velo en 6 puntos; contraste sobre capturas | Chrome, 1280 y 320 px | Estados y ratios |
| CA-06 | `qa/verificar-correcciones.cjs`: recarga desde 800 y 4500 px | Chrome | `scrollY` antes y después |
| CA-07 | `page.route` con 4 s de demora y scroll a 400 px | Chrome | `scrollY` final |
| CA-08 | Observación de `currentTime` sin interacción; `ffprobe` del archivo | Chrome; ffprobe | Tiempo constante; sin pista de audio |
| CA-09 | Contador de `requestAnimationFrame` fuera de la portada | Chrome | 0 cuadros pendientes |

**Comprobaciones de regresión:** CA-01 de `landing-wtm` (título y botón visibles al
cargar) y 0 errores de consola.

**Comandos verificados para servir y probar:** `python3 -m http.server 8080` (sin rangos:
prueba la carga en memoria); servidor con rangos para la ruta normal; Playwright con
`channel: 'chrome'` porque su Chromium no decodifica H.264.

**Pruebas en navegadores y dispositivos reales:** Safari en iPhone, Firefox y un celular
con red lenta en la primera visita.

**Limitaciones del entorno:** solo Google Chrome en macOS; la red lenta se simula con
demoras.

## Orden de implementación

<!-- Etapas y dependencias principales con puntos de comprobación. El desglose ejecutable
va en TASKS.md. -->

1. Generar y recodificar el video. Comprobación: todos los cuadros son clave.
2. Máquina de estados y alternativas. Comprobación: CA-03 y CA-04.
3. Bucle de scroll. Comprobación: CA-01, CA-02 y CA-09.
4. Texto, velo y restauración de la posición. Comprobación: CA-05 a CA-07.

## Riesgos y decisiones pendientes

<!-- Riesgos concretos de esta solución y cómo se tratan. Escribe Ninguna en las
decisiones pendientes cuando estén resueltas. -->

- **Riesgos y medidas acordadas:**
  - Safari en iOS puede ignorar el salto: la prueba real lo detecta y pasa a la imagen fija.
  - El video pesa 7,3 MB: con red lenta puede no llegar en 6 s. Pasó en la primera visita
    tras publicar. La persona aceptó que en ese caso se vea la imagen fija (spec, 24-oct):
    no hay cambios técnicos.
  - Texto ilegible sobre un video claro: velo oscuro y solo dos estados del texto.
- **Decisiones pendientes:** ninguna.

<!-- ANTES DE PEDIR LA APROBACIÓN
Comprueba que el plan cubre los requisitos, respeta las exclusiones, reutiliza lo
verificado y permite demostrar todos los criterios. Tras la aprobación, deriva TASKS.md
con identificadores, dependencias, referencias a RF/CA y comprobaciones.
-->
