import type { Asistencia, Id, Membresia } from '../models';

export interface GenerarAsistenciasParams {
  quedadaId: Id;
  membresiasActivas: Membresia[];
  asistentesMembresiaIds: Id[];
}

export function generarAsistenciasParaQuedada({
  quedadaId,
  membresiasActivas,
  asistentesMembresiaIds,
}: GenerarAsistenciasParams): Asistencia[] {
  const asistentes = new Set(asistentesMembresiaIds);

  return membresiasActivas.map((membresia) => ({
    id: `${quedadaId}:${membresia.id}`,
    quedadaId,
    membresiaId: membresia.id,
    estado: asistentes.has(membresia.id) ? 'asistio' : 'no_asistio',
  }));
}
