import { Module } from '@nestjs/common';
import { TramitesController } from './tramites.controller';
import { TramitesService } from './tramites.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([])], // Si tienes entidades, agrégalas aquí
    controllers: [TramitesController],
    providers: [TramitesService],
})
export class TramitesModule {}
