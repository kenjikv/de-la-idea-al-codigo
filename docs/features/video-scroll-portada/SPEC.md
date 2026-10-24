# SPEC: Video de la portada ligado al scroll

**Estado:** Aprobada <!-- Borrador | En revisión | Aprobada -->

<!-- Historial: aprobada el 24-oct-2026; devuelta a revisión el mismo día porque la
verificación en el sitio publicado abrió una decisión de producto (primera visita con red
lenta); aprobada de nuevo el 24-oct-2026 tras la decisión de la persona. -->

<!-- PARA LA PERSONA
Copia esta plantilla como SPEC.md en la carpeta de la funcionalidad
(docs/features/<nombre>/). Pide al agente que la complete contigo usando
WEB_GUIDELINES.md. SPEC.md define qué debe cumplirse; PLAN.md, cómo implementarlo;
TASKS.md organiza los pasos.
-->

<!-- PARA EL AGENTE
- Lee AGENTS.md y WEB_GUIDELINES.md. Revisa el repositorio y el sitio publicado para
  comprobar el comportamiento actual. Si falta la guía, pide su ubicación.
- Completa esta spec con la persona: investiga lo comprobable y consulta lo que hay que
  decidir. Haz pocas preguntas por vez y actualiza con las respuestas.
- No inventes requisitos ni exclusiones. Distingue propuestas de decisiones confirmadas y
  marca como PENDIENTE lo que no esté resuelto.
- Aplica los puntos web pertinentes sin ampliar el alcance por tu cuenta.
- No incluyas archivos, funciones, estructuras de datos ni algoritmos: eso va en PLAN.md.
  Sí registra las restricciones explícitas del pedido.
- Mantén el documento breve y proporcional a la funcionalidad. Conserva los comentarios.
- Un documento completo no está aprobado. Pide la aprobación antes de marcarlo como
  Aprobada. No implementes en esta etapa.
-->

## Qué construimos y para quién

<!-- Qué necesidad resolvemos, quién la tiene y qué podrá hacer. En lenguaje de producto. -->

En la portada, un video corto del evento avanza cuadro a cuadro cuando la persona baja y
retrocede cuando sube, como si el scroll fuera la línea de tiempo. Busca el impacto que
pidió la organización para quien llega desde redes, sin sacrificar la lectura, la
accesibilidad ni el registro.

## Situación actual

<!-- Comportamiento actual relevante, limitación que resolvemos y comportamientos que hay
que conservar. No describas la arquitectura. -->

La portada de `landing-wtm` muestra el título, el botón de registro y una imagen fija.
Hay que conservar que el título y el botón se vean al cargar (CA-01 de `landing-wtm`) y
que registrarse siga a un toque.

## Dentro del alcance

<!-- Requisitos concretos con identificadores estables para vincularlos a criterios,
decisiones del plan y tareas. -->

- **RF-01:** Al bajar por la portada, el video avanza en proporción al recorrido.
- **RF-02:** Al subir, el video retrocede.
- **RF-03:** Si el video no se puede usar (falla, tarda, el navegador no permite saltar
  dentro de él o la persona pidió reducir el movimiento), se muestra la imagen fija con el
  texto legible.
- **RF-04:** El texto de la portada está legible o retirado; nunca queda a medias sobre el
  video.
- **RF-05:** Recargar a mitad de la página, o que el video termine de cargar mientras se
  lee, no cambia el punto de lectura.
- **RF-06:** El video nunca se reproduce solo ni tiene sonido.
- **RF-07:** Fuera de la portada, el video no le da trabajo al navegador.

## Fuera de alcance

<!-- Exclusiones acordadas, no deducidas por el agente. Si no hay más exclusiones,
indícalo después de revisarlo con la persona. -->

- Controles de reproducción y audio.
- Varios videos o calidad adaptable según la red.
- Video en otras secciones.

## Flujo de usuario

