import type {
  Asistencia,
  FotoQuedada,
  Grupo,
  Membresia,
  ObjetoPerdido,
  OpcionGrupo,
  Quedada,
  ResultadoEstadoRacha,
  RecuperacionRacha,
  Usuario,
} from '../../domain';
import { resolverEstadoRachaGrupo } from '../../domain';
import type { LaRachaSupabaseClient } from './client';
import {
  mapAsistencia,
  mapFotoQuedada,
  mapGrupo,
  mapInsignia,
  mapInsigniaDesbloqueada,
  mapMembresia,
  mapObjetoPerdido,
  mapOpcionGrupo,
  mapQuedada,
  mapRecuperacionRacha,
  mapUsuario,
} from './mappers';

export interface GrupoConMembresia {
  grupo: Grupo;
  membresia: Membresia;
}

export interface HistorialQuedadaItem {
  quedada: Quedada;
  asistencias: Asistencia[];
  fotos: FotoQuedada[];
  objetosPerdidos: ObjetoPerdido[];
}

export interface EstadoRachaGrupo {
  grupo: Grupo;
  historial: HistorialQuedadaItem[];
  recuperacionActiva?: RecuperacionRacha;
  estadoRacha: ResultadoEstadoRacha;
}

export async function obtenerUsuarioActual(
  supabase: LaRachaSupabaseClient,
): Promise<Usuario | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`No se pudo obtener la sesion actual: ${authError.message}`);
  }

  if (!user) {
    return null;
  }

  const { data, error } = await supabase.from('usuarios').select('*').eq('id', user.id).maybeSingle();

  if (error) {
    throw new Error(`No se pudo leer el usuario actual: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapUsuario(data);
}

export async function listarMembresiasUsuarioActual(
  supabase: LaRachaSupabaseClient,
): Promise<Membresia[]> {
  const usuario = await obtenerUsuarioActual(supabase);

  if (!usuario) {
    return [];
  }

  const { data, error } = await supabase
    .from('membresias')
    .select('*')
    .eq('usuario_id', usuario.id)
    .eq('estado', 'activa')
    .order('fecha_entrada');

  if (error) {
    throw new Error(`No se pudieron leer las membresias del usuario actual: ${error.message}`);
  }

  return data.map(mapMembresia);
}

export async function listarGruposUsuarioActual(
  supabase: LaRachaSupabaseClient,
): Promise<GrupoConMembresia[]> {
  const membresias = await listarMembresiasUsuarioActual(supabase);
  const grupoIds = membresias.map((membresia) => membresia.grupoId);

  if (grupoIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('grupos')
    .select('*')
    .in('id', grupoIds)
    .order('nombre');

  if (error) {
    throw new Error(`No se pudieron leer los grupos del usuario actual: ${error.message}`);
  }

  const gruposPorId = new Map(data.map((row) => [row.id, mapGrupo(row)]));
  const gruposConMembresia: GrupoConMembresia[] = [];

  for (const membresia of membresias) {
    const grupo = gruposPorId.get(membresia.grupoId);

    if (grupo) {
      gruposConMembresia.push({ grupo, membresia });
    }
  }

  return gruposConMembresia;
}

export async function listarMembresiasGrupo(
  supabase: LaRachaSupabaseClient,
  grupoId: string,
): Promise<Membresia[]> {
  const { data, error } = await supabase
    .from('membresias')
    .select('*')
    .eq('grupo_id', grupoId)
    .eq('estado', 'activa')
    .order('fecha_entrada');

  if (error) {
    throw new Error(`No se pudieron leer las membresias del grupo: ${error.message}`);
  }

  return data.map(mapMembresia);
}

export async function listarOpcionesGrupo(
  supabase: LaRachaSupabaseClient,
  grupoId: string,
): Promise<OpcionGrupo[]> {
  const { data, error } = await supabase
    .from('opciones_grupo')
    .select('*')
    .eq('grupo_id', grupoId)
    .order('tipo')
    .order('valor');

  if (error) {
    throw new Error(`No se pudieron leer las opciones del grupo: ${error.message}`);
  }

  return data.map(mapOpcionGrupo);
}

export async function listarHistorialQuedadasGrupo(
  supabase: LaRachaSupabaseClient,
  grupoId: string,
): Promise<HistorialQuedadaItem[]> {
  const { data: quedadasData, error: quedadasError } = await supabase
    .from('quedadas')
    .select('*')
    .eq('grupo_id', grupoId)
    .order('fecha', { ascending: false });

  if (quedadasError) {
    throw new Error(`No se pudo leer el historial de quedadas: ${quedadasError.message}`);
  }

  const quedadas = quedadasData.map(mapQuedada);
  const quedadaIds = quedadas.map((quedada) => quedada.id);

  if (quedadaIds.length === 0) {
    return [];
  }

  const [asistencias, fotos, objetosPerdidos] = await Promise.all([
    listarAsistenciasPorQuedadas(supabase, quedadaIds),
    listarFotosPorQuedadas(supabase, quedadaIds),
    listarObjetosPerdidosPorQuedadas(supabase, quedadaIds),
  ]);

  return quedadas.map((quedada) => ({
    quedada,
    asistencias: asistencias.filter((asistencia) => asistencia.quedadaId === quedada.id),
    fotos: fotos.filter((foto) => foto.quedadaId === quedada.id),
    objetosPerdidos: objetosPerdidos.filter((objeto) => objeto.quedadaId === quedada.id),
  }));
}

export async function obtenerEstadoRachaGrupo(
  supabase: LaRachaSupabaseClient,
  grupoId: string,
  fechaReferencia: Date = new Date(),
): Promise<EstadoRachaGrupo> {
  const { data: grupoData, error: grupoError } = await supabase
    .from('grupos')
    .select('*')
    .eq('id', grupoId)
    .single();

  if (grupoError) {
    throw new Error(`No se pudo leer el grupo: ${grupoError.message}`);
  }

  const grupo = mapGrupo(grupoData);
  const [historial, catalogoInsignias, insigniasDesbloqueadas, recuperacionActiva] =
    await Promise.all([
      listarHistorialQuedadasGrupo(supabase, grupoId),
      listarCatalogoInsignias(supabase),
      listarInsigniasDesbloqueadasGrupo(supabase, grupoId),
      obtenerRecuperacionActivaGrupo(supabase, grupoId),
    ]);

  const estadoRacha = recuperacionActiva
    ? resolverEstadoRachaGrupo({
        grupo,
        quedadas: historial,
        catalogoInsignias,
        insigniasDesbloqueadas,
        fechaReferencia,
        recuperacionActiva,
      })
    : resolverEstadoRachaGrupo({
        grupo,
        quedadas: historial,
        catalogoInsignias,
        insigniasDesbloqueadas,
        fechaReferencia,
      });

  const resultado: EstadoRachaGrupo = {
    grupo,
    historial,
    estadoRacha,
  };

  if (recuperacionActiva) {
    resultado.recuperacionActiva = recuperacionActiva;
  }

  return resultado;
}

export async function listarCatalogoInsignias(supabase: LaRachaSupabaseClient) {
  const { data, error } = await supabase
    .from('insignias')
    .select('*')
    .eq('tipo', 'racha_grupo')
    .order('fecha_creacion');

  if (error) {
    throw new Error(`No se pudo leer el catalogo de insignias: ${error.message}`);
  }

  return data.map(mapInsignia);
}

export async function listarInsigniasDesbloqueadasGrupo(
  supabase: LaRachaSupabaseClient,
  grupoId: string,
) {
  const { data, error } = await supabase
    .from('insignias_desbloqueadas')
    .select('*')
    .eq('grupo_id', grupoId)
    .order('fecha_desbloqueo');

  if (error) {
    throw new Error(`No se pudieron leer las insignias desbloqueadas: ${error.message}`);
  }

  return data.map(mapInsigniaDesbloqueada);
}

export async function obtenerRecuperacionActivaGrupo(
  supabase: LaRachaSupabaseClient,
  grupoId: string,
): Promise<RecuperacionRacha | undefined> {
  const { data, error } = await supabase
    .from('recuperaciones_racha')
    .select('*')
    .eq('grupo_id', grupoId)
    .in('estado', ['pendiente', 'en_progreso', 'pausada'])
    .order('fecha_inicio', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo leer la recuperacion activa: ${error.message}`);
  }

  return data ? mapRecuperacionRacha(data) : undefined;
}

