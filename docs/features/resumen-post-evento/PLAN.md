# PLAN: Resumen después del evento

**SPEC de referencia:** [docs/features/resumen-post-evento/SPEC.md](SPEC.md)
**Versión de la spec revisada:** 24-oct-2026 (En revisión)
**Estado:** Borrador <!-- Borrador | En revisión | Aprobado -->

<!-- Ejemplo de la charla. En un proyecto real este plan se escribe cuando la SPEC está
Aprobada; aquí se adelanta para mostrar el recorrido completo. No se implementa nada
hasta aprobar ambos documentos y recibir la autorización. -->

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
| Contrato de contenido | `assets/js/contenido.js` | `registro`, `hero.ctaPrimario`, `evento.cta`, `evento.fechaDia`, `ctaFinal.boton`, `faq.preguntas`, `sitio.nav`, `footer.redes`: lo que cambia en el modo resumen |
| Botones de registro | `assets/js/main.js` (`configurarRegistro`, `pintarTextos`) | Los enlaces `data-registro` (cabecera y menú) y los `data-cta` con `usaRegistro` (portada, evento y cierre) toman `registro.url`: cambiando `registro` cambian todos (RF-02) |
| Cambio de día | `assets/js/main.js` (`iniciarCuenta`) | Hoy compara `fechaDia` con la fecha **local** del navegador: no usa la hora de Bolivia (choca con RF-01) |
| Preguntas frecuentes | `assets/js/main.js` (`pintarAcordeon`) | Pinta todas las preguntas; hay que filtrar (RF-07) |
| Imágenes con respaldo | `assets/js/main.js` (`pintarImagenes`) | Degradado si una imagen falla; se reutiliza en la galería |
| Contadores | `assets/js/main.js` (`animarContador`, `formatoCifra`) | Se reutilizan para las cifras de la jornada (RF-05) |
| Estructura | `index.html` (`#hero` a `#cta-final`, `noscript`, `<head>`) | Se agrega la sección «Así fue»; `noscript` y `<head>` son estáticos |

**Convenciones y patrón de referencia:** las de `AGENTS.md`: todo texto en `contenido.js`,
sin dependencias, tokens de `:root`, accesibilidad AA. La sección de cifras y el acordeón
son el patrón para la galería y su lista.

## Solución propuesta

<!-- Enfoque y motivos. Responsabilidades y recorrido de datos y eventos hasta la
interfaz. Usa un diagrama si aclara. -->

El modo se decide una sola vez al cargar, con la fecha de Bolivia, y el contenido del modo
resumen se superpone al de siempre antes de pintar la página:

```
hoy en America/La_Paz (Intl.DateTimeFormat)  >  evento.fechaDia ?
        │ sí                                   │ no
        ▼                                      ▼
   modo = "resumen"                       modo = "evento"  (página de siempre, RF-08)
        │
        ├─ <html data-modo="resumen">
        ├─ WTM_CONTENIDO.resumen se superpone a hero, registro, evento.cta y ctaFinal
        ├─ se muestra #asi-fue: galería, cifras de la jornada y materiales
        └─ el acordeón omite las preguntas con soloAntes: true
```

La misma fecha de Bolivia reemplaza a la fecha local en `iniciarCuenta`, así el mensaje de
cierre de `landing-wtm` (CA-06) también cambia a la medianoche de Bolivia.

La ampliación de fotos usa el elemento nativo `<dialog>` con `showModal()`: atrapa el foco,
se cierra con Escape y no suma dependencias. Al cerrarse, el foco vuelve a la foto que lo
abrió.

## Archivos y componentes afectados

<!-- Distingue lo que se reutiliza, modifica o crea. Las rutas nuevas son propuestas.
Señala el impacto sobre contratos o componentes compartidos. -->

