import { describe, expect, it } from 'vitest';
import {
  resolverEstadoRachaGrupo,
  type Asistencia,
  type Grupo,
  type Insignia,
  type Quedada,
  type QuedadaConAsistencias,
  type RecuperacionRacha,
} from '../../src/domain';

function grupo(overrides: Partial<Grupo> = {}): Grupo {
  return {
    id: 'grupo-1',
    nombre: 'Hermanitos',
    privacidad: 'privado',
    frecuenciaRacha: 'semanal',
    treguaVeranoActiva: false,
    fechaCreacion: '2026-08-30T00:00:00.000Z',
    fechaActualizacion: '2026-08-30T00:00:00.000Z',
    ...overrides,
  };
}

function quedada(id: string, fecha: string, grupoId = 'grupo-1'): Quedada {
  return {
    id,
    grupoId,
    titulo: `Quedada ${id}`,
    fecha,
    creadaPorMembresiaId: 'membresia-1',
    fechaCreacion: fecha,
    fechaActualizacion: fecha,
  };
}

function asistenciasValidas(quedadaId: string): Asistencia[] {
  return [
    { id: `${quedadaId}-a1`, quedadaId, membresiaId: 'm1', estado: 'asistio' },
    { id: `${quedadaId}-a2`, quedadaId, membresiaId: 'm2', estado: 'asistio' },
    { id: `${quedadaId}-a3`, quedadaId, membresiaId: 'm3', estado: 'asistio' },
  ];
}

function registro(id: string, fecha: string): QuedadaConAsistencias {
  return {
    quedada: quedada(id, fecha),
    asistencias: asistenciasValidas(id),
  };
}

function insignia(id: string, criterio: string): Insignia {
  return {
    id,
    nombre: criterio,
    criterio,
    tipo: 'racha_grupo',
    imagenUrl: '/insignia.png',
    fechaCreacion: '2026-08-30T00:00:00.000Z',
  };
}

function recuperacionPendiente(): RecuperacionRacha {
  return {
    id: 'recuperacion-1',
    grupoId: 'grupo-1',
    rachaPerdidaPeriodos: 2,
    periodosNecesarios: 2,
    periodosCompletados: 0,
    estado: 'pendiente',
    fechaInicio: '2026-09-01T00:00:00.000Z',
    fechaCreacion: '2026-09-01T00:00:00.000Z',
    fechaActualizacion: '2026-09-01T00:00:00.000Z',
  };
}

describe('estado de racha de grupo', () => {
  it('devuelve insignias desbloqueables si la racha sigue viva', () => {
    const resultado = resolverEstadoRachaGrupo({
      grupo: grupo(),
      fechaReferencia: new Date('2026-08-30T12:00:00.000Z'),
      quedadas: [
        registro('q1', '2026-08-29T10:00:00.000Z'),
        registro('q2', '2026-08-20T10:00:00.000Z'),
      ],
      catalogoInsignias: [insignia('i-1-semana', '1_semana'), insignia('i-2-semanas', '2_semanas')],
      insigniasDesbloqueadas: [],
    });

    expect(resultado.perdida.perdida).toBe(false);
    expect(resultado.insigniasDesbloqueables.map((item) => item.insigniaId)).toEqual([
      'i-1-semana',
      'i-2-semanas',
    ]);
  });

  it('crea una recuperacion pendiente y congela la racha visible cuando detecta perdida', () => {
    const resultado = resolverEstadoRachaGrupo({
      grupo: grupo(),
      fechaReferencia: new Date('2026-09-01T12:00:00.000Z'),
      quedadas: [
        registro('q1', '2026-08-20T10:00:00.000Z'),
        registro('q2', '2026-08-12T10:00:00.000Z'),
      ],
      catalogoInsignias: [insignia('i-1-mes', '1_mes')],
      insigniasDesbloqueadas: [],
    });

    expect(resultado.perdida.perdida).toBe(true);
    expect(resultado.rachaVisible.valorActual).toBe(2);
    expect(resultado.nuevaRecuperacionPendiente?.estado).toBe('pendiente');
    expect(resultado.insigniasDesbloqueables).toEqual([]);
  });

  it('no desbloquea insignias mientras hay una recuperacion activa', () => {
    const resultado = resolverEstadoRachaGrupo({
      grupo: grupo(),
      fechaReferencia: new Date('2026-08-30T12:00:00.000Z'),
      quedadas: [registro('q1', '2026-08-29T10:00:00.000Z')],
      catalogoInsignias: [insignia('i-1-semana', '1_semana')],
      insigniasDesbloqueadas: [],
      recuperacionActiva: recuperacionPendiente(),
    });

    expect(resultado.perdida.perdida).toBe(false);
    expect(resultado.rachaVisible.valorActual).toBe(2);
    expect(resultado.insigniasDesbloqueables).toEqual([]);
  });
});
