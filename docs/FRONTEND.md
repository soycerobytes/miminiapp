# Frontend — criterios y estado de aprobación

**Estado:** I-01 Aceptado y archivado el 2026-11-05. I-02 aprobado y autorizado expresamente el mismo día, Aceptado expresamente por el propietario el 2026-11-05 y archivado, conforme a ADR-MMA-011/016/017: catálogo, rutas ES/EN y segunda composición visual aprobada. La evidencia de I-01 es histórica; las verificaciones y capturas de la interfaz nueva se registran por separado.
**Responsable:** propietario de MiMiniApp.

## Experiencia y contenido

La definición aprobada exige mobile-first con escritorio cuidado. Catálogo, miniapps, navegación, controles y resultados deben ser utilizables sin recortes ni scroll horizontal accidental, con estados de carga, vacío, error y éxito cuando proceda. No anunciar funciones o herramientas inexistentes.

La UI debe explicar brevemente para qué sirve cada herramienta y cómo usarla. Ejemplos reales y restablecimiento rápido permiten probar y grabar su funcionamiento; no se simula una capacidad para el vídeo. La legibilidad vertical 9:16 es un criterio de demostración y no limita la experiencia de escritorio.

## Idiomas y rutas

Español e inglés completos desde lanzamiento: contenido visible, formularios, errores, etiquetas accesibles y metadatos. El selector mantiene la miniapp equivalente. `/es/` y `/en/`, español predeterminado, slugs estables y separación/validación de traducciones están aprobados en ADR-MMA-016. Canónicas/hreflang absolutos y la comprobación del alojamiento siguen diferidos; Cloudflare se verificará en I-03.

Separar traducciones y formatos de la lógica de dominio. Formatear fechas, números e importes según locale cuando corresponda, manteniendo valores computacionales consistentes. La ejecución de I-02 comprueba enlaces directos, idioma y 404 real local; no acredita el futuro comportamiento del alojamiento.

El mecanismo propuesto por el dossier es `Intl` cuando proceda, sin mezclar el formato visual con los valores usados en cálculos; su configuración se comprobará con el stack de la iteración correspondiente.

## Dirección artística elegida para I-02

El 2026-11-05 el propietario elige expresamente **Laboratorio creativo moderno**: diseño limpio, profesional y minimalista, con elementos creativos, distintivos y atractivos, cuidado en móvil y escritorio y reconocible en TikTok, Instagram Reels y YouTube Shorts. Paleta inicial elegida: fondo `#F7F5F0`, texto `#242136`, violeta `#7950F2`, lima `#B9F65A` y coral `#FF9368`. Se permiten tonos funcionales derivados para contraste/accesibilidad.

El propietario aprueba expresamente el 2026-11-05 la segunda composición, con etiqueta «Laboratorio creativo», titular «Ideas que se vuelven herramientas» y navegación móvil visible, manteniendo la paleta y Space Grotesk/DM Sans bajo accesibilidad/licencias. ADR-MMA-017 registra esa aprobación, Tailwind mobile-first sin nuevas dependencias visuales, componentes que evolucionan de catálogo vacío a poblado sin rediseño, recursos locales y revisión mediante capturas móvil/escritorio accesibles en Codex Cloud. La [especificación visual](design-docs/i02-visual-proposal.md) documenta los detalles de referencia, las futuras miniapps en encuadres 9:16 legibles y la verificación de licencias antes de incorporar recursos finales. Los ajustes mecánicos de tokens/archivos se comprobaron en la ejecución autorizada de I-02, Verificado el 2026-11-05. Se reutilizan Space Grotesk y DM Sans locales en TTF, con avisos SIL OFL 1.1 conservados; no se instala una dependencia para convertir a WOFF2. El formato TTF mantiene la familia, pesos y dirección aprobados. Se implementa la composición elegida sin generar alternativas.

## Accesibilidad y rendimiento

Objetivo de diseño: **WCAG 2.2 AA**, con teclado, foco visible, contraste, etiquetas, nombres accesibles y anuncios de resultado. axe u otras comprobaciones automáticas no sustituyen la revisión manual ni certifican cumplimiento completo.

Metas de referencia para datos de campo cuando exista audiencia suficiente: **LCP ≤ 2,5 s**, **INP ≤ 200 ms**, **CLS ≤ 0,1**. Una medición local o Lighthouse no demuestra el percentil 75 real. Se propone hidratar solo la interacción necesaria y comprobar presupuestos de descarga/memoria en dispositivos representativos; no se inventa un umbral de bundle sin evaluación.

## Verificación de I-02

La matriz de I-02 conserva Chromium de escritorio y móvil emulado, fijado a 156.0.8078.4 / revisión 1248 por Playwright 1.64.1. Incluye acceso directo ES/EN, navegación, idioma equivalente, 404, teclado/foco, axe y reflujo a 320/393/768/1280/1440 px, además de capturas reales móvil/escritorio y 1080×1920. Las comprobaciones de demo/reset de I-01 se conservan en sus pruebas técnicas aisladas, sin publicar una herramienta ficticia.

El catálogo pasa de cero a una o varias entradas mediante los mismos componentes; los estados poblados se ensayan solo con fixtures aisladas. Las fuentes y gráficos se sirven localmente. El registro y las rutas genéricas evitan cargar interfaces para mostrar los metadatos del catálogo. La portada no necesita hidratación React; una miniapp futura solo hidratará su interacción cuando proceda.

