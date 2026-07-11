import { Controller, Get, Post, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
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

  @Get('download/:bookingId')
  async downloadInvoice(
    @Param('bookingId') bookingId: string,
    @Res() res: Response,
  ) {
    const invoice =
      await this.invoiceService.regenerateInvoice(
        bookingId,
      );

    return res.download(
      invoice.path,
      `invoice-${bookingId}.pdf`,
    );
  }
}
