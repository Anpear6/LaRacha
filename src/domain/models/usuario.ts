import type { FechaISO, Id } from './common';

export interface Usuario {
  id: Id;
  nombre: string;
  username?: string;
  email: string;
  avatarGlobalUrl?: string;
  fechaCreacion: FechaISO;
  fechaActualizacion: FechaISO;
}
