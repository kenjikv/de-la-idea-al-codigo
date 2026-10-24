# PLAN: [nombre de la funcionalidad]

**SPEC de referencia:** [ruta a SPEC.md]
**Versión de la spec revisada:** [fecha o versión que permita identificarla]
**Estado:** Borrador <!-- Borrador | En revisión | Aprobado -->

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
| [PENDIENTE] | [PENDIENTE] | [PENDIENTE] |

**Convenciones y patrón de referencia:** [PENDIENTE]

## Solución propuesta

<!-- Enfoque y motivos. Responsabilidades y recorrido de datos y eventos hasta la
interfaz. Usa un diagrama si aclara. -->

[PENDIENTE]

## Archivos y componentes afectados

<!-- Distingue lo que se reutiliza, modifica o crea. Las rutas nuevas son propuestas.
Señala el impacto sobre contratos o componentes compartidos. -->

| Archivo o componente | Acción | Cambio y responsabilidad | Requisito relacionado |
| --- | --- | --- | --- |
| [PENDIENTE] | [Reutilizar / modificar / crear] | [PENDIENTE] | [RF-XX] |

## Datos y contratos

<!-- Completa solo lo aplicable. Si un punto no aplica, di por qué. -->

- **Contratos de contenido y configuración:** [PENDIENTE]
- **Origen de los datos mostrados y transformaciones:** [PENDIENTE]
- **Almacenamiento en el navegador:** [PENDIENTE]
- **Servicios externos y enlaces de salida:** [PENDIENTE]
- **Compatibilidad con contenido existente:** [PENDIENTE]

## Estado, eventos y errores

<!-- Cómo se implementan los comportamientos aprobados. Cita RF/CA y aplica los puntos
de WEB_GUIDELINES.md que correspondan. -->

- **Estado de la interfaz y navegación:** [PENDIENTE]
- **Recarga, historial y posición de lectura:** [PENDIENTE]
- **Eventos, temporizadores y cancelación:** [PENDIENTE]
- **Errores, alternativas y tiempos de espera:** [PENDIENTE]
- **Otros puntos web aplicables y su solución:** [PENDIENTE]

## Dependencias, configuración y agentes

<!-- Librerías, servicios, hosting o configuración afectados. Justifica cada incorporación.
Indica si hacen falta subagentes y la responsabilidad acotada de cada uno. -->

- [PENDIENTE]

## Estrategia de validación

<!-- Una fila por criterio de la spec. Elige el método capaz de demostrarlo: prueba
automática en navegador, comprobación por línea de comandos o prueba manual. Incluye
regresiones. Una captura no demuestra recarga, red ni accesibilidad. -->

| Criterio | Método y prueba existente o propuesta | Entorno y datos necesarios | Evidencia prevista |
| --- | --- | --- | --- |
| CA-01 | [PENDIENTE] | [PENDIENTE] | [PENDIENTE] |
| CA-02 | [PENDIENTE] | [PENDIENTE] | [PENDIENTE] |

**Comprobaciones de regresión:** [PENDIENTE]

**Comandos verificados para servir y probar:** [PENDIENTE]

**Pruebas en navegadores y dispositivos reales:** [escenarios y cuándo hace falta hardware real]

**Limitaciones del entorno:** [qué no podrá comprobarse aquí y cómo quedará pendiente]

<!-- Esta sección planifica la validación. Durante la implementación, registra en
TASKS.md los resultados y evidencias reales, distinguiendo pruebas ejecutadas, fallidas,
no ejecutadas y bloqueadas. -->

## Orden de implementación

<!-- Etapas y dependencias principales con puntos de comprobación. El desglose ejecutable
va en TASKS.md. -->

1. [Etapa, dependencia y comprobación]
2. [Etapa, dependencia y comprobación]
3. [Etapa, dependencia y comprobación]

## Riesgos y decisiones pendientes

<!-- Riesgos concretos de esta solución y cómo se tratan. Escribe Ninguna en las
decisiones pendientes cuando estén resueltas. -->

- **Riesgos y medidas acordadas:** [PENDIENTE]
- **Decisiones pendientes:** [PENDIENTE]

<!-- ANTES DE PEDIR LA APROBACIÓN
Comprueba que el plan cubre los requisitos, respeta las exclusiones, reutiliza lo
verificado y permite demostrar todos los criterios. Tras la aprobación, deriva TASKS.md
con identificadores, dependencias, referencias a RF/CA y comprobaciones.
-->
