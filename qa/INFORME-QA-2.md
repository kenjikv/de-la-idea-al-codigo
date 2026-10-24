APTO PARA ENTREGAR — las cinco correcciones cumplen las pruebas solicitadas; no se detectaron regresiones ni hallazgos nuevos en el alcance verificado.

# Reauditoría independiente y adversarial

Fecha: **24 de octubre de 2026**. Chrome **155.0.8059.85**, `channel: "chrome", headless: true`, Playwright 1.56.1 existente en `/private/tmp/claude-501/wtm-test`, viewport de referencia 1280×800 y zona America/La_Paz para las pruebas de calendario. Sitio: `http://127.0.0.1:8080/`; servidor temporal propio con rangos en 8094. Se leyeron ambos informes previos, pero todos los números siguientes proceden de nuevas ejecuciones. Solo se crea este informe en el proyecto; las inyecciones de red, reloj y estilos fueron locales a contextos desechables. No se instaló software ni se enviaron formularios.

**5/5 correcciones confirmadas; 0 regresiones; 0 BLOQUEANTES, 0 ALTAS, 0 MEDIAS y 0 BAJAS nuevas.** El veredicto corresponde al alcance pedido y no certifica los aspectos enumerados como NO VERIFICADO.

## Verificación de las correcciones

| ID | Estado | Medición propia |
| --- | --- | --- |
| QA-01 | CORREGIDO | Recargas: 800→800, 4500→4500 y 0→0 px; MP4 +4000 ms: 400→400; FAQ + recarga: 8156→8156. Se conservan hero, evento y FAQ, respectivamente. |
| QA-02 | CORREGIDO | 16 estados a 1280/320 px: opacidad 1 en 0–70 %, opacidad 0 en 80–100 %. Todos los ratios visibles cumplen; mínimo CTA 4,574:1. A 90 %: aria-hidden=true, ambos tabindex=-1, sin nodos de texto/CTA expuestos en AX; enfocar restaura opacidad 1 y contraste. |
| QA-03 | CORREGIDO | Tercera cifra visible y sr-only: «29,2 %»; primera etiqueta coincide exactamente; INVESTIGACION.md:147 contiene 330 y https://luma.com/5odhuh0l. |
| QA-04 | CORREGIDO | Los seis campos del HTML obtenido con curl igualan WTM_CONTENIDO.meta carácter por carácter (47/142 caracteres). Aviso con título alterado: 1 en 127.0.0.1, 1 en localhost, 0 en wtm.test. |
| QA-05 | CORREGIDO | 25-oct 12:00 -04:00: mensaje pasado exacto; 24-oct y 20-oct: «Es hoy…», conforme a los tres casos de aceptación expresos. |

## Regresiones

| Área antes aprobada | Estado | Evidencia nueva |
| --- | --- | --- |
| Scrubbing | SIGUE OK | 11 posiciones por ruta (Blob y HTTP 206); avance y retroceso estrictos; error máximo < 1/60 s. |
| Fallback 404 / timeout / reduce | SIGUE OK | poster/error, poster/tiempo y poster/reduce; hero 800 px; póster cargado y CTA válido; reduce: 0 solicitudes MP4. |
| Responsive | SIGUE OK | Nueve anchuras entre 320 y 1920: scrollWidth=clientWidth en todas. |
| Objetivos táctiles | SIGUE OK | 20 objetivos del cuerpo y 7 del menú abierto a 320 px: todos ≥44×44. |
| Enlaces | SIGUE OK | 23 href inventariados; 12 anclas activadas; cuatro registros abren Luma; seis destinos HTTP externos con código final 200. |
| Acordeón por teclado | SIGUE OK | 6/6 abren con Enter y cierran con Espacio; ArrowDown/End/Home/ArrowUp correctos. |
| Menú móvil por teclado | SIGUE OK | Enter abre; 10 posiciones Tab verifican recorrido y ciclo; Escape cierra, devuelve foco y elimina inert. |
| Consola y red normales | SIGUE OK | 0 errores, 0 advertencias, 0 respuestas 404, 0 solicitudes externas; 39 solicitudes/39 respuestas y 0 requestfailed. |
| Encabezados y estructura | SIGUE OK | 1 h1, 8 h2, 14 h3; ningún salto de nivel; lang es; cinco imágenes cargadas con alt. |
| Contraste fuera del hero | SIGUE OK | Se repitieron tarjetas, datos, agenda, cifras, FAQ y pie; no aparece un nuevo fallo informativo. Ordinal decorativo 02: 4,267:1, ya documentado antes. |
| Scroll rápido / trabajo fuera del hero | SIGUE OK | Secuencia rápida converge; 0 rAF pendientes fuera del hero, contador 1623→1623 en 2 s. |

