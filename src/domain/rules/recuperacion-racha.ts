import type { FechaISO, Id, RecuperacionRacha } from '../models';

export type DatosNuevaRecuperacionRacha = Omit<
  RecuperacionRacha,
  'id' | 'fechaCreacion' | 'fechaActualizacion'
>;

export function crearRecuperacionPendiente({
  grupoId,
  rachaPerdidaPeriodos,
  fechaDeteccion,
}: {
  grupoId: Id;
  rachaPerdidaPeriodos: number;
  fechaDeteccion: FechaISO;
}): DatosNuevaRecuperacionRacha {
  if (rachaPerdidaPeriodos <= 0) {
    throw new Error('La racha perdida debe ser mayor que 0.');
  }

  return {
    grupoId,
    rachaPerdidaPeriodos,
    periodosNecesarios: rachaPerdidaPeriodos,
    periodosCompletados: 0,
    estado: 'pendiente',
    fechaInicio: fechaDeteccion,
  };
}

export function activarRecuperacion(
  recuperacion: RecuperacionRacha,
  fechaInicio: FechaISO,
): RecuperacionRacha {
  if (recuperacion.estado !== 'pendiente') {
    throw new Error('Solo se puede activar una recuperacion pendiente.');
  }

  return {
    ...recuperacion,
    estado: 'en_progreso',
    fechaInicio,
  };
}

export function registrarPeriodoRecuperacionCumplido(
  recuperacion: RecuperacionRacha,
  fechaFin: FechaISO,
): RecuperacionRacha {
  if (recuperacion.estado !== 'en_progreso') {
    throw new Error('Solo se puede avanzar una recuperacion en progreso.');
  }

  const periodosCompletados = recuperacion.periodosCompletados + 1;
  const completada = periodosCompletados >= recuperacion.periodosNecesarios;

  const recuperacionActualizada: RecuperacionRacha = {
    ...recuperacion,
    periodosCompletados,
    estado: completada ? 'completada' : 'en_progreso',
  };

  if (completada) {
    recuperacionActualizada.fechaFin = fechaFin;
  }

  return recuperacionActualizada;
}

export function fallarRecuperacion(
  recuperacion: RecuperacionRacha,
  fechaFin: FechaISO,
): RecuperacionRacha {
  if (recuperacion.estado !== 'en_progreso') {
    throw new Error('Solo se puede fallar una recuperacion en progreso.');
  }

  return {
    ...recuperacion,
    estado: 'fallida',
    fechaFin,
  };
}

export function crearNuevoIntentoDesdeRecuperacionFallida({
  recuperacionFallida,
  fechaDeteccion,
}: {
  recuperacionFallida: RecuperacionRacha;
  fechaDeteccion: FechaISO;
}): DatosNuevaRecuperacionRacha {
  if (recuperacionFallida.estado !== 'fallida') {
    throw new Error('Solo se puede reiniciar una recuperacion fallida.');
  }

  return crearRecuperacionPendiente({
    grupoId: recuperacionFallida.grupoId,
    rachaPerdidaPeriodos: recuperacionFallida.rachaPerdidaPeriodos,
    fechaDeteccion,
  });
}

export function pausarRecuperacionPorTregua(recuperacion: RecuperacionRacha): RecuperacionRacha {
  if (recuperacion.estado !== 'en_progreso') {
    throw new Error('Solo se puede pausar una recuperacion en progreso.');
  }

  return {
    ...recuperacion,
    estado: 'pausada',
  };
}

export function reanudarRecuperacionPausada(recuperacion: RecuperacionRacha): RecuperacionRacha {
  if (recuperacion.estado !== 'pausada') {
    throw new Error('Solo se puede reanudar una recuperacion pausada.');
  }

  return {
    ...recuperacion,
    estado: 'en_progreso',
  };
}

export function recuperacionBloqueaInsignias(recuperacion: RecuperacionRacha | undefined): boolean {
  return (
    recuperacion?.estado === 'pendiente' ||
    recuperacion?.estado === 'en_progreso' ||
    recuperacion?.estado === 'pausada'
  );
}
