import { describe, expect, it } from 'vitest';
import { mapGrupo, mapMembresia, mapQuedada, mapRecuperacionRacha } from '../../src/infrastructure';

describe('mapeadores de Supabase', () => {
  it('convierte un grupo de snake_case a camelCase', () => {
    const grupo = mapGrupo({
      id: 'grupo-1',
      nombre: 'Hermanitos',
      descripcion: 'Pruebas',
      foto_perfil_url: null,
      privacidad: 'privado',
      frecuencia_racha: 'semanal',
      tregua_verano_activa: false,
      fecha_creacion: '2026-08-30T00:00:00.000Z',
      fecha_actualizacion: '2026-08-30T00:00:00.000Z',
    });

    expect(grupo).toEqual({
      id: 'grupo-1',
      nombre: 'Hermanitos',
      descripcion: 'Pruebas',
      privacidad: 'privado',
      frecuenciaRacha: 'semanal',
      treguaVeranoActiva: false,
      fechaCreacion: '2026-08-30T00:00:00.000Z',
      fechaActualizacion: '2026-08-30T00:00:00.000Z',
    });
  });

  it('omite propiedades opcionales cuando la base de datos devuelve null', () => {
    const membresia = mapMembresia({
      id: 'membresia-1',
      usuario_id: null,
      grupo_id: 'grupo-1',
      rol: 'miembro',
      apodo: 'Beita',
      avatar_grupo_url: null,
      estado: 'activa',
      fecha_entrada: '2026-08-30T00:00:00.000Z',
      fecha_actualizacion: '2026-08-30T00:00:00.000Z',
    });

    expect('usuarioId' in membresia).toBe(false);
    expect('avatarGrupoUrl' in membresia).toBe(false);
  });

  it('mapea los detalles opcionales de una quedada solo cuando existen', () => {
    const quedada = mapQuedada({
      id: 'quedada-1',
      grupo_id: 'grupo-1',
      titulo: 'Primera quedada',
      fecha: '2026-08-30T00:00:00.000Z',
      conductor_membresia_id: 'membresia-1',
      creada_por_membresia_id: 'membresia-1',
      tipo_plan_opcion_id: null,
      tipo_plan_texto: 'Banda de Musica',
      momento_dia: 'manana',
      lugar_opcion_id: null,
      lugar_texto: 'Casa',
      comida_opcion_id: null,
      comida_texto: 'nada',
      duracion_minutos: 60,
      notas: null,
      fecha_creacion: '2026-08-30T00:00:00.000Z',
      fecha_actualizacion: '2026-08-30T00:00:00.000Z',
    });

    expect(quedada.conductorMembresiaId).toBe('membresia-1');
    expect(quedada.tipoPlanTexto).toBe('Banda de Musica');
    expect(quedada.duracionMinutos).toBe(60);
    expect('notas' in quedada).toBe(false);
  });

  it('mapea una recuperacion pendiente sin fecha fin', () => {
    const recuperacion = mapRecuperacionRacha({
      id: 'recuperacion-1',
      grupo_id: 'grupo-1',
      racha_perdida_periodos: 2,
      periodos_necesarios: 2,
      periodos_completados: 0,
      estado: 'pendiente',
      fecha_inicio: '2026-08-30',
      fecha_fin: null,
      fecha_creacion: '2026-08-30T00:00:00.000Z',
      fecha_actualizacion: '2026-08-30T00:00:00.000Z',
    });

    expect(recuperacion.estado).toBe('pendiente');
    expect('fechaFin' in recuperacion).toBe(false);
  });
});
