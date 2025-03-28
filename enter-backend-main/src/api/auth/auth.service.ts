import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { IJwtPayload } from './jwt-payload.interface';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, TypeORMError } from 'typeorm';
import { UsuarioEntity } from 'src/entitys';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';




import { NewPasswordDto } from './new-password-dto';


@Injectable()
export class AuthService {

    logger = new Logger('AuthService');
    //dataSource: any;

    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly _usuario: Repository<UsuarioEntity>,
        private readonly _jwtService: JwtService,
        private dataSource: DataSource,
        //private mailService : MailerService
    ) { }

    //Registro Usuario
    async registroUsuario(dto: RegistroDto, user: UsuarioEntity) {

        {
            const salt = genSaltSync(10);
            const encodedPassword = hashSync(dto.password, salt);
            dto.password = encodedPassword;
        }

        console.log('id',dto);

        //Se llama al procedimiento en la bd. 
        const sp = 'call sp_user_registro_insert(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        const parametros = [dto.documento,
                            dto.password,
                            dto.nombre,
                            dto.apellido,
                            dto.idRol,
                            dto.idTipoDocumento ? dto.idTipoDocumento : null,
                            dto.tipoDocumento,
                            dto.email,
                            dto.celular ? dto.celular : null,
                            dto.telefono ? dto.telefono : null,
                            dto.codigoNacionalidad ? dto.codigoNacionalidad : null,
                            dto.nacionalidad ? dto.nacionalidad : null,
                            dto.fechaNacimiento ? dto.fechaNacimiento : null,
                            dto.fechaExpiracionDocumento ? dto.fechaExpiracionDocumento : null,
                            dto.fechaEmision ? dto.fechaEmision : null,
                            dto.sexo ? dto.sexo : null,
                            dto.estadoCivil ? dto.estadoCivil : null,
                            user.id
                            ];
       
        try {
            //Se ejecuta el sp.
            const result = await this.dataSource.query(sp, parametros)
            const data = result[0][0]

            const fs = require('fs');
            const sp2 = 'call sp_visitas_puestos_list(?)';
            const parametros2 = [dto.idPuesto ? dto.idPuesto : null];
            const result2 = await this.dataSource.query(sp2, parametros2) 
            const data2 = result2[0][0];

            const foto = 'foto.png';
            const frente = 'frente.png';
            const dorso = 'dorso.png'

            const dirCarpeta = `${data2.urlServidor}/Usuarios/`;
            if (!fs.existsSync(dirCarpeta)) {
                // Si no existe, la creamos
                fs.mkdirSync(dirCarpeta);
                //console.log(`Carpeta "${dto.documento}" creada en ${dirDocumento}`);
            } else {
                console.log(`La carpeta "Usuarios" ya existe en ${dirCarpeta}`);
            }

            const dirDocumento = `${dirCarpeta}${dto.documento}`;
            if (!fs.existsSync(dirDocumento)) {
                // Si no existe, la creamos
                fs.mkdirSync(dirDocumento);
                //console.log(`Carpeta "${dto.documento}" creada en ${dirDocumento}`);
            } else {
                console.log(`La carpeta "${dto.documento}" ya existe en ${dirDocumento}`);
            }


            //Mover Imagen Foto Perfil
            const fotoOrigen = `${data2.ubicacionCarpeta}${data2.foto}`;
            const fotoDestino = `${dirDocumento}/${foto}`;;
            fs.copyFile(fotoOrigen, fotoDestino, (err) => {
            if (err) {
                console.error(`Error al mover la foto: ${err}`);
            } else {
                //console.log('Foto movido exitosamente');
            }
            });

             //Mover Imagen Foto Frente
            const frenteOrigen = `${data2.ubicacionCarpeta}${data2.imagenFrente}`;
            const frenteDestino = `${dirDocumento}/${frente}`;;
            fs.copyFile(frenteOrigen, frenteDestino, (err) => {
            if (err) {
                console.error(`Error al mover la imagen frente: ${err}`);
            } else {
                //console.log('Imagen Frente movido exitosamente');
            }
            });

             //Mover Imagen Foto Dorso
            const dorsoOrigen = `${data2.ubicacionCarpeta}${data2.subcarpetaImpresora}${data2.imagenDorso}`;
            const dorsoDestino = `${dirDocumento}/${dorso}`;;
            fs.copyFile(dorsoOrigen, dorsoDestino, (err) => {
            if (err) {
                console.error(`Error al mover la imagen dorso: ${err}`);
            } else {
                //console.log('Imagen Dorso movido exitosamente');
            }
            });

            const jsonOrigen = `${data2.ubicacionCarpeta}${data2.subcarpeta}${data2.archivoPrincipal}`;
            const jsonDestino = `${dirDocumento}/${data2.archivoPrincipal}`;;
            fs.copyFile(jsonOrigen, jsonDestino, (err) => {
            if (err) {
                console.error(`Error al mover el JSON: ${err}`);
            } else {
                //console.log('Imagen Dorso movido exitosamente');
            }
            });

            const json2Origen = `${data2.ubicacionCarpeta}${data2.archivoSecundario}`;
            const json2Destino = `${dirDocumento}/${data2.archivoSecundario}`;;
            fs.copyFile(json2Origen, json2Destino, (err) => {
            if (err) {
                console.error(`Error al mover el JSON: ${err}`);
            } else {
                //console.log('Imagen Dorso movido exitosamente');
            }
            });

            const sp3 = 'call sp_user_documentos_update(?,?,?,?)';
            const parametros3 = [data.idUsuario,
                                foto,
                                frente,
                                dorso];
            const result3 = await this.dataSource.query(sp3, parametros3) 
            
            
    
            return { ok: true, message: 'Usuario creado correctamente.', result: result[0][0]};
        } catch (error) {
             return { ok: false, message: 'No se pudo crear el usuario.' + error.message}
        }
    }

    //Login Woomer correo 
    async loginUsuario(dto: LoginDto) {
        // Se comento este log para evitar que se vea la clave.
        //console.log(dto);
        const { documento, password } = dto;
        const user = await this._usuario.findOne({
            where: { documento }    
        });
        console.log(user);
        
        if (!user) {
            console.log('entra?')
            throw new NotFoundException('El usuario no esta registrado');
        }
        if(user.password == null) throw new UnauthorizedException('Metodo de autenticacion no valido para el usuario ' + documento);

        //if(user.idRol !== dto.idRol) throw new UnauthorizedException('El usuario no tiene permisos para realizar el login en el sistema ' + documento);
      

        const isMatch = compareSync(password, user.password);

        if (!isMatch) {
            //throw new UnauthorizedException('Usuario y/o Contraseña invalidos');
            return { ok: false, message: 'Usuario y/o Contraseña invalidos.', result: null};
        }

            const sp = 'call sp_user_login(?)';
            const parametros = [user.id];
            console.log( user.id);
            //Se ejecuta el sp.
            const result = await this.dataSource.query(sp, parametros)
            .catch(
                (err: TypeORMError) => {
                    this.logger.error(err);
                    throw new InternalServerErrorException({
                        code: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: 'No se pudo listar el usuario',
                        detail: err.message
                    });
                }
            )
            const data = result[0][0]
            console.log('data',data);
        const usuario = {
            "id": user.id,
            "nombre": data.nombre,
            "apellido": data.apellido,
            "correo": data.correo,
            "documento": user.documento,
            "tipoDocumento": data.tipoDocumento,
            "fotoPerfil": data.fotoPerfil,
            //"urlFotoPerfil": data.urlFotoPerfil,
            "idRol": data.idRol,
            "rol": data.rol,
            "celular": data.celular,
            "telefono": data.telefono,
            "entrada": data.entrada,
            "salida": data.salida,
            "marcacion": data.marcacion,
            "idDependencia": data.idDependencia,
            "dependencia": data.dependencia,
            "visitasDia": data.visitasDia,
            "movimientos": data.movimientos,
            "gestion": data.gestion,
            "sistema": data.sistema,

        }

        const payload: IJwtPayload = {
            id: user.id,
            username: user.documento
        };

        const token = this._jwtService.sign(payload);

        return { ok: true, message: 'Datos del usuario listados correctamente.', result: {user: usuario, token} };
    }



    //Datos login
    async datosUsuario(user: UsuarioEntity) {

        console.log('user', user.id);
        //const user = await this._usuario.findOneBy({ id })
        //console.log('userx', user.id);
        
        //Se llama al procedimiento en la bd. 
        const sp = 'call sp_user_login(?)';
        const parametros = [user.id];
        //Se ejecuta el sp.
        try {
            const result = await this.dataSource.query(sp, parametros)
            return { ok: true, message: 'Datos del usuario listados correctamente.', result: {user: result[0][0]} };
            } catch (error) {
                return { ok: false, message: 'No se pudo listar el usuario. ' + error.message}
            }
     }

     async cambiarContrasena(dto: NewPasswordDto, userId: number, currentUser: UsuarioEntity) {
        console.log('DTO recibido -> ', dto);
        console.log('ID recibido -> ', userId);
        console.log('Usuario actual -> ', currentUser);
    
        try {
            // Verifica si el usuario actual es un administrador
            const isAdmin = currentUser.idRol === 1;
    
            // Busca al usuario por su ID
            const user = await this._usuario.findOneBy({ id: userId });
    
            if (!user) {
                throw new NotFoundException('El Usuario no existe');
            }
    
            // Caso 1: El administrador o usuario cambia su propia contraseña
            if (currentUser.id === userId) {
                console.log('Usuario cambiando su propia contraseña.');
    
                // Verifica que se haya proporcionado la contraseña actual y la nueva contraseña
                if (!dto.password || !dto.newPassword) {
                    throw new BadRequestException('Debe proporcionar la contraseña actual y la nueva contraseña.');
                }
    
                // Comprobación del hash almacenado
                console.log('Contraseña en base de datos (hash):', user.password);
                console.log('Contraseña proporcionada:', dto.password);
    
                // Realiza la comparación de contraseñas
                const isMatch = compareSync(dto.password, user.password);
    
                console.log('¿Contraseña actual coincide? -> ', isMatch);
    
                if (!isMatch) {
                    console.log('La contraseña actual no coincide.');
                    throw new BadRequestException('Contraseña actual incorrecta');
                }
    
                // Genera una nueva contraseña encriptada
                const salt = genSaltSync(10);
                const encodedPassword = hashSync(dto.newPassword, salt);
                console.log('Nueva contraseña encriptada -> ', encodedPassword);
    
                // Actualiza la contraseña del usuario
                user.password = encodedPassword;
    
                // Guarda los cambios
                await this._usuario.save(user);
                console.log('Contraseña actualizada en la base de datos.');
    
                return { ok: true, message: 'Contraseña cambiada correctamente.' };
            }
    
            // Caso 2: El administrador cambia la contraseña de otro usuario
            if (isAdmin && currentUser.id !== userId) {
                console.log('Administrador cambiando la contraseña de otro usuario.');
    
                // Encripta la nueva contraseña
                const salt = genSaltSync(10);
                user.password = hashSync(dto.newPassword, salt);
    
                // Guarda los cambios
                await this._usuario.save(user);
                console.log('Contraseña actualizada para el usuario con ID:', user.id);
    
                return { ok: true, message: 'Contraseña cambiada correctamente.' };
            }
    
            // Caso: No tiene permisos para cambiar la contraseña de otro usuario
            throw new UnauthorizedException('No tiene permiso para cambiar la contraseña de este usuario.');
    
        } catch (error) {
            console.error('Error al cambiar la contraseña -> ', error);
            throw new InternalServerErrorException('No se pudo cambiar la contraseña.');
        }
    }
    
   
 



     /*async cambiarContrasena(dto: NewPasswordDto, userId: number, currentUser: UsuarioEntity) {
        console.log('DTO recibido -> ', dto);
        console.log('ID recibido -> ', userId);
        console.log('Usuario actual -> ', currentUser);
    
        try {
            // Verifica si el usuario actual es un administrador
            const isAdmin = currentUser.idRol === 1;
    
            // Busca al usuario por su ID
            const user = await this._usuario.findOneBy({ id: userId });
            if (!user) {
                throw new NotFoundException('El Usuario no existe');
            }
    
            // Administrador cambia la contraseña de otro usuario
            if (isAdmin && currentUser.id !== userId) {
                if (!dto.newPassword) {
                    throw new BadRequestException('Debe proporcionar la nueva contraseña.');
                }
    
                // Genera una nueva contraseña encriptada
                const salt = genSaltSync(10);
                const encodedPassword = hashSync(dto.newPassword, salt);
    
                // Actualiza la contraseña del usuario
                user.password = encodedPassword;
    
                // Guarda los cambios
                await user.save();
    
                return { ok: true, message: 'Contraseña cambiada correctamente por el administrador.' };
            }
    
            // Usuario cambia su propia contraseña
            if (!isAdmin && currentUser.id === userId) {
                if (!dto.password || !dto.newPassword) {
                    throw new BadRequestException('Debe proporcionar la contraseña actual y la nueva contraseña.');
                }
    
                // Compara la contraseña proporcionada con la almacenada
                const isMatch = compareSync(dto.password, user.password);
                if (!isMatch) {
                    throw new BadRequestException('Contraseña incorrecta');
                }
    
                // Genera una nueva contraseña encriptada
                const salt = genSaltSync(10);
                const encodedPassword = hashSync(dto.newPassword, salt);
    
                // Actualiza la contraseña del usuario
                user.password = encodedPassword;
    
                // Guarda los cambios
                await user.save();
    
                return { ok: true, message: 'Contraseña cambiada correctamente.' };
            }
    
            // Si llega a este punto y no es admin, significa que está intentando cambiar la contraseña de otro usuario
            throw new BadRequestException('No tienes permiso para cambiar la contraseña de otro usuario.');
            
        } catch (error) {
            console.error('Error al cambiar la contraseña -> ', error);
            return { ok: false, message: 'No se pudo cambiar la contraseña. ' + error.message };
        }
    }*/


     

