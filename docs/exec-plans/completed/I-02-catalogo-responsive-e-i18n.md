# I-02 — Catálogo, diseño responsive e internacionalización ES/EN

## Control

* **Estado:** `Aceptado`
* **Responsable de aprobación, autorización y aceptación:** Propietario de MiMiniApp.
* **Creado:** 2026-11-05.
* **Última actualización:** 2026-11-05.
* **Origen:** preparado inicialmente como borrador por instrucción del propietario después de aceptar I-01; la aprobación formal y la posterior autorización expresa se registran a continuación.
* **Dependencia satisfecha:** [I-01 — Base local y testing](../completed/I-01-base-local-y-testing.md), aceptada expresamente por el propietario el 2026-11-05.
* **Base local de referencia:** commit de cierre I-01 `0288de567fe7e1665973c6d8e128866962f66e2e`; no enviado al remoto. Este plan se prepara después y queda fuera de aquel commit.
* **Decisiones aprobadas, 2026-11-05:** el propietario aprueba registro modular, rutas ES/EN con español predeterminado, slugs estables, separación/validación de traducciones, Tailwind mobile-first y revisión por capturas. Aprueba Laboratorio creativo moderno, la segunda composición con etiqueta «Laboratorio creativo», titular «Ideas que se vuelven herramientas» y navegación móvil visible, paleta y Space Grotesk/DM Sans bajo accesibilidad/licencias. Se formaliza en ADR-MMA-011/016/017, ratificados expresamente por el propietario al aprobar este plan; su ejecución fue autorizada expresamente después de aprobar el plan.
* **Aprobación formal:** 2026-11-05, propietario de MiMiniApp: «Apruebo formalmente el ExecPlan I-02 — Catálogo, diseño responsive e internacionalización ES/EN», incluidos sus 14 criterios de aceptación. Se registra Borrador → Aprobado y la ratificación de ADR-MMA-011/016/017.
* **Autorización de ejecución:** recibida expresamente el 2026-11-05 del propietario: «Autorizo expresamente la ejecución de I-02 — Catálogo, diseño responsive e internacionalización ES/EN», conforme al plan y ADR-MMA-011/016/017. La autorización inicial excluía commits, pushes, despliegues, I-03 y miniapps reales; al aceptar el resultado se autoriza por separado únicamente el commit local de cierre y el borrador de I-03.
* **Bloqueos al autorizar:** ninguno acreditado. Autorización registrada conforme a [PLANS.md](../../PLANS.md). Las comprobaciones mecánicas de Astro, empaquetado, archivos de fuentes y contraste real se realizarán en ejecución autorizada; un hallazgo material detendrá el trabajo afectado y se comunicará. Cloudflare se comprueba en I-03 y no bloquea la base local de I-02.

* **Aceptación del resultado:** 2026-11-05, propietario de MiMiniApp: «Acepto expresamente I-02 como propietario de MiMiniApp». Declara haber revisado personalmente las capturas reales de escritorio y móvil y estar conforme con diseño visual, arquitectura modular y verificaciones. Autoriza archivar este plan y crear un commit local de I-02, sin archivos temporales ni evidencias ignoradas. Solo autoriza preparar el borrador de I-03; no ejecutarlo, hacer pushes o desplegar.

## Objetivo y resultado esperado

Sustituir la portada provisional de la base local por una portada y catálogo estáticos, veraces y utilizables en móvil y escritorio, con acceso directo y navegación completos en español e inglés. El resultado debe poder revisarse localmente sin cuentas ni servicios externos. El catálogo puede estar vacío: no se selecciona, anuncia ni implementa una miniapp inexistente para completar esta iteración.

Se desarrolla una parte acotada del [producto aprobado](../../product-specs/index.md), especialmente PROD-01/03/04/05/09/14 y CAT-01–08. I-02 no equivale al lanzamiento del MVP: la primera miniapp real, su ficha funcional, demo y validación pertenecen a una iteración posterior.

## Alcance

* Portada con propósito de MiMiniApp, acceso al catálogo y estado vacío útil y traducido cuando no haya herramientas publicadas. La composición revisada reúne portada y catálogo en el índice de cada idioma, con acceso al catálogo mediante ancla y navegación móvil visible.
* Estructura visual común: cabecera, navegación, selector de idioma, contenido principal y pie. Jerarquía y lectura claras en móvil y escritorio, sin depender de hover ni de un ancho fijo.
* Contenido ES/EN completo de las páginas creadas: texto visible, nombres accesibles, navegación, estado vacío, mensajes aplicables, título, descripción y atributo `lang`. Cambio al contenido equivalente y acceso directo por URL según la decisión aprobada.
* Registro estático mínimo y validación del catálogo conforme a ADR-MMA-011 aprobado. El contenido público inicial será vacío mientras no exista una miniapp real aprobada; las entradas sintéticas se limitarán a pruebas.
* Tratamiento de rutas inexistentes, locales no admitidos y enlaces inválidos, con respuesta 404 observable según el contrato aprobado. No se publican páginas simuladas de herramientas para probar el catálogo.
* Pruebas automatizadas y revisión manual de las páginas y comportamientos introducidos, conservando cobertura relevante de la base I-01.
* Actualización de la arquitectura actual y documentación de uso/verificación para describir únicamente lo implementado cuando la ejecución esté autorizada.

