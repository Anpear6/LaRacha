import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  createLaRachaSupabaseClient,
  desbloquearInsigniasRacha,
  listarGruposUsuarioActual,
  listarInsigniasDesbloqueadasGrupo,
  obtenerEstadoRachaGrupo,
  obtenerUsuarioActual,
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
  const primerGrupo = grupos[0]?.grupo;

  if (!primerGrupo) {
    throw new Error('El usuario autenticado no tiene grupos visibles.');
  }

  const estadoAntes = await obtenerEstadoRachaGrupo(supabase, primerGrupo.id);
  const insigniasGuardadasAntes = await listarInsigniasDesbloqueadasGrupo(supabase, primerGrupo.id);
  const desbloqueables = estadoAntes.estadoRacha.insigniasDesbloqueables;

  console.log('');
  console.log(`Usuario: ${usuario.nombre} (${usuario.username ?? 'sin username'})`);
  console.log(`Grupo: ${primerGrupo.nombre}`);
  console.log(`Racha visible: ${estadoAntes.estadoRacha.rachaVisible.valorActual}`);
  console.log(`Insignias ya guardadas: ${insigniasGuardadasAntes.length}`);
  console.log(`Insignias desbloqueables ahora: ${desbloqueables.length}`);

  if (desbloqueables.length === 0) {
    console.log('No hay insignias nuevas que guardar.');
    process.exit(0);
  }

  console.log('');
  console.log('Se van a guardar estos desbloqueos:');

  for (const desbloqueo of desbloqueables) {
    console.log(`- Insignia ${desbloqueo.insigniaId} para grupo ${desbloqueo.grupoId}`);
  }

  console.log('');
  const confirmacion = (await rl.question('Escribe SI para guardar estas insignias: ')).trim();

  if (confirmacion !== 'SI') {
    console.log('Operacion cancelada. No se ha guardado ninguna insignia.');
    process.exit(0);
  }

  const idsInsertados = await desbloquearInsigniasRacha(supabase, primerGrupo.id, desbloqueables);
  const insigniasGuardadas = await listarInsigniasDesbloqueadasGrupo(supabase, primerGrupo.id);

  console.log('');
  console.log('Operacion completada.');
  console.log(`Nuevas insignias guardadas: ${idsInsertados.length}`);
  console.log(`Insignias guardadas en el grupo ahora: ${insigniasGuardadas.length}`);
} finally {
  rl.close();
}
