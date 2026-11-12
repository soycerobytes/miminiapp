# Creative Playground — identidad y contrato técnico aprobados

**Enmienda autorizada por el propietario, 2026-11-10:** según ADR-MMA-018 actualizado en el registro, el movimiento decorativo comienza activo aun con reduced-motion y se alterna únicamente desde el icono de ondas de cabecera, con raya al pausar. Sigue sin persistencia y conserva suspensión temporal por visibilidad. Esta instrucción sustituye hacia adelante la prioridad de reduced-motion descrita en el contrato histórico; la microinteracción de apariencia conserva su reducción independiente. Implementación y evidencia en CP-02.

**Responsable:** propietario de MiMiniApp. **Actualizado:** 2026-11-08.

**ADR-MMA-017, evolución visual:** `Aprobada` expresamente por el propietario el 2026-11-08, tras revisar `creative-playground-v2`. Sustituye hacia adelante la restricción de movimiento continuo de I-02 únicamente por los movimientos descritos aquí. La aceptación histórica de I-02 no cambia.

**ADR-MMA-018, integración y ciclo de vida:** `Aprobada` formalmente por el propietario el 2026-11-08, incluyendo flotación central. El [ExecPlan CP-01](../exec-plans/completed/CP-01-creative-playground.md) está aprobado y Iteración 1 aceptada y ejecución de Iteración 2 autorizada expresamente el 2026-11-08. El propietario acepta el resultado y la intensidad del movimiento el 2026-11-08; CP-01 queda cerrado. El [registro](index.md) es la fuente canónica de los estados de los ADR. La concreción técnica queda aprobada; su aprobación no significa implementación de animaciones.

## Referencia visual seleccionada

La referencia es la segunda exploración, no una reinterpretación de la primera ni un nuevo diseño de portada. Se conservan paleta, Space Grotesk/DM Sans, navegación visible, jerarquía, distribución responsive y copy ES/EN del producto. La galería es una reconstrucción aislada: sus barras de demostración, selectores, páginas de laboratorio y simplificaciones del catálogo no se trasladan al frontend.

* **Logo A:** cuatro piezas de la M modular como primera letra, seguidas exclusivamente de `iMiniApp`. El conjunto dice MiMiniApp. No colocar un isotipo separado delante del nombre completo.
* **Compacta:** wordmark de cabecera y pie. **Editorial:** recurso para piezas de marca y vídeos; no es un tema seleccionable de la interfaz.
* **Carga:** ensamblaje expresivo real de la M; después queda estable. Hover con separación y reensamblaje breve.
* **Hero B:** entrada expresiva y movimiento ambiental moderado, con elementos independientes. El centro usa la misma M. El propietario añade el 2026-11-08 que la ilustración grande de la derecha debe seguir en bucle; aprueba posteriormente la flotación moderada de la tarjeta central con la M y los parámetros adicionales indicados abajo. Su intensidad visual se comprobará en Iteración 2.
* No implementar ensamblaje fluido, hero A o C, selectores de variantes, controles Repetir ni opciones de amplitud en el producto. El favicon queda estático.

Las [referencias conservadas](assets/creative-playground-v2/reference-manifest.json) incluyen SVG compactos/editoriales e isotipo, claros/oscuros; [comparación de marcas](assets/creative-playground-v2/wordmarks-comparison.png), [portada del prototipo en escritorio](assets/creative-playground-v2/compact-desktop.png), [móvil](assets/creative-playground-v2/compact-mobile.png), [composición B en 9:16](assets/creative-playground-v2/joint-9x16.mp4) y [ensamblajes](assets/creative-playground-v2/wordmark-assembly.mp4). En este último vídeo **solo el panel expresivo de la derecha está seleccionado**; el panel fluido se conserva como contexto histórico. Son referencias de aprobación, no evidencias de la implementación futura.

El manifiesto registra también los hashes de la galería, CSS, JS y ZIP originales de `.local/creative-playground-v2/`, que permanecen intactos e ignorados. Las copias bajo `docs/` no se importarán al runtime: durante la ejecución autorizada se prepararán únicamente los recursos seleccionados para `src/` o `public/`. No distribuir vídeos, comparativas o alternativas descartadas en el build web. Las fuentes originales y los avisos OFL siguen en `public/fonts/`; los contornos del wordmark se derivan de Space Grotesk 700 local, no de un servicio externo. Se conserva la licencia general del proyecto pendiente.

