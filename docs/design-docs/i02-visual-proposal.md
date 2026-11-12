# I-02 · Dirección visual aprobada y referencias de diseño

**Responsable de aprobación:** propietario de MiMiniApp. **Fecha:** 2026-11-05.

**Aprobación de ADR-MMA-017:** el propietario de MiMiniApp aprueba expresamente el 2026-11-05 la dirección **Laboratorio creativo moderno**, la segunda composición de las maquetas actuales —distintivo «Laboratorio creativo», titular «Ideas que se vuelven herramientas» y navegación móvil visible—, la paleta base y las familias **Space Grotesk / DM Sans**, sujetas a accesibilidad y licencias. La realización utilizará Tailwind, sin nuevas dependencias visuales. El estado canónico de la decisión se registra en el [índice de decisiones](index.md).

Las maquetas y los tokens medidos se conservan como referencia de la solución elegida; la aprobación no significa que cada píxel sea definitivo ni que la aplicación ya implemente o haya verificado este diseño. El ExecPlan I-02 fue **Aprobado** formalmente y después **Autorizado** expresamente por el propietario el 2026-11-05, con sus 14 criterios; la implementación está verificada y **Aceptada** por el propietario el 2026-11-05. El plan conserva la autorización y su estado canónico.

Las láminas son maquetas aisladas para revisar el diseño: no son capturas de la aplicación implementada, no modifican el frontend y no acreditan pruebas de la aplicación. I-01 permanece cerrada. La propuesta no añade miniapps reales, dependencias de producto ni infraestructura.

En esta instancia se entrega también `/workspace/shared/downloads/I02-propuesta-visual.zip`: extraer y abrir `index.html` para ver la galería, las portadas ES/EN redimensionables, los especímenes y los dos encuadres 9:16 sin servidor ni conexión. Las fuentes están embebidas solo en las maquetas y sus licencias SIL OFL acompañan el paquete. Los archivos de generación, mediciones y manifiesto de hashes permanecen en `.local/design/i02/`, ignorados; las láminas de este documento son artefactos de diseño solicitados, sin commit.

## Evolución posterior aprobada, sin reabrir I-02

Este documento conserva la referencia histórica aceptada de I-02, incluida su exclusión original de animación continua. El 2026-11-08 el propietario aprueba la dirección Creative Playground de la segunda exploración: M integrada, compacta/editorial, ensamblaje expresivo, hover y hero B. Para trabajo futuro, esa selección sustituye únicamente la restricción de movimiento continuo mediante ambiente B con pausa y reduced-motion; no altera retroactivamente I-02. Véanse [ADR-MMA-017/018](creative-playground.md) y [CP-01 en Borrador](../exec-plans/completed/CP-01-creative-playground.md). La preparación está autorizada; su ejecución todavía no.

## Láminas revisables

| Lámina | Qué permite revisar |
| --- | --- |
| [Concepto de laboratorio](assets/i02/concepto-laboratorio.png) | Exploración artística generada: personalidad, formas y combinación cromática. Es una referencia de dirección, no una especificación exacta de interfaz. |
| [Portada de escritorio](assets/i02/escritorio.png) | Jerarquía, navegación, composición de portada y catálogo real vacío. |
| [Portada móvil](assets/i02/movil.png) | Composición apilada, legibilidad, acciones y navegación en pantalla estrecha. |
| [Catálogo con especímenes](assets/i02/catalogo-especimenes.png) | Rejilla y anatomía de tarjetas; las muestras están rotuladas y no son herramientas disponibles. |
| [Encuadre vertical 9:16](assets/i02/video-9x16.png) | Presentación dentro de una grabación de 1080 × 1920 y reservas editoriales para posibles superposiciones. |
| [Catálogo en escena vertical](assets/i02/video-catalogo-9x16.png) | Segundo momento de grabación, tras hacer scroll al catálogo vacío. |
| [Portada de escritorio en inglés](assets/i02/escritorio-en.png) | Equilibrio de la composición con traducción y longitudes distintas. |

El catálogo real permanecerá vacío hasta incorporar miniapps aprobadas. El copy de revisión dice «Aún no hay miniapps publicadas» y «Un espacio para lo que viene»; no afirma que una primera herramienta ya esté seleccionada o en desarrollo. Los especímenes de esta revisión no se añadirán al registro, las rutas ni el catálogo de producción. Tampoco habrá un botón de ejecución que sugiera que son herramientas existentes. Las futuras capturas de la implementación se registrarán como evidencias separadas cuando su ejecución esté autorizada.

