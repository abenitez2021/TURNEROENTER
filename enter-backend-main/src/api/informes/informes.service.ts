import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class InformesService {
  logger = new Logger('InformesService');

  constructor(private dataSource: DataSource) { }
  //aprobado
  async informeMovimientos(filtros: any) {
    const { fechaDesde, fechaHasta, idTramite, idBox, idUsuario } = filtros;

    const condiciones = [];
    const params = [];

    if (fechaDesde) {
      condiciones.push("t.fecha_emision >= ?");
      params.push(fechaDesde);
    }

    if (fechaHasta) {
      condiciones.push("t.fecha_emision <= ?");
      params.push(fechaHasta);
    }

    if (idTramite) {
      condiciones.push("t.id_tramite = ?");
      params.push(idTramite);
    }

    if (idBox) {
      condiciones.push("t.box = ?");
      params.push(idBox);
    }

    if (idUsuario) {
      condiciones.push("ht.id_usuario = ?");
      params.push(idUsuario);
    }

    const whereClause = condiciones.length > 0 ? `WHERE ${condiciones.join(" AND ")}` : "";

    const query = `
        SELECT 
        t.codigo_turno, 
        (select concat(nombre, " ", apellido) from visitas v where v.id=t.id_visita) as visitante, 
        (select nro_documento from visitas v where v.id=t.id_visita) as nro_documento,
        t.tramite, 
        (select nombre from puntoatencion p where p.id=t.box) as punto, 
        COALESCE((select concat(nombre, " ", apellido) from usuarios u where u.id= ht.id_usuario ),
        (select concat(nombre, " ", apellido) from usuarios u where u.id= v.id_usuario )) as usuario,
        COALESCE(ht.estado, t.estado) AS estado,
        t.fecha_emision, 
        t.fecha_llamado, 
        t.fecha_finalizacion 
        FROM turnos t 
        LEFT JOIN historial_turnos ht 
        ON ht.id_turno = t.id AND ht.estado = t.estado
        join visitas v on v.id=t.id_visita
        ${whereClause}
        ORDER BY t.fecha_emision DESC;
    `;

    const result = await this.dataSource.query(query, params);
    return { ok: true, result };
  }

  //aprobado
  async graficoTramites(filtros: any) {
    const { fechaDesde, fechaHasta } = filtros;

    const query = `
      SELECT tr.nombre AS tramite, COUNT(*) AS cantidad
      FROM turnos t
      JOIN tramites tr ON tr.id = t.id_tramite
      WHERE t.fecha_emision BETWEEN ? AND ?
      GROUP BY tr.nombre
      ORDER BY cantidad DESC;
    `;

    const result = await this.dataSource.query(query, [fechaDesde, fechaHasta]);
    return { ok: true, result };
  }

  async graficoUsuarios(filtros: any) {
    const { fechaDesde, fechaHasta } = filtros;

    const query = `
      select concat(U.nombre, " ", U.apellido) as USUARIO, COUNT(*) as CANTIDAD 
     from usuarios u join historial_turnos ht on ht.id_usuario = u.id where ht.estado='FINALIZADO'
     and ht.fecha between ? and ?
     group by USUARIO
     order by CANTIDAD
    `;

    const result = await this.dataSource.query(query, [fechaDesde, fechaHasta]);
    return { ok: true, result };
  }
  //aprobado
  async informeTiemposEspera(filtros: any) {
    const { fechaDesde, fechaHasta } = filtros;

    const query = `
       SELECT
        tr.nombre AS tramite,
        p.nombre AS punto,
        u.nombre AS usuario,
        AVG(TIMESTAMPDIFF(MINUTE, t.fecha_emision, t.fecha_llamado)) AS tiempo_promedio,
        MAX(TIMESTAMPDIFF(MINUTE, t.fecha_emision, t.fecha_llamado)) AS tiempo_maximo,
        MIN(TIMESTAMPDIFF(MINUTE, t.fecha_emision, t.fecha_llamado)) AS tiempo_minimo
      FROM turnos t
      JOIN tramites tr ON tr.id = t.id_tramite
      JOIN puntoatencion p ON p.id = t.box
      join visitas v on v.id = t.id_visita 
      JOIN usuarios u ON u.id = v.id_usuario
      WHERE t.fecha_llamado IS NOT NULL
        AND t.fecha_emision BETWEEN ? AND ?
      GROUP BY tr.nombre, p.nombre, u.nombre;
    `;

    const result = await this.dataSource.query(query, [fechaDesde, fechaHasta]);
    return { ok: true, result };
  }


  async getResumenAtencion() {
    const result = await this.dataSource.query(`
      SELECT
  (SELECT COUNT(*) FROM turnos WHERE estado = 'PENDIENTE' AND DATE(fecha_emision) = CURDATE()) AS total_pendientes,
  (SELECT COUNT(*) FROM turnos WHERE estado = 'ATENDIENDO' AND DATE(fecha_emision) = CURDATE()) AS total_atendiendo,
  (SELECT COUNT(*) FROM turnos WHERE estado = 'FINALIZADO' AND DATE(fecha_emision) = CURDATE()) AS total_finalizados,
  (SELECT COUNT(*) FROM turnos WHERE estado = 'CANCELADO' AND DATE(fecha_emision) = CURDATE()) AS total_cancelados,
  (SELECT COUNT(*) FROM turnos WHERE estado = 'REASIGNADO' AND DATE(fecha_emision) = CURDATE()) AS total_reasignados,
  (
    SELECT ROUND(AVG(TIMESTAMPDIFF(MINUTE, fecha_emision, fecha_llamado)), 1)
    FROM turnos
    WHERE fecha_llamado IS NOT NULL AND DATE(fecha_emision) = CURDATE()
  ) AS promedio_espera_min;
    `);
    return result[0];
  }

}
