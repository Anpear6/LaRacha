# Supabase / PostgreSQL

Esta carpeta contiene la parte de base de datos de La Racha.

## Migraciones

- `migrations/001_schema_mvp.sql`: crea las tablas, relaciones, restricciones, indices y funciones iniciales del MVP.
- `migrations/002_quedadas_fecha_default.sql`: hace que las quedadas nuevas usen la fecha actual por defecto si no se indica otra.
- `migrations/003_align_seed_users_with_auth.sql`: alinea los usuarios semilla con los UUID reales de Supabase Auth.
- `migrations/004_rls_policies.sql`: activa RLS y define las politicas iniciales de privacidad del MVP.
- `migrations/005_recovery_pending_and_paused_states.sql`: actualiza los estados de recuperacion de racha para permitir recuperaciones pendientes y pausadas.
- `migrations/006_registrar_quedada_completa.sql`: crea una funcion transaccional para registrar una quedada completa desde la app.
- `migrations/007_desbloquear_insignias_racha.sql`: crea una funcion transaccional para guardar insignias de racha desbloqueadas sin duplicarlas.
- `migrations/008_gestion_grupos_membresias.sql`: crea funciones transaccionales para crear, editar y borrar grupos, y para gestionar membresias.
- `migrations/009_editar_quedada_completa.sql`: crea una funcion transaccional para editar una quedada completa.
- `migrations/010_operaciones_recuperacion_racha.sql`: crea funciones para guardar, activar, pausar, reanudar, avanzar y fallar recuperaciones de racha.

## Datos Semilla

- `seed.sql`: inserta los primeros usuarios, el grupo de prueba, las membresias iniciales, la primera quedada, sus asistencias y las insignias iniciales.

Las opciones de grupo no se crean de forma global. Se guardan cuando un grupo las usa por primera vez.

## Estado Actual

El esquema esta escrito para PostgreSQL/Supabase.

Las rutas de imagen guardadas en el seed son referencias locales del repositorio. Mas adelante, para que se vean en la app desplegada, habra que mover esas imagenes a `public/` o subirlas a Supabase Storage.

Las migraciones se han preparado para ejecutarse en orden desde el SQL Editor de Supabase durante el aprendizaje inicial del proyecto.

Antes de probar permisos con login real, los usuarios semilla deben estar alineados con los UUID reales de Supabase Auth, porque las politicas comparan `usuarios.id` con `auth.uid()`. Para los datos semilla actuales, ese ajuste esta en `migrations/003_align_seed_users_with_auth.sql`.

## Punto De Expansion: Automatizacion

Ahora mismo las migraciones y el seed se ejecutan manualmente desde Supabase para entender mejor que cambia en cada paso.

El MVP debe mantenerse preparado para automatizar este flujo mas adelante con Supabase CLI o scripts de npm. La idea futura es poder reconstruir la base de datos con comandos del proyecto, aplicando migraciones y datos semilla en orden sin copiar SQL manualmente.

## Variables De Entorno

El repositorio incluye `.env.example` como plantilla.

Para conectar la app con Supabase, mas adelante se creara un archivo local privado con estos valores:

```text
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_publica
```

Los archivos `.env` reales no se suben a GitHub.

## Comprobaciones

Comprobar conexion anonima:

```bash
npm run check:supabase
```

Si RLS esta activo, puede devolver 0 grupos visibles sin que sea un error.

Comprobar conexion con login real:

```bash
npm run check:supabase:auth
```

Este comando pide email y contraseña en la terminal y permite validar que las politicas RLS dejan ver solo los datos del usuario autenticado.

La comprobacion autenticada ya se ha ejecutado correctamente al menos con un usuario real.

## Funciones RPC

`registrar_quedada_completa_mvp` registra una quedada completa en una transaccion:

- crea opciones reutilizables si son nuevas para el grupo;
- crea la quedada;
- crea una asistencia para cada membresia activa;
- marca como `asistio` solo a las membresias seleccionadas;
- marca como `no_asistio` al resto;
- crea fotos de quedada;
- crea objetos perdidos.

Esta funcion debe existir en Supabase antes de usar la operacion TypeScript `registrarQuedadaCompleta`.

Para probarla desde el proyecto:

```bash
npm run check:registrar-quedada
```

`obtener_o_crear_opcion_grupo` guarda una opcion reutilizable para un grupo o devuelve la existente si ya estaba creada. La usa internamente el registro/edicion de quedadas y tambien la operacion TypeScript `crearOpcionGrupo`.

Para probarla desde el proyecto:

```bash
npm run check:opciones-grupo
```

`desbloquear_insignias_racha_mvp` guarda las insignias de racha que la lógica de dominio ya ha calculado como desbloqueables:

- valida que el usuario autenticado pertenezca al grupo;
- valida que las insignias existan y sean de tipo `racha_grupo`;
- valida que la membresia asociada pertenezca al mismo grupo;
- evita duplicados mediante el índice único `grupo_id + insignia_id`.

Esta funcion debe existir en Supabase antes de usar la operacion TypeScript `desbloquearInsigniasRacha`.

Para probarla desde el proyecto:

```bash
npm run check:desbloquear-insignias
```

El script muestra los desbloqueos calculados y pide confirmacion antes de insertar nada.

`crear_grupo_mvp`, `actualizar_grupo_mvp`, `eliminar_grupo_mvp`, `crear_miembro_sin_cuenta_mvp`, `actualizar_membresia_propia_mvp`, `actualizar_miembro_sin_cuenta_mvp` y `eliminar_membresia_mvp` cubren la gestion basica de grupos y membresias del MVP:

- crear grupo con su membresia administradora inicial;
- editar datos del grupo sin modificar la frecuencia de racha;
- borrar un grupo completo si lo hace el admin;
- crear y editar miembros sin cuenta;
- editar el apodo y avatar de la propia membresia;
- eliminar miembros de forma logica, conservando su historico.

Para probar estas funciones desde el proyecto:

```bash
npm run check:gestion-grupos
```

`editar_quedada_completa_mvp` edita una quedada completa en una transaccion:

- actualiza titulo, fecha, conductor, tipo de plan, momento del dia, lugar, comida, duracion y notas;
- crea opciones reutilizables nuevas si aparecen durante la edicion;
- actualiza asistencias de las membresias activas del grupo;
- actualiza objetos perdidos de las membresias activas del grupo;
- reemplaza las fotos asociadas a la quedada;
- conserva historico asociado a membresias eliminadas.

Para probarla desde el proyecto:

```bash
npm run check:editar-quedada
```

Las funciones de recuperacion de racha cubren el ciclo basico del MVP:

- `guardar_recuperacion_pendiente_mvp`: guarda una recuperacion pendiente si no hay otra activa;
- `activar_recuperacion_racha_mvp`: permite al admin iniciar la recuperacion;
- `registrar_periodo_recuperacion_cumplido_mvp`: avanza la recuperacion y la completa si llega al objetivo;
- `pausar_recuperacion_racha_mvp` y `reanudar_recuperacion_racha_mvp`: gestionan pausas;
- `fallar_recuperacion_racha_mvp`: marca el intento como fallido y crea un nuevo intento pendiente.

Para probarlas desde el proyecto:

```bash
npm run check:recuperacion-racha
```
