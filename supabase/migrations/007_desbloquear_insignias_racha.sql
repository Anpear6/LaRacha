-- La Racha - desbloqueo transaccional de insignias de racha
-- Esta funcion guarda las insignias que la logica de dominio ya ha marcado como desbloqueables.

create or replace function desbloquear_insignias_racha_mvp(
  p_grupo_id uuid,
  p_desbloqueos jsonb default '[]'::jsonb
)
returns uuid[]
language plpgsql
security invoker
set search_path = public
as $$
declare
  ids_insertados uuid[];
begin
  if p_grupo_id is null then
    raise exception 'El grupo es obligatorio.';
  end if;

  if not pertenece_a_grupo(p_grupo_id) then
    raise exception 'No puedes desbloquear insignias en un grupo al que no perteneces.';
  end if;

  if p_desbloqueos is null or jsonb_typeof(p_desbloqueos) <> 'array' then
    raise exception 'Los desbloqueos deben enviarse como un array JSON.';
  end if;

  if jsonb_array_length(p_desbloqueos) = 0 then
    return array[]::uuid[];
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_desbloqueos) as desbloqueo(
      insignia_id uuid,
      membresia_id uuid,
      fecha_desbloqueo timestamptz
    )
    where desbloqueo.insignia_id is null
  ) then
    raise exception 'Cada desbloqueo debe indicar una insignia.';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_desbloqueos) as desbloqueo(
      insignia_id uuid,
      membresia_id uuid,
      fecha_desbloqueo timestamptz
    )
    left join insignias on insignias.id = desbloqueo.insignia_id
    where insignias.id is null
       or insignias.tipo <> 'racha_grupo'
  ) then
    raise exception 'Todas las insignias deben existir y ser de tipo racha_grupo.';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_desbloqueos) as desbloqueo(
      insignia_id uuid,
      membresia_id uuid,
      fecha_desbloqueo timestamptz
    )
    left join membresias on membresias.id = desbloqueo.membresia_id
    where desbloqueo.membresia_id is not null
      and (membresias.id is null or membresias.grupo_id <> p_grupo_id)
  ) then
    raise exception 'La membresia asociada a una insignia debe pertenecer al grupo.';
  end if;

  with desbloqueos as (
    select
      desbloqueo.insignia_id,
      desbloqueo.membresia_id,
      coalesce(desbloqueo.fecha_desbloqueo, now()) as fecha_desbloqueo
    from jsonb_to_recordset(p_desbloqueos) as desbloqueo(
      insignia_id uuid,
      membresia_id uuid,
      fecha_desbloqueo timestamptz
    )
  ),
  insertados as (
    insert into insignias_desbloqueadas (
      insignia_id,
      grupo_id,
      membresia_id,
      fecha_desbloqueo
    )
    select
      desbloqueos.insignia_id,
      p_grupo_id,
      desbloqueos.membresia_id,
      desbloqueos.fecha_desbloqueo
    from desbloqueos
    on conflict (grupo_id, insignia_id) do nothing
    returning id
  )
  select coalesce(array_agg(id), array[]::uuid[])
  into ids_insertados
  from insertados;

  return ids_insertados;
end;
$$;
