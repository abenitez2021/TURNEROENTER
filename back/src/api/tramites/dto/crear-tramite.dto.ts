import { IsNotEmpty, IsString, IsEnum, IsNumber, IsBoolean } from 'class-validator';

export class CrearTramiteDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsEnum(['BAJA', 'MEDIA', 'ALTA'])
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA';

  @IsNotEmpty()
  @IsNumber()
  tiempo_estimado: number;

  @IsNotEmpty()
  @IsBoolean()
  activo: boolean;
}
