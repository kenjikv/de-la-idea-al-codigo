NO APTO — se reproducen saltos de lectura al cargar/recargar el video, contraste insuficiente durante el scrubbing y discrepancias de contenido/metadatos.

# Informe de QA independiente

Auditoría realizada el **24 de octubre de 2026**, en macOS, con **Google Chrome 155.0.8059.85**, Playwright 1.56.1 ya instalado y Pillow 11.3.0. Sitio servido desde `http://127.0.0.1:8080/`; servidor temporal propio en `127.0.0.1:8093` para probar respuestas 206. La implementación se mantuvo intacta: los cambios de CSS, reloj y red usados para medir se aplicaron solamente a contextos desechables del navegador. No se instaló software ni se completó un registro externo.

**Hallazgos reproducidos: 0 BLOQUEANTES, 2 de severidad ALTA, 3 MEDIA y 0 BAJA.** Las limitaciones están al final; no se presentan como fallos confirmados.

## Resumen de los ocho requisitos

| Punto | Estado | Evidencia / alcance |
| --- | --- | --- |
| 1. Video ligado al scroll | PASA | 11 mediciones por ruta: 6 posiciones de bajada y 5 de subida; Blob y HTTP 206. Fallbacks 404, timeout y reduce comprobados. El salto de carga/recarga se clasifica en el punto 8. |
| 2. Botones y enlaces | PASA | 21 enlaces del cuerpo y 2 href del head inventariados; 12 anclas activadas; 4 registros abren la URL exacta; 6 destinos externos terminan en HTTP 200. |
| 3. Responsive | PASA | Nueve anchuras, sin overflow; objetivos visibles y menú abierto cumplen 44×44 px a 320 px. Prueba adicional 320×568 sin recorte de los CTA. |
| 4. Legibilidad y contraste | FALLA | Hero con opacidad 0,48 al 80%: titular y párrafo incumplen. Tarjetas, agenda, cifras, FAQ y pie medidos. |
| 5. Accesibilidad estructural y teclado | PASA | Un h1; jerarquía sin saltos; landmarks; skip link; foco visible; seis FAQ por Enter/Espacio; menú por Tab/Escape; lang y alt. El contraste se evalúa aparte en el punto 4. |
| 6. Consola y red | PASA | Carga, recorrido completo y recargas normales: 0 errores, 0 advertencias, 0 HTTP 404, 0 solicitudes a dominios externos. |
| 7. Contenido | FALLA | Sin marcadores renderizados; fecha/sede/dirección correctas. Cifras no coinciden íntegramente con INVESTIGACION.md; metadatos estáticos desactualizados y og:url ausente. |
| 8. Robustez | FALLA | Recarga 800→4000 px y carga lenta 400→2000 px; mensaje «Es hoy» persiste el día siguiente. Scroll rápido converge y rAF se detiene fuera del hero. |

## Hallazgos por severidad

### ALTA — QA-01: recargar o terminar de cargar el video desplaza a la persona fuera de su lectura

**Ubicación:** `assets/js/scroll-video.js:60`, especialmente la compensación incondicional de `scrollY` en la línea 65 y la activación de altura en la línea 243.

**Observación reproducida:** a 1280×800, una recarga desde `scrollY=800`, con el título del hero visible, termina en `scrollY=4000`, sobre las tarjetas de WTM. Otra recarga desde 4500 termina en 6100. Con cada solicitud al MP4 demorada 4 s, hacer scroll hasta 400 mientras el hero mide 800 px termina en 2000 cuando el hero crece a 2400 px; el texto del hero queda con opacidad 0. La compensación de altura también actúa cuando la persona todavía está dentro del hero. La interacción exacta con el anclaje/restauración nativos del navegador no se aisló; el salto sí está reproducido dos veces en contextos independientes.

**Reproducción:** 1. Abrir la página con movimiento normal y esperar `data-video-modo="scrub"`. 2. En un viewport 1280×800, desplazar instantáneamente a 800 px. 3. Recargar y esperar la carga del video. 4. Comparar posición y contenido: 800→4000, de «Break the Pattern» a «Visión de futuro». Para carga lenta: interceptar `**/hero.mp4` con un retraso de 4000 ms, abrir la página, desplazar a 400 durante `cargando` y esperar la activación.

**Impacto:** se pierde el punto de lectura y se omite buena parte de la experiencia principal, incluso al recargar sin intención de navegar a otra sección.

**Pruebas:** [antes](/private/tmp/claude-501/qa-independent/reload-before.png), [después](/private/tmp/claude-501/qa-independent/reload-after.png), `results.json → reload/slow`, `deep-results.json → reloadBefore/reloadAfter`.

### ALTA — QA-02: el texto visible del hero pierde el contraste mínimo durante el scroll

**Ubicación:** `assets/css/styles.css:623`, `:635` y `:657`: el contenido se desvanece a la vez que se aclara el velo del video.

