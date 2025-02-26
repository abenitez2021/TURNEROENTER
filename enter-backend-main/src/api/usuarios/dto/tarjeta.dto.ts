// actualizar-tarjeta.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ActualizarTarjetaDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  tarjeta: string;
}
