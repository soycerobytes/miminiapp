# Promoción de staging a producción

## Alcance y estado

Origen: `aalexlpez/miminiapp` (1445849027), staging. Destino: `soycerobytes/miminiapp` (1455524397), main. ADR-MMA-020 y PR-01 autorizan la implementación y su entrega mediante PR, con CI ligero de producción. Los workflows no estarán instalados hasta integrar el PR de configuración. Los tests locales y de API simulada no demuestran todavía el ruleset ni la asociación del check en un PR real generado por el bot.

El historial de origen no se importa: cada release crea un commit cuyo único padre es main de destino. SHA/run/hashes son datos de procedencia. Las menciones al origen en ellos y en documentación histórica son intencionadas. Workers Builds reconstruye la fuente autorizada; no se afirma equivalencia binaria con el artefacto de staging.

## Instalación inicial

1. Revisar el PR de configuración y esperar quality. Es un PR normal, que instala por primera vez los controles y no necesita procedencia de release.
2. Confirmar Settings → Actions → General → permiso para crear PR desde Actions. Mantener permisos generales de lectura. Solo el job prepare tiene contents/pull-requests/actions write; actions write permite solicitar explícitamente CI para el PR creado por el bot. Sus pruebas nunca reciben ese token de escritura.
3. Revisar personalmente en Cloudflare: repositorio de producción, rama main, build `npm run build`, comando existente para `deploy/cloudflare/production.jsonc` y previews desactivadas para release si preparar no debe publicar. Estos cambios no configuran recursos, DNS ni credenciales.
4. Hacer merge manual del PR de configuración cuando se quiera instalar. También este merge puede disparar Workers Builds: no se promete instalación en main sin publicación.
5. Probar una preparación con un cambio real de aplicación validado en staging. Si la aplicación ya coincide con producción, termina sin crear un PR vacío. No modificar staging artificialmente desde producción para forzar la prueba.
6. Comprobar que el PR generado tiene quality asociado a su commit actual y que valida evidencia y transferencia sin repetir pruebas funcionales. Solo entonces exigir quality de GitHub Actions y rama actualizada en el ruleset. No conservar promotion como check obligatorio: su control ahora forma parte de quality. No relajar PR obligatorio ni prohibiciones de force push/borrado para instalarlo.

Si quality no aparece o no se asocia al PR, no fusionar. El ensayo remoto es condición de cierre de PR-01, no una consecuencia demostrada por los tests locales.

## Publicación habitual

1. Desarrollar y probar normalmente en staging. Este repositorio no escucha sus pushes.
2. Copiar el SHA completo de 40 caracteres de la versión publicada en staging.
3. En producción → Actions → Prepare release from staging → Run workflow, elegir main e introducir staging_sha.
4. inspect valida identidad de repositorios, SHA/tree, workflow fijado, último run/intento, jobs/pasos verify y pruebas remotas, y manifiesto HTTPS servido. prepare repite las comprobaciones y contrasta el fingerprint independiente.
5. Se crea release/<SHA corto>-<run>-<intento>, un commit propio y un PR. No se sobrescriben ramas existentes ni se hace merge. Se preservan los controles propios de producción.
6. Se solicita CI mediante workflow_dispatch en la rama release. No se depende de que un PR abierto con GITHUB_TOKEN dispare pull_request. El disparador pull_request solo atiende rutas propias de configuración/documentación del destino; excluye expresamente .github/release-provenance.json. Así la release no crea otra ejecución pendiente de aprobación.
7. quality usa controles de la base confiable y valida evidencia de staging, proyección/procedencia, configuración preservada y refs. Para releases no instala dependencias ni ejecuta tests de aplicación: la batería completa ya pasó en staging. Los PR de configuración comprueban lint/formato y los tests propios de los controles. No usa secretos Cloudflare.
8. Revisar Files changed y checks; hacer merge manual cuando se quiera publicar. Workers Builds inicia entonces la publicación. Actions no despliega.

No se añade un manifiesto ficticio de staging al build de producción ni se atribuyen pruebas remotas de producción que no se hayan ejecutado.

## Archivos y miniapps

