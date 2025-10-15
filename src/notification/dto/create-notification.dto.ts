import { IsString, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  message: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  userId?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: false })
  isRead?: boolean;
}
