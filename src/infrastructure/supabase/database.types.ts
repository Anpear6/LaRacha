export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string;
          nombre: string;
          username: string | null;
          email: string;
          avatar_global_url: string | null;
          fecha_creacion: string;
          fecha_actualizacion: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          username?: string | null;
          email: string;
          avatar_global_url?: string | null;
          fecha_creacion?: string;
          fecha_actualizacion?: string;
        };
        Update: {
          nombre?: string;
          username?: string | null;
          email?: string;
          avatar_global_url?: string | null;
          fecha_actualizacion?: string;
        };
        Relationships: [];
      };
      grupos: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string | null;
          foto_perfil_url: string | null;
          privacidad: 'privado';
          frecuencia_racha:
            | 'dos_veces_semana'
            | 'semanal'
            | 'dos_al_mes'
            | 'mensual'
            | 'seis_al_anio';
          tregua_verano_activa: boolean;
          fecha_creacion: string;
          fecha_actualizacion: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          descripcion?: string | null;
          foto_perfil_url?: string | null;
          privacidad?: 'privado';
          frecuencia_racha?:
            | 'dos_veces_semana'
            | 'semanal'
            | 'dos_al_mes'
            | 'mensual'
            | 'seis_al_anio';
          tregua_verano_activa?: boolean;
          fecha_creacion?: string;
          fecha_actualizacion?: string;
        };
        Update: {
          nombre?: string;
          descripcion?: string | null;
          foto_perfil_url?: string | null;
          privacidad?: 'privado';
          tregua_verano_activa?: boolean;
          fecha_actualizacion?: string;
        };
        Relationships: [];
      };
      membresias: {
        Row: {
          id: string;
          usuario_id: string | null;
          grupo_id: string;
          rol: 'admin' | 'miembro';
          apodo: string;
          avatar_grupo_url: string | null;
          estado: 'activa' | 'eliminada';
          fecha_entrada: string;
          fecha_actualizacion: string;
        };
        Insert: {
          id?: string;
          usuario_id?: string | null;
          grupo_id: string;
          rol?: 'admin' | 'miembro';
          apodo: string;
          avatar_grupo_url?: string | null;
          estado?: 'activa' | 'eliminada';
          fecha_entrada?: string;
          fecha_actualizacion?: string;
        };
        Update: {
          usuario_id?: string | null;
          rol?: 'admin' | 'miembro';
          apodo?: string;
          avatar_grupo_url?: string | null;
          estado?: 'activa' | 'eliminada';
          fecha_actualizacion?: string;
        };
        Relationships: [];
      };
      opciones_grupo: {
        Row: {
          id: string;
          grupo_id: string;
          tipo: 'tipo_plan' | 'lugar' | 'comida';
          valor: string;
          fecha_creacion: string;
        };
        Insert: {
          id?: string;
          grupo_id: string;
          tipo: 'tipo_plan' | 'lugar' | 'comida';
          valor: string;
          fecha_creacion?: string;
        };
        Update: {
          valor?: string;
        };
        Relationships: [];
      };
      quedadas: {
        Row: {
          id: string;
          grupo_id: string;
          titulo: string;
          fecha: string;
          conductor_membresia_id: string | null;
          creada_por_membresia_id: string;
          tipo_plan_opcion_id: string | null;
          tipo_plan_texto: string | null;
          momento_dia: 'manana' | 'tarde' | 'tarde_noche' | 'noche' | 'dia_completo' | null;
          lugar_opcion_id: string | null;
          lugar_texto: string | null;
          comida_opcion_id: string | null;
          comida_texto: string | null;
          duracion_minutos: number | null;
          notas: string | null;
          fecha_creacion: string;
          fecha_actualizacion: string;
        };
        Insert: {
          id?: string;
          grupo_id: string;
          titulo: string;
          fecha?: string;
          conductor_membresia_id?: string | null;
          creada_por_membresia_id: string;
          tipo_plan_opcion_id?: string | null;
          tipo_plan_texto?: string | null;
          momento_dia?: 'manana' | 'tarde' | 'tarde_noche' | 'noche' | 'dia_completo' | null;
          lugar_opcion_id?: string | null;
          lugar_texto?: string | null;
          comida_opcion_id?: string | null;
          comida_texto?: string | null;
          duracion_minutos?: number | null;
          notas?: string | null;
          fecha_creacion?: string;
          fecha_actualizacion?: string;
        };
        Update: {
          titulo?: string;
          fecha?: string;
          conductor_membresia_id?: string | null;
          tipo_plan_opcion_id?: string | null;
          tipo_plan_texto?: string | null;
          momento_dia?: 'manana' | 'tarde' | 'tarde_noche' | 'noche' | 'dia_completo' | null;
          lugar_opcion_id?: string | null;
          lugar_texto?: string | null;
          comida_opcion_id?: string | null;
          comida_texto?: string | null;
          duracion_minutos?: number | null;
          notas?: string | null;
          fecha_actualizacion?: string;
        };
        Relationships: [];
      };
      fotos_quedada: {
        Row: {
          id: string;
          quedada_id: string;
          url: string;
          descripcion: string | null;
          fecha_creacion: string;
        };
        Insert: {
          id?: string;
          quedada_id: string;
          url: string;
          descripcion?: string | null;
          fecha_creacion?: string;
        };
        Update: {
          url?: string;
          descripcion?: string | null;
        };
        Relationships: [];
      };
      objetos_perdidos: {
        Row: {
          id: string;
          quedada_id: string;
          membresia_id: string;
          descripcion: string | null;
          fecha_creacion: string;
        };
        Insert: {
          id?: string;
          quedada_id: string;
          membresia_id: string;
          descripcion?: string | null;
          fecha_creacion?: string;
        };
        Update: {
          descripcion?: string | null;
        };
        Relationships: [];
      };
      asistencias: {
        Row: {
          id: string;
          quedada_id: string;
          membresia_id: string;
          estado: 'asistio' | 'no_asistio';
          fecha_creacion: string;
          fecha_actualizacion: string;
        };
        Insert: {
          id?: string;
          quedada_id: string;
          membresia_id: string;
          estado: 'asistio' | 'no_asistio';
          fecha_creacion?: string;
          fecha_actualizacion?: string;
        };
        Update: {
          estado?: 'asistio' | 'no_asistio';
          fecha_actualizacion?: string;
        };
        Relationships: [];
      };
      insignias: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string | null;
          criterio: string;
          tipo: 'racha_grupo';
          imagen_url: string;
          fecha_creacion: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          descripcion?: string | null;
          criterio: string;
          tipo?: 'racha_grupo';
          imagen_url: string;
          fecha_creacion?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      insignias_desbloqueadas: {
        Row: {
          id: string;
          insignia_id: string;
          grupo_id: string;
          membresia_id: string | null;
          fecha_desbloqueo: string;
          fecha_creacion: string;
        };
        Insert: {
          id?: string;
          insignia_id: string;
          grupo_id: string;
          membresia_id?: string | null;
          fecha_desbloqueo?: string;
          fecha_creacion?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      recuperaciones_racha: {
        Row: {
          id: string;
          grupo_id: string;
          racha_perdida_periodos: number;
          periodos_necesarios: number;
          periodos_completados: number;
          estado: 'pendiente' | 'en_progreso' | 'pausada' | 'completada' | 'fallida';
          fecha_inicio: string;
          fecha_fin: string | null;
          fecha_creacion: string;
          fecha_actualizacion: string;
        };
        Insert: {
          id?: string;
          grupo_id: string;
          racha_perdida_periodos: number;
          periodos_necesarios: number;
          periodos_completados?: number;
          estado?: 'pendiente' | 'en_progreso' | 'pausada' | 'completada' | 'fallida';
          fecha_inicio: string;
          fecha_fin?: string | null;
          fecha_creacion?: string;
          fecha_actualizacion?: string;
        };
        Update: {
          periodos_completados?: number;
          estado?: 'pendiente' | 'en_progreso' | 'pausada' | 'completada' | 'fallida';
          fecha_fin?: string | null;
          fecha_actualizacion?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      registrar_quedada_completa_mvp: {
        Args: {
          p_grupo_id: string;
          p_titulo: string;
          p_creada_por_membresia_id: string;
          p_fecha?: string;
          p_conductor_membresia_id?: string | null;
          p_tipo_plan_texto?: string | null;
          p_momento_dia?: 'manana' | 'tarde' | 'tarde_noche' | 'noche' | 'dia_completo' | null;
          p_lugar_texto?: string | null;
          p_comida_texto?: string | null;
          p_duracion_minutos?: number | null;
          p_notas?: string | null;
          p_asistentes_membresia_ids?: string[];
          p_objetos_perdidos_membresia_ids?: string[];
          p_fotos?: Json;
        };
        Returns: string;
      };
      editar_quedada_completa_mvp: {
        Args: {
          p_quedada_id: string;
          p_titulo: string;
          p_fecha: string;
          p_conductor_membresia_id?: string | null;
          p_tipo_plan_texto?: string | null;
          p_momento_dia?: 'manana' | 'tarde' | 'tarde_noche' | 'noche' | 'dia_completo' | null;
          p_lugar_texto?: string | null;
          p_comida_texto?: string | null;
          p_duracion_minutos?: number | null;
          p_notas?: string | null;
          p_asistentes_membresia_ids?: string[];
          p_objetos_perdidos_membresia_ids?: string[];
          p_fotos?: Json;
        };
        Returns: undefined;
      };
      desbloquear_insignias_racha_mvp: {
        Args: {
          p_grupo_id: string;
          p_desbloqueos?: Json;
        };
        Returns: string[];
      };
      crear_grupo_mvp: {
        Args: {
          p_nombre: string;
          p_descripcion?: string | null;
          p_foto_perfil_url?: string | null;
          p_frecuencia_racha?:
            | 'dos_veces_semana'
            | 'semanal'
            | 'dos_al_mes'
            | 'mensual'
            | 'seis_al_anio';
          p_apodo_admin?: string | null;
          p_avatar_admin_url?: string | null;
        };
        Returns: Array<{
          grupo_id: string;
          membresia_id: string;
        }>;
      };
      actualizar_grupo_mvp: {
        Args: {
          p_grupo_id: string;
          p_nombre: string;
          p_descripcion?: string | null;
          p_foto_perfil_url?: string | null;
          p_tregua_verano_activa?: boolean | null;
        };
        Returns: undefined;
      };
      eliminar_grupo_mvp: {
        Args: {
          p_grupo_id: string;
        };
        Returns: undefined;
      };
      crear_miembro_sin_cuenta_mvp: {
        Args: {
          p_grupo_id: string;
          p_apodo: string;
          p_avatar_grupo_url?: string | null;
        };
        Returns: string;
      };
      actualizar_membresia_propia_mvp: {
        Args: {
          p_membresia_id: string;
          p_apodo: string;
          p_avatar_grupo_url?: string | null;
        };
        Returns: undefined;
      };
      actualizar_miembro_sin_cuenta_mvp: {
        Args: {
          p_membresia_id: string;
          p_apodo: string;
          p_avatar_grupo_url?: string | null;
        };
        Returns: undefined;
      };
      eliminar_membresia_mvp: {
        Args: {
          p_membresia_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
