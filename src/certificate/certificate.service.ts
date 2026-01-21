// certificate.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class CertificateService {
  constructor(private readonly pool: Pool) {}

  async generateCertificatePdf(id: string) {
    const { rows } = await this.pool.query(
      `SELECT name, course, issued_at FROM certificates WHERE id = $1`,
      [id],
    );

    if (!rows.length) {
      throw new NotFoundException('Certificate not found');
    }

    const data = rows[0];

    const htmlPath = path.join(__dirname, 'template/certificate.html');
    const cssPath = path.join(__dirname, 'template/certificate.css');

    let html = fs.readFileSync(htmlPath, 'utf8');
    const css = fs.readFileSync(cssPath, 'utf8');

    html = html
      .replace('{{name}}', data.name)
      .replace('{{course}}', data.course)
      .replace('{{date}}', new Date(data.issued_at).toDateString())
      .replace('</head>', `<style>${css}</style></head>`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    return pdf;
  }
}
