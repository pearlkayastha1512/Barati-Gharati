// import { Injectable } from '@nestjs/common';
// import  PDFDocument from 'pdfkit';
// import * as fs from 'fs';
// import * as path from 'path';
// import { PrismaService } from '../prisma/prisma.service';
// import { NotFoundException } from '@nestjs/common';
// import * as QRCode from 'qrcode';

// @Injectable()
// export class InvoiceService {
// constructor(
//   private readonly prisma: PrismaService,
// ) {}
//   async generateInvoice(booking: any): Promise<string> {

//     // Invoice Number
//     const invoiceNumber =
//       `INV-${booking.id.substring(0, 8).toUpperCase()}`;

//     // Create invoices folder if not exists
//     const invoiceDir = path.join(
//       process.cwd(),
//       'uploads',
//       'invoices',
//     );

//     if (!fs.existsSync(invoiceDir)) {
//       fs.mkdirSync(invoiceDir, {
//         recursive: true,
//       });
//     }

//     const filePath = path.join(
//       invoiceDir,
//       `${invoiceNumber}.pdf`,
//     );

//     // Create PDF
//     const doc = new PDFDocument({
//       margin: 50,
//       size: 'A4',
//     });

//     doc.pipe(
//       fs.createWriteStream(filePath),
//     );

//     // ===========================
//     // HEADER
//     // ===========================

//     doc
//       .fontSize(22)
//       .fillColor('#8B0000')
//       .text(
//         'Wedding Planner',
//         {
//           align: 'center',
//         },
//       );

//     doc
//       .fontSize(18)
//       .fillColor('black')
//       .text(
//         'Booking Invoice',
//         {
//           align: 'center',
//         },
//       );

//     doc.moveDown(2);

//     // ===========================
//     // Invoice Details
//     // ===========================

//     doc.fontSize(12);

//     doc.text(`Invoice No : ${invoiceNumber}`);
//     doc.text(`Booking ID : ${booking.id}`);
//     doc.text(
//       `Generated On : ${new Date().toLocaleString()}`,
//     );
//     doc.text(
//   `Payment Date : ${new Date().toLocaleDateString()}`,
// );

//     doc.moveDown();

//     // ===========================
//     // Customer Details
//     // ===========================

//     doc
//       .fontSize(15)
//       .fillColor('#8B0000')
//       .text('Customer Details');

//     doc
//       .moveDown(0.5)
//       .fillColor('black');

//     doc.text(`Name : ${booking.user.name}`);
//     doc.text(`Email : ${booking.user.email}`);
//     doc.text(
//   `Phone : ${booking.user.phone ?? '-'}`,
// );

//     doc.moveDown();

//     // ===========================
//     // Vendor Details
//     // ===========================

//     doc
//       .fontSize(15)
//       .fillColor('#8B0000')
//       .text('Vendor Details');

//     doc
//       .moveDown(0.5)
//       .fillColor('black');

//     doc.text(
//       `Business : ${booking.vendor.businessName}`,
//     );

//     doc.text(
//       `Address : ${booking.vendor.address ?? '-'}`,
//     );
//     doc.text(
//   `Vendor Email : ${booking.vendor.user.email}`,
// );

//     doc.moveDown();

//     // ===========================
//     // Package Details
//     // ===========================

//     doc
//       .fontSize(15)
//       .fillColor('#8B0000')
//       .text('Package Details');

//     doc
//       .moveDown(0.5)
//       .fillColor('black');

//     doc.text(
//       `Category : ${
//         booking.package.category?.name ?? '-'
//       }`,
//     );

//     doc.text(
//       `Package : ${booking.package.title}`,
//     );

//     doc.text(
//       `Wedding Date : ${new Date(
//         booking.eventDate,
//       ).toDateString()}`,
//     );

//     doc.moveDown();

//     // ===========================
//     // Payment Details
//     // ===========================
//     const paymentType =
//   booking.paymentStatus === 'SUCCESS'
//     ? 'Full Payment'
//     : booking.paymentStatus === 'PARTIAL'
//     ? 'Partial Payment'
//     : booking.paymentStatus === 'PENDING'
//     ? 'Pending Payment'
//     : booking.paymentStatus;
//     doc
//       .fontSize(15)
//       .fillColor('#8B0000')
//       .text('Payment Details');

