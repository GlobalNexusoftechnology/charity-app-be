import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { FamilyMemberService } from './family-member.service';
import { CreateFamilyMemberDto } from './dto/create-family-member.dto';

@Controller('family-member')
export class FamilyMemberController {
  constructor(private readonly service: FamilyMemberService) {}

  @Post('add')
  async add(@Body() dto: CreateFamilyMemberDto) {
    return this.service.addMember(dto);
  }

  @Get('list/:userId')
  async list(@Param('userId') userId: string) {
    return this.service.listMembers(userId);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.service.deleteMember(id);
  }
}