<!-- Cómo llega la persona, qué hace y qué obtiene. Incluye secciones afectadas,
navegación y alternativas relevantes. -->

1. La persona abre la página y ve el título y el botón de registro sobre la imagen fija.
2. Cuando el video está listo, la portada se alarga y el video reemplaza a la imagen.
3. Al bajar, el video avanza; el texto sigue legible hasta pasar el 78 % del recorrido.
4. Pasado ese punto el texto se retira y el video se aclara hasta el final de la portada.
5. Al subir, el video retrocede y el texto vuelve por debajo del 76 %.
6. Si el video no se puede usar, la portada queda como una pantalla con la imagen fija.

## Datos y reglas de negocio

<!-- Información que necesita la persona, datos obligatorios, validaciones, límites y
reglas. Describe significado y comportamiento, sin diseñar objetos ni archivos. -->

- Video de unos 10 segundos generado para el evento, sin sonido.
- Con el efecto activo, la portada ocupa tres pantallas de alto; con la imagen fija, una.
- El texto se retira al pasar el 78 % del recorrido y vuelve por debajo del 76 %. Si el
  foco del teclado está dentro del texto, no se retira.
- Espera máxima para tener el video listo: 6 segundos. Después, imagen fija.
- **Decisión (24-oct-2026):** con una red lenta, la primera visita puede mostrar la imagen
  fija en lugar del video. Se acepta como alternativa prevista; no se alarga la espera ni
  se cambia el video.

## Comportamiento web y casos alternativos

<!-- Adapta la tabla con WEB_GUIDELINES.md. Agrega escenarios relevantes. Marca No aplica
con su motivo. Expresa resultados, no mecanismos técnicos. -->

| Situación | Comportamiento esperado |
| --- | --- |
| Carga en curso | Se ve la imagen fija con el texto. Nunca una pantalla negra. |
| Red lenta o primera visita sin caché | Si el video no está listo en 6 s, queda la imagen fija y la portada ocupa una pantalla. Aceptado: no es un fallo. |
| Recurso que falla o tarda demasiado | Imagen fija con el texto legible. |
| Servidor sin peticiones por rango | El efecto funciona igual. |
| Navegador que no permite saltar dentro del video (a veces Safari en iOS) | Imagen fija. |
| Sin JavaScript | No aplica aquí: lo resuelve el aviso de `landing-wtm`. |
| Movimiento reducido | Imagen fija desde el inicio y el video no se descarga. Si se activa con la página abierta, pasa a la imagen fija. |
| Recargar o volver atrás | Misma posición de lectura, aunque la portada cambie de alto. |
| Desplazamiento rápido | El video llega a la posición final sin trabarse. |
| Enlace directo a una sección | La sección queda a la vista aunque la portada se alargue después. |
| Teclado y lector de pantalla | El texto retirado no recibe foco ni se lee. |
| Fuera de la portada o pestaña oculta | El video no trabaja. |

**Puntos de la guía no aplicables y motivo:** compartir en redes, contenido y fuentes
(son de `landing-wtm`); formularios, almacenamiento de datos personales e idiomas (no
intervienen).

## Restricciones del pedido

<!-- Condiciones ya impuestas: navegadores, accesibilidad o rendimiento medibles,
herramientas o tecnologías exigidas expresamente. No conviertas una preferencia del
agente en restricción. -->

- «Integra el video para que avance al bajar con el scroll y retroceda al subir.»
- El video se genera con Seedance 2.5 mediante la skill de Higgsfield.
- «Textos legibles»: contraste WCAG 2.2 AA también sobre el video.

## Criterios de aceptación

<!-- Resultados observables que permiten decidir si se cumple cada requisito. Incluye los
casos alternativos acordados. No uses «funciona correctamente». -->

- **CA-01 · RF-01:** Dado el efecto activo en 1280 × 800 px, cuando bajo al 20, 40, 60, 80
  y 100 % del recorrido y me detengo, entonces el video está en esa misma proporción de su
  duración, con un error de 1/60 s como máximo.
