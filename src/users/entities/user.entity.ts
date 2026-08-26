import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { Point } from "typeorm";
// EJERCICIO, crear modulo y entidad en db de USUARIO, SYSTEM_USER, id, name, lastName, email, password, isPetAlertEnabled, location, radius
@Entity("SYSTEM_USER")
export class User{
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    name!: string;
    @Column()
    lastName!: string;
    @Column()
    email!: string;
    @Column()
    password!: string;
    @Column()
    isPetAlertEnabled!: boolean;
    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326
    })
    location!: Point;
    @Column()
    radius!: number;
}