# Paquete consolidado aprobado — I-01

**Estado:** Aprobado en sus bloques A/B/C; ejecución de I-01 autorizada posteriormente y resultado verificado por Codex y Aceptado expresamente por el propietario el 2026-11-05. **Fecha de aprobación:** 2026-11-04. **Actor:** propietario de MiMiniApp.

**Evidencia:** «Apruebo los tres bloques»; Bloque A, definición canónica; Bloque B, ADR-001/002/003/005/006/008 y ADR-015 con tecnologías y versiones; Bloque C, alcance y criterios de I-01. La aprobación se registra en las fuentes canónicas y no equivale a autorización de implementación.

Este paquete conserva los tres grupos revisados y aprobados expresamente: **A — definición**, **B — decisiones técnicas** y **C — plan I-01**. Aprobarlos no ejecuta el plan: su implementación requiere autorización expresa separada. Se preservan H-001, H-002 y la aceptación histórica de I-00.

## A — Definición de producto aprobada

La fuente canónica es [producto](../product-specs/index.md), Aprobada por el propietario el 2026-11-04 en su contenido completo, incluidos PROD-01–14, CAT-01–08 y sus exclusiones; este resumen no la sustituye:

* MiMiniApp es una colección web pública y abierta a contribuciones de miniapps de temática libre, con URL propia por herramienta, destinada al público general.
* Español e inglés completos desde lanzamiento, mobile-first con escritorio cuidado, corrección, accesibilidad y privacidad. Las herramientas deben ser útiles después de su demostración en vídeo.
* Procesamiento en el navegador por defecto; sin cuentas, backend, base de datos, pagos, sincronización o trackers iniciales. Persistencia local opcional solo cuando una miniapp futura la justifique; APIs o backend requieren una excepción aprobada.
* Ciclo flexible de aproximadamente una miniapp semanal y contenido audiovisual, dentro de 11–15 horas semanales; la calidad prima sobre el calendario. Ejemplos reproducibles y restablecimiento cuando corresponda.
* Portada, catálogo y herramientas bilingües son objetivos del producto, no entregables de I-01. El lanzamiento requiere al menos una miniapp real validada; no se elige la primera ni se fija el total inicial aquí.
* Marca/dominio provisionales, licencia/titular pendientes, analítica sin seleccionar y primera miniapp aplazada; esas decisiones se difieren explícitamente y no bloquean esta base local.

**Coincidencia verificada:** este contenido conserva las decisiones de producto trasladadas del dossier v1.2 y las restricciones reiteradas por el propietario. No se añaden funcionalidades ni se reabren las elecciones ya tomadas. La aprobación expresa posterior del Bloque A cambia el estado canónico de la definición; la conformidad anterior con el alcance por sí sola no lo hizo.

## B — Decisiones técnicas agrupadas

| Grupo | ADR aprobado | Ya elegido por el propietario | Concreción nueva incluida en este paquete |
| --- | --- | --- | --- |
| Base estática | ADR-MMA-001, 002 y 003 | Astro estático, React, TypeScript y Tailwind. | Versiones de la tabla inferior; TypeScript strict; integración oficial React y Tailwind mediante @tailwindcss/vite, sin SSR ni @astrojs/tailwind. |
| Límites de ejecución | ADR-MMA-005 y 006 | Client-first, sin backend/BD por defecto; excepciones sujetas a aprobación. | I-01 no añade persistencia, APIs ni secretos; solo fixture técnica local. |
| Calidad local | ADR-MMA-008 | Batería automatizada y verificaciones repetibles como requisito; Chromium móvil/escritorio como límite inicial ahora solicitado. | Vitest, React Testing Library, jsdom, Playwright, axe-core, ESLint y Prettier con versiones declaradamente compatibles, suites separadas y comandos concretos. |
| Toolchain reproducible | **ADR-MMA-015 (nueva decisión aprobada)** | Preferencias actuales: Node LTS compatible y npm. | Node 24.22.2 LTS + npm 11.19.1, versiones directas exactas y un package-lock.json; npm ci tras generar el lockfile durante ejecución autorizada. |

