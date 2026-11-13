# Cómo añadir una miniapp

Guía práctica del contrato aprobado en ADR-MMA-011 y ADR-MMA-016. Una miniapp es una carpeta autocontenida más una línea en el registro: añadirla no debe exigir tocar rutas, layouts, estilos globales ni otras herramientas.

## Antes de escribir código

1. El propietario elige la herramienta. Nadie más la selecciona.
2. Rellena su [ficha funcional](product-specs/miniapp-template.md): entradas, resultados esperados, errores, límites, privacidad, demo y pruebas.
3. Prepara el ExecPlan de su iteración y espera aprobación y autorización, según [PLANS.md](PLANS.md).

Por defecto una miniapp se ejecuta entera en el navegador. Si necesita una API externa, persistencia más allá de `localStorage` o cualquier servidor, hace falta antes una decisión aprobada (ADR-MMA-005 y ADR-MMA-006).

## Estructura

```text
src/miniapps/<slug>/
  metadata.ts        Descriptor: metadatos puros, sin importar interfaz
  entry.astro        Punto de entrada; recibe el idioma
  App.tsx            Interfaz React, solo si hay interacción
  domain/            Lógica pura, sin DOM ni textos
  i18n/es.ts, en.ts  Textos propios de la herramienta
  tests/             *.test.ts(x) para Vitest y *.spec.ts para Playwright
```

Solo `metadata.ts` y `entry.astro` son obligatorios. El `slug` es estable: forma parte de la URL pública y no se cambia después de publicar.

## 1. Descriptor

```ts
// src/miniapps/interes-compuesto/metadata.ts
import type { MiniappDescriptor } from '../../lib/miniapp-registry';

export const metadata = {
  id: 'interes-compuesto',
  slug: 'interes-compuesto',
  status: 'draft',
  category: 'calculator',
  tags: ['finanzas', 'ahorro'],
  copy: {
    es: { title: 'Interés compuesto', description: 'Calcula cuánto crece un ahorro con el tiempo.' },
    en: { title: 'Compound interest', description: 'See how savings grow over time.' },
  },
} as const satisfies MiniappDescriptor;
```

| Campo | Regla |
| --- | --- |
| `id` | Identificador estable en minúsculas ASCII. Único. |
| `slug` | Minúsculas, dígitos y guiones. Único. Es la URL: `/es/apps/<slug>/`. |
| `status` | `draft` mientras se construye; `published` cuando se acepta. |
| `category` | Una de `calculator`, `productivity`, `everyday`, `science`, `game`, `experience`. |
| `tags` | Opcional. Palabras clave estables con forma de slug, sin repetir. No son texto traducido. |
| `publishedAt` | Fecha `AAAA-MM-DD` de la primera publicación. Obligatoria al publicar. |
| `copy` | Título y descripción no vacíos en `es` y `en`. |

Este archivo no puede importar componentes ni estilos: el catálogo lo lee sin cargar la interfaz.

Las categorías salen de los tipos de herramienta de la [definición del producto](product-specs/index.md). Añadir una nueva es un cambio de contrato: se propone en el registro de decisiones.

## 2. Punto de entrada

```astro
---
// src/miniapps/interes-compuesto/entry.astro
import type { Locale } from '../../lib/locales';
import { validateTranslationParity } from '../../i18n/validation';
import App from './App';
import { es } from './i18n/es';
import { en } from './i18n/en';

interface Props {
  locale: Locale;
}
const { locale } = Astro.props;
validateTranslationParity(es, en);
const copy = { es, en }[locale];
---

<App client:visible copy={copy} locale={locale} />
```

La página común ya pone el título, la descripción, la cabecera y el pie. `entry.astro` solo aporta la herramienta.

* Llama a `validateTranslationParity` para que un texto ausente en un idioma rompa el build en lugar de publicarse.
* Hidrata lo mínimo: `client:visible` o `client:idle` salvo que la interacción deba estar lista de inmediato. Si la herramienta no necesita estado, no uses React.
* Pasa los textos como props. La lógica de `domain/` no conoce idiomas ni formatos: devuelve valores y la interfaz los formatea con `Intl` según `locale`.

## 3. Registro

```ts
// src/miniapps/registry.ts
import { metadata as interesCompuesto } from './interes-compuesto/metadata';

export const miniappRegistry = validateRegistry([
  { descriptor: interesCompuesto },
] satisfies readonly MiniappRegistration[]);
```

Un borrador se registra sin cargador: no genera rutas ni aparece en el catálogo ni en `dist/`. Para publicar, cambia `status` a `published`, añade `publishedAt` y el cargador:

```ts
{
  descriptor: interesCompuesto,
  loadEntry: () => import('./interes-compuesto/entry.astro'),
},
```

El orden del registro es el orden del catálogo. `validateRegistry` falla en build ante duplicados, campos inválidos, traducciones ausentes, un publicado sin cargador o un borrador con él.

## 4. Estilos

La convención completa está en [FRONTEND.md](FRONTEND.md#convención-de-estilos). Para una miniapp:

* Sus estilos viven en su carpeta: utilidades de Tailwind en el marcado o un bloque `<style>` en su `.astro`.
* No añadas reglas de una herramienta a `src/styles/`. Esos tres archivos son de la plataforma.
* Usa los tokens del tema, no colores literales: `bg-surface`, `text-ink`, `text-muted`, `border-control-border`, `bg-brand`, `rounded-card`, `font-heading`. Así la apariencia clara y oscura funciona sin trabajo adicional. Las utilidades de paleta fija como `bg-white` o `text-slate-900` no se adaptan al modo oscuro.
* Objetivos táctiles de al menos 48 px y foco visible, como en el resto del sitio.

## 5. Pruebas

| Tipo | Archivo | Qué demuestra |
| --- | --- | --- |
| Dominio | `tests/*.test.ts` | Resultados correctos con valores normales, límites e inválidos, contra expectativas independientes del código. |
| Componente | `tests/*.test.tsx` | Entrada, error, resultado y restablecimiento visibles. |
| Navegador | `tests/*.spec.ts` | El recorrido crítico en ES y EN sobre el build, teclado, móvil y escritorio, axe y ausencia de peticiones externas inesperadas. |

`npm run verify` las recoge todas sin configuración adicional. Importa `test` y `expect` desde `tests/e2e/fixtures` en los `*.spec.ts`: esa fixture falla ante errores de consola, respuestas 4xx o peticiones fuera del origen local.

Cada herramienta necesita un ejemplo reproducible y un restablecimiento rápido, y sus pruebas deben cubrirlos.

## 6. Comprobar y entregar

```sh
npm run verify
```

Revisa además a mano con `npm run dev`: móvil y escritorio, ambos idiomas, claro y oscuro, y solo con teclado. Después sigue el flujo de [CONTRIBUTING.md](../CONTRIBUTING.md): PR a `staging`, CI, revisión y merge. La herramienta queda publicada en staging; el propietario la acepta antes de promoverla.

## Lista de comprobación

* [ ] Ficha funcional completa y plan autorizado.
* [ ] `metadata.ts` sin importaciones de interfaz.
* [ ] Textos completos en ES y EN, incluidos errores y etiquetas accesibles.
* [ ] Lógica en `domain/`, sin DOM ni textos.
* [ ] Estilos dentro de la carpeta, con tokens del tema.
* [ ] Pruebas de dominio, componente y navegador en `tests/`.
* [ ] Ejemplo reproducible y restablecimiento.
* [ ] Ningún archivo común modificado salvo `registry.ts`.
* [ ] `npm run verify` en verde.
