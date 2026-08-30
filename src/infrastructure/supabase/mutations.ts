import type { DatosNuevaInsigniaDesbloqueada, MomentoDia } from '../../domain';
import type { LaRachaSupabaseClient } from './client';
import type { Database, Json } from './database.types';

type RegistrarQuedadaCompletaArgs =
  Database['public']['Functions']['registrar_quedada_completa_mvp']['Args'];
type DesbloquearInsigniasRachaArgs =
  Database['public']['Functions']['desbloquear_insignias_racha_mvp']['Args'];

export interface FotoNuevaQuedada {
  url: string;
  descripcion?: string;
}

export interface RegistrarQuedadaCompletaInput {
  grupoId: string;
  titulo: string;
  creadaPorMembresiaId: string;
  fecha?: string;
  conductorMembresiaId?: string;
  tipoPlanTexto?: string;
  momentoDia?: MomentoDia;
  lugarTexto?: string;
  comidaTexto?: string;
  duracionMinutos?: number;
  notas?: string;
  asistentesMembresiaIds: string[];
  objetosPerdidosMembresiaIds?: string[];
  fotos?: FotoNuevaQuedada[];
}

export async function registrarQuedadaCompleta(
  supabase: LaRachaSupabaseClient,
  input: RegistrarQuedadaCompletaInput,
): Promise<string> {
  const args: RegistrarQuedadaCompletaArgs = {
    p_grupo_id: input.grupoId,
    p_titulo: input.titulo,
    p_creada_por_membresia_id: input.creadaPorMembresiaId,
    p_conductor_membresia_id: input.conductorMembresiaId ?? null,
    p_tipo_plan_texto: input.tipoPlanTexto ?? null,
    p_momento_dia: input.momentoDia ?? null,
    p_lugar_texto: input.lugarTexto ?? null,
    p_comida_texto: input.comidaTexto ?? null,
    p_duracion_minutos: input.duracionMinutos ?? null,
    p_notas: input.notas ?? null,
    p_asistentes_membresia_ids: input.asistentesMembresiaIds,
    p_objetos_perdidos_membresia_ids: input.objetosPerdidosMembresiaIds ?? [],
    p_fotos: normalizarFotos(input.fotos ?? []),
  };

  if (input.fecha) {
    args.p_fecha = input.fecha;
  }

  const { data, error } = await supabase.rpc('registrar_quedada_completa_mvp', args);

  if (error) {
    throw new Error(`No se pudo registrar la quedada: ${error.message}`);
  }

  return data;
}

export async function desbloquearInsigniasRacha(
  supabase: LaRachaSupabaseClient,
  grupoId: string,
  desbloqueos: DatosNuevaInsigniaDesbloqueada[],
): Promise<string[]> {
  const args: DesbloquearInsigniasRachaArgs = {
    p_grupo_id: grupoId,
    p_desbloqueos: normalizarDesbloqueosInsignias(desbloqueos),
  };

  const { data, error } = await supabase.rpc('desbloquear_insignias_racha_mvp', args);

  if (error) {
    throw new Error(`No se pudieron desbloquear las insignias: ${error.message}`);
  }

  return data;
}

function normalizarFotos(fotos: FotoNuevaQuedada[]): Json {
  return fotos.map((foto) => {
    const normalizada: Record<string, Json> = {
      url: foto.url,
    };

    if (foto.descripcion) {
      normalizada.descripcion = foto.descripcion;
    }

    return normalizada;
  });
}

function normalizarDesbloqueosInsignias(desbloqueos: DatosNuevaInsigniaDesbloqueada[]): Json {
  return desbloqueos.map((desbloqueo) => {
    const normalizado: Record<string, Json> = {
      insignia_id: desbloqueo.insigniaId,
      fecha_desbloqueo: desbloqueo.fechaDesbloqueo,
    };

    if (desbloqueo.membresiaId) {
      normalizado.membresia_id = desbloqueo.membresiaId;
    }

    return normalizado;
  });
}
