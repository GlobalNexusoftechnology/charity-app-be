import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthHelperService } from '../services/auth-helper.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authHelperService: AuthHelperService) {
    super({
      usernameField: 'phone_number',
    });
  }

  async validate(phone_number: string) {
    return this.authHelperService.validateUser(phone_number);
  }
}
