import { Body, Controller, Post } from '@nestjs/common';
import { ErroresLecturaService } from './errores-lectura.service';
import { RegistrarErrorDto } from './dto/registrar-error.dto';

@Controller('errores')
export class ErroresLecturaController {
  constructor(private readonly erroresLecturaService: ErroresLecturaService) {}

  @Post('registrar')
  async registrar(@Body() dto: RegistrarErrorDto) {
    return this.erroresLecturaService.registrarErrorDesdeFrontend(dto);
  }
}
