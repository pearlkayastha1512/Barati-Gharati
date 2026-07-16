import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { VendorReplyDto } from './dto/vendor-reply.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { imageFileFilter } from '../common/file-filter';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@CurrentUser('sub') userId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(userId, dto);
  }

  @Post('upload-images')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: imageFileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          maxItems: 5,
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  uploadImages(
    @CurrentUser('sub') userId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.reviewsService.uploadProofImages(userId, files);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('mine')
  findMine(@CurrentUser('sub') userId: string) {
    return this.reviewsService.findMine(userId);
  }

  @Get('vendor/:vendorId')
  findByVendor(@Param('vendorId') vendorId: string) {
    return this.reviewsService.findByVendor(vendorId);
  }

  @Get('vendor/:vendorId/average')
  getAverage(@Param('vendorId') vendorId: string) {
    return this.reviewsService.getVendorAverageRating(vendorId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.reviewsService.remove(userId, id);
  }

  @Patch(':id/reply')
  vendorReply(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: VendorReplyDto,
  ) {
    return this.reviewsService.vendorReply(userId, id, dto);
  }
}
