# I-02 — Contrato modular y rutas estáticas: decisiones aprobadas

**Estado:** decisiones ADR-MMA-011/016 `Aprobada`, implementadas, verificadas y aceptadas expresamente en I-02 el 2026-11-05. **Responsable y actor de aprobación:** propietario de MiMiniApp, 2026-11-05. **Actualizado:** 2026-11-05.

El propietario aprueba expresamente el registro tipado y su conexión a UI sin modificar rutas/layouts/otras miniapps al añadir herramientas, las rutas /es/ y /en/ con español predeterminado, slugs estables y las traducciones separadas/obligatorias. Este documento desarrolla ADR-MMA-011/016 aprobados en el [registro técnico](index.md). Se apoya en [AGENTS.md](../../AGENTS.md), la [arquitectura objetivo](architecture-target.md) y el [ExecPlan I-02](../exec-plans/completed/I-02-catalogo-responsive-e-i18n.md), Aprobado formalmente y después Autorizado expresamente por el propietario el 2026-11-05 con sus 14 criterios. El plan está Aceptado y archivado; la autorización no incluye infraestructura ni publicación.

Este documento conserva el contrato aprobado. Su realización concreta está en `src/lib/miniapp-registry.ts`, `src/miniapps/registry.ts` y las rutas genéricas de Astro. La firma y el render perezoso de `entry.astro` se contrastan con Astro 7.4.5 mediante builds de integración aislados, con resultados en el informe de ejecución.

## Registro, catálogo y generación de rutas

Se adopta un único registro explícito local; sin descubrimiento automático de plugins ni `switch` por herramienta en páginas comunes. Cada miniapp contiene:

```text
src/miniapps/<slug>/
  metadata.ts          # datos estáticos; ninguna importación de interfaz
  entry.astro          # adaptador de la herramienta, recibe locale
  App.tsx              # solo si necesita interacción React
  domain/              # lógica independiente de React, Astro y traducciones
  i18n/es.ts
  i18n/en.ts
  tests/
```

Contrato aprobado; nombres y tipos concretos de referencia:

* `Locale = 'es' | 'en'`.
* Descriptor: `id` estable, `slug` estable, estado `draft | published`, título/descripción completos por idioma. Categoría/etiquetas solo si la presentación aprobada las utiliza; no inventar fechas o información funcional.
* Slug ASCII en minúsculas con palabras separadas por guion (`^[a-z0-9]+(?:-[a-z0-9]+)*$`), idéntico entre idiomas; rechazar mayúsculas, espacios, segmentos de ruta y duplicados. Identificador único independiente del nombre traducido. Un cambio de slug posterior exigiría una decisión explícita sobre URLs y redirecciones.
* Registro discriminado: una inscripción `published` asocia descriptor con un `loadEntry` perezoso mediante una importación literal de su `entry.astro`; una inscripción `draft` no puede contener loader de UI. Cambiar un borrador a publicado supone aprobarlo y completar esa misma inscripción, sin tocar rutas genéricas.
* Entrada visual: componente Astro con prop tipada `locale`. La ruta común resuelve título/descripción y layout desde el descriptor; el módulo conserva sus textos y controles propios. El adaptador importa estáticamente su isla React y declara su hidratación cuando la necesite. No depender de que una directiva `client:*` funcione sobre un componente React descubierto dinámicamente.

### Boceto tipado ilustrativo

El siguiente código es pseudocódigo documental, no una implementación ni una API validada de Astro. `EntryModule` representa el módulo de entrada Astro; su tipo público y mecanismo de importación concretos deben validarse en la versión fijada antes de convertir el boceto en código.

