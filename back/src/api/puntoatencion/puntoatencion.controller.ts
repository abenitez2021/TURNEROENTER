import { Controller, Post, Body, Get, Put, Param } from '@nestjs/common';
import { PuntoAtencionService } from './puntoatencion.service';
import { CrearPuntoAtencionDto } from './dto/crear-puntoatencion.dto';
import { ActualizarPuntoAtencionDto } from './dto/actualizar-puntoatencion.dto';
import { InactivarPuntoDto } from './dto/inactivar-puntoatencion.dto';

@Controller('puntoatencion')
export class PuntoAtencionController {
    constructor(private readonly puntoAtencionService: PuntoAtencionService) { }

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

    @Put('inactivar')
    async inactivarPuntoAtencion(@Body() dto: InactivarPuntoDto) {
        return this.puntoAtencionService.inactivarPuntoAtencion(dto);
    }

    // Lado ATENCION → marcar box como disponible
    @Post(':id/disponible')
    async marcarDisponible(
        @Param('id') id: string,
        @Body() body: { id_usuario?: number },
    ) {
        const id_punto = Number(id);
        // Podrías validar rol ATENCION con guard si querés
        return this.puntoAtencionService.marcarDisponible(id_punto, body.id_usuario);
    }

    // Lado pantalla → marcar box como ocupado después de mostrarlo
    @Post(':id/ocupado')
    async marcarOcupado(@Param('id') id: string) {
        const id_punto = Number(id);
        return this.puntoAtencionService.marcarOcupado(id_punto);
    }

    // Lado pantalla → pedir cola de boxes disponibles
    @Get('disponibles-cola')
    async disponiblesEnCola() {
        return this.puntoAtencionService.listarDisponiblesEnCola();
    }

}