## Dirección y composición elegidas

El laboratorio se expresa con un lienzo cálido, tinta ciruela oscura, retícula limpia, títulos con personalidad y pequeños gestos geométricos. El violeta identifica las acciones; lima y coral aportan ritmo en etiquetas, formas y detalles. Evitar iconografía médica. Las decoraciones no contienen información y, en la implementación futura, serán fondos CSS o elementos con `aria-hidden="true"`, sin semántica interactiva.

La portada debe reconocerse en un fotograma: marca, frase breve, acción para ver el catálogo, una forma distintiva y comienzo del catálogo. La composición puede ser asimétrica en su decoración; la lectura y los controles conservan una estructura predecible. La política de I-02 excluía animación continua, parallax y movimientos que distrajesen del contenido. Su evolución posterior, delimitada a hero B, se registra en el apartado anterior; parallax y movimiento del contenido siguen excluidos.

Se prefieren recursos locales: SVG propios para formas e iconos y fuentes autoalojadas. La composición de interfaz y sus formas se desarrollarán como recursos originales del proyecto. La imagen conceptual generada conserva su función de referencia artística; no se presupone su incorporación como recurso de producción.

La paleta base elegida es fondo `#F7F5F0`, texto `#242136`, violeta `#7950F2`, lima `#B9F65A` y coral `#FF9368`. Los tonos funcionales derivados de la tabla siguiente son referencias para garantizar contraste en usos concretos, ajustables durante la implementación autorizada sin cambiar la dirección elegida.

## Paleta funcional y contraste medido

Se ha calculado luminancia relativa sRGB con la fórmula de WCAG y contraste `(L_claro + 0.05) / (L_oscuro + 0.05)`, sin opacidades ni mezclas. Los valores se muestran con dos decimales; la evaluación utiliza el valor sin redondear. Referencias: texto normal 4.5:1; texto grande 3:1; componentes funcionales no textuales 3:1 respecto del color adyacente cuando resulte aplicable. Los cálculos de pares de color no certifican la accesibilidad completa de una interfaz.

| Token propuesto | Valor | Uso |
| --- | --- | --- |
| `color.canvas` | `#F7F5F0` | Fondo general elegido |
| `color.surface` | `#FFFFFF` | Tarjetas y controles |
| `color.ink` | `#242136` | Texto principal elegido y foco exterior |
| `color.muted` | `#605B70` | Texto secundario |
| `color.brand` | `#7950F2` | Acción primaria y acentos elegidos |
| `color.brand-hover` | `#6841D9` | Hover de la acción primaria |
| `color.brand-pressed` | `#5B35BC` | Acción primaria pulsada |
| `color.link` | `#653ACB` | Enlace de texto, con subrayado |
| `color.lime` | `#B9F65A` | Acentos elegidos con texto oscuro |
| `color.coral` | `#FF9368` | Acentos elegidos con texto oscuro |
| `color.control-border` | `#8B829B` | Borde funcional de controles claros |
| `color.decorative-line` | `#E3DEEC` | Retícula y separación decorativa |
| `color.success-ink` | `#31520B` | Mensaje de éxito con icono/texto |
| `color.error-ink` | `#9D332B` | Mensaje de error con icono/texto |

| Par | Contraste | Aplicación |
| --- | ---: | --- |
| Tinta / lienzo | 14.32:1 | Texto normal |
| Tinta / blanco | 15.60:1 | Texto normal |
| Texto secundario / lienzo | 5.97:1 | Texto normal |
| Blanco / violeta de marca | 4.95:1 | Acción primaria con texto blanco |
| Blanco / violeta hover | 6.27:1 | Estado hover |
| Blanco / violeta pulsado | 7.84:1 | Estado pulsado |
| Violeta de enlaces / lienzo | 6.38:1 | Enlaces de contenido subrayados |
| Violeta de marca / lienzo | 4.54:1 | Margen estrecho; preferir el token de enlaces para texto pequeño |
| Tinta / lima | 12.18:1 | Etiquetas o bloques con texto oscuro |
| Tinta / coral | 7.15:1 | Etiquetas o bloques con texto oscuro |
| Blanco / lima | 1.28:1 | No usar para texto |
| Blanco / coral | 2.18:1 | No usar para texto |
| Tinta / violeta de marca | 3.15:1 | No usar como texto normal de la acción primaria |
| Borde funcional / lienzo | 3.34:1 | Delimitación de controles |
| Línea decorativa / lienzo | 1.21:1 | Solo decoración |
| Texto de éxito / lienzo | 8.23:1 | Texto normal con señal adicional |
| Texto de error / lienzo | 6.55:1 | Texto normal con señal adicional |

