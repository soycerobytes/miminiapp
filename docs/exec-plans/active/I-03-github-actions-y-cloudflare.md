# I-03 — GitHub Actions y Cloudflare: staging, producción y promoción por PR

## Control

* **Estado:** `En curso`. I-03 no está Verificado ni Aceptado en su totalidad.
* **Hito de staging:** `Verificado` el 2026-11-07 (Europe/Madrid): PR #4 fusionado, primera publicación real de MiMiniApp y pruebas remotas satisfactorias en run42305409224, intento4. Producción, promoción, rollback y ensayo de aislamiento de escritura siguen pendientes.
* **Responsable de aprobación, autorización y aceptación:** propietario de MiMiniApp.
* **Creado:** 2026-11-05. **Última actualización:** 2026-11-07.
* **Dependencia satisfecha:** [I-02 aceptado y archivado](../completed/I-02-catalogo-responsive-e-i18n.md).
* **Base aceptada conservada:** `567b394583140d1710034f4798d0cf8dbb29e387` (I-02), ancestro del staging publicado. Informe actual: [staging](../../i03-staging-preparation-report.md); [Fase A](../../i03-phase-a-report.md) conserva la preparación histórica.
* **Autorización actual:** el 2026-11-07 el propietario confirma el despliegue satisfactorio y autoriza exclusivamente un PR documental hacia staging para registrar evidencias, verificar el hito y actualizar la operación/referencias. No fusionar el PR ni cambiar código, mecanismos, infraestructura, credenciales, protecciones o predeterminada. Después se presentarán tres propuestas de primera miniherramienta, sin seleccionar o implementar ninguna. La prioridad pasa al producto; no se amplía infraestructura.
* **Aprobación formal:** 2026-11-05, propietario de MiMiniApp: «Apruebo formalmente el ExecPlan I-03 — GitHub Actions y Cloudflare: staging, producción y promoción por PR», incluidos sus 12 criterios de aceptación; ratifica los ADR correspondientes. La misma instrucción declara que todavía no autoriza su ejecución ni crear recursos, tokens o ramas, hacer commits, pushes, merges o despliegues.
* **Límites vigentes:** staging ya se publicó por Actions; este trabajo documental no publica ni modifica controles. Staging exige quality y main quality+promotion de GitHub Actions para todos. Se conservan las limitaciones403 de lectura administrativa completa y los ensayos negativos no realizados; no se infiere una nueva auditoría de secretos o protecciones. Main mantiene strict=true y master predeterminada. El probe acreditó lectura de staging y denegación de otro Worker403; no acredita aislamiento de escritura. Producción, promoción, rollback, ese ensayo y aceptación global de I-03 siguen pendientes. No ampliar permisos como alternativa automática. I-01/I-02 permanecen cerrados.
* **Cloudflare actual, confirmado el 2026-11-07:** MiMiniApp publicada en miminiapp-staging, URL https://miminiapp-staging.miminiapp-lab.workers.dev. El propietario administra cuenta/credenciales en GitHub Environment staging; Codex prepara código/pruebas/PR y no necesita acceso a Cloudflare. Producción y sus credenciales permanecen fuera de esta ejecución.
* **Cloudflare confirmado por el propietario, 2026-11-05 (histórico):** cuenta creada, acceso a Workers & Pages y cuota Workers Free visible; subdominio `miminiapp-lab.workers.dev`. Nombres decididos: staging `miminiapp-staging`, producción `miminiapp`. No hay proyectos, Workers, tokens o integraciones creados. Es información aportada por el propietario, no una inspección autenticada del agente.
* **Aprobación de decisiones, 2026-11-05:** el propietario aprueba alojamiento/operación, una cuenta y dos Workers con los nombres/subdominio confirmados, Wrangler 4.158.0, Ubuntu 24.04 y acciones por SHA completo a verificar durante ejecución, sincronización conservadora preservando master/I-01/I-02, retención 7/30 días, gasto objetivo 0 USD/mes y rollback manual ensayado primero en staging. Exige tokens account-owned Editor por Worker tras creación administrativa y demostrar el gate antes de sustituir la protección nativa de main. No autoriza ejecutar I-03, crear recursos/tokens, sincronizar, hacer commits/pushes/merges o desplegar.
* **Modelo individual confirmado, 2026-11-05:** un desarrollador y responsable con una cuenta personal GitHub. PR y checks obligatorios, cero aprobaciones de terceros, revisión y merge manual del propietario, auto-merge desactivado y ningún revisor obligatorio de Environments. Estas decisiones de flujo se registran en ADR-MMA-009; no aprueban ni activan I-03.

## Autorización limitada de Fase A — 2026-11-06

La autorización posterior permite preparar código/configuración, verificar historia local/remota y compatibilidad, commits/pushes técnicos sin publicaciones, ramas staging/main y protecciones disponibles. El propietario conserva revisión/merge manual. Main mantiene strict=true; no se autoriza sustituirlo, promocionar o cambiar la rama predeterminada antes de comprobar los controles.

Implementar CI y workflows de staging/promoción/producción con publicadores **inactivos por código**, sin secretos de despliegue utilizables hasta autorización expresa de Fase B. Preparar Workers Static Assets y tokens Editor individuales, pero no publicar Worker ni contenido. Si crear un Worker exige desplegarlo, detener esa operación y pedir autorización; ninguna alternativa de credenciales generales automática. Pruebas que necesitan publicación o cambios de seguridad no aprobados quedan pendientes de Fase B.

La recuperación del entorno se verificó en Codex Cloud: pwd y git status operativos, HEAD567b394 e I01aceptado0288de5 íntegros, código/build I02 idénticos al manifiesto y planificación sin commit presente. No se modificó historia para recuperar acceso.

Parada Fase A: entregar inventario de cambios, commits/ramas/configuración, pruebas y límites, pasos personales GitHub/Cloudflare y solicitar autorización antes de activar despliegues. I-03 permanece En curso hasta satisfacer fases/AC; no se declarará Verificado por preparar únicamente Fase A.

## Objetivo, alcance y exclusiones

Conseguir que el trabajo habitual sea desarrollar una miniapp, ejecutar pruebas, abrir PR, revisar el resultado en staging y aprobar su paso a producción. GitHub Actions ejecutará las pruebas y despliegues; el propietario no tendrá que ejecutar Wrangler ni desplegar manualmente cada semana.

I-03 propone configurar GitHub Actions y **Cloudflare Workers Static Assets**, con staging y producción separados, protecciones de ramas, identidad verificable del contenido servido, promoción del artefacto validado y recuperación. Incluye documentación operativa y evidencia local, CI y remota. El borrador reúne staging y producción antes separados en I-03/I-04 del roadmap; no autoriza otra iteración.

No incluye miniapps reales, animaciones de PEND-008, cambios de diseño/stack, backend, SSR, BD, cuentas de usuario de la aplicación, analítica, contribución pública ni licencia general. No requiere comprar dominio. No se crean configuraciones ejecutables o recursos por preparar este documento.

## Decisiones y arquitectura aprobadas: ejecución parcial

Se mantienen los ADR aprobados de Astro estático, React cuando procede, TypeScript, Tailwind, modularidad, ES/EN y toolchain fijada. Las decisiones de I-03 y sus autorizaciones parciales constan en el [índice técnico](../../design-docs/index.md) y el historial inferior. Staging está implementado y verificado; el resto conserva sus pendientes y no se autoriza por este PR documental. ADR-MMA-007 no se aprueba por observar que el repositorio ya es público.

### Workers Static Assets

Staging publica únicamente `dist/`, sin adaptador SSR, función Worker propia, `main` de ejecución o bindings de datos. Wrangler publicó12 archivos y la suite remota pasó. Los siguientes valores están aplicados en staging; la configuración de producción sigue pendiente:

| Parámetro | Propuesta |
| --- | --- |
| Directorio | `assets.directory = ./dist`. Nunca el repositorio, fuentes, tests o `.local/`. |
| HTML | `assets.html_handling = auto-trailing-slash`: conserva `/es/` y `/en/`; comprobar los 307 de normalización del proveedor. |
| No encontrado | `assets.not_found_handling = 404-page`, con `dist/404.html` bilingüe. Sin modo SPA. |
| Raíz | Aprobada: regla estática exacta `/ /es/ 301` en `_redirects`, conservando el HTML de fallback de I-02. No redirigir rutas desconocidas a español. |
| Ejecución dinámica | No se usa `run_worker_first` ni código servidor; no se introducen invocaciones Worker para servir la web. |
| CLI/configuración | Aprobado: Wrangler **4.158.0**, Node **24.22.2**, npm **11.19.1**, `compatibility_date = 2026-11-04` y validación del esquema de esa versión. Sin `@latest` en CI. Aún no instalado ni ejecutado; versiones/SHA se verificarán durante ejecución autorizada. |
| Publicación | Entorno y destino explícitos. Rechazar destino omitido o no autorizado; sin un deploy genérico que pueda seleccionar producción accidentalmente. |

El preview Astro seguirá respondiendo 200 con meta refresh en `/`; la suite remota comprobará el 301 propuesto según lo aprobado. El cuerpo 404 y sus rutas seguirán siendo reales, con estado 404. Las reglas del proveedor se ensayarán en staging antes de producción. No se añaden canónicas/hreflang absolutos sin decidir el origen público.

### Separación de entornos y dominios

| Elemento | Staging | Producción |
| --- | --- | --- |
| Rama de publicación | `staging` | `main` |
| GitHub Environment | `staging`, restringido exactamente a esa rama | `production`, restringido exactamente a `main` |
| Worker | `miminiapp-staging`, creado por el propietario y publicado | `miminiapp`, objetivo pendiente de activación |
| URL y estado | `https://miminiapp-staging.miminiapp-lab.workers.dev`, publicada y verificada | `https://miminiapp.miminiapp-lab.workers.dev`, prevista; producción pendiente |
| Credencial | Editor staging y account ID configurados por el propietario en Environment staging | Editor de producción separado, pendiente; no se activa en este trabajo |
| Contenido | Catálogo real publicado, sin fixtures | Futuro artefacto exacto validado en staging |

El propietario administra la cuenta y las credenciales; staging ya está publicado y el Account ID está configurado en su Environment. Producción conserva sus pendientes. `workers.dev` evita comprar dominio y proporciona HTTPS. Un dominio propio y DNS/certificados serían una decisión posterior. Staging es público y no contiene secretos o datos privados; no se recrea su bootstrap.

**Modelo aprobado: una cuenta Cloudflare, dos Workers y autorización granular por recurso.** Se corrige la evaluación anterior, basada en permisos legacy de cuenta: la documentación oficial actual distingue roles Workers y scopes individuales para API tokens, incluido su uso con Wrangler.

### Creación administrativa controlada y tokens de CI

