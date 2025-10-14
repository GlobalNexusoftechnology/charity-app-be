import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('family_member')
export class FamilyMember {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  userId: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  relation: string;
}
