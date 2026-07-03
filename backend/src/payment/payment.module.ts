import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaModule } from '../prisma/prisma.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PrismaModule,InvoiceModule,
  MailModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}