Secuencia aprobada original para los dos entornos, con cumplimiento parcial: el propietario ya creó staging y configuró su Editor/Environment; su publicación y lectura negativa están verificadas. Producción, rollback y aislamiento de escritura siguen pendientes y no se ejecutan por esta documentación. Los pasos no instruyen a repetir lo ya completado:

1. Crear `miminiapp-staging` y `miminiapp` mediante administración controlada con rol Admin de Workers a nivel de producto. Los scopes individuales solo pueden asignarse a Workers existentes. Registrar sus IDs e identidad de cuenta. Crear recursos no habilita publicar una release: mantener la publicación pública deshabilitada durante bootstrap hasta disponer de controles, permisos probados y autorización del primer circuito.
2. Crear un **account-owned API token** con rol **Editor** limitado exclusivamente al Worker/ID `miminiapp-staging`, y otro token account-owned con rol Editor exclusivamente para `miminiapp`. No conceder Editor a nivel de producto ni roles de plataforma/cuenta general a los tokens de CI.
3. Guardar cada token únicamente en su GitHub Environment. La credencial administrativa de bootstrap queda fuera de Environments, jobs ordinarios y código de aplicación; no se reutiliza en CI. Si se usa una credencial administrativa temporal, retirarla/revocarla al terminar su propósito.
4. Wrangler utilizará `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` explícitos. **No usar `wrangler login` OAuth**, que la documentación identifica como incompatible actualmente con autorización granular.
5. Antes de habilitar publicación, demostrar que cada Editor despliega/versiona y permite el rollback de su Worker existente, sin capacidad de crear/borrar Workers. Ejecutar una prueba negativa de permisos para acreditar que el token staging no puede modificar producción; registrar denegación del endpoint pertinente, política del token y que versión/identidad/assets de producción no cambian. Comprobar también separación de secretos GitHub; un token activo o un GET permitido no sustituyen esta prueba.

Editor puede desplegar, gestionar versiones y hacer rollback de un Worker existente; no puede crearlo ni borrarlo. El proyecto usa workers.dev, sin añadir Routes o Custom Domains, por lo que no se propone permiso de zona. Mantener los nombres y la configuración de destino para prevenir errores, además de la autorización real por Worker.

**Sin fallback automático a permisos amplios:** no utilizar `Workers Scripts: Edit` general ni otro equivalente legacy de cuenta. Ante un fallo con Wrangler 4.158.0 y Editor granular, detener el camino afectado y presentar antes evidencia reproducible de incompatibilidad: versión/operación/endpoint, scope correcto, error saneado y comprobaciones realizadas. Investigar primero ajustes compatibles sin ampliar privilegios. Cualquier alternativa de autorización requiere propuesta y aprobación expresa antes de utilizarla; la inspección estática del código legacy no demuestra incompatibilidad.

La arquitectura completa prevé dos Workers/tokens separados y dos Environments; staging ya funciona y producción sigue pendiente. No hacen falta Pages, R2, KV, D1, Durable Objects, Workers Builds o runner propio. No habilitar integraciones que publiquen al margen de Actions. Las URLs temporales de versiones/previews requieren autorización; este trabajo no crea recursos o tokens.

## Flujo Git y operación semanal

**Rama de trabajo → PR a staging → checks obligatorios → revisión y merge manual del propietario → despliegue automático a staging → pruebas y validación de staging → PR a main → revisión y merge manual del propietario → despliegue automático a producción.**

El tramo hasta staging y sus pruebas remotas está operativo y Verificado. El tramo de promoción/main/producción sigue siendo alcance aprobado pendiente, con sus publicadores bloqueados; este documento no lo activa.

| Fase | Acción humana | Automatización prevista |
| --- | --- | --- |
| Desarrollo en `feature/*` | Desarrollar y revisar cambios; ejecutar pruebas locales; abrir PR a `staging`. | CI del PR, sin publicación ni credenciales Cloudflare. |
| PR a `staging` | Revisar personalmente el contenido y fusionar manualmente cuando los checks permitan. | PR obligatorio, cero reviews requeridas y checks sobre el SHA actual y su combinación con la base. Nuevos cambios obligan a comprobar de nuevo ese contenido. |
| Merge a `staging` | No hay comando de despliegue manual. | Validar commit integrado, construir artefacto, publicar staging, comprobar identidad y ejecutar suite remota. |
| Revisión de staging | Abrir su URL y validar el candidato. Abrir/revisar el PR `staging` → `main`; el merge manual del propietario será la decisión de promoción. | Gate comprueba origen del PR, candidato exacto y pruebas remotas. No se exige evento Approve ni otra cuenta. |
| PR a `main` | Revisar el candidato validado y decidir su merge manual. | Cero reviews requeridas; bloqueo si cambia el contenido, falla un check o no coincide con staging validado. |
| Merge a `main` | No hay comando ni segundo clic ordinario de deploy. | Revalidar promoción, publicar el mismo artefacto y ejecutar smoke de producción. |

Auto-merge desactivado. El propietario revisa cada PR y decide su merge manual: esa acción es el control humano, sin aprobación independiente. Los workflows no aprueban ni fusionan PR. Tras el merge válido, staging o producción se despliegan automáticamente, sin otra aprobación del deployment ni revisores obligatorios de Environments. Incidentes o credenciales caducadas podrán requerir intervención excepcional.

**Evidencia del control humano individual:** comprobar PR fusionado, origen/base, commit/árbol, checks vigentes y `merged_by` atribuido a la cuenta del propietario, que se fijará en la configuración. GitHub no permite aprobar el propio PR; no se exigirá ese evento. El registro de merge identifica la cuenta que actuó, no demuestra por sí solo que se leyera el código ni que hubiera una revisión independiente. Se documentará la revisión de staging en el PR con su URL e identidad de candidato; el merge manual del propietario confirma la decisión de promover ese contenido.

### Activar revisiones de colaboradores en el futuro

Sin rediseñar los workflows: cuando exista un colaborador autorizado, cambiar la protección de staging/main de cero a una o más aprobaciones requeridas, invalidar reviews ante cambios nuevos y, si se acuerda, exigir revisión del último push y CODEOWNERS para archivos sensibles. Comprobar que hay al menos un revisor elegible distinto del autor; no contar bots como aprobación humana independiente.

Los workflows conservarán PR/checks/identidad/merge como contrato y confiarán en las reglas de rama efectivamente aplicadas: no codificarán una exigencia fija de cero reviews ni de una segunda cuenta. Mantener auto-merge desactivado y despliegues automáticos posteriores al merge; no añadir reviewers de Environments por activar reviews de PR. Antes de activar la nueva política, probar tanto el bloqueo sin review como el merge con review válida, sin alterar el artefacto o publicador.

## GitHub Actions y controles obligatorios

### Workflows previstos

Los cinco archivos están implementados localmente en Fase A. CI incorpora además push de la rama técnica feature/i03* para comprobar el arranque sin publicar. Staging/producción/rollback tienen todos sus jobs desactivados; no se afirma activación remota.

| Workflow | Disparo y trabajo | Permisos/credenciales |
| --- | --- | --- |
| `ci.yml` | PR hacia `staging`/`main`: tipos, lint, formato, unitarias, componentes, build, E2E local/axe e integración modular. | `contents: read`; sin tokens Cloudflare. |
| `staging.yml` | Actualización de `staging` tras merge protegido: comprobar commit, validar/construir, generar manifiesto, publicar y probar URL real. | Build sin secretos; job de deploy referencia solo Environment staging. Permisos GitHub de lectura según la tabla concreta; registro nativo del Environment, sin deployments: write. |
| `promotion.yml` | PR `staging` → `main`: vincular árbol, artefacto, run confiable y pruebas remotas; no contar reviews de otro usuario. Nuevos cambios invalidan el candidato. | Lectura de contenido/Actions/PR/Check Runs según la tabla concreta; check nativo del job, sin permisos de escritura o credencial Cloudflare. |
| `production.yml` | Actualización de `main` tras PR y merge manual del propietario: verificar PR/actor/candidato y publicar el artefacto validado; smoke. | Environment production, credencial solo en job privilegiado. |
| `rollback.yml` | Recuperación manual excepcional del propietario desde una ref protegida, con destino explícito y versión/artefacto anterior validado. | Credencial del destino afectado; sin rollback automático ni publicación arbitraria. Ensayar inicialmente tras autorización. |

### Paquete operativo exacto aprobado, pendiente de verificación en ejecución

Metadatos y fuentes oficiales consultados el 2026-11-05, sin instalaciones ni ejecución del código descargado:

| Herramienta | Versión/valor aprobado | Verificación realizada y alcance |
| --- | --- | --- |
| Wrangler | **4.158.0** | Registro npm oficial y SRI contrastados; instalado desde lockfile, versión CLI y parseo de ambas configuraciones comprobados en Fase A. Deploy/Editor/rollback reales pendientes de autorización y recursos. |
| Node / npm | **24.22.2 / 11.19.1** | Conservar el runtime aprobado; comprobar ambas versiones al iniciar cada job. |
| Runner | **ubuntu-24.04**, GitHub-hosted estándar | Imagen gestionada por GitHub, no inmutable; registrar ImageVersion y versión del runner. Las acciones elegidas usan Node 24 y requieren runner >=2.327.1. |
| Compatibilidad Workers | **2026-11-04** | Fecha explícita coherente con el workerd incluido en Wrangler. Validar esquema/compatibilidad durante ejecución autorizada. |
| Playwright / Chromium | **1.64.1 / 156.0.8078.4, r1248** | Conservar versiones aceptadas y usar el mismo path de navegador al instalar y ejecutar. |

| Acción oficial | Release consultada | Referencia exacta que se usará en `uses` |
| --- | --- | --- |
| `actions/checkout` | v7.0.1 | `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1` |
| `actions/setup-node` | v7.1.0 | `actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1` |
| `actions/upload-artifact` | v7.0.2 | `actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9` |
| `actions/download-artifact` | v8.0.2 | `actions/download-artifact@9000827ccba6bdab643e8b6fd33ac0654aef8333` |

Se verificaron tags completos, `action.yml`, runtime Node 24 y fuentes al SHA. Los tags son referencias informativas; CI utilizará únicamente los SHA completos. No se necesitan `github-script`, `actions/cache` ni una acción adicional de Cloudflare: publicación mediante el binario local de Wrangler exacto. El propietario aprueba estos valores y exige contrastar SHA/versión durante ejecución. Cambiarlos requiere revisión del paquete conforme a su alcance, sin seguir automáticamente un tag móvil.

En Fase A se añadió `wrangler: 4.158.0` como devDependency exacta y se actualizó el único `package-lock.json`. npm ci reproducible satisfactorio; scripts de instalación esbuild@0.28.2 y workerd@1.20261104.1 autorizados por versión exacta como parte mecánica del paquete aprobado. Su peer `@cloudflare/workers-types` es opcional y no se incorpora a la aplicación por defecto. Usar `npm ci` y el binario local `./node_modules/.bin/wrangler`, sin instalación dinámica de latest en el publicador. Dependencias/build se preparan sin inyectar credenciales Cloudflare; el token se entrega solo al paso Wrangler del job autorizado.

