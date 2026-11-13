# Contribuir a MiMiniApp

Guía práctica para personas y agentes de IA. Las reglas de gobierno están en [AGENTS.md](AGENTS.md) y [docs/PLANS.md](docs/PLANS.md); este documento explica cómo aplicarlas en el día a día. Si difieren, prevalecen aquellas.

> El proyecto no tiene todavía licencia (ADR-MMA-010 sigue en `Propuesta`). Hasta que se decida, no se aceptan contribuciones externas.

## Preparar el entorno

1. Instala Node 24 (≥ 24.22.1) con npm 11 (≥ 11.19.1). `.node-version` indica la versión de referencia, 24.22.2, que es la que usa CI.
2. Instala dependencias y el navegador de pruebas:

   ```sh
   npm ci
   npx --no-install playwright install chromium
   ```

3. Comprueba que todo funciona:

   ```sh
   npm run verify
   ```

Notas:

* Usa siempre `npm ci`, no `npm install`, salvo que estés cambiando dependencias a propósito.
* Las pruebas de navegador exigen el Chromium que fija Playwright. No lo sustituyas por el del sistema para dar una prueba por buena.
* En entornos con red restringida, la descarga del navegador necesita `cdn.playwright.dev` y `storage.googleapis.com`. En Claude Code en la web, el entorno `miminiapp` ya los permite.
* `npm run dev` y `npm run preview` usan `127.0.0.1:4321`.

## Ramas

| Rama | Papel |
| --- | --- |
| `staging` | Tronco de trabajo. Cada merge se publica en staging. |
| `main` | Producción. Solo recibe promociones desde `staging`; hoy bloqueadas. |
| `master` | Rama por defecto heredada. No participa en la entrega. |
| `feature/*`, `fix/*`, `docs/*` | Trabajo. Nacen de `staging` y vuelven a él por PR. |

No se hace push directo, force push ni borrado sobre `staging` o `main`.

## Flujo de un cambio

1. Crea la rama desde `staging` actualizado.
2. Haz el cambio con sus pruebas. Ejecuta `npm run verify`.
3. Abre un PR hacia `staging`. CI vuelve a ejecutar `npm run verify`.
4. Una persona con permiso revisa y fusiona con merge commit. No hay squash, rebase ni auto-merge.
5. El push del merge publica en staging y ejecuta las pruebas remotas. Comprueba el resultado en la URL.

Un agente de IA no fusiona PR ni publica por iniciativa propia, aunque CI esté en verde.

## Cuándo hace falta algo más que un PR

| El cambio… | Necesita |
| --- | --- |
| es local, reversible y está cubierto por decisiones existentes | Solo el PR. |
| elige o cambia tecnología, dependencias, contratos compartidos, persistencia, seguridad o despliegue | Una decisión aprobada en [docs/design-docs/index.md](docs/design-docs/index.md) antes de implementar. |
| afecta a varias partes, es arriesgado o difícil de revertir | Un ExecPlan aprobado y autorizado, según [docs/PLANS.md](docs/PLANS.md). |
| cambia el alcance del producto | Actualizar primero [docs/product-specs/index.md](docs/product-specs/index.md). |
| añade una miniapp | Su ficha funcional y la [guía de miniapps](docs/miniapps.md). |

En caso de duda, pregunta antes de implementar.

## Aprobaciones

Cada artefacto nombra a su responsable. Solo esa persona lo aprueba, lo autoriza o acepta su resultado.

Las dos reglas siguientes para más de un mantenedor, y la de iteraciones en paralelo, son la propuesta [H-003](docs/harness-decisions.md#h-003--colaboración-entre-varias-personas-y-documentos-vivos). Rigen desde que el propietario la ratifique.

* **Con un solo mantenedor**, una indicación expresa suya en cualquier canal es válida. Quien la recibe la registra en el artefacto con fecha y actor.
* **Con más de un mantenedor**, la aprobación debe quedar en GitHub: una revisión aprobatoria o un comentario del responsable en el PR que cambia el estado del artefacto. El artefacto enlaza ese PR. Una cita transcrita de un chat ya no basta.

Varias iteraciones pueden avanzar en paralelo si son independientes y cada una tiene su plan y su responsable. Dos iteraciones que tocan el mismo contrato se ordenan o se coordinan antes de empezar.

## Incorporar a otra persona

Lo hace el propietario, en este orden:

1. Darle acceso de escritura al repositorio.
2. Exigir al menos una aprobación en la protección de `staging` y de `main`, y activar la revisión de code owners. `.github/CODEOWNERS` ya nombra al propietario; con un solo mantenedor el requisito está a cero porque nadie puede aprobar su propio PR.
3. Si esa persona va a fusionar y publicar en staging, añadir su usuario a `maintainers` en `.github/deployment-policy.json` mediante un PR. Sin ese paso, sus merges no se publican: el gate los rechaza.

Producción, promoción y rollback siguen siendo exclusivos del propietario.

## Pruebas

| Qué cambias | Dónde van sus pruebas |
| --- | --- |
| Lógica pura | `tests/unit/` |
| Componente React de plataforma | `tests/components/` |
| Recorrido de plataforma en navegador | `tests/e2e/` |
| Una miniapp | `src/miniapps/<slug>/tests/`: `*.test.ts(x)` para Vitest, `*.spec.ts` para Playwright |
| Gate o workflows | `tests/unit/release-*.test.ts` y `workflow-safety.test.ts` |

No se omiten, desactivan ni debilitan pruebas para conseguir un verde. No hay un porcentaje de cobertura obligatorio; se cubren los criterios de aceptación y los límites del dominio.

## Evidencias

La política completa está en [docs/QUALITY_SCORE.md](docs/QUALITY_SCORE.md#política-de-evidencias). En resumen:

* Los resultados de pruebas se citan por su ejecución de GitHub Actions, no por archivos locales.
* `.local/` está ignorado por Git: nada de lo que hay ahí es evidencia para otra persona.
* Solo se versionan las capturas que alguien necesita para aprobar un cambio visual, pocas y ligeras.

## Cambios delicados

* **`ci.yml`.** El gate lo fija por hash. Si lo cambias, actualiza `CI_WORKFLOW_BLOB_SHA` en `scripts/release/pr-ci.ts` con `git hash-object .github/workflows/ci.yml`; `npm run test:unit` falla si no coinciden.
* **`scripts/release/` y los demás workflows.** Son el control de qué se publica. Todo cambio lleva pruebas y revisión del propietario.
* **Dependencias.** Versiones directas exactas y un solo lockfile. Añadir o sustituir una dependencia relevante es una decisión técnica.
* **Secretos.** Nunca en el repositorio, en la documentación, en capturas ni en el chat.

## Estilo

* `npm run lint` y `npm run format:check` deben pasar. Prettier decide el formato del código.
* La documentación del proyecto se escribe en español. El código, los nombres de pruebas y los mensajes de commit, en inglés.
* Los documentos vivos (README, ARCHITECTURE, roadmap, guías) describen el presente. La historia va en los planes de ejecución y sus informes.
* Mensajes de commit con prefijo convencional: `feat:`, `fix:`, `docs:`, `test:`, `ci:`, `chore:`.
