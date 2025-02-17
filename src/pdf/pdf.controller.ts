import { Controller, Get, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get()
  async getPdf(@Res() res: Response): Promise<void> {
    const pdfBuffer = await this.pdfService.generatePdf();

    // Set response headers
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=generated.pdf',
    });

    // Send PDF as a response
    res.send(pdfBuffer);
  }
}
