# SPEC: Landing Break the Pattern

**Estado:** Aprobada <!-- Borrador | En revisión | Aprobada -->

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

Una página única para **Break the Pattern**, el encuentro de Women Techmakers Santa Cruz por
el Día de la Mujer Boliviana. Está pensada para estudiantes, profesionales y curiosas que
llegan desde un enlace compartido en WhatsApp, Instagram o Facebook, casi siempre desde el
celular. En pocos segundos deben entender qué es el evento, por qué se celebra el 11 de
octubre, cuándo y dónde es, y registrarse en Luma con un toque.

## Situación actual

<!-- Comportamiento actual relevante, limitación que resolvemos y comportamientos que hay
que conservar. No describas la arquitectura. -->

No existe una página propia. La convocatoria vive en la página de registro de Luma y en
las redes de GDG y WTM Santa Cruz. Se conserva Luma como único lugar de registro: la
página no reemplaza su formulario ni su aprobación de inscripciones.

## Dentro del alcance

<!-- Requisitos concretos con identificadores estables para vincularlos a criterios,
decisiones del plan y tareas. -->

- **RF-01:** La portada muestra el nombre del evento, a quién convoca y un botón de
  registro, visibles sin desplazarse en un celular.
- **RF-02:** Todos los botones de registro llevan a la misma página de Luma, en una pestaña
  nueva.
- **RF-03:** Una sección explica por qué el 11 de octubre: Adela Zamudio y la norma que
  instituyó la fecha.
- **RF-04:** Una sección explica qué es Women Techmakers, con tres pilares.
- **RF-05:** Una sección del evento muestra fecha, hora, sede, dirección con enlace al
  mapa y modalidad, más un mensaje que cambia según el día.
- **RF-06:** Una agenda presenta los bloques de la jornada en orden.
- **RF-07:** Una sección de cifras muestra cada dato con su fuente y año.
- **RF-08:** Las preguntas frecuentes se abren y cierran una a una.
- **RF-09:** Un menú lleva a cada sección; en el celular es desplegable.
- **RF-10:** El pie enlaza solo a las redes oficiales verificadas.
- **RF-11:** Al compartir el enlace, las redes muestran el título, la descripción y la
  imagen del evento.
- **RF-12:** La organización puede cambiar textos, fechas y enlaces en un solo lugar, sin
  tocar la estructura de la página.
- **RF-13:** Los textos son legibles en toda la página.
- **RF-14:** La página se adapta al celular.
- **RF-15:** La página se puede recorrer por completo con teclado y lector de pantalla.

## Fuera de alcance

<!-- Exclusiones acordadas, no deducidas por el agente. Si no hay más exclusiones,
indícalo después de revisarlo con la persona. -->

- Formulario de registro propio: el registro y su aprobación siguen en Luma.
- Gestor de contenidos y versión en otros idiomas.
- Analítica, cookies o seguimiento.
- El video de la portada ligado al scroll: es la funcionalidad `video-scroll-portada`.

## Flujo de usuario

<!-- Cómo llega la persona, qué hace y qué obtiene. Incluye secciones afectadas,
navegación y alternativas relevantes. -->

1. La persona abre el enlace compartido y ve la portada con el nombre del evento y el
   botón «Regístrate en Luma».
2. Si ya está decidida, toca el botón y Luma se abre en una pestaña nueva.
3. Si quiere saber más, baja o usa el menú: por qué el 11 de octubre, qué es WTM, el
   evento, la agenda, las cifras y las preguntas frecuentes.
4. Desde cualquier punto puede registrarse con el botón de la cabecera fija, el del
   evento o el del cierre.
5. En el pie encuentra las redes oficiales para seguir a la comunidad.

## Datos y reglas de negocio

<!-- Información que necesita la persona, datos obligatorios, validaciones, límites y
reglas. Describe significado y comportamiento, sin diseñar objetos ni archivos. -->

- **Marca:** se escribe «Women Techmakers» (abreviada WTM) y no se traduce. El lema es
  «Break the Pattern».
- **Evento:** sábado 24 de octubre de 2026, Universidad Evangélica Boliviana, Barrio Cruz
  del Sur 117, Av. Moscú y Sexto Anillo, Santa Cruz de la Sierra. Presencial y gratuito.
- **Hora:** no es pública. La página la remite a la confirmación de Luma.
- **Registro:** `https://luma.com/5odhuh0l`. Requiere aprobación de las organizadoras.
- **Mensaje según el día** (hora de Bolivia): con fecha y hora confirmadas, cuenta
  regresiva; sin hora, el día del evento dice que es hoy; desde el día siguiente, un
  mensaje de agradecimiento.