**Observación reproducida:** con progreso 0,80 y opacidad 0,48, los valores numéricos de la tabla de contraste son inferiores a 3:1 para el h1 y a 4,5:1 para el subtítulo, tanto en 1280 como en 320 px. El estado permanece indefinidamente si se deja de desplazar: no es un fotograma transitorio de una animación temporal. Al 90% el texto aún existe visualmente, con opacidad 0,08 y contraste cercano a 1:1.

**Reproducción:** 1. Abrir sin `prefers-reduced-motion`. 2. Usar 1280×800 y esperar el video. 3. Desplazar a 1280 px, el 80% del recorrido de 1600. 4. Detener el scroll y observar el texto sobre la cara/fondo del video. 5. Repetir a 320×800. La captura de fondo conserva velos, sombras y transparencias; los detalles de cálculo están en las mediciones.

**Impacto:** la lectura del título y de la explicación principal resulta difícil para personas con visión reducida. La regla `:focus-within` mejora el estado enfocado, pero no corrige la lectura con ratón o tacto.

**Pruebas:** [1280 px al 80%](/private/tmp/claude-501/qa-independent/contrast-4-normal.png), [320 px al 80%](/private/tmp/claude-501/qa-independent/contrast-10-normal.png), `contrast-results.json`.

### MEDIA — QA-03: las cifras renderizadas no conservan la trazabilidad/precisión del documento de investigación

**Ubicación:** `assets/js/contenido.js:214` y `:227`; referencia `contenido/INVESTIGACION.md:135`. El redondeo del contador en `assets/js/main.js:483` también debe considerarse al recuperar decimales.

**Observación reproducida:** al finalizar la animación aparecen `+330`, `30 %`, `29 %` y `40 %`. La investigación documenta **29,2%**, no 29%; la interfaz no indica que redondea. No se encuentra una cifra de 330 personas registradas en `INVESTIGACION.md`. Esto demuestra una discrepancia y una falta de respaldo en la fuente exigida, no demuestra que 330 sea falso ni se ha comprobado el padrón privado de Luma.

**Reproducción:** 1. Abrir `#cifras`. 2. Esperar más de 1600 ms. 3. Leer el valor y su atribución WEF/BID. 4. Compararlo con el apartado 7 de INVESTIGACION.md. 5. Buscar `330` en ese documento: sin coincidencias.

**Impacto:** se altera un dato atribuido a una fuente y se presenta una cifra de inscripciones cuya fecha y evidencia no quedan documentadas; se incumple la concordancia pedida entre sitio e investigación.

### MEDIA — QA-04: el HTML inicial y los metadatos renderizados describen versiones distintas del evento

**Ubicación:** `index.html:11`, `:19` y `:27`; `assets/js/contenido.js:17` y `:21`; actualización mediante JS en `assets/js/main.js:67`.

**Observación reproducida:** el HTML servido conserva el título «Women Techmakers Santa Cruz · Día de la Mujer Boliviana» y la descripción «Celebramos el 11 de octubre…», mientras el DOM con JS usa «Break the Pattern · Women Techmakers Santa Cruz» y la sede real. OG y Twitter presentan esa misma discrepancia inicial. `og:url` y canonical no están presentes, porque `meta.url` está vacío. Ambas imágenes apuntan a `assets/img/og.jpg`, que sí responde 200 y mide 1200×678, coherente con width/height declarados.

**Reproducción:** 1. Ejecutar `curl http://127.0.0.1:8080/` o abrir el código fuente. 2. Comparar title, description, og:title/description y twitter:title/description con el DOM tras ejecutar JS. 3. Consultar `meta[property="og:url"]` y `link[rel="canonical"]`: no existen.

**Impacto:** los consumidores del HTML que no ejecutan la actualización reciben una identidad anterior y una descripción centrada en el 11 de octubre; faltan metadatos de URL para publicación. **NO VERIFICADO:** el resultado concreto de una tarjeta social real, porque no hay origen público de despliegue y no se publicó nada.

### MEDIA — QA-05: «Es hoy» sigue apareciendo el día siguiente

**Ubicación:** `assets/js/contenido.js:130` y `:151`; rama de fecha vacía en `assets/js/main.js:464`.

**Observación reproducida:** con el reloj del navegador fijado a `2026-10-25T12:00:00-04:00`, se muestra exactamente «Es hoy, sábado 24 de octubre. Revisa el horario exacto en tu confirmación de Luma.» El campo `fechaISO` vacío conduce siempre a `sinFecha`, sin comprobar la fecha del evento.

**Reproducción:** 1. En un contexto desechable, fijar Date/Date.now al 25 de octubre de 2026, como hace `deep.cjs`. 2. Cargar la página. 3. Leer `[data-cuenta-mensaje]`: sigue afirmando «Es hoy». No es necesario modificar el reloj del sistema ni los archivos del sitio.

