# PB-01 — Plan B / Bad Day Plan

## Control

* **Estado:** `Borrador`.
* **Responsable de aprobación, autorización, aceptación y cancelación:** propietario de MiMiniApp (Alexander / Ale).
* **Creado / última actualización:** 2026-11-15.
* **Base contrastada:** `staging`, `e203d73156a61a61138e9ff23de964a827221fad`.
* **Rama de preparación documental:** `docs/plan-b-v06`. La instrucción «vamos a ello» autoriza preparar el paquete previamente ofrecido; no se registra como autorización para desarrollar o publicar.
* **Dependencias de inicio de implementación:** selección y [ficha v06](../../product-specs/plan-b.md) aprobadas, ADR-MMA-020/021 aprobadas en el [registro técnico](../../design-docs/index.md), este plan aprobado y ejecución expresamente autorizada.
* **Dependencias de verificación:** Ale con iPhone/Safari y Android/Chrome; escritorio Safari, Firefox y Chrome; acceso a cuentas/calendarios de prueba; medio de abrir la UI por HTTPS en móviles para probar descarga/compartir. Ese acceso aún no se ha comprobado.

## Objetivo y resultado esperado

Entregar una primera miniapp real con propósito, obstáculo, frase si/entonces, calendario de cuatro semanas, PNG y enlace compartible. ES/EN, procesamiento local y fallos recuperables, integrada con los contratos actuales. Aceptación de producto mediante los doce criterios PB-AC de la ficha, evidencia automatizada y física, y resultado revisable por el propietario.

La incertidumbre móvil se investiga antes del acabado visual. El tiempo de Ale se limita a 3–4 sesiones de 2–3 horas; no se convierte en una promesa de desarrollo. Si la compatibilidad no permite entregar el núcleo, se documenta el resultado y se revisa el alcance antes de seguir por una alternativa incompatible.

## Alcance y exclusiones

Incluye código futuro dentro de `src/miniapps/plan-b/`, inscripción en registro, tests colocados en su carpeta y documentación de evidencia. No se añaden dependencias, rutas especiales, layouts, estilos globales, servicios, secretos, workflows o recursos de alojamiento. No cambia la política de movimiento de plataforma. Una desviación de esos límites se propone antes de ejecutarla.

Preparar commits/push/PR se autorizará expresamente junto al alcance operativo cuando se apruebe este paquete. El merge será humano. La entrega pública de staging usa su circuito ya activo tras merge autorizado; este borrador no autoriza activarlo de otra forma. Producción, promoción, dominio propio, rollback remoto y cambios de permisos quedan fuera.

## Decisiones aplicables

Ya aprobadas: ADR-MMA-001/002/003 (Astro/React/TS/Tailwind), 005/006 (local por defecto), 008/015 (calidad/toolchain), 011/016 (registro/rutas/idiomas), 017/019 (identidad y apariencia), 004/009/014 (entrega existente). Propuestas necesarias: ADR-MMA-020 (sesión temporal) y 021 (exportaciones y Google).

I-01/I-02 y MT-01 están aceptadas. I-03/CP-02 mantienen sus estados; no son dependencia completa de este módulo independiente. Antes de ejecutar, comparar los contratos consumidos con staging actualizado y coordinar cualquier cambio coincidente. No reabrir planes cerrados ni alterar arquitectura actual para describir una intención.

## Trabajo previsto

### Sesión 1 — lógica y pruebas tempranas de formatos

1. Revisar aprobación/autoridad, obtener staging actual, crear rama feature independiente, comprobar runtime compatible y baseline. El npm observado en esta preparación fue 11.9.0, inferior al mínimo del proyecto 11.19.1: usar el runtime/npm fijado compatible antes de instalar o declarar `verify` completo. No cambiar `engines` o lockfile para adaptar el entorno.
2. Preparar carpeta de la miniapp con descriptor borrador y dominio puro: entradas, mes, fechas/recurrencia, `.ics`, URL de Google y layout del PNG. Fecha y UID inyectables en pruebas.
3. Generar `.ics`, PNG y enlace Google de prueba con datos sintéticos, incluyendo longitudes máximas, emoji y un día de semana. Ale importa el archivo y abre el enlace en ambos móviles; anota app, versión, zona, fechas y resultado. Esto prueba formatos/importación, no certifica aún la descarga desde la UI.
4. Preparar un build aislado siguiendo el precedente de las fixtures de integración para poder probar el borrador sin cambiar su estado público ni filtrar borradores al `dist/` del producto. El mecanismo auxiliar pertenece a las pruebas de Plan B; no modifica el publicador ni añade rutas a producción.

