// import {
//   Body,
//   Controller,
//   Post,
//   UseGuards,
// } from '@nestjs/common';

// import {
//   ApiBearerAuth,
//   ApiOperation,
//   ApiTags,
// } from '@nestjs/swagger';

// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';

// import { WeddingStoriesService } from './wedding-stories.service';
// import { CreateWeddingStoryDto } from './dto/create-wedding-story.dto';

// @ApiTags('Wedding Stories')
// @ApiBearerAuth()
// @Controller('wedding-stories')
// export class WeddingStoriesController {
//   constructor(
//     private readonly weddingStoriesService: WeddingStoriesService,
//   ) {}

//   // =====================================
//   // CREATE STORY
//   // =====================================

//   @Post()
//   @UseGuards(JwtAuthGuard)
//   @ApiOperation({
//     summary: 'Create wedding story',
//   })
//   create(
//     @CurrentUser('sub')
//     userId: string,

//     @Body()
//     dto: CreateWeddingStoryDto,
//   ) {
//     return this.weddingStoriesService.create(
//       userId,
//       dto,
//     );
//   }
// }

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { WeddingStoriesService } from './wedding-stories.service';

import { CreateWeddingStoryDto } from './dto/create-wedding-story.dto';
import { UpdateWeddingStoryDto } from './dto/update-wedding-story.dto';

@ApiTags('Wedding Stories')
@ApiBearerAuth()
@Controller('wedding-stories')
export class WeddingStoriesController {
  constructor(
    private readonly weddingStoriesService: WeddingStoriesService,
  ) {}

  // =====================================
  // CREATE
  // =====================================

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create wedding story',
  })
  create(
    @CurrentUser('sub')
    userId: string,

    @Body()
    dto: CreateWeddingStoryDto,
  ) {
    return this.weddingStoriesService.create(
      userId,
      dto,
    );
  }

  // =====================================
  // ADMIN LIST
  // =====================================

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all wedding stories',
  })
  findAll() {
    return this.weddingStoriesService.findAll();
  }

  // =====================================
  // PUBLIC HOME
  // =====================================

  @Get('home')
  @ApiOperation({
    summary: 'Public home stories',
  })
  findHome() {
    return this.weddingStoriesService.findHome();
  }

  // =====================================
  // PUBLIC STORY
  // =====================================

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Public story by slug',
  })
  findBySlug(
    @Param('slug')
    slug: string,
  ) {
    return this.weddingStoriesService.findBySlug(
      slug,
    );
  }

  // =====================================
  // ADMIN GET ONE
  // =====================================

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get story by id',
  })
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.weddingStoriesService.findOne(
      id,
    );
  }

  // =====================================
  // UPDATE
  // =====================================

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update wedding story',
  })
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateWeddingStoryDto,
  ) {
    return this.weddingStoriesService.update(
      id,
      dto,
    );
  }

  // =====================================
  // DELETE
  // =====================================

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete wedding story',
  })
  remove(
    @Param('id')
    id: string,
  ) {
    return this.weddingStoriesService.remove(
      id,
    );
  }

  // =====================================
  // FEATURED
  // =====================================

  @Patch(':id/toggle-featured')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Toggle featured',
  })
  toggleFeatured(
    @Param('id')
    id: string,
  ) {
    return this.weddingStoriesService.toggleFeatured(
      id,
    );
  }

  // =====================================
  // PUBLISHED
  // =====================================

  @Patch(':id/toggle-published')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Toggle published',
  })
  togglePublished(
    @Param('id')
    id: string,
  ) {
    return this.weddingStoriesService.togglePublished(
      id,
    );
  }
}