import { envs } from "src/config/envs";
import { LostPet } from "src/lost-pets/entities/lost-pet.entity";
import { DataSourceOptions } from "typeorm";

export const dataSourceOptions : DataSourceOptions = {
    host: envs.DB_HOST,
    type: 'postgres',
    port: envs.DB_PORT,
    database: envs.DB_NAME,
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    entities: [LostPet],
    synchronize: false,
    migrations: ['']
}