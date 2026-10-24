# AGENTS.md

Guía para los agentes de IA que trabajan en este repositorio. Todas las rutas son
relativas a la raíz.

## Lectura obligatoria

Antes de planificar, revisar o modificar el proyecto, lee completo
[docs/GENERIC_RULES.md](docs/GENERIC_RULES.md) y aplícalo junto con este archivo. El
enlace es una instrucción de lectura explícita: no supongas que tu herramienta importa
sola los Markdown enlazados.

GENERIC_RULES.md reúne reglas de trabajo reutilizables. Este archivo agrega las
convenciones de esta web y el flujo guiado por especificaciones. Las reglas del proyecto
afinan las genéricas. Ninguno de los dos archivos pasa por encima de las instrucciones
explícitas de la persona. Si dos documentos se contradicen en algo que cambia el
comportamiento o el alcance, aclara la contradicción antes de implementar esa parte.

## Proyecto

Landing de una sola página de **Break the Pattern**, el encuentro de Women Techmakers
Santa Cruz por el Día de la Mujer Boliviana (sábado 24 de octubre de 2026, Universidad
Evangélica Boliviana).

- Publicada en https://wtm-santcruz.netlify.app/ (Netlify, sitio `wtm-santcruz`).
- HTML, CSS y JavaScript sin frameworks, sin paso de build, sin CDN ni fuentes remotas.
- Contenido en español de Bolivia (`lang="es"`, `og:locale` `es_BO`).
- Guía técnica detallada: [README-DEV.md](README-DEV.md).
- Las funcionalidades documentadas en `docs/features/` son la referencia para extender
  la web. Revísalas antes de cambiar algo.

## Comandos

Ejecuta los comandos desde la raíz.

```bash
python3 -m http.server 8080                              # servir en http://127.0.0.1:8080/
node qa/verificar-correcciones.cjs . qa/verificacion.json  # re-verifica QA-01 a QA-05
curl -s http://127.0.0.1:8080/ | grep -E "<title>|og:title|og:description|twitter:title|description"
```

- Las pruebas de Playwright usan `chromium.launch({ channel: 'chrome' })`: el Chromium
  que trae Playwright no decodifica H.264.
- `python3 -m http.server` no acepta peticiones por rango; `scroll-video.js` lo detecta y
  carga el video en memoria. En Netlify los rangos funcionan.

Para cambios de código: sirve el sitio, recórrelo completo sin errores de consola ni
respuestas 404, revisa los anchos de 320 a 1920 px, recorre la página con el teclado y
ejecuta las pruebas de Playwright que cubran los criterios afectados. Para cambios solo
de documentación, revisa el contenido y los enlaces. Informa qué comprobaciones no se
pudieron hacer y por qué.

### Publicación

Publicar es una acción externa: requiere autorización explícita de la persona. Se suben
solo `index.html` y `assets/`. Nunca `docs/`, `qa/`, `contenido/`, `presentacion/` ni la
carpeta `~`.

```bash
netlify deploy --prod --dir <carpeta con index.html y assets/> --site 1267d178-3c01-457a-be51-29a9dd1113e6
```

Después de publicar, compara las huellas SHA-256 de los archivos servidos con las locales
y repite en el sitio vivo las pruebas de los criterios afectados.

## Flujo guiado por especificaciones

### Documentos de referencia

Cada plantilla trae sus propias instrucciones para el agente, su estructura y su esquema
de identificadores. Léela completa y síguela; este archivo no la repite ni la contradice.

- `docs/SPEC_TEMPLATE.md`: se copia como `SPEC.md` de la funcionalidad. Define las
  secciones, los identificadores `RF-` (requisitos) y `CA-` (criterios de aceptación) y
  los estados de aprobación.
- `docs/PLAN_TEMPLATE.md`: se copia como `PLAN.md` cuando la spec está aprobada. Cita
  requisitos y criterios por su identificador.
- `docs/WEB_GUIDELINES.md`: se consulta al escribir o revisar requisitos, criterios,
  plan y validación. Cubre navegadores, anchos de pantalla, red lenta, carga y medios,
  recarga e historial, accesibilidad, movimiento reducido, metadatos para redes,
  privacidad, idioma y publicación. Aplica solo lo pertinente y pregunta por el
  comportamiento que no esté definido en vez de inventarlo.

Conserva la estructura y los comentarios de cada plantilla en la copia. No reescribas
las plantillas compartidas para una funcionalidad concreta.

### Documentos por funcionalidad

- `docs/features/<nombre>/SPEC.md`
- `docs/features/<nombre>/PLAN.md`
- `docs/features/<nombre>/TASKS.md`

Funcionalidades: `landing-wtm` (contenido, secciones, registro, navegación,
accesibilidad y metadatos) y `video-scroll-portada` (video de la portada ligado al scroll),
implementadas y validadas; `resumen-post-evento` (la página después del evento), con la
spec en revisión y sin implementar. Usa la carpeta existente cuando continúes su trabajo.

### Secuencia

