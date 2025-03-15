import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Admin',
    description: 'Name of the role',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: '["11","112","333"]',
    description: 'Permission of the role',
  })
  @IsString()
  @IsNotEmpty()
  permissions: string[];
}
