import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function leerEnvLocal(): Record<string, string> {
  const envPath = resolve(process.cwd(), '.env.local');

  if (!existsSync(envPath)) {
    throw new Error('No existe .env.local. Crea el archivo a partir de .env.example.');
  }

  const contenido = readFileSync(envPath, 'utf8');
  const variables: Record<string, string> = {};

  for (const linea of contenido.split(/\r?\n/)) {
    const limpia = linea.trim();

    if (!limpia || limpia.startsWith('#')) {
      continue;
    }

    const separador = limpia.indexOf('=');

    if (separador === -1) {
      continue;
    }

    const nombre = limpia.slice(0, separador).trim();
    const valor = limpia.slice(separador + 1).trim();
    variables[nombre] = valor;
  }

  return variables;
}

export function leerVariable(env: Record<string, string>, nombre: string): string {
  const valor = env[nombre];

  if (!valor) {
    throw new Error(`Falta ${nombre} en .env.local.`);
  }

  if (valor.includes('tu-proyecto') || valor.includes('tu_clave')) {
    throw new Error(`${nombre} todavia tiene el valor de ejemplo. Cambialo por el valor real de Supabase.`);
  }

  return valor;
}
