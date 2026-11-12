# I-01 — Informe de ejecución local

**Última actualización:** 2026-11-05. **Estado:** Aceptado por el propietario de MiMiniApp. **Responsable de aceptación:** propietario de MiMiniApp.

## Aceptación y archivo — 2026-11-05

El propietario declara: **«Acepto expresamente I-01 como propietario de MiMiniApp»**, después de considerar satisfactorios los resultados ya verificados. Se registra Verificado → Aceptado en el [ExecPlan archivado](exec-plans/completed/I-01-base-local-y-testing.md), conservando este informe, las evidencias y sus límites. No se repiten pruebas de aplicación: el cierre solo registra la aceptación, mueve el plan y actualiza referencias/estado documental.

Se conservan PEND-001–005 y PEND-007, las once incidencias moderadas evaluadas, la licencia/dominio pendientes y las decisiones todavía propuestas. La cobertura sigue limitada a Chromium fijado en escritorio y móvil emulado, revisión asistida visual/teclado y axe sin certificación WCAG completa; no hay pruebas de dispositivos físicos, otros motores, CI remota o despliegues. PEND-006 permanece resuelto. I-00, H-001/H-002 y su trazabilidad no cambian.

El propietario autoriza un commit local del cierre de I-01, excluyendo archivos temporales, y preparar únicamente el borrador de I-02 (catálogo, responsive y ES/EN). No se implementa I-02 ni se realizan pushes o despliegues. El commit incluye documentación y resumen durable de evidencias; node_modules/, dist/, .astro/, .local/, reportes, cachés, binarios, capturas y la copia auxiliar descargable quedan fuera de Git. Los apartados siguientes conservan los resultados y estados de sus fechas; la aceptación actual no los reescribe.

## Revalidación solicitada — 2026-11-05

El propietario solicita repetir la instalación del Chromium requerido, los E2E y la accesibilidad, comprobar que no se usa el navegador del sistema y conservar I-01 pendiente de aceptación. Se observa la configuración efectiva ya aplicada: observaciones actuales y política enforced con cdn.playwright.dev, playwright.download.prss.microsoft.com y storage.googleapis.com permitidos. No se modifica el borrador ni la configuración del entorno. I-01 ya estaba Verificado; esta revalidación confirma ese estado sin inventar otra transición o aceptación.

