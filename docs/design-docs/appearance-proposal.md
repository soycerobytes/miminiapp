# Contrato de apariencia aprobado — CP-02

**Estado:** Aprobada ADR-MMA-019 por el propietario el 2026-11-09. CP-02 aprobado y ejecución autorizada expresamente. Esta sección prevalece sobre la investigación histórica que sigue.

## Correcciones vinculantes de la aprobación

- Tarjeta de la M del hero: conservar apariencia CP-01 en ambos temas, con fondo #F7F5F0, borde #242136 y M #7950F2. No oscurecer tarjeta ni aclarar su M. Geometría y animación originales intactas.
- Control (corrección posterior del propietario): un botón con el icono activo que abre un popover compacto con tres botones nativos por icono sol/luna/dispositivo; nombres ES/EN, title, aria-pressed y selección visible con marca además de color. Sin select ni formulario visible. Tab/Shift+Tab, Enter y Espacio. Se sustituye tanto A como B del prototipo por esta presentación autorizada.
- Microinteracción: giro suave de 240 ms en el icono recién activado, exclusivamente al cambiar la preferencia por interacción; sin animación en carga, sistema o sincronización. Anulado con prefers-reduced-motion. No cambia los controles ni el coordinador de movimiento CP-01.
- Contrato localStorage, fallbacks, esquema CSS/arranque inline, política de favicon según sistema y raíz sin scripts aprobados. Sin nuevas dependencias. Una sola clave, sin persistir movimiento.
- Rama feature y PR en borrador a staging autorizados; merge, publicación e infraestructura excluidos.

La paleta de tarjeta/ilustración de las siguientes capturas es **histórica y sustituida en ese detalle por esta aprobación**. Las evidencias de implementación se entregarán separadas en el informe CP-02.

---

# Apariencia — propuesta para revisión

**Estado:** Propuesta; no aprobada ni implementada. **Fecha:** 2026-11-09 (Europe/Madrid). **Responsable de aprobación:** propietario de MiMiniApp. Decisión propuesta ADR-MMA-019; [ExecPlan en Borrador](../exec-plans/active/CP-02-apariencia.md).

## Auditoría y base comprobada

La rama local `feature/i03-preparacion-segura`, HEAD `73b8bd2`, conserva fuentes/documentación anteriores a CP-01. No es la base adecuada para implementar esta evolución. Se consultaron AGENTS.md, PLANS.md, plantilla de ExecPlan, definición aprobada, registro ADR, arquitectura, documentación visual/frontend, planes y pruebas. Para distinguir historia de realidad actual se obtuvo una copia temporal mediante `git archive` de staging, sin checkout, merge ni cambios de fuentes locales.

Comprobación remota de solo lectura el 2026-11-09:

- `staging`: `f26d97bb0b6dc1e65cfbb429ec302a45753f8b6f`; `feature/cp01-identidad-visual`: `eec59ae0970cf856eb1c39baf329592642e76999`.
- [PR #6](https://github.com/aalexlpez/miminiapp/pull/6): cerrado, merged=true, merge SHA f26d97bb, fusionado el 2026-11-08 a las 21:58:59 de Madrid.
- [Plan CP-01 canónico en esa base](https://github.com/aalexlpez/miminiapp/blob/f26d97bb0b6dc1e65cfbb429ec302a45753f8b6f/docs/exec-plans/completed/CP-01-creative-playground.md): Aceptado, archivado; dos iteraciones aceptadas el 2026-11-08. ADR-MMA-017/018 Aprobadas. No esperar una aceptación pendiente de CP-01.
- [Manifiesto público](https://miminiapp-staging.miminiapp-lab.workers.dev/release-manifest.json): HTTP 200, sourceSha f26d97bb completo, sourceTree `cd63f9c614820997aeba82f41f5cf80cb9f2c5c4`, payloadSha256 `37739dbd539767456aa0b2e54e0b07e2dee573e7f2f526cd4b0eec2d202700d9`. `/es/` devuelve 200 y la M modular. Esto identifica lo servido; no equivale a repetir CI ni toda la suite remota.
- I-03 en staging continúa En curso, hito de staging Verificado; producción, promoción, rollback y ensayo de aislamiento de escritura pendientes. No se requiere cerrarlo globalmente ni modificar infraestructura para este trabajo de producto.

La implementación futura partirá del staging entonces vigente, previa nueva comprobación de SHA/estados. Este dossier no reemplaza la arquitectura histórica de la rama local ni copia sobre ella documentación posterior.

| Área actual en staging  | Hallazgo                                                                                                                             | Adaptación acotada propuesta                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tailwind 4 / global.css | Hay tokens canvas/surface/ink/muted/brand/link, pero `color-scheme: light`. No hay preferencia de apariencia.                        | Mantener Tailwind; valores semánticos por tema y esquema CSS del sistema.                                                                          |
| Superficies             | EmptyCatalogue usa borde `#cec6d8`, fondo blanco al 52%; símbolos `#ede6fe`/`#eee8fe`; sombra con RGB fijo.                          | Tokens para panel, tinte, borde decorativo y sombra. No asumir migración semántica terminada.                                                      |
| Botones                 | `.primary-action` usa surface como texto; al oscurecer surface desaparece la semántica correcta.                                     | Separar action-ink. En nocturno texto ciruela sobre violeta.                                                                                       |
| Lima/coral              | Badge y símbolos heredan tinta o usan ink.                                                                                           | Texto sobre acento siempre ciruela, independiente del texto principal.                                                                             |
| Cabecera/layout         | SiteHeader tiene wordmark, enlaces e idiomas; SiteLayout engloba home, miniapps y 404.                                               | Apariencia en la segunda fila móvil, junto a navegación; inicialización temprana en head compartido.                                               |
| Identidad               | BrandInitial usa currentColor; Wordmark conserva M modular integrada y resto de letras en currentColor.                              | Cambiar solo color. Conservar paths, viewBox, dimensiones y nodos.                                                                                 |
| LaboratoryArt           | Fijos: violeta `#7950F2`, lima `#B9F65A`, coral `#FF9368`, línea `#242136`, tarjeta `#F7F5F0`.                                       | Sustituir atributos por variables semánticas; no tocar grupos ni transformaciones.                                                                 |
| Favicon                 | SVG independiente con `.initial{fill:#7950F2}`; no hereda variables del documento.                                                   | Estilo interno con media prefers-color-scheme. Seguir dispositivo en la pestaña, documentando diferencia con elección explícita de página.         |
| Titular                 | Subrayado lima atraviesa parte de las letras.                                                                                        | En oscuro usar lima profundo `#445326` para conservar legibilidad del texto claro.                                                                 |
| Movimiento              | motion.ts mantiene pausa en memoria y observa reduced-motion, visibilidad y pageshow. CSS usa clases/datasets independientes.        | Apariencia solo cambia dataset de tema y colores; no reinicializar coordinador, no remount ni transición animada de tema.                          |
| i18n                    | CommonCopy valida textos ES/EN; motion tiene su propio grupo.                                                                        | Nuevo grupo appearance; no reutilizar ni persistir motion.                                                                                         |
| Pruebas                 | Vitest/RTL, E2E/axe, creative-playground/identity, capturas, zoom, integración modular y pruebas remotas de identidad del artefacto. | Extender la matriz sin cambiar gates ni identidad del release. Hay aserciones de almacenamiento vacío que deberán concretar la excepción aprobada. |

## Dos propuestas de control

|                    | A — botón de apariencia y panel                                                                                                                                                                      | B — tres opciones integradas                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Presentación       | Etiqueta visible «Apariencia · Sistema» + icono; abre Claro/Oscuro/Sistema.                                                                                                                          | Grupo compacto etiquetado «Apariencia», con tres radios estilizados.              |
| Claridad           | Muestra la preferencia elegida; panel explica las tres opciones. Un clic adicional.                                                                                                                  | Las tres opciones siempre visibles; selección inmediata.                          |
| Accesibilidad/peso | Proponer details/summary nativos y fieldset/legend/radios. Tab/Enter/Espacio; flechas en radios. Escape y clic exterior cierran; Escape devuelve foco. Sin focus trap ni roles de menú artificiales. | Mismos radios; sin lógica de apertura. Foco en cada selección por teclado nativo. |
| Móvil              | Segunda fila: enlaces a izquierda, Apariencia a derecha; ancho reservado y enlaces con wrap en 320 px.                                                                                               | Precisa tercera fila a 393 px para no comprimir marca/idioma/navegación.          |
| Coherencia         | Conserva protagonismo del wordmark y catálogo.                                                                                                                                                       | Más dominante y cabecera más alta; convive peor con ES/EN.                        |

**Recomendación: A**, con etiqueta además del icono, diana mínima de 48 px y ancho fijo entre estados. El panel se superpone sin desplazar contenido; seleccionado por radio marcado, no solo color. «Sistema» seguirá siendo el nombre de la preferencia aunque se resuelva a oscuro; una ayuda localizada puede comunicar «Ahora: oscuro». El prototipo usa el estado nativo de expansión de summary. No usar un switch de dos estados ni convertir radios en un menú que exija otro modelo de teclado.

[Control A escritorio](assets/appearance/control-a-desktop-dark.png) · [Control A móvil](assets/appearance/control-a-mobile-dark.png) · [Control B escritorio](assets/appearance/control-b-desktop-dark.png) · [Control B móvil](assets/appearance/control-b-mobile-dark.png).

## Previsualizaciones de la portada

Capturas reales de un **prototipo temporal**, no de código implementado. Build de staging f26d97bb con CSS/HTML/JS añadidos exclusivamente a una copia ignorada en `.local/appearance-prototype/site/`. No se alteraron las referencias de CP-01. La selección de URL solo facilita capturas; no es parte del contrato de producto. Se usa reduced-motion para comparar una misma composición estática; el control del hero indica ese estado.

| Vista                   | Claro                                         | Oscuro                                       |
| ----------------------- | --------------------------------------------- | -------------------------------------------- |
| ES escritorio 1440×1080 | [Ver](assets/appearance/desktop-es-light.png) | [Ver](assets/appearance/desktop-es-dark.png) |
| ES móvil 393×851        | [Ver](assets/appearance/mobile-es-light.png)  | [Ver](assets/appearance/mobile-es-dark.png)  |
| EN escritorio 1440×1080 | [Ver](assets/appearance/desktop-en-light.png) | [Ver](assets/appearance/desktop-en-dark.png) |
| EN móvil 393×851        | [Ver](assets/appearance/mobile-en-light.png)  | [Ver](assets/appearance/mobile-en-dark.png)  |

Las capturas son de página completa; el viewport indica el tamaño del navegador, no la altura final del PNG. Se conserva composición, tipografía y geometría SVG. Las comparaciones visuales y la paleta siguen pendientes de revisión del propietario.

[Galería comparativa de todas las vistas](assets/appearance/review.html).

## Paleta final recomendada para aprobación

Conservar el claro vigente y adaptar funciones, sin invertir colores. La propuesta nocturna usa el fondo/superficie/tinta/violeta sugeridos. Lima y coral se conservan. Los bordes estructurales son suaves; los de controles, distinguibles.

| Función semántica propuesta                   | Claro                       | Oscuro                      |
| --------------------------------------------- | --------------------------- | --------------------------- |
| canvas                                        | #F7F5F0                     | #171421                     |
| surface / panel                               | #FFFFFF / #FBFAF8           | #242033                     |
| ink / muted                                   | #242136 / #605B70           | #F7F3FF / #C0B7D0           |
| brand / action-bg                             | #7950F2                     | #A68AFF                     |
| action-hover / action-pressed                 | #6841D9 / #5B35BC           | #BBA5FF / #9474ED           |
| action-ink                                    | #FFFFFF                     | #171421                     |
| link / link-hover / link-pressed              | #653ACB / #6841D9 / #5B35BC | #BBA5FF / #F7F3FF / #A68AFF |
| lime / coral / accent-ink                     | #B9F65A / #FF9368 / #242136 | Iguales                     |
| tint / tint-ink                               | #EDE6FE / #653ACB           | #352B4B / #BBA5FF           |
| control-border                                | #8B829B                     | #9385AA                     |
| decorative-line / panel-border                | #E3DEEC / #CEC6D8           | #494057                     |
| focus-ring                                    | #653ACB                     | #B9F65A                     |
| selection-bg / selection-ink                  | #653ACB / #FFFFFF           | #A68AFF / #171421           |
| control-hover                                 | #EDE6FE                     | #352B4B                     |
| underline                                     | #B9F65A                     | #445326                     |
| illustration-line / tile / illustration-brand | #605B70 / #FFFFFF / #7950F2 | #C0B7D0 / #242033 / #A68AFF |
| success-ink / error-ink                       | #31520B / #9D332B           | #B9F65A / #FFAD91           |
| shadow-color                                  | rgb(36 33 54 / 5%)          | rgb(0 0 0 / 24%)            |

Mantener `--color-*` existentes y añadir solo los roles faltantes; separar primitivas de roles por referencia. `@theme inline` si un alias de Tailwind necesita resolver una variable de runtime; verificar CSS generado de cualquier utilidad usada. No crear un provider, framework ni un reset nuevo. Los componentes consumirán variables, no nuevos hexadecimales. Los datos de color de esta tabla viven en CSS, incluidas las ilustraciones. El SVG externo del favicon requiere sus propios valores internos, derivados de la misma paleta documentada.

Contraste calculado con luminancia relativa sRGB WCAG: `(Lmayor + .05) / (Lmenor + .05)`, sin redondear para decidir el aprobado. Texto normal ≥4,5:1; controles/gráficos necesarios ≥3:1. Se eligió texto normal como umbral incluso en botones y titular. La tinta clara sobre violeta nocturno daría solo **2,50:1**; action-ink oscuro lo corrige. Los logotipos están exentos del contraste de texto; aun así se revisa su percepción. Líneas decorativas, puntos con opacidad y separadores de tarjetas no comunican por sí solos información; no se presentan como controles AA. El contorno de foco queda fuera del elemento, con separación para contrastar contra canvas/surface. No usar muted con opacidad adicional.

| Modo  | Uso                        | Texto     | Fondo     |   Ratio | Mínimo |
| ----- | -------------------------- | --------- | --------- | ------: | -----: |
| light | Texto / fondo              | `#242136` | `#f7f5f0` | 14.32:1 |  4.5:1 |
| light | Texto / superficie         | `#242136` | `#ffffff` | 15.60:1 |  4.5:1 |
| light | Secundario / fondo         | `#605b70` | `#f7f5f0` |  5.97:1 |  4.5:1 |
| light | Secundario / superficie    | `#605b70` | `#ffffff` |  6.51:1 |  4.5:1 |
| light | Enlace / fondo             | `#653acb` | `#f7f5f0` |  6.38:1 |  4.5:1 |
| light | Enlace / superficie        | `#653acb` | `#ffffff` |  6.95:1 |  4.5:1 |
| light | Botón normal               | `#ffffff` | `#7950f2` |  4.95:1 |  4.5:1 |
| light | Botón hover                | `#ffffff` | `#6841d9` |  6.28:1 |  4.5:1 |
| light | Botón activo               | `#ffffff` | `#5b35bc` |  7.83:1 |  4.5:1 |
| light | Texto sobre lima           | `#242136` | `#b9f65a` | 12.18:1 |  4.5:1 |
| light | Texto sobre coral          | `#242136` | `#ff9368` |  7.15:1 |  4.5:1 |
| light | Borde control / superficie | `#8b829b` | `#ffffff` |  3.64:1 |    3:1 |
| light | Borde control / fondo      | `#8b829b` | `#f7f5f0` |  3.34:1 |    3:1 |
| light | Foco / superficie          | `#653acb` | `#ffffff` |  6.95:1 |    3:1 |
| light | Foco / fondo               | `#653acb` | `#f7f5f0` |  6.38:1 |    3:1 |
| light | Titular / subrayado        | `#242136` | `#b9f65a` | 12.18:1 |  4.5:1 |
| light | Marca / tinte              | `#7950f2` | `#ede6fe` |  4.09:1 |    3:1 |
| light | Éxito / superficie         | `#31520b` | `#ffffff` |  8.96:1 |  4.5:1 |
| light | Error / superficie         | `#9d332b` | `#ffffff` |  7.14:1 |  4.5:1 |
| dark  | Texto / fondo              | `#f7f3ff` | `#171421` | 16.59:1 |  4.5:1 |
| dark  | Texto / superficie         | `#f7f3ff` | `#242033` | 14.46:1 |  4.5:1 |
| dark  | Secundario / fondo         | `#c0b7d0` | `#171421` |  9.43:1 |  4.5:1 |
| dark  | Secundario / superficie    | `#c0b7d0` | `#242033` |  8.22:1 |  4.5:1 |
| dark  | Enlace / fondo             | `#bba5ff` | `#171421` |  8.58:1 |  4.5:1 |
| dark  | Enlace / superficie        | `#bba5ff` | `#242033` |  7.48:1 |  4.5:1 |
| dark  | Botón normal               | `#171421` | `#a68aff` |  6.65:1 |  4.5:1 |
| dark  | Botón hover                | `#171421` | `#bba5ff` |  8.58:1 |  4.5:1 |
| dark  | Botón activo               | `#171421` | `#9474ed` |  5.16:1 |  4.5:1 |
| dark  | Texto sobre lima           | `#242136` | `#b9f65a` | 12.18:1 |  4.5:1 |
| dark  | Texto sobre coral          | `#242136` | `#ff9368` |  7.15:1 |  4.5:1 |
| dark  | Borde control / superficie | `#9385aa` | `#242033` |  4.65:1 |    3:1 |
| dark  | Borde control / fondo      | `#9385aa` | `#171421` |  5.33:1 |    3:1 |
| dark  | Foco / superficie          | `#b9f65a` | `#242033` | 12.33:1 |    3:1 |
| dark  | Foco / fondo               | `#b9f65a` | `#171421` | 14.15:1 |    3:1 |
| dark  | Titular / subrayado        | `#f7f3ff` | `#445326` |  7.65:1 |  4.5:1 |
| dark  | Marca / tinte              | `#a68aff` | `#352b4b` |  4.82:1 |    3:1 |
| dark  | Éxito / superficie         | `#b9f65a` | `#242033` | 12.33:1 |  4.5:1 |
| dark  | Error / superficie         | `#ffad91` | `#242033` |  8.75:1 |  4.5:1 |

[Mediciones originales](assets/appearance/contrasts.json). Ver [informe de implementación](../cp02-execution-report.md) para colores computados finales y correcciones aprobadas.

## Preferencias y carga inicial propuestas (ADR-MMA-019)

1. Contrato: `light | dark | system`. Ausente, inválido o almacenamiento inaccesible → system. Una única clave `miminiapp.appearance`, compartida por ES/EN y rutas del mismo origen; sin cookies, servidor, telemetría, sessionStorage ni datos de movimiento. Persistir solo tras elección explícita; no escribir system al entrar por defecto. Conservar system explícito como tal, no el color resuelto. Staging y producción tienen orígenes distintos y no comparten localStorage.
2. Antes de CSS/pintura, un script inline mínimo en head valida la clave dentro de try/catch y asigna únicamente `data-appearance` (preferencia) y `data-theme` (resuelto) a html. No interpolar valores guardados en HTML o CSS. Leer matchMedia si está disponible; si falla, claro. Aplicar CSS determinista y `color-scheme` para controles nativos. Sin fetch ni hidratación React; evitar script diferido para esta primera lectura. Medir objetivo propuesto ≤1 KiB gzip para este arranque.
3. Fallback CSS: claro por defecto; `@media(prefers-color-scheme:dark)` se aplica cuando no existe elección/resolución de JS; reglas `[data-theme]` explícitas prevalecen con igual o mayor especificidad. Sin JS se sigue al dispositivo, contenido completo y selector no operativo oculto con espacio reservado. Si JS funciona pero localStorage falla, selección en memoria de la página y cambios del sistema operativos. En una navegación completa posterior sin almacenamiento se vuelve al dispositivo; no prometer persistencia en ese caso.
4. Coordinador independiente, pequeño y nativo: actualizar solo atributos/estado de radios/ayuda. Escuchar `matchMedia.change`, aplicándolo solo en system; pageshow reevalúa al restaurar BFCache. Proponer `storage` para sincronizar otras pestañas; borrado de clave → system. Tanto lectura como escritura pueden fallar; conservar elección en memoria y no lanzar excepciones. No eliminar otras claves. No registrar listeners repetidos.
5. No tocar `.motion-ready`, `data-motion-*`, nodos SVG, nombres de animation, keyframes ni transformaciones por cambiar apariencia. No dispatch de eventos de movimiento ni guardar pausa. Cambiar solo colores evita reiniciar ensamblaje/bucles. Sin transiciones de colores al cambiar tema, incluso con movimiento normal.
6. Favicon propuesto: media query interna siguiendo al dispositivo. Limitación deliberada: puede diferir del tema explícito de la página; aprobar esta política o pedir sincronización de icono antes de implementar. Evita sustituir la URL por cada cambio y depender de caches de favicon.
7. Traducir grupo appearance con label, light/dark/system y ayuda de resolución. Anunciar cambios de selección mediante radios; ayuda con aria-describedby, evitando anuncios duplicados innecesarios. Sin avisos técnicos sobre almacenamiento en el flujo de usuario.

La persistencia es una **excepción concreta** al invariante sin almacenamiento de CP-01 y sus pruebas. ADR-MMA-005 permite evaluar persistencia local, pero no sustituye la aprobación solicitada de esta clave global. Hasta aprobar ADR-MMA-019 y el plan, no se cambia el contrato de producción. No almacenar pausa manual, estado de animación, idioma ni actividad.

La raíz `/` tiene documento propio: proponer solo fallback CSS del sistema allí, mantener redirección y ausencia de scripts; aplicar preferencia guardada desde `/es/` en head. Comprobar en navegación fría que la redirección no produce pintura perceptible de otro color; si la produce, detener y presentar la alternativa de inicializar también la raíz, que alteraría su invariante de cero scripts. No cambiar HTTP ni `_redirects`. 404 comparte SiteLayout, interfaz común en ES y recuperación bilingüe; miniapps comparten el mismo contrato y tokens sin importar el coordinador por módulo.

## Evidencia del prototipo y límites

Build temporal de staging satisfactorio con Astro sin telemetría. Capturas en Playwright/Chromium 156 (revisión 1248), Node fijado 24.22.2 en la captura final. Sin instalar dependencias. Scripts y servidor únicamente locales e ignorados; no ejecutar el prototipo como código de publicación.

- Ocho estados adicionales de controles A/B abiertos, claro/oscuro y móvil/escritorio: axe sin infracciones.
- Ocho vistas ES/EN × móvil/escritorio × claro/oscuro: axe con etiquetas wcag2a/2aa/21aa/22aa sin infracciones y sin overflow.
- Comprobación exploratoria: system inicial oscuro, cambio dinámico a claro; elección explícita prevalece, recarga recupera selección; localStorage lanzando SecurityError permite elegir claro durante la página.
- Teclado: Enter abre summary, selección nativa, Escape cierra y devuelve foco. No se realizó revisión con lector de pantalla real; queda en el plan, junto a todo el recorrido por flechas/Tab y zoom 200 %.
- Reflujo exploratorio ES/EN 320/393/768/1024/1280/1440 px sin overflow en variante A.
- Con animaciones ya iniciadas y pausa manual: cambio oscuro→claro conservó los mismos objetos Animation y sus tiempos, el flag de pausa y la geometría del hero; observador sin entradas de layout-shift en esa interacción. Es una comprobación local del prototipo, no una garantía de CLS de campo ni cobertura de todo el ciclo CP-01.
- No se implementó el arranque final inline ni sincronización entre pestañas/BFCache/CSS sin JS; no se acreditó ausencia de destello en carga fría ni accesibilidad global. Persistencia de producción, miniapps/404 y regresiones de release se probarán durante ejecución autorizada.
- La auditoría descubrió aserciones históricas `script[src] == 0` junto a CP-01 que sí incorpora coordinador. Revisar el helper/transformaciones que las ejecutan y el contexto antes de modificarlas. La aserción de cero almacenamiento al cargar sin elección debe seguir pasando; tras elegir, permitir exactamente la clave aprobada, validar valor y ausencia de cualquier otro estado. Nunca borrar cobertura para obtener verde.

[Manifiesto de evidencias](assets/appearance/manifest.json). Los resultados automatizados de exploración se conservan junto a las capturas. No se ha ejecutado `npm run verify` sobre código de producto, porque no se ha cambiado; el build temporal y la exploración no sustituyen esa verificación futura.

## Decisiones para revisión humana

**ADR-MMA-019, Propuesta:** aprobar o ajustar el contrato compartido de tres preferencias, la excepción de almacenamiento de una sola clave y los fallbacks descritos; CSS/arranque inline nativo sin dependencias; independencia de movimiento; política del favicon y de la raíz. Responsable: propietario. Aprobar también dirección visual/paleta y control A o B como evolución explícita de ADR-MMA-017, conservando ADR-MMA-018. La publicación y cualquier modificación de CSP/hosting quedan fuera: si el entorno bloquea inline, registrar el bloqueo y presentar una solución antes de cambiar infraestructura.

No se solicita permiso para completar esta investigación: ya está autorizada. La revisión de este dossier y del ExecPlan es el punto de parada solicitado por el usuario; su aprobación no debe confundirse con autorización de ejecución. No hay cambios en src/public/package/workflows/deploy, commits, pushes, PR, merges o publicaciones en esta entrega.

Actualización aprobada por el propietario, 2026-11-09: sustituir los tres iconos siempre visibles por **un solo icono activo** en un botón de 48×48 px sin marco. Al pulsarlo, popover nativo compacto con las tres opciones por iconos; selección cierra y devuelve foco, Escape/clic exterior cierran. El botón comunica nombre del modo y expansión en ES/EN. Giro de 240 ms en el icono del botón tras elegir, salvo reduced-motion. Se elimina la fila móvil extra que requería el grupo grande. El resto del contrato de CP-02 permanece vigente. Cambio solicitado y autorizado expresamente dentro de CP-02/PR #7.
