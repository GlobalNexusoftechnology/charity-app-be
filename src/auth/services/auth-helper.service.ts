import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthHelperService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}
  async currentUserById(id: string): Promise<Users> {
    try {
      return await this.userRepository.findOne({
        where: {
          id,
        },
        relations: ['plan'],
      });
    } catch (error) {
      return error;
    }
  }

  async validateUser(phone: string) {
    const user = await this.userRepository.findOneBy({ phone_number: phone });

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    
    return user;
  }

  async veryifyUserRefreshToken(refreshToken: string, userId: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      const authenticated = await bcrypt.compare(
        refreshToken,
        user.refresh_token,
      );

      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Refresh token is not valid.');
    }
  }
}
