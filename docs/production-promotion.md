# Promoción de la versión completa de staging

## Flujo habitual

1. Desarrollar en aalexlpez/miminiapp y validar en staging mediante sus pruebas y la revisión funcional del propietario.
2. En soycerobytes/miminiapp → Actions → Prepare release from staging, seleccionar main e introducir el SHA completo de staging ya publicado.
3. El workflow comprueba la identidad publicada, el workflow confiable de staging y su último run/intento satisfactorio. Elegir ese SHA autoriza la versión completa: no hay una lista de archivos o miniapps por aprobar en producción.
4. Sincroniza los archivos versionados de proyecto del snapshot inmutable, incluyendo altas, modificaciones, nuevos directorios y borrados. Crea un commit cuyo único padre es main de producción y abre un PR. El historial de origen no se importa.
5. Solicita explícitamente quality para comprobar procedencia, integridad, configuración preservada y ascendencia. No instala ni vuelve a ejecutar pruebas funcionales de aplicación.
6. El propietario revisa el diff y hace merge manual. Workers Builds reconstruye y publica desde main. No se promete identidad binaria con la compilación de staging.

Si no hay diferencias de proyecto, no crea un PR vacío. Nuevas miniapps, entradas de registro, recursos, scripts auxiliares, traducciones, documentación y pruebas se copian automáticamente cuando forman parte del SHA validado. No hay que editar producción para registrar cada archivo o herramienta. Los borradores versionados también forman parte de la copia del código; el build conserva las reglas de visibilidad que ya se probaron en staging.

## Qué se preserva

La política schemaVersion 2 usa selection: snapshot. Ya no contiene files, miniapps ni registryBlob. La lista reducida de excepciones vive en scripts/promotion/core.ts y coincide con los filtros de configuración de ci.yml.

Se preservan .github/, deploy/, scripts/promotion/, scripts/release/, scripts/validate-hosting.ts, pruebas propias de seguridad/publicación y sus fixtures, los documentos específicos de promoción y gobierno del destino, y los archivos raíz README.md, ARCHITECTURE.md, AGENTS.md, CLAUDE.md, GEMINI.md, .gitignore y .gitattributes. La procedencia de la release se genera localmente, nunca se importa.

No se bloquea una carpeta genérica de scripts, documentación o helpers por contener archivos nuevos: por ejemplo scripts/new-tool.ts, docs/new-tool.md y tests/helpers/new-tool.ts se sincronizan. Solo sus controles concretos se preservan. Los nuevos controles de producción deben añadirse deliberadamente a las excepciones para no tratarlos como aplicación.

Se rechazan paths inseguros, .env, .dev.vars, almacenes privados habituales, symlinks y submódulos. Se comprueban los hashes Git de los bytes, se admiten archivos normales hasta 100 MiB y se rechazan patrones de credenciales privadas conocidos; .npmrc solo admite opciones no secretas revisadas. El código y las dependencias del SHA de origen son de confianza tras sus pruebas y la selección humana; revisar el diff sigue siendo necesario. Los secretos de GitHub/Cloudflare no son archivos del snapshot y no se copian.

La sincronización también elimina archivos de aplicación que estén en producción pero hayan desaparecido del origen, incluso si nunca figuraron en una lista antigua. No editar funcionalidades directamente en producción: staging es la fuente canónica de su código. Los controles protegidos se conservan aunque no existan en staging.

## Validaciones y disparadores

Staging ejecuta la batería funcional completa. Las releases usan exclusivamente workflow_dispatch con quality ligero. Los filtros pull_request solo coinciden con controles propios preservados, excluyendo .github/release-provenance.json; una release válida no los modifica ni genera otra ejecución pendiente de aprobación. Los tests garantizan que cada ruta importada queda fuera de esos filtros, aunque sea un archivo nuevo.

Los PR propios de configuración ejecutan lint, formato y las pruebas de production-promotion/production-workflow-safety, porque esos controles no se prueban en staging. Los cambios de aplicación/toolchain se realizan en staging y se promocionan; un PR manual que solo cambie aplicación no ejecuta el CI de configuración ni sustituye el circuito de promoción. Mantener quality como check obligatorio después de comprobar su asociación real al PR.

Si cambia el workflow de staging, revisar su cambio antes de actualizar workflowBlob. No aceptar automáticamente un nuevo pin: esto es una modificación del sistema de validación, distinta de añadir archivos de aplicación.

## Instalación y operación

La integración GitHub debe estar instalada en soycerobytes para este repositorio; Actions debe poder crear PR. Mantener permisos generales de lectura. Solo prepare tiene contents/pull-requests/actions write para crear objetos/rama/PR y solicitar CI explícitamente. No ejecuta código descargado con ese token.

Cloudflare usa soycerobytes/miminiapp/main, build npm run build, deploy npx wrangler deploy --config deploy/cloudflare/production.jsonc y root /. Builds for Preview branches debe permanecer desactivado si no se quieren builds de preparación. El antiguo preview command puede quedarse como estaba, al estar desactivadas esas ejecuciones. Los publicadores de Actions permanecen inactivos. No se modifican recursos, DNS ni credenciales desde este cambio.

El merge de cualquier PR de configuración también puede iniciar Workers Builds. Integrar manualmente cuando se quiera instalar el ajuste; después probar la próxima release real sin fabricar cambios en staging para forzar una prueba.

## Fallos y recuperación

* SHA antiguo/no publicado o pruebas pendientes/fallidas: elegir el SHA servido ahora y esperar validación. No usar un verde antiguo frente a un intento posterior fallido.
* Cambio concurrente de main/staging/evidencia: preparar de nuevo y cerrar la propuesta obsoleta tras revisarla. No hacer merge de actualización sobre release/*; su contrato requiere un único commit nuevo sobre la base exacta.
* Rama creada y PR/dispatch fallido: inspeccionar lo creado. Un rerun usa otro sufijo de intento sin sobrescribir ramas. Si solo falló dispatch, ejecutar CI manualmente eligiendo la rama release y su PR exactos.
* Falta de red o cuota API pública: fallar sin publicar y reintentar al recuperar acceso. No se envía el token de destino al origen.
* Build Cloudflare fallido: consultar su log real; no activar publicadores legacy de Actions.
* Recuperar una versión anterior: revertir los cambios correspondientes en staging, validar esa nueva versión y promocionar su nuevo SHA mediante el mismo circuito. Nunca reset/force push a main. El preparador solo acepta staging actualmente publicado.

Los runs históricos caducados por aprobación no se reejecutan sobre PR ya fusionados. La ejecución explícita de PR #2 pasó y Cloudflare publicó d5e93fed; PR #3 instala filtros para evitar la duplicación. Esta corrección sustituye la lista de archivos por sincronización del snapshot y conserva ese aislamiento de ejecuciones.

## Verificación de implementación

Usar Node 24.22.2/npm 11.19.1. Para estos cambios: npm run check, npm run lint, npm run format:check y las unitarias pertinentes. npm run verify permanece disponible para desarrollo local; no se ejecuta por cada release en producción. Las pruebas cubren nuevas herramientas/directorios, cambios de registro, borrados, preservación de controles, secretos, concurrencia, procedencia y ausencia de merge/publicación automática.
