# CP-01 — Informe de ejecución: identidad y animaciones

**Fecha:** 2026-11-08. **Responsable de aceptación:** propietario de MiMiniApp.

**Resultado:** identidad estática implementada, verificada técnicamente y **Aceptada expresamente por el propietario el 2026-11-08** (CP-AC06). CP-01 queda **`Aceptado`** por el propietario el 2026-11-08, tras aceptar también el resultado de Iteración 2. **Iteración 2 autorizada posteriormente y ejecutada; véase su sección de resultados.** El [ExecPlan](exec-plans/completed/CP-01-creative-playground.md) es la fuente canónica de estado y límites.

## Procedencia y preservación

* Base remota comprobada: `origin/staging` = `e2830fa0a5682da1660bbf5189daf62b9c90c98c`, merge del PR documental #5. Rama nueva `feature/cp01-identidad-visual` desde esa base; sin modificar directamente staging/main/master.
* Preparación local guardada antes del cambio: 18 archivos de documentación/referencia, tar, patch y manifiesto SHA-256 en `.local/verification/cp01/preparation-backup/`. Ninguna eliminación de la exploración o de documentos sin commit.
* Galerías `.local/creative-playground/` y `.local/creative-playground-v2/` intactas. El [manifiesto de aprobación](design-docs/assets/creative-playground-v2/reference-manifest.json) permite contrastar los originales y copias seleccionadas. No se alteraron los prototipos para hacerlos coincidir con el resultado.
* Aprobación formal de ADR-MMA-018 y CP-01, autorización exclusiva de Iteración 1 y permiso para PR en borrador registrados en las fuentes canónicas. La flotación central está aprobada como dirección/contrato, pero su implementación e intensidad visual quedan para Iteración 2.

## Cambios implementados

`BrandInitial.astro` contiene las cuatro piezas originales. Lo reutilizan `Wordmark.astro`, `BrandMark.astro` y `LaboratoryArt.astro`. Los ocho contornos restantes del wordmark son exactamente `iMiniApp`, tomados del SVG compacto aprobado: no hay una M adicional ni sustitución por texto de otra fuente. Cabecera y pie usan el mismo wordmark; cada enlace se llama MiMiniApp una vez en el árbol accesible.

El hero incorpora la M con la transformación seleccionada y el margen/viewBox del prototipo. Conserva sus formas, colores y distribución general. El estado vacío usa el mismo isotipo dentro del panel existente, sin cambiar copy, mensajes secundarios o disponibilidad del catálogo.

`public/brand/` contiene compacta, editorial e isotipo, claros/oscuros, idénticos a los seis SVG de referencia. La editorial es un recurso reutilizable; no hay selector de identidad o tema oscuro. El favicon SVG estático reutiliza el isotipo y se enlaza desde el layout y el documento de raíz. Se revisó a 16/32/48 px. Fuentes locales y sus avisos OFL sin cambios; no se añade una licencia general del proyecto.

Se ajustan únicamente dimensiones y reglas de la marca que antes componían icono + texto. En Iteración 1 no se implementaron scripts, keyframes, ensamblaje, hover animado, movimiento continuo, control de pausa u otras funciones de Iteración 2. No se modifican registro modular, dependencias, workflows, despliegue, Cloudflare o protecciones.

## Verificaciones locales

Entorno reutilizado sin reinstalar dependencias: Node 24.22.2, npm 11.19.1, Playwright 1.64.1 y Chromium **156.0.8078.4 / revisión 1248**. Ruta registrada por el capturador: `/workspace/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`. Sin sustitución por Chromium del sistema.

| Comprobación | Resultado |
| --- | --- |
| `npm run verify` | Exit 0: check, lint, formato, hosting, unitarias, componentes, build/E2E e integración modular. |
| Unitarias | 314/314, 14 archivos; incluye los controles de release/CI existentes. |
| Componentes | 9/9. |
| E2E Chromium escritorio/móvil | 36/36: 26 regresiones existentes, incluidos 6 casos axe, y 10 casos nuevos de identidad/progresivo/recursos. |
| Integración modular | A+D → A+B+D pasa; 2→4 rutas ES/EN, descubrimiento de pruebas de módulos, rechazo de traducción obligatoria vacía, aislamiento y exclusión de borradores/fixtures preservados. |
| Capturas CP-01 | Exit 0: 20 vistas/detalles/comparaciones más foco de teclado y revisión de zoom real. |
| Zoom real al 200 % | ES/EN pasan mediante `chrome.tabs.setZoom(2)`, viewport/DPR acreditados, sin overflow y con enlaces de cabecera visibles y ≥48 px de alto. No se sustituye zoom por DPR. |
| Revisión final de tipos/lint/formato | Repetida al incorporar el capturador reproducible; resultados en el log final. |

