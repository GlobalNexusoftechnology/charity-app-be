import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({
    example: '+911234567890',
    description: 'Phone number to send OTP',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;
}
