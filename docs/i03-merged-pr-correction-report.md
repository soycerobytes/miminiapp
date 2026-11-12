# I-03 — corrección del PR fusionado en el gate de staging

**Actualizado:** 2026-11-07. **Estado:** corrección fusionada mediante PR #4; su gate funcionó en la publicación real de staging, run42305409224 intento4 success. Hito staging `Verificado`; I-03 sigue `En curso`, sin aceptación global. Este documento conserva la historia de la corrección y se actualiza sin cambios de código o infraestructura.

## Incidente y comprobación real

El propietario comunica el fallo del primer intento de staging y autoriza preparar esta corrección. La API confirma PR #3 fusionado por `aalexlpez` con merge `21b2a20077bdd75d7096f65a5c25b7d05e8c820a`. El [run 42266837537](https://github.com/aalexlpez/miminiapp/actions/runs/42266837537) terminó failure en prepare, paso `Check authorization and the protected merge`; el mensaje comunicado es `Exactly one merged pull request is required for a deployment.` El job remote-test quedó skipped, sin ejecutar probe o Wrangler. No se atribuye a ese intento una verificación real del token Cloudflare.

`GET commits/21b2a20077bdd75d7096f65a5c25b7d05e8c820a/pulls?per_page=100` devuelve exactamente el PR #3, state closed, merged_at y merge_commit_sha correctos, **sin propiedad merged**. Se usaba el tipo de PR detallado para un listado resumido y el filtro lo descartaba.

## Corrección inicial eaa5fd3 y controles conservados

Se separan los tipos de resumen y detalle. El listado selecciona únicamente PR cerrados con fecha merged_at válida, SHA de merge exacto y rama base esperada, sin depender del booleano ausente. Sigue exigiéndose exactamente una coincidencia y un número de PR entero positivo.

El candidato se consulta mediante `GET pulls/{number}`. Antes del CI se confirma número, estado cerrado, merged exactamente true, fecha de merge válida, SHA, rama y repositorios base/head esperados por ID y nombre. Un resumen no basta para autorizar una publicación.

Se mantienen los controles originales de checkMerged, verifyMerge y successfulPRCheck: evento/actores/repositorio, merger propietario, SHA y primer padre, calidad del head exacto y último intento, origen de producción, candidato validado y segunda lectura del ref para rechazar cambios concurrentes. No se modifica ningún workflow, política, permiso, configuración de hosting, dependencia o frontend. Producción, promoción y rollback siguen bloqueados.

La rama `feature/i03-fix-merged-pr-summary` parte del staging actual21b2a20. Main conserva73b8bd2 y master214a3c1 permanece predeterminada; se preservan I-01/I-02 y el historial anterior. Solo se permite push de la rama de trabajo y apertura del PR, sin reintentar el run de publicación fallido.

## Bloqueo adicional observado en la primera versión del PR #4

Al comprobar la siguiente validación, la API devuelve `pull_requests: []` para el CI satisfactorio del PR #3 ([run42263591117](https://github.com/aalexlpez/miminiapp/actions/runs/42263591117)), tanto en el listado de runs filtrado por head como en el endpoint detallado del run. Se conservan event pull_request, head SHA f4f26a3, workflow ci.yml, conclusion success y job quality satisfactorio, pero falta la asociación explícita con el número de PR que exige successfulPRCheck.

La primera corrección eaa5fd3 **no eliminó ni sustituyó ese vínculo obligatorio** y añadió cobertura de rechazo cuando faltaba esa prueba. Con los metadatos observados seguía bloqueado el intento después de resolver el primer error; su CI verde no se presentó como garantía de deployment.

El propietario autorizó después ampliar el mismo PR #4. Se implementó [identidad versionada del CI](i03-pr-ci-identity.md) mediante run-name/display_title desde el evento, plantilla completa fijada y metadatos API contrastados. La identidad es obligatoria incluso con asociaciones informadas y una contradicción lo rechaza; no hay fallback basado solo en SHA o verde. La persistencia después del merge ya está corroborada por API y por el gate satisfactorio del despliegue real. Se mantienen pruebas de evidencia ausente/manipulada y controles de intento/vigencia.

## Verificación y entrega

Las pruebas reproducen el resumen real sin merged y confirman la consulta detallada. Cubren ambigüedad, PR sin merge o detalle incoherente, procedencia, merger, SHA/base, CI fallido o ausente y refs obsoletos/concurrentes. Las respuestas son fixtures locales; no contienen secretos ni se publican en el build.

`npm run verify` finalizó exit0: 62 archivos sin errores/warnings/hints, lint/formato/hosting correctos, **272 unitarias** (32 nuevas), **9 componentes**, **26 E2E** e integración modular/regresión I-01 satisfactorias. Chromium156.0.8078.4/r1248 resuelto desde la caché fijada, sin channel/executablePath del sistema. Build público sin fixtures/borradores; git diff --check correcto. Las focalizadas se reproducen con `npm run test:unit -- tests/unit/release-merged-pr.test.ts`.

Evidencia local ignorada en `.local/verification/i03/merged-pr-correction/`: verify.log y observed-api.json, saneado con los campos públicos observados. Se verifica que workflows, política, permisos, herramientas y archivos de aplicación coinciden byte a byte con staging21b2a20. No se incluyen temporales o esas evidencias en el commit. El PR recogerá su commit y CI observado tras el push; no se atribuye éxito a una ejecución futura.

Durante la preparación no se atribuyó un deployment a la corrección. Los resultados272/9/26 anteriores corresponden a eaa5fd3; la ampliación posterior pasó314/9/26. Ahora PR #4 ya está fusionado y el primer deployment real terminó correctamente, con30 pruebas remotas confirmadas por el propietario. El aislamiento de escritura Cloudflare sigue sin probar y se conservan los límites del probe.

La ampliación de identidad persistente pasó314 unitarias,9 componentes,26 E2E e integración/regresión I-01, tipos64 correctos e incluyó40 pruebas de identidad/pin. CI final42303556241 y42303557377 satisfactorios; lectura real del gate registrada en la entrega de PR #4. El [informe de staging](i03-staging-preparation-report.md) contiene la evidencia posterior: mergee1e3b659 y run42305409224 intento4, prepare/remote-test success,12 archivos y30 pruebas remotas. No se eliminan los fallos previos ni se acredita aislamiento de escritura.
