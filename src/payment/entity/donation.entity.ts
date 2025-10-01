import { Users } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('donations')
export class Donations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  donor_name: string;

  @Column({ length: 100 })
  donor_email: string;

  @Column({ length: 15 })
  donor_contact: string;

  @Column('int')
  amount: number;

  @Column({ length: 3, default: 'INR' })
  currency: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @Column({ length: 100, nullable: true })
  razorpay_payment_id: string;

  @Column({ length: 100 })
  razorpay_order_id: string;

  @Column({ nullable: true })
  razorpay_signature: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Users, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
