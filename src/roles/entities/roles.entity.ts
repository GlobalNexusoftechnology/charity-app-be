import { UserBaseModifiedEntity } from 'src/packages/core/base-entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Roles extends UserBaseModifiedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column('text', { array: true, nullable: false })
  permissions: string[];
}
