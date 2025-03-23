import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CrearTramiteDto } from './dto/crear-tramite.dto';

@Injectable()
export class TramitesService {
    private logger = new Logger('TramitesService');

    constructor(private dataSource: DataSource) {}

    async crearTramite(dto: CrearTramiteDto) {
        try {
            const sp = 'CALL sp_tramites_crear(?, ?, ?, ?)';
            const parametros = [dto.nombre, dto.descripcion, dto.prioridad, dto.tiempo_estimado];
            const result = await this.dataSource.query(sp, parametros);

            return { ok: true };

        } catch (error) {
            this.logger.error('Error al crear trámite', error);
            return { ok: false, message: 'No se pudo crear el trámite.' };
        }
    }



    // 📌 Listar trámites
    async listarTramites() {
        try {
            const sp = 'CALL sp_tramites_listar()';
            const result = await this.dataSource.query(sp);
            return result[0];
        } catch (error) {
            this.logger.error('Error al listar trámites', error);
            return { ok: false, message: 'No se pudieron listar los trámites.' };
        }
    }

    // 📌 Editar un trámite
    async editarTramite(id: number, nombre: string, descripcion: string, prioridad: string, tiempoEstimado: number) {
        try {
            const sp = 'CALL sp_tramites_editar(?, ?, ?, ?, ?)';
            const parametros = [
                id,
                nombre,
                descripcion,
                prioridad,
                tiempoEstimado !== undefined && tiempoEstimado !== null ? tiempoEstimado : 10 // ✅ Asegura que no sea NULL ni 0
            ];
            console.log("📌 Parámetros enviados a MySQL:", parametros); // 🛠 Depuración
    
            await this.dataSource.query(sp, parametros);
            return { ok: true, message: 'Trámite actualizado correctamente.' };
        } catch (error) {
            this.logger.error('❌ Error al editar trámite:', error);
            return { ok: false, message: 'No se pudo actualizar el trámite.', error };
        }
    }
    
    
}
