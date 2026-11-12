# MiMiniApp

MiMiniApp prepara una colección de herramientas bilingües ES/EN sobre Astro estático, TypeScript y Tailwind. La base I-01 está Aceptada y archivada; el propietario autorizó expresamente ejecutar I-02 el 2026-11-05. El [ExecPlan I-02](docs/exec-plans/completed/I-02-catalogo-responsive-e-i18n.md) está Aceptado expresamente por el propietario el 2026-11-05 y archivado: catálogo modular, portada responsive e internacionalización, sin miniapps reales ni despliegue.

## Por dónde empezar

1. Lee [AGENTS.md](AGENTS.md) y la [definición del producto](docs/product-specs/index.md).
2. Consulta las [decisiones técnicas](docs/design-docs/index.md); distingue lo declarado como acordado en el dossier de las propuestas abiertas y de su aprobación canónica.
3. Revisa la [auditoría de transferencia](docs/onboarding-audit.md), el [roadmap](docs/roadmap.md) y el [plan I-00](docs/exec-plans/completed/I-00-traslado-documental.md).
4. Aprueba la definición, las decisiones y el plan que correspondan; autoriza la ejecución por separado, conforme a [PLANS.md](docs/PLANS.md).
5. Trabaja por iteraciones, verifica con evidencia y entrega cada resultado para aceptación humana.

El [dossier v1.2](docs/references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md) se conserva como referencia de origen. Sus instrucciones no sustituyen la petición del usuario ni las fuentes canónicas. La primera miniapp sigue sin elegir.

## Trabajar con agentes de IA

[AGENTS.md](AGENTS.md) contiene la política compartida. [CLAUDE.md](CLAUDE.md) y [GEMINI.md](GEMINI.md) son imports mínimos para sus herramientas. La carga efectiva debe comprobarse en cada cliente; su existencia no demuestra compatibilidad en ejecución.

