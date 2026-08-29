# Modelos Gráficos

Este directorio guarda las imágenes exportadas de los modelos conceptuales.

Los documentos fuente actualizados están en:

- `docs/analisis/modelo-conceptual-detallado.md`: modelo completo.
- `docs/analisis/modelo-mvp.md`: modelo del MVP.

## Estado Actual

- `La Racha - Modelo Conceptual.png`: pendiente de regenerar.
- `La Racha MVP.png`: pendiente de regenerar.

## Motivo

Después de crear estos gráficos se decidió añadir o ajustar varias entidades del MVP y del modelo completo:

- `RECUPERACION_RACHA`
- `FOTO_QUEDADA`
- `OBJETO_PERDIDO`
- `QUEDADA.creada_por_membresia_id`
- `QUEDADA.notas`

También se eliminó del modelo MVP el campo directo `QUEDADA.foto_url` y el campo directo `QUEDADA.objetos_perdidos_membresia_id`.

Cuando se puedan editar de nuevo los diagramas, hay que añadir:

```text
RECUPERACION_RACHA
- id
- grupo_id
- racha_perdida_periodos
- periodos_necesarios
- periodos_completados
- estado
- fecha_inicio
- fecha_fin
- fecha_creacion
```

Relación:

```text
GRUPO 1 --- N RECUPERACION_RACHA
```

```text
FOTO_QUEDADA
- id
- quedada_id
- url
- descripcion
- fecha_creacion
```

Relación:

```text
QUEDADA 1 --- N FOTO_QUEDADA
```

```text
OBJETO_PERDIDO
- id
- quedada_id
- membresia_id
- descripcion
- fecha_creacion
```

Relaciones:

```text
QUEDADA 1 --- N OBJETO_PERDIDO
MEMBRESIA 1 --- N OBJETO_PERDIDO
```

Hasta que se regeneren, los modelos escritos son la fuente de verdad.