**Salida esperada:** pruebas de lógica y primeras evidencias de importación/legibilidad. Un calendario incorrecto o PNG ilegible se corrige antes de invertir en visuales. Los teléfonos y sus apps son requisito de evidencia; su ausencia se registra como pendiente, no como éxito.

### Sesión 2 — recorrido funcional y comprobación de APIs móviles

1. Construir portada, pasos, resultado, ES/EN, validaciones, sugerencias, ejemplo, Atrás y reset; reutilizar layout sin duplicar cabecera/h1.
2. Integrar sesión y recuperación ante errores; cambiar idioma sin traducir el texto personal. Integrar exportaciones, consentimiento Google, compartir/copiar y errores/cancelaciones con APIs nativas.
3. Con UI mínima en un **origen HTTPS accesible desde los móviles**, comprobar Blob/download, posibles variantes iOS, activación de usuario al compartir archivo, cancelaciones, popup y guardar PNG. No dar por probado Safari a partir de Chromium emulado.

**Acceso para esa prueba:** preferir una vista previa HTTPS ya disponible y autorizada, con datos sintéticos. Antes de usarla, comprobar identidad/origen, acceso en los dos teléfonos y ausencia de publicación automática de borradores. Si no existe tal capacidad, registrar el bloqueo y presentar la propuesta mínima para habilitarla; este plan no autoriza un túnel, proveedor o despliegue nuevo ni un bypass del flujo de staging. El desarrollo local independiente puede continuar, pero la validación móvil y el acabado de la sesión 3 quedan pendientes. Abrir archivos de ejemplo de la sesión 1 no sustituye esta prueba.

**Salida esperada:** matriz de vías que realmente funcionan en ambos dispositivos. Si solo Google permite guardar el evento en uno de ellos, documentar su conexión obligatoria y mostrar el límite de la importación local como define la ficha. Sigue siendo obligatorio generar el `.ics` offline. Si falla toda vía en un móvil, no reducir el criterio esencial sin revisión del propietario.

### Sesión 3 — visuales, accesibilidad y uso offline

1. Implementar gris, sello y reduced-motion propios; claro/oscuro con tokens, reflujo/zoom y foco. Capturas mínimas para revisión visual y un clip solo si hace falta evaluar el movimiento.
2. Completar pruebas de componentes y E2E ES/EN, errores de almacenamiento/exportación, red, cancelaciones, demo/reset y modo avión tras carga completa. Preparar las fuentes antes de pintar canvas.
3. Ale recorre ejemplo en modo avión y coloca PNG como fondo en ambos teléfonos. Revisar Chrome/Safari/Firefox de escritorio con versiones identificadas. Prueba sin ayuda con 2–3 personas como observación de usabilidad, sin recoger planes personales ni convertir la duración de dos minutos en métrica ya demostrada.
4. Medir JS/CSS propio y total de recursos solicitados, sin comprimir/gzip. Documentar runtime compartido y presupuestos, con el HTML/chunks del build real.

### Sesión 4 — correcciones, entrega y aceptación

1. Resolver fallos materiales y ejecutar `npm run verify` con el entorno compatible. La inspección del build aislado debe demostrar que la entrada funciona y no altera otras miniapps/plataforma, además de la regresión sintética existente.
2. Revisar candidato local con el propietario. Solo al aprobar su incorporación pública se fija `status: published`, `publishedAt` y el loader del registro. Volver a comprobar rutas reales, catálogo y el build final con los mismos escenarios, sin excluir pruebas por el cambio de estado.
3. Con permiso operativo, preparar rama/commits/push/PR hacia staging y enlazar CI/commit. El propietario decide el merge; Actions publica por el circuito existente. Corroborar versión de staging y repetir allí los recorridos afectados, descargas y matriz manual relevante. No usar como evidencia una versión anterior.
4. Registrar resultados, limitaciones y decisiones finales de compatibilidad; actualizar documentación que describa realidad implementada. Marcar `Verificado` únicamente cuando no falte ningún criterio material. Entregar para aceptación humana y archivar solo tras ella.

## Entorno y herramientas

Node 24 compatible con `engines` y npm ≥11.19.1 <12; lockfile actual, Astro/React/TS/Tailwind ya presentes, Vitest/RTL/Playwright/axe y Chromium fijado. `npm ci` solo si es necesario con runtime correcto; no añadir paquetes por la preparación documental. `ASTRO_TELEMETRY_DISABLED=1` permite usar Astro sin crear configuración fuera del workspace en este entorno.

Comandos existentes: `npm run check`, `npm run lint`, `npm run format:check`, `npm run validate:hosting`, `npm run test:unit`, `npm run test:components`, `npm run test:e2e`, `npm run test:integration`, `npm run verify`. `npm run test:remote` tiene su propio contrato de target y lo ejecuta Actions; no improvisar una ejecución contra cualquier URL. El build aislado y medición de bundles de Plan B son trabajo previsto, no comandos existentes.

