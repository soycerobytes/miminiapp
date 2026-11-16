# Plan B v06 — paquete para revisión del propietario

**Estado:** preparado para revisión, sin aprobación registrada. **Responsable:** propietario de MiMiniApp (Alexander / Ale). **Fecha:** 2026-11-15. **Rama documental:** `docs/plan-b-v06`, desde staging `e203d73156a61a61138e9ff23de964a827221fad`.

## Qué se entrega

* [Ficha funcional v06](../product-specs/plan-b.md): definición autocontenida, textos ES/EN, comportamiento ante errores y doce criterios de aceptación.
* [ADR-MMA-020/021](plan-b-contracts.md): propuestas de sesión temporal y exportaciones; estados canónicos en el [registro técnico](index.md).
* [PB-01](../exec-plans/active/PB-01-plan-b.md): plan en borrador, cuatro sesiones de Ale, compatibilidad móvil antes del acabado visual.
* [v05 original](../references/plan-b-v05.md): antecedente aportado, con nota de procedencia. No se da por verificado que su v04 exista en Git.

## Bloque A — definición de producto propuesta

Seleccionar Plan B como primera miniapp real y aprobar la ficha v06, incluidos estos cambios respecto a v05:

| Tema | Propuesta concreta | Motivo |
| --- | --- | --- |
| Integración | `/es/apps/plan-b/` y `/en/apps/plan-b/`, nombre inglés Bad Day Plan, categoría `everyday`. | Usa el registro y selector actuales sin modificar rutas compartidas. |
| Fechas | Siguiente mes natural, fijado al empezar la sesión narrativa. | Hoy +31 días puede saltarse febrero. |
| Calendario | Hora local, desde mañana, 15 min, exactamente cuatro apariciones por día elegido. | Evita quinta semana y define fin verificable. |
| Offline | Recorrido y generación `.ics`/PNG con página completamente cargada y abierta. | No promete reapertura, reload o cambio de idioma offline sin mecanismo adicional. |
| Texto y estado | Trim exterior; límites Unicode; sin reescribir. Cambiar idioma u obstáculo conserva frases; fallos de storage tienen aviso. | Evita pérdida silenciosa y diferencias entre salidas. |
| PNG | Vertical fijo 1179×2556 en todos los dispositivos, con frase completa y pruebas bajo el reloj. | Evita fondos horizontales desde escritorio y simplifica memoria/layout. |
| Tamaño | 50 KiB sin comprimir para código JS/CSS propio; informar también total real, incluidos runtimes. | El renderer de React actual por sí solo supera 50 KB sin comprimir y no lo descarga la portada. |
| Entrega | Primera aceptación en staging; producción y dominio propio separados. | Producción/promoción siguen bloqueadas en la base actual. |

Se conservan núcleo, ejemplo, imagen, tres pasos, sello, ES/EN y al menos una vía funcional de calendario en cada móvil. Si Google es la única vía de importación en alguno, se explica que requiere conexión; el archivo `.ics` sigue generándose offline. No se añaden analítica, cuentas, servicios, dependencias ni PWA. Los recortes permitidos siguen el orden acotado de la ficha.

## Bloque B — decisiones técnicas propuestas

* **ADR-MMA-020:** `sessionStorage` versionado y validado, memoria ante fallo, reset explícito. Cerrar pestaña no garantiza borrado; no se toca la preferencia de apariencia.
* **ADR-MMA-021:** `.ics` y PNG locales; Google solo tras aviso/confirmación, con texto en su URL. Compartir la herramienta lleva URL limpia; compartir PNG puede entregar el plan al destino elegido. Sin API, OAuth o backend.

Aprobar B exige cambiar a `Aprobada` las dos filas del registro técnico, con fecha y actor, y reflejar la indicación en sus documentos. La aprobación de A no sustituye esa decisión.

## Bloque C — plan propuesto

Aprobar PB-01 con estas etapas:

1. Lógica pura y muestras de calendario/PNG: pruebas de formato y primera revisión de importación en iPhone/Android.
2. Recorrido funcional y APIs reales de descarga/compartir: requieren UI accesible por HTTPS desde ambos móviles.
3. Acabado visual, accesibilidad, offline y pruebas ES/EN, tras comprobar las vías móviles.
4. Correcciones, `verify`, CI, incorporación humana a staging y aceptación con evidencia.

Límite de Ale: 6–12 h, sin garantía de fecha. Las vías que no funcionan no se presentan como terminadas; si no cabe el núcleo, se revisa alcance. No se exige cerrar todo I-03 o CP-02 para ejecutar un módulo independiente.

## Bloque D — autorización de ejecución y alcance operativo

Después de aprobar A/B/C, el propietario puede autorizar expresamente **desarrollo local de PB-01**, rama feature desde staging, pruebas y preparación de evidencia. Si quiere continuidad hacia revisión remota, puede incluir **commits, push y PR en borrador hacia staging**, conservando merge manual humano. Ninguno de esos permisos se deduce de este documento ni de la instrucción previa de preparar borradores.

Esta autorización no permite al agente hacer merge, desplegar por fuera de Actions, habilitar producción/promoción/rollback, crear hosting/túneles, modificar secretos/protecciones o publicar un prototipo incompleto por eludir la verificación.

**Capacidad que falta comprobar:** acceso HTTPS al candidato desde iPhone y Android para validar descargas/compartir de la UI antes de pulir visuales. El staging vigente sirve la versión ya fusionada, no una rama feature. Primero se comprueba si existe una vista previa ya autorizada. Si no existe, el agente prepara una propuesta concreta de acceso y solicita la decisión correspondiente; aprobar PB-01 no la inventa. Mientras, puede ejecutar lógica y pruebas locales autorizadas. Las muestras descargables de la sesión 1 no certifican las APIs de Safari.

## Cómo registrar la respuesta

La respuesta puede aprobar o modificar A/B/C y autorizar D en la misma indicación. Ejemplo de alcance, para que el propietario decida: «Apruebo A, B y C. Autorizo D para desarrollo local, commits, push y PR en borrador a staging; mantengo el merge humano». Esto es una propuesta de respuesta, no evidencia de consentimiento.

Se registra fecha, actor y alcance en ficha, registro técnico y plan, sin atribuir aceptación de producto a la autorización. Si ya hay más de un mantenedor, la indicación debe constar además en el PR de GitHub correspondiente según H-003; no se presume el número de mantenedores a partir de una lista de despliegue vacía.

## Evidencia de esta preparación

El contraste previo usó código/documentación actualizados de staging. Comprobaciones locales previas: Astro check, 343 unitarias, 9 de componentes y build correctos; sin E2E, CI ni teléfonos. Esta tarea solo añade documentación y enlaces de navegación: no instala dependencias ni implementa Plan B. La revisión documental se registra al terminar en el progreso de PB-01.

Revisión documental completada: enlaces y anchors válidos, textos ES/EN sin claves duplicadas ni parámetros distintos, doce criterios de aceptación y v05 original preservada. Los resultados locales detallados constan en PB-01; todos los estados propuestos siguen pendientes de aprobación.

## Fuente de la separación entre preparación y desarrollo

[AGENTS.md](../../AGENTS.md#estado-y-autorización) establece: «Si el proyecto está en definición, investigación o planificación, trabaja únicamente en esas actividades. No conviertas una propuesta en implementación». [PLANS.md](../PLANS.md#estados-y-autorización) distingue `Aprobado` de `Autorizado`. Por eso esta entrega prepara un paquete revisable antes de comenzar el código; no añade un ciclo de aprobación distinto al del repositorio.
