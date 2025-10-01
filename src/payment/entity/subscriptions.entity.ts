import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column()
  razorpay_subscription_id: string;

  @Column({ nullable: true })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  current_period_start: Date;

  @Column({ type: 'timestamp', nullable: true })
  current_period_end: Date;

  @Column({ type: 'timestamp', nullable: true })
  next_billing_date: Date;

  @Column({ type: 'varchar' })
  plan_period: 'weekly' | 'monthly' | 'yearly';

  @Column({ type: 'int' })
  plan_interval: number;

  @Column('int')
  amount: number;

  @CreateDateColumn()
  created_at: Date;
}
