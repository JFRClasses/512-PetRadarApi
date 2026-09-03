import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {

    constructor(
        private usersService:UsersService
    ){}

    async register(dto:CreateUserDto){
        const id = await this.usersService.create(dto);
        return id;
    }

    async login(dto:LoginDto){
        const id = await this.usersService.validate(dto.email,dto.password);
        if(!id) throw new BadRequestException("El email o la contraseña no es valido");
        return id;
    }
}