Checkout con `persist-credentials: false`; setup-node con `package-manager-cache: false` en jobs privilegiados. Descargar artefactos por `artifact-ids` y `run-id` de una ejecución confiable y exigir `digest-mismatch: error`, además de verificar el hash propio del paquete/manifiesto. No usar un nombre o input libre para elegir el artefacto.

Se empleará un runner GitHub-hosted Linux estándar, acciones fijadas por SHA completo y herramientas con versiones exactas. Node **24.22.2**, npm **11.19.1**, lockfile actual; Playwright **1.64.1** y Chromium **156.0.8078.4 / revisión 1248**. Instalación y ejecución compartirán `PLAYWRIGHT_BROWSERS_PATH`. El navegador del sistema no sustituye al fijado.

### Pruebas locales y remotas

* **Local/CI:** `npm ci`, `npm run verify` y escaneo de límites/ausencia de fixtures en el entregable. La suite existente conserva 59 unitarias, 9 componentes, 26 E2E/axe e integración aislada mientras no cambie el producto; sus cifras no se convierten en un límite a pruebas futuras.
* **Staging:** suite remota reutilizable, con URL aprobada y sin iniciar el `webServer` local. Verificar ES/EN, selector, navegación, responsive, teclado/axe, recursos, errores de consola/red, 301 de raíz según lo aprobado, barras y 404 reales. Comprobar ausencia de herramientas sintéticas y borradores.
* **Producción:** identidad de versión y smoke de ES/EN, navegación esencial, recursos, raíz/404 y ausencia de fixtures; conservar resultado y bloquear nuevas promociones ante fallo.
* Los comandos remotos aún no existen. Se crearán en ejecución autorizada, manteniendo la suite local y una allowlist derivada del destino. No se relajarán errores para obtener verde.

### Protecciones, confianza y secretos

`staging` y `main` exigirán PR y checks obligatorios vigentes, con **cero aprobaciones requeridas**: no exigir CODEOWNERS ni aprobación del último push que dependan de un segundo usuario. El propietario revisará y fusionará manualmente. `main` solo admitirá promoción desde staging mediante gate comprobable. Desactivar auto-merge; bloquear pushes directos, force pushes y borrados y aplicar las protecciones al administrador cuando GitHub lo permita, verificando su comportamiento real antes de activar publicación. Si alguna restricción no puede aplicarse, registrar el bloqueo; no declarar que está protegida. Los checks requeridos propuestos son `quality` en staging y `quality` + `promotion` en main, asociados a GitHub Actions. Antes de activar la protección, verificar que esos nombres se emiten realmente y no dependen de filtros o skips que los omitan. `promotion` se ejecutará en todo PR a main y fallará si origen/repositorio no son staging del mismo repositorio; no se saltará el job para una rama no admitida. Actions no dispondrá de permisos para aprobar/fusionar PR ni se usará un token de escritura para hacerlo.

Los Environments restringirán las ramas exactas staging/main y acceso a secretos, **sin revisores obligatorios, esperas ni otra aprobación manual del deployment**. Su función es delimitar destino y credencial; no suplir una revisión independiente inexistente.

Cambios en `.github/workflows/`, configuración de despliegue y política de promoción requerirán revisión humana específica. Los PR no recibirán secretos Cloudflare; no se ejecutará contenido de PR con `pull_request_target` privilegiado. Builds y pruebas se separarán de jobs con credenciales. No se consumirá un artefacto de PR o caché no confiables en el publicador de producción.

Tokens Cloudflare account-owned distintos, con rol Editor y scope de su Worker individual, conforme al modelo aprobado. No usar Global API Key, OAuth Wrangler ni permisos legacy generales de cuenta. No añadir DNS/Routes/datos. `CLOUDFLARE_API_TOKEN` será secreto de cada Environment; Account ID y Worker/ID son valores explícitos de destino. No imprimir, versionar o exponer tokens; responsable, revocación y rotación definidos.

### Permisos mínimos, secretos y protecciones con condiciones aprobadas

`permissions` por defecto: `contents: read`; todo permiso no solicitado queda en none. Cada job declarará todos los permisos de lectura que realmente utilice, sin heredar implícitamente una mezcla de otros jobs.

| Job/función | `GITHUB_TOKEN` propuesto | Credencial Cloudflare |
| --- | --- | --- |
| `quality`, build, tests locales/remotos | `contents: read` | Ninguna. Las pruebas públicas no necesitan token de deploy. |
| `promotion`, gate previo y comprobación final del publicador | `contents: read`, `actions: read`, `pull-requests: read`, `checks: read` | Ninguna durante el gate previo. En el publicador, solo el paso Wrangler tras superar las comprobaciones. |
| Upload/download de artefactos | Upload del run propio no requiere `actions: write`; download cross-run usa `actions: read` | Ninguna. |
| Deploy/rollback | Mismo conjunto de lectura si revalidan PR/checks/artefacto; sin escrituras GitHub | Solo el secreto del Environment correspondiente y en el paso de publicación autorizado. |

No se solicitan `contents: write`, `pull-requests: write`, `checks: write`, `statuses: write`, `id-token: write` ni `deployments: write`: se emplean checks nativos de jobs, lecturas de Check Runs y registro del Environment, sin API propia de publicación de checks/deployments ni OIDC. `statuses: read` tampoco se solicita porque se verifican Check Runs de Actions, no estados legacy. Cualquier necesidad nueva se justifica antes de ampliar permisos.

| Configuración | `staging` | `main` |
| --- | --- | --- |
| PR requerido | Sí, reviews requeridas = **0** | Sí, reviews requeridas = **0** |
| Checks obligatorios | `quality` | `quality`, `promotion` |
| Exigir rama actualizada nativamente (`strict`) | **true** | **true inicialmente**. Sustitución solo tras demostrar el gate y obtener aprobación expresa del propietario; si no se acredita o aprueba, conservar true. |
| Aplicar también al administrador | **true** (`enforce_admins` o equivalente sin bypass); verificar efectivamente | Igual |
| Push directo / force push / borrado | Bloqueados; `allow_force_pushes = false`, `allow_deletions = false` | Igual |
| Reviews de CODEOWNERS / último push | No requeridas en modo individual | Igual |
| Environment | Solo rama exacta staging; reviewers vacíos, espera 0 | Solo rama exacta main; reviewers vacíos, espera 0 |

Repositorio: `allow_auto_merge = false`, `allow_merge_commit = true`, `allow_squash_merge = false`, `allow_rebase_merge = false`. No exigir historial lineal al utilizar merge commits. Esto conserva los commits aceptados y evita políticas incompatibles. No se presupone que restricciones de push exclusivas de repositorios de organización estén disponibles para una cuenta personal; el rechazo de push directo debe acreditarse mediante PR obligatorio y reglas efectivas, incluyendo al administrador.

**Condición previa a sustituir la protección de main:** mantener la exigencia nativa de rama actualizada (`strict = true`) mientras no exista evidencia verificable de que el gate bloquea candidatos obsoletos, cambios concurrentes de base/staging, artefactos distintos/manipulados y reruns antiguos. No desactivar esa protección para poder probar el propio gate. Los checks quality/promotion y la equivalencia exacta con el candidato validado son obligatorios en ambos escenarios.

La propuesta de sustituir strict nativo por el gate propio solo podrá aplicarse después de acreditar, en ensayos autorizados sin exponer producción: candidato A validado seguido de B obsoleto para la promoción anterior; main/base o staging cambiados antes y durante la publicación; dos publicaciones concurrentes; hash/run/artefacto no coincidentes; y un rerun antiguo. Añadir dos ciclos válidos consecutivos. Registrar entradas, árbol/base/candidato, resultado y ausencia de cambio en producción para cada rechazo. La comprobación final del publicador repetirá identidad/base/artefacto bajo bloqueo compartido, sin reconstrucción silenciosa.

Solo tras superar y registrar esas pruebas y obtener aprobación expresa del propietario para sustituir el control se podrá cambiar a strict=false en main; no es un cambio automático ni queda autorizado solo por aprobar el plan. Si alguna prueba no acredita seguridad/equivalencia o no puede ejecutarse, mantener strict=true y documentar el bloqueo de sustitución. Mientras rija strict nativo, resolver divergencias main/staging mediante PR revisado cuando sea necesario; no force push ni bypass. El posible coste de esa sincronización no justifica rebajar protección.

El grupo compartido de concurrencia propuesto es `miminiapp-publicacion` en los jobs que publican staging, producción o rollback, con `cancel-in-progress: false`; gates/builds sin credenciales quedan fuera. Revalidar después de adquirirlo y antes de publicar. GitHub no garantiza FIFO y puede sustituir ejecuciones pendientes: registrar cancelaciones y candidatos obsoletos, sin prometer que se publicará todo lo encolado ni que cancelar equivale a rollback.

Secretos: dos valores distintos llamados `CLOUDFLARE_API_TOKEN`, uno en cada Environment; variable `CLOUDFLARE_ACCOUNT_ID` de la cuenta común, Workers fijados por destino y cuenta del merger `aalexlpez`, que deberá confirmarse con la identidad efectiva al configurar. No crear secretos de repositorio accesibles indiscriminadamente a PR, ni usar un PAT con permisos de merge para automatizar decisiones del propietario. La separación de secretos GitHub complementa el scope Editor individual y no lo sustituye; comprobar ambos controles.

Retención propuesta concretada: reportes/trazas de fallos **7 días**, candidato y artefacto de release **30 días**, caché npm solo de datos descargados en jobs sin secretos y con clave de SO/Node/lockfile; sin cachear `dist`, credenciales o código de publicación entre contextos no confiables. Antes de caducar la última release válida, conservar su versión de Cloudflare y renovar el respaldo del mismo artefacto mediante una operación confiable sin reconstruir/publicar código nuevo. Un candidato expirado requiere nueva validación, no sustitución silenciosa. Objetivo de gasto **0 USD/mes** en planes Free; no activar productos, runners mayores o excedentes pagados sin autorización. Configurar alertas y bloqueo de consumo si el proveedor/plan lo permite y comprobar sus límites reales.

## Candidato validado y prevención de publicaciones accidentales

El build confiable de staging producirá un manifiesto público inocuo con commit/árbol de origen y huella del payload, y un registro de release con hash del artefacto, run de Actions y deployment/version ID de Cloudflare. La huella excluirá el propio campo autorreferente; el registro externo conservará el hash final del archivo empaquetado.

Producción reutilizará el **mismo artefacto estático** que se probó en staging. Las cuentas, nombres y URLs serán configuración de publicación, no variables que reconstruyan el frontend. Si se necesita contenido distinto por entorno, será un cambio que requiere definir de nuevo cómo demostrar equivalencia.

