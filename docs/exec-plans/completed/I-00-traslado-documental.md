# I-00 — Traslado documental de MiMiniApp

## Control

* **Estado:** `Aceptado`
* **Responsable de aprobación, autorización y aceptación:** Propietario de MiMiniApp, por rol.
* **Creado:** 2026-11-04.
* **Última actualización:** 2026-11-04.
* **Autorización de verificación final:** Propietario de MiMiniApp, 2026-11-04, mediante «autorizo su verificación final»; comprobaciones realizadas y registradas.
* **Aprobación y autorización de cierre:** Propietario de MiMiniApp, 2026-11-04: aprueba este ExecPlan y autoriza exclusivamente las actividades pendientes de revisión, verificación y cierre documental. Sin efectos retroactivos sobre el trabajo anterior.
* **Aceptación final:** Propietario de MiMiniApp, 2026-11-04, mediante «He revisado el resultado de I-00 y acepto expresamente la iteración». Autoriza registrar Verificado → Aceptado y trasladar este ExecPlan a completed/.
* **Cierre:** Criterios satisfechos y resultado aceptado. La limitación Claude/Gemini permanece registrada en PEND-002 y las skills en PEND-001. La desviación de trazabilidad anterior se conserva sin efectos retroactivos.

## Objetivo y resultado esperado

Dejar una transferencia revisable y trazable del dossier v1.2 a las fuentes del harness de esta instancia. Los documentos se han elaborado y modificado materialmente por petición del usuario. El plan se redactó junto con esos entregables, sin haber registrado previamente su aprobación y autorización formales: esa carencia de trazabilidad no se corrige negando el trabajo realizado ni inventando transiciones retroactivas.

## Alcance

* Conservar el dossier como referencia y documentar el mapa de cambios y la realidad observada.
* Completar el borrador de definición, propuestas técnicas y guías especializadas con información del dossier.
* Preparar imports mínimos de instrucciones y una ruta de trabajo sin skills.
* Precisar iteraciones, pruebas y puntos de parada sin cambiar los estados del harness.
* Registrar skills como tarea para el final y otros bloqueos concretos.

## Exclusiones relevantes

Código de producto, paquetes o versiones instaladas, primera miniapp, creación/renombrado de ramas, pushes, PR, merges, pipelines, protecciones remotas, Workers, dominio, analítica y skills. No se modifica el repositorio del template original. Los commits estaban excluidos durante la ejecución y verificación; tras aceptar el resultado, el propietario autoriza expresamente un commit local de los documentos de I-00, previa comprobación de su alcance. Esa autorización actual no modifica las restricciones históricas ni permite pushes.

## Decisiones y fuentes aplicables

