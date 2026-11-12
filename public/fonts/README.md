# Fuentes autoalojadas de MiMiniApp

Los dos archivos se distribuyen sin modificar, bajo **SIL Open Font License 1.1**, con sus avisos completos adyacentes. Incorporación e inspección: 2026-11-05. No implica adoptar una licencia general para el proyecto.

| Archivo | Procedencia | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| SpaceGrotesk.ttf | [Google Fonts, Space Grotesk variable](https://raw.githubusercontent.com/google/fonts/main/ofl/spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf) | 136676 | acad6de1fc93436f5c0f1f4137751ef04f1aea3063e7036535970ffcfbd79f72 |
| DMSans.ttf | [Google Fonts, DM Sans variable](https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/DMSans%5Bopsz%2Cwght%5D.ttf) | 240164 | 8cd08d97e89c24d0aa92edd2f0f4c8ee6195eee9b7c9f154865a58b02f0c1c0d |

Copyright Space Grotesk: 2020 The Space Grotesk Project Authors. Copyright DM Sans: 2014 The DM Sans Project Authors. Licencias originales: SpaceGrotesk-OFL.txt y DMSans-OFL.txt, procedentes de los respectivos directorios de Google Fonts.

Se verificaron las tablas cmap y los ejes variables con fontTools ya disponible en el entorno: Space Grotesk wght 300–700; DM Sans wght 100–1000 y opsz 9–40. Ambos cubren letras españolas acentuadas, ñ/Ñ, ü/Ü, ¿, ¡ y apóstrofo tipográfico.

Se reutilizan los TTF exactos de la propuesta visual aprobada (376840 bytes en conjunto), con `font-display: swap` y fallback de sistema. La conversión WOFF2 preferida no está disponible localmente sin una herramienta adicional; se evita añadir una dependencia para esta optimización. No se realizan solicitudes a Google Fonts ni a otro CDN desde la aplicación.

Los SVG geométricos de marca, laboratorio y estado vacío son recursos originales del proyecto definidos en sus componentes Astro; no se distribuye la imagen conceptual generada como recurso de aplicación.
