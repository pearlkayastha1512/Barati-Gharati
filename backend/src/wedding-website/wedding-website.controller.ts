import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { WeddingWebsiteService } from './wedding-website.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { CreateWeddingWebsiteDto } from './dto/create-wedding-website.dto';
import { UpdateWeddingWebsiteDto } from './dto/update-wedding-website.dto';

@ApiTags('Wedding Website')
@ApiBearerAuth()
@Controller('wedding-websites')
export class WeddingWebsiteController {
  constructor(
    private readonly weddingWebsiteService: WeddingWebsiteService,
  ) {}

  // =====================================
  // CREATE WEBSITE
  // =====================================

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Create wedding website automatically from booking',
  })
  create(
    @CurrentUser('sub')
    userId: string,

    @Body()
    _dto: CreateWeddingWebsiteDto,
  ) {
    return this.weddingWebsiteService.create(
      userId,
    );
  }

  // =====================================
  // GET MY WEBSITE
  // =====================================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Get current user wedding website',
  })
  findMine(
    @CurrentUser('sub')
    userId: string,
  ) {
    return this.weddingWebsiteService.findMine(
      userId,
    );
  }

  // =====================================
  // GET WEBSITE BY SLUG
  // =====================================

  @Get(':slug')
  @ApiOperation({
    summary:
      'Get public wedding website by slug',
  })
  findBySlug(
    @Param('slug')
    slug: string,
  ) {
    return this.weddingWebsiteService.findBySlug(
      slug,
    );
  }

  // =====================================
  // UPDATE WEBSITE
  // =====================================

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Update wedding website',
  })
  update(
    @CurrentUser('sub')
    userId: string,

    @Body()
    dto: UpdateWeddingWebsiteDto,
  ) {
    return this.weddingWebsiteService.update(
      userId,
      dto,
    );
  }

  // =====================================
  // PUBLISH / UNPUBLISH
  // =====================================

  @Patch('publish/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Publish or unpublish wedding website',
  })
  togglePublish(
    @CurrentUser('sub')
    userId: string,
  ) {
    return this.weddingWebsiteService.togglePublish(
      userId,
    );
  }
}