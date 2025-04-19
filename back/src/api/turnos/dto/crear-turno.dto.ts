import { IsInt, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearTurnoDto {
  @IsInt()
  @IsNotEmpty()
  id_tramite: number;

  @IsString()
  @IsNotEmpty()
  nro_documento: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @Type(() => Date)
  @IsNotEmpty()
  fecha_hora: Date; // Formato MySQL DATETIME

  @IsEnum(['PENDIENTE', 'ATENDIENDO', 'FINALIZADO', 'CANCELADO'])  // 🔹 Valores corregidos
  @IsNotEmpty()
  estado: string;

  @IsEnum(['BAJA', 'MEDIA', 'ALTA'])
  @IsNotEmpty()
  prioridad: string;

  @IsInt()
  @IsNotEmpty()
  box: number;
}
