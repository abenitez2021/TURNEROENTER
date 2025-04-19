export class HistorialTurnoDto {
    id_turno: number;
    codigo_turno: string;
    estado: string;
    comentario?: string;
    fue_reasignado?: boolean;
    id_tramite_anterior?: number;
    id_tramite_nuevo?: number;
    llamado_numero?: number;
    duracion_atencion?: number;
    id_puntoatencion?: number;
    id_usuario?: number;
    origen?: string;
    ip_cliente?: string;
    observaciones_tecnicas?: string;
  }
  