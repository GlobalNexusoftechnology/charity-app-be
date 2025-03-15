import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try{
    const task = this.taskRepository.create(createTaskDto);
    task.created_on = Math.floor(Date.now() / 1000);
    return await this.taskRepository.save(task);
    }
    catch(error){
      console.log('[Create Task]:', error);
      throw error;
    }
    
  }

  async findAll() {
    return await this.taskRepository.find()
  }

  async findOne(id: string) {
    return await this.taskRepository.findOneBy({id});
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try{
      const task = await this.taskRepository.findOneBy({id});
      if(!task){
        throw new BadRequestException('User does not exist');
      }
      task.modified_on = Math.floor(Date.now() / 1000);
      await this.taskRepository.update(id, updateTaskDto);
      return {
        message: 'User updated successfully',
      }
    } catch(error) {
      console.log('[Update task]:', error);
      throw error;
    }
  }

  async remove(id: string) {
    return await this.taskRepository.delete(id);
  }


  async assignTask(id: string, updateTaskDto, user_id){
    try{
      const task = await this.taskRepository.findOneBy({id});
      if(!task){
        throw new BadRequestException('Task does not exist');
      }
      task.assigned_by = user_id;
      task.modified_on = Math.floor(Date.now() / 1000);
      await this.taskRepository.update(id, UpdateTaskDto);
    } catch(error){
      console.log('[Assign Employee]:', error);
    }
  }
}
