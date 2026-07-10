import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { SearchVendorDto } from './dto/search-vendor.dto';

import { Role } from '@prisma/client';
import { VendorStatus } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class VendorService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly jwtService: JwtService,
  ) {}

  async createVendor(
  userId: string,
  createVendorDto: CreateVendorDto,
) {
  // Check if vendor profile already exists
  const existingVendor = await this.prisma.vendor.findUnique({
    where: {
      userId,
    },
  });

  if (existingVendor) {
    throw new BadRequestException(
      'Vendor profile already exists',
    );
  }

  // Create Vendor Profile
  const vendor = await this.prisma.vendor.create({
    data: {
      businessName: createVendorDto.businessName,
      description: createVendorDto.description,
      address: createVendorDto.address,
      categoryId: createVendorDto.categoryId,
      userId,
      status: VendorStatus.PENDING,
    },
  });

  return {
    success: true,
    message:
      'Vendor registration submitted successfully. Waiting for admin approval.',
    data: vendor,
  };
}
async getMyVendorProfile(userId: string) {
  const { start, end } = this.getCurrentMonthRange();

  const vendor = await this.prisma.vendor.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      category: true,
      _count: {
        select: {
          bookings: {
            where: {
              createdAt: {
                gte: start,
                lt: end,
              },
            },
          },
        },
      },
    },
  });

  if (!vendor) {
    throw new BadRequestException(
      'Vendor profile not found',
    );
  }
  return {
    success: true,
    data: {
      ...vendor,
      badge: vendor.badge,
      monthlyBookingLimit:
        vendor.monthlyBookingLimit,
      currentMonthBookings:
        vendor._count.bookings,
    },
  };
}

async updateVendorProfile(
  userId: string,
  updateVendorDto: UpdateVendorDto,
) {

  const vendor = await this.prisma.vendor.findUnique({
    where: {
      userId,
    },
  });

  if (!vendor) {
    throw new BadRequestException(
      'Vendor profile not found',
    );
  }
if (vendor.status !== VendorStatus.APPROVED) {
  throw new BadRequestException(
    'Your vendor account is waiting for admin approval.',
  );
}

  const {
    ownerName,
    email,
    phone,
    category,
    categoryId,
    ...vendorDto
  } = updateVendorDto;

  let resolvedCategoryId = categoryId;

  if (!resolvedCategoryId && category) {
    const categoryRecord =
      await this.prisma.category.findFirst({
        where: {
          name: {
            equals: category,
            mode: 'insensitive',
          },
        },
      });

    resolvedCategoryId = categoryRecord?.id;
  }

  const updatedVendor =
    await this.prisma.$transaction(async (tx) => {
      if (ownerName || email || phone) {
        await tx.user.update({
          where: {
            id: userId,
          },
          data: {
            ...(ownerName ? { name: ownerName } : {}),
            ...(email ? { email } : {}),
            ...(phone ? { phone } : {}),
          },
        });
      }

      return tx.vendor.update({
        where: {
          userId,
        },
        data: {
          ...vendorDto,
          ...(resolvedCategoryId
            ? {
                categoryId: resolvedCategoryId,
              }
            : {}),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          category: true,
        },
      });
    });

  return {
    success: true,
    message: 'Vendor profile updated successfully',
    data: updatedVendor,
  };
}

