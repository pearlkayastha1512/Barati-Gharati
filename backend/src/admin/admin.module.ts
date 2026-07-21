import { Module } from '@nestjs/common';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PayoutsModule } from '../payouts/payouts.module';
import { AdminAccessModule } from '../admin-access/admin-access.module';
import { BookingEngineModule } from '../booking-engine/booking-engine.module';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    NotificationsModule,
    PayoutsModule,
    AdminAccessModule,
    BookingEngineModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
