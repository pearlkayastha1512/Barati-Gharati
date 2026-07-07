import {
  Controller,
  Get,
  UseGuards,
  Param,
  Delete,
  Patch, Body
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';

import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }
  @Get('users')
getAllUsers() {
  return this.adminService.getAllUsers();
}

@Get('users/:id')
getUserById(
  @Param('id') id: string,
) {
  return this.adminService.getUserById(id);
}

@Delete('users/:id')
deleteUser(
  @Param('id') id: string,
) {
  return this.adminService.deleteUser(id);
}

@Get('vendors')
getAllVendors() {
  return this.adminService.getAllVendors();
}

@Get('vendors/:id')
getVendorById(
  @Param('id') id: string,
) {
  return this.adminService.getVendorById(id);
}

@Patch('vendors/:id/approve')
approveVendor(
  @Param('id') id: string,
) {
  return this.adminService.approveVendor(id);
}

@Patch('vendors/:id/reject')
rejectVendor(
  @Param('id') id: string,
) {
  return this.adminService.rejectVendor(id);
}
@Delete('vendors/:id')
deleteVendor(
  @Param('id') id: string,
) {
  return this.adminService.deleteVendor(id);
}


@Get('bookings')
getAllBookings() {
  return this.adminService.getAllBookings();
}

@Get('bookings/:id')
getBookingById(
  @Param('id') id: string,
) {
  return this.adminService.getBookingById(id);
}

@Patch('bookings/:id/status')
updateBookingStatus(
  @Param('id') id: string,
  @Body() dto: UpdateBookingStatusDto,
) {
  return this.adminService.updateBookingStatus(
    id,
    dto.status,
  );
}

@Get('analytics')
getAnalytics() {
  return this.adminService.getAnalytics();
}

@Get('emails')
getEmailLogs() {
  return this.adminService.getEmailLogs();
}

@Get('notifications')
getNotifications() {
  return this.adminService.getNotifications();
}

@Get('settings')
getPlatformSettings() {
  return this.adminService.getPlatformSettings();
}

@Patch('settings')
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

@Get('users/search/:name')
searchUsers(
  @Param('name') name: string,
) {
  return this.adminService.searchUsers(name);
}

@Get('vendors/search/:name')
searchVendors(
  @Param('name') name: string,
) {
  return this.adminService.searchVendors(name);
}
}
