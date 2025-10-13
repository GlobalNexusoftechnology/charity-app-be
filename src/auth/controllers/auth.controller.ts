import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { RateLimit, RateLimiterGuard } from 'nestjs-rate-limiter';
import { Public } from 'src/public-strategy';
import { Users } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CurrentUser } from '../decorators/current-user-decorator';
import { SendOtpDto } from '../dto/send-otp.dto';
import { VerifyUserDto } from '../dto/verify-user.dto';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';
import { OtpService } from '../services/otp.service';

@Controller('auth')
@ApiTags('Auth Controller')
export class AuthController {
  constructor(
    private authService: AuthService,
    private otpService: OtpService,
    private userService: UserService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  // @UseGuards(LocalAuthGuard)
  // @RateLimit({
  //   points: 5,
  //   duration: 60,
  // })
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: 200,
    description: 'Login Successfully',
  })
  async signIn(
    // @CurrentUser() user: Users,
    @Body()
    signInDto: {
      phone_number: string;
    },
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const result = await this.authService.signIn(response, signInDto);
      return {
        result,
      };
    } catch (error) {
      console.log('Error: for fn signIn', error);
      throw error ?? 'Error Plz try again';
    }
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @UseGuards(RateLimiterGuard)
  @RateLimit({
    points: 5,
    duration: 60,
  })
  @ApiOperation({ summary: 'User Signup' })
  @ApiResponse({
    status: 200,
    description: 'SignUp Successfully',
  })
  async signUp(
    @Body()
    signUpDto: {
      phone_number: string;
    },
  ) {
    try {
      return this.authService.signUp(signUpDto);
    } catch (error) {
      console.error('Error during sign-up:', error);
      throw error;
    }
  }

  @ApiBearerAuth('authorization')
  @HttpCode(HttpStatus.OK)
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User Details' })
  @ApiResponse({
    status: 200,
    description: 'User found',
  })
  async authMe(@CurrentUser() user: Users) {
    try {
      return user;
    } catch (error) {
      console.error('Error while fetching the user:', error);
      throw error;
    }
  }

  @ApiBearerAuth('authorization')
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Log Out Successfully' })
  @ApiResponse({
    status: 200,
    description: 'Log Out Successfully',
  })
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', { httpOnly: true });
    response.clearCookie('refresh_token', { httpOnly: true });
    return {
      message: 'Log Out Successfully',
    };
  }

  // @Public()
  // @HttpCode(HttpStatus.OK)
  // @Post('refresh-token')
  // @UseGuards(JwtRefreshAuthGuard)
  // @ApiOperation({ summary: 'Refresh token' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'token refreshed successfully',
  // })
  // async refresh(
  //   @CurrentUser() user: Users,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   try {
  //     const result = await this.authService.signIn(response, user);
  //     return {
  //       msg "TEST"};
  //   } catch (error) {
  //     console.log('Error: for fn signIn', error);
  //     throw error ?? 'Error Plz try again';
  //   }
  // }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async loginGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req) {
    await this.authService.googleLogin(req.user);
  }

  @Post('change-password')
  async changePassword(
    @Req() req: any,
    @Body() body: { userId: string; password: string },
  ): Promise<{ message: string }> {
    const userId = req.user.id; // Extract user ID from the JWT payload
    const { password } = body;

    await this.authService.changePassword(userId, password);
    return { message: 'Password changed successfully' };
  }

  //OTP
  @Public()
  @Post('send-otp')
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.otpService.sendOtp(dto.phone_number);
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyUserDto) {
    return this.otpService.verifyOtp(dto);
  }

  // Example of a protected route
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    // return req.user;
    return this.userService.findOne(req.user.phone_number);
  }
}
