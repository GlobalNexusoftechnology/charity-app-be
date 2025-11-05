import { IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdatePriority, UpdateType } from '../enums/update.enums';

export class QueryUpdatesDto {
  @IsOptional()
  @IsEnum(UpdateType)
  @ApiProperty({ enum: UpdateType, required: false })
  type?: UpdateType;

  @IsOptional()
  @IsEnum(UpdatePriority)
  @ApiProperty({ enum: UpdatePriority, required: false })
  priority?: UpdatePriority;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, default: '10' })
  limit?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, default: '0' })
  offset?: string;
}
