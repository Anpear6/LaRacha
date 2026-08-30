import { describe, expect, it } from 'vitest';
import { obtenerPeriodoAnterior, obtenerPeriodoRacha } from '../../src/domain';

describe('periodos de racha', () => {
  it('calcula el periodo semanal de lunes a lunes', () => {
    const periodo = obtenerPeriodoRacha(new Date('2026-08-30T12:00:00.000Z'), 'semanal');

    expect(periodo.clave).toBe('2026-W35');
    expect(periodo.inicio.toISOString()).toBe('2026-08-24T00:00:00.000Z');
    expect(periodo.fin.toISOString()).toBe('2026-08-31T00:00:00.000Z');
    expect(periodo.quedadasNecesarias).toBe(1);
  });

  it('calcula dos quedadas necesarias para frecuencia dos veces por semana', () => {
    const periodo = obtenerPeriodoRacha(new Date('2026-08-30T12:00:00.000Z'), 'dos_veces_semana');

    expect(periodo.clave).toBe('2026-W35');
    expect(periodo.quedadasNecesarias).toBe(2);
  });

  it('calcula el periodo mensual', () => {
    const periodo = obtenerPeriodoRacha(new Date('2026-08-30T12:00:00.000Z'), 'mensual');

    expect(periodo.clave).toBe('2026-08');
    expect(periodo.inicio.toISOString()).toBe('2026-08-01T00:00:00.000Z');
    expect(periodo.fin.toISOString()).toBe('2026-09-01T00:00:00.000Z');
    expect(periodo.quedadasNecesarias).toBe(1);
  });

  it('calcula el periodo anterior segun la frecuencia', () => {
    const periodo = obtenerPeriodoRacha(new Date('2026-08-30T12:00:00.000Z'), 'mensual');
    const anterior = obtenerPeriodoAnterior(periodo, 'mensual');

    expect(anterior.clave).toBe('2026-07');
  });
});
