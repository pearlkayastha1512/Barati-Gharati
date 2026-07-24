import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { WeddingStoriesController } from './wedding-stories.controller';
import { WeddingStoriesService } from './wedding-stories.service';

@Module({
  imports: [PrismaModule],
  controllers: [WeddingStoriesController],
  providers: [WeddingStoriesService],
  exports: [WeddingStoriesService],
})
export class WeddingStoriesModule {}