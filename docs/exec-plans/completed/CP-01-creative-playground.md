# CP-01 — Creative Playground: identidad y animaciones

## Control

* **Estado:** `Aceptado`.
* **Responsable de aprobación, autorización y aceptación:** propietario de MiMiniApp.
* **Creado / última actualización:** 2026-11-08.
* **Autorización actual:** propietario aprueba el plan y ADR-MMA-018 el 2026-11-08 y autoriza **Iteración 1 — Identidad visual**, aceptada después; el propietario autoriza expresamente **Iteración 2 — Sistema de animaciones** el 2026-11-08. Se conserva la rama feature y el PR #6 en borrador con CI; sin merge ni despliegue.
* **Dependencias:** I-01 e I-02 Aceptados; hito staging de I-03 Verificado. I-03 sigue En curso por su alcance pendiente; CP-01 no lo cierra ni requiere activar producción, promoción o rollback. La nueva línea de producto se prepara por indicación expresa del propietario.
* **Bloqueos de inicio:** resueltos para Iteración 1 mediante aprobación/autorización expresa del propietario. Aceptación visual del hito 1 recibida el 2026-11-08; Iteración 2 autorizada expresamente el 2026-11-08; sin bloqueos de inicio.
* **Rama de preparación:** `design/creative-playground`, basada en staging `e2830fa0a5682da1660bbf5189daf62b9c90c98c`, que incluye el PR documental #5. No modifica directamente staging/main/master. CP-01 no ocupa la reserva I-04 ni renumera el roadmap.

## Objetivo y resultado esperado

Trasladar fielmente la selección de `creative-playground-v2` a los componentes reales de MiMiniApp: M modular integrada, wordmark compacto en interfaz, editorial como recurso de marca, ensamblaje expresivo, hover breve y hero B con ambiente perceptible y pausa accesible. Incorporar la petición posterior del propietario de mantener la ilustración grande de la derecha en bucle; la propuesta técnica añade flotación moderada de la tarjeta/M sin repetir su ensamblaje. Mantener la plataforma estática, modular, bilingüe, responsive y legible con/sin movimiento o JavaScript.

El resultado no es una simplificación aproximada ni una nueva galería de variantes. Geometría y ritmo se contrastan con los [SVG, capturas y vídeos de referencia](../../design-docs/creative-playground.md), separados de la evidencia de implementación.

## Alcance exacto

| Iteración | Incluido | Entrega y parada |
| --- | --- | --- |
| 1 — Identidad visual | Componentes SVG compartidos de M/wordmark, compacta y recurso editorial; cabecera y pie sin doble M; isotipo y favicon estáticos; M central del hero; coherencia del símbolo del estado vacío cuando actúe como marca. Mantener tokens, fuentes, copy, navegación, composición 0→1→N y rutas. | Build real estático, pruebas, comparaciones móvil/escritorio y 9:16. Presentar para aceptación de esta iteración antes de iniciar animaciones. |
| 2 — Sistema de animaciones | Ensamblaje expresivo de cuatro piezas, entradas de hero, hover, seis bucles B y flotación propuesta de tarjeta/M, botón Pausar/Reanudar ES/EN, reducción de movimiento, pausa por visibilidad y mejora progresiva. | Build real animado, batería completa, capturas y grabaciones comparadas con el prototipo. Dejar CP-01 Verificado solo con todos los AC satisfechos, pendiente de aceptación final del propietario. |

La aceptación del hito 1 se registra en Progreso, sin declarar prematuramente Verificado/Aceptado el plan completo. La iteración 2 necesita la aceptación de la 1 y su propia autorización explícita conforme a PLANS.md; no se da por autorizada por haber preparado o aprobado el conjunto.

## Exclusiones

Sin miniapps reales, modificaciones del registro/contrato/rutas de miniapps, backend, cuentas, persistencia de preferencias, nuevas dependencias, fuentes remotas, rediseño de portada/catálogo, modo oscuro de producto, temas configurables, hero A/C, ensamblaje fluido, variantes descartadas o controles de demostración. No trasladar al producto HTML/JS de laboratorio, capturas, vídeos, fixtures o marcas de pruebas.

