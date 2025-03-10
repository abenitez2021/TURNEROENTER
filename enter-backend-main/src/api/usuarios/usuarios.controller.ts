import { Body, Controller, Get, HttpCode, Logger, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioEntity } from 'src/entitys';
import { User } from '../auth/user.decorator';
import { UsuariosListarDto } from './dto/listar.dto';
import { UsuariosService } from './usuarios.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ActualizarTarjetaDto } from './dto/tarjeta.dto';

@Controller('usuarios')
export class UsuariosController {

    logger = new Logger('UsuariosController')

    constructor(private readonly _usuariosService: UsuariosService) { }

    //Listar Marcacion
    @HttpCode(200)
    @UseGuards(AuthGuard())
    @Post('listar')
    async usuariosListar(@Body() dto: UsuariosListarDto,
        @User() user: UsuarioEntity,
    ) {
        return await this._usuariosService.usuariosListar(dto, user);
    }

    //Mostrar imagenes Guardadas
    //@UseGuards(AuthGuard('jwt'))    @Get('/documento-foto/puesto/:idPuesto/archivo/:img')
    @Get('/ver-archivo/nro/:doc/archivo/:img')
    async verDocumentoGuardadoFoto(
        @Param('doc') nroDocumento: string,
        @Param('img') imagen: string,
        @Res() res: Response
    ) {
        try {
            const fullPath = await this._usuariosService.verDocumentoGuardadoFoto(nroDocumento, imagen);
            res.sendFile(fullPath);
        } catch (error) {
            res.status(404).send('No se ha encontrado el archivo.');
        }
    }
    // Ruta para desactivar usuario
    @HttpCode(200)
    @UseGuards(AuthGuard())
    @Post('desactivar')
    async desactivarUsuario(
        @User() user: UsuarioEntity,
        @Body() dto: { id: number }
    ) {
        return await this._usuariosService.desactivarUsuario(user, dto.id);
    }


    //Ruta para activar usuario
    @HttpCode(200)
    @UseGuards(AuthGuard())
    @Post('activar')
    async activarUsuario(
        @User() user: UsuarioEntity,
        @Body() dto: { id: number }
    ) {
        return await this._usuariosService.activarUsuario(user, dto.id);
    }
    // usuario.controller.ts


    @HttpCode(200)
    @UseGuards(AuthGuard())
    @Post('tarjeta')
    async actualizarTarjeta(
        @User() user: UsuarioEntity,
        @Body() dto: ActualizarTarjetaDto
    ) {
        return await this._usuariosService.actualizarTarjeta(user, dto);
    }





    //Listar usuariop por fecha Marcacion
    @HttpCode(200)
    @UseGuards(AuthGuard())
    @Post("listarcrea")
    async usuariosusuariosListarFechaCreacionListar(
        @Body() dto: UsuariosListarDto,
        @User() user: UsuarioEntity
    ) {
        return await this._usuariosService.usuariosListarFechaCreacion(dto, user);
    }
}