- **Cifras:** solo datos de `contenido/INVESTIGACION.md`, con la misma fuente, año y
  decimales. La cifra de personas registradas lleva su fecha de consulta.
- **Redes:** Instagram de GDG Santa Cruz, Facebook de WTM Santa Cruz, Linktree de WTM y
  gdg.community.dev. Meetup y LinkedIn no se enlazan: no se encontró una cuenta oficial
  activa.
- **Enlaces sin destino todavía:** muestran un aviso en vez de llevar a ninguna parte.
- **Datos que la organización no confirmó:** no se inventan; quedan como pendientes.

## Comportamiento web y casos alternativos

<!-- Adapta la tabla con WEB_GUIDELINES.md. Agrega escenarios relevantes. Marca No aplica
con su motivo. Expresa resultados, no mecanismos técnicos. -->

| Situación | Comportamiento esperado |
| --- | --- |
| Carga en curso | El texto y los botones aparecen sin esperar a las imágenes ni al video. |
| Red lenta o primera visita sin caché | Se puede leer y registrarse antes de que lleguen los medios. Las imágenes lejanas se piden al acercarse. |
| Recurso que falla o tarda demasiado | Una imagen que no carga deja un degradado en su lugar, nunca un hueco. El video se trata en `video-scroll-portada`. |
| Sin JavaScript | Se muestra un aviso con el enlace de registro a Luma. |
| Movimiento reducido | Sin animaciones de entrada; las cifras aparecen con su valor final. |
| Recargar o volver atrás | La persona vuelve al mismo punto de lectura (ver `video-scroll-portada`, que cambia la altura de la portada). |
| Enlace directo a una sección | La sección queda visible debajo de la cabecera fija. |
| Anchos de 320 a 1920 px y zoom | Sin scroll horizontal ni controles cortados. |
| Teclado y lector de pantalla | Todo se usa con teclado y el foco siempre se ve. El menú del celular retiene el foco y se cierra con Escape. Las imágenes informativas tienen descripción. |
| Compartir el enlace en redes | Vista previa con título, descripción e imagen del evento. |
| Día siguiente al evento | El mensaje ya no dice que es hoy: agradece y anuncia próximos encuentros. |

**Puntos de la guía no aplicables y motivo:** formularios (el registro está en Luma);
almacenamiento de datos personales y privacidad de formularios (la página no pide datos);
idiomas (solo español); permisos del navegador (no se usan).

## Restricciones del pedido

<!-- Condiciones ya impuestas: navegadores, accesibilidad o rendimiento medibles,
herramientas o tecnologías exigidas expresamente. No conviertas una preferencia del
agente en restricción. -->

- «Textos legibles»: se traduce como contraste WCAG 2.2 AA (4,5:1 en texto normal, 3:1 en
  texto grande).
- «Botones funcionales» y «adaptación a celular».
- La investigación y el copy los hace Antigravity con Gemini 3.8 Flash; las imágenes, la
  skill de Higgsfield con GPT Image 2.5; el desarrollo, Claude Code con Opus 5.5; la
  comprobación, Codex.
- El diseño lo elige el agente.

## Criterios de aceptación

<!-- Resultados observables que permiten decidir si se cumple cada requisito. Incluye los
casos alternativos acordados. No uses «funciona correctamente». -->

- **CA-01 · RF-01:** Dado un celular de 375 × 812 px, cuando termina de cargar la página,
  entonces se ven «Break the Pattern» y el botón «Regístrate en Luma» sin desplazarse.
- **CA-02 · RF-02:** Dado cualquiera de los cuatro botones de registro, cuando se activa,
  entonces se abre `https://luma.com/5odhuh0l` en una pestaña nueva.
- **CA-03 · RF-03:** Dada la sección «Por qué», cuando se lee, entonces cita el Decreto
  Supremo 7352 de 1965 y la Ley 339 de 1967 tal como figuran en la investigación.
- **CA-04 · RF-04:** Dada la sección «¿Qué es Women Techmakers?», cuando se lee, entonces
  muestra tres pilares con título y texto.
- **CA-05 · RF-05:** Dado el 24 de octubre de 2026, cuando se abre la página, entonces el
  evento dice que es hoy y remite al horario de la confirmación de Luma.
- **CA-06 · RF-05:** Dado el 25 de octubre de 2026, cuando se abre la página, entonces el
  mensaje agradece la asistencia y no dice «Es hoy».
- **CA-07 · RF-06:** Dada la agenda, cuando se lee, entonces muestra los cinco bloques de
  la jornada en orden.
