-- La Racha - esquema inicial del MVP
-- Esta migracion crea la estructura base sin insertar datos semilla.

create extension if not exists pgcrypto;

create or replace function set_fecha_actualizacion()
returns trigger
language plpgsql
as $$
begin
  new.fecha_actualizacion = now();
  return new;
end;
$$;

create table usuarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  username text,
  email text not null,
  avatar_global_url text,
  fecha_creacion timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now(),

  constraint usuarios_nombre_no_vacio check (length(trim(nombre)) > 0),
  constraint usuarios_username_no_vacio check (username is null or length(trim(username)) > 0),
  constraint usuarios_email_no_vacio check (length(trim(email)) > 0),
  constraint usuarios_email_formato_basico check (position('@' in email) > 1)
);

create unique index usuarios_email_unique_idx on usuarios (lower(email));
create unique index usuarios_username_unique_idx on usuarios (lower(username)) where username is not null;

create trigger usuarios_set_fecha_actualizacion
before update on usuarios
for each row
execute function set_fecha_actualizacion();

create table grupos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  foto_perfil_url text,
  privacidad text not null default 'privado',
  frecuencia_racha text not null default 'semanal',
  tregua_verano_activa boolean not null default false,
  fecha_creacion timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now(),

  constraint grupos_nombre_no_vacio check (length(trim(nombre)) > 0),
  constraint grupos_privacidad_check check (privacidad in ('privado')),
  constraint grupos_frecuencia_racha_check check (
    frecuencia_racha in (
      'dos_veces_semana',
      'semanal',
      'dos_al_mes',
      'mensual',
      'seis_al_anio'
    )
  )
);

create trigger grupos_set_fecha_actualizacion
before update on grupos
for each row
execute function set_fecha_actualizacion();

create table membresias (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios(id) on delete set null,
  grupo_id uuid not null references grupos(id) on delete cascade,
  rol text not null default 'miembro',
  apodo text not null,
  avatar_grupo_url text,
  estado text not null default 'activa',
  fecha_entrada timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now(),

  constraint membresias_rol_check check (rol in ('admin', 'miembro')),
  constraint membresias_estado_check check (estado in ('activa', 'eliminada')),
  constraint membresias_apodo_no_vacio check (length(trim(apodo)) > 0)
);

create unique index membresias_usuario_grupo_activa_unique_idx
on membresias (usuario_id, grupo_id)
where usuario_id is not null and estado = 'activa';

create unique index membresias_apodo_grupo_activa_unique_idx
on membresias (grupo_id, lower(apodo))
where estado = 'activa';

create unique index membresias_admin_activo_grupo_unique_idx
on membresias (grupo_id)
where rol = 'admin' and estado = 'activa';

create trigger membresias_set_fecha_actualizacion
before update on membresias
for each row
execute function set_fecha_actualizacion();

create table opciones_grupo (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references grupos(id) on delete cascade,
  tipo text not null,
  valor text not null,
  fecha_creacion timestamptz not null default now(),

  constraint opciones_grupo_tipo_check check (tipo in ('tipo_plan', 'lugar', 'comida')),
  constraint opciones_grupo_valor_no_vacio check (length(trim(valor)) > 0)
);

create unique index opciones_grupo_tipo_valor_unique_idx
on opciones_grupo (grupo_id, tipo, lower(valor));

create table quedadas (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references grupos(id) on delete cascade,
  titulo text not null,
  fecha timestamptz not null default now(),
  conductor_membresia_id uuid references membresias(id) on delete set null,
  creada_por_membresia_id uuid not null references membresias(id),
  tipo_plan_opcion_id uuid references opciones_grupo(id) on delete set null,
  tipo_plan_texto text,
  momento_dia text,
  lugar_opcion_id uuid references opciones_grupo(id) on delete set null,
  lugar_texto text,
  comida_opcion_id uuid references opciones_grupo(id) on delete set null,
  comida_texto text,
  duracion_minutos integer,
  notas text,
  fecha_creacion timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now(),

  constraint quedadas_titulo_no_vacio check (length(trim(titulo)) > 0),
  constraint quedadas_momento_dia_check check (
    momento_dia is null
    or momento_dia in ('manana', 'tarde', 'tarde_noche', 'noche', 'dia_completo')
  ),
  constraint quedadas_duracion_minutos_check check (
    duracion_minutos is null or duracion_minutos > 0
  )
);

create index quedadas_grupo_fecha_idx on quedadas (grupo_id, fecha desc);
create index quedadas_conductor_idx on quedadas (conductor_membresia_id);
create index quedadas_creada_por_idx on quedadas (creada_por_membresia_id);

create trigger quedadas_set_fecha_actualizacion
before update on quedadas
for each row
execute function set_fecha_actualizacion();

create table fotos_quedada (
  id uuid primary key default gen_random_uuid(),
  quedada_id uuid not null references quedadas(id) on delete cascade,
  url text not null,
  descripcion text,
  fecha_creacion timestamptz not null default now(),

  constraint fotos_quedada_url_no_vacia check (length(trim(url)) > 0)
);

