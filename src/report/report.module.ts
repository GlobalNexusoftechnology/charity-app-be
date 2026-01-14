import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportController } from './report.controller';
import { ReportPdfService } from './report.service';

import { UserService } from '../user/user.service';
import { Users } from 'src/user/entities/user.entity';
import { Donations } from 'src/payment/entity/donation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Donations])],
  controllers: [ReportController],
  providers: [
    UserService, // uses your existing report() method
    ReportPdfService, // PDF generator
  ],
})
export class ReportModule {}
