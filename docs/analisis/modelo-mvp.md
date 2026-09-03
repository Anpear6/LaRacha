# Modelo Conceptual Del MVP

## Uso De Este Documento

Este es el archivo recomendado para generar en Eraser el **modelo del MVP**.

Incluye solo las entidades necesarias para la primera versión: usuario, grupo, membresía, opción de grupo, quedada, asistencia, foto de quedada, objeto perdido, insignia, insignia desbloqueada y recuperación de racha.

Este modelo deja fuera todo lo que no es imprescindible para construir la primera versión funcional de La Racha.

El objetivo del MVP es validar el núcleo privado de la aplicación:

- Crear grupos.
- Gestionar membresías.
- Registrar quedadas.
- Adjuntar varias fotos a una quedada.
- Registrar varias personas con objetos perdidos en una quedada.
- Marcar asistencia.
- Calcular rachas.
- Registrar recuperaciones de racha.
- Mostrar insignias básicas de racha.

## Nota De Vocabulario

En lenguaje de producto se puede decir "miembro del grupo".

En el modelo técnico usamos **MEMBRESIA**, porque representa la relación entre una persona/usuario y un grupo. Una membresía puede estar asociada a un usuario real o existir como miembro interno sin cuenta.

## Entidades Del MVP

### USUARIO

```text
USUARIO
- id: string pk
- nombre: string
- username: string
- email: string
- fecha_nacimiento: date
- avatar_global: string
- fecha_creacion: timestamp
- fecha_actualizacion: timestamp
```

Representa una cuenta real de la app.

Relaciones:

- `USUARIO 1 ─── N MEMBRESIA`

Notas:

- El MVP permitirá usuarios reales desde el principio.
- `email` será obligatorio y único.
- `username` será obligatorio y único.
- Durante el registro se comprobará si el `username` ya existe antes de permitir avanzar.
- `fecha_nacimiento` será obligatoria para los usuarios creados desde la app, para preparar futuras restricciones o recomendaciones por edad.
- Se guarda fecha de nacimiento, no edad, porque la edad cambia con el tiempo.
- Inicialmente existirán dos usuarios reales: la creadora del proyecto y su hermano.
- Más adelante, una membresía sin cuenta podrá vincularse a un usuario real.
- Se conectará con Supabase Auth.
- Un usuario podrá borrar su propia cuenta.
- Borrar una cuenta no debe borrar el histórico de grupos, quedadas o asistencias.
- Si el usuario que borra su cuenta es admin de algún grupo, antes se traspasa el rol admin al miembro activo más antiguo de ese grupo.
- Al borrar un usuario, sus membresías se conservan como histórico, se desvinculan del usuario y pasan a `estado = eliminada`.

### GRUPO

```text
GRUPO
- id: string pk
- nombre: string
- descripcion: string
- foto_perfil: string
- privacidad: string
- frecuencia_racha: string
- tregua_verano_activa: boolean
- fecha_creacion: timestamp
- fecha_actualizacion: timestamp
```

Representa un grupo privado de amigos.

Relaciones:

- `GRUPO 1 ─── N MEMBRESIA`
- `GRUPO 1 ─── N QUEDADA`
- `GRUPO 1 ─── N OPCION_GRUPO`
- `GRUPO 1 ─── N INSIGNIA_DESBLOQUEADA`
- `GRUPO 1 ─── N RECUPERACION_RACHA`

Notas:

- En el MVP todos los grupos serán privados por defecto.
- La información interna de un grupo no se comparte por defecto.
- En la versión completa, el grupo podrá compartir solo piezas concretas de contenido, como insignias, highlights, fotos seleccionadas o Wrapped.
- `frecuencia_racha` define cómo se calcula la racha del grupo.
- `frecuencia_racha` se elige al crear el grupo y no se podrá cambiar en el MVP.
- `tregua_verano_activa` puede existir ya como campo, aunque la regla se implemente más adelante.
- Si el administrador elimina el grupo, se eliminarán también sus datos asociados. La interfaz deberá pedir confirmaciones fuertes antes de ejecutar esa acción.

