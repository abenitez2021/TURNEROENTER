
import { ErroresLecturaService } from './errores-lectura.service';
import { RegistrarErrorDto } from './dto/registrar-error.dto';
import {
  Body,
  Post,
  Controller,
  Get,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('errores')
export class ErroresLecturaController {
  constructor(private readonly erroresLecturaService: ErroresLecturaService) { }

  @Post('registrar')
  async registrar(@Body() dto: RegistrarErrorDto) {
    return this.erroresLecturaService.registrarErrorDesdeFrontend(dto);
  }
  @Get('reporte')
  async getReporteErroresLectura() {
    return await this.erroresLecturaService.obtenerReporteErrores();
  }
  @Get('imagen')
  async verImagenDisco(@Query('ruta') ruta: string, @Res() res: Response) {
    try {
      if (!ruta) {
        throw new BadRequestException('Falta parámetro ruta');
      }

      const rutaNormalizada = path.normalize(ruta);

      if (!fs.existsSync(rutaNormalizada)) {
        return res.status(404).send('Archivo no encontrado');
      }

      const ext = path.extname(rutaNormalizada).toLowerCase();
      const mimeType = this.getMimeType(ext);

      res.setHeader('Content-Type', mimeType);
      const stream = fs.createReadStream(rutaNormalizada);
      stream.pipe(res);
    } catch (error) {
      return res.status(500).send('Error al cargar imagen');
    }
  }

  private getMimeType(ext: string): string {
    switch (ext) {
      case '.png':
        return 'image/png';
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.bmp':
        return 'image/bmp';
      default:
        return 'application/octet-stream';
    }
  }
}


