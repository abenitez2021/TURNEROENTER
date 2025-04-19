import { Module } from '@nestjs/common';
import { ErroresLecturaService } from './errores-lectura.service';
import { ErroresLecturaController } from './errores-lectura.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [ErroresLecturaController],
  providers: [ErroresLecturaService],
})
export class ErroresLecturaModule {}
