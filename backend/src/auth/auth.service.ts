import { Injectable , BadRequestException, UnauthorizedException,} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';



@Injectable()
export class AuthService {

  constructor(
  private readonly prisma: PrismaService,
  private readonly jwtService: JwtService,
  private readonly notificationsService: NotificationsService,
   private readonly mailService: MailService,
) {}

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
    },
  });
  // Remove any old verification tokens
await this.prisma.verificationToken.deleteMany({
  where: {
    userId: user.id,
  },
});


  // Generate verification token
const verificationToken = crypto.randomBytes(32).toString('hex');

// Save token in database
await this.prisma.verificationToken.create({
  data: {
    token: verificationToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  },
});
await this.mailService.sendVerificationEmail(
  user.email,
  user.name,
  verificationToken,
);
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
    message: 'Registration successful. Please check your email to verify your account.',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
}
  async login(loginDto: LoginDto) {
   const user = await this.prisma.user.findUnique({
  where: {
    email: loginDto.email,
  },
});

if (!user) {
  throw new UnauthorizedException('Invalid email or password');
}

const isPasswordCorrect = await bcrypt.compare(
  loginDto.password,
  user.password,
);

if (!isPasswordCorrect) {
  throw new UnauthorizedException('Invalid email or password');
}

// NEW CODE
if (!user.isVerified) {
  throw new UnauthorizedException(
    'Please verify your email before logging in.',
  );
}

const token = await this.jwtService.signAsync({
  sub: user.id,
  email: user.email,
  role: user.role,
});
await this.notificationsService.create(
  user.id,
  {
    title: 'Login Successful',
    message: 'You logged into your account successfully.',
  },
);
  return {
  success: true,
  message: 'Login successful',
  accessToken: token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  },
};
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

}
