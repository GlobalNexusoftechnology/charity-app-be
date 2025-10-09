import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { FamilyMemberService } from './family-member.service';
import { CreateFamilyMemberDto } from './dto/create-family-member.dto';
import { FamilyMember } from './entities/family-member.entity';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('family-member')
@Controller('family-member')
export class FamilyMemberController {
  constructor(private readonly service: FamilyMemberService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add family member' })
  @ApiBody({ type: CreateFamilyMemberDto })
  @ApiResponse({ status: 201, type: FamilyMember })
  add(@Body() dto: CreateFamilyMemberDto) {
    return this.service.addMember(dto);
  }

  @Get('list/:userId')
  @ApiOperation({ summary: 'List family members for user' })
  @ApiParam({ name: 'userId', type: String })
  @ApiResponse({ status: 200, type: [FamilyMember] })
  list(@Param('userId') userId: string) {
    return this.service.listMembers(userId);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete family member by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200 })
  delete(@Param('id') id: string) {
    return this.service.deleteMember(id);
  }
}
