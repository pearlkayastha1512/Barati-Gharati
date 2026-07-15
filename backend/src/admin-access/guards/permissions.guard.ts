import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { AdminAccessService } from '../admin-access.service';
import { AdminPermission } from '../admin-permissions';
import { ADMIN_PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly adminAccessService: AdminAccessService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const required =
      this.reflector.getAllAndOverride<AdminPermission[]>(
        ADMIN_PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
      );

    if (!required?.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== Role.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    const access = await this.adminAccessService.getAccessForUser(
      user.sub,
    );
    request.adminAccess = access;

    const allowed = required.every((permission) =>
      access.permissions.includes(permission),
    );

    if (!allowed) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }
}
