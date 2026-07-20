import { Module } from '@nestjs/common';

import { WeddingWebsiteController } from './wedding-website.controller';
import { WeddingWebsiteService } from './wedding-website.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],

  controllers: [
    WeddingWebsiteController,
  ],

  providers: [
    WeddingWebsiteService,
  ],

  exports: [
    WeddingWebsiteService,
  ],
})
export class WeddingWebsiteModule {}