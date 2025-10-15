import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUrl,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateType, UpdatePriority } from '../entities/update.entity';

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
}
