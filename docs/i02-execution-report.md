# I-02 — Informe de ejecución y cierre aceptado

**Fecha:** 2026-11-05. **Responsable de aceptación:** propietario de MiMiniApp. **Resultado:** `Aceptado`, tras revisión personal de las capturas reales de escritorio y móvil y aceptación expresa del propietario. El [ExecPlan archivado](exec-plans/completed/I-02-catalogo-responsive-e-i18n.md) conserva el estado canónico, sus 14 criterios, autorización y aceptación.

**Aceptación, 2026-11-05:** «Acepto expresamente I-02 como propietario de MiMiniApp». El propietario confirma su conformidad con diseño visual, arquitectura modular y resultados de las verificaciones. Autoriza archivar el plan y un commit local de cierre, excluyendo temporales/evidencias ignoradas, y preparar únicamente el borrador de I-03; no autoriza su ejecución, pushes o despliegues. No se vuelven a ejecutar pruebas ya satisfechas porque este cierre solo modifica documentación.

Se implementó la segunda composición aprobada de Laboratorio creativo moderno, el catálogo modular y las rutas ES/EN. El catálogo entregable está vacío: no se seleccionó ni desarrolló ninguna miniapp real. No se inició I-03 ni se configuraron Cloudflare, CI remoto o despliegues. No se hicieron commits ni pushes.

## Identificación y entorno

Base aceptada: `0288de567fe7e1665973c6d8e128866962f66e2e`. El snapshot verificado de I-02 se obtuvo sin commit; el propietario autoriza posteriormente su commit local de cierre. El manifiesto reproducible local `.local/verification/i02/build-manifest.json` identifica archivos, SHA-256 y el entregable verificado:

* Código, recursos, pruebas y configuración: `2e00d00a17b303717e509c7cd77c6eb02eab886203ae12c6bce4a4441a41910d`.
* Árbol de `dist/`: `d92d0d18f7419c8372aef1c64b621a191132393ddefc18b70fa15c706ffde5d0`.
* Lockfile conservado: `185343c461af4ffe6ec65bc27aa2d74790d6476a232888f7a9d341f40d2c3193`.

Node 24.22.2, npm 11.19.1, Astro 7.4.5, React 19.3.1, TypeScript 6.0.3, Tailwind 4.3.4, Vitest 5.1.0, Playwright 1.64.1 y axe 4.14.0. No se añadieron dependencias ni se cambiaron versiones. Se reutilizaron las dependencias y el navegador instalados; no fue necesario repetir descargas.

Chromium ejecutado: **156.0.8078.4 / revisión 1248**. `DEBUG=pw:browser` registra los lanzamientos reales en los logs:

* E2E, integración y capturas ordinarias: `/workspace/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`.
* Ensayo de zoom nativo: `/workspace/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`, Chromium completo distribuido por Playwright. Solo este ensayo utiliza `channel: 'chromium'` porque necesita la API de extensiones; no selecciona Chrome del sistema. Configuración ordinaria sin `channel` ni `executablePath` alternativo.

## Implementación comprobada

`src/miniapps/registry.ts` es el único registro explícito del producto. El contrato de `src/lib/miniapp-registry.ts` separa descriptor puro y conexión de UI: publicadas requieren un loader perezoso de `entry.astro`; los borradores no pueden tenerlo. Se validan identificadores/slugs únicos, estados y metadatos ES/EN obligatorios. El catálogo proyecta metadatos sin ejecutar loaders.

Las rutas comunes generan idiomas × herramientas publicadas. Solo se serializa el identificador; la entrada Astro se resuelve durante prerender. Su interfaz React, cuando proceda, se importa estáticamente dentro del adaptador del módulo. Añadir una herramienta consiste en su carpeta y una inscripción: no se editan rutas, layouts, diccionarios comunes ni otras herramientas. Vitest descubre sus pruebas bajo `src/miniapps/*/tests/` sin cambiar configuración por herramienta. La [guía de integración](../tests/integration/README.md) explica el ensayo aislado.

Traducciones comunes en `src/i18n/common/`, validadas durante prerender; las traducciones específicas permanecen dentro de cada módulo y se comprueban con el validador compartido. Los builds sintéticos verifican esta separación y rechazan una traducción obligatoria vacía. No hay biblioteca adicional de i18n, detección automática, cookies o persistencia de idioma.

El resultado estático contiene cuatro HTML (`/`, `/es/`, `/en/`, `404.html`), CSS y recursos locales: once archivos en total. El chunk genérico del renderer React generado por la integración de Astro no es solicitado por las portadas, que no incluyen islas ni scripts de aplicación. No contiene UI sintética ni borradores.

