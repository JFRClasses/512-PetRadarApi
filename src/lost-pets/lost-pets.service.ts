import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LostPet } from './entities/lost-pet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLostPetDto } from './dtos/create-lost-pet.dto';

@Injectable()
export class LostPetsService {

    constructor(
        @InjectRepository(LostPet)
        private lostPetRepository : Repository<LostPet>
    ){}

    async findAllPets(){
        return await this.lostPetRepository.find();
    }

    async createLostPet(dto: CreateLostPetDto){
        const lostPet = this.lostPetRepository.create({
            age: dto.age,
            name: dto.name,
            color: dto.color,
            ownerName: dto.ownerName,
            race: dto.race,
            phone: dto.phone,
            type: dto.type,
            location: {
                type: 'Point',
                coordinates: [dto.lon,dto.lat]
            }
        });
        return await this.lostPetRepository.save(lostPet);
    }
}
