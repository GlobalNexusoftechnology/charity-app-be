import { UserBaseModifiedEntity } from 'src/packages/core/base-entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum AuthProvider {
  PHONE = 'phone',
  GOOGLE = 'google',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('users')
export class Users extends UserBaseModifiedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 15, unique: true, nullable: true })
  phone_number?: string;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  password?: string;

  @Column({ type: 'uuid' })
  role_id: string;

  @Column({ type: 'text', unique: true, nullable: true })
  refresh_token?: string;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.PHONE })
  auth_provider: AuthProvider;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;
  expoPushToken: any;

  @Column({ nullable: true })
  expo_push_token?: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;
}