| URL comprobada | Resultado local |
| --- | --- |
| `/es/`, `/en/` | 200; portada y catálogo en el idioma solicitado. |
| `/` | 200 con meta refresh inmediato a `/es/` y enlace utilizable; sin JavaScript ni detección de idioma. No es un 301. |
| `/fr/`, `/es/no-existe/`, `/en/apps/no-such-tool/` | 404 real con recuperación bilingüe. |
| `/es/apps/i02-fixture-draft/` | 404; tampoco existe en el build sintético en ES/EN. |

Los enlaces generados usan barra final. No se crean reglas del proveedor ni un fallback SPA. La normalización y política HTTP de Cloudflare, canónicas y `hreflang` absolutos permanecen diferidos a sus decisiones y entorno correspondientes.

## Resultados de verificación

| Verificación ejecutada | Resultado |
| --- | --- |
| `npm run check` | 41 archivos; cero errores, avisos o hints en la comprobación final. |
| `npm run lint` / `npm run format:check` | Exit 0, incluidos scripts de integración y captura. |
| `npm run test:unit` | 59/59: 14 validación I-01, 32 registro/rutas y 13 traducciones. |
| `npm run test:components` | 9/9 de I-01, conservadas. |
| `npm run build` | Exit 0; cuatro páginas estáticas. |
| `npm run test:e2e` | 26/26 en Chromium escritorio y Pixel 7 emulado, sin omisiones; incluye seis casos axe sobre ES/EN y 404 bilingüe. |
| `npm run test:integration` | Exit 0; dos builds válidos, pruebas propias descubiertas automáticamente (A: 2/2; A+B: 4/4) y un build negativo rechazado por traducción incompleta. |
| Regresión de navegador I-01 aislada | Ambos proyectos: hidratación, validación, normalización, teclado, foco, reset, Tailwind responsive; axe sin incidencias en estado inicial, error y éxito (seis análisis). |
| Capturas reales y zoom | Móvil/tablet/escritorio ES/EN, foco, dos escenas 1080×1920; zoom nativo 200 % ES/EN sin overflow. |

La primera ejecución de `npm run verify` pasó tipos, lint, formato, 59 unitarias y nueve componentes; se detuvo en seis hallazgos axe. Tras corregirlos se repitieron las comprobaciones afectadas, con 26 E2E correctos, y la integración. No se afirma que aquella ejecución completa terminara con exit 0. La cobertura final combina esas ejecuciones y las comprobaciones finales de calidad; se evita repetir las suites I-01 ya satisfechas cuando los cambios posteriores no las afectan. `test:a11y` no se repite por separado porque los mismos casos forman parte del E2E ejecutado.

La integración A+D → A+B+D obtiene dos y cuatro rutas ES/EN respectivamente. Comprueba hashes de todos los archivos comunes y de A; el único delta de código es la carpeta B y el registro de prueba. Hay doce capturas de catálogos con una/dos entradas en ES/EN a 320/768/1440 px y navegación al idioma equivalente. Se escanean nombres y bytes de todos los artefactos del entregable: sin ids, marcas, rutas, HTML, assets o chunks sintéticos/borradores. La prueba acredita que no modifica `src/` ni `dist/` del producto y no introduce una bandera de publicación de fixtures.

## Trazabilidad I02-AC1–14

