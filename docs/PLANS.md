# Planificación y ejecución

## Propósito

Convertir objetivos y decisiones aprobadas en trabajo ejecutable y verificable, sin exigir un plan formal para cada tarea.

## Cuándo crear un plan

Un proyecto nuevo requiere un ExecPlan inicial aprobado y autorizado antes de comenzar a codificar.

Los trabajos amplios, arriesgados, ambiguos o que afecten varias partes del sistema deben documentarse como ExecPlans. Las tareas pequeñas y claras pueden gestionarse sin un plan persistente conforme a las instrucciones globales.

Además del ExecPlan inicial, crea un ExecPlan cuando el trabajo no esté ya cubierto por otro plan autorizado y concurra al menos una de estas condiciones:

* afecta a varios subsistemas o requiere etapas coordinadas;
* introduce una migración de datos o un cambio difícil de revertir;
* modifica seguridad, permisos, despliegue o un contrato compartido o externo;
* incorpora o sustituye una dependencia, tecnología o servicio relevante;
* contiene incertidumbre capaz de cambiar materialmente el alcance, el comportamiento o la verificación;
* necesita verificaciones separadas para demostrar un resultado coherente.

El número de archivos o líneas modificadas no determina por sí solo la necesidad de un plan. Una tarea puede gestionarse sin ExecPlan cuando sea localizada, reversible, verificable en un ciclo corto y esté completamente cubierta por el alcance y las decisiones aprobadas. En caso de duda, utiliza el riesgo, la coordinación y el coste de reversión como criterios de desempate.

## Iteraciones de MiMiniApp

**Vigencia:** adaptación documental H-002 aprobada expresamente por el propietario de MiMiniApp el 2026-11-04 para esta instancia. Se conservan H-001, la autoridad humana y las reglas y transiciones heredadas del resto de este documento. Su adopción no tiene efectos retroactivos.

