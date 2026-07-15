import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminRole, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {
  ADMIN_ROLE_LABELS,
  ADMIN_ROLE_PERMISSIONS,
  AdminPermission,
  ALL_ADMIN_PERMISSIONS,
} from './admin-permissions';
import { CreateAdminDto } from './dto/create-admin.dto';
import {
  ResetAdminPasswordDto,
  ChangeOwnAdminPasswordDto,
  UpdateAdminDto,
} from './dto/update-admin.dto';

@Injectable()
export class AdminAccessService {
  constructor(private readonly prisma: PrismaService) {}

  resolveAccess(user: {
    role: Role;
    adminRole: AdminRole | null;
    adminPermissions: string[];
  }) {
    if (user.role !== Role.ADMIN) {
      return { adminRole: null, permissions: [] as string[] };
    }

    // Existing ADMIN accounts predate RBAC and remain the bootstrap super admin.
    const adminRole = user.adminRole ?? AdminRole.SUPER_ADMIN;
    const rolePermissions = ADMIN_ROLE_PERMISSIONS[adminRole];
    const validOverrides = user.adminPermissions.filter((permission) =>
      ALL_ADMIN_PERMISSIONS.includes(permission as AdminPermission),
    );

    return {
      adminRole,
      permissions: Array.from(
        new Set([...rolePermissions, ...validOverrides]),
      ),
    };
  }

  async getAccessForUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        adminRole: true,
        adminPermissions: true,
        adminIsActive: true,
        isSuspended: true,
      },
    });

    if (
      !user ||
      user.role !== Role.ADMIN ||
      !user.adminIsActive ||
      user.isSuspended
    ) {
      throw new ForbiddenException('Admin account is inactive');
    }

    return this.resolveAccess(user);
  }

  getRoleDefinitions() {
    return Object.values(AdminRole).map((role) => ({
      role,
      label: ADMIN_ROLE_LABELS[role],
      permissions: ADMIN_ROLE_PERMISSIONS[role],
    }));
  }

  async listAdmins() {
    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        adminRole: true,
        adminPermissions: true,
        adminIsActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return admins.map((admin) => {
      const access = this.resolveAccess({
        role: Role.ADMIN,
        adminRole: admin.adminRole,
        adminPermissions: admin.adminPermissions,
      });

      return { ...admin, ...access };
    });
  }

  async createAdmin(actorId: string, dto: CreateAdminDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException('Email is already registered');
    }

    const admin = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email: normalizedEmail,
        password: await bcrypt.hash(dto.password, 10),
        role: Role.ADMIN,
        adminRole: dto.adminRole,
        adminPermissions: dto.permissions ?? [],
        adminIsActive: true,
        mustChangePassword: true,
        isVerified: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        adminRole: true,
        adminPermissions: true,
        adminIsActive: true,
        mustChangePassword: true,
        createdAt: true,
      },
    });

    await this.recordAudit(actorId, 'admin.create', 'admin', admin.id, {
      adminRole: admin.adminRole,
      email: admin.email,
    });

    return admin;
  }

  async updateAdmin(
    actorId: string,
    adminId: string,
    dto: UpdateAdminDto,
  ) {
    const target = await this.getAdminOrThrow(adminId);

    if (actorId === adminId && dto.adminIsActive === false) {
      throw new BadRequestException(
        'You cannot deactivate your own admin account',
      );
    }

    await this.ensureSuperAdminRemains(target, dto);

    const updated = await this.prisma.user.update({
      where: { id: adminId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.adminRole !== undefined
          ? { adminRole: dto.adminRole }
          : {}),
        ...(dto.permissions !== undefined
          ? { adminPermissions: dto.permissions }
          : {}),
        ...(dto.adminIsActive !== undefined
          ? { adminIsActive: dto.adminIsActive }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        adminRole: true,
        adminPermissions: true,
        adminIsActive: true,
        mustChangePassword: true,
        updatedAt: true,
      },
    });

    await this.recordAudit(actorId, 'admin.update', 'admin', adminId, {
      fields: Object.keys(dto),
    });

    return updated;
  }

  async resetPassword(
    actorId: string,
    adminId: string,
    dto: ResetAdminPasswordDto,
  ) {
    await this.getAdminOrThrow(adminId);
    await this.prisma.user.update({
      where: { id: adminId },
      data: {
        password: await bcrypt.hash(dto.password, 10),
        mustChangePassword: true,
      },
    });
    await this.recordAudit(
      actorId,
      'admin.password_reset',
      'admin',
      adminId,
    );
    return { success: true, message: 'Temporary password updated' };
  }

  async changeOwnPassword(
    adminId: string,
    dto: ChangeOwnAdminPasswordDto,
  ) {
    await this.getAdminOrThrow(adminId);
    await this.prisma.user.update({
      where: { id: adminId },
      data: {
        password: await bcrypt.hash(dto.password, 10),
        mustChangePassword: false,
      },
    });
    await this.recordAudit(
      adminId,
      'admin.password_changed',
      'admin',
      adminId,
    );
    return { success: true, message: 'Password changed successfully' };
  }

  async listAuditLogs() {
    return this.prisma.adminAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 250,
      include: {
        actor: { select: { name: true, email: true, adminRole: true } },
      },
    });
  }

  async recordAudit(
    actorId: string,
    action: string,
    resource: string,
    resourceId?: string,
    details?: object,
  ) {
    return this.prisma.adminAuditLog.create({
      data: { actorId, action, resource, resourceId, details },
    });
  }

  private async getAdminOrThrow(id: string) {
    const admin = await this.prisma.user.findUnique({ where: { id } });
    if (!admin || admin.role !== Role.ADMIN) {
      throw new NotFoundException('Admin account not found');
    }
    return admin;
  }

  private async ensureSuperAdminRemains(
    target: { adminRole: AdminRole | null; adminIsActive: boolean },
    dto: UpdateAdminDto,
  ) {
    const isSuperAdmin =
      (target.adminRole ?? AdminRole.SUPER_ADMIN) ===
      AdminRole.SUPER_ADMIN;
    const removesSuperAccess =
      dto.adminRole !== undefined &&
      dto.adminRole !== AdminRole.SUPER_ADMIN;
    const deactivates = dto.adminIsActive === false;

    if (!isSuperAdmin || (!removesSuperAccess && !deactivates)) return;

    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN, adminIsActive: true },
      select: { id: true, adminRole: true },
    });
    const superAdminCount = admins.filter(
      (admin) =>
        (admin.adminRole ?? AdminRole.SUPER_ADMIN) ===
        AdminRole.SUPER_ADMIN,
    ).length;

    if (superAdminCount <= 1) {
      throw new BadRequestException(
        'At least one active Super Admin is required',
      );
    }
  }
}
