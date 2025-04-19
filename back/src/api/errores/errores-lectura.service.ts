import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ErroresLecturaService {
  constructor(private dataSource: DataSource) { }

  async obtenerReporteErrores(): Promise<any[]> {
    const query = `
      SELECT 
       id, DATE_FORMAT(fecha_hora , '%d/%m/%Y %H:%i:%s') as fecha_hora, json_completo , ruta_foto , ruta_frente , ruta_dorso 
      FROM errores_lectura
      ORDER BY fecha_hora DESC
  
    `;
    
    const result = await this.dataSource.query(query);
    return result;
  }
  

  async registrarErrorDesdeFrontend(dto: {
    idPuesto: number;
    jsonCompleto: any;
    descripcion_error: string;
    foto: string;
    imagenFrente: string;
    imagenDorso: string;
  }): Promise<{ ok: boolean; message: string }> {
    try {
      const sp = 'CALL sp_errores_lectura_insert(?,?,?,?,?,?,?)';
      const parametros = [
        new Date(),
        dto.idPuesto,
        JSON.stringify(dto.jsonCompleto),
        dto.descripcion_error,
        '',
        '',
        ''
      ];

      const result = await this.dataSource.query(sp, parametros);
      const insertId = result?.[0]?.[0]?.id;

      if (!insertId) {
        return { ok: false, message: 'No se pudo obtener ID del error insertado' };
      }

      const destinoBase = path.join('C:/ENTER/documentos/errorlectura', String(insertId));
      if (!fs.existsSync(destinoBase)) fs.mkdirSync(destinoBase, { recursive: true });

      const copiarImagen = (url: string, nombreArchivo: string): string => {
        try {
          if (!url) {
            console.warn(`⚠️ URL vacía para ${nombreArchivo}`);
            return '';
          }
      
          let localPath = '';
      
          if (url.includes('documento-foto')) {
            localPath = 'C:/ENTER/DOCS/Photo.png';
          } else if (url.includes('documento-frente')) {
            localPath = 'C:/ENTER/DOCS/WHITE.png';
          } else if (url.includes('documento-dorso')) {
            localPath = 'C:/ENTER/DOCS/Page1/WHITE.png';
          } else {
            console.warn(`⚠️ No se reconoce el tipo de imagen en la URL: ${url}`);
            return '';
          }
      
          console.log(`📥 Copiando desde: ${localPath}`);
      
          if (!fs.existsSync(localPath)) {
            console.warn(`❌ Archivo fuente no existe: ${localPath}`);
            return '';
          }
      
          const destino = path.join(destinoBase, nombreArchivo);
          fs.copyFileSync(localPath, destino);
      
          console.log(`✅ Copiado ${nombreArchivo} a ${destino}`);
          return destino;
        } catch (err) {
          console.log(`❌ No se pudo copiar ${nombreArchivo}: ${err.message}`);
          return '';
        }
      };
      
      

      const ruta_foto = copiarImagen(dto.foto, 'foto.png');
      const ruta_frente = copiarImagen(dto.imagenFrente, 'frente.png');
      const ruta_dorso = copiarImagen(dto.imagenDorso, 'dorso.png');

      const spUpdate = 'CALL sp_errores_lectura_update_rutas(?,?,?,?)';
      await this.dataSource.query(spUpdate, [insertId, ruta_foto, ruta_frente, ruta_dorso]);

      return { ok: true, message: 'Error de lectura registrado correctamente.' };
    } catch (error) {
      console.error('Error al registrar error de lectura:', error);
      return { ok: false, message: 'No se pudo registrar el error de lectura.' };
    }
  }
}
