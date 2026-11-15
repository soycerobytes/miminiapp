> Fuente aportada por el propietario como «Texto pegado.txt», recibida el 2026-11-15. Se conserva literalmente debajo de esta nota como antecedente, no como definición aprobada. Las menciones del original a v04 en Git y a miminiapp.com no se han verificado. La propuesta adaptada está en [la ficha v06](../product-specs/plan-b.md).

---

# Plan B · Bad Day Plan

**Definición de producto · v05 (2026-11-13).** Sustituye a la v04, que sigue en el historial de Git. Documento autocontenido, escrito para que **una IA lo construya** con Alexander («Ale») revisando.

**Presupuesto: 3–4 sesiones de 2–3 horas de Ale (6–12 h en total).** Todo lo que no cabe en ese tiempo está fuera. Si algo de este documento no cabe, se recorta según el §11; no se amplía el plazo.

---

## 1. Qué es

> **Dime tu propósito, dime qué te hará dejarlo y te ayudo a tener un plan B para ese día.**

Una miniapp web de un solo uso y unos 2 minutos. La persona:
1. escribe su propósito;
2. elige qué le hará abandonarlo;
3. escribe un plan «Si [situación], entonces [acción]» y, si quiere, a qué hora suele pasar.

Sale con **su plan en pantalla**, un **evento repetido en su propio calendario** y una **imagen para la pantalla de bloqueo**.

- **Nombre:** ES «Plan B» (subtítulo «para tu propósito») · EN «Bad Day Plan». En inglés no se usa «Plan B».
- **Para quién:** cualquier persona con un propósito, en cualquier país. Español e inglés.
- **No es** una app de hábitos: no sigue, no avisa por su cuenta, no guarda historial, no usa IA, no tiene cuentas.
- **Base:** planes «si… entonces» y contraste mental (la técnica de WOOP). No es un método nuevo; lo propio es el encuadre «ya es el mes siguiente y lo has dejado».

## 2. Dónde vive

- Dentro de la web existente **miminiapp.com**.
- **Antes de escribir código**, la IA lee la web base y resume en 5–10 líneas cómo se añade una miniapp: estructura, rutas, idiomas, cabecera y pie, estilos, fuentes, medición, privacidad. **Sigue esas convenciones** y reutiliza todo lo que exista.
- Direcciones: `/es/plan-b` y `/en/bad-day-plan`, si la base admite rutas por idioma. Si no, la que use la base.
- **Identidad visual:** colores, fuentes, botones y espaciado salen de la web base. No se inventa un estilo nuevo.
- Lo que la base no tenga (selector de idioma, página de privacidad, catálogo) **no se construye** en esta miniapp. Se apunta como pendiente de la web.

## 3. Reglas que no se negocian

1. **Lo que escribe la persona no sale del navegador**, salvo que ella pulse «Añadir a Google Calendar» o «Compartir». El código de la miniapp no hace `fetch`, XHR ni carga recursos que lleven su texto.
2. **Funciona en modo avión** una vez cargada la página: todo el recorrido, el `.ics` y la imagen. Google Calendar y compartir avisan si no hay conexión.
3. **Sin dependencias nuevas** salvo que la base ya las use. JavaScript y CSS propios, ligeros.
4. **El texto de la persona se trata siempre como texto**, nunca como HTML (`textContent`, no `innerHTML`).
5. **La dirección web nunca rellena ni muestra texto.** El plan no va nunca en el enlace.
6. **Estado:** se guarda en `sessionStorage` para que recargar no pierda el paso. Cerrar la pestaña lo borra. No se usa `localStorage`.
7. **Palabras exactas:** el plan, el evento y la imagen repiten lo que escribió la persona, sin conjugar ni reescribir.

## 4. Recorrido

Cuatro pantallas y un resultado. Una sola columna centrada, pensada primero para el móvil; en escritorio, la misma columna con un ancho máximo de unos 480 px.

Arriba, en todas las pantallas del recorrido: botón «Atrás» (excepto en la portada) e indicador «1 de 3», «2 de 3», «3 de 3».

### 4.1 Portada

- Titular: `titular` (§6).
- Subtítulo: `subtitulo`.
- Botón principal: **Empezar**. Botón secundario: **Ver un ejemplo** (§7).
- Pie: `pie_privacidad`.

### 4.2 Paso 1 · Propósito

