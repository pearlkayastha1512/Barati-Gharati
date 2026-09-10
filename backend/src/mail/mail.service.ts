import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

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

    try {
      const info = await this.mailerService.sendMail({ to, subject, html });
      this.logger.log(`Verification OTP email sent to ${to} (${info?.messageId || 'OK'})`);
      await this.logEmail(to, subject, html, 'sent');
    } catch (err: any) {
      this.logger.error(`Failed to send verification OTP email to ${to}: ${err?.message || err}`, err?.stack);
      await this.logEmail(to, subject, html, `failed: ${err?.message || 'SMTP Error'}`);
    }
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
    // const resetUrl =
    //   `http://localhost:3000/api/v1/auth/reset-password?token=${token}`;
    const resetUrl =
  `${process.env.FRONTEND_URL}/api/v1/auth/reset-password?token=${token}`;
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

  async sendPrimaryBookingRequestEmail(
    to: string,
    vendorName: string,
    customerName: string,
    bookingNumber: string,
    eventDate: string,
    city: string,
    packageName: string,
    totalAmount: number,
  ) {
    const subject = `Urgent: New Booking Request #${bookingNumber} - Barati Gharati`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#31202a;border:1px solid #fecdd3;padding:24px;border-radius:16px;background:#fff">
        <h2 style="color:#be123c">Hello ${vendorName},</h2>
        <p>You have received a new primary booking request on <strong>Barati Gharati</strong>!</p>
        
        <div style="background:#fff1f2;padding:16px;border-radius:12px;margin:20px 0;">
          <p style="margin:4px 0;"><strong>Booking ID:</strong> ${bookingNumber}</p>
          <p style="margin:4px 0;"><strong>Customer:</strong> ${customerName}</p>
          <p style="margin:4px 0;"><strong>Event Date:</strong> ${eventDate}</p>
          <p style="margin:4px 0;"><strong>City / Location:</strong> ${city}</p>
          <p style="margin:4px 0;"><strong>Package Selected:</strong> ${packageName}</p>
          <p style="margin:4px 0;"><strong>Amount:</strong> ₹${totalAmount.toLocaleString('en-IN')}</p>
        </div>

        <p>Please log in to your vendor dashboard to <strong>Accept</strong> or <strong>Reject</strong> this booking within 2 hours.</p>
        
        <br>
        <p style="color:#888;font-size:12px">Barati Gharati Wedding Management System</p>
      </div>
    `;
    try {
      const res = await this.mailerService.sendMail({ to, subject, html });
      this.logger.log(`Primary booking request email sent successfully to ${to} (${res?.messageId || 'OK'})`);
      await this.logEmail(to, subject, html, 'sent');
    } catch (err: any) {
      this.logger.error(`Failed to send primary booking request email to ${to}: ${err?.message || err}`, err?.stack);
      await this.logEmail(to, subject, html, `failed: ${err?.message || 'SMTP Error'}`);
    }
  }

  async sendStandbyBookingBroadcastEmail(
    to: string,
    vendorName: string,
    bookingNumber: string,
    categoryName: string,
    eventDate: string,
    city: string,
  ) {
    const subject = `New Standby Booking Opportunity - ${categoryName} on ${eventDate}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#31202a;border:1px solid #e2e8f0;padding:24px;border-radius:16px;background:#fff">
        <h2 style="color:#4f46e5">Hello ${vendorName},</h2>
        <p>A new customer has requested a vendor in your category (<strong>${categoryName}</strong>) on Barati Gharati!</p>
        
        <div style="background:#f8fafc;padding:16px;border-radius:12px;margin:20px 0;border:1px solid #cbd5e1;">
          <p style="margin:4px 0;"><strong>Event Date:</strong> ${eventDate}</p>
          <p style="margin:4px 0;"><strong>City:</strong> ${city}</p>
          <p style="margin:4px 0;"><strong>Category:</strong> ${categoryName}</p>
        </div>

        <p>Please log in to your vendor dashboard and indicate whether you are <strong>Available</strong> or <strong>Not Available</strong> on this date so the customer can view your profile.</p>
        
        <br>
        <p style="color:#888;font-size:12px">Barati Gharati Smart Booking Engine</p>
      </div>
    `;
    try {
      const res = await this.mailerService.sendMail({ to, subject, html });
      this.logger.log(`Standby broadcast email sent successfully to ${to} (${res?.messageId || 'OK'})`);
      await this.logEmail(to, subject, html, 'sent');
    } catch (err: any) {
      this.logger.error(`Failed to send standby broadcast email to ${to}: ${err?.message || err}`, err?.stack);
      await this.logEmail(to, subject, html, `failed: ${err?.message || 'SMTP Error'}`);
    }
  }

}
