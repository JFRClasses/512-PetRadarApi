import { Module } from '@nestjs/common';
import { LostPetsController } from './lost-pets.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from './entities/lost-pet.entity';
import { LostPetsService } from './lost-pets.service';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';
// Indices en SQL!!
// IX ID Where 10000, 20000, 30000 2s 3s 1s 50ms
// PRIMERO DEBES DE MEJORAR LAS QUERIES LO MAXIMO POSIBLES
// NO HAGAS TANTOS JOINS
// TRAETE LAS PROPIEDADES NECESARIAS SELECT name FROM
// USA INDICES
// USA VISTAS
// Cache
// REDIS "lost-pets":[{pets}]
// MOTORES DE BUSQUEDA --- Elasticsearch
// "NAME" : "juan pablo"
// WHERE NAME like '%juan%'
@Module({
  imports:[
    AuthModule,
    CacheModule,
    EmailModule,
    TypeOrmModule.forFeature([LostPet])
  ],
  controllers: [LostPetsController],
  providers: [LostPetsService]
})
export class LostPetsModule {}
