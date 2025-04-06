import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CrearTurnoDto } from './dto/crear-turno.dto';

import * as fs from 'fs';
import { exec } from 'child_process';
import { HistorialTurnoDto } from './dto/historial-turno.dto';


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


    //Historial del turno 
    async registrarHistorialTurno(dto: HistorialTurnoDto) {
        try {
            const {
                id_turno,
                codigo_turno,
                estado,
                comentario = null,
                fue_reasignado = false,
                id_tramite_anterior = null,
                id_tramite_nuevo = null,
                llamado_numero = null,
                duracion_atencion = null,
                id_puntoatencion = null,
                id_usuario = null,
                origen = null,
                ip_cliente = null,
                observaciones_tecnicas = null
            } = dto;

            await this.dataSource.query('CALL sp_historial_turnos_insertar(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                id_turno,
                codigo_turno,
                estado,
                comentario,
                fue_reasignado,
                id_tramite_anterior,
                id_tramite_nuevo,
                llamado_numero,
                duracion_atencion,
                id_puntoatencion,
                id_usuario,
                origen,
                ip_cliente,
                observaciones_tecnicas
            ]);

            return { ok: true, message: 'Historial de turno registrado correctamente' };
        } catch (error) {
            this.logger.error('❌ Error al registrar historial de turno', error);
            return { ok: false, message: 'No se pudo registrar el historial del turno' };
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

    // ✅ Este método devuelve los datos del turno sin modificar el estado
    async getDetalleTurno(id: number) {
        try {
            console.log("🔍 Buscando detalle del turno ID:", id);

            const resultado = await this.dataSource.query(
                `SELECT t.*, v.nro_documento 
             FROM turnos t 
             JOIN visitas v ON t.id_visita = v.id 
             WHERE t.id = ?`,
                [id]
            );

            console.log("🧾 Resultado del JOIN:", resultado);

            if (resultado.length === 0) {
                return { ok: false, message: 'El turno no existe o no tiene visita asociada.' };
            }

            const turnoData = resultado[0];
            const nroDocumento = turnoData.nro_documento;
            console.log("🧍 Documento encontrado:", nroDocumento);

            // Llamamos al SP que devuelve los datos de la visita
            const sp = 'call sp_visitas_buscar_list(?)';
            const result = await this.dataSource.query(sp, [nroDocumento]);
            const visita = result[0][0];

            console.log("📷 Datos del SP:", visita);

            // Si existe un turno origen, buscamos datos adicionales
            let tramiteAnterior = null;
            let boxAnterior = null;

            if (turnoData.turno_origen_id) {
                const resultadoTransferencia = await this.dataSource.query(
                    `SELECT t2.nombre AS nombre_tramite_anterior, p.nombre AS nombre_box
                    FROM turnos t 
                    JOIN historial_turnos ht ON t.turno_origen_id = ht.id_turno
                    JOIN tramites t2 ON t2.id = ht.id_tramite_anterior
                    JOIN puntoatencion p ON p.id = ht.id_puntoatencion
                    WHERE t.id = ?`,
                    [id]
                );

                if (resultadoTransferencia.length > 0) {
                    tramiteAnterior = resultadoTransferencia[0].nombre_tramite_anterior;
                    boxAnterior = resultadoTransferencia[0].nombre_box;
                }
            }


            const turnoConImagenes = {
                ...turnoData,
                nro_documento: visita.documento,
                id_visita: visita.idVisita,
                foto: `http://localhost:${process.env.API_PORT}/api/visitas/ver-archivo/nro/${visita.documento}/archivo/foto.png`,
                imagenFrente: `http://localhost:${process.env.API_PORT}/api/visitas/ver-archivo/nro/${visita.documento}/archivo/frente.png`,
                imagenDorso: `http://localhost:${process.env.API_PORT}/api/visitas/ver-archivo/nro/${visita.documento}/archivo/dorso.png`,
                nombre_visitante: visita.nombre, // 🔥 estos dos son clave para que el frontend los lea bien
                apellido_visitante: visita.apellido,
                
                // 🔁 Datos de la transferencia (si los hay)
                tramite_anterior: tramiteAnterior,
                box_anterior: boxAnterior,
            };


            return {
                ok: true,
                message: 'Detalle del turno obtenido.',
                turno: turnoConImagenes,
            };

        } catch (error) {
            console.error('❌ Error al obtener detalle del turno:', error);
            return { ok: false, message: 'No se pudo obtener el detalle del turno.' };
        }
    }


    // 📌 Llamar Turno (Actualizar estado a ATENDIENDO)
    // 📌 Llamar Turno (Actualizar estado a ATENDIENDO)
async llamarTurno(id: number, box: number) {
    try {
      // ✅ Aceptar turnos en estado PENDIENTE o REASIGNADO
      const turno = await this.dataSource.query(
        `SELECT * FROM turnos WHERE id = ? AND estado IN ('PENDIENTE', 'REASIGNADO')`,
        [id]
      );
  
      if (turno.length === 0) {
        return { ok: false, message: 'El turno no está disponible o ya ha sido atendido.' };
      }
  
      const turnoData = turno[0];
  
      // 🔄 Actualizar a ATENDIENDO
      await this.dataSource.query(
        `UPDATE turnos SET estado = 'ATENDIENDO', fecha_llamado = NOW(), box = ? WHERE id = ?`,
        [box, id]
      );
  
      // 📸 Obtener imágenes
      const sp = 'call sp_visitas_buscar_list(?)';
      const parametros = [turnoData.documento];
      const result = await this.dataSource.query(sp, parametros);
      const visita = result[0][0]; // asumimos que siempre hay una visita
  
      const turnoConImagenes = {
        ...turnoData,
        nro_documento: visita.documento,
        id_visita: visita.idVisita,
        foto: `http://localhost:${process.env.API_PORT}/api/visitas/ver-archivo/nro/${visita.documento}/archivo/foto.png`,
        imagenFrente: `http://localhost:${process.env.API_PORT}/api/visitas/ver-archivo/nro/${visita.documento}/archivo/frente.png`,
        imagenDorso: `http://localhost:${process.env.API_PORT}/api/visitas/ver-archivo/nro/${visita.documento}/archivo/dorso.png`
      };
  
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
    async reasignarTurno(idTurno: number, idTramiteNuevo: number, comentario: string, idUsuario?: number, ipCliente?: string) {
        try {
            const turnoOriginal = await this.dataSource.query(`SELECT * FROM turnos WHERE id = ?`, [idTurno]);
            if (!turnoOriginal.length) return { ok: false, message: 'No se encontró el turno a reasignar.' };

            const turno = turnoOriginal[0];
            const tramiteNuevo = await this.dataSource.query(`SELECT nombre FROM tramites WHERE id = ?`, [idTramiteNuevo]);
            if (!tramiteNuevo.length) return { ok: false, message: 'No se encontró el nuevo trámite.' };

            const nombreTramiteNuevo = tramiteNuevo[0].nombre;

            await this.dataSource.query(`UPDATE turnos SET estado = 'FINALIZADO', fecha_finalizacion = NOW() WHERE id = ?`, [idTurno]);

            const resultInsert = await this.dataSource.query(
                `INSERT INTO turnos (id_visita, codigo_turno, estado, tramite, fecha_emision, id_tramite, box, turno_origen_id)
                 VALUES (?, ?, 'REASIGNADO', ?, NOW(), ?, ?, ?)`,
                [turno.id_visita, turno.codigo_turno, nombreTramiteNuevo, idTramiteNuevo, turno.box || null, idTurno]
            );
            const nuevoTurnoId = resultInsert.insertId;

            await this.registrarHistorialTurno({
                id_turno: nuevoTurnoId,
                codigo_turno: turno.codigo_turno,
                estado: 'REASIGNADO',
                comentario: comentario || `Reasignado desde turno ${idTurno} al trámite ${nombreTramiteNuevo}`,
                fue_reasignado: true,
                id_tramite_anterior: turno.id_tramite,
                id_tramite_nuevo: idTramiteNuevo,
                id_puntoatencion: turno.box || null,
                id_usuario: idUsuario || null,
                origen: 'LLAMADOR',
                ip_cliente: ipCliente || null
            });

            return {
                ok: true,
                message: 'Turno reasignado correctamente.',
                nuevo_turno_id: nuevoTurnoId
            };
        } catch (error) {
            this.logger.error('❌ Error al reasignar turno', error);
            return { ok: false, message: 'No se pudo reasignar el turno.' };
        }
    }


    // 📌 Cancelar Turno
    async cancelarTurno(idTurno: number, idUsuario: number, ipCliente: string, comentario: string = '', observaciones: string = '') {
        try {
            // Obtener datos actuales del turno
            const turno = await this.dataSource.query(`SELECT * FROM turnos WHERE id = ?`, [idTurno]);
            if (!turno || turno.length === 0) {
                return { ok: false, message: 'No se encontró el turno.' };
            }

            const turnoData = turno[0];

            // 1️⃣ Actualizar el estado del turno a CANCELADO
            await this.dataSource.query(
                `UPDATE turnos SET estado = 'CANCELADO' WHERE id = ?`,
                [idTurno]
            );

            // 2️⃣ Insertar en el historial de turnos
            await this.dataSource.query(
                `CALL sp_historial_turno_insertar(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    idTurno,
                    turnoData.codigo_turno,
                    'CANCELADO',
                    comentario,
                    false,                        // fue_reasignado
                    turnoData.id_tramite,        // id_tramite_anterior
                    null,                        // id_tramite_nuevo
                    1,                           // llamado_numero (o el real si lo estás contando)
                    null,                        // duracion_atencion
                    turnoData.box,
                    idUsuario,
                    'llamador',
                    ipCliente,
                    observaciones
                ]
            );

            return { ok: true, message: 'Turno cancelado correctamente.' };
        } catch (error) {
            this.logger.error('❌ Error al cancelar turno', error);
            return { ok: false, message: 'No se pudo cancelar el turno.' };
        }
    }


    // 📌 Finalizar Turno y Registrar Salida
    async finalizarTurno(id: number, idUsuario: number, ip: string) {
        try {
            // Obtener turno con detalles
            const turnoResult = await this.dataSource.query(`SELECT * FROM turnos WHERE id = ?`, [id]);
            if (!turnoResult.length) return { ok: false, message: 'No se encontró el turno.' };

            const turno = turnoResult[0];

            // Finalizar el turno
            await this.dataSource.query(`CALL sp_turnos_finalizar(?)`, [id]);

            // Registrar salida del visitante
            const idVisita = turno.id_visita;
            await this.dataSource.query('CALL sp_visitas_salida(?)', [idVisita]);

            // Calcular duración en minutos
            const duracion = turno.fecha_llamado && turno.fecha_emision
                ? Math.floor((new Date().getTime() - new Date(turno.fecha_llamado).getTime()) / 60000)
                : null;

            // Insertar en historial_turnos
            await this.dataSource.query(`
            INSERT INTO historial_turnos (
              id_turno, codigo_turno, estado, comentario, fue_reasignado, 
              id_tramite_anterior, id_tramite_nuevo, llamado_numero, 
              duracion_atencion, id_puntoatencion, id_usuario, origen, ip_cliente
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
                id,
                turno.codigo_turno,
                'FINALIZADO',
                'Turno finalizado con éxito.',
                false,
                turno.id_tramite,
                turno.id_tramite,
                1,
                duracion,
                turno.box,
                idUsuario,
                'FINALIZACION',
                ip,
            ]);

            return { ok: true, message: 'Turno finalizado y salida registrada correctamente.' };

        } catch (error) {
            this.logger.error('❌ Error al finalizar turno y registrar salida', error);
            return { ok: false, message: 'No se pudo finalizar el turno.' };
        }
    }



}