No se someten a aprobación en este paquete ADR-MMA-004/007/009/010/011/012/014: hosting, contribución remota, CI/CD, licencia, registro del catálogo, analítica y staging conservan sus pendientes. El contrato de trabajo por iteraciones (013 en el dossier) ya está en H-002/PLANS, no se convierte en ADR técnico.

### Convenciones concretas para evitar rondas menores

* TypeScript strict mediante la configuración estricta de Astro; configuraciones Node/DOM separadas cuando corresponda. Tipos de Node de la rama 24 y tipos React 19 coherentes con el runtime propuesto.
* ESLint flat config con reglas recomendadas de JavaScript, typescript-eslint, Astro y React Hooks; cero warnings permitidos. No se añade eslint-plugin-jsx-a11y 6.10.2 porque declara ESLint hasta 9 y aquí se propone ESLint 10. La accesibilidad se comprueba con axe y teclado/foco.
* Prettier con prettier-plugin-astro para código y configuración; se excluye la referencia original del dossier y no se reformatea el harness por defecto.
* Vitest: proyecto unit en entorno Node y proyecto components en jsdom, usando React Testing Library, user-event y jest-dom. La lógica probada debe estar utilizada realmente por la fixture técnica, sin funciones artificiales creadas para inflar recuentos.
* Playwright: únicamente proyectos chromium-desktop (perfil Desktop Chrome) y chromium-mobile (perfil Pixel 7, emulación Chromium). Esto no demuestra pruebas en un dispositivo físico. Sin Firefox, WebKit, browser channels externos ni una matriz de varios motores en I-01.
* Futuro: antes del lanzamiento, evaluar otro motor (Firefox o WebKit) según necesidades reales en una iteración posterior, mediante actualización de ADR-MMA-008 y su plan; no instalarlo ni afirmar cobertura ahora.
* E2E y axe contra el build estático local, con preview en 127.0.0.1:4321 y reuseExistingServer=false. El runner gestiona inicio/cierre, verifica la fixture esperada y conserva capturas/trazas en fallos. axe comprueba WCAG 2.2 AA detectable automáticamente; teclado/foco se revisan manualmente. Ninguno certifica por sí solo cumplimiento completo.
* Formulario técnico de comprobación con validación, respuesta y reset; no es catálogo ni miniapp. Casos válidos, vacíos/inválidos y límites, sin cálculos o productos elegidos por el agente.
* Dependencias directas exactas, lockfile versionado, sin force ni legacy-peer-deps; auditoría de dependencias altas/críticas sin resolver bloquea la entrega salvo excepción expresa justificada. Riesgos moderados/bajos se registran con evaluación y acción. Revisar licencias antes de incorporar; la licencia pública del proyecto sigue pendiente.
* Tests/build/reportes sin datos privados ni servicios de testing de pago obligatorios. Sin porcentaje global de cobertura arbitrario ni snapshots masivos. Los detalles mecánicos de nombres y disposición de archivos se resuelven dentro del alcance aprobado; cambios de arquitectura, servicios o dependencias relevantes siguen requiriendo decisión canónica.

## C — Plan aprobado y autorización posterior

El [ExecPlan I-01](../exec-plans/completed/I-01-base-local-y-testing.md) fue aprobado por el propietario el 2026-11-04 y autorizado posteriormente de forma expresa; su estado actual es Aceptado tras la verificación completa con Chromium fijado y la aceptación expresa del propietario el 2026-11-05; plan archivado en completed/. Su alcance se limita a la base funcional local y pruebas: instalación reproducible, página/fixture técnica, React hidratado, CSS compilado, comprobaciones de tipos/lint/formato, unitarias/componentes, E2E Chromium y axe/manual.

Los criterios y comandos exactos están en el plan. Catálogo, miniapps reales, i18n completo, CI remoto y despliegues quedan fuera. La aprobación de este paquete se refleja en las fuentes canónicas y en el estado Aprobado del plan; no daba por recibida la autorización separada para implementarlo. Esa autorización se recibe posteriormente y se registra en el ExecPlan, sin efectos retroactivos sobre la etapa de aprobación.

