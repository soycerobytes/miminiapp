# Arquitectura actual

Actualización de movimiento autorizada el 2026-11-10 (enmienda ADR-MMA-018): `motion.ts` inicia el movimiento activo en cada documento; el botón de ondas de `MotionControl.astro` alterna pausa/reanudación y muestra raya diagonal al pausar. El sistema operativo ya no bloquea este control ni los SVG decorativos. La suspensión por visibilidad sigue siendo automática y temporal; no altera la pausa manual. Las microinteracciones de apariencia mantienen reduced-motion. Esta actualización sustituye las descripciones históricas de prioridad reduced-motion que aparecen más abajo.

**Actualizado:** 2026-11-08. **I-01:** Aceptado y archivado por el propietario. **I-02:** Aceptado expresamente por el propietario el 2026-11-05 y archivado, tras aprobación del plan/ADR-MMA-011/016/017 y autorización expresa de ejecución.

La base se mantiene en Astro 7.4.5 estático, React/DOM 19.3.1 cuando procede interacción, TypeScript 6.0.3 strict y Tailwind 4.3.4. Node 24.22.2, npm 11.19.1 y dependencias directas exactas con un único lockfile. I-02 no incorpora dependencias visuales o servicios externos.

## Componentes implementados

* `src/layouts/SiteLayout.astro`: documento HTML por idioma, título/descripción, salto al contenido, cabecera y pie comunes. No necesita hidratación React para navegar.
* `src/components/Home.astro`: hero y catálogo, con el mismo shell para cero o varias entradas. `EmptyCatalogue.astro` resuelve cero; `CatalogueCard.astro` presenta los metadatos recibidos cuando existen entradas publicadas.
* `SiteHeader.astro`, `SiteFooter.astro`, `BrandMark.astro` y `LaboratoryArt.astro`: navegación visible, selector ES/EN y gráficos locales de la segunda composición aprobada.
* `src/i18n/common/{es,en}.ts`: textos de plataforma separados de futuras traducciones de miniapps. `src/i18n/validation.ts` valida claves y texto obligatorio al importar los diccionarios durante prerender.
* `src/styles/global.css`: Tailwind mediante `@tailwindcss/vite`, tokens de Laboratorio creativo moderno, reflujo mobile-first, foco y estados comunes.
* `public/fonts/`: Space Grotesk y DM Sans variables autoalojadas en TTF, con sus avisos SIL OFL 1.1. No hay CDN de fuentes; no se añade una dependencia para convertirlas a WOFF2.
* `src/components/EnvironmentFixture.tsx` y `src/lib/validation.ts`: fixture técnica de I-01 y lógica pura conservadas para regresiones. No constituyen una miniapp pública.
* `src/lib/miniapp-registry.ts`: contrato discriminado, validación en runtime, proyección de metadatos publicados, tabla de rutas y resolución por id. `src/miniapps/registry.ts` contiene el registro público explícito vacío.
* `src/lib/locales.ts`: locales admitidos, español predeterminado y constructores de enlaces equivalentes. `src/pages/[locale]/index.astro`, `src/pages/[locale]/apps/[slug].astro`, `src/pages/index.astro` y `src/pages/404.astro` conectan esos contratos con la generación estática.

El [informe I-02](docs/i02-execution-report.md) registra pruebas y capturas reales. El build público contiene once archivos: cuatro HTML (`/`, ES, EN y 404), un CSS, un recurso genérico de integración React y cinco archivos de fuentes/avisos/documentación. Las portadas no solicitan ese JavaScript ni hidratan una isla; no hay miniapps públicas.

## Contrato modular y rutas de I-02

El contrato implementado separa descriptor puro (`id`, `slug`, estado y metadatos ES/EN) de la inscripción publicada con `loadEntry`, importación perezosa literal de `entry.astro`. Un borrador no admite loader. El catálogo consume únicamente la proyección de metadatos publicados. El registro público permanece vacío porque no se ha aprobado una miniapp real.

La portada genérica genera `/es/` y `/en/`. La ruta `pages/[locale]/apps/[slug].astro` genera únicamente publicadas × idiomas y transmite un identificador simple a la fase de render; resuelve el adaptador Astro durante prerender. Cada futura miniapp podrá separar metadatos, adaptador, UI React si procede, dominio puro, traducciones y pruebas dentro de su carpeta, sin editar rutas comunes, layouts u otras herramientas.

