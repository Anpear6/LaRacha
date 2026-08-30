import type { Id } from './common';

export const ESTADOS_ASISTENCIA = ['asistio', 'no_asistio'] as const;

export type EstadoAsistencia = (typeof ESTADOS_ASISTENCIA)[number];

export interface Asistencia {
  id: Id;
  quedadaId: Id;
  membresiaId: Id;
  estado: EstadoAsistencia;
}
