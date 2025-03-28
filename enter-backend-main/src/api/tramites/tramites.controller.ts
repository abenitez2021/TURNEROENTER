import { Controller, Post, Body, Get, Put } from '@nestjs/common';
import { TramitesService } from './tramites.service';
import { CrearTramiteDto } from './dto/crear-tramite.dto';
import { ActualizarTramiteDto } from './dto/actualizar-tramite.dto';
import { InactivarTramiteDto } from './dto/inactivar-tramite.dto';


@Controller('tramites')
export class TramitesController {
    constructor(private readonly tramitesService: TramitesService) { }

    @Post('crear')
    async crearTramite(@Body() dto: CrearTramiteDto) {
        return this.tramitesService.crearTramite(dto);
    }



    @Get('listar')
    async listarTramites() {
        return this.tramitesService.listarTramites();
    }

    @Put('editar')
    async editarTramite(@Body() body: ActualizarTramiteDto) {
        console.log("📌 Datos recibidos en el controlador:", body); // 🛠 Depuración
        return this.tramitesService.editarTramite(
            body.id,
            body.nombre,
            body.descripcion,
            body.prioridad,
            body.tiempo_estimado ?? 10 // ✅ Si es null o undefined, usa 10
        );
    }

    @Post('inactivar')
    async inactivarTramite(@Body() body: InactivarTramiteDto) {
        console.log("📌 Datos recibidos en el controlador:", body); // 🛠 Depuración
        return this.tramitesService.inactivarTramite(
            body.id
        );
    }

}