## Hallazgos nuevos por severidad

**No se reprodujeron hallazgos nuevos.** BLOQUEANTE: 0; ALTA: 0; MEDIA: 0; BAJA: 0. No corresponde asignar archivo, línea, reproducción o impacto a un defecto no demostrado. Las observaciones heredadas y las limitaciones no se contabilizan como regresiones.

## Mediciones

### QA-01: restauración y carga lenta

Mismos pasos: esperar modo scrub, desplazar instantáneamente a 800 o 4500, recargar, esperar scrub y otros 1400 ms. Para carga lenta, retrasar cada petición a hero.mp4 4000 ms, desplazar a 400 durante cargando, esperar scrub y 1300 ms. Se añaden recarga sin desplazamiento y clic en Preguntas seguido de recarga.

| Escenario | Antes px | Final px | Hero final px | Contenido final visible | Opacidad hero |
| --- | --- | --- | --- | --- | --- |
| Recarga | 0 | 0 | 2400 | Break the Pattern | 1 |
| Recarga | 800 | 800 | 2400 | Break the Pattern | 1 |
| Recarga | 4500 | 4500 | 2400 | Nos vemos en la Universidad Evangélica Boliviana | 1 |
| MP4 +4000 ms | 400 | 400 | 2400 | Break the Pattern; antetítulo, subtítulo y CTA del hero | 1 |
| #faq y recarga | 8156 | 8156 | 2400 | Lo que nos suelen preguntar; seis preguntas de FAQ | Hero fuera de pantalla |

En carga lenta el hero crece de 800 a 2400 px sin cambiar scrollY=400: su composición pasa de estar parcialmente desplazada a la escena sticky. El h1 queda a y=408,8125 y no se omite el hero. Desde 4500 el título de evento queda a y=230,890625 antes y después. En FAQ el título queda a y=241,765625 antes y después y el hash sigue siendo #faq.

### QA-02: contraste del hero

Método idéntico al informe anterior: PNG a escala 1, color y opacidad efectiva computados, fondos cada 2 px dentro de cajas de líneas; texto transparente conservando sombras y capas, más captura sin grupo para componer su opacidad. Se usa el menor ratio del área textual. Fórmula: c=sRGB/255; lineal=c/12,92 si c≤0,04045, o ((c+0,055)/1,055)^2,4; L=0,2126R+0,7152G+0,0722B; ratio=(Lmayor+0,05)/(Lmenor+0,05). Umbrales pedidos: h1 3:1; demás 4,5:1. Espera de 1100 ms por posición; texto con opacidad efectiva <0,05 se clasifica oculto, sin atribuirle un ratio ficticio.

| Ancho | Progreso | Opacidad | Antetítulo ≥4,5 | H1 ≥3 | Subtítulo ≥4,5 | Registro ≥4,5 | Secundario ≥4,5 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1280px | 0 % | 1.00 | 17.184 | 17.367 | 17.171 | 4.574 | 18.236 |
| 1280px | 20 % | 1.00 | 17.465 | 17.184 | 17.185 | 4.574 | 18.339 |
| 1280px | 40 % | 1.00 | 16.707 | 16.756 | 17.330 | 4.574 | 18.363 |
| 1280px | 60 % | 1.00 | 16.227 | 16.812 | 17.400 | 4.574 | 18.374 |
| 1280px | 70 % | 1.00 | 16.242 | 16.580 | 17.669 | 4.574 | 18.236 |
| 1280px | 80 % | 0.00 | oculto | oculto | oculto | oculto | oculto |
| 1280px | 90 % | 0.00 | oculto | oculto | oculto | oculto | oculto |
| 1280px | 100 % | 0.00 | oculto | oculto | oculto | oculto | oculto |
| 320px | 0 % | 1.00 | 16.187 | 16.694 | 17.219 | 4.574 | 18.212 |
| 320px | 20 % | 1.00 | 16.032 | 16.354 | 16.890 | 4.574 | 17.704 |
| 320px | 40 % | 1.00 | 15.819 | 16.368 | 16.558 | 4.574 | 17.821 |
| 320px | 60 % | 1.00 | 15.512 | 16.328 | 16.667 | 4.574 | 17.939 |
| 320px | 70 % | 1.00 | 15.631 | 16.201 | 16.271 | 4.574 | 17.792 |
| 320px | 80 % | 0.00 | oculto | oculto | oculto | oculto | oculto |
| 320px | 90 % | 0.00 | oculto | oculto | oculto | oculto | oculto |
| 320px | 100 % | 0.00 | oculto | oculto | oculto | oculto | oculto |

