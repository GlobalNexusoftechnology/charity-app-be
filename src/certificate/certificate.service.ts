/* The `CertificateService` class in TypeScript generates a PDF certificate by reading HTML and CSS
files, replacing placeholders, and using Puppeteer for rendering. */
// certificate.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';
import * as puppeteer from 'puppeteer';

@Injectable()
export class CertificateService {
  constructor(private readonly pool: Pool) {}

  async generateCertificatePdf(id: string): Promise<Buffer> {
    // ✅ CORRECT ASSET PATHS (PROD SAFE)
    const htmlPath = path.join(
      __dirname,
      '../../assets/certificate/template/certificate.html',
    );

    const cssPath = path.join(
      __dirname,
      '../../assets/certificate/template/certificate.css',
    );

    // ✅ READ FILES AT RUNTIME
    let html = fs.readFileSync(htmlPath, 'utf8');
    const css = fs.readFileSync(cssPath, 'utf8');

    // ✅ TEMPLATE REPLACEMENTS
    html = html
      .replace('{{name}}', 'Faiz Ahmed')
      .replace(
        '{{date}}',
        new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      )
      .replace('</head>', `<style>${css}</style></head>`);

    // ✅ PUPPETEER (VPS SAFE)
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

    return Buffer.from(pdf);
  }
}
