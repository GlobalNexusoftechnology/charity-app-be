import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'johndoe@mail.com',
    description: 'email of the user',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '1234',
    description: 'passowrd of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