## Exclusiones relevantes

No incluye elegir o desarrollar la primera miniapp, buscador/filtros sin necesidad real de catálogo, motor de plugins, cuentas, pagos, backend, base de datos, persistencia, APIs, analítica, formularios propios de sugerencias, licencia o contribuciones públicas. No añade dependencias ni cambia versiones fijadas. Una necesidad material no prevista requiere propuesta y aprobación antes de ejecutarse.

No incluye CI/CD, Cloudflare, staging, producción, DNS, compra de dominio, publicación del entorno, despliegues ni una URL pública. Tampoco define una estrategia SEO completa, sitemap, datos estructurados o medición de rendimiento en campo. Los metadatos básicos traducidos sí están incluidos; las decisiones sobre canónicas y `hreflang` se resuelven expresamente sin inventar un dominio de producción.

La planificación no realizó verificaciones de aplicación. La ejecución autorizada de I-02 verifica los cambios de producto y conserva las regresiones pertinentes de I-01.

## Decisiones aprobadas aplicables

El [registro técnico](../../design-docs/index.md) es la fuente canónica. Se conservan ADR-MMA-001/002/003/005/006/008/015: Astro estático, React y TypeScript estricto para interacción cuando proceda, Tailwind, procesamiento local sin backend ni servicios por defecto, pruebas reproducibles y toolchain fijada. No se fuerza hidratación React para navegación que pueda resolverse con enlaces HTML.

Se mantienen Node 24.22.2, npm 11.19.1, versiones exactas y lockfile de I-01. Playwright 1.64.1 emplea Chromium 156.0.8078.4 / revisión 1248 suministrado por Playwright, con proyectos de escritorio y emulación móvil ya configurados.

**ADR-MMA-011/016/017 están `Aprobada` por indicación expresa del propietario el 2026-11-05**, con alcance y evidencias en el registro técnico. La aprobación comprende contrato modular, rutas/i18n y diseño/revisión descritos; no equivale a implementación verificada; el ExecPlan está Aceptado por el propietario, tras la ejecución autorizada y su verificación. Hosting, analítica, licencia general del proyecto y flujos remotos conservan sus estados propios y quedan fuera. La [arquitectura actual](../../../ARCHITECTURE.md) se actualiza al implementar y verificar el cambio.

## Arquitectura modular aprobada y detalle de referencia

El [contrato modular y de rutas](../../design-docs/i02-catalogue-routing-proposal.md) desarrolla ADR-MMA-011/016 aprobados. La estructura y el flujo siguientes concretan esas decisiones; son la referencia para implementar y comprobar el código durante esta ejecución.

```text
src/
  pages/index.astro                     # entrada estática predeterminada
  pages/404.astro                       # 404 estático bilingüe
  pages/[locale]/index.astro            # portada y catálogo ES/EN
  pages/[locale]/apps/[slug].astro       # única ruta genérica de herramientas
  layouts/                             # shell compartido
  components/                          # navegación, catálogo y controles comunes
  lib/miniapp-registry.ts               # registro explícito y proyección pública
  i18n/common/{es,en}.ts                 # textos de plataforma
  miniapps/<slug>/
    metadata.ts                        # descriptor sin importar UI
    entry.astro                        # adaptador local; recibe locale
    App.tsx                            # interacción React si procede
    domain/                            # lógica pura de la herramienta
    i18n/{es,en}.ts                     # textos propios
    tests/                             # pruebas propias
```

**Contrato:** descriptor tipado con `id`, `slug`, `status: draft | published` y título/descripción ES/EN. El slug es estable e idéntico entre idiomas, ASCII en minúsculas con guiones (`^[a-z0-9]+(?:-[a-z0-9]+)*$`); se rechazan duplicados, espacios y segmentos de ruta. Cambiar una URL estable exige una decisión posterior explícita. El registro es una unión discriminada: una inscripción publicada añade un `loadEntry` con importación literal perezosa de su adaptador; una inscripción en borrador no puede declarar loader de UI. No hay descubrimiento automático, plugin engine o condiciones por slug en las páginas comunes.

**Conexión con Astro:**

1. Validar el registro y obtener una proyección de metadatos publicados para el catálogo, sin ejecutar loaders ni cargar UI de herramientas.
2. `getStaticPaths()` de la portada genera los dos locales. El de la ruta genérica genera el producto de **miniapps publicadas × ES/EN**.
3. Cada ruta recibe parámetros `locale`/`slug` y un id simple en props; no se serializan componentes ni funciones.
4. El frontmatter resuelve la inscripción publicada por id y carga su `entry.astro` durante prerender. El layout común recibe metadatos localizados y la entrada recibe el locale tipado.
5. Cada adaptador conserva una importación estática de su propia isla React, cuando la necesite. No se confía en aplicar `client:*` a un componente React descubierto dinámicamente.
6. Los borradores carecen de rutas públicas y loader; el build entregable excluye sus marcas, HTML y chunks de UI. Los fixtures nunca se inscriben en el registro de producción.

