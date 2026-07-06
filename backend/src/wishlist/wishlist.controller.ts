import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService,
  ) {}

  @Get()
  findMine(
    @CurrentUser('sub') userId: string,
  ) {
    return this.wishlistService.findMine(userId);
  }

  @Post()
  add(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateWishlistDto,
  ) {
    return this.wishlistService.add(userId, dto);
  }

  @Delete(':vendorId')
  remove(
    @CurrentUser('sub') userId: string,
    @Param('vendorId') vendorId: string,
  ) {
    return this.wishlistService.remove(
      userId,
      Number(vendorId),
    );
  }

  @Get('check/:vendorId')
  check(
    @CurrentUser('sub') userId: string,
    @Param('vendorId') vendorId: string,
  ) {
    return this.wishlistService.check(
      userId,
      Number(vendorId),
    );
  }
}