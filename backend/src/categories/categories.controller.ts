import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { Role } from '@prisma/client';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../admin-access/guards/permissions.guard';
import { Permissions } from '../admin-access/decorators/permissions.decorator';
import { ADMIN_PERMISSIONS } from '../admin-access/admin-permissions';
import { AdminAuditInterceptor } from '../admin-access/interceptors/admin-audit.interceptor';

@ApiTags('Categories')
@Controller('categories')
@UseInterceptors(AdminAuditInterceptor)
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  // ===========================
  // PUBLIC APIs
  // ===========================

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.categoriesService.findOne(id);
  }

  // ===========================
  // ADMIN APIs
  // ===========================

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.ADMIN)
  @Permissions(ADMIN_PERMISSIONS.CONTENT_MANAGE)
  create(
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.ADMIN)
  @Permissions(ADMIN_PERMISSIONS.CONTENT_MANAGE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.ADMIN)
  @Permissions(ADMIN_PERMISSIONS.CONTENT_MANAGE)
  remove(
    @Param('id') id: string,
  ) {
    return this.categoriesService.remove(id);
  }
}