**Alta ordinaria semanal:** carpeta nueva de la miniapp y una inscripción en el registro. No requiere modificar rutas genéricas, layouts, navegación, diccionarios comunes ni otras miniapps. Una capacidad compartida nueva se justifica y revisa por separado. El catálogo no hidrata todas las miniapps ni descarga sus interfaces por estar registradas.

**Límites:** dominio sin React, Astro, DOM ni traducciones; ningún módulo importa internamente otro. Las miniapps pueden consumir componentes/utilidades comunes aprobados. Los componentes comunes y diccionarios de plataforma no importan miniapps ni el registro; no hay estado global de herramientas o estilos que alteren otros módulos.

La importación y render de adaptadores Astro y la exclusión efectiva de chunks se contrastarán con Astro 7.4.5 y su build durante la ejecución autorizada. No se presentan como comportamiento ya implementado o verificado. Si para materializarlos hace falta alterar el contrato o el stack, se vuelve a propuesta antes de cambiarlo.

## Internacionalización aprobada y comportamiento estático

Se aprueba separar traducciones comunes de plataforma (`src/i18n/common/`) de las de cada miniapp (`src/miniapps/<slug>/i18n/`). Paridad de claves y traducciones requeridas validadas; una ausencia obligatoria falla el build y no cae silenciosamente al otro idioma. El catálogo usa únicamente los textos de sus metadatos, sin cargar diccionarios de UI de herramientas. `Intl` presenta valores según el locale sin modificar el dato de cálculo. Selector con enlaces HTML, sin detectar idioma del navegador, cookies o localStorage.

| Caso | Contrato de I-02 y alcance diferido |
| --- | --- |
| `/es/` y `/en/` | Portada y catálogo en cada idioma. Español predeterminado; selector conserva la página equivalente. |
| `/es/apps/<slug>/` y `/en/apps/<slug>/` | Slug idéntico entre idiomas. Generadas solo para miniapps publicadas; I-02 puede entregar cero rutas de herramienta. |
| `/` local | HTML con `lang="es"`, enlace accesible a `/es/` y `meta refresh` inmediato hacia `/es/`. El documento estático devuelve **200**, no 301; no necesita JavaScript. |
| `/` en Cloudflare futuro | Proponer redirección **HTTP 301** a `/es/` en el alojamiento; configuración y comprobación se reservan a I-03. El HTML de entrada se conserva como fallback. |
| `/fr/`, rutas desconocidas o slugs de borrador | **404 real**, sin redirección silenciosa a español y sin fallback SPA que entregue 200. |
| 404 global | Un `404.html` con mensajes breves ES/EN, bloques con su `lang` y enlaces a ambos inicios; funciona sin scripts. No simular el error mediante páginas `/es/404/` de estado 200. |
| Barras finales | Rutas generadas y enlaces terminan en `/`. La normalización HTTP del preview y el proveedor se contrastará sin prometer estados idénticos entre plataformas. |

La comprobación del alojamiento estático en Cloudflare queda reservada a I-03; el producto/contrato de despliegue y ADR-MMA-004 conservan su estado pendiente. No se presume que Workers Static Assets y Pages se configuren igual. No se crean `_redirects`, Wrangler, Workers o reglas del proveedor en I-02. Se exigirá `404.html` y manejo de errores sin modo SPA al preparar infraestructura. Título, descripción y `lang` sí forman parte de I-02; canónicas/hreflang absolutos se difieren hasta tener origen público aprobado, conservando el mapa ES/EN.

## Diseño aprobado y detalles de referencia

**Elección del propietario:** Laboratorio creativo moderno; limpio, profesional y minimalista con rasgos creativos, distintivos y reconocibles para web y vídeo. Paleta base: fondo `#F7F5F0`, texto `#242136`, violeta `#7950F2`, lima `#B9F65A` y coral `#FF9368`. El propietario aprueba la segunda composición revisada, con la etiqueta «Laboratorio creativo», el titular «Ideas que se vuelven herramientas» y navegación móvil visible. Los ajustes menores de tokens y los archivos finales se concretarán y verificarán dentro de esta dirección, sin nuevas alternativas ni dependencias visuales adicionales.

La [especificación visual](../../design-docs/i02-visual-proposal.md) registra la aprobación y conserva tokens, componentes, contrastes y láminas de referencia. Se aprueban Space Grotesk para títulos y DM Sans para lectura, con accesibilidad y licencias; se priorizan fuentes y gráficos locales, sin dependencias visuales nuevas ni servicios externos innecesarios. Se incorporan los TTF variables locales ya utilizados en las maquetas, con procedencia y avisos SIL OFL verificados, sin añadir dependencias de conversión. WOFF2 queda como optimización posterior; se comprueban cobertura, pesos y carga real de los archivos finales. La elección mecánica del formato conserva las familias aprobadas.

