# PR-01 — Promoción manual entre repositorios independientes

## Control

* **Estado:** `En curso`.
* **Responsable:** propietario de MiMiniApp, titular de las dos cuentas.
* **Creado / actualizado:** 2026-11-13.
* **Autorización actual:** aprobación inicial del plan e implementación local el 2026-11-13; autorización posterior de commit, subida de rama y PR mediante «vale, continua». El propietario aprueba después la enmienda de CI ligero mediante «vamos a aplicar mejor este nuevo flujo». Merge, dispatch de releases, despliegues y Cloudflare/DNS no autorizados.
* **Origen:** `aalexlpez/miminiapp`, ID `1445849027`, rama `staging`.
* **Destino:** `soycerobytes/miminiapp`, ID `1455524397`, rama `main`.

## Objetivo

Importar una instantánea aprobada de staging mediante un commit propio de producción, sin importar objetos de historial del origen. Abrir un PR de release; únicamente el merge manual a main dará paso al mecanismo de publicación que el propietario indica que ya existe en Cloudflare Workers Builds.

Producción conservará su historial independiente. No se eliminará ni reescribirá el historial existente. El SHA de staging puede conservarse como dato de procedencia sin importar sus commits.

## Auditoría de impacto — comprobaciones en lectura

Base local de destino: `2a52211d36cb9fabca920200f6875bf8dccdb881`. Historial de destino observado: commit inicial `0a42780` y commit del esqueleto del workflow. No es un clon del historial completo del origen.

| Elemento | Observación | Tratamiento propuesto |
| --- | --- | --- |
| `.github/workflows/prepare-release.yml` | Ya existe, pero solo tiene nombre, disparador e inputs/permisos; carece de jobs. | Completar el workflow; no basta con añadir permisos. |
| `.github/workflows/ci.yml` | quality ejecuta npm run verify para PR a staging/main y push a feature/i03*. | CI específico del destino para todo PR a main, incluyendo releases generadas. Comprobaciones ligeras para releases; tests propios de controles en PR de configuración. |
| `.github/workflows/promotion.yml` | Falla deliberadamente en todo PR a main; el código posterior supone staging y main en el mismo repositorio. | Sustituir ese control por validación entre repositorios, sin convertir el fallo en éxito incondicional. |
| `.github/workflows/production.yml`, `rollback.yml` | Publicadores con jobs if:false. | Mantener sin capacidad de publicar; no habilitarlos en paralelo a Workers Builds. |
| `.github/workflows/staging.yml` | Solo permite publicar desde aalexlpez/miminiapp; la copia del destino no se activa allí. | Conservar separación y probar que el destino no puede publicar staging. |
| `.github/deployment-policy.json` | Sigue identificando aalexlpez/1445849027 y su cuenta Cloudflare; permite publicación de staging. | Política propia de destino, con origen y destino explícitos y sin permisos de despliegue desde Actions. No sustituir cadenas globalmente. |
| `scripts/release/gate.ts`, `github.ts`, `pr-ci.ts` | Identidades y contratos del circuito original de un solo repositorio. | Separar el lector de evidencia de staging de la autorización y procedencia del destino. Preservar rechazos de identidad incorrecta. |
| `scripts/release/manifest.ts`, `cli.ts` | El empaquetado/validación asume el repositorio original. | Distinguir manifiesto público de staging, procedencia de importación y eventual identidad del build de producción. |
| `tests/unit/*release*`, `workflow-safety`, `pr-ci-identity`, `remote-target`, `staging-token-probe`; `tests/remote/target.ts` | Expectativas del circuito original y de sus destinos fijos. | Actualizar contratos pertinentes; conservar pruebas negativas y fixtures del origen como evidencia de origen, no renombrarlas ciegamente. |
| `deploy/cloudflare/*.jsonc`, `scripts/validate-hosting.ts` | Configuración de Static Assets para dos Workers; validación offline. | Preservar configuración local de producción y controles de hosting; ninguna llamada de escritura a Cloudflare. |
| `src/miniapps/registry.ts` | Registro vacío. | Primera promoción solo de la plataforma; ninguna miniapp autorizada por inferencia. |
| ADR-MMA-004/009/014 e I-03 | Describen una cuenta, ramas comunes y promoción del mismo artefacto. | El nuevo circuito necesita una decisión explícita del destino. No reescribir decisiones históricas como si ya aprobaran dos cuentas y rebuild. |

### Staging real observado

