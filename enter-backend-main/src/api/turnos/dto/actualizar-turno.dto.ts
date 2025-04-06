import { IsInt, IsOptional } from 'class-validator';

export class ActualizarTurnoDto {
  @IsInt()
  id_turno: number; // 👈 Este es obligatorio y necesario para identificar el turno a actualizar

  @IsOptional()
  @IsInt()
  id_tramite?: number;

  @IsOptional()
  @IsInt()
  box?: number;
}
export class ReasignarTurnoDto {
  idTurno: number;
  idTramite: number;
}
