import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notification.service';
import { BadRequestException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly service: NotificationsService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create notification' })
  @ApiResponse({ status: 201, type: Notification })
  create(@Body() dto: CreateNotificationDto): Promise<Notification> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List notifications' })
  @ApiResponse({ status: 200, type: [Notification] })
  findAll(@Query('userId') userId?: string): Promise<Notification[]> {
    return this.service.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({ status: 200, type: Notification })
  findOne(@Param('id') id: string): Promise<Notification> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update notification' })
  @ApiResponse({ status: 200, type: Notification })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }


  @Post('push')
  @ApiOperation({ summary: 'Send push notification & save record' })
  async pushNotification(
    @Body()
    body: {
      title: string;
      message: string;
      userId: string;
    },
  ): Promise<Notification> {
    const user = await this.userService.findOne(body.userId);

    if (!user?.expoPushToken) {
      throw new BadRequestException('User has no push token');
    }

    // 1️⃣ Send push notification
    await this.service.sendPushNotification(
      user.expoPushToken,
      body.title,
      body.message,
    );

    // 2️⃣ Save notification record (existing logic)
    return this.service.create({
      title: body.title,
      message: body.message,
      userId: body.userId,
      isRead: false,
    });
  }

}
