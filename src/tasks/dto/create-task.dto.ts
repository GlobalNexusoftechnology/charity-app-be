import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {
    @ApiProperty({
        example: 'name of the task',
        description: 'name of the task',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'description of the task',
        description: 'description of the task',
    })
    @IsString()
    description: string;

    @IsString()
    assigned_by?: string;

    @IsString()
    assigned_to?: string;
}
