import type { FechaISO, Id } from './common';

export const FRECUENCIAS_RACHA = [
  'dos_veces_semana',
  'semanal',
  'dos_al_mes',
  'mensual',
  'seis_al_anio',
] as const;

export type FrecuenciaRacha = (typeof FRECUENCIAS_RACHA)[number];

export interface Grupo {
  id: Id;
  nombre: string;
  descripcion?: string;
  fotoPerfilUrl?: string;
  privacidad: 'privado';
  frecuenciaRacha: FrecuenciaRacha;
  treguaVeranoActiva: boolean;
  fechaCreacion: FechaISO;
  fechaActualizacion: FechaISO;
}