```ts
type Locale = 'es' | 'en';
type Descriptor = {
  id: string;
  slug: string;
  copy: Record<Locale, { title: string; description: string }>;
};
type Registration =
  | {
      descriptor: Descriptor & { status: 'published' };
      loadEntry: () => Promise<EntryModule>;
    }
  | {
      descriptor: Descriptor & { status: 'draft' };
      loadEntry?: never;
    };

// Único registro explícito. Metadatos importados sin interfaz.
// Una alta futura añade su carpeta y una sola inscripción como esta:
const registry = [
  {
    descriptor: publishedToolMetadata,
    loadEntry: () => import('../miniapps/example/entry.astro'),
  },
  { descriptor: draftToolMetadata },
] satisfies readonly Registration[];

// Esquema de [locale]/apps/[slug].astro; no pasa loaders en props.
export function getStaticPaths() {
  return getPublished(registry).flatMap(({ descriptor }) =>
    locales.map((locale) => ({
      params: { locale, slug: descriptor.slug },
      props: { id: descriptor.id },
    })),
  );
}
```

En el frontmatter de la ruta, resolver `props.id` contra el mismo registro publicado, validar `params.locale` y cargar la entrada correspondiente durante prerender. El layout recibe los metadatos localizados y la entrada recibe únicamente su contexto tipado de idioma. El catálogo obtiene una proyección de descriptores y no ejecuta `loadEntry`. Los nombres del ejemplo no corresponden a herramientas reales ni se inscriben en el catálogo entregable.

### Flujo propuesto de compilación

1. El registro importa exclusivamente descriptores de datos y declara los loaders de herramientas publicadas; construir el registro no ejecuta los loaders. Validar identificadores, slugs, traducciones y coherencia de publicación.
2. Portada/catálogo consumen únicamente la proyección tipada de metadatos publicados. No invocan loaders, importan `App.tsx` ni hidratan componentes de herramientas.
3. `src/pages/[locale]/index.astro` obtiene sus dos rutas de la constante de locales.
4. `src/pages/[locale]/apps/[slug].astro` usa `getStaticPaths()` con el producto de **descriptores publicados × locales**. La salida contiene parámetros y datos simples —por ejemplo, id y locale—, sin serializar loaders o componentes.
5. El frontmatter de la ruta identifica la inscripción publicada y ejecuta solamente su loader durante prerender. Renderiza su entrada dentro del layout común y le pasa `locale`. No hay un router de miniapps en el navegador ni resolución remota.
6. Un `draft` carece de ruta, enlaces y loader. Los fixtures no entran en el registro de producción. Además de comprobar rutas/HTML, inspeccionar el build entregable para acreditar que no contiene sus marcas, assets o chunks de UI.

**Alta semanal esperada:** añadir la carpeta de la miniapp y una inscripción en el registro. La miniapp aporta metadatos, interfaz, dominio, traducciones y pruebas propios. No se modifica la ruta dinámica, el layout común, diccionarios de otras herramientas ni sus dominios. Una nueva capacidad compartida se revisa por separado cuando exista una necesidad real.

Límites de dependencias: `domain` no importa UI, Astro, DOM ni otra miniapp; cada miniapp puede consumir utilidades y componentes comunes aprobados, pero no importar internamente otra miniapp. Componentes comunes y diccionarios de plataforma no importan herramientas ni el registro. No hay estado global de herramientas, importaciones con efectos globales ni estilos que alteren otras miniapps. No exige incorporar una biblioteca de plugins, nuevas dependencias ni un generador de registros.

## Alternativas consideradas antes de la aprobación

| Alternativa | Ventajas | Coste o riesgo |
| --- | --- | --- |
| Registro explícito único con metadatos y loaders separados | Altas visibles en revisión, lista publicada controlada, relación descriptor/entrada tipada y borradores sin loader. Cada alta cambia una inscripción además de su carpeta. | Requiere mantener esa inscripción manual; la validación debe detectar duplicados, incoherencia de estado y módulos no resolubles. |
| Descubrimiento con `import.meta.glob` | Puede recoger carpetas automáticamente y reducir mantenimiento manual de la lista. | Introduce convenciones de nombres y descubrimiento implícito; filtrar metadatos después de un glob no demuestra por sí solo que el empaquetador excluya UI o chunks de borradores. Requiere justificar la carga y la salida real del build. |

