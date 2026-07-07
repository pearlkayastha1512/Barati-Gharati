import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { AvailabilityService } from './availability.service';
import { BlockAvailabilityDto } from './dto/block-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get('vendor/:vendorId')
  findByVendor(
    @Param('vendorId', ParseIntPipe)
    vendorId: number,
  ) {
    return this.availabilityService.findByFrontendVendorId(vendorId);
  }

  @Get('mine')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  findMine(@CurrentUser('sub') userId: string) {
    return this.availabilityService.findMine(userId);
  }

  @Post('block')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  block(@CurrentUser('sub') userId: string, @Body() dto: BlockAvailabilityDto) {
    return this.availabilityService.block(userId, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  unblock(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.availabilityService.unblock(userId, id);
  }
}
