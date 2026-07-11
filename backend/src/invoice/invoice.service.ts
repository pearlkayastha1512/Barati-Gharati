import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

import { PrismaService } from '../prisma/prisma.service';

// ==========================================================
// Brand palette (matches the Barati Gharati logo)
// ==========================================================
const COLORS = {
  pink: '#E01267',
  pinkDark: '#B00C52',
  gold: '#F5A623',
  goldDark: '#D98A0D',
  blue: '#1B3FA0',
  ink: '#242424',
  gray: '#6B6B6B',
  lightGray: '#EDEDED',
  panel: '#FBF7F2',
  white: '#FFFFFF',
  success: '#1E8E5A',
  warning: '#D98A0D',
  danger: '#C0392B',
};

const PAGE = { width: 595.28, height: 841.89 }; // A4 in points
const MARGIN = 42;

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async generateInvoice(booking: any): Promise<string> {
    const invoiceNumber = `INV-${booking.id.substring(0, 8).toUpperCase()}`;

    const invoiceDir = path.join(process.cwd(), 'uploads', 'invoices');
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, { recursive: true });
    }
    const filePath = path.join(invoiceDir, `${invoiceNumber}.pdf`);

    // Place the logo file at src/assets/logo.png (or update this path).
    const logoPath = path.join(process.cwd(), 'src', 'assets', 'logo.png');
    const hasLogo = fs.existsSync(logoPath);

    const doc = new PDFDocument({
      margin: MARGIN,
      size: 'A4',
      bufferPages: true,
      info: {
        Title: `Invoice ${invoiceNumber}`,
        Author: 'Barati Gharati',
        Subject: 'Booking Invoice',
      },
    });

    const stream = fs.createWriteStream(filePath);
    const finished = new Promise<void>((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    doc.pipe(stream);

    // ==========================================================
    // Helpers
    // ==========================================================
    const contentWidth = PAGE.width - MARGIN * 2;

    const money = (n: number | string) =>
      `Rs. ${Number(n ?? 0).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    const drawSectionLabel = (text: string, y: number) => {
      doc
        .rect(MARGIN, y, 4, 14)
        .fill(COLORS.pink);
      doc
        .fontSize(11)
        .fillColor(COLORS.pinkDark)
        .font('Helvetica-Bold')
        .text(text.toUpperCase(), MARGIN + 12, y - 1, { characterSpacing: 0.6 });
      return y + 22;
    };

    const drawRow = (label: string, value: string, x: number, y: number, w: number) => {
      doc
        .fontSize(9.5)
        .fillColor(COLORS.gray)
        .font('Helvetica')
        .text(label, x, y, { width: w });
      doc
        .fontSize(10.5)
        .fillColor(COLORS.ink)
        .font('Helvetica-Bold')
        .text(value || '-', x, y + 13, { width: w });
      return y + 34;
    };

    const statusColor = (status: string) => {
      const s = (status || '').toUpperCase();
      if (['SUCCESS', 'CONFIRMED', 'PAID', 'COMPLETED'].includes(s)) return COLORS.success;
      if (['PARTIAL', 'PENDING'].includes(s)) return COLORS.warning;
      if (['FAILED', 'CANCELLED', 'CANCELED'].includes(s)) return COLORS.danger;
      return COLORS.gray;
    };

    const drawBadge = (text: string, x: number, y: number) => {
      const color = statusColor(text);
      doc.font('Helvetica-Bold').fontSize(9);
      const w = doc.widthOfString(text.toUpperCase()) + 18;
      doc.roundedRect(x, y, w, 18, 9).fillOpacity(0.12).fill(color).fillOpacity(1);
      doc
        .fontSize(9)
        .fillColor(color)
        .font('Helvetica-Bold')
        .text(text.toUpperCase(), x, y + 5, { width: w, align: 'center' });
      return w;
    };

    const addFooterAndBorder = () => {
      // faint page border
      doc
        .lineWidth(0.5)
        .strokeColor(COLORS.lightGray)
        .rect(18, 18, PAGE.width - 36, PAGE.height - 36)
        .stroke();
    };

    // ==========================================================
    // HEADER BAND
    // ==========================================================
    const headerHeight = 108;
    doc.rect(0, 0, PAGE.width, headerHeight).fill(COLORS.ink);
    doc.rect(0, headerHeight, PAGE.width, 4).fill(COLORS.gold);
    doc.rect(0, headerHeight + 4, PAGE.width, 2).fill(COLORS.pink);

    if (hasLogo) {
      try {
        doc.image(logoPath, MARGIN, 22, { height: 62 });
      } catch {
        // ignore broken image, fall back to text mark
      }
    } else {
      doc
        .fontSize(24)
        .fillColor(COLORS.white)
        .font('Helvetica-Bold')
        .text('Barati Gharati', MARGIN, 38);
    }

    doc
      .fontSize(9)
      .fillColor('#D9D9D9')
      .font('Helvetica')
      .text('End-to-end wedding planning, vendors & bookings', MARGIN, headerHeight - 26);

    doc
      .fontSize(20)
      .fillColor(COLORS.white)
      .font('Helvetica-Bold')
      .text('BOOKING INVOICE', MARGIN, 24, { width: contentWidth, align: 'right' });

    doc
      .fontSize(10)
      .fillColor(COLORS.gold)
      .font('Helvetica-Bold')
      .text(invoiceNumber, MARGIN, 50, { width: contentWidth, align: 'right' });

    doc
      .fontSize(9)
      .fillColor('#D9D9D9')
      .font('Helvetica')
      .text(`Issued: ${new Date().toLocaleString('en-IN')}`, MARGIN, 66, {
        width: contentWidth,
        align: 'right',
      });

    // ==========================================================
    // META STRIP: Booking ID / Wedding Date / Booking status
    // ==========================================================
    let y = headerHeight + 24;

    doc.roundedRect(MARGIN, y, contentWidth, 46, 4).fill(COLORS.panel);
    const stripColW = contentWidth / 3;

    doc.fontSize(8.5).fillColor(COLORS.gray).font('Helvetica').text('BOOKING ID', MARGIN + 14, y + 10);
    doc
      .fontSize(10.5)
      .fillColor(COLORS.ink)
      .font('Helvetica-Bold')
      .text(String(booking.id).substring(0, 18) + '…', MARGIN + 14, y + 23, { width: stripColW - 20 });

    doc
      .fontSize(8.5)
      .fillColor(COLORS.gray)
      .font('Helvetica')
      .text('WEDDING DATE', MARGIN + stripColW + 14, y + 10);
    doc
      .fontSize(10.5)
      .fillColor(COLORS.ink)
      .font('Helvetica-Bold')
      .text(new Date(booking.eventDate).toDateString(), MARGIN + stripColW + 14, y + 23, {
        width: stripColW - 20,
      });

    doc
      .fontSize(8.5)
      .fillColor(COLORS.gray)
      .font('Helvetica')
      .text('BOOKING STATUS', MARGIN + stripColW * 2 + 14, y + 10);
    drawBadge(booking.status ?? '-', MARGIN + stripColW * 2 + 14, y + 21);

    y += 46 + 26;

    // ==========================================================
    // CUSTOMER / VENDOR — two side-by-side panels
    // ==========================================================
    const panelGap = 16;
    const panelWidth = (contentWidth - panelGap) / 2;
    const panelTop = y;

    y = drawSectionLabel('Billed To', y);
    const custBlockTop = y;
    doc.fontSize(11).fillColor(COLORS.ink).font('Helvetica-Bold').text(booking.user.name, MARGIN, y, {
      width: panelWidth,
    });
    y += 18;
    doc
      .fontSize(9.5)
      .fillColor(COLORS.gray)
      .font('Helvetica')
      .text(booking.user.email, MARGIN, y, { width: panelWidth });
    y += 14;
    doc.text(`Phone: ${booking.user.phone ?? '-'}`, MARGIN, y, { width: panelWidth });

    // Vendor panel (right column, same starting y as "Billed To" label)
    // drawSectionLabel is fixed to MARGIN, so the vendor label is drawn manually here instead
    doc
      .rect(MARGIN + panelWidth + panelGap, panelTop, 4, 14)
      .fill(COLORS.pink);
    doc
      .fontSize(11)
      .fillColor(COLORS.pinkDark)
      .font('Helvetica-Bold')
      .text('VENDOR', MARGIN + panelWidth + panelGap + 12, panelTop - 1, { characterSpacing: 0.6 });

    let yv2 = panelTop + 22;
    doc
      .fontSize(11)
      .fillColor(COLORS.ink)
      .font('Helvetica-Bold')
      .text(booking.vendor.businessName, MARGIN + panelWidth + panelGap, yv2, { width: panelWidth });
    yv2 += 18;
    doc
      .fontSize(9.5)
      .fillColor(COLORS.gray)
      .font('Helvetica')
      .text(booking.vendor.user.email, MARGIN + panelWidth + panelGap, yv2, { width: panelWidth });
    yv2 += 14;
    doc.text(`Address: ${booking.vendor.address ?? '-'}`, MARGIN + panelWidth + panelGap, yv2, {
      width: panelWidth,
    });

    y = Math.max(y, yv2) + 30;

    // ==========================================================
    // PACKAGE DETAILS TABLE
    // ==========================================================
    y = drawSectionLabel('Package Details', y);

    const tableTop = y;
    const col1 = MARGIN;
    const col1w = contentWidth * 0.4;
    const col2 = col1 + col1w;
    const col2w = contentWidth * 0.6;

    doc.roundedRect(MARGIN, tableTop, contentWidth, 30, 4).fill(COLORS.ink);
    doc
      .fontSize(9.5)
      .fillColor(COLORS.white)
      .font('Helvetica-Bold')
      .text('CATEGORY', col1 + 10, tableTop + 10)
      .text('PACKAGE', col2 + 10, tableTop + 10);

    const rowY = tableTop + 30;
    doc.rect(MARGIN, rowY, contentWidth, 32).fill(COLORS.panel);
    doc
      .fontSize(10)
      .fillColor(COLORS.ink)
      .font('Helvetica')
      .text(booking.package.category?.name ?? '-', col1 + 10, rowY + 10, { width: col1w - 20 })
      .font('Helvetica-Bold')
      .text(booking.package.title, col2 + 10, rowY + 10, { width: col2w - 20 });

    y = rowY + 32 + 30;

    // ==========================================================
    // PAYMENT SUMMARY
    // ==========================================================
    y = drawSectionLabel('Payment Summary', y);

    const paymentType =
      booking.paymentStatus === 'SUCCESS'
        ? 'Full Payment'
        : booking.paymentStatus === 'PARTIAL'
        ? 'Partial Payment'
        : booking.paymentStatus === 'PENDING'
        ? 'Pending Payment'
        : booking.paymentStatus;

    const lineItems: [string, string][] = [
      ['Total Package Amount', money(booking.totalAmount)],
      ['Amount Paid', money(booking.amountPaid)],
      ['Remaining Balance', money(booking.remainingAmount)],
      ['Payment Type', paymentType],
    ];

    let ly = y;
    lineItems.forEach(([label, value], i) => {
      if (i % 2 === 0) {
        doc.rect(MARGIN, ly, contentWidth, 26).fill(COLORS.panel);
      }
      doc
        .fontSize(10)
        .fillColor(COLORS.gray)
        .font('Helvetica')
        .text(label, MARGIN + 12, ly + 8, { width: contentWidth * 0.6 });
      doc
        .fontSize(10)
        .fillColor(COLORS.ink)
        .font('Helvetica-Bold')
        .text(value, MARGIN, ly + 8, { width: contentWidth - 12, align: 'right' });
      ly += 26;
    });

    ly += 4;
    // Payment status badge row
    doc.fontSize(10).fillColor(COLORS.gray).font('Helvetica').text('Payment Status', MARGIN + 12, ly + 6);
    drawBadge(booking.paymentStatus ?? '-', MARGIN + contentWidth - 90, ly);
    ly += 34;

    // Highlighted total due box
    doc.roundedRect(MARGIN, ly, contentWidth, 42, 6).fill(COLORS.pink);
    doc
      .fontSize(11)
      .fillColor(COLORS.white)
      .font('Helvetica-Bold')
      .text('BALANCE DUE', MARGIN + 16, ly + 14);
    doc
      .fontSize(15)
      .fillColor(COLORS.white)
      .font('Helvetica-Bold')
      .text(money(booking.remainingAmount), MARGIN, ly + 12, {
        width: contentWidth - 16,
        align: 'right',
      });

    y = ly + 42 + 30;

    // ==========================================================
    // TERMS & NOTES
    // ==========================================================
    y = drawSectionLabel('Terms & Notes', y);
    doc
      .fontSize(9)
      .fillColor(COLORS.gray)
      .font('Helvetica')
      .text(
        '1. This invoice confirms the booking and payment recorded on the Barati Gharati platform.\n' +
          '2. The remaining balance, if any, is payable directly to the vendor as per the agreed schedule.\n' +
          '3. Cancellations and refunds are subject to the vendor\u2019s policy shared at the time of booking.\n' +
          '4. For any billing queries, please contact support with the Invoice No. shown above.',
        MARGIN,
        y,
        { width: contentWidth, lineGap: 3 },
      );

    // ==========================================================
    // FOOTER
    // ==========================================================
    const footerY = PAGE.height - 96;
    doc.moveTo(MARGIN, footerY).lineTo(PAGE.width - MARGIN, footerY).lineWidth(0.75).strokeColor(COLORS.lightGray).stroke();

    doc
      .fontSize(13)
      .fillColor(COLORS.pinkDark)
      .font('Helvetica-Bold')
      .text('Thank you for choosing Barati Gharati!', MARGIN, footerY + 14, {
        width: contentWidth,
        align: 'center',
      });
    doc
      .fontSize(9.5)
      .fillColor(COLORS.gray)
      .font('Helvetica')
      .text('We wish you a wonderful wedding celebration.', MARGIN, footerY + 32, {
        width: contentWidth,
        align: 'center',
      });
    doc
      .fontSize(8)
      .fillColor(COLORS.gray)
      .text(
        'Barati Gharati  \u2022  This is a system-generated invoice and does not require a signature.',
        MARGIN,
        footerY + 52,
        { width: contentWidth, align: 'center' },
      );

    addFooterAndBorder();

    // page numbers (in case content overflows to more pages)
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .fillColor(COLORS.gray)
        .text(`Page ${i + 1} of ${range.count}`, MARGIN, PAGE.height - 30, {
          width: contentWidth,
          align: 'center',
        });
    }

    doc.end();
    await finished;

    return filePath;
  }

  async regenerateInvoice(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        vendor: { include: { user: true } },
        package: { include: { category: true } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const invoicePath = await this.generateInvoice(booking);

    return {
      success: true,
      message: 'Invoice regenerated successfully.',
      path: invoicePath,
    };
  }
}
