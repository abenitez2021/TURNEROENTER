import { Controller, Post, Body, Get, Put, Param, UseGuards, Res } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ActualizarTurnoDto } from './dto/actualizar-turno.dto';

import { Request } from 'express';
import { Req } from '@nestjs/common';

import { Response } from 'express';





@Controller('turnos')
export class TurnosController {
    constructor(private readonly turnosService: TurnosService) { }

    @Post('crear')
    async crearTurno(@Body() dto: CrearTurnoDto) {
        return this.turnosService.crearTurno(dto);
    }

    @Get('listar')
    async listarTurnos() {
        return this.turnosService.listarTurnos();
    }

    // 📌 Llamar Turno
    @Post('llamar')
    async llamarTurno(@Body() body: { id: number, box: number }) {
        return this.turnosService.llamarTurno(body.id, body.box);
    }

    // 📌 Finalizar Turno
    @Post('finalizar')
    async finalizarTurno(@Body() body: { id: number, idUsuario: number, ip: string, comentario: string }) {
        const { id, idUsuario, ip, comentario } = body;
        return this.turnosService.finalizarTurno(id, idUsuario, ip, comentario);
    }

    //agregar notas al turno 

    @Post('historial/nota')
    async agregarNotaHistorial(
        @Body() body: { idTurno: number; comentario: string; id_usuario: number },
        @Req() req: Request
    ) {
        const { idTurno, comentario, id_usuario } = body;
        return this.turnosService.agregarNotaHistorial(idTurno, comentario, id_usuario, req.ip || req.connection.remoteAddress);
    }


    //historial extendido 


    @Get('historial/completo/:idTurno')
    async historialCompleto(@Param('idTurno') idTurno: number, @Res() res: Response) {
        try {
            const historial = await this.turnosService.obtenerHistorialExtendido(idTurno);
            return res.status(200).json({ ok: true, historial });
        } catch (error) {
            console.error("❌ Error al obtener historial completo:", error);
            return res.status(500).json({ ok: false, message: "Error interno" });
        }
    }



    // Actualizar Turno

    @Put('reasignar')
    async reasignarTurno(@Body() body: any, @Req() req: Request) {
        const { idTurno, idTramite, comentario } = body;
        const ipCliente = req.ip || req.connection.remoteAddress || '';
        const idUsuario = req['user']?.id || null;

        return this.turnosService.reasignarTurno(idTurno, idTramite, comentario, idUsuario, ipCliente);
    }
    // 📌 Cancelar Turno
    @Post('cancelar')
    async cancelarTurno(@Body() body: {
        idTurno: number;
        idUsuario: number;
        ip: string;
        comentario?: string;
        observaciones?: string;
    }) {
        const { idTurno, idUsuario, ip, comentario, observaciones } = body;
        return this.turnosService.cancelarTurno(idTurno, idUsuario, ip, comentario, observaciones);
    }

    @Get('detalle/:id')
    getDetalleTurno(@Param('id') id: number) {
        return this.turnosService.getDetalleTurno(id);
    }


    @Get('ultimos-llamados')
    async ultimosTurnos() {
        return this.turnosService.obtenerUltimosTurnosLlamados();
    }


}