- **CA-02 · RF-02:** Dado que estoy al 100 %, cuando subo al 80, 60, 40, 20 y 0 %, entonces
  el video retrocede a esas proporciones con el mismo margen.
- **CA-03 · RF-03:** Dado que el video responde con error, tarda más de 6 s o no permite
  saltar, cuando abro la página, entonces veo la imagen fija, el texto legible y una
  portada de una pantalla.
- **CA-04 · RF-03:** Dada la preferencia de movimiento reducido, cuando abro la página,
  entonces no se pide el video y se ve la imagen fija.
- **CA-05 · RF-04:** Dado el efecto activo, cuando me detengo en cualquier punto de la
  portada, entonces el texto está completo sobre el velo oscuro, con contraste AA, o
  retirado y oculto para el lector de pantalla.
- **CA-06 · RF-05:** Dado que estoy a 800 px (dentro de la portada) o a 4500 px, cuando
  recargo, entonces vuelvo a la misma posición.
- **CA-07 · RF-05:** Dado un video que tarda 4 s en llegar, cuando bajo a 400 px mientras
  carga, entonces sigo en 400 px cuando el efecto se activa.
- **CA-08 · RF-06:** Dada la página cargada, cuando la observo sin tocarla, entonces el
  video no avanza solo y no suena.
- **CA-09 · RF-07:** Dado que estoy fuera de la portada, cuando espero 2 s, entonces no
  queda trabajo de animación pendiente.

## Cómo se comprueba el comportamiento

<!-- Una fila por criterio: escenario y resultado a comprobar. Herramientas, comandos y
evidencias van en PLAN.md. No marques criterios como superados en esta etapa. -->

| Criterio | Condiciones y pasos | Resultado esperado |
| --- | --- | --- |
| CA-01 | Bajar a 5 posiciones y esperar 1 s en cada una | Tiempo del video proporcional, error ≤ 1/60 s |
| CA-02 | Subir a 5 posiciones y esperar 1 s en cada una | Tiempo del video decreciente y proporcional |
| CA-03 | Forzar un 404, una demora sin respuesta y un servidor sin salto | Imagen fija y portada de una pantalla |
| CA-04 | Abrir con movimiento reducido | Ninguna petición del video; imagen fija |
| CA-05 | Detenerse en 6 puntos de la portada en 1280 y 320 px | Texto completo con AA, u oculto |
| CA-06 | Recargar desde 800 y desde 4500 px | Misma posición |
| CA-07 | Retrasar el video 4 s y bajar a 400 px durante la carga | Sigue en 400 px |
| CA-08 | Cargar y observar 5 s sin interactuar | El video no avanza; no hay pista de audio |
| CA-09 | Ir más abajo de la portada y esperar 2 s | Sin cuadros de animación pendientes |

## Decisiones pendientes

<!-- Al resolverlas, actualiza las secciones afectadas. Escribe Ninguna cuando no queden
pendientes. -->

Ninguna.

- **Resuelta el 24-oct-2026 · primera visita con red lenta.** En el sitio publicado, la
  primera visita justo después de publicar se quedó con la imagen fija (~11 s) porque el
  CDN aún no tenía el video; las siguientes activaron el efecto en menos de 3 s. Opciones:
  aceptarlo como alternativa prevista (RF-03), alargar la espera o aligerar el video
  (7,3 MB). **Decisión de la persona: se acepta.** Queda reflejada en «Datos y reglas de
  negocio» y en la tabla de comportamiento web.

<!-- ANTES DE PEDIR LA APROBACIÓN
Comprueba que el alcance está acordado, el flujo es coherente, los puntos web relevantes
están cubiertos y cada requisito tiene criterios comprobables. Resuelve los marcadores
PENDIENTE. Mantén el diseño técnico en PLAN.md.
-->