- Pregunta: `p1_pregunta`. En enero se usa `p1_pregunta_enero`.
- Un campo de texto de una línea. **3–80 caracteres.** Contador visible a partir de 60.
- Seis sugerencias que se tocan y rellenan el campo (sustituyen su contenido): `p1_sugerencias`.
- Botón **Siguiente**, desactivado si el texto tiene menos de 3 caracteres (sin contar espacios al principio y al final).

### 4.3 Paso 2 · El salto

- **Al entrar, la pantalla pasa a gris** (ver §5).
- Pregunta: `p2_pregunta`.
- Seis tarjetas grandes en una cuadrícula de 2 columnas: `obstaculos` (§6.2). Se toca una.
- «Otra cosa» abre un campo de **3–60 caracteres** debajo de las tarjetas.
- Tocar cualquier otra tarjeta avanza solo al paso 3. Con «Otra cosa», avanza el botón **Siguiente**.

### 4.4 Paso 3 · El plan

- Título: `p3_titulo`.
- Dos campos, presentados como una frase:
  - **Si** [campo situación] **, entonces** [campo acción].
  - Cada campo: **3–90 caracteres**, una línea que crece si hace falta.
- Bajo cada campo, dos sugerencias que se tocan según el obstáculo (§6.2). Tocar una **sustituye** el contenido del campo; se puede editar después.
- Ayudas fijas, que nunca bloquean:
  - bajo la situación: `p3_ayuda_situacion`;
  - bajo la acción: `p3_ayuda_accion`.
- **La pantalla recupera el color poco a poco** mientras se rellena (§5).
- Bloque opcional `p3_hora_pregunta`:
  - selector de hora (HH:MM, 24 h o 12 h según el idioma del navegador);
  - siete botones de día, **por defecto de lunes a viernes** activos;
  - texto `p3_hora_nota`.
- Botón **Ver mi plan**, activo cuando los dos campos tienen 3 caracteres o más.

### 4.5 Resultado · La vuelta

- Color completo. **Cae el sello** con `sello` (§5).
- El plan, grande: «Si {situación}, entonces {acción}.» Debajo, en pequeño: «Tu propósito: {propósito}».
- Tres bloques, en este orden:

**1. Recuérdamelo** (solo si hay hora; si no, el bloque muestra `rec_sin_hora` y un botón **Añadir hora** que vuelve al paso 3).
- Texto: `rec_resumen`, por ejemplo «De lunes a viernes a las 20:00, durante 4 semanas».
- Botón **Añadir a mi calendario** → descarga el `.ics` (§8.1).
- Botón secundario **Añadir a Google Calendar** → antes de abrir, muestra `gcal_aviso` con **Continuar** y **Cancelar**. Luego abre la URL del §8.2 en una pestaña nueva.
- Nota: `rec_nota`.

**2. Fondo de pantalla**
- Vista previa pequeña de la imagen (§8.3).
- Botón **Guardar imagen**.
- Instrucciones de dos pasos según el sistema: `fondo_ios` o `fondo_android`. En escritorio, las dos.

**3. Compartir Plan B**
- Botón **Compartir**: menú de compartir del móvil (`navigator.share`) con `compartir_texto` y la dirección de la miniapp. **Nunca el plan.**
- Si el navegador no tiene menú de compartir: botón **Copiar enlace**, que muestra `copiado`.

Al pie del resultado:
- **Empezar otra vez**: borra el estado y vuelve a la portada.
- Lo que la web base tenga para «más miniapps» o el catálogo. Si no tiene nada, un enlace a la portada de miminiapp.com.

## 5. Concepto visual (versión sencilla)

| Momento | Qué pasa |
|---|---|
| Portada y paso 1 | Colores de la web base, normales |
| Entrada al paso 2 | El contenedor de la miniapp pasa a gris en 600 ms (`filter: grayscale(1)` o equivalente). A la vez, una etiqueta de mes arriba cambia del mes actual a `{mesSiguiente}` |
| Paso 3 | El gris baja según lo escrito: 100 % sin nada, 50 % con un campo válido, 0 % con los dos |
| Resultado | Color completo. El sello entra girado unos −6°, de 1,4× a 1× en 300 ms, sobre el plan |

- **Contraste:** el texto tiene que cumplir WCAG AA también en gris. Si el filtro lo rompe, se aplica solo a fondos e ilustraciones, no al texto.
- **Reducir movimiento** (`prefers-reduced-motion`): sin escalas ni giros. Solo fundidos de opacidad y cambios de color instantáneos.
- **Nada más.** Sin animación de hoja de calendario, vibración ni partículas.

## 6. Textos

### 6.1 Pantallas

