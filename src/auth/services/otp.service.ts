import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthProvider, CreateUserDto } from '../dto/create-user.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { TokenPayload } from '../types/types';
import { AuthService } from './auth.service';
import { TwilioService } from './twilio.service';

@Injectable()
export class OtpService {
  private otpStore: Map<string, string> = new Map();

  constructor(
    private readonly twilioService: TwilioService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private usersService: UserService,
  ) {}

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  }

  async sendOtp(phoneNumber: string) {
    const otp = this.generateOtp();
    await this.twilioService.sendOtp(phoneNumber, otp);
    this.otpStore.set(phoneNumber, otp);
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(dto: VerifyOtpDto & CreateUserDto) {
    const { phone_number, type, otp, username } = dto;

    const storedOtp = this.otpStore.get(phone_number);
    if (!storedOtp) {
      throw new BadRequestException('No OTP found for this number');
    }

    console.log(storedOtp, otp);
    if (storedOtp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }
    this.otpStore.delete(phone_number);

    const payload = {
      phone_number,
      username,
      auth_provider: AuthProvider.PHONE,
      isVerified: true,
    };

    // after verification create user;
    if (type === 'signup') {
      const { access_token, user } = await this.authService.createUser(payload);
      return { access_token, user };
      // this.authService.createUser(payload, response);
    } else {
      const user: any = await this.usersService.findOne(phone_number);

      const userPayload: TokenPayload = {
        sub: user.id,
        email: user.email,
        username: user.username,
      };

      const {
        access_token,
        refresh_token,
        user: tokenUser,
      } = await this.authService.generateTokenForUser(userPayload, user);

      return { access_token, refresh_token, user: tokenUser };

      // this.authService.generateTokenForUser(response, userPayload, user);
    }
  }
}
