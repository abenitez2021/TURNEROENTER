import { IsOptional, IsString, IsEnum, IsInt, Min, IsNotEmpty } from 'class-validator';

export class ActualizarTramiteDto {
  @IsNotEmpty() // ✅ Asegura que se envíe un ID válido
  @IsInt() // ✅ Asegura que sea un número entero
  id: number;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum(['BAJA', 'MEDIA', 'ALTA'])
  prioridad?: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'El tiempo estimado debe ser mayor a 0' }) // ✅ Asegura que sea mayor a 0
  tiempo_estimado?: number;
}