### MEMBRESIA

```text
MEMBRESIA
- id: string pk
- usuario_id: string fk nullable
- grupo_id: string fk
- rol: string
- apodo: string
- avatar_grupo: string
- estado: string
- fecha_entrada: timestamp
- fecha_actualizacion: timestamp
```

Entidad relación entre `USUARIO` y `GRUPO`.

Relaciones:

- `USUARIO 1 ─── N MEMBRESIA`
- `GRUPO 1 ─── N MEMBRESIA`
- `MEMBRESIA 1 ─── N ASISTENCIA`
- `MEMBRESIA 1 ─── N QUEDADA` como conductor, mediante `QUEDADA.conductor_membresia_id`
- `MEMBRESIA 1 ─── N QUEDADA` como creadora, mediante `QUEDADA.creada_por_membresia_id`
- `MEMBRESIA 1 ─── N OBJETO_PERDIDO`
- `MEMBRESIA 1 ─── N INSIGNIA_DESBLOQUEADA` si en el futuro hay insignias individuales

Notas:

- `usuario_id` será opcional para permitir miembros sin cuenta.
- Una membresía sin `usuario_id` no puede iniciar sesión ni actuar por sí misma.
- Una membresía sin cuenta debe ser gestionada por un administrador del grupo.
- Valores iniciales de `rol`: `admin`, `miembro`.
- El rol `admin` será único, inamovible e intransferible en el MVP, salvo cuando el admin borre su cuenta.
- Si el admin borra su cuenta, el rol admin pasa al miembro activo más antiguo del grupo.
- Valores iniciales de `estado`: `activa`, `eliminada`.
- `activa` significa que la persona forma parte del grupo y aparece al registrar asistencias.
- `eliminada` conserva el histórico de alguien que ya no aparece como miembro actual.
- Un usuario real no puede tener dos membresías activas en el mismo grupo.
- No se puede repetir apodo dentro del mismo grupo entre membresías activas.
- Solo el administrador puede eliminar membresías del grupo.

### OPCION_GRUPO

```text
OPCION_GRUPO
- id: string pk
- grupo_id: string fk
- tipo: string
- valor: string
- fecha_creacion: timestamp
```

Valor reutilizable dentro de un grupo para campos que se repiten en quedadas.

Relaciones:

- `GRUPO 1 ─── N OPCION_GRUPO`
- `OPCION_GRUPO 1 ─── N QUEDADA` como tipo de plan, lugar o comida

Notas:

- Valores iniciales de `tipo`: `tipo_plan`, `lugar`, `comida`.
- Ejemplo: si un grupo registra `McDonalds` como comida, quedará disponible para futuras quedadas del mismo grupo.
- No se podrá repetir el mismo valor dentro del mismo grupo y tipo.
- La misma opción podrá reutilizarse en muchas quedadas distintas.
- Si alguien escribe una opción nueva en una quedada, el sistema podrá guardarla automáticamente como opción del grupo.
- `objetos_perdidos` no usa este catálogo en el MVP porque se registra en una tabla propia asociada a membresías.

### QUEDADA

```text
QUEDADA
- id: string pk
- grupo_id: string fk
- titulo: string
- fecha: timestamp
- conductor_membresia_id: string fk
- creada_por_membresia_id: string fk
- tipo_plan_opcion_id: string fk
- tipo_plan_texto: string
- momento_dia: string
- lugar_opcion_id: string fk
- lugar_texto: string
- comida_opcion_id: string fk
- comida_texto: string
- duracion_minutos: number
- notas: string
- fecha_creacion: timestamp
- fecha_actualizacion: timestamp
```

Representa un plan realizado por un grupo.

Relaciones:

- `GRUPO 1 ─── N QUEDADA`
- `MEMBRESIA 1 ─── N QUEDADA` como conductor
- `MEMBRESIA 1 ─── N QUEDADA` como creadora
- `OPCION_GRUPO 1 ─── N QUEDADA` como tipo de plan, lugar o comida
- `QUEDADA 1 ─── N ASISTENCIA`
- `QUEDADA 1 ─── N FOTO_QUEDADA`
- `QUEDADA 1 ─── N OBJETO_PERDIDO`

