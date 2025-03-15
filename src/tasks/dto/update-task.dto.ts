import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {

    @IsString()
    assigned_by?: string;

    @IsString()
    assigned_to?: string;
}