Prueba de umbral: detenerse **1300 ms** en cada posición, en la secuencia que muestra la tabla. Ambos anchos dieron los mismos resultados. La histéresis mantiene el estado anterior en 76–78 %; no deja una opacidad intermedia estable.

| Dirección | Progreso % | scrollY real px | Opacidad 1280 | Opacidad 320 | aria-hidden (ambos) |
| --- | --- | --- | --- | --- | --- |
| Bajada | 70.0 | 1120 | 1 | 1 | ausente |
| Bajada | 75.9 | 1214 | 1 | 1 | ausente |
| Bajada | 76.0 | 1216 | 1 | 1 | ausente |
| Bajada | 77.0 | 1232 | 1 | 1 | ausente |
| Bajada | 77.9 | 1246 | 1 | 1 | ausente |
| Bajada | 78.0 | 1248 | 0 | 0 | true |
| Bajada | 78.1 | 1250 | 0 | 0 | true |
| Bajada | 80.0 | 1280 | 0 | 0 | true |
| Bajada | 90.0 | 1440 | 0 | 0 | true |
| Bajada | 100.0 | 1600 | 0 | 0 | true |
| Subida | 79.0 | 1264 | 0 | 0 | true |
| Subida | 78.0 | 1248 | 0 | 0 | true |
| Subida | 77.0 | 1232 | 0 | 0 | true |
| Subida | 76.0 | 1216 | 0 | 0 | true |
| Subida | 75.9 | 1214 | 1 | 1 | ausente |
| Subida | 75.0 | 1200 | 1 | 1 | ausente |

En 90 %, los CTA tienen tabindex=-1 y el grupo aria-hidden=true. Tab desde el último control de la cabecera salta directamente a Desliza, a ambos anchos. El árbol de accesibilidad de Chrome no expone los nodos de heading/StaticText del título ni los dos CTA del grupo. El nombre accesible de la región hero puede conservar su referencia al título; no se interpretó eso como exposición de los descendientes ocultos. Al enfocar el CTA mediante focus({preventScroll:true}), scrollY permanece en 1440, aria-hidden se elimina, tabindex se restaura y opacidad/velo vuelven a 1.

| Ancho, foco a 90 % | Antetítulo | H1 | Subtítulo | Registro | Secundario | Desliza enfocado |
| --- | --- | --- | --- | --- | --- | --- |
| 1280 | 16.417 | 16.409 | 17.206 | 4.574 | 18.351 | 8.710 |
| 320 | 16.004 | 16.058 | 16.519 | 4.574 | 17.792 | 8.560 |

### Desviaciones declaradas

1. **Transición por umbral:** se confirma `opacity 0.25s ease` al ocultar y 0,25 s con demora 0,1 s al mostrar; el velo usa 0,3 s. Los 32 puntos asentados solo dieron opacidad 0 o 1. Las opacidades intermedias son temporales durante la transición, no un estado estable vinculado al scroll. No se detectó problema nuevo en estas pruebas.
2. **Desliza visible al enfocar:** se confirma por Tab real, `:focus-visible=true`, opacidad 1 y velo 1 a 90 %. Ratios 8,710 y 8,560:1. La activación conserva el destino #por-que. No se detectó problema nuevo; el foco visible evita dejar un control de teclado invisible.

### QA-03: cifras y trazabilidad

Recorrido completo y espera superior a 1600 ms: **+330 · 30 % · 29,2 % · 40 %**. El texto visible de la tercera cifra y su duplicado sr-only son exactamente `29,2 %`. La etiqueta inicial es exactamente `personas ya registradas en Luma al 24 de octubre de 2026`.

`contenido/INVESTIGACION.md:147` contiene:

> * **Personas registradas al evento:** 330 asistentes confirmados segun el contador publico de la pagina de registro, consultado el 24 de octubre de 2026. *Fuente:* https://luma.com/5odhuh0l

