import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUrl,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  UpdateFrequency,
  UpdatePriority,
  UpdateType,
} from '../enums/update.enums';

export class CreateUpdateDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsEnum(UpdateType)
  @IsOptional()
  @ApiProperty({
    enum: UpdateType,
    required: false,
    default: UpdateType.GENERAL,
    description:
      'Type of update. If type is GENERAL, it will be automatically pushed as a notification.',
  })
  type?: UpdateType;

  @IsEnum(UpdatePriority)
  @IsOptional()
  @ApiProperty({
    enum: UpdatePriority,
    required: false,
    default: UpdatePriority.MEDIUM,
  })
  priority?: UpdatePriority;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: true })
  isActive?: boolean;

  @IsUrl()
  @IsOptional()
  @ApiProperty({ required: false })
  linkUrl?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  publishedAt?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  expiresAt?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description:
      'Optional date and time when the update (and notification if GENERAL) should be pushed.',
    example: '2025-11-05T15:30:00Z',
  })
  scheduledPushAt?: string;

  @IsEnum(UpdateFrequency)
  @IsOptional()
  @ApiProperty({
    enum: UpdateFrequency,
    required: false,
    default: UpdateFrequency.NONE,
    description:
      'Frequency of automatic push for GENERAL updates. e.g., WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY.',
  })
  frequency?: UpdateFrequency;
}
