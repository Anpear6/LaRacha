import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export type LaRachaSupabaseClient = SupabaseClient<Database>;

export function createLaRachaSupabaseClient(config: SupabaseConfig): LaRachaSupabaseClient {
  validarSupabaseConfig(config);

  return createClient<Database>(config.url, config.anonKey);
}

export function getSupabaseConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): SupabaseConfig {
  return {
    url: leerVariableEntorno(env, 'NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: leerVariableEntorno(env, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  };
}

function validarSupabaseConfig(config: SupabaseConfig): void {
  if (!config.url.startsWith('https://')) {
    throw new Error('La URL de Supabase debe empezar por https://.');
  }

  if (config.anonKey.length < 20) {
    throw new Error('La clave anon publica de Supabase parece incompleta.');
  }
}

function leerVariableEntorno(env: NodeJS.ProcessEnv, nombre: string): string {
  const valor = env[nombre];

  if (!valor) {
    throw new Error(`Falta la variable de entorno ${nombre}.`);
  }

  return valor;
}
