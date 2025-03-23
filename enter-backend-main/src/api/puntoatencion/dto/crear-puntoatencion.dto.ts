import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CrearPuntoAtencionDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsNotEmpty()
  @IsBoolean()
  activo: boolean;
}
