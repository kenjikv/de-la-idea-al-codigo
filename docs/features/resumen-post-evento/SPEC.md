# SPEC: Resumen después del evento

**Estado:** En revisión <!-- Borrador | En revisión | Aprobada -->

<!-- Ejemplo de la charla: una funcionalidad nueva que recorre el flujo desde el principio.
Está completa, pero no aprobada: tiene decisiones pendientes que le tocan a la persona y
a la organización. -->

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

Desde el día siguiente al encuentro, la página deja de invitar a registrarse y cuenta cómo
fue: fotos, cifras de la jornada, materiales de las charlas y cómo seguir en la comunidad.

- Quien asistió vuelve a buscar fotos y materiales.
- Quien no fue llega por un enlace compartido y ve qué se perdió y cómo sumarse.
- La organización muestra el impacto del encuentro a la comunidad y a sus aliados.

## Situación actual

<!-- Comportamiento actual relevante, limitación que resolvemos y comportamientos que hay
que conservar. No describas la arquitectura. -->

Desde el 25 de octubre, el bloque del evento ya agradece la asistencia (`landing-wtm`,
CA-06). Pero el resto de la página sigue pidiendo el registro en Luma: la portada, la
cabecera, el bloque del evento y el cierre. Las preguntas frecuentes hablan del costo y de
cómo llegar. Además, el cambio de día se calcula con la hora de quien visita, no con la de
Bolivia.

Se conservan la historia del 11 de octubre, qué es WTM, las cifras de la brecha, la
agenda y las redes.

## Dentro del alcance

<!-- Requisitos concretos con identificadores estables para vincularlos a criterios,
decisiones del plan y tareas. -->

- **RF-01:** Desde el día siguiente al evento, según la hora de Bolivia, la página pasa
  sola al modo resumen, sin publicar una versión nueva.
- **RF-02:** En el modo resumen ningún botón invita a registrarse; los botones principales
  llevan a seguir a la comunidad.
- **RF-03:** La portada dice que el encuentro ya pasó y ofrece ver cómo fue.
- **RF-04:** Una sección «Así fue» muestra una galería de fotos del encuentro, cada una
  con su descripción, que se pueden ampliar.
- **RF-05:** La sección muestra las cifras de la jornada con su fuente y fecha.
- **RF-06:** La sección enlaza a los materiales de las charlas cuando existan.
- **RF-07:** Las preguntas frecuentes que solo valen antes del evento dejan de mostrarse.
- **RF-08:** Antes del día siguiente al evento, la página se comporta igual que hoy.

## Fuera de alcance

<!-- Exclusiones acordadas, no deducidas por el agente. Si no hay más exclusiones,
indícalo después de revisarlo con la persona. -->

- Que las asistentes suban sus propias fotos.
- Descarga de todas las fotos en un archivo.
- Video del evento, encuestas de satisfacción y formularios de suscripción.
- Certificados de participación.

## Flujo de usuario

<!-- Cómo llega la persona, qué hace y qué obtiene. Incluye secciones afectadas,
navegación y alternativas relevantes. -->

1. La persona abre el enlace después del 24 de octubre y ve en la portada «Así fue Break
   the Pattern» con el botón «Mira cómo fue».
2. El botón la lleva a la sección «Así fue»: fotos, cifras de la jornada y materiales.
3. Toca una foto para verla en grande y la cierra para seguir.
4. Desde la portada, la cabecera o el cierre puede ir a la comunidad para enterarse del
   próximo encuentro.
5. El resto de la página (historia, WTM, agenda, cifras de la brecha) sigue disponible.

## Datos y reglas de negocio

<!-- Información que necesita la persona, datos obligatorios, validaciones, límites y
reglas. Describe significado y comportamiento, sin diseñar objetos ni archivos. -->

- **Cambio de modo:** a las 00:00 del 25 de octubre de 2026, hora de Bolivia, para todas
  las visitas, estén donde estén.
