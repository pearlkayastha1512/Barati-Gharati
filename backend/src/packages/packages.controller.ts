import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';

import { Role } from '@prisma/client';

import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Packages')
@Controller('packages')
export class PackagesController {
  constructor(
    private readonly packagesService: PackagesService,
  ) {}

  // ===========================
  // PUBLIC APIs
  // ===========================

  @Get()
  @ApiQuery({
    name: 'categoryId',
    required: false,
  })
  findAll(
    @Query('categoryId') categoryId?: string,
  ) {
    return this.packagesService.findAll(categoryId);
  }

  

  // ===========================
  // VENDOR APIs
  // ===========================

  @Get('my/packages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  findMyPackages(
    @CurrentUser() user: { sub: string },
  ) {
    return this.packagesService.findMyPackages(user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.packagesService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreatePackageDto,
  ) {
    return this.packagesService.create(user.sub, dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  update(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string },
    @Body() dto: UpdatePackageDto,
  ) {
    return this.packagesService.update(
      id,
      user.sub,
      dto,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.packagesService.remove(
      id,
      user.sub,
    );
  }

  @Get("vendor/:vendorId")
findVendorPackages(
  @Param("vendorId") vendorId: number,
) {
  return this.packagesService.findVendorPackages(
    Number(vendorId),
  );
}
}