Un job de gate sin Environment ni secretos comprobará el candidato antes de habilitar mediante `needs` el job privilegiado: GitHub entrega los secretos del Environment al iniciar ese job, no después de un paso interno. El job privilegiado repetirá la comprobación antes de desplegar. El gate del PR y esos controles comprobarán: rama origen, árbol exacto promovido, run de build confiable correcto, artefacto por ID/hash y pruebas remotas correctas. Antes de publicar tras el merge se comprobará además que hubo PR válido fusionado manualmente por la cuenta del propietario, sin exigir reviews nativas. En repeticiones de workflows también se comprobará `triggering_actor`, no solo el actor original: un rerun no puede republicar un candidato obsoleto. Restaurar una versión anterior requiere el rollback manual dedicado. El check previo del PR no debe esperar a su propio merge ni a una aprobación de otro usuario. Un SHA nuevo de merge no prueba equivalencia por sí solo. Si el candidato servido y validado en staging cambió, el artefacto caducó, desapareció o no coincide, se detiene la promoción; no se reconstruye o sustituye silenciosamente.

Concurrencia por destino y un bloqueo compartido de publicación para staging/producción: cancelar validaciones obsoletas cuando sea seguro y serializar publicaciones. La promoción adquiere ese bloqueo antes de su verificación final y lo mantiene hasta terminar deploy/smoke, de modo que staging no publique otro candidato durante ese intervalo. Nuevos merges pueden quedar en cola, pero no modifican el artefacto congelado y aprobado. Antes de publicar, comprobar otra vez que el candidato servido validado sigue vigente. No asumir que cancelar un job revierte una publicación iniciada. No se habilitarán despliegues ordinarios desde `feature/*`, tags, PR externos, un input libre de `workflow_dispatch` o una integración paralela del proveedor. La única excepción prevista es el rollback manual restringido descrito aquí: no permite publicar código nuevo.

**Alcance de la garantía:** los tests demostrarán que los eventos, ramas y jobs del circuito ordinario no pueden saltarse el PR, los checks y el merge manual del propietario. No existe aprobación independiente. Se comprobará la denegación real de acceso de modificación a producción mediante el token Editor de staging; los controles de GitHub no sustituyen esa autorización por recurso. Un propietario con capacidad de editar protecciones, sustituir secretos o desplegar desde Cloudflare puede alterar esos controles; no se promete una imposibilidad absoluta frente al administrador. El acceso administrativo queda reservado al mantenimiento inicial y a emergencias auditadas.

## Estado del repositorio y sincronización segura

**Estado actual, 2026-11-07:** staging en e1e3b659, main en73b8bd2 y master en214a3c1, predeterminada. Los cierres I-01/I-02 y el historial están preservados. La tabla y el procedimiento siguientes documentan el punto de partida y la sincronización original; no indican que falten ahora esas ramas ni autorizan repetir el bootstrap.

Comprobado por HTTPS en lectura el **2026-11-05, 19:58 CET (refs reconfirmadas; grafo inspeccionado a las 16:49 CET)**. Repositorio: `aalexlpez/miminiapp`, observado como **público**. No se han comprobado su plan contratado, colaboradores, rulesets, GitHub Environments o integraciones del dashboard Cloudflare.

| Referencia | Ubicación observada |
| --- | --- |
| Checkpoint I-01 `0cf778f988068e9ac7f7c7a519e1ec36486cc8aa` | Local y GitHub: `feature/i01-base-local-testing`; también ancestro de `master`. |
| Cierre aceptado I-01 `0288de567fe7e1665973c6d8e128866962f66e2e` | Local; ninguna rama remota anunciada lo contiene. |
| Cierre aceptado I-02 `567b394583140d1710034f4798d0cf8dbb29e387` | HEAD local, `feature/i02-catalogo-responsive-e-i18n`; ninguna rama remota anunciada lo contiene. |
| `master` remoto / HEAD remoto | `214a3c16ad5e968214af540033246baa9dd32ba1`, merge del PR #1 de I-01. |
| `main`, `staging`, rama de I-02 remotas | No anunciadas en la lectura de refs. |

Hay ancestro común `0cf778f`. Frente a `master`, la rama local tiene **dos commits exclusivos** y el remoto **uno**, el merge PR #1. El árbol de ese merge remoto es idéntico al del checkpoint: no hay un cambio de contenido remoto adicional. No se trata de historias sin relación ni procede un push forzado.

La comprobación usó `git ls-remote --symref origin` y un fetch en un bare aislado ignorado, sin actualizar refs del checkout. Evidencias: `.local/verification/i03/repo-ls-remote.json` y `repo-graph.json`. La lectura refleja ese momento; se repetirá antes de sincronizar.

**Procedimiento conservador aprobado; ejecución limitada de Fase A:**

1. Preservar el commit local y los cambios sin commit del borrador; inventariar refs y automatizaciones existentes y refrescar la lectura remota. No hacer reset, rebase destructivo, force push o borrado de `master`.
2. Aplicar la excepción de bootstrap aprobada el 2026-11-06: crear `main` y `staging` exactamente desde73b8bd2, que conserva master y cierres aceptados como ancestros. Mantener publicación desactivada hasta que protecciones, identidad y credenciales estén listas; decidir después el cambio de rama predeterminada a `main`.
3. En un worktree limpio, preparar una rama de integración que conserve el merge remoto y los dos commits aceptados, mediante merge normal si hace falta. Revisar el árbol resultante frente al I-02 aceptado y ejecutar solo las verificaciones afectadas. Los cambios I-03 no se incorporarán sin su aprobación/autorización propias.
4. Solo con permiso de push, publicar la rama de trabajo y tramitar PR a staging, checks y revisión humana. No subir directamente a `staging` o `main`. El primer bootstrap deberá acordar cómo introducir CI y activar checks existentes, sin un periodo de publicación sin controles.
5. Primer despliegue de staging autorizado, pruebas remotas y revisión; después PR protegido a main y primera publicación de producción autorizada. Los despliegues semanales seguirán el circuito normal automático.

Reinventario y fetch de origin/master efectuados en Fase A. Rama técnica local creada; integración conservadora y commit técnico se registran en el informe. El bootstrap desde73b8bd2 ya está aprobado y la API es accesible. Staging y main ya se crearon exactamente en 73b8bd2, bajo las reglas manuales, sin bypass ni desactivación de controles. La escritura administrativa sigue denegada para ajustes pendientes.

## Costes y límites consultados

Fuentes oficiales consultadas el **2026-11-05**. Se propone comenzar con planes gratuitos, runners estándar y sin dominio propio; confirmar límites vigentes y facturación de las cuentas antes de activar.

| Servicio | Posibilidad gratuita y límites relevantes |
| --- | --- |
| Cloudflare Workers Static Assets | Peticiones a assets estáticos gratuitas e ilimitadas, sin cargo adicional por almacenarlos. Plan Free: **20 000 archivos por versión**, **25 MiB por archivo**, **100 Workers por cuenta**. Dos Workers caben holgadamente. No supone SLA ni capacidad ilimitada en todo servicio. |
| Worker dinámico, si se añadiera | Fuera de alcance. Free: **100 000 peticiones/día** y **10 ms CPU/invocación**; el servicio de assets no tiene ese límite de peticiones. Workers Paid parte de **5 USD/mes por cuenta** más excedentes. No se activa. |
| Dominio / TLS | `workers.dev` y HTTPS no requieren comprar dominio. Un dominio propio cuesta su registro/renovación; opcional y no presupuestado. |
| GitHub Actions en este repositorio público | Compute de runners GitHub-hosted **estándar gratuito**. No usar larger runners, que pueden cobrarse incluso en público. GitHub Free incluye **500 MB de artefactos compartidos con Packages** y **10 GB de caché por repositorio**. Confirmar consumo total de la cuenta. |
| Si el repositorio pasara a privado | GitHub Free ofrece actualmente **12 USD/mes de compute incluido** —aproximadamente 2000 minutos Linux 2-core a 0,006 USD/min si solo se usa eso— y 500 MB de artefactos. La cuota se comparte con otros consumos elegibles; no es una bolsa universal fija de minutos. Las protecciones de ramas/Environments privadas exigirían un plan compatible de pago. |
| Protecciones GitHub | En el repositorio público, ramas protegidas y Environments están disponibles en Free. En privado se requiere Pro/Team o superior; revisores obligatorios de Environments privados no se presuponen incluidos en Pro/Team. El control individual acordado es revisión y merge manual del propietario con PR y checks obligatorios, cero reviews requeridas y ningún reviewer de deployment. |

**Coste base previsto: 0 USD/mes**, manteniendo el repositorio público, Workers Free, runners estándar y consumos dentro de cuotas de almacenamiento. No se aprueba cambiar la visibilidad para ahorrar costes. No hay garantía de gratuidad si se contratan extras o excede almacenamiento.

Propuesta de retención: reports/trazas solo cuando sean útiles, fallos 7 días; artefacto del candidato y última release válida hasta 30 días, dentro del presupuesto. Conservar versión válida del proveedor y gestionar renovación del artefacto antes de que expire. Si un candidato expira, no se promueve. Configurar alertas/límites de gasto y comprobar si el bloqueo de excedentes es efectivo; una alerta por sí sola no evita cargos. No se instala un runner propio para evitar cuotas.

## Intervención inicial del propietario y automatización posterior

| Intervención inicial requerida | Después de la configuración aprobada |
| --- | --- |
| Confirmar el plan definitivo; las decisiones técnicas indicadas ya están aprobadas. Autorizar después ejecución/activación y primeros despliegues. | Nuevas herramientas usan la infraestructura aprobada sin autorizar un sistema de despliegue cada semana. |
| Acceso administrativo controlado y 2FA: crear primero ambos Workers y luego los account-owned tokens Editor individuales, solo tras autorización y por canales seguros. | Tokens se usan automáticamente en sus jobs; intervención excepcional para rotación o incidentes. |
| Fijar la cuenta personal del propietario como responsable del merge manual y configurar cero reviews requeridas, auto-merge desactivado y Environments sin reviewers. Modelo ya decidido. | El propietario revisa y fusiona cada PR y valida staging; no necesita otro usuario. Futuras reviews de colaboradores se activan en protecciones sin rediseñar los workflows. |
| Aplicar tras autorización la sincronización conservadora aprobada, protecciones/checks/Environments; no sustituir strict de main sin prueba previa. | CI, build, despliegue de staging, suite remota, comprobación de candidato y deploy/smoke de producción son automáticos. |
| Nombres/subdominio, retención 7/30, objetivo cero y rollback manual ya aprobados. Proporcionar Account ID y autorizar por separado bootstrap, pruebas de permisos y ensayo de recuperación. | No hay que copiar archivos, ejecutar Wrangler o entrar en Cloudflare para cada release. |

