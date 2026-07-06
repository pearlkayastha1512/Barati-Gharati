import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTestEmail(to: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Wedding Planner - Test Email',
      text: 'Congratulations! Your email configuration is working.',
      html: `
        <h2>Wedding Planner</h2>
        <p>Congratulations! Your email configuration is working.</p>
      `,
    });

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

    await this.mailerService.sendMail({
      to,
      subject: 'Verify your Wedding Planner account',
      html: `
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
      `,
    });
  }
  async sendPasswordResetEmail(
    to: string,
    name: string,
    token: string,
  ) {
    const resetUrl =
      `http://localhost:3000/api/v1/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to,
      subject: 'Reset your Wedding Planner password',
      html: `
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
      `,
    });
  
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
  await this.mailerService.sendMail({
    to,
    subject: 'Wedding Planner - Booking Invoice',

    html: `
      <h2>Hello ${name},</h2>

      <p>Your booking has been confirmed successfully.</p>

      <p>Please find your booking invoice attached with this email.</p>

      <br>

      <p>Thank you for choosing Wedding Planner ❤️</p>
    `,

    attachments: [
      {
        filename: 'Booking-Invoice.pdf',
        path: pdfPath,
      },
    ],
  });

  return {
    success: true,
    message: 'Invoice email sent successfully.',
  };
}


async sendVendorApprovedEmail(
  to: string,
  name: string,
) {
  await this.mailerService.sendMail({
    to,
    subject: 'Wedding Planner - Vendor Approved',

    html: `
      <h2>Hello ${name},</h2>

      <p>Congratulations 🎉</p>

      <p>Your vendor account has been approved by the admin.</p>

      <p>You can now log in and start receiving bookings.</p>

      <br>

      <p>Thank you for joining Wedding Planner ❤️</p>
    `,
  });

  return {
    success: true,
    message: 'Vendor approval email sent.',
  };
}

async sendVendorRejectedEmail(
  to: string,
  name: string,
) {
  await this.mailerService.sendMail({
    to,
    subject: 'Wedding Planner - Vendor Application',

    html: `
      <h2>Hello ${name},</h2>

      <p>We're sorry.</p>

      <p>Your vendor registration has been rejected by the admin.</p>

      <p>You may contact support for more information.</p>

      <br>

      <p>Wedding Planner Team</p>
    `,
  });

  return {
    success: true,
    message: 'Vendor rejection email sent.',
  };
}

}