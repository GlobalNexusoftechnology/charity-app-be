import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class ReportPdfService {
  async generate(reportData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;

      /* ===== HEADER ===== */
      doc.rect(0, 0, pageWidth, 80).fill('#1e3a8a');

      doc
        .fillColor('#ffffff')
        .fontSize(22)
        .text('Donation Dashboard Report', 0, 30, {
          align: 'center',
        });

      doc.moveDown(3);
      doc.fillColor('#000000');

      /* ===== SUMMARY CARD ===== */
      doc
        .roundedRect(40, doc.y, pageWidth - 80, 120, 8)
        .fill('#f8fafc')
        .stroke('#c7d2fe');

      doc
        .fontSize(14)
        .fillColor('#1e3a8a')
        .text('Summary', 50, doc.y + 10, { underline: true });

      doc.moveDown();
      doc.fontSize(11).fillColor('#000000');

      doc.text(`Total Donations Amount: ₹${reportData.totalDonationsAmount}`);
      doc.text(`One-Time Donations: ₹${reportData.totalOneTimeAmount}`);
      doc.text(`Recurring Donations: ₹${reportData.totalRecurringAmount}`);
      doc.text(`Total Users: ${reportData.usersCount}`);

      doc.moveDown(2);

      /* ===== MONTHLY DONATIONS ===== */
      doc
        .fontSize(14)
        .fillColor('#1e3a8a')
        .text('Monthly Donations (Recurring)', { underline: true });

      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#000000');

      Object.entries(reportData.donationsByMonth).forEach(
        ([month, amount]: any) => {
          doc
            .circle(50, doc.y + 6, 2)
            .fill('#1e3a8a')
            .fillColor('#000000')
            .text(`${month}: ₹${amount}`, 60);
        },
      );

      doc.moveDown(2);

      /* ===== DONATION STATUS ===== */
      doc
        .roundedRect(40, doc.y, pageWidth - 80, 90, 8)
        .fill('#ecfeff')
        .stroke('#67e8f9');

      doc
        .fillColor('#0f766e')
        .fontSize(14)
        .text('Donation Status Overview', 50, doc.y + 10, {
          underline: true,
        });

      doc.moveDown();
      doc.fontSize(11).fillColor('#000000');

      doc.text(`Pending Donations: ${reportData.pendingDonations}`);
      doc.text(`Successful Donations: ${reportData.successDonations}`);

      /* ===== FOOTER ===== */
      doc.moveDown(3);
      doc
        .fontSize(9)
        .fillColor('#6b7280')
        .text(`Generated on ${new Date().toLocaleDateString()}`, {
          align: 'right',
        });

      doc.end();
    });
  }
}
