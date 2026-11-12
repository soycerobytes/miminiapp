# I-03 — identidad persistente entre PR y CI

**Actualizado:** 2026-11-07. **Estado:** implementado y fusionado mediante PR #4; identidad persistente comprobada después del merge en la publicación real de staging. Hito staging `Verificado`; I-03 sigue `En curso`, sin aceptación global. La actualización actual es solo documental.

## Mecanismo elegido

Se utiliza `run-name`, con expresiones que GitHub evalúa al crear la ejecución, en lugar de añadir un artefacto o credencial. La [documentación oficial](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#run-name) permite expresiones del contexto github y describe que, sin run-name explícito, el nombre procede del mensaje de commit o título del PR. Se consultó además la fuente oficial github/docs. El título libre no se utiliza como evidencia.

Para un evento pull_request, ci.yml genera exactamente:

```text
I03 CI v1 | repo=aalexlpez/miminiapp | id=1445849027 | pr=4 | base=staging | head=<SHA completo de 40 caracteres>
```

Los cinco valores proceden exclusivamente de github.event.pull_request: base.repo.full_name, base.repo.id, number, base.ref y head.sha. No se incorpora el título del PR, código ejecutado por sus tests o un valor configurable mediante inputs. Un evento push recibe un nombre distinto y nunca es candidato para quality de un PR.

GitHub expone el nombre evaluado como display_title del run. El gate lo compara literalmente con la identidad reconstruida a partir del PR detallado que ya ha confirmado realmente fusionado. El número del PR y su base permanecen en el nombre aunque pull_requests esté vacío después del merge; la ausencia del array no es por sí misma evidencia ni una autorización.

La API real del nuevo CI confirmó que run.name también contiene el nombre dinámico, mientras actions/workflows/ci.yml conserva name=CI. Se distinguen ambos contratos: descriptor CI por ID/path/nombre; name y display_title del run iguales a la identidad esperada. Las fixtures reproducen esta estructura observada.

## Comprobaciones conjuntas

1. El lector está limitado al repositorio aprobado y a GET. Entre los runs del evento pull_request, workflow ci.yml y head SHA esperado elige el de mayor ID **antes** de filtrar por identidad de repositorio, título o estado. Un título ausente/manipulado, repositorio contradictorio o run más nuevo fallido no permite volver a un verde anterior.
2. Se verifica la identidad/path/estado activo del workflow por API. Se consulta ci.yml tanto en el head SHA inmutable como en el commit de merge que se pretende publicar, y se exige en ambos su blob Git completo fijado en CI_WORKFLOW_BLOB_SHA. También se rechaza una definición distinta heredada de la base. No se interpreta un fragmento YAML mediante regex ni se acepta un run-name hardcodeado dentro de un workflow modificado. El test estructural y el hash local también fijan la plantilla exacta.
3. Listado y detalle del run deben coincidir con repositorio y head_repository por ID/nombre, workflow ID/path/nombre, evento pull_request, head SHA/rama, display_title exacto, intento entero positivo, estado completed y conclusión success.
4. Si pull_requests está ausente o vacío, todas las comprobaciones anteriores siguen siendo obligatorias. Si tiene contenido, todas sus entradas deben coincidir con el PR; cualquier contradicción de número, base, head o repositorio informado lo rechaza. Datos malformados tampoco abren el gate.
5. Se consulta jobs del intento exacto actual. Debe haber un único job quality completed/success con el mismo run_attempt. Se relee el detalle y el listado después: otro intento, run nuevo, fallo, ejecución pendiente o identidad distinta invalidan la prueba.
6. checkMerged conserva la confirmación del merge real, merger/actores propietarios, rama/SHA/primer padre, relectura del ref y los controles del artefacto. La publicación vuelve a validar bajo su bloqueo antes de escribir. Producción, promoción y rollback siguen deshabilitados.

CI solo conserva contents:read, checkout sin credenciales persistentes, acciones y runtime fijados. No se añaden secretos, pull_request_target, escrituras, jobs privilegiados o dependencias. El gate funciona con TypeScript nativo antes de npm ci.

La nueva identidad se aplica al job quality del workflow CI. El check promotion sigue bloqueado explícitamente y conserva su lector anterior; resolver su asociación persistente y cualquier activación de producción queda fuera de esta entrega y requiere el alcance correspondiente.

## Mantenimiento y límites

Un cambio futuro de ci.yml exige revisar el diff y actualizar explícitamente CI_WORKFLOW_BLOB_SHA con `git hash-object .github/workflows/ci.yml`; la auditoría falla si no coincide. El pin cubre todo el archivo, incluido run-name, triggers, permisos y quality. Los CI anteriores sin identidad versionada no se aceptan retroactivamente.

El título no es una firma criptográfica o revisión independiente. La confianza combina metadatos proporcionados por GitHub, la plantilla fijada en el head y merge revisados y el modelo aprobado de ramas protegidas/revisión y merge del propietario. Los PR se ejecutan sobre un merge sintético; el API head_sha identifica el head del PR. Verificar ambos blobs evita aceptar una definición heredada diferente, pero no se presenta como una atestación independiente del runner. Las modificaciones de workflow/base y del propio gate siguen sometidas a revisión humana y protecciones.

La API no ofrece una transacción atómica entre leer CI/refs y publicar; se mantienen relecturas y revalidación inmediata bajo el bloqueo compartido. La confirmación posterior al merge ya existe: el CI42303556241 conserva el título de PR4/head ead0f834 aunque pull_requests está vacío, y el run42305409224 intento4 completó el gate y la publicación real. Las simulaciones anteriores siguen identificadas como tales. El aislamiento de escritura Cloudflare permanece sin probar; el403 real del probe acredita solo denegación de lectura.

## Verificación local y evidencia de revisión

`npm run verify` finaliza exit0: tipos64 archivos sin errores/warnings/hints, lint/formato/hosting,314 unitarias,9 componentes,26 E2E e integración modular/regresión I-01 satisfactorias con Chromium156.0.8078.4/r1248 fijado. Las40 pruebas de pr-ci-identity cubren identidad ausente/manipulada, repositorio/PR/base/head/workflow/evento, contradicciones, pin de head/merge, calidad, intentos y cambios concurrentes; checkMerged y auditoría estructural añaden integración con el contrato.

Durante la revisión se corrigió el tipado genérico del lector simulado y se movieron tres casos negativos a su tabla de asociaciones para que comprobaran esa validación. La ampliación del pin al merge detectó una fixture sin ese campo; se actualizó antes de la batería final. Los primeros chequeos y el resultado final quedan separados en evidencia local ignorada `.local/verification/i03/pr-ci-identity/`.

La lectura real del CI42302954132 (head8e1562e) confirmó el título versionado exacto y el campo dinámico run.name. Se ajustó su comparación y las fixtures antes de entregar el código final. Tras el ajuste, `npm run verify` vuelve a finalizar exit0 con los mismos314/9/26 resultados y tipos64 correctos.

El lector TypeScript nativo validó esos metadatos reales con solo GET: success; en un replay local de las respuestas cambiando únicamente pull_requests a[] también success; con una entrada contradictoria adicional, failure. Estos dos últimos estados son simulaciones sobre metadatos grabados y no pruebas empíricas después del merge. La evidencia saneada y el script de lectura quedan en la carpeta ignorada anterior.

El CI final de la corrección pasó en [PR42303556241](https://github.com/aalexlpez/miminiapp/actions/runs/42303556241) y push42303557377. PR #4 fue fusionado después por el propietario en e1e3b659. El [informe de staging](i03-staging-preparation-report.md) registra el [despliegue posterior satisfactorio, intento4](https://github.com/aalexlpez/miminiapp/actions/runs/42305409224/attempts/4). La lectura API de esta actualización confirma el título persistente con array vacío tras el merge. Este PR documental no repite pruebas o despliegues ni cambia el mecanismo.
