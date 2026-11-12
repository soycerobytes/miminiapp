# Activación de un nuevo proyecto

## Propósito

Convertir una copia de este template en un proyecto definido y en un entorno que el agente de IA pueda preparar, ejecutar, observar y verificar de forma reproducible. Este procedimiento no autoriza decisiones técnicas, implementación ni automatizaciones.

La activación se completa de forma progresiva. No se crean herramientas, documentos o configuraciones que todavía no respondan a una necesidad real del proyecto.

Las adaptaciones multiherramienta y de trabajo sin skills se adoptan bajo [H-002](harness-decisions.md#h-002--adaptación-documental-de-la-instancia-miminiapp), aprobada expresamente por el propietario el 2026-11-04. La compatibilidad efectiva con Claude Code y Gemini CLI queda pendiente para una iteración posterior; el propietario acepta expresamente esta limitación para I-00. No se sustituyen capacidades materiales ausentes ni se activan automatizaciones.

## 1. Crear la instancia

* Copia el template y establece la nueva carpeta como raíz principal del proyecto.
* Conserva el historial Git del template o, si la copia no lo incluye, solicita autorización para inicializar Git y crear un commit que represente el estado inicial antes de desarrollar.
* Confirma que el agente recibe las instrucciones globales aplicables y el `AGENTS.md` del proyecto desde esa raíz. Usa la comprobación específica de su herramienta descrita abajo.
* Comprueba qué skills y herramientas están realmente disponibles. No supongas capacidades que el entorno no muestre.

Las capacidades necesarias son investigar, implementar trabajo autorizado, revisar, verificar y, cuando exista frontend, diseñar e inspeccionar la interfaz. Las skills `fix-bug`, `implement-feature`, `review-change` y `frontend-design` son posibles ayudas, no requisitos de arranque ni dependencias del repositorio. Si no están disponibles, usa los procedimientos normales del agente, las fuentes canónicas y los comandos del proyecto cuando existan; no inventes skills ni afirmes haberlas usado. Si falta una capacidad material para verificar el resultado, registra el bloqueo antes de depender de ella.

En MiMiniApp las skills se dejan **para el final**, tras estabilizar el flujo: consulta [PEND-001](exec-plans/tech-debt-tracker.md#pend-001--skills-opcionales-al-final). No se instalan ni activan como parte de esta preparación documental.

### Comprobar instrucciones por herramienta

| Herramienta | Entrada del proyecto | Comprobación en su sesión |
| --- | --- | --- |
| Codex | `AGENTS.md` | Iniciar desde la raíz e identificar las fuentes canónicas y la distinción entre `Aprobado` y `Autorizado`. |
| Claude Code | `CLAUDE.md` importa `@AGENTS.md` | Comprobar versión y contexto cargado; usar `/context all` si está disponible en la versión real. |
| Gemini CLI | `GEMINI.md` importa `@./AGENTS.md` | Comprobar versión y memoria cargada; usar `/memory show` y, tras cambios, `/memory reload` si están disponibles. |

No configures simultáneamente otra entrada que duplique la misma política. Si una versión no admite un comando o import, consulta su documentación oficial y registra la incompatibilidad; no supongas equivalencia por tener los archivos.

En cada herramienta comprueba estos escenarios: un plan `Aprobado` no permite instalar el stack; una skill ausente no se crea por iniciativa propia; una API con clave privada exige decisión y autorización; un PR con checks verdes no se fusiona por iniciativa del agente; una aprobación histórica debe reflejarse en la fuente canónica antes de actuar. Registra herramienta, versión, respuesta y limitaciones en la [auditoría](onboarding-audit.md). No marques las pruebas de otros agentes como realizadas si no se ejecutaron.

## 2. Definir el proyecto

Completa progresivamente `docs/product-specs/index.md` con el propósito, los usuarios, el resultado esperado, el alcance, las restricciones y las cuestiones pendientes. Investiga antes de preguntar, pero no adoptes decisiones técnicas durante esta etapa.

Aplica los criterios y registra la aprobación de la definición en `docs/product-specs/index.md`. Esa aprobación no aprueba decisiones técnicas, planes ni implementación.

## 3. Investigar y aprobar decisiones

Identifica, conforme a los criterios de `docs/design-docs/index.md`, solo las decisiones técnicas necesarias para planificar el primer resultado útil. Según el proyecto pueden incluir stack, versiones, estructura, persistencia, dependencias relevantes, estrategia de pruebas, seguridad o despliegue.

Registra allí las alternativas, el responsable y el estado. No anticipes decisiones que todavía no condicionen el trabajo.

## 4. Preparar el ExecPlan inicial

El ExecPlan inicial debe cubrir el menor resultado coherente que permita comenzar el proyecto y demostrar que funciona. Además del producto, debe incluir las capacidades necesarias para que Codex pueda trabajar con evidencia:

* scaffolding y configuración mínima;
* comandos de instalación, ejecución, pruebas, análisis estático y build que sean aplicables;
* variables de entorno documentadas sin versionar secretos;
* datos de prueba, fixtures, seeds, mocks o mecanismos de reset cuando sean necesarios;
* acceso a la salida funcional, errores y logs;
* inspección visual o mediante navegador cuando exista interfaz;
* verificaciones observables y criterios de aceptación.

Primero se aprueba el plan. La ejecución comienza únicamente después de una autorización expresa separada, conforme a `docs/PLANS.md`.

## 5. Construir el entorno autorizado

Durante la ejecución del plan inicial, utiliza primero las herramientas estándar del stack aprobado. No añadas una dependencia o integración solo para el agente si un comando existente ofrece la misma señal de forma clara.

Cuando los comandos reales sean estables, puede proponerse una configuración local de Codex en `.codex/` con el setup de worktrees y acciones frecuentes. Como esos scripts pueden ejecutarse automáticamente, su creación y activación requieren aprobación. Nunca incluyas secretos reales en el repositorio ni en configuraciones compartidas.

Cada tarea cloud ya se ejecuta en un entorno aislado: usa el checkout existente y no crees un Git worktree salvo petición expresa del usuario. Fuera de ese entorno, valora el aislamiento según la tarea y las instrucciones aplicables. Si un worktree autorizado necesita archivos locales ignorados, define explícitamente qué archivos seguros deben copiarse; no utilices este mecanismo para versionar secretos.

Una skill local al repositorio puede proponerse cuando un flujo específico del proyecto sea repetido, estable y útil para el equipo, pero requiere aprobación antes de incorporarse. Evalúa primero reutilizar skills disponibles; cualquier integración local debe evitar duplicaciones y estar cubierta por una iteración autorizada. Las rutas y compatibilidad entre clientes se deciden entonces, no se anticipan ahora.

## 6. Verificar la preparación

Antes de dar por activado el proyecto, comprueba desde un checkout o worktree limpio todo lo que resulte aplicable:

* el setup termina correctamente;
* la aplicación o servicio arranca;
* las pruebas y comprobaciones técnicas se ejecutan;
* el agente puede observar el comportamiento que debe validar;
* los errores y logs relevantes son accesibles;
* los datos de prueba pueden prepararse y restablecerse;
* los comandos y requisitos necesarios están registrados en el repositorio;
* no se depende de instrucciones esenciales conservadas únicamente en una conversación o en la memoria de una persona.

Distingue entre capacidades verificadas, inferidas y no comprobadas. Una limitación material impide declarar completada la activación hasta resolverla o aceptarla expresamente.

## 7. Trabajar y entregar

Una vez aceptado el resultado del plan inicial, gestiona cada petición conforme a su naturaleza y a las skills disponibles. Carga solo el contexto relevante, crea un ExecPlan cuando el riesgo o alcance lo justifique, solicita aprobación para nuevas decisiones técnicas y verifica mediante señales observables.

Después de implementar un cambio no trivial, revisa su delta de forma separada. La entrega termina cuando el resultado verificado es aceptado; entonces el ExecPlan puede pasar a `docs/exec-plans/completed/`.

## 8. Mejorar el harness con evidencia

Cuando el agente no pueda ejecutar, observar o verificar una tarea, identifica la capacidad concreta que falta. Registra el problema en el plan activo y propone la mejora mínima: documentación, comando, script, prueba, skill, acceso a logs u otra herramienta.

Promueve una regla documental a una comprobación mecánica solo cuando sea un invariante aprobado y exista evidencia de que la automatización aporta valor. Las tareas recurrentes, revisiones automáticas, controles de arquitectura, publicación y despliegue permanecen desactivados hasta recibir aprobación expresa.

Los Markdown orientan el comportamiento; las restricciones de merge, despliegue y secretos deben respaldarse con permisos mínimos y protecciones reales cuando se autorice la infraestructura. No supongas que esas barreras existen por estar descritas. El estado observado de esta instancia está en la [auditoría](onboarding-audit.md).
