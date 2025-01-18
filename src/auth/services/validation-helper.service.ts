import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { Users } from 'src/user/entities/user.entity';
import { UsersService } from 'src/user/services/user.service';
@Injectable()
export class ValidationService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private readonly configService: ConfigService,

    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async currentUser(): Promise<Users> {
    const token = this.request.headers['authorization'];
    const updatedToken = token?.replace('Bearer ', '');
    try {
      const { sub: userId } = await this.jwtService.verifyAsync(updatedToken, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET_KEY'),
      });
      return await this.userService.findOneBy(userId);
    } catch (error) {
      return error;
    }
  }

  async validateUser(userEmail: string, userPassword: string) {
    const user = await this.userService.findOneBy(userEmail);
    const isPasswordMatch = await bcrypt.compare(userPassword, user?.password);

    if (user?.email !== userEmail || !isPasswordMatch) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return user;
  }

  async getCurrentUserWithPlanAndSubscription(id: string) {
    return await this.userService.findUserBySubscriptionRelations(id);
  }
}
