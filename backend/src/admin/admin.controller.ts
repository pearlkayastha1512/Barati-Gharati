import {
  Controller,
  Get,
  UseGuards,
  Param,
  Delete,
  Patch, Body, UseInterceptors, Post
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role, VendorBadge } from '@prisma/client';
import { BookingEngineService } from '../booking-engine/booking-engine.service';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AdminManualAssignDto {
  @IsString()
  vendorId!: string;
}

export class AdminAdjustLeadDto {
  @IsNumber()
  delta!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}

import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { PermissionsGuard } from '../admin-access/guards/permissions.guard';
import { Permissions } from '../admin-access/decorators/permissions.decorator';
import { ADMIN_PERMISSIONS } from '../admin-access/admin-permissions';
import { AdminAuditInterceptor } from '../admin-access/interceptors/admin-audit.interceptor';
import { CreateVendorByAdminDto } from './dto/create-vendor-by-admin.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@UseInterceptors(AdminAuditInterceptor)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly bookingEngine: BookingEngineService,
  ) {}

  @Get('dashboard')
  @Permissions(ADMIN_PERMISSIONS.DASHBOARD_VIEW)
  getDashboard() {
    return this.adminService.getDashboard();
  }
  @Get('users')
@Permissions(ADMIN_PERMISSIONS.CUSTOMERS_VIEW)
getAllUsers() {
  return this.adminService.getAllUsers();
}

@Get('users/:id')
@Permissions(ADMIN_PERMISSIONS.CUSTOMERS_VIEW)
getUserById(
  @Param('id') id: string,
) {
  return this.adminService.getUserById(id);
}

@Patch('users/:id/approve')
@Permissions(ADMIN_PERMISSIONS.CUSTOMERS_MANAGE)
approveCustomer(@Param('id') id: string) {
  return this.adminService.approveCustomer(id);
}

@Patch('users/:id/reject')
@Permissions(ADMIN_PERMISSIONS.CUSTOMERS_MANAGE)
rejectCustomer(@Param('id') id: string, @Body() dto: { reason?: string }) {
  return this.adminService.rejectCustomer(id, dto.reason);
}

@Patch('users/:id/reverify')
@Permissions(ADMIN_PERMISSIONS.CUSTOMERS_MANAGE)
reverifyCustomer(@Param('id') id: string) {
  return this.adminService.reverifyCustomer(id);
}

@Delete('users/:id')
@Permissions(ADMIN_PERMISSIONS.CUSTOMERS_MANAGE)
deleteUser(
  @Param('id') id: string,
) {
  return this.adminService.deleteUser(id);
}

@Get('vendors')
@Permissions(ADMIN_PERMISSIONS.VENDORS_VIEW)
getAllVendors() {
  return this.adminService.getAllVendors();
}

@Post('vendors')
@Permissions(ADMIN_PERMISSIONS.VENDORS_MANAGE)
createVendor(
  @Body() dto: CreateVendorByAdminDto,
) {
  return this.adminService.createVendorByAdmin(dto);
}

@Get('vendors/:id')
@Permissions(ADMIN_PERMISSIONS.VENDORS_VIEW)
getVendorById(
  @Param('id') id: string,
) {
  return this.adminService.getVendorById(id);
}

@Patch('vendors/:id/approve')
@Permissions(ADMIN_PERMISSIONS.VENDORS_MANAGE)
approveVendor(
  @Param('id') id: string,
) {
  return this.adminService.approveVendor(id);
}

@Patch('vendors/:id/reject')
@Permissions(ADMIN_PERMISSIONS.VENDORS_MANAGE)
rejectVendor(
  @Param('id') id: string,
) {
  return this.adminService.rejectVendor(id);
}

@Patch('vendors/:id/reverify')
@Permissions(ADMIN_PERMISSIONS.VENDORS_MANAGE)
reverifyVendor(@Param('id') id: string) {
  return this.adminService.reverifyVendor(id);
}

@Patch('vendors/:id/badge')
@Permissions(ADMIN_PERMISSIONS.VENDORS_MANAGE)
updateVendorBadge(
  @Param('id') id: string,
  @Body() dto: { badge: VendorBadge },
) {
  return this.adminService.updateVendorBadge(
    id,
    dto.badge,
  );
}

@Delete('vendors/:id')
@Permissions(ADMIN_PERMISSIONS.VENDORS_MANAGE)
deleteVendor(
  @Param('id') id: string,
) {
  return this.adminService.deleteVendor(id);
}


@Get('bookings')
@Permissions(ADMIN_PERMISSIONS.BOOKINGS_VIEW)
getAllBookings() {
  return this.adminService.getAllBookings();
}

@Get('bookings/:id')
@Permissions(ADMIN_PERMISSIONS.BOOKINGS_VIEW)
getBookingById(
  @Param('id') id: string,
) {
  return this.adminService.getBookingById(id);
}

@Delete('bookings/:id')
@Permissions(ADMIN_PERMISSIONS.BOOKINGS_MANAGE)
deleteBooking(
  @Param('id') id: string,
) {
  return this.adminService.deleteBooking(id);
}

@Patch('bookings/:id/status')
@Permissions(ADMIN_PERMISSIONS.BOOKINGS_MANAGE)
updateBookingStatus(
  @Param('id') id: string,
  @Body() dto: UpdateBookingStatusDto,
) {
  return this.adminService.updateBookingStatus(
    id,
    dto.status,
  );
}

@Patch('bookings/:id/approve')
@Permissions(
  ADMIN_PERMISSIONS.PAYMENTS_APPROVE,
  ADMIN_PERMISSIONS.PAYOUTS_RELEASE,
)
approveBooking(
  @Param('id') id: string,
) {
  return this.adminService.approveBooking(id);
}