`.github/promotion-policy.json` enumera rutas exactas. No utiliza globs src/** o public/** que autoricen archivos futuros. Incluye plataforma, recursos revisados, toolchain y pruebas de aplicación. Altas/modificaciones/borrados se gestionan solo dentro de esa lista.

Se preservan workflows, políticas, deploy/, scripts/release/, scripts/promotion/, pruebas de seguridad de destino y documentos de gobierno. Se rechazan .env, paths inseguros, symlinks y submódulos. Los bytes importados modificados se contrastan con su hash Git y se rechazan patrones conocidos de claves privadas/tokens; .npmrc solo admite opciones no secretas revisadas. Esto no certifica la ausencia de cualquier secreto arbitrario escrito dentro de código: revisar el diff sigue siendo necesario.

El catálogo autorizado está vacío. registryBlob fija el registro vacío revisado y esta primera versión rechaza miniapps no vacía. El alta real de la primera herramienta necesitará su aprobación, ampliación explícita de archivos/recursos, implementación y tests de autorización. Marcar published en staging no basta.

Si cambia staging.yml del origen, revisar el cambio antes de actualizar workflowBlob. Nunca aceptar automáticamente el nuevo hash. Los fixtures source-release conservan contratos históricos; production-workflow-safety audita todos los workflows reales del destino.

## Fallos y recuperación

* SHA antiguo/no publicado: seleccionar el que staging sirve ahora. No reutilizar un run verde antiguo frente a un intento posterior fallido o pendiente.
* Cambios concurrentes de staging/main/evidencia: preparar de nuevo y cerrar el PR obsoleto tras revisarlo. Un merge de actualización en la rama release rompe el contrato de un único commit; volver a prepararla.
* Archivo nuevo: revisar su finalidad y actualizar la lista mediante PR. No ampliar a una carpeta entera para evitar el rechazo.
* Sin delta: no se crea PR vacío; esperar un cambio auténtico autorizado en staging.
* Rama creada pero PR/dispatch fallido: el workflow falla y no fusiona nada. Revisar lo creado. Un rerun usa otro sufijo de intento sin sobrescribir ramas. Si solo falló dispatch, ejecutar CI manualmente eligiendo la rama release y su número de PR exactos.
* Límite API pública o fallo de red: fallar sin publicar y reintentar cuando se recupere. El token del destino no se envía al origen; no se necesita un PAT amplio.
* Build de Cloudflare fallido: consultar su ejecución real; no activar los publicadores antiguos de Actions.
* Revertir producción: PR normal que revierta el merge correspondiente, quality y merge humano. Se añade historial de reversión y Workers Builds vuelve a publicar. Nunca reset/force push. El preparador solo admite staging actualmente publicado, no un SHA histórico arbitrario.

## Verificaciones de desarrollo de estos controles

Los comandos siguientes sirven para validar cambios de implementación localmente. No se ejecutan de nuevo por cada release en producción. Para cambios propios de configuración, el CI remoto ejecuta solo lint, formato y las pruebas unitarias de production-promotion y production-workflow-safety.

Usar Node 24.22.2, npm 11.19.1 y Chromium fijado por el lockfile:

```sh
npm ci
npx --no-install playwright install chromium
npm run verify
```

En entornos sin escritura en el perfil, fijar ASTRO_TELEMETRY_DISABLED=1 y ubicar caché npm/PLAYWRIGHT_BROWSERS_PATH dentro del workspace.

`node scripts/promotion/cli.ts inspect` requiere workflow_dispatch real en main, STAGING_SHA y token de lectura de destino: no escribe. prepare es la operación de escritura, reservada a su job. Los tests simulan ambas, verifican ausencia de merge/publicación y ascendencia independiente, y comprueban el gate de PR. El ensayo remoto sigue siendo necesario.

## Una ejecución por release

El workflow explícito de la release emite quality sin aprobación adicional de otra ejecución. El CI automático por pull_request se filtra a controles/documentación propios del destino. La política de importación rechaza esas rutas, de modo que una release válida solo modifica archivos de aplicación autorizados y .github/release-provenance.json (excluido del disparador automático). Se comprueba que los filtros YAML y la frontera de importación coincidan.

Las modificaciones de aplicación y toolchain se desarrollan en staging y llegan a main mediante la preparación de releases. Un PR manual que solo cambie archivos de aplicación no activa el CI de configuración: debe usar el circuito de staging/release, no fusionarse por ausencia de un check. Cuando quality sea obligatorio, ese PR manual quedará pendiente de la validación exigida. Los PR de controles o documentación siguen comprobándose automáticamente. No cambiar la política de aprobaciones de GitHub para solucionar esta duplicidad.

El fallo histórico `43423516599` fue una ejecución adicional por pull_request cuya aprobación caducó sin jobs. La ejecución explícita `43423512618` y la publicación de d5e93fed fueron satisfactorias. No reejecutar el run histórico del PR ya fusionado: el verificador exige un PR abierto y su head/base vigentes. La corrección debe comprobarse con la próxima release real después de instalar el ajuste.
