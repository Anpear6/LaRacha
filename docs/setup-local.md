# Setup Local

Este documento explica los pasos necesarios para preparar La Racha en local durante el MVP.

## 1. Instalar Dependencias

Desde la carpeta del proyecto:

```bash
npm install
```

Esto instala TypeScript, Vitest y el cliente oficial de Supabase.

## 2. Configurar Variables De Entorno

El repositorio incluye `.env.example` como plantilla.

Para conectar la app con Supabase hay que crear un archivo local llamado `.env.local` en la raíz del proyecto.

Contenido esperado:

```text
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_publica
```

Notas:

- `.env.local` no se sube a GitHub.
- `NEXT_PUBLIC_SUPABASE_URL` es la URL del proyecto de Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` es la clave pública `anon`.
- No se debe usar la `service_role` key en frontend ni subirla al repositorio.

## 3. Base De Datos

Durante el aprendizaje inicial, las migraciones se ejecutan manualmente desde el SQL Editor de Supabase.

Orden actual de migraciones:

1. `supabase/migrations/001_schema_mvp.sql`
2. `supabase/migrations/002_quedadas_fecha_default.sql`
3. `supabase/migrations/003_align_seed_users_with_auth.sql`
4. `supabase/migrations/004_rls_policies.sql`
5. `supabase/migrations/005_recovery_pending_and_paused_states.sql`
6. `supabase/migrations/006_registrar_quedada_completa.sql`
7. `supabase/migrations/007_desbloquear_insignias_racha.sql`

Los datos semilla están en:

```text
supabase/seed.sql
```

## 4. Comprobar El Proyecto

Para comprobar tipos:

```bash
npm run typecheck
```

Para ejecutar tests:

```bash
npm test
```

Para comprobar que la app puede conectar con Supabase:

```bash
npm run check:supabase
```

Si RLS esta activo y no hay usuario logueado, es normal que esta comprobacion conecte bien pero muestre 0 grupos visibles.

Para comprobar una lectura con usuario real:

```bash
npm run check:supabase:auth
```

Este comando pide email y contraseña en la terminal. No guarda la contraseña en archivos ni en Git.

Con RLS activo, un usuario autenticado solo deberia ver su propio usuario y las membresias/grupos a los que pertenece.

Para probar el registro de una quedada completa:

```bash
npm run check:registrar-quedada
```

Este comando pide login, muestra lo que va a insertar y exige escribir `SI` antes de crear la quedada de prueba.

Para validar el cálculo de racha e insignias contra datos reales, vuelve a ejecutar:

```bash
npm run check:supabase:auth
```

La salida debe mostrar, además de usuario, grupos, miembros y quedadas, el resumen de racha visible y cuántas insignias son desbloqueables.

Para probar el guardado de insignias desbloqueadas:

```bash
npm run check:desbloquear-insignias
```

Este comando pide login, muestra cuántas insignias se pueden desbloquear y exige escribir `SI` antes de guardarlas en Supabase.

## Punto De Expansion

Mas adelante se podra automatizar este flujo con Supabase CLI o scripts de npm para no copiar migraciones manualmente.
