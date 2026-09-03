-- Refuerza los datos que ya pide el registro de la app.
-- El username pasa a ser obligatorio y se añade una funcion segura para comprobar disponibilidad.
-- La fecha de nacimiento se exige para registros nuevos mediante un CHECK NOT VALID para no bloquear
-- los usuarios de prueba creados antes de que este dato existiera.

alter table usuarios
alter column username set not null;

alter table usuarios
drop constraint if exists usuarios_username_no_vacio;

alter table usuarios
add constraint usuarios_username_no_vacio
check (length(trim(username)) > 0);

alter table usuarios
drop constraint if exists usuarios_fecha_nacimiento_obligatoria;

alter table usuarios
add constraint usuarios_fecha_nacimiento_obligatoria
check (fecha_nacimiento is not null)
not valid;

create or replace function public.existe_usuario_por_username_mvp(p_username text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from usuarios
    where lower(username) = lower(trim(p_username))
  );
$$;

revoke all on function public.existe_usuario_por_username_mvp(text) from public;
grant execute on function public.existe_usuario_por_username_mvp(text) to anon;
grant execute on function public.existe_usuario_por_username_mvp(text) to authenticated;
