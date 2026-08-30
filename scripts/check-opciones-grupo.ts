import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  createLaRachaSupabaseClient,
  crearGrupo,
  crearOpcionGrupo,
  eliminarGrupo,
  listarOpcionesGrupo,
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

  const nombreGrupo = `Prueba opciones ${new Date().toISOString()}`;

  console.log('');
  console.log(`Usuario: ${usuario.nombre} (${usuario.username ?? 'sin username'})`);
  console.log('Se va a crear un grupo temporal para validar opciones reutilizables.');
  console.log(`Grupo temporal: ${nombreGrupo}`);
  console.log('');

  const confirmacion = (await rl.question('Escribe SI para empezar la prueba: ')).trim();

  if (confirmacion !== 'SI') {
    console.log('Operacion cancelada. No se ha creado ningun grupo.');
    process.exit(0);
  }

  const creado = await crearGrupo(supabase, {
    nombre: nombreGrupo,
    descripcion: 'Grupo temporal para probar opciones reutilizables.',
    frecuenciaRacha: 'semanal',
    apodoAdmin: `${usuario.username ?? usuario.nombre} admin`,
  });

  const comidaId = await crearOpcionGrupo(supabase, {
    grupoId: creado.grupoId,
    tipo: 'comida',
    valor: 'pizza',
  });
  const comidaRepetidaId = await crearOpcionGrupo(supabase, {
    grupoId: creado.grupoId,
    tipo: 'comida',
    valor: 'Pizza',
  });
  await crearOpcionGrupo(supabase, {
    grupoId: creado.grupoId,
    tipo: 'lugar',
    valor: 'Casa',
  });
  await crearOpcionGrupo(supabase, {
    grupoId: creado.grupoId,
    tipo: 'tipo_plan',
    valor: 'Peli',
  });

  const opciones = await listarOpcionesGrupo(supabase, creado.grupoId);

  console.log('');
  console.log(`Opciones visibles: ${opciones.length}`);
  console.log(`ID comida inicial: ${comidaId}`);
  console.log(`ID comida repetida: ${comidaRepetidaId}`);
  console.log(`La opcion repetida reutiliza ID: ${comidaId === comidaRepetidaId ? 'si' : 'no'}`);

  await eliminarGrupo(supabase, creado.grupoId);

  console.log('');
  console.log('Grupo temporal eliminado correctamente.');
  console.log('Prueba de opciones reutilizables completada.');
} finally {
  rl.close();
}
