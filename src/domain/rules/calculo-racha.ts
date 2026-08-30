import type { Asistencia, FrecuenciaRacha, Id, Quedada } from '../models';
import { obtenerPeriodoAnterior, obtenerPeriodoRacha } from './periodos';
import { quedadaCuentaParaRacha } from './racha';

export interface QuedadaConAsistencias {
  quedada: Quedada;
  asistencias: Asistencia[];
}

export interface ResultadoRacha {
  valorActual: number;
  periodoActualClave: string;
  periodosCumplidos: string[];
  diasRachaActual: number;
  inicioRacha?: Date;
  finRacha?: Date;
}

export function calcularRachaActual({
  grupoId,
  frecuenciaRacha,
  quedadas,
  fechaReferencia,
}: {
  grupoId: Id;
  frecuenciaRacha: FrecuenciaRacha;
  quedadas: QuedadaConAsistencias[];
  fechaReferencia: Date;
}): ResultadoRacha {
  const quedadasValidasPorPeriodo = contarQuedadasValidasPorPeriodo(
    grupoId,
    frecuenciaRacha,
    quedadas,
  );

  let periodo = obtenerPeriodoRacha(fechaReferencia, frecuenciaRacha);
  const periodoActualClave = periodo.clave;
  const periodosCumplidos: string[] = [];
  let inicioRacha: Date | undefined;
  let finRacha: Date | undefined;

  while ((quedadasValidasPorPeriodo.get(periodo.clave) ?? 0) >= periodo.quedadasNecesarias) {
    periodosCumplidos.push(periodo.clave);
    inicioRacha = periodo.inicio;
    finRacha ??= periodo.fin;
    periodo = obtenerPeriodoAnterior(periodo, frecuenciaRacha);
  }

  const diasRachaActual =
    inicioRacha && finRacha
      ? Math.round((finRacha.getTime() - inicioRacha.getTime()) / 86400000)
      : 0;

  const resultado: ResultadoRacha = {
    valorActual: periodosCumplidos.length,
    periodoActualClave,
    periodosCumplidos,
    diasRachaActual,
  };

  if (inicioRacha) {
    resultado.inicioRacha = inicioRacha;
  }

  if (finRacha) {
    resultado.finRacha = finRacha;
  }

  return resultado;
}

function contarQuedadasValidasPorPeriodo(
  grupoId: Id,
  frecuenciaRacha: FrecuenciaRacha,
  quedadas: QuedadaConAsistencias[],
): Map<string, number> {
  const conteo = new Map<string, number>();

  for (const { quedada, asistencias } of quedadas) {
    if (quedada.grupoId !== grupoId || !quedadaCuentaParaRacha(asistencias)) {
      continue;
    }

    const periodo = obtenerPeriodoRacha(new Date(quedada.fecha), frecuenciaRacha);
    conteo.set(periodo.clave, (conteo.get(periodo.clave) ?? 0) + 1);
  }

  return conteo;
}