**Impacto:** quien abra la landing después del evento recibirá una indicación temporal falsa. En la fecha de esta auditoría, 24 de octubre, el mensaje sí es correcto.

## Mediciones

### Scrubbing: avance, retroceso y proporcionalidad

Viewport 1280×800, hero de 2400 px, recorrido útil 1600 px. Duración real **10,041667 s**. Progreso esperado `p = scrollY / 1600`; tiempo objetivo `p × (duración − 0,05)`. Cada posición se mantuvo 1000 ms antes de medir. Se mide `video.currentTime`, no una deducción a partir del código ni del indicador CSS.

| Dirección | scrollY px | Progreso esperado y real | Objetivo s | Real Blob s | Real HTTP 206 s | Error máx. s |
| --- | --- | --- | --- | --- | --- | --- |
| Bajada | 0 | 0% | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| Bajada | 320 | 20% | 1.998333 | 1.990140 | 1.990140 | 0.008193 |
| Bajada | 640 | 40% | 3.996667 | 3.988470 | 3.988470 | 0.008197 |
| Bajada | 960 | 60% | 5.995000 | 5.986803 | 5.986804 | 0.008197 |
| Bajada | 1280 | 80% | 7.993334 | 7.985137 | 7.985137 | 0.008197 |
| Bajada | 1600 | 100% | 9.991667 | 9.983471 | 9.983471 | 0.008196 |
| Subida | 1280 | 80% | 7.993334 | 8.001522 | 8.001522 | 0.008188 |
| Subida | 960 | 60% | 5.995000 | 6.003196 | 6.003196 | 0.008196 |
| Subida | 640 | 40% | 3.996667 | 4.004863 | 4.004863 | 0.008196 |
| Subida | 320 | 20% | 1.998333 | 2.006529 | 2.006529 | 0.008196 |
| Subida | 0 | 0% | 0.000000 | 0.008196 | 0.008195 | 0.008196 |

Los tiempos crecen estrictamente en bajada y decrecen estrictamente en subida en ambas rutas; el mayor error asentado es **0,008197 s**, inferior al umbral de 1/60 s del controlador. No se exige igualdad instantánea durante un cambio de dirección: hay interpolación deliberada.

- **Sin rangos:** Python respondió 200 a `Range: bytes=0-100`; el navegador terminó con `currentSrc` de tipo `blob:http://127.0.0.1:8080/…`, readyState 4 y modo `scrub`.
- **Con rangos:** el servidor de prueba devolvió **206** para `hero.mp4`; `currentSrc` permaneció `http://127.0.0.1:8093/assets/video/hero.mp4`, sin conversión a Blob, readyState 4 y modo `scrub`.

| Escenario inyectado | Resultado observado | Hero px | Video / red | Contenido útil |
| --- | --- | --- | --- | --- |
| MP4 devuelve 404 | poster / error | 800 | currentTime=0; error HTTP esperado de la inyección | Póster cargado, CTA conserva Luma |
| Solicitud de MP4 retenida sin responder | cargando a 0,3 s; poster / tiempo a ~7,3 s | 800 | currentTime=0; 0 rAF pendientes | Póster cargado, CTA conserva Luma |
| prefers-reduced-motion: reduce desde inicio | poster / reduce | 800 | 0 solicitudes MP4; 0 rAF pendientes | Póster y texto visibles |
| Reduce activado con video ya cargado | scrub → poster | 800 | Video deja de mostrarse | Texto disponible; volver a no-preference conserva el póster hasta recargar |
| MP4 demorado 4 s por solicitud | cargando → scrub | 2400 | Blob cargado; currentTime=10,003921 s al muestreo | Se reproduce salto 400→2000; QA-01 |

### Anchuras y objetivos táctiles

Se midió `document.documentElement.scrollWidth` contra `clientWidth`, después de activar el video, revelar todo el contenido y redimensionar. Se inspeccionaron los rectángulos de los elementos visibles para identificar posibles culpables.

| Viewport px | clientWidth px | scrollWidth px | Exceso px | Selector culpable |
| --- | --- | --- | --- | --- |
| 320 | 320 | 320 | 0 | Ninguno |
| 360 | 360 | 360 | 0 | Ninguno |
| 375 | 375 | 375 | 0 | Ninguno |
| 414 | 414 | 414 | 0 | Ninguno |
| 768 | 768 | 768 | 0 | Ninguno |
| 1024 | 1024 | 1024 | 0 | Ninguno |
| 1280 | 1280 | 1280 | 0 | Ninguno |
| 1440 | 1440 | 1440 | 0 | Ninguno |
| 1920 | 1920 | 1920 | 0 | Ninguno |

