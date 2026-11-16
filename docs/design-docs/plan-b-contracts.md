# Plan B — propuestas de persistencia y exportación

**Fecha:** 2026-11-15. **Responsable de aprobación:** propietario de MiMiniApp (Alexander / Ale). **Estado de ambas decisiones:** `Propuesta`. El [registro técnico](index.md) es la fuente canónica de su aprobación. Aplicación propuesta únicamente a [Plan B v06](../product-specs/plan-b.md), dentro de [PB-01](../exec-plans/active/PB-01-plan-b.md).

El stack, las rutas genéricas, el registro modular, los temas y el alojamiento existentes ya están cubiertos por ADR-MMA-001/002/003/004/005/006/008/009/011/014/015/016/017/019. No se reabren para añadir esta herramienta. Las decisiones siguientes concretan persistencia y un contrato externo que la base no había aprobado para Plan B.

## ADR-MMA-020 — Estado temporal local de Plan B

**Propuesta:** `sessionStorage`, clave `miminiapp.plan-b.v1`, esquema validado y versionado; memoria como alternativa ante acceso fallido. Guarda paso, entradas, hora/días, ejemplo y fecha narrativa. Nunca guarda datos en URL, cookies, almacenamiento remoto ni `localStorage` del plan. No modifica la preferencia de apariencia ya aprobada.

* Recarga y navegación ES/EN conservan el progreso si la página carga y el almacenamiento funciona. Se descarta cualquier estado incompatible o inválido, sin interpolarlo como HTML.
* Reset elimina la clave propia y el estado en memoria. Si falla el borrado se informa; no se promete eliminación física garantizada ni que cerrar pestaña impida restauración del navegador.
* Con memoria sola, se avisa del límite de recarga/navegación antes de cambiar idioma. No se cambia el selector común ni se envían datos entre páginas por query/fragmento.
* No hay migración de usuarios existentes: la miniapp no existe. Una futura versión incompatible exige nueva evaluación de esquema/borrado; no se interpreta como autorización de historial o retención permanente.

| Alternativa | Efecto | Recomendación |
| --- | --- | --- |
| Solo memoria | Simple; recargar o cambiar idioma pierde todo. | No cumple el objetivo de recuperación. |
| `sessionStorage` con memoria ante fallo | Recuperación temporal y por pestaña, con límites explícitos. | Recomendada. |
| `localStorage` / IndexedDB | Retiene planes entre sesiones y aumenta expectativas de conservación/borrado. | Fuera de alcance inicial. |

Verificación: restauración válida/corrupta/incompatible, storage inaccesible y borrado fallido; equivalencia ES/EN con texto intacto; ausencia de otras claves y transmisiones. Los datos son accesibles a scripts del mismo origen: «local» no equivale a cifrado o almacenamiento secreto.

## ADR-MMA-021 — Exportaciones de Plan B y envío voluntario a Google

**Propuesta:** exportaciones locales `.ics` y PNG generadas con APIs del navegador; Google Calendar por enlace de plantilla tras consentimiento. Compartir herramienta solo con URL limpia; compartir PNG mediante el menú del SO puede entregar el plan al destino elegido. Sin API/OAuth, claves, SDK, servidor o biblioteca nuevos.

### Contrato de calendario

* Hora local flotante, inicio en primer día seleccionado desde mañana, duración de 15 minutos. La fecha se calcula al exportar; la historia del mes se mantiene estable por sesión.
* Cuatro apariciones por cada día seleccionado. Regla semanal `BYDAY`, `COUNT=4×n`, `WKST=MO`; sin `UNTIL`. Debe producir las mismas fechas en `.ics` y Google, con expectativas independientes.
* `.ics` conforme a [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545): contenedor de calendario, evento, alarma, UID/DTSTAMP, escapes TEXT, CRLF y plegado UTF-8. Véanse §§3.1, 3.3.10, 3.3.11, 3.6.1 y 3.6.6. `COUNT` evita el extremo inclusivo y la incompatibilidad DATE/DATE-TIME del `UNTIL` descrito en v05.
* No se prometen notificaciones efectivas, resolución uniforme de DST ni zona fija al viajar. Las pruebas registran zona del dispositivo y del calendario, y las vías admitidas deben conservar hora, duración y recurrencia.

### Destinos y control del usuario

| Acción | Datos y destino | Consentimiento / límite |
| --- | --- | --- |
| Mostrar plan / generar archivos | Memoria y archivos locales de navegador/dispositivo. | Acción explícita para guardar; no peticiones con el texto. |
| Añadir a Google Calendar | Situación, acción y propósito en parámetros de `calendar.google.com/calendar/render`. | Aviso antes de cada apertura; Cancelar no envía; URL/historial y almacenamiento de Google fuera del control de MiMiniApp. |
| Compartir herramienta | Texto promocional y URL de la miniapp del origen/idioma actual. | Nunca plan ni datos personales. |
| Guardar/compartir PNG | Imagen con situación y acción, al destino elegido en el menú nativo. | Nota visible de que contiene el plan; el destino externo puede recibirlo. |

Google se abre desde el gesto confirmado con `noopener noreferrer`, sin prefetch/preconnect, OAuth ni llamadas previas. Los parámetros se codifican con APIs de URL; no se concatena texto como HTML. La vía de plantilla es una integración externa a verificar: no se presume compatibilidad por construir un enlace válido. El consentimiento no implica que Google ya haya guardado el evento.

La alternativa Blob/download de `.ics`, las variantes iOS, compartir archivo y descarga de PNG se prueban en Safari iPhone y Chrome Android. La detección de capacidades precede a la detección de sistema; no se oculta una vía basándose solo en user-agent. No se exige conexión para abrir el menú de compartir o guardar localmente, aunque un destino externo puede exigirla.

| Alternativa | Consecuencia | Recomendación |
| --- | --- | --- |
| Solo `.ics` | Menos superficie externa; importación móvil todavía incierta. | Puede ser recorte si funciona en ambos teléfonos. |
| `.ics` + enlace Google con aviso | Dos vías sin cuentas propias, coste o dependencias. | Recomendada inicialmente; Google no cubre importación offline. |
| Integración API/OAuth o notificaciones propias | Autenticación, permisos y arquitectura adicionales. | Fuera de alcance. |

Errores/cancelaciones nunca destruyen el plan ni anuncian guardado sin evidencia. Las pruebas interceptan las salidas y usan datos sintéticos; no envían planes personales a Google. Una petición real de Google tras consentimiento es la excepción documentada al procesamiento local. Las pruebas generales de privacidad no se debilitan: se añaden escenarios propios que verifican esa acción concreta y mantienen el resto del recorrido sin envíos.

## Límites y condiciones de revisión

Estas propuestas no habilitan analítica, hosting nuevo, PWA, sincronización, cambios de política de movimiento, producción ni aprobación de un proveedor adicional. La dimensión fija del PNG, presupuesto propio y promesa offline son requisitos propuestos en la ficha; no alteran contratos de otras miniapps.

Cambiar el destino de datos, añadir una API, conservar planes entre sesiones, fijar zonas horarias con un mecanismo distinto o incorporar dependencias requiere revisar primero la decisión correspondiente. Un fallback mecánico entre las APIs locales ya descritas puede resolverse con evidencia dentro del plan; incumplir un requisito esencial no puede etiquetarse como fallback.

## Historial

| Fecha | Actor | Estado | Evidencia |
| --- | --- | --- | --- |
| 2026-11-15 | Codex | `Propuesta` | Preparación documental solicitada por el propietario; sin aprobación técnica ni ejecución. |
