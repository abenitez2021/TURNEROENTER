import {  IsInt,  IsNotEmpty } from 'class-validator';

export class InactivarTramiteDto {
  @IsNotEmpty() // ✅ Asegura que se envíe un ID válido
  @IsInt() // ✅ Asegura que sea un número entero
  id: number;
  
}
