# Fiabilidad y entrega

**Estado actual, 2026-11-06:** I-03 En curso exclusivamente Fase A autorizada. Preparación de Fase A completada con comprobaciones disponibles satisfactorias y limitaciones documentadas. Publicaciones bloqueadas y Fase B sin autorizar. **Responsable:** propietario de MiMiniApp.

## Circuito aprobado

`feature/*` → pruebas → PR a staging → quality → revisión y merge manual del propietario → deploy automático a staging → pruebas remotas → PR staging→main → quality/promotion → revisión y merge manual → deploy automático a producción y smoke.

ADR-MMA-004/009/014/015 aprueban Workers Static Assets, flujo individual y toolchain fijada. El control humano es la revisión y merge manual del propietario; cero reviews de otra cuenta y cero reviewers de deployment. No existe aprobación independiente. Los workflows no fusionan PR. En el circuito futuro activado, el merge válido a main autoriza su publicación sin otra intervención semanal.

## Controles de promoción

PR/checks obligatorios, auto-merge desactivado, sin pushes directos/force/borrados, administrador sujeto a reglas cuando sea posible. Quality en staging; quality y promotion en main. Strict=true nativo en ambas; su sustitución en main exige pruebas reales y aprobación expresa adicional. No se rebaja para resolver el bootstrap.

Se construye y prueba el candidato una vez en staging, con manifiesto inocuo e identidad verificable. Producción descarga el mismo artefacto por IDs de run/intento/artefacto y verifica hashes, procedencia, recibo y manifiesto realmente servido. Cambios de candidato/base, reruns antiguos o bytes distintos deben rechazar promoción. Los publicadores vuelven a comprobar bajo el bloqueo compartido, sin prometer FIFO. Los mocks locales no acreditan carreras reales del proveedor.

## Estado implementado de Fase A

CI, gate, empaquetado, pruebas negativas, suite remota y configuraciones están preparados. Publicadores de staging/producción/rollback conservan condiciones literales falsas y política A con deploymentsEnabled=false. Main/staging permanecen en73b8bd2; master214a3c1 sigue predeterminada. Runs de publicación skipped y deployments vacíos. La aplicación y la infraestructura no han cambiado desde el commit verificado.

La API corrobora solo merge commits, sin squash/rebase/auto-merge, y ambos Environments sin reviewers/espera con sus ramas exactas. Main exige quality y promotion de GitHub Actions app15368; staging quality, ambos para todos. La discrepancia previa quedó resuelta y se completa la preparación de Fase A. El detalle de protecciones y los listados de secretos/variables están denegados403: strict, PR/reviews, force/delete y ausencia de secretos quedan como declaración del propietario, sin afirmar lectura o enforcement automatizado. El PR técnico #2 quedó cerrado sin merge; emitió promotion y falló en el paso del gate. El propietario revisó el log y confirmó el mensaje literal de rechazo de un origen distinto del PR staging→main del mismo repositorio; evidencia humana, sin atribuir al agente acceso a logs ni dar por probadas otras garantías de seguridad. Véase el [informe](i03-phase-a-report.md).

Una cuenta Cloudflare Free y dos Workers aprobados: `miminiapp-staging`/`miminiapp`, subdominio `miminiapp-lab.workers.dev`. Sin Workers o tokens creados por esta ejecución. La creación administrativa documentada requiere deploy y queda detenida. Dentro de un bootstrap B expresamente autorizado: crear los recursos con administración controlada, después dos account-owned tokens Editor limitados individualmente y prueba real de denegación cruzada antes de activar publicadores ordinarios. Ese aislamiento no se exige como ya demostrado antes de autorizar el bootstrap necesario para probarlo. Admin fuera de CI; sin OAuth ni fallback de Workers Scripts: Edit general. Si el aislamiento falla, detener activación y solicitar aprobación antes de una alternativa.

## Fallos y recuperación

Tras activar el circuito, staging requiere pruebas reales ES/EN/rutas/recursos/responsive/teclado/axe/identidad y exclusión de fixtures; producción requiere smoke. No activar Workers Builds u otro segundo publicador. Si una publicación falla o tiene timeout, consultar el estado realmente servido y la versión del proveedor; no asumir ausencia de efecto ni declarar release verde.

Rollback excepcional manual del propietario, desde ref protegida, destino fijo y artefacto anterior validado, sin código arbitrario. Ensayo inicial autorizado en staging pendiente; captura de versión Cloudflare, resolución del estado tras timeout, restauración y smoke deben implementarse/comprobarse realmente antes de la activación ordinaria. Master todavía no contiene los workflows, por lo que workflow_dispatch de rollback requerirá una secuencia de predeterminada revisada y autorizada posteriormente. No hay rollback automático preparado. Retención 7 días para fallos y hasta 30 para candidatos/recibos; un artefacto expirado no se promueve y se conserva una versión recuperable.

## Coste y evolución

Objetivo 0 USD/mes, con GitHub público/runner estándar y Cloudflare Free sujetos a cuotas comprobadas antes de activar; alertas no equivalen a un bloqueo de gasto. Sin SSR ni estado anticipados. No hay URL pública o SLA verificados. En el futuro las reviews de otro colaborador se incorporan mediante protecciones con revisor elegible, sin rediseñar workflows.

La [guía operativa](i03-operations.md) separa configuración inicial, trabajo semanal y recuperación. El [ExecPlan](exec-plans/active/I-03-github-actions-y-cloudflare.md) conserva los 12 AC y la autoridad para activar y aceptar; preparar archivos no autoriza despliegues, I-04 ni miniapps reales.
