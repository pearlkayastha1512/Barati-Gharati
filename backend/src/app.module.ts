import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

import { UsersModule } from './users/users.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { CategoriesModule } from './categories/categories.module';
import { PackagesModule } from './packages/packages.module';

import { VendorModule } from './vendor/vendor.module';
import { PaymentModule } from './payment/payment.module';
import { BookingsModule } from './bookings/bookings.module';
import { GuestsModule } from './guests/guests.module';
import { TimelineModule } from './timeline/timeline.module';
import { ChecklistModule } from './checklist/checklist.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { ReviewsModule } from './reviews/reviews.module';
import { BudgetsModule } from './budgets/budgets.module';
import { ExpensesModule } from './expenses/expenses.module';
import { LeadsModule } from './leads/leads.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailModule } from './mail/mail.module';
import { InvoiceModule } from './invoice/invoice.module';


import { PortfolioModule } from "./portfolio/portfolio.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
  {
    ttl: 60000,
    limit: 100,
  },
]),
    PrismaModule,
    AuthModule,
    UsersModule,
    VendorModule,
    ChatbotModule,
    CategoriesModule, 
     PortfolioModule,
     PackagesModule, PaymentModule,
     PackagesModule, BookingsModule, GuestsModule, TimelineModule, ChecklistModule, NotificationsModule, AdminModule,
     PackagesModule, BookingsModule, ReviewsModule, BudgetsModule, ExpensesModule, LeadsModule, MailModule, InvoiceModule,
  ],
  controllers: [AppController],
  providers: [
  AppService,
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
],
  
})
export class AppModule {}