| Elemento | Referencia de la composición aprobada |
| --- | --- |
| Composición | Portada editorial con título breve, CTA de catálogo y motivo geométrico de laboratorio; catálogo real vacío con un estado útil. Sin herramientas ficticias. |
| Responsive | Una columna móvil, rejilla de dos/tres columnas cuando el contenido lo permita y ancho mínimo aproximado de tarjeta 280 px; contenedor de lectura máximo 1200 px. Revisión a 320/393/768/1280/1440 px. |
| Tipografía | Hero 44 px móvil (38 px a 320), hasta 76 px escritorio; cuerpo/controles mínimo 16 px, ayudas 14 px y longitudes ES/EN sin recortes. |
| Tokens | Unidad de 4 px; escala 4/8/12/16/24/32/48/64/96; radios 12 px controles, 20 px tarjetas y 28 px paneles. |
| Navegación | Marca al inicio del idioma, catálogo por ancla y selector ES/EN visibles. Sin menú oculto por rutina ni dependencia de hover; salto al contenido y foco visible en implementación. |
| Botones y enlaces | Primario violeta/blanco, secundario claro/tinta, objetivos de al menos 48 px, estados hover/pulsado/foco/deshabilitado. El cambio de página o ancla usa enlaces. |
| Tarjetas | Superficie clara, icono, título y resumen; un enlace descriptivo por tarjeta, sin controles anidados. Solo se muestran herramientas reales publicadas. Los especímenes de revisión están separados del catálogo. |
| Componentes comunes | Shell, cabecera/pie, selector, enlace/botón, sección, tarjeta/rejilla, etiqueta, estado vacío y mensajes; una fuente de tokens, sin estilos globales por miniapp. |
| Color y foco | Blanco/violeta 4.95:1; tinta/lienzo 14.32:1. Lima y coral llevan texto oscuro. Foco propuesto de tinta 3 px con separación, sin depender solo del color para estados. |
| Movimiento | Transiciones breves 120–180 ms; sin animación continua, parallax o movimiento que perjudique lectura/grabación; respetar movimiento reducido. |

**Referencias visuales de la composición aprobada:** [escritorio](../../design-docs/assets/i02/escritorio.png), [móvil](../../design-docs/assets/i02/movil.png), [ES/EN](../../design-docs/assets/i02/escritorio-en.png), [tarjetas y estados](../../design-docs/assets/i02/catalogo-especimenes.png), [escena vertical de portada](../../design-docs/assets/i02/video-9x16.png) y [escena vertical de catálogo](../../design-docs/assets/i02/video-catalogo-9x16.png). El [concepto generado](../../design-docs/assets/i02/concepto-laboratorio.png) es exploración artística; las demás láminas son renders de una maqueta estática aislada con las fuentes propuestas. Ninguna es captura de I-02 implementada.

Los encuadres 1080×1920 muestran dos momentos de una grabación móvil (portada y scroll al catálogo), con márgenes editoriales orientativos. Las superposiciones reales de TikTok/Reels/Shorts se comprobarán al grabar; no se promete una zona segura universal ni se implementa un modo de vídeo en la web.

## Decisiones formalizadas y comprobaciones de ejecución

Las aprobaciones expresas del propietario quedan formalizadas sin volver a solicitarlas. Se distingue su alcance de las comprobaciones técnicas futuras y de la autorización de ejecución, recibida expresamente; ambas están registradas.

| ID | Decisión aprobada | Comprobación o alcance pendiente |
| --- | --- | --- |
| I02-D1 | ADR-MMA-011 aprobado: contrato tipado, conexión a la interfaz, registro explícito y alta sin cambiar rutas/layouts/otras miniapps. | Contrastar la firma concreta del adaptador y su empaquetado con Astro fijado durante ejecución autorizada; no es una aprobación humana duplicada. |
| I02-D2 | ADR-MMA-016 aprobado: `/es/`, `/en/`, español predeterminado, slug estable y raíz compatible con generación estática hacia `/es/`; 404 reales. | Verificar localmente el HTML/redirección estática y barras. La configuración, política HTTP definitiva y prueba de Cloudflare pertenecen a I-03; el 301 futuro sigue como propuesta diferida. |
| I02-D3 | ADR-MMA-016 aprobado: traducciones comunes y propias separadas, obligatoriedad/paridad de claves y equivalencia ES/EN. | Validar ausencia de traducciones requeridas en las pruebas. Origen público y SEO absoluto siguen diferidos, sin bloquear I-02. |
| I02-D4 | ADR-MMA-017 aprobado: segunda composición, paleta, familias tipográficas, Tailwind responsive, evolución vacío→poblado y recursos locales sujetos a accesibilidad/licencias. | Comprobar tonos/estados reales, reflujo y archivos/licencias finales; ajustes menores dentro de la decisión. Un cambio material exige decisión expresa, no generar otras alternativas por rutina. |
| I02-D5 | Revisión aprobada: entregar capturas accesibles desde Codex Cloud de móvil/escritorio y ensayos 9:16, junto con evidencia automatizada. | Asociar capturas al build probado y comprobar sus enlaces para el propietario. No requiere una URL pública; los destinos externos no confirmados se omiten. |

