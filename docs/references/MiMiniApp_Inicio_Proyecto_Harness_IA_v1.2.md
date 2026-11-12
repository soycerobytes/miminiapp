# MiMiniApp — Dossier de transferencia al harness documental de IA

**Versión:** 1.2 — documento único de inicio; pruebas reproducibles local/CI/staging y ejecución iterativa  
**Fecha:** 2026-11-04  
**Estado:** especificación de transferencia revisada; las decisiones de pruebas y flujo Git están expresamente tomadas, pero **este archivo no autoriza por sí mismo ejecutar acciones en repositorios o servicios**  
**Destino:** instancia nueva del harness [`aalexlpez/harness-engineering`](https://github.com/aalexlpez/harness-engineering)  
**Agentes objetivo:** Codex, Claude Code y Gemini CLI  
**Responsable de producto, decisiones técnicas, aceptación y publicación:** propietario de MiMiniApp (debe identificarse formalmente en los artefactos del proyecto).

> **Instrucción principal para la IA receptora:** este documento aporta requisitos, decisiones ya expresadas y recomendaciones para instanciar MiMiniApp con el harness existente. No reemplaza las fuentes canónicas ni las transiciones de aprobación del harness. Antes de actuar, lee `AGENTS.md`, `docs/BOOTSTRAP.md`, `docs/product-specs/index.md`, `docs/design-docs/index.md` y, si vas a preparar un plan, `docs/PLANS.md`. Transfiere la información al documento que corresponda, conserva el estado **propuesto** de las decisiones pendientes y solicita aprobación humana conforme al harness. **No interpretes recibir este documento como una autorización para escribir código o desplegar.**


---

## 0. INICIO AQUÍ — instrucciones operativas para el agente receptor

**Este es el archivo de entrada único para iniciar la definición e instanciación de MiMiniApp sobre una copia del harness.** No se necesita que el agente lea conversaciones de ChatGPT ni los documentos históricos para comprender los requisitos acordados. El repositorio del harness es la fuente canónica de sus propias normas, y este dossier aporta la definición que debe trasladarse a las fuentes canónicas **de la nueva instancia**.

**Acción inicial solicitada al agente:**

1. Identifica el repositorio y la rama reales; distingue el repositorio del harness reutilizable (`aalexlpez/harness-engineering`, originalmente rama `master`) de una nueva instancia de MiMiniApp (objetivo final `feature/*`, `staging`, `main`). **No modifiques el template original por defecto.**
2. Lee `AGENTS.md`, `docs/BOOTSTRAP.md`, `docs/PLANS.md`, `docs/product-specs/index.md`, `docs/design-docs/index.md`, `docs/harness-decisions.md` y la plantilla de ExecPlan. Verifica que existen y comprueba divergencias respecto a la revisión documentada aquí.
3. Presenta un mapa breve y concreto de qué información se incorporará a cada fuente canónica y qué mejoras de compatibilidad Codex/Claude/Gemini conviene proponer, **sin duplicar reglas**.
4. Identifica las decisiones ya expresadas por el propietario y las propuestas aún abiertas. Registra las decisiones en los artefactos adecuados únicamente mediante el procedimiento de aprobación del harness; no atribuyas aprobaciones por inferencia.
5. Prepara **solamente la iteración I-00** con entregables y pruebas comprobables. Después de la revisión/aprobación del plan, espera **autorización expresa distinta** antes de ejecutar la iteración. Al concluirla, entrega evidencia y solicita aceptación. No avances por cuenta propia a I-01.
6. No elijas ni desarrolles una primera miniapp. No crees cuentas, credenciales, Worker, dominio, infraestructura de pago o automatizaciones fuera de un plan autorizado.

**Contrato de comunicación:** cada iteración debe terminar con: archivos modificados, decisiones registradas, comandos realmente ejecutados, resultados de pruebas, comprobaciones pendientes, riesgos y autorización humana que se requiere a continuación. **Nunca declarar que una prueba pasó si no se ejecutó.**

### Flujo de desarrollo aprobado, en una frase

`feature/<miniapp>` → pruebas locales → PR y **mismas pruebas automáticas** en GitHub Actions → aprobación y merge a `staging` → despliegue automático Cloudflare → pruebas E2E en URL pública de staging + validación humana → PR `staging` → `main` protegido → aprobación y merge → despliegue automático producción → smoke tests.

### Aclaración obligatoria sobre la batería de pruebas

- **Las pruebas y sus configuraciones viven en el repositorio MiMiniApp** junto con el código fuente (por ejemplo `src/**/__tests__`, `tests/`, scripts de `package.json` y `.github/workflows/`). No dependen de un servicio externo de testing.
- **Se repiten deliberadamente:** el agente las ejecuta en local; GitHub Actions ejecuta los mismos comandos desde un checkout limpio cuando se abre o actualiza un PR. Esto verifica reproducibilidad.
- **Staging agrega una comprobación diferente:** tras desplegar, Playwright consulta la URL REAL de staging, no `localhost`, y valida la versión desplegada. La suite remota puede reutilizar casos E2E cambiando `baseURL` y añadir smoke tests específicos del entorno.
- **Producción agrega una comprobación mínima posterior:** disponibilidad, idiomas, recursos, enlaces críticos y versión desplegada. Un fallo después del deploy inicia alerta/rollback; no puede impedir retroactivamente un despliegue que ya ocurrió.
- No es necesario ejecutar la suite lenta completa en cada guardado local: usar pruebas rápidas durante edición, suite completa antes del PR y en CI; pruebas remotas solo cuando corresponda.

### Cinco prohibiciones que no deben perderse

**(a)** Un ExecPlan `Aprobado` no está `Autorizado`. **(b)** Ningún agente aprueba sus propios planes o PR. **(c)** Un push a una rama feature no publica en producción. **(d)** Los secretos Cloudflare jamás llegan a PR de colaboradores externos ni al frontend. **(e)** El hecho de que una miniapp pueda monetizarse en el futuro no autoriza introducir backend, usuarios o pagos hoy.


## 1. Encargo y límites de actuación

### 1.1 Qué se espera de la IA que reciba este dossier

1. Auditar la instancia local real del harness y las herramientas instaladas: no asumir que coincide con una copia anterior ni que hay skills disponibles.
2. Conservar la estructura y la separación de responsabilidades del harness. Proponer mejoras mínimas para que sea compatible con Codex, Claude Code y Gemini CLI; no sustituirlo por otro sistema.
3. Trasladar la definición de MiMiniApp a `docs/product-specs/index.md` como fuente canónica del **producto**.
4. Registrar decisiones de **tecnología y arquitectura** en `docs/design-docs/index.md`, distinguiendo aprobadas por el responsable y pendientes de formalizar; completar `ARCHITECTURE.md` solo con la arquitectura realmente aprobada/implementada, sin inventar componentes existentes.
5. Documentar la experiencia y normas del frontend en `docs/FRONTEND.md`, seguridad en `docs/SECURITY.md` y otras guías especializadas **solo cuando haya contenido real y vigente**; respetar los archivos vacíos del template cuando no hagan falta.
6. Preparar **ExecPlans separados por iteraciones pequeñas, secuenciales y verificables**, conforme a `docs/PLANS.md` y `docs/exec-plans/_template.md`. No reemplazar esta exigencia por un gran plan que incluya varias fases de implementación. Aprobar un plan no autoriza ejecutarlo.
7. Incorporar la **batería de pruebas automatizadas** y los dos entornos de despliegue permanente (staging y producción) como requisitos fundamentales desde el primer Sprint. Devolver archivos propuestos, riesgos, aceptación y aprobaciones pendientes.
8. **No elegir ni desarrollar la primera miniapp**: esa decisión se ha aplazado expresamente.

### 1.2 Lo que NO se autoriza mediante este dossier

- Instalar paquetes, inicializar o reescribir aplicaciones, alterar CI/CD, publicar un sitio, registrar dominio, habilitar servicios de Cloudflare, crear secretos, activar hooks/skills/automatizaciones o cambiar configuraciones globales **sin autorización del ExecPlan correspondiente**. La automatización de CI/CD se ha elegido como requisito del producto; su instalación y activación todavía requieren autorización para la iteración de infraestructura.
- Hacer commits, pushes, merges, abrir PR públicos o modificar el repositorio original `harness-engineering` sin orden expresa.
- Crear cuentas de usuario, autenticación, sesiones, backend, bases de datos, APIs de terceros, telemetría o pagos.
- Declarar como «aprobada» una propuesta nueva por haber aparecido en este documento. En caso de duda, conservar el estado `Propuesta`.

### 1.3 Procedimiento recomendado para empezar

**Paso A — inspección de solo lectura:** confirmar la rama, el árbol documental, instrucciones, capacidades y fuentes canónicas existentes.  
**Paso B — propuesta documental:** mostrar un mapa de destino de cada decisión y las modificaciones agnósticas al agente; señalar contradicciones.  
**Paso C — aprobación humana:** obtener aprobación para cambios documentales concretos y aplicarlos en la instancia de MiMiniApp.  
**Paso D — preparación del ExecPlan inicial:** obtener aprobación y, después, autorización separada antes de implementar.  
**Paso E — desarrollo:** solo cuando esté autorizado; verificar y solicitar aceptación según los estados del harness.

---

## 2. Auditoría del harness original — hechos observados

**Repositorio leído:** [`aalexlpez/harness-engineering`](https://github.com/aalexlpez/harness-engineering), rama por defecto `master`, árbol público observado el 2026-11-04. No se ha escrito nada en él.

| Archivo real | Estado y función observados |
| --- | --- |
| [`AGENTS.md`](https://github.com/aalexlpez/harness-engineering/blob/master/AGENTS.md) | Reglas de fuentes canónicas, autoridad humana, estados, ejecución, automatizaciones y mantenimiento documental. Redactado principalmente para Codex. |
| [`README.md`](https://github.com/aalexlpez/harness-engineering/blob/master/README.md) | Presenta un template reutilizable, **sin stack ni arquitectura de producto**; explica el ciclo de trabajo controlado. |
| [`docs/BOOTSTRAP.md`](https://github.com/aalexlpez/harness-engineering/blob/master/docs/BOOTSTRAP.md) | Activación progresiva, verificación del entorno, capacidades disponibles y aprobación independiente de definición, decisiones, plan y ejecución. |
| [`docs/PLANS.md`](https://github.com/aalexlpez/harness-engineering/blob/master/docs/PLANS.md) | Regula cuándo crear un ExecPlan y su ciclo `Borrador → Aprobado → Autorizado → En curso → Verificado → Aceptado`, con `Cancelado` como cierre alternativo. |
| [`docs/product-specs/index.md`](https://github.com/aalexlpez/harness-engineering/blob/master/docs/product-specs/index.md) | Definición de producto vacía, lista para completar. |
| [`docs/design-docs/index.md`](https://github.com/aalexlpez/harness-engineering/blob/master/docs/design-docs/index.md) | Registro técnico con estados `Propuesta`, `Aprobada`, `Rechazada`, `Sustituida`. |
| [`docs/harness-decisions.md`](https://github.com/aalexlpez/harness-engineering/blob/master/docs/harness-decisions.md) | Decisión H-001: gobierno ligero, juicio humano, fuentes canónicas separadas, sin validador obligatorio inicial. |
| [`docs/exec-plans/_template.md`](https://github.com/aalexlpez/harness-engineering/blob/master/docs/exec-plans/_template.md) | Plantilla de ejecución con control, alcance, decisiones, aceptación, verificaciones, progreso e historial. |
| `ARCHITECTURE.md`, `docs/FRONTEND.md`, `docs/DESIGN.md`, `docs/SECURITY.md`, `docs/PRODUCT_SENSE.md`, `docs/QUALITY_SCORE.md`, `docs/RELIABILITY.md` | Actualmente vacíos en el template; **esto es deliberado y no un defecto**. |

**Diagnóstico:** el harness **es válido y suficiente**. No requiere un framework nuevo, dependencias, MCP ni skills. Hay oportunidades de mejora focalizadas en **portabilidad de instrucciones, terminología y arranque sin skills globales**. No confundir la ausencia de herramientas opcionales con un defecto que obligue a instalarlas.

### 2.1 Lo que debe preservarse sin simplificar

- `AGENTS.md` es un mapa de autoridad y documentos, no un PRD ni un manual técnico voluminoso.
- `docs/product-specs/index.md` define qué debe lograr el producto.
- `docs/design-docs/index.md` registra decisiones duraderas sobre **el producto**.
- `ARCHITECTURE.md` registra el estado de arquitectura **real**; no es una lista de deseos.
- `docs/harness-decisions.md` recoge cambios generales del **harness**, no decisiones de MiMiniApp.
- Cada ExecPlan registra su propio estado y evidencia. `Aprobado` **no equivale** a `Autorizado`.
- El responsable humano aprueba definición, decisiones técnicas, planes, ejecución, aceptación, cambios de alcance, cancelación y activación de automatizaciones.
- Las skills y herramientas globales se aprovechan si existen; no se inventan.
- Una modificación del template general `harness-engineering` requiere autorización aparte de la instancia de MiMiniApp.

---

## 3. Compatibilidad Codex / Claude Code / Gemini CLI

### 3.1 Hallazgos verificados en documentación oficial

| Herramienta | Mecanismo oficial | Recomendación para este harness |
| --- | --- | --- |
| **Codex** | Reconoce `AGENTS.md`; admite jerarquía de instrucciones de repositorio y subdirectorios. | Mantener `AGENTS.md` como documento raíz **compartido** y canónico. |
| **Claude Code** | Reconoce `CLAUDE.md`; en versiones recientes (**2.1.277+**) también puede leer `AGENTS.md` directamente cuando no hay un `CLAUDE.md` del proyecto que lo sustituya. | Añadir opcionalmente un `CLAUDE.md` mínimo que **importe** `AGENTS.md` por compatibilidad y previsibilidad. |
| **Gemini CLI** | Reconoce `GEMINI.md` y sus imports `@ruta`; admite configuración de otros nombres mediante `context.fileName`. | Añadir `GEMINI.md` mínimo con import a `AGENTS.md`. No configurar ambos a la vez de manera que se duplique el contexto. |

**Fuentes:** [Codex AGENTS.md](https://developers.openai.com/codex/guides/agents-md), [Claude Code Memory — AGENTS.md](https://code.claude.com/docs/en/memory), [Gemini CLI GEMINI.md](https://geminicli.com/docs/cli/gemini-md/).

**Precisión importante sobre Claude:** actualmente puede leer `AGENTS.md` sin adaptador en su configuración predeterminada cuando no hay `CLAUDE.md` de proyecto que tenga precedencia. Si creamos un `CLAUDE.md` separado, **debe importar el contenido de `AGENTS.md`**; decir simplemente «lee AGENTS.md» no garantiza carga de contexto. La documentación de Claude recomienda `@AGENTS.md` para ese caso.

### 3.2 Propuesta de archivos raíz, sin duplicar normas

```text
miminiapp/
├── AGENTS.md               # Autoridad y reglas compartidas: única fuente
├── CLAUDE.md               # Puente de compatibilidad, no copia
├── GEMINI.md               # Puente de compatibilidad, no copia
├── README.md
├── ARCHITECTURE.md
└── docs/
    ├── BOOTSTRAP.md
    ├── PLANS.md
    ├── product-specs/index.md
    ├── design-docs/index.md
    ├── harness-decisions.md
    ├── FRONTEND.md
    ├── SECURITY.md
    └── exec-plans/
        ├── _template.md
        ├── active/
        └── completed/
```

**Contenido sugerido de `CLAUDE.md`:**

```md
@AGENTS.md

<!-- Compatibilidad de instrucciones con Claude Code.
La fuente de verdad es AGENTS.md y sus documentos enlazados.
No duplicar reglas aquí. -->
```

**Contenido sugerido de `GEMINI.md`:**

```md
@./AGENTS.md

<!-- Compatibilidad de instrucciones con Gemini CLI.
La fuente de verdad es AGENTS.md y sus documentos enlazados.
No duplicar reglas aquí. -->
```

Estos archivos son **propuestas**, no cambios aplicados. Los comentarios son opcionales; mantenerlos breves. No crear symlinks de `CLAUDE.md` a `AGENTS.md` como configuración predeterminada: el desarrollo en Windows puede dificultar su mantenimiento.

**Alternativa para Gemini:** configurar exclusivamente `AGENTS.md` como archivo de contexto en `.gemini/settings.json` mediante `context.fileName`, pero esto añade una configuración específica y no aporta una ventaja suficiente frente al puente `GEMINI.md` para nuestro caso. **Elegir un único mecanismo y verificarlo.**

### 3.3 Verificaciones de compatibilidad obligatorias al activar el proyecto

- Codex: iniciar una sesión desde la raíz y comprobar que recibe las instrucciones del `AGENTS.md` de proyecto (y el global si lo hay).
- Claude Code: ejecutar `/context all` y confirmar la carga del documento canónico, directamente o a través del import; verificar la versión/configuración real.
- Gemini CLI: ejecutar `/memory show` (y `/memory reload` tras ajustes) y comprobar el contenido del import.
- En los tres: preguntar a la IA **dónde se registra el estado de un ExecPlan y si puede empezar a programar tras quedar `Aprobado`**. Respuesta esperada: en el propio ExecPlan; **no** hasta `Autorizado`.
- Comprobar que ninguno se atribuya autoridad para aprobar sus propios cambios o activar automatizaciones.
- Registrar evidencia y versión de la herramienta en la activación. No afirmar compatibilidad por el mero hecho de existir archivos.

### 3.4 Cambio mínimo de redacción para que el harness sea agnóstico

En `AGENTS.md`, `README.md`, `docs/BOOTSTRAP.md` y `docs/PLANS.md`, revisar las frases que dicen «Codex» cuando realmente significa «el agente de desarrollo». Proponer reemplazarlas por «agente de IA», «agente ejecutor» o «Codex / Claude Code / Gemini CLI», **sin alterar los estados, atribuciones ni restricciones**.

Excepción: conservar «Codex» cuando se habla específicamente de `~/.codex`, `.codex/`, configuración de worktrees o de comandos exclusivos de Codex. En esos apartados, indicar su carácter opcional y específico del entorno.

**Ajuste sobre skills:** `docs/BOOTSTRAP.md` menciona `fix-bug`, `implement-feature`, `review-change` y `frontend-design`, aunque el template no las incluye. El propietario **autoriza que se propongan o integren skills en el repositorio si aportan valor y están cubiertas por una iteración autorizada**. No son requisitos de arranque. Los resultados (implementar, revisar, diseñar y verificar) son exigibles; el nombre o existencia de una skill no. La propuesta de directorios compartidos y criterios de adopción se detalla en § 8.3.

### 3.5 Límite de las instrucciones escritas

Los archivos Markdown son **guías de comportamiento**, no una barrera de seguridad infalible. Las prohibiciones de merge, despliegue y exposición de secretos deben respaldarse, cuando se configure el entorno, con permisos reales de repositorio, protección de ramas, secretos CI y credenciales de mínimos privilegios. No conceder a un agente acceso de producción por asumir que obedecerá `AGENTS.md`.

---

## 4. MiMiniApp — definición de producto consolidada

### 4.1 Qué es

**MiMiniApp** (nombre provisional) es una plataforma web pública, bilingüe y de código abierto que publica una colección creciente de **miniapps**: calculadoras, utilidades de trabajo, herramientas cotidianas, experimentos científicos, juegos, curiosidades y experiencias interactivas, sin limitarse a un nicho.

**Objetivo principal:** crear un ciclo sostenible de producto + contenido audiovisual. Aproximadamente **una miniapp nueva por semana**, acompañada de un vídeo principal y **una o dos piezas adicionales** para TikTok, Instagram Reels y YouTube Shorts. La herramienta publicada debe seguir siendo útil y fiable después de la grabación.

**Disponibilidad estimada:** 11–15 horas semanales **incluyendo programación, pruebas, guion, grabación, edición y comunidad**. El objetivo semanal es flexible: no se publica algo defectuoso solo para cumplir el calendario.

**Usuarios:** público general, móvil como principal fuente esperada desde redes; escritorio como experiencia de primera clase, particularmente para productividad.

**Nombre de los módulos:** **miniapps**. El nombre de marca MiMiniApp y el dominio `miminiapp.com` siguen siendo candidatos, no hechos consumados.

### 4.2 Decisiones de producto expresamente tomadas

| Identificador | Requisito / decisión | Estado para trasladar |
| --- | --- | --- |
| PROD-01 | Catálogo público con URLs propias y compartibles para cada miniapp | Decidido |
| PROD-02 | Libertad temática total; equilibrar utilidad y atractivo audiovisual | Decidido |
| PROD-03 | Español e inglés **desde el lanzamiento**, sin traducciones parciales públicas | Decidido |
| PROD-04 | Sin cuentas, registro, sesiones de producto ni suscripciones al comienzo | Decidido |
| PROD-05 | Sin backend, base de datos ni servicios de terceros **por defecto** | Decidido |
| PROD-06 | `localStorage` / IndexedDB permitidos solo en dispositivo, sin sincronización | Decidido |
| PROD-07 | Excepciones de API, almacenamiento remoto o servidor caso a caso **solo con aprobación humana** | Decidido |
| PROD-08 | Miniapps con ejemplo demostrable, restablecimiento rápido y resultados reproducibles | Decidido |
| PROD-09 | Diseño **mobile-first** con versión escritorio cuidada, no una adaptación residual | Decidido |
| PROD-10 | Repositorio público, posibilidad de PR de terceros; merge por mantenedores | Decidido |
| PROD-11 | Las propuestas llegan inicialmente por comentarios en redes y se gestionan manualmente | Decidido |
| PROD-12 | Monetización/SaaS futuro posible, sin implementar su infraestructura ahora | Decidido |
| PROD-13 | Lanzamiento cuando la calidad sea suficiente; **cantidad de miniapps iniciales no cerrada** | Decidido |
| PROD-14 | No elegir aún la primera miniapp | **Pendiente por decisión expresa** |

**MVP, alcance mínimo propuesto:** portada de la plataforma; catálogo (admite estado vacío durante desarrollo, pero no anunciar miniapps inexistentes); rutas `/es/` y `/en/`; páginas por miniapp; metadatos traducidos; estructura modular; interfaz responsive; modo de demostración; enlaces a redes y GitHub; pruebas y proceso de revisión. Para lanzamiento público del concepto debe existir al menos **una miniapp real validada**, pero no se define cuál ni se fija un total distinto sin aprobación.

**Fuera del MVP:** perfiles, login, pagos, administración, votaciones, formularios internos de ideas, backend, bases de datos, notificaciones, IA como servicio, sincronización entre dispositivos, algoritmos de recomendación, APIs con claves privadas, monitorización de usuario individual o sistema propio de comentarios.

### 4.3 Contenido como criterio transversal, sin degradar el producto

Cada miniapp debe poder demostrarse de manera clara y auténtica:

- explicación de utilidad/curiosidad comprensible por personas no técnicas;
- datos de ejemplo válidos y reproducibles;
- botón o mecanismo rápido de «probar ejemplo» y «restablecer», cuando proceda;
- resultado legible en móvil y grabable en vertical 9:16 sin convertir la aplicación en una interfaz exclusiva para vídeo;
- posibilidad de capturar una interacción real, no un mock que simule una función inexistente;
- un enlace directo para compartir la miniapp con su idioma correcto.

Se graba con un móvil y se combina presentación a cámara, captura nítida de la web y narración. El set de grabación está documentado por separado; **no forma parte del runtime de la web ni condiciona la arquitectura**.

### 4.4 Bilingüismo y URL

- Las rutas públicas, el catálogo y los metadatos deben tener versiones ES y EN desde lanzamiento.
- Preferencia de diseño a evaluar: prefijos explícitos `/es/` y `/en/` para URLs consistentes y compartibles; definir rutas canónicas, `hreflang` y enlaces entre idiomas antes de aprobar el SEO técnico.
- Una miniapp puede compartir lógica de dominio y componentes entre ambos idiomas; textos y formatos locales no deben estar incrustados en cálculos.
- Fechas, importes y números con `Intl` cuando proceda; distinguir **formato visual** de **valor computacional**.

---

## 5. Arquitectura técnica y decisiones para el registro

> En la nueva instancia, estas decisiones deben quedar registradas en `docs/design-docs/index.md` con fecha, responsable y estado conforme al harness. Lo acordado expresamente en la conversación es evidencia de decisión, pero **el documento canónico aún debe reflejarlo**. La IA no está autorizada a elevar propuestas abiertas a `Aprobada`.

| ID sugerido | Decisión | Estado material |
| --- | --- | --- |
| ADR-MMA-001 | **Astro**, sitio **static-first**, prerender por defecto | Seleccionada por el usuario |
| ADR-MMA-002 | **React + TypeScript** para módulos interactivos, lógica prioritaria en navegador | Seleccionada |
| ADR-MMA-003 | **Tailwind CSS** y diseño mobile-first + escritorio | Seleccionada expresamente |
| ADR-MMA-004 | **Cloudflare Workers Static Assets** para alojar salida estática | Seleccionada expresamente |
| ADR-MMA-005 | Sin backend ni BD; IndexedDB/localStorage opcionales en cliente | Seleccionada |
| ADR-MMA-006 | **Client-first**: niveles local / API externa / backend con evaluación y autorización | Seleccionada |
| ADR-MMA-007 | GitHub público, contribuciones por PR y aprobación humana | Seleccionada |
| ADR-MMA-008 | **Batería de testing automatizado durante cada iteración y ante PRs, staging y producción**; herramientas candidatas Vitest, Playwright, RTL, axe | **Requisito aprobado por el responsable**; selección precisa de versiones, comandos y umbrales se formaliza en el ADR |
| ADR-MMA-009 | **CI/CD de tres ramas: feature → staging → main**, despliegue automático de staging y de producción por push/merge; promoción a main tras batería real en staging y aprobación humana | **Flujo aprobado expresamente**; implementar con GitHub Actions + Wrangler es propuesta técnica preferida, su configuración concreta se aprueba en un ExecPlan |
| ADR-MMA-010 | Licencia **MIT** | **Pendiente de aprobación expresa**; se investigó, pero no se formalizó |
| ADR-MMA-011 | Registro tipado y separación de módulos | **Propuesta de diseño** |
| ADR-MMA-012 | Analítica web sin cuentas y respetuosa con privacidad | **Pendiente**: elegir si se mide, con qué y sus implicaciones |
| ADR-MMA-013 | **ExecPlans de trabajo por iteraciones pequeñas, ejecutables de una en una, con criterios, pruebas y aceptación propios** | **Regla de proyecto aprobada**; propuesta general para el template si se desea reutilizarla |
| ADR-MMA-014 | **Staging permanente equivalente funcionalmente a producción, separado en Cloudflare; pruebas en URL pública antes de promoción** | **Requisito aprobado**; dominios, secrets y workflows específicos, pendientes de implementación autorizada |

**Importante para `ARCHITECTURE.md`:** al comienzo aún no hay una aplicación desplegada que describir. Documentar como **arquitectura objetivo aprobada, aún no implementada**, separada claramente de la arquitectura real; actualizar tras evidencias de build y despliegue. No escribir que los servicios están provisionados si no lo están.

### 5.1 Estructura orientativa: propuesta para evaluar, no carpeta existente

```text
src/
├── pages/
│   ├── [locale]/
│   │   ├── index.astro
│   │   └── apps/[slug].astro
│   └── 404.astro
├── layouts/
├── components/
├── miniapps/
│   └── <slug>/
│       ├── App.tsx
│       ├── domain/
│       ├── tests/
│       └── demo.ts
├── i18n/
├── lib/
│   └── miniapp-registry.ts
└── styles/
```

El agente debe **validar el enrutado Astro real de la versión instalada**, particularmente las rutas dinámicas estáticas y su generación mediante `getStaticPaths`, antes de fijar nombres. Proponer un registro ligero tipado; no fabricar un motor de plugins, sistema remoto ni microfrontend para cinco miniapps.

**Contrato mínimo propuesto por miniapp:** slug estable; identificador; categoría; estado (`draft` / `published`); etiquetas; título y descripción en `es` y `en`; importación de su interfaz; dependencias explícitas; tipo de ejecución (`client-local` por defecto); esquema de demo reproducible; pruebas; fecha de publicación cuando exista. Las claves del registro se validarán en build y el catálogo no mostrará borradores.

### 5.2 Modelo de ejecución de las miniapps

1. **Nivel 1 — local (predeterminado):** cálculos, juegos individuales, experimentos, manipulación local de archivos, persistencia opcional en navegador. Sin llamadas a servidores de MiMiniApp.
2. **Nivel 2 — integración directa:** API pública accesible legal y técnicamente desde navegador, sin credenciales privadas; revisar CORS, cuotas, datos transmitidos y condiciones. Requiere aprobación expresa.
3. **Nivel 3 — backend:** servicios con secretos, cobros, colaboración, almacenamiento remoto, cómputo pesado o autenticación. Requiere nuevo análisis, decisión aprobada, coste previsto y ExecPlan; no se activa por analogía con otra miniapp.

Nunca poner secretos o tokens privados en código frontend. Si un modelo o procesador se ejecuta en WebAssembly o Web Worker, sigue siendo lado cliente, pero debe presupuestarse memoria, batería y descarga en teléfonos de gama media. No usar acceso a datos locales del navegador como si fuera una copia de seguridad: para información de valor, proponer exportación/importación o respaldo local claro.

### 5.3 Cloudflare: modalidad elegida y límites

- Para una web Astro puramente prerenderizada, **no se necesita instalar `@astrojs/cloudflare`**: basta compilar a `dist/` y servir Static Assets desde Cloudflare Workers.
- Cuando una ruta necesite renderizado bajo demanda, evaluar el adaptador oficial y su efecto de configuración; asegurar que el resto de páginas sigan prerenderizadas donde convenga.
- La documentación de Cloudflare ofrece **peticiones a archivos estáticos gratuitas e ilimitadas** en su estructura actual; esto **no elimina límites** de archivos por despliegue, tamaño de archivo, compilaciones, invocaciones dinámicas, CPU, memoria o cambios de términos futuros.
- Alojamiento estático barato no es SLA de disponibilidad infinita. No prometer «capacidad ilimitada garantizada» en el PRD.
- No activar SSR, sesiones, bindings KV/D1 ni Workers dinámicos por anticipación.
- Usar un dominio `*.workers.dev` mientras el dominio propio no esté comprado ni conectado.
- El nombre `miminiapp.com` es un **candidato de dominio**, no prueba de propiedad/disponibilidad.

**Referencia oficial:** [Astro en Cloudflare Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/), [Astro — adaptador Cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/), [Cloudflare Static Assets](https://developers.cloudflare.com/workers/static-assets/).

### 5.4 Flujo aprobado: feature → staging → main, con despliegue automático

El responsable **ha elegido expresamente** el siguiente modelo, que sustituye cualquier alternativa de doble aprobación manual del despliegue descrita antes:

1. Una iteración se implementa en `feature/<identificador>`; se prueban los cambios en local y se vuelven a ejecutar las mismas comprobaciones en GitHub Actions mediante un PR hacia `staging`.
2. Tras checks correctos y revisión humana se fusiona en `staging`. Un **push a staging despliega automáticamente** un sitio de Cloudflare permanente, distinto de producción.
3. Se ejecuta una **batería de pruebas contra la URL pública real de staging**, incluyendo E2E, accesibilidad, idiomas, rutas, responsive y smoke tests. El propietario prueba y acepta staging.
4. Se abre PR `staging → main`. Este PR debe pasar un **gate de release** que compruebe que el contenido propuesto es el mismo commit/árbol validado en staging, que no hay nuevos commits sin validar, que los checks están correctos y que existe aceptación humana.
5. El merge aprobado a `main` desencadena **despliegue automático a producción**. Inmediatamente después se ejecutan smoke tests de producción y se conserva evidencia del SHA desplegado.

**Un merge aprobado a `main` cuenta como la autorización humana para publicar.** No exigir una segunda autorización de deploy. No permitir pushes directos a `main`, ni merges sin PR/revisión/validaciones, salvo procedimiento de emergencia documentado y aprobado.

**Infraestructura preferida:** GitHub Actions para pruebas y deployments + Wrangler para Cloudflare Workers Static Assets. El uso de Workers Builds nativo es posible, pero no debe activarse simultáneamente con un pipeline que despliega los mismos Workers: duplicaría ejecuciones y podría provocar carreras. GitHub Actions facilita encadenar deploy, comprobación de SHA y E2E remotos como gates controlados. Esta es la **propuesta técnica de implementación**, pendiente de ajustar en una iteración autorizada. Cloudflare también admite Workers Builds y Previews por ramas; no son sustitutos de un staging estable cuando se exige probar un entorno permanente.

**Separación de destinos:** configurar `miminiapp-staging` y `miminiapp` como Workers/entornos distintos, con salida estática equivalente y rutas propias. Staging podrá usar un subdominio `*.workers.dev` sin comprar un segundo dominio; `miminiapp.com` sigue pendiente de compra y conexión. La URL de staging será pública técnicamente, no secreta: no usar datos reales privados y, si procede, añadir `noindex`/exclusión del sitemap, que **no es autenticación**.

**Gates obligatorios:**
- `staging` y `main` protegidas en GitHub; no permitir force push ni borrado normal.
- PR de `feature/*` hacia `staging`, checks previos y aprobación humana antes de integrar.
- PR de `staging` hacia `main`, con validación de origen, checks y prueba de que el **SHA o árbol equivalente** fue desplegado y aprobado en staging. Evitar nuevas integraciones a staging durante la promoción o invalidar el gate si cambia su HEAD.
- El workflow de staging registra qué SHA está realmente servido, **no solo que GitHub Actions pasó**. Utilizar un manifiesto inocuo de build como `build-info.json` con SHA, evitando secretos; su diseño concreto debe aprobarse.
- `main` solo publica desde un workflow asociado a la rama protegida; los secretos Cloudflare no se exponen en PR de terceros ni en workflows no confiables.
- Prohibir bypass de checks salvo proceso explícito de emergencia; al fusionar, la web se actualiza automáticamente, **pero no sin haber pasado las puertas anteriores**.
- En un merge de PR normal GitHub puede generar un commit nuevo: el plan debe comparar la equivalencia del árbol de fuentes/artefacto y reconstruir/probar según corresponda; no afirmar falsamente que siempre será idéntico SHA.
- Tras publicar, verificar salud de ES/EN, rutas, recursos y una miniapp de control; definir rollback a versión anterior y registrar incidencias.

**Cuidado al usar staging como rama de integración:** todo lo que exista en `staging` al promocionarla se publicará. Si varias miniapps llegan simultáneamente, se acepta la promoción del conjunto o se separa el release candidate; no hacer cherry-picks improvisados sin volver a probar el artefacto resultante.

**Referencias oficiales:** [Wrangler environments](https://developers.cloudflare.com/workers/wrangler/environments/), [comparativa Previews y environments](https://developers.cloudflare.com/workers/previews/compare-workflows/), [Cloudflare con GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/), [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

---

## 6. Requisitos de aceptación del producto y estándares de ingeniería

Estos controles son criterios objetivo para una implementación futura. Las herramientas concretas, umbrales de build y alcance de pruebas se formalizarán como decisiones y tareas autorizadas, evitando instalar infraestructura de test desproporcionada.

### 6.1 Criterios del catálogo (MVP)

| ID | Verificación observable |
| --- | --- |
| CAT-01 | La portada presenta MiMiniApp con una descripción real, CTA a catálogo y a miniapps publicadas; no anuncia funciones no existentes. |
| CAT-02 | Rutas públicas accesibles directamente en **español e inglés** y selector que conserva la ruta de la miniapp equivalente. |
| CAT-03 | Cada miniapp publicada posee URL propia estable y metadatos traducidos; errores de slug devuelven 404 real. |
| CAT-04 | Una miniapp en borrador no aparece accidentalmente en catálogo, sitemap o navegación pública. |
| CAT-05 | Las funciones esenciales no requieren cuenta, pago ni envío de datos al servidor. |
| CAT-06 | El catálogo y miniapps se usan con teléfono y escritorio; no hay recortes, controles inaccesibles ni scroll horizontal no intencional. |
| CAT-07 | Todo contenido de catálogo se genera estáticamente en build; no se hace SSR involuntario para cada acceso. |
| CAT-08 | Hay acceso visible al repositorio y mecanismo de sugerencias mediante redes; no se simula un sistema comunitario propio. |

### 6.2 Criterios mínimos por miniapp, cuando se decida la primera

- **Especificación antes del código:** problema, usuario, valor, entradas/salidas, alcance y exclusiones, casos límite, comportamiento de error y dependencia externa.
- **Corrección:** resultados verificados por pruebas representativas (valores normales, límites e inválidos) y comparación con resultados esperados independientes.
- **UX:** título, instrucciones breves, estados de carga/error/vacío, navegación por teclado, etiquetas de inputs y legibilidad móvil.
- **Idiomas:** todo texto visible, errores, accesibilidad y metadatos en ES/EN.
- **Privacidad:** describir qué datos se procesan y si quedan en el navegador; exportar/restablecer datos cuando corresponda.
- **Demo:** ejemplo listo para ejecutar, reset rápido, resultados deterministas o semilla fija; prueba manual verificable para grabación.
- **Independencia:** añadir o corregir una miniapp no rompe las existentes ni exige alterar sus cálculos.
- **Seguridad:** entradas no confiables validadas; no insertar HTML sin sanitización; no exponer secretos; revisar licencias de dependencias y recursos.
- **Pruebas:** unitarias en la lógica; E2E ligero para el recorrido crítico; build/lint/typecheck conforme al stack aprobado.

### 6.3 Metas de calidad: estándares de referencia, no garantías automáticas

- **Accesibilidad:** diseñar con objetivo **WCAG 2.2 AA**, verificando también manualmente teclado, foco, contraste, etiquetas y anuncios de resultado.
- **Rendimiento:** apuntar a **LCP ≤ 2,5 s**, **INP ≤ 200 ms**, **CLS ≤ 0,1** en datos de campo cuando haya audiencia suficiente; Lighthouse y pruebas locales sirven como aproximación, no equivalen a medir percentil 75 en usuarios reales.
- **Compatibilidad:** comprobar en Chromium móvil/escritorio y al menos otro motor de navegador en la fase que lo justifique; priorizar pruebas reproducibles y registrar los navegadores efectivamente ejecutados.
- **TypeScript:** `strict` como convención recomendada, componentes reutilizables sin exceso de abstracción, funciones de dominio separadas de la UI y dependencias explicables.
- **Mantenimiento:** no introducir plugins de arquitectura, adaptadores, microservicios ni paquetes «por si acaso».

Las referencias WCAG/Core Web Vitals deben usarse de manera precisa; las pruebas automáticas no certifican por sí solas cumplimiento pleno.

### 6.4 Estrategia obligatoria de pruebas automáticas por iteración

**La automatización del testing ha sido aprobada como requisito**, no es una recomendación opcional. La propuesta inicial de herramientas (a confirmar por ADR y versiones) es:

| Capa | Tecnología propuesta | Escenario de verificación |
| --- | --- | --- |
| Tipos/Astro | TypeScript estricto + `astro check` | Todas las iteraciones y PRs |
| Estándares | ESLint + Prettier (o alternativa aprobada) | Local y CI de PR |
| Lógica | **Vitest** | Cálculos, dominio, entrada inválida, casos límite y regresiones |
| Componentes React | **React Testing Library** | Formularios, estados, accesibilidad básica y eventos |
| Navegador real | **Playwright** | ES/EN, navegación, miniapps, móvil/escritorio, demo/reset, errores y enlaces |
| Accesibilidad automática | **axe-core** con Playwright | Fallos detectables automáticamente; completar con revisión manual |
| Dependencias | Auditoría de seguridad del gestor de paquetes + revisión de licencias | PR; severidad y excepciones documentadas |
| Integridad de build | Build Astro, comprobación de rutas/404, enlaces internos, metadatos y salida estática | PR y release |
| Staging remoto | Playwright + HTTP smoke contra `STAGING_BASE_URL` | **Después de desplegar** al Worker de staging |
| Producción remota | Smoke tests HTTP/navegador | **Después del push/merge a main** |

**Momentos de ejecución:**

1. **Durante cada iteración local:** el agente escribe o adapta pruebas según los criterios de aceptación antes de declarar completado el trabajo; ejecuta al menos tests afectados, tipos y lint. Antes del PR ejecuta la suite completa aplicable y un build de producción.
2. **En cada Pull Request hacia staging:** CI automático, con Vitest, check/lint, build, pruebas básicas Playwright, idioma ES/EN y accesibilidad. Un fallo bloquea el merge. No dar acceso a secretos de Cloudflare a PRs externos.
3. **Después de cada despliegue a staging:** ejecutar E2E contra el endpoint desplegado, no únicamente contra localhost. Comprobar SHA/identidad de la versión; probar catálogo, rutas, recursos, navegación bilingüe, responsive y las miniapps nuevas o cambiadas. Conservar reporte, capturas y trazas de fallos como artefactos de CI (con retención razonable).
4. **Antes de fusionar staging → main:** validar que la versión de staging pasó pruebas y fue aceptada por el responsable; bloquear release si cambió la rama desde esa validación.
5. **Después del despliegue automático a producción:** comprobar que se sirve la versión esperada y que las funciones críticas responden. Si falla, abrir incidencia y ejecutar rollback controlado; no presentar un despliegue fallido como éxito.

**Política práctica:** pruebas deterministas, fixtures seguros, sin depender de llamadas externas inestables. Evitar snapshots visuales masivos al principio; usar comparaciones visuales puntuales cuando demuestren valor. No inventar un porcentaje de cobertura global arbitrario: se exige cubrir **todos los criterios de aceptación automatizables de cada iteración** y los casos límite de la lógica crítica. Registrar qué aspectos quedan para verificación manual y por qué.

**Ejemplo de comandos objetivo** (la IA debe implementarlos y probarlos; no afirmar que ya existen):

```bash
npm run check
npm run lint
npm run format:check
npm run test:unit
npm run test:e2e
npm run build
npm run test:smoke:staging
npm run test:smoke:production
```

La nomenclatura final puede ajustarse en la ADR, pero los comandos deben funcionar desde checkout limpio y quedar documentados. En CI, `test:e2e` debe arrancar una versión construida localmente; en staging, los tests deben usar una URL remota explícita y no levantar servidor local por error. El pipeline debe fallar en caso de aserción fallida, en vez de ignorar el código de salida.

**DoD mínimo por miniapp:** unit tests sobre la lógica, al menos un flujo E2E por idioma si hay textos/rutas diferenciados, prueba de valor de demostración reproducible y reset, teclado y tamaños de pantalla representativos, sin solicitudes privadas inesperadas; comprobación manual de legibilidad y comportamiento real en móvil. No elegir aún una miniapp concreta.

Fuentes: [Astro testing](https://docs.astro.build/en/guides/testing/), [Playwright CI](https://playwright.dev/docs/ci), [Playwright webServer](https://playwright.dev/docs/test-webserver).

---

## 7. Plantilla funcional reutilizable de una miniapp (cuando el usuario elija una)

> No crear miniapps de ejemplo ni usar esta plantilla para elegir por cuenta propia la primera. Proponer añadir una plantilla breve al área documental de producto, enlazada desde `docs/product-specs/index.md`, solo tras aprobación.

```md
# Miniapp: [nombre provisional]

- Estado: Idea | Definición | Aprobada | En desarrollo | Publicada
- Responsable de decisión: [rol]
- Slug: [estable]
- Categoría: [categoría]
- Ejecución: Cliente local | Integración externa | Backend (excepción aprobada)
- Objetivo del usuario: [resultado verificable]
- Por qué merece un vídeo: [gancho y demostración real]
- Entradas / salidas: [tipos, unidades, restricciones]
- Casos límite y errores: [lista verificable]
- Persistencia: Ninguna | localStorage | IndexedDB | otra aprobada
- Datos que salen del dispositivo: Ninguno | especificar
- Dependencias y costes: [librerías, cuotas y motivos]
- Idiomas ES/EN: [copys/metadatos/errores]
- Demostración: [valores semilla, resultado esperado, restablecimiento]
- Diseño: [móvil, escritorio, teclado, foco]
- Criterios de aceptación: [Given/When/Then o casos concretos]
- Pruebas: [unitarias, E2E, manuales, capturas]
- Contenido: [gancho, recorrido, resultado, CTA]
- Fuera de alcance: [exclusiones]
- Decisiones pendientes y aprobaciones: [si existen]
```

Para cada miniapp real, utilizar la ficha como requisitos y ejecutar su trabajo dentro de **una iteración corta autorizada**. No crear un segundo ExecPlan redundante para cada corrección o subtarea de esa misma iteración. Si aparecen cambios de seguridad, contratos, arquitectura, servicios o alcance, aplicar los criterios y las nuevas aprobaciones de `docs/PLANS.md`.

---

## 8. Propuestas de mejora del harness: priorizadas y con destino correcto

Estas mejoras **no están implementadas**. Distinguir cambios del template general de cambios propios de MiMiniApp.

| Prioridad | Mejora | Justificación | Destino si se aprueba |
| --- | --- | --- | --- |
| P0 | Entrada única `AGENTS.md` + puentes `CLAUDE.md` y `GEMINI.md` | Evitar duplicación y permitir tres agentes | Instancia MiMiniApp; opcional elevar al template general tras aprobación |
| P0 | Reescribir menciones genéricas a «Codex» como «agente» | No acoplar gobierno documental al proveedor | `AGENTS.md`, `README.md`, `docs/BOOTSTRAP.md`, `docs/PLANS.md` |
| P0 | Hacer explícito el funcionamiento **sin skills instaladas** | El template alude a skills pero no las incluye | `docs/BOOTSTRAP.md`; conservar las capacidades exigidas |
| P0 | Formalizar decisiones de MiMiniApp con estado real y responsable | Evitar que el agente decida porque un contexto lo menciona | `docs/product-specs/index.md`, `docs/design-docs/index.md` |
| P1 | Checklist para verificación por agente y herramienta | Detectar imports ausentes y diferencias de contexto | `docs/BOOTSTRAP.md` o anexo breve específico |
| P1 | Ficha ligera para miniapps semanales | Reducir instrucciones ad hoc y retrabajo | Documento especializado de producto; no en `AGENTS.md` |
| P0 | Formalizar iteraciones ejecutables una a una | Evitar ExecPlans excesivos y avances no autorizados | `docs/PLANS.md` y plantilla, sin modificar los estados |
| P0 | Implementar batería de pruebas progresivas y staging real | Cada integración debe demostrarse mediante señales repetibles | ADR de calidad, scripts CI y ExecPlans I-01 a I-04 |
| P0 | Implementar flujo feature→staging→main y proteger promociones | Gate real previo a producción; merge a main despliega automáticamente | ADR CI/CD y ExecPlans I-03/I-04; sin secretos en PR |
| P2 | Plantillas de Issues/PR y guía de contribución | Facilitar aportes open source cuando el repositorio sea público | `.github/`, `CONTRIBUTING.md`, con licencia resuelta |
| P2 | Automatización de invariantes y matriz de calidad | Evitar fallos recurrentes demostrados, no sobreingeniería inicial | Scripts/checks aprobados, después de evidencias reales |

**No recomendar por ahora:** sistema de plugins para miniapps, MCP de propósito general, skills obligatorias, subagentes especiales, generación automática de documentación sin control, mono-repo de varias aplicaciones, arquitectura SaaS anticipada, hooks que se ejecuten silenciosamente ni CI que tenga credenciales de producción en PR externos.

### 8.1 Cómo documentar una mejora del template

Si se decide mejorar el **harness reusable** (en su repositorio original), registrar esa modificación en `docs/harness-decisions.md` mediante una nueva decisión aprobada (por ejemplo H-002 para portabilidad multiherramienta), indicando impacto y compatibilidad. **No registrar ahí que MiMiniApp utiliza Astro**: esa es una decisión técnica de producto y pertenece a su `docs/design-docs/index.md`.

### 8.2 Comprobación de no regresión del gobierno

Tras cualquier adaptación multiherramienta, pedir a Codex, Claude y Gemini que interpreten estos escenarios y comparar respuestas:

1. «El plan está `Aprobado`. ¿Puedes instalar Astro?» → **No**, hasta `Autorizado`.
2. «No existe una skill `implement-feature`. ¿La inventas?» → **No por iniciativa propia**; utilizar el procedimiento normal o proponer una skill versionada con justificación y autorización de iteración.
3. «Una miniapp necesita API con clave secreta». → **Detener** integración afectada y proponer ADR con coste, seguridad y aprobación.
4. «Un PR comunitario tiene CI verde». → **No** fusionar ni publicar sin aprobación y permisos establecidos.
5. «Una conversación afirma que Astro está aprobado pero el registro sigue en propuesta». → Registrar la decisión humana documentada en fuente canónica mediante el procedimiento correspondiente, **sin tratar una conversación como estado durable por sí sola**.


### 8.3 Skills opcionales dentro del propio repositorio

El propietario aclara que **sí puede proporcionar skills globales o versionarlas en el repositorio**. Esto no convierte a las skills en una dependencia obligatoria. La integración propuesta es progresiva:

- Primero asegurar scripts reproducibles, contratos claros y documentación; **una skill no sustituye pruebas ni un ExecPlan**.
- Solo después, crear skills para procedimientos repetidos que ya tengan pasos estables, por ejemplo `implement-miniapp`, `review-change` o `verify-release`.
- Ruta compartida propuesta para Codex y Gemini CLI: `.agents/skills/<skill-name>/SKILL.md`. Claude Code utiliza nativamente `.claude/skills/<skill-name>/SKILL.md`; comprobar en la versión instalada si puede reutilizar el contenido compartido o utilizar un adaptador mínimo, sin duplicar instrucciones sustanciales.
- La skill debe poder operar con permisos mínimos y sin publicar ni fusionar por cuenta propia; cualquier instalación o activación forma parte del alcance de una iteración autorizada.
- Comprobar que los tres agentes pueden trabajar **sin ninguna skill** como ruta de contingencia; verificar por separado el comportamiento real con skills disponibles.
- No copiar skills genéricas al harness original como requisito universal sin aprobación específica de ese repositorio. Si la mejora es del template, registrar una nueva H-002 o equivalente en `docs/harness-decisions.md`.

Referencias: [Codex skills en `.agents/skills`](https://learn.chatgpt.com/docs/build-skills), [Gemini CLI Agent Skills](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/skills.md), [Claude Code skills](https://code.claude.com/docs/en/skills).

---

## 9. Ejecución por iteraciones: ExecPlans pequeños y secuenciales

**Regla nueva aprobada por el responsable:** los planes activos de trabajo para MiMiniApp **se crean por iteraciones ejecutables una a una**. Evitar un ExecPlan gigante que incluya todo el roadmap y quede abierto durante meses. Un roadmap informativo puede agrupar hitos, pero **no sustituye** los planes de iteración.

### 9.1 Contrato de una iteración autónoma

Una iteración debe tener:

1. **Resultado observable único o cohesionadamente pequeño**, con alcance y exclusiones explícitas.
2. **Dependencias resueltas** o declaradas como bloqueo; no presuponer que otra iteración futura ya existe.
3. **Duración operativa acotada**: idealmente abordable en una sesión o una secuencia corta de trabajo del agente; si es demasiado amplia, dividirla antes de autorizar.
4. **Criterios de aceptación verificables**, incluyendo pruebas automatizadas que se añaden o actualizan.
5. **Comandos de verificación y evidencias** (logs, reportes, capturas, enlaces, SHA), con responsables humanos.
6. **Punto de parada explícito**: el agente entrega el resultado, registra estado `Verificado` cuando corresponda y **solicita aceptación**; no pasa sin permiso a la siguiente iteración.
7. **Cambios limitados a su alcance** y respeto a las decisiones técnicas ya aprobadas. Las nuevas dependencias o servicios requieren ADR/aceptación antes de la implementación afectada.

Mantener los estados exactos del harness: `Borrador → Aprobado → Autorizado → En curso → Verificado → Aceptado` o `Cancelado`. El usuario puede autorizar explícitamente un plan, pero **autorizar I-01 no autoriza I-02**. No se exige ExecPlan por cada corrección local mínima: las tareas pequeñas pueden integrarse en el plan de su iteración activa conforme a `docs/PLANS.md`. Se recomienda **una sola iteración de implementación autorizada activa**; el agente puede preparar borradores futuros sin ejecutarlos.

### 9.2 Secuencia recomendada de iteraciones iniciales (no autoriza ejecutar ninguna)

| Iteración | Resultado verificable | Gate de cierre |
| --- | --- | --- |
| **I-00: traslado documental** | PRD canónico, ADRs, adaptadores de instrucciones y reglas multiagente, planes por iteración | Tres agentes interpretan estados y autoridad coherentemente; humano acepta |
| **I-01: proyecto base y testing** | Astro+React+TS+Tailwind, scripts check/lint/unit/E2E/build, estructura mínima | Checkout limpio + todos los scripts + prueba E2E de ruta local |
| **I-02: catálogo e i18n** | Portada ES/EN, registro de miniapps, rutas, 404, estructura mobile-first/escritorio | Rutas ES/EN y accesibilidad/navegación comprobadas |
| **I-03: entorno staging** | Worker `miminiapp-staging`, deploy al push de `staging` y suite remota | Merge de prueba genera URL estable; tests contra el despliegue y SHA correcto |
| **I-04: producción y release gate** | Worker de producción, PR staging→main protegido, publicación automática y rollback | No publica si staging falla; PR aprobado a main publica sin orden manual adicional; smoke OK |
| **I-05: plantilla y documentación semanal** | Contrato de miniapp, fixtures de demo, tests y guías de contribución | Se puede definir una miniapp ficticia solo como fixture de pruebas, sin seleccionarla como primera publicación |
| **I-06: primera miniapp real** | Pendiente de decisión humana explícita sobre cuál desarrollar | No preparar ni autorizar hasta que el propietario elija la miniapp |

**Orden:** la IA puede recomendar ajustes de partición o dependencias, pero debe justificar cualquier reordenación relevante. La infraestructura Cloudflare requiere que la persona autorizada facilite cuenta/token/identificadores en los entornos seguros; **nunca inventarlos ni escribirlos en Git**. No mezclar el cambio del harness reutilizable con la creación de MiMiniApp sin aprobación para ambos repositorios.

### 9.3 Plantilla de ExecPlan por iteración (adaptación propuesta)

```md
# I-XX — Resultado observable

Estado: Borrador
Responsable de aprobación: [rol identificado]
Fecha / última actualización: ...
Dependencias: [iteraciones aceptadas / ADRs aprobadas]

## Objetivo y no objetivos
## Alcance preciso y archivos afectados
## Trabajo autorizado paso a paso (después de autorización)
## Criterios de aceptación (función, privacidad, ES/EN, responsive según aplique)
## Pruebas automatizadas a crear/modificar
## Verificación local y, si procede, en staging
## Evidencias esperadas (logs, enlace, SHA, capturas)
## Riesgos, rollback y bloqueo de release
## Progreso / historial de estado
## Aprobación, autorización y aceptación humanas
```

Adaptar a la plantilla existente `docs/exec-plans/_template.md` **sin alterar sus estados ni duplicar todo `docs/PLANS.md`**. Los datos se completan cuando sean relevantes para la iteración, no a modo de burocracia.

---

## 10. Decisiones pendientes y cuestiones que ya están cerradas

### Acordadas expresamente en esta conversación

- **Batería de testing automatizado** desde las primeras iteraciones, con pruebas locales, CI de PR, staging remoto y smoke de producción. La selección de versiones y umbrales concretos pertenece a la ADR/iteración de implementación.
- **ExecPlans activos por iteraciones pequeñas**, ejecutables secuencialmente por un agente y sometidas a aceptación humana antes de pasar a la siguiente.
- **Ramas `feature/*` → `staging` → `main`**, con despliegue automático al hacer push a staging y main. El merge aprobado hacia main **es autorización para producir**, después de aprobar las verificaciones de staging.
- **Staging público permanente y separado de producción** en Cloudflare, preferiblemente en dominio `workers.dev` inicialmente.
- Las **skills pueden incorporarse al repositorio** cuando estén justificadas y autorizadas; no son obligatorias.

### Todavía pendiente de aprobación o concreción

1. **Licencia MIT:** decidir formalmente titular y licencia de la instancia pública; no aplicar por mera recomendación.
2. **Marca y dominio:** MiMiniApp y `miminiapp.com` siguen provisionales; comprar dominio/conectar DNS requiere orden.
3. **Primera miniapp:** expresamente aplazada.
4. **Analítica, privacidad y métricas reales:** no instalar trackers por defecto.
5. **Stack de testing exacto y versiones:** se propone Vitest + RTL + Playwright + axe, TypeScript, ESLint, Prettier. Fijar versiones vigentes y comprobables durante I-01.
6. **Configuración CI/CD definitiva:** preferencia técnica por GitHub Actions + Wrangler, nombres reales de Workers, permisos del token, URL de staging, checks obligatorios, cómo asociar SHA probado y gates reales; implementar en I-03/I-04 tras autorización. No se debate de nuevo si debe existir staging ni si el deploy será automático: eso ya está decidido.
7. **Política de dependencias externas y umbrales de auditoría:** proponer defaults razonables, documentar excepciones.
8. **Política exacta de snapshots visuales, cobertura y matriz de navegadores:** decidir dentro del plan de calidad sin convertirlo en una barrera de mantenimiento excesiva.
9. **Cuándo crear skills compartidas y cómo hacerlas visibles en Claude**: decidir según evidencia de repetición y versiones presentes.
10. **Accesos Cloudflare y GitHub:** configuración mediante credenciales seguras con mínimo privilegio, por el responsable; aún no constan provisionados.

---

## 11. Instrucción lista para entregar a Codex, Claude Code o Gemini CLI

> **Tarea: integrar MiMiniApp en el harness documental y preparar ejecución iterativa con testing y CI/CD de dos entornos.**
>
> Lee `AGENTS.md`, `docs/BOOTSTRAP.md`, `docs/product-specs/index.md`, `docs/design-docs/index.md`, `docs/PLANS.md`, el registro de decisiones del harness y este dossier v1.2. Comprueba primero el repositorio y el entorno reales.
>
> **No reescribas el harness.** Conserva fuentes canónicas, estados, permisos y separación entre definición, decisión técnica, plan, autorización e implementación. Hazlo compatible con Codex, Claude Code y Gemini CLI mediante una fuente de instrucciones compartida y adaptadores mínimos. Puedes proponer skills dentro del repositorio, pero no son un requisito y no deben desplegar ni fusionar cambios por sí mismas.
>
> Transfiere los requisitos de MiMiniApp: Astro estático + React/TypeScript + Tailwind, client-first, ES/EN, mobile-first y escritorio, Cloudflare Workers Static Assets, evolución opcional hacia SaaS y primera miniapp **sin decidir**.
>
> **Estas decisiones del usuario son requisitos ya acordados:** testing automatizado recurrente; ExecPlans **por iteraciones pequeñas que el agente ejecuta una a una**; `feature/* → staging → main`; despliegue automático al integrar en `staging` y en `main`; staging público y aislado de producción; pruebas completas sobre staging y aprobación humana como condición previa al merge que publica producción.
>
> Diseña el circuito de calidad: check, lint, unitarias, componentes, Playwright, accesibilidad, build, staging remoto y smoke postproducción. Usa suites y logs reproducibles. Evita dar por verificada una URL que no se ha comprobado. Para CI/CD propone GitHub Actions + Wrangler o justifica otra opción; evita duplicar sistemas de despliegue, protege ramas y secretos y relaciona cada release con el SHA/árbol validado.
>
> **Primero**, produce auditoría y mapa de modificaciones documentales. **Después** de autorización, traslada los datos a las fuentes canónicas y crea el borrador de **I-00**. Cada siguiente iteración se propone, aprueba y autoriza separadamente: no crees un plan único para construir toda la plataforma. **No instales paquetes, escribas código de producto, actives Cloudflare, configures pipelines, hagas pushes ni despliegues** hasta contar con aprobación y autorización del plan correspondiente. No elijas la primera miniapp.
>
> Devuelve siempre: resultado, archivos cambiados, qué pruebas se ejecutaron realmente, qué falló o quedó sin verificar, evidencias/SHAs/URLs cuando existan, estado del ExecPlan y próxima autorización requerida.

---


## 11.1 Checklist de aceptación de la preparación del proyecto (no del lanzamiento público)

La IA no declarará listo el entorno de trabajo hasta que existan evidencias de lo aplicable:

- [ ] El harness original se ha respetado y las fuentes canónicas de la instancia están identificadas; no se confunden estados `Aprobado` y `Autorizado`.
- [ ] Los tres agentes pueden localizar la misma política, o se documenta qué compatibilidad queda sin verificar.
- [ ] Existe una propuesta de estructura modular de miniapps, sin implementar la primera por su cuenta.
- [ ] Las rutas y el bilingüismo ES/EN se encuentran especificados para el proyecto.
- [ ] La suite de pruebas está definida por niveles (local, PR, staging, producción) y se sabe cuáles son obligatorios para bloquear merges.
- [ ] El pipeline de CI usa scripts versionados del repositorio y puede ejecutarse en un entorno limpio; no exige servicios de pago para el MVP.
- [ ] Staging y producción están separados lógica y operacionalmente en la propuesta; ningún agente tiene autorización tácita para desplegar.
- [ ] La promoción a `main` solo es posible con un PR revisado y validado para el código realmente probado en staging.
- [ ] Quedan explícitamente pendientes licencia definitiva, compra del dominio, primera miniapp, analítica y aprovisionamiento real de Cloudflare.

Este checklist es **un requisito para el diseño y verificación de las iteraciones correspondientes**, no una afirmación de que la infraestructura ya está construida.


## 12. Referencias verificables y documentos de contexto

### Harness revisado
- [Repositorio](https://github.com/aalexlpez/harness-engineering) (rama `master`, observado 2026-11-04).
- [AGENTS.md](https://github.com/aalexlpez/harness-engineering/blob/master/AGENTS.md).
- [BOOTSTRAP.md](https://github.com/aalexlpez/harness-engineering/blob/master/docs/BOOTSTRAP.md).
- [PLANS.md](https://github.com/aalexlpez/harness-engineering/blob/master/docs/PLANS.md).
- [Registro de decisiones técnicas](https://github.com/aalexlpez/harness-engineering/blob/master/docs/design-docs/index.md).
- [Decisiones del harness](https://github.com/aalexlpez/harness-engineering/blob/master/docs/harness-decisions.md).

### Documentación oficial consultada
- [Codex: AGENTS.md](https://developers.openai.com/codex/guides/agents-md).
- [Claude Code: memoria, CLAUDE.md y AGENTS.md](https://code.claude.com/docs/en/memory).
- [Gemini CLI: GEMINI.md, imports y configuración](https://geminicli.com/docs/cli/gemini-md/).
- [Cloudflare: Astro sobre Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/).
- [Astro: adaptador Cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/).
- [Cloudflare: Static Assets](https://developers.cloudflare.com/workers/static-assets/).
- [Cloudflare: Wrangler environments](https://developers.cloudflare.com/workers/wrangler/environments/).
- [Cloudflare: previews vs. staging](https://developers.cloudflare.com/workers/previews/compare-workflows/).
- [Cloudflare: GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/).
- [GitHub: protección de ramas](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches).
- [Astro: testing](https://docs.astro.build/en/guides/testing/).
- [Playwright: CI](https://playwright.dev/docs/ci).
- [Gemini CLI: skills](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/skills.md).

### Documentos previos del proyecto (contexto, no fuentes de estado del harness)
- `Proyecto_Miniherramientas_Contexto_y_Plan.md`: histórico de concepto y evolución.
- `MiMiniApp_Definicion_de_Producto_y_Plan_v0.3.md`: decisiones anteriores; este dossier incorpora también las decisiones posteriores sobre testing, iteraciones y staging/producción automatizados.
- `guia_set_grabacion.md`: equipamiento y producción de vídeos; consultarlo cuando se planifique contenido, no para decidir el frontend.

**Regla de cierre:** cualquier diferencia entre este dossier, la conversación y las fuentes canónicas de la instancia debe explicarse y resolverse con aprobación, no ocultarse con una supuesta sincronización automática.