| Archivo o componente | Acción | Cambio y responsabilidad | Requisito relacionado |
| --- | --- | --- | --- |
| `assets/js/main.js` | Modificar | Función `hoyEnBolivia()`; cálculo del modo; superposición de `resumen`; filtro del acordeón; galería y visor | RF-01–RF-04, RF-07 |
| `assets/js/contenido.js` | Modificar | Objeto `resumen` y campo `soloAntes` en cada pregunta | RF-02–RF-07 |
| `index.html` | Modificar | Sección `#asi-fue` (oculta por defecto) y `<dialog class="visor">` | RF-04–RF-06 |
| `assets/css/styles.css` | Modificar | Galería en rejilla (1 a 3 columnas), visor y estados de foco | RF-04 |
| `assets/img/asi-fue/*.jpg` | Crear (propuesto) | 6 a 12 fotos del encuentro, ≤ 200 KB, sin metadatos | RF-04 |
| `README-DEV.md` | Modificar | Documentar `resumen` y `soloAntes` | RF-01 |

Módulos: no aplica.

## Datos y contratos

<!-- Completa solo lo aplicable. Si un punto no aplica, di por qué. -->

- **Contratos de contenido y configuración:** nuevo objeto en `contenido.js` (propuesta):

  ```js
  resumen: {
    hero: { antetitulo, titulo: "Así fue Break the Pattern", subtitulo,
            ctaPrimario: { texto: "Mira cómo fue", href: "#asi-fue" } },
    registro: { texto: "Únete a la comunidad", url: /* PENDIENTE: Linktree o GDG */ "" },
    evento: { cta: { texto: "Sigue a la comunidad", usaRegistro: true } },
    ctaFinal: { titulo, parrafo, boton: { texto, usaRegistro: true } },
    asiFue: {
      antetitulo, titulo,
      fotos: [{ src, alt, ancho, alto }],                 // 6 a 12
      cifras: [{ valor, sufijo, etiqueta }],              // PENDIENTE (organización)
      fuenteCifras: "Organización WTM Santa Cruz, 25-oct-2026",
      materiales: [{ titulo, autora, url }],              // [] = bloque oculto
    },
  }
  ```

  Y en cada pregunta frecuente: `soloAntes: true | false`.
- **Origen de los datos mostrados y transformaciones:** fotos y cifras de la organización;
  materiales de las ponentes. Las fotos se reexportan a 1600 px de ancho como máximo:
  `ffmpeg -i original.jpg -vf scale='min(1600,iw)':-2 -q:v 5 -map_metadata -1 salida.jpg`
  (`-map_metadata -1` quita la ubicación y los datos de la cámara).
- **Almacenamiento en el navegador:** ninguno nuevo.
- **Servicios externos y enlaces de salida:** el destino de comunidad (PENDIENTE) y los
  materiales. Ninguna petición a terceros al cargar.
- **Compatibilidad con contenido existente:** sin `resumen` en `contenido.js`, la página
  no cambia de modo (RF-08).

## Estado, eventos y errores

<!-- Cómo se implementan los comportamientos aprobados. Cita RF/CA y aplica los puntos
de WEB_GUIDELINES.md que correspondan. -->

- **Estado de la interfaz y navegación:** `data-modo` en `<html>` gobierna qué se ve. En
  modo resumen el menú agrega «Así fue» y quita «Preguntas» si no queda ninguna (CA-10).
- **Recarga, historial y posición de lectura:** sin cambios; lo resuelve
  `video-scroll-portada`. En modo evento, `#asi-fue` está oculta y no figura en el menú.
- **Eventos, temporizadores y cancelación:** el modo se calcula al cargar; si la página
  queda abierta a medianoche, cambia al recargar (decisión de la spec). Fotos con
  `loading="lazy"` y dimensiones declaradas (CA-07).
- **Errores, alternativas y tiempos de espera:** una foto que falla usa el degradado de
  `pintarImagenes`. Lista de materiales vacía: bloque oculto (CA-09).
- **Otros puntos web aplicables y su solución:** el visor se cierra con Escape y devuelve
  el foco en el evento `close` (CA-06); movimiento reducido sin transiciones.

## Dependencias, configuración y agentes

<!-- Librerías, servicios, hosting o configuración afectados. Justifica cada incorporación.
Indica si hacen falta subagentes y la responsabilidad acotada de cada uno. -->

- Ninguna dependencia nueva: `Intl.DateTimeFormat` con `timeZone` y `<dialog>` son nativos
  en los navegadores actuales.
- ffmpeg, solo para preparar las fotos.
- **Agentes:** Claude Code implementa y prueba; Codex hace el QA independiente. No se usa
  generación de imágenes: las fotos tienen que ser reales.
