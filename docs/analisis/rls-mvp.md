# Politicas RLS Del MVP

## Uso De Este Documento

Este documento define las reglas de seguridad por filas del MVP antes de convertirlas a SQL.

RLS significa Row Level Security. En Supabase/PostgreSQL sirve para decidir que filas puede leer, crear, modificar o borrar cada usuario autenticado.

La idea principal de La Racha es privacidad por defecto: nadie debe ver informacion interna de un grupo si no pertenece a ese grupo.

## Estado Actual

- El esquema inicial ya existe en `supabase/migrations/001_schema_mvp.sql`.
- El ajuste de fecha por defecto de quedadas ya existe en `supabase/migrations/002_quedadas_fecha_default.sql`.
- Los datos iniciales ya existen en `supabase/seed.sql`.
- Las tablas y datos semilla han sido comprobados manualmente en Supabase.
- Falta crear la migracion de politicas RLS.

## Suposiciones Iniciales

- En el MVP todos los usuarios que actuan sobre datos privados deben estar autenticados.
- Los miembros sin cuenta existen en `membresias`, pero no pueden iniciar sesion ni ejecutar acciones por si mismos.
- Un usuario autenticado se enlazara con `usuarios.id`.
- `usuarios.id` usara el mismo UUID que `auth.users.id`, es decir, el mismo valor que devuelve `auth.uid()` en Supabase.
- Los datos semilla de usuarios deben ajustarse a los usuarios reales de Supabase Auth antes de probar RLS con login real.

## Regla General

Un usuario puede acceder a datos de un grupo solo si tiene una membresia real y activa en ese grupo.

Esto significa:

- `membresias.usuario_id` debe apuntar al usuario autenticado.
- `membresias.estado` debe ser `activa`.
- Las membresias sin cuenta no dan permisos de acceso porque `usuario_id` es null.

## Lectura

### Usuarios

Propuesta para MVP:

- Un usuario puede leer su propio perfil.
- Un usuario puede leer perfiles de otros usuarios reales que compartan grupo con el.
- Un usuario no puede leer usuarios sin relacion con sus grupos.

Motivo: dentro de un grupo hace falta mostrar nombres, usernames y avatares de sus miembros reales.

### Grupos

Propuesta para MVP:

- Un usuario puede leer los grupos donde tiene una membresia real activa.
- Un usuario no puede leer grupos ajenos.

### Membresias

Propuesta para MVP:

- Un usuario puede leer las membresias de los grupos donde tiene una membresia real activa.
- Esto incluye membresias sin cuenta del mismo grupo, porque forman parte de la lista interna de miembros.

### Quedadas, Asistencias, Fotos, Objetos Perdidos, Opciones E Insignias Desbloqueadas

Propuesta para MVP:

- Un usuario puede leer estos datos solo si pertenecen a un grupo donde tiene una membresia real activa.

### Insignias Base

Propuesta para MVP:

- Las insignias base se pueden leer por cualquier usuario autenticado.
- No se pueden crear, editar ni borrar desde la app.

Motivo: son catalogo oficial del sistema, no informacion privada de ningun grupo.

Uso en producto:

- No habra una pantalla de insignias globales sueltas como funcionalidad principal.
- Las insignias se mostraran dentro del salon de la fama de un grupo.
- En el MVP, el salon de la fama mostrara el catalogo de insignias de racha.
- Las insignias no desbloqueadas apareceran apagadas, sombreadas o en blanco y negro.
- Las insignias desbloqueadas por el grupo apareceran en color usando `insignias_desbloqueadas`.
- En versiones futuras existira tambien un salon de la fama personal del usuario.
- Si un usuario consigue la misma insignia en varios grupos, su salon personal la mostrara asociada al primer grupo con el que la consiguio.
- El salon de fama de grupo podra incluir highlights y album de fotos.
- Los trofeos son personales y no apareceran como logros del grupo.
- En versiones futuras el salon personal podra incluir trofeos y cartas coleccionables.

