import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateLimiterModule } from 'nestjs-rate-limiter';
import { RolesGuard } from 'src/packages/authorization/roles.guard';
import { Roles } from 'src/roles/entities/roles.entity';
import { RolesModule } from 'src/roles/roles.module';
import { Users } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthHelperService } from './services/auth-helper.service';
import { AuthService } from './services/auth.service';
import { OtpService } from './services/otp.service';
import { TwilioService } from './services/twilio.service';
import { ValidationService } from './services/validation-helper.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
    TypeOrmModule.forFeature([Users, Roles]),
    RolesModule,
    RateLimiterModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    RolesGuard,
    ValidationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    OtpService,
    TwilioService,
    AuthHelperService,
    GoogleStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    {
      provide: OtpService,
      useClass: OtpService,
    },
    AuthService,
  ],
  exports: [
    AuthService,
    ValidationService,
    JwtModule,
    OtpService,
    TwilioService,
  ],
})
export class AuthModule {}
