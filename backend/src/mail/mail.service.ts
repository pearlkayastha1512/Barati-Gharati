import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
  ) {}

  private async logEmail(
    to: string,
    subject: string,
    message: string,
    status = 'sent',
  ) {
    try {
      await this.prisma.emailLog.create({
        data: {
          to,
          subject,
          message,
          status,
        },
      });
    } catch {
      return;
    }
  }

  async sendTestEmail(to: string) {
    const subject = 'Wedding Planner - Test Email';
    const html = `
        <h2>Wedding Planner</h2>
        <p>Congratulations! Your email configuration is working.</p>
      `;

    await this.mailerService.sendMail({
      to,
      subject,
      text: 'Congratulations! Your email configuration is working.',
      html,
    });

    await this.logEmail(to, subject, html);

    return {
      success: true,
      message: 'Test email sent successfully.',
    };
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    token: string,
  ) {
    const verificationUrl =
      `http://localhost:3000/api/v1/auth/verify-email?token=${token}`;
    const subject = 'Verify your Wedding Planner account';
    const html = `
        <h2>Hello ${name},</h2>

        <p>Thank you for registering with Wedding Planner.</p>

        <p>Please click the button below to verify your email address.</p>

        <a href="${verificationUrl}"
           style="
             display:inline-block;
             background:#4CAF50;
             color:white;
             padding:12px 20px;
             text-decoration:none;
             border-radius:6px;
           ">
           Verify Email
        </a>

        <p>This verification link will expire in 1 hour.</p>
      `;

    await this.mailerService.sendMail({
      to,
      subject,
      html,
    });

    await this.logEmail(to, subject, html);
  }
  async sendPasswordResetEmail(
    to: string,
    name: string,
    token: string,
  ) {
    const resetUrl =
      `http://localhost:3000/api/v1/auth/reset-password?token=${token}`;
    const subject = 'Reset your Wedding Planner password';
    const html = `
        <h2>Hello ${name},</h2>

        <p>You requested to reset your password.</p>

        <p>Click the button below to reset it.</p>

        <a href="${resetUrl}"
          style="
            display:inline-block;
            background:#f44336;
            color:white;
            padding:12px 20px;
            text-decoration:none;
            border-radius:6px;
          ">
          Reset Password
        </a>

        <p>This link will expire in 1 hour.</p>

        <p>If you didn't request this, you can ignore this email.</p>
      `;

    await this.mailerService.sendMail({
      to,
      subject,
      html,
    });

    await this.logEmail(to, subject, html);
  
   return {
    success: true,
    message: 'Password reset email sent successfully.',
  };
}
async sendBookingInvoice(
  to: string,
  name: string,
  pdfPath: string,
) {
  const subject = 'Wedding Planner - Booking Invoice';
  const html = `
      <h2>Hello ${name},</h2>

      <p>Your booking has been confirmed successfully.</p>

      <p>Please find your booking invoice attached with this email.</p>

      <br>

      <p>Thank you for choosing Wedding Planner ❤️</p>
    `;

  await this.mailerService.sendMail({
    to,
    subject,
    html,

    attachments: [
      {
        filename: 'Booking-Invoice.pdf',
        path: pdfPath,
      },
    ],
  });

  await this.logEmail(to, subject, html);

  return {
    success: true,
    message: 'Invoice email sent successfully.',
  };
}


async sendVendorApprovedEmail(
  to: string,
  name: string,
) {
  const subject = 'Wedding Planner - Vendor Approved';
  const html = `
      <h2>Hello ${name},</h2>

      <p>Congratulations 🎉</p>

      <p>Your vendor account has been approved by the admin.</p>

      <p>You can now log in and start receiving bookings.</p>

      <br>

      <p>Thank you for joining Wedding Planner ❤️</p>
    `;

  await this.mailerService.sendMail({
    to,
    subject,
    html,
  });

  await this.logEmail(to, subject, html);

  return {
    success: true,
    message: 'Vendor approval email sent.',
  };
}

async sendVendorRejectedEmail(
  to: string,
  name: string,
) {
  const subject = 'Wedding Planner - Vendor Application';
  const html = `
      <h2>Hello ${name},</h2>

      <p>We're sorry.</p>

      <p>Your vendor registration has been rejected by the admin.</p>

      <p>You may contact support for more information.</p>

      <br>

      <p>Wedding Planner Team</p>
    `;

  await this.mailerService.sendMail({
    to,
    subject,
    html,
  });

  await this.logEmail(to, subject, html);

  return {
    success: true,
    message: 'Vendor rejection email sent.',
  };
}

}
