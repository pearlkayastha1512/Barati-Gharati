import { Injectable,NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus,Role,VendorStatus,PaymentStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getDashboard() {
    const totalUsers = await this.prisma.user.count();

    const totalVendors = await this.prisma.vendor.count();

    const totalPackages = await this.prisma.package.count();

    const totalBookings = await this.prisma.booking.count();

    const totalCategories = await this.prisma.category.count();

    const pendingBookings =
      await this.prisma.booking.count({
        where: {
          status: BookingStatus.PENDING,
        },
      });

    const confirmedBookings =
      await this.prisma.booking.count({
        where: {
          status: BookingStatus.CONFIRMED,
        },
      });

    const cancelledBookings =
      await this.prisma.booking.count({
        where: {
          status: BookingStatus.CANCELLED,
        },
      });

    return {
      success: true,
      data: {
        totalUsers,
        totalVendors,
        totalPackages,
        totalBookings,
        totalCategories,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
      },
    };
  }

  async getAllUsers() {
  const users = await this.prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  return {
    success: true,
    count: users.length,
    data: users,
  };
}

async getUserById(id: string) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    include: {
      vendor: true,
      bookings: true,
    },
  });

  if (!user) {
    throw new NotFoundException(
      'User not found',
    );
  }

  return {
    success: true,
    data: user,
  };
}

async deleteUser(id: string) {
  const user = await this.prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException(
      'User not found',
    );
  }

  await this.prisma.user.delete({
    where: { id },
  });

  return {
    success: true,
    message: 'User deleted successfully',
  };
}

async getAllVendors() {
  const vendors = await this.prisma.vendor.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      category: true,
      packages: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    success: true,
    count: vendors.length,
    data: vendors,
  };
}

async getVendorById(id: string) {
  const vendor = await this.prisma.vendor.findUnique({
    where: { id },
    include: {
      user: true,
      category: true,
      packages: true,
      gallery: true,
    },
  });

  if (!vendor) {
    throw new NotFoundException('Vendor not found');
  }

  return {
    success: true,
    data: vendor,
  };
}

async approveVendor(id: string) {

  const vendor = await this.prisma.vendor.findUnique({
    where: {
      id,
    },
  });

  if (!vendor) {
    throw new NotFoundException(
      'Vendor not found',
    );
  }

  await this.prisma.$transaction(async (tx) => {

    await tx.vendor.update({
      where: {
        id,
      },
      data: {
        status: VendorStatus.APPROVED,
      },
    });

    await tx.user.update({
      where: {
        id: vendor.userId,
      },
      data: {
        role: Role.VENDOR,
      },
    });

  });

  return {
    success: true,
    message: 'Vendor approved successfully',
  };
}

async rejectVendor(id: string) {

  const vendor = await this.prisma.vendor.findUnique({
    where: {
      id,
    },
  });

  if (!vendor) {
    throw new NotFoundException(
      'Vendor not found',
    );
  }

  await this.prisma.vendor.update({
    where: {
      id,
    },
    data: {
      status: VendorStatus.REJECTED,
    },
  });

  return {
    success: true,
    message: 'Vendor rejected successfully',
  };
}
async deleteVendor(id: string) {
  const vendor = await this.prisma.vendor.findUnique({
    where: { id },
  });

  if (!vendor) {
    throw new NotFoundException('Vendor not found');
  }

  await this.prisma.vendor.delete({
    where: { id },
  });

  return {
    success: true,
    message: 'Vendor deleted successfully',
  };
}

async getAllBookings() {
  const bookings = await this.prisma.booking.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      vendor: {
        select: {
          businessName: true,
        },
      },
      package: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    success: true,
    count: bookings.length,
    data: bookings,
  };
}

async getBookingById(id: string) {
  const booking = await this.prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
      vendor: true,
      package: true,
    },
  });

  if (!booking) {
    throw new NotFoundException('Booking not found');
  }

  return {
    success: true,
    data: booking,
  };
}

async updateBookingStatus(
  id: string,
  status: BookingStatus,
) {
  const booking = await this.prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    throw new NotFoundException('Booking not found');
  }

  const updated = await this.prisma.booking.update({
    where: { id },
    data: {
      status,
    },
  });

  return {
    success: true,
    message: 'Booking status updated successfully',
    data: updated,
  };
}

async getAnalytics() {
  const bookings = await this.prisma.booking.findMany({
    where: {
      paymentStatus: PaymentStatus.SUCCESS,
    },
    select: {
      totalAmount: true,
    },
  });

  const revenue = bookings.reduce(
    (sum, booking) => sum + Number(booking.totalAmount),
    0,
  );

  const users = await this.prisma.user.count();
  const vendors = await this.prisma.vendor.count();
  const packages = await this.prisma.package.count();
  const categories = await this.prisma.category.count();

  return {
    success: true,
    data: {
      revenue,
      users,
      vendors,
      packages,
      categories,
    },
  };
}

async searchUsers(name: string) {
  const users = await this.prisma.user.findMany({
    where: {
      name: {
        contains: name,
        mode: 'insensitive',
      },
    },
  });

  return {
    success: true,
    data: users,
  };
}

async searchVendors(name: string) {
  const vendors = await this.prisma.vendor.findMany({
    where: {
      businessName: {
        contains: name,
        mode: 'insensitive',
      },
    },
    include: {
      category: true,
    },
  });

  return {
    success: true,
    data: vendors,
  };
}
}