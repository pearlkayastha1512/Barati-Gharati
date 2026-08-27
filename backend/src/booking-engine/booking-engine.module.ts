import { Module } from '@nestjs/common';
import { BookingEngineService } from './booking-engine.service';
import { BookingEngineScheduler } from './booking-engine.scheduler';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PrismaModule, NotificationsModule, MailModule],
  providers: [BookingEngineService, BookingEngineScheduler],
  exports: [BookingEngineService],
})
export class BookingEngineModule {}