El plan final fue Aprobado y después Autorizado por el propietario; su implementación está verificada y aceptada por el propietario. Las decisiones ya aprobadas no requieren repetirse. Si una comprobación futura exige cambiar materialmente arquitectura, alcance o dependencias, se comunica antes de adoptar ese cambio.

## Trabajo previsto

Autorización expresa recibida el 2026-11-05:

1. Confirmar estado de la base aceptada y vigencia de las decisiones. Registrar el paso a `En curso`; no reinstalar ni actualizar paquetes por rutina.
2. Aplicar el contrato aprobado de catálogo, rutas e idiomas con el mínimo de módulos necesarios. Validar registros y traducciones; mantener separado el contenido sintético usado por las pruebas del build entregable.
3. Crear portada/catálogo ES/EN, estructura visual responsive y tratamiento de rutas inexistentes. Preservar comprobaciones útiles de I-01 al adaptar la portada provisional; no dejar la fixture presentada como miniapp publicada.
4. Añadir o ajustar pruebas relevantes y comprobar móvil/escritorio, teclado y traducciones. Corregir defectos dentro del alcance; una decisión material nueva detiene el camino afectado hasta su aprobación.
5. Actualizar documentación y registrar evidencia real, límites y deudas. Proporcionar el medio de revisión acordado y dejar I-02 `Verificado` para aceptación humana si se cumplen todos los criterios.

## Entorno y herramientas

Se reutilizan runtime, dependencias, configuración de Playwright y scripts existentes descritos en [README](../../../README.md) y el [informe I-01](../../i01-execution-report.md). `npm ci` solo será necesario si faltan dependencias o el entorno necesita reconstruirse; no se modifica el lockfile ni se instala una biblioteca de i18n por preparar el plan.

La instalación futura del navegador, si fuera necesaria, y las pruebas usarán el mismo `PLAYWRIGHT_BROWSERS_PATH`. Se registrará la revisión y ruta real del ejecutable de Playwright; no se usará `channel` ni `executablePath` para seleccionar Chromium del sistema. Si la descarga falla, registrar URL/dominio/error exacto y comunicar el bloqueo antes de modificar red o sustituir navegador.

Desarrollo y preview locales existentes escuchan en `127.0.0.1:4321`; Playwright gestiona su preview y no reutiliza otro servidor. Estos procesos no proporcionan por sí solos una URL pública. No se introduce contenedor, servicio remoto ni automatización de despliegue.

## Criterios de aceptación

| ID | Resultado observable |
| --- | --- |
| I02-AC1 | Portada y catálogo describen el producto con veracidad y se pueden abrir directamente en ES/EN según las rutas aprobadas. Con cero miniapps publicadas muestran un estado vacío útil; no aparecen cards, contadores, demos o enlaces de herramientas inexistentes. |
| I02-AC2 | El contrato aprobado valida identificadores/slugs y traducciones requeridas; casos sintéticos publicados/borrador se verifican en pruebas aisladas. El build entregable no incluye esos fixtures ni expone borradores en catálogo, navegación o rutas públicas. |
| I02-AC3 | El cambio de idioma desde cada página creada conserva el contexto equivalente; enlaces y navegación admiten teclado y no dependen de detectar idioma automáticamente. La equivalencia de futuras miniapps se verifica a nivel del contrato sin publicar una herramienta ficticia. |
| I02-AC4 | Texto visible, nombres accesibles, estado vacío, mensajes aplicables, título, descripción y `lang` corresponden al idioma elegido. No hay claves crudas ni mezclas involuntarias ES/EN; las traducciones incompletas exigidas por el contrato fallan la validación. |
| I02-AC5 | Rutas inexistentes y slugs de borrador no entregan una página de herramienta ni un 200 engañoso. Se comprueba el estado HTTP 404 y recuperación comprensible en el preview local; el comportamiento de `/` y locales desconocidos coincide con la decisión aprobada. |
| I02-AC6 | A 320, 393, 768, 1280 y 1440 px de ancho no hay recortes ni scroll horizontal accidental. Cabecera, idioma, catálogo/estado vacío y pie conservan lectura y acceso; se revisa zoom del navegador y contenido ES/EN de distinta longitud. |
| I02-AC7 | Navegación completa con teclado, foco visible, orden lógico, regiones y encabezados semánticos y controles etiquetados. Axe no detecta incidencias incluidas en la configuración aplicable en ES/EN y ambos proyectos de Chromium; revisión manual complementaria registrada, sin declarar certificación WCAG completa. |
| I02-AC8 | El recorrido esencial no requiere cuenta ni servicios externos. No se añaden trackers, peticiones de datos a terceros ni persistencia. Los enlaces externos opcionales apuntan a destinos confirmados y no se presenta licencia o comunidad sin respaldo. |
| I02-AC9 | Pasan las verificaciones pertinentes con el stack y Chromium fijados; las regresiones de I-01 afectadas se mantienen o adaptan con una justificación funcional. Arquitectura y documentación distinguen lo implementado de lo todavía propuesto. |
| I02-AC10 | El propietario dispone del medio de revisión acordado y de evidencia trazable de criterios, resultados y límites. La entrega queda pendiente de aceptación expresa; no se realiza push ni despliegue por completar la verificación. |
| I02-AC11 | Extensión sintética A publicada + D borrador → A/B publicadas + D: añadir B cambia solo su fixture/carpeta y una inscripción del registro de prueba. La ruta genérica y layout existentes generan las cuatro rutas ES/EN correctas y renderizan A/B, sin editar plataforma, textos comunes o A. Comparar resultados de A antes/después y verificar que el catálogo no ejecuta loaders y D no tiene ruta/UI cargada. |
| I02-AC12 | La prueba anterior incluye un build de integración aislado que reutiliza el contrato y la ruta genérica en una salida temporal distinta. El build entregable vacío no contiene ids, marcas, rutas, HTML, assets o chunks de los fixtures/borradores. Sin bandera que publique fixtures en producción; sin importar dominios de otras miniapps. |
| I02-AC13 | La implementación coincide con la propuesta visual aprobada: tipografías/jerarquía, paleta/tokens, espaciado, tarjetas y estados consistentes en ES/EN. Texto normal ≥4.5:1 y contraste funcional aplicable ≥3:1, foco visible no oculto y estados no basados solo en color. Revisión humana de jerarquía, legibilidad, composición y acabado, apoyada por capturas; sin certificar WCAG completo por las capturas. |
| I02-AC14 | Se entrega un ensayo de captura vertical 1080×1920 del resultado implementado, con portada y scroll al catálogo legibles, sin recortes de controles o textos esenciales. Se revisan superposiciones de la plataforma elegida con el propietario; las reservas de las maquetas son orientativas. No requiere modo de vídeo, animación o miniapp ficticia. |

