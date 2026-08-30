import { describe, expect, it } from 'vitest';
import { contarAsistentes, quedadaCuentaParaRacha, type Asistencia } from '../../src/domain';

function asistencia(id: string, estado: Asistencia['estado']): Asistencia {
  return {
    id,
    quedadaId: 'quedada-1',
    membresiaId: `membresia-${id}`,
    estado,
  };
}

describe('reglas de racha', () => {
  it('cuenta asistentes marcados como asistio', () => {
    const asistencias = [
      asistencia('1', 'asistio'),
      asistencia('2', 'no_asistio'),
      asistencia('3', 'asistio'),
    ];

    expect(contarAsistentes(asistencias)).toBe(2);
  });

  it('una quedada cuenta para racha si tiene al menos 3 asistentes', () => {
    const asistencias = [
      asistencia('1', 'asistio'),
      asistencia('2', 'asistio'),
      asistencia('3', 'asistio'),
    ];

    expect(quedadaCuentaParaRacha(asistencias)).toBe(true);
  });

  it('una quedada no cuenta para racha si tiene menos de 3 asistentes', () => {
    const asistencias = [
      asistencia('1', 'asistio'),
      asistencia('2', 'asistio'),
      asistencia('3', 'no_asistio'),
    ];

    expect(quedadaCuentaParaRacha(asistencias)).toBe(false);
  });
});
