import type { DatosNuevaInsigniaDesbloqueada, FrecuenciaRacha, MomentoDia } from '../../domain';
import type { LaRachaSupabaseClient } from './client';
import type { Database, Json } from './database.types';

type RegistrarQuedadaCompletaArgs =
  Database['public']['Functions']['registrar_quedada_completa_mvp']['Args'];
type DesbloquearInsigniasRachaArgs =
  Database['public']['Functions']['desbloquear_insignias_racha_mvp']['Args'];
type CrearGrupoArgs = Database['public']['Functions']['crear_grupo_mvp']['Args'];
type ActualizarGrupoArgs = Database['public']['Functions']['actualizar_grupo_mvp']['Args'];
type CrearMiembroSinCuentaArgs =
  Database['public']['Functions']['crear_miembro_sin_cuenta_mvp']['Args'];
type ActualizarMembresiaPropiaArgs =
  Database['public']['Functions']['actualizar_membresia_propia_mvp']['Args'];
type ActualizarMiembroSinCuentaArgs =
  Database['public']['Functions']['actualizar_miembro_sin_cuenta_mvp']['Args'];

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

export interface CrearGrupoInput {
  nombre: string;
  descripcion?: string;
  fotoPerfilUrl?: string;
  frecuenciaRacha?: FrecuenciaRacha;
  apodoAdmin?: string;
  avatarAdminUrl?: string;
}

export interface GrupoCreado {
  grupoId: string;
  membresiaId: string;
}

export interface ActualizarGrupoInput {
  grupoId: string;
  nombre: string;
  descripcion?: string;
  fotoPerfilUrl?: string;
  treguaVeranoActiva?: boolean;
}

export interface CrearMiembroSinCuentaInput {
  grupoId: string;
  apodo: string;
  avatarGrupoUrl?: string;
}

export interface ActualizarMembresiaPerfilInput {
  membresiaId: string;
  apodo: string;
  avatarGrupoUrl?: string;
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

export async function crearGrupo(
  supabase: LaRachaSupabaseClient,
  input: CrearGrupoInput,
): Promise<GrupoCreado> {
  const args: CrearGrupoArgs = {
    p_nombre: input.nombre,
    p_descripcion: input.descripcion ?? null,
    p_foto_perfil_url: input.fotoPerfilUrl ?? null,
    p_frecuencia_racha: input.frecuenciaRacha ?? 'semanal',
    p_apodo_admin: input.apodoAdmin ?? null,
    p_avatar_admin_url: input.avatarAdminUrl ?? null,
  };

  const { data, error } = await supabase.rpc('crear_grupo_mvp', args);

  if (error) {
    throw new Error(`No se pudo crear el grupo: ${error.message}`);
  }

  const creado = data[0];

  if (!creado) {
    throw new Error('No se pudo crear el grupo: Supabase no devolvio IDs.');
  }

  return {
    grupoId: creado.grupo_id,
    membresiaId: creado.membresia_id,
  };
}

export async function actualizarGrupo(
  supabase: LaRachaSupabaseClient,
  input: ActualizarGrupoInput,
): Promise<void> {
  const args: ActualizarGrupoArgs = {
    p_grupo_id: input.grupoId,
    p_nombre: input.nombre,
    p_descripcion: input.descripcion ?? null,
    p_foto_perfil_url: input.fotoPerfilUrl ?? null,
    p_tregua_verano_activa: input.treguaVeranoActiva ?? null,
  };

  const { error } = await supabase.rpc('actualizar_grupo_mvp', args);

  if (error) {
    throw new Error(`No se pudo actualizar el grupo: ${error.message}`);
  }
}

export async function eliminarGrupo(
  supabase: LaRachaSupabaseClient,
  grupoId: string,
): Promise<void> {
  const { error } = await supabase.rpc('eliminar_grupo_mvp', { p_grupo_id: grupoId });

  if (error) {
    throw new Error(`No se pudo eliminar el grupo: ${error.message}`);
  }
}

export async function crearMiembroSinCuenta(
  supabase: LaRachaSupabaseClient,
  input: CrearMiembroSinCuentaInput,
): Promise<string> {
  const args: CrearMiembroSinCuentaArgs = {
    p_grupo_id: input.grupoId,
    p_apodo: input.apodo,
    p_avatar_grupo_url: input.avatarGrupoUrl ?? null,
  };

  const { data, error } = await supabase.rpc('crear_miembro_sin_cuenta_mvp', args);

  if (error) {
    throw new Error(`No se pudo crear el miembro sin cuenta: ${error.message}`);
  }

  return data;
}

export async function actualizarMembresiaPropia(
  supabase: LaRachaSupabaseClient,
  input: ActualizarMembresiaPerfilInput,
): Promise<void> {
  const args: ActualizarMembresiaPropiaArgs = {
    p_membresia_id: input.membresiaId,
    p_apodo: input.apodo,
    p_avatar_grupo_url: input.avatarGrupoUrl ?? null,
  };

  const { error } = await supabase.rpc('actualizar_membresia_propia_mvp', args);

  if (error) {
    throw new Error(`No se pudo actualizar la membresia propia: ${error.message}`);
  }
}

export async function actualizarMiembroSinCuenta(
  supabase: LaRachaSupabaseClient,
  input: ActualizarMembresiaPerfilInput,
): Promise<void> {
  const args: ActualizarMiembroSinCuentaArgs = {
    p_membresia_id: input.membresiaId,
    p_apodo: input.apodo,
    p_avatar_grupo_url: input.avatarGrupoUrl ?? null,
  };

  const { error } = await supabase.rpc('actualizar_miembro_sin_cuenta_mvp', args);

  if (error) {
    throw new Error(`No se pudo actualizar el miembro sin cuenta: ${error.message}`);
  }
}

export async function eliminarMembresia(
  supabase: LaRachaSupabaseClient,
  membresiaId: string,
): Promise<void> {
  const { error } = await supabase.rpc('eliminar_membresia_mvp', {
    p_membresia_id: membresiaId,
  });

  if (error) {
    throw new Error(`No se pudo eliminar la membresia: ${error.message}`);
  }
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
