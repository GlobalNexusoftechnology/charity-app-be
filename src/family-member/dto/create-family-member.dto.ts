import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFamilyMemberDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  relation: string;
}
