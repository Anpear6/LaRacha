import { describe, expect, it } from 'vitest';
import {
  detectarPerdidaRacha,
  type Asistencia,
  type Quedada,
  type QuedadaConAsistencias,
  type RecuperacionRacha,
} from '../../src/domain';

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

function registro(id: string, fecha: string, grupoId = 'grupo-1'): QuedadaConAsistencias {
  return {
    quedada: quedada(id, fecha, grupoId),
    asistencias: asistenciasValidas(id),
  };
}

function recuperacionActiva(): RecuperacionRacha {
  return {
    id: 'recuperacion-1',
    grupoId: 'grupo-1',
    rachaPerdidaPeriodos: 2,
    periodosNecesarios: 2,
    periodosCompletados: 0,
    estado: 'pendiente',
    fechaInicio: '2026-08-31T00:00:00.000Z',
    fechaCreacion: '2026-08-31T00:00:00.000Z',
    fechaActualizacion: '2026-08-31T00:00:00.000Z',
  };
}

describe('deteccion de perdida de racha', () => {
  it('no rompe la racha antes de que termine el periodo actual', () => {
    const resultado = detectarPerdidaRacha({
      grupoId: 'grupo-1',
      frecuenciaRacha: 'semanal',
      fechaReferencia: new Date('2026-08-30T12:00:00.000Z'),
      quedadas: [registro('q1', '2026-08-20T10:00:00.000Z')],
    });

    expect(resultado.perdida).toBe(false);
  });

  it('detecta perdida si el ultimo periodo cerrado no se cumplio y antes habia racha', () => {
    const resultado = detectarPerdidaRacha({
      grupoId: 'grupo-1',
      frecuenciaRacha: 'semanal',
      fechaReferencia: new Date('2026-09-01T12:00:00.000Z'),
      quedadas: [
        registro('q1', '2026-08-20T10:00:00.000Z'),
        registro('q2', '2026-08-12T10:00:00.000Z'),
      ],
    });

    expect(resultado.perdida).toBe(true);
    expect(resultado.periodoRotoClave).toBe('2026-W35');
    expect(resultado.rachaPerdidaPeriodos).toBe(2);
  });

  it('no crea perdida si no habia racha previa', () => {
    const resultado = detectarPerdidaRacha({
      grupoId: 'grupo-1',
      frecuenciaRacha: 'semanal',
      fechaReferencia: new Date('2026-09-01T12:00:00.000Z'),
      quedadas: [],
    });

    expect(resultado.perdida).toBe(false);
  });

  it('no detecta una nueva perdida si ya hay una recuperacion activa', () => {
    const resultado = detectarPerdidaRacha({
      grupoId: 'grupo-1',
      frecuenciaRacha: 'semanal',
      fechaReferencia: new Date('2026-09-01T12:00:00.000Z'),
      quedadas: [registro('q1', '2026-08-20T10:00:00.000Z')],
      recuperacionActiva: recuperacionActiva(),
    });

    expect(resultado.perdida).toBe(false);
  });
});