Notas:

- `conductor_membresia_id` debe apuntar a una membresía del mismo grupo.
- `creada_por_membresia_id` guarda qué miembro real registró la quedada.
- `duracion_minutos` se guarda como número para facilitar estadísticas.
- `momento_dia` podrá tener valores: `manana`, `tarde`, `tarde_noche`, `noche`, `dia_completo`.
- Solo `titulo`, `fecha` y `grupo_id` serán obligatorios. El resto de detalles de la quedada serán opcionales.
- `notas` permite guardar una anécdota o resumen libre sin activar todavía el sistema de highlights.
- Las quedadas no se borrarán en el MVP; se podrán editar.

### FOTO_QUEDADA

```text
FOTO_QUEDADA
- id: string pk
- quedada_id: string fk
- url: string
- descripcion: string
- fecha_creacion: timestamp
```

Foto asociada a una quedada.

Relaciones:

- `QUEDADA 1 ─── N FOTO_QUEDADA`

Notas:

- Una quedada puede tener varias fotos.
- En el MVP se guarda una URL simple.
- Más adelante se podrá conectar con Supabase Storage.

### OBJETO_PERDIDO

```text
OBJETO_PERDIDO
- id: string pk
- quedada_id: string fk
- membresia_id: string fk
- descripcion: string
- fecha_creacion: timestamp
```

Registro de que una membresía se dejó algo en una quedada.

Relaciones:

- `QUEDADA 1 ─── N OBJETO_PERDIDO`
- `MEMBRESIA 1 ─── N OBJETO_PERDIDO`

Notas:

- Una quedada puede tener varias personas con objetos perdidos.
- `descripcion` es opcional y permite indicar qué se dejó, si se quiere.
- La membresía debe pertenecer al mismo grupo que la quedada.

### ASISTENCIA

```text
ASISTENCIA
- id: string pk
- quedada_id: string fk
- membresia_id: string fk
- estado: string
```

Entidad relación entre `QUEDADA` y `MEMBRESIA`.

Relaciones:

- `QUEDADA 1 ─── N ASISTENCIA`
- `MEMBRESIA 1 ─── N ASISTENCIA`

Notas:

- Valores iniciales de `estado`: `asistio`, `no_asistio`.
- Al registrar una quedada, se crea una fila de asistencia por cada membresía activa del grupo.
- El formulario solo pedirá marcar quién asistió.
- Las membresías marcadas se guardan con `estado = asistio`.
- Las membresías no marcadas se guardan automáticamente con `estado = no_asistio`.
- Solo cuentan para la racha las asistencias con `estado = asistio`.
- No puede haber dos asistencias para la misma membresía en la misma quedada.

### INSIGNIA

```text
INSIGNIA
- id: string pk
- nombre: string
- descripcion: string
- criterio: string
- tipo: string
- imagen_url: string
- fecha_creacion: timestamp
```

Catálogo de insignias posibles.

Relaciones:

- `INSIGNIA 1 ─── N INSIGNIA_DESBLOQUEADA`

Notas:

- En el MVP las insignias serán hitos de racha grupal.
- Valor inicial de `tipo`: `racha_grupo`.
- Insignias iniciales: `1_semana`, `2_semanas`, `1_mes`, `3_meses`, `6_meses`, `1_anio`.
- Las insignias son datos semilla del sistema y no las crean los usuarios.
- Mientras no estén diseñadas las imágenes definitivas, las insignias podrán usar la imagen por defecto de `docs/recursos/Insignias/Por Defecto.png`.
- El campo `criterio` identifica el hito temporal de racha: `1_semana`, `2_semanas`, `1_mes`, `3_meses`, `6_meses` o `1_anio`.
- Las insignias se desbloquean según tiempo real de racha conseguido por el grupo.
- El tiempo usado para recuperar una racha rota no desbloquea insignias nuevas.
- Un grupo mensual puede desbloquear hitos de 1 mes en adelante, pero no insignias semanales.