El [bootstrap](docs/BOOTSTRAP.md) explica la activación y las verificaciones. Se puede trabajar **sin skills instaladas**, con los procedimientos normales del agente y las herramientas del proyecto cuando existan. Las skills quedan [pendientes para el final](docs/exec-plans/tech-debt-tracker.md#pend-001--skills-opcionales-al-final), por petición del propietario.

## Estado de la preparación

La transferencia documental I-00 está aceptada y archivada; H-002 está aprobada. La definición y los siete ADR aplicables a I-01 están aprobados; posteriormente el propietario aprueba ADR-MMA-011/016/017 para I-02. Posteriormente el propietario aprueba ADR-MMA-009 para el flujo individual; posteriormente aprueba ADR-MMA-004/014 y el paquete operativo de I-03 con condiciones de tokens Editor individuales y prueba previa del gate; ADR-MMA-007/010/012 conservan Propuesta. I-01 está Aceptado y archivado tras la aceptación expresa del propietario el 2026-11-05; conserva su evidencia histórica. I-02 está Aceptado por el propietario el 2026-11-05, tras verificar tipos, lint, formato, 59 unitarias, 9 componentes, 26 E2E (incluidos 6 casos axe), integración modular aislada y capturas reales, incluidos móvil, escritorio y 9:16. Los resultados efectivos y las correcciones intermedias se documentan en el [informe I-02](docs/i02-execution-report.md); la aceptación expresa del propietario y su revisión personal de capturas de escritorio/móvil quedan registradas el 2026-11-05. CI se ejecuta en GitHub; los publicadores continúan bloqueados. La arquitectura real se describe en [ARCHITECTURE.md](ARCHITECTURE.md). Los criterios del producto completo y de despliegue siguen siendo objetivos futuros; las comprobaciones locales ya ejecutadas se detallan en el informe.

Esta instancia procede de `aalexlpez/harness-engineering`; las adaptaciones locales se registran en [harness-decisions.md](docs/harness-decisions.md). No se ha modificado el template original. Los archivos especializados sin contenido aplicable pueden permanecer vacíos.


## Base local y comandos

Requisitos: Node 24.22.2 y npm 11.19.1, fijados en .node-version y package.json. Usa tu gestor de runtime compatible. En esta instancia cloud ya están instalados y se activan así:

```sh
export PATH=/workspace/.tools/node-v24.22.2-linux-x64/bin:$PATH
export ASTRO_TELEMETRY_DISABLED=1
export PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright
npm ci --cache /workspace/.cache/npm
npx --no-install playwright install chromium
npm run verify
```

La instalación oficial necesita cdn.playwright.dev y su destino de redirección storage.googleapis.com; también se conserva permitido playwright.download.prss.microsoft.com. Tras publicar el permiso el propietario, se comprobó la política efectiva y se instalaron Chromium y Headless Shell 156.0.8078.4 / revisión 1248, asociados a Playwright 1.64.1. La verificación histórica de I-01 terminó con exit 0 y 14+9+8 pruebas pasadas, sin omisiones; el lockfile permanece intacto. Evidencia final en .local/verification/chromium-156/ y [el informe de ejecución](docs/i01-execution-report.md). No es necesario modificar o publicar el entorno para reproducir las comprobaciones ya disponibles.

Para trabajar: npm run dev. Para servir el build: npm run build y npm run preview. Ambos servidores usan 127.0.0.1:4321 y --ignore-lock para mantenerse en primer plano también bajo un agente; Ctrl+C detiene el proceso propio. Playwright gestiona su preview, rechaza reutilizar otro servidor y lo cierra al terminar.

| Comando | Función |
| --- | --- |
| npm run check | Astro y TypeScript strict. |
| npm run lint | ESLint JS/TS/Astro/React Hooks, cero warnings permitidos. |
| npm run format:check | Prettier de código/configuración, sin reformatear el harness. |
| npm run test:unit | Validación, registro/rutas, traducciones y controles de seguridad de releases. |
| npm run test:components | 9 casos React en jsdom. |
| npm run build | Generación estática en dist/. |
| npm run test:e2e | Build y 26 casos en Chromium escritorio/móvil emulado, incluidos 6 axe. |
| npm run test:a11y | Build y selección de axe en los mismos dos perfiles. |
| npm run test:integration | Builds sintéticos aislados, extensión A→A/B, exclusiones, traducciones obligatorias y regresiones técnicas de I-01. Requiere build público previo. |
| npm run capture:review | Build y capturas reales ES/EN móvil, tablet, escritorio y 9:16, foco y zoom real al 200 %. |
| npm run verify | Tipos, lint, formato, unitarias, componentes, build, E2E e integración; propaga fallos. |

La fixture de I-01 comprueba una etiqueta local de 3–32 puntos de código, normalización, error, confirmación y reset. Su lógica y pruebas técnicas se conservan sin presentarla como miniapp del catálogo. No guarda ni envía datos. I-02 sustituye su portada provisional por la interfaz de producto ES/EN.

Logs de comandos: .local/verification/; fallos E2E: test-results/ y playwright-report/. Son salidas ignoradas por Git. Para restablecer el entorno, detén solo tus procesos y vuelve a npm ci desde el lockfile. No borres cambios ajenos ni uses un reset de Git para limpiar.

La ejecución complementaria histórica con Chromium del sistema está registrada por separado en el informe. El resultado final usa el navegador fijado: E2E/axe y revisión asistida de teclado/foco y capturas a 1280×900/393×851 correctos. El propietario aceptó I-01 el 2026-11-05; se conservan las limitaciones: no se han probado Firefox/WebKit o dispositivos físicos ni se certifica WCAG completo.

Para retomar desde otro chat o máquina, selecciona la rama feature/i01-base-local-testing y comprueba el checkpoint 0cf778f siguiendo la [guía de continuación de I-01](docs/i01-handoff.md). El runtime instalado en /workspace/.tools, las dependencias y los logs locales no se transportan por Git; deben prepararse o regenerarse en el entorno de destino. El checkpoint 0cf778f conserva la implementación; el cierre aceptado y las evidencias documentales posteriores se guardan en el commit local de I-01 autorizado el 2026-11-05. El [plan aceptado](docs/exec-plans/completed/I-01-base-local-y-testing.md) conserva el historial y los límites. La autorización de cierre de I-01 permitió preparar el borrador de I-02. La autorización posterior de ejecución de I-02 está registrada por separado; no permite commits, pushes o despliegues.

El [ExecPlan I-02](docs/exec-plans/completed/I-02-catalogo-responsive-e-i18n.md) prepara catálogo, diseño responsive y ES/EN sobre el cierre local de I-01 `0288de5`. Fue Aprobado formalmente el 2026-11-05, con sus 14 criterios y ADR-MMA-011/016/017 ratificados; posteriormente el propietario autorizó su ejecución. Está Aceptado y archivado en completed/, con commit local de cierre autorizado el 2026-11-05, separado del cierre de I-01.

La revisión de I-02 incluye [contrato modular/rutas](docs/design-docs/i02-catalogue-routing-proposal.md) y [propuesta visual con mockups](docs/design-docs/i02-visual-proposal.md). Registro/rutas/i18n y dirección visual con la segunda composición, paleta y familias tipográficas están aprobados. La implementación autorizada reutiliza esas referencias: rutas `/es/` y `/en/`, catálogo público vacío, fuentes locales con licencia SIL OFL y pruebas sintéticas aisladas. La raíz estática usa meta refresh y enlace a `/es/` (HTTP 200 local); los desconocidos devuelven 404 bilingüe en el preview comprobado. El [informe de ejecución](docs/i02-execution-report.md) enlaza capturas reales y traza AC1–AC14. Las maquetas siguen siendo referencias visuales; los PNG de la aplicación son la evidencia de implementación.

La validación final de I-02 es incremental: la primera ejecución de `verify` detectó un problema de idioma en nombres accesibles; tras corregirlo pasaron las comprobaciones afectadas y la integración final. No se declara una segunda ejecución completa de `npm run verify` con exit 0. La integración conserva los hashes de fuentes comunes y del build público; solo normaliza el `uid` interno de Astro al comparar el HTML de A entre raíces temporales distintas, conservando también los hashes originales. Reproducción y detalles en [tests/integration/README.md](tests/integration/README.md).

## I-03 — staging verificado

MiMiniApp ya está disponible en [staging](https://miminiapp-staging.miminiapp-lab.workers.dev). PR #4 fue fusionado en `e1e3b6596f97b86ba7e2ff3d21aab1ac5e21e0c0`; el [run 42305409224, intento 4](https://github.com/aalexlpez/miminiapp/actions/runs/42305409224/attempts/4) terminó correctamente con prepare y remote-test satisfactorios. El propietario confirma 12 archivos publicados y 30 pruebas remotas correctas, incluida identidad, ES/EN, responsive y accesibilidad.

El **hito staging está Verificado**; el [ExecPlan I-03](docs/exec-plans/active/I-03-github-actions-y-cloudflare.md) permanece **En curso**, sin aceptación global. Producción, promoción, rollback y el ensayo de aislamiento de escritura siguen pendientes. El probe acreditó lectura de staging y denegación de lectura del otro Worker (403); ese resultado no demuestra aislamiento de escritura. Master sigue predeterminada.

El propietario administra Cloudflare y las credenciales en GitHub Environment staging. Codex desarrolla, prueba y prepara PR sin necesitar acceso a Cloudflare. El circuito que funcionó es **feature → PR a staging → CI → revisión y merge manual → Actions → Cloudflare → pruebas remotas**; no requiere ejecutar Wrangler manualmente cada semana.

[Informe y artefactos](docs/i03-staging-preparation-report.md) · [Guía operativa](docs/i03-operations.md) · [Primera publicación](docs/i03-staging-startup.md) · [Historial de Fase A](docs/i03-phase-a-report.md).

`npm run release:pack` empaqueta dist y `npm run release:verify` verifica el paquete. `npm run test:remote` exige destino e identidad explícitos; ya se ejecutó en Actions contra staging y no elige una URL arbitraria ni arranca un servidor local. Este PR es solo documental y no lo fusiona Codex; la propuesta de primera miniherramienta se revisará por separado, sin implementar todavía.
