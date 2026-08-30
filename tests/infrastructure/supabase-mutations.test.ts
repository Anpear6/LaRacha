import { describe, expect, it } from 'vitest';
import { desbloquearInsigniasRacha, registrarQuedadaCompleta } from '../../src/infrastructure';
import type { LaRachaSupabaseClient } from '../../src/infrastructure';

describe('mutaciones de Supabase', () => {
  it('llama al RPC de registrar quedada completa con los datos normalizados', async () => {
    const llamadas: unknown[] = [];
    const supabase = {
      rpc(nombre: string, args: unknown) {
        llamadas.push({ nombre, args });
        return Promise.resolve({ data: 'quedada-1', error: null });
      },
    } as unknown as LaRachaSupabaseClient;

    const quedadaId = await registrarQuedadaCompleta(supabase, {
      grupoId: 'grupo-1',
      titulo: 'Plan de prueba',
      creadaPorMembresiaId: 'membresia-1',
      tipoPlanTexto: 'Picnic',
      momentoDia: 'tarde',
      lugarTexto: 'Parque',
      comidaTexto: 'Bocatas',
      duracionMinutos: 90,
      asistentesMembresiaIds: ['membresia-1', 'membresia-2'],
      objetosPerdidosMembresiaIds: ['membresia-2'],
      fotos: [{ url: 'https://example.com/foto.png', descripcion: 'Foto del plan' }],
    });

    expect(quedadaId).toBe('quedada-1');
    expect(llamadas).toEqual([
      {
        nombre: 'registrar_quedada_completa_mvp',
        args: {
          p_grupo_id: 'grupo-1',
          p_titulo: 'Plan de prueba',
          p_creada_por_membresia_id: 'membresia-1',
          p_conductor_membresia_id: null,
          p_tipo_plan_texto: 'Picnic',
          p_momento_dia: 'tarde',
          p_lugar_texto: 'Parque',
          p_comida_texto: 'Bocatas',
          p_duracion_minutos: 90,
          p_notas: null,
          p_asistentes_membresia_ids: ['membresia-1', 'membresia-2'],
          p_objetos_perdidos_membresia_ids: ['membresia-2'],
          p_fotos: [{ url: 'https://example.com/foto.png', descripcion: 'Foto del plan' }],
        },
      },
    ]);
  });

  it('llama al RPC de desbloquear insignias de racha con datos normalizados', async () => {
    const llamadas: unknown[] = [];
    const supabase = {
      rpc(nombre: string, args: unknown) {
        llamadas.push({ nombre, args });
        return Promise.resolve({ data: ['desbloqueo-1'], error: null });
      },
    } as unknown as LaRachaSupabaseClient;

    const ids = await desbloquearInsigniasRacha(supabase, 'grupo-1', [
      {
        insigniaId: 'insignia-1',
        grupoId: 'grupo-1',
        membresiaId: 'membresia-1',
        fechaDesbloqueo: '2026-08-30T12:00:00.000Z',
      },
      {
        insigniaId: 'insignia-2',
        grupoId: 'grupo-1',
        fechaDesbloqueo: '2026-08-30T12:00:00.000Z',
      },
    ]);

    expect(ids).toEqual(['desbloqueo-1']);
    expect(llamadas).toEqual([
      {
        nombre: 'desbloquear_insignias_racha_mvp',
        args: {
          p_grupo_id: 'grupo-1',
          p_desbloqueos: [
            {
              insignia_id: 'insignia-1',
              membresia_id: 'membresia-1',
              fecha_desbloqueo: '2026-08-30T12:00:00.000Z',
            },
            {
              insignia_id: 'insignia-2',
              fecha_desbloqueo: '2026-08-30T12:00:00.000Z',
            },
          ],
        },
      },
    ]);
  });
});
