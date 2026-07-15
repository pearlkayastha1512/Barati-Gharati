import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminAccessService } from './admin-access.service';
import { ADMIN_PERMISSIONS } from './admin-permissions';
import { Permissions } from './decorators/permissions.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import {
  ResetAdminPasswordDto,
  ChangeOwnAdminPasswordDto,
  UpdateAdminDto,
} from './dto/update-admin.dto';
import { PermissionsGuard } from './guards/permissions.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(Role.ADMIN)
export class AdminAccessController {
  constructor(
    private readonly adminAccessService: AdminAccessService,
  ) {}

  @Get('access/me')
  async getMyAccess(@CurrentUser('sub') userId: string) {
    return {
      success: true,
      data: await this.adminAccessService.getAccessForUser(userId),
    };
  }

  @Get('admins/roles')
  @Permissions(ADMIN_PERMISSIONS.ADMINS_MANAGE)
  getRoleDefinitions() {
    return {
      success: true,
      data: this.adminAccessService.getRoleDefinitions(),
    };
  }

  @Patch('access/password')
  changeOwnPassword(
    @CurrentUser('sub') adminId: string,
    @Body() dto: ChangeOwnAdminPasswordDto,
  ) {
    return this.adminAccessService.changeOwnPassword(adminId, dto);
  }

  @Get('admins')
  @Permissions(ADMIN_PERMISSIONS.ADMINS_MANAGE)
  async listAdmins() {
    return {
      success: true,
      data: await this.adminAccessService.listAdmins(),
    };
  }

  @Post('admins')
  @Permissions(ADMIN_PERMISSIONS.ADMINS_MANAGE)
  async createAdmin(
    @CurrentUser('sub') actorId: string,
    @Body() dto: CreateAdminDto,
  ) {
    return {
      success: true,
      message: 'Admin account created successfully',
      data: await this.adminAccessService.createAdmin(actorId, dto),
    };
  }

  @Patch('admins/:id')
  @Permissions(ADMIN_PERMISSIONS.ADMINS_MANAGE)
  async updateAdmin(
    @CurrentUser('sub') actorId: string,
    @Param('id') adminId: string,
    @Body() dto: UpdateAdminDto,
  ) {
    return {
      success: true,
      message: 'Admin account updated successfully',
      data: await this.adminAccessService.updateAdmin(
        actorId,
        adminId,
        dto,
      ),
    };
  }

  @Patch('admins/:id/password')
  @Permissions(ADMIN_PERMISSIONS.ADMINS_MANAGE)
  resetPassword(
    @CurrentUser('sub') actorId: string,
    @Param('id') adminId: string,
    @Body() dto: ResetAdminPasswordDto,
  ) {
    return this.adminAccessService.resetPassword(
      actorId,
      adminId,
      dto,
    );
  }

  @Get('audit-logs')
  @Permissions(ADMIN_PERMISSIONS.AUDIT_VIEW)
  async listAuditLogs() {
    return {
      success: true,
      data: await this.adminAccessService.listAuditLogs(),
    };
  }
}
