import type { Grupo, Insignia, InsigniaDesbloqueada, RecuperacionRacha } from '../models';
import { calcularRachaActual, type QuedadaConAsistencias, type ResultadoRacha } from './calculo-racha';
import { detectarPerdidaRacha, type ResultadoPerdidaRacha } from './perdida-racha';
import {
  crearRecuperacionPendiente,
  type DatosNuevaRecuperacionRacha,
} from './recuperacion-racha';
import {
  seleccionarInsigniasDesbloqueables,
  type DatosNuevaInsigniaDesbloqueada,
} from './insignias';

export interface ResultadoEstadoRacha {
  rachaActual: ResultadoRacha;
  rachaVisible: ResultadoRacha;
  perdida: ResultadoPerdidaRacha;
  nuevaRecuperacionPendiente?: DatosNuevaRecuperacionRacha;
  insigniasDesbloqueables: DatosNuevaInsigniaDesbloqueada[];
}

export function resolverEstadoRachaGrupo({
  grupo,
  quedadas,
  catalogoInsignias,
  insigniasDesbloqueadas,
  fechaReferencia,
  recuperacionActiva,
}: {
  grupo: Grupo;
  quedadas: QuedadaConAsistencias[];
  catalogoInsignias: Insignia[];
  insigniasDesbloqueadas: InsigniaDesbloqueada[];
  fechaReferencia: Date;
  recuperacionActiva?: RecuperacionRacha;
}): ResultadoEstadoRacha {
  const rachaActual = calcularRachaActual({
    grupoId: grupo.id,
    frecuenciaRacha: grupo.frecuenciaRacha,
    quedadas,
    fechaReferencia,
  });

  const datosDeteccion = {
    grupoId: grupo.id,
    frecuenciaRacha: grupo.frecuenciaRacha,
    quedadas,
    fechaReferencia,
  };

  const perdida = recuperacionActiva
    ? detectarPerdidaRacha({ ...datosDeteccion, recuperacionActiva })
    : detectarPerdidaRacha(datosDeteccion);

  if (perdida.perdida) {
    return {
      rachaActual,
      rachaVisible: perdida.rachaAntesDePerderse,
      perdida,
      nuevaRecuperacionPendiente: crearRecuperacionPendiente({
        grupoId: grupo.id,
        rachaPerdidaPeriodos: perdida.rachaPerdidaPeriodos,
        fechaDeteccion: fechaReferencia.toISOString(),
      }),
      insigniasDesbloqueables: [],
    };
  }

  const rachaVisible = recuperacionActiva
    ? crearRachaCongeladaDesdeRecuperacion(recuperacionActiva, rachaActual)
    : rachaActual;

  const datosInsignias = {
    grupoId: grupo.id,
    frecuenciaRacha: grupo.frecuenciaRacha,
    catalogo: catalogoInsignias,
    insigniasDesbloqueadas,
    racha: rachaVisible,
    fechaDesbloqueo: fechaReferencia.toISOString(),
  };

  const insigniasDesbloqueables = recuperacionActiva
    ? seleccionarInsigniasDesbloqueables({ ...datosInsignias, recuperacionActiva })
    : seleccionarInsigniasDesbloqueables(datosInsignias);

  return {
    rachaActual,
    rachaVisible,
    perdida,
    insigniasDesbloqueables,
  };
}

function crearRachaCongeladaDesdeRecuperacion(
  recuperacion: RecuperacionRacha,
  rachaActual: ResultadoRacha,
): ResultadoRacha {
  return {
    valorActual: recuperacion.rachaPerdidaPeriodos,
    periodoActualClave: rachaActual.periodoActualClave,
    periodosCumplidos: [],
    diasRachaActual: 0,
  };
}
