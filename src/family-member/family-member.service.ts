import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamilyMember } from './entities/family-member.entity';
import { CreateFamilyMemberDto } from './dto/create-family-member.dto';

@Injectable()
export class FamilyMemberService {
  constructor(
    @InjectRepository(FamilyMember)
    private repo: Repository<FamilyMember>,
  ) {}

  async addMember(dto: CreateFamilyMemberDto) {
    console.log('🔍 Adding member:', dto);

    const member = this.repo.create(dto);
    console.log('📝 Created entity:', member);

    const saved = await this.repo.save(member);
    console.log('💾 Saved result:', saved);

    return saved;
  }

  async listMembers(userId: string) {
    console.log('📋 Listing members for userId:', userId);

    const members = await this.repo.find({ where: { userId } });
    console.log('📊 Found members:', members);

    return members;
  }

  async deleteMember(id: string) {
    console.log('🗑️ Deleting member:', id);
    return this.repo.delete(id);
  }
}
