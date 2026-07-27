import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PayoutsModule } from '../payouts/payouts.module';
import { PremiumPlanningController } from './premium-planning.controller';
import { PremiumPlanningService } from './premium-planning.service';
import { AdminAccessModule } from '../admin-access/admin-access.module';

@Module({
  imports: [PrismaModule, NotificationsModule, PayoutsModule, AdminAccessModule],
  controllers: [PremiumPlanningController],
  providers: [PremiumPlanningService],
})
export class PremiumPlanningModule {}
