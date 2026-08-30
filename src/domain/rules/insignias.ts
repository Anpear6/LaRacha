import type {
  FrecuenciaRacha,
  Id,
  Insignia,
  InsigniaDesbloqueada,
  RecuperacionRacha,
} from '../models';
import type { ResultadoRacha } from './calculo-racha';
import { recuperacionBloqueaInsignias } from './recuperacion-racha';

export interface DatosNuevaInsigniaDesbloqueada {
  insigniaId: Id;
  grupoId: Id;
  membresiaId?: Id;
  fechaDesbloqueo: string;
}

const UMBRAL_DIAS_POR_CRITERIO: Record<string, number> = {
  '1_semana': 7,
  '2_semanas': 14,
  '1_mes': 28,
  '3_meses': 84,
  '6_meses': 168,
  '1_anio': 365,
};

const CRITERIOS_PERMITIDOS_POR_FRECUENCIA: Record<FrecuenciaRacha, Set<string>> = {
  dos_veces_semana: new Set(['1_semana', '2_semanas', '1_mes', '3_meses', '6_meses', '1_anio']),
  semanal: new Set(['1_semana', '2_semanas', '1_mes', '3_meses', '6_meses', '1_anio']),
  dos_al_mes: new Set(['1_mes', '3_meses', '6_meses', '1_anio']),
  mensual: new Set(['1_mes', '3_meses', '6_meses', '1_anio']),
  seis_al_anio: new Set(['1_anio']),
};

export function seleccionarInsigniasDesbloqueables({
  grupoId,
  frecuenciaRacha,
  catalogo,
  insigniasDesbloqueadas,
  racha,
  recuperacionActiva,
  fechaDesbloqueo,
  membresiaId,
}: {
  grupoId: Id;
  frecuenciaRacha: FrecuenciaRacha;
  catalogo: Insignia[];
  insigniasDesbloqueadas: InsigniaDesbloqueada[];
  racha: ResultadoRacha;
  recuperacionActiva?: RecuperacionRacha;
  fechaDesbloqueo: string;
  membresiaId?: Id;
}): DatosNuevaInsigniaDesbloqueada[] {
  if (recuperacionBloqueaInsignias(recuperacionActiva)) {
    return [];
  }

  const insigniasYaDesbloqueadas = new Set(
    insigniasDesbloqueadas
      .filter((insignia) => insignia.grupoId === grupoId)
      .map((insignia) => insignia.insigniaId),
  );

  return catalogo
    .filter((insignia) => insignia.tipo === 'racha_grupo')
    .filter((insignia) => !insigniasYaDesbloqueadas.has(insignia.id))
    .filter((insignia) => criterioEsCompatibleConFrecuencia(insignia.criterio, frecuenciaRacha))
    .filter((insignia) => racha.diasRachaActual >= obtenerUmbralDias(insignia.criterio))
    .map((insignia) => {
      const desbloqueo: DatosNuevaInsigniaDesbloqueada = {
        insigniaId: insignia.id,
        grupoId,
        fechaDesbloqueo,
      };

      if (membresiaId) {
        desbloqueo.membresiaId = membresiaId;
      }

      return desbloqueo;
    });
}

export function obtenerUmbralDias(criterio: string): number {
  return UMBRAL_DIAS_POR_CRITERIO[criterio] ?? Number.POSITIVE_INFINITY;
}

function criterioEsCompatibleConFrecuencia(
  criterio: string,
  frecuenciaRacha: FrecuenciaRacha,
): boolean {
  return CRITERIOS_PERMITIDOS_POR_FRECUENCIA[frecuenciaRacha].has(criterio);
}
