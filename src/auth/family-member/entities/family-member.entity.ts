import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class FamilyMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column()
  relation: string;
}
