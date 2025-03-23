import { Module } from '@nestjs/common';
import { PuntoAtencionController } from './puntoatencion.controller';
import { PuntoAtencionService } from './puntoatencion.service';

@Module({
    controllers: [PuntoAtencionController], // ✅ Debe estar aquí
    providers: [PuntoAtencionService],
    exports: [PuntoAtencionService]
})
export class PuntoAtencionModule {}
