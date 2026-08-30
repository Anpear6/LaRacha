import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  actualizarGrupo,
  actualizarMiembroSinCuenta,
  actualizarMembresiaPropia,
  createLaRachaSupabaseClient,
  crearGrupo,
  crearMiembroSinCuenta,
  eliminarGrupo,
  eliminarMembresia,
  listarGruposUsuarioActual,
  listarMembresiasGrupo,
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

  const sufijo = new Date().toISOString();
  const nombreGrupo = `Prueba gestion ${sufijo}`;

  console.log('');
  console.log(`Usuario: ${usuario.nombre} (${usuario.username ?? 'sin username'})`);
  console.log('Se va a crear un grupo temporal para validar gestion de grupos y membresias.');
  console.log(`Grupo temporal: ${nombreGrupo}`);
  console.log('');

  const confirmacion = (await rl.question('Escribe SI para crear el grupo temporal: ')).trim();

  if (confirmacion !== 'SI') {
    console.log('Operacion cancelada. No se ha creado ningun grupo.');
    process.exit(0);
  }

  const creado = await crearGrupo(supabase, {
    nombre: nombreGrupo,
    descripcion: 'Grupo temporal creado desde script de comprobacion.',
    frecuenciaRacha: 'semanal',
    apodoAdmin: `${usuario.username ?? usuario.nombre} admin`,
  });

  console.log('');
  console.log('Grupo creado correctamente.');
  console.log(`ID grupo: ${creado.grupoId}`);
  console.log(`ID membresia admin: ${creado.membresiaId}`);

  await actualizarGrupo(supabase, {
    grupoId: creado.grupoId,
    nombre: `${nombreGrupo} editado`,
    descripcion: 'Grupo temporal editado desde script.',
    treguaVeranoActiva: false,
  });

  console.log('Grupo editado correctamente.');

  await actualizarMembresiaPropia(supabase, {
    membresiaId: creado.membresiaId,
    apodo: `${usuario.username ?? usuario.nombre} perfil editado`,
  });

  console.log('Membresia propia editada correctamente.');

  const miembroSinCuentaId = await crearMiembroSinCuenta(supabase, {
    grupoId: creado.grupoId,
    apodo: 'Miembro temporal',
  });

  console.log(`Miembro sin cuenta creado: ${miembroSinCuentaId}`);

  await actualizarMiembroSinCuenta(supabase, {
    membresiaId: miembroSinCuentaId,
    apodo: 'Miembro temporal editado',
  });

  console.log('Miembro sin cuenta editado correctamente.');

  await eliminarMembresia(supabase, miembroSinCuentaId);

  console.log('Miembro sin cuenta eliminado logicamente correctamente.');

  const [gruposVisibles, membresiasDelGrupo] = await Promise.all([
    listarGruposUsuarioActual(supabase),
    listarMembresiasGrupo(supabase, creado.grupoId),
  ]);

  console.log('');
  console.log(`Grupos visibles ahora: ${gruposVisibles.length}`);
  console.log(`Membresias activas del grupo temporal: ${membresiasDelGrupo.length}`);
  console.log('');

  const borrar = (await rl.question('Escribe BORRAR para eliminar el grupo temporal: ')).trim();

  if (borrar === 'BORRAR') {
    await eliminarGrupo(supabase, creado.grupoId);
    console.log('Grupo temporal eliminado correctamente.');
  } else {
    console.log('Grupo temporal conservado. Puedes borrarlo mas adelante desde Supabase.');
  }
} finally {
  rl.close();
}
