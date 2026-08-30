import { describe, expect, it } from 'vitest';
import {
  activarRecuperacion,
  crearNuevoIntentoDesdeRecuperacionFallida,
  crearRecuperacionPendiente,
  fallarRecuperacion,
  pausarRecuperacionPorTregua,
  reanudarRecuperacionPausada,
  recuperacionBloqueaInsignias,
  registrarPeriodoRecuperacionCumplido,
  type RecuperacionRacha,
} from '../../src/domain';

function recuperacion(overrides: Partial<RecuperacionRacha> = {}): RecuperacionRacha {
  return {
    id: 'recuperacion-1',
    grupoId: 'grupo-1',
    rachaPerdidaPeriodos: 3,
    periodosNecesarios: 3,
    periodosCompletados: 0,
    estado: 'pendiente',
    fechaInicio: '2026-09-01',
    fechaCreacion: '2026-09-01T10:00:00.000Z',
    fechaActualizacion: '2026-09-01T10:00:00.000Z',
    ...overrides,
  };
}

describe('recuperacion de racha', () => {
  it('crea una recuperacion pendiente cuando se rompe una racha', () => {
    const nueva = crearRecuperacionPendiente({
      grupoId: 'grupo-1',
      rachaPerdidaPeriodos: 3,
      fechaDeteccion: '2026-09-01',
    });

    expect(nueva).toEqual({
      grupoId: 'grupo-1',
      rachaPerdidaPeriodos: 3,
      periodosNecesarios: 3,
      periodosCompletados: 0,
      estado: 'pendiente',
      fechaInicio: '2026-09-01',
    });
  });

  it('activa una recuperacion solo cuando estaba pendiente', () => {
    const activa = activarRecuperacion(recuperacion(), '2026-09-08');

    expect(activa.estado).toBe('en_progreso');
    expect(activa.fechaInicio).toBe('2026-09-08');
  });

  it('completa la recuperacion al cumplir todos los periodos necesarios', () => {
    const resultado = registrarPeriodoRecuperacionCumplido(
      recuperacion({ estado: 'en_progreso', periodosCompletados: 2 }),
      '2026-09-21',
    );

    expect(resultado.periodosCompletados).toBe(3);
    expect(resultado.estado).toBe('completada');
    expect(resultado.fechaFin).toBe('2026-09-21');
  });

  it('marca una recuperacion como fallida y conserva el progreso que tenia', () => {
    const fallida = fallarRecuperacion(
      recuperacion({ estado: 'en_progreso', periodosCompletados: 2 }),
      '2026-09-15',
    );

    expect(fallida.estado).toBe('fallida');
    expect(fallida.periodosCompletados).toBe(2);
  });

  it('un nuevo intento despues de fallar empieza desde cero', () => {
    const nuevoIntento = crearNuevoIntentoDesdeRecuperacionFallida({
      recuperacionFallida: recuperacion({ estado: 'fallida', periodosCompletados: 2 }),
      fechaDeteccion: '2026-09-16',
    });

    expect(nuevoIntento.periodosNecesarios).toBe(3);
    expect(nuevoIntento.periodosCompletados).toBe(0);
    expect(nuevoIntento.estado).toBe('pendiente');
  });

  it('pausa y reanuda una recuperacion por tregua de verano sin perder progreso', () => {
    const pausada = pausarRecuperacionPorTregua(
      recuperacion({ estado: 'en_progreso', periodosCompletados: 1 }),
    );
    const reanudada = reanudarRecuperacionPausada(pausada);

    expect(pausada.estado).toBe('pausada');
    expect(pausada.periodosCompletados).toBe(1);
    expect(reanudada.estado).toBe('en_progreso');
    expect(reanudada.periodosCompletados).toBe(1);
  });

  it('bloquea nuevas insignias mientras no se complete la recuperacion', () => {
    expect(recuperacionBloqueaInsignias(recuperacion({ estado: 'pendiente' }))).toBe(true);
    expect(recuperacionBloqueaInsignias(recuperacion({ estado: 'en_progreso' }))).toBe(true);
    expect(recuperacionBloqueaInsignias(recuperacion({ estado: 'pausada' }))).toBe(true);
    expect(recuperacionBloqueaInsignias(recuperacion({ estado: 'completada' }))).toBe(false);
    expect(recuperacionBloqueaInsignias(undefined)).toBe(false);
  });
});
