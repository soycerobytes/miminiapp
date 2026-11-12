# Arquitectura objetivo y decisiones aprobadas

**Estado:** base local I-01 aceptada y archivada; ADR-MMA-011/016/017 aprobados y ratificados el 2026-11-05. El propietario autorizó después expresamente ejecutar I-02, ahora Aceptado expresamente por el propietario el 2026-11-05 y archivado. Hosting/operación de I-03 aprobados con condiciones de Editor por Worker y prueba previa de gate; Fase A autorizada y En curso el 2026-11-06. Sin Workers, tokens o despliegues creados; Fase B no autorizada.
**Responsable:** propietario de MiMiniApp.
**Actualizado:** 2026-11-05.

El [registro de decisiones](index.md) conserva el estado de cada elección. La [arquitectura actual](../../ARCHITECTURE.md) describe lo que existe. Este documento sintetiza las secciones 5 y 6 del [dossier v1.2](../references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md); distingue el objetivo futuro de la base local I-01 y la implementación verificada de I-02. La arquitectura actual y el informe registran la evidencia; no se afirman servicios remotos o despliegues.

## Componentes y límites

La base aprobada es **Astro** estático, **React + TypeScript estricto** para interacción en navegador y **Tailwind CSS**, con las versiones y configuración del paquete I-01. El catálogo y las rutas ES/EN se implementan en I-02; la primera miniapp real sigue fuera de alcance. Cloudflare Workers Static Assets está aprobado en ADR-MMA-004 por indicación posterior del propietario el 2026-11-05: una cuenta y dos Workers, tokens account-owned Editor individuales tras creación administrativa controlada. No está provisionado; solo Fase A de preparación segura está autorizada.

No se propone instalar `@astrojs/cloudflare` para una salida puramente prerenderizada. SSR, sesiones, KV/D1, autenticación y procesos dinámicos quedan fuera; una necesidad real exigiría nueva evaluación y decisión. Versiones, compatibilidad, configuración y límites actuales de Cloudflare se comprobarán al preparar la iteración autorizada; el dossier no acredita disponibilidad o capacidad ilimitada.

## Modelo de ejecución

1. **Cliente local, predeterminado:** cálculos, experimentos, juegos individuales o archivos locales, con persistencia local opcional. No implica backend de MiMiniApp.
2. **API pública directa, excepción:** revisar CORS, cuotas, licencias, costes y datos transmitidos; requiere aprobación antes de integrar. No admite secretos privados en el frontend.
3. **Backend, excepción:** autenticación, pagos, almacenamiento remoto o cómputo servidor requieren análisis de seguridad/coste, decisión aprobada y plan autorizado. No se habilitan por evolución potencial a SaaS.

WebAssembly y Web Workers siguen siendo procesamiento cliente; si se proponen, deberán presupuestar descarga, memoria y batería en móviles. La persistencia de navegador no debe presentarse como respaldo garantizado.

## Organización modular aprobada

Para I-02 se formalizan las [decisiones modulares y de rutas](i02-catalogue-routing-proposal.md), aprobadas en ADR-MMA-011/016. Cada carpeta de miniapp separa `metadata.ts`, `entry.astro`, interfaz React cuando proceda, dominio, traducciones ES/EN y pruebas. Un registro explícito asocia los metadatos de las publicadas con un loader de su adaptador Astro; los borradores no declaran loader. El catálogo consume solo metadatos. La ruta común `pages/[locale]/apps/[slug].astro` genera publicadas × locales mediante getStaticPaths y resuelve su entrada durante prerender, sin serializar componentes o loaders en props.

El alta ordinaria añade una carpeta y una inscripción; no modifica rutas, layouts, navegación o módulos existentes. I-02 demuestra este comportamiento con fixtures A+D → A+B+D en un build aislado, conservando el build entregable vacío y sin sus artefactos. La firma del adaptador y la exclusión de chunks se comprobaron con Astro fijado; el [informe de ejecución](../i02-execution-report.md) registra resultados y límites.

Se aprueban `/es/` y `/en/`, español por defecto y slug estable; textos comunes separados de los de cada herramienta. `/` utiliza la entrada HTML estática aprobada, local de estado 200 con meta refresh/enlace a `/es/`; el propietario aprueba posteriormente para I-03 la raíz HTTP 301 a /es/, normalización de barras y 404 reales, aún pendientes de implementación y comprobación autorizadas. Las URL desconocidas requieren 404 real mediante un 404 estático bilingüe, sin fallback SPA. Barras finales, normalización del proveedor y canónicas/hreflang sin origen público se concretan en la propuesta, sin configurar Cloudflare.

Categorías, etiquetas, demo, fechas o dependencias específicas solo se añadirán al contrato cuando exista un uso aprobado; no se impone todo el registro futuro a I-02. La dirección Laboratorio creativo moderno, segunda composición, paleta, familias tipográficas y revisión mediante capturas están aprobadas en ADR-MMA-017. La [especificación visual](i02-visual-proposal.md) preserva las referencias y distingue detalles mecánicos por comprobar, evolución vacío→poblado y encuadres de miniapps legibles en 9:16. La [arquitectura actual](../../ARCHITECTURE.md) describe los archivos presentes y el estado de implementación; la aprobación del objetivo no acredita por sí misma su verificación.

## Entrega y validación

Los dos destinos estáticos separados y el flujo `feature/* → staging → main` se desarrollan en [fiabilidad](../RELIABILITY.md). Cuenta/subdominio confirmados por el propietario: miminiapp-lab.workers.dev; Workers previstos miminiapp-staging/miminiapp, sin recursos creados ni URLs desplegadas. La aprobación del diseño no autoriza provisión. Main mantiene strict nativo hasta demostrar el gate; no rebajarlo sin evidencia. `miminiapp.com` continúa como candidato opcional, sin compra o DNS.

## Límites y pendientes de ejecución

La definición, los siete ADR aplicables y el plan I-01 ya están aprobados. La ejecución de I-01 fue autorizada posteriormente y ya se comprobaron instalación, tipos, lint, unitarias/componentes y build. La parte de navegador fijado está completada con Chromium 156.0.8078.4 / revisión 1248, verify exit 0 y revisión asistida visual/teclado; I-01 Aceptado por el propietario el 2026-11-05. Registro/rutas/i18n y diseño de I-02 tienen sus decisiones aprobadas y el plan está Aceptado y archivado después de la ejecución autorizada, su verificación y la revisión personal de capturas reales por el propietario el 2026-11-05. Las decisiones de alojamiento/operación de I-03 están ahora aprobadas con condiciones; el plan fue Aprobado formalmente y después autorizado exclusivamente para Fase A de preparación segura. Verificación remota y Fase B pendientes. No se confunden decisiones aprobadas con infraestructura implementada. Ante una incompatibilidad se documenta y propone el ajuste mínimo; ajustes mecánicos cubiertos por ADR aprobados se aplican solo en ejecución autorizada, y cambios materiales requieren aprobación nueva. La [ficha de miniapp](../product-specs/miniapp-template.md) se utilizará cuando el propietario seleccione una; esta propuesta no elige la primera.

## Autorización limitada posterior — 2026-11-06

El propietario autoriza expresamente solo Fase A del ExecPlan I-03: preparación técnica y configuración segura, con commits/pushes técnicos sin publicaciones. Esta autorización posterior permite instalar las herramientas y preparar la infraestructura aprobada; no activa publicadores, crea Workers/tokens o autoriza Fase B. La [arquitectura actual](../../ARCHITECTURE.md) y el [informe](../i03-phase-a-report.md) distinguen archivos preparados y recursos remotos efectivos.