- **Fotos:** solo fotos reales del encuentro, tomadas o entregadas por la organización y
  con el consentimiento de las personas que aparecen. Entre 6 y 12. No se nombra a
  asistentes sin permiso. No se generan fotos con IA para esta sección.
- **Cifras de la jornada:** las entrega la organización con su fecha. Sin fuente, no se
  publican.
- **Materiales:** los enlaces que entreguen las ponentes. Si no hay ninguno, el bloque no
  aparece.
- **Preguntas frecuentes:** cada pregunta indica si vale solo antes del evento. Si no
  queda ninguna, la sección no se muestra.

## Comportamiento web y casos alternativos

<!-- Adapta la tabla con WEB_GUIDELINES.md. Agrega escenarios relevantes. Marca No aplica
con su motivo. Expresa resultados, no mecanismos técnicos. -->

| Situación | Comportamiento esperado |
| --- | --- |
| Carga en curso | El texto y los botones aparecen sin esperar a la galería. |
| Red lenta o primera visita sin caché | Las fotos son livianas y se piden al acercarse a la sección. |
| Recurso que falla o tarda demasiado | Una foto que no carga deja un degradado en su lugar, sin hueco. |
| Sin JavaScript | El aviso no debe mandar a registrarse en Luma (ver decisiones pendientes). |
| Movimiento reducido | La galería y la ampliación no tienen animaciones. |
| Recargar o volver atrás | La persona vuelve al mismo punto de lectura. |
| Enlace directo a «Así fue» | La sección queda visible debajo de la cabecera. |
| Anchos de 320 a 1920 px y zoom | La galería pasa de una columna en el celular a varias en escritorio, sin desborde. |
| Teclado y lector de pantalla | Cada foto tiene descripción. La ampliación se abre con Enter, se cierra con Escape y el foco vuelve a la foto. |
| Compartir el enlace en redes | Ver decisiones pendientes: los rastreadores no ejecutan JavaScript. |
| Visita desde otra zona horaria | El modo cambia a la medianoche de Bolivia, no a la de quien visita. |
| Página abierta al llegar la medianoche | Cambia de modo al recargar. |
| Privacidad de las fotos | Las fotos publicadas no llevan ubicación ni otros metadatos de la cámara. |

**Puntos de la guía no aplicables y motivo:** formularios y almacenamiento de datos
personales (no se piden datos); idiomas (solo español).

## Restricciones del pedido

<!-- Condiciones ya impuestas: navegadores, accesibilidad o rendimiento medibles,
herramientas o tecnologías exigidas expresamente. No conviertas una preferencia del
agente en restricción. -->

- Pedido de la organización: «después del evento la página no debe seguir pidiendo el
  registro; queremos mostrar cómo fue».
- Nadie debe tener que publicar a medianoche para que la página cambie.
- Las fotos son reales y con consentimiento.

## Criterios de aceptación

<!-- Resultados observables que permiten decidir si se cumple cada requisito. Incluye los
casos alternativos acordados. No uses «funciona correctamente». -->

- **CA-01 · RF-01:** Dado el 25-oct-2026 a las 00:05 hora de Bolivia, cuando se abre la
  página, entonces está en modo resumen.
- **CA-02 · RF-01:** Dado un navegador en Madrid el 25-oct-2026 a las 03:00 hora local
  (21:00 del 24 en Bolivia), cuando se abre la página, entonces sigue en modo evento.
- **CA-03 · RF-02:** Dado el modo resumen, cuando se revisan todos los enlaces visibles,
  entonces ninguno lleva a luma.com y los botones principales llevan a la comunidad.
- **CA-04 · RF-03:** Dado el modo resumen, cuando carga la portada, entonces dice que el
  encuentro ya pasó y el botón «Mira cómo fue» lleva a la sección «Así fue».
