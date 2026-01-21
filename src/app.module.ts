import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/typeorm';
import { RolesModule } from './roles/roles.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PdfService } from './pdf/pdf.service';
import { PdfController } from './pdf/pdf.controller';
import { ExcelController } from './excel/excel.controller';
import { ExcelService } from './excel/excel.service';
import { PaymentModule } from './payment/payment.module';
import { FamilyMemberModule } from './family-member/family-member.module';
import { UpdatesModule } from './updates/updates.module';
import { NotificationsModule } from './notification/notification.module';
import { ReportModule } from './report/report.module';
import { CertificateModule } from './certificate/certificate.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    RolesModule,
    UserModule,
    AuthModule,
    NotificationsModule,
    PaymentModule,
    FamilyMemberModule,
    UpdatesModule,
    ReportModule,
    CertificateModule,
  ],
  controllers: [AppController, PdfController, ExcelController],
  providers: [AppService, PdfService, ExcelService],
})
export class AppModule {}
