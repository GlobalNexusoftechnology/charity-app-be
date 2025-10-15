import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ length: 255 })
  @ApiProperty()
  title: string;

  @Column('text')
  @ApiProperty()
  message: string;

  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ required: false })
  userId?: string;

  @Column({ default: false })
  @ApiProperty()
  isRead: boolean;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
}
