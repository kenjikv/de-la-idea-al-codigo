# PLAN: Landing Break the Pattern

**SPEC de referencia:** [docs/features/landing-wtm/SPEC.md](SPEC.md)
**Versión de la spec revisada:** 24-oct-2026
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
| Investigación con fuentes | `contenido/INVESTIGACION.md` | Origen de cifras, fechas, normas y redes (RF-03, RF-07, RF-10) |
| Copy por sección | `contenido/COPY.md` | Textos de partida para cada sección |
| Página de registro | `https://luma.com/5odhuh0l` | Destino único de los botones (RF-02) |

**Convenciones y patrón de referencia:** sitio estático sin build. Contenido separado de la
estructura. Tokens de diseño en CSS. Español de Bolivia.

## Solución propuesta

<!-- Enfoque y motivos. Responsabilidades y recorrido de datos y eventos hasta la
interfaz. Usa un diagrama si aclara. -->

Una sola página con HTML, CSS y JavaScript, sin frameworks ni dependencias: es pequeña,
debe cargar rápido en el celular y no necesita servidor. Todo el contenido vive en un
objeto global que un script pinta en la estructura:

```
contenido/INVESTIGACION.md + COPY.md
        │  (se vuelcan a mano)
        ▼
assets/js/contenido.js ──► assets/js/main.js ──► index.html (marcadores data-t / data-lista / data-img)
        │                                                ▲
        └── meta.* se copia también al <head> ───────────┘  (para rastreadores sin JavaScript)
```

Dirección de arte: editorial oscura con luz cálida, rosa `#E8467C` y el espectro de Google
como acento. Sobre fondo oscuro el contraste AA se alcanza con holgura (RF-13).

## Archivos y componentes afectados

<!-- Distingue lo que se reutiliza, modifica o crea. Las rutas nuevas son propuestas.
Señala el impacto sobre contratos o componentes compartidos. -->

| Archivo o componente | Acción | Cambio y responsabilidad | Requisito relacionado |
| --- | --- | --- | --- |
| `index.html` | Crear | Estructura semántica: cabecera, `main` con ocho secciones (de la portada al cierre), pie, `noscript` y metadatos en el `<head>` | RF-01–RF-11, RF-15 |
| `assets/js/contenido.js` | Crear | Objeto `window.WTM_CONTENIDO` con todos los textos, enlaces, fechas y rutas | RF-12 |
| `assets/js/main.js` | Crear | Pinta el contenido; menú, acordeón, contadores, cuenta regresiva y aviso de enlaces pendientes | RF-05, RF-07–RF-09 |
| `assets/css/styles.css` | Crear | Tokens en `:root`, estilos mobile first, foco visible, movimiento reducido | RF-13–RF-15 |
| `assets/img/*.jpg` | Crear | Seis imágenes: póster, textil, comunidad, charla, taller y og (1200 × 678) | RF-11 |
| `README-DEV.md` | Crear | Guía técnica: servir, qué archivo tocar, contrato completo | RF-12 |

Módulos: no aplica, el sitio no está modularizado.

## Datos y contratos

<!-- Completa solo lo aplicable. Si un punto no aplica, di por qué. -->

- **Contratos de contenido y configuración:** `window.WTM_CONTENIDO` con `meta`, `sitio`,
  `registro`, `hero`, `porQue`, `wtm`, `evento`, `agenda`, `cifras`, `faq`, `cta` y `pie`.
  Un texto vacío oculta su elemento. La forma completa está en `README-DEV.md`.
- **Origen de los datos mostrados y transformaciones:** `INVESTIGACION.md` y `COPY.md`. Las
  cifras guardan el valor numérico (`29.2`) y el contador lo muestra con coma decimal.
- **Almacenamiento en el navegador:** ninguno en esta funcionalidad.
- **Servicios externos y enlaces de salida:** Luma (registro), Google Maps (mapa) y redes
  oficiales, todos como enlaces de salida. Ninguna petición a terceros al cargar.
- **Compatibilidad con contenido existente:** no aplica, el sitio es nuevo.

## Estado, eventos y errores

<!-- Cómo se implementan los comportamientos aprobados. Cita RF/CA y aplica los puntos
de WEB_GUIDELINES.md que correspondan. -->

- **Estado de la interfaz y navegación:** el menú móvil usa `aria-expanded`, marca el resto
  de la página como `inert` mientras está abierto y se cierra con Escape (CA-10). El
  acordeón usa botones con `aria-expanded` y flechas, Inicio y Fin (CA-09).
- **Recarga, historial y posición de lectura:** la cabecera fija se compensa con
  `scroll-margin-top`. La restauración al recargar la resuelve `video-scroll-portada`.
- **Eventos, temporizadores y cancelación:** contadores y animaciones de entrada con
  `IntersectionObserver`, apagados con `prefers-reduced-motion`. La cuenta regresiva usa
  `fechaISO` si existe; si no, compara el día local con `fechaDia` (CA-05, CA-06).
- **Errores, alternativas y tiempos de espera:** imágenes con un degradado de respaldo;
  `noscript` con el enlace a Luma; enlaces `-pendiente` con aviso.
- **Otros puntos web aplicables y su solución:** imágenes con `loading="lazy"` y
  dimensiones declaradas para que la página no salte al cargar.

## Dependencias, configuración y agentes

<!-- Librerías, servicios, hosting o configuración afectados. Justifica cada incorporación.
Indica si hacen falta subagentes y la responsabilidad acotada de cada uno. -->