`/` usa HTML estático con meta refresh inmediato y enlace a `/es/`; su respuesta local es HTTP 200, no un 301 del servidor. Las rutas/locales/slugs desconocidos devuelven un 404 real en el preview comprobado y recuperación bilingüe mediante `404.html`. La política HTTP y normalización definitivas del alojamiento se comprobarán en I-03, sin configuración de Cloudflare en I-02. No se inventan canónicas ni `hreflang` absolutos sin un origen público aprobado.

Las fixtures sintéticas viven en `tests/integration/fixtures/`, con extensión de fuente de prueba `.fixture`, y el harness las materializa en un proyecto temporal que reutiliza los mismos contratos, rutas y layouts. El ensayo A+D → A+B+D pasó: dos y después cuatro rutas ES/EN; registro y carpeta B son el único delta de alta. Fuentes comunes, diccionarios y A conservan hashes; el HTML de A permanece idéntico salvo el `uid` interno de Astro derivado de la raíz temporal, normalizado solo en la comparación y conservando los hashes originales. Los once archivos del build público excluyen ids, marcas, rutas, HTML, assets y chunks sintéticos o de borrador. No hay una bandera para habilitarlas en el catálogo público.

## Verificación y límites

Vitest conserva la cobertura técnica de I-01 y añade contratos de catálogo/idiomas; Playwright cubre la interfaz ES/EN, rutas, navegación, responsive y axe con Chromium 156.0.8078.4 / revisión 1248, fijado por Playwright 1.64.1. La validación incremental final pasa con 59 unitarias (14 de I-01, 32 del registro, 13 de i18n), 9 componentes y 26 E2E, incluidos 6 casos axe, además de check/lint/formato/build e integración aislada. El harness descubre 2→4 pruebas propias de los módulos, rechaza un build con traducción obligatoria vacía y ejecuta regresiones de navegador de I-01 en ambos perfiles y tres estados axe. No se atribuye exit 0 a una repetición completa de `verify`; se conserva el fallo inicial de accesibilidad y la repetición de comprobaciones afectadas.

`tests/visual/capture.ts` y `tests/visual/zoom.ts` generan las capturas reales y comprueban el zoom del navegador al 200 %. Se revisaron ES/EN en móvil, tablet y escritorio y ensayos 1080×1920 de la portada y scroll al catálogo. Los estados de una y dos tarjetas tienen doce capturas sintéticas separadas. El propietario revisó personalmente las capturas de escritorio/móvil y aceptó I-02 el 2026-11-05. Las superposiciones concretas de futuras grabaciones se conservan como comprobación editorial posterior, sin reabrir la aceptación.

La base I-01 aceptada tiene evidencia histórica de 14 unitarias, 9 componentes y 8 E2E/axe, más revisión asistida de teclado/foco y seis capturas. El [informe I-01](docs/i01-execution-report.md), el [plan archivado](docs/exec-plans/completed/I-01-base-local-y-testing.md) y su [guía de continuación](docs/i01-handoff.md) conservan checkpoints, autorización de traslado, cierre y limitaciones.

No hay miniapp real, backend, base de datos, API externa, persistencia de usuario, analítica, CI remoto, Cloudflare ni despliegue. La primera miniapp, licencia general del proyecto, infraestructura, otros motores/dispositivos físicos y decisiones aún propuestas conservan sus pendientes. Se mantiene PEND-007 y el resto de la deuda documentada. El [objetivo de arquitectura](docs/design-docs/architecture-target.md) y los [ADR](docs/design-docs/index.md) conservan la distinción entre implementación local, contrato aprobado y propuestas futuras.

El propietario autoriza expresamente un commit local de cierre de I-02, sin pushes o despliegues. Solo se prepara el borrador de I-03; no se ejecuta. Su [ExecPlan aceptado y archivado](docs/exec-plans/completed/I-02-catalogo-responsive-e-i18n.md) es la fuente canónica del estado.

Las decisiones de alojamiento/operación I-03 aprobaron Editor por Worker y strict nativo de main hasta demostrar y aprobar cualquier sustitución. Las autorizaciones posteriores permitieron preparar la infraestructura y el propietario administró Cloudflare; staging ya está publicado. El resto del alcance sigue pendiente, sin activarse mediante documentación.

## Infraestructura I-03: staging verificado

Staging sirve la web estática de MiMiniApp en https://miminiapp-staging.miminiapp-lab.workers.dev. El propietario creó/administra el Worker y sus credenciales; GitHub Actions publicó el artefacto del merge `e1e3b6596f97b86ba7e2ff3d21aab1ac5e21e0c0` de PR #4. El [intento 4 del run 42305409224](https://github.com/aalexlpez/miminiapp/actions/runs/42305409224/attempts/4) completó prepare y remote-test; se confirmaron 12 archivos y 30 pruebas remotas. El [informe](docs/i03-staging-preparation-report.md) delimita evidencia y pendientes. I-03 sigue En curso; solo el hito staging está Verificado.

