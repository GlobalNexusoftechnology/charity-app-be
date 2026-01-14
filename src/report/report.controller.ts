import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { ReportPdfService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(
    private readonly userService: UserService,
    private readonly reportPdfService: ReportPdfService,
  ) {}

  @Get('dashboard/pdf')
  async downloadReport(@Res() res: Response) {
    const reportData = await this.userService.report();
    const pdfBuffer = await this.reportPdfService.generate(reportData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=dashboard-report.pdf',
    );

    res.end(pdfBuffer);
  }
}
