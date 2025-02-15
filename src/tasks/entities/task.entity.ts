import { UserBaseModifiedEntity } from "src/packages/core/base-entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('task')
export class Task extends UserBaseModifiedEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    assigned_by?: string;

    @Column()
    assigned_to?: string;
}