### Concreciones conservando I02-AC1–14

* **AC10 / revisión:** entregar archivos PNG accesibles mediante enlaces de Codex Cloud para móvil y escritorio, ES/EN y estados relevantes; identificar el build probado y registrar revisión del propietario. Las capturas no sustituyen pruebas de rutas/HTTP ni su aceptación.
* **AC11–13 / vacío a poblado:** la misma sección de catálogo recibe la lista publicada; con cero entradas muestra EmptyState y con una/varias utiliza la misma rejilla y tarjetas. Shell, hero, cabecera, navegación, layouts y tokens no se rediseñan. Los textos comunes de ambos estados se definen una vez y se seleccionan por los datos publicados; añadir una herramienta no añade sus textos a diccionarios comunes. Demostrar cero/una/varias entradas con fixtures aisladas y sin modificarlas en producción.
* **AC14 / miniapps en 9:16:** documentar encuadres con la interfaz móvil real, no reducir una página de escritorio completa hasta hacerla ilegible. Mantener texto de UI ≥16 CSS px y controles ≥48 px; al componer en 1080×1920 usar como referencia texto esencial de aproximadamente 28–32 px o mayor, revisado visualmente. Dividir recorridos largos en escenas de entrada/acción/resultado mediante scroll o recorte editorial, sin ocultar validaciones, manipular resultados o cambiar la función para el vídeo. Los márgenes dependen de la plataforma y deben revisarse con el propietario. I-02 usa muestras aisladas para la documentación; la primera miniapp real sigue fuera de alcance.
* **Recursos:** preferir SVG/gráficos propios y fuentes autoalojadas cuando sea viable; registrar procedencia/licencia antes de incorporar cada recurso final, conservar avisos y evitar CDNs o paquetes visuales innecesarios. No se adopta por ello una licencia general del proyecto.

## Pruebas a crear o modificar

* **Unitarias:** validación/filtrado del registro y traducciones; unicidad y slugs inválidos; tablas de rutas e idioma equivalente según el contrato aprobado; catálogo sin loaders, discriminación draft/published, paridad de claves y extensión A+D → A+B+D con comparación de A antes/después. Usar datos sintéticos sin incluirlos en el catálogo distribuido.
* **Integración modular/build:** usar el mismo contrato y ruta genérica con entradas Astro sintéticas y salidas temporales aisladas; render ES/EN, límites de importación y exclusión real de HTML/assets/chunks al construir el entregable vacío. La prueba no añade fixtures al registro de producción ni un generador de plugins.
* **Componentes:** adaptar las existentes si cambia su función; añadir interacción accesible solo si se implementan componentes interactivos. No exigir React ni una prueba de componente artificial para enlaces estáticos.
* **E2E:** acceso directo ES/EN, selector de idioma, navegación, catálogo vacío, ausencia de borradores/datos sintéticos, raíz estática 200 con destino español, 404 reales y responsive. No presentar el 200 local como prueba del futuro 301 de Cloudflare. Revisar qué expectativas de la fixture I-01 deben adaptarse a la portada real sin silenciar regresiones útiles.
* **Accesibilidad y manuales:** axe sobre páginas creadas en ES/EN con los dos proyectos configurados; teclado, foco, zoom, ausencia de desbordamientos y lectura visual en ambos idiomas. No ampliar a otros motores ni dispositivos físicos dentro de esta iteración.
* **Calidad visual:** comparar capturas representativas con las láminas aprobadas, comprobar tokens/contrastes/estados en su uso real y fuentes/fallback, y revisar con el propietario móvil/escritorio y el ensayo 9:16. Sin snapshots masivos o diferencias de píxel arbitrarias como sustituto del juicio visual.

