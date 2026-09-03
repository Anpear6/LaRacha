import type {
  Asistencia,
  FotoQuedada,
  Grupo,
  Insignia,
  InsigniaDesbloqueada,
  Membresia,
  ObjetoPerdido,
  OpcionGrupo,
  Quedada,
  RecuperacionRacha,
  Usuario,
} from '../../domain';
import type { Database } from './database.types';

type Tables = Database['public']['Tables'];

export function mapUsuario(row: Tables['usuarios']['Row']): Usuario {
  const usuario: Usuario = {
    id: row.id,
    nombre: row.nombre,
    username: row.username,
    email: row.email,
    fechaCreacion: row.fecha_creacion,
    fechaActualizacion: row.fecha_actualizacion,
  };

  asignarSiExiste(usuario, 'fechaNacimiento', row.fecha_nacimiento);
  asignarSiExiste(usuario, 'avatarGlobalUrl', row.avatar_global_url);

  return usuario;
}

export function mapGrupo(row: Tables['grupos']['Row']): Grupo {
  const grupo: Grupo = {
    id: row.id,
    nombre: row.nombre,
    privacidad: row.privacidad,
    frecuenciaRacha: row.frecuencia_racha,
    treguaVeranoActiva: row.tregua_verano_activa,
    fechaCreacion: row.fecha_creacion,
    fechaActualizacion: row.fecha_actualizacion,
  };

  asignarSiExiste(grupo, 'descripcion', row.descripcion);
  asignarSiExiste(grupo, 'fotoPerfilUrl', row.foto_perfil_url);

  return grupo;
}

export function mapMembresia(row: Tables['membresias']['Row']): Membresia {
  const membresia: Membresia = {
    id: row.id,
    grupoId: row.grupo_id,
    rol: row.rol,
    apodo: row.apodo,
    estado: row.estado,
    fechaEntrada: row.fecha_entrada,
    fechaActualizacion: row.fecha_actualizacion,
  };

  asignarSiExiste(membresia, 'usuarioId', row.usuario_id);
  asignarSiExiste(membresia, 'avatarGrupoUrl', row.avatar_grupo_url);

  return membresia;
}

export function mapOpcionGrupo(row: Tables['opciones_grupo']['Row']): OpcionGrupo {
  return {
    id: row.id,
    grupoId: row.grupo_id,
    tipo: row.tipo,
    valor: row.valor,
    fechaCreacion: row.fecha_creacion,
  };
}

export function mapQuedada(row: Tables['quedadas']['Row']): Quedada {
  const quedada: Quedada = {
    id: row.id,
    grupoId: row.grupo_id,
    titulo: row.titulo,
    fecha: row.fecha,
    creadaPorMembresiaId: row.creada_por_membresia_id,
    fechaCreacion: row.fecha_creacion,
    fechaActualizacion: row.fecha_actualizacion,
  };

  asignarSiExiste(quedada, 'conductorMembresiaId', row.conductor_membresia_id);
  asignarSiExiste(quedada, 'tipoPlanOpcionId', row.tipo_plan_opcion_id);
  asignarSiExiste(quedada, 'tipoPlanTexto', row.tipo_plan_texto);
  asignarSiExiste(quedada, 'momentoDia', row.momento_dia);
  asignarSiExiste(quedada, 'lugarOpcionId', row.lugar_opcion_id);
  asignarSiExiste(quedada, 'lugarTexto', row.lugar_texto);
  asignarSiExiste(quedada, 'comidaOpcionId', row.comida_opcion_id);
  asignarSiExiste(quedada, 'comidaTexto', row.comida_texto);
  asignarSiExiste(quedada, 'duracionMinutos', row.duracion_minutos);
  asignarSiExiste(quedada, 'notas', row.notas);

  return quedada;
}

export function mapFotoQuedada(row: Tables['fotos_quedada']['Row']): FotoQuedada {
  const foto: FotoQuedada = {
    id: row.id,
    quedadaId: row.quedada_id,
    url: row.url,
    fechaCreacion: row.fecha_creacion,
  };

  asignarSiExiste(foto, 'descripcion', row.descripcion);

  return foto;
}

export function mapObjetoPerdido(row: Tables['objetos_perdidos']['Row']): ObjetoPerdido {
  const objeto: ObjetoPerdido = {
    id: row.id,
    quedadaId: row.quedada_id,
    membresiaId: row.membresia_id,
    fechaCreacion: row.fecha_creacion,
  };

  asignarSiExiste(objeto, 'descripcion', row.descripcion);

  return objeto;
}

export function mapAsistencia(row: Tables['asistencias']['Row']): Asistencia {
  return {
    id: row.id,
    quedadaId: row.quedada_id,
    membresiaId: row.membresia_id,
    estado: row.estado,
  };
}

export function mapInsignia(row: Tables['insignias']['Row']): Insignia {
  const insignia: Insignia = {
    id: row.id,
    nombre: row.nombre,
    criterio: row.criterio,
    tipo: row.tipo,
    imagenUrl: row.imagen_url,
    fechaCreacion: row.fecha_creacion,
  };

  asignarSiExiste(insignia, 'descripcion', row.descripcion);

  return insignia;
}

export function mapInsigniaDesbloqueada(
  row: Tables['insignias_desbloqueadas']['Row'],
): InsigniaDesbloqueada {
  const insignia: InsigniaDesbloqueada = {
    id: row.id,
    insigniaId: row.insignia_id,
    grupoId: row.grupo_id,
    fechaDesbloqueo: row.fecha_desbloqueo,
    fechaCreacion: row.fecha_creacion,
  };

  asignarSiExiste(insignia, 'membresiaId', row.membresia_id);

  return insignia;
}

export function mapRecuperacionRacha(row: Tables['recuperaciones_racha']['Row']): RecuperacionRacha {
  const recuperacion: RecuperacionRacha = {
    id: row.id,
    grupoId: row.grupo_id,
    rachaPerdidaPeriodos: row.racha_perdida_periodos,
    periodosNecesarios: row.periodos_necesarios,
    periodosCompletados: row.periodos_completados,
    estado: row.estado,
    fechaInicio: row.fecha_inicio,
    fechaCreacion: row.fecha_creacion,
    fechaActualizacion: row.fecha_actualizacion,
  };

  asignarSiExiste(recuperacion, 'fechaFin', row.fecha_fin);

  return recuperacion;
}

function asignarSiExiste<TObjeto extends object, TClave extends keyof TObjeto>(
  objeto: TObjeto,
  clave: TClave,
  valor: TObjeto[TClave] | null,
): void {
  if (valor !== null) {
    objeto[clave] = valor;
  }
}
