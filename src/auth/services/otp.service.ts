import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthProvider } from '../dto/create-user.dto';
import { VerifyUserDto } from '../dto/verify-user.dto';
import { TokenPayload } from '../types/types';
import { AuthService } from './auth.service';
import { TwilioService } from './twilio.service';
import axios from 'axios';

@Injectable()
export class OtpService {
  private otpStore: Map<string, string> = new Map();

  private readonly logger = new Logger(OtpService.name);

  constructor(
    private readonly twilioService: TwilioService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private usersService: UserService,
  ) {}

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  }

  // async sendOtp(phoneNumber: string) {
  //   const otp = this.generateOtp();
  //   await this.twilioService.sendOtp(phoneNumber, otp);
  //   this.otpStore.set(phoneNumber, otp);
  //   return { message: 'OTP sent successfully' };
  // }

  async sendOtp(phone: string): Promise<any> {
    const otp = this.generateOtp();
    try {
      const url = `https://bhashsms.com/api/sendmsg.php`;
      const params = {
        user: 'IICFSMS',
        pass: '123456',
        sender: 'IICFON',
        phone: phone,
        text: `Your IICF login OTP is ${otp}. Enter this code to access your account. It will expire in 10 minutes. - Team INDO ISLAMIC CULTURAL FOUNDATION`,
        priority: 'ndnd',
        stype: 'normal',
      };

      const response = await axios.get(url, { params });
      this.logger.log(`OTP sent successfully to ${phone}`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${phone}: ${error.message}`);
      return {
        success: false,
        message: 'Failed to send OTP',
        error: error.message,
      };
    }
  }

  // async sendOtp(phoneNumber: string) {
  //   const otp = this.generateOtp();
  //   const otpUrl = `https://bhashsms.com/api/sendmsg.php?user=IICFSMS&pass=123456&sender=IICFON&phone=${phoneNumber}&text=Your%20IICF%20login%20OTP%20is%20${otp}.%20Enter%20this%20code%20to%20access%20your%20account.%20It%20will%20expire%20in%2010%20minutes.%20-%20Team%20INDO%20ISLAMIC%20CULTURAL%20FOUNDATION&priority=ndnd&stype=normal`;
  //   this.otpStore.set(phoneNumber, otp);
  //   return { message: 'OTP sent successfully' };
  // }

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
