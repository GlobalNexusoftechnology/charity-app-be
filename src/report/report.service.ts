import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class ReportPdfService {
  async generate(reportData: any): Promise<Buffer> {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

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
    doc.fontSize(14).text('Monthly Donations (Recurring)', { underline: true });
    doc.moveDown(0.5);

    Object.entries(reportData.donationsByMonth).forEach(
      ([month, amount]: any) => {
        doc.fontSize(11).text(`${month}: ₹${amount}`);
      },
    );

    doc.moveDown();

    // ===== USER REGISTRATIONS =====
    doc.fontSize(14).text('Monthly User Registrations', { underline: true });
    doc.moveDown(0.5);

    Object.entries(reportData.monthlyUsers).forEach(([month, count]: any) => {
      doc.fontSize(11).text(`${month}: ${count} users`);
    });

    doc.moveDown();

    // ===== DONATION COUNTS =====
    doc.fontSize(14).text('Donation Status Overview', { underline: true });
    doc.moveDown(0.5);

    doc
      .fontSize(11)
      .text(`Pending Donations: ${reportData.pendingDonations.length}`);
    doc.text(`Successful Donations: ${reportData.successDonations.length}`);

    // ===== FOOTER =====
    doc.moveDown(2);
    doc.fontSize(9).text(`Generated on ${new Date().toLocaleDateString()}`, {
      align: 'right',
    });

    doc.end();

    return Buffer.concat(buffers);
  }
}
