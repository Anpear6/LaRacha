import { describe, expect, it } from 'vitest';
import { calcularRachaActual, type Asistencia, type Quedada, type QuedadaConAsistencias } from '../../src/domain';

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

describe('calculo de racha actual', () => {
  it('cuenta semanas consecutivas cumplidas desde la semana actual hacia atras', () => {
    const resultado = calcularRachaActual({
      grupoId: 'grupo-1',
      frecuenciaRacha: 'semanal',
      fechaReferencia: new Date('2026-08-30T12:00:00.000Z'),
      quedadas: [
        registro('q1', '2026-08-29T10:00:00.000Z'),
        registro('q2', '2026-08-20T10:00:00.000Z'),
        registro('q3', '2026-08-12T10:00:00.000Z'),
      ],
    });

    expect(resultado.valorActual).toBe(3);
    expect(resultado.periodosCumplidos).toEqual(['2026-W35', '2026-W34', '2026-W33']);
  });

  it('se corta cuando falta un periodo intermedio', () => {
    const resultado = calcularRachaActual({
      grupoId: 'grupo-1',
      frecuenciaRacha: 'semanal',
      fechaReferencia: new Date('2026-08-30T12:00:00.000Z'),
      quedadas: [
        registro('q1', '2026-08-29T10:00:00.000Z'),
        registro('q3', '2026-08-12T10:00:00.000Z'),
      ],
    });

    expect(resultado.valorActual).toBe(1);
    expect(resultado.periodosCumplidos).toEqual(['2026-W35']);
  });

  it('no cuenta quedadas con menos de 3 asistentes', () => {
    const resultado = calcularRachaActual({
      grupoId: 'grupo-1',
      frecuenciaRacha: 'semanal',
      fechaReferencia: new Date('2026-08-30T12:00:00.000Z'),
      quedadas: [
        {
          quedada: quedada('q1', '2026-08-29T10:00:00.000Z'),
          asistencias: [
            { id: 'a1', quedadaId: 'q1', membresiaId: 'm1', estado: 'asistio' },
            { id: 'a2', quedadaId: 'q1', membresiaId: 'm2', estado: 'asistio' },
          ],
        },
      ],
    });

    expect(resultado.valorActual).toBe(0);
  });

  it('exige dos quedadas validas para frecuencia dos veces por semana', () => {
    const resultado = calcularRachaActual({
      grupoId: 'grupo-1',
      frecuenciaRacha: 'dos_veces_semana',
      fechaReferencia: new Date('2026-08-30T12:00:00.000Z'),
      quedadas: [
        registro('q1', '2026-08-25T10:00:00.000Z'),
        registro('q2', '2026-08-29T10:00:00.000Z'),
      ],
    });

    expect(resultado.valorActual).toBe(1);
  });

  it('ignora quedadas de otros grupos', () => {
    const resultado = calcularRachaActual({
      grupoId: 'grupo-1',
      frecuenciaRacha: 'semanal',
      fechaReferencia: new Date('2026-08-30T12:00:00.000Z'),
      quedadas: [registro('q1', '2026-08-29T10:00:00.000Z', 'grupo-2')],
    });

    expect(resultado.valorActual).toBe(0);
  });
});
