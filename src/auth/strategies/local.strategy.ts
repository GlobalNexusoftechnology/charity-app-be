import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthHelperService } from '../services/auth-helper.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authHelperService: AuthHelperService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    return this.authHelperService.validateUser(email, password);
  }
}