async function listarAsistenciasPorQuedadas(
  supabase: LaRachaSupabaseClient,
  quedadaIds: string[],
): Promise<Asistencia[]> {
  const { data, error } = await supabase
    .from('asistencias')
    .select('*')
    .in('quedada_id', quedadaIds)
    .order('fecha_creacion');

  if (error) {
    throw new Error(`No se pudieron leer las asistencias: ${error.message}`);
  }

  return data.map(mapAsistencia);
}

async function listarFotosPorQuedadas(
  supabase: LaRachaSupabaseClient,
  quedadaIds: string[],
): Promise<FotoQuedada[]> {
  const { data, error } = await supabase
    .from('fotos_quedada')
    .select('*')
    .in('quedada_id', quedadaIds)
    .order('fecha_creacion');

  if (error) {
    throw new Error(`No se pudieron leer las fotos de quedadas: ${error.message}`);
  }

  return data.map(mapFotoQuedada);
}

async function listarObjetosPerdidosPorQuedadas(
  supabase: LaRachaSupabaseClient,
  quedadaIds: string[],
): Promise<ObjetoPerdido[]> {
  const { data, error } = await supabase
    .from('objetos_perdidos')
    .select('*')
    .in('quedada_id', quedadaIds)
    .order('fecha_creacion');

  if (error) {
    throw new Error(`No se pudieron leer los objetos perdidos: ${error.message}`);
  }

  return data.map(mapObjetoPerdido);
}
