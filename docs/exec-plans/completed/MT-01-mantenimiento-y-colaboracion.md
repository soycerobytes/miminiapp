# MT-01 — Documentación al día y preparación para varios colaboradores

## Control

* **Estado:** `Aceptado`
* **Responsable de aprobación, autorización y aceptación:** Propietario de MiMiniApp, por rol.
* **Creado:** 2026-11-13. **Última actualización:** 2026-11-15.
* **Dependencias:** ninguna. No modifica el alcance ni el estado de I-03 ni de CP-02.
* **Desviación de trazabilidad:** el trabajo se ejecutó antes de existir este plan. El 2026-11-13 el propietario pidió una auditoría y, al recibirla, indicó «haz todas las mejoras que encontraste, pero no partas de master». Esa instrucción directa autorizó a ejecutar; el plan se redactó después, en `Borrador`, y no recorrió los estados intermedios en su momento. El propietario fusionó el PR #15 el 2026-11-13 y el 2026-11-15 aprobó las propuestas y aceptó el resultado. Los estados intermedios no se reconstruyen con fechas inventadas.

## Objetivo y resultado esperado

Que una segunda persona, o un agente nuevo, pueda clonar el repositorio, entender su estado real en minutos, instalarlo y contribuir sin depender de la memoria del propietario ni de conversaciones anteriores.

## Alcance realizado

**Entorno e instalación**

* `engines` acepta Node `>=24.22.1 <25` y npm `>=11.19.1 <12`. Antes `npm ci` fallaba con cualquier parche distinto de 24.22.2.
* `.editorconfig`.
* Entorno cloud `miminiapp` de Claude Code en la web, que permite `cdn.playwright.dev` y `storage.googleapis.com` para descargar el Chromium fijado. Resuelve la repetición de PEND-006 en cada entorno nuevo.

**Colaboración**

* El gate de publicación admite una lista opcional `maintainers` válida solo para staging. No se ha añadido a nadie.
* `CONTRIBUTING.md`, plantilla de PR y `.github/CODEOWNERS`.
* Propuesta de gobierno H-003: aprobaciones registradas en GitHub cuando haya más de un mantenedor, iteraciones en paralelo y documentos vivos.

**Miniapps**

* El descriptor añade `category`, `tags` y `publishedAt`, validados en build.
* Playwright recoge las pruebas de navegador guardadas junto a cada miniapp.
* `docs/miniapps.md`, guía paso a paso, y convención de estilos en `docs/FRONTEND.md`.

**Documentación**

* `README.md`, `ARCHITECTURE.md` y `docs/roadmap.md` reescritos como descripción del presente. Su contenido histórico sigue en los planes e informes de cada iteración y en el historial de Git.
* Política de evidencias en `docs/QUALITY_SCORE.md`.
* Ocho enlaces rotos de `docs/i02-execution-report.md` convertidos en rutas en texto, con nota.
* `docs/i03-operations.md` habla de «el agente» y remite a la guía de incorporación.
* PEND-002 actualizado: carga de `CLAUDE.md` comprobada en Claude Code.

**Rendimiento**

* Fuentes en WOFF2: de 376840 a 138076 bytes, sin pérdida.

## Exclusiones y motivos

| No se ha hecho | Motivo |
| --- | --- |
| Avanzar `master` hasta `staging` | Lo pidió el propietario, pero la sesión no tenía permiso de escritura en GitHub. |
| Cambiar la rama por defecto, borrar ramas fusionadas, tocar protecciones | Solo el propietario puede hacerlo en los ajustes del repositorio. |
| Añadir una licencia | Es una decisión legal y de titularidad (ADR-MMA-010). |
| Activar Dependabot o Renovate | Es una automatización; `AGENTS.md` exige aprobación expresa. |
| Renombrar el disparador `feature/i03*`, el prefijo `I03 CI v1` o las variables `I03_*` | `ci.yml` está fijado por hash y las variables viven en GitHub. Un cambio descoordinado detiene la publicación de staging y no puede probarse desde aquí. |
| Retirar `docs/staging-publication-activation.patch` | Lo citan como evidencia el plan I-03, aún abierto, y dos de sus informes. |
| Reescribir FRONTEND, QUALITY_SCORE, SECURITY, RELIABILITY y la definición | Son fuentes canónicas con aprobaciones registradas. Queda en PEND-010. |
| Borrar capturas y vídeo de iteraciones cerradas | Es evidencia aceptada. La política nueva se aplica hacia adelante. |
| Cambiar la interfaz del catálogo | El diseño de I-02 está aceptado. Los campos nuevos del descriptor no se muestran. |

## Decisiones aplicables y propuestas

Se respetan todas las decisiones aprobadas. Lo que las modifica se registró como `Propuesta` y el propietario lo aprobó el 2026-11-15:

* [Enmiendas a ADR-MMA-003, 009, 011, 015 y 017](../../design-docs/index.md#enmiendas-del-2026-11-13--mt-01).
* [H-003](../../harness-decisions.md#h-003--colaboración-entre-varias-personas-y-documentos-vivos).
* [Convención de estilos](../../standards/FRONTEND.md#convención-de-estilos) y [política de evidencias](../../standards/QUALITY_SCORE.md#política-de-evidencias).

## Cuestiones resueltas por el propietario

El 2026-11-15, tras leer el resumen de las cinco enmiendas, H-003, la convención de estilos y la política de evidencias, el propietario responde «si, está bien». Quedan aprobadas sin cambios, incluidas las seis categorías y la restricción de los mantenedores adicionales a staging. Los pasos de [PEND-009](../tech-debt-tracker.md#pend-009--pasos-y-decisiones-del-propietario-tras-mt-01) siguen abiertos y no forman parte de esta aceptación.

## Verificaciones y evidencia

Ejecutadas el 2026-11-13 en una sesión cloud, desde la raíz del repositorio, con el Chromium 156.0.8078.4 que fija Playwright 1.64.1 (revisión 1248). Estos son los resultados locales previos al PR.

| Comprobación | Resultado |
| --- | --- |
| `npm run verify` sobre `staging` (`6f4f7f0`) sin cambios, Node 24.22.2 | exit 0: 326 unitarias, 9 de componentes, 78 E2E, integración modular. |
| `npm ci` con Node 24.22.1 antes del cambio de `engines` | Falla con `EBADENGINE`. |
| `npm ci` con Node 24.22.1 después | Correcto; el lockfile no cambia. |
| `npm run verify` con todos los cambios, Node 24.22.2 | exit 0: 343 unitarias, 9 de componentes, 78 E2E, integración modular. |
| `npm run verify` con todos los cambios, Node 24.22.1 | exit 0, mismos recuentos. |
| Descubrimiento de pruebas por miniapp | Con una prueba temporal en `src/miniapps/<x>/tests/`, Playwright pasa de 78 a 80 casos. Retirada después. |
| Utilidades de tokens (`bg-surface`, `text-ink`…) | Un componente temporal las usa y el CSS del build las contiene. Retirado después. |
| Fuentes WOFF2 | Ida y vuelta tabla a tabla contra los TTF: idénticas salvo `head` y `DSIG`, como exige el formato. Las E2E de tipografías pasan. |
| Enlaces locales de la documentación | Comprobados con un script puntual; ninguno roto. |

De las 17 pruebas unitarias nuevas, 14 cubren el gate (11 en `release-gate.test.ts`, 3 en `release-merged-pr.test.ts`) y 3 el descriptor. Las anteriores pasan sin modificar, salvo los descriptores de ejemplo, que incorporan los campos nuevos.

Después del merge del PR #15 (`fd9082e`), el [run 43495406369 de Staging](https://github.com/aalexlpez/miminiapp/actions/runs/43495406369) terminó en `success`: el gate modificado aceptó el merge del propietario y la publicación y las pruebas remotas pasaron.

No comprobado: el gate con un segundo mantenedor real en GitHub, Firefox, WebKit y dispositivos físicos.

## Riesgos y recuperación

* **Gate.** Si el cambio rechazara por error al propietario, la publicación de staging fallaría cerrada, sin publicar nada. Se recupera con un PR que revierta `scripts/release/gate.ts` y `github.ts`.
* **Fuentes.** Si un navegador no cargara las WOFF2, el sitio usaría la tipografía del sistema. Se recupera revirtiendo ese commit.
* **`engines`.** Si un parche futuro de Node 24 rompiera algo, CI lo detectaría solo al actualizar la versión de referencia, que sigue fijada.

Cada cambio de código está en su propio commit para poder revertirlo por separado.

## Punto de parada

Plan cerrado. Los pendientes que deja están en PEND-009 y PEND-010.

## Historial de estado

| Fecha | Estado | Actor | Evidencia o motivo |
| --- | --- | --- | --- |
| 2026-11-13 | `Borrador` | Claude Code | Plan redactado después de ejecutar el trabajo por instrucción directa del propietario («haz todas las mejoras que encontraste»). Pendiente de su aprobación y aceptación. |
| 2026-11-13 | `Borrador` | Propietario de MiMiniApp | Fusiona el PR #15 en `staging` (`fd9082e`); la publicación de staging termina correctamente. El merge no se registró entonces como aprobación de las propuestas. |
| 2026-11-15 | `Aceptado` | Propietario de MiMiniApp | «si, está bien», en respuesta al resumen de lo que quedaba pendiente de ratificar: aprueba las cinco enmiendas, H-003, la convención de estilos y la política de evidencias, y acepta el resultado. Plan archivado en `completed/`. |
