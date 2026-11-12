# CP-02 — Apariencia clara, oscura y del sistema

## Ajuste autorizado de movimiento — 2026-11-10

Corrección posterior al merge del PR #13: fallo intermitente en Staging `42813224189`, al medir tiempos antes de completarse la pausa CSS. Investigación y corrección de sincronización de prueba dentro de AP-10, sin cambio del producto ni de infraestructura; evidencia en `docs/review/motion-default/quality-pause.md`. Rama `fix/appearance-pause-check` desde staging `7ff37f0d7772fd9d168d272fb650bdb7c261fab5`. Estado global permanece En curso.

Resultado de esta corrección: implementación comprobada con `npm run verify` completo (326 unitarias, 9 componentes, 78 E2E e integración modular); evidencia y limitaciones en `docs/review/motion-default/README.md`. No modifica el estado global En curso de CP-02 ni declara aceptación humana.

El propietario solicita y autoriza que el movimiento decorativo comience siempre activo y solo se pause/reanude mediante su icono, que se sustituye por ondas con raya diagonal al pausar. Esta instrucción modifica expresamente la prioridad anterior de reduced-motion de ADR-MMA-018 para la identidad decorativa; no modifica la reducción de las microinteracciones de apariencia. La pausa continúa en memoria del documento y se reinicia al recargar. Se conserva la suspensión por pestaña oculta y elementos fuera de pantalla como ahorro de recursos, sin cambiar la elección del usuario. Actualización localizada dentro de CP-02; no requiere otro plan. Rama `feature/movimiento-activo` desde staging `9ab71c255af0e91acaeda3af59783787decaedc9` (PR #12 fusionado). Entrega mediante PR en borrador, sin merge ni despliegue.

## Control

- **Estado:** `En curso`.
- **Responsable de aprobación, autorización, aceptación y cancelación:** propietario de MiMiniApp.
- **Creado / última actualización:** 2026-11-09 / 2026-11-10 (Europe/Madrid).
- **Autorización actual:** propietario aprueba ADR-MMA-019 y CP-02 y autoriza expresamente implementación, commits, rama feature independiente y PR en borrador hacia staging, con ajustes vinculantes A/B/C: tarjeta/M original invariable, control por iconos y rotación suave respetando reduced-motion. No merge ni publicación.
- **Dependencias / bloqueos de inicio:** CP-01 Aceptado en staging f26d97bb, I-01/I-02 Aceptados; I-03 En curso con hito staging Verificado. No depende de aceptar globalmente I-03 ni de activar producción/promoción/rollback. Revalidar fuentes/HEAD remoto antes de ejecutar; la rama local actual 73b8bd2 es anterior a CP-01.
- **Base de ejecución:** `feature/cp02-apariencia` desde staging `f26d97bb0b6dc1e65cfbb429ec302a45753f8b6f`, revalidado por fetch. Dossier y decisión aprobados con correcciones antes de implementar. Sin bloqueos de aprobación.

## Objetivo y resultado esperado

Ofrecer tres preferencias de apariencia con Sistema inicial, cambio dinámico según dispositivo y prioridad de la selección explícita. Conservar Creative Playground y su movimiento; mejorar lectura nocturna en todas las rutas. Resultado revisable: PR hacia staging con implementación acotada, evidencia ES/EN claro/oscuro, pruebas y limitaciones. Su apertura se realizará únicamente cuando la autorización futura incluya la rama y PR; este borrador no los crea.

## Alcance

Tokens semánticos y fallbacks CSS; botón de icono activo que abre un popover compacto con tres opciones (sol, luna, dispositivo), con nombres ES/EN, selección explícita y rotación suave de 240 ms en el botón principal; arranque mínimo previo a pintura; coordinador nativo de apariencia; clave localStorage aislada y manejo de fallos; diccionarios comunes ES/EN; gráficos/controles/tarjetas, favicon y rutas compartidas; verificación de identidad/movimiento, accesibilidad y arquitectura modular. Actualizar documentos afectados para reflejar el resultado real durante ejecución. Mantener una iteración breve de producto con revisión final; si aparecen decisiones de hosting o un alcance mayor, detener ese trabajo y proponer división.

## Exclusiones relevantes

Sin framework de temas, nuevas dependencias, React hidratado para el selector, reorganización general del frontend, miniapp pública nueva, backend, cookies, analítica ni persistencia de movimiento/idioma. Sin Cloudflare, workflows, credenciales, permisos, protecciones, sistemas de publicación, cambio de rama predeterminada, merge o despliegue. Los prototipos no entran en el build público ni se versiona su código.

## Decisiones aprobadas aplicables

ADR-MMA-001/003/005/008/011/015/016: Astro estático, Tailwind, evaluación de persistencia local, pruebas, contrato modular, toolchain e idiomas. ADR-MMA-017/018 vigentes en staging: identidad modular Creative Playground y movimiento con prioridades reduced-motion/usuario/visibilidad, pausa en memoria y presupuestos ≤5 KiB gzip por JS y CSS de movimiento. No modificarlos indirectamente. ADR-MMA-009/014 conservan el flujo de revisión hacia staging sin autorizar publicaciones en este plan. Las fuentes canónicas posteriores a la rama local están identificadas por SHA en el dossier.

## Correcciones aprobadas antes de implementar

1. Se conserva la tarjeta completa de CP-01: fondo #F7F5F0, borde #242136 y M #7950F2, iguales en ambos temas. Tokens de ilustración invariantes; los demás elementos sí se adaptan. No tocar geometría ni transformaciones.
2. Se sustituye la presentación A/B del dossier por tres botones visuales de sol/luna/dispositivo. Las opciones viven en un popover cerrado por defecto; solo el icono activo permanece visible. Nombres accesibles localizados, title, expansión nativa y aria-pressed en las opciones; selección cierra y devuelve foco. No select, no switch binario. Tab/Shift+Tab y Enter/Espacio nativos para los tres botones.
3. Rotación suave de 240 ms al activar otro modo; solo iconos, sin transiciones globales de color ni movimientos extra del hero. Reduced-motion elimina la microinteracción. Sistema/almacenamiento/carga no provocan rotaciones.
4. Favicon según sistema y raíz CSS sin scripts se mantienen según contrato aprobado. Validar carga fría y CSP, sin cambiar hosting.

## Trabajo previsto

1. **Preparación autorizada de ejecución futura:** revisar estados remotos/registro y trabajo local, crear rama feature independiente desde staging vigente sin arrastrar la rama histórica. Registrar SHAs. Comprobar estado base y suites relacionadas, preservando cualquier trabajo ajeno. Reconfirmar que CP-01 sigue Aceptado y no añadir bloqueos ficticios de I-03.
2. **Tokens y gráficos:** inventariar usos fijos de color, definir roles del dossier en CSS, migrar los casos de catálogo/hero/controles y estilos locales de 404; conservar dimensiones, contenido y SVG. Favicon con esquema interno según política aprobada. Verificar CSS de Tailwind generado y contrastes computados.
3. **Preferencia y control:** arranque inline validado antes de CSS/pintura, sin escribir al entrar. Inicialización progresiva del control en SiteHeader; botones nativos por icono, grupo etiquetado y foco accesible. Runtime separado de motion.ts; reactividad a sistema/storage/pageshow y fallos de lectura/escritura. SiteLayout común para ES/EN, miniapps y 404. Raíz mantiene redirección y script-free salvo decisión posterior explícita.
4. **Pruebas y revisión:** implementar matriz siguiente; comparar las cuatro vistas principales y ambas traducciones. Revisar animación normal/reducida y pausa, sin modificar snapshots o expectativas para ocultar diferencias. Ejecutar verify con toolchain fijada y ensayos dirigidos; registrar resultados y fallos reales. No repetir baterías ya satisfechas sin nuevo cambio/hallazgo.
5. **Entrega:** actualizar arquitectura/contratos/documentos solo por cambios efectivamente implementados y decisiones aprobadas; preparar PR a staging si ya está autorizado, sin fusionarlo. Mantener el plan En curso ante fallo material; solo Verificado con criterios satisfechos y evidencia. Entregar al propietario para aceptación final. No activar publicación.

## Entorno y herramientas

Node 24.22.2 / npm 11.19.1 según versión canónica de la base, Astro/Tailwind/dependencias exactas y lockfile existente. Chromium Playwright revisión 1248, caché `PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright`; usar la misma en instalación/ejecución. `ASTRO_TELEMETRY_DISABLED=1`. Servidores loopback, Vitest/RTL, Playwright/axe existentes, cálculos de contraste sRGB y PerformanceObserver. No añadir herramientas de producto ni instalar dependencias por preparar documentos. Revisión de lector de pantalla con combinación disponible identificada por versión; si no está disponible, declararlo pendiente y organizar la comprobación humana, sin atribuirla a axe.

La investigación actual usó copia temporal de staging y prototipo ignorado; el árbol de producción original no cambia. Las evidencias seleccionadas se conservan en `docs/design-docs/assets/appearance/`. No son el resultado de ejecutar este plan.

## Criterios de aceptación

| ID    | Resultado observable                                                                                                                   | Evidencia requerida                                                                                                                                                                                                                                                    |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AP-01 | Solo light/dark/system; ausente o inválido inicia system.                                                                              | Tests de validación, casos claros/oscuros sin clave y clave inválida; carga inicial sin escritura.                                                                                                                                                                     |
| AP-02 | Sistema cambia en vivo solo en system; modo explícito prevalece.                                                                       | E2E con emulateMedia en ambos sentidos, selección y vuelta a system; media API no disponible con fallback.                                                                                                                                                             |
| AP-03 | Elección explícita sobrevive recarga, cambio ES/EN y rutas del mismo origen.                                                           | E2E en contextos nuevos con clave sembrada y por interacción; persistir system explícito sin convertirlo a light/dark.                                                                                                                                                 |
| AP-04 | Lectura/escritura bloqueadas no rompen UI; elección funciona durante página. Solo una clave permitida.                                 | Simular getter SecurityError y setItem QuotaExceededError por separado; comprobar memoria actual, ningún otro estado/cookie/sessionStorage.                                                                                                                            |
| AP-05 | Selector visible escritorio/móvil, seleccionado inequívoco y usable con teclado/lector.                                                | Tab/Shift+Tab, Enter/Espacio, nombres localizados, foco y aria-pressed; accessibility tree + lector de pantalla; dianas ≥48 px conforme pruebas vigentes.                                                                                                              |
| AP-06 | Textos y nombres accesibles completos en ES/EN.                                                                                        | Contrato CommonCopy/validation y E2E por locale; anuncio de modo sin confundir system con color resuelto.                                                                                                                                                              |
| AP-07 | Texto ≥4,5:1 y controles/foco ≥3:1 en ambos temas, estados normal/hover/active/checked; sin depender solo de color.                    | Informe sRGB de colores computados, axe y revisión manual; disabled legible, forced-colors y zoom 200 % sin foco oculto.                                                                                                                                               |
| AP-08 | Dirección visual conserva M integrada, lima/coral, tipografías, composición y catálogo. Sin colores fijos nuevos en componentes.       | Capturas ES/EN, 1440×1080 y 393×851, más 320/768/1024/1280 y 9:16; revisión comparada con CP-01 y paleta aprobada.                                                                                                                                                     |
| AP-09 | Marca/hero/favicon adaptados según política; miniapps sintéticas con catálogo cero/una/varias entradas, 404 bilingüe y raíz correctas. | Matriz de rutas y fixtures aisladas en claro/oscuro; sin publicar miniapps ficticias ni alterar HTTP.                                                                                                                                                                  |
| AP-10 | Cambio de apariencia no reinicia ensamblaje, bucles ni pausa, no cambia geometría. Reduced-motion permanece prioritario.               | Referencias de nodos y objetos Animation/tiempos antes/después en ensamblaje y bucles; pause/play, scroll/visibilidad/BFCache, reduced-motion inicial y dinámico, hover y combinación de ambos ejes independientes.                                                    |
| AP-11 | Sin destello perceptible de tema incorrecto ni CLS atribuible a carga/cambio de apariencia.                                            | Contextos fríos con clave light/dark/system, caché fría y CPU/red limitadas; filmstrip desde primera pintura, estilos en primer frame; PerformanceObserver incluyendo interacción, geometría y fuentes listas. Raíz redirigiendo incluida. No usar solo captura final. |
| AP-12 | Static-first, sin nuevas dependencias/hidratación, sin modificación de movimiento o descarga por frame.                                | Inventario/hash/gzip de JS/CSS antes/después; arranque objetivo ≤1 KiB gzip, movimiento conserva presupuestos 5/5 KiB gzip; ausencia de nuevas solicitudes externas.                                                                                                   |
| AP-13 | Sin JS sigue sistema y contenido completo; control no operativo no confunde. Storage/pageshow restauran coherencia.                    | JS desactivado, fallo de inicialización, cambio de sistema CSS, storage entre dos pestañas/borrado y BFCache. Espacio reservado para el selector.                                                                                                                      |
| AP-14 | No se degrada el contrato modular ni los checks de publicación.                                                                        | verify completo, integración A+D→A+B+D y exclusión de fixtures; tests de manifiesto/hosting/gates sin modificar workflows o deploy. Almacenamiento vacío inicial sigue cubierto; después de seleccionar, solo excepción exacta.                                        |

## Pruebas a crear o modificar

- Unitarias: validación de preferencia y resolución para pares preferencia/sistema, lectura/escritura fallidas. Probar el contrato, no duplicar implementación. CommonCopy ES/EN actualizado y validación de textos obligatorios conservada.
- E2E nuevas de apariencia: AP-01–06/11/13; fixture de almacenamiento fallido, storage entre pestañas, navegación, teclado y arranque frío. A11y matrix ambos temas; no necesita React ni tests de componente para un control Astro nativo.
- Creative-playground/identity existentes: AP-10, cambio de tema durante ensamblaje y con pausa, loop en marcha y reduced-motion. Verificar sin reemplazar nodos ni reasignar animation. No permitir tema que borre datasets de movimiento.
- Catalogue/a11y/remote: ampliar por tema y concretar solo invariantes que contradiga la excepción aprobada. Mantener cookies/sessionStorage vacíos, no escrituras iniciales, exclusión de almacenamiento de movimiento y validación exacta del único runtime previsto por la base. Revisar por qué algunas aserciones de cero scripts coexisten con el coordinador antes de cambiarlas.
- Harness de integración modular: fixtures consumen los mismos tokens/layout, alta de miniapp sin editar shell, hashes de módulos ajenos, build sin prototipo/fixtures. Raíz, 404 y rutas por miniapp no se excluyen por estar vacío el registro público.

## Verificaciones y evidencia

**Actuales, solo investigación:** build de copia temporal; 8 capturas y análisis axe; contrastes calculados; exploración de sistema/persistencia/storage bloqueado/teclado/reflujo y pausa/geometría. Detalles y límites en dossier/manifiesto. No equivalen a AP satisfechos para código de producción.

**Durante futura ejecución autorizada:** `npm run verify` existente (check, lint, formato, hosting, unitarias, componentes, build/E2E e integración); capturador dirigido a crear para apariencia y filmstrip (no se presenta como comando existente). Inspeccionar bytes del build y presupuestos gzip. Guardar logs/resultados/capturas por SHA y manifiesto en `.local/verification/appearance/` y seleccionar evidencia durable en docs. Si un check falla, registrar, corregir alcance autorizado y repetir solo lo afectado. Revisión humana de contraste contextual, lector de pantalla y vídeo del hero, con limitaciones identificadas.

**CI:** comprobar quality y SHA de la rama/PR si se autoriza su creación. **Staging:** `npm run test:remote` existe, pero exige identidad exacta y publicación previamente autorizada; no ejecutarlo contra el staging antiguo como si ya sirviera apariencia. Este plan no publica para conseguir esa evidencia. **Producción:** fuera de alcance. No marcar verificación remota futura como superada por pruebas locales.

## Riesgos y recuperación

- Invariante global de persistencia: bloquear inicio hasta aprobar ADR-MMA-019. No almacenar ningún otro estado; datos inválidos solo se ignoran, sin borrados generales.
- Destello por CSS/script/CSP o raíz propia: pruebas de primera pintura; si la corrección exige hosting/workflows, detener trabajo afectado y presentar decisión.
- Resets de animación o CLS: no alterar nodos/selectores de movimiento; revertir el cambio responsable y repetir AP-10/11.
- Colores heredados o SVG externos: inventario estático + estilos computados/axe/capturas; no dar por válida una inversión global.
- Recuperación antes de merge: corregir/revertir commits de la futura rama feature conservando pruebas; no force push ni cambios a ramas protegidas. Si después se autoriza publicación y aparece regresión, presentar reversión por PR con el propietario; no ejecutar rollback/publicación bajo esta autorización.

## Punto de parada

Entregar implementación y evidencia para aceptación humana, con PR en borrador hacia staging. No merge, despliegue ni siguiente iteración. La aprobación y autorización expresas del propietario ya cubren esta ejecución; solo la aceptación del resultado queda reservada al propietario.

## Progreso

Implementación terminada en feature/cp02-apariencia; `npm run verify` final exit 0 (326 unitarias, 9 componentes, 78 E2E e integración modular ambos temas). Capturas reales de los ocho casos, vídeo y contrastes medidos en el [informe](../../cp02-execution-report.md). Los ajustes aprobados de tarjeta, iconos y rotación están implementados; no se han tocado infraestructura, workflows, lockfile ni publicación. No se declara Verificado porque queda revisión real con lector de pantalla y decisión sobre AP-11: la raíz del preview pinta brevemente su documento de redirección en tema del dispositivo antes del tema guardado. Staging responde 301 sin renderizarlo. Conforme al plan, no añadir scripts a la raíz ni cambiar hosting sin revisar esa decisión. BFCache nativo sí comprobado: persisted=true, nodo original, nueva preferencia recuperada y pausa conservada. PR en borrador para revisión, sin merge. La aceptación final sigue reservada al propietario.

## Historial de estado

| Fecha      | Estado       | Actor       | Evidencia o motivo                                                                                                                                                     |
| ---------- | ------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-09 | `Borrador`   | Agente      | Solicitud expresa de investigación/prototipos/documentación, sin implementación. Base staging y CP-01 comprobados; dossier visual y matriz de verificación preparados. |
| 2026-11-09 | `Aprobado`   | Propietario | Aprueba formalmente ADR-MMA-019 y CP-02 con correcciones A/B/C de tarjeta, iconos y rotación.                                                                          |
| 2026-11-09 | `Autorizado` | Propietario | Autoriza expresamente ejecución en rama feature desde staging y PR en borrador; sin merge ni publicación.                                                              |
| 2026-11-09 | `En curso`   | Agente      | Rama creada desde f26d97bb; contrato y plan actualizados antes de implementar.                                                                                         |

| 2026-11-09 | `En curso` | Agente | Implementación ec6ace3, verify local satisfactorio y [PR #7 en borrador](https://github.com/aalexlpez/miminiapp/pull/7). Pendientes lector de pantalla y decisión AP-11 del preview local. |

Actualización aprobada por el propietario, 2026-11-09: sustituir los tres iconos siempre visibles por **un solo icono activo** en un botón de 48×48 px sin marco. Al pulsarlo, popover nativo compacto con las tres opciones por iconos; selección cierra y devuelve foco, Escape/clic exterior cierran. El botón comunica nombre del modo y expansión en ES/EN. Giro de 240 ms en el icono del botón tras elegir, salvo reduced-motion. Se elimina la fila móvil extra que requería el grupo grande. El resto del contrato de CP-02 permanece vigente. Cambio solicitado y autorizado expresamente dentro de CP-02/PR #7.

Entrega del ajuste: PR #7 fusionado previamente por el propietario; rama **feature/cp02-selector-compacto** desde staging `0f1fd385b6ccbbf7d9ec3410cbf972ccc88e47f1`. Corrección `078106f`, pruebas completas satisfactorias; nuevo PR en borrador, sin merge ni publicación del agente.

Ajuste solicitado y autorizado por el propietario el 2026-11-09: desplegable **vertical de 56 px de ancho**, centrado bajo el icono activo y separado 6 px. Opciones en una columna, manteniendo dianas de 48×48 px, teclado y semántica nativa. Rama `feature/cp02-selector-vertical` desde staging `87887d71803b2513fe2bd33fc0f74c24889e023e` (PR #8 ya fusionado por el propietario). Solo cambia la presentación del popover; preferencias, tarjeta del hero y movimiento mantienen sus contratos.

Revisión visual solicitada y autorizada por el propietario (2026-11-09): eliminar el efecto de panel blanco y tarjetas grandes. Popover vertical de 44 px, fondo canvas suavemente translúcido y sin borde marcado, iconos de 16 px, halo de selección/hover de 28 px y pequeña marca lateral. Se conservan dianas transparentes de 48×48 px, centrado y teclado. Separar tamaño visual y superficie pulsable evita degradar accesibilidad para lograr discreción. No se altera lógica de preferencias, persistencia, hero ni infraestructura. Rama nueva desde staging vigente, después del PR #9 fusionado por el propietario.

Último ajuste solicitado por el propietario (2026-11-09): añadir al panel un borde real de 1 px con `--color-decorative-line`, sutil en claro/oscuro. Se mantienen ancho, iconos pequeños y selección discreta. Sustituye la anterior ausencia de borde; las capturas y mediciones previas sin borde son históricas. Rama `feature/cp02-borde-sutil` desde staging vigente, tras PR #10 ya fusionado por el propietario.

Ajuste autorizado por el propietario (2026-11-09): mover la pausa del hero a un solo icono de animaciones en la cabecera, junto a apariencia. Pulsación directa, sin desplegable; el mismo icono muestra una raya diagonal al pausar o con reduced-motion. Se conservan ciclo de vida, prioridad de reducción de movimiento, pausa en memoria, nombres/estado ES/EN y dianas de 48 px. ES / EN se compacta con texto de 13 px, separación y padding reducidos, preservando foco, enlaces equivalentes y áreas pulsables. Rama `feature/cp02-controles-cabecera` desde staging vigente, después del PR #11 fusionado por el propietario.
