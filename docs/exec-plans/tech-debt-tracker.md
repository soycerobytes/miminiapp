# Pendientes y deuda accionable

Este registro conserva tareas pendientes; no equivale a un ExecPlan aprobado ni autoriza ejecución. Al existir un plan que cubra una tarea, enlázalo aquí sin duplicar su estado. Los asuntos de producto y las decisiones técnicas conservan sus fuentes canónicas.

## PEND-001 — Skills opcionales al final

* **Estado:** Pendiente, aplazada expresamente por el usuario el 2026-11-04.
* **Responsable:** Propietario de MiMiniApp.
* **Momento:** Al final de la preparación del flujo y después de estabilizar los procedimientos reales; no es un requisito para continuar sin skills.
* **Trabajo pendiente:** Evaluar si conviene reutilizar skills globales o incorporar skills del proyecto para implementar miniapps, revisar cambios o verificar releases. Decidir nombres, contenido y rutas solo entonces, a partir de evidencia de repetición.
* **Criterios de cierre:** Utilidad justificada; alcance y permisos mínimos aprobados; integración autorizada; ausencia de duplicación de normas; carga y funcionamiento comprobados en los clientes que se vayan a utilizar; ruta sin skills conservada. Ninguna skill fusiona ni publica por iniciativa propia.
* **Situación actual:** No se ha creado, instalado ni activado ninguna skill. Las skills genéricas mencionadas en el bootstrap no se presuponen disponibles.

## Otros pendientes

| ID | Pendiente | Condición para retomarlo / fuente |
| --- | --- | --- |
| PEND-002 | Comprobar la carga y los escenarios de gobierno en Claude Code y Gemini CLI; limitación conocida aceptada expresamente por el propietario para I-00 el 2026-11-04, comprobación todavía no realizada | En una iteración posterior aprobada y autorizada, cuando estén disponibles los clientes; [auditoría](../onboarding-audit.md) y [bootstrap](../BOOTSTRAP.md#comprobar-instrucciones-por-herramienta) |
| PEND-003 | Parcialmente resuelto el 2026-11-04: definición y ADR-001/002/003/005/006/008/015 aprobados; posteriormente aprobados ADR-011/016/017 para I-02. Las decisiones restantes permanecen pendientes para sus iteraciones | Aprobaciones en [producto](../product-specs/index.md) y [registro técnico](../design-docs/index.md); I-01 Aceptado y archivado el 2026-11-05; bloqueo PEND-006 resuelto |
| PEND-004 | Contribución pública: licencia, guía y plantillas de PR/issues | Resolver licencia/titular y autorizar el alcance correspondiente; [roadmap](../roadmap.md) |
| PEND-005 | Accesos e infraestructura de staging/producción | Preparar en las iteraciones correspondientes con permisos mínimos y valores seguros; [registro técnico](../design-docs/index.md) |

La base local está implementada y verificada. Los registros siguientes conservan el bloqueo de navegador ya resuelto y el seguimiento vigente de riesgos de desarrollo; no se declara un defecto funcional sin evidencia.


## PEND-006 — Navegador fijado de I-01 bloqueado por red

* **Estado:** Resuelto el 2026-11-04, con instalación y ejecución del navegador fijado acreditadas; I-01 fue Aceptado expresamente el 2026-11-05, sin eliminar sus otras deudas o limitaciones.
* **Evidencia histórica:** descarga de Chromium 156.0.8078.4 / revisión Playwright 1248 rechazada con HTTP 403 Domain forbidden al solicitar cdn.playwright.dev en la instancia anterior. Los diagnósticos Chromium 155 no sustituyen el navegador fijado.
* **Reanudación previa a publicación:** cdn.playwright.dev redirigía a storage.googleapis.com y ese destino recibía CONNECT 403. Instalador y verify exit 1, con ocho lanzamientos sin binario; evidencia conservada en .local/verification/resume-0cf778f/. Se guardó solo la adición exacta en el borrador, tras respuesta «si», sin publicación por el agente.
* **Cierre comprobado:** el propietario publicó el entorno y solicitó probar Playwright; permiso efectivo observed/enforced. Instalador oficial exit 0, Chromium y Headless Shell 156.0.8078.4/r1248; verify exit 0 con 14+9+8 casos sin omisiones, más revisión asistida visual/teclado correcta. Evidencia final en .local/verification/chromium-156/ y [el informe](../i01-execution-report.md#verificación-final-con-chromium-fijado). Los diagnósticos Chromium 155 no se usan para cerrar este pendiente. Sin nuevos commits/pushes, I-02 o publicación por el agente.

## PEND-007 — Seguimiento de incidencias moderadas de lint

* **Estado:** Pendiente de seguimiento, sin incumplir el umbral de altas/críticas aprobado.
* **Evidencia:** npm audit informa 11 moderadas por minimatch y dependientes de lint/TypeScript, 0 altas y 0 críticas. Los patrones no proceden de usuarios de la fixture y estas herramientas no se sirven en el build estático.
* **Acción:** evaluar una actualización compatible cuando el ecosistema la ofrezca y antes de ampliar a contribuciones no confiables; no aplicar audit fix --force o downgrades de majors sin aprobación material. Detalle e inventario de licencias en el informe de ejecución.

## PEND-008 — Movimiento suave y microinteracciones futuras

* **Estado:** Mejora solicitada el 2026-11-05 al aceptar I-02, retomada en la exploración Creative Playground. El 2026-11-08 el propietario aprueba la dirección visual y autoriza preparar [CP-01](completed/CP-01-creative-playground.md); el estado y progreso se consultan allí. ADR-MMA-018 y CP-01 aprobados posteriormente el mismo día; identidad estática aceptada e Iteración 2 autorizada posteriormente el 2026-11-08. Movimiento implementado, Verificado y Aceptado expresamente por el propietario el 2026-11-08 en CP-01; **PEND-008 resuelto** para el alcance acordado, sin implicar merge o despliegue. No es un defecto ni bloquea el cierre aceptado.
* **Responsable:** Propietario de MiMiniApp.
* **Alcance a revisar:** animación suave de flotación de la ilustración principal y posibles microinteracciones/transiciones adicionales, conservando la composición aceptada. Las transiciones funcionales breves ya existentes no se sustituyen ahora.
* **Accesibilidad y calidad:** respetar `prefers-reduced-motion`, suprimiendo movimiento decorativo y transiciones no esenciales cuando se solicite reducción; evitar cambios de layout, ocultación de información, interferencias con teclado/foco o pérdida de legibilidad en móvil, escritorio y vídeo.
* **Condición para implementar movimiento:** ADR-MMA-018/CP-01 aprobados; Iteración 1 aceptada e Iteración 2 autorizada; resultado/intensidad visual aceptados expresamente; la mejora queda cerrada. La evolución visual de ADR-MMA-017 ya está aprobada para M integrada y hero B, con pausa y reduced-motion, según [la decisión](../design-docs/creative-playground.md). No amplía I-02 o I-03; el cierre se limita a CP-01.
* **Criterios de cierre futuros:** comportamiento acordado, evidencia con movimiento normal/reducido, teclado, reflujo y rendimiento; revisión visual del propietario. El registro inicial no añadió movimiento; CP-01 implementa después la dirección aprobada sin dependencias nuevas, con su resultado aceptado expresamente el 2026-11-08.