create index fotos_quedada_quedada_idx on fotos_quedada (quedada_id);

create table objetos_perdidos (
  id uuid primary key default gen_random_uuid(),
  quedada_id uuid not null references quedadas(id) on delete cascade,
  membresia_id uuid not null references membresias(id),
  descripcion text,
  fecha_creacion timestamptz not null default now()
);

create unique index objetos_perdidos_quedada_membresia_unique_idx
on objetos_perdidos (quedada_id, membresia_id);

create index objetos_perdidos_membresia_idx on objetos_perdidos (membresia_id);

create table asistencias (
  id uuid primary key default gen_random_uuid(),
  quedada_id uuid not null references quedadas(id) on delete cascade,
  membresia_id uuid not null references membresias(id),
  estado text not null,
  fecha_creacion timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now(),

  constraint asistencias_estado_check check (estado in ('asistio', 'no_asistio'))
);

create unique index asistencias_quedada_membresia_unique_idx
on asistencias (quedada_id, membresia_id);

create index asistencias_membresia_idx on asistencias (membresia_id);

create trigger asistencias_set_fecha_actualizacion
before update on asistencias
for each row
execute function set_fecha_actualizacion();

create table insignias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  criterio text not null,
  tipo text not null default 'racha_grupo',
  imagen_url text not null,
  fecha_creacion timestamptz not null default now(),

  constraint insignias_nombre_no_vacio check (length(trim(nombre)) > 0),
  constraint insignias_criterio_no_vacio check (length(trim(criterio)) > 0),
  constraint insignias_imagen_url_no_vacia check (length(trim(imagen_url)) > 0),
  constraint insignias_tipo_check check (tipo in ('racha_grupo'))
);

create unique index insignias_tipo_criterio_unique_idx on insignias (tipo, criterio);

create table insignias_desbloqueadas (
  id uuid primary key default gen_random_uuid(),
  insignia_id uuid not null references insignias(id),
  grupo_id uuid not null references grupos(id) on delete cascade,
  membresia_id uuid references membresias(id) on delete set null,
  fecha_desbloqueo timestamptz not null default now(),
  fecha_creacion timestamptz not null default now()
);

create unique index insignias_desbloqueadas_grupo_insignia_unique_idx
on insignias_desbloqueadas (grupo_id, insignia_id);

create index insignias_desbloqueadas_membresia_idx on insignias_desbloqueadas (membresia_id);

create table recuperaciones_racha (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references grupos(id) on delete cascade,
  racha_perdida_periodos integer not null,
  periodos_necesarios integer not null,
  periodos_completados integer not null default 0,
  estado text not null default 'en_progreso',
  fecha_inicio date not null,
  fecha_fin date,
  fecha_creacion timestamptz not null default now(),
  fecha_actualizacion timestamptz not null default now(),

  constraint recuperaciones_racha_estado_check check (
    estado in ('en_progreso', 'completada', 'fallida')
  ),
  constraint recuperaciones_racha_periodos_check check (
    racha_perdida_periodos > 0
    and periodos_necesarios > 0
    and periodos_completados >= 0
    and periodos_completados <= periodos_necesarios
  ),
  constraint recuperaciones_racha_fecha_fin_check check (
    fecha_fin is null or fecha_fin >= fecha_inicio
  )
);

create unique index recuperaciones_racha_en_progreso_unique_idx
on recuperaciones_racha (grupo_id)
where estado = 'en_progreso';

create index recuperaciones_racha_grupo_fecha_inicio_idx
on recuperaciones_racha (grupo_id, fecha_inicio desc);

create trigger recuperaciones_racha_set_fecha_actualizacion
before update on recuperaciones_racha
for each row
execute function set_fecha_actualizacion();

create or replace function impedir_cambio_frecuencia_racha()
returns trigger
language plpgsql
as $$
begin
  if old.frecuencia_racha is distinct from new.frecuencia_racha then
    raise exception
      'La frecuencia de racha no se puede cambiar despues de crear el grupo en el MVP.';
  end if;

  return new;
end;
$$;

create trigger grupos_impedir_cambio_frecuencia_racha
before update on grupos
for each row
execute function impedir_cambio_frecuencia_racha();

create or replace function validar_quedada()
returns trigger
language plpgsql
as $$
declare
  membresia_grupo_id uuid;
  membresia_usuario_id uuid;
  opcion_record record;