Foco propuesto: contorno de 3 px en tinta, separado 2 px del componente, con la separación del color del lienzo o superficie. La tinta contrasta 14.32:1 sobre el lienzo y 3.15:1 sobre violeta. Una superficie oscura requeriría un contorno claro apropiado. El foco deberá verse sin recortes ni quedar oculto por elementos fijos; se comprobará en navegador durante la implementación autorizada.

Los estados seleccionado, activo, error, éxito y deshabilitado no se comunicarán solo mediante color. Opacidades, gradientes o mezclas introducidos en la implementación requerirán revisar el contraste resultante. Las líneas decorativas no sustituyen los bordes funcionales.

## Tipografía elegida y recursos de las maquetas

- **Space Grotesk**, pesos 600/700, para títulos y marca.
- **DM Sans**, pesos 400/500/600/700, para interfaz y lectura.
- Fallback: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

Para elaborar estas maquetas se han descargado únicamente recursos locales de diseño en `.local/design/i02/fonts/`: `SpaceGrotesk.ttf`, `DMSans.ttf`, `SpaceGrotesk-OFL.txt` y `DMSans-OFL.txt`. Se han inspeccionado ambos textos de licencia locales el 2026-11-05 y ambos identifican **SIL Open Font License 1.1**. Fuentes de referencia: [Space Grotesk](https://github.com/floriankarsten/space-grotesk) y [DM Sans](https://github.com/googlefonts/dm-fonts). Esta descarga no instala fuentes ni dependencias en la aplicación; esos archivos de trabajo no son parte del frontend.

La implementación utiliza los TTF variables originales autoalojados en `public/fonts/`, con `font-display: swap`, precarga y fallback, sin solicitudes a Google Fonts en ejecución. Se verifican procedencia, avisos SIL OFL 1.1, cobertura española y pesos; los avisos se distribuyen junto a los archivos. Los dos TTF suman 376840 bytes. WOFF2 queda como optimización posterior: no se incorpora una dependencia de conversión para cambiar los archivos aprobados. Este ajuste mecánico conserva familias, diseño y licencias; su procedencia y hashes se registran en la documentación de recursos.

| Token | Móvil | Escritorio | Interlineado / peso |
| --- | --- | --- | --- |
| `type.hero` | 44 px; 38 px a 320 px | 76 px; 64 px en anchos intermedios | 1.02–1.04 / 700 |
| `type.h1` | 32 px | 48 px | 1.12 / 700 |
| `type.h2` | 28 px | 36 px | 1.18 / 600 |
| `type.h3` | 22 px | 24 px (26 px en llamada de estado vacío) | 1.25 / 600 |
| `type.lead` | 18 px | 20 px | 1.5 / 400 |
| `type.body` | 16 px | 16 px | 1.6 / 400 |
| `type.control` | 16 px | 16 px | 1.5 / 600 |
| `type.small` | 14 px | 14 px | 1.45 / 400 o 500 |

Se propone escalado fluido acotado entre extremos, títulos con espaciado óptico ajustado (aproximadamente -0.055em en el hero y -0.025em en títulos menores), párrafos de 60–70 caracteres por línea y controles de formulario con texto de al menos 16 px. Los títulos deben ajustarse en español e inglés sin alturas fijas ni cortes arbitrarios.

## Tokens y componentes compartidos propuestos

| Familia | Propuesta |
| --- | --- |
| Espaciado | Unidad de 4 px; escala `4, 8, 12, 16, 24, 32, 48, 64, 96` |
| Radios | 8 px detalles; 12 px controles; 20 px tarjetas; 28 px paneles; píldoras solo en etiquetas breves |
| Bordes | 1 px por defecto; 2 px en selección cuando se necesite una señal adicional |
| Sombras | Cortas y suaves, tinta al 6–10 %; sin depender de ellas para delimitar controles |
| Contenedor | Máximo 1200 px; padding 16 px a 320, 20 px a 393, 32 px a 768, 48 px a 1280 y 64 px a 1440 |
| Secciones | Separación de 48 px en móvil y 80–96 px en escritorio; hero sin altura fija de pantalla |
| Rejilla | Una columna móvil; dos alrededor de 768 px si el contenido lo permite; tres en escritorio; tarjeta mínima aproximada 280 px |
| Cabecera | Mínimo 72 px móvil y 88 px escritorio; dos filas móviles visibles y altura ampliable por traducción, reflujo o zoom |
| Controles | Objetivo táctil mínimo 48 × 48 px y separación mínima de 8 px |
| Transiciones | 120–180 ms para estados; respetar `prefers-reduced-motion`; sin animación permanente en I-02 (evolución B posterior enlazada arriba) |

**Navegación.** Marca enlazada al inicio del idioma actual, catálogo y selector ES / EN con nombres accesibles. La navegación móvil visible está elegida y puede ocupar dos filas en 320 px. Incluir enlace de salto al contenido y una indicación del idioma activo que no dependa solo del color. No depender de hover ni introducir una cabecera fija sin revisar oclusión del foco.

**Botones y enlaces de acción.** Primario violeta con texto blanco, altura mínima 48 px, padding horizontal 20–24 px y radio 12 px. Secundario de superficie clara, tinta y borde funcional. Un CTA principal por bloque. Usar enlace para navegar y botón para ejecutar una acción. Los estados propuestos son:

| Estado | Tratamiento |
| --- | --- |
| Reposo | Paleta y borde funcional de cada variante |
| Hover | Primario `#6841D9`; secundario con leve cambio de fondo, conservando contraste y borde; ninguna información exclusiva de hover |
| Pulsado | Primario `#5B35BC`; secundario con fondo más marcado; sin escalar ni desplazar el control |
| Foco | Contorno de tinta de 3 px y separación de 2 px; visible también con hover o pulsado |
| Deshabilitado | Semántica real cuando la acción esté indisponible, señal de estado y texto aún legible; sin hover/pressed engañosos; evitar una opacidad global que vuelva ilegible el contenido |

No mostrar acciones deshabilitadas para miniapps inexistentes: el estado vacío explica la disponibilidad real. Un enlace de navegación no recibe `disabled` como si fuera un botón; se define la interacción semántica adecuada al caso.

**Tarjetas.** Superficie blanca, padding 24 px (20 px a 320), radio 20 px, icono sencillo, título y resumen breve. Incluir solo metadatos reales. Una futura tarjeta tendrá un enlace descriptivo a su miniapp, sin enlaces anidados ni controles duplicados. Títulos y resúmenes toleran distinta longitud por idioma. Los especímenes de las láminas permanecen fuera del registro y las rutas reales.

**Componentes comunes.** Shell/cabecera/pie, selector de idioma, enlace/botón, título de sección, tarjeta/rejilla, etiqueta, estado vacío, mensajes y bloque 404. Se propone una API pequeña y semántica: extraer comportamiento o repetición real, evitando una biblioteca genérica excesiva. Cada módulo de miniapp consumirá tokens y componentes públicos; sus estilos estarán limitados a su propio contenido y no introducirán selectores globales que alteren la plataforma u otros módulos. Una nueva herramienta no debería exigir ajustar tokens o layouts comunes para funcionar.

## Catálogo 0 → 1 → N sin rediseño

El catálogo se deriva automáticamente de los metadatos de miniapps publicadas. `Hero`, `Shell`, `CatalogGrid`, `Card`, `EmptyState`, navegación y tokens constituyen la misma estructura compartida para los tres estados:

| Estado | Comportamiento previsto |
| --- | --- |
| 0 publicadas | `EmptyState` explica que aún no hay miniapps publicadas; no hay herramientas ficticias ni acciones de ejecución engañosas. |
| 1 publicada | `CatalogGrid` muestra una `Card` con los metadatos del módulo, sin cambiar el hero, shell o navegación. |
| N publicadas | La misma rejilla distribuye las tarjetas de forma responsive, sin rediseñar la portada ni modificar otras miniapps. |

Los textos comunes de estado vacío y poblado se prevén una vez en los diccionarios de plataforma; nombres, descripciones y contenido de cada miniapp pertenecen a su módulo. Incorporar una herramienta no añade su copy a los diccionarios centrales. Los estados 0/1/N y la independencia visual se comprobarán con fixtures aisladas, excluidas del registro y la salida de producción; no se desarrollará una miniapp real en I-02.

## Responsive y encuadre de grabación

Revisar al menos 320 × 568, 393 × 852, 768 × 1024, 1280 × 800 y 1440 × 900, en ES y EN. Son muestras de aceptación: la solución debe interpolar sin desbordamiento horizontal y soportar zoom y textos largos. Escritorio puede tener hero en dos columnas; en móvil se apila con contenido y CTA antes del gráfico. La decoración ocupa menos espacio en móvil y permite encontrar el catálogo sin forzar la altura del hero.

Para una composición de vídeo de **1080 × 1920 (9:16)** se propone como guía editorial situar mensaje y acciones imprescindibles dentro de `x=96..900`, `y=220..1560`. Son reservas para posibles controles, subtítulos o recortes. **No es una zona segura universal garantizada:** TikTok, Instagram Reels y YouTube Shorts cambian sus superposiciones. Antes de exportar un vídeo real habrá que revisar las plantillas vigentes de cada plataforma.

El encuadre de grabación es independiente del diseño web: no oculta navegación ni reduce funcionalidad en producción. La captura móvil íntegra permite revisar la interfaz; un detalle de escritorio dentro del vídeo se identifica como encuadre editorial y mantiene texto esencial legible a tamaño de móvil. Las guías de reserva pertenecen a la lámina, no a la aplicación.

Para futuras miniapps se grabará un viewport móvil real, sin encoger la página completa de escritorio. Los controles mantendrán al menos 48 × 48 px CSS y el texto de interacción al menos 16 px CSS. Según el encuadre, se buscará que el texto esencial resultante mida aproximadamente 28–32 px en el vídeo de 1080 × 1920; es un objetivo editorial que debe comprobarse en la exportación, no una equivalencia fija entre píxeles CSS y vídeo.

Las escenas de entrada y resultado podrán conectarse mediante scroll. El encuadre no ocultará validaciones, estados de error o información necesaria, ni alterará la función para aparentar una demostración más simple. Cada módulo dispondrá de composición y espacios propios flexibles para su interacción: juegos, calculadoras u otras herramientas no se forzarán dentro de un formulario general. I-02 preparará esta base con fixtures aisladas y las pruebas futuras de AC-11–AC-14 del ExecPlan, sin implementar ninguna miniapp real.

## Criterios de aceptación visual propuestos

1. La implementación autorizada conserva la segunda composición aprobada en móvil y escritorio, con su distintivo, titular y navegación móvil visible. Los ajustes necesarios de accesibilidad, reflujo o traducción respetan esa dirección sin exigir aprobación de cada píxel.
2. La aplicación utiliza los tokens documentados como referencia compartida. Los estados reales conservan contraste suficiente; foco, enlaces y selección se distinguen sin depender únicamente del color.
3. En ES y EN, a 320, 393, 768, 1280 y 1440 px, no hay cortes, solapamientos ni scroll horizontal. El catálogo vacío es explícito. Ningún espécimen visual aparece como herramienta disponible.
4. Navegación, selector de idioma y acciones son utilizables con teclado y táctil; se revisan zoom, reflujo, orden de foco, movimiento reducido y ausencia de oclusiones. Las decoraciones no entran en el árbol accesible.
5. La revisión humana valida jerarquía, legibilidad, equilibrio, coherencia de componentes y encuadre 9:16. Las capturas y ensayos automáticos apoyan esta revisión sin sustituirla ni certificar por sí solos WCAG completa.
6. Las futuras fuentes de aplicación tienen procedencia/licencia y cobertura verificadas, se sirven localmente con fallback usable y no generan peticiones a servicios de fuentes externos.
7. Los estilos de un módulo sintético aislado no alteran la portada, el catálogo, los componentes comunes ni otra miniapp. Añadir el módulo no exige modificar los tokens o layouts compartidos. La prueba de extensibilidad completa se concreta en el ExecPlan.
8. Los estados 0/1/N usan la misma estructura y metadatos publicados; las fixtures de prueba nunca se incorporan al catálogo de producción. Los encuadres de miniapps futuras respetan viewport móvil, controles, legibilidad y validaciones, con flexibilidad de composición por módulo.

## Estado y siguientes autorizaciones

La aprobación expresa de ADR-MMA-017 queda registrada con el alcance indicado al inicio. No se reabre la elección visual D4 ni la tipografía ya elegida. La aprobación formal del ExecPlan I-02 y la ratificación de ADR-MMA-017 quedan registradas el 2026-11-05, seguidas de autorización expresa de ejecución. Se implementa la segunda composición y se registran sus comprobaciones y capturas reales en el informe de ejecución; las láminas anteriores siguen identificadas como maquetas. La aceptación del resultado corresponde al propietario.

## Evidencia de implementación I-02

Implementación y pruebas locales completadas el 2026-11-05, con trazabilidad AC1–14 en el [informe de ejecución](../i02-execution-report.md). Las capturas reales se distinguen de las maquetas. I-02 queda Aceptado y archivado tras revisión personal de escritorio/móvil por el propietario el 2026-11-05; se autoriza su commit local de cierre. Sin cambios materiales de ADR, pushes o despliegues.
