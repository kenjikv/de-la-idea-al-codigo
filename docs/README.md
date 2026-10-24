# Documentación guiada por especificaciones

Esta carpeta aplica el formato de [Curso-SDD-Mobile](https://github.com/ArisGuimera/Curso-SDD-Mobile)
(AristiDevs) a una web: la landing **Break the Pattern** de Women Techmakers Santa Cruz.
La guía móvil del curso se reemplaza por una guía web; el resto del flujo se mantiene.

| Etapa | Documento | Qué resuelve |
| :--: | --- | --- |
| 1 | `SPEC.md` | Qué construimos, qué queda fuera, reglas, casos alternativos y criterios de aceptación verificables. Sin código. |
| 2 | `PLAN.md` | Cómo se construye: archivos, contratos, estado, dependencias, agentes y estrategia de validación. Sin implementar. |
| 3 | `TASKS.md` | Tareas pequeñas y ordenadas, con dependencias y comprobaciones, ligadas a los criterios que resuelven. |
| 4 | Implementación | Solo lo que está en el alcance, demostrando cada criterio con evidencia real. |

Ninguna etapa avanza sola: cada documento pasa a Aprobada/Aprobado solo cuando la
persona lo dice.

## Archivos

| Documento | Para qué sirve |
| --- | --- |
| [`../AGENTS.md`](../AGENTS.md) | Instrucciones del proyecto para el agente: arquitectura, convenciones, comandos y flujo. `../CLAUDE.md` lo importa. |
| [`GENERIC_RULES.md`](GENERIC_RULES.md) | Reglas de trabajo del agente: entender antes de cambiar, no inventar, validar de verdad. |
| [`WEB_GUIDELINES.md`](WEB_GUIDELINES.md) | El checklist que vuelve web una spec genérica: navegadores, red lenta, recarga, accesibilidad, movimiento reducido, metadatos… |
| [`SPEC_TEMPLATE.md`](SPEC_TEMPLATE.md) | Plantilla de especificación. |
| [`PLAN_TEMPLATE.md`](PLAN_TEMPLATE.md) | Plantilla de plan técnico. |
| [`PROMPTS.md`](PROMPTS.md) | El prompt inicial, listo para copiar. |

No hay plantilla de `TASKS.md`: se deriva del plan aprobado.

```
docs/
├── SPEC_TEMPLATE.md
├── PLAN_TEMPLATE.md
├── WEB_GUIDELINES.md
├── GENERIC_RULES.md
├── PROMPTS.md
└── features/
    ├── landing-wtm/            # contenido, secciones, registro, navegación, metadatos
    │   ├── SPEC.md
    │   ├── PLAN.md
    │   └── TASKS.md
    ├── video-scroll-portada/   # video de la portada ligado al scroll
    │   ├── SPEC.md
    │   ├── PLAN.md
    │   └── TASKS.md
    └── resumen-post-evento/    # ejemplo nuevo: la página después del evento
        ├── SPEC.md             # En revisión, con decisiones pendientes
        ├── PLAN.md             # Borrador
        └── TASKS.md            # sin empezar
```

## Cómo se usó en este proyecto

1. El prompt de `PROMPTS.md` pidió la landing. Claude Code coordinó el trabajo con Orca.
2. Las specs fijaron requisitos (`RF-`) y criterios (`CA-`) medibles. «Textos legibles»
   pasó a ser contraste AA; «que avance con el scroll», un error máximo de 1/60 s.
3. Los planes repartieron el trabajo: Antigravity (Gemini 3.8 Flash) investigó, la skill
   de Higgsfield generó imágenes y video, Claude Code programó y Codex auditó.
4. La primera auditoría dijo **NO APTO** (2 hallazgos altos y 3 medios). Cada hallazgo
   apuntaba a un criterio, así que se supo qué corregir. La reauditoría dijo **APTO**.
5. El resultado y su evidencia están en cada `TASKS.md`.

## Ejemplo desde cero: resumen después del evento

`landing-wtm` y `video-scroll-portada` documentan algo ya construido. `resumen-post-evento`
muestra cómo empieza una funcionalidad nueva: la organización pide que, después del
evento, la página deje de pedir el registro y muestre cómo fue.

- La [SPEC](features/resumen-post-evento/SPEC.md) está En revisión: tiene cinco decisiones
  pendientes (fotos y consentimiento, cifras, materiales, destino de los botones y vista
  previa en redes) que le tocan a la persona y a la organización.
- El [PLAN](features/resumen-post-evento/PLAN.md) está en Borrador y cita el código real:
  por ejemplo, que hoy el cambio de día usa la hora de quien visita y no la de Bolivia.
- Las [TASKS](features/resumen-post-evento/TASKS.md) están sin empezar, con sus criterios
  «Sin ejecutar». Nada se implementa hasta aprobar y autorizar.