## Verificación de versiones previa a la ejecución

**Registro histórico de planificación:** los párrafos siguientes conservan las comprobaciones de metadatos anteriores a la autorización. El estado instalado y los resultados actuales están en el informe de ejecución; los futuros mencionados aquí describen aquella etapa.

Consultas HTTPS de solo lectura a los [metadatos oficiales npm](https://registry.npmjs.org/) y al [índice oficial de versiones Node.js](https://nodejs.org/dist/index.json) el 2026-11-04. Se comprobaron **70 relaciones declaradas** de engines Node/npm, peers requeridos y dependencias compartidas entre los paquetes seleccionados: ninguna incompatibilidad declarada detectada. No se instalaron, resolvieron en un lockfile, descargaron sus artefactos ni ejecutaron estos paquetes.

Node 24.22.2 figura como LTS Krypton y trae npm 11.19.1. Se prefiere esta rama LTS ya cercana al runtime observado en cloud, en lugar de cambiar de rama por usar la más reciente. En ejecución deberá activarse/verificarse exactamente el runtime aprobado.

Se descartó TypeScript 7.0.2 (latest observado): @astrojs/check 0.9.12 declara TypeScript ^5 o ^6 y typescript-eslint 8.72.1 exige <6.1.0. **TypeScript 6.0.3 satisface ambos**. Astro 7.4.5 y @astrojs/react 7.1.2 requieren Node >=22.23.4; Vite 8.3.5 acepta ^20.19 o >=22.12; jsdom 30.1.3 y eslint-plugin-astro 3.2.1 admiten la rama 24 elegida. Vitest 5.1.0 y @tailwindcss/vite 4.3.4 admiten Vite 8. React/DOM/tipos están dentro de los peers publicados.

Peers opcionales no utilizados (React Compiler, oxc-transform-react, canvas, otras herramientas de Vitest y plugins opcionales de lint) no se añaden. No se ha verificado todo el grafo transitivo, auditoría de seguridad, descarga de binarios ni compatibilidad en ejecución: npm ci, build, tipos y tests siguen siendo verificaciones futuras obligatorias tras autorización. Si la resolución revela un conflicto real, no se fuerza ni se presenta como éxito.

### Versiones exactas aprobadas

La tabla conserva las versiones aprobadas por el propietario. Durante la ejecución se han declarado las 31 dependencias directas exactas y congelado el grafo real en package-lock.json; npm ci lo reproduce sin cambios. La tabla también conserva la verificación previa de dos paquetes transitivos, sin reemplazar al lockfile como fuente de la resolución efectiva. npm es el gestor del runtime, no una dependencia de la aplicación.

| Paquete / herramienta | Versión aprobada | Metadatos consultados |
| --- | --- | --- |
| Node.js LTS Krypton | 24.22.2 | [Índice oficial](https://nodejs.org/dist/index.json) |
| astro | 7.4.5 | [npm](https://registry.npmjs.org/astro/7.4.5) |
| @astrojs/react | 7.1.2 | [npm](https://registry.npmjs.org/%40astrojs%2Freact/7.1.2) |
| react | 19.3.1 | [npm](https://registry.npmjs.org/react/19.3.1) |
| react-dom | 19.3.1 | [npm](https://registry.npmjs.org/react-dom/19.3.1) |
| @types/react | 19.3.0 | [npm](https://registry.npmjs.org/%40types%2Freact/19.3.0) |
| @types/react-dom | 19.3.0 | [npm](https://registry.npmjs.org/%40types%2Freact-dom/19.3.0) |
| tailwindcss | 4.3.4 | [npm](https://registry.npmjs.org/tailwindcss/4.3.4) |
| @tailwindcss/vite | 4.3.4 | [npm](https://registry.npmjs.org/%40tailwindcss%2Fvite/4.3.4) |
| vite | 8.3.5 | [npm](https://registry.npmjs.org/vite/8.3.5) |
| @vitejs/plugin-react | 6.2.1 | [npm](https://registry.npmjs.org/%40vitejs%2Fplugin-react/6.2.1) |
| @astrojs/check | 0.9.12 | [npm](https://registry.npmjs.org/%40astrojs%2Fcheck/0.9.12) |
| vitest | 5.1.0 | [npm](https://registry.npmjs.org/vitest/5.1.0) |
| @testing-library/react | 16.3.3 | [npm](https://registry.npmjs.org/%40testing-library%2Freact/16.3.3) |
| @testing-library/user-event | 14.6.8 | [npm](https://registry.npmjs.org/%40testing-library%2Fuser-event/14.6.8) |
| @testing-library/jest-dom | 7.0.1 | [npm](https://registry.npmjs.org/%40testing-library%2Fjest-dom/7.0.1) |
| jsdom | 30.1.3 | [npm](https://registry.npmjs.org/jsdom/30.1.3) |
| @playwright/test | 1.64.1 | [npm](https://registry.npmjs.org/%40playwright%2Ftest/1.64.1) |
| @axe-core/playwright | 4.14.0 | [npm](https://registry.npmjs.org/%40axe-core%2Fplaywright/4.14.0) |
| axe-core | 4.14.0 | [npm](https://registry.npmjs.org/axe-core/4.14.0) |
| eslint | 10.14.0 | [npm](https://registry.npmjs.org/eslint/10.14.0) |
| @eslint/js | 10.0.1 | [npm](https://registry.npmjs.org/%40eslint%2Fjs/10.0.1) |
| typescript-eslint | 8.72.1 | [npm](https://registry.npmjs.org/typescript-eslint/8.72.1) |
| eslint-plugin-astro | 3.2.1 | [npm](https://registry.npmjs.org/eslint-plugin-astro/3.2.1) |
| eslint-plugin-react-hooks | 7.1.1 | [npm](https://registry.npmjs.org/eslint-plugin-react-hooks/7.1.1) |
| prettier | 3.9.10 | [npm](https://registry.npmjs.org/prettier/3.9.10) |
| prettier-plugin-astro | 1.1.2 | [npm](https://registry.npmjs.org/prettier-plugin-astro/1.1.2) |
| globals | 17.14.0 | [npm](https://registry.npmjs.org/globals/17.14.0) |
| @typescript-eslint/parser | 8.72.1 | [npm](https://registry.npmjs.org/%40typescript-eslint%2Fparser/8.72.1) |
| @testing-library/dom | 10.4.2 | [npm](https://registry.npmjs.org/%40testing-library%2Fdom/10.4.2) |
| npm | 11.19.1 | [npm](https://registry.npmjs.org/npm/11.19.1) |
| typescript | 6.0.3 | [npm](https://registry.npmjs.org/typescript/6.0.3) |
| @types/node | 24.19.2 | [npm](https://registry.npmjs.org/%40types%2Fnode/24.19.2) |
| playwright-core (verificado transitivo) | 1.64.1 | [npm](https://registry.npmjs.org/playwright-core/1.64.1) |
| astro-eslint-parser (verificado transitivo) | 3.0.0 | [npm](https://registry.npmjs.org/astro-eslint-parser/3.0.0) |


## Condición de ejecución y ajustes

La autorización posterior para implementar se ha recibido y se registra en I-01; no modifica las versiones o restricciones aprobadas. Se verifica compatibilidad real mediante instalación, tipos, lint, pruebas automatizadas y build. Si una versión presenta incompatibilidades, documentar el problema y proponer el ajuste mínimo compatible: los ajustes mecánicos cubiertos por los ADR podrán aplicarse dentro del alcance autorizado, dejando evidencia y repitiendo comprobaciones; un cambio material de tecnología, arquitectura o alcance requiere nueva aprobación. No se instala ni se ejecuta I-01 para registrar estas aprobaciones.

La evidencia de ejecución y los ajustes mecánicos de CLI/tipos están en el [informe I-01](../i01-execution-report.md). La verificación final usa Chromium 156.0.8078.4 / revisión 1248: verify exit 0, 14+9+8 pruebas sin omisiones y revisión asistida visual/teclado correcta. I-01 Aceptado por el propietario el 2026-11-05. El bloqueo y la evidencia complementaria anterior se conservan como historia, sin cambiar el criterio aprobado.