`.github/workflows/ci.yml` verifica los PR a staging/main sin secretos Cloudflare. `staging.yml` exige push a la rama staging, repositorio y autorización específica; prepara y publica el artefacto probado, con Environment staging, bloqueo compartido, probe y revalidación. `production.yml` y `rollback.yml` conservan if:false; promotion falla explícitamente hasta otra autorización. La política permite solo staging: no se altera ningún mecanismo en esta actualización documental.

`scripts/release/github.ts` confirma el PR fusionado mediante resumen y detalle; `pr-ci.ts` verifica identidad persistente por run-name/display_title, workflow fijado en head y merge, metadatos API y último intento/job quality. La persistencia posterior al merge ya se comprobó. El [contrato](docs/i03-pr-ci-identity.md) conserva el modelo de confianza y mantenimiento. Empaquetado, manifiesto, hashes, artefactos inmutables y recibo vinculan el contenido probado con lo servido.

`deploy/cloudflare/` contiene configuraciones de Static Assets sin SSR o backend. La de staging está publicada; la de producción permanece preparada y sin activación. El sitio conserva las rutas ES/EN, raíz 301, normalización de barras y 404 reales verificadas por las pruebas remotas. El preview local de Astro mantiene su comportamiento200 en la raíz. Los borradores/fixtures siguen excluidos del build público.

El propietario administra token/Account ID en GitHub Environment staging; Codex no requiere conectividad o credenciales Cloudflare. El probe acreditó lectura de staging y 403 del otro Worker, sin ensayo de escritura. Producción, promoción, rollback, aislamiento de escritura y aceptación global siguen pendientes. Se conservan main strict=true, master predeterminada y límites administrativos de Fase A; este documento no modifica su configuración.

El [informe de Fase A](docs/i03-phase-a-report.md) es histórico. La [guía operativa vigente](docs/i03-operations.md) describe feature → PR → CI → merge manual → Actions → Cloudflare → pruebas remotas, sin despliegues manuales semanales o ampliación de arquitectura.


## CP-01 — Identidad estática en rama de trabajo

ADR-MMA-018 y CP-01 están aprobados formalmente por el propietario el 2026-11-08. Solo Iteración 1 está autorizada: identidad estática implementada en `feature/cp01-identidad-visual`, aceptada visualmente por el propietario el 2026-11-08 y pendiente de merge autorizado. Esta descripción de la rama no afirma que el staging publicado ya sirva la nueva marca.

`BrandInitial.astro` comparte las cuatro piezas SVG seleccionadas entre `Wordmark.astro` (contornos compactos exactos), `BrandMark.astro` (isotipo) y el centro de `LaboratoryArt.astro`. Cabecera y pie componen un solo nombre accesible MiMiniApp, sin M duplicada. El estado vacío usa el mismo isotipo conservando su estructura. `public/brand/` distribuye seis SVG seleccionados y `public/favicon.svg` sustituye el favicon vacío en layout/raíz. La editorial es un recurso de marca, sin selector de producto.

La entrega estática de Iteración 1 conservaba HTML sin scripts/islas React ni runtime de movimiento; su evolución autorizada se describe después. Fuentes, tokens, navegación, rutas, registro y exclusión de fixtures/borradores se mantienen. El build ordinario tiene 19 archivos: los 12 anteriores más seis recursos de marca y favicon; ninguna referencia de docs, captura o prototipo se publica. El [informe CP-01](docs/cp01-execution-report.md) registra 314 unitarias, 9 componentes, 36 E2E/axe, integración modular, capturas ES/EN y zoom real al 200 %.

Ensamblaje, hover, ambiente B y flotación de la tarjeta central, coordinador mínimo y pausa están aprobados como contrato futuro; su ejecución fue autorizada posteriormente para Iteración 2. No se han cambiado workflows, infraestructura, credenciales, protecciones o configuración de despliegue. CP-01 queda Aceptado tras completar sus dos hitos y sus condiciones humanas; Iteración 1 queda Aceptada visualmente y el propietario autoriza posteriormente Iteración 2, cuyo resultado acepta después expresamente el 2026-11-08.


## CP-01 — Sistema de animaciones en la rama de trabajo