//     // solicitar pin via email
//     async generarPinViaCorreo(dto: SolicitarPinEmailDto) {

//         //Se llama al procedimiento en la bd. 
//         const sp = 'call sp_user_usuario_codigo_create(?,?,?)';
//         const parametros = [dto.email, 
//                             dto.tipo,
//                             dto.tipoUsuario];
//         //Se ejecuta el sp.
//         try {
//             const result = await this.dataSource.query(sp, parametros)
//             await this.mailService.sendMail({
//                 to: dto.email,
//                 from: "'Joguapp Marketplace' <notificaciones@joguapp.com.py>",
//                 subject: 'Pin de verificación via correo',
//                 text: 'PIN generado con exito',
//                 html: '<h1>Hola, tu pin de validación es </h1>' + result[0][0].codigo
//             });
//             const data = result[0];
//             return { ok: true, message: 'Pin generado correctamente.', result: result[0][0].correo }; 
//         } catch (error) {
//             return { ok: false, message: 'No se pudo generar el pin, intente más tarde: ' + error.message}
//         } 
//     } 

//      // validar pin via email
//      async validarPinViaCorreo(dto: ValidarPinEmailDto) {

//         //Se llama al procedimiento en la bd. 
//         const sp = 'call sp_user_usuario_codigo_validar(?,?,?,?)';

