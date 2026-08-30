import type { Asistencia } from '../models';

export const MINIMO_ASISTENTES_RACHA = 3;

export function contarAsistentes(asistencias: Asistencia[]): number {
  return asistencias.filter((asistencia) => asistencia.estado === 'asistio').length;
}

export function quedadaCuentaParaRacha(asistencias: Asistencia[]): boolean {
  return contarAsistentes(asistencias) >= MINIMO_ASISTENTES_RACHA;
}
