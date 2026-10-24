# TASKS: Video de la portada ligado al scroll

**PLAN de referencia:** [PLAN.md](PLAN.md) (Aprobado, 24-oct-2026)

Cada tarea indica objetivo, alcance, dependencias, criterios de la [SPEC](SPEC.md) que
resuelve y cómo se valida. `[P]` marca las tareas que pueden correr en paralelo.

## Medios

- [x] **T01 · Generar el video** `[P]`
  - **Objetivo:** un video de unos 10 s para la portada.
  - **Responsable:** skill de Higgsfield · Seedance 2.5. **Depende de:** —
  - **Resuelve:** CA-01, CA-08.
  - **Validación:** revisión visual del coordinador.
  - **Resultado:** el original llegó en HEVC con fotogramas clave espaciados.
- [x] **T02 · Recodificar para el salto**
  - **Objetivo:** que cada cuadro sea clave para poder saltar sin trabas.
  - **Responsable:** Claude Code + ffmpeg. **Depende de:** T01.
  - **Resuelve:** CA-01, CA-02, CA-08.
  - **Validación:** `ffprobe` de pistas, cuadros y fotogramas clave.
  - **Resultado:** H.264 1280 × 720, 24 fps, 241 cuadros, todos clave, sin audio, 7,3 MB.

## Implementación

- [x] **T03 · Máquina de estados y alternativas**
  - **Objetivo:** `cargando`, `scrub` y `poster` con su motivo.
  - **Responsable:** Claude Code · Opus 5.5. **Depende de:** T02.
  - **Resuelve:** CA-03, CA-04.
  - **Validación:** error, demora y movimiento reducido terminan en la imagen fija.
- [x] **T04 · Bucle de scroll**
  - **Objetivo:** progreso del recorrido → `currentTime`, suavizado.
  - **Depende de:** T03. **Resuelve:** CA-01, CA-02, CA-09.
  - **Validación:** tiempos medidos en 11 posiciones; bucle detenido fuera de la portada.
- [x] **T05 · Texto y velo**
  - **Depende de:** T03. **Resuelve:** CA-05.
  - **Validación:** contraste medido en varios puntos de la portada.
- [x] **T06 · Restauración de la posición**
  - **Depende de:** T03. **Resuelve:** CA-06, CA-07.
  - **Validación:** recargas y carga lenta.

## Verificación

- [x] **T07 · Pruebas propias**
  - **Responsable:** Claude Code. **Depende de:** T04–T06.
  - **Resultado:** incluidas en las 46 comprobaciones del worker. El video avanzó
    (25 % → 1,98 s; 100 % → 7,94 s) y retrocedió (10 % → 0,80 s) con un video de prueba.
- [x] **T08 · QA independiente**
  - **Responsable:** Codex · GPT-6-Astra. **Depende de:** T07.
  - **Resultado:** **NO APTO** (`qa/INFORME-QA.md`). En esta funcionalidad: QA-01, alta
    (CA-06 y CA-07), y QA-02, alta (CA-05).

## Correcciones

- [x] **T09 · No sacar a la persona de su lectura (QA-01)**
  - **Objetivo:** compensar `scrollY` solo si la persona estaba debajo de la portada;
    apagar el anclaje nativo durante el cambio de alto; restaurar en dos pasos.
  - **Depende de:** T08. **Resuelve:** CA-06, CA-07.
  - **Validación:** recargas desde 800 y 4500 px; carga lenta con 400 px.
- [x] **T10 · Texto legible u oculto (QA-02)**
  - **Objetivo:** reemplazar el desvanecimiento ligado al scroll por un umbral (78 % y
    76 %) con transición corta.
  - **Depende de:** T08. **Resuelve:** CA-05.
  - **Validación:** opacidad y contraste en 1280 y 320 px.
- [x] **T11 · Reauditoría**
  - **Responsable:** Codex. **Depende de:** T09, T10.
  - **Resultado:** **APTO PARA ENTREGAR** (`qa/INFORME-QA-2.md`).
- [x] **T12 · Publicación y verificación en vivo**
  - **Depende de:** T11. **Resultado:** deploy `6adc56aa6e278f24d298da9d`. Pruebas en el
    sitio publicado el 24-oct-2026 (ver la tabla).

## Pendientes

- [x] **T13 · Primera visita con red lenta**
  - **Objetivo:** decidir qué pasa cuando el video no llega a tiempo en la primera visita.
  - **Depende de:** T12. **Resuelve:** CA-03.
  - **Resultado:** decisión de la persona (24-oct-2026): se acepta la imagen fija como
    alternativa prevista. Sin cambios de código; la spec volvió a Aprobada.
- [ ] **T14 · Safari en iPhone y Firefox**
  - **Bloqueada:** necesita esos navegadores; aquí solo hay Chrome.
  - **Resuelve:** CA-01 a CA-05 fuera de Chrome.

## Validación de criterios

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| CA-01 | Pasa | QA ronda 1 y reauditoría: 6 posiciones de bajada, con y sin rangos; error máximo 0,008197 s (menor que 1/60 s). |
| CA-02 | Pasa | QA ronda 1 y reauditoría: 5 posiciones de subida, tiempos estrictamente decrecientes. |
| CA-03 | Pasa | QA ronda 1: 404 → `poster/error`; petición retenida → `poster/tiempo` a ~7,3 s; portada de 800 px. En vivo: primera visita tras publicar → `poster/tiempo`. |
| CA-04 | Pasa | QA ronda 1: con movimiento reducido, 0 peticiones del video y `poster/reduce`. |
| CA-05 | Pasa | Falló en la ronda 1 (QA-02: título bajo 3:1 al 80 %). Reauditoría: 16 estados en 1280 y 320 px, solo opacidad 0 o 1. En vivo: 50 % y 77 % legible; 80 % y 90 % oculto con `aria-hidden`. |
| CA-06 | Pasa | Falló en la ronda 1 (QA-01: 800 → 4000 y 4500 → 6100 px). Reauditoría: 800 → 800 y 4500 → 4500. En vivo: 800 → 800. |
| CA-07 | Pasa | Falló en la ronda 1 (QA-01: 400 → 2000 px). Reauditoría y `qa/verificacion.json`: 400 → 400. |
| CA-08 | Pasa | `ffprobe`: una sola pista de video, sin audio. El video solo se mueve con el scroll y un oyente de `play` lo pausa. |
| CA-09 | Pasa | QA ronda 1 y reauditoría: fuera de la portada, 0 cuadros de animación pendientes. |

**Observación en vivo (24-oct):** justo después de publicar, la primera visita tardó ~11 s y
quedó en `poster/tiempo`. Las tres visitas nuevas siguientes entraron en `scrub` en 2,6 a
2,9 s. Es el comportamiento previsto por RF-03. Abrió una decisión en la spec, que la persona
resolvió aceptándolo (T13).
