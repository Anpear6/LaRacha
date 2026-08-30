import type { FechaISO, Id } from './common';

export const ROLES_MEMBRESIA = ['admin', 'miembro'] as const;
export const ESTADOS_MEMBRESIA = ['activa', 'eliminada'] as const;

export type RolMembresia = (typeof ROLES_MEMBRESIA)[number];
export type EstadoMembresia = (typeof ESTADOS_MEMBRESIA)[number];

export interface Membresia {
  id: Id;
  usuarioId?: Id;
  grupoId: Id;
  rol: RolMembresia;
  apodo: string;
  avatarGrupoUrl?: string;
  estado: EstadoMembresia;
  fechaEntrada: FechaISO;
  fechaActualizacion: FechaISO;
}