**Decisión aprobada:** registro explícito. Su modificación de una sola inscripción es una carga pequeña para la cadencia semanal y permite comprender qué herramientas se publican sin añadir reglas de descubrimiento. No adoptar un glob, generador o plugin engine por anticipar crecimiento. Una evolución futura tendría que conservar las mismas garantías de aislamiento y exclusión de artefactos.

## Internacionalización y rutas

Separar `src/i18n/common/{es,en}.ts` (navegación, portada, catálogo, metadatos y recuperación 404) de `src/miniapps/<slug>/i18n/{es,en}.ts` (controles y mensajes propios). Los tipos y validaciones exigen paridad de claves en los ámbitos usados. Una traducción obligatoria ausente falla la validación/build, sin mostrar claves crudas ni recurrir silenciosamente al otro idioma. La portada no carga diccionarios de UI de herramientas.

Números/fechas/importes se presentan con `Intl` y el locale seleccionado, conservando valores de cálculo independientes. Selector mediante enlaces HTML; desde una herramienta publicada mantiene su slug estable. Sin detección por navegador, cookies, localStorage ni cambios automáticos de URL por preferencia. El 404 global tampoco utiliza JavaScript para seleccionar idioma: sus dos mensajes permanecen disponibles como HTML.

| URL/caso | Comportamiento de I-02 y alcance diferido |
| --- | --- |
| `/es/`, `/en/` | Portada y catálogo estáticos en el idioma correspondiente; español predeterminado. |
| `/es/apps/<slug>/`, `/en/apps/<slug>/` | Solo se generan para miniapps publicadas. I-02 puede entregar cero rutas de herramienta, con catálogo vacío real. |
| `/` en preview estático local | Documento HTML de entrada con `lang="es"`, enlace claro a `/es/` y redirección inmediata mediante `meta refresh` (`content="0;url=/es/"`). Su respuesta es **200**, no se presenta como una redirección HTTP 301. El enlace sigue permitiendo continuar sin JavaScript. |
| `/` en futuro alojamiento | Propuesta de redirección HTTP 301 a `/es/` mediante la capacidad de redirección del alojamiento, conservando la entrada HTML como fallback estático. Su configuración, activación y prueba se reservan a I-03; no se presupone ya desplegada. |
| Locale desconocido, por ejemplo `/fr/` | 404 real; no redirigir a español para ocultar la URL inválida. |
| Ruta o slug desconocido; slug de borrador | 404 real con recuperación clara; nunca catálogo o aplicación con estado 200 por fallback SPA. |
| Barras finales | URLs generadas y enlaces internos terminan en `/`; confirmar normalización exacta del preview fijado y del proveedor antes de adoptar expectativas HTTP. No generar dos variantes deliberadamente. |

El contrato contempla **un 404 global estático bilingüe**, generado como `404.html`: título neutral MiMiniApp · 404, mensaje breve en español y en inglés con cada bloque marcado con su `lang`, y enlaces comprensibles a `/es/` y `/en/`. Debe funcionar sin scripts, conservar foco/semántica y no interpolar una URL desconocida sin escapar. No crear `/es/404/` y `/en/404/` como sustitutos cuyo acceso directo devolvería 200.

La intención de usar alojamiento estático en Cloudflare se tiene en cuenta; ADR-MMA-004 y la selección/configuración de su producto siguen pendientes. Para la alternativa ya propuesta de Workers Static Assets: conservar el artefacto `404.html` y exigir al alojamiento que sirva errores con **HTTP 404**, sin modo SPA ni `index.html` como fallback de URLs desconocidas. No añadir ahora `_redirects`, Wrangler, Workers, reglas del proveedor ni despliegues. No equiparar una comprobación de `astro preview` a una verificación de Cloudflare.

Títulos, descripciones y `html[lang]` quedan dentro de I-02. No inventar un origen público para canónicas/hreflang: documentar el mapa de equivalencias y diferir las etiquetas absolutas hasta disponer de un origen público aprobado, o aprobar expresamente otra política antes de implementar.

