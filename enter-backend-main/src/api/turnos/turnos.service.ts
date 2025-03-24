import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CrearTurnoDto } from './dto/crear-turno.dto';

import * as fs from 'fs';
import { exec } from 'child_process';


const PDFDocument = require('pdfkit');

@Injectable()
export class TurnosService {
    private logger = new Logger('TurnosService');

    constructor(private dataSource: DataSource) { }

    async crearTurno(dto: CrearTurnoDto) {
        try {
            const visitaResult = await this.dataSource.query(
                `SELECT id FROM visitas WHERE nro_documento = ? ORDER BY id DESC LIMIT 1`,
                [dto.nro_documento]
            );

            if (!visitaResult.length) {
                throw new Error('No se encontró una visita con ese número de documento.');
            }

            const id_visita = visitaResult[0].id;

            console.log("id_Visita: ", id_visita, "id_tramite: ", dto.id_tramite)

            const spResult = await this.dataSource.query(
                `CALL sp_turnos_crear(?, ?)`,
                [id_visita, dto.id_tramite]
            );

            const ultimoTurno = await this.dataSource.query(
                `SELECT id FROM turnos WHERE id_visita = ? ORDER BY id DESC LIMIT 1`,
                [id_visita]
            );
            const idTurno = ultimoTurno[0]?.id;


            // 🔍 Obtener detalles del turno recién creado
            const resultTicket = await this.dataSource.query(`CALL sp_turnos_obtener_detalle(?)`, [idTurno]);
            const turnoData = resultTicket[0][0];

            // 🖨️ Imprimir ticket
            await this.printTurnoTicket(turnoData);

            return { ok: true, message: 'Turno creado correctamente.', result: turnoData };
        } catch (error) {
            this.logger.error('Error al crear el turno', error);
            return { ok: false, message: 'No se pudo crear el turno.', error };
        }
    }

    // imprimir pdf de ticket de turno


    /**
 * ✨ Generar e imprimir ticket de turno
 */

    private async printTurnoTicket(turnoData: any): Promise<void> {
        const filePath = `C:\\ENTER\\TURNEROENTER\\impresora\\turno.pdf`;
        const printerName = `POS80`; // Nombre exacto de la impresora
        const sumatraPath = `C:\\Users\\aldo-\\AppData\\Local\\SumatraPDF\\SumatraPDF.exe`; // Ruta de SumatraPDF

        const logoPath = "C:\\ENTER\\TURNEROENTER\\impresora\\logo.png";

        console.log("📈 Datos recibidos para imprimir ticket de turno:", turnoData);

        const doc = new PDFDocument({
            size: [226, 226], // 80mm x 80mm
            margins: { top: 5, left: 5, right: 5, bottom: 5 },
        });

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // 🖼️ Logo si existe
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, { width: 180, align: "center" }).moveDown();
        }

        // Espaciado vertical
        doc.font("Helvetica-Bold")
            .fontSize(12)
            .text(" ", { align: "center" })
            .text(" ", { align: "center" })
            .text(" ", { align: "center" })
            .text(" ", { align: "center" })
            .text(" ", { align: "center" })
            .text(" ", { align: "center" })
            .moveDown(0.5); // Espacio reducido para mejor organización


        // 🔹 Título
        doc.font("Helvetica-Bold")
            .fontSize(12)
            .text("TICKET DE TURNO", { align: "center" })
            .moveDown(0.5);

        // ℹ️ Datos del turno
        doc.font("Helvetica-Bold").fontSize(9).text("Turno: ", { continued: true });
        doc.font("Helvetica").text(`${turnoData.codigo_turno}`);

        doc.font("Helvetica-Bold").text("Nombre: ", { continued: true });
        doc.font("Helvetica").text(`${turnoData.nombre} ${turnoData.apellido}`);

        doc.font("Helvetica-Bold").text("Documento: ", { continued: true });
        doc.font("Helvetica").text(`${turnoData.nro_documento}`);

        doc.font("Helvetica-Bold").text("Trámite: ", { continued: true });
        doc.font("Helvetica").text(`${turnoData.tramite}`);

        doc.font("Helvetica-Bold").text("Fecha: ", { continued: true });
        doc.font("Helvetica").text(`${new Date().toLocaleString()}`);

        doc.moveDown(0.5);
        doc.font("Helvetica")
            .fontSize(8)
            .text("Por favor, espere a ser llamado.", { align: "center" })
            .text("Gracias por su visita.", { align: "center" })
            .text("ENTER 2.0 by CCS S.A.", { align: "center" });

        doc.end();

        // 📄 Esperar a terminar el PDF para imprimir
        stream.on("finish", () => {
            console.log("✅ PDF del turno generado correctamente.");

            const printCommand = `powershell -Command Start-Process -FilePath '${sumatraPath}' -ArgumentList '-print-to \"${printerName}\" -print-settings fit \"${filePath}\"' -NoNewWindow -Wait`;

            exec(printCommand, (error) => {
                if (error) {
                    console.error(`❌ Error al imprimir el ticket del turno: ${error.message}`);
                    return;
                }
                console.log("✅ Ticket del turno enviado a imprimir correctamente.");
            });
        });
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
            // 1️⃣ Buscar el turno pendiente
            const turno = await this.dataSource.query(
                `SELECT * FROM turnos WHERE id = ? AND estado = 'PENDIENTE'`,
                [id]
            );

            if (turno.length === 0) {
                return { ok: false, message: 'El turno no está disponible o ya ha sido atendido.' };
            }

            const turnoData = turno[0];

            // 2️⃣ Marcar como atendiendo
            await this.dataSource.query(
                `UPDATE turnos SET estado = 'ATENDIENDO', fecha_llamado = NOW(), box = ? WHERE id = ?`,
                [box, id]
            );

            // 3️⃣ Obtener ruta de imágenes
            const sp = 'call sp_visitas_buscar_list(?)';
            const parametros = [turnoData.documento];
            const result = await this.dataSource.query(sp, parametros);
            const visita = result[0][0]; // asumimos que siempre hay al menos una visita

            const turnoConImagenes = {
                ...turnoData,
                nro_documento: visita.documento,
                id_visita: visita.idVisita,
                foto: `http://localhost:${process.env.API_PORT}/api/visitas/ver-archivo/nro/${visita.documento}/archivo/foto.png`,
                imagenFrente: `http://localhost:${process.env.API_PORT}/api/visitas/ver-archivo/nro/${visita.documento}/archivo/frente.png`,
                imagenDorso: `http://localhost:${process.env.API_PORT}/api/visitas/ver-archivo/nro/${visita.documento}/archivo/dorso.png`
            };

            console.log(" imagen frente", turnoConImagenes.imagenFrente)
            console.log(" imagen dorso", turnoConImagenes.imagenDorso)

            return {
                ok: true,
                message: 'Turno llamado correctamente.',
                turno: turnoConImagenes
            };
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
