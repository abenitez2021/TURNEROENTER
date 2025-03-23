import { Controller, Post, Body, Get, Put } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ActualizarTurnoDto } from './dto/actualizar-turno.dto';


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
    async finalizarTurno(@Body() body: { id: number }) {
        return this.turnosService.finalizarTurno(body.id);
    }
    // Actualizar Turno

    @Put('reasignar')
    async reasignarTurno(@Body() body: { idTurno: number, idTramite: number }) {
        return this.turnosService.reasignarTurno(body.idTurno, body.idTramite);
    }

    @Get('ultimos-llamados')
    async ultimosTurnos() {
        return this.turnosService.obtenerUltimosTurnosLlamados();
    }


}
