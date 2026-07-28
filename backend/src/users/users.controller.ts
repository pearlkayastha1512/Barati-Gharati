import {
  Controller,
  Get,
  Req,
  UseGuards,
  Patch,
  Body,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { UsersService } from './users.service';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePushTokenDto } from './dto/update-push-token.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // ===========================
  // GET MY PROFILE
  // ===========================

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.VENDOR)
  async getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.sub);
  }

  // ===========================
  // UPDATE PROFILE
  // ===========================

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.VENDOR)
  async updateProfile(
    @Req() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(
      req.user.sub,
      updateProfileDto,
    );
  }

  // ===========================
  // CHANGE PASSWORD
  // ===========================

  @Patch('change-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.VENDOR)
  async changePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      req.user.sub,
      changePasswordDto,
    );
  }

  // ===========================
  // UPDATE PUSH TOKEN
  // ===========================

  @Patch('push-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.VENDOR)
  async updatePushToken(
    @Req() req: any,
    @Body() updatePushTokenDto: UpdatePushTokenDto,
  ) {
    return this.usersService.updatePushToken(
      req.user.sub,
      updatePushTokenDto.pushToken,
    );
  }
}