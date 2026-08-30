import { describe, expect, it } from 'vitest';
import {
  buscarMembresiaActivaDelUsuario,
  esAdmin,
  esMembresiaReal,
  puedeActuarComoMiembro,
  puedeEditarGrupo,
  puedeGestionarMembresia,
  type Membresia,
} from '../../src/domain';

function membresia(overrides: Partial<Membresia> = {}): Membresia {
  return {
    id: 'membresia-1',
    usuarioId: 'usuario-1',
    grupoId: 'grupo-1',
    rol: 'miembro',
    apodo: 'Angela',
    estado: 'activa',
    fechaEntrada: '2026-08-30T10:00:00.000Z',
    fechaActualizacion: '2026-08-30T10:00:00.000Z',
    ...overrides,
  };
}

function membresiaSinCuenta(overrides: Partial<Omit<Membresia, 'usuarioId'>> = {}): Membresia {
  return {
    id: 'sin-cuenta-1',
    grupoId: 'grupo-1',
    rol: 'miembro',
    apodo: 'Beita',
    estado: 'activa',
    fechaEntrada: '2026-08-30T10:00:00.000Z',
    fechaActualizacion: '2026-08-30T10:00:00.000Z',
    ...overrides,
  };
}

describe('permisos de membresia', () => {
  it('considera real una membresia con usuario asociado', () => {
    expect(esMembresiaReal(membresia({ usuarioId: 'usuario-1' }))).toBe(true);
    expect(esMembresiaReal(membresiaSinCuenta())).toBe(false);
  });

  it('solo una membresia activa y real puede actuar como miembro', () => {
    expect(puedeActuarComoMiembro(membresia())).toBe(true);
    expect(puedeActuarComoMiembro(membresiaSinCuenta())).toBe(false);
    expect(puedeActuarComoMiembro(membresia({ estado: 'eliminada' }))).toBe(false);
  });

  it('solo una membresia admin activa y real puede editar grupo', () => {
    expect(puedeEditarGrupo(membresia({ rol: 'admin' }))).toBe(true);
    expect(puedeEditarGrupo(membresia({ rol: 'miembro' }))).toBe(false);
    expect(puedeEditarGrupo(membresiaSinCuenta({ rol: 'admin' }))).toBe(false);
  });

  it('detecta admin activo', () => {
    expect(esAdmin(membresia({ rol: 'admin' }))).toBe(true);
    expect(esAdmin(membresia({ rol: 'admin', estado: 'eliminada' }))).toBe(false);
  });

  it('permite editar la propia membresia real', () => {
    const actor = membresia({ id: 'membresia-1' });

    expect(puedeGestionarMembresia({ actor, objetivo: actor })).toBe(true);
  });

  it('permite al admin editar miembros sin cuenta', () => {
    const actor = membresia({ id: 'admin-1', rol: 'admin' });
    const objetivo = membresiaSinCuenta({ id: 'sin-cuenta-1' });

    expect(puedeGestionarMembresia({ actor, objetivo })).toBe(true);
  });

  it('no permite al admin editar miembros con cuenta ajenos', () => {
    const actor = membresia({ id: 'admin-1', rol: 'admin', usuarioId: 'usuario-admin' });
    const objetivo = membresia({ id: 'membresia-2', usuarioId: 'usuario-2' });

    expect(puedeGestionarMembresia({ actor, objetivo })).toBe(false);
  });

  it('encuentra la membresia activa de un usuario dentro de un grupo', () => {
    const encontrada = buscarMembresiaActivaDelUsuario(
      [
        membresia({ id: 'm1', usuarioId: 'usuario-1', grupoId: 'grupo-1' }),
        membresia({ id: 'm2', usuarioId: 'usuario-1', grupoId: 'grupo-2' }),
      ],
      'usuario-1',
      'grupo-1',
    );

    expect(encontrada?.id).toBe('m1');
  });
});
