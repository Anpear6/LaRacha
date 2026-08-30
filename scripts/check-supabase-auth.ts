import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  createLaRachaSupabaseClient,
  listarHistorialQuedadasGrupo,
  listarGruposUsuarioActual,
  listarMembresiasGrupo,
  listarOpcionesGrupo,
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

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
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

  console.log('Login correcto.');
  console.log(`Usuario: ${usuario.nombre} (${usuario.username ?? 'sin username'})`);
  console.log(`Grupos visibles: ${grupos.length}`);

  for (const { grupo, membresia } of grupos) {
    console.log(`- ${membresia.apodo} en ${grupo.nombre} [${membresia.rol}]`);
  }

  const primerGrupo = grupos[0]?.grupo;

  if (primerGrupo) {
    const [membresiasGrupo, opcionesGrupo, historial, estadoRacha] = await Promise.all([
      listarMembresiasGrupo(supabase, primerGrupo.id),
      listarOpcionesGrupo(supabase, primerGrupo.id),
      listarHistorialQuedadasGrupo(supabase, primerGrupo.id),
      obtenerEstadoRachaGrupo(supabase, primerGrupo.id),
    ]);

    console.log(`Miembros visibles en ${primerGrupo.nombre}: ${membresiasGrupo.length}`);
    console.log(`Opciones reutilizables visibles: ${opcionesGrupo.length}`);
    console.log(`Quedadas visibles: ${historial.length}`);
    console.log(`Racha visible: ${estadoRacha.estadoRacha.rachaVisible.valorActual}`);
    console.log(
      `Insignias desbloqueables ahora: ${estadoRacha.estadoRacha.insigniasDesbloqueables.length}`,
    );
  }
} finally {
  rl.close();
}