## Criterios de aceptación y pruebas previstas

Son vinculantes **PB-AC-01–12** de la [ficha](../../product-specs/plan-b.md#7-calidad-tiempo-y-aceptación); este plan no los redefine. Matriz de cobertura:

| Nivel | Pruebas a crear / revisión |
| --- | --- |
| Dominio `tests/*.test.ts` | Mes natural, cambio anual/bisiesto; validación Unicode; primer día desde mañana; 4/20/28 eventos sin quinta semana; fin a medianoche; formato flotante/DST; `.ics` con comas, barras, CRLF y emoji en límite de 75 octetos; URL con `&`, `#`, `?` y texto de aspecto HTML. Expectativas independientes. |
| Componente `tests/*.test.tsx` | Pasos y errores, ejemplo sin editar/tras edición, conservación de texto, todos los días desmarcados, hora opcional, recuperación y reset con errores de storage, confirmación/cancelación Google, fallos de APIs. |
| Navegador `tests/*.spec.ts` | Rutas reales ES/EN, selector, catálogo, teclado/foco/axe, claro/oscuro/320 px/zoom, reduced-motion, reload online, modo avión tras carga, descargas/PNG y portapapeles/share simulados, ausencia de datos en recursos/URL propias. Interceptar Google al probar el consentimiento; no abrirlo realmente desde la suite. |
| Integración / regresión | Compilar miniapp publicada solo en copia aislada mientras sea draft; verificar aislamiento del build original y del catálogo. Después probar el candidato published real. Conservar batería común sin debilitarla. |
| Físico | Safari iPhone y Chrome Android: formato, vía real de importación, descargas, guardar fondo, legibilidad bajo reloj y offline; Chrome/Safari/Firefox escritorio: recorrido, calendario, descargas y copia. Registrar SO/navegador/app/versión/zona, fecha, target y resultado por caso. |

## Evidencia y recuperación

Aplicar [política de evidencias](../../standards/QUALITY_SCORE.md#política-de-evidencias): comandos y resultados locales descritos como locales; CI con enlace al run/commit; capturas mínimas en `docs/review/pb01/` con manifest si se necesitan para aprobación. No versionar reportes completos, fotos con planes personales ni secretos. En el informe futuro separar aprobado, fallido, omitido y no ejecutado. En modo offline no se trata como defecto una petición externa intencional bloqueada que el test haya interceptado y comprobado expresamente; no se desactiva el control general de red.

Riesgos principales: importación `.ics`/Google, descargas iOS, acceso HTTPS de pruebas, límites de storage, hora/zona y ajuste de texto en PNG. Mantener estado visible ante error, liberar URLs Blob y repetir solo verificaciones afectadas tras corregir. Recortes permitidos son únicamente los de la ficha y se registran; un requisito esencial incumplido mantiene el plan `En curso`.

Antes de merge, corregir o retirar el cambio en la rama feature; no force push ni tocar ramas protegidas. Después de una publicación autorizada de staging, una reversión se prepara por PR con el propietario; no se usa el workflow de rollback bloqueado ni se modifica producción.

## Progreso y punto de parada

Solo preparación documental realizada. No se ha escrito código de Plan B ni ejecutado pruebas del producto. Las comprobaciones de la base durante la revisión previa fueron locales: Astro check (82 archivos, cero diagnósticos), 343 unitarias, 9 de componentes y build correctos; no equivalen a `verify`, CI actual o compatibilidad física. Runtime observado: Node 24.22.1 / npm 11.9.0. Los documentos nuevos se verificarán por coherencia, enlaces y diff.

Revisión documental local del 2026-11-15 completada: siete archivos, 86 enlaces relativos y 16 destinos con anchor válidos; 98 claves ES/EN sin duplicados ni diferencias de parámetros; doce criterios consecutivos; v05 preservada literalmente tras su nota de procedencia. La definición de recurrencia se contrastó en 889 combinaciones de días seleccionados y día de exportación. Es revisión de la especificación, no una prueba de un generador implementado. Sin pruebas de aplicación nuevas por tratarse de documentación. Se conserva el estado `Borrador`.

El punto de parada actual es entregar el [paquete concreto](../../design-docs/plan-b-approval.md) para revisión. Aprobar requisitos y decisiones no autoriza por sí solo implementación. En ejecución futura, detener solo trabajo dependiente de una decisión/capacidad que falte; no declarar aceptado por terminar una sesión o por CI verde.

## Historial de estado

| Fecha | Estado | Actor | Evidencia o motivo |
| --- | --- | --- | --- |
| 2026-11-15 | `Borrador` | Codex | El propietario pide preparar la v06 y el plan tras el contraste con staging. Sin autorización de implementación. |