//     doc
//       .moveDown(0.5)
//       .fillColor('black');

//     doc.text(
//   `Total Amount : ₹${booking.totalAmount}`,
// );

// doc.text(
//   `Amount Paid : ₹${booking.amountPaid}`,
// );

// doc.text(
//   `Remaining Amount : ₹${booking.remainingAmount}`,
// );

// doc.text(
//   `Payment Type : ${paymentType}`,
// );

// doc.text(
//   `Payment Status : ${booking.paymentStatus}`,
// );

// doc.text(
//   `Booking Status : ${booking.status}`,
// );

//     doc.moveDown(2);

//     // ===========================
//     // Footer
//     // ===========================

//     doc
//       .fontSize(13)
//       .fillColor('#8B0000')
//       .text(
//         'Thank you for choosing Wedding Planner!',
//         {
//           align: 'center',
//         },
//       );

//     doc
//       .moveDown()
//       .fontSize(11)
//       .fillColor('black')
//       .text(
//         'We wish you a wonderful wedding celebration.',
//         {
//           align: 'center',
//         },
//       );

//     doc.end();

//     return filePath;
//   }
//   async regenerateInvoice(
//   bookingId: string,
// ) {
//   const booking =
//     await this.prisma.booking.findUnique({
//       where: {
//         id: bookingId,
//       },
//       include: {
//         user: true,
//         vendor: {
//           include: {
//             user: true,
//           },
//         },
//         package: {
//           include: {
//             category: true,
//           },
//         },
//       },
//     });

//   if (!booking) {
//     throw new NotFoundException(
//       'Booking not found',
//     );
//   }

//   const invoicePath =
//     await this.generateInvoice(
//       booking,
//     );

//   const invoiceNumber =
//   `INV-${booking.id
//     .substring(0, 8)
//     .toUpperCase()}`;

// return {
//   success: true,
//   message:
//     'Invoice regenerated successfully.',
//   url: `${process.env.BACKEND_URL}/uploads/invoices/${invoiceNumber}.pdf`,
// };
// }
// }



import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';

