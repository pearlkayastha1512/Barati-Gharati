import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PremiumPlanningService } from './premium-planning.service';
import { CreatePremiumPlanningRequestDto } from './dto/create-premium-planning-request.dto';
import { ReviewPremiumPlanningRequestDto } from './dto/review-premium-planning-request.dto';
import { CreatePremiumQuotationDto } from './dto/create-premium-quotation.dto';
import { RespondPremiumQuotationDto } from './dto/respond-premium-quotation.dto';
import { PermissionsGuard } from '../admin-access/guards/permissions.guard';
import { Permissions } from '../admin-access/decorators/permissions.decorator';
import { ADMIN_PERMISSIONS } from '../admin-access/admin-permissions';

@ApiTags('Premium Planning')
@Controller('premium-planning')
export class PremiumPlanningController {
  constructor(private readonly service: PremiumPlanningService) {}

  @Get('membership')
  membership() {
    return this.service.getMembershipInfo();
  }

  @Post('requests')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  create(@CurrentUser('sub') userId: string, @Body() dto: CreatePremiumPlanningRequestDto) {
    return this.service.create(userId, dto);
  }

  @Get('requests/mine')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  mine(@CurrentUser('sub') userId: string) {
    return this.service.listMine(userId);
  }

  @Patch('requests/:id/respond')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  respond(@CurrentUser('sub') userId: string, @Param('id') id: string, @Body() dto: RespondPremiumQuotationDto) {
    return this.service.respond(userId, id, dto.accept);
  }

  @Get('admin/requests')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.ADMIN)
  @Permissions(ADMIN_PERMISSIONS.PREMIUM_PLANNING_VIEW)
  all() {
    return this.service.listAll();
  }

  @Get('admin/vendors')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.ADMIN)
  @Permissions(ADMIN_PERMISSIONS.PREMIUM_PLANNING_VIEW)
  approvedVendors() {
    return this.service.listApprovedVendors();
  }

  @Patch('admin/requests/:id/review')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.ADMIN)
  @Permissions(ADMIN_PERMISSIONS.PREMIUM_PLANNING_MANAGE)
  review(@Param('id') id: string, @Body() dto: ReviewPremiumPlanningRequestDto) {
    return this.service.review(id, dto);
  }

  @Patch('admin/requests/:id/quotation')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.ADMIN)
  @Permissions(ADMIN_PERMISSIONS.PREMIUM_PLANNING_MANAGE)
  quote(@Param('id') id: string, @Body() dto: CreatePremiumQuotationDto) {
    return this.service.quote(id, dto);
  }

  @Patch('admin/requests/:id/book')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.ADMIN)
  @Permissions(ADMIN_PERMISSIONS.PREMIUM_PLANNING_MANAGE)
  book(@Param('id') id: string) {
    return this.service.markBooked(id);
  }
}
