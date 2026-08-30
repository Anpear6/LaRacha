-- La Racha - registrar quedada completa en una transaccion
-- Crea una quedada, sus opciones reutilizables, asistencias, fotos y objetos perdidos.

create or replace function obtener_o_crear_opcion_grupo(
  p_grupo_id uuid,
  p_tipo text,
  p_valor text
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  opcion_id uuid;
  valor_limpio text;
begin
  valor_limpio := nullif(trim(p_valor), '');

  if valor_limpio is null then
    return null;
  end if;

  select id
  into opcion_id
  from opciones_grupo
  where grupo_id = p_grupo_id
    and tipo = p_tipo
    and lower(valor) = lower(valor_limpio)
  limit 1;

  if opcion_id is not null then
    return opcion_id;
  end if;

  insert into opciones_grupo (grupo_id, tipo, valor)
  values (p_grupo_id, p_tipo, valor_limpio)
  returning id into opcion_id;

  return opcion_id;
end;
$$;

create or replace function registrar_quedada_completa_mvp(
  p_grupo_id uuid,
  p_titulo text,
  p_creada_por_membresia_id uuid,
  p_fecha timestamptz default now(),
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
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  nueva_quedada_id uuid;
  tipo_plan_opcion_id uuid;
  lugar_opcion_id uuid;
  comida_opcion_id uuid;
  membresia record;
  foto jsonb;
begin
  if nullif(trim(p_titulo), '') is null then
    raise exception 'La quedada debe tener titulo.';
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

  tipo_plan_opcion_id := obtener_o_crear_opcion_grupo(
    p_grupo_id,
    'tipo_plan',
    p_tipo_plan_texto
  );

  lugar_opcion_id := obtener_o_crear_opcion_grupo(
    p_grupo_id,
    'lugar',
    p_lugar_texto
  );

  comida_opcion_id := obtener_o_crear_opcion_grupo(
    p_grupo_id,
    'comida',
    p_comida_texto
  );

  insert into quedadas (
    grupo_id,
    titulo,
    fecha,
    conductor_membresia_id,
    creada_por_membresia_id,
    tipo_plan_opcion_id,
    tipo_plan_texto,
    momento_dia,
    lugar_opcion_id,
    lugar_texto,
    comida_opcion_id,
    comida_texto,
    duracion_minutos,
    notas
  )
  values (
    p_grupo_id,
    trim(p_titulo),
    coalesce(p_fecha, now()),
    p_conductor_membresia_id,
    p_creada_por_membresia_id,
    tipo_plan_opcion_id,
    nullif(trim(p_tipo_plan_texto), ''),
    p_momento_dia,
    lugar_opcion_id,
    nullif(trim(p_lugar_texto), ''),
    comida_opcion_id,
    nullif(trim(p_comida_texto), ''),
    p_duracion_minutos,
    nullif(trim(p_notas), '')
  )
  returning id into nueva_quedada_id;

  for membresia in
    select id
    from membresias
    where grupo_id = p_grupo_id
      and estado = 'activa'
    order by fecha_entrada
  loop
    insert into asistencias (quedada_id, membresia_id, estado)
    values (
      nueva_quedada_id,
      membresia.id,
      case
        when membresia.id = any(p_asistentes_membresia_ids) then 'asistio'
        else 'no_asistio'
      end
    );
  end loop;

  insert into objetos_perdidos (quedada_id, membresia_id)
  select nueva_quedada_id, miembro_perdido_id
  from unnest(p_objetos_perdidos_membresia_ids) as miembro_perdido_id
  where miembro_perdido_id is not null
  on conflict do nothing;

  for foto in select * from jsonb_array_elements(p_fotos)
  loop
    if nullif(trim(foto->>'url'), '') is not null then
      insert into fotos_quedada (quedada_id, url, descripcion)
      values (
        nueva_quedada_id,
        trim(foto->>'url'),
        nullif(trim(foto->>'descripcion'), '')
      );
    end if;
  end loop;

  return nueva_quedada_id;
end;
$$;