import * as fs from 'fs';
import * as path from 'path';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async generateInvoice(
    booking: any,
  ): Promise<string> {
    const invoiceNumber = `INV-${booking.id
      .substring(0, 8)
      .toUpperCase()}`;

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

    const logoPath = path.join(
      process.cwd(),
      'uploads',
      'branding',
      'logo.png',
    );

    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
    });

    doc.pipe(
      fs.createWriteStream(filePath),
    );

    const company = {
      name: 'Barati Gharati',
      email: 'support@baratigharati.com',
      phone: '+91 9876543210',
      website:
        'www.baratigharati.com',
      address:
        'Noida, Uttar Pradesh, India',
    };

    // ==========================
    // HEADER
    // ==========================

    doc
      .rect(0, 0, 595, 120)
      .fill('#F43F5E');

    if (
      fs.existsSync(logoPath)
    ) {
      doc.image(
        logoPath,
        40,
        25,
        {
          fit: [60, 60],
        },
      );
    }

    doc
      .fillColor('white')
      .fontSize(28)
      .font('Helvetica-Bold')
      .text(
        'BARATI GHARATI',
        120,
        30,
      );

    doc
      .fontSize(13)
      .font('Helvetica')
      .text(
        'Wedding Booking Invoice',
        120,
        65,
      );

    doc
      .fontSize(11)
      .text(
        `Invoice: ${invoiceNumber}`,
        380,
        35,
        {
          align: 'right',
        },
      );

    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      380,
      55,
      {
        align: 'right',
      },
    );

    doc.text(
      `Payment Date: ${new Date().toLocaleDateString()}`,
      380,
      75,
      {
        align: 'right',
      },
    );

    let y = 150;

    // ==========================
    // HELPERS
    // ==========================

    const section = (
      title: string,
    ) => {
      doc
        .fillColor('#F43F5E')
        .fontSize(15)
        .font(
          'Helvetica-Bold',
        )
        .text(title, 40, y);

      y += 25;
    };

    const field = (
      label: string,
      value: any,
    ) => {
      doc
        .fillColor('#111827')
        .fontSize(11)
        .font(
          'Helvetica-Bold',
        )
        .text(
          `${label}: `,
          50,
          y,
          {
            continued: true,
          },
        );

      doc
        .font('Helvetica')
        .text(
          value ?? '-',
        );

      y += 18;
    };

    // ==========================
    // CUSTOMER
    // ==========================

    section(
      'Customer Details',
    );

    field(
      'Name',
      booking.user.name,
    );

    field(
      'Email',
      booking.user.email,
    );

    field(
      'Phone',
      booking.user.phone,
    );

    y += 15;

    // ==========================
    // VENDOR
    // ==========================

    section(
      'Vendor Details',
    );

    field(
      'Business',
      booking.vendor
        .businessName,
    );

    field(
      'Address',
      booking.vendor
        .address,
    );

    field(
      'Email',
      booking.vendor.user
        .email,
    );

    field(
      'City',
      booking.city,
    );

    y += 15;

    // ==========================
    // EVENT
    // ==========================

    section(
      'Wedding Details',
    );

    field(
      'Category',
      booking.package
        ?.category?.name,
    );

    field(
      'Package',
      booking.package
        ?.title,
    );

    field(
      'Event Date',
      new Date(
        booking.eventDate,
      ).toDateString(),
    );

    field(
      'Guests',
      booking.guests,
    );

    field(
      'Venue',
      booking.venue,
    );

    y += 15;

    // ==========================
    // PAYMENT
    // ==========================

    section(
      'Payment Summary',
    );

    const paymentType =
      booking.paymentStatus ===
      'SUCCESS'
        ? 'Full Payment'
        : booking.paymentStatus ===
            'PARTIAL'
          ? 'Partial Payment'
          : 'Pending Payment';

    field(
      'Total Amount',
      `₹${booking.totalAmount}`,
    );

    field(
      'Amount Paid',
      `₹${booking.amountPaid}`,
    );

    field(
      'Remaining',
      `₹${booking.remainingAmount}`,
    );

    field(
      'Payment Type',
      paymentType,
    );

    field(
      'Payment Status',
      booking.paymentStatus,
    );

    field(
      'Booking Status',
      booking.status,
    );

    // ==========================
    // QR CODE
    // ==========================

    const qrData = `
Invoice Number: ${invoiceNumber}
Booking ID: ${booking.id}
Customer: ${booking.user.name}
Vendor: ${booking.vendor.businessName}
Amount: ₹${booking.totalAmount}
`;

    const qrImage =
      await QRCode.toDataURL(
        qrData,
      );

    doc.image(
      qrImage,
      420,
      580,
      {
        fit: [110, 110],
      },
    );

    doc
      .fontSize(10)
      .fillColor(
        '#6B7280',
      )
      .text(
        'Scan for verification',
        410,
        695,
      );

    // ==========================
    // SIGNATURE
    // ==========================

    doc
      .moveTo(50, 720)
      .lineTo(220, 720)
      .strokeColor(
        '#9CA3AF',
      )
      .stroke();

    doc
      .fontSize(10)
      .fillColor(
        '#6B7280',
      )
      .text(
        'Authorized Signature',
        75,
        728,
      );

    // ==========================
    // FOOTER
    // ==========================

    doc
      .rect(0, 770, 595, 72)
      .fill('#111827');

    doc
      .fillColor('white')
      .fontSize(12)
      .font(
        'Helvetica-Bold',
      )
      .text(
        company.name,
        40,
        785,
      );

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(
        company.email,
        40,
        805,
      );

    doc.text(
      company.phone,
      220,
      805,
    );

    doc.text(
      company.website,
      380,
      805,
    );

    doc.text(
      company.address,
      40,
      822,
    );

    doc.end();

    return filePath;
  }

  async regenerateInvoice(
    bookingId: string,
  ) {
    const booking =
      await this.prisma.booking.findUnique(
        {
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
        },
      );

    if (!booking) {
      throw new NotFoundException(
        'Booking not found',
      );
    }

    await this.generateInvoice(
      booking,
    );

    const invoiceNumber = `INV-${booking.id
      .substring(0, 8)
      .toUpperCase()}`;

    return {
      success: true,
      message:
        'Invoice regenerated successfully',
      url: `${process.env.BACKEND_URL}/uploads/invoices/${invoiceNumber}.pdf`,
    };
  }
}