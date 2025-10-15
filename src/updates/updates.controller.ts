import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdatesService } from './updates.service';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';
import { QueryUpdatesDto } from './dto/query-updates.dto';
import { Update } from './entities/update.entity';

@ApiTags('updates')
@Controller('updates')
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new update' })
  @ApiResponse({
    status: 201,
    description: 'Update created successfully.',
    type: Update,
  })
  create(@Body() createUpdateDto: CreateUpdateDto): Promise<Update> {
    return this.updatesService.create(createUpdateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all updates with filters' })
  @ApiResponse({
    status: 200,
    description: 'Return all updates.',
    type: [Update],
  })
  findAll(@Query() queryDto: QueryUpdatesDto): Promise<Update[]> {
    return this.updatesService.findAll(queryDto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active updates' })
  @ApiResponse({
    status: 200,
    description: 'Return active updates.',
    type: [Update],
  })
  findActive(): Promise<Update[]> {
    return this.updatesService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get update by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return update by ID.',
    type: Update,
  })
  @ApiResponse({ status: 404, description: 'Update not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Update> {
    return this.updatesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an update' })
  @ApiResponse({
    status: 200,
    description: 'Update updated successfully.',
    type: Update,
  })
  @ApiResponse({ status: 404, description: 'Update not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUpdateDto: UpdateUpdateDto,
  ): Promise<Update> {
    return this.updatesService.update(id, updateUpdateDto);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle update active status' })
  @ApiResponse({
    status: 200,
    description: 'Update status toggled.',
    type: Update,
  })
  @ApiResponse({ status: 404, description: 'Update not found.' })
  toggleActive(@Param('id', ParseUUIDPipe) id: string): Promise<Update> {
    return this.updatesService.toggleActive(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an update' })
  @ApiResponse({ status: 200, description: 'Update deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Update not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.updatesService.remove(id);
  }
}