El [ExecPlan](exec-plans/completed/I-02-catalogo-responsive-e-i18n.md) y el [informe](i02-execution-report.md) registran resultados: 26 E2E, incluidos 6 axe, más capturas reales ES/EN en móvil (393 px), tablet (768 px), escritorio (1440 px), encuadres 1080×1920 y zoom real al 200 %. La revisión responsive automatizada cubre 320/393/768/1280/1440 px. Se corrigió el idioma de los nombres accesibles ES/EN detectado por axe y pasaron las comprobaciones afectadas. La comparación asistida con las maquetas y las capturas de tarjetas pobladas se documentan por separado; el propietario revisó personalmente las capturas reales de escritorio/móvil y aceptó I-02 el 2026-11-05. Las capturas no certifican WCAG completo ni reemplazan la aceptación del propietario. La revisión asistida de I-01 a 1280×900/393×851 se conserva en su [informe](i01-execution-report.md), sin presentarla como evidencia de I-02. Otros motores, dispositivos físicos y datos de rendimiento en campo permanecen fuera de esta iteración.

## Mejora futura de movimiento

Por indicación del propietario el 2026-11-05 se registra [PEND-008](exec-plans/tech-debt-tracker.md#pend-008--movimiento-suave-y-microinteracciones-futuras): flotación suave de la ilustración principal y posibles microinteracciones/transiciones adicionales. Se conserva el diseño aceptado; no se implementa ahora. Deben respetar `prefers-reduced-motion`, mantener legibilidad y evitar desplazar contenido o interferir con controles. Aquel registro no cambió la política de movimiento de ADR-MMA-017 ni autorizó animación continua; su evolución visual posterior se distingue a continuación.


## Creative Playground — dirección aprobada y ejecución pendiente

El 2026-11-08 el propietario aprueba M modular integrada, wordmark compacto de interfaz/editorial de marca, ensamblaje expresivo, hover y hero B. Esta evolución delimitada de [ADR-MMA-017](design-docs/creative-playground.md) permite el ambiente B con pausa accesible y reduced-motion; sustituye hacia adelante la exclusión continua descrita en la mejora futura anterior, sin modificar la aceptación de I-02.

La [decisión ADR-MMA-018](design-docs/creative-playground.md#adr-mma-018--integración-y-accesibilidad) especifica SVG/CSS y coordinación nativa mínima, sin hidratación React, preferencias almacenadas o dependencias nuevas. El [ExecPlan CP-01](exec-plans/completed/CP-01-creative-playground.md), aprobado formalmente el 2026-11-08, queda Aceptado y archivado tras ejecutar y aceptar sus dos iteraciones. La identidad estática está implementada en la rama feature/cp01-identidad-visual, aceptada visualmente por el propietario el 2026-11-08; Iteración 2 fue autorizada expresamente después y está implementada/verificada localmente, aceptada visualmente por el propietario el 2026-11-08. En Iteración 2, las pruebas permitirán el coordinador local de portada y conservarán el resto de garantías de scripts/red/almacenamiento; la raíz estática seguirá sin scripts.

La verificación local de Iteración 1 pasa con 314 unitarias, 9 componentes y 36 E2E/axe, además de integración modular. Las comparaciones reales y limitaciones están en el [informe CP-01](cp01-execution-report.md). No se ha publicado el candidato; CI/PR no implican merge autorizado.

Iteración 2 implementa ensamblaje/hover, siete bucles B con flotación central y pausa/reduced-motion progresivos. Astro integra un único módulo inline de 872 bytes gzip; se mantienen cero scripts externos e islas React en portada. La batería local pasa 314 unitarias, 9 componentes y 52 E2E más integración; visibilidad nativa y BFCache también acreditados. El [informe](cp01-execution-report.md) conserva recursos, CLS, comparaciones y vídeos, sin publicación del candidato.

CP-01 queda Aceptado y archivado tras verificación, CI final satisfactorio 779b88b (run42519701947) y aceptación expresa del propietario el 2026-11-08 de ambas iteraciones, incluido el movimiento. PR #6 continúa en borrador, sin publicación.

## CP-02 — Apariencia aprobada (2026-11-09)

ADR-MMA-019 autoriza light/dark/system con Sistema inicial y una sola clave localStorage. La dirección aprobada corrige el prototipo: tarjeta/M del hero siempre con sus colores originales CP-01; un botón visual con el icono activo que despliega tres opciones por icono; nombres accesibles ES/EN, expansión nativa, aria-pressed en opciones, foco y marca de selección. Se reserva su espacio aun sin JS, ocultando controles no operativos; el botón compacto cabe junto a navegación también en 320 px, sin fila adicional. El icono elegido gira 240 ms solo con movimiento permitido; no se añaden transiciones globales de tema. [Contrato y aprobación](design-docs/appearance-proposal.md), [evidencia de implementación](cp02-execution-report.md). Las descripciones previas de cero preferencias almacenadas corresponden al alcance histórico CP-01: solo apariencia tiene una excepción, no movimiento.


Actualización aprobada por el propietario, 2026-11-09: sustituir los tres iconos siempre visibles por **un solo icono activo** en un botón de 48×48 px sin marco. Al pulsarlo, popover nativo compacto con las tres opciones por iconos; selección cierra y devuelve foco, Escape/clic exterior cierran. El botón comunica nombre del modo y expansión en ES/EN. Giro de 240 ms en el icono del botón tras elegir, salvo reduced-motion. Se elimina la fila móvil extra que requería el grupo grande. El resto del contrato de CP-02 permanece vigente. Cambio solicitado y autorizado expresamente dentro de CP-02/PR #7.