A 320×800, los **20 objetivos visibles del cuerpo** (menú cerrado, excluido el skip link oculto hasta foco), los **7 enlaces del menú abierto** y el **skip link enfocado** cumplen 44×44 px. Ejemplos mínimos reales: logo 158,53×44; mapa 116,89×44; «Volver arriba» 101×44; registro del menú 116,64×44; botón de menú 48×48; FAQ entre 288×71,19 y 288×83,56. El skip link enfocado mide **191,95×52,05 px** a 320 px (`final-check.json`). Ningún control falló. La caja de aviso está oculta y no existe ningún enlace pendiente que la active, por lo que no se cuenta como objetivo disponible.

Prueba adicional a **320×568**: el h1 ocupa y=272,19–304,81; los CTA y=432,81–482,41 y 494,41–544, dentro del viewport. Datos completos de cada objetivo: `results.json → touch/touchMenu`.

### Contraste real del texto

Método: capturas PNG del navegador a escala 1; estilos computados de color, tamaño, peso y producto de opacidades de ancestros; fondos muestreados cada 2 px dentro de las cajas de las líneas de texto. Para capturar el fondo se hizo transparente únicamente el relleno del texto, **conservando la sombra y el resto de capas**. En el hero se tomó además una captura con el grupo de contenido oculto para calcular la composición de cada texto semitransparente contra el fondo que está detrás del grupo. Se usa el mínimo de los fondos muestreados en el área textual, no un promedio del video. Se excluye el texto totalmente invisible.

Fórmula: sRGB linealizado (`c/12,92` si `c≤0,04045`, o `((c+0,055)/1,055)^2,4`), luminancia `0,2126R+0,7152G+0,0722B`, contraste `(Lmayor+0,05)/(Lmenor+0,05)`. Umbrales: **4,5:1** cuerpo y texto pequeño; **3:1** para ≥24 px o ≥18,67 px con peso ≥700. Todas las cifras siguientes son ratios `:1`.

**Hero sobre el video:**

| Ancho | Progreso | Opacidad | Antetítulo (4,5) | H1 (3) | Subtítulo (4,5) | Registro (4,5) | CTA secundario (4,5) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1280 | 0% | 1.00 | 17.18 | 17.37 | 17.17 | 4.57 | 18.24 |
| 1280 | 20% | 1.00 | 17.46 | 17.18 | 17.18 | 4.57 | 18.34 |
| 1280 | 40% | 1.00 | 16.71 | 16.76 | 17.33 | 4.57 | 18.36 |
| 1280 | 60% | 1.00 | 16.23 | 16.81 | 17.40 | 4.57 | 18.37 |
| 1280 | 80% | 0.48 | 3.09 **FALLA** | 2.44 **FALLA** | 3.36 **FALLA** | 1.88 **FALLA** | 4.69 |
| 1280 | 90% | 0.08 | 1.13 **FALLA** | 1.07 **FALLA** | 1.15 **FALLA** | 1.04 **FALLA** | 1.15 **FALLA** |
| 320 | 0% | 1.00 | 16.37 | 16.78 | 17.33 | 4.57 | 18.15 |
| 320 | 20% | 1.00 | 16.03 | 16.35 | 16.89 | 4.57 | 17.70 |
| 320 | 40% | 1.00 | 15.82 | 16.37 | 16.56 | 4.57 | 17.82 |
| 320 | 60% | 1.00 | 15.51 | 16.33 | 16.67 | 4.57 | 17.94 |
| 320 | 80% | 0.48 | 3.11 **FALLA** | 2.90 **FALLA** | 2.90 **FALLA** | 2.06 **FALLA** | 4.26 **FALLA** |
| 320 | 90% | 0.08 | 1.16 **FALLA** | 1.12 **FALLA** | 1.16 **FALLA** | 1.11 **FALLA** | 1.24 **FALLA** |

**FALLA:** todos los valores inferiores al umbral de su columna; en particular el h1 y subtítulo al 80% y 90% en ambos anchos. «Desliza», visible al inicio: 8.85 a 1280 px y 8.84 a 320 px (mínimo 4,5).

**Tarjetas, evento, agenda, cifras, FAQ y pie**, con contenido revelado y animaciones asentadas, a 1280×800:

