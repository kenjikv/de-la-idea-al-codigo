# De la idea al código · Break the Pattern

Proyecto de ejemplo de la charla **«De la idea al código: nuevas oportunidades con
inteligencia artificial»** para Women Techmakers Santa Cruz.

Es la landing de **Break the Pattern**, el encuentro de Women Techmakers Santa Cruz por el
Día de la Mujer Boliviana: se construyó con agentes de IA a partir de un prompt y se
documentó con **desarrollo guiado por especificaciones (SDD)**.

- **Sitio publicado:** https://wtm-santcruz.netlify.app/
- **Formato SDD:** el de [Curso-SDD-Mobile](https://github.com/ArisGuimera/Curso-SDD-Mobile)
  (AristiDevs), adaptado de móvil a web.

## Qué hay en el repositorio

| Ruta | Qué es |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | Reglas del proyecto para cualquier agente de IA. [`CLAUDE.md`](CLAUDE.md) lo importa. |
| [`docs/`](docs/README.md) | Guía web, reglas genéricas, plantillas de SPEC y PLAN, y prompts listos para copiar en cada etapa. |
| [`docs/features/landing-wtm/`](docs/features/landing-wtm/SPEC.md) | SPEC, PLAN y TASKS de la página: contenido, registro, navegación, accesibilidad y metadatos. |
| [`docs/features/video-scroll-portada/`](docs/features/video-scroll-portada/SPEC.md) | SPEC, PLAN y TASKS del video de la portada que avanza y retrocede con el scroll. |
| [`docs/features/resumen-post-evento/`](docs/features/resumen-post-evento/SPEC.md) | Ejemplo desde cero: SPEC en revisión, PLAN en borrador y TASKS sin empezar de la página después del evento. |
| `index.html`, `assets/` | La web: HTML, CSS y JavaScript sin frameworks ni dependencias. |
| `contenido/` | Investigación con fuentes y copy por sección, las entradas del contenido. |
| `qa/` | Informes de QA independientes y el script que repite las pruebas de las correcciones. |
| [`README-DEV.md`](README-DEV.md) | Guía técnica: qué archivo tocar, contrato de contenido y cómo funciona el video. |

## Cómo se construyó

1. Un prompt pidió la landing. Claude Code coordinó a varios agentes con
   [Orca](https://github.com/stablyai/orca).
2. Antigravity (Gemini 3.8 Flash) investigó y escribió el copy; la skill de Higgsfield
   generó las imágenes (GPT Image 2.5) y el video (Seedance 2.5); Claude Code (Opus 5.5)
   programó; Codex hizo el QA.
3. Las especificaciones convirtieron pedidos vagos en criterios medibles: «textos
   legibles» pasó a ser contraste WCAG AA y «que avance con el scroll», un error máximo de
   1/60 s.
4. La primera auditoría dijo **NO APTO** (2 hallazgos altos y 3 medios). Cada hallazgo
   apuntaba a un criterio, así que se supo qué corregir. La reauditoría dijo **APTO**.
5. La evidencia de cada criterio está en los `TASKS.md`.

## Probar en local

```bash
python3 -m http.server 8080
# abrir http://127.0.0.1:8080/
```

Para repetir las pruebas de las correcciones (requiere Playwright y Google Chrome):

```bash
npm i -D playwright
node qa/verificar-correcciones.cjs . qa/verificacion.json
```

## Créditos

- Formato SDD: [Curso-SDD-Mobile](https://github.com/ArisGuimera/Curso-SDD-Mobile), de
  AristiDevs.
- Imágenes y video generados con IA para este proyecto.
- Women Techmakers es un programa de Google. Este repositorio es material de la charla.
