# TASKS: Resumen después del evento

**PLAN de referencia:** [PLAN.md](PLAN.md) (Borrador, 24-oct-2026)

<!-- Ejemplo de la charla. Estas tareas se derivan del plan en borrador para mostrar el
recorrido completo: ninguna está empezada. En un proyecto real se escriben con el plan
aprobado y se ejecutan solo con autorización explícita. -->

Cada tarea indica objetivo, alcance, dependencias, criterios de la [SPEC](SPEC.md) que
resuelve y cómo se valida. `[P]` marca las tareas que pueden correr en paralelo.

## Insumos

- [ ] **T01 · Reunir fotos, cifras y materiales** `[P]`
  - **Objetivo:** tener lo que la página va a mostrar, con su fuente.
  - **Alcance:** 6 a 12 fotos con consentimiento; cifras de la jornada con fecha;
    enlaces de materiales; destino de los botones de comunidad.
  - **Responsable:** organización y ponentes. **Depende de:** —
  - **Resuelve:** CA-05, CA-08, CA-09.
  - **Validación:** cada dato con quién lo entregó y cuándo.
  - **Bloqueada:** espera las decisiones pendientes de la spec.

## Implementación

- [ ] **T02 · Fecha de Bolivia y modo de la página**
  - **Objetivo:** `hoyEnBolivia()` con `Intl.DateTimeFormat` y `timeZone:
    'America/La_Paz'`; `data-modo` en `<html>`; `iniciarCuenta` usa la misma fecha.
  - **Alcance:** `assets/js/main.js`.
  - **Responsable:** Claude Code. **Depende de:** —
  - **Resuelve:** CA-01, CA-02, CA-11.
  - **Validación:** Playwright con `timezoneId` de La Paz y de Madrid y `page.clock`.
- [ ] **T03 · Contrato `resumen` y superposición** `[P]`
  - **Objetivo:** objeto `resumen` en `contenido.js`; `main.js` lo superpone antes de
    pintar; campo `soloAntes` en las preguntas.
  - **Alcance:** `assets/js/contenido.js`, `assets/js/main.js`, `README-DEV.md`.
  - **Depende de:** T02. **Resuelve:** CA-03, CA-04, CA-10.
  - **Validación:** en modo resumen, 0 enlaces visibles a luma.com; «Mira cómo fue» lleva
    a `#asi-fue`; ninguna pregunta de antes del evento.
- [ ] **T04 · Sección «Así fue» con fotos de prueba** `[P]`
  - **Objetivo:** galería en rejilla, cifras de la jornada y bloque de materiales.
  - **Alcance:** `index.html`, `assets/css/styles.css`, `assets/js/main.js`.
  - **Depende de:** T02. **Resuelve:** CA-05, CA-09.
  - **Validación:** sin desborde en 9 anchos; bloque de materiales oculto con lista vacía.
- [ ] **T05 · Visor de fotos**
  - **Objetivo:** ampliación con `<dialog>`; Escape cierra y el foco vuelve a la foto.
  - **Depende de:** T04. **Resuelve:** CA-06.
  - **Validación:** recorrido solo con teclado.
- [ ] **T06 · Fotos y cifras reales**
  - **Objetivo:** reexportar las fotos (≤ 200 KB, sin metadatos) y cargar las cifras.
  - **Alcance:** `assets/img/asi-fue/`, `assets/js/contenido.js`.
  - **Depende de:** T01, T04. **Resuelve:** CA-07, CA-08.
  - **Validación:** peso de cada archivo; `ffprobe` sin metadatos de ubicación; fuente y
    fecha visibles.

## Verificación y publicación

- [ ] **T07 · Pruebas propias**
  - **Depende de:** T03–T06. **Resuelve:** CA-01 a CA-11.
  - **Validación:** Playwright en ambos modos, más las pruebas de `landing-wtm` y
    `video-scroll-portada` en modo evento.
- [ ] **T08 · QA independiente**
  - **Responsable:** Codex. **Depende de:** T07.
  - **Validación:** informe con veredicto en `qa/`.
- [ ] **T09 · Publicación**
  - **Objetivo:** publicar solo `index.html` y `assets/`, con autorización.
  - **Depende de:** T08 y la decisión sobre la vista previa en redes: si se decide
    publicar el 25 de octubre, el `<head>` y el `noscript` llevan textos de resumen.
  - **Validación:** huellas SHA-256 y pruebas de los criterios en el sitio publicado.

## Validación de criterios

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| CA-01 | Sin ejecutar | — |
| CA-02 | Sin ejecutar | — |
| CA-03 | Sin ejecutar | — |
| CA-04 | Sin ejecutar | — |
| CA-05 | Sin ejecutar | — |
| CA-06 | Sin ejecutar | — |
| CA-07 | Sin ejecutar | — |
| CA-08 | Sin ejecutar | — |
| CA-09 | Sin ejecutar | — |
| CA-10 | Sin ejecutar | — |
| CA-11 | Sin ejecutar | — |
