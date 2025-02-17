import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PDFDocument, StandardFonts } from 'pdf-lib';

@Injectable()
export class PdfService {
  private config: any;

  constructor() {
    // Load config.json file
    const configPath = 'src/pdf/config.json';
    this.config = JSON.parse(readFileSync(configPath, 'utf-8'));
  }

  async generatePdf(): Promise<Buffer> {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    // Embed the Helvetica font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Draw the title
    const { width, height } = page.getSize();
    const fontSize = 30;
    const text = this.config.title;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: height - 50,
      size: fontSize,
      font: font,
    });

    // Draw the content
    const contentFontSize = 12;
    page.drawText(this.config.content, {
      x: 50,
      y: height - 100,
      size: contentFontSize,
      font: font,
    });

    // Draw the author and date
    page.drawText(`Author: ${this.config.author}`, {
      x: 50,
      y: height - 150,
      size: contentFontSize,
      font: font,
    });

    page.drawText(`Date: ${this.config.date}`, {
      x: 50,
      y: height - 170,
      size: contentFontSize,
      font: font,
    });

    // Serialize the PDF to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Convert to Buffer
    return Buffer.from(pdfBytes);
  }
}