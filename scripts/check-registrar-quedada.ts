import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  createLaRachaSupabaseClient,
  listarGruposUsuarioActual,
  listarHistorialQuedadasGrupo,
  listarMembresiasGrupo,
  listarOpcionesGrupo,
  obtenerUsuarioActual,
  registrarQuedadaCompleta,
} from '../src/infrastructure';
import { leerEnvLocal, leerVariable } from './env';

const env = leerEnvLocal();
const supabase = createLaRachaSupabaseClient({
  url: leerVariable(env, 'NEXT_PUBLIC_SUPABASE_URL'),
  anonKey: leerVariable(env, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
});

const rl = createInterface({ input, output });

try {
  const email = (await rl.question('Email de Supabase Auth: ')).trim();
  const password = await rl.question('Password: ');

  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    throw new Error(`No se pudo iniciar sesion: ${authError.message}`);
  }

  const usuario = await obtenerUsuarioActual(supabase);

  if (!usuario) {
    throw new Error('El login funciono, pero no existe un perfil en la tabla usuarios.');
  }

  const grupos = await listarGruposUsuarioActual(supabase);
  const primerGrupo = grupos[0];

  if (!primerGrupo) {
    throw new Error('El usuario autenticado no tiene grupos visibles.');
  }

  const membresias = await listarMembresiasGrupo(supabase, primerGrupo.grupo.id);
  const asistentes = membresias.map((membresia) => membresia.id);
  const conductor = membresias.find((membresia) => membresia.usuarioId === usuario.id) ?? membresias[0];

  if (!conductor) {
    throw new Error('No hay membresias activas para usar como conductor.');
  }

  const titulo = `Prueba RPC ${new Date().toISOString()}`;

  console.log('');
  console.log('Se va a crear una quedada de prueba con estos datos:');
  console.log(`Grupo: ${primerGrupo.grupo.nombre}`);
  console.log(`Titulo: ${titulo}`);
  console.log(`Creador: ${primerGrupo.membresia.apodo}`);
  console.log(`Conductor: ${conductor.apodo}`);
  console.log(`Asistentes: ${membresias.map((membresia) => membresia.apodo).join(', ')}`);
  console.log('Tipo de plan: Prueba tecnica');
  console.log('Lugar: Casa');
  console.log('Comida: nada');
  console.log('');

  const confirmacion = (await rl.question('Escribe SI para crear la quedada de prueba: ')).trim();

  if (confirmacion !== 'SI') {
    console.log('Operacion cancelada. No se ha creado ninguna quedada.');
    process.exit(0);
  }

  const quedadaId = await registrarQuedadaCompleta(supabase, {
    grupoId: primerGrupo.grupo.id,
    titulo,
    creadaPorMembresiaId: primerGrupo.membresia.id,
    conductorMembresiaId: conductor.id,
    tipoPlanTexto: 'Prueba tecnica',
    momentoDia: 'tarde',
    lugarTexto: 'Casa',
    comidaTexto: 'nada',
    duracionMinutos: 60,
    notas: 'Quedada creada desde el script de comprobacion del backend.',
    asistentesMembresiaIds: asistentes,
  });

  const [historial, opciones] = await Promise.all([
    listarHistorialQuedadasGrupo(supabase, primerGrupo.grupo.id),
    listarOpcionesGrupo(supabase, primerGrupo.grupo.id),
  ]);

  console.log('');
  console.log('Quedada creada correctamente.');
  console.log(`ID nueva quedada: ${quedadaId}`);
  console.log(`Quedadas visibles ahora: ${historial.length}`);
  console.log(`Opciones reutilizables visibles ahora: ${opciones.length}`);
} finally {
  rl.close();
}
