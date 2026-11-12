# AGENTS.md

## Contexto

Este repositorio utiliza un harness de desarrollo controlado. Las instrucciones globales del agente de IA utilizado y las skills disponibles siguen aplicándose. AGENTS.md es la fuente compartida para Codex, Claude Code y Gemini CLI; CLAUDE.md y GEMINI.md solo la importan, sin duplicar normas. Este archivo añade las reglas específicas de gobierno del proyecto.

La adaptación documental H-002 está `Aprobada` para esta instancia por indicación expresa del propietario el 2026-11-04, registrada en `docs/harness-decisions.md`. Se conserva H-001 y la autoridad original del harness. La aprobación no tiene efectos retroactivos ni aprueba decisiones técnicas del producto o activa automatizaciones.

## Fuentes canónicas

* `docs/product-specs/index.md`: definición, alcance y estado del proyecto.
* `docs/design-docs/index.md`: decisiones técnicas del proyecto, vigentes o propuestas.
* `ARCHITECTURE.md`: mapa de la arquitectura real y aprobada.
* `docs/harness-decisions.md`: historial y justificación de las decisiones que modifican el gobierno del harness; no contiene decisiones técnicas del producto.
* `docs/BOOTSTRAP.md`: procedimiento para activar una nueva instancia y preparar sus capacidades.
* `docs/PLANS.md`: reglas de planificación, estados y transiciones.
* `docs/exec-plans/_template.md`: estructura mínima para crear un ExecPlan sin duplicar sus reglas.
* `docs/exec-plans/active/`: planes que todavía no han alcanzado un estado terminal.
* `docs/exec-plans/completed/`: planes cerrados como `Aceptado` o `Cancelado`.
* `docs/`: documentación específica que se consulta y completa solo cuando resulte aplicable.

Cada ExecPlan es la fuente canónica de su propio estado y progreso. Un ExecPlan aplica la definición y las decisiones aprobadas, pero no puede redefinirlas; un cambio material debe actualizar primero la fuente del dominio afectado. `docs/design-docs/index.md` conserva la decisión técnica aprobada y `ARCHITECTURE.md` describe cómo está implementada actualmente. Una diferencia entre ambos es una inconsistencia que debe resolverse, no una autorización implícita para alterar uno de ellos.

`README.md` orienta y `docs/BOOTSTRAP.md` ordena la activación; ninguno modifica los estados, autorizaciones o decisiones definidos en las fuentes anteriores. Este archivo establece la autoridad general y dirige hacia la fuente especializada. Si un resumen difiere de la fuente canónica de su dominio, prevalece esta última.

Consulta únicamente los documentos relevantes para la tarea. No cargues toda la documentación por defecto.

## Autoridad

El responsable humano correspondiente aprueba las decisiones técnicas, los cambios de alcance, los planes, la autorización para implementarlos, la aceptación de sus resultados, su cancelación y la activación de automatizaciones.

Una decisión técnica nueva es una elección duradera que establece o modifica el stack, la arquitectura, las dependencias relevantes, los contratos compartidos, la persistencia, la seguridad, el despliegue o los invariantes del proyecto. Los detalles locales y mecánicos cubiertos por decisiones existentes no son decisiones técnicas nuevas.

Los criterios prácticos y la regla de desempate para clasificar una elección se definen en `docs/design-docs/index.md`.

Puedes investigar, comparar alternativas y recomendar soluciones. No adoptes una decisión técnica nueva sin aprobación, aunque sea de bajo impacto o reversible, si no está cubierta por una decisión o convención previamente aprobada.

Una decisión técnica del proyecto solo está aprobada si figura expresamente con ese estado en `docs/design-docs/index.md`. Una decisión sobre el gobierno del harness se registra en `docs/harness-decisions.md`. Su mera presencia en cualquier otro documento no implica aprobación.

Una indicación humana expresada en una conversación, issue u otro canal debe reflejarse en el artefacto correspondiente para convertirse en estado durable. El estado actual registrado en la definición, el registro de decisiones correspondiente o el ExecPlan es la fuente canónica; la conversación y el historial Git son evidencia, no sustitutos.

La autorización de un plan permite realizar sus pasos mecánicos dentro del alcance y las decisiones aprobadas. Si aparece una decisión pendiente o un cambio de alcance, detén el trabajo afectado y solicita aprobación. Puedes continuar con trabajo independiente ya autorizado.

Registra las decisiones que deban permanecer como conocimiento del proyecto. No es necesario documentar permanentemente cada elección local.

## Responsables

Cada artefacto identifica por nombre o rol a la persona con autoridad para aprobarlo: la definición identifica a su responsable, cada decisión técnica al suyo y cada ExecPlan a quien puede aprobarlo, autorizarlo, aceptar su resultado o cancelarlo. La misma persona puede asumir varios de estos papeles.

Cuando intervengan responsables distintos, el campo del artefacto afectado determina quién decide. Si ese responsable todavía no está identificado, el artefacto no puede superar un estado que requiera aprobación humana. El agente puede preparar propuestas, ejecutar trabajo autorizado y registrar evidencia, pero no sustituye esa aprobación.

## Estado y autorización

Antes de implementar, consulta la definición del proyecto, las decisiones técnicas relevantes y el plan aplicable.

Si el proyecto está en definición, investigación o planificación, trabaja únicamente en esas actividades. No conviertas una propuesta en implementación.

Un proyecto nuevo requiere una definición aprobada, las decisiones técnicas necesarias aprobadas, un plan aprobado y autorización expresa para ejecutarlo. La ubicación o existencia de un documento no sustituye esos estados.

## Ejecución

Utiliza las instrucciones globales y las skills existentes para ejecutar, verificar y revisar el trabajo. No dupliques sus procedimientos.

Respeta las decisiones y convenciones vigentes. Si una tarea requiere cambiarlas, presenta la propuesta antes de continuar.

## Acciones externas

No configures ni actives automatizaciones por iniciativa propia.

## Mantenimiento del conocimiento

Actualiza la documentación cuando cambie la realidad que describe. Mantén este archivo como un mapa breve; coloca el conocimiento específico en los documentos correspondientes.

Si una limitación recurrente impide observar, ejecutar o verificar el sistema, trátala como una capacidad ausente: registra la evidencia y propone una herramienta, comando, prueba o documento reutilizable. No incorpores la solución sin la aprobación que corresponda.