Cada etapa depende del estado del documento anterior. Un documento solo está
`Aprobada`/`Aprobado` cuando la persona lo dice: completo no es aprobado, y el agente
nunca cambia ese estado por su cuenta.

1. **Especificación:** completa `SPEC.md` desde la plantilla, junto con la persona y
   sección por sección. No empieces el plan hasta que la spec esté aprobada.
2. **Plan:** escribe `PLAN.md` para la spec aprobada. Registra además si hacen falta
   subagentes y qué responsabilidad acotada tiene cada uno (en este proyecto se
   orquestan con Orca). No empieces las tareas hasta que el plan esté aprobado.
3. **Tareas:** deriva `TASKS.md` del plan aprobado. No hay plantilla compartida; este
   archivo lo define: casillas pequeñas, ordenadas y verificables, cada una con
   identificador, objetivo, alcance, dependencias, criterios de la spec que resuelve y
   forma de validarla.
4. **Implementación:** ejecuta las tareas dentro del alcance acordado y respetando la
   arquitectura de abajo. La autorización para implementar debe ser explícita; no se
   deduce del estado de los documentos. Actualiza el estado de las tareas.
5. **Validación:** comprueba los criterios con evidencia adecuada y registra el resultado
   en `TASKS.md`, incluidas las comprobaciones pendientes.

Una plantilla llena no resuelve las preguntas sin respuesta. Pregunta por las decisiones
de producto que cambian el comportamiento; resuelve los detalles técnicos rutinarios con
el código y las convenciones. Si la implementación revela un hueco o una contradicción,
aclara el comportamiento y actualiza los documentos antes de seguir con esa parte.

## Arquitectura

| Ruta | Responsabilidad |
| --- | --- |
| `index.html` | Estructura semántica. No lleva textos visibles: tiene marcadores (`data-t`, `data-lista`, `data-img`) que `main.js` rellena. El `<head>` duplica los metadatos porque los rastreadores de redes no ejecutan JavaScript. |
| `assets/js/contenido.js` | `window.WTM_CONTENIDO`: única fuente de textos, enlaces, fechas y rutas de medios. |
| `assets/js/main.js` | Pinta el contenido; menú móvil, acordeón, contadores, cuenta regresiva y aviso de enlaces pendientes. |
| `assets/js/scroll-video.js` | Video de la portada ligado al scroll y sus alternativas. |
| `assets/css/styles.css` | Tokens en `:root` y estilos mobile first. |
| `assets/img/`, `assets/video/` | Medios generados con GPT Image 2.5 y Seedance 2.5. |
| `contenido/INVESTIGACION.md`, `contenido/COPY.md` | Entradas: investigación con fuentes y copy por sección. |
| `qa/` | Informes de QA independientes y script de re-verificación. |

### Contenido

- Todo texto visible vive en `contenido.js`. Un texto vacío (`""`) oculta su elemento.
- Cada cifra lleva su fuente y año tal como figuran en `contenido/INVESTIGACION.md`. No se
  redondea sin decirlo.
- Si cambias `meta.*`, copia los valores al `<head>` de `index.html` carácter por carácter.
- La marca se escribe «Women Techmakers» (abreviada WTM) y no se traduce.
- Los enlaces que terminan en `-pendiente` muestran un aviso en vez de navegar.
- Fecha, sede, registro y redes los confirma la organización. Si falta un dato, pregunta.

### Estilos

- Usa los tokens de `:root` (`--ink`, `--paper`, `--rose`, `--blue`, `--red`, `--yellow`,
  `--green`, `--muted`). No escribas valores hexadecimales sueltos en las reglas.
- Mobile first con `clamp()`. Sin scroll horizontal entre 320 y 1920 px. Objetivos
  táctiles de al menos 44 × 44 px.

### Accesibilidad

- Un solo `h1`, jerarquía de encabezados sin saltos, landmarks y enlace «Saltar al
  contenido».
- Foco siempre visible. Menú y acordeón con ARIA y teclado completo.
- Contraste WCAG 2.2 AA en todo estado estable, también sobre el video.
- Se respeta `prefers-reduced-motion`.

### Video de la portada

- H.264 sin audio, `yuv420p`, `+faststart` y un fotograma clave por cuadro. Seedance
  entrega HEVC con GOP largo: hay que recodificarlo (comando en README-DEV.md).
- No se detecta el navegador por user agent: se hace una prueba real de salto.
- El estado se ve en `#hero[data-video-modo]` y `#hero[data-video-motivo]`.

### JavaScript

- Funciones autoejecutables con `"use strict"`, sin dependencias.
- No ocultes errores con `catch` vacíos ni éxitos fingidos. Una alternativa debe ser la
  que dice la spec.
- Nada de cookies, analítica ni peticiones a terceros al cargar la página.

## Informe de cierre

Resume el comportamiento implementado, los documentos de la funcionalidad afectados y los
resultados de la validación. Enlaza cada criterio de aceptación con su evidencia en
`TASKS.md`. Señala con claridad lo incompleto o no verificado: el nombre de una prueba,
un comando sin ejecutar o «debería funcionar» no son evidencia.
