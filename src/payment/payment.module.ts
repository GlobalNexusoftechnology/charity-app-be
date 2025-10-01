import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { Donations } from './entity/donation.entity';
import { PaymentService } from './payment.service';
import { Subscription } from './entity/subscriptions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Donations, Subscription])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
