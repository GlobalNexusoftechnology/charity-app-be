// certificate.module.ts
import { Module } from '@nestjs/common';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';
import { Pool } from 'pg';

@Module({
  controllers: [CertificateController],
  providers: [
    CertificateService,
    {
      provide: Pool,
      useFactory: () =>
        new Pool({
          connectionString: process.env.DATABASE_URL,
        }),
    },
  ],
})
export class CertificateModule {}
