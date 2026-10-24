# TASKS: Landing Break the Pattern

**PLAN de referencia:** [PLAN.md](PLAN.md) (Aprobado, 24-oct-2026)

Cada tarea indica objetivo, alcance, dependencias, criterios de la [SPEC](SPEC.md) que
resuelve y cómo se valida. `[P]` marca las tareas que pueden correr en paralelo.

## Contenido y medios

- [x] **T01 · Investigación con fuentes** `[P]`
  - **Objetivo:** reunir los datos verificables de la página.
  - **Alcance:** qué es WTM, Día de la Mujer Boliviana, referentes, cifras y redes oficiales.
  - **Responsable:** Antigravity · Gemini 3.8 Flash. **Depende de:** —
  - **Resuelve:** CA-03, CA-08, CA-11.
  - **Validación:** cada dato con enlace y año; el coordinador revisa antes de aceptar.
  - **Resultado:** `contenido/INVESTIGACION.md`, 29 fuentes verificadas.
- [x] **T02 · Copy por sección**
  - **Objetivo:** textos de cada sección, botones, preguntas frecuentes y textos alternativos.
  - **Responsable:** Antigravity. **Depende de:** T01.
  - **Resuelve:** CA-04, CA-07, CA-09.
  - **Validación:** sin marcadores de borrador; datos iguales a la investigación.
  - **Resultado:** `contenido/COPY.md`.
- [x] **T03 · Imágenes** `[P]`
  - **Objetivo:** seis imágenes para portada, secciones y vista previa en redes.
  - **Responsable:** skill de Higgsfield · GPT Image 2.5. **Depende de:** —
  - **Resuelve:** CA-12.
  - **Validación:** dimensiones declaradas; la imagen og mide 1200 × 678.
  - **Resultado:** `assets/img/` con póster, textil, comunidad, charla, taller y og.

## Implementación

- [x] **T04 · Estructura semántica**
  - **Objetivo:** `index.html` con cabecera, ocho secciones, pie, `noscript` y metadatos.
  - **Responsable:** Claude Code · Opus 5.5. **Depende de:** —
  - **Resuelve:** CA-01, CA-16.
  - **Validación:** un solo `h1`, jerarquía válida, enlace para saltar al contenido.
- [x] **T05 · Contrato de contenido**
  - **Objetivo:** `contenido.js` con todo el copy; `main.js` lo pinta.
  - **Depende de:** T02, T04. **Resuelve:** CA-12, CA-13.
  - **Validación:** ningún texto visible en el HTML; metadatos copiados al `<head>`.
- [x] **T06 · Estilos mobile first** `[P]`
  - **Objetivo:** tokens en `:root`, foco visible y movimiento reducido.
  - **Depende de:** T04. **Resuelve:** CA-14, CA-15.
  - **Validación:** sin desborde de 320 a 1920 px; objetivos de al menos 44 × 44 px.
- [x] **T07 · Interacciones** `[P]`
  - **Objetivo:** menú móvil, acordeón, contadores, cuenta regresiva y aviso de enlaces
    pendientes.
  - **Depende de:** T04. **Resuelve:** CA-05, CA-09, CA-10.
  - **Validación:** todo operable solo con teclado.

## Verificación

- [x] **T08 · Pruebas propias**
  - **Responsable:** Claude Code. **Depende de:** T05–T07.
  - **Validación:** Playwright sobre Chrome.
  - **Resultado:** 46 comprobaciones aprobadas según el informe del worker.
- [x] **T09 · QA independiente**
  - **Responsable:** Codex · GPT-6-Astra. **Depende de:** T08.
  - **Resultado:** **NO APTO** (`qa/INFORME-QA.md`). En esta funcionalidad: QA-03 (CA-08),
    QA-04 (CA-12) y QA-05 (CA-06). QA-01 y QA-02 son de `video-scroll-portada`.

## Correcciones

- [x] **T10 · Cifras exactas (QA-03)**
  - **Objetivo:** mostrar 29,2 % con un decimal y documentar la fuente del +330.
  - **Depende de:** T09. **Resuelve:** CA-08.
  - **Validación:** la cifra visible coincide con `INVESTIGACION.md`.
- [x] **T11 · Metadatos sincronizados (QA-04)**
  - **Objetivo:** copiar `meta.*` al `<head>` y avisar en localhost si se desincroniza.
  - **Depende de:** T09. **Resuelve:** CA-12.
  - **Validación:** `curl` del HTML contra `WTM_CONTENIDO.meta`.