### INSIGNIA_DESBLOQUEADA

```text
INSIGNIA_DESBLOQUEADA
- id: string pk
- insignia_id: string fk
- grupo_id: string fk
- membresia_id: string fk nullable
- fecha_desbloqueo: timestamp
- fecha_creacion: timestamp
```

Registro de una insignia conseguida.

Relaciones:

- `INSIGNIA 1 ─── N INSIGNIA_DESBLOQUEADA`
- `GRUPO 1 ─── N INSIGNIA_DESBLOQUEADA`
- `MEMBRESIA 1 ─── N INSIGNIA_DESBLOQUEADA`

Notas:

- Para el MVP normalmente `membresia_id` será null porque las insignias son del grupo.
- Se deja `membresia_id` nullable para registrar opcionalmente quién provocó el desbloqueo o quién estaba presente, sin dejar de tratar la insignia como logro del grupo.
- La misma insignia no se desbloquea dos veces para el mismo grupo.

### RECUPERACION_RACHA

```text
RECUPERACION_RACHA
- id: string pk
- grupo_id: string fk
- racha_perdida_periodos: number
- periodos_necesarios: number
- periodos_completados: number
- estado: string
- fecha_inicio: date
- fecha_fin: date
- fecha_creacion: timestamp
- fecha_actualizacion: timestamp
```

Registro de un intento de recuperar una racha perdida.

Relaciones:

- `GRUPO 1 ─── N RECUPERACION_RACHA`

Notas:

- Entra en el MVP porque permite que la recuperación sea visible y medible.
- `racha_perdida_periodos` guarda cuántos periodos llevaba el grupo antes de perder la racha.
- `periodos_necesarios` indica cuántos periodos consecutivos debe cumplir el grupo para recuperarla.
- `periodos_completados` permite mostrar progreso.
- Valores de `estado`: `pendiente`, `en_progreso`, `pausada`, `completada`, `fallida`.
- `pendiente` significa que la racha está rota, pero el administrador todavía no ha aceptado iniciar la recuperación.
- `pausada` permite detener temporalmente una recuperación por una regla especial, como la tregua de verano.
- Esta entidad permitirá estadísticas futuras como veces que se perdió la racha, recuperaciones completadas y periodos invertidos en recuperar.
- Si una recuperación falla, se conserva en histórico y una recuperación nueva empieza desde cero.

## Entidades Excluidas Del MVP

Estas entidades quedan fuera para reducir complejidad inicial:

- `HIGHLIGHT`
- `VOTO_HIGHLIGHT`
- `FOTO` como entidad propia
- `ALBUM`
- `TROFEO`
- `CARTA_COLECCIONABLE`
- `CARTA_DESBLOQUEADA`
- `DISPONIBILIDAD_CALENDARIO`
- `SEGUIDOR_USUARIO`
- `SEGUIDOR_GRUPO`
- `PUBLICACION_COMPARTIDA`

Motivo:

- El MVP debe validar primero si registrar quedadas y calcular rachas tiene sentido para un grupo real.
- Fotos simples de quedada sí entran en el MVP.
- Álbum avanzado, highlights votables, cartas, trofeos, calendario y capa social se construirán después.
- Aunque no estén implementadas, algunas secciones futuras podrán aparecer como accesos con estado "Próximamente" para dejar puntos de expansión claros en la interfaz.
- El salón de la fama del MVP mostrará insignias de racha bloqueadas y desbloqueadas del grupo.
- El salón personal del usuario queda como punto de expansión: cuando exista, si el usuario consigue la misma insignia en varios grupos, se mostrará asociada al primer grupo con el que la consiguió.

## Relaciones Detalladas Del MVP