## Construcción de marca que debe conservarse

Referencia normalizada del SVG: altura de mayúsculas 70 unidades, extremo superior `y=30`, línea base `y=100`; la M ocupa `x=0..76`. Sus cuatro piezas son las de los SVG conservados: dos astas de 13 unidades y dos diagonales. No sustituirlas por una letra de fuente, un carácter Unicode, trazos que se revelan o una transición de opacidad.

En compacta, `iMiniApp` empieza en `x=77`, con ajuste de avance de −1,1 unidades por letra. Editorial empieza en `x=81`, avance −1,8 y transformación conjunta `translate(14 0) skewX(-7)`, con App violeta. Se mantiene la línea base, el peso óptico y la relación con las mayúsculas de los contornos. El cambio de tamaño de la interfaz escala el conjunto, sin abrir un hueco entre la M y la i. En recursos oscuros la M y el acento editorial usan lima y el texto claro el lienzo cálido. No se añade un modo oscuro al producto.

El nombre accesible del enlace de marca es MiMiniApp una sola vez; los contornos decorativos no producen lecturas letra a letra o nombres duplicados. El isotipo independiente se utiliza en favicon y ubicaciones que necesiten símbolo solo. Se revisa el símbolo del catálogo vacío si actúa como identidad, manteniendo su composición y textos; no se reemplaza indiscriminadamente toda geometría decorativa.

## Ritmo de referencia y ajuste de bucle solicitado

Estos valores describen el prototipo seleccionado y no autorizan su ejecución. Un ajuste puramente mecánico de unidades o agrupaciones puede conservar el mismo resultado; cambiar geometría, ritmo, amplitud o sustituir el ensamblaje por un fade requiere volver al propietario.

### M expresiva

Cuatro piezas independientes; duración 1450 ms, retraso por pieza `i × 70 ms`, curva `cubic-bezier(.2,.65,.25,1)`. La última termina a 1660 ms. Las posiciones iniciales normalizadas son:

| Pieza | dx | dy | Rotación |
| --- | ---: | ---: | ---: |
| Asta izquierda | −90 | −84,1 | −60,8° |
| Diagonal izquierda | 51 | −133,4 | 83,2° |
| Diagonal derecha | −45 | 124,7 | −73,6° |
| Asta derecha | 135 | 50,75 | 54,4° |

Se conserva el punto intermedio al 64 % del `runtime.js` original (vector base × 0,13, giro base × 0,12), el pequeño sobrepaso alterno de ±2 unidades y ±1,7° al 84 % y encaje exacto al 100 %. Orígenes de transformación locales a cada pieza, como en el prototipo. Durante los retrasos las piezas permanecen en su posición inicial; el estado base del SVG siempre es la marca completa.

Hover: astas/diagonales del lado izquierdo `dx=−10`, lado derecho `dx=10`, `dy=±5` y giro `±5°` al 40 %; regreso al encaje. Duración 480 ms, escalonado `i × 18 ms`, curva `cubic-bezier(.22,1,.36,1)`. No repetir en bucle, no activar al mover el puntero entre piezas, no reiniciar una entrada que sigue en curso. No desplazar el nombre por foco de teclado o por toque.

### Entrada del hero

Grupos exteriores para entrada e interiores para ambiente, de modo que sus transformaciones se compongan sin saltos. La tarjeta central mantiene su transformación geométrica de base y contiene las mismas piezas de M. `transform-box: fill-box` y origen central donde lo usa el prototipo; se conservan pivotes locales de piezas y las transformaciones originales de las formas.

| Orden i | Grupo | dx / dy / giro inicial | Duración | Retraso |
| ---: | --- | --- | ---: | ---: |
| 0 | Círculo lima | 70 / −55 / 28° | 1100 ms | 150 ms |
| 1 | Bloque coral | −75 / 60 / −28° | 1220 ms | 220 ms |
| 2 | Órbita | −20 / 20 / −60° | 1340 ms | 290 ms |
| 3 | Tarjeta central | 24 / −65 / 22° | 1100 ms | 360 ms |
| 4 | Anillos | 60 / 45 / 30° | 1220 ms | 430 ms |
| 5 | Satélite | −60 / −35 / −30° | 1340 ms | 500 ms |
| 6 | Onda | 0 / 50 / 0° | 1100 ms | 570 ms |
| 7 | Retícula | −20 / −15 / −12° | 1220 ms | 640 ms |