## Verificaciones y evidencia

La planificación anterior se limitó a coherencia, alcance y enlaces. Las verificaciones y evidencias de la ejecución autorizada se registran en el informe de ejecución de I-02 al completarse.

En ejecución autorizada se reutilizarán los scripts existentes: `npm run check`, `npm run lint`, `npm run format:check`, `npm run test:unit`, `npm run test:components`, `npm run build`, `npm run test:e2e` y `npm run test:a11y`. `npm run verify` reúne tipos, lint, formato, unitarias, componentes y E2E, cuyo conjunto ya incluye axe; no se duplicarán suites completas si una misma ejecución válida cubre los criterios. El build es parte de `test:e2e` y `test:a11y`.

Se registrarán fecha, commit base/diff revisado, versiones, comandos, códigos de salida, casos y omisiones, ejecutable/revisión del navegador y trazabilidad I02-AC1–14. Conservar evidencia de URLs/HTML generado y respuestas 404, raíz estática y destino, delta de extensión A/B, controles de borradores y fixtures, inspección de artefactos, capturas representativas y revisión manual en ES/EN y 9:16. Los detalles reproducibles y conclusiones quedarán en documentación; logs, reports y artefactos temporales irán a directorios ignorados, sin incorporarlos al commit por defecto. No se publicarán credenciales ni rutas de perfil sensibles.

Los resultados futuros se declararán locales. Chromium móvil emulado/escritorio no acredita dispositivos físicos, Firefox/WebKit, staging, producción, cumplimiento WCAG completo ni métricas reales de rendimiento en campo.

## Riesgos y recuperación