//         const parametros = [dto.email, 
//                             dto.pin, 
//                             dto.tipo,
//                             dto.tipoUsuario ];
//         //Se ejecuta el sp.
//         try {
//             const result = await this.dataSource.query(sp, parametros) 
//             await this.mailService.sendMail({
//                 to: dto.email,
//                 from: "'Joguapp Marketplace' <notificaciones@joguapp.com.py>",
//                 subject: 'Correo validado correctamente',
//                 text: 'PIN validado con êxito',
//                 html: '<h2>Hola, tu cuenta de Joguapp Marketplace ya se encuentra validada, muchas gracias!</h2>'
//             });
//             return { ok: true, message: 'Pin validado correctamente.', result: result[0]}; 
//         } catch (error) {
//             return { ok: false, message: 'No se pudo validar el pin, intente más tarde: ' + error.message}
//         } 
//     } 

//     async ressetContrasena(dto: RessetPasswordDto) {

//         const salt = genSaltSync(10);
//         const encodedPassword = hashSync(dto.newPassword, salt);

//                 const sp = 'call sp_user_usuario_reset_password(?,?,?)';

//                 const parametros = [dto.email,
//                                     dto.pin,
//                                     encodedPassword
//                 ];
//                 //Se ejecuta el sp.
//                 try {
//                     const result = await this.dataSource.query(sp, parametros)
//                     return { ok: true, message: 'Contrasena restaurada correctmanete.', result: result[0]}; 
//                 } catch (error) {
//                     return { ok: false, message: 'No se pudo restaurar la contrasena: ' + error.message}
//                 } 
//             } 


}

