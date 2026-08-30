import type { Id, Membresia } from '../models';

export function esMembresiaActiva(membresia: Membresia): boolean {
  return membresia.estado === 'activa';
}

export function esMembresiaReal(membresia: Membresia): boolean {
  return Boolean(membresia.usuarioId);
}

export function esAdmin(membresia: Membresia): boolean {
  return membresia.rol === 'admin' && esMembresiaActiva(membresia);
}

export function puedeActuarComoMiembro(membresia: Membresia): boolean {
  return esMembresiaActiva(membresia) && esMembresiaReal(membresia);
}

export function puedeEditarGrupo(membresia: Membresia): boolean {
  return esAdmin(membresia) && esMembresiaReal(membresia);
}

export function puedeGestionarMembresia({
  actor,
  objetivo,
}: {
  actor: Membresia;
  objetivo: Membresia;
}): boolean {
  const editaSuPropiaMembresia = actor.id === objetivo.id && puedeActuarComoMiembro(actor);
  const adminEditaMiembroSinCuenta = puedeEditarGrupo(actor) && !esMembresiaReal(objetivo);

  return editaSuPropiaMembresia || adminEditaMiembroSinCuenta;
}

export function buscarMembresiaActivaDelUsuario(
  membresias: Membresia[],
  usuarioId: Id,
  grupoId: Id,
): Membresia | undefined {
  return membresias.find(
    (membresia) =>
      membresia.usuarioId === usuarioId &&
      membresia.grupoId === grupoId &&
      membresia.estado === 'activa',
  );
}
