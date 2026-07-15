import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminAccessController } from './admin-access.controller';
import { AdminAccessService } from './admin-access.service';
import { PermissionsGuard } from './guards/permissions.guard';
import { AdminAuditInterceptor } from './interceptors/admin-audit.interceptor';

@Module({
  imports: [PrismaModule],
  controllers: [AdminAccessController],
  providers: [AdminAccessService, PermissionsGuard, AdminAuditInterceptor],
  exports: [AdminAccessService, PermissionsGuard, AdminAuditInterceptor],
})
export class AdminAccessModule {}
