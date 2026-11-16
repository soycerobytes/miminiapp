# Documentación de MiMiniApp

Este mapa dirige a las fuentes del proyecto. La autoridad y los estados se definen en [AGENTS.md](../AGENTS.md); un documento de orientación no sustituye a su fuente canónica. Organización aplicada en [MT-02](exec-plans/active/MT-02-organizacion-documental.md), por indicación del propietario del 2026-11-15.

## Por dónde empezar

| Necesitas… | Consulta |
| --- | --- |
| Entender el producto y su alcance | [Definición aprobada](product-specs/index.md) |
| Saber qué existe en código e infraestructura | [Arquitectura actual](../ARCHITECTURE.md) |
| Consultar una decisión técnica y su estado | [Registro técnico](design-docs/index.md) |
| Preparar entorno, ramas y PR | [Contribuir](../CONTRIBUTING.md) |
| Añadir una miniapp | [Guía de miniapps](guides/miniapps.md) y [ficha funcional](product-specs/miniapp-template.md) |
| Operar staging | [Guía de staging](guides/staging.md) |
| Consultar trabajo y pendientes | [Roadmap](roadmap.md), [planes activos](exec-plans/active/) y [deuda](exec-plans/tech-debt-tracker.md) |
| Revisar la propuesta de Plan B | [Ficha v06](product-specs/plan-b.md) y [paquete de revisión](design-docs/plan-b-approval.md), todavía en borrador |

## Dónde vive cada tipo de documento

| Ruta | Contenido y criterio |
| --- | --- |
| `product-specs/` | Propósito, requisitos y aceptación funcional de plataforma y miniapps. El estado de cada ficha es explícito. |
| `design-docs/` | Decisiones y diseños técnicos, con su estado en el índice; sus activos de referencia siguen en `assets/`. |
| `exec-plans/` | Planes con estado y progreso propios, plantillas y deuda. `active/` conserva los no terminales; `completed/` los aceptados o cancelados. |
| `guides/` | Procedimientos vigentes: añadir miniapps y operar staging. |
| `standards/` | Criterios de [frontend](standards/FRONTEND.md), [seguridad](standards/SECURITY.md), [calidad/evidencia](standards/QUALITY_SCORE.md) y [fiabilidad](standards/RELIABILITY.md). |
| `reports/<iteración>/` | Informes y antecedentes de una iteración, incluso si su plan sigue abierto. Las rutas literales históricas describen su época; los enlaces navegables apuntan a las ubicaciones actuales. |
| `review/` | Evidencia visual organizada por revisión, con el criterio de conservación de la política de calidad. |
| `references/` | Material original aportado; se conserva sin reescribirlo como si fuera una decisión actual. |

La raíz de `docs/` contiene este mapa, [BOOTSTRAP.md](BOOTSTRAP.md), [PLANS.md](PLANS.md), [harness-decisions.md](harness-decisions.md) y [roadmap.md](roadmap.md). Los documentos de entrada y configuración de la raíz del repositorio mantienen su ubicación. Los directorios generados por herramientas (`dist/`, `node_modules/`, `.astro/`, `.local/`, `playwright-report/`, `test-results/`) no forman parte de esta clasificación documental.

## Informes por iteración

| Iteración | Material |
| --- | --- |
| I-00 | [Auditoría inicial](reports/i00/onboarding-audit.md) |
| I-01 | [Ejecución](reports/i01/execution.md) y [traspaso histórico](reports/i01/handoff.md) |
| I-02 | [Ejecución](reports/i02/execution.md) |
| I-03 | [Fase A](reports/i03/phase-a.md), [preparación de staging](reports/i03/staging-preparation.md), [corrección del PR](reports/i03/merged-pr-correction.md), [primera publicación](reports/i03/staging-startup.md) y [parche histórico ya aplicado](reports/i03/staging-publication-activation.patch) |
| CP-01 | [Ejecución de identidad y movimiento](reports/cp01/execution.md) |
| CP-02 | [Implementación de apariencia](reports/cp02/execution.md) |

## Mantener el orden

Cada documento nuevo se coloca según su función. Una guía describe cómo trabajar; un informe registra lo ocurrido. Una ficha, decisión y plan pueden enlazarse sin copiar su contenido o crear estados de aprobación paralelos. Añadir una carpeta o un índice solo cuando ayude a localizar material real.

Al mover un archivo, actualizar enlaces entrantes y salientes y cualquier consumidor en código, pruebas o configuración. Conservar estados, cronología y datos de evidencia; registrar el cambio de rutas en el plan correspondiente. Esta convención no añade herramientas, automatizaciones ni aprobaciones distintas de las existentes.
