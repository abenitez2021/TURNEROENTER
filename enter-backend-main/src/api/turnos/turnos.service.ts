import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CrearTurnoDto } from './dto/crear-turno.dto';

@Injectable()
export class TurnosService {
    private logger = new Logger('TurnosService');

    constructor(private dataSource: DataSource) { }

    async crearTurno(dto: CrearTurnoDto) {
        try {
            // 📌 Buscar el ID de la visita con el número de documento
            const visitaResult = await this.dataSource.query(
                `SELECT id FROM visitas WHERE nro_documento = ? ORDER BY id DESC LIMIT 1`,
                [dto.nro_documento]
            );

            if (!visitaResult.length) {
                throw new Error('No se encontró una visita con ese número de documento.');
            }

            const id_visita = visitaResult[0].id;

            // 📌 Formatear la fecha para evitar errores en MySQL
            const fechaFormateada = dto.fecha_hora.toISOString().slice(0, 19).replace("T", " ");

            // 📌 Insertar el turno en la base de datos usando `sp_turnos_crear`
            const spResult = await this.dataSource.query(
                `CALL sp_turnos_crear(?, ?)`,
                [id_visita, dto.id_tramite]
            );

            return { ok: true, message: 'Turno creado correctamente.', result: spResult };
        } catch (error) {
            this.logger.error('Error al crear el turno', error);
            return { ok: false, message: 'No se pudo crear el turno.', error };
        }
    }
    // 📌 Listar Turnos
    async listarTurnos(estado?: string, prioridades?: string[], tramites?: number[], box?: number) {
        try {
            const parametros = [
                estado || null,
                prioridades ? prioridades.join(",") : null, // Convertir array en string separado por comas
                tramites ? tramites.join(",") : null, // Convertir array en string separado por comas
                box !== undefined ? box : null
            ];

            const result = await this.dataSource.query('CALL sp_turnos_listar(?, ?, ?, ?)', parametros);

            return { ok: true, message: 'Turnos listados correctamente.', result: result[0] };
        } catch (error) {
            console.error('❌ Error al listar turnos:', error);
            return { ok: false, message: 'No se pudieron listar los turnos.' };
        }
    }

    // 📌 Llamar Turno (Actualizar estado a ATENDIENDO)
    async llamarTurno(id: number, box: number) {
        try {
            // 1️⃣ Verificar si el turno existe y está pendiente
            const turno = await this.dataSource.query(
                `SELECT * FROM turnos WHERE id = ? AND estado = 'PENDIENTE'`,
                [id]
            );

            if (turno.length === 0) {
                return { ok: false, message: 'El turno no está disponible o ya ha sido atendido.' };
            }

            // 2️⃣ Actualizar estado del turno a "ATENDIENDO" y asignar box
            await this.dataSource.query(
                `UPDATE turnos SET estado = 'ATENDIENDO', fecha_llamado = NOW(), box = ? WHERE id = ?`,
                [box, id]
            );

            return { ok: true, message: 'Turno llamado correctamente.', turno: turno[0] };
        } catch (error) {
            this.logger.error('❌ Error al llamar turno', error);
            return { ok: false, message: 'No se pudo llamar el turno.' };
        }
    }




    // turnos.service.ts
    async obtenerUltimosTurnosLlamados() {
        try {
            const result = await this.dataSource.query(`
            SELECT 
            t.codigo_turno,
            v.nombre AS nombre_visitante,
            v.apellido AS apellido_visitante,
            p.nombre AS nombre_box,
            t.fecha_llamado
            FROM turnos t 
            join visitas v on t.id_visita = v.id
            join puntoatencion p on p.id =t.box 
            where t.estado ="ATENDIENDO"
            ORDER BY t.fecha_llamado DESC
            LIMIT 5;
      `);

            return { ok: true, turnos: result };
        } catch (error) {
            console.error("❌ Error al obtener últimos turnos llamados:", error);
            return { ok: false, message: "No se pudieron obtener los turnos." };
        }
    }


    // 📌 Actualizar Turno (reasignar turno)

    async reasignarTurno(idTurno: number, idTramite: number): Promise<any> {
        try {
            // 1. Traer nombre del nuevo trámite
            const tramiteResult = await this.dataSource.query(
                `SELECT nombre FROM tramites WHERE id = ?`,
                [idTramite]
            );

            if (!tramiteResult || tramiteResult.length === 0) {
                return { ok: false, message: 'El nuevo trámite no fue encontrado.' };
            }

            const nuevoTramiteNombre = tramiteResult[0].nombre;

            // 2. Actualizar el turno con los nuevos datos
            await this.dataSource.query(
                `UPDATE turnos 
                 SET estado = 'PENDIENTE',
                     tramite = ?,
                     id_tramite = ?,
                     fecha_llamado = NULL,
                     box = NULL
                 WHERE id = ?`,
                [nuevoTramiteNombre, idTramite, idTurno]
            );

            return { ok: true, message: 'Turno reasignado correctamente.' };
        } catch (error) {
            this.logger.error('❌ Error al reasignar turno', error);
            return { ok: false, message: 'No se pudo reasignar el turno.' };
        }
    }



    // 📌 Finalizar Turno y Registrar Salida
    async finalizarTurno(id: number) {
        try {
            // 1️⃣ Ejecutar SP para finalizar el turno
            await this.dataSource.query('CALL sp_turnos_finalizar(?)', [id]);

            // 2️⃣ Obtener el ID de la visita asociada al turno finalizado
            const result = await this.dataSource.query(
                'SELECT id_visita FROM turnos WHERE id = ?',
                [id]
            );

            if (result.length === 0) {
                return { ok: false, message: 'No se encontró el turno.' };
            }

            const idVisita = result[0].id_visita;

            // 3️⃣ Ejecutar SP para registrar la salida de la visita
            await this.dataSource.query('CALL sp_visitas_salida(?)', [idVisita]);

            return { ok: true, message: 'Turno finalizado y salida registrada correctamente.' };
        } catch (error) {
            this.logger.error('❌ Error al finalizar turno y registrar salida', error);
            return { ok: false, message: 'No se pudo finalizar el turno.' };
        }
    }



}
