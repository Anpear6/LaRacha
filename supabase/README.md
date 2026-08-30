# Supabase / PostgreSQL

Esta carpeta contiene la parte de base de datos de La Racha.

## Migraciones

- `migrations/001_schema_mvp.sql`: crea las tablas, relaciones, restricciones, indices y funciones iniciales del MVP.
- `migrations/002_quedadas_fecha_default.sql`: hace que las quedadas nuevas usen la fecha actual por defecto si no se indica otra.
- `migrations/003_align_seed_users_with_auth.sql`: alinea los usuarios semilla con los UUID reales de Supabase Auth.
- `migrations/004_rls_policies.sql`: activa RLS y define las politicas iniciales de privacidad del MVP.
- `migrations/005_recovery_pending_and_paused_states.sql`: actualiza los estados de recuperacion de racha para permitir recuperaciones pendientes y pausadas.

## Datos Semilla

- `seed.sql`: inserta los primeros usuarios, el grupo de prueba, las membresias iniciales, la primera quedada, sus asistencias y las insignias iniciales.

Las opciones de grupo no se crean de forma global. Se guardan cuando un grupo las usa por primera vez.

## Estado Actual

El esquema esta escrito para PostgreSQL/Supabase.

Las rutas de imagen guardadas en el seed son referencias locales del repositorio. Mas adelante, para que se vean en la app desplegada, habra que mover esas imagenes a `public/` o subirlas a Supabase Storage.

Las migraciones `001`, `002`, `003`, `004` y `005` se han preparado para ejecutarse en orden desde el SQL Editor de Supabase durante el aprendizaje inicial del proyecto.

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
