import type { FechaISO, Id } from './common';

export interface Insignia {
  id: Id;
  nombre: string;
  descripcion?: string;
  criterio: string;
  tipo: 'racha_grupo';
  imagenUrl: string;
  fechaCreacion: FechaISO;
}

export interface InsigniaDesbloqueada {
  id: Id;
  insigniaId: Id;
  grupoId: Id;
  membresiaId?: Id;
  fechaDesbloqueo: FechaISO;
  fechaCreacion: FechaISO;
}
