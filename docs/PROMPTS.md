# Prompts

Mensajes listos para copiar y pegar en el chat del agente (Claude Code, Codex, Gemini…),
uno por etapa. El agente no lee este archivo por su cuenta: lo usa la persona. En Claude
Code también se puede citar con `@docs/PROMPTS.md`.

Reemplaza `<nombre>` por la carpeta de la funcionalidad en `docs/features/`. Cada prompt
supone que la etapa anterior está aprobada; si no lo está, el agente debe decirlo antes de
seguir.

| Etapa | Cuándo se usa |
| --- | --- |
| [1. Especificación: landing](#1-especificación-landing-break-the-pattern) | El pedido original de la landing |
| [2. Especificación: resumen después del evento](#2-especificación-resumen-después-del-evento) | El ejemplo desde cero de `resumen-post-evento` |
| [3. Plan](#3-plan) | Con la SPEC aprobada |
| [4. Tareas](#4-tareas) | Con el PLAN aprobado |
| [5. Implementación](#5-implementación) | Con las TASKS listas y tu autorización |
| [6. Validación](#6-validación) | Con la implementación terminada |

---

## 1. Especificación: landing Break the Pattern

Quiero que me ayudes a escribir la especificación de una landing para Women Techmakers Santa Cruz por el Día de la Mujer Boliviana. El evento se llama «Break the Pattern» y el registro está en Luma. Quiero un video en la portada que avance al bajar con el scroll y retroceda al subir, textos legibles, botones que funcionen y que se vea bien en el celular.

Primero, revisa el proyecto, `AGENTS.md` y `docs/WEB_GUIDELINES.md`, e incorpora al proceso las revisiones que sean pertinentes. Lee también `contenido/INVESTIGACION.md`: ahí está la investigación con fuentes.

Después, prepara un borrador de la especificación con la información que podamos comprobar, para completarlo y corregirlo juntos. Usa `docs/SPEC_TEMPLATE.md` y guárdalo en `docs/features/<nombre>/SPEC.md`. Si conviene separar el video de la portada en su propia funcionalidad, propónmelo.

La especificación debe definir:

- Objetivo y comportamiento esperado.
- Qué está incluido y qué queda fuera del alcance.
- Flujo de la persona que llega desde un enlace en redes, reglas de contenido y casos de error.
- Criterios de aceptación concretos y cómo validar cada uno.
- Restricciones del pedido y decisiones pendientes.

No asumas decisiones que no estén definidas: pregúntame antes de incorporarlas. Puedes proponer opciones y recomendar una, pero espera mi confirmación antes de anotarla como decisión tomada.

Investiga todo lo que puedas comprobar. Lo que no esté resuelto o no se pueda deducir con certeza debe quedar marcado como PENDIENTE: fecha, hora, sede, enlaces y redes los confirmo yo.

Hazme pocas preguntas por vez y actualiza la especificación con mis respuestas. Presta especial atención a:

- La primera visita con una conexión lenta.
- Las personas que navegan con teclado, con lector de pantalla o con movimiento reducido.
- Qué pasa al recargar la página a mitad de la lectura.
- Lo que ven WhatsApp, Instagram y LinkedIn al compartir el enlace.

No implementes nada hasta que revisemos y aprobemos explícitamente la especificación.

---

## 2. Especificación: resumen después del evento

Quiero que me ayudes a escribir la especificación de una funcionalidad nueva para la landing: después del evento, la página no debe seguir pidiendo el registro en Luma y tiene que mostrar cómo fue el encuentro, con fotos, cifras de la jornada, materiales de las charlas y cómo seguir en la comunidad. Nadie debería tener que publicar a medianoche para que la página cambie.

Primero, revisa `AGENTS.md`, `docs/WEB_GUIDELINES.md` y las funcionalidades existentes en `docs/features/landing-wtm/` y `docs/features/video-scroll-portada/`. Revisa también el código para saber qué partes de la página llevan al registro y cómo se decide hoy que el evento ya pasó.

Después, prepara un borrador con `docs/SPEC_TEMPLATE.md` en `docs/features/resumen-post-evento/SPEC.md`, para completarlo y corregirlo juntos. La especificación debe definir:

- Objetivo, para quién es y qué se conserva de la página actual.
- Qué está incluido y qué queda fuera del alcance.
- Cuándo cambia la página y qué ve la persona antes y después.
- Reglas para las fotos, las cifras y los materiales.
- Criterios de aceptación concretos y cómo validar cada uno.
- Restricciones del pedido y decisiones pendientes.

No asumas decisiones que no estén definidas: pregúntame antes de incorporarlas. Puedes proponer opciones y recomendar una, pero espera mi confirmación antes de anotarla como decisión tomada. Las fotos, las cifras de la jornada y los materiales los entregan la organización y las ponentes: márcalos como PENDIENTE y no los inventes. No propongas generar fotos con IA: tienen que ser reales.

Hazme pocas preguntas por vez y actualiza la especificación con mis respuestas. Presta especial atención a:

- La zona horaria: el cambio debe ocurrir a la medianoche de Bolivia para todas las visitas.
- El consentimiento de las personas que aparecen en las fotos y los metadatos de las imágenes.
- El peso de las fotos y la primera visita con una conexión lenta.
- La vista previa al compartir el enlace después del evento y el aviso sin JavaScript.
- Que antes del día siguiente al evento la página siga funcionando igual que hoy.

No implementes nada hasta que revisemos y aprobemos explícitamente la especificación.

---

## 3. Plan

Aprobé la especificación de `docs/features/<nombre>/SPEC.md`. Ahora quiero que escribas el plan técnico con `docs/PLAN_TEMPLATE.md` en `docs/features/<nombre>/PLAN.md`.

Antes de proponer nada, revisa el código y cita rutas y funciones verificadas: qué existe hoy, qué se reutiliza, qué se modifica y qué se crea. Distingue los hechos de tus propuestas.

El plan debe definir:

- La solución y por qué, con las alternativas que descartaste.
- Los archivos y componentes afectados, cada uno ligado a sus requisitos.
- Los contratos de contenido y los datos, el estado de la interfaz y los errores.
- Las dependencias nuevas, solo si hacen falta, con su justificación.
- Si hacen falta subagentes y la responsabilidad acotada de cada uno.
- Una fila de validación por cada criterio de aceptación: método, entorno y evidencia.
- El orden de implementación y los riesgos concretos.

Respeta `AGENTS.md`: sin frameworks ni dependencias por defecto, todo texto en `contenido.js` y accesibilidad AA. Si una decisión técnica cambia el comportamiento o el alcance, vuelve a la especificación y pregúntame: no resuelvas una duda de producto con una suposición técnica.

Hazme pocas preguntas por vez. No implementes nada y no marques el plan como Aprobado: eso lo hago yo.

---

## 4. Tareas

Aprobé el plan de `docs/features/<nombre>/PLAN.md`. Ahora deriva las tareas en `docs/features/<nombre>/TASKS.md`, con el formato que define `AGENTS.md`.

Cada tarea debe ser pequeña, ordenada y verificable, con:

- Identificador y objetivo.
- Alcance: qué archivos toca.
- Responsable (agente, modelo o persona) y dependencias.
- Criterios de aceptación que resuelve (CA-XX).
- Cómo se valida.

Marca con `[P]` las tareas que pueden correr en paralelo y como bloqueadas las que esperan una decisión o un insumo, diciendo cuál. Agrega al final la tabla de validación con todos los criterios en «Sin ejecutar».

No empieces a implementar.

---

## 5. Implementación

Te autorizo a implementar las tareas de `docs/features/<nombre>/TASKS.md`, en orden y dentro del alcance acordado. Si quieres empezar solo por algunas, indícalo: por ejemplo, de T02 a T05.

Al trabajar:

- Respeta la arquitectura y las convenciones de `AGENTS.md` y las reglas de `docs/GENERIC_RULES.md`.
- Haz una tarea a la vez. Al terminarla, ejecuta su validación y marca la casilla solo si pasó, anotando el resultado.
- Si algo revela un hueco o una contradicción en la especificación o el plan, detente en esa parte, explícamelo y actualiza los documentos antes de seguir.
- No agregues dependencias ni cambios fuera del alcance.
- No publiques en Netlify ni hagas commit o push: eso lo autorizo aparte.

Al final, resume qué cambió, qué tareas quedaron hechas y cuáles bloqueadas, y por qué.

---

## 6. Validación

Quiero validar `docs/features/<nombre>/` contra su especificación.

- Comprueba cada criterio de aceptación con el método que fija el plan: Playwright con `channel: 'chrome'`, comprobaciones por línea de comandos o pasos manuales reproducibles.
- Registra en la tabla de `TASKS.md` el resultado de cada criterio (Pasa, Falla, Parcial o Sin ejecutar) con su evidencia: medición, comando ejecutado o captura.
- Repite las pruebas de regresión que indica el plan para las funcionalidades existentes.
- Separa lo que pasó, lo que falló, lo que no se ejecutó y lo que quedó bloqueado, con el motivo.
- Un nombre de prueba, un comando sin ejecutar o «debería funcionar» no son evidencia.

Si un criterio falla, no lo corrijas todavía: descríbelo como hallazgo (qué criterio, cómo se reproduce y qué impacto tiene) y espera mi indicación.

Para una revisión independiente, pide esta misma validación a otro agente con otro modelo (por ejemplo, Codex), sin darle tus conclusiones, y que deje su informe con un veredicto en `qa/`.
