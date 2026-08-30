import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { createLaRachaSupabaseClient } from '../src/infrastructure';
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

  const userId = authData.user.id;

  const { data: usuario, error: usuarioError } = await supabase
    .from('usuarios')
    .select('id, nombre, username, email')
    .eq('id', userId)
    .single();

  if (usuarioError) {
    throw new Error(`No se pudo leer el usuario autenticado: ${usuarioError.message}`);
  }

  const { data: membresias, error: membresiasError } = await supabase
    .from('membresias')
    .select('id, apodo, rol, estado, grupos(id, nombre)')
    .eq('usuario_id', userId)
    .order('fecha_entrada');

  if (membresiasError) {
    throw new Error(`No se pudieron leer membresias: ${membresiasError.message}`);
  }

  console.log('Login correcto.');
  console.log(`Usuario: ${usuario.nombre} (${usuario.username ?? 'sin username'})`);
  console.log(`Membresias visibles: ${membresias.length}`);

  for (const membresia of membresias) {
    const grupo = Array.isArray(membresia.grupos) ? membresia.grupos[0] : membresia.grupos;
    console.log(`- ${membresia.apodo} en ${grupo?.nombre ?? 'grupo desconocido'} [${membresia.rol}]`);
  }
} finally {
  rl.close();
}