Esto acredita la trazabilidad documental solicitada; no verifica un padrón privado.

### QA-04: HTML estático frente a configuración

HTML descargado con curl, sin ejecutar JavaScript; comparación por igualdad de cadenas Unicode contra WTM_CONTENIDO.meta capturado en navegador.

| Campo | Campo de configuración | Longitud | Igualdad exacta |
| --- | --- | --- | --- |
| title | titulo | 47 | true |
| description | descripcion | 142 | true |
| og:title | titulo | 47 | true |
| og:description | descripcion | 142 | true |
| twitter:title | titulo | 47 | true |
| twitter:description | descripcion | 142 | true |

Título exacto: `Break the Pattern · Women Techmakers Santa Cruz`.

Descripción exacta: `Break the Pattern: Women Techmakers Santa Cruz celebra el Día de la Mujer Boliviana en la Universidad Evangélica Boliviana. Registro gratuito.`.

| Host del navegador | Sin alteración: avisos | Título alterado: avisos |
| --- | --- | --- |
| 127.0.0.1 | 0 | 1 |
| localhost | 0 | 1 |
| wtm.test | 0 | 0 |

La alteración fue solo de la respuesta interceptada (`<title>QA mismatch</title>`), nunca del archivo. Para wtm.test se sirvieron los mismos bytes mediante route.fetch al servidor local; location.hostname realmente fue wtm.test. El aviso implementado detecta desincronización de título, no promete validar otros campos. `meta.url` sigue vacío; canonical y og:url públicos siguen pendientes de dominio, igual que en la limitación anterior.

### QA-05: calendario

| Reloj local fijado | Mensaje exacto |
| --- | --- |
| 2026-10-25 12:00:00 −04:00 | Gracias por acompañarnos. Pronto compartiremos el próximo encuentro de la comunidad. |
| 2026-10-24 12:00:00 −04:00 | Es hoy, sábado 24 de octubre. Revisa el horario exacto en tu confirmación de Luma. |
| 2026-10-20 12:00:00 −04:00 | Es hoy, sábado 24 de octubre. Revisa el horario exacto en tu confirmación de Luma. |

Se usa page.clock.setFixedTime y context timezoneId=America/La_Paz; no se altera el reloj del sistema. «Es hoy» el día 20 se mantiene porque es una condición explícita de esta tarea, aunque no sería una afirmación temporal literal correcta antes del evento. No se introduce como regresión.

### Scrubbing: 11 mediciones por ruta

Hero 2400 px, recorrido 1600 px, duración 10,041667 s. Objetivo=p×(duración−0,05). Espera de 1000 ms antes de leer video.currentTime. Servidor 8080 produce Blob; servidor 8094 respondió 206 y conserva URL HTTP.

| Dirección | scrollY | Progreso % | Objetivo s | Blob s | HTTP 206 s | Error máx. s |
| --- | --- | --- | --- | --- | --- | --- |
| Bajada | 0 | 0 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| Bajada | 320 | 20 | 1.998333 | 1.990140 | 1.990140 | 0.008193 |
| Bajada | 640 | 40 | 3.996667 | 3.988470 | 3.988470 | 0.008197 |
| Bajada | 960 | 60 | 5.995000 | 5.986804 | 5.986803 | 0.008197 |
| Bajada | 1280 | 80 | 7.993334 | 7.985137 | 7.985137 | 0.008197 |
| Bajada | 1600 | 100 | 9.991667 | 9.983470 | 9.983471 | 0.008197 |
| Subida | 1280 | 80 | 7.993334 | 8.001522 | 8.001522 | 0.008188 |
| Subida | 960 | 60 | 5.995000 | 6.003196 | 6.003196 | 0.008196 |
| Subida | 640 | 40 | 3.996667 | 4.004863 | 4.004863 | 0.008196 |
| Subida | 320 | 20 | 1.998333 | 2.006529 | 2.006529 | 0.008196 |
| Subida | 0 | 0 | 0.000000 | 0.008196 | 0.008195 | 0.008196 |

### Fallbacks y rendimiento

| Inyección | Estado / motivo | Hero px | MP4 solicitados | Póster cargado | CTA |
| --- | --- | --- | --- | --- | --- |
| 404 | poster/error | 800 | 1 | True | https://luma.com/5odhuh0l |
| timeout | poster/tiempo | 800 | 1 | True | https://luma.com/5odhuh0l |
| reduce | poster/reduce | 800 | 0 | True | https://luma.com/5odhuh0l |