@Patch('bookings/:id/approve-payment')
@Permissions(ADMIN_PERMISSIONS.PAYMENTS_APPROVE)
approveBookingPayment(
  @Param('id') id: string,
) {
  return this.adminService.approveBookingPayment(id);
}

@Patch('bookings/:id/hold-payment')
@Permissions(ADMIN_PERMISSIONS.PAYMENTS_APPROVE)
holdBookingPayment(
  @Param('id') id: string,
) {
  return this.adminService.holdBookingPayment(id);
}

// ═══════════════════════════════════════════════════════════
// Smart Booking Engine — Admin Endpoints
// ═══════════════════════════════════════════════════════════

/**
 * Admin manually assigns a vendor to a booking when no vendor is available.
 */
@Patch('bookings/:id/manual-assign')
@Permissions(ADMIN_PERMISSIONS.BOOKINGS_MANAGE)
manualAssign(
  @Param('id') id: string,
  @Body() dto: AdminManualAssignDto,
) {
  return this.bookingEngine.adminManualAssign(id, dto.vendorId);
}

/**
 * Admin views all vendor assignments for a booking.
 */
@Get('bookings/:id/assignments')
@Permissions(ADMIN_PERMISSIONS.BOOKINGS_MANAGE)
getBookingAssignments(
  @Param('id') id: string,
) {
  return this.bookingEngine.getBookingAssignments(id);
}

/**
 * Admin adjusts lead balance for a vendor (top-up or deduct).
 */
@Patch('vendors/:vendorId/lead-balance')
@Permissions(ADMIN_PERMISSIONS.VENDORS_MANAGE)
adjustLeadBalance(
  @Param('vendorId') vendorId: string,
  @Body() dto: AdminAdjustLeadDto,
) {
  return this.bookingEngine.adjustLeadBalance(vendorId, dto.delta);
}

/**
 * Admin initializes lead balance for a vendor (e.g. after badge assignment).
 */
@Post('vendors/:vendorId/lead-balance/init')
@Permissions(ADMIN_PERMISSIONS.VENDORS_MANAGE)
initializeLeadBalance(
  @Param('vendorId') vendorId: string,
  @Body('badge') badge: string,
) {
  return this.bookingEngine.initializeLeadBalance(vendorId, badge);
}


@Get('analytics')
@Permissions(ADMIN_PERMISSIONS.REPORTS_VIEW)
getAnalytics() {
  return this.adminService.getAnalytics();
}

@Get('emails')
@Permissions(ADMIN_PERMISSIONS.EMAILS_VIEW)
getEmailLogs() {
  return this.adminService.getEmailLogs();
}

@Get('notifications')
@Permissions(ADMIN_PERMISSIONS.NOTIFICATIONS_VIEW)
getNotifications() {
  return this.adminService.getNotifications();
}

@Get('chat/users')
@Permissions(ADMIN_PERMISSIONS.CHAT_VIEW)
getChatModerationUsers() {
  return this.adminService.getChatModerationUsers();
}

@Patch('chat/:id/mute')
@Permissions(ADMIN_PERMISSIONS.CHAT_MODERATE)
muteChatUser(
  @Param('id') id: string,
  @Body() dto: { durationMinutes?: number },
) {
  return this.adminService.muteChatUser(
    id,
    dto.durationMinutes,
  );
}

@Patch('chat/:id/block')
@Permissions(ADMIN_PERMISSIONS.CHAT_MODERATE)
blockChatUser(
  @Param('id') id: string,
) {
  return this.adminService.blockChatUser(id);
}

@Patch('chat/:id/suspend')
@Permissions(
  ADMIN_PERMISSIONS.CHAT_MODERATE,
  ADMIN_PERMISSIONS.ACCOUNTS_SUSPEND,
)
suspendUser(
  @Param('id') id: string,
) {
  return this.adminService.suspendUser(id);
}

@Patch('chat/:id/reset-warnings')
@Permissions(ADMIN_PERMISSIONS.CHAT_MODERATE)
resetChatWarnings(
  @Param('id') id: string,
) {
  return this.adminService.resetChatWarnings(id);
}

@Get('settings')
@Permissions(ADMIN_PERMISSIONS.SETTINGS_VIEW)
getPlatformSettings() {
  return this.adminService.getPlatformSettings();
}

@Patch('settings')
@Permissions(ADMIN_PERMISSIONS.SETTINGS_MANAGE)
updatePlatformSettings(
  @Body()
  dto: {
    allowVendorRegistration?: boolean;
    allowCustomerRegistration?: boolean;
    enableReviews?: boolean;
    enablePayments?: boolean;
    maintenanceMode?: boolean;
  },
) {
  return this.adminService.updatePlatformSettings(
    dto,
  );
}

@Get('content')
@Permissions(ADMIN_PERMISSIONS.CONTENT_VIEW)
getSiteContent() {
  return this.adminService.getSiteContent();
}

@Patch('content/:slug')
@Permissions(ADMIN_PERMISSIONS.CONTENT_MANAGE)
updateSiteContent(
  @Param('slug') slug: string,
  @Body() dto: { title: string; content: string },
) {
  return this.adminService.updateSiteContent(slug, dto);
}

@Get('users/search/:name')
@Permissions(ADMIN_PERMISSIONS.CUSTOMERS_VIEW)
searchUsers(
  @Param('name') name: string,
) {
  return this.adminService.searchUsers(name);
}

@Get('vendors/search/:name')
@Permissions(ADMIN_PERMISSIONS.VENDORS_VIEW)
searchVendors(
  @Param('name') name: string,
) {
  return this.adminService.searchVendors(name);
}
}
