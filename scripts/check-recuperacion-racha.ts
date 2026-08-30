import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  activarRecuperacionRacha,
  createLaRachaSupabaseClient,
  crearGrupo,
  eliminarGrupo,
  fallarRecuperacionRacha,
  guardarRecuperacionPendiente,
  obtenerRecuperacionActivaGrupo,
  obtenerUsuarioActual,
  pausarRecuperacionRacha,
  reanudarRecuperacionRacha,
  registrarPeriodoRecuperacionCumplido,
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

  const sufijo = new Date().toISOString();
  const nombreGrupo = `Prueba recuperacion ${sufijo}`;

  console.log('');
  console.log(`Usuario: ${usuario.nombre} (${usuario.username ?? 'sin username'})`);
  console.log('Se va a crear un grupo temporal para validar recuperacion de racha.');
  console.log(`Grupo temporal: ${nombreGrupo}`);
  console.log('');

  const confirmacion = (await rl.question('Escribe SI para empezar la prueba: ')).trim();

  if (confirmacion !== 'SI') {
    console.log('Operacion cancelada. No se ha creado ningun grupo.');
    process.exit(0);
  }

  const creado = await crearGrupo(supabase, {
    nombre: nombreGrupo,
    descripcion: 'Grupo temporal para probar recuperacion de racha.',
    frecuenciaRacha: 'semanal',
    apodoAdmin: `${usuario.username ?? usuario.nombre} admin`,
  });

  console.log('');
  console.log(`Grupo temporal creado: ${creado.grupoId}`);

  const recuperacionId = await guardarRecuperacionPendiente(supabase, {
    grupoId: creado.grupoId,
    rachaPerdidaPeriodos: 2,
    fechaInicio: '2026-09-01',
  });

  console.log(`Recuperacion pendiente creada: ${recuperacionId}`);

  await activarRecuperacionRacha(supabase, {
    recuperacionId,
    fechaInicio: '2026-09-02',
  });

  console.log('Recuperacion activada por admin.');

  await registrarPeriodoRecuperacionCumplido(supabase, {
    recuperacionId,
    fechaFin: '2026-09-09',
  });

  console.log('Primer periodo de recuperacion marcado como cumplido.');

  await pausarRecuperacionRacha(supabase, recuperacionId);
  console.log('Recuperacion pausada.');

  await reanudarRecuperacionRacha(supabase, recuperacionId);
  console.log('Recuperacion reanudada.');

  const nuevoIntentoId = await fallarRecuperacionRacha(supabase, {
    recuperacionId,
    fechaFin: '2026-09-16',
  });

  console.log(`Recuperacion fallida. Nuevo intento pendiente: ${nuevoIntentoId}`);

  const recuperacionActiva = await obtenerRecuperacionActivaGrupo(supabase, creado.grupoId);

  console.log('');
  console.log(`Recuperacion activa final: ${recuperacionActiva?.id ?? 'ninguna'}`);
  console.log(`Estado final: ${recuperacionActiva?.estado ?? 'sin estado'}`);
  console.log(`Periodos completados final: ${recuperacionActiva?.periodosCompletados ?? 0}`);

  await eliminarGrupo(supabase, creado.grupoId);

  console.log('');
  console.log('Grupo temporal eliminado correctamente.');
  console.log('Prueba de recuperacion completada.');
} finally {
  rl.close();
}
