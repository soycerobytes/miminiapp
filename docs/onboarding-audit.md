# Auditoría de transferencia documental

**Fecha:** 2026-11-04. **Repositorio:** `aalexlpez/miminiapp`. **Responsable de revisión:** propietario de MiMiniApp.

## Encargo y evidencia de origen

El usuario pide complementar el harness con el archivo aportado y dejar las skills como tarea pendiente para el final. Se preparan documentos de definición y planificación dentro de ese alcance; no se ejecutan como órdenes independientes los pasos del adjunto.

Se conserva una [copia fiel del dossier v1.2](references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md). Es una referencia histórica, no una fuente de autoridad que sustituya a `AGENTS.md` y sus documentos canónicos. Los acuerdos reportados por el dossier se señalan como tales; las propuestas abiertas no se elevan a decisiones aprobadas. La definición sigue en `Borrador` y las decisiones técnicas en `Propuesta` hasta formalización humana en su fuente correspondiente.

## Hechos observados

* Checkout existente: `/workspace/miminiapp`; rama de trabajo real `work`, HEAD inicial `88918d5b12876a0cd3d3dcb87472e7215c56216b`. La selección inicial del entorno fue `master`; eso no implica que la rama local de la tarea tenga ese nombre. No se renombra ninguna rama ni se crea un worktree.
* Árbol inicial limpio. El repositorio contiene el harness documental, sin aplicación, manifiestos, lockfiles, CI, pruebas de producto ni planes de implementación autorizados.
* La definición inicial era un borrador vacío y no había decisiones técnicas del producto registradas. H-001 es una decisión de gobierno heredada; no aprueba el stack de MiMiniApp.
* Solo se modifica la instancia MiMiniApp. No se consulta ni modifica el repositorio remoto del template como parte de esta transferencia.

## Mapa de destino

