import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthProvider } from './create-user.dto';

export class VerifyUserDto {
  @ApiProperty({
    example: '+911234567890',
    description: 'Phone number to verify OTP',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ example: '123456', description: 'OTP received on phone' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: 'signup', description: 'OTP received on phone' })
  @IsString()
  @IsNotEmpty()
  type: 'signup' | 'signin';

  @ApiPropertyOptional({
    example: 'johndoe@mail.com',
    description: 'Email of the user (for Google/email signup)',
  })
  @IsString()
  @IsOptional()
  email?: string;

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
