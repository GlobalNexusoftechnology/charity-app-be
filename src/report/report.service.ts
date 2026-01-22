import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class ReportPdfService {
  async generate(reportData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // ===== HEADER =====
      doc.fontSize(20).text('Donation Dashboard Report', { align: 'center' });
      doc.moveDown(2);

      // ===== SUMMARY =====
      doc.fontSize(14).text('Summary', { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(11);
      doc.text(`Total Donations Amount: ₹${reportData.totalDonationsAmount}`);
      doc.text(`One-Time Donations: ₹${reportData.totalOneTimeAmount}`);
      doc.text(`Recurring Donations: ₹${reportData.totalRecurringAmount}`);
      doc.text(`Total Users: ${reportData.usersCount}`);
      doc.moveDown();

      // ===== DONATIONS BY MONTH =====
      doc
        .fontSize(14)
        .text('Monthly Donations (Recurring)', { underline: true });
      doc.moveDown(0.5);

      Object.entries(reportData.donationsByMonth).forEach(
        ([month, amount]: any) => {
          doc.fontSize(11).text(`${month}: ₹${amount}`);
        },
      );

      doc.moveDown();

      // ===== DONATION COUNTS =====
      doc.fontSize(14).text('Donation Status Overview', { underline: true });
      doc.moveDown(0.5);

      doc
        .fontSize(11)
        .text(`Pending Donations: ${reportData.pendingDonations}`);
      doc
        .fontSize(11)
        .text(`Successful Donations: ${reportData.successDonations}`);

      // ===== FOOTER =====
      doc.moveDown(2);
      doc
        .fontSize(9)
        .text(`Generated on ${new Date().toLocaleDateString()}`, {
          align: 'right',
        });

      doc.end();
    });
  }
}
