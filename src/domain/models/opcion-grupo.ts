import type { FechaISO, Id } from './common';

export const TIPOS_OPCION_GRUPO = ['tipo_plan', 'lugar', 'comida'] as const;

export type TipoOpcionGrupo = (typeof TIPOS_OPCION_GRUPO)[number];

export interface OpcionGrupo {
  id: Id;
  grupoId: Id;
  tipo: TipoOpcionGrupo;
  valor: string;
  fechaCreacion: FechaISO;
}
