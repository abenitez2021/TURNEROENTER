import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class ActualizarPuntoAtencionDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
