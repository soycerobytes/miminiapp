# I-03 — informe de preparación, Fase A

**Fecha histórica:** 2026-11-06. **Hito de Fase A:** preparación completada con los límites descritos. Este informe conserva el estado de aquella fase, incluidas sus restricciones y comprobaciones pendientes; no describe la situación actual completa.

**Actualización de referencia, 2026-11-07:** staging ya está publicado y su hito está Verificado; I-03 sigue En curso, sin aceptación global. El [informe de staging](i03-staging-preparation-report.md) registra run42305409224 intento4 y los pendientes. El modelo posterior sustituye el requisito histórico de Cloudflare en Codex: el propietario administra sus credenciales en GitHub Environment y Actions publica. No se repite o amplía infraestructura mediante esta nota.

## Recuperación e integridad

`pwd` y `git status` funcionan en `/workspace/miminiapp`, dentro de Codex Cloud. Se recuperaron el borrador I-03 y sus seis documentos asociados sin commit; no se había perdido trabajo ni modificado el historial durante la recuperación.

Se verificaron los objetos y la ascendencia de I-01 `0288de567fe7e1665973c6d8e128866962f66e2e` e I-02 `567b394583140d1710034f4798d0cf8dbb29e387`. Los hashes de aplicación del manifiesto I-02 coincidían antes de implementar I-03. Se conservaron la rama anterior de I-02 y ambos commits aceptados.

La lectura HTTPS y fetch de `origin/master` confirmaron `214a3c16ad5e968214af540033246baa9dd32ba1`, merge del PR #1, con árbol idéntico al checkpoint `0cf778f`. Antes de integrar había dos commits exclusivos locales y un merge exclusivo remoto, con ancestro común `0cf778f`. `master` sigue siendo la predeterminada observada; no se ha modificado. La integración técnica conserva la ascendencia mediante merge normal, sin force push, reset, rebase ni promoción a main/staging.

## Implementación local

* Cinco workflows de GitHub Actions fijados por SHA: CI, promoción, staging, producción y rollback. CI se prepara para PR a staging/main y push a la rama técnica de I-03. Gate desde base confiable, sin secretos.
* Todos los jobs de staging/producción/rollback tienen `if: ${{ false }}` literal. La política versionada conserva Fase A y deploymentsEnabled=false. El comando también rechaza publicar en Fase A antes de leer artefactos, credenciales, acceder a la red o ejecutar Wrangler. Una variable remota no basta para activar despliegues.
* Artefacto determinista, hashes de archivos y manifiesto público de procedencia, recibo separado tras pruebas, selección por run/intento/IDs y revalidación. El empaquetado exige checkout limpio. Promoción del mismo paquete, sin reconstrucción; comprobación del manifiesto servido en staging y rechazos de candidatos obsoletos, bytes distintos, procedencia falsa, reruns y cambios de ramas.
* Configuraciones de Workers Static Assets para `miminiapp-staging` y `miminiapp`, sin script/SSR ni Account ID inventado, preview URLs desactivadas, barras finales y 404-page. Archivo `_redirects` con `/ /es/ 301`. El preview local Astro conserva raíz HTTP 200.
* Suite remota separada, con origen/destino/identidad explícitos y 30 pruebas descubiertas para móvil/escritorio. No se ha ejecutado contra Cloudflare.
* Plantillas de configuración en `deploy/github/`. El propietario guardó manualmente las reglas de main y staging; las ramas ya existen y la API confirma protección y quality obligatorio para todos. La lectura detallada de otras opciones continúa restringida, como se distingue más abajo. No se ha rebajado strict ni creado secretos por esta ejecución; la ausencia global de secretos depende de la declaración del propietario y no se pudo auditar por API.

## Verificaciones satisfactorias

Evidencia local ignorada: `.local/verification/i03/phase-a/`. Los logs no se incorporan al commit.

