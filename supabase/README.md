# Supabase / PostgreSQL

Esta carpeta contiene la parte de base de datos de La Racha.

## Migraciones

- `migrations/001_schema_mvp.sql`: crea las tablas, relaciones, restricciones, indices y funciones iniciales del MVP.
- `migrations/002_quedadas_fecha_default.sql`: hace que las quedadas nuevas usen la fecha actual por defecto si no se indica otra.
- `migrations/003_align_seed_users_with_auth.sql`: alinea los usuarios semilla con los UUID reales de Supabase Auth.
- `migrations/004_rls_policies.sql`: activa RLS y define las politicas iniciales de privacidad del MVP.

## Datos Semilla

- `seed.sql`: inserta los primeros usuarios, el grupo de prueba, las membresias iniciales, la primera quedada, sus asistencias y las insignias iniciales.

Las opciones de grupo no se crean de forma global. Se guardan cuando un grupo las usa por primera vez.

## Estado Actual

El esquema esta escrito para PostgreSQL/Supabase.

Las rutas de imagen guardadas en el seed son referencias locales del repositorio. Mas adelante, para que se vean en la app desplegada, habra que mover esas imagenes a `public/` o subirlas a Supabase Storage.

Antes de ejecutar RLS con login real, hay que alinear `usuarios.id` con los UUID reales de Supabase Auth, porque las politicas comparan `usuarios.id` con `auth.uid()`. Para los datos semilla actuales, ese ajuste esta en `migrations/003_align_seed_users_with_auth.sql`.
