# Roadmap informativo de MiMiniApp

**Fecha:** 2026-11-05. **Responsable:** propietario de MiMiniApp. **Estado:** propuesta trasladada del [dossier v1.2](references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md), no autorización de ejecución.

Cada iteración tendrá su propio ExecPlan cuando corresponda prepararla. I-00 tiene un [ExecPlan aceptado y archivado](exec-plans/completed/I-00-traslado-documental.md) por indicación expresa del propietario el 2026-11-04. El propietario aprobó la definición, los siete ADR y el plan I-01 y posteriormente autorizó su ejecución. I-01 está [Aceptado y archivado](exec-plans/completed/I-01-base-local-y-testing.md) por indicación expresa del propietario el 2026-11-05; los estados canónicos se consultan en cada plan. Esta tabla no aprueba ni autoriza otras iteraciones, instalaciones, integraciones o despliegues. Consulta los estados reales en cada plan conforme a [PLANS.md](PLANS.md).

| Iteración | Resultado previsto | Verificación para el cierre | Dependencias principales |
| --- | --- | --- | --- |
| I-00 | Transferencia documental, fuentes canónicas, puentes de instrucciones y contrato de iteraciones | Coherencia y enlaces; verificación por herramienta o limitación explícita; revisión humana | I-00 aceptada expresamente y archivada; H-002 aprobada; limitación Claude/Gemini aceptada para su alcance y diferida en PEND-002 |
| I-01 | Base del proyecto y testing reproducible | Instalación desde lockfile; check, lint, pruebas, build y un E2E local real | Definición y ADR-001/002/003/005/006/008/015 aprobados; I-01 Aceptado y archivado el 2026-11-05; se conservan pruebas/evidencia y deudas |
| [I-02](exec-plans/completed/I-02-catalogo-responsive-e-i18n.md) | Catálogo, diseño responsive e i18n ES/EN | ES/EN, rutas, 404, teclado y móvil/escritorio; sin anunciar miniapps inexistentes | I-02 Aceptado y archivado el 2026-11-05, tras revisión personal de capturas reales de escritorio/móvil y conformidad con diseño, arquitectura y verificaciones. Conserva 14 criterios y ADR-MMA-011/016/017; [informe y evidencias](i02-execution-report.md). Commit local de cierre autorizado; sin pushes/despliegues |
| [I-03](exec-plans/active/I-03-github-actions-y-cloudflare.md) | GitHub Actions y Cloudflare: staging/producción separados y promoción controlada por PR | CI, protecciones, despliegues y pruebas en URLs reales, identidad del artefacto, validación humana y recuperación | I-02 Aceptado; solo borrador solicitado el 2026-11-05. Arquitectura/operación aprobadas con condiciones de Editor individual y prueba previa del gate; plan En curso exclusivamente Fase A autorizada el 2026-11-06; Fase B y publicaciones no autorizadas |
| I-04 | Reserva del roadmap original; alcance por revisar | Producción y gate de promoción originalmente previstos aquí se incorporan al borrador I-03 por instrucción del propietario el 2026-11-05, evitando duplicación | Sin ExecPlan preparado ni ejecución autorizada; concretar si queda alcance propio después de revisar I-03 |
| I-05 | Flujo documental semanal y contribución | Ficha de miniapp y guías utilizables; fixtures solo si se autorizan | Flujo base estable; licencia resuelta antes de aplicar licencia o presentar el proyecto como distribuible bajo ella |
| I-06 | Primera miniapp real | Criterios de la ficha y pruebas de su iteración | **Elección humana aplazada**; no preparar ni autorizar su implementación sin esa elección |

No es una fecha de lanzamiento ni un compromiso de publicar semanalmente a costa de calidad. El lanzamiento requiere al menos una miniapp real validada; el total inicial no está cerrado.

## Al final: skills opcionales

Por petición del usuario, evaluar las skills después de completar y estabilizar el flujo anterior, cuando haya evidencia de procedimientos repetidos. La tarea se mantiene en [PEND-001](exec-plans/tech-debt-tracker.md#pend-001--skills-opcionales-al-final); no bloquea el trabajo sin skills ni autoriza su creación. No se fija una iteración de implementación hasta definir su utilidad y alcance.

## Alcance del borrador I-03 solicitado

El 2026-11-05 el propietario solicita reunir configuración GitHub Actions/Cloudflare de staging y producción en I-03, manteniendo el circuito de PR, pruebas y revisión humana antes de cada despliegue. Se conserva la numeración posterior sin inventar alcance nuevo para I-04. Esta alineación del roadmap no aprueba ni ejecuta I-03: su [ExecPlan](exec-plans/active/I-03-github-actions-y-cloudflare.md) está Aprobado formalmente y sin ejecución autorizada. La mejora de flotación y microinteracciones se registra por separado en PEND-008 y no se incorpora a infraestructura.

La adaptación individual del 2026-11-05 registra ADR-MMA-009 Aprobada: PR/checks obligatorios y decisión de merge manual del propietario, sin segunda cuenta ni reviewers de Environments; despliegues automáticos tras merge. El plan I-03 está Aprobado formalmente y conserva la evaluación de una cuenta Cloudflare/dos Workers, rollback manual a ensayar inicialmente y sus comprobaciones operativas pendientes. No se activa infraestructura por esta definición.

El propietario aprueba posteriormente la arquitectura/operación I-03 y fija tokens account-owned Editor por Worker tras bootstrap administrativo, y strict nativo de main hasta demostrar el gate y aprobar expresamente su sustitución. El ExecPlan definitivo está Aprobado formalmente; sigue pendiente autorizar ejecución; estas aprobaciones no crean Workers/tokens, no sincronizan ni despliegan.

## Ejecución limitada de I-03 — 2026-11-06

La Fase A autorizada preparó CI/configuración segura y sincronización conservadora, sin publicar en esa fase. Las notas anteriores conservan la historia de planificación. Véase el [informe histórico](i03-phase-a-report.md).

## Staging verificado — 2026-11-07

La primera publicación real de MiMiniApp terminó correctamente: PR #4 fusionado, mergee1e3b659, run42305409224 intento4 success y30 pruebas remotas confirmadas. El hito staging está `Verificado`; I-03 permanece `En curso`, sin aceptación global. Producción, promoción, rollback y aislamiento de escritura siguen pendientes y bloqueados según corresponda. [Informe vigente](i03-staging-preparation-report.md).

Está autorizado solo un PR documental para registrar ese resultado y, por separado, una propuesta breve de tres primeras miniherramientas. La prioridad pasa al producto, sin ampliar infraestructura. Ninguna herramienta está seleccionada o autorizada para implementación, ni se inicia otra iteración mediante esta actualización.