H-001 sigue siendo la decisión heredada aprobada. [H-002](../../harness-decisions.md#h-002--adaptación-documental-de-la-instancia-miminiapp) recoge la adaptación aprobada expresamente por el propietario el 2026-11-04 para esta instancia. Las propuestas del [registro técnico](../../design-docs/index.md) no autorizan instalar el stack. Las reglas de estado siguen en [PLANS.md](../../PLANS.md).

## Cuestiones pendientes

* No quedan decisiones de aceptación pendientes de I-00: el propietario ha aceptado expresamente el resultado verificado. La definición y los ADR técnicos conservan sus estados y deberán aprobarse cuando corresponda antes de implementar I-01.
* Verificación efectiva de los imports y escenarios en Claude Code y Gemini CLI, diferida a una iteración posterior bajo PEND-002. El propietario acepta expresamente la limitación conocida para I-00; no se declara esa verificación realizada.
* Licencia, dominio, analítica, versiones, CI concreto y accesos permanecen en sus fuentes de producto/técnica.

## Trabajo previsto para la revisión

1. Revisar la [auditoría y mapa documental](../../onboarding-audit.md) y el origen de cada requisito.
2. Confirmar los estados, responsables y pendientes sin atribuir aprobaciones al adjunto.
3. Revisar el delta y corregir las inconsistencias documentales dentro del alcance solicitado.
4. Completar las comprobaciones por herramienta que puedan ejecutarse y registrar las restantes.
5. Registrar las transiciones aprobadas y autorizadas con fecha y actor; verificar las actividades pendientes y entregar evidencia en estado Verificado para aceptación, sin iniciar I-01.

## Entorno y herramientas

Checkout existente `/workspace/miminiapp`; Git y lectura/edición de Markdown. Python del entorno puede utilizarse para una comprobación puntual de enlaces sin añadir dependencias, tests de producto ni un validador permanente. No hacen falta secretos ni servicios remotos para este trabajo documental.

## Criterios de aceptación

La [auditoría de cierre](../../onboarding-audit.md#revisión-de-cierre-de-i-00) conserva el inventario completo, la cobertura y las comprobaciones actuales. Los resultados documentales y la limitación aceptada fundamentaron Verificado; la posterior aceptación expresa del propietario fundamenta ahora Aceptado. Se conservan las evidencias de cada paso.

| ID | Criterio | Evidencia y situación |
| --- | --- | --- |
| I00-AC-01 | Requisitos localizables en fuentes canónicas y enlazadas, con procedencia y pendientes explícitos. | **Cumplido documentalmente:** PROD-01–14, CAT-01–08, 13 ADR técnicos y remisión de ADR-013 a gobierno; contraste de todas las secciones del dossier. |
| I00-AC-02 | Política común sin duplicación; gobierno original y sus atribuciones preservados. | **Cumplido documentalmente:** revisión de los 22 archivos y comparación de invariantes con HEAD original. H-002 aprobada por indicación expresa del propietario el 2026-11-04, conservando H-001 y las reglas originales de autoridad. |
| I00-AC-03 | Definición, decisiones, aprobación del plan, autorización y aceptación separados. | **Cumplido documentalmente:** definición Borrador, ADR Propuesta, H-001 intacta, estados y transiciones originales conservados; aprobación y autorización actual de I-00 registradas sin efectos retroactivos; aceptación final expresamente registrada en el Control y en el historial. |
| I00-AC-04 | Arquitectura real separada del objetivo y verificaciones futuras no presentadas como ejecutadas. | **Cumplido documentalmente:** ARCHITECTURE describe solo el harness; objetivo y guías indican ausencia de aplicación, CI y despliegues comprobados. |
| I00-AC-05 | Skills al final y primera miniapp sin elegir. | **Cumplido:** PEND-001 y definición; no hay skills ni miniapps creadas. |
| I00-AC-06 | Enlaces, imports, integridad y delta revisados. | **Cumplido documentalmente:** enlaces/anclas UTF-8, imports exactos, copia del dossier, git diff --check y git fsck --full; resultados actuales en auditoría. |
| I00-AC-07 | Los tres clientes interpretan el gobierno coherentemente o el propietario acepta expresamente la limitación de los clientes no disponibles. | **Cumplido por aceptación expresa de la limitación:** el propietario acepta el 2026-11-04 que Claude Code y Gemini CLI no tengan compatibilidad efectiva verificada. Imports revisados estáticamente; comprobación real pendiente en PEND-002 para una iteración posterior. |

El propietario ha aprobado este plan y H-002, aceptado la limitación de I00-AC-07 y autorizado exclusivamente las actividades pendientes de cierre. Tras la verificación ha aceptado expresamente el resultado conforme a PLANS.md, con fecha y actor registrados; no se deduce la aceptación de una autorización anterior. El responsable está identificado por rol, suficiente según AGENTS.md; un nombre legal no es bloqueo de I-00. No hace falta resolver ahora licencia, dominio, primera miniapp, analítica, versiones o credenciales de infraestructura.

## Pruebas a crear o modificar

No aplica batería de producto: solo documentación. No se añaden tests triviales ni automatizaciones permanentes. Las comprobaciones de aplicación, CI y despliegue corresponden a futuras iteraciones autorizadas.

## Verificaciones y evidencia

La [auditoría](../../onboarding-audit.md#revisión-de-cierre-de-i-00) registra cobertura, revisión del delta y comprobaciones realmente ejecutadas. La verificación final autorizada ha terminado correctamente: 25 Markdown UTF-8, 122 enlaces/anclas, 2 imports, 17/17 invariantes, copia del dossier idéntica, git diff --check y git fsck --full correctos. La revisión semántica independiente no detecta defectos materiales nuevos. No hay pruebas de aplicación ejecutadas porque todavía no existe.

La verificación anterior se efectuó cuando el plan seguía Borrador y se conserva como evidencia histórica. Tras la aprobación y autorización actuales se ha ejecutado de nuevo la revisión y verificación de las actividades pendientes: todos los criterios I00-AC-01–07 están satisfechos, el séptimo por aceptación expresa de la limitación conocida. Se registra `Verificado` con fecha 2026-11-04 tras superar 17/17 invariantes originales, 9/9 controles del cierre, 25 Markdown UTF-8, 122 enlaces/anclas, 2 imports, copia idéntica del dossier, git diff --check y git fsck --full. La revisión independiente no detecta defectos materiales. En aquella verificación no se reescribió ni se legitimó retroactivamente el trabajo anterior y el plan se mantuvo Verificado; la aceptación se recibe y registra posteriormente en la indicación humana de cierre.

## Riesgos y recuperación

Riesgo principal: confundir decisiones históricas reportadas con aprobaciones canónicas, o políticas escritas con barreras técnicas ya activas. No hay infraestructura que revertir. Cualquier corrección debe limitarse al delta propio, preservando los archivos y cambios del usuario.

## Punto de parada

Plan cerrado como Aceptado y conservado en completed/. La nueva petición del propietario autoriza únicamente preparar el borrador independiente de I-01, no ejecutarlo, instalar dependencias o configurar servicios externos. No realizar pushes. Las futuras correcciones siguen PLANS.md y no reabren este plan aceptado.

## Progreso

Las siguientes notas conservan la secuencia histórica anterior a la aprobación formal. No se reescriben como autorizaciones pasadas ni se confunden con el estado actual de Control.

Entregables documentales ya escritos y revisados a petición del usuario. En la revisión de cierre se han corregido tres precisiones de cobertura (independencia funcional entre miniapps, CI del MVP sin servicios de pago obligatorios y formato con Intl) y se ha aclarado la vigencia propuesta de H-002. Se ha revisado todo el delta, no solo los ocho archivos nuevos. No se declara completado el ciclo formal del plan ni aceptado su resultado.

El usuario ha pedido cerrar I-00 y revisar sus evidencias antes de decidir su aceptación. Esa petición autoriza esta revisión y sus correcciones documentales; no se registra como aprobación, autorización formal del plan, aceptación, permiso de commit/push ni inicio de I-01.

Posteriormente el propietario autorizó expresamente la verificación final. Se han repetido todas las comprobaciones documentales y la revisión independiente, sin fallos. La autorización se registra con su alcance real, sin convertirla en aprobación del plan, ratificación de H-002 o aceptación de la limitación entre clientes. HEAD permanece en `88918d5b12876a0cd3d3dcb87472e7215c56216b`; no hay commits, pushes ni I-01.

A partir de la aprobación expresa de H-002 y del plan y la autorización exclusivamente documental se han registrado Borrador → Aprobado → Autorizado → En curso → Verificado. Se han sincronizado la vigencia y los pendientes, repetido las comprobaciones y contrastado todos los criterios con sus evidencias. El criterio entre clientes se satisface por la limitación expresamente aceptada, manteniendo su comprobación futura. Sin efectos retroactivos; este fue el punto de entrega Verificado previo a la aceptación final, recibida posteriormente.

El propietario ha revisado y aceptado ahora expresamente la iteración. Se registra Verificado → Aceptado con fecha y actor actuales y se traslada el plan a completed/. La autorización posterior de commit local queda limitada a I-00; la preparación de I-01 será un borrador independiente no aprobado ni autorizado para ejecución.

## Historial de estado

| Fecha | Estado | Actor | Evidencia o motivo |
| --- | --- | --- | --- |
| 2026-11-04 | `Borrador` | Codex | Creación del borrador y preparación documental solicitada; sin aprobación ni autorización del plan. |
| 2026-11-04 | `Borrador` | Codex | Revisión de cierre solicitada por el usuario: cobertura y delta completos, precisiones documentales corregidas y evidencia presentada. No es una transición de estado ni una aprobación humana. |
| 2026-11-04 | `Borrador` | Propietario de MiMiniApp / Codex | El propietario autoriza «su verificación final»; Codex la ejecuta con resultados correctos. Se registra la autorización de comprobación sin inventar aprobación del plan o de H-002, aceptación del resultado ni transición de estado. |
| 2026-11-04 | `Aprobado` | Propietario de MiMiniApp | «Apruebo el ExecPlan I-00». Se aprueba H-002 sin modificaciones y se acepta la limitación Claude/Gemini. La desviación previa se conserva; no hay efectos retroactivos. |
| 2026-11-04 | `Autorizado` | Propietario de MiMiniApp | «Autorizo exclusivamente las actividades pendientes de revisión, verificación y cierre documental». No autoriza I-01, código de producto, commits o pushes ni acepta el resultado. |
| 2026-11-04 | `En curso` | Codex | Inicio de las actividades pendientes autorizadas: registro de decisiones actuales, sincronización de vigencia, pendientes y evidencias, y ejecución de comprobaciones de cierre. |
| 2026-11-04 | `Verificado` | Codex | Actividades pendientes de cierre terminadas y criterios I00-AC-01–07 comprobados: 17/17 invariantes, 9/9 controles de cierre, enlaces/imports/copia correctos, git diff --check y git fsck --full correctos, revisión independiente sin defectos. AC07 satisfecho por limitación expresamente aceptada, comprobación efectiva diferida. Resultado pendiente de aceptación humana. |
| 2026-11-04 | `Aceptado` | Propietario de MiMiniApp | «He revisado el resultado de I-00 y acepto expresamente la iteración». Autoriza registrar la aceptación, trasladar a completed/ y realizar un commit local de los documentos de I-00 previa comprobación de alcance. Se conservan la desviación anterior y los pendientes. Solo autoriza preparar el borrador independiente I-01; no ejecutarlo, instalar, configurar servicios ni hacer pushes. |
