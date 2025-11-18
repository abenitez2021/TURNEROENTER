import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CrearPuntoAtencionDto } from './dto/crear-puntoatencion.dto';
import { ActualizarPuntoAtencionDto } from './dto/actualizar-puntoatencion.dto';
import { InactivarPuntoDto } from './dto/inactivar-puntoatencion.dto';

@Injectable()
export class PuntoAtencionService {
    private logger = new Logger('PuntoAtencionService');

    constructor(private dataSource: DataSource) {}

    // 📌 Crear un nuevo punto de atención
    async crearPuntoAtencion(dto: CrearPuntoAtencionDto) {
        try {
            const sp = 'CALL sp_puntoatencion_crear(?, ?, ?, ?)';
            const parametros = [dto.nombre, dto.descripcion, dto.ubicacion, dto.activo];
            await this.dataSource.query(sp, parametros);

            return { ok: true, message: 'Punto de atención creado correctamente.' };
        } catch (error) {
            this.logger.error('Error al crear punto de atención', error);
            return { ok: false, message: 'No se pudo crear el punto de atención.' };
        }
    }

    // 📌 Listar puntos de atención
    async listarPuntosAtencion() {
        try {
            const sp = 'CALL sp_puntoatencion_listar()';
            const result = await this.dataSource.query(sp);
            return result[0];
        } catch (error) {
            this.logger.error('Error al listar puntos de atención', error);
            return { ok: false, message: 'No se pudieron listar los puntos de atención.' };
        }
    }

    // 📌 Editar un punto de atención
    async editarPuntoAtencion(dto: ActualizarPuntoAtencionDto) {
        try {
            const sp = 'CALL sp_puntoatencion_editar(?, ?, ?, ?, ?)';
            const parametros = [dto.id, dto.nombre, dto.descripcion, dto.ubicacion, dto.activo];
            await this.dataSource.query(sp, parametros);

            return { ok: true, message: 'Punto de atención actualizado correctamente.' };
        } catch (error) {
            this.logger.error('Error al editar punto de atención', error);
            return { ok: false, message: 'No se pudo actualizar el punto de atención.' };
        }
    }

    // 📌 Inactivar un punto de atención
    async inactivarPuntoAtencion(dto: InactivarPuntoDto) {
        try {
            const sp = 'update puntoatencion set activo=false where id= ?';
            const parametros = [dto.id];
            await this.dataSource.query(sp, parametros);

            return { ok: true, message: 'Punto de atención desactivado correctamente.' };
        } catch (error) {
            this.logger.error('Error al editar punto de atención', error);
            return { ok: false, message: 'No se pudo actualizar el punto de atención.' };
        }
    }


     async marcarDisponible(id_punto: number, id_usuario?: number) {
    // Podés registrar id_usuario en otra tabla de historial si querés
    await this.dataSource.query(
      `UPDATE puntoatencion 
       SET disponible = 1, fecha_disponible = NOW()
       WHERE id = ?`,
      [id_punto],
    );
    return { ok: true };
  }

  async marcarOcupado(id_punto: number) {
    await this.dataSource.query(
      `UPDATE puntoatencion 
       SET disponible = 0, fecha_disponible = NULL
       WHERE id = ?`,
      [id_punto],
    );
    return { ok: true };
  }

  async listarDisponiblesEnCola() {
    const rows = await this.dataSource.query(
      `SELECT id, nombre, disponible, fecha_disponible
         FROM puntoatencion
        WHERE disponible = 1
        ORDER BY fecha_disponible ASC`,
    );

    return { ok: true, boxes: rows };
  }


}