- **CA-08 · RF-07:** Dada la sección de cifras, cuando terminan los contadores, entonces
  cada valor, fuente y año coincide con la investigación, incluido 29,2 %, y el +330
  tiene fecha de consulta documentada.
- **CA-09 · RF-08:** Dado el foco en una pregunta, cuando se pulsa Enter o Espacio,
  entonces se abre o se cierra; con las flechas, Inicio y Fin el foco pasa entre preguntas.
- **CA-10 · RF-09:** Dado el menú, cuando se elige una sección, entonces su título queda
  visible bajo la cabecera; en el celular, Escape cierra el menú y devuelve el foco al
  botón.
- **CA-11 · RF-10:** Dados los enlaces del pie, cuando se siguen, entonces llevan a las
  cuentas oficiales listadas y responden.
- **CA-12 · RF-11:** Dado el HTML que recibe un rastreador sin ejecutar JavaScript,
  cuando se lee su `<head>`, entonces título, descripción, `og:*` y `twitter:*` coinciden
  con el contenido de la página.
- **CA-13 · RF-12:** Dado un cambio de texto en el archivo de contenido, cuando se recarga,
  entonces el cambio aparece sin editar la estructura, y no se ven marcadores como
  BORRADOR o TODO.
- **CA-14 · RF-13:** Dados textos, tarjetas, agenda, cifras, preguntas y pie, cuando se
  mide el contraste, entonces cumple AA.
- **CA-15 · RF-14:** Dados anchos de 320 a 1920 px, cuando se recorre la página, entonces
  no hay scroll horizontal y los controles miden al menos 44 × 44 px.
- **CA-16 · RF-15:** Dada la página, cuando se recorre con Tab, entonces el primer foco es
  «Saltar al contenido», el foco siempre se ve, hay un solo `h1` y los encabezados no
  saltan niveles.

## Cómo se comprueba el comportamiento

<!-- Una fila por criterio: escenario y resultado a comprobar. Herramientas, comandos y
evidencias van en PLAN.md. No marques criterios como superados en esta etapa. -->

| Criterio | Condiciones y pasos | Resultado esperado |
| --- | --- | --- |
| CA-01 | Abrir en 375 × 812 px y esperar la carga | Título y botón visibles sin desplazarse |
| CA-02 | Activar cada botón de registro | Pestaña nueva con la URL exacta de Luma |
| CA-03 | Leer «Por qué» y comparar con la investigación | Norma, número y año coinciden |
| CA-04 | Leer la sección de WTM | Tres pilares completos |
| CA-05 | Fijar la fecha del navegador al 24-oct-2026 | Mensaje «Es hoy…» con remisión a Luma |
| CA-06 | Fijar la fecha del navegador al 25-oct-2026 | Mensaje de cierre, sin «Es hoy» |
| CA-07 | Leer la agenda | Cinco bloques en orden |
| CA-08 | Esperar los contadores y comparar con la investigación | Valores, fuentes y años idénticos |
| CA-09 | Operar las preguntas solo con teclado | Abren, cierran y navegan como se describe |
| CA-10 | Usar cada enlace del menú; en 320 px abrir el menú y pulsar Escape | Sección visible; menú cerrado y foco en el botón |
| CA-11 | Seguir los enlaces del pie | Cuentas oficiales que responden |
| CA-12 | Leer el HTML servido sin ejecutar JavaScript | Metadatos iguales al contenido |
| CA-13 | Cambiar un texto de prueba en el contenido y recargar | El cambio se ve; no hay marcadores |
| CA-14 | Medir el contraste de cada bloque de texto | AA en todos |
| CA-15 | Recorrer en 9 anchos entre 320 y 1920 px | Sin desborde; objetivos ≥ 44 px |
| CA-16 | Recorrer con Tab desde el inicio | Orden y foco correctos; jerarquía válida |

## Decisiones pendientes

<!-- Al resolverlas, actualiza las secciones afectadas. Escribe Ninguna cuando no queden
pendientes. -->

- **PENDIENTE (organización):** hora exacta de inicio y fin. Mientras tanto, la página
  remite a la confirmación de Luma.
- **PENDIENTE (organización):** agenda con horarios y nombres de las ponentes. Mientras
  tanto, los bloques se muestran numerados y sin hora.
- **PENDIENTE:** si `wtm-santcruz.netlify.app` es el dominio definitivo. Cuando se
  confirme, se agregan `og:url` y la URL canónica.

<!-- ANTES DE PEDIR LA APROBACIÓN
Comprueba que el alcance está acordado, el flujo es coherente, los puntos web relevantes
están cubiertos y cada requisito tiene criterios comprobables. Resuelve los marcadores
PENDIENTE. Mantén el diseño técnico en PLAN.md.
-->