404 y timeout se inyectaron deliberadamente; no se mezclan con el registro normal de red. Timeout observado tras 7300 ms de espera acumulada, modo poster/tiempo. Reduce se prueba desde el inicio. Scroll rápido 0→1500→0→1600→20→1200, 20 ms entre saltos, asentado 1500 ms: currentTime 7.485524 s frente a 7,493750 s objetivo. Fuera del hero: 0 rAF pendientes, frames 1623→1623 en 2000 ms; tras cinco ciclos siguen 0 rAF y 18 listeners instrumentados.

### Responsive y objetivos táctiles

| Viewport | clientWidth | scrollWidth | Exceso |
| --- | --- | --- | --- |
| 320 | 320 | 320 | 0 |
| 360 | 360 | 360 | 0 |
| 375 | 375 | 375 | 0 |
| 414 | 414 | 414 | 0 |
| 768 | 768 | 768 | 0 |
| 1024 | 1024 | 1024 | 0 |
| 1280 | 1280 | 1280 | 0 |
| 1440 | 1440 | 1440 | 0 |
| 1920 | 1920 | 1920 | 0 |

| Objetivo del cuerpo a 320 px | Ancho px | Alto px |
| --- | --- | --- |
| WTM         Santa Cruz | 158.53 | 44.00 |
| Abrir menú | 48.00 | 48.00 |
| Regístrate en Luma | 201.59 | 49.59 |
| Conoce la historia | 190.72 | 49.59 |
| Desliza | 92.73 | 79.80 |
| Ver en el mapa | 116.89 | 44.00 |
| Quiero asistir | 238.00 | 49.59 |
| ¿El evento tiene costo? | 288.00 | 71.19 |
| ¿A quién está dirigida esta jornada? | 288.00 | 83.56 |
| ¿Necesito saber programar? | 288.00 | 71.19 |
| ¿Mi registro queda confirmado al instante? | 288.00 | 83.56 |
| ¿Qué debo llevar? | 288.00 | 71.19 |
| ¿Cómo llego a la sede? | 288.00 | 71.19 |
| Registrarme en Luma | 263.52 | 61.69 |
| WTM           Santa Cruz | 173.17 | 45.80 |
| Instagram | 134.02 | 48.00 |
| Facebook | 130.95 | 48.00 |
| Enlaces WTM | 158.22 | 48.00 |
| Comunidad GDG | 180.45 | 48.00 |
| Volver arriba | 101.00 | 44.00 |

| Menú abierto a 320 px | Ancho px | Alto px |
| --- | --- | --- |
| Por qué | 288.00 | 56.00 |
| WTM | 288.00 | 56.00 |
| Evento | 288.00 | 56.00 |
| Agenda | 288.00 | 56.00 |
| Cifras | 288.00 | 56.00 |
| Preguntas | 288.00 | 56.00 |
| Regístrate | 116.64 | 44.00 |

A 320×568, los CTA terminan a y=477,335 y y=538,929, dentro del viewport. El skip link enfocado a 320×800 mide 191,953×52,047 px, con opacidad 1.

### Inventario completo de href y HTTP

Anclas: no generan una petición HTTP nueva; se comprueba existencia y activación sobre documento HTTP 200. Data URI: sin HTTP. Los GET externos son comprobaciones separadas con curl -L, no dependencias de carga de la landing.

