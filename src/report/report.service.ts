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
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // ✅ REGISTER FONTS
      doc.registerFont('poppins', this.poppinsRegular);
      doc.registerFont('poppinsBold', this.poppinsSemiBold);

      const pageWidth = doc.page.width;

      /* ===== HEADER ===== */
      doc.rect(0, 0, pageWidth, 80).fill('#1e3a8a');

      doc
        .font('poppinsBold')
        .fillColor('#ffffff')
        .fontSize(22)
        .text('Donation Dashboard Report', 0, 30, {
          align: 'center',
        });

      doc.moveDown(3);
      doc.fillColor('#000000');

      /* ===== SUMMARY ===== */
      doc
        .font('poppinsBold')
        .fontSize(14)
        .fillColor('#1e3a8a')
        .text('Summary', { underline: true });

      doc.moveDown(0.5);

      doc.font('poppins').fontSize(11);
      doc.text(`Total Donations Amount: ₹${reportData.totalDonationsAmount}`);
      doc.text(`One-Time Donations: ₹${reportData.totalOneTimeAmount}`);
      doc.text(`Recurring Donations: ₹${reportData.totalRecurringAmount}`);
      doc.text(`Total Users: ${reportData.usersCount}`);

      doc.moveDown();

      /* ===== MONTHLY DONATIONS ===== */
      doc
        .font('poppinsBold')
        .fontSize(14)
        .fillColor('#1e3a8a')
        .text('Monthly Donations (Recurring)', { underline: true });

      doc.moveDown(0.5);
      doc.font('poppins').fontSize(11);

      Object.entries(reportData.donationsByMonth).forEach(
        ([month, amount]: any) => {
          doc.text(`• ${month}: ₹${amount}`);
        },
      );

      doc.moveDown();

      /* ===== DONATION STATUS ===== */
      doc
        .font('poppinsBold')
        .fontSize(14)
        .fillColor('#0f766e')
        .text('Donation Status Overview', { underline: true });

      doc.moveDown(0.5);
      doc.font('poppins').fontSize(11).fillColor('#000000');

      doc.text(`Pending Donations: ${reportData.pendingDonations}`);
      doc.text(`Successful Donations: ${reportData.successDonations}`);

      /* ===== FOOTER ===== */
      doc.moveDown(3);
      doc
        .font('poppins')
        .fontSize(9)
        .fillColor('#6b7280')
        .text(`Generated on ${new Date().toLocaleDateString()}`, {
          align: 'right',
        });

      doc.end();
    });
  }
}
