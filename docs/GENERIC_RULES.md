# Reglas genéricas para agentes de programación

Reglas reutilizables para planificar, revisar, implementar y validar cambios de software.
Se aplican junto con `AGENTS.md`. Las convenciones del proyecto las afinan; las
instrucciones explícitas de la persona mandan.

## Entender antes de cambiar

- Lee el código, las instrucciones y los documentos de la funcionalidad antes de proponer
  o hacer un cambio. Sigue llamadas y dependencias cuando haga falta.
- Distingue hechos verificados, decisiones propuestas y preguntas abiertas.
- No inventes requisitos, archivos, APIs, versiones, resultados ni capacidades que no
  hayas comprobado.
- Resuelve los detalles técnicos rutinarios con el código y la documentación existentes.
  Pregunta, con preguntas concretas, cuando lo que falta cambia el comportamiento, los
  criterios de aceptación, el alcance o una decisión difícil de revertir.
- Si falta un documento de referencia, dilo. No inventes su contenido ni digas que lo
  leíste.

## Mantener claro el alcance

- Implementa lo pedido y los cambios necesarios para sostenerlo.
- Respeta el alcance y los criterios acordados. No agregues funciones especulativas,
  refactorizaciones ajenas ni actualizaciones de dependencias.
- Si aparece un requisito nuevo o una contradicción, aclara esa parte y actualiza los
  documentos antes de implementarla.
- Continúa el trabajo autorizado sin pedir permiso de nuevo. Respeta la etapa que pidió
  la persona: solo revisar, solo planificar o implementar.

## Escribir código mantenible

- Sigue la arquitectura, los nombres, el formato y los patrones del repositorio, después
  de comprobar que aplican al problema.
- Prefiere la solución más simple que cumpla los requisitos. Evita abstracciones
  especulativas, configuración innecesaria y optimización prematura.
- Mantén responsabilidades claras y funciones enfocadas. Reutiliza lo que ya existe
  cuando su comportamiento encaje.
- No ocultes errores con `catch` vacíos, resultados de éxito inventados o alternativas que
  contradigan lo especificado.
- Comenta la intención, las restricciones y las decisiones no obvias, no lo que el código
  ya dice.
- Elimina el código muerto que introduzca tu cambio. Conserva el trabajo ajeno.

## Usar herramientas y dependencias con criterio

- Prefiere los scripts y la configuración del repositorio.
- Revisa las versiones instaladas antes de usar APIs que dependan de la versión. Consulta
  la documentación oficial cuando la compatibilidad no sea segura.
- Agrega dependencias solo cuando la solución las necesite, explicando para qué y con qué
  costo. No dupliques librerías para lo mismo.
- No modifiques pruebas, comprobaciones o configuración para esconder un fallo. Corrige la
  causa o informa el fallo con evidencia.

## Cuidar los datos y el trabajo

- Revisa los cambios existentes antes de editar. No sobrescribas, reviertas ni borres
  trabajo ajeno.
- No pongas secretos, credenciales, tokens ni datos personales innecesarios en el código,
  los registros, la documentación o los informes.
- No hagas operaciones destructivas, no publiques ni cambies sistemas externos sin que la
  tarea o la persona lo autorice.

## Validar el comportamiento

- Elige la validación según el cambio real y sus criterios de aceptación.
- Agrega o actualiza pruebas útiles para el comportamiento que cambia. Prefiere comprobar
  lo observable antes que repetir la implementación.
- Los cambios solo de documentación no necesitan pruebas artificiales.
- Ejecuta las comprobaciones pertinentes y distingue las que pasaron, fallaron, se
  omitieron o quedaron bloqueadas.
- El nombre de una prueba o un comando sin ejecutar no son evidencia. Registra la
  ejecución y el resultado. Usa capturas para lo visual y pasos reproducibles para lo que
  requiere interacción.
- Una captura no demuestra persistencia, red, recarga, accesibilidad ni otro
  comportamiento que no puede mostrar.
- No digas que una comprobación pasó si no la hiciste y viste su resultado.
- Si la validación queda bloqueada, di la causa, qué quedó sin verificar y qué
  comprobación concreta falta.

## Mantener los documentos coherentes

- Mantén coherentes los requisitos, las decisiones técnicas, el estado de las tareas y el
  comportamiento implementado.
- No reescribas en silencio requisitos o criterios para que encajen con una
  implementación defectuosa. Consulta el cambio de comportamiento con la persona.
- Marca un trabajo como terminado solo cuando cumple su implementación y su validación.
  Registra el avance parcial y lo que falta comprobar.

## Comunicar con claridad

- Usa el idioma de la persona en la conversación y en los informes.
- Explica en pocas palabras las decisiones importantes, los bloqueos y los desvíos.
- En el informe final, di qué cambió, qué se verificó y qué queda incompleto o incierto.