| Zona | Selector | Ratio mínimo | Umbral | Resultado |
| --- | --- | --- | --- | --- |
| Tarjeta 1: título | h3.tarjeta__titulo | 15.89 | 3 | PASA |
| Tarjeta 1: cuerpo | p.tarjeta__texto | 7.76 | 4.5 | PASA |
| Tarjeta 1: número decorativo | span.tarjeta__num | 4.70 | 4.5 | PASA |
| Tarjeta 2: título | h3.tarjeta__titulo | 15.89 | 3 | PASA |
| Tarjeta 2: cuerpo | p.tarjeta__texto | 7.76 | 4.5 | PASA |
| Tarjeta 2: número decorativo | span.tarjeta__num | 4.27 | 4.5 | BAJO UMBRAL* |
| Tarjeta 3: título | h3.tarjeta__titulo | 15.87 | 3 | PASA |
| Tarjeta 3: cuerpo | p.tarjeta__texto | 7.76 | 4.5 | PASA |
| Tarjeta 3: número decorativo | span.tarjeta__num | 9.73 | 4.5 | PASA |
| Agenda 1: título / cuerpo / número | .linea__titulo / .linea__texto / .linea__hora | 18.35 / 8.89 / 6.84 | 3 / 4,5 / 4,5 | PASA |
| Agenda 2: título / cuerpo / número | .linea__titulo / .linea__texto / .linea__hora | 18.35 / 8.89 / 6.84 | 3 / 4,5 / 4,5 | PASA |
| Agenda 3: título / cuerpo / número | .linea__titulo / .linea__texto / .linea__hora | 18.35 / 8.89 / 6.84 | 3 / 4,5 / 4,5 | PASA |
| Agenda 4: título / cuerpo / número | .linea__titulo / .linea__texto / .linea__hora | 18.35 / 8.89 / 6.84 | 3 / 4,5 / 4,5 | PASA |
| Agenda 5: título / cuerpo / número | .linea__titulo / .linea__texto / .linea__hora | 18.35 / 8.89 / 6.84 | 3 / 4,5 / 4,5 | PASA |
| Cifra 1: valor / explicación | .cifra__numero / .cifra__etiqueta | 16.77 / 8.00 | 3 / 4,5 | PASA |
| Cifra 2: valor / explicación | .cifra__numero / .cifra__etiqueta | 17.02 / 8.21 | 3 / 4,5 | PASA |
| Cifra 3: valor / explicación | .cifra__numero / .cifra__etiqueta | 17.02 / 8.24 | 3 / 4,5 | PASA |
| Cifra 4: valor / explicación | .cifra__numero / .cifra__etiqueta | 17.02 / 8.24 | 3 / 4,5 | PASA |
| FAQ 1: pregunta / respuesta | .acordeon__pregunta / .acordeon__panel p | 18.35 / 8.89 | 4,5 / 4,5 | PASA |
| FAQ 2: pregunta / respuesta | .acordeon__pregunta / .acordeon__panel p | 18.35 / 8.89 | 4,5 / 4,5 | PASA |
| FAQ 3: pregunta / respuesta | .acordeon__pregunta / .acordeon__panel p | 18.35 / 8.89 | 4,5 / 4,5 | PASA |
| FAQ 4: pregunta / respuesta | .acordeon__pregunta / .acordeon__panel p | 18.35 / 8.89 | 4,5 / 4,5 | PASA |
| FAQ 5: pregunta / respuesta | .acordeon__pregunta / .acordeon__panel p | 18.35 / 8.89 | 4,5 / 4,5 | PASA |
| FAQ 6: pregunta / respuesta | .acordeon__pregunta / .acordeon__panel p | 18.35 / 8.89 | 4,5 / 4,5 | PASA |
| Datos del evento | .evento__datos dd | 18.35 | 4.5 | PASA |
| Dirección del evento | span.dato__secundario | 8.89 | 4.5 | PASA |
| Mensaje del evento | p.cuenta__mensaje | 13.16 | 3 | PASA |
| CTA del evento | a.boton.boton--primario.boton--ancho | 5.23 | 4.5 | PASA |
| Pie: crédito | p.pie__credito | 17.02 | 4.5 | PASA |
| Pie: texto legal | p.pie__legal | 8.24 | 4.5 | PASA |
| Pie: Síguenos | h2.pie__titulo | 8.24 | 4.5 | PASA |
| Pie: todos los enlaces sociales | span.red__nombre | 17.02 | 4.5 | PASA |
| Pie: Volver arriba | a.enlace.pie__arriba | 6.34 | 4.5 | PASA |
| CTA final: título | #cta-final-titulo | 15.73 | 3 | PASA |
| CTA final: cuerpo | p.cta-final__texto | 8.69 | 4.5 | PASA |
| CTA final: botón | a.boton.boton--primario.boton--grande | 5.23 | 4.5 | PASA |

*El ordinal «02» de `.tarjeta:nth-child(2) .tarjeta__num` mide aproximadamente 4,27:1: queda por debajo del umbral numérico de texto pequeño. Está marcado `aria-hidden="true"` y repite una posición puramente decorativa; se registra como observación, sin tratarlo como cuerpo informativo ni elevarlo a un hallazgo de incumplimiento WCAG. Su título y descripción sí pasan. No se han usado estos números decorativos para esconder ningún fallo de cuerpo de texto.

Los archivos `contrast-records.json` y `contrast-results.json` conservan RGB, opacidad, tamaño, peso, cajas y capturas de cada medición, incluyendo las que se agrupan en esta tabla. Se muestrearon seis estados del video por ancho; no se verificó cada fotograma ni cada posible ancho.

## Inventario de enlaces y activaciones

