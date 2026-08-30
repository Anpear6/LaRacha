import type { FechaISO, Id } from './common';

export const ESTADOS_RECUPERACION_RACHA = [
  'pendiente',
  'en_progreso',
  'pausada',
  'completada',
  'fallida',
] as const;

export type EstadoRecuperacionRacha = (typeof ESTADOS_RECUPERACION_RACHA)[number];

export interface RecuperacionRacha {
  id: Id;
  grupoId: Id;
  rachaPerdidaPeriodos: number;
  periodosNecesarios: number;
  periodosCompletados: number;
  estado: EstadoRecuperacionRacha;
  fechaInicio: FechaISO;
  fechaFin?: FechaISO;
  fechaCreacion: FechaISO;
  fechaActualizacion: FechaISO;
}
