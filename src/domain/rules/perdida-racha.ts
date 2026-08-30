import type { FrecuenciaRacha, Id, RecuperacionRacha } from '../models';
import { calcularRachaActual, type QuedadaConAsistencias, type ResultadoRacha } from './calculo-racha';
import { obtenerPeriodoAnterior, obtenerPeriodoRacha, type PeriodoRacha } from './periodos';
import { recuperacionBloqueaInsignias } from './recuperacion-racha';
import { quedadaCuentaParaRacha } from './racha';

export interface ResultadoPerdidaRacha {
  perdida: boolean;
  periodoRotoClave?: string;
  rachaPerdidaPeriodos: number;
  rachaAntesDePerderse: ResultadoRacha;
}

export function detectarPerdidaRacha({
  grupoId,
  frecuenciaRacha,
  quedadas,
  fechaReferencia,
  recuperacionActiva,
}: {
  grupoId: Id;
  frecuenciaRacha: FrecuenciaRacha;
  quedadas: QuedadaConAsistencias[];
  fechaReferencia: Date;
  recuperacionActiva?: RecuperacionRacha;
}): ResultadoPerdidaRacha {
  if (recuperacionBloqueaInsignias(recuperacionActiva)) {
    return {
      perdida: false,
      rachaPerdidaPeriodos: 0,
      rachaAntesDePerderse: calcularRachaActual({
        grupoId,
        frecuenciaRacha,
        quedadas,
        fechaReferencia,
      }),
    };
  }

  const periodoAComprobar = obtenerUltimoPeriodoCerrado(fechaReferencia, frecuenciaRacha);

  if (periodoCumplido(grupoId, frecuenciaRacha, quedadas, periodoAComprobar)) {
    return {
      perdida: false,
      rachaPerdidaPeriodos: 0,
      rachaAntesDePerderse: calcularRachaActual({
        grupoId,
        frecuenciaRacha,
        quedadas,
        fechaReferencia: fechaAntesDe(periodoAComprobar.inicio),
      }),
    };
  }

  const rachaAntesDePerderse = calcularRachaActual({
    grupoId,
    frecuenciaRacha,
    quedadas,
    fechaReferencia: fechaAntesDe(periodoAComprobar.inicio),
  });

  if (rachaAntesDePerderse.valorActual === 0) {
    return {
      perdida: false,
      rachaPerdidaPeriodos: 0,
      rachaAntesDePerderse,
    };
  }

  return {
    perdida: true,
    periodoRotoClave: periodoAComprobar.clave,
    rachaPerdidaPeriodos: rachaAntesDePerderse.valorActual,
    rachaAntesDePerderse,
  };
}

function obtenerUltimoPeriodoCerrado(fechaReferencia: Date, frecuenciaRacha: FrecuenciaRacha): PeriodoRacha {
  const periodoActual = obtenerPeriodoRacha(fechaReferencia, frecuenciaRacha);

  if (periodoActual.fin.getTime() <= fechaReferencia.getTime()) {
    return periodoActual;
  }

  return obtenerPeriodoAnterior(periodoActual, frecuenciaRacha);
}

function periodoCumplido(
  grupoId: Id,
  frecuenciaRacha: FrecuenciaRacha,
  quedadas: QuedadaConAsistencias[],
  periodo: PeriodoRacha,
): boolean {
  const quedadasValidas = quedadas.filter(({ quedada, asistencias }) => {
    if (quedada.grupoId !== grupoId || !quedadaCuentaParaRacha(asistencias)) {
      return false;
    }

    const periodoQuedada = obtenerPeriodoRacha(new Date(quedada.fecha), frecuenciaRacha);
    return periodoQuedada.clave === periodo.clave;
  });

  return quedadasValidas.length >= periodo.quedadasNecesarias;
}

function fechaAntesDe(fecha: Date): Date {
  return new Date(fecha.getTime() - 1);
}
