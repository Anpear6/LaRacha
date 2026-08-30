import type { FrecuenciaRacha } from '../models';

export interface PeriodoRacha {
  clave: string;
  inicio: Date;
  fin: Date;
  quedadasNecesarias: number;
}

export function obtenerPeriodoRacha(fecha: Date, frecuencia: FrecuenciaRacha): PeriodoRacha {
  if (frecuencia === 'dos_veces_semana' || frecuencia === 'semanal') {
    return obtenerPeriodoSemanal(fecha, frecuencia === 'dos_veces_semana' ? 2 : 1);
  }

  if (frecuencia === 'dos_al_mes' || frecuencia === 'mensual') {
    return obtenerPeriodoMensual(fecha, frecuencia === 'dos_al_mes' ? 2 : 1);
  }

  return obtenerPeriodoAnual(fecha, 6);
}

export function obtenerPeriodoAnterior(periodo: PeriodoRacha, frecuencia: FrecuenciaRacha): PeriodoRacha {
  const fechaAnterior = new Date(periodo.inicio);

  if (frecuencia === 'dos_veces_semana' || frecuencia === 'semanal') {
    fechaAnterior.setUTCDate(fechaAnterior.getUTCDate() - 1);
  } else if (frecuencia === 'dos_al_mes' || frecuencia === 'mensual') {
    fechaAnterior.setUTCDate(0);
  } else {
    fechaAnterior.setUTCFullYear(fechaAnterior.getUTCFullYear() - 1);
  }

  return obtenerPeriodoRacha(fechaAnterior, frecuencia);
}

function obtenerPeriodoSemanal(fecha: Date, quedadasNecesarias: number): PeriodoRacha {
  const inicio = inicioDiaUtc(fecha);
  const diaSemana = inicio.getUTCDay();
  const distanciaDesdeLunes = diaSemana === 0 ? 6 : diaSemana - 1;
  inicio.setUTCDate(inicio.getUTCDate() - distanciaDesdeLunes);

  const fin = new Date(inicio);
  fin.setUTCDate(inicio.getUTCDate() + 7);

  return {
    clave: `${inicio.getUTCFullYear()}-W${numeroSemanaIso(inicio)}`,
    inicio,
    fin,
    quedadasNecesarias,
  };
}

function obtenerPeriodoMensual(fecha: Date, quedadasNecesarias: number): PeriodoRacha {
  const inicio = new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), 1));
  const fin = new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth() + 1, 1));
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');

  return {
    clave: `${fecha.getUTCFullYear()}-${mes}`,
    inicio,
    fin,
    quedadasNecesarias,
  };
}

function obtenerPeriodoAnual(fecha: Date, quedadasNecesarias: number): PeriodoRacha {
  const inicio = new Date(Date.UTC(fecha.getUTCFullYear(), 0, 1));
  const fin = new Date(Date.UTC(fecha.getUTCFullYear() + 1, 0, 1));

  return {
    clave: `${fecha.getUTCFullYear()}`,
    inicio,
    fin,
    quedadasNecesarias,
  };
}

function inicioDiaUtc(fecha: Date): Date {
  return new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate()));
}

function numeroSemanaIso(fecha: Date): string {
  const fechaNormalizada = inicioDiaUtc(fecha);
  fechaNormalizada.setUTCDate(
    fechaNormalizada.getUTCDate() + 4 - (fechaNormalizada.getUTCDay() || 7),
  );

  const inicioAnio = new Date(Date.UTC(fechaNormalizada.getUTCFullYear(), 0, 1));
  const numeroSemana = Math.ceil(
    ((fechaNormalizada.getTime() - inicioAnio.getTime()) / 86400000 + 1) / 7,
  );

  return String(numeroSemana).padStart(2, '0');
}