async getAllVendors() {
  const { start, end } = this.getCurrentMonthRange();

  const vendorsNeedingPublicIds =
    await this.prisma.vendor.findMany({
      where: {
        status: VendorStatus.APPROVED,
        isActive: true,
        frontendVendorId: null,
      },
      select: {
        id: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

  if (vendorsNeedingPublicIds.length > 0) {
    const maxPublicId =
      await this.prisma.vendor.aggregate({
        _max: {
          frontendVendorId: true,
        },
      });

    let nextPublicId =
      (maxPublicId._max.frontendVendorId ?? 0) + 1;

    for (const vendor of vendorsNeedingPublicIds) {
      await this.prisma.vendor.update({
        where: {
          id: vendor.id,
        },
        data: {
          frontendVendorId: nextPublicId,
        },
      });

      nextPublicId += 1;
    }
  }

  const vendors = await this.prisma.vendor.findMany({
    where: {
      status: VendorStatus.APPROVED,
      isActive: true,
      frontendVendorId: {
        not: null,
      },
    },

    include: {
      category: true,

      gallery: true,

      packages: {
        orderBy: {
          price: "asc",
        },
      },

      reviews: true,

      _count: {
        select: {
          bookings: {
            where: {
              createdAt: {
                gte: start,
                lt: end,
              },
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    success: true,

    count: vendors.length,

    data: vendors.map((vendor) => ({
      id: vendor.frontendVendorId,

      backendId: vendor.id,

      userId: vendor.userId,

      name: vendor.businessName,

      category: vendor.category?.name ?? "",

      city:
        vendor.city ??
        vendor.address ??
        "",

      rating:
        vendor.reviews.length === 0
          ? 5
          : Number(
              (
                vendor.reviews.reduce(
                  (sum, review) =>
                    sum + review.rating,
                  0,
                ) /
                vendor.reviews.length
              ).toFixed(1),
            ),

      reviews: vendor.reviews.length,

      price:
        vendor.packages.length > 0
          ? Number(vendor.packages[0].price)
          : 0,

      image:
        vendor.logoUrl ||
        vendor.coverImage ||
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",

      images:
        vendor.gallery.length > 0
          ? vendor.gallery.map(
              (image) => image.imageUrl,
            )
          : [
              vendor.logoUrl ||
                vendor.coverImage ||
                "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
            ],

      featured: false,

      badge: vendor.badge.toLowerCase(),

      monthlyBookingLimit:
        vendor.monthlyBookingLimit,

      currentMonthBookings:
        vendor._count.bookings,

      description:
        vendor.description ??
        "No description available.",

      amenities: [],

      packages: vendor.packages.map(
        (pkg, index) => ({
          id: index + 1,

          name: pkg.title,

          price: Number(pkg.price),
        }),
      ),
    })),
  };
}

async getVendorById(id: string) {
  const { start, end } = this.getCurrentMonthRange();

  const vendor = await this.prisma.vendor.findFirst({
    where: {
      frontendVendorId: Number(id),
      status: VendorStatus.APPROVED,
      isActive: true,
    },
    include: {
      category: true,
      gallery: true,
      packages: {
        orderBy: {
          price: "asc",
        },
      },
      reviews: true,
      _count: {
        select: {
          bookings: {
            where: {
              createdAt: {
                gte: start,
                lt: end,
              },
            },
          },
        },
      },
    },
  });

  if (!vendor) {
    throw new NotFoundException("Vendor not found");
  }

  return {
    success: true,
    data: {
      id: vendor.frontendVendorId,

      backendId: vendor.id,

      userId: vendor.userId,

      name: vendor.businessName,

      category: vendor.category?.name ?? "",

      city: vendor.city ?? vendor.address ?? "",

      rating:
        vendor.reviews.length === 0
          ? 5
          : Number(
              (
                vendor.reviews.reduce(
                  (sum, review) => sum + review.rating,
                  0,
                ) / vendor.reviews.length
              ).toFixed(1),
            ),

      reviews: vendor.reviews.length,

      price:
        vendor.packages.length > 0
          ? Number(vendor.packages[0].price)
          : 0,

      image:
        vendor.logoUrl ||
        vendor.coverImage ||
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",

      images:
        vendor.gallery.length > 0
          ? vendor.gallery.map((g) => g.imageUrl)
          : [
              vendor.logoUrl ||
              vendor.coverImage ||
              "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
            ],

      featured: false,

      badge: vendor.badge.toLowerCase(),

      monthlyBookingLimit:
        vendor.monthlyBookingLimit,

      currentMonthBookings:
        vendor._count.bookings,

      description:
        vendor.description ?? "No description available.",

      amenities: [],

      packages: vendor.packages.map((pkg, index) => ({
        id: pkg.id,
        name: pkg.title,
        price: Number(pkg.price),
      })),
    },
  };
}

async searchVendors(searchVendorDto: SearchVendorDto) {

  const page = Number(searchVendorDto.page) || 1;
  const limit = Number(searchVendorDto.limit) || 10;

  const vendors = await this.prisma.vendor.findMany({

    where: {

      ...(searchVendorDto.search && {
        businessName: {
          contains: searchVendorDto.search,
          mode: 'insensitive',
        },
      }),

      ...(searchVendorDto.city && {
        address: {
          contains: searchVendorDto.city,
          mode: 'insensitive',
        },
      }),

    },

    include: {
      category: true,
    },

    skip: (page - 1) * limit,

    take: limit,

    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    success: true,
    page,
    limit,
    count: vendors.length,
    data: vendors,
  };
}
async getDashboard(userId: string) {
  const { start, end } = this.getCurrentMonthRange();

  const vendor = await this.prisma.vendor.findUnique({
    where: {
      userId,
    },
  });

  if (!vendor) {
    throw new BadRequestException(
      'Vendor profile not found',
    );
  }
  if (vendor.status !== VendorStatus.APPROVED) {
  throw new BadRequestException(
    'Your vendor account is waiting for admin approval.',
  );
}
  const totalPackages = await this.prisma.package.count({
    where: {
      vendorId: vendor.id,
    },
  });

  const totalBookings = await this.prisma.booking.count({
    where: {
      package: {
        vendorId: vendor.id,
      },
    },
  });

  const pendingBookings = await this.prisma.booking.count({
    where: {
      package: {
        vendorId: vendor.id,
      },
      status: 'PENDING',
    },
  });

  const confirmedBookings = await this.prisma.booking.count({
    where: {
      package: {
        vendorId: vendor.id,
      },
      status: 'CONFIRMED',
    },
  });

  const cancelledBookings = await this.prisma.booking.count({
    where: {
      package: {
        vendorId: vendor.id,
      },
      status: 'CANCELLED',
    },
  });

  const currentMonthBookings = await this.prisma.booking.count({
    where: {
      vendorId: vendor.id,
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });

  return {
    success: true,
    data: {
      badge: vendor.badge.toLowerCase(),
      monthlyBookingLimit:
        vendor.monthlyBookingLimit,
      currentMonthBookings,
      totalPackages,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue: 0,
      averageRating: 0,
    },
  };
}

private getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      1,
    ),
  );
  const end = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      1,
    ),
  );

  return {
    start,
    end,
  };
}

async uploadVendorLogo(
  userId: string,
  file: Express.Multer.File,
) {

  const vendor = await this.prisma.vendor.findUnique({
    where: {
      userId,
    },
  });

  if (!vendor) {
    throw new BadRequestException(
      'Vendor profile not found',
    );
  }
  if (vendor.status !== VendorStatus.APPROVED) {
  throw new BadRequestException(
    'Your vendor account is waiting for admin approval.',
  );
}
  const uploadedImage: any =
    await this.cloudinaryService.uploadImage(file);

  const updatedVendor =
    await this.prisma.vendor.update({
      where: {
        userId,
      },
      data: {
        logoUrl: uploadedImage.secure_url,
      },
    });

  return {
    success: true,
    message: 'Logo uploaded successfully',
    image: uploadedImage.secure_url,
    data: updatedVendor,
  };
}
async uploadVendorCover(
  userId: string,
  file: Express.Multer.File,
) {

  const vendor = await this.prisma.vendor.findUnique({
    where: {
      userId,
    },
  });

  if (!vendor) {
    throw new BadRequestException(
      'Vendor profile not found',
    );
  }
  if (vendor.status !== VendorStatus.APPROVED) {
  throw new BadRequestException(
    'Your vendor account is waiting for admin approval.',
  );
}
  const uploaded: any =
    await this.cloudinaryService.uploadImage(file);

  const updatedVendor =
    await this.prisma.vendor.update({
      where: {
        userId,
      },
      data: {
        coverImage: uploaded.secure_url,
      },
    });

  return {
    success: true,
    message: 'Cover image uploaded successfully',
    coverImage: updatedVendor.coverImage,
  };
}

async uploadGallery(
  userId: string,
  files: Express.Multer.File[],
) {

  // Check Vendor Exists
  const vendor = await this.prisma.vendor.findUnique({
    where: {
      userId,
    },
  });

  if (!vendor) {
    throw new BadRequestException(
      'Vendor profile not found',
    );
  }
  if (vendor.status !== VendorStatus.APPROVED) {
  throw new BadRequestException(
    'Your vendor account is waiting for admin approval.',
  );
}
  if (!files || files.length === 0) {
    throw new BadRequestException(
      'Please upload at least one image',
    );
  }
  const existingImages =
  await this.prisma.vendorGallery.count({
    where: {
      vendorId: vendor.id,
    },
  });

// Maximum 10 images allowed
if (existingImages + files.length > 10) {
  throw new BadRequestException(
    `Maximum 10 gallery images are allowed. You already have ${existingImages} image(s).`,
  );
}
  const uploadedImages: any[] = [];

  for (const file of files) {

    const uploaded: any =
      await this.cloudinaryService.uploadImage(file);

    const gallery =
      await this.prisma.vendorGallery.create({
        data: {
          imageUrl: uploaded.secure_url,
          vendorId: vendor.id,
        },
      });

    uploadedImages.push(gallery);
  }

  return {
    success: true,
    message: 'Gallery uploaded successfully',
    count: uploadedImages.length,
    data: uploadedImages,
  };
}

async getGallery(userId: string) {

  const vendor = await this.prisma.vendor.findUnique({
    where: {
      userId,
    },
  });

  if (!vendor) {
    throw new BadRequestException(
      'Vendor profile not found',
    );
  }
  if (vendor.status !== VendorStatus.APPROVED) {
  throw new BadRequestException(
    'Your vendor account is waiting for admin approval.',
  );
}
  const gallery = await this.prisma.vendorGallery.findMany({
    where: {
      vendorId: vendor.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    success: true,
    count: gallery.length,
    data: gallery,
  };
}

async deleteGalleryImage(
  userId: string,
  imageId: string,
) {

  const vendor = await this.prisma.vendor.findUnique({
    where: {
      userId,
    },
  });

  if (!vendor) {
    throw new BadRequestException(
      'Vendor profile not found',
    );
  }
  if (vendor.status !== VendorStatus.APPROVED) {
  throw new BadRequestException(
    'Your vendor account is waiting for admin approval.',
  );
}
  const image = await this.prisma.vendorGallery.findUnique({
    where: {
      id: imageId,
    },
  });

  if (!image || image.vendorId !== vendor.id) {
    throw new NotFoundException(
      'Gallery image not found',
    );
  }

  await this.prisma.vendorGallery.delete({
    where: {
      id: imageId,
    },
  });

  return {
    success: true,
    message: 'Gallery image deleted successfully',
  };
}


}
