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

      const pageWidth = doc.page.width;
      let y = 100; // 🔥 controlled vertical position

      // ===== FONTS =====
      doc.registerFont('poppins', 'src/assets/fonts/Poppins-Regular.ttf');
      doc.registerFont('poppinsBold', 'src/assets/fonts/Poppins-SemiBold.ttf');

      // ===== HEADER =====
      doc.rect(0, 0, pageWidth, 80).fill('#1e40af');

      doc
        .font('poppinsBold')
        .fillColor('#ffffff')
        .fontSize(22)
        .text('Donation Dashboard Report', 0, 30, {
          align: 'center',
        });

      doc.fillColor('#000000');

      // ===== SUMMARY CARD =====
      doc
        .roundedRect(40, y, pageWidth - 80, 130, 10)
        .fill('#f8fafc')
        .stroke('#c7d2fe');

      doc
        .font('poppinsBold')
        .fontSize(14)
        .fillColor('#1e40af')
        .text('Summary', 55, y + 15);

      doc.font('poppins').fontSize(11).fillColor('#000000');

      let textY = y + 45;
      doc.text(
        `Total Donations Amount: ₹${reportData.totalDonationsAmount}`,
        55,
        textY,
      );
      doc.text(
        `One-Time Donations: ₹${reportData.totalOneTimeAmount}`,
        55,
        (textY += 18),
      );
      doc.text(
        `Recurring Donations: ₹${reportData.totalRecurringAmount}`,
        55,
        (textY += 18),
      );
      doc.text(`Total Users: ${reportData.usersCount}`, 55, (textY += 18));

      y += 160;

      // ===== MONTHLY DONATIONS =====
      doc
        .font('poppinsBold')
        .fontSize(14)
        .fillColor('#1e40af')
        .text('Monthly Donations (Recurring)', 40, y);

      y += 25;
      doc.font('poppins').fontSize(11).fillColor('#000000');

      Object.entries(reportData.donationsByMonth).forEach(
        ([month, amount]: any) => {
          doc.circle(45, y + 6, 3).fill('#1e40af');

          doc.fillColor('#000000').text(`${month}: ₹${amount}`, 55, y);

          y += 18;
        },
      );

      y += 20;

      // ===== STATUS CARD =====
      doc
        .roundedRect(40, y, pageWidth - 80, 90, 10)
        .fill('#ecfeff')
        .stroke('#67e8f9');

      doc
        .font('poppinsBold')
        .fontSize(14)
        .fillColor('#0f766e')
        .text('Donation Status Overview', 55, y + 15);

      doc.font('poppins').fontSize(11).fillColor('#000000');

      doc.text(`Pending Donations: ${reportData.pendingDonations}`, 55, y + 45);
      doc.text(
        `Successful Donations: ${reportData.successDonations}`,
        55,
        y + 63,
      );

      // ===== FOOTER =====
      doc
        .fontSize(9)
        .fillColor('#6b7280')
        .text(
          `Generated on ${new Date().toLocaleDateString()}`,
          40,
          doc.page.height - 50,
          { align: 'right' },
        );

      doc.end();
    });
  }
}
