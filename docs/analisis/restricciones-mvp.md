# Restricciones Del MVP

## Uso De Este Documento

Este documento recoge las restricciones cerradas antes de convertir el modelo lógico del MVP a SQL.

Sirve como puente entre `modelo-logico-mvp.md` y la migración inicial de PostgreSQL.

## Decisiones Generales

- Todas las tablas usarán `uuid` como clave primaria.
- Los valores cerrados se validarán con `text + check`.
- Todas las tablas tendrán `fecha_creacion` automática.
- Las tablas editables tendrán `fecha_actualizacion` automática.
- Los nombres internos no usarán tildes: `manana`, `tarde_noche`, `seis_al_anio`, etc.
- Las tablas y columnas se nombrarán en español.

## Usuarios

- `email` será obligatorio y único.
- `nombre` será obligatorio.
- `username` será obligatorio y único.
- El registro debe comprobar si un `username` ya está ocupado antes de avanzar a la siguiente pantalla.
- `fecha_nacimiento` será obligatoria para usuarios nuevos.
- La obligatoriedad de `fecha_nacimiento` se aplica con `CHECK NOT VALID` mientras existan usuarios de prueba antiguos sin ese dato.
- Si se informa `fecha_nacimiento`, no podrá ser futura ni anterior a 1900-01-01.
- `avatar_global_url` será opcional.
- Si no hay `avatar_global_url`, la interfaz mostrará una imagen por defecto.
- Un usuario podrá borrar su propia cuenta si lo desea.
- Borrar un usuario no debe borrar automáticamente el histórico de los grupos donde haya participado.
- Si el usuario que borra su cuenta es admin de algún grupo, sus derechos de administrador se traspasan antes al miembro activo más antiguo de ese grupo.
- Al borrar un usuario, sus membresías se conservan como histórico, se desvinculan de `usuario_id` y pasan a `estado = eliminada`.
- Si el admin borra su cuenta y no existe otro miembro activo al que traspasar el rol, deberá borrar el grupo antes o cancelar el borrado de cuenta.

## Grupos

- `nombre` será obligatorio.
- `descripcion` será opcional.
- `foto_perfil_url` será opcional.
- Si no hay `foto_perfil_url`, la interfaz mostrará una imagen por defecto de grupo.
- `privacidad` tendrá valor `privado` por defecto.
- En el MVP todos los grupos serán privados.
- `tregua_verano_activa` tendrá valor `false` por defecto.
- `frecuencia_racha` tendrá valor `semanal` por defecto.
- `frecuencia_racha` se elige al crear el grupo y no se cambia en el MVP.
- Si se borra un grupo, se borran sus datos asociados en cascada.
- La interfaz debe pedir confirmación fuerte al menos dos veces antes de borrar un grupo.

## Membresías

- `grupo_id` será obligatorio.
- `usuario_id` será opcional.
- `apodo` será obligatorio.
- `avatar_grupo_url` será opcional.
- Si no hay `avatar_grupo_url`, la interfaz mostrará una imagen por defecto de membresía.
- `rol` tendrá valores `admin` y `miembro`.
- `rol` tendrá valor `miembro` por defecto.
- La membresía creadora del grupo tendrá rol `admin`.
- En el MVP solo habrá un admin por grupo.
- El rol admin será inamovible e intransferible, salvo cuando el admin borre su cuenta.
- Si el admin borra su cuenta, el rol admin pasa al miembro activo más antiguo del grupo.
- `estado` tendrá valores `activa` y `eliminada`.
- `estado` tendrá valor `activa` por defecto.
- Un usuario real no puede tener dos membresías activas en el mismo grupo.
- No puede repetirse el mismo apodo dentro de un grupo entre membresías activas.
- Eliminar una membresía no borra su histórico: cambia su estado a `eliminada`.
- Solo el administrador puede eliminar membresías de un grupo.
- Siempre debe existir una membresía admin activa por grupo.

## Opciones De Grupo

- `grupo_id` será obligatorio.
- `tipo` tendrá valores `tipo_plan`, `lugar` y `comida`.
- `valor` será obligatorio.
- No puede repetirse la combinación `grupo_id + tipo + valor`.
- Las opciones no se borran en el MVP.
- Si se borra un grupo, se borran sus opciones.

## Quedadas

