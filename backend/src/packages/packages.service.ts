
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { VendorStatus } from '@prisma/client';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  private mapService(pkg: any) {
    return {
      id: pkg.id,

      vendorId: pkg.vendor.frontendVendorId,

      name: pkg.title,

      category: pkg.category?.name ?? '',

      description: pkg.description ?? '',

      duration: 'Full Day',

      price: Number(pkg.price),

      rating:
        pkg.reviews.length === 0
          ? 5
          : Number(
              (
                pkg.reviews.reduce(
                  (sum: number, review: any) => sum + review.rating,
                  0,
                ) / pkg.reviews.length
              ).toFixed(1),
            ),

      reviews: pkg.reviews.length,

      image:
        pkg.vendor.logoUrl ||
        pkg.vendor.coverImage ||
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',

      includes: pkg.inclusions ?? [],

      status: pkg.vendor.isActive ? 'active' : 'inactive',

      createdAt: pkg.createdAt,

      updatedAt: pkg.updatedAt,
    };
  }

  async create(userId: string, dto: CreatePackageDto) {
    const vendor = await this.prisma.vendor.findUnique({
      where: {
        userId,
      },
    });

    if (!vendor) {
      throw new ForbiddenException(
        'Only vendors can create packages',
      );
    }

    if (vendor.status !== VendorStatus.APPROVED) {
      throw new ForbiddenException(
        'Vendor is not approved by admin',
      );
    }

    // Find category, create it if it doesn't exist
    let category = await this.prisma.category.findFirst({
      where: {
        name: dto.category,
      },
    });

    if (!category) {
      category = await this.prisma.category.create({
        data: {
          name: dto.category,
        },
      });
    }



        console.log("========== CREATE PACKAGE ==========");
console.log(dto);
console.log("price =", dto.price, typeof dto.price);
console.log("vendor =", vendor.id);
console.log("category =", category.id);
console.log("===================================");
    const pkg = await this.prisma.package.create({
      data: {
        title: dto.name,

        description: dto.description,

        price: dto.price,

        categoryId: category.id,

        vendorId: vendor.id,

        inclusions: dto.includes ?? [],
      },

      include: {
        category: true,

        reviews: true,

        vendor: true,
      },
    });

    return this.mapService(pkg);
  }

  async findAll(categoryId?: string) {
    const packages = await this.prisma.package.findMany({
      where: {
        ...(categoryId && {
          categoryId,
        }),

        vendor: {
          status: VendorStatus.APPROVED,
        },
      },

      include: {
        category: true,

        reviews: true,

        vendor: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return packages.map((pkg) => this.mapService(pkg));
  }

  async findOne(id: string) {
    const pkg = await this.prisma.package.findUnique({
      where: {
        id,
      },

      include: {
        category: true,

        reviews: true,

        vendor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    if (pkg.vendor.status !== VendorStatus.APPROVED) {
      throw new NotFoundException('Package not found');
    }

    return pkg;
  }

  async findMyPackages(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: {
        userId,
      },
    });

    if (!vendor) {
      throw new ForbiddenException(
        'Only vendors can view their packages',
      );
    }

    if (vendor.status !== VendorStatus.APPROVED) {
      throw new ForbiddenException(
        'Vendor is not approved by admin',
      );
    }

    const packages = await this.prisma.package.findMany({
      where: {
        vendorId: vendor.id,
      },

      include: {
        category: true,

        reviews: true,

        vendor: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return packages.map((pkg) => this.mapService(pkg));
  }

  async update(
    id: string,
    userId: string,
    dto: UpdatePackageDto,
  ) {
    const vendor = await this.prisma.vendor.findUnique({
      where: {
        userId,
      },
    });

    if (!vendor) {
      throw new ForbiddenException(
        'Only vendors can update packages',
      );
    }

    if (vendor.status !== VendorStatus.APPROVED) {
      throw new ForbiddenException(
        'Vendor is not approved by admin',
      );
    }

    const pkg = await this.findOne(id);

    if (pkg.vendorId !== vendor.id) {
      throw new ForbiddenException(
        'You can only update your own packages',
      );
    }

    let categoryId: string | undefined = undefined;

    if (dto.category) {
      // Find category, create it if it doesn't exist
      let category = await this.prisma.category.findFirst({
        where: {
          name: dto.category,
        },
      });

      if (!category) {
        category = await this.prisma.category.create({
          data: {
            name: dto.category,
          },
        });
      }

      categoryId = category.id;
    }

    const updated = await this.prisma.package.update({
      where: {
        id,
      },

      data: {
        title: dto.name,

        description: dto.description,

        price: dto.price,

        categoryId,

        inclusions: dto.includes,
      },

      include: {
        category: true,

        reviews: true,

        vendor: true,
      },
    });

    return this.mapService(updated);
  }

  async remove(id: string, userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: {
        userId,
      },
    });

    if (!vendor) {
      throw new ForbiddenException(
        'Only vendors can delete packages',
      );
    }

    if (vendor.status !== VendorStatus.APPROVED) {
      throw new ForbiddenException(
        'Vendor is not approved by admin',
      );
    }

    const pkg = await this.findOne(id);

    if (pkg.vendorId !== vendor.id) {
      throw new ForbiddenException(
        'You can only delete your own packages',
      );
    }

    return this.prisma.package.delete({
      where: {
        id,
      },
    });
  }

  async findVendorPackages(frontendVendorId: number) {
  const vendor =
    await this.prisma.vendor.findFirst({
      where: {
        frontendVendorId,
        status: VendorStatus.APPROVED,
      },
    });

  if (!vendor) {
    throw new NotFoundException(
      "Vendor not found",
    );
  }

  const packages =
    await this.prisma.package.findMany({
      where: {
        vendorId: vendor.id,
      },

      include: {
        category: true,
        reviews: true,
        vendor: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return packages.map((pkg) =>
    this.mapService(pkg),
  );
}
}



// async update(
//   id: string,
//   userId: string,
//   dto: UpdatePackageDto,
// ) {
//   const vendor = await this.prisma.vendor.findUnique({
//     where: {
//       userId,
//     },
//   });

//   if (!vendor) {
//     throw new ForbiddenException(
//       'Only vendors can update packages',
//     );
//   }

//   if (vendor.status !== VendorStatus.APPROVED) {
//     throw new ForbiddenException(
//       'Vendor is not approved by admin',
//     );
//   }

//   // ✅ Fixed ownership check
//   const existing = await this.prisma.package.findUnique({
//     where: {
//       id,
//     },
//   });

//   if (!existing) {
//     throw new NotFoundException(
//       'Package not found',
//     );
//   }

//   if (existing.vendorId !== vendor.id) {
//     throw new ForbiddenException(
//       'You can only update your own packages',
//     );
//   }

//   let categoryId: string | undefined = undefined;

//   if (dto.category) {
//     let category = await this.prisma.category.findFirst({
//       where: {
//         name: dto.category,
//       },
//     });

//     if (!category) {
//       category = await this.prisma.category.create({
//         data: {
//           name: dto.category,
//         },
//       });
//     }

//     categoryId = category.id;
//   }

//   const updated = await this.prisma.package.update({
//     where: {
//       id,
//     },

//     data: {
//       title: dto.name,

//       description: dto.description,

//       price: dto.price,

//       categoryId,

//       inclusions: dto.includes,
//     },

//     include: {
//       category: true,

//       reviews: true,

//       vendor: true,
//     },
//   });

//   return this.mapService(updated);
// }

// async remove(id: string, userId: string) {
//   const vendor = await this.prisma.vendor.findUnique({
//     where: {
//       userId,
//     },
//   });

//   if (!vendor) {
//     throw new ForbiddenException(
//       'Only vendors can delete packages',
//     );
//   }

//   if (vendor.status !== VendorStatus.APPROVED) {
//     throw new ForbiddenException(
//       'Vendor is not approved by admin',
//     );
//   }

//   // ✅ Fixed ownership check
//   const existing = await this.prisma.package.findUnique({
//     where: {
//       id,
//     },
//   });

//   if (!existing) {
//     throw new NotFoundException(
//       'Package not found',
//     );
//   }

//   if (existing.vendorId !== vendor.id) {
//     throw new ForbiddenException(
//       'You can only delete your own packages',
//     );
//   }

//   return this.prisma.package.delete({
//     where: {
//       id,
//     },
//   });
// }

// async findVendorPackages(frontendVendorId: number) {
//   const vendor =
//     await this.prisma.vendor.findFirst({
//       where: {
//         frontendVendorId,
//         status: VendorStatus.APPROVED,
//       },
//     });

//   if (!vendor) {
//     throw new NotFoundException(
//       'Vendor not found',
//     );
//   }

//   const packages =
//     await this.prisma.package.findMany({
//       where: {
//         vendorId: vendor.id,
//       },

//       include: {
//         category: true,
//         reviews: true,
//         vendor: true,
//       },

//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//   return packages.map((pkg) =>
//     this.mapService(pkg),
//   );
// }
// }





