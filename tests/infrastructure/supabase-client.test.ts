import { describe, expect, it } from 'vitest';
import { getSupabaseConfigFromEnv } from '../../src/infrastructure';

describe('configuracion de Supabase', () => {
  it('lee la URL y la clave anon publica desde variables de entorno', () => {
    const config = getSupabaseConfigFromEnv({
      NEXT_PUBLIC_SUPABASE_URL: 'https://proyecto.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'clave-publica-suficientemente-larga',
    });

    expect(config).toEqual({
      url: 'https://proyecto.supabase.co',
      anonKey: 'clave-publica-suficientemente-larga',
    });
  });

  it('falla con un mensaje claro si falta una variable de entorno', () => {
    expect(() => getSupabaseConfigFromEnv({})).toThrow(
      'Falta la variable de entorno NEXT_PUBLIC_SUPABASE_URL.',
    );
  });
});