No cambiar Cloudflare, secretos, permisos, CI/workflows, ramas protegidas, master predeterminada ni activar producción, promoción o rollback. No fusionar PR, desplegar o publicar por ejecución local del plan. La autorización actual permite commits/push de la rama feature y apertura de PR **en borrador** a staging; no permite merge ni publicación.

## Decisiones y fuentes

* **Aprobadas:** ADR-MMA-001/002/003/008/009/011/015/016 y ADR-MMA-017, incluida su evolución visual aprobada el 2026-11-08. Se conserva la aceptación histórica de I-02.
* **Aprobada el 2026-11-08:** [ADR-MMA-018](../../design-docs/creative-playground.md#adr-mma-018--integración-y-accesibilidad): SVG/CSS, coordinación nativa mínima, pausa en memoria documental, prioridades de reducción/visibilidad, estado completo sin JS y presupuesto de recursos.
* **Autoridad:** [PLANS.md](../../PLANS.md), [registro de ADR](../../design-docs/index.md), definición de producto y autorizaciones expresas del propietario. Los prototipos son referencia visual, no autorización de implementación o evidencia de pruebas del producto.

## Trabajo previsto

### Antes de ejecutar

Registrar la aprobación y autorización recibidas, comprobar estado de Git y referencias conservadas, y no mezclar trabajo ajeno. Durante la ejecución autorizada preparar rama feature propia desde el staging remoto vigente; conservar la exploración y esta preparación. Si la base ha avanzado, integrar conservadoramente y repetir los controles afectados, sin force push ni cambios de reglas.

Los cambios iniciales se centrarán en `BrandMark.astro`, `SiteHeader.astro`, `SiteFooter.astro`, `LaboratoryArt.astro`, `SiteLayout.astro`, estilos y recursos de marca locales; un componente Wordmark compartido es una separación mecánica admisible. Revisar `EmptyCatalogue.astro` para coherencia de identidad sin cambiar su maquetación ni disponibilidad. El favicon sustituirá el `data:,` actual; revisar también documentos HTML que no usen SiteLayout. La editorial se entrega como SVG de marca, sin un selector o segunda interfaz.

### Iteración 1 — Identidad

1. Incorporar únicamente geometrías seleccionadas; mantener los contornos tipográficos y espaciados del prototipo. Asegurar nombres accesibles una sola vez y enlaces al inicio del idioma actual.
2. Reemplazar la marca anterior en cabecera/pie, favicon y símbolo central. Conservar los recursos claros/oscuros como activos de marca sin implantar tema oscuro.
3. Reservar dimensiones y asegurar legibilidad pequeña; no ocultar navegación móvil ni escalar la M de forma independiente del nombre.
4. Actualizar pruebas afectadas por cambios de SVG/nombre/favicon; ejecutar regresiones pertinentes y build. Capturar portada real ES/EN, cabecera, pie, favicon y hero para comparar con referencias.
5. Presentar evidencia, diferencias mecánicas y resultado; esperar aceptación del hito y autorización de la iteración 2.

### Iteración 2 — Animaciones

1. Portar los parámetros expresivos y B especificados en la decisión, más la flotación de tarjeta/M aprobada: cuatro piezas viajan/rotan y encajan, hover finito, entrada exterior y ambiente interior con fases distintas. Preservar espacios de coordenadas y pivotes, sin reemplazos por fade o un balanceo del SVG completo.
2. Añadir coordinación mínima y clases de estado solo después de inicializar control/observadores. Base estática completa en SSR y con JS bloqueado. Botón nativo de pausa y traducciones comunes obligatorias ES/EN; sin cambios en diccionarios de miniapps.
3. Prioridad reduced-motion > pausa manual > pausa de visibilidad. No guardar preferencias, repetir entradas por scroll ni reanudar contra la intención del usuario. Evitar acumulación de listeners/timers.
4. Añadir pruebas de comportamiento y de calidad visual; adaptar la expectativa de ausencia de `script[src]` en las portadas de `tests/e2e/catalogue.spec.ts` y `tests/remote/platform.spec.ts` para permitir únicamente el coordinador local previsto, preservando ausencia de hidratación React, solicitudes externas, cookies y almacenamiento. La prueba de `/` sin scripts se mantiene: la redirección no necesita este runtime.
5. Ejecutar batería completa, comparar con la base y grabar la implementación real. Si falla un criterio material o la fidelidad visual, corregir y repetir lo afectado antes de declarar Verificado.

## Criterios de aceptación

### Iteración 1

| ID | Resultado verificable | Evidencia |
| --- | --- | --- |
| CP-AC01 | La M seleccionada sustituye la primera letra; le siguen solo los contornos `iMiniApp`. Cuatro piezas, línea base, altura, espaciados y proporciones de referencia, sin isotipo adicional delante del nombre. Compacta de interfaz y editorial de marca, claras/oscuras. | Comparación geométrica de SVG y lámina a tamaños grandes/pequeños; revisión visual. |
| CP-AC02 | Cabecera y pie muestran el wordmark compacto; cada enlace tiene nombre MiMiniApp una sola vez y lleva al inicio equivalente ES/EN. Isotipo utilizable solo; favicon estático reconocible a 16/32/48 px, sin la marca anterior. | Inspección DOM/árbol accesible, navegación y capturas de activos a tamaño real. |
| CP-AC03 | Centro del hero usa la misma M; la ilustración conserva paleta y composición general. Coherencia del estado vacío sin rediseñar el catálogo ni publicar módulos ficticios. | Capturas y comparación con prototipo; build público sin referencias de laboratorio. |
| CP-AC04 | ES/EN utilizables a 320/393/768/1280/1440 px, sin recortes, superposiciones o scroll horizontal; foco visible, navegación móvil y zoom real al 200 %, reflujo equivalente a 400 %. Fuentes/SEO, nombres y enlaces conservados. | E2E/axe y revisión asistida de teclado, zoom y responsive; sin declarar certificación WCAG completa. |
| CP-AC05 | Iteración estática conserva pruebas de I-01/I-02 pertinentes, rutas y traducciones, alta modular aislada A→A+B y exclusión de borradores/fixtures. No altera módulos, workflows o despliegue. | `npm run verify` y revisión del diff; resultados con browser fijado y sin omisiones encubiertas. |
| CP-AC06 | Comparación lado a lado de referencia y build real ES/EN, móvil/escritorio, cabecera/pie y encuadre 9:16; propietario acepta explícitamente el hito estático antes de comenzar la iteración 2. | Capturas accesibles, manifiesto y registro humano en Progreso. |

### Iteración 2

| ID | Resultado verificable | Evidencia |
| --- | --- | --- |
| CP-AC07 | La M se ensambla realmente con cuatro trayectorias/rotaciones independientes y encaje expresivo; no es solo opacidad. 1450 ms por pieza + retrasos 0/70/140/210 ms; termina completa y estable a 1660 ms. Entradas una vez por instancia/documento. | Fotogramas normalizados inicio/64 %/84 %/final; E2E de transformaciones y vídeo de cabecera e isotipo central. |
| CP-AC08 | Entrada del hero y seis bucles B conservan parámetros, fases, pivotes y composición de transformaciones de la referencia. Movimiento perceptible e independiente en lima/coral/órbita/anillos/satélite/onda; tarjeta/M mantiene además la flotación en bucle solicitada, según los parámetros aprobados en ADR-MMA-018 (6,4 s, hasta −6 unidades y 1,5°), cuya intensidad revisará el propietario en Iteración 2. La M sigue ensamblada. Titular y controles quietos. | Estado computado y vídeo de al menos 18 s para cubrir dos ciclos de la órbita; comparación simultánea con el prototipo B, identificando como ajuste posterior la flotación central solicitada. |
| CP-AC09 | Hover separa y reensambla piezas en aproximadamente 534 ms totales, sin bucle ni reinicios por atravesar formas o durante carga. No activa movimiento por foco o toque; enlace y legibilidad se conservan. | E2E de puntero/teclado/táctil y clip breve. |
| CP-AC10 | Botón nativo de pausa/reanudación traducido, accesible por teclado y con área de 48 × 48 px; congela y continúa el movimiento decorativo sin reiniciarlo ni desplazar foco. Su pausa se conserva al cambiar visibilidad; no hay controles de demo ni selectores de alternativas. | Pruebas de tiempos/transformaciones congelados y reanudados, nombre/estado accesible, axe, captura y grabación. |
| CP-AC11 | Reduced-motion inicial y cambios en caliente muestran marca/hero completos, quietos y sin hover decorativo. Sin JS o con inicialización fallida: contenido/navegación/identidad visibles, ambiente inactivo y sin control engañosamente operativo. Fuera de pantalla/pestaña oculta se pausa; volver no repite entradas ni anula pausa manual. | Contextos sin JS, módulo bloqueado/fallo de arranque, emulación dinámica, pruebas reales de visibilidad/scroll/BFCache cuando proceda y revisión asistida. |
| CP-AC12 | Cero CLS atribuible al movimiento en carga, hover, pausa/reanudación o cambio de preferencia. SVG/control con dimensiones reservadas. Coordinador ≤5 KiB gzip y CSS de movimiento ≤5 KiB gzip, sin nuevas dependencias, hidratación React, red externa, almacenamiento o bucle JS por frame. | PerformanceObserver de layout-shift incluyendo interacciones, geometrías y traza local comparada con la base; inventario/hash/tamaño de assets y solicitudes. Documentar límites de medición local. |
| CP-AC13 | Batería completa verde: tipos, lint/formato, hosting, unitarias, componentes, E2E/axe, integración modular y gates existentes pertinentes. ES/EN, metadatos, redirección local/404 y exclusión de borradores/fixtures intactos. No se reduce la seguridad para admitir nuevo JS. | `npm run verify`, logs de Chromium fijado y revisión del diff de pruebas. Mantener la comprobación de raíz sin scripts y tests de identidad/procedencia de artefactos. |
| CP-AC14 | Entrega de capturas y vídeos reales de ambas iteraciones frente a la referencia, movimiento normal/reducido, pausa y 9:16; sin sustituirlos por grabaciones del prototipo. Informe traza AC01–14, diferencias y limitaciones. Todo satisfecho → CP-01 Verificado, pendiente de aceptación del propietario. | Informe `docs/cp01-execution-report.md` a crear durante ejecución; evidencias descargables y manifiesto de archivos/hashes/comandos. |

## Pruebas a crear o modificar

* **Identidad:** DOM accesible/nombres únicos y enlaces; favicon/recurso M; geometría estática y puntos clave del wordmark. Inspección de la salida pública para excluir referencias, demos y alternativas.
* **Movimiento:** nueva suite E2E prevista `tests/e2e/creative-playground.spec.ts` (todavía no existe), con progresos muestreados por la API de animaciones/tiempo controlado, sin hacer depender toda la suite de esperas largas. Comprobar cuatro piezas separadas, encaje final y estabilidad, seis ambientes de referencia y el bucle central adicional, pausa real y reanudación en el mismo punto. No limitarse a contar clases CSS.
* **Accesibilidad/progresivo:** ampliar axe existente para control ES/EN activo, pausado y reducido; teclado, hover/táctil, cambio de media query, scroll, pestaña oculta, no JS y fallo de inicialización. Contrastar con la revisión manual los estados que la emulación no acredite. No declarar probada la visibilidad de pestaña solo por mutar un atributo.
* **Regresiones:** conservar suites de rutas/catalogue/i18n, I-01 técnica, contratos y pruebas de publicación. Actualizar también la expectativa equivalente de scripts de la suite remota, sin ejecutar pruebas contra el staging actual como si ya sirviera CP-01 ni debilitar su validación de destino/artefacto. Adaptar solo aserciones que contradigan el nuevo alcance aprobado, documentando por qué y manteniendo la garantía equivalente.
* **Rendimiento/visual:** ampliar o complementar los capturadores existentes, conservando evidencias de I-02. Medir CLS y recursos sobre build ordinario; capturas estables con movimiento reducido y fotogramas/clip normal separados. Baselines del prototipo y revisión humana; no generar una baseline desde el resultado y presentarla como prueba de fidelidad.

## Entorno, verificaciones y evidencia

Reutilizar versiones exactas del lockfile: Node 24.22.2/npm 11.19.1, Astro 7.4.5, React 19.3.1, Tailwind 4.3.4, TypeScript 6.0.3, Playwright 1.64.1 y Chromium 156.0.8078.4/revisión 1248. Verificar ejecutable; no usar Chromium de sistema accidentalmente ni actualizar dependencias. Fuentes locales/OFL existentes. Sin credenciales o conectividad Cloudflare para desarrollar/capturar.

**Comandos existentes previstos durante ejecución autorizada:** `npm run verify`; `npm run capture:review` tras adaptar su destino o crear capturador CP-01; `npm run release:pack` y `npm run release:verify` cuando corresponda contrastar artefactos. `verify` ya agrupa check/lint/formato/hosting/unitarias/componentes/E2E/integración; no repetir todas las suites sin un cambio o hallazgo que lo justifique. Los nuevos ficheros de prueba/captura son trabajo futuro, no comandos ya entregados. La suite remota se deja preparada para el artefacto futuro; ejecutarla contra el nuevo staging requerirá primero una publicación autorizada por el propietario. Su ausencia antes de ese paso se informa como pendiente remota, no como fallo local ni como prueba ya superada.

Destino previsto: `.local/verification/cp01/iteration-1/` e `iteration-2/`, ignorados. Informe durable con SHA/base, cambios de producto, comandos/resultados, versión y ruta del navegador, matriz AC, diferencias mecánicas y limitaciones. Entregar enlaces accesibles a PNG/MP4/ZIP desde Codex Cloud; no usar localhost como si fuera URL pública del propietario.

Matriz mínima por iteración: ES/EN en móvil 393 × 851 y escritorio 1440 × 1080; responsive en los otros anchos de AC04; detalles de marca/pie/favicon; zoom real al 200 %. En 9:16 usar viewport móvil real, captura 1080 × 1920 y scroll si el contenido no cabe. Una composición editorial puede mostrar juntos marca/hero con recorte identificado; no crear un modo de grabación de la aplicación ni ocultar controles para simular una web distinta. Iteración 2 añade clips del ensamblaje/hover, B ≥18 s, pausa y reduced-motion, con puntos de tiempo comparables a la referencia.

## Entrega mediante PR, sin publicación en esta fase

Flujo conservado: feature → PR a staging → CI obligatorio → revisión y merge manual del propietario. Antes de cualquier push/PR confirmar autorización para esa acción y advertir en el cuerpo del PR que el merge de staging puede disparar el publicador existente. No modificar workflows para publicar o para eludirlo. Este plan de producto no autoriza merge ni primer/ulterior despliegue; comprobar con el propietario el alcance de publicación antes de fusionar. Producción/promoción/rollback y master predeterminada permanecen fuera del alcance.

## Riesgos y recuperación

* Los SVG transformados pueden tener pivotes distintos al portar WAAPI a CSS: conservar geometrías y comparar fotogramas, no aceptar parecido aproximado. Si el portado exige cambiar materialmente el contrato propuesto, detener y consultar.
* Hover/entradas pueden recortar piezas o provocar overflow: envolver/separar capas y reservar espacio sin alterar navegación, tamaños o jerarquía. Mantener el estado base completo y sin layout animado.
* Pausa, reducción y visibilidad pueden competir: estado pequeño con prioridades explícitas y pruebas de transiciones; sin persistencia nueva. Un botón que visualmente cambia sin congelar todos los movimientos no cumple.
* La evidencia temporal puede perderse: referencias seleccionadas y manifiesto se conservan bajo docs; los originales ignorados no se eliminan. No depender de su presencia como única especificación.
* Recuperación local: desactivar mejora progresiva y volver al estado estático conocido dentro de la rama; si hay fallo material no declarar Verificado. No revertir o publicar remotamente sin autorización; rollback Cloudflare pertenece a I-03 y sigue pendiente.

## Cierre y límites vigentes

El propietario acepta expresamente el resultado de Iteración 2 el **2026-11-08** («acepto el resultado»), en respuesta a la entrega del PR #6, HEAD `779b88bdd50249afde2d9edb22fd258a9c6f951b`, [CI final satisfactorio 42519701947](https://github.com/aalexlpez/miminiapp/actions/runs/42519701947), capturas y vídeos. La aceptación incluye el resultado visual y el movimiento, incluida la intensidad de la flotación central. Iteración 1 ya estaba Aceptada: **CP-01 queda Aceptado y archivado**, con sus 14 criterios y limitaciones conservados en el informe.

Esta aceptación cierra el plan; no autoriza merge del PR #6, despliegue, promoción, cambios de infraestructura o una nueva iteración. No se repiten verificaciones satisfactorias por este registro documental. Los defectos posteriores se tratarán como trabajo nuevo conforme a PLANS.md, sin reabrir la aceptación.

## Progreso

* Ajuste solicitado el 2026-11-08: bucle de la ilustración grande de la derecha; se propone flotación moderada de tarjeta/M, manteniendo los seis bucles B y la M ensamblada. Amplitud/periodo aprobados con ADR-MMA-018; intensidad revisada y aceptada con Iteración 2 el 2026-11-08.
* Preparación local preservada en `.local/verification/cp01/preparation-backup/` (tar, patch y hashes); referencias/prototipos originales intactos. Rama feature creada desde staging remoto actualizado `e2830fa0a5682da1660bbf5189daf62b9c90c98c`.
* Iteración 1: implementada y verificada técnicamente: verify exit 0 (314 unitarias, 9 componentes, 36 E2E e integración modular), capturas ES/EN y zoom real al 200 %. [Informe](../../cp01-execution-report.md). CP-AC06 cumplido: aceptación visual expresa del propietario el 2026-11-08; **Iteración 1 Aceptada**. [PR #6](https://github.com/aalexlpez/miminiapp/pull/6) abierto en borrador hacia staging; CI quality satisfactorio de implementación `007534c` en [run 42512670663](https://github.com/aalexlpez/miminiapp/actions/runs/42512670663), acreditado por API. El último check del PR acredita también cualquier cierre documental posterior. Sin merge ni publicación.
* Iteración 2: implementada y verificada localmente (314 unitarias, 9 componentes, 52 E2E, integración, capturas/vídeos, visibilidad nativa/BFCache y presupuestos). PR #6 actualizado y CI quality satisfactorio de implementación `a6942c6` en [run 42519292572](https://github.com/aalexlpez/miminiapp/actions/runs/42519292572), acreditado por API. Tras su verificación, el propietario acepta expresamente el resultado el 2026-11-08; **Iteración 2 y CP-01 Aceptados**. El último check del PR acreditará el cierre documental posterior.
* Las pruebas de la galería v2 son evidencia de exploración; no acreditan CP-AC ni una implementación real.

## Historial de estado

| Fecha | Estado | Actor | Evidencia o motivo |
| --- | --- | --- | --- |
| 2026-11-08 | `Borrador` | Codex, a petición del propietario | Dirección visual aprobada; preparación documental autorizada. El propietario excluye expresamente la ejecución del plan. |
| 2026-11-08 | `Aprobado` | Propietario de MiMiniApp | Aprueba formalmente ADR-MMA-018 y CP-01, con dos iteraciones, 14 AC, exclusiones y verificaciones. |
| 2026-11-08 | `Autorizado` | Propietario de MiMiniApp | Autoriza exclusivamente Iteración 1, rama feature desde staging vigente y PR en borrador con CI; sin merge, despliegue o Iteración 2. |
| 2026-11-08 | `En curso` | Codex | Preserva preparación local, verifica staging remoto y comienza identidad estática en feature/cp01-identidad-visual. |
| 2026-11-08 | `En curso` | Propietario de MiMiniApp | Acepta expresamente el resultado visual de Iteración 1: «sí, lo acepto». Se satisface CP-AC06; no autoriza Iteración 2, merge ni despliegue. El plan completo conserva su estado. |
| 2026-11-08 | `En curso` | Propietario de MiMiniApp / Codex | Tras aceptar el hito 1, el propietario autoriza expresamente Iteración 2; Codex comienza SVG/CSS/coordinación nativa y verificación, sin merge ni despliegue. |
| 2026-11-08 | `Verificado` | Codex | AC01–14 contrastados: hito 1 aceptado, verify 314+9+52 e integración, capturas/vídeos, pausa/reducción, visibilidad nativa/BFCache, recursos/CLS y CI quality a6942c6 satisfactorios. Resultado/intensidad de Iteración 2 pendiente de aceptación del propietario. |
| 2026-11-08 | `Aceptado` | Propietario de MiMiniApp | «acepto el resultado», referido a la entrega final de Iteración 2 (HEAD779b88b, CI42519701947, capturas y vídeos), incluida la intensidad de flotación central. Cierra CP-01, conserva evidencias/limitaciones y no autoriza merge ni despliegue. |
