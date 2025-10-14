import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthProvider } from '../dto/create-user.dto';
import { VerifyUserDto } from '../dto/verify-user.dto';
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

  async verifyOtp(dto: VerifyUserDto) {
    const { phone_number, type, otp, username } = dto;

    const storedOtp = this.otpStore.get(phone_number);

    console.log(`Verifying OTP for phone: ${phone_number}`);
    console.log(`OTP entered: ${otp}, OTP stored: ${storedOtp}`);

    if (!storedOtp) {
      console.error(`No OTP found in store for ${phone_number}`);
      throw new BadRequestException('No OTP found for this number');
    }

    if (storedOtp !== otp) {
      console.error(
        `OTP mismatch for ${phone_number}: entered ${otp}, expected ${storedOtp}`,
      );
      throw new BadRequestException('Invalid OTP');
    } else {
      this.otpStore.delete(phone_number);
      console.log(`OTP verified successfully for ${phone_number}`);

      const payload = {
        phone_number,
        username,
        auth_provider: AuthProvider.PHONE,
        isVerified: true,
      };

      if (type === 'signup') {
        const { access_token, user, refresh_token } =
          await this.authService.createUser(payload);
        console.log(
          `User created with phone ${phone_number}, userId: ${user.id}`,
        );
        return { access_token, refresh_token, user };
      } else {
        const user: any = await this.usersService.findOne(phone_number);
        if (!user) {
          console.error(`User not found in DB for phone: ${phone_number}`);
          throw new BadRequestException('User not found');
        }

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

        console.log(`Login successful for userId: ${user.id}`);

        return { access_token, refresh_token, user: tokenUser };
      }
    }
  }
}