Las nuevas E2E contrastan las coordenadas/contornos con la referencia externa aprobada, comprueban una única composición SVG por enlace y las mismas cuatro piezas en marca/hero/estado vacío. Comprueban activos idénticos, favicon, ausencia actual de scripts/animaciones/controles de demo, navegación ES/EN y contenido sin JavaScript a 320 px. No se borró ni debilitó ninguna aserción existente para permitir una aproximación.

Incidencia de preflight: el primer `npm run check` sin `ASTRO_TELEMETRY_DISABLED=1` terminó con ENOENT al intentar crear `/home/agent/.config/astro` en el sandbox. Se utilizó la variable ya prevista por CI, sin cambiar código o configuración de entorno; la batería posterior pasó completa. Git fetch necesitó el acceso de red del ejecutor fuera del sandbox, conservando proxy/política; después se acreditó la base remota actual. No se amplió ningún dominio o permiso.

## Capturas comparativas y revisión asistida

Las capturas de implementación provienen del build ordinario servido solo en loopback. Las referencias se abren desde la galería original **sin modificarla**, con reduced-motion, y están rotuladas para distinguirlas del producto. Los [PNG seleccionados y su manifiesto](review/cp01-iteration-1/manifest.json) se conservan para revisión en el repositorio; no se sirven en el build público.

| Vista | Aplicación real | Comparación con v2 |
| --- | --- | --- |
| Escritorio ES | [Captura](review/cp01-iteration-1/desktop-es.png) | [Lado a lado](review/cp01-iteration-1/comparison-desktop-es.png) |
| Escritorio EN | [Captura](review/cp01-iteration-1/desktop-en.png) | [Lado a lado](review/cp01-iteration-1/comparison-desktop-en.png) |
| Móvil ES | [Captura](review/cp01-iteration-1/mobile-es.png) | [Lado a lado](review/cp01-iteration-1/comparison-mobile-es.png) |
| Móvil EN | [Captura](review/cp01-iteration-1/mobile-en.png) | [Lado a lado](review/cp01-iteration-1/comparison-mobile-en.png) |
| Favicon 16/32/48 px | [Tamaños reales](review/cp01-iteration-1/favicon-sizes.png) | Mismas piezas del isotipo seleccionado |
| Vertical 9:16 | [Portada](review/cp01-iteration-1/vertical-9x16-home.png), [catálogo tras scroll](review/cp01-iteration-1/vertical-9x16-catalogue.png) | Viewport móvil real 360 × 640 a DPR 3 → 1080 × 1920 |

Revisión asistida realizada: M integrada y legible, sin hueco de isotipo separado; cabecera/pie coherentes; símbolo central idéntico en lenguaje y geometría; estados vacío y bilingüe conservados; favicon reconocible pequeño. Los PNG apoyan la revisión, no sustituyen la aceptación visual del propietario ni certifican WCAG completa.

**Diferencias visibles respecto a la galería:** la web conserva los márgenes, tamaños responsive del hero, colores de navegación, subrayado del titular, texto secundario del catálogo y composición del estado vacío/pie del producto I-02. La galería era una reconstrucción aislada con CSS de exploración; no se copian sus barras de demo ni sus simplificaciones de catálogo. El nuevo wordmark y la M central conservan los contornos y proporciones seleccionados. El viewBox ampliado conserva el margen de dibujo previsto para la identidad aprobada. Todas las formas están estáticas porque las animaciones pertenecen a Iteración 2. No se atribuye al hito actual la validación de su intensidad o ritmo.

## Matriz de criterios y punto de parada

| Criterio | Estado en esta entrega |
| --- | --- |
| CP-AC01 | Verificado técnicamente: geometría coincidente, compacta/editorial e isotipo claros/oscuros. |
| CP-AC02 | Verificado técnicamente: nombres/enlaces únicos, cabecera/pie y favicon. |
| CP-AC03 | Verificado técnicamente: M central y coherencia del catálogo, sin publicación de fixtures. |
| CP-AC04 | Verificado técnicamente/asistido: ES/EN, matriz responsive, teclado/axe y zoom real. |
| CP-AC05 | Verificado: batería completa e independencia modular. |
| CP-AC06 | Cumplido: comparaciones entregadas y **aceptación visual expresa del propietario el 2026-11-08**, «sí, lo acepto». |
| CP-AC07–14 | No ejecutados en el hito estático; resultados de la posterior Iteración 2 en la matriz final siguiente. |