* El cambio de portada/rutas puede invalidar expectativas de I-01: adaptar las que describían la fixture, conservar cobertura técnica útil y comprobar enlaces/404; no eliminar pruebas solo para obtener verde.
* Un catálogo vacío puede ocultar errores de entradas publicadas o traducciones: probarlos con fixtures aislados y comprobar que no llegan al build público. No desbloquear la verificación anunciando una miniapp ficticia.
* Una decisión material nueva puede convertirse accidentalmente en código o contrato: detener el camino afectado y solicitar la decisión correspondiente. Este plan se ejecutó por autorización expresa; cualquier cambio material se registra conforme a PLANS.md. No extender I-02 a infraestructura para resolver una limitación de revisión.
* [PEND-007](../tech-debt-tracker.md#pend-007--seguimiento-de-incidencias-moderadas-de-lint) continúa abierto: once incidencias moderadas de herramientas de desarrollo, cero altas/críticas en la evidencia de I-01. No equivale a un audit actual ni se cierra con esta iteración; evaluar actualización compatible antes de contribuciones no confiables, sin `audit fix --force` ni cambios de majors por iniciativa propia.
* Se conservan las demás deudas y limitaciones de [I-01](../completed/I-01-base-local-y-testing.md) y el [registro de deuda](../tech-debt-tracker.md), incluido el historial de descarga Chromium ya resuelto. No se amplía cobertura de herramientas de IA, licencia, infraestructura o navegadores por preparar I-02.
* La implementación futura será local y reversible, sin migración de datos. Si se cancela o necesita recuperación, retirar únicamente el delta propio de I-02 sobre la base aceptada y repetir las verificaciones afectadas; preservar cambios ajenos y la historia aceptada de I-01. Sin push o despliegue no hay rollback remoto que ejecutar.

## Punto de parada

**Situación actual:** I-02 `Aceptado`, tras revisión personal de capturas de escritorio/móvil y aceptación expresa del propietario el 2026-11-05; plan cerrado y archivado en `completed/`. El [informe de ejecución](../../i02-execution-report.md) registra los resultados AC1–14, capturas reales, ajustes mecánicos y límites. Sin bloqueos técnicos abiertos acreditados.

**Parada de esta ejecución:** resultado aceptado y plan archivado. El propietario autoriza un commit local de I-02 y únicamente preparar el borrador de I-03. No ejecutar I-03 ni hacer pushes o despliegues. La mejora de flotación/microinteracciones se registra en PEND-008 sin implementarla; permanecen las deudas y limitaciones documentadas.

## Progreso

* 2026-11-05: preparado únicamente el borrador documental solicitado. I-01 fue aceptada por el propietario; su aceptación satisface esa dependencia, sin aprobar decisiones ni autorizar I-02. Implementación de I-02 no iniciada.
* 2026-11-05: ampliación solicitada de contrato modular, rutas/i18n y calidad visual. Dirección artística y paleta elegidas; creadas maquetas aisladas y propuestas de tokens/arquitectura, sin modificar frontend, ejecutar la iteración, instalar dependencias de producto, hacer commits o pushes. Los renders de maquetas y cálculos de contraste no se presentan como pruebas de I-02.
* 2026-11-05: formalizadas las aprobaciones expresas de registro modular, rutas/i18n, Tailwind responsive y revisión, y de la segunda composición visual con paleta y fuentes indicadas. Añadidas las concreciones vacío→poblado, encuadre legible de miniapps y recursos locales/licenciados, sin nuevas alternativas o ejecución.
* 2026-11-05: el propietario aprueba formalmente el ExecPlan con sus 14 criterios y ratifica ADR-MMA-011/016/017. Se registra Aprobado, sin pasar a Autorizado ni En curso, conservando la segunda composición, modularidad, ES/EN, responsive/accesibilidad/pruebas y exclusión de borradores/fixtures.
* 2026-11-05: autorización expresa registrada como Autorizado y comienzo efectivo de implementación como En curso. Trabajo dividido en interfaz ES/EN, contrato/rutas y pruebas; sin miniapps reales, infraestructura ni acciones de publicación.

* 2026-11-05: ejecución terminada y Verificada. Se conserva el catálogo vacío, la segunda composición, rutas ES/EN y 14 AC originales. Pruebas finales correctas, regresiones I-01 aisladas, capturas reales accesibles y revisión asistida comparativa. Se documentan las correcciones de tipos/semántica/etiquetas, el UID opaco de Astro en builds aislados, el formato TTF local y la captura de zoom nativo. Aceptación y revisión editorial de superposiciones reales pendientes del propietario; no hay bloqueo técnico acreditado.

* 2026-11-05: aceptación expresa del propietario registrada; cierre y archivo del plan, conservando resultados, limitaciones y AC1–14. Mejora futura de movimiento registrada como PEND-008, sin cambios de frontend. Se prepara el commit local autorizado de I-02 excluyendo temporales/evidencias ignoradas; I-03 permanece únicamente en planificación.

## Historial de estado

| Fecha | Estado | Actor | Evidencia o motivo |
| --- | --- | --- | --- |
| 2026-11-05 | `Borrador` | Agente, por instrucción del propietario de MiMiniApp | Preparar únicamente el plan de catálogo, responsive e i18n ES/EN después de aceptar I-01; sin aprobación ni autorización de ejecución de I-02. |
| 2026-11-05 | `Borrador` | Agente, por instrucción del propietario de MiMiniApp | Concretar registro/rutas estáticas/i18n, integrar dirección artística elegida y preparar mockups móvil/escritorio/9:16. Contratos, implementación visual y ExecPlan continúan pendientes de aprobación; sin frontend, commits o pushes. |
| 2026-11-05 | `Borrador` | Propietario de MiMiniApp / Codex | Aprobación expresa de decisiones ADR-MMA-011/016/017 y segunda composición; se registran en fuentes canónicas y se incorporan solo los ajustes solicitados. AC1–14 conservados. El propietario solicita revisar el plan final antes de aprobar/autorizar su implementación; no se inicia I-02 ni se hacen commits/pushes/despliegues. |
| 2026-11-05 | `Aprobado` | Propietario de MiMiniApp | «Apruebo formalmente el ExecPlan I-02 — Catálogo, diseño responsive e internacionalización ES/EN», incluidos sus 14 criterios de aceptación; ratifica expresamente ADR-MMA-011/016/017. La misma indicación declara que todavía no autoriza comenzar la implementación. Se conserva en active/, sin ejecución, commits, pushes o despliegues. |
| 2026-11-05 | `Autorizado` | Propietario de MiMiniApp | Autorización expresa de ejecutar el plan aprobado y sus 14 AC, conservando las exclusiones y la parada en Verificado pendiente de aceptación. |
| 2026-11-05 | `En curso` | Codex, por autorización del propietario | Comienza la implementación del catálogo, interfaz ES/EN y pruebas/evidencias previstas. |
| 2026-11-05 | `Verificado` | Codex | Implementación completa y evidencia AC1–14 en docs/i02-execution-report.md: 59 unitarias, 9 componentes, 26 E2E/axe, integración modular, exclusión y capturas/zoom correctos. Pendiente revisión visual y aceptación expresa; sin commits, pushes o despliegues. |
| 2026-11-05 | `Aceptado` | Propietario de MiMiniApp | «Acepto expresamente I-02 como propietario de MiMiniApp», tras revisión personal de capturas reales de escritorio y móvil, conforme con diseño, arquitectura y verificaciones. Autoriza archivo y commit local de I-02; solo borrador de I-03, sin ejecución, pushes o despliegues. |
