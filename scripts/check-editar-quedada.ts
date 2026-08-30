import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  createLaRachaSupabaseClient,
  editarQuedadaCompleta,
  listarGruposUsuarioActual,
  listarHistorialQuedadasGrupo,
  listarMembresiasGrupo,
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
  const conductor = membresias.find((membresia) => membresia.usuarioId === usuario.id) ?? membresias[0];

  if (!conductor) {
    throw new Error('No hay membresias activas para usar como conductor.');
  }

  const asistentesIniciales = membresias.map((membresia) => membresia.id);
  const asistentesEditados = membresias.slice(0, Math.max(1, membresias.length - 1)).map((m) => m.id);
  const miembroConObjetoPerdido = membresias.at(-1);
  const ahora = new Date().toISOString();

  console.log('');
  console.log(`Usuario: ${usuario.nombre} (${usuario.username ?? 'sin username'})`);
  console.log(`Grupo: ${primerGrupo.grupo.nombre}`);
  console.log('Se va a crear una quedada temporal y después editarla.');
  console.log('La quedada quedará guardada porque en La Racha no borramos quedadas registradas.');
  console.log('');

  const confirmacion = (await rl.question('Escribe SI para crear y editar la quedada temporal: ')).trim();

  if (confirmacion !== 'SI') {
    console.log('Operacion cancelada. No se ha creado ninguna quedada.');
    process.exit(0);
  }

  const quedadaId = await registrarQuedadaCompleta(supabase, {
    grupoId: primerGrupo.grupo.id,
    titulo: `Prueba edicion ${ahora}`,
    creadaPorMembresiaId: primerGrupo.membresia.id,
    conductorMembresiaId: conductor.id,
    tipoPlanTexto: 'Prueba edicion',
    momentoDia: 'tarde',
    lugarTexto: 'Casa',
    comidaTexto: 'nada',
    duracionMinutos: 45,
    notas: 'Quedada creada antes de probar la edicion.',
    asistentesMembresiaIds: asistentesIniciales,
  });

  await editarQuedadaCompleta(supabase, {
    quedadaId,
    titulo: `Prueba edicion actualizada ${ahora}`,
    fecha: ahora,
    conductorMembresiaId: conductor.id,
    tipoPlanTexto: 'Prueba edicion actualizada',
    momentoDia: 'tarde_noche',
    lugarTexto: 'Casa editada',
    comidaTexto: 'palomitas',
    duracionMinutos: 90,
    notas: 'Quedada editada desde el script de comprobacion.',
    asistentesMembresiaIds: asistentesEditados,
    objetosPerdidosMembresiaIds: miembroConObjetoPerdido ? [miembroConObjetoPerdido.id] : [],
    fotos: [
      {
        url: 'https://example.com/la-racha-prueba-edicion.png',
        descripcion: 'Foto de prueba de edicion',
      },
    ],
  });

  const historial = await listarHistorialQuedadasGrupo(supabase, primerGrupo.grupo.id);
  const editada = historial.find((item) => item.quedada.id === quedadaId);

  if (!editada) {
    throw new Error('La quedada editada no aparece en el historial.');
  }

  console.log('');
  console.log('Quedada editada correctamente.');
  console.log(`ID quedada: ${quedadaId}`);
  console.log(`Titulo final: ${editada.quedada.titulo}`);
  console.log(`Momento final: ${editada.quedada.momentoDia ?? 'sin momento'}`);
  console.log(`Asistencias guardadas: ${editada.asistencias.length}`);
  console.log(`Fotos guardadas: ${editada.fotos.length}`);
  console.log(`Objetos perdidos guardados: ${editada.objetosPerdidos.length}`);
} finally {
  rl.close();
}
