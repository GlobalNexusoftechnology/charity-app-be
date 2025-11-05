import {
  UpdateFrequency,
  UpdatePriority,
  UpdateType,
} from '../enums/update.enums';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('updates')
export class Update {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ length: 255 })
  @ApiProperty()
  title: string;

  @Column('text')
  @ApiProperty()
  description: string;

  @Column({ type: 'enum', enum: UpdateType, default: UpdateType.GENERAL })
  @ApiProperty({ enum: UpdateType })
  type: UpdateType;

  @Column({
    type: 'enum',
    enum: UpdatePriority,
    default: UpdatePriority.MEDIUM,
  })
  @ApiProperty({ enum: UpdatePriority })
  priority: UpdatePriority;

  @Column({ default: true })
  @ApiProperty()
  isActive: boolean;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  linkUrl?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty()
  publishedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ required: false })
  expiresAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty()
  scheduledPushAt?: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: UpdateFrequency,
    default: UpdateFrequency.NONE,
  })
  @ApiProperty({ enum: UpdateFrequency })
  frequency: UpdateFrequency;
}