Esta instancia organiza el trabajo en iteraciones pequeñas y secuenciales, con un resultado observable coherente por ExecPlan. El [roadmap](roadmap.md) orienta; no autoriza ejecución ni sustituye el estado de cada plan. La adaptación documental se registra en [H-002](harness-decisions.md#h-002--adaptación-documental-de-la-instancia-miminiapp).

Cada iteración explicita dependencias, alcance y exclusiones, criterios de aceptación, verificaciones y evidencia. Si el resultado no puede abordarse en una sesión o secuencia corta razonable, debe dividirse antes de autorizarlo. Añade riesgos y rollback cuando afecte a datos, despliegues u operaciones con efectos persistentes.

Las iteraciones de producto incluyen las pruebas automatizadas que deban crearse o actualizarse; una iteración exclusivamente documental puede verificarse mediante revisión de coherencia y enlaces, sin inventar pruebas de aplicación. Los comandos que todavía no existen se identifican como objetivos futuros.

Se recomienda mantener una sola iteración de implementación autorizada o en curso a la vez. Pueden prepararse borradores futuros sin ejecutarlos. Al terminar, registra `Verificado` solo si se cumplen las condiciones canónicas y entrega la evidencia para aceptación humana. No comiences la siguiente iteración hasta que la anterior haya sido aceptada por el responsable; además, la siguiente requiere su propia aprobación y autorización. Si la anterior se cancela, el responsable debe revisar expresamente las dependencias y el alcance antes de autorizar cualquier continuación. Las correcciones locales dentro de la iteración siguen los criterios existentes y no necesitan planes redundantes.

## Contenido de un plan

Un plan no trivial debe indicar:

* Responsable de aprobación.
* Fecha de creación y última actualización.
* Objetivo y resultado esperado.
* Alcance y exclusiones relevantes.
* Decisiones aprobadas que debe respetar.
* Cuestiones pendientes que bloquean o condicionan el trabajo.
* Etapas o tareas necesarias.
* Entorno y herramientas necesarios para preparar, ejecutar, observar, verificar y restablecer el sistema.
* Criterios de aceptación.
* Verificaciones previstas.
* Estado conforme al ciclo definido en este documento.
* Historial breve de los cambios de estado, con fecha y actor.

No es necesario rellenar apartados que no aporten información útil.

El ExecPlan inicial debe incluir la activación descrita en `docs/BOOTSTRAP.md`. Sus pasos de configuración o scaffolding también requieren que el plan alcance el estado `Autorizado`; preparar el entorno no autoriza por sí mismo el desarrollo posterior.

## Estados y autorización

Todo ExecPlan debe mostrar un único estado actual entre los siguientes:

1. `Borrador`: propuesta editable; no autoriza implementación.
2. `Aprobado`: el responsable acepta el plan; todavía no autoriza implementación.
3. `Autorizado`: el responsable permite comenzar su ejecución.
4. `En curso`: el agente ha comenzado a ejecutar el plan autorizado.
5. `Verificado`: el resultado se ha contrastado con los criterios de aceptación y se ha registrado la evidencia.
6. `Aceptado`: el responsable acepta el resultado verificado.
7. `Cancelado`: el responsable decide cerrar el plan sin aceptar su resultado; debe registrarse el motivo.

El agente puede crear y modificar borradores, registrar el avance a `En curso` o `Verificado` cuando exista evidencia y reflejar los retornos de estado definidos más adelante. Solo el responsable identificado en el ExecPlan puede aprobarlo, autorizar su ejecución, aceptar el resultado o cancelarlo; el agente puede reflejar esos cambios de estado después de recibir una indicación explícita.

La indicación humana puede originarse en una conversación, issue u otro canal, pero debe reflejarse en el ExecPlan con fecha y actor. El campo de estado actual del ExecPlan es la fuente canónica. No es necesario copiar la conversación ni crear un commit específico para que la transición sea válida.

La presencia de un archivo en `docs/exec-plans/active/` no implica que esté aprobado o autorizado. La aprobación tampoco implica autorización. Si aparece una decisión técnica nueva o un cambio de alcance durante la ejecución, debe solicitarse aprobación antes de continuar por ese camino.

## Condiciones de transición

Las siguientes condiciones son invariantes del estado declarado. No sustituyen el juicio del responsable sobre la calidad o conveniencia del trabajo.

| Transición | Condiciones mínimas |
| --- | --- |
| `Borrador` → `Aprobado` | El responsable, objetivo, resultado, alcance, decisiones aplicables, criterios de aceptación y verificaciones están definidos con precisión suficiente; las cuestiones que impedirían ejecutar el plan están resueltas o identificadas como bloqueo. El responsable aprueba expresamente el contenido del plan, aunque un bloqueo declarado todavía pueda impedir autorizarlo. |
| `Aprobado` → `Autorizado` | El plan y sus decisiones aplicables siguen vigentes, no existe un bloqueo que impida comenzar y el responsable autoriza expresamente la ejecución. |
| `Autorizado` → `En curso` | El agente o el equipo ha comenzado trabajo incluido en el plan y registra la fecha o evidencia inicial en el historial. |
| `En curso` → `Verificado` | El trabajo previsto está terminado dentro del alcance, los criterios de aceptación aplicables se han comprobado y el plan registra evidencia, limitaciones y verificaciones no realizadas. Una comprobación material fallida impide declarar este estado. |
| `Verificado` → `En curso` | Se detecta, o el responsable determina, que el resultado necesita correcciones dentro del alcance ya autorizado o evidencia adicional antes de aceptarse. Se registra el motivo y se repiten las verificaciones afectadas; no requiere nueva autorización mientras no cambien materialmente el plan ni sus decisiones. |
| `Verificado` → `Aceptado` | El responsable revisa el resultado y la evidencia, acepta expresamente la entrega y las limitaciones o deudas pendientes quedan registradas cuando corresponda. |
| Cualquier estado no terminal previamente aprobado → `Borrador` | El responsable aprueba un cambio material del objetivo, alcance, criterios de aceptación o decisiones aplicables. El agente registra el retorno y el plan requiere nueva aprobación y autorización antes de ejecutar el alcance modificado. |
| Cualquier estado no terminal → `Cancelado` | El responsable cancela expresamente el plan y se registra el motivo, el trabajo incompleto y cualquier efecto que deba conservarse. |

Cada transición debe actualizar el estado actual, la fecha de última actualización y el historial de estado. Una corrección editorial o un detalle mecánico cubierto por el plan no invalida su estado.

Una verificación fallida mantiene el plan `En curso`; se registra el fallo, se corrige dentro del alcance autorizado y se repite la comprobación afectada. Si aparece un bloqueo temporal durante la ejecución, se registra en `Progreso` sin crear un estado adicional y el trabajo no afectado puede continuar. Si el trabajo ya no debe reanudarse, el responsable cancela el plan.

Después de `Aceptado` el plan permanece cerrado para conservar la historia. Un defecto posterior se trata como una nueva corrección, con un nuevo ExecPlan solo si cumple los criterios de este documento; no se reabre ni se reescribe la aceptación anterior.

## Progreso

Los planes que no estén `Aceptados` ni `Cancelados` se conservan en `docs/exec-plans/active/`. Deben reflejar el estado y el progreso reales, los bloqueos relevantes y los cambios aprobados.

No es necesario registrar cada acción mecánica.

No se aplica una caducidad automática. Antes de reanudar un plan cuya última actualización ya no represente claramente el estado del repositorio, comprueba que su objetivo, alcance y decisiones siguen vigentes y actualiza el plan. Si el trabajo ya no debe continuar, propone su cancelación al responsable en lugar de dejarlo indefinidamente `En curso`.

## Finalización

Un plan cumple su objetivo únicamente cuando alcanza el estado `Aceptado`. Los planes `Aceptados` y `Cancelados` están cerrados y se conservan en `docs/exec-plans/completed/`; un plan cancelado no se presenta como trabajo completado ni verificado.

Las decisiones duraderas surgidas durante el trabajo deben quedar registradas en `docs/design-docs/index.md` y, cuando necesiten desarrollo propio, documentadas en `docs/design-docs/`. La deuda técnica accionable se registra en `docs/exec-plans/tech-debt-tracker.md` cuando corresponda.

## Automatizaciones

Los procedimientos de verificación, revisión o entrega podrán automatizarse cuando el responsable lo apruebe. Este documento no autoriza su activación.