Iteración 2 autorizada expresamente el 2026-11-08 tras aceptar el hito estático. `src/styles/motion.css` conserva geometrías y ritmos de las cuatro piezas y compone capas de entrada/ambiente. Hero B tiene sus seis bucles y flotación moderada de tarjeta/M. `src/scripts/motion.ts` coordina arranque, hover, pausa en memoria documental, reduced-motion y visibilidad; Astro lo integra inline (sin descargas de scripts externos o React). `Home.astro` reserva el espacio del botón ES/EN y no lo ofrece como operativo sin inicialización. La identidad final completa es el estado base de SSR/CSS.

Las E2E comparan CSS/WAAPI y estados de pausa/fallback. El capturador `tests/visual/cp01-motion.ts` conserva la evidencia de Iteración 1 y añade grabaciones reales y `native-visibility.ts`: Chromium fijado con CDP sin emulaciones de foco, ventana privada, eventos nativos y BFCache. No son dependencias o código del producto. Presupuesto observado: 872 bytes gzip de JS y 1226 de CSS adicional; CLS 0 en las muestras. Batería local: 314 unitarias, 9 componentes, 52 E2E e integración modular.

El build conserva 19 archivos; la lógica mínima está inline y no añade un bundle externo solicitado por la portada. Registro, rutas, dependencias y workflows no cambian; tampoco el staging publicado, la infraestructura o la rama predeterminada. La aceptación visual de intensidad/fidelidad de Iteración 2 y el merge/publicación no se sustituyen por las pruebas. Véase el [informe completo](docs/cp01-execution-report.md).

Estado de CP-01: Aceptado y archivado, tras CI final 779b88b satisfactorio (run42519701947) y aceptación expresa del resultado animado por el propietario el 2026-11-08. El último check del PR #6 corresponde al cierre documental. No se afirma despliegue del candidato.

## CP-02 — Apariencia en la rama feature (2026-11-09)

ADR-MMA-019 y CP-02 aprobados y ejecución autorizada por el propietario, incluidos sus ajustes de tarjeta original, iconos y rotación. `AppearanceInit.astro` resuelve antes de la primera pintura una única clave `miminiapp.appearance`; `appearance.ts` mantiene light/dark/system, cambios del dispositivo, sincronización entre pestañas, pageshow y fallback en memoria ante almacenamiento bloqueado. `AppearanceControl.astro` muestra un botón con el icono activo; al pulsarlo abre un popover nativo anclado por CSS con tres opciones sol/luna/dispositivo. Nombres comunes ES/EN, aria-pressed y marca visible identifican la selección en el panel; seleccionar cierra y devuelve foco. Giro de 240 ms solo al elegir, cancelado con reduced-motion.

`appearance.css` define la paleta nocturna y fallback del sistema sin JS, además del control responsive. No hay nuevo provider, dependencia ni hidratación React. El layout incluye un inicializador inline y un único módulo inline combinado de apariencia/movimiento; la raíz conserva redirección y cero scripts. El favicon sigue al dispositivo con CSS interno, pudiendo diferir de la elección explícita de la página.

La tarjeta central del hero conserva siempre fondo #F7F5F0, borde #242136 y M #7950F2 de CP-01 mediante tokens invariantes. Los otros colores SVG consumen variables semánticas. No se alteran nodos, geometría, keyframes, coordinador ni estados de pausa del movimiento. La única excepción nueva de persistencia es apariencia; pausa y otros estados siguen efímeros. Esta implementación es local/en PR, sin nueva publicación. [Informe y límites](docs/cp02-execution-report.md).


Actualización aprobada por el propietario, 2026-11-09: sustituir los tres iconos siempre visibles por **un solo icono activo** en un botón de 48×48 px sin marco. Al pulsarlo, popover nativo compacto con las tres opciones por iconos; selección cierra y devuelve foco, Escape/clic exterior cierran. El botón comunica nombre del modo y expansión en ES/EN. Giro de 240 ms en el icono del botón tras elegir, salvo reduced-motion. Se elimina la fila móvil extra que requería el grupo grande. El resto del contrato de CP-02 permanece vigente. Cambio solicitado y autorizado expresamente dentro de CP-02/PR #7.


Ajuste autorizado por el propietario (2026-11-09): mover la pausa del hero a un solo icono de animaciones en la cabecera, junto a apariencia. Pulsación directa, sin desplegable; el mismo icono muestra una raya diagonal al pausar o con reduced-motion. Se conservan ciclo de vida, prioridad de reducción de movimiento, pausa en memoria, nombres/estado ES/EN y dianas de 48 px. ES / EN se compacta con texto de 13 px, separación y padding reducidos, preservando foco, enlaces equivalentes y áreas pulsables. Rama `feature/cp02-controles-cabecera` desde staging vigente, después del PR #11 fusionado por el propietario.
