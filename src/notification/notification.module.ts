import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notification.service';
import { NotificationsController } from './notification.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [NotificationsService, UserModule],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
