import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Update } from './entities/update.entity';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';
import { QueryUpdatesDto } from './dto/query-updates.dto';

@Injectable()
export class UpdatesService {
  constructor(
    @InjectRepository(Update)
    private updatesRepository: Repository<Update>,
  ) {}

  async create(createUpdateDto: CreateUpdateDto): Promise<Update> {
    const update = this.updatesRepository.create(createUpdateDto);
    return this.updatesRepository.save(update);
  }

  async findAll(queryDto: QueryUpdatesDto): Promise<Update[]> {
    const { type, priority, isActive, limit = '10', offset = '0' } = queryDto;

    const options: FindManyOptions<Update> = {
      take: parseInt(limit),
      skip: parseInt(offset),
      order: { publishedAt: 'DESC' },
    };

    const where: any = {};

    if (type) where.type = type;
    if (priority) where.priority = priority;
    if (isActive !== undefined) where.isActive = isActive;

    options.where = where;

    return this.updatesRepository.find(options);
  }

  async findActive(): Promise<Update[]> {
    return this.updatesRepository.find({
      where: {
        isActive: true,
      },
      order: { publishedAt: 'DESC' },
      take: 20,
    });
  }

  async findOne(id: string): Promise<Update> {
    const update = await this.updatesRepository.findOne({ where: { id } });

    if (!update) {
      throw new NotFoundException(`Update with ID ${id} not found`);
    }

    return update;
  }

  async update(id: string, updateUpdateDto: UpdateUpdateDto): Promise<Update> {
    const update = await this.findOne(id);

    Object.assign(update, updateUpdateDto);

    return this.updatesRepository.save(update);
  }

  async remove(id: string): Promise<void> {
    const result = await this.updatesRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Update with ID ${id} not found`);
    }
  }

  async toggleActive(id: string): Promise<Update> {
    const update = await this.findOne(id);
    update.isActive = !update.isActive;
    return this.updatesRepository.save(update);
  }
}