Se usa Node 24.22.2 / npm 11.19.1 y una **caché nueva**, `/workspace/.cache/ms-playwright-i01-recheck-20261105`, inexistente antes del comando. Evidencia adicional en **.local/verification/recheck-2026-11-05/**; la evidencia anterior permanece intacta. Todos los comandos se ejecutan desde /workspace/miminiapp con ASTRO_TELEMETRY_DISABLED=1 y el mismo PLAYWRIGHT_BROWSERS_PATH nuevo para instalar y probar.

| Comprobación repetida | Resultado actual | Evidencia |
| --- | --- | --- |
| npx --no-install playwright install chromium | Exit 0; descarga nueva oficial de Chrome for Testing y Headless Shell 156.0.8078.4/r1248, más FFmpeg r1013. Sin 403 ni otro error de descarga. | playwright-install.log/.exit y network-observation.json |
| npm run verify con DEBUG=pw:browser | Exit 0; tipos/lint/formato correctos, 14 unitarias, 9 componentes y **8/8 E2E/axe**, cero fallidas/omitidas y sin reintentos; build estático correcto. | verify.log/.exit, playwright-report/ y test-results-verify/ |
| npm run test:a11y con DEBUG=pw:browser | Exit 0; **2/2 casos axe**, escritorio y móvil emulado, estados inicial/error/éxito y los tags WCAG aprobados, sin infracciones detectadas. Son los mismos dos casos incluidos en los ocho E2E, repetidos por el comando selectivo; no diez casos distintos. | a11y.log/.exit, a11y-report/ y test-results-a11y/ |
| Identidad del navegador lanzado | Los cuatro lanzamientos de verify y los dos de a11y usan exactamente el Headless Shell r1248 de la caché nueva; ninguno usa /usr/bin/chromium o /usr/bin/google-chrome. Ambos binarios descargados informan Google Chrome for Testing 156.0.8078.4. | Líneas launching de ambos logs; browser-version-binaries.log con versiones y SHA-256. |
| Auditoría independiente de selección | Playwright 1.64.1 exacto en manifiesto/lockfile y browsers.json exige 156.0.8078.4/r1248. Configuración y fixtures sin executablePath, channel, launchOptions o conexión remota alternativos. Segundo agente confirma las seis rutas de lanzamiento de los logs. | Revisión separada de configuración, manifiestos y evidencia dinámica; resumen en execution-summary.json. |
| Conservación | Lockfile, playwright.config.ts y browsers.json conservan sus hashes antes/después; aplicación, pruebas y gobierno no cambian respecto a 0cf778f. Sin I-02, commits, pushes o publicaciones. | before.log, after.sha256, execution-summary.json y comparación Git. |

**Ejecutable real registrado en los seis lanzamientos:**

```text
/workspace/.cache/ms-playwright-i01-recheck-20261105/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell
```

La comprobación usa la ruta de lanzamiento real y las versiones de los binarios, además de la configuración declarada; no se confunde chromium.executablePath() (ruta por defecto del Chrome completo) con el Headless Shell que ejecuta la suite. El lockfile conserva SHA-256 `185343c461af4ffe6ec65bc27aa2d74790d6476a232888f7a9d341f40d2c3193`. Los hashes individuales de binarios y artefactos constan en browser-version-binaries.log y evidence-sha256.json. La revisión asistida de teclado/foco y capturas ya registrada sigue vigente, al no cambiar el código ni la versión/revisión requerida. No se afirma certificación completa WCAG ni otros motores o dispositivos físicos. I-01 permanece **Verificado**, en active/ y pendiente de aceptación humana; PEND-007 mantiene su seguimiento previo.

## Verificación final con Chromium fijado

Tras publicar el entorno, el propietario solicita probar Playwright. Se observa la política activa restricted/enforced con cdn.playwright.dev, playwright.download.prss.microsoft.com y storage.googleapis.com permitidos. La publicación conserva el checkout `0cf778f988068e9ac7f7c7a519e1ec36486cc8aa`, los cinco cambios documentales y las evidencias locales anteriores. El agente no reaplica cambios al borrador, no modifica su configuración ni publica.

Directorio de trabajo `/workspace/miminiapp`. Runtime **Node 24.22.2 / npm 11.19.1**, `ASTRO_TELEMETRY_DISABLED=1` y `PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright`. Evidencia final en **.local/verification/chromium-156/**, ignorada por Git. Los intentos bloqueados se conservan en resume-0cf778f/; sus test-results/ y playwright-report/ se archivaron allí antes de ejecutar la suite final. Los directorios de reportes en la raíz corresponden ahora a la ejecución satisfactoria.

| Comando / comprobación final | Resultado | Evidencia |
| --- | --- | --- |
| npx --no-install playwright install chromium | Exit 0; Chrome for Testing y Headless Shell **156.0.8078.4**, revisión **1248**; FFmpeg auxiliar revisión 1013. Sin otro motor, canal del sistema ni librerías adicionales. | playwright-install.log/.exit, browser-binaries.sha256, network-observation.json |
| npm run verify | **Exit 0**; tipos 0 errores/warnings/hints, lint y formato correctos; **14/14 unitarias, 9/9 componentes y 8/8 E2E/axe**, 0 fallidas/omitidas, sin reintentos. Build estático de una página. | verify.log/.exit, runtime-lockfile-before.log, lockfile-after.sha256 y playwright-report/ |
| E2E con navegador requerido | Hidratación real, validación/normalización, error, confirmación, teclado/reset y foco, CSS calculado responsive, recursos locales y ausencia de errores relevantes en Desktop Chrome y Pixel 7 emulado. | Ocho casos versionados ejecutados por verify con Chromium fijado. |
| axe requerido | Los dos casos de accesibilidad pasan, con estados inicial/error/éxito en ambos perfiles y tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa. Sin infracciones detectadas. test:a11y aislado no se repite porque verify ya ejecutó ambos casos. | verify.log, tests/e2e/a11y.spec.ts sin cambios y reporte HTML. |
| Revisión asistida separada de teclado/foco y aspecto | Exit 0 del recorrido asistido con browser.version() 156.0.8078.4. Tab/Shift+Tab, Enter vacío/corto/válido, error asociado, normalización/confirmación, foco visible y reset con retorno al input. Seis capturas inicial/error/éxito inspeccionadas por Codex: controles/textos legibles, sin recortes, una/dos columnas y sin overflow horizontal a 393×851/1280×900. No es una revisión humana ni dispositivo físico. | assisted-review.mjs/.log/.exit/.json, visual-review.json y seis PNG desktop/mobile. |
| HTTP e identidad del build probado | HTML y cuatro recursos (CSS y tres JS) responden 200 y coinciden por contenido con los cinco archivos construidos por verify; sus hashes se conservan. Sin peticiones externas ni errores de consola, página o red durante el recorrido. | assisted-review.json, sección buildAssets y perfiles. |
| Cierre de procesos y conservación | Preview propio detenido con SIGINT, exit 130 esperado; Playwright gestionó y cerró el suyo. Ningún cambio en aplicación, pruebas, configuración, dependencias o lockfile. | execution-summary.json; comparación Git y hashes. |

**SHA-256 inalterado del lockfile:** `185343c461af4ffe6ec65bc27aa2d74790d6476a232888f7a9d341f40d2c3193`. No se regeneran dependencias innecesariamente tras restaurar el entorno: se conserva la instalación congelada ya comprobada con Node/npm exactos, grafo correcto, controles negativos/positivos de AC05 y auditoría 0 altas/críticas y 11 moderadas de la reanudación anterior. PEND-007 mantiene su evaluación y seguimiento; no se ejecuta audit fix ni se cambian versiones. `execution-summary.json` y `evidence-sha256.json` identifican los resultados y artefactos finales.

| Criterio final | Evidencia de cumplimiento |
| --- | --- |
| I01-AC-01 instalación repetible | npm ci exit 0 en resume-0cf778f/, Node/npm exactos y lockfile intacto también después de verify final. |
| I01-AC-02 salida estática/HTTP | Build exit 0, una página y HTTP 200 con igualdad binaria de sus cinco archivos. |
| I01-AC-03 hidratación | Interacción real y respuesta normalizada en ambos perfiles del navegador fijado. |
| I01-AC-04 CSS compilado | Estilos calculados, controles ≥48px, grid 2/1 columnas y sin overflow. |
| I01-AC-05 tipos/lint/formato | Positivos finales correctos y negativos/positivos registrados en resume-0cf778f/. |
| I01-AC-06 unitarias/componentes | 14 + 9 pruebas pasadas, 0 omitidas, sobre lógica y componentes utilizados. |
| I01-AC-07 E2E | 8/8 con Chromium 156 fijado, Desktop Chrome y Pixel 7 emulado; preview controlado por runner. |
| I01-AC-08 accesibilidad/teclado | axe sin infracciones detectadas en seis combinaciones estado/perfil y revisión asistida de teclado/foco/capturas. |
| I01-AC-09 documentación | Requisitos, comandos, límites y estado sincronizados con la evidencia; artefactos ignorados. |
| I01-AC-10 alcance/harness | Delta documental de esta continuación, código/configuración/pruebas intactos; I-00, H-001/H-002 y propuestas preservados. |

**Conclusión de la ejecución:** Codex registra **En curso → Verificado** el 2026-11-04 en el ExecPlan activo; PEND-006 resuelto. La aceptación corresponde al propietario y sigue pendiente. No se inicia I-02 ni se hacen nuevos commits/pushes, merges, servicios remotos, despliegues o publicaciones por el agente. Las pruebas no certifican WCAG completo, producto bilingüe, otros motores, dispositivos físicos o entornos remotos. Los apartados siguientes conservan los errores y diagnósticos históricos sin atribuirles el éxito final.

## Copia descargable para revisión personal — 2026-11-05

El propietario solicita poder probar la aplicación personalmente. En este chat no hay herramienta para abrir el escritorio compartido o generar un enlace de preview. Se prepara una copia auxiliar autocontenida del build ya verificado, sin despliegue ni cambios de aplicación: `/workspace/shared/downloads/MiMiniApp-I01.html` y `MiMiniApp-I01.zip` con instrucciones de descarga, extracción y apertura en Chrome/Edge. No requieren Node, servidor o conexión. Es la fixture técnica actual, sin catálogo ni miniapp real.

Se integra el CSS compilado y se convierten los tres JS del build en URLs data, conservando una única referencia compartida de React y la hidratación original de Astro. No se cambia lógica, contenido o estilos. El HTML pesa 338763 bytes, SHA-256 `362ce14dc0ec85a5d9a3c8856fea6aa8d3bd39c9d209d23167f2b830b0b20dbc`. Manifest, helper y comprobación en `.local/review/`, ignorados por Git; ZIP verificado con el mismo HTML y LEEME.txt.

Comprobación auxiliar con Chromium 156.0.8078.4 abriendo el archivo mediante file:// y red offline: exit 0; hidratación, error vacío, confirmación normalizada con Unicode, reset/foco y ausencia de overflow en escritorio y Pixel 7 emulado. Cero errores de página/consola y cero peticiones HTTP(S); ambas capturas iniciales coinciden byte a byte con las del build HTTP verificado. Evidencia: download-check.json/.log/.exit y delivery-manifest.json. Esta copia facilita la revisión personal; no acredita servidor, cabeceras o despliegue y no sustituye la evidencia HTTP canónica. I-01 sigue Verificado con aceptación humana pendiente, sin I-02, commits, pushes o publicación.

## Reanudación desde 0cf778f — evidencia del bloqueo anterior

El 2026-11-04 el propietario solicita reanudar I-01 desde `0cf778f`, completar preparación/verificaciones y registrar evidencias, sin iniciar I-02 ni hacer nuevos commits o pushes. El checkout inicial de esta instancia solo contenía 88918d5; se consultó el remoto y se recuperó la rama feature/i01-base-local-testing, abriendo en detached HEAD el commit exacto **0cf778f988068e9ac7f7c7a519e1ec36486cc8aa**. No había cambios locales que preservar y no se creó ningún commit. Se leyeron AGENTS.md, el handoff, el plan, este informe y las fuentes aprobadas aplicables.

Esta ejecución usa `/workspace/miminiapp`; las evidencias nuevas están en **.local/verification/resume-0cf778f/**, ignoradas por Git. No son los logs/capturas de la instancia anterior. `execution-summary.json` resume resultados/códigos, `network-observation.json` conserva la observación de política y `evidence-sha256.json` identifica los archivos de evidencia por hash. Runtime y navegador usan respectivamente `/workspace/.tools/node-v24.22.2-linux-x64` y `PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright`; se mantiene `ASTRO_TELEMETRY_DISABLED=1`.

| Comando / comprobación actual | Exit / resultado | Evidencia nueva |
| --- | --- | --- |
| Descarga oficial Node, SHASUMS256.txt y sha256sum --check; node --version; npm --version | 0; checksum correcto, v24.22.2 / 11.19.1. No se usa el runtime inicial 24.22.1/11.9.0. | runtime.log; tarball y sumas en /workspace/.cache/miminiapp-runtime/ |
| npm ci --cache /workspace/.cache/npm | 0; 491 paquetes desde dependencias ausentes; lockfile idéntico antes/después. Sin forzar peers, cambios de versión o desactivar TLS/integridad. | npm-ci.log, npm-ci.exit, lockfile-before.sha256 y lockfile-after-ci.sha256 |
| npm ls --all --json | 0; grafo sin problemas declarados. | npm-ls.json y npm-ls.exit |
| npx --no-install playwright install chromium | 1; cinco intentos de Chromium 156.0.8078.4 / revisión 1248 reciben 403 Domain forbidden. No se instala el binario requerido. | playwright-install.log y playwright-install.exit |
| curl --head --location de la URL oficial de descarga | 56; cdn.playwright.dev devuelve 307 hacia storage.googleapis.com; el CONNECT a ese destino devuelve 403. | chromium-download-headers.log |
| npm run verify | 1 global; check 0 errores/warnings/hints; lint y formato correctos; 14/14 unitarias, 9/9 componentes, ninguna omitida; build estático de una página correcto. Los 8 casos E2E/axe fallan al lanzar el navegador por executable doesn't exist, antes de probar la aplicación. No son 8 pruebas funcionales fallidas ni pasadas. | verify-required.log y verify-required.exit; test-results/ con 8 trazas y playwright-report/ de esta ejecución |
| Controles negativos de tipos/lint/formato y repetición positiva | 1 esperado en los tres negativos; 0 en los tres positivos posteriores. Temporal propio retirado en finally; ningún cambio en src/configuración/tests. | negative-controls-resume.json, negative-*.log/.exit y positive-after-negative-*.log/.exit |
| npm audit --audit-level=high --json --cache /workspace/.cache/npm | 0; 0 altas, 0 críticas y 11 moderadas, mismo seguimiento PEND-007. No se aplica audit fix. | npm-audit.json y npm-audit.exit |
| npm run preview y comprobación HTTP del mismo build | HTTP 200 para /, CSS y tres JS; contenido servido idéntico a los cinco archivos del build. HTML estático con isla React. Preview propio detenido con SIGINT (130 esperado). | http-build.json, con tamaños y SHA-256 de cada archivo |
| Revisión independiente de código/alcance | Sin defectos materiales detectados en fixture, validación, estilos, configuración y suites frente a AC01–10; revisión estática, sin atribuirle ejecución de navegador. | Revisión separada por un segundo agente; resumen durable en este informe. |
| Revisión asistida visual/teclado, CSS calculado, hidratación y axe en Chromium 156 | **No ejecutadas satisfactoriamente:** requieren el navegador que no se ha podido descargar. No se repiten los diagnósticos con Chromium del sistema. test:a11y aislado no se repite: los dos casos axe ya intentados por verify fallan por la misma ausencia. | Pendientes AC03/04/07/08. |

**Integridad:** package-lock.json conserva SHA-256 `185343c461af4ffe6ec65bc27aa2d74790d6476a232888f7a9d341f40d2c3193`. El tarball oficial de Node conserva `48cc0e21e048790e54c0cf5749c2725005313d652651c40b7a21feb9697aaf75`. Código, pruebas, manifiesto, lockfile y configuración de aplicación permanecen iguales a 0cf778f. No se modifican aserciones ni se sustituye Chromium por otro navegador.

**Diagnóstico de red anterior a la última publicación:** environment_status observaba conectividad y política restricted/enforced, observaciones actuales y spec_revision 1 con **cdn.playwright.dev y playwright.download.prss.microsoft.com** permitidos. El primer dominio ya se alcanzaba. La cadena registrada entonces fue:

```text
https://cdn.playwright.dev/builds/cft/156.0.8078.4/linux64/chrome-linux64.zip
  HTTP 307 Location:
https://storage.googleapis.com/chrome-for-testing-public/156.0.8078.4/linux64/chrome-linux64.zip
  CONNECT HTTP 403 Forbidden / Domain forbidden
```

El propietario responde «si» a la petición del permiso concreto. Se guarda **únicamente la adición storage.googleapis.com** en el borrador con status=saved y requires_publish=true, conservando ambos dominios anteriores y el preset de gestores. No se alteran scripts, repositorios o credenciales del entorno, no se reaplican cambios anteriores ni se publica. El guardado no aplica el permiso a esta máquina. El propietario debe revisar/guardar el cambio en ajustes y publicar el entorno para activarlo; después se comprobará el acceso efectivo y se retomará la descarga y la verificación afectada. No se evita el proxy ni se desactiva TLS; no hubo rechazo del revisor automático.

**Resultado en aquella etapa bloqueada:** AC01/02/05/06 y revisión de alcance acreditados de nuevo; documentación de AC09 actualizada. AC03/04/07/08 seguían pendientes del Chromium fijado y su revisión asistida, e I-01 permanecía En curso. La verificación final que abre este informe supera ese bloqueo y registra los criterios completos, sin aceptación atribuida ni ampliación de alcance. Los apartados siguientes conservan la ejecución histórica anterior al checkpoint; sus diagnósticos con Chromium 155 no se usan como evidencia requerida.

## Resultado implementado

Astro 7.4.5 estático, React/DOM 19.3.1, TypeScript 6.0.3 strict, Tailwind 4.3.4 y las herramientas exactas aprobadas. Runtime Node 24.22.2 con npm 11.19.1 instalado fuera del checkout; 31 dependencias directas y package-lock.json generado y comprobado. No hay catálogo, miniapp real, backend, CI remoto, Cloudflare ni despliegue.

La página provisional es una fixture técnica con etiqueta de 3–32 puntos de código, normalización de espacios, validación, error anunciado, confirmación, reset y foco. El dato solo vive en estado React: no hay persistencia ni llamadas a APIs. CSS responsive de una/dos columnas y controles accesibles. El build genera index.html y cuatro recursos estáticos en dist/.

## Evidencias y resultados históricos anteriores al checkpoint

Todos los comandos se ejecutan desde /workspace/miminiapp con el runtime aprobado. Logs y artefactos de la instancia están en .local/verification/, ignorados por Git; el informe conserva el resumen durable. Los procesos de preview iniciados por esta verificación se detienen al terminar.

| Comprobación | Resultado real | Evidencia local |
| --- | --- | --- |
| Node / npm | v24.22.2 / 11.19.1. SHA-256 del tarball de Node verificado con el SHASUMS256.txt oficial por HTTPS. | /workspace/.cache/miminiapp-runtime/verification.json |
| npm install | Correcto, 491 paquetes instalados, sin forzar peers ni desactivar integridad/TLS. | .local/verification/npm-install.log |
| npm ci --offline --no-audit --no-fund --cache /workspace/.cache/npm | Correcto desde node_modules regenerado y caché de artefactos; lockfile sin cambios. | .local/verification/npm-ci.log y lockfile-before-ci.sha256 |
| npm ls --all | Correcto, sin problemas declarados del grafo instalado. | .local/verification/npm-ls.json |
| npm run check | Correcto: 0 errores, 0 warnings y 0 hints tras ajustar el tipo de evento. | .local/verification/local-checks-final.log |
| npm run lint | Correcto, cero warnings permitidos. | .local/verification/local-checks-final.log |
| npm run format:check | Correcto para código y configuración; no reformatea el dossier original. | .local/verification/local-checks-final.log |
| npm run test:unit | 14/14 pruebas pasadas, 1 archivo, ninguna omitida. | .local/verification/test-unit.log y local-checks-final.log |
| npm run test:components | 9/9 pruebas pasadas, 1 archivo, ninguna omitida. | .local/verification/test-components.log y local-checks-final.log |
| npm run build | Correcto, salida static, una página; no SSR ni worker de aplicación. | .local/verification/build-initial.log y local-checks-final.log |
| Controles negativos de tipos, lint y formato | Tres fallos esperados detectados, exit 1 en cada control. Archivo temporal retirado y comprobaciones positivas repetidas después. | .local/verification/negative-controls.json y negative-*.log |
| npm audit --audit-level=high | Exit 0: 0 altas, 0 críticas, 11 moderadas. No equivale a ausencia total de riesgos. | .local/verification/npm-audit.json |
| npm run verify | La primera ejecución pasó tipos/lint/formato/unitarias/componentes/build, pero falló al gestionar el preview en segundo plano. Se corrigió el CLI y se repitió el E2E requerido. | .local/verification/verify-required.log |
| npm run test:e2e con Chromium fijado | Exit 1: 8 intentos fallidos antes de ejecutar el navegador por ausencia de su binario. No se consideran fallos funcionales de la fixture ni tests pasados. | .local/verification/e2e-required-final.log, test-results/ y playwright-report/ |
| Diagnóstico complementario con Chromium del sistema 155.0.8059.79 | 8/8 casos pasados, 0 omitidos y 0 flaky: interacción/hidratación, teclado/reset, CSS responsive y axe en ambos perfiles. No sustituye el Chromium 156.0.8078.4 asociado a Playwright 1.64.1. | .local/verification/system-chromium-diagnostic-final.log y system-chromium-diagnostic.json |
| axe complementario | Sin infracciones detectadas con tags WCAG 2.2 AA en estados inicial/error/éxito, en escritorio y móvil emulado; no certificación completa. El comando requerido test:a11y no puede acreditarse hasta instalar el navegador fijado. | Caso a11y incluido en los 8 diagnósticos; misma suite del repositorio, sin cambiar aserciones. |
| Revisión asistida independiente de teclado y visual | GET / y CSS 200; Tab/Enter, error, confirmación, foco visible, reset y retorno al input comprobados. Capturas a 1280px/393px inspeccionadas: texto/controles legibles, sin recortes ni overflow horizontal. Navegador del sistema, sin afirmar dispositivo físico o revisión humana. | .local/verification/manual-keyboard-review.json, desktop.png y mobile.png |
| Revisión separada del código | Sin defectos materiales detectados; valida alcance, render seguro, pruebas observables y preservación del harness. | Revisión del delta y de src/configuración/tests en esta sesión. |

**SHA-256 de package-lock.json:** 185343c461af4ffe6ec65bc27aa2d74790d6476a232888f7a9d341f40d2c3193.

**SHA-256 del runtime oficial:** 48cc0e21e048790e54c0cf5749c2725005313d652651c40b7a21feb9697aaf75.

## Problemas encontrados y ajustes mecánicos

1. React types 19.3 depreca FormEvent: se usa SubmitEvent para onSubmit, conforme a su declaración oficial instalada. Sin cambio de biblioteca o versión; la comprobación final queda sin hints.
2. Astro 7 detecta al agente y arranca preview en background. Playwright interpretó que webServer había terminado; se inspeccionó astro preview --help y el código instalado, y se añadió el flag documentado --ignore-lock a dev/preview para mantener procesos en primer plano y controlados por el runner. Se detuvo exclusivamente el preview iniciado por la prueba. Este ajuste no ignora fallos del navegador ni permite reutilizar un servidor ajeno.
3. El diagnóstico inicial detectó una petición automática 404 a favicon.ico. Se añadió un favicon vacío data:, en la página. Se conservaron todas las aserciones de errores/red y los 8 diagnósticos pasaron al repetirlos.
4. Descarga del navegador obligatorio: 403 Domain forbidden para cdn.playwright.dev. Es una denegación de política del entorno, no un error de versión ni un rechazo del revisor automático. No se evita el proxy, no se desactiva TLS y no se sustituye silenciosamente el navegador aprobado por el del sistema.

No se cambian las versiones aprobadas ni se añaden tecnologías. La configuración diagnóstica que usa /usr/bin/chromium solo existe en .local/, ignorada; playwright.config.ts mantiene el navegador de Playwright, Chromium-only y el build local.

## Seguridad, dependencias y licencias

Las 11 incidencias moderadas derivan de minimatch (DoS por amplificación de patrones, GHSA-g3hv-75wg-m249) y sus dependientes de lint/TypeScript. Son herramientas de desarrollo; el JS estático servido no recibe patrones de usuarios para minimatch. Se mantienen las versiones aprobadas y se registra seguimiento en PEND-007; no se ejecuta audit fix --force ni se aplican downgrades de majors sugeridos por npm. No hay altas/críticas que incumplan el umbral aprobado. Revisar antes de ampliar a contribuciones no confiables o modificar la cadena de herramientas.

El inventario de licencias del lockfile conserva MIT/ISC/BSD/Apache y otras expresiones, incluidas MPL-2.0 y libvips de sharp con LGPL-3.0-or-later (también variantes opcionales para otras plataformas). No se borran avisos de terceros; no se distribuyen aquí binarios ni se adopta licencia de publicación para MiMiniApp. Antes de distribuir imágenes/binarios o publicar, revisar las obligaciones de esos recursos. Inventario: .local/verification/license-inventory.json. La licencia propia continúa pendiente, package.json marca UNLICENSED/private.

## Criterios al finalizar la ejecución histórica anterior al checkpoint

| Criterio | Estado al terminar esta ejecución |
| --- | --- |
| I01-AC-01 instalación repetible | Cumplido. Runtime exacto, lockfile estable y npm ci correcto. |
| I01-AC-02 salida estática y HTTP | Cumplido. Una página, recursos estáticos y respuestas representativas 200. |
| I01-AC-03 hidratación real | Implementado y pasado en diagnóstico Chromium 155; pendiente evidencia con el Chromium fijado 156. |
| I01-AC-04 CSS compilado | Implementado y pasado en diagnóstico; pendiente evidencia con navegador fijado. |
| I01-AC-05 tipos/lint/formato | Cumplido, controles positivos y negativos registrados. |
| I01-AC-06 unitarias/componentes | Cumplido: 14 + 9 pruebas reales pasadas. |
| I01-AC-07 E2E en ambos perfiles | Bloqueado por descarga del navegador aprobado; 8/8 complementarios en 155 no lo cierran. |
| I01-AC-08 accesibilidad/teclado | Código, axe y revisión asistida complementarios correctos; pendiente axe/teclado sobre el navegador fijado. |
| I01-AC-09 documentación | Actualizada con capacidades reales, comandos y límites; no declara preparación completa. |
| I01-AC-10 alcance | Cumplido. Sin catálogo/miniapp real, I-02, CI remoto, Cloudflare, despliegues o nuevas skills. La ejecución local no hizo commits/pushes; posteriormente el propietario autoriza un commit y push exclusivos para el traslado descrito al final. |

## Bloqueo externo anterior al traslado y continuación prevista entonces

Se guardó en el borrador de configuración del entorno la adición exacta cdn.playwright.dev, preservando el preset de gestores de paquetes y sin ampliar a comodines. El guardado está confirmado; no aplica ni publica la política. La observación posterior seguía en spec_revision 1, red restricted/enforced y lista custom vacía, incluso después de los intentos de publicación comunicados por el propietario. El nombre temporal usado para identificar la configuración se restauró a miminiapp. No hay evidencia de que la política activa de esta máquina haya incorporado el dominio.

Una vez aplicada la red, comprobar el estado observado y reintentar npx --no-install playwright install chromium con el runtime y PLAYWRIGHT_BROWSERS_PATH documentados. Si aparece un nuevo destino denegado por una redirección, registrarlo y pedir únicamente la adición necesaria, sin eludir la política. Ejecutar npm run verify y, si procede, el comando selectivo test:a11y; repetir solo comprobaciones afectadas. Registrar sus resultados actuales y pasar a Verificado únicamente si satisfacen los criterios. No hace falta nueva autorización de código dentro del alcance ya autorizado de I-01; cualquier cambio material conserva su requisito de aprobación.

Hasta entonces I-01 queda En curso. No se pasa a Verificado o Aceptado ni se comienza I-02.

## Archivos de implementación y verificación

* Runtime/gestor: .node-version, .npmrc, package.json y package-lock.json; runtime instalado fuera del checkout.
* Configuración: astro.config.mjs, tsconfig.json, eslint.config.mjs, prettier.config.mjs, vitest.config.ts y playwright.config.ts; .gitignore para artefactos.
* Fixture: src/pages/index.astro, src/components/EnvironmentFixture.tsx, src/lib/validation.ts, src/styles/global.css y src/env.d.ts.
* Pruebas: tests/unit/validation.test.ts, tests/components/EnvironmentFixture.test.tsx, tests/components/setup.ts, tests/e2e/environment.spec.ts, tests/e2e/a11y.spec.ts y tests/e2e/fixtures.ts.
* Documentación: README, ARCHITECTURE, guías técnicas, registro/paquete de decisiones, pendientes, roadmap, plan activo e informe. Se conservan las modificaciones documentales previas; no se reescribe I-00 aceptada ni su desviación histórica.

Las dependencias y las evidencias generadas quedan ignoradas. Los archivos temporales de controles negativos se retiraron. Al finalizar las comprobaciones locales, HEAD era 38574b75c13d7056f38d8c589223041614952239 y no había commits o pushes posteriores a I-00.

## Traslado autorizado a otro chat

El 2026-11-04 el propietario responde «vale, haz lo que dices, lo autorizo» a la propuesta de crear feature/i01-base-local-testing, realizar un commit de los archivos de I-01 y subir exclusivamente esa rama. El permiso queda registrado en el [ExecPlan](exec-plans/completed/I-01-base-local-y-testing.md); no acepta la iteración ni autoriza merge, cambios en master, despliegues, I-02 o futuros commits/pushes.

El commit conserva código, lockfile, pruebas, aprobaciones y resultados documentales; excluye dependencias, binarios, logs, capturas y artefactos ignorados. La [guía de continuación](i01-handoff.md) indica cómo retomar el trabajo y regenerar evidencia en la máquina nueva. El resultado de la operación Git y su SHA se comprueban después de crear el commit; este informe no presupone que el push haya tenido éxito. I-01 sigue En curso hasta completar las verificaciones obligatorias.
