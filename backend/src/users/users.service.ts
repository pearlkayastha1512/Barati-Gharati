import { Injectable,BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
  async updateProfile(
  userId: string,
  updateProfileDto: UpdateProfileDto,
) {

  const existingPhone = await this.prisma.user.findFirst({
    where: {
      phone: updateProfileDto.phone,
      NOT: {
        id: userId,
      },
    },
  });

  if (existingPhone) {
    throw new BadRequestException(
      'Phone number already in use',
    );
  }

  const updatedUser = await this.prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      ...updateProfileDto,
    },

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
}
  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }
  async changePassword(
  userId: string,
  changePasswordDto: ChangePasswordDto,
) {

  // Step 1
  const user = await this.prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  // Step 2
  const isPasswordCorrect = await bcrypt.compare(
    changePasswordDto.currentPassword,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new BadRequestException(
      'Current password is incorrect',
    );
  }

  // Step 3
  if (
    changePasswordDto.currentPassword ===
    changePasswordDto.newPassword
  ) {
    throw new BadRequestException(
      'New password must be different from current password',
    );
  }

  // Step 4
  const hashedPassword = await bcrypt.hash(
    changePasswordDto.newPassword,
    10,
  );

  // Step 5
  await this.prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  // Step 6
  return {
    success: true,
    message: 'Password changed successfully',
  };
}

  // ===========================
  // UPDATE PUSH TOKEN
  // ===========================

  async updatePushToken(userId: string, pushToken: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        pushToken,
      },
    });

    return {
      success: true,
      message: 'Push token updated successfully',
    };
  }
}