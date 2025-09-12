import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
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

  @ApiProperty({ example: '123456', description: 'OTP received on phone' })
  @IsString()
  @IsNotEmpty()
  type: 'signup' | 'signin';
}
