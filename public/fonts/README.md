# Fuentes autoalojadas de MiMiniApp

Space Grotesk y DM Sans variables, bajo **SIL Open Font License 1.1**, con sus avisos completos adyacentes. No implica adoptar una licencia general para el proyecto. La aplicación no hace solicitudes a Google Fonts ni a otro CDN.

## Archivos distribuidos

| Archivo | Bytes | SHA-256 |
| --- | ---: | --- |
| SpaceGrotesk.woff2 | 49256 | 8e085aa438094f11487a836652edd5c054fa6a96f63fc7c282105ee3a4b08c07 |
| DMSans.woff2 | 88820 | 40c3837c53c103a38fbce7faaa590b76edd61a8ede14672eb1e2f7eab0e0c6a4 |

En conjunto 138076 bytes, frente a los 376840 de los TTF originales (un 63 % menos). Se sirven con `font-display: swap` y fallback de sistema.

## Procedencia

Incorporación e inspección de los originales: 2026-11-05.

| Original | Procedencia | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| SpaceGrotesk.ttf | [Google Fonts, Space Grotesk variable](https://raw.githubusercontent.com/google/fonts/main/ofl/spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf) | 136676 | acad6de1fc93436f5c0f1f4137751ef04f1aea3063e7036535970ffcfbd79f72 |
| DMSans.ttf | [Google Fonts, DM Sans variable](https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/DMSans%5Bopsz%2Cwght%5D.ttf) | 240164 | 8cd08d97e89c24d0aa92edd2f0f4c8ee6195eee9b7c9f154865a58b02f0c1c0d |

Copyright Space Grotesk: 2020 The Space Grotesk Project Authors. Copyright DM Sans: 2014 The DM Sans Project Authors. Ninguna de las dos declara un nombre de fuente reservado. Licencias originales: SpaceGrotesk-OFL.txt y DMSans-OFL.txt, procedentes de los respectivos directorios de Google Fonts.

## Conversión a WOFF2

Realizada el 2026-11-13 con fontTools 4.68.0 y brotli, usados una sola vez fuera del repositorio; no son dependencias del proyecto. WOFF2 es un reempaquetado comprimido sin pérdida: no se hizo subsetting ni se cambió ningún glifo.

Comprobación de ida y vuelta, tabla a tabla, entre cada TTF original y su WOFF2 decodificado:

* Todas las tablas de glifos, métricas, variación y composición son idénticas byte a byte. Se conservan el número de glifos, el `cmap` y los ejes: Space Grotesk `wght` 300–700; DM Sans `wght` 100–1000 y `opsz` 9–40.
* Solo cambia `head`: la suma de comprobación recalculada y el bit 11 de `flags`, que el formato exige para indicar la transformación sin pérdida.
* Space Grotesk pierde la tabla `DSIG`, una firma digital que deja de ser válida al reempaquetar y que WOFF2 obliga a retirar. DM Sans no la tenía.

Ambas cubren letras españolas acentuadas, ñ/Ñ, ü/Ü, ¿, ¡ y apóstrofo tipográfico.

Para repetir la conversión a partir de un original descargado:

```sh
python3 -m venv /tmp/fuentes && /tmp/fuentes/bin/pip install fonttools brotli
/tmp/fuentes/bin/python -c "from fontTools.ttLib import TTFont; f = TTFont('DMSans.ttf', recalcTimestamp=False); f.flavor = 'woff2'; f.save('DMSans.woff2')"
```

## Otros recursos gráficos

Los SVG geométricos de marca, laboratorio y estado vacío son recursos originales del proyecto definidos en sus componentes Astro; no se distribuye la imagen conceptual generada como recurso de aplicación.