| Criterio | Evidencia y resultado |
| --- | --- |
| AC1 | Portadas directas ES/EN, copy veraz, vacío útil, sin artículos/enlaces a herramientas inexistentes. E2E y capturas correctos. |
| AC2 | 32 casos de contrato/rutas, borradores sin loader; escaneo final de once artefactos sin fixtures ni borradores. |
| AC3 | Selector y navegación por teclado en ambos idiomas; equivalencia de A/B verificada mediante rutas y navegador aislado. |
| AC4 | Diccionarios completos, `lang`, títulos, descripciones y nombres accesibles; 13 pruebas de traducciones y build negativo de UI propia. |
| AC5 | Raíz 200 estática hacia español y 404 reales en locales/rutas/slugs desconocidos y borradores. Recuperación bilingüe comprobada. |
| AC6 | ES/EN a 320/393/768/1280/1440 px, sin overflow ni recortes; zoom nativo 200 % con viewport 1280→640 CSS px. |
| AC7 | Teclado, salto al contenido, foco y objetivos ≥48 px; seis E2E axe sin incidencias, más revisión asistida y regresión I-01. |
| AC8 | Health checks estrictos sin peticiones externas, errores de aplicación o persistencia; recursos locales y navegación sin cuentas/servicios. |
| AC9 | Tipos, lint, formato, unitarias, componentes, build, E2E e integración correctos con versiones fijadas; arquitectura actualizada. |
| AC10 | Informe, capturas reales y paquete descargable identificados; entrega revisada y aceptada expresamente por el propietario el 2026-11-05. |
| AC11 | A+D → A+B+D: cuatro rutas, A sin cambios funcionales, fuentes comunes intactas, catálogo sin loaders y D sin ruta/UI. |
| AC12 | Builds temporales reutilizan contrato/ruta/layout reales; separación de dominio y pruebas de exclusión sobre el entregable. |
| AC13 | Comparación asistida con la segunda maqueta: misma composición, familias, paleta y jerarquía; contraste y foco comprobados. El propietario revisa personalmente escritorio/móvil y acepta el diseño el 2026-11-05. |
| AC14 | Dos capturas reales 1080×1920, portada y catálogo móvil legibles; sin recortar texto/controles esenciales. Las superposiciones reales de TikTok/Reels/Shorts requieren la revisión editorial del propietario al elegir la plataforma de grabación. |

## Revisión visual y recursos

Comparación asistida de las capturas reales con `docs/design-docs/assets/i02/escritorio.png`, `movil.png` y `escritorio-en.png`: se conservan marca, etiqueta, titular, subrayado lima, CTA violeta, motivo original, disposición del catálogo y navegación móvil visible. La interfaz no incluye el pie de identificación de maqueta. Los textos de lectura del estado vacío tienen al menos 16 CSS px; su mayor tamaño provoca pequeños cambios de altura y saltos respecto al espécimen. La revisión de 768 px no detecta solapamiento entre titular y decoración. No se atribuye esta inspección asistida al propietario.

Se mantienen Space Grotesk y DM Sans locales, originales, con licencias SIL OFL 1.1 y avisos redistribuidos. [Procedencia, cobertura, ejes, tamaños y hashes](../public/fonts/README.md). Total TTF: 376840 bytes. Se conserva TTF para evitar una dependencia de conversión; WOFF2 es una optimización posterior. Gráficos geométricos SVG originales, sin paquetes visuales ni CDN. No se adopta una licencia general del proyecto.

Contrastes sRGB comprobados en los colores utilizados: tinta/papel 14.32:1, texto secundario/papel 5.97:1, blanco/violeta 4.95:1, blanco/hover 6.27:1 y tinta/lima 12.18:1. Los elementos decorativos no comunican estados; el foco de tinta tiene 3 px y separación visible. Axe no detecta incidencias configuradas; esto no certifica por sí solo WCAG completa.

El ensayo vertical captura el layout móvil real a **360×640 CSS px y DPR 3**, produciendo **1080×1920**. Cuerpo y controles de 16 CSS px se muestran a 48 píxeles de salida; no se reduce una página de escritorio. El corte de la ilustración decorativa entre escenas es parte del scroll normal; titular, explicación y acción de portada, y estado vacío del catálogo, se ven completos en sus escenas. No se ocultan validaciones ni se implementa un modo de vídeo. Las reservas editoriales de las maquetas no son una zona segura universal: revisar las superposiciones concretas con el propietario antes de publicar un vídeo. No hay una miniapp real cuyo recorrido se pueda ensayar aún.

El zoom 200 % se aplica mediante `chrome.tabs.setZoom(2)` en una extensión local desechable, no mediante CSS, pinch zoom o `deviceScaleFactor`. Se comprueba `getZoom() === 2`, viewport 1280→640 CSS px y DPR 1→2. Perfil/extensión se eliminan al terminar y no forman parte de la aplicación.

## Incidencias y ajustes mecánicos

1. El primer check encontró una rama de validación de estado estrechada a `never`; se conserva el valor como `unknown` antes de validar. Se mantiene la validación de entradas malformadas.
2. Revisión de fuentes: corregidos `<main>` anidados, obligatoriedad de textos ES vacíos y nombres 404 en diccionarios. La estructura final tiene un único contenido principal.
3. Axe detectó `label-content-name-mismatch`: «ES»/«EN» visibles no estaban incluidos literalmente en sus nombres accesibles. Se añadieron a las traducciones accesibles y los seis casos axe pasaron sin desactivar reglas.
4. La comparación estricta de A entre raíces aisladas falló únicamente en el atributo opaco `astro-island uid`. Astro 7 calcula ese hash antes de reescribir las URLs de componentes. El harness normaliza exclusivamente ese atributo y exige igualdad byte a byte del resto del HTML, incluyendo estilos, props, scripts y URLs. Conserva hashes originales y normalizados; la hidratación real se comprueba sin normalización. Sin cambios de producto o contrato.
5. El screenshot `fullPage` de Playwright con zoom nativo producía un artefacto de recorte. El ensayo usa captura de viewport por CDP y scroll DOM, conservando métricas verificadas de zoom. Los PNG finales se inspeccionaron sin edición de imagen.

