# Modelo Lógico Del MVP

## Uso De Este Documento

Este documento sirve para convertir el MVP en base de datos.

No está pensado como diagrama conceptual principal. Úsalo para revisar tablas, columnas, tipos, campos obligatorios, claves foráneas y restricciones antes de escribir SQL para Supabase.

Este documento traduce el modelo conceptual del MVP a una estructura cercana a base de datos.

Todavía no es SQL definitivo, pero ya define tablas, campos, tipos, obligatoriedad y relaciones principales.

Las restricciones cerradas para convertir este modelo a SQL están resumidas en [restricciones-mvp.md](restricciones-mvp.md).

## Decisiones Aplicadas

- El MVP permite usuarios reales y miembros sin cuenta.
- `membresias.usuario_id` será opcional.
- Las fotos se guardarán como URLs simples en una tabla propia para permitir varias fotos por quedada.
- La duración de una quedada se guardará en minutos.
- `tipo_plan`, `lugar` y `comida` usarán opciones reutilizables por grupo.
- `objetos_perdidos` tendrá tabla propia porque varias personas pueden dejarse algo en la misma quedada.
- `asistencias.estado` se mantiene con valores `asistio` y `no_asistio`.
- Las insignias del MVP serán de racha y pertenecerán al grupo.
- La recuperación de racha entra en el MVP como entidad propia para poder mostrar progreso y calcular estadísticas.
- Los valores cerrados se validarán con `text + check` en PostgreSQL.

## Tabla: usuarios

```text
usuarios
- id: uuid pk
- nombre: text not null
- username: text null unique
- email: text not null unique
- avatar_global_url: text null
- fecha_creacion: timestamptz not null
- fecha_actualizacion: timestamptz not null
```

Notas:

- Más adelante se conectará con Supabase Auth.
- En el MVP el email será obligatorio y único.
- `username` será opcional al principio, pero único cuando exista.
- `avatar_global_url` será texto opcional en el MVP.
- Un usuario podrá borrar su propia cuenta.
- El borrado de usuario no debe borrar automáticamente el histórico de grupos, quedadas o asistencias.
- Si el usuario que borra su cuenta es admin de algún grupo, antes se traspasa el rol admin al miembro activo más antiguo de ese grupo.
- Al borrar un usuario, sus membresías se conservan, se desvinculan de `usuario_id` y pasan a `estado = eliminada`.
- Si no existe otro miembro activo al que traspasar el rol admin, el usuario deberá borrar el grupo antes o cancelar el borrado de cuenta.

## Tabla: grupos

```text
grupos
- id: uuid pk
- nombre: text not null
- descripcion: text null
- foto_perfil_url: text null
- privacidad: text not null
- frecuencia_racha: text not null
- tregua_verano_activa: boolean not null
- fecha_creacion: timestamptz not null
- fecha_actualizacion: timestamptz not null
```

Notas:

- `privacidad` será `privado` por defecto.
- El contenido interno del grupo será siempre privado.
- En versiones futuras solo se compartirá contenido concreto de forma explícita: insignias, highlights, fotos seleccionadas o Wrapped.
- En versiones futuras, el seguimiento de un grupo podrá ser `abierto` o `por_solicitud`, pero el contenido interno seguirá siendo privado.
- `frecuencia_racha` podrá tener valores: `dos_veces_semana`, `semanal`, `dos_al_mes`, `mensual`, `seis_al_anio`.
- `frecuencia_racha` se elige al crear el grupo y no se podrá cambiar en el MVP.
- `tregua_verano_activa` será `false` por defecto.
- Si un administrador elimina un grupo, se eliminarán también sus datos asociados. La interfaz deberá pedir confirmación fuerte antes de hacerlo.

## Tabla: membresias

```text
membresias
- id: uuid pk
- usuario_id: uuid fk null
- grupo_id: uuid fk not null
- rol: text not null
- apodo: text not null
- avatar_grupo_url: text null
- estado: text not null
- fecha_entrada: timestamptz not null
- fecha_actualizacion: timestamptz not null
```

Relaciones:

- `membresias.usuario_id` referencia `usuarios.id`.
- `membresias.grupo_id` referencia `grupos.id`.

Notas:

- Si `usuario_id` es null, la membresía representa un miembro sin cuenta.
- Un miembro sin cuenta no puede iniciar sesión.
- Solo administradores pueden crear o editar miembros sin cuenta.
- `rol` podrá ser `admin` o `miembro`.
- `rol` será `miembro` por defecto, salvo la membresía creadora del grupo, que será `admin`.
- El rol `admin` será inamovible e intransferible en el MVP, salvo si el admin borra su cuenta.
- Si el admin borra su cuenta, el rol admin pasa al miembro activo más antiguo del grupo.
- Solo podrá existir una membresía con rol `admin` por grupo.
- `estado` podrá ser `activa` o `eliminada`.
- `activa` significa que forma parte del grupo y aparece en el registro normal de asistencias.
- `eliminada` significa que ya no aparece como miembro actual, pero conserva su histórico.
- Un usuario real no podrá tener dos membresías activas en el mismo grupo.
- No se podrá repetir `apodo` dentro del mismo grupo entre membresías activas.
- Solo el administrador puede eliminar membresías de un grupo.

## Tabla: opciones_grupo

```text
opciones_grupo
- id: uuid pk
- grupo_id: uuid fk not null
- tipo: text not null
- valor: text not null
- fecha_creacion: timestamptz not null
```

Relaciones:

- `opciones_grupo.grupo_id` referencia `grupos.id`.

Notas:

- Sirve para valores reutilizables dentro de un grupo.
- Tipos iniciales: `tipo_plan`, `lugar`, `comida`.
- Ejemplo: `tipo = comida`, `valor = McDonalds`.
- No se podrá repetir el mismo `valor` para el mismo `grupo_id` y `tipo`.
- La misma opción sí podrá reutilizarse en muchas quedadas distintas.
- Si alguien escribe una opción nueva en una quedada, el sistema podrá guardarla automáticamente para el grupo.

## Tabla: quedadas

```text
quedadas
- id: uuid pk
- grupo_id: uuid fk not null
- titulo: text not null
- fecha: timestamptz not null
- conductor_membresia_id: uuid fk null
- creada_por_membresia_id: uuid fk not null
- tipo_plan_opcion_id: uuid fk null
- tipo_plan_texto: text null
- momento_dia: text null
- lugar_opcion_id: uuid fk null
- lugar_texto: text null
- comida_opcion_id: uuid fk null
- comida_texto: text null
- duracion_minutos: integer null
- notas: text null
- fecha_creacion: timestamptz not null
- fecha_actualizacion: timestamptz not null
```

Relaciones:

- `quedadas.grupo_id` referencia `grupos.id`.
- `quedadas.conductor_membresia_id` referencia `membresias.id`.
- `quedadas.creada_por_membresia_id` referencia `membresias.id`.
- `quedadas.tipo_plan_opcion_id` referencia `opciones_grupo.id`.
- `quedadas.lugar_opcion_id` referencia `opciones_grupo.id`.
- `quedadas.comida_opcion_id` referencia `opciones_grupo.id`.

Notas:

- Las opciones seleccionadas deben pertenecer al mismo grupo que la quedada.
- El conductor debe ser una membresía del mismo grupo.
- `creada_por_membresia_id` debe ser una membresía real del mismo grupo.
- Los campos `*_texto` permiten guardar el valor visible aunque se haya creado desde el formulario.
- `momento_dia` podrá tener valores: `manana`, `tarde`, `tarde_noche`, `noche`, `dia_completo`.
- `tipo_plan`, `lugar`, `comida`, `momento_dia`, `duracion_minutos`, `conductor_membresia_id` y `notas` serán opcionales.
- `duracion_minutos`, si existe, debe ser mayor que 0.
- Las quedadas no se borrarán en el MVP. Se podrán editar y la lógica deberá recalcular racha, insignias y recuperación cuando haga falta.
- Todos los miembros reales del grupo podrán registrar y editar quedadas.

## Tabla: fotos_quedada

```text
fotos_quedada
- id: uuid pk
- quedada_id: uuid fk not null
- url: text not null
- descripcion: text null
- fecha_creacion: timestamptz not null
```

Relaciones:

- `fotos_quedada.quedada_id` referencia `quedadas.id`.

Notas:

- Permite asociar varias fotos a una misma quedada.
- En el MVP las fotos se guardan como URL simple.
- Más adelante se podrá conectar con Supabase Storage.

## Tabla: objetos_perdidos

```text
objetos_perdidos
- id: uuid pk
- quedada_id: uuid fk not null
- membresia_id: uuid fk not null
- descripcion: text null
- fecha_creacion: timestamptz not null
```

Relaciones:

- `objetos_perdidos.quedada_id` referencia `quedadas.id`.
- `objetos_perdidos.membresia_id` referencia `membresias.id`.

Notas:

- Representa que una membresía se dejó algo en una quedada.
- Una quedada puede tener varias personas con objetos perdidos.
- `descripcion` es opcional y permite concretar qué se dejó, si se quiere.
- La membresía debe pertenecer al mismo grupo que la quedada.

## Tabla: asistencias