`{mesSiguiente}` es el nombre del mes de la fecha de hoy + 31 días, con `Intl.DateTimeFormat(idioma, { month: 'long' })`. En español va en minúscula («febrero») y en inglés con mayúscula («February»).

| Clave | ES | EN |
|---|---|---|
| titular | Es {mesSiguiente} y ya has abandonado tu propósito. | It's {nextMonth} and you've already quit your goal. |
| subtitulo | Vamos a evitarlo. Tardas 2 minutos. | Let's stop that from happening. It takes 2 minutes. |
| pie_privacidad | Gratis y sin cuenta. Lo que escribes se queda en tu móvil, salvo que tú lo compartas. Compruébalo: activa el modo avión. | Free, no account. What you type stays on your phone unless you share it. Try it: turn on airplane mode. |
| p1_pregunta | ¿Qué quieres lograr? | What do you want to achieve? |
| p1_pregunta_enero | ¿Qué quieres lograr este año? | What do you want to achieve this year? |
| p1_sugerencias | Hacer ejercicio · Leer más · Ahorrar · Aprender un idioma · Dormir mejor · Usar menos el móvil | Exercise more · Read more · Save money · Learn a language · Sleep better · Use my phone less |
| p2_pregunta | Imagina que es 1 de {mesSiguiente} y lo has dejado. ¿Qué ha pasado? | Imagine it's {nextMonth} 1 and you've stopped. What happened? |
| p2_otra_placeholder | Cuéntalo en pocas palabras | Say it in a few words |
| p3_titulo | Tu plan para ese día | Your plan for that day |
| p3_ayuda_situacion | ¿Lo podrías ver en una foto? Si no, concrétalo más. | Could you see it in a photo? If not, make it more specific. |
| p3_ayuda_accion | Algo pequeño: 5 minutos o menos. | Something small: 5 minutes or less. |
| p3_hora_pregunta | ¿A qué hora suele pasar? (opcional) | What time does it usually happen? (optional) |
| p3_hora_nota | Con una hora, te preparamos un recordatorio para tu calendario. | Add a time and we'll make a reminder for your calendar. |
| sello | Este {mesSiguiente}, no. | Not this {nextMonth}. |
| rec_sin_hora | Añade una hora para crear el recordatorio. | Add a time to create the reminder. |
| rec_resumen | {días} a las {hora}, durante 4 semanas | {days} at {time}, for 4 weeks |
| rec_nota | El aviso depende de los ajustes de tu calendario. | When it alerts you depends on your calendar settings. |
| gcal_aviso | Se abrirá Google Calendar con tu plan. Tu plan se enviará a Google. | Google Calendar will open with your plan. Your plan will be sent to Google. |
| fondo_ios | 1. Toca «Guardar imagen» y elige «Guardar imagen» en el menú. 2. En Fotos, abre la imagen, toca Compartir y «Usar como fondo de pantalla». | 1. Tap "Save image" and choose "Save Image" in the menu. 2. In Photos, open the image, tap Share and "Use as Wallpaper". |
| fondo_android | 1. Toca «Guardar imagen». 2. Abre la imagen en tu galería, toca el menú y «Establecer como fondo de pantalla». | 1. Tap "Save image". 2. Open the image in your gallery, tap the menu and "Set as wallpaper". |
| compartir_texto | Haz tu plan B para tu propósito en 2 minutos. | Make your bad day plan in 2 minutes. |
| copiado | Enlace copiado | Link copied |
| sin_conexion | Necesitas conexión para esto. Tu plan sigue aquí. | You need a connection for this. Your plan is still here. |
| evento_titulo | Plan B: {acción} | Bad Day Plan: {action} |
| evento_descripcion | Si {situación}, entonces {acción}.\nTu propósito: {propósito}\nHecho con miminiapp.com | If {situation}, then {action}.\nYour goal: {goal}\nMade with miminiapp.com |
| imagen_etiqueta | Mi plan B | My bad day plan |
| ejemplo_etiqueta | Ejemplo | Example |

`{días}` se escribe así: «De lunes a viernes» / «Monday to Friday» si son esos cinco; «Todos los días» / «Every day» si son los siete; si no, la lista de días cortos según el idioma («lun, mié, vie» / «Mon, Wed, Fri»).

### 6.2 Obstáculos y sugerencias

Las sugerencias de situación se escriben **sin «si»** y las de acción **sin «entonces»**, en minúscula, porque se insertan en la frase.

