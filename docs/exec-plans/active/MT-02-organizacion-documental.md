# MT-02 — Organización documental

## Control

* **Estado:** `Verificado`.
* **Responsable de aprobación, autorización y aceptación:** propietario de MiMiniApp.
* **Creado / actualizado:** 2026-11-15.
* **Base:** staging `e203d73156a61a61138e9ff23de964a827221fad`; rama local de ejecución `docs/mt02-organization`.
* **Aprobación y autorización:** el propietario indica «vamos a aplicar esta mejora» tras revisar la estructura y el alcance propuestos. Autoriza esta migración local y su verificación; no se infiere aprobación o ejecución de Plan B, commit, push, PR, merge o publicación.
* **Dependencias:** ninguna iteración previa pendiente bloquea este cambio de rutas. Los borradores locales de Plan B se conservan, con ajustes mecánicos de enlaces y sin cambiar sus estados.

## Objetivo y alcance

Reducir la raíz de `docs/` a cinco documentos de entrada/gobierno y agrupar guías, normas e informes por función. Mantener producto, decisiones, planes, referencias y evidencias en sus áreas actuales. Actualizar enlaces, referencias operativas y la ruta del parche usada por pruebas. Añadir `docs/README.md` como mapa único, sin un índice adicional por cada carpeta nueva.

Se conserva el contenido de los informes y planes cerrados, incluidos estados y cronología; solo se reubican y se reparan enlaces relativos. Las referencias originales en `docs/references/` y el parche histórico se conservan byte a byte. Las rutas literales dentro de relatos históricos describen su época y no se reescriben como si ya hubieran tenido la estructura nueva.

## Movimientos autorizados

| Origen en `docs/` | Destino en `docs/` |
| --- | --- |
| `miniapps.md` | `guides/miniapps.md` |
| `i03-operations.md` | `guides/staging.md` |
| `FRONTEND.md` | `standards/FRONTEND.md` |
| `SECURITY.md` | `standards/SECURITY.md` |
| `QUALITY_SCORE.md` | `standards/QUALITY_SCORE.md` |
| `RELIABILITY.md` | `standards/RELIABILITY.md` |
| `i01-execution-report.md` | `reports/i01/execution.md` |
| `i01-handoff.md` | `reports/i01/handoff.md` |
| `i02-execution-report.md` | `reports/i02/execution.md` |
| `i03-phase-a-report.md` | `reports/i03/phase-a.md` |
| `i03-staging-preparation-report.md` | `reports/i03/staging-preparation.md` |
| `i03-merged-pr-correction-report.md` | `reports/i03/merged-pr-correction.md` |
| `i03-staging-startup.md` | `reports/i03/staging-startup.md` |
| `cp01-execution-report.md` | `reports/cp01/execution.md` |
| `cp02-execution-report.md` | `reports/cp02/execution.md` |
| `onboarding-audit.md` | `reports/i00/onboarding-audit.md` |
| `i03-pr-ci-identity.md` | `design-docs/i03-pr-ci-identity.md` |
| `staging-publication-activation.patch` | `reports/i03/staging-publication-activation.patch` |

Retirar los archivos vacíos `docs/DESIGN.md` y `docs/PRODUCT_SENSE.md` después de comprobar que no tienen consumidores operativos ni enlaces. Sus menciones en el dossier/auditoría original se conservan como historia. Los archivos y configuración de la raíz del repositorio, código, activos de diseño, pruebas visuales, artefactos generados y política de evidencias conservan su ubicación.

## Exclusiones y decisiones

No se rediseña la documentación ni se fusionan informes. No se modifica comportamiento de aplicación, contratos de producto, stack, dependencias, lockfile, CI/CD, permisos, autoría o estados de planes previos. El único ajuste de código ejecutable previsto es la ruta del parche en `tests/unit/workflow-safety.test.ts`; el comentario de la guía en el registro también se actualiza. Los fixtures de seguridad se mantienen íntegros y las pruebas no se debilitan.

La organización aceptada se refleja en las fuentes canónicas y en H-004 como conocimiento del harness de esta instancia, sin cambiar autoridad ni transiciones. No se requiere una decisión técnica de producto nueva para trasladar estos documentos.

## Trabajo previsto

1. Guardar snapshot local de archivos versionados y borradores; inventariar enlaces rotos previos para distinguir regresiones.
2. Aplicar los 18 movimientos y las dos retiradas vacías, rebasando enlaces según origen/destino; preservar referencias y parche originales.
3. Actualizar rutas vigentes en AGENTS, README, arquitectura, contribución, guías y pruebas. Mantener importación de AGENTS por Claude/Gemini.
4. Añadir mapa documental, registro H-004 y entrada de roadmap. Conservar Plan B como borrador y sus ADR como propuestas.
5. Verificar enlaces/anchors, preservación de contenido y ámbitos sin cambios. Ejecutar `npm run verify` con runtime y Chromium fijados. Registrar resultados reales y pendientes aquí.

## Entorno y verificaciones

Runtime ya disponible en `/workspace/.tools/node-v24.22.2-linux-x64`: Node 24.22.2 / npm 11.19.1. Chromium r1248 ya disponible en `/workspace/.cache/ms-playwright`. No instalar ni cambiar dependencias. Astro con `ASTRO_TELEMETRY_DISABLED=1`; establecer `PATH` y `PLAYWRIGHT_BROWSERS_PATH` solo para los comandos de verificación.