- Sin dependencias, CDN ni fuentes remotas: decisión técnica para que cargue rápido y sin
  red (no fue una restricción del pedido).
- Publicación en Netlify subiendo solo `index.html` y `assets/`.
- **Agentes orquestados con Orca:**

| Rol | Herramienta | Modelo | Entrega |
| --- | --- | --- | --- |
| Coordinación y desarrollo | Claude Code | Opus 5.5, esfuerzo extra | Código y documentación técnica |
| Investigación y copy | Antigravity | Gemini 3.8 Flash, esfuerzo medio | `INVESTIGACION.md`, `COPY.md` |
| Imágenes | Skill de Higgsfield | GPT Image 2.5 | `assets/img/` |
| QA independiente | Codex | GPT-6-Astra, esfuerzo alto (ver riesgos) | `qa/INFORME-QA.md` |

## Estrategia de validación

<!-- Una fila por criterio de la spec. Elige el método capaz de demostrarlo: prueba
automática en navegador, comprobación por línea de comandos o prueba manual. Incluye
regresiones. Una captura no demuestra recarga, red ni accesibilidad. -->

| Criterio | Método y prueba existente o propuesta | Entorno y datos necesarios | Evidencia prevista |
| --- | --- | --- | --- |
| CA-01 | Playwright: viewport 375 × 812, posición de título y botón | Chrome, servidor local | Coordenadas y captura |
| CA-02 | Playwright: activar los 4 botones y leer la pestaña nueva | Chrome | URL exacta por botón |
| CA-03 | Revisión del texto contra `INVESTIGACION.md` | Página renderizada | Cita y fuente |
| CA-04 | Playwright: contar tarjetas con título y texto | Chrome | Conteo |
| CA-05 | Playwright con `Date` fijado al 24-oct-2026 | Chrome, zona America/La_Paz | Texto del mensaje |
| CA-06 | Playwright con `Date` fijado al 25-oct-2026 | Chrome | Texto del mensaje |
| CA-07 | Playwright: leer los bloques de la agenda | Chrome | Lista ordenada |
| CA-08 | Playwright tras 1600 ms + comparación con la investigación | Chrome | Valores y fuentes |
| CA-09 | Playwright solo con teclado | Chrome | `aria-expanded` y foco por tecla |
| CA-10 | Playwright: anclas en escritorio; menú en 320 px con Tab y Escape | Chrome | Posición del título; foco final |
| CA-11 | `curl -L` a cada enlace del pie | Internet | Código HTTP final |
| CA-12 | `curl` del HTML contra `WTM_CONTENIDO.meta` | Servidor local y sitio publicado | Igualdad carácter por carácter |
| CA-13 | Cambio de prueba en `contenido.js` y búsqueda de marcadores | Servidor local | Texto visible; 0 marcadores |
| CA-14 | Medición de contraste sobre capturas | Chrome, 1280 y 320 px | Ratios por bloque |
| CA-15 | `scrollWidth` contra `clientWidth` en 9 anchos; tamaño de objetivos | Chrome | Exceso 0 px; medidas |
| CA-16 | Playwright: orden de Tab, `:focus-visible`, encabezados | Chrome | Secuencia y jerarquía |

**Comprobaciones de regresión:** 0 errores de consola, 0 respuestas 404 y 0 peticiones a
dominios externos en una carga normal.

**Comandos verificados para servir y probar:** `python3 -m http.server 8080`; Playwright
1.56.1 con `channel: 'chrome'`; `node qa/verificar-correcciones.cjs . qa/verificacion.json`.

**Pruebas en navegadores y dispositivos reales:** Safari en iPhone y un lector de pantalla
real (VoiceOver o NVDA).

**Limitaciones del entorno:** solo hay Google Chrome; los anchos de celular son emulados.

## Orden de implementación

<!-- Etapas y dependencias principales con puntos de comprobación. El desglose ejecutable
va en TASKS.md. -->

1. Investigación y copy en paralelo con las imágenes. Comprobación: cada dato con fuente.
2. Estructura, contrato de contenido y estilos. Comprobación: la página carga sin errores.
3. Interacciones: menú, acordeón, contadores y cuenta regresiva. Comprobación: teclado.
4. Pruebas propias y QA independiente. Comprobación: informe con veredicto.
5. Correcciones del QA, re-verificación y publicación.

## Riesgos y decisiones pendientes

<!-- Riesgos concretos de esta solución y cómo se tratan. Escribe Ninguna en las
decisiones pendientes cuando estén resueltas. -->

- **Riesgos y medidas acordadas:**
  - El `<head>` y `contenido.js` pueden desincronizarse: `main.js` avisa en la consola
    cuando se sirve en localhost, y CA-12 lo comprueba.
  - Cifras sin respaldo o redondeadas: solo se usan datos de la investigación (CA-08).
  - El modelo pedido para el QA no estaba disponible: Codex con la cuenta de ChatGPT
    rechazó `gpt-sol-6.1` y el agente quedó mudo. Se leyó la terminal del worker y se
    relanzó sin `--model`, con GPT-6-Astra. Sigue siendo otro agente y otro modelo que el
    que implementa.
- **Decisiones pendientes:** las de la spec (hora, agenda con horarios y dominio
  definitivo). Ninguna técnica.

<!-- ANTES DE PEDIR LA APROBACIÓN
Comprueba que el plan cubre los requisitos, respeta las exclusiones, reutiliza lo
verificado y permite demostrar todos los criterios. Tras la aprobación, deriva TASKS.md
con identificadores, dependencias, referencias a RF/CA y comprobaciones.
-->
