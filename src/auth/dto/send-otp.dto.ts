import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({
    example: '+911234567890',
    description: 'Phone number to send OTP',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    example: 'login',
    description: 'Type of OTP request: login or signup',
    enum: ['login', 'signup'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['login', 'signup'])
  type: 'login' | 'signup';
}
