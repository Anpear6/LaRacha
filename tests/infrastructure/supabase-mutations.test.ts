import { describe, expect, it } from 'vitest';
import {
  actualizarGrupo,
  actualizarMembresiaPropia,
  actualizarMiembroSinCuenta,
  crearGrupo,
  crearMiembroSinCuenta,
  desbloquearInsigniasRacha,
  editarQuedadaCompleta,
  eliminarGrupo,
  eliminarMembresia,
  registrarQuedadaCompleta,
} from '../../src/infrastructure';
import type { LaRachaSupabaseClient } from '../../src/infrastructure';

describe('mutaciones de Supabase', () => {
  it('llama al RPC de crear grupo con membresia admin inicial', async () => {
    const llamadas: unknown[] = [];
    const supabase = {
      rpc(nombre: string, args: unknown) {
        llamadas.push({ nombre, args });
        return Promise.resolve({
          data: [{ grupo_id: 'grupo-1', membresia_id: 'membresia-admin' }],
          error: null,
        });
      },
    } as unknown as LaRachaSupabaseClient;

    const creado = await crearGrupo(supabase, {
      nombre: 'Hermanitos',
      descripcion: 'Grupo de prueba',
      frecuenciaRacha: 'semanal',
      apodoAdmin: 'Angela',
    });

    expect(creado).toEqual({ grupoId: 'grupo-1', membresiaId: 'membresia-admin' });
    expect(llamadas).toEqual([
      {
        nombre: 'crear_grupo_mvp',
        args: {
          p_nombre: 'Hermanitos',
          p_descripcion: 'Grupo de prueba',
          p_foto_perfil_url: null,
          p_frecuencia_racha: 'semanal',
          p_apodo_admin: 'Angela',
          p_avatar_admin_url: null,
        },
      },
    ]);
  });

  it('llama al RPC de actualizar grupo sin enviar frecuencia de racha', async () => {
    const llamadas: unknown[] = [];
    const supabase = {
      rpc(nombre: string, args: unknown) {
        llamadas.push({ nombre, args });
        return Promise.resolve({ data: undefined, error: null });
      },
    } as unknown as LaRachaSupabaseClient;

    await actualizarGrupo(supabase, {
      grupoId: 'grupo-1',
      nombre: 'Hermanitos editado',
      treguaVeranoActiva: true,
    });

    expect(llamadas).toEqual([
      {
        nombre: 'actualizar_grupo_mvp',
        args: {
          p_grupo_id: 'grupo-1',
          p_nombre: 'Hermanitos editado',
          p_descripcion: null,
          p_foto_perfil_url: null,
          p_tregua_verano_activa: true,
        },
      },
    ]);
  });

  it('llama al RPC de eliminar grupo', async () => {
    const llamadas: unknown[] = [];
    const supabase = {
      rpc(nombre: string, args: unknown) {
        llamadas.push({ nombre, args });
        return Promise.resolve({ data: undefined, error: null });
      },
    } as unknown as LaRachaSupabaseClient;

    await eliminarGrupo(supabase, 'grupo-1');

    expect(llamadas).toEqual([
      {
        nombre: 'eliminar_grupo_mvp',
        args: { p_grupo_id: 'grupo-1' },
      },
    ]);
  });

  it('llama al RPC de crear miembro sin cuenta', async () => {
    const llamadas: unknown[] = [];
    const supabase = {
      rpc(nombre: string, args: unknown) {
        llamadas.push({ nombre, args });
        return Promise.resolve({ data: 'membresia-1', error: null });
      },
    } as unknown as LaRachaSupabaseClient;

    const membresiaId = await crearMiembroSinCuenta(supabase, {
      grupoId: 'grupo-1',
      apodo: 'Beita',
    });

    expect(membresiaId).toBe('membresia-1');
    expect(llamadas).toEqual([
      {
        nombre: 'crear_miembro_sin_cuenta_mvp',
        args: {
          p_grupo_id: 'grupo-1',
          p_apodo: 'Beita',
          p_avatar_grupo_url: null,
        },
      },
    ]);
  });

  it('llama al RPC de actualizar membresia propia', async () => {
    const llamadas: unknown[] = [];
    const supabase = {
      rpc(nombre: string, args: unknown) {
        llamadas.push({ nombre, args });
        return Promise.resolve({ data: undefined, error: null });
      },
    } as unknown as LaRachaSupabaseClient;

    await actualizarMembresiaPropia(supabase, {
      membresiaId: 'membresia-1',
      apodo: 'Anpear',
      avatarGrupoUrl: '/avatar.png',
    });

    expect(llamadas).toEqual([
      {
        nombre: 'actualizar_membresia_propia_mvp',
        args: {
          p_membresia_id: 'membresia-1',
          p_apodo: 'Anpear',
          p_avatar_grupo_url: '/avatar.png',
        },
      },
    ]);
  });

  it('llama al RPC de actualizar miembro sin cuenta', async () => {
    const llamadas: unknown[] = [];
    const supabase = {
      rpc(nombre: string, args: unknown) {
        llamadas.push({ nombre, args });
        return Promise.resolve({ data: undefined, error: null });
      },
    } as unknown as LaRachaSupabaseClient;

    await actualizarMiembroSinCuenta(supabase, {
      membresiaId: 'membresia-1',
      apodo: 'Beita editada',
    });

    expect(llamadas).toEqual([
      {
        nombre: 'actualizar_miembro_sin_cuenta_mvp',
        args: {
          p_membresia_id: 'membresia-1',
          p_apodo: 'Beita editada',
          p_avatar_grupo_url: null,
        },
      },
    ]);
  });

  it('llama al RPC de eliminar membresia', async () => {
    const llamadas: unknown[] = [];
    const supabase = {
      rpc(nombre: string, args: unknown) {
        llamadas.push({ nombre, args });
        return Promise.resolve({ data: undefined, error: null });
      },
    } as unknown as LaRachaSupabaseClient;

    await eliminarMembresia(supabase, 'membresia-1');

    expect(llamadas).toEqual([
      {
        nombre: 'eliminar_membresia_mvp',
        args: { p_membresia_id: 'membresia-1' },
      },
    ]);
  });

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

  it('llama al RPC de editar quedada completa con los datos normalizados', async () => {
    const llamadas: unknown[] = [];
    const supabase = {
      rpc(nombre: string, args: unknown) {
        llamadas.push({ nombre, args });
        return Promise.resolve({ data: undefined, error: null });
      },
    } as unknown as LaRachaSupabaseClient;

    await editarQuedadaCompleta(supabase, {
      quedadaId: 'quedada-1',
      titulo: 'Plan editado',
      fecha: '2026-08-30T14:00:00.000Z',
      conductorMembresiaId: 'membresia-1',
      tipoPlanTexto: 'Cine',
      momentoDia: 'tarde_noche',
      lugarTexto: 'Centro',
      comidaTexto: 'Palomitas',
      duracionMinutos: 120,
      notas: 'Nota editada',
      asistentesMembresiaIds: ['membresia-1'],
      objetosPerdidosMembresiaIds: ['membresia-2'],
      fotos: [
        { url: 'https://example.com/foto-1.png', descripcion: 'Primera foto' },
        { url: 'https://example.com/foto-2.png' },
      ],
    });

    expect(llamadas).toEqual([
      {
        nombre: 'editar_quedada_completa_mvp',
        args: {
          p_quedada_id: 'quedada-1',
          p_titulo: 'Plan editado',
          p_fecha: '2026-08-30T14:00:00.000Z',
          p_conductor_membresia_id: 'membresia-1',
          p_tipo_plan_texto: 'Cine',
          p_momento_dia: 'tarde_noche',
          p_lugar_texto: 'Centro',
          p_comida_texto: 'Palomitas',
          p_duracion_minutos: 120,
          p_notas: 'Nota editada',
          p_asistentes_membresia_ids: ['membresia-1'],
          p_objetos_perdidos_membresia_ids: ['membresia-2'],
          p_fotos: [
            { url: 'https://example.com/foto-1.png', descripcion: 'Primera foto' },
            { url: 'https://example.com/foto-2.png' },
          ],
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
