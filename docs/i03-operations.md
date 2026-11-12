# Operación I-03 — staging mediante GitHub Actions

**Actualizado:** 2026-11-07 (Europe/Madrid). **Staging:** `Verificado`. **I-03:** `En curso`, sin aceptación global. Este PR es documental: Codex no lo fusiona, despliega o cambia infraestructura.

## Resultado comprobado

MiMiniApp está publicada en [staging](https://miminiapp-staging.miminiapp-lab.workers.dev). PR #4 fue fusionado por el propietario en `e1e3b6596f97b86ba7e2ff3d21aab1ac5e21e0c0`. El [run 42305409224, intento 4](https://github.com/aalexlpez/miminiapp/actions/runs/42305409224/attempts/4) terminó success, con prepare y remote-test satisfactorios. El propietario confirma 12 archivos publicados y 30 pruebas remotas correctas. El [informe de staging](i03-staging-preparation-report.md) distingue confirmación humana, lecturas API, artefactos y límites.

## Responsabilidades y credenciales

El propietario administra Cloudflare y las credenciales guardadas en GitHub Environment `staging`: secreto `CLOUDFLARE_API_TOKEN` (Editor account-owned restringido al Worker) y variable `CLOUDFLARE_ACCOUNT_ID`. Mantiene también la autorización de publicación específica existente. No debe recrear Worker, secreto o token en cada release ordinaria.

Codex desarrolla, prueba y prepara ramas/PR autorizados. GitHub Actions verifica, construye, publica y ejecuta pruebas remotas. **Codex no necesita conectividad o credenciales Cloudflare.** No copiar tokens al chat, repositorio, CI de PR, entorno de Codex o producción. El antiguo requisito CLOUDFLARE_BOOTSTRAP_API_TOKEN en Codex quedó obsoleto; no se usa Admin, OAuth o Workers Scripts: Edit general como sustituto.

## Publicaciones ordinarias de staging

**Feature → PR a staging → CI → revisión y merge manual → Actions → Cloudflare → pruebas remotas.**

1. Trabajar en una rama feature y ejecutar las pruebas pertinentes. Abrir PR hacia staging. No hacer push directo, force push o borrado de ramas protegidas.
2. Exigir quality satisfactorio sobre el contenido actual; resolver fallos sin desactivar controles. El CI de PR no dispone de secretos Cloudflare ni publica.
3. El propietario revisa el diff y decide el merge manual con merge commit. No hay auto-merge, segunda cuenta o aprobación independiente. Mantener PR obligatorio, strict=true y restricciones existentes.
4. El push del merge protegido inicia Actions automáticamente. Prepare confirma autorización, repositorio/ref/actor, PR realmente fusionado y CI persistente; ejecuta verify y empaqueta el build probado una sola vez.
5. Bajo el bloqueo de publicación, remote-test descarga el artefacto por ID/digest, comprueba manifiesto/hashes y vigencia, ejecuta el probe, vuelve a comprobar autorización y llama a Wrangler sobre el Worker staging existente. No hay comando manual de deploy semanal ni otra aprobación del Environment.
6. Actions comprueba identidad servida y ejecuta las pruebas remotas. Solo después de su éxito crea el recibo vinculado a artefacto, run e intento. El propietario abre la URL, revisa el resultado y conserva el enlace al run/recibo en el PR o entrega.

La variable de repositorio I03_STAGING_PUBLICATION_AUTHORIZED forma parte de la configuración ya utilizada; este PR no la consulta o cambia. Si falta autorización, gates, credencial o prueba, no se declara una release verificada. No volver a aplicar el parche histórico de activación ni configurar un segundo publicador.

## Probe y límites de seguridad

El intento 4 acreditó lectura de staging y denegación de lectura del otro Worker (403), según confirmación del propietario y paso satisfactorio de Actions. Ese 403 es la comprobación negativa esperada; **no prueba aislamiento de escritura**. Un 404 sería inconcluso y tampoco demostraría scope correcto. Se mantiene writeIsolation=not-tested; no se ejecuta ninguna modificación contra producción para completarlo en este PR.

Solo probe/publish reciben el secreto del Environment, después de los gates; nunca PR, instalación, build o env global. La cuenta y el destino siguen fijados. Un fallo del probe detiene Wrangler y no autoriza ampliar permisos. La identidad PR–CI usa el [contrato ya implementado](i03-pr-ci-identity.md), conservando merge real y relecturas de vigencia.

## GitHub e historial conservados

Staging contiene el merge e1e3b65; main conserva 73b8bd2 y master 214a3c1 sigue predeterminada. I-01/I-02 y el historial se preservan. Staging exige quality; main quality+promotion de GitHub Actions app 15368, para todos. Solo merge commits, sin squash/rebase/auto-merge. Environments separados por rama, sin reviewers o espera según las comprobaciones de Fase A.

PR obligatorio, cero approvals, strict=true y prohibiciones de bypass/force/delete conservan la confirmación del propietario y las limitaciones de lectura administrativa 403. No se presenta esta documentación como un nuevo ensayo negativo de todos los controles ni como auditoría de valores secretos. Las plantillas de deploy/github no sustituyen una comprobación real.

## Pendientes y recuperación

Producción, promoción y rollback permanecen bloqueados y no se ejecutan. También quedan pendientes el ensayo de aislamiento de escritura, las verificaciones completas entre entornos, los casos de timeout/estado activo e IDs Cloudflare no documentados, y la aceptación global de I-03. No se cambia la rama predeterminada.

Ante un fallo de prepare/probe, no forzar el gate ni sustituir credenciales por permisos generales. Ante error o timeout de Wrangler, no asumir ausencia de efectos: el propietario comprueba el estado servido antes de decidir. Un fallo de pruebas remotas no se convierte en éxito y no dispara rollback automático. El ensayo manual excepcional de rollback requiere su autorización; master no contiene su dispatch y no se promete un botón operativo.

Retención existente: evidencia de acceso/fallos 7 días y candidatos/recibos 30 días. No promover artefactos expirados. Objetivo de gasto 0 USD/mes sujeto a cuotas reales; no se añaden servicios. Si se incorpora otro colaborador, las reviews obligatorias se configuran mediante protecciones sin rediseñar workflows.