La revisión de enlaces y el snapshot se ejecutan con scripts locales temporales bajo `/workspace/work/mt02/`; no se introduce automatización permanente ni dependencia. `npm run verify` es el comando existente; cualquier resultado se describe como local, sin atribuir CI o pruebas remotas.

## Criterios de aceptación

| ID | Resultado comprobable |
| --- | --- |
| MT02-01 | Raíz de `docs/`: README, BOOTSTRAP, PLANS, harness-decisions y roadmap. Los 18 destinos existen y los dos archivos retirados eran vacíos y sin uso operativo. |
| MT02-02 | Mapa documental y fuentes de navegación dirigen a ubicaciones reales; ningún enlace local nuevo roto ni referencias ejecutables a las rutas retiradas. |
| MT02-03 | Historia y aprobaciones previas conservadas; referencias originales y parche idénticos; Plan B sigue en borrador y ADR-MMA-020/021 en Propuesta. |
| MT02-04 | Runtime, configuración, workflows, dependencias, activos y comportamiento conservados. Solo cambia la ruta consumida por la prueba y el comentario operativo previsto. |
| MT02-05 | Revisión documental y `npm run verify` satisfactorios, con resultados locales y límites registrados. |

## Riesgos, recuperación y punto de parada

El principal riesgo es romper enlaces o una ruta leída por pruebas. Validar origen y destino, revisar diff y ejecutar la batería completa. El snapshot anterior permite recuperar archivos locales sin perder los borradores ajenos a MT-02; no usar reset/clean ni sobrescribir trabajo previo. Si aparece un fallo de base, investigarlo y distinguirlo de una regresión, sin ampliar esta migración ni debilitar verificaciones.

Entregar resultado verificado para aceptación humana; no registrar `Aceptado` por ejecutar la instrucción. No hacer publicaciones ni avanzar Plan B bajo esta autorización.

## Progreso

Migración local terminada el 2026-11-15; pendiente de aceptación humana. Los siguientes resultados verifican MT02-01–05:

* **Organización:** 18 archivos reubicados, dos placeholders vacíos retirados y raíz de `docs/` reducida de 24 a cinco archivos. Mapa documental, enlaces de entrada y convención H-004 actualizados.
* **Enlaces:** baseline de 60 Markdown / 422 enlaces locales sin fallos; resultado final de 59 Markdown / 460 enlaces locales sin destinos ni anchors ausentes. Las 14 fuentes de navegación vigente revisadas no contienen las rutas antiguas de los documentos movidos.
* **Preservación:** diez informes históricos y seis planes cerrados conservan todo su contenido salvo destinos de enlaces; dos referencias originales y el parche conservan exactamente sus bytes. Los cuatro borradores de Plan B solo tienen ajustes de referencias y mantienen su estado; ADR-MMA-020/021 siguen en `Propuesta`.
* **Ámbito:** 184 archivos de configuración, workflows, despliegue, scripts, activos, evidencias y puentes de agentes conservados byte a byte. El código solo cambia en el comentario de ubicación de la guía y en la ruta del parche que consume la prueba de seguridad. No se han instalado paquetes ni alterado el lockfile.
* **Verificación local:** `npm run verify`, exit 0 con Node 24.22.2 / npm 11.19.1 y Chromium r1248. Astro check sin diagnósticos, lint, formato, validación de hosting, 343 unitarias, 9 componentes, 78 E2E y la integración modular satisfactorios. `git diff --check` correcto. No se han ejecutado CI, pruebas remotas o despliegues.

Los scripts y logs temporales sirven para el trabajo local y no son enlaces de evidencia compartida. Este resumen registra los resultados consultables de la iteración. Al terminar la verificación todavía no se habían hecho commits, pushes, PR ni publicaciones. La aceptación final corresponde al propietario.

**Autorización posterior de entrega — 2026-11-15:** el propietario pide «puedes subir los cambios a la rama remota». Autoriza crear el commit de los cambios preparados, incluidos los borradores de Plan B, y subir `docs/mt02-organization` a `origin`. No cambia el estado `Verificado` de MT-02 ni aprueba los requisitos/ADR/ejecución de Plan B. No autoriza merge o despliegue.

## Historial de estado

| Fecha | Estado | Actor | Evidencia o motivo |
| --- | --- | --- | --- |
| 2026-11-15 | `Borrador` | Codex | Traslado del alcance concreto presentado al propietario antes de ejecutar movimientos. |
| 2026-11-15 | `Aprobado` | Propietario de MiMiniApp | «vamos a aplicar esta mejora», referido a la propuesta de estructura y migración MT-02. |
| 2026-11-15 | `Autorizado` | Propietario de MiMiniApp | La misma indicación autoriza aplicar y verificar la reorganización local. |
| 2026-11-15 | `En curso` | Codex | Snapshot e inventario de enlaces completados; inicio de movimientos y actualización mecánica de referencias. |
| 2026-11-15 | `Verificado` | Codex | MT02-01–05 comprobados localmente: organización, enlaces, preservación y `npm run verify` completos; pendiente aceptación humana. |
