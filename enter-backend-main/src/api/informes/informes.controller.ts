import { Body, Controller, Get, HttpCode, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InformesService } from './informes.service';
import { UsuarioEntity } from 'src/entitys';
import { User } from '../auth/user.decorator';

@Controller('informes')
export class InformesController {
  logger = new Logger('InformesController');

  constructor(private readonly informesService: InformesService) { }
  //aprobado
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @Post('informe-movimientos')
  async informeMovimientos(@Body() filtros: any, @User() user: UsuarioEntity) {
    return await this.informesService.informeMovimientos(filtros);
  }
  //aprobado
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @Post('grafico-tramites')
  async graficoTramites(@Body() filtros: any, @User() user: UsuarioEntity) {
    return await this.informesService.graficoTramites(filtros);
  }

  //aprobado
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @Post('grafico-usuarios')
  async graficoUsuarios(@Body() filtros: any, @User() user: UsuarioEntity) {
    return await this.informesService.graficoUsuarios(filtros);
  }
  //aprobado
  @HttpCode(200)
  @UseGuards(AuthGuard())
  @Post('informe-tiempos-espera')
  async informeTiemposEspera(@Body() filtros: any, @User() user: UsuarioEntity) {
    return await this.informesService.informeTiemposEspera(filtros);
  }


  @Get('resumen-atencion')
  async getResumenAtencion() {
    return this.informesService.getResumenAtencion();
  }

}
