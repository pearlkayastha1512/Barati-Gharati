import { Injectable , BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendLoginOtpDto, VerifyLoginOtpDto } from './dto/login-otp.dto';
import Razorpay from 'razorpay';


import { RegisterVendorDto } from './dto/register-vendor.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

import {
  AdminVerificationStatus,
  CustomerMembership,
  Role,
  VendorBadge,
  VendorBadgeBillingCycle,
  VendorStatus,
} from '@prisma/client';
import { AdminAccessService } from '../admin-access/admin-access.service';
import { CUSTOMER_PREMIUM_PRICE } from '../premium-planning/premium-planning.constants';
import { ResendEmailOtpDto, VerifyEmailOtpDto } from './dto/verify-email-otp.dto';
import {
  StartVendorRegistrationVerificationDto,
  VerifyVendorRegistrationOtpDto,
} from './dto/vendor-registration-verification.dto';
import {
  getVendorBadgeExpiry,
  VENDOR_BADGE_LIMITS,
  VENDOR_BADGE_PRICES,
} from '../payment/vendor-badge.constants';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
  private readonly prisma: PrismaService,
  private readonly jwtService: JwtService,
  private readonly notificationsService: NotificationsService,
   private readonly mailService: MailService,
  private readonly cloudinaryService: CloudinaryService,
  private readonly adminAccessService: AdminAccessService,
) {}

  private getRazorpay() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new BadRequestException(
        'Payment gateway is not configured',
      );
    }

    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  private async issueEmailOtp(user: { id: string; email: string; name: string }) {
    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await this.prisma.verificationToken.deleteMany({ where: { userId: user.id } });
    await this.prisma.verificationToken.create({
      data: {
        token: hashedOtp,
        userId: user.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    this.mailService
      .sendVerificationOtp(user.email, user.name, otp)
      .catch((err) => {
        this.logger.error(
          `Failed to send verification OTP email to ${user.email}: ${err?.message || err}`,
        );
      });
  }

  private verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ) {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      throw new BadRequestException(
        'Payment gateway is not configured',
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    const providedSignature = Buffer.from(signature);
    const calculatedSignature = Buffer.from(expectedSignature);

    if (
      providedSignature.length !== calculatedSignature.length ||
      !crypto.timingSafeEqual(
        providedSignature,
        calculatedSignature,
      )
    ) {
      throw new BadRequestException(
        'Invalid badge payment signature',
      );
    }
  }

  private async verifyVendorRegistrationBadgePayment(
    dto: RegisterVendorDto,
  ) {
    if (
      !Object.values(VendorBadge).includes(dto.selectedBadge)
    ) {
      throw new BadRequestException('Invalid badge plan');
    }

    if (dto.selectedBadge === VendorBadge.BRONZE) {
      return;
    }

    if (
      !dto.badgePaymentOrderId ||
      !dto.badgePaymentId ||
      !dto.badgePaymentSignature
    ) {
      throw new BadRequestException(
        'Badge payment details are required for paid plans',
      );
    }

    this.verifyPaymentSignature(
      dto.badgePaymentOrderId,
      dto.badgePaymentId,
      dto.badgePaymentSignature,
    );

    const reusedOrder =
      await this.prisma.vendor.findFirst({
        where: {
          badgePaymentOrderId:
            dto.badgePaymentOrderId,
        },
        select: {
          id: true,
        },
      });

    if (reusedOrder) {
      throw new BadRequestException(
        'This badge payment has already been used',
      );
    }

    const order =
      await this.getRazorpay().orders.fetch(
        dto.badgePaymentOrderId,
      );
    const billingCycle = dto.badgeBillingCycle ?? VendorBadgeBillingCycle.MONTHLY;
    const expectedAmount = VENDOR_BADGE_PRICES[billingCycle][dto.selectedBadge] * 100;

    if (Number(order.amount) !== expectedAmount) {
      throw new BadRequestException(
        'Badge payment amount does not match selected plan',
      );
    }

    if (
      order.notes?.paymentType !==
        'VENDOR_REGISTRATION_BADGE' ||
      order.notes?.badge !== dto.selectedBadge ||
      order.notes?.billingCycle !== billingCycle ||
      order.notes?.registrationVerificationId !== dto.registrationVerificationId
    ) {
      throw new BadRequestException(
        'Badge payment order does not match vendor registration',
      );
    }
  }

  private async verifyCustomerMembershipPayment(dto: RegisterDto) {
    const membership = dto.membership ?? CustomerMembership.FREE;
    if (membership === CustomerMembership.FREE) return;

    if (!dto.membershipPaymentOrderId || !dto.membershipPaymentId || !dto.membershipPaymentSignature) {
      throw new BadRequestException('Premium membership payment details are required');
    }

    this.verifyPaymentSignature(
      dto.membershipPaymentOrderId,
      dto.membershipPaymentId,
      dto.membershipPaymentSignature,
    );

    const reusedOrder = await this.prisma.user.findFirst({
      where: { membershipPaymentOrderId: dto.membershipPaymentOrderId },
      select: { id: true },
    });
    if (reusedOrder) throw new BadRequestException('This membership payment has already been used');

    const order = await this.getRazorpay().orders.fetch(dto.membershipPaymentOrderId);
    if (Number(order.amount) !== CUSTOMER_PREMIUM_PRICE * 100) {
      throw new BadRequestException('Membership payment amount is invalid');
    }
    if (order.notes?.paymentType !== 'CUSTOMER_PREMIUM_REGISTRATION') {
      throw new BadRequestException('Payment order does not match premium registration');
    }
  }

  private async getVerifiedVendorRegistration(
    verificationId: string,
    email: string,
    phone: string,
  ) {
    const verification = await this.prisma.vendorRegistrationVerification.findUnique({
      where: { id: verificationId },
    });
    if (
      !verification ||
      !verification.verifiedAt ||
      verification.usedAt ||
      verification.expiresAt < new Date() ||
      verification.email.toLowerCase() !== email.trim().toLowerCase() ||
      verification.phone !== phone.trim()
    ) {
      throw new BadRequestException(
        'Please verify this email and phone before selecting a badge plan.',
      );
    }
    return verification;
  }

  async startVendorRegistrationVerification(
    dto: StartVendorRegistrationVerificationDto,
  ) {
    const email = dto.email.trim().toLowerCase();
    const phone = dto.phone.trim();
    const [existingEmail, existingPhone] = await Promise.all([
      this.prisma.user.findUnique({ where: { email } }),
      this.prisma.user.findUnique({ where: { phone } }),
    ]);
    if (existingEmail) throw new BadRequestException('Email already registered');
    if (existingPhone) throw new BadRequestException('Phone number already registered');

    await this.prisma.vendorRegistrationVerification.deleteMany({
      where: { usedAt: null, verifiedAt: null, OR: [{ email }, { phone }] },
    });
    const otp = crypto.randomInt(100000, 1000000).toString();
    const verification = await this.prisma.vendorRegistrationVerification.create({
      data: {
        ownerName: dto.ownerName.trim(),
        email,
        phone,
        otpHash: await bcrypt.hash(otp, 10),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    await this.mailService.sendVerificationOtp(email, dto.ownerName, otp);
    return {
      success: true,
      message: 'A 6-digit OTP has been sent to your business email.',
      data: { verificationId: verification.id, email, phone },
    };
  }

  async verifyVendorRegistrationOtp(dto: VerifyVendorRegistrationOtpDto) {
    const verification = await this.prisma.vendorRegistrationVerification.findUnique({
      where: { id: dto.verificationId },
    });
    if (!verification || verification.usedAt || verification.expiresAt < new Date()) {
      throw new BadRequestException(
        'OTP is invalid or has expired. Please request a new code.',
      );
    }
    if (!(await bcrypt.compare(dto.otp, verification.otpHash))) {
      throw new BadRequestException('Invalid OTP.');
    }
    const updated = await this.prisma.vendorRegistrationVerification.update({
      where: { id: verification.id },
      data: {
        verifiedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    return {
      success: true,
      message: 'Email verified. You can now continue and choose a badge plan.',
      data: { verificationId: updated.id, email: updated.email, phone: updated.phone },
    };
  }

  async uploadVendorRegistrationImage(
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const uploaded =
      await this.cloudinaryService.uploadImage(file);

    return {
      success: true,
      message: 'Image uploaded successfully',
      image: uploaded.secure_url,
    };
  }

  async register(registerDto: RegisterDto) {
  // Step 1
  const existingUser = await this.prisma.user.findUnique({
    where: {
      email: registerDto.email,
    },
  });

  if (existingUser) {
    throw new BadRequestException('Email already registered');
  }
   const existingPhone = await this.prisma.user.findUnique({
  where: {
    phone: registerDto.phone,
  },
});

if (existingPhone) {
  throw new BadRequestException('Phone number already registered');
}
  await this.verifyCustomerMembershipPayment(registerDto);

  // Step 2
  const hashedPassword = await bcrypt.hash(registerDto.password, 10);

  // Step 3
  const user = await this.prisma.user.create({
    data: {
      name: registerDto.name,
      email: registerDto.email,
      phone: registerDto.phone,
      password: hashedPassword,
      role: Role.USER,
      adminVerificationStatus: AdminVerificationStatus.APPROVED,
      membership: registerDto.membership ?? CustomerMembership.FREE,
      membershipActivatedAt:
        registerDto.membership === CustomerMembership.PREMIUM ? new Date() : undefined,
      membershipPaymentOrderId: registerDto.membershipPaymentOrderId,
      membershipPaymentId: registerDto.membershipPaymentId,
    },
  });
  this.issueEmailOtp(user).catch((error) => console.error('OTP email failed', error));
  await this.notificationsService.create(
  user.id,
  {
    title: 'Welcome to Wedding Planner',
    message: 'Your account has been created successfully.',
  },
);

  // Step 4
  return {
    success: true,
    message: 'Registration successful. Enter the OTP sent to your email.',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      membership: user.membership,
    },
  };
}

 








 async registerVendor(
  
  registerVendorDto: RegisterVendorDto,
) {

  const completedRegistration = await this.prisma.user.findUnique({
    where: { email: registerVendorDto.email.trim().toLowerCase() },
    include: { vendor: true },
  });
  if (
    completedRegistration?.role === Role.VENDOR &&
    completedRegistration.vendor &&
    (registerVendorDto.selectedBadge === VendorBadge.BRONZE ||
      completedRegistration.vendor.badgePaymentOrderId ===
        registerVendorDto.badgePaymentOrderId)
  ) {
    return {
      success: true,
      message: 'Vendor registration was already completed and is awaiting admin approval.',
      user: {
        _id: completedRegistration.id,
        name: completedRegistration.name,
        email: completedRegistration.email,
        phone: completedRegistration.phone ?? '',
        role: 'vendor',
        status: completedRegistration.vendor.status.toLowerCase(),
        isVerified: completedRegistration.isVerified,
      },
    };
  }

  await this.getVerifiedVendorRegistration(
    registerVendorDto.registrationVerificationId,
    registerVendorDto.email,
    registerVendorDto.phone,
  );

  // Check email
  const existingUser =
    await this.prisma.user.findUnique({
      where: {
        email: registerVendorDto.email.trim().toLowerCase(),
      },
    });

  if (existingUser) {
    throw new BadRequestException(
      'Email already registered',
    );
  }

  // Check phone
  const existingPhone =
    await this.prisma.user.findUnique({
      where: {
        phone: registerVendorDto.phone.trim(),
      },
    });

  if (existingPhone) {
    throw new BadRequestException(
      'Phone number already registered',
    );
  }

  await this.verifyVendorRegistrationBadgePayment(
    registerVendorDto,
  );

  // Hash password
  const hashedPassword =
    await bcrypt.hash(
      registerVendorDto.password,
      10,
    );

  let categoryId: string | undefined;

  if (registerVendorDto.category) {
    const category =
      await this.prisma.category.findFirst({
        where: {
          name: {
            equals: registerVendorDto.category,
            mode: 'insensitive',
          },
        },
      });

    if (category) {
      categoryId = category.id;
    } else {
      const createdCategory =
        await this.prisma.category.create({
          data: {
            name: registerVendorDto.category,
          },
        });

      categoryId = createdCategory.id;
    }
  }

  // Create User + Vendor together
  // Generate next frontend vendor ID
const lastVendor =
  await this.prisma.vendor.findFirst({
    where: {
      frontendVendorId: {
        not: null,
      },
    },
    orderBy: {
      frontendVendorId: 'desc',
    },
  });

const frontendVendorId =
  (lastVendor?.frontendVendorId ?? 0) + 1;

// Create User + Vendor together
const user =
  await this.prisma.user.create({
    data: {
      name: registerVendorDto.ownerName,
      email: registerVendorDto.email.trim().toLowerCase(),
      phone: registerVendorDto.phone.trim(),
      password: hashedPassword,

      role: Role.VENDOR,
      isVerified: true,

      vendor: {
        create: {
          frontendVendorId,

          businessName:
            registerVendorDto.businessName,

          description:
            registerVendorDto.description,

          address: registerVendorDto.address,

          city: registerVendorDto.city,

          logoUrl: registerVendorDto.profileImage,

          coverImage: registerVendorDto.coverImage,

          website: registerVendorDto.website,

          instagram: registerVendorDto.instagram,

          facebook: registerVendorDto.facebook,

          youtube: registerVendorDto.youtube,

          linkedin: registerVendorDto.linkedin,

          experience: registerVendorDto.experience,

          gstNumber: registerVendorDto.gstNumber,

          categoryId,

          status: VendorStatus.PENDING,
          badge: registerVendorDto.selectedBadge,
          badgeBillingCycle:
            registerVendorDto.badgeBillingCycle ?? VendorBadgeBillingCycle.MONTHLY,
          monthlyBookingLimit:
            VENDOR_BADGE_LIMITS[
              registerVendorDto.selectedBadge
            ],
          badgePurchasedAt:
            registerVendorDto.selectedBadge ===
            VendorBadge.BRONZE
              ? null
              : new Date(),
          badgeExpiresAt:
            registerVendorDto.selectedBadge === VendorBadge.BRONZE
              ? null
              : getVendorBadgeExpiry(
                  registerVendorDto.badgeBillingCycle ?? VendorBadgeBillingCycle.MONTHLY,
                ),
          badgePaymentOrderId:
            registerVendorDto.badgePaymentOrderId,
          badgePaymentId:
            registerVendorDto.badgePaymentId,
        },
      },
    },

    include: {
      vendor: true,
    },
  });






















  await this.prisma.vendorRegistrationVerification.update({
    where: { id: registerVendorDto.registrationVerificationId },
    data: { usedAt: new Date() },
  });

  // Notification
  await this.notificationsService.create(
    user.id,
    {
      title:
        'Vendor Registration Successful',

      message:
        'Your vendor account has been created and is awaiting approval.',
    },
  );

  return {
    success: true,

    message:
      'Vendor registration successful. Your application is awaiting admin approval.',

    user: {
      _id: user.id,

      name: user.name,

      email: user.email,

      phone: user.phone ?? '',

      avatar: '',

      role: 'vendor',

      status: 'pending',

      isVerified:
        user.isVerified,

      createdAt:
        user.createdAt,

      updatedAt:
        user.updatedAt,
    },
  };
}





















async login(loginDto: LoginDto) {
  const user = await this.prisma.user.findUnique({
    where: {
      email: loginDto.email,
    },
    include: {
      vendor: true,
    },
  });

  if (!user) {
    throw new UnauthorizedException(
      'Invalid email or password',
    );
  }

  if (user.isSuspended) {
    throw new UnauthorizedException(
      'Your account has been suspended.',
    );
  }

  if (user.role === Role.ADMIN && !user.adminIsActive) {
    throw new UnauthorizedException('Your admin account is inactive.');
  }


  const isPasswordCorrect = await bcrypt.compare(
    loginDto.password,
    user.password,
  );



console.log('PASSWORD MATCH =', isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new UnauthorizedException(
      'Invalid email or password',
    );
  }

  if (user.role !== Role.ADMIN && !user.isVerified) {
    throw new UnauthorizedException('Please verify your email using the OTP before logging in.');
  }



  if (user.role === Role.VENDOR && user.vendor?.status === VendorStatus.PENDING) {
    throw new UnauthorizedException('Your vendor account is awaiting admin approval.');
  }

  if (user.role === Role.VENDOR && user.vendor?.status === VendorStatus.REJECTED) {
    throw new UnauthorizedException('Your vendor registration has been rejected by the admin.');
  }

  const adminAccess = this.adminAccessService.resolveAccess(user);

  const token = await this.jwtService.signAsync({
    sub: user.id,
    email: user.email,
    role: user.role,
    adminRole: adminAccess.adminRole,
    permissions: adminAccess.permissions,
  });

  await this.notificationsService.create(user.id, {
    title: 'Login Successful',
    message: 'You logged into your account successfully.',
  });

  const roleMap = {
    USER: 'customer',
    VENDOR: 'vendor',
    ADMIN: 'admin',
  } as const;

  return {
    success: true,
    message: 'Login successful',
    accessToken: token,

    user: {
      _id: user.id,

      name: user.name,

      email: user.email,

      phone: user.phone ?? '',

      avatar: '',

      role: roleMap[user.role],

      adminRole: adminAccess.adminRole,

      permissions: adminAccess.permissions,

      mustChangePassword: user.mustChangePassword,

      status: user.vendor
        ? user.vendor.status.toLowerCase()
        : undefined,

      isVerified: user.isVerified,

      createdAt: user.createdAt,

      updatedAt: user.updatedAt,

      membership: user.membership,

      adminVerificationStatus: user.adminVerificationStatus.toLowerCase(),
    },
  };
}




async verifyEmailOtp(dto: VerifyEmailOtpDto) {
  const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
  if (!user) throw new BadRequestException('Invalid email or OTP.');
  if (user.isVerified) {
    return { success: true, message: 'Email is already verified. Your account is awaiting admin approval.' };
  }

  const verification = await this.prisma.verificationToken.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
  if (!verification || verification.expiresAt < new Date()) {
    throw new BadRequestException('OTP is invalid or has expired. Please request a new code.');
  }
  if (!(await bcrypt.compare(dto.otp, verification.token))) {
    throw new BadRequestException('Invalid OTP.');
  }

  await this.prisma.$transaction([
    this.prisma.user.update({ where: { id: user.id }, data: { isVerified: true } }),
    this.prisma.verificationToken.deleteMany({ where: { userId: user.id } }),
  ]);
  return {
    success: true,
    message: 'Email verified successfully. Your account is now awaiting admin approval.',
    data: { adminVerificationStatus: 'pending' },
  };
}

async resendEmailOtp(dto: ResendEmailOtpDto) {
  const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
  if (!user) {
    return { success: true, message: 'If the account exists, a new OTP has been sent.' };
  }
  if (user.isVerified) throw new BadRequestException('Email is already verified.');
  await this.issueEmailOtp(user);
  return { success: true, message: 'A new OTP has been sent to your email.' };
}

async verifyEmail(token: string) {
  const verificationToken = await this.prisma.verificationToken.findUnique({
    where: {
      token,
    },
  });
  if (!verificationToken) {
    throw new BadRequestException('Invalid verification link.');
  }
  const user = await this.prisma.user.findUnique({
  where: {
    id: verificationToken.userId,
  },
});

if (user?.isVerified) {
  throw new BadRequestException(
    'Email is already verified.',
  );
}

  

  if (verificationToken.expiresAt < new Date()) {
    throw new BadRequestException('Verification link has expired.');
  }

  await this.prisma.$transaction([
  this.prisma.user.update({
    where: {
      id: verificationToken.userId,
    },
    data: {
      isVerified: true,
    },
  }),

  this.prisma.verificationToken.delete({
    where: {
      id: verificationToken.id,
    },
  }),
]);

  return {
    success: true,
    message: 'Email verified successfully. You can now log in.',
  };
}
async forgotPassword(dto: ForgotPasswordDto) {
  const user = await this.prisma.user.findUnique({
    where: {
      email: dto.email,
    },
  });

  if (!user) {
    throw new BadRequestException('User not found.');
  }

  // Delete any existing reset tokens
  await this.prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
    },
  });

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Save token
  await this.prisma.passwordResetToken.create({
    data: {
      token: resetToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  // Send email
  await this.mailService.sendPasswordResetEmail(
    user.email,
    user.name,
    resetToken,
  );

  return {
    success: true,
    message: 'Password reset email sent successfully.',
  };
}

async resetPassword(dto: ResetPasswordDto) {
  const resetToken = await this.prisma.passwordResetToken.findUnique({
    where: {
      token: dto.token,
    },
  });

  if (!resetToken) {
    throw new BadRequestException('Invalid reset link.');
  }

  if (resetToken.expiresAt < new Date()) {
    throw new BadRequestException('Reset link has expired.');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  await this.prisma.$transaction([
    this.prisma.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        password: hashedPassword,
      },
    }),

    this.prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    }),
  ]);

  return {
    success: true,
    message: 'Password has been reset successfully.',
  };
}

async sendLoginOtp(dto: SendLoginOtpDto) {
  const phone = dto.phone.trim();
  const user = await this.prisma.user.findFirst({
    where: { phone },
    include: { vendor: true },
  });

  if (!user) {
    throw new BadRequestException('No account found registered with this phone number.');
  }

  if (user.role === Role.ADMIN && !user.adminIsActive) {
    throw new UnauthorizedException('Your admin account is inactive.');
  }

  if (user.role !== Role.ADMIN && !user.isVerified) {
    throw new UnauthorizedException('Please verify your account before logging in.');
  }



  if (user.role === Role.VENDOR && user.vendor?.status === VendorStatus.PENDING) {
    throw new UnauthorizedException('Your vendor account is awaiting admin approval.');
  }

  if (user.role === Role.VENDOR && user.vendor?.status === VendorStatus.REJECTED) {
    throw new UnauthorizedException('Your vendor registration has been rejected by the admin.');
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      phoneOtp: hashedOtp,
      phoneOtpExpiresAt: expiresAt,
    },
  });

  console.log(`📱 [PHONE LOGIN OTP] Sent to ${phone}: ${otp}`);

  return {
    success: true,
    message: 'OTP has been sent to your registered phone number.',
    ...(process.env.NODE_ENV !== 'production' ? { otp } : {}),
  };
}

async verifyLoginOtp(dto: VerifyLoginOtpDto) {
  const phone = dto.phone.trim();
  const user = await this.prisma.user.findFirst({
    where: { phone },
    include: { vendor: true },
  });

  if (!user || !user.phoneOtp || !user.phoneOtpExpiresAt) {
    throw new BadRequestException('Invalid OTP or no OTP request found for this phone number.');
  }

  if (new Date() > user.phoneOtpExpiresAt) {
    throw new BadRequestException('OTP has expired. Please request a new one.');
  }

  const isMatch = await bcrypt.compare(dto.otp, user.phoneOtp);
  if (!isMatch) {
    throw new BadRequestException('Invalid OTP. Please try again.');
  }

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      phoneOtp: null,
      phoneOtpExpiresAt: null,
    },
  });

  const adminAccess = this.adminAccessService.resolveAccess(user);

  const token = await this.jwtService.signAsync({
    sub: user.id,
    email: user.email,
    role: user.role,
    adminRole: adminAccess.adminRole,
    permissions: adminAccess.permissions,
  });

  await this.notificationsService.create(user.id, {
    title: 'Login Successful',
    message: 'You logged into your account using Phone OTP successfully.',
  });

  const roleMap = {
    USER: 'customer',
    VENDOR: 'vendor',
    ADMIN: 'admin',
  } as const;

  return {
    success: true,
    message: 'Login successful',
    accessToken: token,
    user: {
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? '',
      avatar: '',
      role: roleMap[user.role],
      membership: user.membership,
      vendorId: user.vendor?.id,
      businessName: user.vendor?.businessName,
      adminRole: adminAccess.adminRole,
      adminPermissions: adminAccess.permissions,
    },
  };
}

}
