# I-03 — primera publicación y operación de staging

**Actualizado:** 2026-11-07 (Europe/Madrid). **Hito staging:** `Verificado`. **I-03:** `En curso`, sin aceptación completa. La primera publicación ya terminó; no repetir el bootstrap o el parche de activación.

## Primera publicación completada

- URL real: https://miminiapp-staging.miminiapp-lab.workers.dev.
- PR #4 fusionado por el propietario; merge `e1e3b6596f97b86ba7e2ff3d21aab1ac5e21e0c0`.
- [Run 42305409224, intento 4](https://github.com/aalexlpez/miminiapp/actions/runs/42305409224/attempts/4): prepare y remote-test success.
- El propietario confirma Wrangler con 12 archivos, 30 pruebas remotas satisfactorias e identidad, ES/EN, responsive y accesibilidad verificados.
- Probe: lectura de staging y denegación de lectura del otro Worker (403); aislamiento de escritura no probado.

El [informe existente](i03-staging-preparation-report.md) conserva metadatos de artefactos, origen de cada evidencia y la historia del primer intento fallido/corrección. El [contrato PR–CI](i03-pr-ci-identity.md) ya está fusionado y funcionó después del merge; la prueba posterior dejó de ser únicamente un replay.

## Lo que ya está preparado

El propietario creó el Worker y administra el Editor restringido y Account ID en GitHub Environment staging. Codex prepara código, pruebas y PR; Actions realiza las llamadas Cloudflare. No se solicitan tokens en chat ni se requiere red o credencial Cloudflare en Codex.

El parche docs/staging-publication-activation.patch es evidencia histórica ya aplicada. La política y autorización específica de staging permitieron el intento satisfactorio; no hay que aplicarlas otra vez en cada release. Producción, promoción y rollback conservan sus bloqueos.

## Procedimiento que funcionó

1. Rama feature → PR a staging, sin push directo.
2. CI obligatorio y revisión del contenido actual por el propietario.
3. Merge manual con merge commit, conservando strict y protecciones; sin auto-merge o aprobación extra del deployment.
4. Actions verifica autorización y merge real, ejecuta verify y empaqueta el build probado.
5. El job del Environment staging comprueba ID/digest/manifiesto/hashes y vigencia bajo el bloqueo compartido; el probe debe pasar antes de Wrangler y se repite en el publicador.
6. Wrangler publica en el Worker staging existente; Actions comprueba identidad y ejecuta la suite remota. Solo su éxito permite el recibo.
7. El propietario abre staging, valida la entrega y conserva la evidencia del run/intento/artefacto.

La [guía operativa](i03-operations.md) reúne responsabilidades, mantenimiento y fallos. El procedimiento ordinario no exige un despliegue manual semanal. Un PR abierto o rama no autorizada no publica; el merge del propietario es el control humano. Esta documentación no autoriza a Codex a realizarlo.

## Límites y pendientes

El 403 observado prueba esa denegación de lectura; no prueba denegación de escritura. El ensayo de escritura entre Workers sigue pendiente, sin ampliar permisos. No se crean recursos o credenciales de producción. Promoción, producción, rollback y sus ensayos, capacidades administrativas no acreditadas y aceptación global de I-03 continúan pendientes.

Ante un fallo, registrar el run/intento exacto; no forzar gates o usar otro navegador/token como alternativa automática. Si hubo una escritura o timeout, el propietario comprueba la identidad realmente servida antes de decidir otra operación. No hay rollback automático. Las retenciones siguen siendo 7/30 días según el tipo de evidencia.

El PR actual es exclusivamente documental, hacia staging, con sus checks habituales; no cambia frontend, workflows, política, permisos, secretos o infraestructura y no lo fusiona Codex.
