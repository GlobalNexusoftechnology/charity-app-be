import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AuthProvider {
  PHONE = 'phone',
  GOOGLE = 'google',
}

export class CreateUserDto {
  @ApiPropertyOptional({
    example: 'johndoe@mail.com',
    description: 'Email of the user (for Google/email signup)',
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: '+911234567890',
    description: 'Phone number of the user (for phone signup)',
  })
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Username of the user',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({
    example: '1234',
    description: 'Password of the user (optional for Google signup)',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    enum: AuthProvider,
    description: 'Type of signup (phone or Google)',
    default: AuthProvider.PHONE,
  })
  @IsEnum(AuthProvider)
  @IsOptional()
  auth_provider?: AuthProvider;

  @ApiPropertyOptional({
    description: 'OTP verification status',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;
}