PR **[#6](https://github.com/aalexlpez/miminiapp/pull/6)** abierto en borrador hacia staging. Commit de implementación `007534ce15b3f34c2b90da7674c767bb6e5552b1`; **CI quality success** en [run 42512670663](https://github.com/aalexlpez/miminiapp/actions/runs/42512670663), evento pull_request del PR #6 y SHA de head coincidente, comprobado mediante API. Todos los pasos requeridos terminaron satisfactoriamente. El cierre de Iteración 1 en `6f367e5` fue exclusivamente documental; Iteración 2 incorpora después el sistema autorizado de movimiento; el resultado del SHA vigente se consulta en los checks del PR antes de su entrega. La descarga del ZIP de logs desde Codex recibió 403 en `results-receiver.actions.githubusercontent.com`; no se amplió la red. La evidencia API de run/job/steps sí está disponible, y los logs íntegros se consultan en GitHub. Los conteos anteriores pertenecen a la ejecución local registrada; no se sustituye la evidencia remota por una ejecución local. El PR debe permanecer en borrador, sin merge/auto-merge. El merge a staging puede disparar el publicador ya existente: requiere decisión humana posterior; esta entrega no realiza despliegues. Producción, promoción y rollback siguen bloqueados y master permanece predeterminada.

## Reproducción y evidencia completa

```sh
export PATH=/workspace/.tools/node-v24.22.2-linux-x64/bin:$PATH
export ASTRO_TELEMETRY_DISABLED=1
export PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright
npm run verify
node tests/visual/cp01.ts
```

El capturador requiere el build producido por verify, el Chromium fijado y la galería v2 original para las comparaciones. Un clon limpio dispone de las referencias conservadas en docs y las capturas seleccionadas; no se presume que contenga `.local/`. Si falta la galería, restaurar el ZIP de revisión original y verificar sus hashes; no generar una referencia distinta silenciosamente. La reproducción de capturas requiere permitir procesos de navegador/servidor local en el ejecutor.

Evidencia completa ignorada en `.local/verification/cp01/iteration-1/`: `verify.log`, `final-checks.log`, `capture.log`, `visual/capture.json`, `visual/zoom.json`, foco, tablet y detalles. El informe y el manifiesto seleccionado son durables; no se incluyen node_modules, dist, perfiles de navegador, logs temporales o prototipos de laboratorio en el commit. La suite remota no se ejecuta contra el staging actual como si sirviera esta identidad; no se ha publicado el candidato.


## Aceptación visual de Iteración 1 — 2026-11-08

El propietario responde «sí, lo acepto» a la solicitud de aceptación visual de Iteración 1. La entrega revisada corresponde al PR #6 en borrador, HEAD `6f367e5976fddbee4bf566a873d31fc4b6418651`, con [CI final satisfactorio 42513124125](https://github.com/aalexlpez/miminiapp/actions/runs/42513124125), capturas ES/EN, comparaciones y las diferencias documentadas. Se registra Iteración 1 Aceptada y CP-AC06 cumplido. La aceptación no autoriza merge, despliegue ni ejecución de Iteración 2; CP-01 permanece En curso. Este registro documental no modifica el frontend ni requiere repetir las pruebas ya satisfactorias.


## Iteración 2 — Sistema de animaciones autorizado y ejecutado

**Autorización:** el propietario autoriza expresamente Iteración 2 el 2026-11-08, después de aceptar Iteración 1. Se conserva la rama `feature/cp01-identidad-visual` y el PR #6 en borrador. Su ejecución no autoriza merge, despliegue, infraestructura o miniapps reales.

### Implementación y fidelidad

`src/styles/motion.css` contiene el ensamblaje expresivo y hover de las cuatro piezas, ocho entradas de formas y siete bucles: seis de B y la flotación aprobada de la tarjeta/M (6,4 s, −6 unidades y 1,5°). Se conservan los contornos de la identidad aceptada. Las capas de entrada y ambiente se separan; los pivotes se limitan a las capas animadas y a cada pieza, manteniendo las transformaciones geométricas de base. La M termina ensamblada; la flotación no la reconstruye en cada ciclo. No se implementan A, C, ensamblaje fluido o selectores de alternativas.

El portado conserva la curva global de WAAPI: CSS aplica easing por intervalo de keyframes, por lo que copiar literalmente los offsets 64/84 % habría cambiado el ritmo. Se subdivide la Bézier original y se normalizan sus segmentos; los offsets temporales CSS equivalentes son 22,630791996958 % y 38,743269771573 % (hover: 9,967727396766 %). **Las E2E comparan con WAAPI independiente del prototipo los seis componentes de las matrices a nueve tiempos y cuatro piezas por perfil**, con diferencia máxima permitida <0,03 unidades. Ambos perfiles pasan. No se sustituye el ensamblaje por opacidad ni un movimiento conjunto del SVG.

`src/scripts/motion.ts` coordina solo arranque, eventos finitos, hover, pausa, media query y visibilidad. No hay React, dependencias nuevas, timers por fotograma, cookies o almacenamiento de preferencias. Astro integra automáticamente el módulo pequeño en el HTML: un único script inline tipo module, sin peticiones `script[src]`. Se conservan las aserciones de ausencia de scripts externos y la raíz sin ningún script. La prueba de identidad se amplía para el módulo inline previsto y la identidad estática bajo reducción; el recorrido de teclado local/remoto incluye el nuevo botón sin eliminar controles de foco/tamaño.

Un botón nativo ES/EN junto al hero pausa/reanuda todo el movimiento decorativo del documento sin reiniciarlo. El espacio y dimensiones se reservan en SSR; el botón solo se habilita tras inicializar. Con reduced-motion queda deshabilitado y comunica el estado; las piezas se muestran completas y quietas. Sin JS, con CSP que bloquee el módulo o con fallo de inicialización, se conserva la identidad completa y se oculta el control no operativo. Las entradas se ejecutan una vez por instancia/documento; no se repiten por scroll, foco o restauración. Hover se limita a punteros con capacidad hover y no interrumpe el ensamblaje.

### Resultados reproducidos

| Verificación | Resultado |
| --- | --- |
| `npm run verify` final | **Exit 0**: 314 unitarias, 9 componentes y **52 E2E** en Chromium escritorio/móvil, más tipos/lint/formato/hosting/build e integración modular. Los 16 casos E2E adicionales cubren la Iteración 2. |
| Accesibilidad | Axe original y estados pausado/reducido ES/EN; teclado con el botón incluido y foco visible. Sin afirmar certificación WCAG completa. |
| Fidelidad del ensamblaje | Portado CSS vs WAAPI pasa en ambos perfiles; cuatro trayectorias/giros y encaje final. Hover finito 480 ms + escalonado 18 ms. |
| Ambiente | Siete animaciones independientes con las duraciones/fases aprobadas; pausa congela tiempos y transformaciones y reanuda sin reiniciar. |
| Preferencias/fallback | Reduced-motion inicial y dinámico, pausa manual prioritaria al restaurar preferencia, contenido sin JS, CSP y fallo de observador pasan. |
| Visibilidad fuera de pantalla | Pausa/reanudación sin repetir entrada; una pausa manual se conserva después de salir/entrar en viewport. |
| Visibilidad nativa y BFCache | Chromium completo fijado, ventana real en Xorg dummy/xfwm4 privados ya instalados; CDP `noDefaults:true` evita la emulación de foco de Playwright. **Cuatro eventos `visibilitychange` nativos, todos `isTrusted=true`**, hidden/visible, tiempos congelados y reanudación/preservación de pausa manual. **Restauración real BFCache `persisted=true`** con pausa conservada y sin reensamblaje. No se sobrescribe document.hidden ni se despachan eventos falsos. |
| Capturas/grabaciones | Capturador final exit 0, **22 vistas/detalles/comparaciones** más foco y zoom real ES/EN al 200 %. Dos grabaciones reales de unos 25 s, con >18 s de ambiente antes de pausar y reanudar. |
| Verificación final de capturadores | Check: 72 archivos, cero errores/avisos; lint/formato pasan. |

El perfil headless habitual fuerza visibilidad y no acredita ocultación real de pestaña. El ensayo nativo usa el mismo Chromium 156.0.8078.4/revisión 1248 mediante conexión CDP sin emulaciones sobre una pantalla privada, sin abrir puertos públicos ni instalar dependencias. La historia BFCache se recorre mediante su entrada nativa: una restauración no emite un nuevo load. Los procesos y perfiles de prueba son temporales, no runtime del producto ni configuración de infraestructura.

Se conservaron los fallos y repeticiones: la primera batería focalizada detectó un locator que conservaba el nombre anterior del botón y precisión flotante 18 vs 18,000000000000004; se corrigieron las aserciones sin cambiar el comportamiento. La primera batería completa detectó cuatro recorridos antiguos que solo enumeraban enlaces; se incluyó el botón, manteniendo todos los requisitos de foco/tamaño. La repetición final pasa íntegra. Un fallo de limpieza temporal del perfil en el capturador no fue una verificación satisfactoria; se cerró Chromium antes de borrar el perfil y se completó el capturador final con exit 0.

### Recursos y estabilidad

Comparación en el mismo ejecutor con el commit aceptado `6f367e5`, reconstruido en un worktree aislado fuera de carpetas ignoradas. Su CSS vuelve a producir el archivo aceptado `global.BbHDy4pF.css`. Una primera copia dentro de `.local` alteró el descubrimiento de Tailwind y **se descartó como baseline no comparable**; sus valores no se usan para afirmar rendimiento.

* CSS del build aceptado: **5745 bytes gzip**; actual: **6971**, incremento **1226 bytes** (presupuesto adicional ≤5120).
* Coordinador inline: **2271 bytes sin comprimir / 872 gzip** (presupuesto ≤5120); ninguna descarga JS externa nueva.
* **CLS observado 0 en ambos builds**, incluyendo carga y, en el actual, pausa/reanudación y cambio a reduced-motion. Cero tareas largas en las dos muestras locales; pausa/reanudación con cálculo de estilo: aproximadamente **1,8 ms** en esta ejecución.
* Se conservan muestras/trazas locales y geometrías; no se atribuyen percentiles de campo, INP real ni una certificación de rendimiento a estas mediciones.

[Presupuesto](review/cp01-iteration-2/resource-budget.json), [mediciones](review/cp01-iteration-2/performance.json) y [visibilidad/BFCache](review/cp01-iteration-2/native-visibility.json). Las trazas completas y el script de medición se incluyen en el paquete local de revisión, fuera del build y del commit.

### Evidencia visual real de Iteración 2

| Entrega | Evidencia |
| --- | --- |
| Escritorio con entrada, hover, ambiente y pausa | [Grabación real](review/cp01-iteration-2/desktop-motion.mp4) |
| Detalle de M integrada | [Recorte ampliado de la grabación real](review/cp01-iteration-2/wordmark-detail.mp4); no es otro render de la marca |
| Hero B + tarjeta/M en bucle | [Detalle de grabación real](review/cp01-iteration-2/hero-detail.mp4) |
| Móvil vertical 9:16 | [Grabación real](review/cp01-iteration-2/mobile-9x16-motion.mp4): viewport 360×640, scroll auténtico, exportación a 1080×1920 por escalado; no un modo de grabación de la web |
| Escritorio ES / EN con reducción | [ES](review/cp01-iteration-2/desktop-es.png), [EN](review/cp01-iteration-2/desktop-en.png) |
| Móvil ES / EN con reducción | [ES](review/cp01-iteration-2/mobile-es.png), [EN](review/cp01-iteration-2/mobile-en.png) |
| Comparaciones contra v2 intacto | [Escritorio ES](review/cp01-iteration-2/comparison-desktop-es.png), [EN](review/cp01-iteration-2/comparison-desktop-en.png); [móvil ES](review/cp01-iteration-2/comparison-mobile-es.png), [EN](review/cp01-iteration-2/comparison-mobile-en.png) |
| Fotogramas con movimiento normal | [Escritorio](review/cp01-iteration-2/desktop-motion.png), [móvil tras scroll](review/cp01-iteration-2/mobile-9x16-motion.png) |
| 9:16 estático completo / catálogo | [Portada](review/cp01-iteration-2/vertical-9x16-home.png), [catálogo](review/cp01-iteration-2/vertical-9x16-catalogue.png) |

[Manifiesto de ficheros y hashes](review/cp01-iteration-2/manifest.json). Referencias v2 y evidencia aceptada de Iteración 1 intactas. La revisión asistida aprecia movimiento independiente visible, M sólida tras encaje y navegación/titular estables. Diferencias explícitas frente a la galería: se conserva la composición del producto I-02, se incorpora el control accesible junto al hero y se añade la flotación central aprobada después de la exploración; las barras de laboratorio y variantes descartadas no están en la web. La intensidad final de esa flotación fue aceptada expresamente por el propietario el 2026-11-08.

### Matriz final de CP-01

| Criterio | Evidencia de cumplimiento local |
| --- | --- |
| CP-AC01 | Geometría y recursos de marca de Iteración 1 preservados; regresión contra SVG aprobados pasa. |
| CP-AC02 | Cabecera/pie/isotipo/favicon y nombres/enlaces ES/EN preservados. |
| CP-AC03 | Centro M y catálogo coherentes; ningún módulo real o fixture público. |
| CP-AC04 | Responsive 320/393/768/1280/1440, idiomas, teclado/axe y zoom real al 200 % pasan. |
| CP-AC05 | Regresiones I-01/I-02 e integración aislada A→A+B/exclusión de borradores pasan. |
| CP-AC06 | Iteración 1 Aceptada expresamente por el propietario antes de autorizar Iteración 2. |
| CP-AC07 | Ensamblaje CSS fiel a WAAPI, cuatro piezas, retrasos y encaje; una entrada por instancia. |
| CP-AC08 | Siete bucles, capas de entrada/ambiente, fases y flotación central; grabación >18 s. |
| CP-AC09 | Hover breve y finito; sin activación por foco o toque. |
| CP-AC10 | Pausa/reanudación real, teclado, etiquetas ES/EN y foco/contraste/tamaño. |
| CP-AC11 | Reduced-motion dinámico/fallback, visibilidad nativa y BFCache acreditados. |
| CP-AC12 | Presupuesto JS/CSS cumplido, CLS 0 y trazas locales; sin librerías, almacenamiento o bucle JS por frame. |
| CP-AC13 | Verify íntegro exit 0 (314+9+52), integración y gates existentes intactos. CI quality de implementación a6942c6 satisfactorio; último check del PR para el cierre documental. |
| CP-AC14 | Informe, capturas, clips reales y manifiesto entregados; resultado e intensidad de Iteración 2 aceptados expresamente por el propietario el 2026-11-08. |

Reproducción: `npm run verify`; después `DISPLAY=:93 node tests/visual/cp01-motion.ts` con pantalla/gestor de ventanas privados disponibles, Chromium fijado y galería original de comparación. El capturador preserva los archivos de Iteración 1 y registra en `.local/verification/cp01/iteration-2/`. Las mediciones adicionales/trazas y los comandos FFmpeg de recorte/escalado se conservan en el paquete de revisión. Solo las capturas/clips seleccionados y metadatos pequeños se versionan para revisión; no se publican con la aplicación. Sin datos de usuarios o credenciales.

No se ha desplegado este candidato ni ejecutado su suite remota contra el staging antiguo. El PR #6 continúa en borrador; master predeterminada y producción/promoción/rollback sin cambios. CI de implementación **a6942c6**: **quality success**, [run 42519292572](https://github.com/aalexlpez/miminiapp/actions/runs/42519292572), confirmado por API y SHA coincidente. El cierre posterior solo modifica documentación/metadatos de revisión; el último check del PR acredita su SHA vigente antes de entregar. CP-01 fue Verificado y queda posteriormente **Aceptado** por el propietario; cualquier merge/publicación sigue requiriendo una decisión separada.

La entrega de Iteración 2 fue **Verificada** y recibe ahora aceptación expresa del resultado/intensidad visual del propietario; se registra separadamente de la aceptación de Iteración 1. No se fusiona el PR, publica el candidato o comienza trabajo posterior.


## Aceptación final y cierre — 2026-11-08

El propietario responde **«acepto el resultado»** a la entrega de Iteración 2 y a la pregunta de aceptación del movimiento, incluida la intensidad de flotación central. La entrega aceptada corresponde al PR #6, HEAD `779b88bdd50249afde2d9edb22fd258a9c6f951b`, con [CI final satisfactorio 42519701947](https://github.com/aalexlpez/miminiapp/actions/runs/42519701947), grabaciones reales, comparaciones ES/EN y paquete de revisión. **Iteraciones 1 y 2 Aceptadas; CP-01 Aceptado y archivado.**

Se conservan las evidencias, deudas ajenas y limitaciones de este informe: Chromium/móvil emulado, medidas locales sin garantía de percentiles de campo, requisitos del ensayo nativo y suite remota del candidato pendiente de publicación autorizada. PEND-008 se resuelve en el alcance entregado. La aceptación no autoriza merge, despliegue, promoción o trabajo nuevo. Este cierre es documental; no se modificó el frontend ni se repitieron las pruebas ya satisfactorias.