No fue necesario adoptar un cambio material de ADR, stack, contrato, dependencia o alcance.

## Evidencias y reproducción

Capturas del resultado público, generadas en `.local/verification/i02/visual/`, carpeta ignorada por Git y por tanto no consultable desde el repositorio (nota añadida el 2026-11-13; antes eran enlaces rotos): escritorio ES (`desktop-es.png`), móvil ES (`mobile-es.png`), escritorio EN (`desktop-en.png`), móvil EN (`mobile-en.png`), tablet ES (`tablet-es.png`), 9:16 portada (`vertical-9x16-home.png`), 9:16 catálogo (`vertical-9x16-catalogue.png`), zoom 200 % (`zoom-200-es.png`).

Paquete de revisión de esta sesión: `/workspace/shared/downloads/I02-evidencias.zip`; extraer y abrir `index.html`. Incluye capturas ES/EN, tablet, foco, zoom, 9:16, informe y manifiestos. Los catálogos sintéticos de integración se identifican expresamente como pruebas y no son el producto público.

Logs y salidas reproducibles, ignorados por Git:

* `.local/verification/i02/verify-first.log`: primera pasada, con hallazgos axe.
* `.local/verification/i02/verification-final.log`: calidad, traducciones y 26 E2E correctos; conserva el primer fallo de comparación UID en integración.
* `.local/verification/i02/final-quality.log`: calidad final exit 0.
* `.local/verification/i02/integration-final.log` y `modular/result.json`: integración final exit 0, hashes, rutas, límites y exclusión.
* `.local/verification/i02/visual/`: PNG, `capture.json`, `zoom.json` y logs de navegador.
* `playwright-report/` y `test-results/`: resultado E2E final.

```sh
export PATH=/workspace/.tools/node-v24.22.2-linux-x64/bin:$PATH
export ASTRO_TELEMETRY_DISABLED=1
export PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright
npm run verify
npm run capture:review
```

En otro entorno, preparar el runtime y las dependencias fijadas según README; instalar el navegador de Playwright con el mismo `PLAYWRIGHT_BROWSERS_PATH` usado al ejecutar. `verify` incluye build/E2E e integración; `capture:review` construye y gestiona un preview temporal en 127.0.0.1:4321 para capturas ordinarias y zoom. Ambos necesitan el puerto libre. No crean una URL pública. La integración usa previews temporales en 4322 y cierra los procesos.

## Límites y parada

El propietario revisó personalmente las capturas reales de escritorio y móvil y aceptó expresamente el resultado el 2026-11-05. Esta aceptación es posterior y distinta de la aprobación previa de la dirección artística. Las superposiciones concretas de futuras grabaciones siguen sujetas a revisión editorial según plataforma; no se atribuye esa comprobación a la revisión de escritorio/móvil. Sin bloqueos técnicos abiertos acreditados.

La evidencia es local, Chromium escritorio/móvil emulado: no acredita dispositivos físicos, otros motores, lectores de pantalla reales, WCAG completa, métricas de campo o comportamiento de Cloudflare. No hay despliegue ni URL pública. Se mantienen las deudas y límites de I-01 y [PEND-007](exec-plans/tech-debt-tracker.md#pend-007--seguimiento-de-incidencias-moderadas-de-lint): once incidencias moderadas históricas de tooling, sin un nuevo audit ni cambios forzados de dependencias. No se cierra esa deuda.

Se registra [PEND-008](exec-plans/tech-debt-tracker.md#pend-008--movimiento-suave-y-microinteracciones-futuras): futura flotación suave de la ilustración principal y posibles microinteracciones/transiciones adicionales, respetando `prefers-reduced-motion`. No se implementan ni alteran las decisiones vigentes por registrarlas.

I-02 queda `Aceptado` y archivado en `completed/`. El propietario autoriza su commit local de cierre y solo preparar el borrador de I-03. No se ejecuta I-03 ni se realizan pushes o despliegues. Logs, capturas reales y demás evidencias ignoradas permanecen fuera del commit; el informe conserva sus resultados y reproducción.