begin
  select grupo_id, usuario_id
  into membresia_grupo_id, membresia_usuario_id
  from membresias
  where id = new.creada_por_membresia_id;

  if membresia_grupo_id is distinct from new.grupo_id or membresia_usuario_id is null then
    raise exception
      'La quedada debe ser creada por una membresia real del mismo grupo.';
  end if;

  if new.conductor_membresia_id is not null then
    select grupo_id
    into membresia_grupo_id
    from membresias
    where id = new.conductor_membresia_id;

    if membresia_grupo_id is distinct from new.grupo_id then
      raise exception
        'El conductor debe ser una membresia del mismo grupo que la quedada.';
    end if;
  end if;

  if new.tipo_plan_opcion_id is not null then
    select grupo_id, tipo
    into opcion_record
    from opciones_grupo
    where id = new.tipo_plan_opcion_id;

    if opcion_record.grupo_id is distinct from new.grupo_id or opcion_record.tipo <> 'tipo_plan' then
      raise exception
        'La opcion de tipo de plan debe pertenecer al mismo grupo y ser de tipo tipo_plan.';
    end if;
  end if;

  if new.lugar_opcion_id is not null then
    select grupo_id, tipo
    into opcion_record
    from opciones_grupo
    where id = new.lugar_opcion_id;

    if opcion_record.grupo_id is distinct from new.grupo_id or opcion_record.tipo <> 'lugar' then
      raise exception
        'La opcion de lugar debe pertenecer al mismo grupo y ser de tipo lugar.';
    end if;
  end if;

  if new.comida_opcion_id is not null then
    select grupo_id, tipo
    into opcion_record
    from opciones_grupo
    where id = new.comida_opcion_id;

    if opcion_record.grupo_id is distinct from new.grupo_id or opcion_record.tipo <> 'comida' then
      raise exception
        'La opcion de comida debe pertenecer al mismo grupo y ser de tipo comida.';
    end if;
  end if;

  return new;
end;
$$;

create trigger quedadas_validar
before insert or update on quedadas
for each row
execute function validar_quedada();

create or replace function validar_asistencia()
returns trigger
language plpgsql
as $$
declare
  quedada_grupo_id uuid;
  membresia_grupo_id uuid;
begin
  select grupo_id
  into quedada_grupo_id
  from quedadas
  where id = new.quedada_id;

  select grupo_id
  into membresia_grupo_id
  from membresias
  where id = new.membresia_id;

  if quedada_grupo_id is distinct from membresia_grupo_id then
    raise exception
      'La asistencia debe pertenecer a una membresia del mismo grupo que la quedada.';
  end if;

  return new;
end;
$$;

create trigger asistencias_validar
before insert or update on asistencias
for each row
execute function validar_asistencia();

create or replace function validar_objeto_perdido()
returns trigger
language plpgsql
as $$
declare
  quedada_grupo_id uuid;
  membresia_grupo_id uuid;
begin
  select grupo_id
  into quedada_grupo_id
  from quedadas
  where id = new.quedada_id;

  select grupo_id
  into membresia_grupo_id
  from membresias
  where id = new.membresia_id;

  if quedada_grupo_id is distinct from membresia_grupo_id then
    raise exception
      'El objeto perdido debe pertenecer a una membresia del mismo grupo que la quedada.';
  end if;

  return new;
end;
$$;

create trigger objetos_perdidos_validar
before insert or update on objetos_perdidos
for each row
execute function validar_objeto_perdido();

create or replace function validar_insignia_desbloqueada()
returns trigger
language plpgsql
as $$
declare
  membresia_grupo_id uuid;
begin
  if new.membresia_id is null then
    return new;
  end if;

  select grupo_id
  into membresia_grupo_id
  from membresias
  where id = new.membresia_id;

  if membresia_grupo_id is distinct from new.grupo_id then
    raise exception
      'La membresia asociada a la insignia desbloqueada debe pertenecer al mismo grupo.';
  end if;

  return new;
end;
$$;

create trigger insignias_desbloqueadas_validar
before insert or update on insignias_desbloqueadas
for each row
execute function validar_insignia_desbloqueada();

create or replace function preparar_borrado_usuario()
returns trigger
language plpgsql
as $$
declare
  admin_actual record;
  nuevo_admin_id uuid;
begin
  for admin_actual in
    select id, grupo_id
    from membresias
    where usuario_id = old.id
      and rol = 'admin'
      and estado = 'activa'
  loop
    select id
    into nuevo_admin_id
    from membresias
    where grupo_id = admin_actual.grupo_id
      and id <> admin_actual.id
      and estado = 'activa'
      and usuario_id is not null
    order by fecha_entrada asc
    limit 1;

    if nuevo_admin_id is null then
      raise exception
        'No se puede borrar el usuario: es admin del grupo % y no hay otro miembro real activo al que traspasar el rol.',
        admin_actual.grupo_id;
    end if;

    update membresias
    set rol = 'miembro',
        estado = 'eliminada',
        usuario_id = null
    where id = admin_actual.id;

    update membresias
    set rol = 'admin'
    where id = nuevo_admin_id;
  end loop;

  update membresias
  set estado = 'eliminada',
      usuario_id = null,
      rol = 'miembro'
  where usuario_id = old.id;

  return old;
end;
$$;

create trigger usuarios_preparar_borrado
before delete on usuarios
for each row
execute function preparar_borrado_usuario();
