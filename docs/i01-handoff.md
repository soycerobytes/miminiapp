# I-01 — Continuación en otro chat

## Cierre aceptado — 2026-11-05

El propietario acepta expresamente I-01 tras revisar los resultados satisfactorios: **«Acepto expresamente I-01 como propietario de MiMiniApp»**. El [ExecPlan aceptado](exec-plans/completed/I-01-base-local-y-testing.md) está archivado en completed/ y el [informe](i01-execution-report.md#aceptación-y-archivo--2026-11-05) conserva verificaciones, evidencias, limitaciones y deudas. No reabrir ni repetir las pruebas ya pasadas por el cierre documental.

La misma indicación autoriza un commit local de I-01 sin temporales y preparar únicamente el borrador de I-02; no autoriza implementación, pushes o despliegues. El checkpoint 0cf778f conserva la implementación previa; el commit de cierre incorpora la documentación posterior, no los binarios, logs, capturas o entregables auxiliares ignorados. PEND-007 y las limitaciones de accesibilidad/navegadores/dispositivos siguen registradas. Las notas siguientes son historia de reanudación anterior a esta aceptación y no describen el estado actual.

## Actualización de la reanudación desde 0cf778f

**Última revalidación, 2026-11-05:** instalación oficial repetida en caché nueva /workspace/.cache/ms-playwright-i01-recheck-20261105, verify exit 0 (14+9+8, sin omisiones) y test:a11y aislado exit 0 (los mismos dos casos axe). DEBUG y las versiones de ambos binarios acreditan seis lanzamientos del Headless Shell 156.0.8078.4/r1248 de Playwright, sin navegador del sistema. Evidencia nueva en .local/verification/recheck-2026-11-05/ y [el informe](i01-execution-report.md#revalidación-solicitada--2026-11-05). Se mantiene Verificado y pendiente de aceptación; no se modifica el entorno ni se hacen commits/pushes o I-02.

El 2026-11-04 se recuperó y abrió el SHA exacto `0cf778f988068e9ac7f7c7a519e1ec36486cc8aa` en /workspace/miminiapp, con HEAD separado y sin cambios locales previos. El propietario solicita completar las verificaciones y registrar evidencias; **no autoriza nuevos commits/pushes ni I-02**. El permiso histórico de traslado descrito abajo ya se consumió.

Node 24.22.2/npm 11.19.1 preparados de nuevo con checksum oficial; npm ci instala 491 paquetes y conserva el lockfile. Tras publicar el permiso de red el propietario, la instalación oficial de Chromium y Headless Shell **156.0.8078.4 / revisión 1248** pasa. **verify exit 0: 14 unitarias, 9 componentes y 8 E2E/axe, sin omisiones**. La revisión asistida de teclado/foco y seis capturas a 1280×900/393×851 pasa; HTTP 200 y contenido idéntico a los cinco archivos del mismo build. No se atribuye revisión humana ni dispositivo físico. Controles negativos/positivos, grafo y auditoría (0 altas/críticas, 11 moderadas) se conservan de la reanudación previa.

**Estado al verificar, anterior a la aceptación:** PEND-006 resuelto. La política observada enforced incluye cdn.playwright.dev, playwright.download.prss.microsoft.com y storage.googleapis.com; la descarga y ejecución acreditan el permiso efectivo. I-01 pasa a **Verificado**, AC01–10 comprobados y **aceptación del propietario pendiente**. Evidencia final en `.local/verification/chromium-156/` y [verificación final del informe](i01-execution-report.md#verificación-final-con-chromium-fijado). Los fallos 403 y los reportes anteriores se conservan en resume-0cf778f/. No se reaplican cambios al nuevo borrador ni se publica por el agente.

Esta continuación solo modifica documentación local, sin nuevo commit/push; 0cf778f sigue siendo el checkpoint de implementación y no contiene estos resultados posteriores. Antes de cambiar de máquina hay que preservar los cambios autorizados sin sobrescribirlos. No repetir comprobaciones ya satisfechas sin cambios relevantes; mantener el plan en active/ y esperar aceptación expresa, sin I-02. PEND-007 sigue abierto por once moderadas de desarrollo. No hay cambios de código, versiones, aserciones o arquitectura.

Los apartados siguientes conservan el contexto y procedimiento del traslado original; las observaciones de red de aquella instancia no describen la política actual.

**Fecha y actor:** 2026-11-04, propietario de MiMiniApp. Autoriza expresamente crear la rama feature/i01-base-local-testing, realizar un commit del trabajo de I-01 y subir esa rama para continuar en otro chat. El [ExecPlan](exec-plans/completed/I-01-base-local-y-testing.md) conserva la autorización y su alcance.

## Punto de partida

Repositorio: aalexlpez/miminiapp. Rama: feature/i01-base-local-testing. En el chat de destino hay que seleccionar esta rama y comprobar el SHA frente al comunicado tras el push; trabajar desde master no recupera estos cambios.

Leer [AGENTS.md](../AGENTS.md), la [definición](product-specs/index.md), los [ADR](design-docs/index.md), el [plan hoy archivado](exec-plans/completed/I-01-base-local-y-testing.md) y el [informe de ejecución](i01-execution-report.md). En el traslado original, I-00 estaba Aceptado y archivado e I-01 conservaba su autorización con estado En curso; el cierre actual se registra al principio de esta guía.

Están implementados Astro + React + TypeScript strict + Tailwind, la fixture técnica y las pruebas. Pasaron instalación congelada, tipos, lint, formato, 14 unitarias, 9 componentes y build. El Chromium 156.0.8078.4 de Playwright 1.64.1 (revisión 1248) no se pudo descargar por HTTP 403 Domain forbidden desde cdn.playwright.dev. Los ocho diagnósticos complementarios con Chromium 155 pasaron; no completan los criterios del navegador obligatorio.

## Preparación y verificaciones pendientes

1. Comprobar rama, commit y cambios locales antes de actuar; no sobrescribir trabajo existente. Verificar la política y el acceso efectivos de la máquina de destino: publicar una configuración no demuestra que este entorno la haya incorporado. Si una descarga redirige a otro dominio denegado, registrar el destino y solicitar el permiso de red necesario sin evitar el proxy ni desactivar TLS.
2. Activar **Node 24.22.2 y npm 11.19.1**, los valores exactos de .node-version y package.json. Prepararlos con un gestor compatible o la distribución oficial con sus sumas verificadas si no están disponibles. La ruta /workspace/.tools/node-v24.22.2-linux-x64 usada en el chat anterior no está en Git y puede no existir aquí. No cambiar versiones ni regenerar el lockfile para evitar una incompatibilidad del runtime.
3. Desde la raíz del checkout y con esos ejecutables activos, ejecutar:

```sh
node --version
npm --version
export ASTRO_TELEMETRY_DISABLED=1
npm ci
npx --no-install playwright install chromium
npm run verify
```

La suite verify incluye build, E2E y axe en Chromium escritorio y móvil emulado; se esperan 14 unitarias, 9 componentes y 8 casos de navegador, sin omisiones. Para repetir solo accesibilidad puede usarse npm run test:a11y. Repetir también la revisión registrada de teclado/foco y aspecto responsive con el navegador requerido, identificando si es asistida o humana. Registrar comandos, versiones, códigos de salida, recuentos y comparación del lockfile antes/después. Si faltan librerías del sistema, diagnosticar e instalar únicamente las dependencias necesarias de Chromium conforme al plan. No sustituir el navegador fijado por uno del sistema para declarar cumplidos los criterios.

Los directorios de caché pueden variar entre máquinas. Si se fija PLAYWRIGHT_BROWSERS_PATH, usar el mismo valor para instalar y ejecutar las pruebas. node_modules/, .astro/, dist/, .local/, playwright-report/ y test-results/ están ignorados; los binarios del runtime/navegador, logs y capturas del chat anterior no viajan en el commit. El informe contiene sus resultados, hashes y límites; la nueva ejecución debe generar su propia evidencia.

## Cierre y límites

Actualizar el plan y el informe con los resultados reales. Pasar a Verificado solo cuando se cumplan los criterios, incluyendo los pendientes AC03/04/07/08 con Chromium 156. Una comprobación material fallida mantiene En curso. La aceptación corresponde expresamente al propietario.

Mantener la fixture técnica: sin catálogo ni miniapp real. No iniciar I-02, configurar CI remoto, Cloudflare, servicios externos o despliegues. No cambiar materialmente tecnologías, arquitectura o alcance sin aprobación. Los ajustes mecánicos cubiertos por los ADR aprobados pueden aplicarse y verificarse con evidencia. Conservar H-001/H-002, la aceptación de I-00 y su desviación histórica de trazabilidad.

El permiso Git de este traslado autoriza únicamente ese commit y push a la rama indicada; no autoriza merges, cambios en master ni futuros commits/pushes. No marcar I-01 Aceptado por el hecho de subir el trabajo.