- **Personas:** la organización entrega fotos, consentimiento y cifras; las ponentes, sus
  materiales.

## Estrategia de validación

<!-- Una fila por criterio de la spec. Elige el método capaz de demostrarlo: prueba
automática en navegador, comprobación por línea de comandos o prueba manual. Incluye
regresiones. Una captura no demuestra recarga, red ni accesibilidad. -->

| Criterio | Método y prueba existente o propuesta | Entorno y datos necesarios | Evidencia prevista |
| --- | --- | --- | --- |
| CA-01 | Playwright: `timezoneId: 'America/La_Paz'` y `page.clock` en 25-oct 00:05 | Chrome; servidor local | `data-modo` = resumen |
| CA-02 | Playwright: `timezoneId: 'Europe/Madrid'` y 25-oct 03:00 | Chrome | `data-modo` = evento |
| CA-03 | Playwright: enlaces visibles con `href` a luma.com | Modo resumen | Lista vacía |
| CA-04 | Playwright: activar «Mira cómo fue» | Modo resumen | `#asi-fue` en pantalla |
| CA-05 | Playwright: conteo de fotos y `alt`; `scrollWidth` en 9 anchos | Fotos de prueba | Conteo; exceso 0 px |
| CA-06 | Playwright solo con teclado | Chrome | `dialog.open`; foco final |
| CA-07 | Peso de cada archivo; registro de peticiones al bajar | Fotos reales | ≤ 200 KB; momento de la petición |
| CA-08 | Revisión del texto contra lo entregado por la organización | Cifras reales | Fuente y fecha visibles |
| CA-09 | Playwright con lista vacía y con materiales; `curl -L` a cada enlace | Ambos casos | Bloque oculto; HTTP 200 |
| CA-10 | Playwright: preguntas visibles en modo resumen | Chrome | Ninguna con `soloAntes` |
| CA-11 | `qa/verificar-correcciones.cjs` y pruebas de `landing-wtm` el 24-oct | Chrome | Mismos resultados |

**Comprobaciones de regresión:** `landing-wtm` y `video-scroll-portada` completos en modo
evento; 0 errores de consola y 0 peticiones externas en ambos modos.

**Comandos verificados para servir y probar:** `python3 -m http.server 8080`; Playwright
1.56.1 con `channel: 'chrome'`.

**Pruebas en navegadores y dispositivos reales:** Safari en iPhone (galería y visor) y un
lector de pantalla real.

**Limitaciones del entorno:** solo Google Chrome; las zonas horarias se simulan.

## Orden de implementación

<!-- Etapas y dependencias principales con puntos de comprobación. El desglose ejecutable
va en TASKS.md. -->

1. Fecha de Bolivia y cálculo del modo. Comprobación: CA-01, CA-02 y CA-11.
2. Contrato `resumen` y superposición. Comprobación: CA-03, CA-04 y CA-10.
3. Sección «Así fue» y visor, con fotos de prueba. Comprobación: CA-05, CA-06 y CA-09.
4. Fotos y cifras reales. Comprobación: CA-07 y CA-08.
5. QA independiente y publicación autorizada.

## Riesgos y decisiones pendientes

<!-- Riesgos concretos de esta solución y cómo se tratan. Escribe Ninguna en las
decisiones pendientes cuando estén resueltas. -->

- **Riesgos y medidas acordadas:**
  - Zona horaria: si se olvida la hora de Bolivia, una visita desde Europa cambia antes de
    tiempo. Lo cubre CA-02.
  - Fotos pesadas o con ubicación: se reexportan con ffmpeg y se mide su peso (CA-07).
  - Consentimiento: sin la confirmación de la organización, la galería no se publica.
  - Enlaces de materiales que dejan de existir: se comprueban antes de publicar (CA-09).
- **Decisiones pendientes:** las cinco de la spec. La de la vista previa en redes define si
  la tarea de publicación incluye cambiar el `<head>` y el `noscript` el 25 de octubre.

<!-- ANTES DE PEDIR LA APROBACIÓN
Comprueba que el plan cubre los requisitos, respeta las exclusiones, reutiliza lo
verificado y permite demostrar todos los criterios. Tras la aprobación, deriva TASKS.md
con identificadores, dependencias, referencias a RF/CA y comprobaciones.
-->