| # | Elemento | Destino | Resultado |
| --- | --- | --- | --- |
| 1 | icon | data:image/svg+xml (inline; URI íntegra en results.json → dom.links) | sin HTTP |
| 2 | stylesheet | assets/css/styles.css | 200 |
| 3 | Saltar al contenido | #contenido | ancla válida; documento 200 |
| 4 | WTM SANTA CRUZ | #hero | ancla válida; documento 200 |
| 5 | Por qué | #por-que | ancla válida; documento 200 |
| 6 | WTM | #wtm | ancla válida; documento 200 |
| 7 | Evento | #evento | ancla válida; documento 200 |
| 8 | Agenda | #agenda | ancla válida; documento 200 |
| 9 | Cifras | #cifras | ancla válida; documento 200 |
| 10 | Preguntas | #faq | ancla válida; documento 200 |
| 11 | Regístrate | https://luma.com/5odhuh0l | 200 |
| 12 | Regístrate en Luma | https://luma.com/5odhuh0l | 200 |
| 13 | Conoce la historia | #por-que | ancla válida; documento 200 |
| 14 | DESLIZA | #por-que | ancla válida; documento 200 |
| 15 | Ver en el mapa | https://www.google.com/maps/search/?api=1&query=Universidad+Evang%C3%A9lica+Boliviana+Santa+Cruz+de+la+Sierra | 200 |
| 16 | Quiero asistir | https://luma.com/5odhuh0l | 200 |
| 17 | Registrarme en Luma | https://luma.com/5odhuh0l | 200 |
| 18 | WTM SANTA CRUZ | #hero | ancla válida; documento 200 |
| 19 | Instagram | https://www.instagram.com/gdg.santacruz/ | 200 |
| 20 | Facebook | https://www.facebook.com/wtmsantacruz | 200 |
| 21 | Enlaces WTM | https://linktr.ee/wtmsc | 200 |
| 22 | Comunidad GDG | https://gdg.community.dev/gdg-santa-cruz/ | 200 |
| 23 | Volver arriba | #hero | ancla válida; documento 200 |

| Destino solicitado | HTTP final | URL final | Redirecciones |
| --- | --- | --- | --- |
| https://luma.com/5odhuh0l | 200 | https://luma.com/5odhuh0l | 0 |
| https://www.google.com/maps/search/?api=1&query=Universidad+Evang%C3%A9lica+Boliviana+Santa+Cruz+de+la+Sierra | 200 | https://www.google.com/maps/search/?api=1&query=Universidad+Evang%C3%A9lica+Boliviana+Santa+Cruz+de+la+Sierra | 0 |
| https://www.instagram.com/gdg.santacruz/ | 200 | https://www.instagram.com/gdg.santacruz/ | 0 |
| https://www.facebook.com/wtmsantacruz | 200 | https://www.facebook.com/WTMSantaCruz/ | 1 |
| https://linktr.ee/wtmsc | 200 | https://linktr.ee/wtmsc | 0 |
| https://gdg.community.dev/gdg-santa-cruz/ | 200 | https://gdg.community.dev/gdg-santa-cruz/ | 0 |

Las cuatro activaciones por Enter abrieron una pestaña con URL exacta `https://luma.com/5odhuh0l` (destino interceptado con respuesta de QA; HTTP real verificado por separado). Evidencia: `links-retry.json → registration`.

Las seis anclas del menú terminan entre y=67,578 y 68,250 px bajo la cabecera de 68 px. La comprobación independiente de «Volver arriba», desde y=9288, termina en y=0 tanto por clic como por Enter (dos repeticiones); muestras a 100, 600, 1600 y 3600 ms acumulados en `anchor-check.json`. El ensayo que enfocaba desde arriba y pulsaba Enter inmediatamente solapó el desplazamiento de foco con el del ancla; por eso se contrastó con foco asentado y clic, sin declarar ese resultado aislado una regresión.

URI íntegra del favicon:

```text
data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230A0B14'/%3E%3Cpath d='M12 20l7 24 6-17 6 17 7-24' fill='none' stroke='%23E8467C' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Crect x='42' y='18' width='10' height='3' fill='%234285F4'/%3E%3Crect x='42' y='27' width='10' height='3' fill='%23EA4335'/%3E%3Crect x='42' y='36' width='10' height='3' fill='%23FBBC05'/%3E%3Crect x='42' y='45' width='10' height='3' fill='%2334A853'/%3E%3C/svg%3E
```

Un 200 solo prueba la respuesta HTTP; no garantiza contenido privado ni registro aprobado. Facebook redirige a /WTMSantaCruz/.

### Teclado, estructura y consola

| FAQ | Enter: expanded | Panel visible | Espacio: expanded |
| --- | --- | --- | --- |
| 1 | true | True | false |
| 2 | true | True | false |
| 3 | true | True | false |
| 4 | true | True | false |
| 5 | true | True | false |
| 6 | true | True | false |

| Tecla desde FAQ 1 / secuencia | Foco resultante |
| --- | --- |
| ArrowDown | faq-boton-2 |
| End | faq-boton-6 |
| Home | faq-boton-1 |
| ArrowUp | faq-boton-6 |

Menú abierto con Enter: Por qué → WTM → Evento → Agenda → Cifras → Preguntas → Regístrate → Cerrar menú → Por qué → WTM. Escape: aria-expanded=false, foco en menu-boton e inert=false en main.