| Comprobación | Resultado y alcance |
| --- | --- |
| Instalación | Wrangler 4.158.0 exacto, npm ci desde el único lockfile satisfactorio. Scripts esbuild@0.28.2/workerd@1.20261104.1 autorizados por versión exacta. Node 24.22.2/npm 11.19.1. |
| Acciones oficiales | Cuatro tags contrastados de nuevo con sus SHA completos por git ls-remote; action.yml recuperados al SHA usan Node 24. `actions-tags.json` y `actions-runtime.json`. |
| Batería completa local | `npm run verify` exit 0: tipos, lint, formato, validación offline Wrangler, unitarias, componentes, E2E/axe e integración. `verify.log`. |
| CI real en GitHub | [Run 42170329302](https://github.com/aalexlpez/miminiapp/actions/runs/42170329302), commit `f4430f0a997f2ba47c3b6c6d0b78e8c12a2102f6`, estado **Success** observado en HTML público el 2026-11-06 06:49 CET (05:49 UTC). Corrió quality desde push de la rama técnica, sin publicaciones. No es prueba de protecciones ni de bloqueo de un PR fallido. `ci-observation.json`. |
| Cambios finales del gate | Tras la batería se añadió rechazo de checkout sucio, se amplió auditoría de protecciones y se corrigió el CLI nativo. Tipos finales: 59 archivos, cero errores/avisos/hints; lint y formato correctos. Unitarias finales: 185/185 (incluye 68 de release, 31 de workflows/políticas y 27 de destino/identidad remotos). Logs `unit-final.log`, `workflow-final.log`, `check-final.log`, `lint-final.log`. |
| Componentes | 9/9 satisfactorias. |
| Navegador local | 26/26 E2E, con axe y responsive ES/EN. Chromium real 156.0.8078.4, revisión 1248, ejecutable de la caché fijada; DEBUG registra lanzamiento de chromium_headless_shell-1248. No se utilizó Chromium del sistema. `chromium-pin.log`. |
| Integración modular | Alta aislada A→A+B genera 2→4 rutas ES/EN; pruebas propias 2→4. Fuentes comunes intactas, HTML previo estable salvo uid interno normalizado. Build sin traducción rechazado; fixtures/borradores ausentes de los 12 archivos públicos. Regresión I-01 móvil/escritorio con estados y axe satisfactoria. `modular-result.json`. |
| Paquete real local | `npm run release:pack` y `release:verify` exit 0 sobre checkout limpio `a49c705`; 12 assets y un manifiesto público. Payload SHA-256 `4fc237a77c041683e99a92b8ee502e80da3a58056b854207e1f0ffe8e18647ab`. Run local 0, no candidato confiable de Actions ni publicación. `local-release-manifest.json`. |
| Hosting offline | Wrangler valida ambas configuraciones, destinos y modos de assets; sin deploy/dry-run, login o API Cloudflare. |
| Descubrimiento remoto | 30 pruebas listadas; no se visitaron sitios remotos. `remote-list.log`. |
| Auditoría npm | Producción: cero vulnerabilidades. Total desarrollo: once moderadas, cero altas/críticas; se conserva PEND-007. No se ejecutó audit fix ni se cambiaron majors. |
| Revisión independiente | Sin vía de publicación prematura detectada; corregidas conexiones de variables, proof/receipt e identidad servida. Esto no sustituye pruebas reales de proveedor/protecciones. |

No se repiten pruebas de interfaz por cambios exclusivamente documentales o de gates; las comprobaciones focales cubren los cambios finales. No se han implementado animaciones PEND-008, nuevas miniapps o I-04.

## Configuración remota al cierre de la preparación de Fase A

El propietario volvió a guardar quality y promotion obligatorios en main y mantuvo strict=true. La lectura posterior confirma los dos checks. La siguiente tabla distingue la configuración corroborada por API de los detalles que siguen acreditados solo por declaración del propietario. Esta revisión no modifica protecciones, credenciales, ramas o publicadores.

| Elemento | Evidencia actual disponible |
| --- | --- |
| Repositorio | `aalexlpez/miminiapp`, ID 1445849027. `master` sigue predeterminada. `allow_merge_commit=true`; auto-merge, squash y rebase son false. Ajuste completado y leído por API. |
| Ramas | Main y staging permanecen en `73b8bd2c1d3fc0e2f0161af9df9897d16b51ade8`, con protected=true. Master conserva `214a3c16ad5e968214af540033246baa9dd32ba1`; no se reescribe historia. |
| Checks de staging | La API confirma `quality`, app_id 15368 de GitHub Actions y enforcement_level=everyone. |
| Checks de main | La API de cierre confirma **quality y promotion** obligatorios, ambos con app_id 15368 de GitHub Actions y enforcement_level=everyone. |
| Environment staging | Existe; custom_branch_policies=true, protected_branches=false. Su única política es de tipo branch y nombre exacto staging. protection_rules contiene solo branch_policy: sin regla de reviewers o espera. |
| Environment production | Existe con la misma modalidad. Su única política es de tipo branch y nombre exacto main, sin regla de reviewers o espera. No admite por esa política la rama staging ni tags. |
| Publicación | Deployments sigue vacío. La política versionada continúa en Fase A con deploymentsEnabled=false y todos los jobs publicadores conservan if:false literal. |

Evidencia de cierre en `.local/verification/i03/phase-a/closure/`: repo.json, branches.json, main.json, staging.json, environments.json, staging-policies.json, production-policies.json y deployments.json. Los Environments, las opciones de merge y la presencia de promotion en main ya no figuran como ajustes pendientes.

**Discrepancia anterior resuelta:** la revisión conservada en final-github había observado solo quality en main, aun tras repetir la lectura, sin una capa adicional de rulesets. El propietario volvió a guardar la regla; closure/main.json ya refleja quality y promotion de GitHub Actions. Se conservan ambas observaciones como historial, sin presentar el estado anterior como vigente ni pedir de nuevo ese ajuste.

**Detalles de protección no acreditables por esta credencial:** GET de protección completa sigue devolviendo HTTP 403. PR obligatorio, cero approvals, strict=true, ausencia de bypass y force pushes/borrado deshabilitados quedan registrados como configuración declarada por el propietario, sin presentarlos como campos leídos por la API o como rechazos empíricos ensayados. El resumen de rama confirma protección y checks para todos, pero no demuestra por sí solo el rechazo de push directo, force push, borrado o merge con checks inválidos. No se ejecutan esas operaciones ni se reduce un control para obtener evidencia.

**Secretos y variables:** las lecturas de secretos y variables del repositorio y de ambos Environments también están denegadas con 403. El propietario declara que no los ha creado ni ha habilitado despliegues; esta ejecución no los ha creado. No se afirma haber comprobado por API su ausencia total. No se muestran ni se solicitan valores por chat. Evidencias: repository-secrets.json, repository-variables.json y los archivos equivalentes de staging/production del directorio final-github.

**Bootstrap e historial:** la creación inicial de staging/main se hizo bajo las reglas manuales, exactamente desde 73b8bd2, sin desactivarlas. Ese commit conserva master, I-01 e I-02 como ancestros; su padre inmediato es f4430f0 y su delta es solo documental. Los cambios posteriores en la rama técnica no avanzan las protegidas. Se conservan los intentos anteriores denegados, la creación y el readback en los directorios bootstrap y manual-rules como evidencia histórica, no como descripción de la configuración actual.

**Workflows del bootstrap:** [Staging 42191340205](https://github.com/aalexlpez/miminiapp/actions/runs/42191340205) y [Production 42210622899](https://github.com/aalexlpez/miminiapp/actions/runs/42210622899) terminaron completed/skipped. En aquel momento la lista de Environments estaba vacía; la revisión actual acredita los dos creados después por el propietario. Ningún run levantó los bloqueos o publicó contenido.

**Ensayo de emisión de promotion y revisión humana del error:** el [PR #2](https://github.com/aalexlpez/miminiapp/pull/2), en borrador con cambios documentales desde la rama técnica hacia main, se cerró sin merge. El [run 42211336925](https://github.com/aalexlpez/miminiapp/actions/runs/42211336925), CheckRun/job 127870423964, emitió promotion de GitHub Actions app 15368 y terminó failure en Check origin and the exact validated staging candidate; los pasos anteriores pasaron. La API acredita esos metadatos.

El propietario revisó personalmente el log en GitHub y confirmó el texto literal: `Promotion is not the current same-repository staging to main pull request.` Se registra como **evidencia de revisión humana del propietario**, no como log recuperado por el agente o leído mediante API. La recuperación automatizada del mensaje había fallado por Forbidden en results-receiver.actions.githubusercontent.com. No se necesita repetir esa revisión ni habilitar el host para acreditar de nuevo este texto.

Esta evidencia confirma el rechazo del origen del ensayo por revisión humana, pero no sustituye las demás pruebas: candidatos obsoletos, cambios concurrentes, artefactos distintos, reruns antiguos, enforcement real de direct/force/delete o merge de un PR válido. El PR era draft, por lo que tampoco se atribuye su estado blocked únicamente al gate. No hubo merge, bypass o publicación.

**Cloudflare y activación futura:** esta ejecución no ha creado Workers, tokens o publicaciones. La creación inicial documentada requiere deploy administrativo y permanece fuera de Fase A. La futura autorización limitada de Fase B deberá cubrir explícitamente ese bootstrap, el Account ID por canal seguro y la provisión posterior de dos account-owned tokens Editor restringidos a cada Worker. La compatibilidad real y la denegación cruzada se probarán dentro de esa fase autorizada, **antes de activar publicadores ordinarios**; no se exige un aislamiento ya probado para poder solicitar la autorización del bootstrap que lo hace posible. Si falla el aislamiento, detener la activación afectada sin recurrir automáticamente a permisos generales.

**Disponibilidad para una futura ejecución desde Codex:** la comprobación del entorno indica que api.cloudflare.com y results-receiver.actions.githubusercontent.com no están permitidos, y que las variables de proceso de Account ID y token Cloudflare no están presentes. No se modificó ni publicó configuración de red ni se instalaron credenciales. Si el bootstrap/pruebas de B se ejecutan desde Codex, habrá que preparar el acceso a la API Cloudflare por el flujo de configuración del entorno y proporcionar la identidad autorizada por canal seguro. El error del ensayo ya quedó corroborado por el propietario desde GitHub; permitir el host de logs solo sería necesario para una futura lectura automatizada, no para repetir esa confirmación. Estas comprobaciones de presencia no auditan los secretos de GitHub, cuya API sigue denegada. Evidencia: final-github/future-network-readiness.json. No se usan permisos generales o credenciales alternativas automáticamente.

**Límites pendientes para operación ordinaria:** el wrapper todavía debe completar y verificar captura de versión/deployment ID Cloudflare y consulta del estado activo tras timeout. HTTP 301/404, identidad servida, pruebas remotas, separación real, carreras, promociones y rollback requieren los ensayos autorizados de B; los mocks locales no los sustituyen. Rollback usa workflow_dispatch y master no contiene ese workflow: mantenerla predeterminada ahora y acordar una autorización posterior del cambio de predeterminada o de la secuencia necesaria antes de prometer dispatch operativo. No cambiarla en Fase A ni interpretar la autorización del bootstrap Cloudflare como permiso implícito para hacerlo.

## Correspondencia con los 12 AC

| AC | Fase A y trabajo pendiente |
| --- | --- |
| AC1 | Autorización, identidad y CI padre corroborados; main y staging creadas desde el SHA aprobado y verificadas. Lectura/escritura administrativa detallada limitada. |
| AC2 | Batería y pins comprobados; CI técnico success y checks requeridos de ambas ramas corroborados. Ensayo de promotion realizado; el propietario confirma su error literal. Enforcement real de merge con checks inválidos no probado. |
| AC3 | Ramas, quality en staging, quality+promotion en main, aplicación a todos, merge commits sin squash/rebase/auto-merge y Environments exactos sin reviewers/espera corroborados. Detalle de PR/strict/force/delete denegado y ensayos empíricos de rechazo/merge pendientes. |
| AC4 | Environments separados y políticas exactas comprobados. Secretos/variables no legibles por API; ausencia declarada por el propietario. Workers/tokens/aislamiento real pendientes de B autorizada. |
| AC5–AC7 | Hosting, manifiesto y suite preparados; publicación/separación HTTP/pruebas remotas pendientes Fase B. |
| AC8 | Promotion obligatorio en main corroborado. Error de rechazo del PR #2 confirmado por el propietario; gates negativos locales conservados. Strict=true sigue como configuración declarada y no se reduce. Las otras pruebas reales y cualquier sustitución requieren evidencia y aprobación posterior. |
| AC9–AC10 | Workflows inactivos y equivalencia preparada; promoción, publicación y smoke reales pendientes Fase B. |
| AC11 | Rollback restringido preparado, nunca ejecutado; ensayo inicial autorizado en staging pendiente. |
| AC12 | Guía distingue preparación, merge manual individual, futuro deploy automático, coste y recuperación; aceptación final pendiente. |

## Punto de parada

La preparación de Fase A está completada y sus comprobaciones disponibles de configuración son satisfactorias: bootstrap, checks, opciones de merge, Environments exactos y bloqueos de publicación. Se conservan explícitamente los límites de lectura de protecciones/secretos y los ensayos de enforcement que no se han ejecutado. I-03 permanece En curso; no se declara Verificado ni se anticipan los AC de B.

No hay una reconfiguración de GitHub pendiente de este hito. Antes de solicitar B corresponde concretar la autorización limitada de bootstrap/pruebas Cloudflare y preparar sus condiciones externas, incluida la red si se ejecutará desde Codex. La prueba de aislamiento se realizará dentro de B autorizada antes de activar publicadores ordinarios. La activación, las promociones, el cambio de predeterminada y los ensayos posteriores requieren el alcance y la autorización que correspondan; no se ejecutan ahora.

Commits técnicos locales hasta la integración: `79f31a3` prepara infraestructura con publicaciones bloqueadas; `4690c27` incorpora únicamente ascendencia de master (árbol sin cambios respecto a su primer padre); `b9ecd19` conserva las pruebas del checkout limpio. Los hashes de I-01/I-02 y origin/master siguen siendo ancestros, sin reescritura. Las actualizaciones documentales posteriores de la rama técnica no mueven las ramas creadas desde el commit aprobado.

`a49c705` corrige la sintaxis nativa y conserva la evidencia actualizada. `f4430f0` incorpora el proceso asíncrono y cierra la evidencia local; está subido a origin/feature/i03-preparacion-segura, con identidad de tip confirmada por ls-remote y CI satisfactorio. La ejecución del proceso futuro Wrangler se ajustó después a spawn asíncrono sin shell para propagar correctamente salida/fallos, con pruebas inocuas del proceso; no se ejecutó deploy.

El primer ensayo del CLI real detectó `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`: una parameter property no admitida por Node 24 en modo strip-only, que Vitest transformaba. Se sustituyó por campos/asignaciones ordinarios y se añadieron pruebas con subprocess del Node real, sin nuevas dependencias ni cambios de arquitectura. Los archivos temporales, paquetes de prueba, capturas y evidencias ignoradas quedan fuera de Git.

## Reproducción del estado Git al cierre

`git log --graph --oneline --all` conserva los hashes anteriores; `git merge-base --is-ancestor` comprueba I-01, I-02 y origin/master contra HEAD. La integración `4690c27` tiene el mismo árbol que `79f31a3`; los cambios posteriores son correcciones/pruebas/documentación de Fase A. El dry-run del push técnico a `feature/i03-preparacion-segura` pasó. La comprobación final remota se conserva en `.local/verification/i03/phase-a/ls-remote-after-push.txt`; en la actualización posterior el CI padre ya se corroboró por API y las opciones administrativas detalladas siguen limitadas por permisos, aunque el propietario pudo configurar las reglas manualmente y se completó la creación inicial de ramas. La lectura pública inicial también acredita Success del run indicado. La única escritura posterior en staging/main es su creación inicial aprobada en 73b8bd2; no se cambió master ni la predeterminada.

La actualización documental previa de 73b8bd2 solo documenta el CI ya observado; no cambia código, workflows, contratos o configuración. Un nuevo push documental puede generar otro run normal de quality, sin activar publicaciones. El commit probado `f4430f0` continúa siendo el punto de evidencia del código.

El intento anterior del agente de crear GitHub Environment staging devolvió 403 Resource not accessible by integration, cabecera administration=write; no creó nada y se conserva en manual-rules/environment-staging-attempt.json. Posteriormente el propietario creó los dos Environments y la revisión actual sí los acredita por API.

### Integridad después del ensayo

Se descargaron los refs remotos main/staging para comprobar localmente su SHA y la ascendencia de I-01, I-02 y master; todos correctos. Evidencia history-proof.json. El commit documental posterior de la rama técnica no modifica el origen aprobado ni avanza las ramas protegidas. Solo se realizaron las comprobaciones nuevas de bootstrap/Actions y coherencia documental, sin repetir manualmente la batería de aplicación ya satisfecha.
