import { ConsoleLogger, Injectable, Logger } from '@nestjs/common';
import { error, log } from 'console';
import { UsuarioEntity } from 'src/entitys';
import { DataSource } from 'typeorm';
import { entradaDatosDto } from './dto/entrada-datos.dto';
import { VisitasEntradaDto } from './dto/entrada.dto';
import { FiltroSDKDto } from './dto/filtro-sdk.dto';
import { VisitasListarDto } from './dto/listar.dto';
import { VisitasSalidaDto } from './dto/salida.dto';
import { promisify } from 'util';
import * as fs from 'fs';
import { exec } from 'child_process';



@Injectable()
export class VisitasService {

    logger = new Logger('VisitasService');

    constructor(
        private dataSource: DataSource,
    ) { }

    // Leer Archivo JSON generado por el SDK
    async leerArchivoJson(dto: FiltroSDKDto) {

        const fs = require('fs').promises;
        const fs2 = require('fs')

        //Se llama al procedimiento en la bd. 
        const sp = 'call sp_visitas_puestos_list(?)';
        const parametros = [dto.idPuesto ? dto.idPuesto : null];

        try {
            const result = await this.dataSource.query(sp, parametros)
            const data = result[0][0];

            //Datos
            const subcarpeta = 'Page1';
            const mrz = 'MRZ_DATA.json';
            const text = 'Text_Data.json';

            let nombre;
            let apellido;
            let documento;
            let tipoDocumento;
            let codigoNacionalidad;
            let Nacionalidad;
            let fechaNacimiento;
            let fechaExpiracionDocumento;
            let fechaEmision;
            let sexo;
            let estadoCivil;
            let identityCardNumber;
            let nombreCarpetaCreada;
            let info;
            let ubi;


            //Validar si existe la carpeta Page1
            if (fs2.existsSync(`${data.ubicacionCarpeta}/${subcarpeta}`)) {

                // Ubicacion del archivo  
                const dir = await fs.readFile(`${data.ubicacionCarpeta}${subcarpeta}/${mrz}`, 'utf8');
                const jsonObject = JSON.parse(dir);

                //Buscar los datos
                function buscarDato(objeto, targetFieldType) {
                    let resultado = null;
                    const value = data.textoValor;

                    function buscar(objeto) {
                        for (const clave in objeto) {
                            if (typeof objeto[clave] === 'object') {
                                buscar(objeto[clave]);
                            } else if (clave === `FieldType` && objeto[clave] === targetFieldType) {
                                resultado = objeto.Buf_Text;
                            }
                        }
                    }
                    buscar(objeto);
                    return resultado;
                }

                nombre = buscarDato(jsonObject.DocVisualExtendedInfo.pArrayFields, 9);
                apellido = buscarDato(jsonObject.DocVisualExtendedInfo.pArrayFields, 8);
                documento = buscarDato(jsonObject.DocVisualExtendedInfo.pArrayFields, 2);
                info = jsonObject.Info;
                ubi = 1;


            } else if (fs2.existsSync(`${data.ubicacionCarpeta}${mrz}`)) {
                // Ubicacion del archivo  
                const dir = await fs.readFile(`${data.ubicacionCarpeta}${mrz}`, 'utf8');
                const jsonObject = JSON.parse(dir);

                //Buscar los datos
                function buscarDato(objeto, targetFieldType) {
                    let resultado = null;
                    const value = data.textoValor;

                    function buscar(objeto) {
                        for (const clave in objeto) {
                            if (typeof objeto[clave] === 'object') {
                                buscar(objeto[clave]);
                            } else if (clave === `FieldType` && objeto[clave] === targetFieldType) {
                                resultado = objeto.Buf_Text;
                            }
                        }
                    }
                    buscar(objeto);
                    return resultado;
                }

                nombre = buscarDato(jsonObject.DocVisualExtendedInfo.pArrayFields, 9);
                apellido = buscarDato(jsonObject.DocVisualExtendedInfo.pArrayFields, 8);
                documento = buscarDato(jsonObject.DocVisualExtendedInfo.pArrayFields, 2);
                info = jsonObject.Info;
                ubi = 2;

            } else if (!fs2.existsSync(`${data.ubicacionCarpeta}${mrz}`) && fs2.existsSync(`${data.ubicacionCarpeta}${text}`)) {
                // Ubicacion del archivo  
                const dir = await fs.readFile(`${data.ubicacionCarpeta}${text}`, 'utf8');
                const jsonObject = JSON.parse(dir);

                //Buscar los datos
                function buscarDato(objeto, targetFieldType) {
                    let resultado = null;

                    function buscar(objeto) {
                        for (const clave in objeto) {
                            if (typeof objeto[clave] === 'object') {
                                buscar(objeto[clave]);
                            } else if (clave === `fieldType` && objeto[clave] === targetFieldType) {
                                resultado = objeto.value;
                            }
                        }
                    }
                    buscar(objeto);
                    return resultado;
                }

                nombre = buscarDato(jsonObject.Text.fieldList, 9);
                apellido = buscarDato(jsonObject.Text.fieldList, 8);
                documento = buscarDato(jsonObject.Text.fieldList, 2);
                info = jsonObject.Info;

            }

            if (fs2.existsSync(`${data.ubicacionCarpeta}${text}`)) {
                // Ubicacion del archivo  
                const dir = await fs.readFile(`${data.ubicacionCarpeta}${text}`, 'utf8');
                const jsonObject = JSON.parse(dir);

                //Buscar los datos
                function buscarDato(objeto, targetFieldType) {
                    let resultado = null;

                    function buscar(objeto) {
                        for (const clave in objeto) {
                            if (typeof objeto[clave] === 'object') {
                                buscar(objeto[clave]);
                            } else if (clave === `fieldType` && objeto[clave] === targetFieldType) {
                                resultado = objeto.value;
                            }
                        }
                    }
                    buscar(objeto);
                    return resultado;
                }

                tipoDocumento = buscarDato(jsonObject.Text.fieldList, 0);
                codigoNacionalidad = buscarDato(jsonObject.Text.fieldList, 1);
                Nacionalidad = buscarDato(jsonObject.Text.fieldList, 11);
                fechaNacimiento = buscarDato(jsonObject.Text.fieldList, 5);
                fechaExpiracionDocumento = buscarDato(jsonObject.Text.fieldList, 3);
                fechaEmision = buscarDato(jsonObject.Text.fieldList, 4);
                sexo = buscarDato(jsonObject.Text.fieldList, 12);
                estadoCivil = buscarDato(jsonObject.Text.fieldList, 160);
                identityCardNumber = buscarDato(jsonObject.Text.fieldList, 142);
                nombreCarpetaCreada = buscarDato(jsonObject.Text.fieldList, 51);


            } else {

            }

            const idPuestoEnviado = dto.idPuesto;

            //Lectura de imagenes
            const foto = (`http://${data.ipPuesto}:${process.env.API_PORT}/api/visitas/documento-foto/puesto/${data.idPuesto}/archivo/Photo.png`);
            const imagenFrente = (`http://${data.ipPuesto}:${process.env.API_PORT}/api/visitas/documento-frente/puesto/${data.idPuesto}/archivo/WHITE.png`);
            const imagenDorso = (`http://${data.ipPuesto}:${process.env.API_PORT}/api/visitas/documento-dorso/puesto/${data.idPuesto}/archivo/WHITE.png`);


            //Agrupar los datos para el result
            const array = {
                nombre, apellido, documento
                , tipoDocumento
                , foto, imagenFrente, imagenDorso
                , codigoNacionalidad, Nacionalidad, fechaNacimiento, fechaExpiracionDocumento, fechaEmision, sexo, estadoCivil, identityCardNumber
                , idPuestoEnviado, ubi, info
            };

            return { ok: true, message: 'archivo json leido correctamente.', result: array };
        } catch (error) {
            return { ok: false, message: 'Error al leer o parsear el archivo JSON:', error };
        }
    }