- `grupo_id`, `titulo`, `fecha` y `creada_por_membresia_id` serán obligatorios.
- `conductor_membresia_id` será opcional.
- `tipo_plan_opcion_id`, `lugar_opcion_id` y `comida_opcion_id` serán opcionales.
- `tipo_plan_texto`, `lugar_texto` y `comida_texto` serán opcionales.
- Si se usa una opción, también se guardará el texto histórico correspondiente.
- `momento_dia` será opcional.
- `momento_dia` tendrá valores `manana`, `tarde`, `tarde_noche`, `noche` y `dia_completo`.
- `duracion_minutos` será opcional.
- Si `duracion_minutos` existe, debe ser mayor que 0.
- `notas` será opcional.
- Las quedadas no se borran en el MVP.
- Las quedadas se pueden editar.
- Todos los miembros reales del grupo pueden registrar y editar quedadas.
- Editar una quedada debe recalcular racha, insignias y recuperación si afecta a esos datos.
- Las ediciones que afecten a varias tablas deben hacerse en una transacción.

## Fotos De Quedada

- Una quedada puede tener varias fotos.
- `quedada_id` será obligatorio.
- `url` será obligatoria.
- `descripcion` será opcional.
- En el MVP las fotos serán URLs simples.
- Más adelante podrán conectarse con Supabase Storage.

## Objetos Perdidos

- Una quedada puede tener varias personas registradas en objetos perdidos.
- `quedada_id` será obligatorio.
- `membresia_id` será obligatorio.
- `descripcion` será opcional.
- La membresía debe pertenecer al mismo grupo que la quedada.

## Asistencias

- `quedada_id` será obligatorio.
- `membresia_id` será obligatorio.
- `estado` tendrá valores `asistio` y `no_asistio`.
- Tendrá `fecha_creacion` automática.
- Tendrá `fecha_actualizacion` automática para conservar cuándo se modificó por última vez.
- No puede repetirse la combinación `quedada_id + membresia_id`.
- Si una membresía se marca como eliminada, sus asistencias pasadas se conservan.

## Insignias

- Las insignias son datos semilla del sistema.
- Los usuarios no pueden crear, editar ni borrar insignias.
- `nombre` será obligatorio.
- `descripcion` será opcional.
- `criterio` será obligatorio.
- `tipo` tendrá valor `racha_grupo`.
- `imagen_url` será obligatoria.
- Mientras no exista una imagen definitiva, las insignias semilla podrán usar la imagen por defecto guardada en `docs/recursos/Insignias/Por Defecto.png`.
- No debe haber dos insignias con el mismo `tipo` y `criterio`.

## Insignias Desbloqueadas

- `insignia_id` será obligatorio.
- `grupo_id` será obligatorio.
- `membresia_id` será opcional.
- No puede repetirse la combinación `grupo_id + insignia_id`.
- Si se borra un grupo, se borran sus insignias desbloqueadas.
- Las insignias base no se borran.

## Recuperaciones De Racha

- `grupo_id` será obligatorio.
- `racha_perdida_periodos` será obligatorio.
- `periodos_necesarios` será obligatorio.
- `periodos_completados` tendrá valor `0` por defecto.
- `estado` tendrá valores `pendiente`, `en_progreso`, `pausada`, `completada` y `fallida`.
- `estado` tendrá valor `pendiente` por defecto.
- `fecha_inicio` será obligatoria.
- `fecha_fin` será opcional.
- Un grupo solo puede tener una recuperación activa al mismo tiempo. Estados activos: `pendiente`, `en_progreso` y `pausada`.
- Si se borra un grupo, se borran sus recuperaciones.
- Las recuperaciones completadas y fallidas se conservan como histórico.
- Si una recuperación falla, una nueva recuperación empieza desde cero.
- Si una racha se rompe, la recuperación queda pendiente hasta que el administrador decida reactivarla.
- Mientras la recuperación no esté completada, la racha queda congelada y no se desbloquean insignias nuevas.
- La racha solo puede romperse cuando termina el periodo que tocaba cumplir.
- Si el periodo actual aún está abierto, no se debe crear una recuperación por adelantado.
- La tregua de verano puede pausar una recuperación sin perder el progreso acumulado.

## Privacidad Y Permisos Iniciales

- Los usuarios solo pueden ver grupos donde tengan membresía.
- Solo el admin puede editar el grupo.
- Solo el admin puede eliminar el grupo.
- Solo el admin puede crear o editar membresías sin cuenta.
- Cualquier miembro real del grupo puede registrar quedadas.
- Cualquier miembro real del grupo puede editar quedadas.

## Visión Futura De Seguimiento

- No habrá grupos públicos en el sentido de exponer todo su contenido.
- El contenido interno de un grupo siempre será privado.
- En la versión futura, el seguimiento de grupo podrá ser `abierto` o `por_solicitud`.
- En ambos casos, los seguidores solo verán contenido que el grupo comparta explícitamente.
