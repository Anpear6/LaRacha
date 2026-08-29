-- La Racha - datos semilla iniciales del MVP
-- Ejecutar despues de supabase/migrations/001_schema_mvp.sql.
-- Si la base ya existe y has ejecutado la primera migracion antes de este ajuste,
-- ejecuta tambien supabase/migrations/002_quedadas_fecha_default.sql.

begin;

insert into usuarios (id, nombre, username, email, avatar_global_url)
values
  (
    'e2677b39-d08a-45ae-8115-eb34a6326602',
    'Ángela',
    'Anpear06',
    'pepitapepagarc@gmail.com',
    'docs/recursos/Perfiles/usuariopordefecto.jpg'
  ),
  (
    'd1c79c43-9efe-4357-8045-83a1638dabc0',
    'Fran',
    'Franpe08',
    'perezarandafran@gmail.com',
    'docs/recursos/Perfiles/usuariopordefecto.jpg'
  )
on conflict (id) do update
set nombre = excluded.nombre,
    username = excluded.username,
    email = excluded.email,
    avatar_global_url = excluded.avatar_global_url;

insert into grupos (
  id,
  nombre,
  descripcion,
  foto_perfil_url,
  frecuencia_racha,
  tregua_verano_activa
)
values (
  '00000000-0000-0000-0000-000000000201',
  'Hermanitos',
  'Hermanitos haciendo pruebas.',
  'docs/recursos/Perfiles/grupopodefecto.jpg',
  'semanal',
  false
)
on conflict (id) do update
set nombre = excluded.nombre,
    descripcion = excluded.descripcion,
    foto_perfil_url = excluded.foto_perfil_url,
    tregua_verano_activa = excluded.tregua_verano_activa;

insert into membresias (id, usuario_id, grupo_id, rol, apodo, avatar_grupo_url)
values
  (
    '00000000-0000-0000-0000-000000000301',
    'e2677b39-d08a-45ae-8115-eb34a6326602',
    '00000000-0000-0000-0000-000000000201',
    'admin',
    'Ángela',
    'docs/recursos/Perfiles/usuariopordefecto.jpg'
  ),
  (
    '00000000-0000-0000-0000-000000000302',
    'd1c79c43-9efe-4357-8045-83a1638dabc0',
    '00000000-0000-0000-0000-000000000201',
    'miembro',
    'Fran',
    'docs/recursos/Perfiles/usuariopordefecto.jpg'
  ),
  (
    '00000000-0000-0000-0000-000000000303',
    null,
    '00000000-0000-0000-0000-000000000201',
    'miembro',
    'Beita',
    'docs/recursos/Perfiles/usuariopordefecto.jpg'
  )
on conflict (id) do update
set usuario_id = excluded.usuario_id,
    grupo_id = excluded.grupo_id,
    rol = excluded.rol,
    apodo = excluded.apodo,
    avatar_grupo_url = excluded.avatar_grupo_url,
    estado = 'activa';

insert into opciones_grupo (id, grupo_id, tipo, valor)
values
  (
    '00000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000201',
    'tipo_plan',
    'Banda de Música'
  ),
  (
    '00000000-0000-0000-0000-000000000402',
    '00000000-0000-0000-0000-000000000201',
    'lugar',
    'Casa'
  ),
  (
    '00000000-0000-0000-0000-000000000403',
    '00000000-0000-0000-0000-000000000201',
    'comida',
    'nada'
  )
on conflict (id) do update
set grupo_id = excluded.grupo_id,
    tipo = excluded.tipo,
    valor = excluded.valor;