```text
asistencias
- id: uuid pk
- quedada_id: uuid fk not null
- membresia_id: uuid fk not null
- estado: text not null
- fecha_creacion: timestamptz not null
- fecha_actualizacion: timestamptz not null
```

Relaciones:

- `asistencias.quedada_id` referencia `quedadas.id`.
- `asistencias.membresia_id` referencia `membresias.id`.

Notas:

- La membresía debe pertenecer al mismo grupo que la quedada.
- Al registrar una quedada, se creará una fila por cada membresía activa del grupo.
- Las membresías marcadas en el formulario se guardarán con `estado = asistio`.
- Las membresías no marcadas se guardarán automáticamente con `estado = no_asistio`.
- Para calcular racha solo cuentan las asistencias con `estado = asistio`.
- No podrá existir más de una asistencia para la misma combinación de `quedada_id` y `membresia_id`.

## Tabla: insignias

```text
insignias
- id: uuid pk
- nombre: text not null
- descripcion: text null
- criterio: text not null
- tipo: text not null
- imagen_url: text not null
- fecha_creacion: timestamptz not null
```

Notas:

- En el MVP serán insignias de racha grupal.
- `tipo` será inicialmente `racha_grupo`.
- Insignias iniciales: `1_semana`, `2_semanas`, `1_mes`, `3_meses`, `6_meses`, `1_anio`.
- Las insignias son datos semilla del sistema.
- Los usuarios no pueden crear, editar ni borrar insignias desde la app.
- Las insignias semilla podrán usar una imagen por defecto mientras no exista su imagen definitiva.

## Tabla: insignias_desbloqueadas

```text
insignias_desbloqueadas
- id: uuid pk
- insignia_id: uuid fk not null
- grupo_id: uuid fk not null
- membresia_id: uuid fk null
- fecha_desbloqueo: timestamptz not null
- fecha_creacion: timestamptz not null
```

Relaciones:

- `insignias_desbloqueadas.insignia_id` referencia `insignias.id`.
- `insignias_desbloqueadas.grupo_id` referencia `grupos.id`.
- `insignias_desbloqueadas.membresia_id` referencia `membresias.id`.

Notas:

- Para el MVP, normalmente `membresia_id` será null porque las insignias son del grupo.
- Se deja el campo para no cerrar la puerta a insignias individuales futuras.
- No se podrá desbloquear la misma insignia dos veces para el mismo grupo.

## Tabla: recuperaciones_racha

```text
recuperaciones_racha
- id: uuid pk
- grupo_id: uuid fk not null
- racha_perdida_periodos: integer not null
- periodos_necesarios: integer not null
- periodos_completados: integer not null
- estado: text not null
- fecha_inicio: date not null
- fecha_fin: date null
- fecha_creacion: timestamptz not null
- fecha_actualizacion: timestamptz not null
```

Relaciones:

- `recuperaciones_racha.grupo_id` referencia `grupos.id`.

Notas:

- Representa un intento de recuperar una racha perdida.
- `racha_perdida_periodos` guarda cuántos periodos de racha tenía el grupo antes de perderla.
- `periodos_necesarios` normalmente será igual a `racha_perdida_periodos`.
- `periodos_completados` indica cuántos periodos válidos lleva el grupo dentro de la recuperación.
- `estado` podrá tener valores: `en_progreso`, `completada`, `fallida`.
- Un grupo no debería tener más de una recuperación con `estado = en_progreso` a la vez.
- Esta tabla permitirá calcular estadísticas como cuántas veces se ha perdido la racha, cuántas recuperaciones se han completado y cuántos periodos se han invertido recuperando rachas.
- Si una recuperación falla, se conserva en histórico y una nueva recuperación empieza desde cero.

## Reglas De Racha En El MVP

- Una quedada cuenta para racha si pertenece al grupo, cumple la frecuencia configurada y tiene al menos 3 asistencias con `estado = asistio`.
- Si un grupo pierde una racha, podrá recuperarla quedando de forma consecutiva durante el tiempo equivalente a la racha perdida.
- Ejemplo: si se pierde una racha de 3 semanas, el grupo debe quedar durante las 3 semanas siguientes según su frecuencia.
- El periodo usado para recuperar la racha no suma como racha nueva.
- Cuando se pierde una racha, se crea una fila en `recuperaciones_racha`.
- Cada periodo válido completado durante la recuperación incrementa `periodos_completados`.
- Si `periodos_completados` alcanza `periodos_necesarios`, la recuperación pasa a `completada`.
- Si el grupo falla durante la recuperación, la recuperación pasa a `fallida`.
- La tregua de verano queda representada por `tregua_verano_activa`, pero sus reglas avanzadas se implementarán después del primer cálculo básico de racha.
