-- La Racha - alinear usuarios semilla con Supabase Auth
-- Ejecutar despues de crear los usuarios reales en Supabase Authentication.
-- Esta migracion asume que el seed inicial ya se ejecuto con los UUID temporales.

begin;

-- Desvinculamos temporalmente las membresias porque usuarios.id es clave primaria
-- y la FK de membresias apunta a usuarios.id.
update membresias
set usuario_id = null
where usuario_id in (
  '00000000-0000-0000-0000-000000000101',
  '00000000-0000-0000-0000-000000000102'
);

update usuarios
set id = 'e2677b39-d08a-45ae-8115-eb34a6326602'
where id = '00000000-0000-0000-0000-000000000101'
  and email = 'pepitapepagarc@gmail.com';

update usuarios
set id = 'd1c79c43-9efe-4357-8045-83a1638dabc0'
where id = '00000000-0000-0000-0000-000000000102'
  and email = 'perezarandafran@gmail.com';

update membresias
set usuario_id = 'e2677b39-d08a-45ae-8115-eb34a6326602'
where id = '00000000-0000-0000-0000-000000000301';

update membresias
set usuario_id = 'd1c79c43-9efe-4357-8045-83a1638dabc0'
where id = '00000000-0000-0000-0000-000000000302';

commit;