Cada grupo converge al transform neutro con `cubic-bezier(.16,1,.3,1)`. Los valores son unidades SVG, no píxeles fijos del viewport; se conserva el margen de la ilustración del prototipo (`viewBox` ampliado a `−15 −12 540 490`) si es necesario para no recortar los recorridos. No cambiar el tamaño o distribución de la portada para acomodar controles de demostración.

### Ambiente exclusivo de B

Bucles `ease-in-out`, con extremos iguales al 0/100 % y posición alternativa al 50 %. Las fases negativas y las duraciones distintas evitan un balanceo simultáneo de todo el dibujo. La entrada exterior y el ambiente interior se coordinan como en B, sin una nueva espera o cambio brusco al terminar la entrada. La tabla siguiente conserva los seis bucles originales de B; la flotación central adicional se distingue después para revisión.

| Grupo | Extremo alternativo | Periodo | Fase |
| --- | --- | ---: | ---: |
| Lima | `translate(−12,−18)` | 5,8 s | 0 s |
| Coral | `translate(12,9) rotate(7deg)` | 7,3 s | −1,2 s |
| Órbita | giro −5° ↔ 8° | 8,6 s | −2 s |
| Anillos | `translate(−9,12)` | 6,7 s | −0,5 s |
| Satélite | `translate(14,−10)` | 4,9 s | −1,4 s |
| Onda | `translateX(10)` | 7,9 s | −3 s |

Los seis grupos de referencia se mueven de forma perceptible. En el prototipo aprobado la tarjeta central permanece estable tras su entrada. **Ajuste solicitado después por el propietario:** mantener en bucle la ilustración grande, incluida la tarjeta con la nueva M. Se propone añadir a esa tarjeta un séptimo movimiento ambiental: de transform neutro a `translate(0,−6) rotate(1.5deg)` y regreso, periodo 6,4 s, fase −0,9 s y `ease-in-out`, en la capa interior que agrupa tarjeta y M. Estos parámetros nuevos quedan aprobados junto con ADR-MMA-018 y CP-01; su intensidad requiere revisión visual en Iteración 2 y no se atribuyen al vídeo original. La M permanece ensamblada durante la flotación: no se propone repetir continuamente su construcción. Titular, copy, CTA, navegación, tarjetas del catálogo y favicon no tienen movimiento ambiental. No añadir parallax, destellos, zoom repetitivo, cambios de layout ni amplitudes de C.

## ADR-MMA-018 — integración y accesibilidad

