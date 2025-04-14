export class RegistrarErrorDto {
  idPuesto: number;
  jsonCompleto: any; // o string, si lo vas a stringificar antes de enviar desde el frontend
  descripcion_error: string;
  foto: string;
  imagenFrente: string;
  imagenDorso: string;
}