## Escritura

### Usuarios

Propuesta para MVP:

- Un usuario puede crear su propio perfil.
- Un usuario puede editar su propio perfil.
- Un usuario puede borrar su propia cuenta.
- Un usuario no puede editar ni borrar perfiles de otros usuarios.

### Grupos

Propuesta para MVP:

- Un usuario autenticado puede crear un grupo.
- Solo el admin activo del grupo puede editar nombre, descripcion, foto de perfil y tregua de verano.
- En el MVP no se puede modificar `frecuencia_racha` despues de crear el grupo.
- Solo el admin activo puede borrar el grupo.

### Membresias

Propuesta para MVP:

- Solo el admin activo puede crear membresias dentro de su grupo.
- Solo el admin activo puede editar membresias sin cuenta.
- Solo el admin activo puede marcar una membresia como `eliminada`.
- El rol admin no se puede transferir manualmente en el MVP.
- Un miembro real puede editar su propio `apodo` y `avatar_grupo_url`.
- El admin no puede editar el perfil de grupo de miembros con cuenta, salvo que sea su propia membresia.

## Quedadas

Propuesta para MVP:

- Cualquier miembro real activo del grupo puede crear quedadas.
- Cualquier miembro real activo del grupo puede editar quedadas.
- Las quedadas no se borran en el MVP.
- La quedada creada debe pertenecer al grupo de la membresia creadora.
- `creada_por_membresia_id` debe ser una membresia real activa del usuario autenticado.

## Opciones De Grupo

Propuesta para MVP:

- Cualquier miembro real activo puede crear opciones nuevas para su grupo al registrar o editar una quedada.
- Las opciones no se editan ni se borran desde la app en el MVP.

## Asistencias

Propuesta para MVP:

- Cualquier miembro real activo puede crear o editar asistencias de una quedada de su grupo.
- La app debe crear una asistencia por cada membresia activa del grupo al registrar una quedada.
- No existen asistencias pendientes: solo `asistio` y `no_asistio`.

## Fotos De Quedada

Propuesta para MVP:

- Cualquier miembro real activo del grupo puede añadir fotos a una quedada del grupo.
- Cualquier miembro real activo del grupo puede editar la descripcion de una foto.
- Cualquier miembro real activo del grupo puede borrar fotos de una quedada del grupo.

## Objetos Perdidos

Propuesta para MVP:

- Cualquier miembro real activo del grupo puede registrar objetos perdidos en una quedada del grupo.
- Cualquier miembro real activo del grupo puede editar objetos perdidos de una quedada del grupo.
- Cualquier miembro real activo del grupo puede borrar registros de objetos perdidos de una quedada del grupo.

## Recuperaciones De Racha

Propuesta para MVP:

- Las recuperaciones de racha deben ser creadas y actualizadas por la logica de la aplicacion, no manualmente por usuarios desde pantallas libres.
- Los miembros reales activos pueden leerlas si pertenecen a su grupo.

## Dudas Pendientes Antes De SQL

1. Definir el flujo exacto para crear usuarios reales en Supabase Auth y crear su fila correspondiente en `usuarios`.
2. Decidir que operaciones complejas iran por funciones/API del backend y cuales se permitiran directamente por tabla.

## Decisiones Cerradas Para La Migracion RLS

- Las insignias base solo podran leerse por usuarios autenticados en el MVP.
- Las insignias base alimentan el salon de la fama: el catalogo se puede ver, pero el estado desbloqueado depende del grupo.
- El salon personal queda como expansion futura y agregara logros desde las membresias del usuario.
- Las operaciones complejas de quedadas se centralizaran mas adelante en funciones/API de backend, aunque las tablas tendran politicas seguras de base.
- Las quedadas no se borran desde la app en el MVP.
- Las opciones de grupo no se editan ni se borran desde la app en el MVP.
