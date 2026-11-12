# I-03 — informe de staging: preparación y primera publicación

**Actualizado:** 2026-11-07 (Europe/Madrid). **Hito de staging:** `Verificado`. **ExecPlan I-03:** `En curso`, sin verificación ni aceptación global. El propietario autoriza solo este PR documental; no fusionarlo, publicar o modificar infraestructura.

## Primera publicación real satisfactoria

URL: [MiMiniApp staging](https://miminiapp-staging.miminiapp-lab.workers.dev). Repositorio: `aalexlpez/miminiapp`.

| Evidencia | Resultado y origen |
| --- | --- |
| PR de corrección | [#4](https://github.com/aalexlpez/miminiapp/pull/4) fusionado por aalexlpez; API merged=true. |
| Commit publicado | `e1e3b6596f97b86ba7e2ff3d21aab1ac5e21e0c0`, en staging. El head del PR/CI es ead0f834; se distingue del commit integrado. |
| Ejecución | [Run42305409224, intento4](https://github.com/aalexlpez/miminiapp/actions/runs/42305409224/attempts/4), evento push, workflow staging.yml, completed/success. |
| Jobs | prepare128214029212 y remote-test128214689004: success, ambos intento4, corroborado por API. |
| Circuito real | Gates de merge, verify, paquete, descarga/verificación de artefacto, probe, publicación, pruebas remotas y recibo: pasos success por API. |
| Publicación y pruebas | El propietario confirma Wrangler con12 archivos y30 pruebas remotas satisfactorias: identidad del artefacto, ES/EN, rutas, responsive y accesibilidad. El paso de prueba remota figura success por API. |
| Probe | El propietario confirma lectura de staging y denegación de lectura del otro Worker403. El paso del probe figura success por API. `writeIsolation=not-tested`; ese403 no prueba aislamiento de escritura ni existencia/publicación de producción. |

El intento4 finalizó el 7 de noviembre en horario Europe/Madrid (API updated_at2026-11-06T23:26:42Z). Solo se atribuye éxito a ese intento; los intentos anteriores conservan sus resultados.

## Artefactos del intento4

Metadatos corroborados por API, no expirados al preparar este informe:

| Artefacto | ID | Digest SHA-256 del archivo |
| --- | --- | --- |
| release-candidate-e1e3b6596f97b86ba7e2ff3d21aab1ac5e21e0c0-4 | 13548487963 | `8f7d68df397319a8a3743c019e5edc8d2d2ad81973653d625b8bc814234d4867` |
| staging-access-42305409224-4 | 13548562894 | `463225d604c8b868ebb566b3a44ebbc0ed04067be62f25c3f0079506d0e27dff` |
| staging-validation-e1e3b6596f97b86ba7e2ff3d21aab1ac5e21e0c0-4 | 13548901674 | `febe55b57e8d95f6bcd056e33a9c43e37fbc864091c3f7c25efa24e32e01f54b` |

Retención existente: acceso7 días; candidato/recibo30 días. Los digests anteriores son los del archivo de Actions; no se confunden con el hash del payload o con un version ID de Cloudflare. No se inventan IDs de versión/deployment del proveedor.

Lecturas reproducibles sin desplegar:

```sh
gh api repos/aalexlpez/miminiapp/pulls/4
gh api repos/aalexlpez/miminiapp/actions/runs/42305409224/attempts/4
gh api repos/aalexlpez/miminiapp/actions/runs/42305409224/attempts/4/jobs
gh api 'repos/aalexlpez/miminiapp/actions/runs/42305409224/artifacts?per_page=100'
```

Codex ha corroborado PR/run/jobs/pasos y metadatos de artefactos. Esta sesión no descargó logs o contenidos ZIP; los recuentos12/30, contenido funcional comprobado y403 se registran también como evidencia expresamente confirmada por el propietario. No se ha vuelto a probar o desplegar la web desde Codex. Evidencia local saneada e ignorada: `.local/verification/i03/staging-documentation/deployment-evidence.json`.

La persistencia real de la identidad PR–CI tras el merge ya está comprobada: [CI42303556241](https://github.com/aalexlpez/miminiapp/actions/runs/42303556241) conserva el título versionado de PR4/head ead0f834 mientras pull_requests está vacío; el gate del despliegue completó satisfactoriamente su comprobación. Sustituye la anterior limitación de prueba solo simulada de ese punto.

## Estado parcial de I-03 y pendientes

| Criterio | Alcance acreditado o pendiente |
| --- | --- |
| AC1 | Inventario de staging y responsables actualizado; resto de entornos/capacidades con sus pendientes. |
| AC2 | CI y verify de prepare satisfactorios, herramientas fijadas conservadas. |
| AC3 | Merge manual del propietario observado; siguen los límites administrativos y ensayos negativos de protecciones pendientes. |
| AC4 | Lectura positiva y denegación403 observadas; aislamiento de escritura y credencial/Worker de producción pendientes. |
| AC5 | Identidad publicada de staging verificada; falta demostrar separación/producción intacta en el alcance completo. |
| AC6 | Automatismo e identidad de staging verificados; no se atribuyen IDs de proveedor no registrados o ensayos de timeout. |
| AC7 | Verificado para staging:30 pruebas remotas satisfactorias. |
| AC8 | Main conserva strict=true; demostraciones/promociones y autorización para cualquier sustitución siguen pendientes. |
| AC9–10 | Promoción, producción y smoke de producción pendientes y bloqueados. |
| AC11 | Rollback manual excepcional y su ensayo pendientes; no hay rollback automático. |
| AC12 | Guía actualizada; aceptación completa del propietario pendiente. |

El propietario administra cuenta Cloudflare y credenciales en GitHub Environment staging; Codex desarrolla/prueba/prepara PR y no necesita conectividad o secretos Cloudflare. Actions publica y verifica. No se cambian reglas, permisos, secretos, variable de autorización, ramas protegidas o predeterminada por este trabajo. Master permanece predeterminada; producción, promoción y rollback siguen bloqueados. Los límites de lectura administrativa403 de Fase A se conservan.

Flujo operativo comprobado: **feature → PR a staging → CI → revisión y merge manual del propietario → Actions → Cloudflare staging → pruebas remotas y recibo**. El detalle está en la [guía operativa](i03-operations.md) y la [puesta en marcha](i03-staging-startup.md). No hace falta ejecutar Wrangler o renovar credenciales en cada publicación ordinaria.

La verificación de este PR documental es coherencia de estado, enlaces y diff limitado a Markdown, con el CI obligatorio del PR. No se repiten manualmente las pruebas de aplicación ya satisfactorias ni se modifica arquitectura. La propuesta de primera miniherramienta se entrega por separado, sin implementarla ni incluirla en este PR de infraestructura.

## Historial de preparación — 2026-11-06

Las secciones siguientes conservan las evidencias y autorizaciones de la preparación original. Sus ramas, bloqueos y frases de futuro son snapshots históricos; el estado vigente es el hito Verificado documentado arriba.

### Situación y alcance

El propietario declara creado `miminiapp-staging` con la plantilla básica de Cloudflare y configurados el Editor restringido y Account ID en GitHub Environment `staging`. Administra Cloudflare y los valores de credenciales. Codex no los solicita, no se conecta a Cloudflare y prepara los cambios en `feature/i03-staging-first-release` para un PR a `staging`.

Se consultó GitHub, sin alterar sus configuraciones: main/staging siguen protegidas en `73b8bd2`, con quality+promotion/quality respectivamente, app15368 y enforcement everyone; master sigue en214a3c1 y predeterminada. Merge commits habilitados, squash/rebase/auto-merge deshabilitados; ambos Environments existen con políticas de ramas personalizadas. La comprobación de lectura de Cloudflare no se ha ejecutado todavía. Las limitaciones administrativas anteriores no desaparecen por esta preparación.

La preparación anterior de bootstrap administrativo de Codex se conserva fuera del PR en `.local/verification/i03/superseded-b1/`, con copia y hashes comprobados antes de retirar sus archivos no utilizados. No se publicó ese contenido. No se añade un Admin a GitHub ni se necesita un secreto Cloudflare en Codex.

### Cambios de seguridad

* Se añade `deploymentsEnabled` por destino. Tras aplicar el parche aprobado, solo staging y la política global quedan habilitados de forma condicionada en la rama del PR (`phase=B`); producción, promoción y rollback siguen false. La variable específica y el merge no están autorizados: las ramas protegidas conservan la política anterior cerrada.
* El flag de staging pasa a ser `I03_STAGING_PUBLICATION_AUTHORIZED`, de repositorio. El antiguo flag global no se acepta como sustituto. La cuenta aprobada queda fijada por hash y se compara antes de cualquier petición Cloudflare; Worker y origen siguen fijados por contrato.
* Los dos jobs de staging exigen push a staging, repositorio correcto y la variable específica exactamente true; el publicador depende además del éxito de prepare. No hay evento PR o dispatch para ese workflow. Producción y rollback siguen con `if: false`. El check obligatorio promotion ejecuta un rechazo explícito, sin un skip que pueda aparecer verde.
* Antes de credenciales o artefactos, la publicación exige contexto GitHub Actions, push al ref exacto, repositorio/ID, actor/triggering actor propietario y run/SHA válidos. Después se comprueba por API el PR realmente fusionado, su merger, calidad y vigencia. PR sin merge, fork, feature, dispatch o run obsoleto no habilitan escritura.
* Se conservan CI completo, Chromium fijado, build probado, paquete inmutable, IDs/digests/hashes, revalidación bajo bloqueo compartido y E2E remotos antes del recibo. El Worker debe existir: el publicador no crea recursos de bootstrap.

### Comprobación del Editor preparada para Actions

El cliente solo emite GET a la API de la cuenta fijada: settings y workers.dev del Worker staging, verificación del token cuando está disponible y settings del nombre fijo `miminiapp` como comprobación negativa. No crea producción, cambia permisos, lista recursos arbitrarios o escribe en otro Worker. Un acceso legible al otro Worker o errores de autenticación/servicio bloquean la publicación.

El informe saneado distingue acceso a staging, respuesta de la comprobación negativa, scope declarado por el propietario y `writeIsolation=not-tested`. Un 404 no acredita aislamiento y un 403 de lectura no acredita denegación de escritura. Las limitaciones de introspección no se solucionan concediendo permisos de administración. Esta prueba no puede certificar por sí sola toda la exclusividad del token; el alcance Editor por Worker parte de la configuración atestada por el propietario.

Los secretos se entregan exclusivamente a los pasos probe y publish del Environment staging, después de los gates y la verificación del artefacto; no a PR, build, instalación o variables globales. El JSON omite token, token ID, Account ID, headers y cuerpos sin filtrar. Se conserva siete días como artefacto. Wrangler mantiene sanitización de logs y no usa OAuth.

La prueba real se ejecutará en Actions tras un merge protegido expresamente autorizado y antes de escribir. No se promete acceso al secreto desde un PR abierto: impedirlo forma parte del control. No se ha ejecutado ningún deploy ni prueba real de permisos Cloudflare durante la preparación.

### Verificación inicial, anterior a aplicar el parche

Evidencia local ignorada: `.local/verification/i03/staging-first-release/`.

| Comprobación | Resultado |
| --- | --- |
| `npm run verify` | Exit0: tipos, lint, formato, validación offline de hosting, unitarias, componentes, build, E2E/axe e integración. |
| Tipos | 61 archivos, cero errores, warnings o hints. |
| Unitarias | 226 satisfactorias: contratos de acceso de solo lectura, no filtrado de credenciales, cuenta/destino, flags separados, contexto PR/ref/actor y auditoría de workflows/artefactos. |
| Componentes y E2E | 9 componentes y 26 E2E satisfactorias con Chromium fijado; integración modular y regresión I-01 correctas. |
| Build público | 12 archivos; sin fixtures/borradores. La traducción incompleta se rechaza en la integración. |
| Parche propuesto en la preparación inicial | Aplicado entonces solo en una copia temporal para comprobar la futura configuración: 226 unitarias satisfactorias. La aprobación posterior autoriza aplicarlo a la misma rama del PR #3. |
| Alcance del parche | Prueba automatizada verifica delta exacto: únicamente tres campos de política, los dos if de staging y una expectativa explícita de la auditoría. Producción/promoción/rollback y todos los demás pasos permanecen iguales. |
| Revisión independiente | Corregidos pin de cuenta, manejo de401, conservación de evidencia saneada y validación exacta del delta de workflow. La compilación detectó y se corrigió un argumento de hash faltante antes de la batería completa satisfactoria. |

La expectativa del test nativo del probe admite tanto el rechazo por política cerrada como el rechazo por contexto no autorizado: ambos ocurren antes de usar credenciales/red. Tras ese ajuste se ejecutó la batería unitaria con la configuración futura en la copia temporal. La aplicación, dependencias y configuración ordinaria de hosting no se cambian.

### Límite durante la preparación original

El propietario aprobó expresamente aplicar el [parche de activación](staging-publication-activation.patch), volver a probar y actualizar el PR #3. Ya está aplicado en su misma rama; se conserva el archivo como evidencia histórica. No se configura la variable `I03_STAGING_PUBLICATION_AUTHORIZED=true`, no se fusiona y no se ejecuta ningún despliegue. El [procedimiento](i03-staging-startup.md) exige entregar diff, commit y nuevo CI para revisión, y esperar otra autorización expresa de la primera publicación antes de variable y merge manual. Solo ese merge protegido a staging puede disparar el circuito; aplicar el parche en una feature no lo dispara.

El PR se entrega en borrador. Antes del merge el propietario deberá pasarlo a listo para revisión y conservar las protecciones. Un fallo o timeout no autoriza rollback automático ni ampliación de permisos; se registra el estado y el propietario revisa Cloudflare. Los IDs del PR y los resultados remotos efectivamente observados se presentan al entregar; no se inventan pruebas de permisos, despliegue o identidad HTTP de la plantilla/web.

### PR y CI observados durante la preparación

PR [#3](https://github.com/aalexlpez/miminiapp/pull/3) abierto en borrador hacia staging, sin merge. El primer CI del código `8e822278faf51872b97f27be43a36e6c8a050f99` pasó en [run42259685654](https://github.com/aalexlpez/miminiapp/actions/runs/42259685654), evento pull_request, quality de GitHub Actions app15368. La entrega y descripción del PR registran también el resultado de su último head.

Antes de la aprobación del parche se reforzó el test nativo para forzar el evento pull_request: así no hereda por accidente el contexto válido de un futuro push protegido. Sus cinco casos pasaron; la copia con el parche futuro y contexto simulado de Actions push a staging también pasó las226 unitarias, sin peticiones reales. Ese ajuste anterior no modificó código de publicación ni aplicó el parche a la rama.

### Preparación técnica de activación aprobada — 2026-11-06

Se aplicó el parche con `git apply --check` y `git apply` sobre `f667890`, en `feature/i03-staging-first-release`. El diff de política y workflow coincide exactamente con el parche aprobado: tres campos de política y dos condiciones de jobs. No cambia ningún paso, credencial, permiso, herramienta, aplicación o configuración Cloudflare. La expectativa de auditoría pasa al modo condicionado aprobado y se refuerzan las pruebas asociadas, sin retirar los controles existentes.

Se añaden siete casos de flags ausentes o no exactamente true y siete mutaciones negativas de workflows: ignorar fallo del job/probe/publicación o introducir always()/failure() en probe/publicación. La auditoría fija éxito previo por defecto, ausencia de continue-on-error y probe anterior a publish. El paso de evidencia con always() no borra el fallo previo. El publicador vuelve a esperar el probe interno antes de invocar Wrangler; no se modifica ese código.

Revisión independiente sin bloqueos funcionales detectados. Se conserva el límite del probe: solo lectura; 403 acredita denegación de ese GET, 404 es inconcluso y `writeIsolation=not-tested`. No se han comprobado credenciales reales ni aislamiento de escritura desde este PR.

Lectura API actual: PR #3 abierto, en borrador, sin merge; main/staging en73b8bd2, quality+promotion/quality respectivamente, app15368 y enforcement everyone. Master permanece214a3c1 y predeterminada. Solo merge commits; squash/rebase/auto-merge desactivados. Los Environments permiten exclusivamente staging/main, sin reviewers o espera; listado de deployments vacío. No se alteran configuraciones, variables, secretos o protecciones. Se conserva la limitación administrativa403 de la Fase A, sin afirmar que se haya releído strict o los valores secretos.

Evidencias de esta actualización: `.local/verification/i03/staging-activation/` (ignoradas). El primer intento completo se detuvo en formato de una prueba nueva; se aplicó Prettier antes de repetir la batería. Resultado final de `npm run verify`: exit0, 61 archivos sin errores/warnings/hints, lint/formato/hosting correctos, 240 unitarias, 9 componentes y 26 E2E satisfactorias, integración modular y regresión I-01 correctas. Chromium156.0.8078.4, revisión1248, resuelto desde la caché fijada sin channel/executablePath del sistema. El build público conserva12 archivos y excluye fixtures/borradores. `git diff --check` correcto.

`patch-scope.json` registra la reconstrucción del parche desde el head anterior y comparación byte a byte: política y staging.yml coinciden exactamente; production.yml, promotion.yml y rollback.yml permanecen idénticos. No hay cambios de aplicación, dependencias o lockfile ni archivos temporales versionados. El CI del nuevo commit se registra en el PR y en la entrega después de observar su resultado, sin atribuirle anticipadamente un estado.