- **CA-05 · RF-04:** Dada la galería, cuando se recorre, entonces muestra entre 6 y 12 fotos,
  cada una con su descripción, sin desborde de 320 a 1920 px.
- **CA-06 · RF-04:** Dado el foco en una foto, cuando se pulsa Enter, entonces se amplía;
  con Escape se cierra y el foco vuelve a la misma foto.
- **CA-07 · RF-04:** Dada la galería, cuando se carga la página, entonces ninguna foto pesa
  más de 200 KB y no se piden hasta acercarse a la sección.
- **CA-08 · RF-05:** Dadas las cifras de la jornada, cuando se leen, entonces cada una
  muestra su fuente y fecha.
- **CA-09 · RF-06:** Dada una lista de materiales vacía, cuando se abre la sección, entonces
  el bloque no aparece; con materiales, cada enlace abre en pestaña nueva y responde.
- **CA-10 · RF-07:** Dado el modo resumen, cuando se abre la sección de preguntas, entonces
  no aparece ninguna marcada como válida solo antes del evento.
- **CA-11 · RF-08:** Dado el 24-oct-2026 en Bolivia, cuando se abre la página, entonces los
  criterios de `landing-wtm` siguen cumpliéndose.

## Cómo se comprueba el comportamiento

<!-- Una fila por criterio: escenario y resultado a comprobar. Herramientas, comandos y
evidencias van en PLAN.md. No marques criterios como superados en esta etapa. -->

| Criterio | Condiciones y pasos | Resultado esperado |
| --- | --- | --- |
| CA-01 | Fijar la fecha al 25-oct-2026 00:05 en Bolivia | Modo resumen |
| CA-02 | Zona horaria de Madrid, 25-oct-2026 03:00 | Modo evento |
| CA-03 | Modo resumen; listar los enlaces visibles | Ninguno a luma.com |
| CA-04 | Modo resumen; activar «Mira cómo fue» | Sección «Así fue» a la vista |
| CA-05 | Recorrer la galería en 9 anchos | 6 a 12 fotos con descripción; sin desborde |
| CA-06 | Solo con teclado: Enter y Escape en una foto | Se amplía, se cierra y el foco vuelve |
| CA-07 | Medir el peso de cada foto y el momento en que se pide | ≤ 200 KB; se piden al acercarse |
| CA-08 | Leer las cifras de la jornada | Fuente y fecha en cada una |
| CA-09 | Probar con lista vacía y con materiales | Bloque oculto; enlaces que responden |
| CA-10 | Modo resumen; abrir las preguntas | Ninguna de antes del evento |
| CA-11 | Repetir las pruebas de `landing-wtm` el 24-oct | Mismos resultados que hoy |

## Decisiones pendientes

<!-- Al resolverlas, actualiza las secciones afectadas. Escribe Ninguna cuando no queden
pendientes. -->

- **PENDIENTE (organización):** qué fotos se publican y cómo se registró el consentimiento.
- **PENDIENTE (organización):** cifras de la jornada (asistentes, charlas, ponentes) y su
  fecha.
- **PENDIENTE (ponentes):** materiales que se enlazan.
- **PENDIENTE:** a dónde llevan los botones de comunidad: Linktree de WTM o
  gdg.community.dev.
- **PENDIENTE:** vista previa en redes y aviso sin JavaScript. Los rastreadores y el aviso
  `noscript` leen el HTML tal como se publicó, así que no cambian solos (choca con RF-01).
  Opciones: publicar una versión con textos de resumen el 25 de octubre, o aceptar que la
  vista previa siga anunciando el evento. Recomendación del agente: publicar esa versión.

<!-- ANTES DE PEDIR LA APROBACIÓN
Comprueba que el alcance está acordado, el flujo es coherente, los puntos web relevantes
están cubiertos y cada requisito tiene criterios comprobables. Resuelve los marcadores
PENDIENTE. Mantén el diseño técnico en PLAN.md.
-->
