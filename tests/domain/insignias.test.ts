import { describe, expect, it } from 'vitest';
import {
  seleccionarInsigniasDesbloqueables,
  type FrecuenciaRacha,
  type Insignia,
  type InsigniaDesbloqueada,
  type RecuperacionRacha,
  type ResultadoRacha,
} from '../../src/domain';

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

function racha(diasRachaActual: number): ResultadoRacha {
  return {
    valorActual: 4,
    periodoActualClave: '2026-W35',
    periodosCumplidos: ['2026-W35', '2026-W34', '2026-W33', '2026-W32'],
    diasRachaActual,
  };
}

function desbloqueada(insigniaId: string): InsigniaDesbloqueada {
  return {
    id: `desbloqueada-${insigniaId}`,
    insigniaId,
    grupoId: 'grupo-1',
    fechaDesbloqueo: '2026-08-30T00:00:00.000Z',
    fechaCreacion: '2026-08-30T00:00:00.000Z',
  };
}

function recuperacion(estado: RecuperacionRacha['estado']): RecuperacionRacha {
  return {
    id: 'recuperacion-1',
    grupoId: 'grupo-1',
    rachaPerdidaPeriodos: 2,
    periodosNecesarios: 2,
    periodosCompletados: 0,
    estado,
    fechaInicio: '2026-08-30T00:00:00.000Z',
    fechaCreacion: '2026-08-30T00:00:00.000Z',
    fechaActualizacion: '2026-08-30T00:00:00.000Z',
  };
}

describe('desbloqueo de insignias', () => {
  const catalogo = [
    insignia('i-1-semana', '1_semana'),
    insignia('i-2-semanas', '2_semanas'),
    insignia('i-1-mes', '1_mes'),
    insignia('i-3-meses', '3_meses'),
  ];

  it('desbloquea insignias segun tiempo real de racha', () => {
    const resultado = seleccionarInsigniasDesbloqueables({
      grupoId: 'grupo-1',
      frecuenciaRacha: 'semanal',
      catalogo,
      insigniasDesbloqueadas: [],
      racha: racha(28),
      fechaDesbloqueo: '2026-08-30T00:00:00.000Z',
    });

    expect(resultado.map((insignia) => insignia.insigniaId)).toEqual([
      'i-1-semana',
      'i-2-semanas',
      'i-1-mes',
    ]);
  });

  it('no vuelve a desbloquear una insignia que el grupo ya tiene', () => {
    const resultado = seleccionarInsigniasDesbloqueables({
      grupoId: 'grupo-1',
      frecuenciaRacha: 'semanal',
      catalogo,
      insigniasDesbloqueadas: [desbloqueada('i-1-semana')],
      racha: racha(14),
      fechaDesbloqueo: '2026-08-30T00:00:00.000Z',
    });

    expect(resultado.map((insignia) => insignia.insigniaId)).toEqual(['i-2-semanas']);
  });

  it('no desbloquea nuevas insignias mientras la recuperacion bloquea la racha', () => {
    const resultado = seleccionarInsigniasDesbloqueables({
      grupoId: 'grupo-1',
      frecuenciaRacha: 'semanal',
      catalogo,
      insigniasDesbloqueadas: [],
      racha: racha(28),
      recuperacionActiva: recuperacion('pendiente'),
      fechaDesbloqueo: '2026-08-30T00:00:00.000Z',
    });

    expect(resultado).toEqual([]);
  });

  it.each<FrecuenciaRacha>(['dos_al_mes', 'mensual'])(
    'para frecuencia %s ignora insignias semanales aunque el tiempo real supere el umbral',
    (frecuenciaRacha) => {
      const resultado = seleccionarInsigniasDesbloqueables({
        grupoId: 'grupo-1',
        frecuenciaRacha,
        catalogo,
        insigniasDesbloqueadas: [],
        racha: racha(31),
        fechaDesbloqueo: '2026-08-30T00:00:00.000Z',
      });

      expect(resultado.map((insignia) => insignia.insigniaId)).toEqual(['i-1-mes']);
    },
  );
});