| Información del dossier | Fuente preparada | Estado y límite |
| --- | --- | --- |
| Propósito, usuarios, ritmo flexible, PROD/CAT, MVP y exclusiones | [Producto](product-specs/index.md) | Borrador; primera miniapp y cantidad inicial sin decidir |
| Stack, modelo client-first, hosting, testing, contribución y despliegue | [Registro técnico](design-docs/index.md) | 13 entradas técnicas en Propuesta; evidencia declarada y opciones aún abiertas separadas |
| Arquitectura sugerida, módulos, registro y rutas | [Arquitectura objetivo](design-docs/architecture-target.md) | Propuesta sin carpetas de aplicación creadas |
| Estado realmente existente | [ARCHITECTURE.md](../ARCHITECTURE.md) | Solo harness documental, sin atribuir infraestructura operativa |
| ES/EN, móvil/escritorio, accesibilidad, privacidad y calidad | [Frontend](FRONTEND.md), [seguridad](SECURITY.md), [calidad](QUALITY_SCORE.md), [fiabilidad](RELIABILITY.md) | Criterios y diseños futuros, sin resultados de aplicación |
| Ficha semanal de miniapp | [Plantilla funcional](product-specs/miniapp-template.md) | Plantilla sin seleccionar una miniapp |
| Política común y puentes de entrada | [AGENTS.md](../AGENTS.md), [CLAUDE.md](../CLAUDE.md), [GEMINI.md](../GEMINI.md) | Una sola política; compatibilidad de imports aún no probada en los otros clientes |
| Arranque sin skills y verificación por herramienta | [Bootstrap](BOOTSTRAP.md) | Procedimientos ordinarios como alternativa; sin instalar clientes ni skills |
| Iteraciones pequeñas, dependencias, evidencia y punto de parada | [PLANS.md](PLANS.md), [plantilla](exec-plans/_template.md), [H-002](harness-decisions.md#h-002--adaptación-documental-de-la-instancia-miminiapp) | Estados y autoridad humana preservados; H-002 aprobada expresamente para esta instancia el 2026-11-04 |
| Secuencia I-00 a I-06 | [Roadmap](roadmap.md), [plan I-00](exec-plans/completed/I-00-traslado-documental.md) | I-00 aceptada y archivada; autorización posterior limitada a commit local de I-00 y preparación del borrador I-01, sin ejecución ni pushes |
| Skills y asuntos diferidos | [Pendientes](exec-plans/tech-debt-tracker.md) | Skills al final por petición expresa; sin instalación o activación |

Los documentos `DESIGN.md`, `PRODUCT_SENSE.md` y `design-docs/core-beliefs.md` permanecen vacíos: no necesitan duplicar contenido que ya tiene otra fuente. No se añaden plantillas de CI, hooks o un validador permanente.

## Verificación y limitaciones

Esta tabla conserva la evidencia de la preparación inicial desde `/workspace/miminiapp`. La repetición sobre el árbol final y sus resultados actualizados se documentan en la revisión de cierre más abajo:

| Comprobación | Evidencia / resultado |
| --- | --- |
| Estado de partida, rama y commit | `git status --short`, `git branch --show-current`, `git rev-parse HEAD`: árbol inicialmente limpio, rama `work`, SHA indicado arriba. |
| Lectura de gobierno y fuentes | Revisados AGENTS, BOOTSTRAP, PLANS, plantilla, definición, decisiones e historial del harness, más el dossier completo por secciones. |
| Delta documental | `git diff --check` y revisión de `git diff`; sin código de producto, dependencias o automatizaciones. |
| Enlaces locales, imports, UTF-8 y fuente | Comprobación puntual con Python: 25 archivos Markdown UTF-8, 119 enlaces locales/anclas y 2 imports correctos; copia binariamente idéntica al adjunto. No se incorpora un script ni un check de CI al proyecto. |
| Integridad de Git | `git fsck --full`: comprobación local del checkout. |
| Escenarios de gobierno en Codex | Interpretación manual en esta sesión: Aprobado no permite implementar; skill ausente usa el procedimiento ordinario; API con secreto exige decisión y autorización; CI verde no autoriza al agente a fusionar; un acuerdo histórico requiere registro canónico. No equivale a iniciar una nueva sesión independiente de Codex. |
| Claude Code y Gemini CLI | `command -v claude` y `command -v gemini` no encuentran clientes. Carga de imports y respuestas de esos agentes **no verificadas**; no se instalan por esta tarea. |
| Aplicación, build, unitarias, E2E, accesibilidad y rendimiento | **No ejecutados:** todavía no existen aplicación ni comandos aplicables. Los nombres de scripts en calidad son objetivos, no scripts listos. |
| CI, protecciones, staging y producción | **No configurados ni probados por esta tarea**. No se han inspeccionado ajustes remotos ni se conocen URLs de despliegue. |

Los cinco escenarios de gobierno son una revisión semántica de la política, no una prueba automatizada ni demostración de seguridad. Los Markdown deben respaldarse con permisos reales cuando se autorice la infraestructura.

## Siguiente punto de decisión

El propietario ha aprobado expresamente H-002 sin modificaciones y el plan I-00, aceptado la limitación conocida de Claude Code/Gemini CLI para este alcance y autorizado exclusivamente las actividades pendientes de revisión, verificación y cierre documental el 2026-11-04. Se registran las transiciones actuales conforme a PLANS.md, sin efectos retroactivos sobre los documentos preparados anteriormente. Las comprobaciones de las actividades pendientes autorizadas terminaron correctamente y el plan pasó a Verificado. El propietario ha revisado y aceptado posteriormente el resultado: se registra Aceptado y se traslada a completed/ con fecha y actor actuales.

Aprobar toda la definición o resolver todos los ADR futuros no es requisito para cerrar un traslado documental en borrador. Sí habrá que aprobar la definición y las decisiones aplicables antes de implementar I-01, además de aprobar y autorizar su plan independiente. Licencia, dominio, primera miniapp, analítica, versiones, infraestructura y skills conservan sus pendientes explícitos. No se hacen commits ni pushes sin autorización del usuario.

## Revisión de cierre de I-00

**Registro histórico:** esta sección conserva la revisión realizada antes de la aprobación formal. Las referencias a Borrador y a decisiones pendientes describen aquel momento, no el estado actual. La aprobación y autorización posteriores y su verificación se registran en la sección final de este documento y en el Control del ExecPlan.

Revisión solicitada el 2026-11-04 para que el propietario pueda decidir la aceptación. Se contrasta todo el delta con el harness del commit `88918d5b12876a0cd3d3dcb87472e7215c56216b`, no con una supuesta versión remota distinta. La aprobación de los entregables y la del stack son actos distintos.

### Inventario completo del delta

Hay **14 archivos existentes modificados y 8 nuevos: 22 archivos Markdown**. Los ocho corresponden a los nuevos, no al total de archivos afectados. Se han revisado ambos grupos.

| Archivo | Tipo | Resultado de la revisión |
| --- | --- | --- |
| `AGENTS.md` | Modificado | Conserva fuentes y autoridad; lenguaje genérico y nota explícita de H-002 propuesta. |
| `ARCHITECTURE.md` | Modificado | Describe únicamente la realidad documental. |
| `README.md` | Modificado | Orienta a MiMiniApp y sus fuentes sin sustituirlas ni prometer implementación. |
| `docs/BOOTSTRAP.md` | Modificado | Mantiene aprobaciones; documenta imports, trabajo sin skills y límites; adaptación pendiente de ratificación. |
| `docs/FRONTEND.md` | Modificado | ES/EN, móvil/escritorio, demo, Intl, accesibilidad y metas, sin mediciones inventadas. |
| `docs/PLANS.md` | Modificado | Estados y tabla original preservados; bloque de iteraciones expresamente propuesto. |
| `docs/QUALITY_SCORE.md` | Modificado | Pruebas local/PR/staging/producción, scripts objetivo y reproducibilidad sin servicios de pago obligatorios para MVP. |
| `docs/RELIABILITY.md` | Modificado | Promoción del contenido probado, revisión humana, invalidación de evidencia, deploy automático futuro y rollback. |
| `docs/SECURITY.md` | Modificado | Privacidad, client-first, excepciones y mínimos privilegios; no presume controles remotos. |
| `docs/design-docs/index.md` | Modificado | Trece entradas técnicas, estados originales y procedencia; 013 deriva a gobierno. |
| `docs/exec-plans/_template.md` | Modificado | Campos adicionales de evidencia y parada sin duplicar estados; vigencia propuesta explícita. |
| `docs/exec-plans/tech-debt-tracker.md` | Modificado | Skills para el final y otros pendientes; ninguna tarea equivale a autorización. |
| `docs/harness-decisions.md` | Modificado | H-001 sin alteraciones; H-002 no aprobada por inferencia. |
| `docs/product-specs/index.md` | Modificado | Definición funcional y aceptación completas, sin selección de primera miniapp. |
| `CLAUDE.md` | Nuevo | Import mínimo, sin duplicación; ejecución no verificada. |
| `GEMINI.md` | Nuevo | Import mínimo, sin duplicación; ejecución no verificada. |
| `docs/design-docs/architecture-target.md` | Nuevo | Propuesta técnica separada de la implementación. |
| `docs/exec-plans/completed/I-00-traslado-documental.md` | Nuevo | Reconoce trabajo ya realizado y carencia de transiciones formales; criterios con evidencia. |
| `docs/onboarding-audit.md` | Nuevo | Procedencia, alcance, cobertura, inventario, comprobaciones y límites. |
| `docs/product-specs/miniapp-template.md` | Nuevo | Ficha sin producto inventado; incluye independencia y regresiones. |
| `docs/references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md` | Nuevo | Copia del adjunto como referencia, sin convertir sus instrucciones en autoridad. |
| `docs/roadmap.md` | Nuevo | Hitos informativos; no se prepara ni inicia I-01. |

### Cobertura del dossier

| Secciones de origen | Cobertura verificada y fuente |
| --- | --- |
| 0–2: encargo, límites, gobierno original | AGENTS, BOOTSTRAP, PLANS y esta auditoría preservan autoridad y separación de aprobaciones. |
| 3: portabilidad | Puentes mínimos y checklist de carga; límites Claude/Gemini registrados, sin afirmar compatibilidad efectiva. |
| 4: producto | Producto contiene PROD-01–14, propósito, usuarios, 11–15 horas, ritmo flexible, contenido, demo, ES/EN y exclusiones. |
| 5: técnica | Registro con ADR-001–012 y 014, remisión de 013 a gobierno y enlaces a detalles de arquitectura, seguridad, frontend, calidad y fiabilidad. |
| 5.1–5.3: módulos y ejecución | Arquitectura objetivo y seguridad cubren registro tipado, draft/published, rutas, client-first, APIs/backend excepcionales, SSR y límites del hosting. |
| 5.4: entrega | Fiabilidad cubre feature→staging→main, staging público aislado, automatización futura, árbol/artefacto validado, aceptación, cambios que invalidan promoción, secretos y recuperación. |
| 6: aceptación y pruebas | CAT-01–08, independencia, corrección, idiomas, privacidad, WCAG/CWV y capas de pruebas en sus guías. No se exige una suite inexistente como evidencia actual. |
| 7: ficha | Plantilla funcional disponible, sin elegir miniapp ni crear un segundo ciclo de aprobación. |
| 8: mejoras | H-002 y guías; skills, contribución pública e invariantes automatizados diferidos con límites. No se instala un validador, MCP o sistema de plugins. |
| 9: iteraciones | PLANS, plantilla y roadmap I-00–I-06; solo I-00 tiene plan y sigue Borrador. |
| 10: decisiones y pendientes | Se distinguen acuerdos reportados y candidatos: licencia, marca/dominio, primera miniapp, analítica, versiones/umbrales, CI/accesos y skills. |
| 11–11.1: contrato y preparación | Diseño de pruebas, promoción y entornos documentado; CI sin servicios de pago obligatorios para MVP. Ejecución real de pipeline, staging y producción pertenece a iteraciones futuras. |
| 12: referencias | Dossier íntegro como procedencia; documentos históricos citados no se presuponen disponibles ni necesarios para ejecutar esta revisión. |

No faltan funcionalidades principales ni decisiones descritas en el dossier en las fuentes canónicas y sus guías enlazadas. La cobertura es documental: versiones exactas, contratos finales, scripts ejecutables, URLs, credenciales, protecciones y resultados de aplicación siguen deliberadamente pendientes. No se consideran implementados ni se resuelven iniciando I-01.

### Hallazgos corregidos y límites de la conclusión

* Se hicieron explícitos independencia funcional entre miniapps, CI del MVP sin servicios de pago obligatorios y uso propuesto de Intl; estaban resumidos o implícitos.
* Se aclaró que H-002 está preparada en archivos para revisión, sin adquirir vigencia aprobada por ello. Las secciones nuevas no sustituyen el gobierno heredado mientras falte ratificación.
* Se corrigió la explicación de I-00: los entregables sí se escribieron y revisaron; lo pendiente es su ciclo formal, no la existencia del trabajo. La petición de revisión actual no se transforma en aprobación ni aceptación del resultado.
* El responsable por rol ya satisface la identificación exigida por AGENTS; no se exige un nombre legal adicional para cerrar este trabajo.

### Evidencia de la revisión actual

* `git diff --check`: correcto, sin errores de whitespace.
* `git fsck --full`: correcto, sin errores de integridad.
* Comparación puntual con Python contra HEAD: **17/17 comprobaciones correctas** sobre secciones de autoridad, fuentes, estados, tabla de transiciones, finalización, automatizaciones, H-001, criterios originales de aprobación y cobertura estructural PROD/CAT/ADR. Es complemento de la revisión semántica, no un validador permanente ni prueba de que los clientes obedecerán la política.
* Revisión semántica completa del dossier y delta, con contraste independiente de cobertura y de gobierno. No se detectan otras discrepancias materiales tras las correcciones indicadas.
* Comprobación final con Python: **25 archivos Markdown UTF-8, 122 enlaces/anclas locales y 2 imports correctos**; copia binariamente idéntica al adjunto, inventario de 14 modificados + 8 nuevos y HEAD de partida sin cambios. No se cuenta como prueba de aplicación.
* Claude Code y Gemini CLI siguen sin prueba de carga efectiva. Se acepta este criterio únicamente si se prueban o el propietario acepta expresamente la limitación.
* No hay código, scripts de producto, paquetes, CI, despliegues ni pruebas de aplicación ejecutadas. No se crea I-01, no se hacen commits ni pushes; HEAD permanece en el SHA de partida.

Los [criterios I00-AC-01–07](exec-plans/completed/I-00-traslado-documental.md#criterios-de-aceptación) muestran el cumplimiento documental y el pendiente entre clientes. La entrega está lista para revisión, pero no se declara I-00 formalmente Verificado ni Aceptado por cuenta del agente.

La verificación final se repitió el 2026-11-04 después de la indicación expresa del propietario «autorizo su verificación final». Resultados: git diff --check y git fsck --full correctos; 25 Markdown UTF-8, 122 enlaces/anclas, 2 imports y 17/17 invariantes correctos; copia idéntica al adjunto; delta de 14 archivos modificados y 8 nuevos, todos Markdown; HEAD sin cambios y único plan activo I-00. La revisión independiente confirma ausencia de defectos materiales nuevos. Claude Code y Gemini CLI siguen sin estar disponibles; no se acredita su carga efectiva ni se da por aceptada esa limitación.

Solo se actualizan este informe y el plan para reflejar la autorización y el resultado. La comprobación de cierre no instala, publica, crea I-01 ni realiza commits o pushes. La autorización de verificar se conserva separada de la aprobación del plan y de H-002 y de la aceptación del resultado.


## Adopción aprobada y verificación del cierre autorizado

**Registro histórico:** evidencia del paso a Verificado, anterior a la aceptación expresa posterior documentada en la sección final. Las restricciones de aquella autorización no se reinterpretan retroactivamente.

**Fecha:** 2026-11-04. **Actor de aprobación y autorización:** propietario de MiMiniApp, identificado por rol en el plan. **Alcance:** exclusivamente las actividades pendientes de revisión, verificación y cierre documental de I-00.

La indicación humana actual aprueba H-002 sin modificaciones conservando H-001 y la autoridad original, aprueba I-00, autoriza las actividades pendientes sin efectos retroactivos y acepta expresamente la limitación conocida de Claude Code y Gemini CLI. No acepta todavía el resultado final ni autoriza I-01, producto, commits o pushes.

Se han registrado secuencialmente Borrador → Aprobado → Autorizado → En curso, con fecha y actor reales. La transición a Verificado solo se registra después de comprobar los criterios. No se omite ningún estado ni se mueve el plan a completed/ antes de la aceptación humana.

La desviación de trazabilidad anterior se conserva en el objetivo, progreso e historial del ExecPlan y en la revisión histórica anterior: los documentos ya se habían preparado antes de la aprobación y autorización formales. La decisión actual permite únicamente el trabajo pendiente desde su recepción; no modifica esa evidencia ni inventa permisos anteriores.

**I00-AC-07:** satisfecho por la aceptación humana expresa de la limitación, no por haber ejecutado Claude Code o Gemini CLI. Su verificación efectiva permanece pendiente para una iteración posterior en PEND-002. Las skills siguen aplazadas al final en PEND-001.

La vigencia de H-002 se sincroniza en AGENTS, PLANS, BOOTSTRAP, plantilla, comentarios de los imports, README, roadmap y registro de gobierno. El contenido funcional de H-002 se adopta sin modificaciones. La definición de producto permanece Borrador y los ADR técnicos Propuesta: esta aprobación no cambia sus estados.

Las comprobaciones se han ejecutado de nuevo sobre los documentos sincronizados, después de registrar la aprobación, autorización e inicio actual. Resultados finales:

| Comprobación | Resultado |
| --- | --- |
| Invariantes originales de gobierno y cobertura PROD/CAT/ADR | 17/17 correctos, con H-001 y condiciones de transición originales conservadas. |
| Controles del cierre actual | 9/9 correctos: H-002 aprobada, secuencia sin saltos, estado vigente, sin aceptación atribuida, desviación conservada, AC07 por aceptación, PEND-002 retenido, producto/ADR sin aprobación nueva y alcance restringido. |
| Markdown UTF-8 y enlaces/anclas locales | 25 archivos y 122 destinos correctos. |
| Imports | 2 correctos; su contenido no acredita carga efectiva en clientes no ejecutados. |
| Dossier | Copia binariamente idéntica al archivo aportado. |
| git diff --check | Correcto, sin errores de whitespace. |
| git fsck --full | Correcto, sin errores de integridad. |
| Revisión semántica independiente | Sin defectos materiales nuevos; vigencia, estados, alcance y limitaciones consistentes. |
| Inventario / HEAD / planes | 14 archivos modificados y 8 nuevos, todos Markdown; HEAD original sin cambios; solo I-00 en active/. |
| Pruebas de producto y compatibilidad efectiva Claude/Gemini | No ejecutadas. Producto fuera del alcance; compatibilidad diferida con aceptación expresa de la limitación. |

Tras estos resultados se registra la transición En curso → Verificado con fecha y actor en el ExecPlan. I-00 permanece en active/ a la espera de aceptación expresa; no se marca Aceptado ni se presume completado su ciclo. El estado es revisable si aparece una corrección necesaria conforme a PLANS.md.

No se ejecuta código de producto, no se aprovisiona infraestructura y no se crea ni inicia I-01. No se hacen commits ni pushes. Las evidencias previas a la aprobación se mantienen históricas: la autorización actual no se extiende retroactivamente a ese trabajo.


## Aceptación expresa y archivo de I-00

**Fecha:** 2026-11-04. **Actor:** propietario de MiMiniApp. **Evidencia:** «He revisado el resultado de I-00 y acepto expresamente la iteración».

Se registra Verificado → Aceptado y se traslada el ExecPlan a docs/exec-plans/completed/I-00-traslado-documental.md. Se corrigen sus enlaces de entrada conservando la historia, los criterios y la desviación de trazabilidad. La compatibilidad efectiva Claude/Gemini permanece pendiente en PEND-002 y las skills siguen aplazadas al final en PEND-001.

La autorización nueva permite un commit local con los documentos de I-00, después de verificar el contenido staged. El inventario permitido es el conjunto documental ya revisado (14 archivos existentes modificados y 8 nuevos, incluido el plan en completed/); no se incluyen el adjunto externo al checkout, archivos temporales, código, dependencias ni el futuro borrador I-01. El SHA y contenido del commit se comprobarán con Git después de realizarlo. No se autoriza ningún push.

La autorización de preparar I-01 corresponde a una nueva actividad de planificación, posterior al commit de I-00. No cambia la aceptación histórica ni autoriza instalar dependencias, configurar servicios o ejecutar el plan siguiente. La definición del producto y los ADR conservan sus estados hasta la aprobación que corresponda.


### Revisión previa al commit local autorizado

El índice contiene únicamente los 22 documentos de I-00 aprobados en el inventario, con el ExecPlan en completed/. Todavía no existe el borrador I-01 ni se incluyen archivos temporales o ajenos.

Al revisar también los archivos nuevos en el índice, git diff --cached --check señala nueve líneas de la copia fiel del dossier (3–7 y 69–72) que terminan con exactamente dos espacios, usados como saltos de línea Markdown. Esos bytes ya estaban en el adjunto: se ha verificado que tanto la copia local como la staged son binariamente idénticas. Se conserva la referencia sin normalizarla. La comprobación staged excluyendo únicamente ese archivo pasa sin errores; se verifica además que no hay ninguna otra incidencia en la salida completa. Esta es una excepción documentada de formato del original, no un cambio de configuración de Git ni una modificación del dossier.

Las comprobaciones anteriores de git diff --check se referían al delta rastreado antes de staging, que no incluía la copia nueva. Esta revisión amplía la comprobación a todos los documentos nuevos antes de crear el commit y deja explícito ese límite de la evidencia anterior.
