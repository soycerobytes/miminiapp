# Roadmap de MiMiniApp

**Actualizado:** 2026-11-13. **Responsable:** propietario de MiMiniApp.

Este documento orienta. No aprueba ni autoriza nada: el estado canónico de cada iteración es el de su ExecPlan, conforme a [PLANS.md](PLANS.md). No fija fechas de lanzamiento ni compromete un ritmo semanal a costa de la calidad.

## Iteraciones

Las iteraciones `I-xx` proceden del [dossier de origen](references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md). Las `CP-xx` (Creative Playground) son trabajo de identidad y apariencia añadido después. `MT-xx` es mantenimiento transversal.

| Iteración | Resultado | Estado |
| --- | --- | --- |
| [I-00](exec-plans/completed/I-00-traslado-documental.md) | Traslado documental y fuentes canónicas | Aceptado, 2026-11-04 |
| [I-01](exec-plans/completed/I-01-base-local-y-testing.md) | Base local Astro y batería de pruebas | Aceptado, 2026-11-05 |
| [I-02](exec-plans/completed/I-02-catalogo-responsive-e-i18n.md) | Catálogo modular, diseño responsive e i18n ES/EN | Aceptado, 2026-11-05 |
| [I-03](exec-plans/active/I-03-github-actions-y-cloudflare.md) | GitHub Actions y Cloudflare: staging, producción y promoción por PR | En curso. Staging verificado el 2026-11-07 |
| [CP-01](exec-plans/completed/CP-01-creative-playground.md) | Identidad integrada y movimiento decorativo | Aceptado, 2026-11-08 |
| [CP-02](exec-plans/active/CP-02-apariencia.md) | Apariencia clara, oscura y del sistema | En curso; fusionado en `staging`, pendiente de aceptación |
| [MT-01](exec-plans/active/MT-01-mantenimiento-y-colaboracion.md) | Documentación al día y preparación para varios colaboradores | Borrador. Trabajo hecho en rama, pendiente de revisión del propietario |
| I-05 | Flujo de contribución pública | Sin plan. Depende de decidir la licencia |
| I-06 | Primera miniapp real | Sin plan. Depende de que el propietario elija la herramienta |

I-04 quedó sin alcance propio: producción y el gate de promoción se incorporaron a I-03 el 2026-11-05.

## Qué falta para cerrar lo que está abierto

**I-03.** Staging funciona de extremo a extremo. Quedan producción, promoción, rollback, el ensayo de aislamiento de escritura entre Workers y la aceptación global. Detalle en la [guía operativa](i03-operations.md).

**CP-02.** La apariencia y los ajustes posteriores de cabecera y movimiento están fusionados en `staging`. Falta la aceptación expresa del propietario para archivar el plan.

**MT-01.** Falta que el propietario revise la rama, ratifique o corrija las propuestas y haga los pasos que solo él puede hacer en GitHub, listados en [PEND-009](exec-plans/tech-debt-tracker.md#pend-009--pasos-y-decisiones-del-propietario-tras-mt-01).

## Qué viene después

La prioridad declarada es el producto: elegir y construir la primera miniapp. El lanzamiento requiere al menos una herramienta real validada; cuántas tendrá el catálogo inicial sigue abierto.

Antes de I-06 conviene resolver:

* qué herramienta será la primera, con su [ficha funcional](product-specs/miniapp-template.md);
* la licencia (ADR-MMA-010), si el repositorio va a aceptar contribuciones externas;
* si se despliega producción antes o después de tener la primera herramienta.

Las skills opcionales siguen aplazadas al final, en [PEND-001](exec-plans/tech-debt-tracker.md#pend-001--skills-opcionales-al-final).