- [x] **T12 · Mensaje después del evento (QA-05)**
  - **Objetivo:** con `fechaDia`, mostrar el mensaje de cierre desde el día siguiente.
  - **Depende de:** T09. **Resuelve:** CA-06.
  - **Validación:** reloj del navegador fijado al 24 y al 25 de octubre.
- [x] **T13 · Reauditoría**
  - **Responsable:** Codex. **Depende de:** T10–T12 y las correcciones del video.
  - **Resultado:** **APTO PARA ENTREGAR** (`qa/INFORME-QA-2.md`): 5 de 5 correcciones
    confirmadas, 0 regresiones.
- [x] **T14 · Publicación y verificación en vivo**
  - **Objetivo:** publicar solo `index.html` y `assets/` y repetir las pruebas en el sitio.
  - **Depende de:** T13. **Resuelve:** todos los CA en el entorno real.
  - **Resultado:** deploy `6adc56aa6e278f24d298da9d` del 24-oct-2026; huellas SHA-256
    iguales a la versión local.

## Pendientes

- [ ] **T15 · URL canónica y `og:url`**
  - **Bloqueada:** falta confirmar si `wtm-santcruz.netlify.app` es el dominio definitivo.
  - **Resuelve:** CA-12 para la URL.
- [ ] **T16 · Safari en iPhone y lector de pantalla real**
  - **Bloqueada:** necesita un iPhone y VoiceOver o NVDA; aquí solo hay Chrome.
  - **Resuelve:** CA-01, CA-15 y CA-16 en dispositivos reales.
- [ ] **T17 · Editar un texto de prueba y recargar**
  - **Pendiente:** CA-13 se comprobó solo en su parte de marcadores (0). Falta cambiar un
    texto en `contenido.js` y ver que aparece sin tocar `index.html`.

## Validación de criterios

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| CA-01 | Pasa | En vivo, 375 × 812: título termina en y = 442 px y botón en y = 661 px, sin desplazarse (24-oct). |
| CA-02 | Pasa | QA ronda 1: los 4 botones abren `https://luma.com/5odhuh0l` en pestaña nueva. |
| CA-03 | Pasa | En vivo: «Por qué» cita D.S. 7352 (1965) y Ley 339 (1967). |
| CA-04 | Pasa | En vivo: 3 pilares (Visión de futuro, Comunidad de apoyo, Oportunidades reales). |
| CA-05 | Pasa | Reauditoría: con el 24 y el 20 de octubre muestra «Es hoy…». |
| CA-06 | Pasa | Falló en la ronda 1 (QA-05). Reauditoría y en vivo: mensaje de cierre el 25 de octubre. |
| CA-07 | Pasa | En vivo: los cinco bloques en orden. |
| CA-08 | Pasa | Falló en la ronda 1 (QA-03). Reauditoría y en vivo: 29,2 % y +330 con fuente. |
| CA-09 | Pasa | QA ronda 1 y reauditoría: 6 de 6 preguntas con Enter y Espacio; flechas, Inicio y Fin. |
| CA-10 | Pasa | QA ronda 1 y reauditoría: anclas bajo la cabecera de 68 px; Escape cierra y devuelve el foco. |
| CA-11 | Pasa | QA ronda 1 y reauditoría: los 6 destinos responden 200. |
| CA-12 | Pasa (sin `og:url`) | Falló en la ronda 1 (QA-04). Reauditoría y en vivo: metadatos iguales al contenido. `og:url` espera a T15. |
| CA-13 | Parcial | En vivo: 0 marcadores. La edición de prueba está pendiente (T17). |
| CA-14 | Pasa | QA ronda 1 y reauditoría: tarjetas, agenda, cifras, preguntas y pie en AA. |
| CA-15 | Pasa | QA ronda 1 y reauditoría: 9 anchos sin desborde; objetivos ≥ 44 × 44 px a 320 px. |
| CA-16 | Pasa | QA ronda 1: un `h1`, 8 `h2`, 14 `h3`, sin saltos; primer foco en «Saltar al contenido». |

**Regresiones (en vivo, 24-oct):** 0 errores de consola, 0 respuestas 4xx o 5xx y 0
peticiones a dominios externos al recorrer la página completa.
