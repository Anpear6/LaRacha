import { describe, expect, it } from 'vitest';
import { generarAsistenciasParaQuedada, type Membresia } from '../../src/domain';

function membresia(id: string): Membresia {
  return {
    id,
    usuarioId: `usuario-${id}`,
    grupoId: 'grupo-1',
    rol: 'miembro',
    apodo: `Miembro ${id}`,
    estado: 'activa',
    fechaEntrada: '2026-08-30T10:00:00.000Z',
    fechaActualizacion: '2026-08-30T10:00:00.000Z',
  };
}

describe('generar asistencias para una quedada', () => {
  it('crea una asistencia por cada membresia activa', () => {
    const asistencias = generarAsistenciasParaQuedada({
      quedadaId: 'quedada-1',
      membresiasActivas: [membresia('1'), membresia('2'), membresia('3')],
      asistentesMembresiaIds: ['1', '3'],
    });

    expect(asistencias).toHaveLength(3);
  });

  it('marca como asistio a las membresias seleccionadas', () => {
    const asistencias = generarAsistenciasParaQuedada({
      quedadaId: 'quedada-1',
      membresiasActivas: [membresia('1'), membresia('2'), membresia('3')],
      asistentesMembresiaIds: ['1', '3'],
    });

    expect(asistencias).toEqual([
      expect.objectContaining({ membresiaId: '1', estado: 'asistio' }),
      expect.objectContaining({ membresiaId: '2', estado: 'no_asistio' }),
      expect.objectContaining({ membresiaId: '3', estado: 'asistio' }),
    ]);
  });
});
