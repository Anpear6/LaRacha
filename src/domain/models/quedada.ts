import type { FechaISO, Id } from './common';

export const MOMENTOS_DIA = ['manana', 'tarde', 'tarde_noche', 'noche', 'dia_completo'] as const;

export type MomentoDia = (typeof MOMENTOS_DIA)[number];

export interface Quedada {
  id: Id;
  grupoId: Id;
  titulo: string;
  fecha: FechaISO;
  conductorMembresiaId?: Id;
  creadaPorMembresiaId: Id;
  tipoPlanOpcionId?: Id;
  tipoPlanTexto?: string;
  momentoDia?: MomentoDia;
  lugarOpcionId?: Id;
  lugarTexto?: string;
  comidaOpcionId?: Id;
  comidaTexto?: string;
  duracionMinutos?: number;
  notas?: string;
  fechaCreacion: FechaISO;
  fechaActualizacion: FechaISO;
}

export interface FotoQuedada {
  id: Id;
  quedadaId: Id;
  url: string;
  descripcion?: string;
  fechaCreacion: FechaISO;
}

export interface ObjetoPerdido {
  id: Id;
  quedadaId: Id;
  membresiaId: Id;
  descripcion?: string;
  fechaCreacion: FechaISO;
}