```text
USUARIO.id ───< MEMBRESIA.usuario_id
GRUPO.id ───< MEMBRESIA.grupo_id

GRUPO.id ───< OPCION_GRUPO.grupo_id

GRUPO.id ───< QUEDADA.grupo_id
MEMBRESIA.id ───< QUEDADA.conductor_membresia_id
MEMBRESIA.id ───< QUEDADA.creada_por_membresia_id
OPCION_GRUPO.id ───< QUEDADA.tipo_plan_opcion_id
OPCION_GRUPO.id ───< QUEDADA.lugar_opcion_id
OPCION_GRUPO.id ───< QUEDADA.comida_opcion_id

QUEDADA.id ───< ASISTENCIA.quedada_id
MEMBRESIA.id ───< ASISTENCIA.membresia_id

QUEDADA.id ───< FOTO_QUEDADA.quedada_id
QUEDADA.id ───< OBJETO_PERDIDO.quedada_id
MEMBRESIA.id ───< OBJETO_PERDIDO.membresia_id

INSIGNIA.id ───< INSIGNIA_DESBLOQUEADA.insignia_id
GRUPO.id ───< INSIGNIA_DESBLOQUEADA.grupo_id
MEMBRESIA.id ───< INSIGNIA_DESBLOQUEADA.membresia_id

GRUPO.id ───< RECUPERACION_RACHA.grupo_id
```

## Reglas Importantes Del MVP

- `MEMBRESIA` no es una persona nueva, es la relación entre usuario y grupo.
- Una membresía puede tener usuario asociado o ser un miembro interno sin cuenta.
- El administrador inicial es la membresía del usuario que crea el grupo.
- Una membresía sin usuario asociado no puede iniciar sesión ni gestionar acciones por sí misma.
- Solo una membresía del mismo grupo puede aparecer como asistente de una quedada.
- El conductor de una quedada debe ser una membresía del mismo grupo.
- Cada persona registrada en objetos perdidos debe ser una membresía del mismo grupo.
- Las opciones reutilizables de `tipo_plan`, `lugar` y `comida` pertenecen al grupo.
- Al registrar una quedada, se crea una asistencia para cada membresía activa del grupo.
- Solo cuentan para la racha las asistencias con `estado = asistio`.
- La racha no se considera perdida hasta que termina el periodo que tocaba cumplir.
- Si el último periodo cerrado no se cumplió y antes existía una racha, se crea una pérdida de racha.
- Si ya existe una recuperación activa, no se detecta una nueva pérdida encima de esa recuperación.
- Si una racha se pierde, el MVP permitirá recuperarla quedando de forma consecutiva durante el tiempo equivalente a la racha perdida. Ese periodo recupera la racha, pero no suma como progreso nuevo.
- Cuando se pierde una racha, se crea una recuperación con `estado = pendiente`.
- La recuperación no empieza hasta que el administrador decide reactivar la racha.
- Mientras la recuperación esté `pendiente`, `en_progreso` o `pausada`, la racha queda congelada y no se desbloquean insignias nuevas.
- Las insignias se desbloquean según tiempo real de racha, no por número bruto de quedadas.
- Una recuperación completada devuelve al grupo la racha que ya tenía, pero el tiempo usado para recuperarla no suma como racha nueva.
- Un grupo mensual puede desbloquear insignias de 1 mes en adelante, pero no insignias semanales.
- Un grupo no debería tener más de una recuperación activa al mismo tiempo.

## Decisiones Cerradas Para El MVP

- Habrá usuarios reales desde el principio.
- Se permitirán miembros sin cuenta para representar amigos dentro de un grupo.
- `MEMBRESIA.usuario_id` será opcional.
- Las fotos de quedada se guardarán como URLs simples en una tabla propia.
- La duración se guardará en minutos.
- `tipo_plan`, `lugar` y `comida` usarán opciones reutilizables por grupo.
- `objetos_perdidos` tendrá tabla propia para registrar varias personas en una misma quedada.
- `ASISTENCIA.estado` solo tendrá `asistio` y `no_asistio`.
- La recuperación de racha tendrá entidad propia en el MVP.
- Las insignias de racha se desbloquearán por tiempo real de racha conseguido.