| Obstáculo ES / EN | Situación ES / EN | Acción ES / EN |
|---|---|---|
| No tuve tiempo / I ran out of time | llego tarde a casa · tengo el día lleno de reuniones / I get home late · my day is full of meetings | hago una versión de 5 minutos · lo hago nada más levantarme / I do a 5-minute version · I do it right after I wake up |
| Perdí las ganas / I lost motivation | no me apetece nada · llego sin energía / I don't feel like it at all · I have no energy left | empiezo solo 2 minutos y luego decido · preparo lo que necesito y empiezo por lo más fácil / I start with just 2 minutes and then decide · I get things ready and start with the easiest part |
| Algo se cruzó / Something came up | surge un imprevisto · cambian mis planes / something unexpected happens · my plans change | lo muevo a la mañana siguiente · hago la mitad ese día / I move it to the next morning · I do half of it that day |
| Era demasiado / It was too much | me parece demasiado · llevo varios días sin hacerlo / it feels like too much · I've skipped a few days | hago la versión mínima · vuelvo con la mitad del objetivo / I do the smallest version · I come back with half the goal |
| Se me olvidó / I forgot | llega la hora y no me he acordado · salgo de mi rutina / the time comes and I haven't remembered · my routine changes | lo hago en cuanto vea el recordatorio · lo uno a algo que ya hago, como el café / I do it as soon as I see the reminder · I attach it to something I already do, like coffee |
| Otra cosa / Something else | (sin sugerencias) | hago una versión de 5 minutos · lo muevo al día siguiente / I do a 5-minute version · I move it to the next day |

## 7. Ejemplo («Ver un ejemplo»)

Rellena el estado con estos datos y lleva al **paso 1 con todo relleno**, para que se pueda avanzar tocando Siguiente y se vean las transiciones (es el recorrido del vídeo). Una etiqueta `ejemplo_etiqueta` se ve arriba mientras no se cambie ningún campo.

| Campo | ES | EN |
|---|---|---|
| Propósito | Hacer ejercicio 3 veces por semana | Exercise 3 times a week |
| Obstáculo | No tuve tiempo | I ran out of time |
| Situación | llego a casa después de las 20:00 | I get home after 8 p.m. |
| Acción | hago 5 minutos de estiramientos antes de sentarme en el sofá | I do 5 minutes of stretching before I sit on the couch |
| Hora | 20:00, de lunes a viernes | 20:00, Monday to Friday |

## 8. Salidas

### 8.1 Archivo `.ics`

- Un `VEVENT` con:
  - `SUMMARY`: `evento_titulo`.
  - `DESCRIPTION`: `evento_descripcion`, con los escapes de iCalendar (`\n`, `\,`, `\;`, `\\`) y líneas plegadas a 75 octetos.
  - `DTSTART`: **hora local flotante** (sin `Z` ni `TZID`), en el primer día elegido a partir de mañana, a la hora elegida. `DTEND` = inicio + 15 minutos (nunca igual al inicio).
  - `RRULE:FREQ=WEEKLY;BYDAY={días};UNTIL={inicio + 28 días, fecha local}`.
  - `VALARM` con `ACTION:DISPLAY` y `TRIGGER:PT0M`.
  - `UID` aleatorio y `DTSTAMP` en UTC.
- Nombre del archivo: `plan-b.ics` o `bad-day-plan.ics`.
- **Riesgo conocido:** Safari en iPhone falla a menudo con descargas generadas en el navegador. La IA implementa la descarga normal (`Blob` + enlace con `download`) y una alternativa para iOS (abrir una URL `data:text/calendar`). **Ale lo prueba el día 1 en un iPhone y un Android** y se queda la que abra el calendario. Si en iPhone no funciona ninguna, el botón se oculta en iOS y queda Google Calendar.

### 8.2 Google Calendar

URL `https://calendar.google.com/calendar/render?action=TEMPLATE` con `text`, `details`, `dates` (inicio/fin en hora local flotante, `AAAAMMDDTHHMMSS/AAAAMMDDTHHMMSS`) y `recur=RRULE:…` (la misma regla). Se abre con `target="_blank"` y `rel="noopener"`. Sin conexión, muestra `sin_conexion`.

### 8.3 Imagen para la pantalla de bloqueo

