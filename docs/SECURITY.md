# Seguridad y privacidad — límites y estado de aprobación

**Estado:** límites de producto y client-first aprobados mediante la definición y ADR-005/006 el 2026-11-04; política de calidad local aprobada en ADR-008. Las otras [decisiones](design-docs/index.md) y la infraestructura remota conservan sus pendientes. La fixture local está implementada: React renderiza texto escapado, valida la etiqueta y mantiene estado efímero sin persistencia ni APIs. Los E2E y el recorrido asistido con Chromium 156 fijado no detectan solicitudes externas ni errores relevantes de consola/red; I-01 Aceptado por el propietario el 2026-11-05. No hay controles remotos desplegados.
**Responsable:** propietario de MiMiniApp.

## Datos y ejecución

El alcance aprobado inicial no incluye cuentas, sesiones de producto, backend, bases de datos ni pagos. Las miniapps procesarán datos en el navegador por defecto, con `localStorage`/IndexedDB opcionales y justificados. Se debe explicar qué se guarda, cómo restablecerlo y, para datos de valor, evaluar exportación/importación; el almacenamiento del navegador no es copia de seguridad garantizada.

Cualquier API pública requiere aprobación individual y evaluación de CORS, condiciones, cuotas, datos transmitidos y costes. Un backend, servidor con secretos o almacenamiento remoto exige nueva decisión y plan autorizado. No se deduce permiso de una posible monetización futura. Analítica y trackers permanecen pendientes: no elegir proveedor ni activarlos por defecto.

Validar entradas no confiables, manejar errores y evitar inyección de HTML sin sanitización. Revisar licencias y riesgos de dependencias/recursos antes de incorporarlos. Las 14 unitarias y 9 pruebas de componentes pasan; los ocho E2E/axe requeridos pasan con Chromium 156.0.8078.4 / revisión 1248, separados en el informe de los bloqueos históricos. npm audit informa 0 altas/críticas y 11 moderadas de herramientas de desarrollo; se evalúan y registran en PEND-007 sin forzar cambios de majors.

## Credenciales y contribuciones

Nunca incluir secretos privados en frontend, Git, archivos de ejemplo, documentación, reportes o capturas. Las credenciales necesarias se proporcionan por mecanismos seguros y con mínimo privilegio. Antes de pedirlas, comprobar nombres y presencia de bindings existentes y la operación concreta; no copiar valores al chat.

Los PR de colaboradores externos ejecutarán verificaciones sin secretos de Cloudflare o producción y sin código no confiable en jobs privilegiados. Se propone separar validación de PR y despliegues desde ramas protegidas; permisos concretos, eventos de CI y aislamiento deben aprobarse y verificarse antes de activar los workflows. Un CI verde no autoriza al agente a aprobar su PR, fusionar o publicar.

## Entornos y permisos efectivos

Staging propuesto es público, separado de producción y sin datos privados. `noindex` y excluirlo del sitemap no aportan autenticación. Las normas de Markdown orientan el comportamiento; protección de ramas, permisos, aislamiento y secretos deben respaldarlas mediante controles reales.

El modelo propuesto de promoción y rollback se desarrolla en [fiabilidad](RELIABILITY.md). Actualmente no se han configurado ni verificado protecciones, Workers, tokens o dominios de aplicación. No se crea infraestructura por este documento.

## Excepción aprobada de apariencia — ADR-MMA-019

El 2026-11-09 el propietario aprueba exclusivamente `miminiapp.appearance` con los valores `light`, `dark`, `system`. Se valida lo leído como enumeración cerrada; no se interpola contenido almacenado en HTML/CSS. No se escribe por entrar en la web, solo por elegir explícitamente. Lectura y escritura están protegidas: sin almacenamiento funciona en memoria de la página, y en la siguiente navegación completa vuelve al sistema si no pudo persistir. Sistema explícito se conserva como preferencia, nunca como color resuelto. El control permite volver a Sistema; eliminar la clave también recupera ese comportamiento. Los orígenes staging/producción son independientes. No se transmiten datos, no hay cookies/telemetría ni persistencia de pausa, idioma o actividad. El script inicial inline no requiere cambios de CSP/hosting en este alcance.