insert into quedadas (
  id,
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
  '00000000-0000-0000-0000-000000000501',
  '00000000-0000-0000-0000-000000000201',
  'Primera quedada',
  '2026-08-29 10:00:00+02',
  '00000000-0000-0000-0000-000000000301',
  '00000000-0000-0000-0000-000000000301',
  '00000000-0000-0000-0000-000000000401',
  'Banda de Música',
  'manana',
  '00000000-0000-0000-0000-000000000402',
  'Casa',
  '00000000-0000-0000-0000-000000000403',
  'nada',
  60,
  null
)
on conflict (id) do update
set grupo_id = excluded.grupo_id,
    titulo = excluded.titulo,
    fecha = excluded.fecha,
    conductor_membresia_id = excluded.conductor_membresia_id,
    creada_por_membresia_id = excluded.creada_por_membresia_id,
    tipo_plan_opcion_id = excluded.tipo_plan_opcion_id,
    tipo_plan_texto = excluded.tipo_plan_texto,
    momento_dia = excluded.momento_dia,
    lugar_opcion_id = excluded.lugar_opcion_id,
    lugar_texto = excluded.lugar_texto,
    comida_opcion_id = excluded.comida_opcion_id,
    comida_texto = excluded.comida_texto,
    duracion_minutos = excluded.duracion_minutos,
    notas = excluded.notas;

insert into asistencias (id, quedada_id, membresia_id, estado)
values
  (
    '00000000-0000-0000-0000-000000000601',
    '00000000-0000-0000-0000-000000000501',
    '00000000-0000-0000-0000-000000000301',
    'asistio'
  ),
  (
    '00000000-0000-0000-0000-000000000602',
    '00000000-0000-0000-0000-000000000501',
    '00000000-0000-0000-0000-000000000302',
    'asistio'
  ),
  (
    '00000000-0000-0000-0000-000000000603',
    '00000000-0000-0000-0000-000000000501',
    '00000000-0000-0000-0000-000000000303',
    'asistio'
  )
on conflict (id) do update
set quedada_id = excluded.quedada_id,
    membresia_id = excluded.membresia_id,
    estado = excluded.estado;

insert into insignias (id, nombre, descripcion, criterio, tipo, imagen_url)
values
  (
    '00000000-0000-0000-0000-000000000701',
    '1 semana',
    'Enhorabuena! El grupo ha sobrevivido a la primera semana de racha. Esto ya empieza a parecer una tradicion.',
    '1_semana',
    'racha_grupo',
    'docs/recursos/Insignias/Por Defecto.png'
  ),
  (
    '00000000-0000-0000-0000-000000000702',
    '2 semanas',
    'Enhorabuena! El grupo lleva 2 semanas quedando de forma consecutiva. La agenda empieza a respetaros.',
    '2_semanas',
    'racha_grupo',
    'docs/recursos/Insignias/Por Defecto.png'
  ),
  (
    '00000000-0000-0000-0000-000000000703',
    '1 mes',
    'Enhorabuena! El grupo lleva 1 mes quedando de forma consecutiva. Esto ya no es casualidad, es compromiso.',
    '1_mes',
    'racha_grupo',
    'docs/recursos/Insignias/Por Defecto.png'
  ),
  (
    '00000000-0000-0000-0000-000000000704',
    '3 meses',
    'Enhorabuena! El grupo lleva 3 meses quedando de forma consecutiva. Nivel: reunion sagrada.',
    '3_meses',
    'racha_grupo',
    'docs/recursos/Insignias/Por Defecto.png'
  ),
  (
    '00000000-0000-0000-0000-000000000705',
    '6 meses',
    'Enhorabuena! El grupo lleva 6 meses quedando de forma consecutiva. Medio anio esquivando excusas.',
    '6_meses',
    'racha_grupo',
    'docs/recursos/Insignias/Por Defecto.png'
  ),
  (
    '00000000-0000-0000-0000-000000000706',
    '1 año',
    'Enhorabuena! El grupo lleva 1 año quedando de forma consecutiva. Esto merece foto, comida y discurso.',
    '1_anio',
    'racha_grupo',
    'docs/recursos/Insignias/Por Defecto.png'
  )
on conflict (id) do update
set nombre = excluded.nombre,
    descripcion = excluded.descripcion,
    criterio = excluded.criterio,
    tipo = excluded.tipo,
    imagen_url = excluded.imagen_url;

commit;
