import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as path from 'path';

@Injectable()
export class ReportPdfService {
  poppinsRegular = path.join(
    process.cwd(),
    'src/assets/fonts/Poppins-Regular.ttf',
  );

  poppinsSemiBold = path.join(
    process.cwd(),
    'src/assets/fonts/Poppins-SemiBold.ttf',
  );
  async generate(reportData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const PAGE_WIDTH = 595; // A4 width
      const TOP_MARGIN = 40;
      const BOTTOM_MARGIN = 40;

      let y = 100;

      const doc = new PDFDocument({
        size: [PAGE_WIDTH, 421], // temp height
        margins: {
          top: TOP_MARGIN,
          bottom: BOTTOM_MARGIN,
          left: 40,
          right: 40,
        },
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // ===== FONTS =====
      doc.registerFont('poppins', 'assets/fonts/Poppins-Regular.ttf');
      doc.registerFont('poppinsBold', 'assets/fonts/Poppins-SemiBold.ttf');

      // ===== HEADER =====
      doc.rect(0, 0, PAGE_WIDTH, 80).fill('#1e40af');
      doc
        .font('poppinsBold')
        .fillColor('#ffffff')
        .fontSize(22)
        .text('Donation Dashboard Report', 0, 30, { align: 'center' });

      doc.fillColor('#000000');

      // ===== TABLE DRAW FUNCTION =====
      const drawTable = (startY: number, rows: string[][]) => {
        const colWidth = (PAGE_WIDTH - 80) / 2;
        const rowHeight = 22;
        let currentY = startY;

        rows.forEach((row, rowIndex) => {
          let currentX = 40;

          row.forEach((cell) => {
            doc.rect(currentX, currentY, colWidth, rowHeight).stroke();
            doc
              .font(rowIndex === 0 ? 'poppinsBold' : 'poppins')
              .fontSize(11)
              .text(cell, currentX + 6, currentY + 6, {
                width: colWidth - 12,
              });
            currentX += colWidth;
          });

          currentY += rowHeight;
        });

        return currentY;
      };

      // ===== SUMMARY =====
      doc.font('poppinsBold').fontSize(14).fillColor('#1e40af');
      doc.text('Summary', 40, y);
      y += 20;

      y = drawTable(y, [
        ['Metric', 'Value'],
        ['Total Donations Amount', `₹${reportData.totalDonationsAmount}`],
        ['One-Time Donations', `₹${reportData.totalOneTimeAmount}`],
        ['Recurring Donations', `₹${reportData.totalRecurringAmount}`],
        ['Total Users', `${reportData.usersCount}`],
      ]);

      // ===== MONTHLY =====
      y += 25;
      doc.text('Monthly Donations (Recurring)', 40, y);
      y += 20;

      y = drawTable(y, [
        ['Month', 'Amount'],
        ...Object.entries(reportData.donationsByMonth).map(
          ([month, amount]: any) => [month, `₹${amount}`],
        ),
      ]);

      // ===== STATUS =====
      y += 25;
      doc.fillColor('#0f766e');
      doc.text('Donation Status Overview', 40, y);
      y += 20;

      y = drawTable(y, [
        ['Status', 'Count'],
        ['Pending Donations', `${reportData.pendingDonations}`],
        ['Successful Donations', `${reportData.successDonations}`],
      ]);

      // ===== FOOTER =====
      y += 30;
      doc
        .font('poppins')
        .fontSize(9)
        .fillColor('#6b7280')
        .text(`Generated on ${new Date().toLocaleDateString()}`, 40, y, {
          align: 'right',
        });

      // 🔥 Resize page to actual content height
      doc.page.height = y + BOTTOM_MARGIN;

      doc.end();
    });
  }
}