- Se dibuja con `canvas` en el navegador.
- Tamaño: el de la pantalla × `devicePixelRatio`, redondeado. Si no se puede leer, 1179 × 2556.
- Fondo: un color sólido o un degradado suave con los colores de la web base.
- **Zona de texto: entre el 32 % y el 72 % de la altura**, con márgenes laterales del 10 %. Arriba va el reloj del móvil y abajo los accesos rápidos.
- Contenido, centrado: `imagen_etiqueta` pequeña arriba y, debajo, la frase completa «Si {situación}, entonces {acción}.» grande.
- Tamaño de letra: empieza en el 7 % del ancho y baja hasta que quepa, con un mínimo del 4 %. Ajuste de línea por palabras.
- **Sin dirección web ni logotipo.**
- Guardar:
  - si `navigator.canShare({ files })` lo permite, menú de compartir con el PNG (en iPhone aparece «Guardar imagen»);
  - si no, descarga normal del PNG.

## 9. Medición

Solo si la web base ya tiene una medición anónima configurada (por ejemplo, Umami). Si no, nada.

Eventos, **sin ningún dato de lo escrito**: `planb_empezar`, `planb_ejemplo`, `planb_terminar`, `planb_ics`, `planb_gcal`, `planb_fondo`, `planb_compartir`. Si la medición falla o no hay conexión, no pasa nada visible.

## 10. Calidad mínima

- **Móviles:** iPhone con Safari y Android con Chrome actuales. Escritorio: Chrome, Safari y Firefox actuales.
- **Accesibilidad:** se puede hacer todo con teclado, el foco se ve, cada campo tiene etiqueta, las tarjetas son botones de verdad, y al cambiar de paso el foco va al título del paso. Contraste AA, también en gris.
- **Rendimiento:** la miniapp no añade más de ~50 KB de JS y CSS sin comprimir a lo que ya carga la base.
- **Robustez:** recargar mantiene el paso y lo escrito. Atrás del navegador vuelve al paso anterior o, como mínimo, no rompe la miniapp.
- **Pruebas automáticas** de la lógica pura: `{mesSiguiente}` (incluidos el 31 de enero y diciembre → enero), la primera fecha del evento, la regla de 4 semanas, los escapes del `.ics` y la URL de Google con caracteres especiales y emojis.

## 11. Plan de trabajo y orden de recorte

| Sesión (2–3 h de Ale) | La IA construye | Ale comprueba |
|---|---|---|
| **1** | Lectura de la base y resumen. Rutas ES/EN. Los 4 pasos con estado y validaciones, sin estilo fino. Generación del `.ics` y del enlace de Google. Pruebas de la lógica | **El `.ics` y Google Calendar en su iPhone y su Android.** Decide qué variante del `.ics` queda |
| **2** | Resultado completo. Imagen para la pantalla de bloqueo y su guardado. Compartir y copiar enlace. Textos ES/EN del §6 | Guardar la imagen y ponerla de fondo en los dos móviles. Leer los textos |
| **3** | Concepto visual del §5 con «reducir movimiento». Accesibilidad. Modo avión. Ejemplo. Medición, si existe | El recorrido del ejemplo en modo avión. 2–3 personas lo prueban sin ayuda |
| **4 (colchón)** | Correcciones de la sesión 3 y publicación | Repaso final en los dos móviles |

**Si no da tiempo, se recorta en este orden** (lo primero es lo que antes se quita):
1. Medición.
2. Instrucciones del fondo por sistema (se dejan las dos juntas).
3. El gris progresivo del paso 3 (pasa de gris a color de golpe al llegar al resultado).
4. Google Calendar, si el `.ics` funciona en los dos móviles.

**No se recorta nunca:** los 3 pasos, el plan en pantalla, al menos un recordatorio que funcione en iPhone y en Android, la imagen, los dos idiomas, el modo avión y el sello.

## 12. Fuera de alcance

Imagen para stories, «Reta a alguien», varios estilos de fondo, vista previa sobre un móvil, vibración, varios propósitos, historial, rachas, notificaciones propias, cuentas, IA, idiomas que se escriben de derecha a izquierda, y cualquier mejora de la web base.

## 13. Hecho significa

1. Los 4 pasos y el resultado funcionan en ES y EN con los textos del §6.
2. El ejemplo se recorre entero en modo avión en un iPhone y en un Android, y el sello se ve.
3. El recordatorio crea en esos dos móviles un evento de 4 semanas con el título y la descripción correctos.
4. La imagen se guarda y se puede poner de fondo en esos dos móviles, con el texto legible bajo el reloj.
5. Ninguna petición de red lleva texto de la persona, salvo Google Calendar y compartir tras pulsarlos (comprobado en la pestaña Red del navegador).
6. Las pruebas automáticas del §10 pasan.
7. Está publicado en miminiapp.com en las dos direcciones.
