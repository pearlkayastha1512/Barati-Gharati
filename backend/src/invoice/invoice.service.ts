import { Injectable } from '@nestjs/common';
import  PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class InvoiceService {
constructor(
  private readonly prisma: PrismaService,
) {}
  async generateInvoice(booking: any): Promise<string> {

    // Invoice Number
    const invoiceNumber =
      `INV-${booking.id.substring(0, 8).toUpperCase()}`;

    // Create invoices folder if not exists
    const invoiceDir = path.join(
      process.cwd(),
      'uploads',
      'invoices',
    );

    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, {
        recursive: true,
      });
    }

    const filePath = path.join(
      invoiceDir,
      `${invoiceNumber}.pdf`,
    );

    // Create PDF
    const doc = new PDFDocument({
      margin: 50,
      size: 'A4',
    });

    doc.pipe(
      fs.createWriteStream(filePath),
    );

    // ===========================
    // HEADER
    // ===========================

    doc
      .fontSize(22)
      .fillColor('#8B0000')
      .text(
        'Wedding Planner',
        {
          align: 'center',
        },
      );

    doc
      .fontSize(18)
      .fillColor('black')
      .text(
        'Booking Invoice',
        {
          align: 'center',
        },
      );

    doc.moveDown(2);

    // ===========================
    // Invoice Details
    // ===========================

    doc.fontSize(12);

    doc.text(`Invoice No : ${invoiceNumber}`);
    doc.text(`Booking ID : ${booking.id}`);
    doc.text(
      `Generated On : ${new Date().toLocaleString()}`,
    );
    doc.text(
  `Payment Date : ${new Date().toLocaleDateString()}`,
);

    doc.moveDown();

    // ===========================
    // Customer Details
    // ===========================

    doc
      .fontSize(15)
      .fillColor('#8B0000')
      .text('Customer Details');

    doc
      .moveDown(0.5)
      .fillColor('black');

    doc.text(`Name : ${booking.user.name}`);
    doc.text(`Email : ${booking.user.email}`);
    doc.text(
  `Phone : ${booking.user.phone ?? '-'}`,
);

    doc.moveDown();

    // ===========================
    // Vendor Details
    // ===========================

    doc
      .fontSize(15)
      .fillColor('#8B0000')
      .text('Vendor Details');

    doc
      .moveDown(0.5)
      .fillColor('black');

    doc.text(
      `Business : ${booking.vendor.businessName}`,
    );

    doc.text(
      `Address : ${booking.vendor.address ?? '-'}`,
    );
    doc.text(
  `Vendor Email : ${booking.vendor.user.email}`,
);

    doc.moveDown();

    // ===========================
    // Package Details
    // ===========================

    doc
      .fontSize(15)
      .fillColor('#8B0000')
      .text('Package Details');

    doc
      .moveDown(0.5)
      .fillColor('black');

    doc.text(
      `Category : ${
        booking.package.category?.name ?? '-'
      }`,
    );

    doc.text(
      `Package : ${booking.package.title}`,
    );

    doc.text(
      `Wedding Date : ${new Date(
        booking.eventDate,
      ).toDateString()}`,
    );

    doc.moveDown();

    // ===========================
    // Payment Details
    // ===========================
    const paymentType =
  booking.paymentStatus === 'SUCCESS'
    ? 'Full Payment'
    : booking.paymentStatus === 'PARTIAL'
    ? 'Partial Payment'
    : booking.paymentStatus === 'PENDING'
    ? 'Pending Payment'
    : booking.paymentStatus;
    doc
      .fontSize(15)
      .fillColor('#8B0000')
      .text('Payment Details');

    doc
      .moveDown(0.5)
      .fillColor('black');

    doc.text(
  `Total Amount : ₹${booking.totalAmount}`,
);

doc.text(
  `Amount Paid : ₹${booking.amountPaid}`,
);

doc.text(
  `Remaining Amount : ₹${booking.remainingAmount}`,
);

doc.text(
  `Payment Type : ${paymentType}`,
);

doc.text(
  `Payment Status : ${booking.paymentStatus}`,
);

doc.text(
  `Booking Status : ${booking.status}`,
);

    doc.moveDown(2);

    // ===========================
    // Footer
    // ===========================

    doc
      .fontSize(13)
      .fillColor('#8B0000')
      .text(
        'Thank you for choosing Wedding Planner!',
        {
          align: 'center',
        },
      );

    doc
      .moveDown()
      .fontSize(11)
      .fillColor('black')
      .text(
        'We wish you a wonderful wedding celebration.',
        {
          align: 'center',
        },
      );

    doc.end();

    return filePath;
  }
  async regenerateInvoice(
  bookingId: string,
) {
  const booking =
    await this.prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        user: true,
        vendor: {
          include: {
            user: true,
          },
        },
        package: {
          include: {
            category: true,
          },
        },
      },
    });

  if (!booking) {
    throw new NotFoundException(
      'Booking not found',
    );
  }

  const invoicePath =
    await this.generateInvoice(
      booking,
    );

  return {
    success: true,
    message:
      'Invoice regenerated successfully.',
    path: invoicePath,
  };
}
}