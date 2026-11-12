# Corrección de sincronización de pausa — 2026-11-10

Tras fusionar el PR #13, Staging run `42813224189` falló en la comparación exacta de objetos/tiempos de animación de `appearance.spec.ts` en Chromium móvil (77/78 pruebas pasaron). El CI previo del PR había pasado. Rama de corrección `fix/appearance-pause-check`, desde staging `7ff37f0d7772fd9d168d272fb650bdb7c261fab5`.

La pausa CSS es asíncrona: `playState` puede indicar `paused` con `pending=true`, antes de fijarse el hold time. Un probe directo en Chromium 156 con viewport móvil, pulsando el control y leyendo inmediatamente los siete bucles, observó `currentTime=1866.55999999966`, `pending=true`; tras esperar sus promesas `Animation.ready`, los mismos objetos quedaron en `1883.25999999966`, `pending=false`. La prueba original pasó 12 repeticiones locales, coherente con un fallo intermitente dependiente de cuándo se mida respecto al siguiente frame.

La corrección espera `Animation.ready` antes de capturar los tiempos de referencia. No introduce retrasos fijos, tolerancias, retries ni cambios en aplicación/workflows. Conserva igualdad exacta de referencias/tiempos, geometría y CLS, y añade número exacto de siete bucles, estado `paused`, ausencia de operaciones pendientes y ausencia de animaciones nuevas tras cambiar de tema. Se sigue midiendo la rotación de 240 ms y su reducción independiente.

Ensayo de estabilidad después del cambio: 24/24 repeticiones satisfactorias (12 Chromium móvil y 12 escritorio), con `playwright test tests/e2e/appearance.spec.ts --grep 'rotates only' --repeat-each 12`. Log local `/tmp/appearance-pause-after.log`. La verificación global de esta corrección se registra en el PR y sus checks, sin atribuirle el resultado del CI histórico del PR #13.
