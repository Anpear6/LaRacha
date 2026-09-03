-- Comprueba si ya existe un usuario con ese email sin exponer datos del usuario.
-- En el MVP se usa para dar un mensaje claro al crear cuenta desde la pantalla de acceso.

create or replace function public.existe_usuario_por_email_mvp(p_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.usuarios
    where lower(email) = lower(trim(p_email))
  );
$$;

revoke all on function public.existe_usuario_por_email_mvp(text) from public;
grant execute on function public.existe_usuario_por_email_mvp(text) to anon;
grant execute on function public.existe_usuario_por_email_mvp(text) to authenticated;