Encabezados en orden: h1 → h2 → h2 → h3 → h3 → h3 → h2 → h2 → h3 → h3 → h3 → h3 → h3 → h2 → h2 → h3 → h3 → h3 → h3 → h3 → h3 → h2 → h2. Un h1: «Break the Pattern». Landmarks: header, nav Secciones, main#contenido y footer.pie. Las cinco imágenes cargan y tienen alt; las decorativas conservan alt vacío.

Registro normal: 39 solicitudes, 39 respuestas, 0 requestfailed, 0 pageerror/console.error, 0 warning, 0 HTTP 404 y 0 dominios externos HTTP. Se recorrió toda la página para activar imágenes lazy y contadores, y se incluyeron recargas normales. Los avisos del ensayo de título alterado y el error de red del 404 inyectado se contabilizan únicamente en sus escenarios.

## Lo que no se pudo verificar

- **NO VERIFICADO:** Safari/iOS, Firefox, dispositivos físicos y lectores de pantalla VoiceOver/NVDA. Se probó teclado y árbol AX de Chrome, no anuncios sonoros reales.
- **NO VERIFICADO:** contraste de cada fotograma, todos los hover, todas las anchuras o animaciones intermedias; se midieron los 16 estados pedidos, 32 puntos de umbral y estados enfocados, además de las secciones del cuerpo.
- **NO VERIFICADO:** padrón privado de Luma, aprobación de inscripción y horario privado. No se enviaron datos.
- **NO VERIFICADO:** tarjeta social publicada, cachés sociales y dominio canónico público; meta.url sigue vacío. No se publicó el sitio.
- **NO VERIFICADO:** permanencia de una pestaña atravesando medianoche, todas las zonas horarias, BFCache exhaustivo, restricciones de sessionStorage y ausencia absoluta de fugas prolongadas. Se verificaron cargas con las tres fechas pedidas.

## Evidencias y reproducción

Directorio de esta ejecución: `/private/tmp/claude-501/qa-2/`. No se reutilizaron resultados previos: se reutilizaron y ejecutaron nuevamente los scripts de la auditoría independiente para conservar el método.

- `audit.cjs` / `results.json`: video, HTTP 206, fallbacks, responsive, touch, teclado, estructura, consola y red.
- `extra.cjs` / `extra.json`: recargas, carga lenta, umbral, foco, AX, fechas, host y configuración.
- `contrast.cjs`, `contrast_calc.py`, `contrast-records.json`, `contrast-results.json` y PNG: fondo, cajas, opacidad y ratios.
- `focus.cjs`, `focus_calc.py`, `focus/`: contraste de foco del grupo y Desliza.
- `urls.py` / `urls.json`: códigos HTTP reales.
- `/private/tmp/claude-501/qa-2-served.html` y `meta-comparison.json`: HTML curl e igualdad de metadatos.
- `anchor-check.cjs` / `anchor-check.json`: retorno al inicio por clic y Enter con foco asentado.
- `links-retry.cjs` / `links-retry.json`: anclas, cuatro aperturas de registro, skip y viewport 320×568.
- `deep-results.json`: 12 activaciones de anclas. Su ejecución se detuvo por timeout de Playwright esperando finalizar navegación de un popup; esa espera no se presenta como defecto de la página ni como prueba de éxito del popup.

Huellas de la implementación observada:

```text
c935fb5e2b2567ebc598619e9a621b472c9116f3642cf4e287a43ad3837afac3  index.html
ce79616eac1b0ad4bdcc042775676102f6bb4e9bec8f0f4a2d638c8fe379d99d  assets/css/styles.css
d85db9c5b4f9750d0d09dff7721c216b9cfa798b2125c62a24ab8801e8cdf03b  assets/js/main.js
066ccca68853d0664b4e340536be899265f758acd3143047e5a6cf60349381d1  assets/js/scroll-video.js
1402c9fcf0f5334c6f6607147cb40d10ddc89b093b7aca64a92b470cc0ddc10c  assets/js/contenido.js
ab78cd8cce8ce9735e0b8839609c43e1c1418e42071de09817ff50264ed27f19  README-DEV.md
619fe591212ed409847cd7ba22f9bc92c07b4f1bcc687ef831f6a1c890896b10  contenido/INVESTIGACION.md
```