## Criterios adicionales de aceptación y pruebas

**Extensibilidad demostrable A+D → A+B+D:** ejecutar el mismo constructor/validador puro de registro y rutas con un conjunto sintético A publicada + D borrador; añadir B publicada en una segunda entrada aislada. Deben aparecer A y B en el catálogo y exactamente sus cuatro rutas ES/EN, sin rutas ni loaders ejecutados de D. La incorporación de B modifica únicamente su fixture y el registro de prueba; no exige editar ruta genérica, layout, plataforma de traducciones ni A. Verificar que los metadatos del catálogo no invocan loaders de UI.

Complementar la unidad con un build aislado de integración que reutilice el contrato y la ruta genérica para renderizar A/B en ambos idiomas, en directorio temporal y salida distinta de `dist` entregable. No añadir una bandera de entorno que publique fixtures en el build normal. Repetir el build entregable vacío y comprobar ausencia de identificadores, rutas, HTML, assets y marcas de fixtures/borradores. La forma mecánica de ese harness se validará con Astro antes de implementarlo; no es una segunda plataforma ni un plugin engine.

Pruebas previstas: duplicados e ids/slugs inválidos; ES/EN obligatorios y paridad de claves; selección published; matriz de rutas; equivalencia de idioma; loaders no ejecutados para catálogo/draft; aislamiento A/B; límites de importación entre módulos. E2E y axe conservan los perfiles Chromium fijados, acceso directo, catálogo vacío, idioma/contexto, responsive y 404 con estado HTTP observable. La prueba del estado raíz distingue el 200 estático local de la propuesta futura de 301 del proveedor. No se reejecuta I-01 por actualizar este documento.

## Aprobaciones registradas y comprobaciones futuras

1. ADR-MMA-011 aprobado el 2026-11-05: contrato tipado, separación de metadatos/UI/dominio/traducciones/pruebas, registro explícito, rutas genéricas y prueba de alta aislada sin tocar componentes comunes. No requiere volver a solicitar esa aprobación.
2. ADR-MMA-016 aprobado el 2026-11-05: ES/EN, español predeterminado, slugs estables, raíz estática hacia /es/, separación de traducciones y validación de las obligatorias. I-02 verificará el comportamiento local; la configuración y comprobación de Cloudflare quedan reservadas a I-03. El HTTP 301 concreto del alojamiento no se adopta ni configura ahora.
3. Durante una ejecución autorizada, contrastar la firma concreta del adaptador, getStaticPaths, imports/props, salida 404, barras y redirección estática con Astro 7.4.5; comprobar el empaquetado y la exclusión de UI/fixtures. Son verificaciones técnicas de la decisión aprobada, no un bloqueo técnico ya demostrado o una nueva aprobación humana de rutina. Un cambio material de contrato, stack o dependencia se comunica antes de adoptarse.
4. En I-03, contrastar el producto de Cloudflare que se apruebe —sin asumir equivalencia de Workers Static Assets y Pages— y verificar respuestas reales de redirección/normalización/404. Su selección, credenciales y configuración no bloquean la base local de I-02.

El ExecPlan fue Aprobado y después Autorizado expresamente el 2026-11-05; la ejecución está verificada y aceptada por el propietario. Resultados, capturas y límites en el [informe de ejecución](../i02-execution-report.md). El propietario autoriza el commit local de cierre de I-02; no autoriza pushes o despliegues.

## Evidencia de implementación I-02

Implementación y pruebas locales completadas el 2026-11-05, con trazabilidad AC1–14 en el [informe de ejecución](../i02-execution-report.md). Las capturas reales se distinguen de las maquetas. I-02 queda Aceptado y archivado tras revisión personal de escritorio/móvil por el propietario el 2026-11-05; se autoriza su commit local de cierre. Sin cambios materiales de ADR, pushes o despliegues.
