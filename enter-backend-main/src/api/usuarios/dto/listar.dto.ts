////import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


export class UsuariosListarDto {
  @IsOptional()
  @IsNumber()
  idRol: number;

  @IsOptional()
  @IsString()
  estado: string;
  /////////////////////////////////

  @IsOptional() // Marcar como opcional
  @IsString() // Asegurar que sea de tipo string
  fechaDesde: string;

  @IsOptional() 
  @IsString() 
  fechaHasta: string;
  
}