    private async printTicket(visitData: any): Promise<void> {
        const filePath = "C:\\ENTER\\CONRUTH\\impresora\\ticket.txt";

        console.log("📌 Datos recibidos para imprimir:", visitData);

        // Generar un ticket más estético utilizando el ancho completo
        const text = `
    ================================
          REGISTRO DE VISITA
    ================================
    Nombre    : ${visitData.nombre}
    Apellido  : ${visitData.apellido}
    Documento : ${visitData.nro_documento}
    Fecha     : ${new Date().toLocaleString()}
    Dependencia: ${visitData.dependencia || 'NO ESPECIFICADA'}
    ================================
    Gracias por su visita.
    ENTER 2.0 by CCS S.A.
    ================================
    `;

        // Guardar el texto en el archivo
        fs.writeFileSync(filePath, text, 'utf8');

        // Ejecutar el comando `notepad /p` para imprimir
        exec(`notepad /p "${filePath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error al imprimir: ${error.message}`);
                return;
            }
            console.log("✅ Impresión enviada correctamente.");
        });
    }


    //Ver imagen foto perfil del documento
    async verDocumentoFoto(idPuesto: number, imagen: string) {

        const sp = 'call sp_visitas_puestos_list(?)';
        const parametros = [idPuesto]
        try {

            const result = await this.dataSource.query(sp, parametros)
            const data = result[0][0];

            const fullPath = `${data.ubicacionCarpeta}${imagen}`;

            return fullPath;
        } catch (error) {

        }
    }

    //Ver imagen frente del documento
    async verDocumentoFrente(idPuesto: number, imagen: string) {

        const sp = 'call sp_visitas_puestos_list(?)';
        const parametros = [idPuesto]
        try {

            const result = await this.dataSource.query(sp, parametros)
            const data = result[0][0];

            const fullPath = `${data.ubicacionCarpeta}${imagen}`;

            return fullPath;
        } catch (error) {

        }
    }

    //Ver imagen dorso del documento
    async verDocumentoDorso(idPuesto: number, imagen: string) {

        const sp = 'call sp_visitas_puestos_list(?)';
        const parametros = [idPuesto]
        try {

            const result = await this.dataSource.query(sp, parametros)
            const data = result[0][0];

            const fullPath = `${data.ubicacionCarpeta}Page1/${imagen}`;

            return fullPath;
        } catch (error) {

        }
    }

    //Crear registro de entrada visita
    async registrarEntrada(dto: VisitasEntradaDto, user: UsuarioEntity, datos: entradaDatosDto) {
        const fs = require('fs');

        const sp = 'call sp_visitas_entrada(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        const parametros = [
            dto.nombre, dto.apellido, dto.documento,
            dto.idTipoDocumento ? dto.idTipoDocumento : null,
            dto.tipoDocumento ? dto.tipoDocumento : null,
            dto.codigoNacionalidad ? dto.codigoNacionalidad : null,
            dto.nacionalidad ? dto.nacionalidad : null,
            dto.fechaNacimiento ? dto.fechaNacimiento : null,
            dto.fechaExpiracionDocumento ? dto.fechaExpiracionDocumento : null,
            dto.fechaEmision ? dto.fechaEmision : null,
            dto.sexo ? dto.sexo : null,
            dto.estadoCivil ? dto.estadoCivil : null,
            dto.identityCardNumber ? dto.identityCardNumber : null,
            dto.idDependencia, dto.idPuesto ? dto.idPuesto : null,
            dto.codigoTarjeta ? dto.codigoTarjeta : null, user.id,
            datos.TransactionID ? datos.TransactionID : null,
            datos.ComputerName ? datos.ComputerName : null,
            datos.UserName ? datos.UserName : null,
            datos.SDKVersion ? datos.SDKVersion : null,
            datos.FileVersion ? datos.FileVersion : null,
            datos.DeviceType ? datos.DeviceType : null,
            datos.DeviceNumber ? datos.DeviceNumber : null,
            datos.DeviceLabelNumber ? datos.DeviceLabelNumber : null,
            dto.descripcion
        ];

        try {
            const result = await this.dataSource.query(sp, parametros);
            const data = result[0][0];

            // Ejecutar otro SP para obtener los datos completos para el ticket
            const spTicket = 'call sp_visitas_obtener_detalle(?)';
            const parametrosTicket = [data.idVisita];
            const resultTicket = await this.dataSource.query(spTicket, parametrosTicket);
            const visitData = resultTicket[0][0];

            // Llamar a la función para imprimir el ticket con los datos completos
            await this.printTicket(visitData);

            return { ok: true, message: 'Visita creada correctamente.', result: data };
        } catch (error) {
            console.log(error);
            return { ok: false, message: 'No se pudo crear la visita. ' + error.message };
        }
    }


    //Eliminar los archivos de la carpeta SDK
    async eliminarArchivosCarpetaSDK(dto: FiltroSDKDto) {

        const path = require('path');
        const fs = require('fs-extra');

        //Se llama al procedimiento en la bd. 
        const sp = 'call sp_visitas_puestos_list(?)';
        const parametros = [dto.idPuesto];

        try {
            const result = await this.dataSource.query(sp, parametros)
            const data2 = result[0][0];

            if (fs.existsSync(data2.ubicacionCarpeta)) {
                fs.readdirSync(data2.ubicacionCarpeta).forEach((archivo) => {
                    const rutaArchivo = path.join(data2.ubicacionCarpeta, archivo);

                    if (fs.lstatSync(rutaArchivo).isDirectory()) {
                        // Si es un directorio, llamamos recursivamente para eliminar su contenido

                    } else {
                        // Si es un archivo, lo eliminamos
                        fs.unlinkSync(rutaArchivo);
                        //console.log(`Archivo eliminado: ${rutaArchivo}`);
                    }
                });

                // Finalmente, eliminamos la carpeta vacía
                fs.removeSync(`${data2.ubicacionCarpeta}Page1`);
            }


            return { ok: true, message: 'Carpeta limpiada correctamente.' };
        } catch (error) {
            return { ok: false, message: 'No se pudo limpiar la carpeta.' + error.message }
        }
    }

    //Listar Visitantes
    async visitaListar(dto: VisitasListarDto, user: UsuarioEntity) {

        //Se llama al procedimiento en la bd. 
        const sp = 'call sp_visitas_list(?,?,?,?,?,?,?,?)';
        const parametros = [dto.idPuesto ? dto.idPuesto : null,
        dto.idVisita ? dto.idVisita : null,
        dto.fechaDesde ? dto.fechaDesde : null,
        dto.fechaHasta ? dto.fechaHasta : null,
        dto.marcacion ? dto.marcacion : null,
        dto.documento ? dto.documento : null,
        dto.idDependencia ? dto.idDependencia : null,
        user.id
        ];

        //Se ejecuta el sp.
        try {
            const result = await this.dataSource.query(sp, parametros)
            return { ok: true, message: 'Visitas listadas correctamente.', result: result[0] };
        } catch (error) {
            return { ok: false, message: 'No se pudo listar las visitas. ' + error.message }
        }
    }

    //Listar Visitantes Group
    async visitaListarGroup(dto: VisitasListarDto, user: UsuarioEntity) {

        //Se llama al procedimiento en la bd. 
        const sp = 'call sp_visitas_list_group(?,?,?,?,?,?,?)';
        const parametros = [dto.idVisita ? dto.idVisita : null,
        dto.fechaDesde ? dto.fechaDesde : null,
        dto.fechaHasta ? dto.fechaHasta : null,
        dto.marcacion ? dto.marcacion : null,
        dto.documento ? dto.documento : null,
        dto.idDependencia ? dto.idDependencia : null,
        user.id
        ];

        //Se ejecuta el sp.
        try {
            const result = await this.dataSource.query(sp, parametros)
            return { ok: true, message: 'Visitas listadas correctamente.', result: result[0] };
        } catch (error) {
            return { ok: false, message: 'No se pudo listar las visitas. ' + error.message }
        }
    }

    //Salida de visitas
    async visitaSalida(dto: VisitasSalidaDto) {

        //Se llama al procedimiento en la bd. 
        const sp = 'call sp_visitas_salida(?)';
        const parametros = [dto.idVisita];
        //Se ejecuta el sp.
        try {
            const result = await this.dataSource.query(sp, parametros)
            return { ok: true, message: 'Salida realizada correctamente.', result: result[0] };
        } catch (error) {
            return { ok: false, message: 'No se pudo realizar la salida. ' + error.message }
        }
    }

    //Dashboard de visitas
    async visitaDashboard() {

        //Se llama al procedimiento en la bd. 
        const sp = 'call sp_visitas_dashboard()';
        const parametros = [];
        //Se ejecuta el sp.
        try {
            const result = await this.dataSource.query(sp, parametros)
            return { ok: true, message: 'Dashboard listado correctamente.', result: result[0] };
        } catch (error) {
            return { ok: false, message: 'No se pudo listar el dashboard. ' + error.message }
        }
    }

    //Buscar Visitantes
    async visitaBuscarListar(dto: VisitasListarDto, user: UsuarioEntity) {

        //Se llama al procedimiento en la bd. 
        const sp = 'call sp_visitas_buscar_list(?)';
        const parametros = [
            dto.documento ? dto.documento : null,

        ];

        //Se ejecuta el sp.
        try {
            const result = await this.dataSource.query(sp, parametros)
            return { ok: true, message: 'Visitas listadas correctamente.', result: result[0] };
        } catch (error) {
            return { ok: false, message: 'No se pudo listar las visitas. ' + error.message }
        }
    }


    //Mostrar Imagenes Guardadas
    async verDocumentoGuardadoFoto(nroDocumento: string, imagen: string) {

        const sp = 'call sp_visitas_buscar_list(?)';
        const parametros = [nroDocumento]
        try {

            const result = await this.dataSource.query(sp, parametros)
            const data = result[0][0];

            const fullPath = `${data.url}${imagen}`;

            return fullPath;
        } catch (error) {

        }
    }











    //CREAR FOTOS AUN SIN USO

    //Crear imagen documento dorso
    async subirImgDocumentoPerfil(id: number, file: Array<any>) {
        //Se llama al procedimiento en la bd. 
        const sp = 'call sp_visitas_documento_perfil_insert(?,?)';
        const parametros = [id, file];
        //Se ejecuta el sp.
        try {
            const result = await this.dataSource.query(sp, parametros)
            return { ok: true, message: 'Imagen subida correctamente.', result: result[0][0] };
        } catch (error) {
            return { ok: false, message: 'No se pudo subir la imagen. ' + error.message }
        }
    }

    //Crear imagen documento frente
    async subirImgDocumentoFrente(id: number, file: Array<any>) {
        console.log('1', id, file)
        //Se llama al procedimiento en la bd. 
        const sp = 'call sp_visitas_documento_frente_insert(?,?)';
        const parametros = [id, file];
        console.log('2', parametros)
        //Se ejecuta el sp.
        try {
            const result = await this.dataSource.query(sp, parametros)
            return { ok: true, message: 'Imagen subida correctamente.', result: result[0][0] };
        } catch (error) {
            return { ok: false, message: 'No se pudo subir la imagen. ' + error.message }
        }
    }

    //Crear imagen documento dorso
    async subirImgDocumentoDorso(id: number, file: Array<any>) {

        //Se llama al procedimiento en la bd. 
        const sp = 'call sp_visitas_documento_dorso_insert(?,?)';
        const parametros = [id, file];
        //Se ejecuta el sp.
        try {
            const result = await this.dataSource.query(sp, parametros)
            return { ok: true, message: 'Imagen subida correctamente.', result: result[0][0] };
        } catch (error) {
            return { ok: false, message: 'No se pudo subir la imagen. ' + error.message }
        }
    }





}



