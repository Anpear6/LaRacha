-- La Racha - gestion basica de grupos y membresias del MVP

create or replace function crear_grupo_mvp(
  p_nombre text,
  p_descripcion text default null,
  p_foto_perfil_url text default null,
  p_frecuencia_racha text default 'semanal',
  p_apodo_admin text default null,
  p_avatar_admin_url text default null
)
returns table(grupo_id uuid, membresia_id uuid)
language plpgsql
security invoker
set search_path = public
as $$
declare
  nuevo_grupo_id uuid := gen_random_uuid();
  nueva_membresia_id uuid := gen_random_uuid();
  usuario_actual usuarios%rowtype;
  apodo_final text;
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesion para crear un grupo.';
  end if;

  if p_nombre is null or length(trim(p_nombre)) = 0 then
    raise exception 'El nombre del grupo es obligatorio.';
  end if;

  if p_frecuencia_racha not in (
    'dos_veces_semana',
    'semanal',
    'dos_al_mes',
    'mensual',
    'seis_al_anio'
  ) then
    raise exception 'La frecuencia de racha no es valida.';
  end if;

  select *
  into usuario_actual
  from usuarios
  where id = auth.uid();

  if usuario_actual.id is null then
    raise exception 'No existe un perfil de usuario para la sesion actual.';
  end if;

  apodo_final := nullif(trim(coalesce(p_apodo_admin, usuario_actual.username, usuario_actual.nombre)), '');

  if apodo_final is null then
    raise exception 'El apodo del administrador es obligatorio.';
  end if;

  insert into grupos (
    id,
    nombre,
    descripcion,
    foto_perfil_url,
    frecuencia_racha
  )
  values (
    nuevo_grupo_id,
    trim(p_nombre),
    nullif(trim(p_descripcion), ''),
    nullif(trim(p_foto_perfil_url), ''),
    p_frecuencia_racha
  );

  insert into membresias (
    id,
    usuario_id,
    grupo_id,
    rol,
    apodo,
    avatar_grupo_url
  )
  values (
    nueva_membresia_id,
    auth.uid(),
    nuevo_grupo_id,
    'admin',
    apodo_final,
    nullif(trim(p_avatar_admin_url), '')
  );

  return query select nuevo_grupo_id, nueva_membresia_id;
end;
$$;

create or replace function actualizar_grupo_mvp(
  p_grupo_id uuid,
  p_nombre text,
  p_descripcion text default null,
  p_foto_perfil_url text default null,
  p_tregua_verano_activa boolean default null
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if p_grupo_id is null then
    raise exception 'El grupo es obligatorio.';
  end if;

  if not es_admin_grupo(p_grupo_id) then
    raise exception 'Solo el administrador puede editar el grupo.';
  end if;

  if p_nombre is null or length(trim(p_nombre)) = 0 then
    raise exception 'El nombre del grupo es obligatorio.';
  end if;

  update grupos
  set
    nombre = trim(p_nombre),
    descripcion = nullif(trim(p_descripcion), ''),
    foto_perfil_url = nullif(trim(p_foto_perfil_url), ''),
    tregua_verano_activa = coalesce(p_tregua_verano_activa, tregua_verano_activa)
  where id = p_grupo_id;
end;
$$;

create or replace function eliminar_grupo_mvp(p_grupo_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if p_grupo_id is null then
    raise exception 'El grupo es obligatorio.';
  end if;

  if not es_admin_grupo(p_grupo_id) then
    raise exception 'Solo el administrador puede eliminar el grupo.';
  end if;

  delete from grupos
  where id = p_grupo_id;
end;
$$;

create or replace function crear_miembro_sin_cuenta_mvp(
  p_grupo_id uuid,
  p_apodo text,
  p_avatar_grupo_url text default null
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  nueva_membresia_id uuid;
begin
  if p_grupo_id is null then
    raise exception 'El grupo es obligatorio.';
  end if;

  if not es_admin_grupo(p_grupo_id) then
    raise exception 'Solo el administrador puede crear miembros sin cuenta.';
  end if;

  if p_apodo is null or length(trim(p_apodo)) = 0 then
    raise exception 'El apodo es obligatorio.';
  end if;

  insert into membresias (
    usuario_id,
    grupo_id,
    rol,
    apodo,
    avatar_grupo_url
  )
  values (
    null,
    p_grupo_id,
    'miembro',
    trim(p_apodo),
    nullif(trim(p_avatar_grupo_url), '')
  )
  returning id into nueva_membresia_id;

  return nueva_membresia_id;
end;
$$;

create or replace function actualizar_membresia_propia_mvp(
  p_membresia_id uuid,
  p_apodo text,
  p_avatar_grupo_url text default null
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if p_membresia_id is null then
    raise exception 'La membresia es obligatoria.';
  end if;

  if p_apodo is null or length(trim(p_apodo)) = 0 then
    raise exception 'El apodo es obligatorio.';
  end if;

  update membresias
  set
    apodo = trim(p_apodo),
    avatar_grupo_url = nullif(trim(p_avatar_grupo_url), '')
  where id = p_membresia_id
    and usuario_id = auth.uid()
    and estado = 'activa';

  if not found then
    raise exception 'Solo puedes editar tu propia membresia activa.';
  end if;
end;
$$;

create or replace function actualizar_miembro_sin_cuenta_mvp(
  p_membresia_id uuid,
  p_apodo text,
  p_avatar_grupo_url text default null
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  grupo_objetivo uuid;
begin
  if p_membresia_id is null then
    raise exception 'La membresia es obligatoria.';
  end if;

  if p_apodo is null or length(trim(p_apodo)) = 0 then
    raise exception 'El apodo es obligatorio.';
  end if;

  select grupo_id
  into grupo_objetivo
  from membresias
  where id = p_membresia_id
    and usuario_id is null
    and estado = 'activa';

  if grupo_objetivo is null then
    raise exception 'La membresia sin cuenta no existe o no esta activa.';
  end if;

  if not es_admin_grupo(grupo_objetivo) then
    raise exception 'Solo el administrador puede editar miembros sin cuenta.';
  end if;

  update membresias
  set
    apodo = trim(p_apodo),
    avatar_grupo_url = nullif(trim(p_avatar_grupo_url), '')
  where id = p_membresia_id;
end;
$$;

create or replace function eliminar_membresia_mvp(p_membresia_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  membresia_objetivo membresias%rowtype;
begin
  if p_membresia_id is null then
    raise exception 'La membresia es obligatoria.';
  end if;

  select *
  into membresia_objetivo
  from membresias
  where id = p_membresia_id
    and estado = 'activa';

  if membresia_objetivo.id is null then
    raise exception 'La membresia no existe o ya esta eliminada.';
  end if;

  if not es_admin_grupo(membresia_objetivo.grupo_id) then
    raise exception 'Solo el administrador puede eliminar miembros del grupo.';
  end if;

  if membresia_objetivo.rol = 'admin' then
    raise exception 'No se puede eliminar la membresia administradora desde esta operacion.';
  end if;

  update membresias
  set estado = 'eliminada'
  where id = p_membresia_id;
end;
$$;
