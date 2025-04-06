import { Controller, Post, Body, Get, Put, Param } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ActualizarTurnoDto } from './dto/actualizar-turno.dto';

import { Request } from 'express';
import { Req } from '@nestjs/common';




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
    // 📌 Finalizar Turno
    @Post('finalizar')
    async finalizarTurno(@Body() body: { id: number, idUsuario: number, ip: string }) {
        const { id, idUsuario, ip } = body;
        return this.turnosService.finalizarTurno(id, idUsuario, ip);
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
