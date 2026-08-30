-- La Racha - editar una quedada completa en una transaccion
-- Actualiza datos principales, opciones reutilizables, asistencias, objetos perdidos y fotos.

create or replace function editar_quedada_completa_mvp(
  p_quedada_id uuid,
  p_titulo text,
  p_fecha timestamptz,
  p_conductor_membresia_id uuid default null,
  p_tipo_plan_texto text default null,
  p_momento_dia text default null,
  p_lugar_texto text default null,
  p_comida_texto text default null,
  p_duracion_minutos integer default null,
  p_notas text default null,
  p_asistentes_membresia_ids uuid[] default '{}',
  p_objetos_perdidos_membresia_ids uuid[] default '{}',
  p_fotos jsonb default '[]'::jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  grupo_objetivo_id uuid;
  v_tipo_plan_opcion_id uuid;
  v_lugar_opcion_id uuid;
  v_comida_opcion_id uuid;
  foto jsonb;
begin
  if p_quedada_id is null then
    raise exception 'La quedada es obligatoria.';
  end if;

  select grupo_id
  into grupo_objetivo_id
  from quedadas
  where id = p_quedada_id;

  if grupo_objetivo_id is null then
    raise exception 'La quedada no existe.';
  end if;

  if not pertenece_a_grupo(grupo_objetivo_id) then
    raise exception 'No puedes editar una quedada de un grupo al que no perteneces.';
  end if;

  if nullif(trim(p_titulo), '') is null then
    raise exception 'La quedada debe tener titulo.';
  end if;

  if p_fecha is null then
    raise exception 'La fecha de la quedada es obligatoria.';
  end if;

  if p_momento_dia is not null and p_momento_dia not in (
    'manana',
    'tarde',
    'tarde_noche',
    'noche',
    'dia_completo'
  ) then
    raise exception 'Momento del dia no valido.';
  end if;

  if p_duracion_minutos is not null and p_duracion_minutos <= 0 then
    raise exception 'La duracion debe ser mayor que 0 minutos.';
  end if;

  if jsonb_typeof(p_fotos) <> 'array' then
    raise exception 'Las fotos deben enviarse como array JSON.';
  end if;

  if p_conductor_membresia_id is not null and not exists (
    select 1
    from membresias
    where id = p_conductor_membresia_id
      and grupo_id = grupo_objetivo_id
      and estado = 'activa'
  ) then
    raise exception 'El conductor debe ser una membresia activa del mismo grupo.';
  end if;

  if exists (
    select 1
    from unnest(p_asistentes_membresia_ids) as asistente_id
    left join membresias on membresias.id = asistente_id
    where asistente_id is not null
      and (
        membresias.id is null
        or membresias.grupo_id <> grupo_objetivo_id
        or membresias.estado <> 'activa'
      )
  ) then
    raise exception 'Todas las asistencias deben pertenecer a membresias activas del grupo.';
  end if;

  if exists (
    select 1
    from unnest(p_objetos_perdidos_membresia_ids) as miembro_perdido_id
    left join membresias on membresias.id = miembro_perdido_id
    where miembro_perdido_id is not null
      and (
        membresias.id is null
        or membresias.grupo_id <> grupo_objetivo_id
        or membresias.estado <> 'activa'
      )
  ) then
    raise exception 'Los objetos perdidos deben pertenecer a membresias activas del grupo.';
  end if;

  v_tipo_plan_opcion_id := obtener_o_crear_opcion_grupo(
    grupo_objetivo_id,
    'tipo_plan',
    p_tipo_plan_texto
  );

  v_lugar_opcion_id := obtener_o_crear_opcion_grupo(
    grupo_objetivo_id,
    'lugar',
    p_lugar_texto
  );

  v_comida_opcion_id := obtener_o_crear_opcion_grupo(
    grupo_objetivo_id,
    'comida',
    p_comida_texto
  );

  update quedadas
  set
    titulo = trim(p_titulo),
    fecha = p_fecha,
    conductor_membresia_id = p_conductor_membresia_id,
    tipo_plan_opcion_id = v_tipo_plan_opcion_id,
    tipo_plan_texto = nullif(trim(p_tipo_plan_texto), ''),
    momento_dia = p_momento_dia,
    lugar_opcion_id = v_lugar_opcion_id,
    lugar_texto = nullif(trim(p_lugar_texto), ''),
    comida_opcion_id = v_comida_opcion_id,
    comida_texto = nullif(trim(p_comida_texto), ''),
    duracion_minutos = p_duracion_minutos,
    notas = nullif(trim(p_notas), '')
  where id = p_quedada_id;

  insert into asistencias (quedada_id, membresia_id, estado)
  select
    p_quedada_id,
    membresias.id,
    case
      when membresias.id = any(p_asistentes_membresia_ids) then 'asistio'
      else 'no_asistio'
    end
  from membresias
  where membresias.grupo_id = grupo_objetivo_id
    and membresias.estado = 'activa'
  on conflict (quedada_id, membresia_id)
  do update set estado = excluded.estado;

  delete from objetos_perdidos
  using membresias
  where objetos_perdidos.quedada_id = p_quedada_id
    and objetos_perdidos.membresia_id = membresias.id
    and membresias.grupo_id = grupo_objetivo_id
    and membresias.estado = 'activa';

  insert into objetos_perdidos (quedada_id, membresia_id)
  select p_quedada_id, miembro_perdido_id
  from unnest(p_objetos_perdidos_membresia_ids) as miembro_perdido_id
  where miembro_perdido_id is not null
  on conflict do nothing;

  delete from fotos_quedada
  where quedada_id = p_quedada_id;

  for foto in select * from jsonb_array_elements(p_fotos)
  loop
    if nullif(trim(foto->>'url'), '') is not null then
      insert into fotos_quedada (quedada_id, url, descripcion)
      values (
        p_quedada_id,
        trim(foto->>'url'),
        nullif(trim(foto->>'descripcion'), '')
      );
    end if;
  end loop;
end;
$$;