Si el propietario prefiere delegar los ajustes iniciales, necesitará autorizar expresamente el acceso y las modificaciones correspondientes; esta revisión no lo hace. No se deben enviar tokens por el chat. Cuando se ejecute desde Codex, podrán requerirse permisos de red para GitHub API, Cloudflare API y URLs `workers.dev`; los runners de Actions tienen su propia red. No se modifica la red actual en esta tarea.

## Seguridad, errores y recuperación

* **Fallo de CI o revisión:** no merge/publicación. Artefactos y logs suficientes para diagnosticar, sin secretos; mantener [PEND-007](../tech-debt-tracker.md#pend-007--seguimiento-de-incidencias-moderadas-de-lint).
* **Fallo o timeout de deploy:** registrar versión anterior y respuesta del proveedor; consultar la versión realmente activa, porque un timeout no demuestra que no haya publicado. Bloquear promoción y comprobar staging/producción independientemente.
* **Fallo de pruebas remotas en staging:** no se habilita el PR de promoción; se corrige y se vuelve a validar otro candidato.
* **Fallo de smoke de producción:** release fallida; detener promociones y registrar el incidente. El propietario decide y ejecuta el rollback manual al último artefacto/versión validado mediante el procedimiento restringido. No hay recuperación automática ni un deployment de reemplazo sin su acción. Es una excepción de incidente, no un despliegue semanal manual.
* **Mecanismo de recuperación:** verificar soporte efectivo de `wrangler rollback`/versiones para este proyecto con assets; Cloudflare documenta las **100 versiones publicadas más recientes**. Comprobar también el contenido estático recuperado. Como respaldo, conservar y redeplegar el artefacto íntegro anterior verificado, sin reconstruir fuentes diferentes. Ensayar inicialmente el rollback manual en staging y una comprobación controlada de producción, con autorización de esos ensayos; registrar actor, destino, versión anterior y posterior y smoke de recuperación. No se habilita un rollback automático latente.
* **Credencial expuesta:** revocar/rotar, detener el job afectado y verificar despliegues reales. No recuperar publicando con una credencial más amplia.

La recuperación no altera una BD porque I-03 no incorpora datos persistentes. Un rollback no recupera automáticamente recursos externos borrados; esa limitación del proveedor se conserva. El acceso de emergencia queda auditado y no forma parte de la rutina semanal.

## Criterios de aceptación aprobados y pruebas reproducibles

| ID | Evidencia exigida antes de declarar I-03 Verificado |
| --- | --- |
| I03-AC1 | Decisiones/autorización registradas; inventario de ramas, cuentas, destinos, URLs y capacidades efectivas. Sin confundir infraestructura propuesta con existente. |
| I03-AC2 | CI desde checkout limpio pasa tipos, lint, formato, unitarias, componentes, E2E local/axe e integración con el paquete operativo exacto documentado (Wrangler/acciones/runtime/navegador); registrar versiones de runner/imagen y lockfile. Un PR con fallo queda bloqueado y no publica. |
| I03-AC3 | PR obligatorios con cero reviews requeridas y checks vigentes: rechazar push directo, force push, borrado y merge con checks fallidos/no vigentes, también para el administrador cuando la capacidad exista. Probar que el propietario puede fusionar manualmente su propio PR válido, sin segunda cuenta; auto-merge desactivado y Environments sin reviewers de deployment. Registrar cualquier restricción no soportada como bloqueo real. |
| I03-AC4 | Crear primero ambos Workers con administración controlada sin credencial Admin en CI; después account-owned tokens Editor limitados a cada Worker. Cada token funciona para su destino existente; una operación de modificación con el token staging contra producción recibe denegación y no cambia versión/identidad/assets. PR sin confianza no accede a secretos y staging no obtiene el secreto production. Sin OAuth ni permisos generales de cuenta; cualquier incompatibilidad requiere evidencia y propuesta previa antes de cambiar autorización. |
| I03-AC5 | Publicar un candidato marcado en staging cambia su identidad servida y deja intactos manifiesto/versión de producción; URLs, Workers y credenciales corresponden a destinos distintos. |
| I03-AC6 | Tras merge humano a staging, Actions publica automáticamente el artefacto identificado y su identidad HTTP coincide con hash/run/version ID registrados; sin comandos manuales de publicación. |
| I03-AC7 | La suite contra staging real pasa ES/EN, idioma, navegación, responsive, teclado/axe, recursos, raíz/barra/404 y ausencia de fixtures/borradores. |
| I03-AC8 | Strict nativo de main permanece true hasta demostrar rechazos de candidato obsoleto, cambios concurrentes de staging/base, artefacto/hash/run distinto y rerun antiguo, más dos promociones válidas consecutivas con equivalencia exacta. Registrar evidencia y obtener aprobación expresa del propietario antes de sustituirlo por el gate; sin evidencia y aprobación, no rebajar protección. PR/origen inválido o checks fallidos no se omiten como gate verde. Gate sin secretos y revalidación bajo bloqueo compartido antes de usar credencial. |
| I03-AC9 | PR staging→main con checks correctos, revisado y fusionado manualmente por el propietario, publica automáticamente el mismo artefacto probado. Verificar PR merged, identidad de la cuenta y candidato; sin exigir evento Approve ni afirmar review independiente. Features, tags, PR no fusionados, otros actores y dispatch arbitrario no publican; sin aprobación extra de deployment. |
| I03-AC10 | Smoke real de producción confirma identidad y recorridos críticos; un fallo produce estado de release fallida y la recuperación acordada, nunca una validación verde ficticia. |
| I03-AC11 | Ensayo inicial autorizado de rollback manual del propietario restaura versión y assets anteriores y pasa smoke. Solo admite destino fijo y versión/artefacto previamente validado desde ref protegida; no permite código arbitrario ni rollback automático. Concurrencia evita pisar una release posterior y retención permite recuperar la última release válida. |
| I03-AC12 | Guía y evidencia distinguen configuración inicial, revisión/merge manual individual, despliegues automáticos y rollback manual excepcional. Documentar cómo exigir reviews futuras cambiando protecciones sin rediseñar workflows, costes y límites administrativos/de tokens. El propietario acepta la entrega expresamente. |

Los casos negativos se probarán con candidatos/PR y permisos autorizados, antes de habilitar el publicador de producción o en ramas/destinos de ensayo con controles equivalentes comprobados. No se publicará contenido de prueba en producción ni se abrirá para comprobar un bypass. En producción activa se usarán lecturas y comprobaciones de permisos no destructivas; una simulación local o `push --dry-run` no acredita por sí sola el rechazo del servidor; si una operación no puede verificarse sin impacto, acordar antes el ensayo controlado. No se expondrán fixtures sintéticas en ningún destino público.

## Trabajo previsto, evidencias y punto de parada

Tras autorizar expresamente la ejecución del plan ya Aprobado: registrar Autorizado → En curso, sincronizar conservando master/commits aceptados, preparar configuración revisable y protecciones, crear ambos Workers administrativamente sin publicar una release antes de los controles, emitir Editor individuales, probar permisos y gate manteniendo strict nativo, habilitar el primer circuito autorizado, ensayar rollback manual primero en staging y documentar resultados. La introducción inicial de automatizaciones deberá tener una autorización de activación específica; no se deduce de un borrador.

Conservar comandos/versiones/códigos de salida, configuración efectiva, PR/checks/revisiones, árboles/hashes, artefactos, URLs/versiones y pruebas reales con evidencia segura. Logs locales en `.local/verification/i03/`, reportes ignorados y artefactos Actions con retención aprobada. Los comandos de deploy y pruebas remotas se documentarán como operativos solo cuando existan y se hayan ejecutado.

**Parada actual:** preparar y entregar únicamente el PR documental del hito staging Verificado, sin fusionarlo. No se ejecutan nuevas publicaciones o cambios de infraestructura. Producción, promoción, rollback y aislamiento de escritura siguen pendientes, con los límites administrativos previos. **Parada global:** I-03 solo podrá declararse Verificado tras acreditar todos sus AC; su aceptación humana sigue separada. Las propuestas de producto no autorizan implementar otra iteración.

## Decisiones aprobadas y condiciones todavía por acreditar

El propietario aprueba arquitectura/operación, ADR-MMA-004/014, la concreción de ADR-MMA-009/015, una cuenta y los dos nombres/subdominio confirmados, versiones/SHA fijados a verificar durante ejecución, sincronización conservadora preservando master/I-01/I-02 y creando staging/main antes de cambiar la predeterminada a main, retención 7/30, objetivo de gasto 0 USD/mes y rollback manual probado primero en staging. No se vuelven a pedir esas aprobaciones ni la aceptación de tokens generales, que se retiran del modelo.

La corrección incorporada es vinculante: creación administrativa de ambos recursos antes de emitir account-owned tokens Editor individuales; prueba de que staging no puede modificar producción; no utilizar Workers Scripts: Edit general sin presentar primero evidencia de incompatibilidad y una alternativa para aprobación. Main conserva strict nativo hasta demostrar el gate y nunca lo rebaja si las pruebas no acreditan equivalencia/protección.

**Pendiente actual:** producción, promoción, rollback y su ensayo, aislamiento de escritura y aceptación global. Staging ya fue publicado y verificado por el circuito autorizado; no se pide repetir su bootstrap o provisión. Checks y opciones de merge corroborados, main strict=true conservado, con límites administrativos y ensayos negativos restantes. No se amplían credenciales ni se reducen controles. Este PR solo registra hechos y no autoriza ninguna activación adicional.

**Comprobaciones restantes, no fallos acreditados:** ensayo de escritura cruzada, versionado/rollback, capacidades administrativas y pruebas de promoción/concurrencia/equivalencia antes de cualquier sustitución de strict. El despliegue real con Wrangler/Editor/Static Assets y las pruebas HTTP de staging ya pasaron; no acreditan esos otros ensayos. No se inventan IDs de proveedor ausentes de la evidencia. Cualquier incompatibilidad detiene su camino sin ampliar permisos; cualquier sustitución de strict exige demostración y aprobación expresa.

La cuenta/subdominio y el Worker staging ya se utilizan; el propietario administra su token/Account ID en GitHub Environment y Codex no necesita acceso Cloudflare. Para producción y ensayos restantes harán falta las autorizaciones específicas correspondientes, sin ampliar infraestructura por este PR. Se conserva el objetivo gratuito y el modelo granular aprobado.

## Fuentes y verificaciones de esta revisión

Consultadas el 2026-11-05 en registro npm y repositorios oficiales `cloudflare/cloudflare-docs` (rama production) y `github/docs` (rama main). Los dominios developers.cloudflare.com y docs.github.com devolvieron 403 del proxy del entorno; se leyeron sus fuentes oficiales publicadas en GitHub, sin cambiar red ni omitir TLS. Evidencia temporal en `.local/verification/i03/research/`.

* [CF: Static Assets y facturación](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) y [fuente oficial](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/workers/static-assets/billing-and-limitations.mdx).
* [CF: autorización granular y Wrangler](https://developers.cloudflare.com/workers/authorization/) y [roles/scopes de Workers](https://developers.cloudflare.com/workers/authorization/workers/): Editor individual para tokens account-owned; bootstrap Admin para crear recursos. Fuentes oficiales leídas también en [authorization/index.mdx](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/workers/authorization/index.mdx) y [authorization/workers.mdx](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/workers/authorization/workers.mdx); evidencia `.local/verification/i03/research/authorization/`.
* [CF: límites](https://developers.cloudflare.com/workers/platform/limits/), [HTML](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/), [redirecciones](https://developers.cloudflare.com/workers/static-assets/redirects/), [permisos](https://developers.cloudflare.com/fundamentals/api/reference/permissions/) y [rollback](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/).
* [GitHub: Actions y facturación](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [cuotas en fuente oficial](https://github.com/github/docs/blob/main/data/reusables/billing/actions-included-quotas.md), [ramas protegidas](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) y [Environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments).
* [GitHub: revisión de PR](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/approving-a-pull-request-with-required-reviews). No se han consultado secretos ni configurado protecciones.


Fuentes del paquete exacto: [Wrangler 4.158.0, metadatos oficiales](https://registry.npmjs.org/wrangler/4.158.0), [checkout v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1), [setup-node v7.1.0](https://github.com/actions/setup-node/releases/tag/v7.1.0), [upload-artifact v7.0.2](https://github.com/actions/upload-artifact/releases/tag/v7.0.2) y [download-artifact v8.0.2](https://github.com/actions/download-artifact/releases/tag/v8.0.2). Tags/SHA/action.yml y tarball/schema/SRI verificados en lectura; evidencia ignorada `.local/verification/i03/research/operative/`. No se ejecutó la CLI ni se instalaron dependencias.

## Progreso e historial

Las entradas fechadas siguientes conservan autorizaciones y snapshots de cada momento. Sus restricciones de preparación no describen el staging ya publicado; Control y el último hito de verificación indican el estado vigente.

| Fecha | Estado | Actor | Evidencia o motivo |
| --- | --- | --- | --- |
| 2026-11-05 | Borrador | Codex, por instrucción del propietario | Preparar únicamente I-03 después de aceptar I-02, sin ejecución. |
| 2026-11-05 | Borrador | Codex, por instrucción del propietario | Ampliar arquitectura, operación, costes, seguridad y criterios; comprobar refs/grafo GitHub y consultar documentación oficial en lectura. Sin commits, pushes, merges, despliegues o configuración. |
| 2026-11-05 | Borrador | Propietario / Codex | Decisiones expresas para proyecto individual con una cuenta GitHub: PR/checks obligatorios, cero reviews requeridas, revisión/merge manual del propietario y deploy automático sin reviewers de Environments. Evaluar una cuenta Cloudflare/dos Workers y alcance real de tokens; rollback manual a probar inicialmente y reviews futuras mediante protecciones. Sin aprobación/ejecución de I-03, commits, pushes, merges o despliegues. |
| 2026-11-05 | Borrador | Propietario / Codex | Cuenta Cloudflare Free y acceso Workers & Pages confirmados por propietario, subdominio miminiapp-lab.workers.dev y nombres decididos, sin proyectos/tokens/integraciones. Paquete exacto de CLI/acciones/permisos/protecciones concretado documentalmente con fuentes oficiales; sin implementación, creación de recursos, commits, pushes o despliegues. |
| 2026-11-05 | Borrador | Propietario / Codex | Arquitectura/operación aprobadas con condiciones: Editor account-owned por Worker tras bootstrap administrativo, pruebas de denegación cruzada; main mantiene strict nativo hasta demostrar el gate y no lo rebaja si falta evidencia. Ratificados alojamiento, versiones, sincronización, retención/coste y rollback manual primero en staging. Plan definitivo pendiente de confirmación y sin autorización de ejecución/creación/sincronización/push/merge/deploy. |
| 2026-11-05 | `Aprobado` | Propietario de MiMiniApp | «Apruebo formalmente el ExecPlan I-03 — GitHub Actions y Cloudflare: staging, producción y promoción por PR», incluidos 12 AC; ratifica ADR. Verificación real de GitHub/toolchain/aislamiento durante ejecución futura; detener activación afectada y pedir aprobación antes de alternativa si falla aislamiento. Mantener main strict=true hasta demostrar y aprobar sustitución. Sin autorización de ejecución, recursos, tokens, ramas, commits, pushes, merges o despliegues. |
| 2026-11-06 | `Autorizado` | Propietario de MiMiniApp | Autorización expresa únicamente Fase A: preparación técnica, CI y configuración segura; commits/pushes técnicos y ramas/protecciones permitidos solo sin publicaciones. Main strict=true; sin promociones ni cambio de predeterminada antes de verificar controles. Sin Worker o contenido público, Fase B, I-04 o miniapps reales. |
| 2026-11-06 | `En curso` | Codex | Comienza efectivamente Fase A tras recuperar el entorno y verificar la integridad local: implementación de CI/workflows inactivos, release gate/artefactos y configuración estática/pruebas remotas. Sin publicación, promoción o Fase B. |
| 2026-11-07 | `En curso` | Propietario / Codex | El propietario confirma la primera publicación real y autoriza registrar el hito staging `Verificado`: PR #4, merge e1e3b659, run42305409224 intento4 success, prepare/remote-test success. No es aceptación global de I-03; solo se prepara PR documental, sin fusionarlo o modificar infraestructura. |

## Evidencia incremental de Fase A — 2026-11-06

El [informe](../../i03-phase-a-report.md) registra recuperación del entorno, integridad del historial, archivos implementados, batería local, bloqueos API/bootstrap y límites. La [guía operativa](../../i03-operations.md) conserva el procedimiento revisable. Los 12 AC se mantienen sin rebajarlos: las pruebas locales de gates/artefactos no sustituyen pruebas reales de GitHub/Cloudflare ni habilitan strict=false. Fase A no permite declarar I-03 Verificado.

Preparación local al cierre: verify completo satisfactorio, 185 unitarias finales, 9 componentes, 26 E2E más integración/regresión I-01. Empaquetado/verificación reales pasan con Node24 nativo; ningún despliegue. Commits de preparación `79f31a3`, integración de ascendencia `4690c27`, regresión `b9ecd19` y corrección nativa `a49c705`; posteriores ajustes mecánicos/evidencia se consultan en el historial de la rama técnica. La creación remota de staging/main se mantiene pendiente de API y aprobación del bootstrap, sin modificar los 12 AC.

CI real del código `f4430f0` observado Success en [run 42170329302](https://github.com/aalexlpez/miminiapp/actions/runs/42170329302), 2026-11-06 05:49 UTC, vía HTML público. Rama técnica subida y master intacto/predeterminado. En aquella observación la API estaba bloqueada; ahora es accesible, pero sus escrituras administrativas están denegadas403 para configurar/probar protecciones y Environments; no se confunde el CI técnico con enforcement de PR. Se mantiene parada antes de bootstrap, Fase B o cualquier publicación.

## Excepción de bootstrap aprobada y autorizada — 2026-11-06

El propietario autoriza expresamente crear staging y main desde `73b8bd2c1d3fc0e2f0161af9df9897d16b51ade8`, sustituyendo exclusivamente el origen inicial master de la secuencia anterior. CI satisfactorio f4430f0 padre inmediato; delta solo ExecPlan/informe. Confirmar ascendencia del master remoto y cierres aceptados I-01/I-02, bloqueos de workflows y deploymentsEnabled=false. Aplicar/verificar PR, checks, cero reviews y bloqueo de direct/force push con administrador sujeto; main strict=true. Si no es posible establecer protecciones, detener y comunicar bloqueo antes de avanzar. Master permanece intacto y predeterminado; no merges de promoción, activación, deploys, Workers o Fase B.

La API autenticada confirma aalexlpez, administrador de repositorio público1445849027; master214a3c1 y ausencia inicial de staging/main. El run42170329302 verifica por API success de f4430f0, con quality emitido por GitHub Actions app15368. Comprobaciones locales de ascendencia/diff/publicadores correctas. Evidencia incremental: .local/verification/i03/phase-a/bootstrap/.

### Bloqueo de capacidad administrativa — 2026-11-06

No se crearon staging/main. PATCH de opciones del repositorio y PUT de protección de staging devuelven403 Resource not accessible by integration; el endpoint de protección declara X-Accepted-Github-Permissions: administration=write. La cuenta aalexlpez figura administradora, pero la credencial no dispone del acceso de escritura requerido. Se detuvo el avance antes de crear refs, conforme a la instrucción del propietario. No hay protecciones efectivas que atribuir a ramas inexistentes ni se probó force/direct push como sustituto. Master214a3c1 continúa intacto/predeterminado y rama técnica73b8bd2 intacta.

Intervención: habilitar Administración: escritura para la conexión/credencial únicamente en MiMiniApp, si está soportado, o acordar configuración administrativa por el propietario sin usar bypass. No compartir secretos por chat. Bootstrap desde73b8bd2 ya aprobado; no pedir de nuevo su autorización. I-03 permanece En curso, Fase A bloqueada por capacidad; Fase B, recursos Cloudflare, publicaciones y cambio de predeterminada sin autorizar. Evidencia y alcance detallados en el informe.

### Reanudación con reglas manuales y bootstrap completado — 2026-11-06

El propietario comunica reglas guardadas para main/staging: PR obligatorio, Require approvals desactivado, quality, rama actualizada, sin bypass, force ni borrado; las ramas no existían y autoriza crearlas sin desactivar controles. Se crean staging y main exactamente en `73b8bd2c1d3fc0e2f0161af9df9897d16b51ade8` sin obstáculos. GET branch confirma protected=true y quality obligatorio de GitHub Actions app15368, enforcement_level=everyone. GET de protección completa y GraphQL siguen denegados403: PR/reviews=0/strict/force/borrado son declaración del propietario, no campos corroborados automáticamente. No se modifica ninguna regla. Main debe mantener strict=true.

Master214a3c1 intacto/predeterminado; ambos refs conservan I-01/I-02/master por ascendencia. El propio73b8bd2 tiene quality success (run42171726506), además del CI padre f4430f0. Staging42191340205 y Production42210622899 terminaron skipped: todos sus jobs siguen if:false y deploymentsEnabled=false; lista deployments vacía. Ninguna operación de Cloudflare.

Main aún exige solo quality; el plan sigue requiriendo también promotion. Se realizó el PR técnico #2 en borrador, cerrado sin merge, con delta documental. Promotion/app15368 emitido y failure en el paso del gate; el error literal no se pudo leer por bloqueo del host de logs. No se atribuye ese fallo al origen sin el log ni se afirma enforcement del check aún opcional. La actualización de opciones (squash/rebase) y creación de Environments requieren administration=write: el PUT de staging Environment volvió a denegarse403, sin crearlo. I-03 sigue En curso Fase A; no se declara completa ni Verificado. Evidencia en .local/verification/i03/phase-a/manual-rules/.

### Evidencia del ensayo de check y punto de parada

PR #2 cerrado sin fusionar. Promotion run42211336925/job127870423964, GitHub Actions15368, failure en Check origin and the exact validated staging candidate; pasos previos correctos. Mensaje exacto pendiente: results-receiver.actions.githubusercontent.com devuelve Forbidden al leer logs y la anotación solo ofrece exit1. No se modifica configuración de red para resolverlo automáticamente. Main/staging permanecen73b8bd2, master214a3c1 intacto/predeterminado, workflows de publicación skipped y deployments vacíos.

El propietario debe añadir promotion a los checks obligatorios de main, ajustar squash/rebase y crear los Environments según la guía, sin activar credenciales/deploys. Se conserva strict=true por configuración manual declarada; su lectura detallada y ensayos completos quedan limitados. El bootstrap de ramas está completado; Fase A sigue parcial y Fase B sin autorizar.

## Comprobación final de ajustes manuales — 2026-11-06

El propietario confirma main con quality+promotion y strict=true, staging con quality/strict, solo merge commits, Environments exactos sin reviewers/espera y sin secretos ni activación. Se consulta la configuración real sin modificar reglas o Environments.

Resultados corroborados: allow_merge_commit=true; allow_squash_merge=false, allow_rebase_merge=false y allow_auto_merge=false. GitHub Environments staging/production existen; cada uno tiene solo branch_policy como regla, sin required_reviewers ni wait_timer. Sus políticas contienen exactamente una rama de tipo branch: staging para staging y main para production, sin tags o comodines. Main/staging conservan73b8bd2, master214a3c1 sigue intacto y predeterminado, deployments vacío.

Discrepancia: GET branch main, repetido sin caché y con consulta distinta, muestra únicamente quality/app15368/enforcement everyone. GET rulesets y reglas activas devuelve vacío, sin otra capa que acredite promotion. No se modifica silenciosamente ni se declara que la selección manual ya sea efectiva. Se debe revisar/guardar promotion en la regla que realmente aplica a main y volver a leerla.

Limitaciones: detalle de protección devuelve403, por lo que strict, PR/reviews y force/delete continúan con la declaración del propietario, sin prueba automatizada detallada o negativa real. Los listados de secretos y variables de repositorio/Environments también devuelven403; ausencia declarada por el propietario, no inferida de un listado inaccesible. El error literal del ensayo PR#2 sigue pendiente de lectura de logs.

Guardas: se comprueban los archivos inmutables del commit73b8bd2 y que no hubo cambios de aplicación/infraestructura desde él: policy phaseA/deploymentsEnabled=false y dos jobs con if:false en cada workflow de staging/production/rollback. No se repite la batería de aplicación ya satisfecha. Evidencia segura en .local/verification/i03/phase-a/final-github/.

Estado de Fase A: preparación técnica y la mayor parte de la configuración GitHub acreditadas; no se declara cerrada mientras promotion obligatorio no quede acreditado. I-03 conserva En curso. Antes de solicitar B se debe resolver esa discrepancia y revisar evidencia/límites; después preparar una autorización delimitada para bootstrap administrativo de los dos Workers, Account ID y tokens Editor individuales. El aislamiento y compatibilidad reales se comprobarán dentro de B expresamente autorizada, antes de activar publicadores ordinarios, no como condición imposible de demostrar durante A. El ensayo de rollback requerirá además acordar y autorizar la secuencia de rama predeterminada, pues master aún no contiene workflow_dispatch. No cambiarla en A.

## Cierre de preparación de Fase A — 2026-11-06

La API confirma ahora main protegido con quality y promotion, staging protegido con quality; todos los checks vinculados a GitHub Actions app15368 y enforcement_level=everyone. La discrepancia anterior queda resuelta. Ramas en73b8bd2; master214a3c1 intacto/predeterminado. Solo merge commits, sin squash/rebase/auto-merge. Environments staging→staging y production→main, exactamente una política tipo branch por entorno, sin reviewers ni espera. Deployments vacío; no se cambian controles.

El propietario revisa personalmente el log del PR#2 y confirma el mensaje literal «Promotion is not the current same-repository staging to main pull request.». Se registra como evidencia humana de rechazo del origen no autorizado, junto al CheckRun failure/app15368 ya leído. No se atribuye la lectura del log al agente ni se usa como sustituto de pruebas de obsoletos, concurrencia, bytes, reruns, permisos o recuperación. El PR sigue cerrado sin merge.

Comprobaciones disponibles de Fase A satisfactorias y preparación completada con limitaciones documentadas: GET de protección detallada sigue403, strict=true y PR/reviews/force/delete continúan con confirmación del propietario; no hay ensayos mutantes de direct/force/delete/merge. Listados de secretos/variables denegados en la auditoría anterior; su ausencia es declaración del propietario. Guardas versionadas sin cambios: policyA/deploymentsEnabled=false y todos los jobs publicadores con if:false. Aplicación/infraestructura idénticas al commit verificado; no se repite la batería ya pasada.

Estado global I-03: En curso, sin marcar Verificado ni Aceptado. Evidencia segura en .local/verification/i03/phase-a/closure/, incluida summary.json y owner-negative-review.json. El hito A no autoriza Fase B. Se mantiene master predeterminada y no se crea ningún Worker, secreto o token.

Pendiente Cloudflare: Account ID y capacidad administrativa por canal adecuado; acceso a api.cloudflare.com si se opera desde Codex; autorización expresa del bootstrap de miminiapp-staging/miminiapp y de cualquier primer contenido público inevitable; después tokens account-owned Editor por Worker y pruebas reales de compatibilidad/denegación cruzada antes de activar publicadores ordinarios. Captura de version/deployment ID, estado tras timeout, pruebas remotas/equivalencia y rollback se completarán/comprobarán dentro del alcance B autorizado. El uso futuro de workflow_dispatch para rollback exige acordar y autorizar la secuencia de predeterminada; no se cambia en A.

## Autorización limitada de B1 — bootstrap inicial de staging, 2026-11-06

El propietario confirma completada la preparación de Fase A con sus limitaciones y autoriza expresamente solo B1. Proporciona Account ID de formato32hex, configurado como dato no secreto del entorno, sin copiar credenciales al repositorio. Destino único miminiapp-staging, subdominio miminiapp-lab.workers.dev. Se permite exclusivamente el primer despliegue mínimo necesario para crear ese Worker y comprobar identidad/URL/recursos, más preparar o guiar la emisión posterior de Editor account-owned restringido a staging.

Antes de usar Admin, explicar el canal seguro: secreto personal de Codex CLOUDFLARE_BOOTSTRAP_API_TOKEN, destino HTTPS único api.cloudflare.com. Nunca pedir valores por chat, guardarlos en Git o pasarlos a GitHub Actions. Crear un Worker inexistente requiere Workers Admin temporal a nivel de producto de la cuenta; es un alcance más amplio que un Editor por Worker y se explica expresamente. No añadir permisos generales legacy, Billing, DNS, Routes o administración de tokens de forma automática. El propietario puede hacer el bootstrap personalmente en dashboard como alternativa.

No se autoriza producción, despliegue ordinario, cambio de master predeterminada, promociones, merges, rollback, otro despliegue de prueba del Editor ni ampliación de permisos. Solo un despliegue inicial mínimo; no se desarrollan miniapps ni se publica contenido interno, fixtures o secretos. Si staging ya existe o no se puede cumplir el alcance, inventariar sin sobrescribir y detener el paso afectado.

Comienza preparación local B1, sin usar credencial administrativa ni llamar a operaciones de escritura Cloudflare. La instancia y el borrador leídos no reflejaban api.cloudflare.com ni el origen staging y no había binding Cloudflare disponible. Se guardan requisitos seguros de bootstrap y ambos destinos en el borrador asociado, sin aplicar ni publicar el entorno. Tras provisión segura se comprobarán cuenta/subdominio/Free; si verificar el plan exige Billing Read no se amplían permisos, se registra límite y se verifica por el propietario en dashboard. I-03 permanece En curso.

## Preparación del primer PR de staging mediante GitHub Actions — 2026-11-06

El propietario informa que creó y publicó manualmente miminiapp-staging con la plantilla básica de Cloudflare. También configuró el Environment staging con el secreto CLOUDFLARE_API_TOKEN (Editor account-owned restringido al Worker) y la variable CLOUDFLARE_ACCOUNT_ID; no hay credenciales de producción según su declaración. El propietario administra Cloudflare/credenciales; Codex desarrolla, prueba y prepara PR; GitHub Actions verifica y publica después de la autorización correspondiente. Se retira la necesidad de acceso o credencial Cloudflare en Codex y no se pide de nuevo el Admin de bootstrap. La preparación anterior de B1 se conserva como historial, sin ejecutar su despliegue ni publicar su artefacto de mantenimiento.

Se autoriza implementar los cambios técnicos en una rama de trabajo y abrir un PR a staging. Reutilizar artefacto inmutable, procedencia, CI/E2E, merge manual del propietario y revalidación bajo bloqueo. Preparar prueba de acceso del Editor solo mediante GET en GitHub Actions, sin mostrar secretos ni modificar otros recursos. Distinguir acceso de lectura, declaración del scope por el propietario y aislamiento de escritura no probado; un404 de producción inexistente no acredita permisos.

Alcance de esta ejecución: código/pruebas/docs y PR, sin merge, activación o despliegue. Staging conserva if:false y política de publicación cerrada; se entrega por separado el parche mínimo revisable de activación para aplicar solo después de aprobación expresa. Producción y rollback siguen con todos los jobs cerrados; promotion conserva check requerido pero falla explícitamente mientras no se autorice, sin un skip que GitHub pueda contar como éxito. No se cambia master como predeterminada ni se crean recursos de producción.

### Resultado de preparación del PR de staging

Implementados aislamiento de autorización por destino, flag específico, pin de cuenta, contextos de Actions y probe GET saneado dentro del Environment staging; se conservan procedencia, paquete inmutable, CI/E2E y revalidación bajo bloqueo. Actualización mecánica de controles conforme a la nueva distribución autorizada, sin cambiar stack o hosting. Publicadores siguen if:false/política false; promoción falla explícitamente y producción/rollback permanecen cerrados.

Verificación local completa exit0: 226 unitarias, 9 componentes, 26 E2E y pruebas de integración. El parche futuro de activación se valida además en una copia temporal con las 226 unitarias; no se aplica a la rama. Cuenta/destino y secreto no se usan contra Cloudflare desde Codex. Permisos y contenido real del Worker siguen con la declaración del propietario hasta el run futuro de Actions autorizado. El informe separa403 de lectura,404 inconcluso y aislamiento de escritura no probado, sin solicitar permisos generales como alternativa.

Evidencias y procedimiento: [informe de preparación](../../i03-staging-preparation-report.md), [puesta en marcha](../../i03-staging-startup.md), parche revisable sin aplicar en docs/staging-publication-activation.patch. Preparación en feature/i03-staging-first-release para PR a staging, sin fusionar. I-03 sigue En curso; antes de la primera publicación se requiere autorización expresa del propietario y revisión del diff final.

PR de preparación #3 abierto en borrador hacia staging, sin merge. Primer CI de código8e82227 success: run42259685654, quality/app15368, evento pull_request. Comprobación adicional de226 unitarias en copia de activación con contexto simulado de push protegido, sin red Cloudflare. El ajuste del test nativo no cambia los bloqueos; el resultado del último head se registra en la descripción/entrega del PR. No se configura la variable de publicación ni se aplica su parche.


## Preparación técnica de activación de staging aprobada — 2026-11-06

El propietario revisa el PR #3 y aprueba expresamente aplicar docs/staging-publication-activation.patch en su misma rama, ejecutar pruebas completas y actualizar el PR con el nuevo commit y CI. Esta instrucción no autoriza la primera publicación: prohíbe configurar I03_STAGING_PUBLICATION_AUTHORIZED=true, fusionar, desplegar, crear producción, activar producción/promoción/rollback, cambiar la predeterminada, ampliar permisos o modificar secretos.

Se aplica el parche sobre f667890 en feature/i03-staging-first-release: política phaseB/global true/solo staging true y dos if condicionados por push/ref/repositorio/variable; la auditoría comprueba ese modo exacto. Se refuerzan pruebas asociadas de flags y fallo obligatorio del probe antes de Wrangler. No cambian aplicación, herramientas, permisos o configuración Cloudflare. El probe real permanece pendiente del futuro merge protegido autorizado; acceso de lectura no acredita aislamiento de escritura.

GitHub confirma PR#3 abierto/borrador/sin merge, main y staging en73b8bd2 con quality+promotion/quality de app15368 para todos; master214a3c1 intacto y predeterminado; solo merge commits. Environments exactos staging/main sin reviewers/espera y deployments vacío. No se modifica ninguna configuración remota ni se afirman comprobaciones administrativas que la integración no permite leer.

La parada obligatoria es entregar diff, commit, CI y riesgos para revisión; esperar otra autorización expresa antes de variable o merge. I-03 sigue En curso, con las limitaciones anteriores. Evidencias y resultados en el [informe actualizado de staging](../../i03-staging-preparation-report.md) y el [procedimiento](../../i03-staging-startup.md).

Verificación de esta actualización: npm run verify exit0 tras corregir formato de una prueba nueva; 240 unitarias, 9 componentes, 26 E2E e integración modular/I-01 satisfactorias con Chromium156.0.8078.4/r1248 fijado. Tipos61 archivos sin errores/warnings/hints, lint/formato/hosting y git diff --check correctos. Se comprueba byte a byte que política y staging.yml coinciden con el parche y que los otros tres workflows no cambian. No se realiza ninguna petición Cloudflare, cambio de variable, merge o despliegue.


## Corrección autorizada tras primer intento de staging — 2026-11-06

El propietario informa que el run42266837537 falló de forma segura en prepare con Exactly one merged pull request is required for a deployment. Autoriza un nuevo PR a staging para corregir el resumen commits/SHA/pulls sin merged y verificar después el PR detallado, conservando todos los gates. Prohíbe pushes directos a staging, merges, despliegues y cambios de permisos/tokens/secretos/protecciones/predeterminada. No se reintenta el run fallido.

La API confirma PR#3 fusionado por el propietario con merge21b2a20, prepare failure y remote-test skipped. Resumen real closed/merged_at/SHA correctos, merged ausente. Nueva rama feature/i03-fix-merged-pr-summary desde origin/staging21b2a20; main73b8bd2 y master214a3c1 intactos, master predeterminada.

Se separan tipos de resumen y detalle y se conserva exactamente un candidato, con confirmación detallada explícita de merge/identidad/procedencia antes de los checks. No se modifica verifyMerge ni el contrato de CI. Se observa además pull_requests vacío en el CI del PR3 después del merge, tanto listado como detalle: la comprobación de vínculo exacto se mantiene y ese bloqueo adicional queda documentado, sin introducir un fallback o cambiar el contrato de procedencia por inferencia. Antes de otra publicación debe resolverse con evidencia compatible o aprobación del propietario para un cambio material.

Estado En curso; alcance,12AC y limitaciones Cloudflare anteriores intactos. Informe/evidencias de esta corrección en [corrección del gate](../../i03-merged-pr-correction-report.md), sin declarar el circuito de despliegue Verificado.

Verificación local completa de la corrección: npm run verify exit0, tipos62 archivos sin errores/warnings/hints, lint/formato/hosting correctos,272 unitarias (32 nuevas),9 componentes,26 E2E e integración modular/regresión I-01 con Chromium156.0.8078.4/r1248 fijado. git diff --check correcto. No se modifica ningún workflow, política, permiso, dependencia o frontend. Nuevo PR se entrega en borrador para revisión con su CI, sin merge ni reintento de publicación.


## Ampliación autorizada del PR #4 — vínculo persistente PR–CI, 2026-11-06

El propietario confirma la corrección del resumen y la desaparición de asociaciones nativas tras el merge, y autoriza ampliar el mismo PR #4 con la solución más sencilla verificable. Considerar run-name desde github.event.pull_request y display_title persistente, sin secretos de PR o pull_request_target. Debe conservar identidad de PR/repositorio/base/head/workflow/evento, último intento y job quality, rechazo de contradicciones nativas, merge real, artefactos y vigencia; exige pruebas negativas/completas y nuevo CI satisfactorio. No autoriza merge, despliegues o cambios de credenciales/protecciones. Main conserva strict=true y master predeterminada.

Concreción de ADR-MMA-009: run-name versionado generado solo desde el contexto del evento; el lector pr-ci.ts contrasta display_title y metadatos API, exige el pin exacto del workflow completo en head y merge, coherencia de las asociaciones nativas informadas y detalle/intento/job quality satisfactorios. Relee detalle y listado al finalizar. Elegir el run más reciente antes de validar título, identidad y resultado evita volver a un CI antiguo. Se conservan merge real, verifyMerge y artefactos; el lector anterior de promotion sigue bloqueado junto a producción y rollback, sin autorizar su activación.

La prueba real de esta tarea será el CI del PR abierto y la lectura del título/lector quality contra API sin escritura. La ausencia del array tras el merge se cubre con fixtures; no se fusiona para probar persistencia. No es una firma independiente del runner y el modelo mantiene revisión humana y protecciones. Detalle en [identidad CI](../../i03-pr-ci-identity.md) e informe de corrección. I-03 sigue En curso, sin completar el deployment o los AC remotos por estas pruebas.

Verificación local final exit0:314 unitarias (40 de identidad persistente),9 componentes,26 E2E e integración/regresión I-01 con Chromium156.0.8078.4/r1248 fijado. Tipos64 archivos sin errores/warnings/hints, lint/formato/hosting y git diff --check correctos. Revisión independiente del diff sin bloqueos concretos; pin en head y merge, sin modificar publicadores, política, CLI/gate de publicación, permisos o toolchain. Se corrigen fixtures/tipado de tests antes del resultado final; los intentos previos quedan separados de la evidencia satisfactoria.

CI del primer head de identidad8e1562e satisfactorio y display_title real correcto. La lectura API reveló que run.name también es dinámico; se corrigió la comparación y sus fixtures, manteniendo descriptor.name=CI y workflow ID/path. Batería completa posterior nuevamente314/9/26 y tipos64 correctos. El lector nativo pasó contra metadatos reales del run42302954132; replay local quitando solo asociaciones pasó y con contradicción falló. No es una prueba empírica postmerge. La entrega enlazará el nuevo CI del commit con este ajuste y la lectura final; PR4 sigue borrador/sin merge, sin publicaciones.


## Staging Verificado — 2026-11-07 (Europe/Madrid)

El propietario confirma la primera publicación real satisfactoria y autoriza exclusivamente actualizar documentación y preparar un PR hacia staging, sin fusionarlo. El hito staging pasa a `Verificado`; el estado único del ExecPlan permanece `En curso`. No se archiva o acepta I-03 completo y no se inician mecanismos, infraestructura o miniherramientas nuevas.

Evidencia: PR #4 fusionado por aalexlpez en `e1e3b6596f97b86ba7e2ff3d21aab1ac5e21e0c0`; [run 42305409224, intento 4](https://github.com/aalexlpez/miminiapp/actions/runs/42305409224/attempts/4), push de staging, prepare y remote-test success. La API corrobora jobs/pasos y los artefactos de candidato, acceso y validación del intento 4. El propietario confirma 12 archivos publicados, 30 pruebas remotas correctas e identidad/ES/EN/rutas/responsive/accesibilidad verificados. Solo ese intento se presenta como satisfactorio.

El probe comprobó lectura de staging y denegación de lectura del otro Worker (403); no se probó aislamiento de escritura. La identidad del CI de PR #4 permanece en display_title tras su merge con pull_requests vacío, corroborado por API. El [informe existente](../../i03-staging-preparation-report.md) distingue fuentes, IDs/digests y límites de lectura de logs; no se inventan IDs de versión Cloudflare.

Flujo operativo demostrado: feature → PR a staging → CI → revisión/merge manual del propietario → Actions → Cloudflare → pruebas remotas/recibo. El propietario administra credenciales en GitHub Environment; Codex prepara código/pruebas/PR y no necesita conectarse a Cloudflare. Las [guías](../../i03-operations.md) describen la publicación ordinaria sin Wrangler manual semanal.

Pendientes conservados: producción, promoción, rollback y su ensayo, aislamiento de escritura, separación completa entre entornos, IDs/timeout del proveedor no acreditados y límites de verificación administrativa. Main conserva strict=true y master predeterminada. AC7 queda verificado para staging; el automatismo de AC6 está demostrado sin atribuir IDs de proveedor ausentes. AC3/4/5/8–11 y la aceptación de AC12 no se declaran completamente satisfechos. Los12 criterios permanecen sin modificación; la tabla parcial está en el informe.

La revisión de este PR documental comprueba coherencia, enlaces y diff exclusivo Markdown; se conserva el CI obligatorio del PR. No se repite manualmente la batería de aplicación ni se ejecuta otra publicación. Tras entregar el PR se presentarán tres opciones de primera miniherramienta por separado, sin elegir o implementar ninguna. La prioridad es producto, sin ampliar infraestructura.

Validación documental previa al PR: 11 archivos Markdown, 111 enlaces relativos existentes, 12 criterios de aceptación idénticos al staging base, IDs/digests de los tres artefactos coincidentes con API y git diff --check correcto. Revisión independiente sin bloqueos documentales; las evidencias locales permanecen ignoradas y no se incluyen en el commit. El resultado del CI obligatorio se enlazará en el PR tras observarlo.