Todos los `href` del DOM renderizado se enumeran a continuación. «—» significa que el atributo está ausente. No hay atributos `onclick` ni propiedades DOM `onclick` asignadas: **0**. Los botones usan `addEventListener`; su funcionamiento se verificó por clic y teclado.

| # | Elemento | href exacto | target | rel | Comprobación |
| --- | --- | --- | --- | --- | --- |
| 1 | icon | URI data SVG completa, reproducida debajo de la tabla | — | icon | Inline, sin red |
| 2 | stylesheet | assets/css/styles.css | — | stylesheet | HTTP 200 |
| 3 | Saltar al contenido | #contenido | — | — | Ancla existente y activada |
| 4 | WTM SANTA CRUZ | #hero | — | — | Ancla existente y activada |
| 5 | Por qué | #por-que | — | — | Ancla existente y activada |
| 6 | WTM | #wtm | — | — | Ancla existente y activada |
| 7 | Evento | #evento | — | — | Ancla existente y activada |
| 8 | Agenda | #agenda | — | — | Ancla existente y activada |
| 9 | Cifras | #cifras | — | — | Ancla existente y activada |
| 10 | Preguntas | #faq | — | — | Ancla existente y activada |
| 11 | Regístrate | https://luma.com/5odhuh0l | _blank | noopener noreferrer | 200 / activado |
| 12 | Regístrate en Luma | https://luma.com/5odhuh0l | _blank | noopener noreferrer | 200 / activado |
| 13 | Conoce la historia | #por-que | — | — | Ancla existente y activada |
| 14 | DESLIZA | #por-que | — | — | Ancla existente y activada |
| 15 | Ver en el mapa | https://www.google.com/maps/search/?api=1&query=Universidad+Evang%C3%A9lica+Boliviana+Santa+Cruz+de+la+Sierra | _blank | noopener noreferrer | HTTP 200 |
| 16 | Quiero asistir | https://luma.com/5odhuh0l | _blank | noopener noreferrer | 200 / activado |
| 17 | Registrarme en Luma | https://luma.com/5odhuh0l | _blank | noopener noreferrer | 200 / activado |
| 18 | WTM SANTA CRUZ | #hero | — | — | Ancla existente y activada |
| 19 | Instagram | https://www.instagram.com/gdg.santacruz/ | _blank | noopener noreferrer | HTTP 200 |
| 20 | Facebook | https://www.facebook.com/wtmsantacruz | _blank | noopener noreferrer | HTTP 200 |
| 21 | Enlaces WTM | https://linktr.ee/wtmsc | _blank | noopener noreferrer | HTTP 200 |
| 22 | Comunidad GDG | https://gdg.community.dev/gdg-santa-cruz/ | _blank | noopener noreferrer | HTTP 200 |
| 23 | Volver arriba | #hero | — | — | Ancla existente y activada |

URI completa del favicon (`link[rel="icon"]`):

```text
data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230A0B14'/%3E%3Cpath d='M12 20l7 24 6-17 6 17 7-24' fill='none' stroke='%23E8467C' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Crect x='42' y='18' width='10' height='3' fill='%234285F4'/%3E%3Crect x='42' y='27' width='10' height='3' fill='%23EA4335'/%3E%3Crect x='42' y='36' width='10' height='3' fill='%23FBBC05'/%3E%3Crect x='42' y='45' width='10' height='3' fill='%2334A853'/%3E%3C/svg%3E
```

Las cuatro activaciones de registro crearon una pestaña nueva con URL **exactamente** `https://luma.com/5odhuh0l`. Para esta prueba de clic se interceptó la navegación de destino con una respuesta local de QA; el HTTP real se comprobó por separado con curl. No se enviaron datos ni se hizo una inscripción.

Los 12 enlaces de ancla se activaron y cambiaron a su hash correcto. Una comprobación adicional esperó 2500 ms y confirmó «Volver arriba» en `scrollY=0`. Los seis destinos del menú quedaron a y≈68 px, alineados debajo de la cabecera fija de 68 px; los enlaces al hero muestran el inicio de la experiencia. Los saltos de carga/recarga independientes de estos clics se documentan en QA-01.

**Destinos externos:** comando equivalente `curl -L -sS --max-time 35 -o /dev/null -w '%{http_code} %{url_effective}' URL`, solicitudes GET reales.

| URL solicitada | Código final | Redirecciones / resultado |
| --- | --- | --- |
| https://luma.com/5odhuh0l | 200 | 0; https://luma.com/5odhuh0l |
| https://www.google.com/maps/search/?api=1&query=Universidad+Evang%C3%A9lica+Boliviana+Santa+Cruz+de+la+Sierra | 200 | 0; https://www.google.com/maps/search/?api=1&query=Universidad+Evang%C3%A9lica+Boliviana+Santa+Cruz+de+la+Sierra |
| https://www.instagram.com/gdg.santacruz/ | 200 | 0; https://www.instagram.com/gdg.santacruz/ |
| https://www.facebook.com/wtmsantacruz | 200 | 1; https://www.facebook.com/WTMSantaCruz/ |
| https://linktr.ee/wtmsc | 200 | 0; https://linktr.ee/wtmsc |
| https://gdg.community.dev/gdg-santa-cruz/ | 200 | 0; https://gdg.community.dev/gdg-santa-cruz/ |

