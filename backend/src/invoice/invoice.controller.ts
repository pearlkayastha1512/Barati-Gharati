import { Controller, Post, Param } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
  ) {}

  @Post('regenerate/:bookingId')
  async regenerateInvoice(
    @Param('bookingId') bookingId: string,
  ) {
    return this.invoiceService.regenerateInvoice(
      bookingId,
    );
  }
}