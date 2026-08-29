-- La Racha - politicas RLS iniciales del MVP
-- Importante: estas politicas asumen que public.usuarios.id = auth.users.id.

create or replace function usuario_actual_id()
returns uuid
language sql
stable
as $$
  select auth.uid();
$$;

create or replace function pertenece_a_grupo(grupo uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from membresias
    where membresias.grupo_id = grupo
      and membresias.usuario_id = auth.uid()
      and membresias.estado = 'activa'
  );
$$;

create or replace function es_admin_grupo(grupo uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from membresias
    where membresias.grupo_id = grupo
      and membresias.usuario_id = auth.uid()
      and membresias.rol = 'admin'
      and membresias.estado = 'activa'
  );
$$;

create or replace function pertenece_a_quedada(quedada uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from quedadas
    where quedadas.id = quedada
      and pertenece_a_grupo(quedadas.grupo_id)
  );
$$;

create or replace function puede_crear_quedada(grupo uuid, creador_membresia uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from membresias
    where membresias.id = creador_membresia
      and membresias.grupo_id = grupo
      and membresias.usuario_id = auth.uid()
      and membresias.estado = 'activa'
  );
$$;

create or replace function grupo_sin_membresias(grupo uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1
    from membresias
    where membresias.grupo_id = grupo
  );
$$;

alter table usuarios enable row level security;
alter table grupos enable row level security;
alter table membresias enable row level security;
alter table opciones_grupo enable row level security;
alter table quedadas enable row level security;
alter table fotos_quedada enable row level security;
alter table objetos_perdidos enable row level security;
alter table asistencias enable row level security;
alter table insignias enable row level security;
alter table insignias_desbloqueadas enable row level security;
alter table recuperaciones_racha enable row level security;

create policy usuarios_select_propios_o_compartidos
on usuarios
for select
to authenticated
using (
  id = auth.uid()
  or exists (
    select 1
    from membresias mi_usuario
    join membresias mi_otro on mi_otro.grupo_id = mi_usuario.grupo_id
    where mi_usuario.usuario_id = auth.uid()
      and mi_usuario.estado = 'activa'
      and mi_otro.usuario_id = usuarios.id
      and mi_otro.estado = 'activa'
  )
);

create policy usuarios_insert_propio
on usuarios
for insert
to authenticated
with check (id = auth.uid());

create policy usuarios_update_propio
on usuarios
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy usuarios_delete_propio
on usuarios
for delete
to authenticated
using (id = auth.uid());

create policy grupos_select_miembro
on grupos
for select
to authenticated
using (pertenece_a_grupo(id));

create policy grupos_insert_autenticado
on grupos
for insert
to authenticated
with check (auth.uid() is not null);

create policy grupos_update_admin
on grupos
for update
to authenticated
using (es_admin_grupo(id))
with check (es_admin_grupo(id));

create policy grupos_delete_admin
on grupos
for delete
to authenticated
using (es_admin_grupo(id));

create policy membresias_select_miembro_grupo
on membresias
for select
to authenticated
using (pertenece_a_grupo(grupo_id));

create policy membresias_insert_admin
on membresias
for insert
to authenticated
with check (
  es_admin_grupo(grupo_id)
  or (
    usuario_id = auth.uid()
    and rol = 'admin'
    and estado = 'activa'
    and grupo_sin_membresias(grupo_id)
  )
);

create policy membresias_update_propia_o_sin_cuenta_admin
on membresias
for update
to authenticated
using (
  (usuario_id = auth.uid() and estado = 'activa')
  or (usuario_id is null and es_admin_grupo(grupo_id))
)
with check (
  (usuario_id = auth.uid() and estado = 'activa')
  or (usuario_id is null and es_admin_grupo(grupo_id))
);

create policy opciones_grupo_select_miembro
on opciones_grupo
for select
to authenticated
using (pertenece_a_grupo(grupo_id));

create policy opciones_grupo_insert_miembro
on opciones_grupo
for insert
to authenticated
with check (pertenece_a_grupo(grupo_id));

create policy quedadas_select_miembro
on quedadas
for select
to authenticated
using (pertenece_a_grupo(grupo_id));

create policy quedadas_insert_miembro_real
on quedadas
for insert
to authenticated
with check (
  pertenece_a_grupo(grupo_id)
  and puede_crear_quedada(grupo_id, creada_por_membresia_id)
);

create policy quedadas_update_miembro
on quedadas
for update
to authenticated
using (pertenece_a_grupo(grupo_id))
with check (pertenece_a_grupo(grupo_id));

create policy fotos_quedada_select_miembro
on fotos_quedada
for select
to authenticated
using (pertenece_a_quedada(quedada_id));

create policy fotos_quedada_insert_miembro
on fotos_quedada
for insert
to authenticated
with check (pertenece_a_quedada(quedada_id));

create policy fotos_quedada_update_miembro
on fotos_quedada
for update
to authenticated
using (pertenece_a_quedada(quedada_id))
with check (pertenece_a_quedada(quedada_id));

create policy fotos_quedada_delete_miembro
on fotos_quedada
for delete
to authenticated
using (pertenece_a_quedada(quedada_id));

create policy objetos_perdidos_select_miembro
on objetos_perdidos
for select
to authenticated
using (pertenece_a_quedada(quedada_id));

create policy objetos_perdidos_insert_miembro
on objetos_perdidos
for insert
to authenticated
with check (pertenece_a_quedada(quedada_id));

create policy objetos_perdidos_update_miembro
on objetos_perdidos
for update
to authenticated
using (pertenece_a_quedada(quedada_id))
with check (pertenece_a_quedada(quedada_id));

create policy objetos_perdidos_delete_miembro
on objetos_perdidos
for delete
to authenticated
using (pertenece_a_quedada(quedada_id));

create policy asistencias_select_miembro
on asistencias
for select
to authenticated
using (pertenece_a_quedada(quedada_id));

create policy asistencias_insert_miembro
on asistencias
for insert
to authenticated
with check (pertenece_a_quedada(quedada_id));

create policy asistencias_update_miembro
on asistencias
for update
to authenticated
using (pertenece_a_quedada(quedada_id))
with check (pertenece_a_quedada(quedada_id));

create policy insignias_select_autenticado
on insignias
for select
to authenticated
using (auth.uid() is not null);

create policy insignias_desbloqueadas_select_miembro
on insignias_desbloqueadas
for select
to authenticated
using (pertenece_a_grupo(grupo_id));

create policy insignias_desbloqueadas_insert_miembro
on insignias_desbloqueadas
for insert
to authenticated
with check (pertenece_a_grupo(grupo_id));

create policy recuperaciones_racha_select_miembro
on recuperaciones_racha
for select
to authenticated
using (pertenece_a_grupo(grupo_id));

create policy recuperaciones_racha_insert_miembro
on recuperaciones_racha
for insert
to authenticated
with check (pertenece_a_grupo(grupo_id));

create policy recuperaciones_racha_update_miembro
on recuperaciones_racha
for update
to authenticated
using (pertenece_a_grupo(grupo_id))
with check (pertenece_a_grupo(grupo_id));