1. **Astro + SVG + CSS.** Componentes compartidos pequeños para isotipo/wordmark y la ilustración existente; CSS para keyframes y transformaciones. JavaScript/TypeScript nativo mínimo para arranque, estado de pausa, preferencias y visibilidad. Sin islas React para animar la marca, librerías nuevas, red externa o copia de la galería al producto. Se propone portar las entradas WAAPI del prototipo a CSS preservando los fotogramas, retrasos, pivotes y curvas anteriores; no copiar el framework de controles de laboratorio.
2. **Progresivo y completo en SSR.** El HTML inicial contiene la identidad final y el contenido legible. CSS por defecto estático. Activar animaciones después de instalar controles y observadores; si el script está bloqueado o falla su inicialización, mantener la marca completa sin ambiente. Los controles solo se ofrecen como operativos tras inicializarse, dentro de un espacio reservado que evita CLS. Los fallos no pueden dejar piezas con opacidad cero, transformaciones iniciales permanentes o navegación dependiente de JS.
3. **Una entrada por instancia/documento.** Cabecera al cargar; pie y hero cuando entren por primera vez en el viewport. La aparición del hero coordina su M y los grupos exteriores. Volver a hacer scroll o salir/entrar de la pestaña no repite la entrada. Sin interacciones hover en puntero táctil o sin capacidad hover. Solo enlaces de marca interactivos usan esa microinteracción, sin cambiar su acción de navegación ni su foco.
4. **Pausa del producto.** Un botón nativo discreto junto al hero, con área mínima 48 × 48 px, contraste/foco y etiquetas ES/EN de Pausar/Reanudar animaciones. Detiene el movimiento decorativo del documento, incluidas entradas y hover, y conserva la posición. Reanudar continúa sin volver a ensamblar ni adelantar de golpe el tiempo pausado. No es un panel de demo y no incluye Repetir ni selectores. El nombre y estado se comunican de forma accesible y sin anuncios continuos por fotograma.
5. **Estado local en memoria del documento.** Sin cookies, localStorage o sessionStorage nuevos. La pausa del usuario se conserva al hacer scroll y al ocultar/mostrar la pestaña; una nueva navegación documental vuelve a consultar el sistema. Se aprueba este alcance explícito para conservar las invariantes actuales de ausencia de estado almacenado. No se introduce un gestor de preferencias persistentes.
6. **Reducción de movimiento prioritaria.** Con `prefers-reduced-motion: reduce`, al cargar o cambiar en caliente, se suprimen entradas, hover, transiciones decorativas y ambiente: identidad final completa y quieta. El control no puede forzar movimiento sobre esa preferencia y comunica Movimiento reducido / Reduced motion. Si se retira la reducción, no repetir entradas ya vistas; conservar una pausa manual y reanudar solo el ambiente permitido cuando corresponda.
7. **Visibilidad y rendimiento.** Pausar animaciones fuera de pantalla y con pestaña oculta. Restaurar solo las que no estén pausadas por el usuario o por el sistema. Usar transformaciones; no animar dimensiones, posición de layout o filtros costosos ni mantener un bucle JS por fotograma. No introducir eventos/listeners duplicados al inicializar o restaurar una página.
8. **Presupuesto aprobado.** JavaScript adicional de movimiento ≤5 KiB gzip y CSS adicional de movimiento ≤5 KiB gzip, medidos sobre el build. Sin descargas externas ni hidratación React en portada. Reservar dimensiones de marca, ilustración y control; cero desplazamientos de layout atribuibles al movimiento. Comparar descarga y traza local con la base en el mismo entorno; no presentar una medición local como rendimiento de campo.

Los detalles de nombre de archivo, agrupación CSS y atributos internos que mantengan este contrato son mecánicos. Una desviación material de la referencia, nuevas dependencias, persistencia o una ampliación de los elementos animados requieren aprobación. Ninguna de estas decisiones cambia rutas, contrato modular, hosting o controles de publicación.

## Aprobación registrada y ejecución limitada

La dirección visual y su excepción delimitada al movimiento continuo ya están aprobadas; no se vuelven a someter como nuevas alternativas. **ADR-MMA-018 y CP-01 están aprobados formalmente el 2026-11-08; Iteración 1 está aceptada e Iteración 2 autorizada expresamente el 2026-11-08, ejecutada y Verificada y Aceptada expresamente por el propietario el 2026-11-08; CP-01 queda archivado.** Sin autorización de merge o despliegue. El plan exige evidencias reales y comparación en cada iteración; la verificación automática no reemplaza la aceptación visual del propietario.

| Fecha | Actor | Registro |
| --- | --- | --- |
| 2026-11-08 | Propietario de MiMiniApp | Aprueba dirección de logo A integrado, compacta/editorial, ensamblaje expresivo, hover y hero B. Autoriza únicamente preparar decisiones/plan. |
| 2026-11-08 | Propietario de MiMiniApp | Añade que la ilustración grande de la derecha quede en bucle de movimiento. Se incorpora al alcance propuesto la flotación moderada de tarjeta/M, con amplitud/periodo pendientes de aprobación; no autoriza ejecutar el plan. |
| 2026-11-08 | Codex | Registra la evolución visual de ADR-MMA-017 y prepara ADR-MMA-018/CP-01 como propuestas. Sin implementación, commit, PR, push o despliegue. |
| 2026-11-08 | Propietario de MiMiniApp | Aprueba formalmente ADR-MMA-018, la flotación central y CP-01. Autoriza solo Iteración 1 y PR en borrador con CI. Reserva animaciones y aceptación de su intensidad a Iteración 2. |
| 2026-11-08 | Propietario de MiMiniApp | Tras aceptar visualmente Iteración 1, autoriza expresamente Iteración 2. Codex ejecuta el contrato aprobado; la aceptación de intensidad/fidelidad sigue pendiente. |

| 2026-11-08 | Propietario de MiMiniApp | «acepto el resultado»: acepta Iteración 2, incluida la intensidad de flotación central, y cierra CP-01. Sin autorización de merge, despliegue o nuevo trabajo. |
