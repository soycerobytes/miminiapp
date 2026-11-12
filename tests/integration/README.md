# Integración modular aislada

Con Node 24.22.2, dependencias de `package-lock.json` y el Chromium de Playwright
fijado ya instalados:

```sh
npm run build
npm run test:integration
```

El segundo comando ejecuta `node tests/integration/modular-build.ts`. Debe usar
el mismo `PLAYWRIGHT_BROWSERS_PATH` de la instalación. No requiere red externa.

El harness copia el código y la configuración actuales a
`.local/verification/i02/modular/`. En esas copias sustituye exclusivamente el
registro y añade módulos sintéticos a partir de plantillas `.fixture`. Estas
plantillas están fuera de `src` y no son entradas del registro público. No hay
una bandera de publicación de fixtures en producción.

Se comparan A publicada + D borrador con A/B publicadas + D. Las rutas, layouts,
componentes comunes, traducciones de plataforma y A conservan sus hashes. Los
tests propios de cada módulo se descubren con la configuración de Vitest común:
dos casos con A, cuatro después de añadir B. Se comprueban las cuatro rutas
ES/EN, el contexto del selector de idioma, los dominios y traducciones de A/B,
el catálogo de una/dos entradas y la estabilidad del HTML de A. Para comparar
las dos raíces aisladas se normaliza únicamente el atributo `uid` de
`<astro-island uid="…"`: Astro 7 lo calcula a partir de la URL del componente
antes de reescribirla y esa URL contiene la raíz temporal. Se conservan los
hashes de ambos HTML originales y del HTML normalizado; el resto de bytes,
incluidos contenido, props, CSS, scripts y URLs, debe ser idéntico. Las pruebas
de navegador comprueban la hidratación real sin normalizar la aplicación.

D tiene una entrada que falla si se carga y un asset identificable. No debe
generar rutas ni dejar sus marcas en ningún artefacto. Un tercer build con una
traducción obligatoria vacía debe fallar. También se revisan los límites de
importación y se comprueba que el código y el build públicos no se modificaron
ni contienen fixtures, borradores o la interfaz técnica de I-01.

El preview temporal de A/B usa `127.0.0.1:4322`. El adaptador Astro de A importa
estáticamente la isla técnica de I-01 y declara `client:load`; sus regresiones
de hidratación, teclado, validación, resultado, reset y axe se ejecutan solo en
esa copia. El bloque técnico en español declara `lang="es"` también dentro de
la ruta inglesa. No es una miniapp real ni se entrega como catálogo público.

El JSON final, logs, hashes y capturas quedan en el directorio ignorado anterior.
Los resultados del navegador se guardan en `i01-browser/`; las capturas son
evidencia técnica sintética, distintas de las capturas del producto entregable.
