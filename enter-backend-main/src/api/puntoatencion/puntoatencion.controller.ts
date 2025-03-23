import { Controller, Post, Body, Get, Put } from '@nestjs/common';
import { PuntoAtencionService } from './puntoatencion.service';
import { CrearPuntoAtencionDto } from './dto/crear-puntoatencion.dto';
import { ActualizarPuntoAtencionDto } from './dto/actualizar-puntoatencion.dto';

@Controller('puntoatencion')
export class PuntoAtencionController {
    constructor(private readonly puntoAtencionService: PuntoAtencionService) {}

    @Post('crear')
    async crearPuntoAtencion(@Body() dto: CrearPuntoAtencionDto) {
        return this.puntoAtencionService.crearPuntoAtencion(dto);
    }

    @Get('listar')
    async listarPuntosAtencion() {
        return this.puntoAtencionService.listarPuntosAtencion();
    }

    @Put('editar')
    async editarPuntoAtencion(@Body() dto: ActualizarPuntoAtencionDto) {
        return this.puntoAtencionService.editarPuntoAtencion(dto);
    }
}
