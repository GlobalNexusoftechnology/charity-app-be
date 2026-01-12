import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Donations } from 'src/payment/entity/donation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Donations])],
  controllers: [UserController],
  providers: [UserService ],
  exports: [UserService],
})
export class UserModule {}