* Ref staging: `6f4f7f0c35ee1cc48b176d1038b4edb9669db273`.
* [Run 42816629375](https://github.com/aalexlpez/miminiapp/actions/runs/42816629375), intento 1, evento push, workflow `.github/workflows/staging.yml`, conclusión success.
* API de jobs: prepare y remote-test success; los pasos npm run verify, publicación de staging y prueba remota terminan satisfactoriamente.
* [Manifiesto servido](https://miminiapp-staging.miminiapp-lab.workers.dev/release-manifest.json): repositorio/ID anteriores, sourceSha igual a staging, sourceTree `0209047072ad905c1a16a1f5550af825a7822193`, payloadSha256 `8751350b15d8ffcd2052a69a8ad0a2cfcface65dcfa3111504795f339557aa1f`.
* El manifiesto público es la identidad reducida: no contiene la lista de archivos ni run/attempt. No debe validarse como si fuera el manifiesto completo del artefacto.
* API de artefactos: candidato y recibo de validación presentes/no expirados. Se comprobaron metadatos, no se descargaron ni verificaron sus bytes.
* El workflow real de staging publica mediante GitHub Actions/Wrangler. La conexión de producción a Workers Builds la declara el propietario; no se ha inspeccionado el dashboard de Cloudflare.
* Ruleset: declarado configurado por el propietario; no se acredita aquí su configuración administrativa completa.
* En la auditoría inicial no se ejecutó npm run verify; la evidencia de implementación se registra al final de este plan.

## Decisiones aprobadas para implementación local

1. Dos historiales independientes. Cada importación parte del main de destino y añade solo el delta de archivos autorizado, sin fetch/merge del grafo de staging, force push o sustitución de main.
2. Workers Builds será el único publicador de producción y reconstruirá el código importado. Esto exige aprobar el cambio respecto al contrato histórico de promover el mismo artefacto: verificar el mismo SHA de código no demuestra identidad binaria del build de producción.
3. El workflow manual solo corre en main y en el repositorio/ID de destino. Código de control y política proceden de esa base confiable. Lectura del código público de origen por SHA inmutable; no ejecutar herramientas descargadas con permisos de escritura.
4. Lista positiva mantenida en producción. Primera versión sin miniapps, ya que no hay ninguna en el registro. Nuevas herramientas requieren ampliar explícitamente la lista, incluidos sus assets y traducciones. El estado published de un registro de origen no concede autorización por sí solo.
5. PR creado mediante GITHUB_TOKEN con permisos mínimos. Separar validación sin credenciales de escritura del job que materializa el commit y abre el PR. No ejecutar npm ci ni código importado en el job de escritura.
6. No confiar en que la creación del PR con GITHUB_TOKEN dispare por sí sola quality. Probar el comportamiento real y proporcionar una ruta explícita de workflow_dispatch para verificar la rama/PR exactos si es necesaria, sin PAT ni pull_request_target. No declarar completo el circuito si quality no queda asociado al commit del PR y exigible por protección.

El propietario aprueba estas decisiones al aceptar el plan como fue planteado, el 2026-11-13; se registra ADR-MMA-020 en el índice antes de implementar. Las decisiones del repositorio de staging no cambian.

## Alcance de la implementación autorizada

### 1. Aislamiento y CI del destino

Adaptar workflows, política y controles del destino. Enmienda aprobada: la batería funcional completa se realiza en staging; las releases de producción solo verifican su evidencia, procedencia e integridad de transferencia, sin instalar dependencias ni ejecutar aplicación. Los PR propios de configuración ejecutan lint/formato y tests de estos controles. npm run verify sigue disponible para validar localmente su implementación. Producción no hereda activación de staging ni secretos Cloudflare.

### 2. Lectura y selección del candidato

Aceptar únicamente un SHA completo de 40 caracteres. Validar repo/ID/rama y coincidencia con staging actualmente publicado; comprobar el último run/intento pertinente para ese SHA, su workflow confiable y jobs/pasos requeridos, rechazando failures, skips y reruns pendientes. Comparar SHA/tree con GitHub y con la identidad HTTPS de staging. Fijar el snapshot al SHA, no a una rama móvil. Releer evidencia antes de crear la propuesta y rechazar cambios concurrentes.

No basta con encontrar cualquier check verde o cualquier ejecución antigua. Mantener paginación y selección determinista. Lectura de endpoints públicos de origen sin ampliar el alcance del token del destino; validar aparte el acceso real si cualquier evidencia requiere autenticación adicional.

### 3. Importación con lista positiva

Crear una lista explícita de archivos de plataforma y pruebas de aplicación, basada en los archivos actuales. Categorías candidatas: componentes/layouts, i18n, estilos, librerías de aplicación, scripts del navegador, páginas comunes, recursos públicos revisados y archivos de toolchain necesarios.

No permitir un src/** o public/** incondicional que pueda importar herramientas o assets de herramientas futuras. La política enumerará rutas y los cambios de esa lista serán propios del destino, revisados antes de incluir nuevos archivos.

Preservar por defecto `.github/`, `deploy/`, `scripts/release/`, las pruebas de procedencia/seguridad del destino, documentos de gobierno y la política de importación. Los scripts de integración/pruebas de producto necesarios se enumerarán individualmente. El registro de miniapps debe coincidir con los módulos expresamente autorizados.

Rechazar .env, .git, credenciales, enlaces simbólicos, paths absolutos, traversal y archivos especiales. Eliminar archivos obsoletos solo dentro del conjunto gestionado. No mantener archivos retirados del origen por copiar únicamente altas y modificaciones. Rechazar un snapshot incompatible con la lista en vez de omitir dependencias silenciosamente.

### 4. Procedencia, rama y PR

Registrar SHA/tree/run/intento de origen y hash de la proyección importada como metadatos propios de producción. Crear release/<sha>-<identificador> desde main; commit y PR pertenecen exclusivamente al destino. Gestionar candidato repetido, ausencia de delta, ramas existentes y concurrencia sin sobrescribir ramas ajenas. Nunca auto-merge, push a main ni aprobación automatizada.

La verificación de procedencia del PR compara archivos importados con el snapshot seleccionado y reglas confiables de base, sin volver a ejecutar las pruebas de aplicación. El PR no puede reemplazar la política que lo valida. Si main avanza, comprobar nuevamente la compatibilidad y la procedencia de la propuesta actualizada.

### 5. Documentación y recuperación

Actualizar decisiones aprobadas del destino, arquitectura real tras implementar y guía operativa. Explicar selección de SHA, lectura del PR/quality, merge manual, fallos/reintentos y rechazo de versiones no publicadas. Recuperación ordinaria mediante PR de reversión o promoción de una versión anterior expresamente seleccionada y verificada; nunca reset/force push. No activar el workflow antiguo de rollback. La prueba de preparación y la publicación son acciones separadas.

## Criterios y verificaciones previstos

* Un push a staging no produce escrituras ni despliegues en el destino.
* Solo workflow_dispatch confiable prepara una release; inputs inválidos y contextos/repositorios/IDs incorrectos se rechazan.
* Un SHA sin verificación completa, manifiesto discordante o intento más reciente fallido/en curso no puede crear PR.
* Cambios concurrentes de staging/main/evidencia se detectan antes de escribir.
* Solo se importa la lista autorizada, con borrados controlados; secretos, traversal, symlinks y miniapps no autorizadas se rechazan.
* La configuración propia del destino se conserva; ninguna acción ejecuta Wrangler deploy ni cambia recursos o DNS.
* Un commit de release no añade commits del grafo de origen como ancestros; producción conserva sus ancestros.
* PR generado con GITHUB_TOKEN obtiene quality verificable para el commit correcto. Si no puede demostrarse, se registra como bloqueo y no se recomienda activar el check obligatorio aún.
* Pruebas de CI, procedencia, importación y controles anteriores actualizadas. npm run verify completo de implementación local ya acreditado; la enmienda de CI ligero se comprueba con tipos, lint, formato y unitarias. Se prueba que las releases no instalen ni repitan la batería funcional.
* Validación local primero. Ensayo real de creación de rama/PR solo después de autorización de commit/push y de instalar el workflow en main mediante revisión humana.

## Riesgos y límites

Workers Builds puede reconstruir un resultado distinto aunque la fuente autorizada coincida. No se promete equivalencia binaria. La lista positiva puede exigir revisión cuando cambien dependencias o estructura; se falla de forma explícita. Mientras no se compruebe quality en un PR real generado por el bot, el CI automático completo no se considera demostrado. El acceso de escritura al repo no acredita permiso para modificar workflows; comprobar el alcance efectivo al entregar el PR, sin pedir tokens en chat.

El primer PR instala controles en main y, según la configuración declarada, su merge también puede disparar Workers Builds. No hay una instalación en main sin posible despliegue que podamos prometer sin inspeccionar/cambiar esa configuración. El merge permanece en manos del propietario.

## Punto de parada y progreso

Implementación local realizada: política del destino, lista de archivos, scripts de inspección/importación/procedencia, workflows de preparación/CI, cierre de publicadores legacy, pruebas y guía operativa. La aplicación no cambia. Se conservan contratos originales en fixtures y se auditan por separado todos los workflows reales de producción.

Estado En curso hasta el ensayo remoto: falta completar la entrega mediante el PR autorizado, instalar tras revisión humana y demostrar quality asociado al commit de un PR real generado por GITHUB_TOKEN. Se autoriza commit/subida y creación del PR de configuración. No se ejecutan dispatch de release, merge, despliegues, cambios de Cloudflare/DNS ni cambios al repositorio original.

## Historial

| Fecha | Estado | Actor | Motivo |
| --- | --- | --- | --- |
| 2026-11-13 | Borrador | Agente | Auditoría en lectura y plan a partir del encargo adjunto. |

| 2026-11-13 | Aprobado → Autorizado → En curso | Propietario / agente | Aprobación del plan en conversación y comienzo de implementación local; sin autorización de subida. |

## Evidencia de implementación local

* Runtime oficial Node 24.22.2 verificado contra SHASUMS256 y npm 11.19.1, sin cambiar lockfile ni dependencias. Chromium 156.0.8078.4 / revisión 1248.
* Inspección real en lectura con el CLI nativo: SHA 6f4f7f0c35ee1cc48b176d1038b4edb9669db273, run 42816629375/intento 1, tree 0209047072ad905c1a16a1f5550af825a7822193 y payload coinciden. No se utiliza token del destino en origen.
* Se probaron preparación con API aislada, ascendencia de un único padre de destino, dispatch explícito de CI, ausencia de escrituras en inspect y ausencia de merge/publicación en prepare. Casos negativos de paths, secretos por ruta, miniapps, pins, manifiesto, intentos fallidos, concurrencia, refs obsoletas, proyección alterada, procedencia forjada y origen de fork.
* Corrección durante validación: sintaxis TypeScript compatible con stripping nativo (sin parameter properties); paths de Astro entre corchetes admitidos; comprobación de los dos padres exactos del merge a probar.
* Verificación completa: npm run verify exit 0. Tipos sin errores/warnings/hints; lint, formato y hosting correctos; 389 unitarias, 9 componentes, 78 E2E y test:integration completos. Runtime y Chromium fijados; lockfile intacto. Log temporal /workspace/work/pr01-verify.log, sin credenciales.
* Limitaciones externas: ruleset detallado y configuración Cloudflare no verificados; PR real del bot/check aún no ensayados. No atribuir a tests locales pruebas de enforcement remoto.

| 2026-11-13 | En curso | Agente | Implementación local y npm run verify completos; pendiente autorización de commit/push, PR de configuración y ensayo remoto. |

## Enmienda aprobada: producción sin pruebas funcionales duplicadas

El propietario aprueba «vamos a aplicar mejor este nuevo flujo», 2026-11-13. Las releases solo comprueban evidencia/procedencia/integridad; el CI no instala herramientas ni ejecuta la aplicación. PR de configuración: lint/formato/tests específicos de controles. Se mantiene la evidencia histórica de npm run verify local, que no se exige a cada release. La decisión de promoción se identifica ADR-MMA-020 para no colisionar con ADR-MMA-019, que ya gobierna apariencia.

| 2026-11-13 | En curso | Propietario / agente | Subida y PR de configuración autorizados; enmienda de CI ligero aprobada e implementada, sin merge. |

**Validación de la enmienda:** tipos (0 errores/warnings/hints), lint y formato correctos; 391 unitarias pasadas. La batería funcional completa anterior se conserva como evidencia de implementación; no se repite en el flujo de releases. El comando exacto del CI para los controles también se probó localmente.

## Bloqueo de entrega — 2026-11-13

Implementación y enmienda de CI ligero confirmadas en commit local 1bd4873. La publicación mediante integración devuelve403 Resource not accessible by integration al crear el árbol; el push Git a config/production-promotion devuelve403 Permission denied to aalexlpez. El lector de instalaciones devuelve únicamente aalexlpez (137896862), selección de repositorios; soycerobytes no figura como instalación accesible. El permiso de colaborador reportado por get_repo no acredita capacidad de escritura de esta integración.

Sin rama remota ni PR creados y sin cambios a main, staging o Cloudflare. Se necesita instalar/autorizar la misma aplicación GitHub en soycerobytes para miminiapp, manteniendo el acceso de colaborador ya concedido; después reintentar con conexión nueva. No solicitar contraseñas/tokens en chat. La autorización de subida/PR permanece vigente. Estado En curso; el bloqueo es externo, no un fallo de las pruebas locales.
