import { Injectable, Logger } from '@nestjs/common';
import { UsuarioEntity } from 'src/entitys';
import { DataSource } from 'typeorm';
import { UsuariosListarDto } from './dto/listar.dto';
import { ActualizarTarjetaDto } from './dto/tarjeta.dto';

@Injectable()
export class UsuariosService {

  logger = new Logger('UsuariosService');

  constructor(
    private dataSource: DataSource,
  ) { }

  //Listar Marcacion
  async usuariosListar(dto: UsuariosListarDto, user: UsuarioEntity) {

    //console.log('datos', portafoliosCrearDto);     
    //Se llama al procedimiento en la bd. 
    const sp = 'call sp_user_list(?,?)';
    const parametros = [dto.idRol ? dto.idRol : null,
    dto.estado ? dto.estado : null
    ];
    //Se ejecuta el sp.
    try {
      const result = await this.dataSource.query(sp, parametros)
      return { ok: true, message: 'Usuarios listados correctamente.', result: result[0] };
    } catch (error) {
      return { ok: false, message: 'No se pudo listar los usuarios. ' + error.message }
    }
  }

  //Mostrar Imagenes Guardadas
  async verDocumentoGuardadoFoto(nroDocumento: string, imagen: string) {

    const sp = 'call sp_visitas_puestos_list(?)';
    const parametros = [null]
    try {

      const result = await this.dataSource.query(sp, parametros)
      const data = result[0][0];


      const fullPath = `${data.ubicacionServidor}/usuarios/${nroDocumento}/${imagen}`;

      return fullPath;
    } catch (error) {

    }
  }
  //Desactivar usuario 
  //http://localhost:7001/api/usuarios/desactivar/
  // Desactivar usuario 
  async desactivarUsuario(user: UsuarioEntity, idUsuario: number) {
    const estado = 'INACTIVO';
    const sp = 'CALL sp_user_activar_desactivar(?, ?)';
    const parametros = [idUsuario, estado];
    try {
      const result = await this.dataSource.query(sp, parametros);
      return { ok: true, message: 'Usuario desactivado correctamente.', result: result[0] };
    } catch (error) {
      return { ok: false, message: 'No se pudo desactivar el usuario. ' + error.message };
    }
  }

  //Activar Usuario 
  //http://localhost:7001/api/usuarios/activar/

  async activarUsuario(user: UsuarioEntity, idUsuario: number) {
    const estado = 'ACTIVO';
    const sp = 'CALL sp_user_activar_desactivar(?,?)';
    const parametros = [idUsuario, estado];
    try {
      const result = await this.dataSource.query(sp, parametros);
      return { ok: true, message: 'Usuario activado correctamente.', result: result[0] };

    } catch (error) {
      return { ok: false, message: 'No se pudo activar el usuario. ' + error.message };
    }
  }

  //Listar por fecha creacion
  async usuariosListarFechaCreacion(
    dto: UsuariosListarDto,
    user: UsuarioEntity
  ) {
    //console.log('datos', portafoliosCrearDto);
    //Se llama al procedimiento en la bd.
    const sp = "call sp_user_list_create(?,?,?,?)";
    const parametros = [
      dto.idRol ? dto.idRol : null,
      dto.estado ? dto.estado : null,
      dto.fechaDesde ? dto.fechaDesde : null,
      dto.fechaHasta ? dto.fechaHasta : null,
    ];
    //Se ejecuta el sp.
    try {
      const result = await this.dataSource.query(sp, parametros);
      return {
        ok: true,
        message: "Usuarios listados correctamente por fecha creacion.",
        result: result[0],
      };
    } catch (error) {
      return {
        ok: false,
        message:
          "No se pudo listar los usuarios por fecha creacion. " + error.message,
      };
    }
  }

  // usuario.service.ts


  async actualizarTarjeta(user: UsuarioEntity, dto: ActualizarTarjetaDto) {
    const sp = "call sp_actualizar_tarjeta(?, ?)";
    const parametros = [
      dto.id ? dto.id : null,
      dto.tarjeta ? dto.tarjeta : null,
    ];
    try {
      await this.dataSource.query(sp, parametros);
      return {
        ok: true,
        message: "Tarjeta actualizada correctamente.",
      };
    } catch (error) {
      return {
        ok: false,
        message: "No se pudo actualizar la tarjeta. " + error.message,
      };
    }
  }
}
