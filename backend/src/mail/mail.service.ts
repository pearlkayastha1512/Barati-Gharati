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
    // const verificationUrl =
    //   `http://localhost:3000/api/v1/auth/verify-email?token=${token}`;
    const verificationUrl =
  `${process.env.FRONTEND_URL}/api/v1/auth/verify-email?token=${token}`;
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

  async sendVerificationOtp(
    to: string,
    name: string,
    otp: string,
  ) {
    const subject = 'Your Barati Gharati verification code';
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#31202a">
        <h2>Hello ${name},</h2>
        <p>Use this one-time password to verify your email address:</p>
        <div style="margin:24px 0;padding:18px;text-align:center;font-size:32px;font-weight:700;letter-spacing:10px;background:#fff1f2;border:1px solid #fecdd3;border-radius:12px;color:#be123c">${otp}</div>
        <p>This code expires in 10 minutes. Do not share it with anyone.</p>
        <p>After email verification, your account will be reviewed by the Barati Gharati admin team.</p>
      </div>
    `;

    await this.mailerService.sendMail({ to, subject, html });
    await this.logEmail(to, subject, html);
  }

  async sendCustomerVerificationDecision(
    to: string,
    name: string,
    approved: boolean,
    reason?: string,
  ) {
    const subject = approved
      ? 'Your Barati Gharati account is approved'
      : 'Update on your Barati Gharati verification';
    const html = approved
      ? `<h2>Hello ${name},</h2><p>Your email and account details have been verified. Your customer account is approved and you can now log in.</p>`
      : `<h2>Hello ${name},</h2><p>Your account verification could not be approved.</p><p><strong>Reason:</strong> ${reason || 'Please contact support for more information.'}</p>`;
    await this.mailerService.sendMail({ to, subject, html });
    await this.logEmail(to, subject, html);
  }

  async sendReverificationNotice(to: string, name: string, accountType: string) {
    const subject = `${accountType} account re-verification required`;
    const html = `<h2>Hello ${name},</h2><p>Your ${accountType.toLowerCase()} account has been moved back to admin review. Login will be restored after the admin approves it again.</p>`;
    await this.mailerService.sendMail({ to, subject, html });
    await this.logEmail(to, subject, html);
  }
  async sendPasswordResetEmail(
    to: string,
    name: string,
    token: string,
  ) {
    const resetUrl =
      `http://localhost:3000/api/v1/auth/reset-password?token=${token}`;
  //   const resetUrl =
  // `${process.env.FRONTEND_URL}/api/v1/auth/reset-password?token=${token}`;
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

  async sendAdminCreatedVendorCredentials(
    to: string,
    name: string,
    temporaryPassword: string,
  ) {
    const subject = 'Your Barati Gharati vendor account is ready';
    const loginUrl = `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#31202a">
        <h2>Hello ${name},</h2>
        <p>The Barati Gharati team has created and approved your vendor account.</p>
        <p><strong>Email:</strong> ${to}</p>
        <p><strong>Temporary password:</strong> ${temporaryPassword}</p>
        <p>Please log in at <a href="${loginUrl}">${loginUrl}</a> and change this temporary password from account settings.</p>
      </div>
    `;
    await this.mailerService.sendMail({ to, subject, html });
    await this.logEmail(to, subject, '<p>Vendor credentials email sent.</p>');
  }

async sendVendorRejectedEmail(
  to: string,
  name: string,
  badgePaymentRefunded = false,
) {
  const subject = 'Wedding Planner - Vendor Application';
  const html = `
      <h2>Hello ${name},</h2>

      <p>We're sorry.</p>

      <p>Your vendor registration has been rejected by the admin.</p>

      ${badgePaymentRefunded
        ? '<p>Your paid badge payment refund has been initiated to the original payment method.</p>'
        : ''}

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
