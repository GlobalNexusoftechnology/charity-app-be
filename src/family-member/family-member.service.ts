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

  addMember(dto: CreateFamilyMemberDto) {
    const member = this.repo.create(dto);
    return this.repo.save(member);
  }

  listMembers(userId: string) {
    return this.repo.find({ where: { userId } });
  }

  deleteMember(id: string) {
    return this.repo.delete(id);
  }
}
