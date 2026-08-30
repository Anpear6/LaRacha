import { createLaRachaSupabaseClient } from '../src/infrastructure';
import { leerEnvLocal, leerVariable } from './env';

const env = leerEnvLocal();
const supabase = createLaRachaSupabaseClient({
  url: leerVariable(env, 'NEXT_PUBLIC_SUPABASE_URL'),
  anonKey: leerVariable(env, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
});

const { data: usuarios, error: usuariosError } = await supabase
  .from('usuarios')
  .select('id, nombre, username')
  .order('nombre');

if (usuariosError) {
  throw new Error(`No se pudieron leer usuarios: ${usuariosError.message}`);
}

const { data: grupos, error: gruposError } = await supabase
  .from('grupos')
  .select('id, nombre')
  .order('nombre');

if (gruposError) {
  throw new Error(`No se pudieron leer grupos: ${gruposError.message}`);
}

console.log('Conexion con Supabase correcta.');
console.log(`Usuarios visibles: ${usuarios.length}`);
console.log(`Grupos visibles: ${grupos.length}`);

for (const usuario of usuarios) {
  console.log(`- Usuario: ${usuario.nombre} (${usuario.username ?? 'sin username'})`);
}

for (const grupo of grupos) {
  console.log(`- Grupo: ${grupo.nombre}`);
}
