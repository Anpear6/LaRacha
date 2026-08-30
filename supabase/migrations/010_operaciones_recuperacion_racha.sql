-- La Racha - operaciones de recuperacion de racha del MVP

create or replace function guardar_recuperacion_pendiente_mvp(
  p_grupo_id uuid,
  p_racha_perdida_periodos integer,
  p_fecha_inicio date default current_date
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  recuperacion_existente_id uuid;
  nueva_recuperacion_id uuid;
begin
  if p_grupo_id is null then
    raise exception 'El grupo es obligatorio.';
  end if;

  if not pertenece_a_grupo(p_grupo_id) then
    raise exception 'No puedes crear una recuperacion en un grupo al que no perteneces.';
  end if;

  if p_racha_perdida_periodos is null or p_racha_perdida_periodos <= 0 then
    raise exception 'La racha perdida debe ser mayor que 0.';
  end if;

  select id
  into recuperacion_existente_id
  from recuperaciones_racha
  where grupo_id = p_grupo_id
    and estado in ('pendiente', 'en_progreso', 'pausada')
  order by fecha_creacion desc
  limit 1;

  if recuperacion_existente_id is not null then
    return recuperacion_existente_id;
  end if;

  insert into recuperaciones_racha (
    grupo_id,
    racha_perdida_periodos,
    periodos_necesarios,
    periodos_completados,
    estado,
    fecha_inicio
  )
  values (
    p_grupo_id,
    p_racha_perdida_periodos,
    p_racha_perdida_periodos,
    0,
    'pendiente',
    coalesce(p_fecha_inicio, current_date)
  )
  returning id into nueva_recuperacion_id;

  return nueva_recuperacion_id;
end;
$$;

create or replace function activar_recuperacion_racha_mvp(
  p_recuperacion_id uuid,
  p_fecha_inicio date default current_date
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_grupo_id uuid;
begin
  select grupo_id
  into v_grupo_id
  from recuperaciones_racha
  where id = p_recuperacion_id
    and estado = 'pendiente';

  if v_grupo_id is null then
    raise exception 'La recuperacion pendiente no existe.';
  end if;

  if not es_admin_grupo(v_grupo_id) then
    raise exception 'Solo el administrador puede activar la recuperacion.';
  end if;

  update recuperaciones_racha
  set
    estado = 'en_progreso',
    fecha_inicio = coalesce(p_fecha_inicio, current_date),
    fecha_fin = null
  where id = p_recuperacion_id;
end;
$$;

create or replace function pausar_recuperacion_racha_mvp(p_recuperacion_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_grupo_id uuid;
begin
  select grupo_id
  into v_grupo_id
  from recuperaciones_racha
  where id = p_recuperacion_id
    and estado = 'en_progreso';

  if v_grupo_id is null then
    raise exception 'La recuperacion en progreso no existe.';
  end if;

  if not es_admin_grupo(v_grupo_id) then
    raise exception 'Solo el administrador puede pausar la recuperacion.';
  end if;

  update recuperaciones_racha
  set estado = 'pausada'
  where id = p_recuperacion_id;
end;
$$;

create or replace function reanudar_recuperacion_racha_mvp(p_recuperacion_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_grupo_id uuid;
begin
  select grupo_id
  into v_grupo_id
  from recuperaciones_racha
  where id = p_recuperacion_id
    and estado = 'pausada';

  if v_grupo_id is null then
    raise exception 'La recuperacion pausada no existe.';
  end if;

  if not es_admin_grupo(v_grupo_id) then
    raise exception 'Solo el administrador puede reanudar la recuperacion.';
  end if;

  update recuperaciones_racha
  set estado = 'en_progreso'
  where id = p_recuperacion_id;
end;
$$;

create or replace function registrar_periodo_recuperacion_cumplido_mvp(
  p_recuperacion_id uuid,
  p_fecha_fin date default current_date
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_recuperacion recuperaciones_racha%rowtype;
  v_periodos_completados integer;
begin
  select *
  into v_recuperacion
  from recuperaciones_racha
  where id = p_recuperacion_id
    and estado = 'en_progreso';

  if v_recuperacion.id is null then
    raise exception 'La recuperacion en progreso no existe.';
  end if;

  if not pertenece_a_grupo(v_recuperacion.grupo_id) then
    raise exception 'No puedes avanzar una recuperacion de un grupo al que no perteneces.';
  end if;

  v_periodos_completados := v_recuperacion.periodos_completados + 1;

  update recuperaciones_racha
  set
    periodos_completados = v_periodos_completados,
    estado = case
      when v_periodos_completados >= v_recuperacion.periodos_necesarios then 'completada'
      else 'en_progreso'
    end,
    fecha_fin = case
      when v_periodos_completados >= v_recuperacion.periodos_necesarios then coalesce(p_fecha_fin, current_date)
      else null
    end
  where id = p_recuperacion_id;
end;
$$;

create or replace function fallar_recuperacion_racha_mvp(
  p_recuperacion_id uuid,
  p_fecha_fin date default current_date
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_recuperacion recuperaciones_racha%rowtype;
  nueva_recuperacion_id uuid;
begin
  select *
  into v_recuperacion
  from recuperaciones_racha
  where id = p_recuperacion_id
    and estado = 'en_progreso';

  if v_recuperacion.id is null then
    raise exception 'La recuperacion en progreso no existe.';
  end if;

  if not pertenece_a_grupo(v_recuperacion.grupo_id) then
    raise exception 'No puedes fallar una recuperacion de un grupo al que no perteneces.';
  end if;

  update recuperaciones_racha
  set
    estado = 'fallida',
    fecha_fin = coalesce(p_fecha_fin, current_date)
  where id = p_recuperacion_id;

  insert into recuperaciones_racha (
    grupo_id,
    racha_perdida_periodos,
    periodos_necesarios,
    periodos_completados,
    estado,
    fecha_inicio
  )
  values (
    v_recuperacion.grupo_id,
    v_recuperacion.racha_perdida_periodos,
    v_recuperacion.periodos_necesarios,
    0,
    'pendiente',
    coalesce(p_fecha_fin, current_date)
  )
  returning id into nueva_recuperacion_id;

  return nueva_recuperacion_id;
end;
$$;
