import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private repo: Repository<Notification>,
  ) {}

  create(dto: CreateNotificationDto): Promise<Notification> {
    const notif = this.repo.create(dto);
    return this.repo.save(notif);
  }

  findAll(userId?: string): Promise<Notification[]> {
    return this.repo.find({
      where: userId ? { userId } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notif = await this.repo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException(`Notification ${id} not found`);
    return notif;
  }

  async update(id: string, dto: UpdateNotificationDto): Promise<Notification> {
    const notif = await this.findOne(id);
    Object.assign(notif, dto);
    return this.repo.save(notif);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Notification ${id} not found`);
    }
  }

  async sendPushNotification(
  expoPushToken: string,
  title: string,
  message: string,
) {
  return axios.post(
    'https://exp.host/--/api/v2/push/send',
    {
      to: expoPushToken,
      title,
      body: message,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

}