Un HTTP 200 demuestra respuesta del destino, no autenticación, contenido privado ni disponibilidad garantizada de una inscripción. Facebook redirige una vez a `/WTMSantaCruz/`.

## Accesibilidad, contenido, red y robustez: evidencias complementarias

- **Encabezados:** 1 h1, 8 h2 y 14 h3; orden válido h1→h2→h3, sin saltos ascendentes de nivel. El h2 del pie («Síguenos») tiene tamaño pequeño y se evaluó con umbral 4,5, no por su etiqueta.
- **Landmarks:** un `header` principal, un `nav` con etiqueta «Secciones», un `main#contenido` y un `footer.pie`; el footer de la cita no se confundió con el pie global.
- **Idioma e imágenes:** `html[lang="es"]`; las cinco imágenes tienen atributo alt. Hero y textil tienen alt vacío y se tratan como decorativas; comunidad, charla y taller tienen descripción. Las cinco cargaron con dimensiones naturales mayores que cero.
- **Primer Tab / skip:** el primer foco es «Saltar al contenido»; Enter pone `document.activeElement.id="contenido"` y hash `#contenido`. El enlace se hace visible. A 320 px, la secuencia inicial real es skip → logo → menú → registro hero → historia → Desliza → mapa; los enlaces del menú cerrado no se intercalan.
- **Foco visible:** los interactivos ensayados devuelven `matches(':focus-visible')=true`, outline sólido de 3 px; color `rgb(247,247,251)`, y rosa `rgb(232,70,124)` en el skip link. Se revisaron también los enlaces de navegación y registro del menú.
- **FAQ:** las seis preguntas se abrieron con Enter (`aria-expanded=true` y panel visible) y cerraron con Espacio (`false`). ArrowDown desde la primera lleva a la segunda; End a la sexta; Home a la primera; ArrowUp a la sexta. No se necesitó ratón.
- **Menú móvil:** Enter abre y enfoca «Por qué»; Tab recorre las seis anclas, registro y «Cerrar menú», y vuelve a «Por qué». Escape cierra, actualiza `aria-expanded=false`, devuelve el foco al botón y elimina `inert` del main.
- **Marcadores:** búsqueda insensible a mayúsculas de `BORRADOR`, `Lorem`, `TODO`, `PENDIENTE`, `placeholder`: 0 marcadores. Con las seis respuestas abiertas hay una coincidencia literal «todo» en «abierta a todo público» (FAQ 1), que es prosa normal, no un TODO técnico. Los comentarios de los archivos fuente no se confundieron con contenido visible. Las seis respuestas FAQ se abrieron y se leyeron.
- **Datos del evento:** h1 «Break the Pattern»; Women Techmakers Santa Cruz; «Sábado 24 de octubre de 2026»; Universidad Evangélica Boliviana; «Barrio Cruz del Sur 117, Av. Moscú y Sexto Anillo, Santa Cruz de la Sierra»; registro exacto en Luma. Coinciden con el contexto recibido. La hora se remite a la confirmación; no se inventó ni se verificó un horario privado.
- **Cifras:** 30% y 40% coinciden con las cifras documentadas; 29% frente a 29,2% y +330 sin entrada documental se detallan en QA-03. La omisión de 26,7% no se cuenta como defecto: no se exigió mostrar todos los datos de la investigación.
- **Metadatos existentes:** charset, viewport, description, theme-color, color-scheme, og:type/locale/site_name/title/description/image/width/height/image:alt y twitter:card/title/description/image/image:alt presentes. Twitter card es `summary_large_image`. Imagen local 200, 1200×678. Incompletitud/discrepancia descrita en QA-04.
- **Consola/red normales:** 0 `pageerror`, 0 console.error, 0 console.warning, 0 respuestas 404. Se recorrió la página completa en incrementos de 500 px, incluidas las imágenes lazy. Las solicitudes HTTP observadas son solo a `127.0.0.1`; los recursos `blob:` se generaron localmente. La carga y el scroll no requieren internet. Los clics externos son navegación voluntaria, no dependencias de la página. El único 404 del ensayo de fallback fue inyectado deliberadamente y no se atribuye a la carga normal.
- **Scroll rápido:** saltos 0→1500→0→1600→20→1200 con 20 ms entre posiciones; después de 1500 ms en 1200, progreso 0,75 y currentTime **7,489751 s**, contra objetivo **7,493750 s** (error 0,003999 s). Sin errores ni bloqueo. Fuera del hero el tiempo del video puede quedar en su último fotograma porque se pausa el bucle: no es visible allí y no se registra como defecto.
- **rAF y listeners:** fuera del hero, a y=6000, se observan **0 rAF pendientes**, y el contador de callbacks permanece en **1612** durante otros 2000 ms. Cinco entradas/salidas adicionales mantienen 0 rAF fuera del hero y el registro instrumentado de listeners de window/document en **17**, sin crecimiento. El conteo incluye listeners observados por la instrumentación/herramientas, no es un inventario semántico completo de la aplicación. Se conserva un rAF activo mientras el hero está visible, incluso en reposo: comportamiento del bucle, no evidencia de fuga.

## Lo que NO se pudo verificar

1. **NO VERIFICADO — Safari/iOS, Firefox y dispositivos físicos.** Solo se utilizó el Chrome instalado; los tamaños móviles son viewports emulados, no hardware móvil. No se afirma compatibilidad de scrubbing o accesibilidad con otros motores.
2. **NO VERIFICADO — lector de pantalla real y percepción de foco con tecnologías asistivas.** Se midieron DOM, atributos, estilos y teclado; no se ejecutó VoiceOver/NVDA ni una auditoría completa de todas las pautas WCAG.
3. **NO VERIFICADO — tarjeta social real, URL canónica pública y cachés de redes.** No se proporcionó un despliegue público y no se publicó nada. Sí se compararon HTML inicial y DOM, y se descargó el asset OG local.
4. **NO VERIFICADO — contenido privado de Luma, aprobación del registro, padrón de +330 personas y horario exacto.** Se verificaron URL, aperturas y HTTP 200; no se inició sesión ni se enviaron formularios. La auditoría de cifras contrasta con el documento local exigido, no revalida toda la investigación externa.
5. **NO VERIFICADO — ausencia absoluta de fugas de memoria.** La prueba de rAF/listeners demuestra detención y ausencia de crecimiento durante cinco ciclos; no incluye heap snapshots prolongados, BFCache, inicializaciones repetidas deliberadas ni horas de ejecución. La falta de funciones de desmontaje en una página estática no se calificó por sí sola como fuga.
6. **NO VERIFICADO — contraste de todos los fotogramas, anchuras y estados de hover posibles.** Se midieron seis posiciones de video en dos anchos, todas las tarjetas, cinco bloques de agenda, cuatro cifras, seis respuestas FAQ abiertas, datos del evento y pie. Un muestreo no certifica todas las combinaciones; los estados que fallan sí están reproducidos.

## Artefactos y reproducción

- [Prueba principal](/private/tmp/claude-501/qa-independent/audit.cjs) y [resultados](/private/tmp/claude-501/qa-independent/results.json): video, rangos, fallbacks, responsive, DOM, consola/red y rAF.
- [Comprobación final de skip link, marcadores y volver arriba](/private/tmp/claude-501/qa-independent/final-check.json).
- [Pruebas de interacción y reproducción](/private/tmp/claude-501/qa-independent/deep.cjs) y [resultados](/private/tmp/claude-501/qa-independent/deep-results.json).
- [Captura de contraste](/private/tmp/claude-501/qa-independent/contrast.cjs), [cálculo](/private/tmp/claude-501/qa-independent/contrast_calc.py), [muestras](/private/tmp/claude-501/qa-independent/contrast-records.json) y [ratios](/private/tmp/claude-501/qa-independent/contrast-results.json).
- [Comprobación curl](/private/tmp/claude-501/qa-independent/urls.py), [resultados HTTP](/private/tmp/claude-501/qa-independent/urls.json), [cabeceras Python ante Range](/private/tmp/claude-501/qa-independent/python-range-headers.txt) y [HTML inicial servido](/private/tmp/claude-501/qa-independent/index-served.html).

Ejecutar los scripts desde la raíz del proyecto, manteniendo el servidor 8080 activo. `audit.cjs` crea y cierra su servidor de rangos en 8093. `contrast_calc.py` se ejecuta después de `contrast.cjs`. Todos los scripts y capturas están en el scratch autorizado.

Huellas SHA-256 de la implementación auditada:

- `index.html`: `2dd4e700473212212981110427b19fc5d71ac4207028281b9f953ad30931ec21`
- `assets/css/styles.css`: `ea0d8e47da68ed1facbb0899642e002d27cea3aa9c3dff8eb16a665b3d853571`
- `assets/js/contenido.js`: `35ec91df7b54ee409e937575513d33edf251ad1d4f061efe82aaf8a98b5fc505`
- `assets/js/scroll-video.js`: `18162dfc5d748bb9d503fd29c832429b3c037b561c439fa629641945d41bc19c`
- `assets/js/main.js`: `053ee4e94fb899b470ea680129ac5db70a21d1f7f3433f4cd14ba4409452fc05`
