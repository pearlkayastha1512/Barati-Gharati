import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { VendorStatus } from '@prisma/client';

@Injectable()
export class WishlistService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private mapWishlist(item: any) {
    return {
      id: item.id,

      customerId: item.userId,

      vendorId: item.vendor.frontendVendorId,

      vendorName: item.vendor.businessName,

      category:
        item.vendor.category?.name ?? '',

      city: item.vendor.city ?? '',

      image:
        item.vendor.logoUrl ||
        item.vendor.coverImage ||
        "",

      rating:
        item.vendor.reviews.length === 0
          ? 5
          : Number(
              (
                item.vendor.reviews.reduce(
                  (sum: number, review: any) =>
                    sum + review.rating,
                  0,
                ) /
                item.vendor.reviews.length
              ).toFixed(1),
            ),

      startingPrice:
        item.vendor.packages.length === 0
          ? 0
          : Math.min(
              ...item.vendor.packages.map(
                (pkg: any) =>
                  Number(pkg.price),
              ),
            ),

      addedAt: item.createdAt,
    };
  }

  async findMine(userId: string) {
    const wishlist =
      await this.prisma.wishlist.findMany({
        where: {
          userId,
        },

        include: {
          vendor: {
            include: {
              category: true,
              packages: true,
              reviews: true,
            },
          },
        },

        orderBy: {
          createdAt: 'desc',
        },
      });

    return wishlist.map((item) =>
      this.mapWishlist(item),
    );
  }

  async add(
    userId: string,
    dto: CreateWishlistDto,
  ) {
    const vendor =
      await this.prisma.vendor.findFirst({
        where: {
          frontendVendorId:
            dto.vendorId,

          status:
            VendorStatus.APPROVED,
        },
      });

    if (!vendor) {
      throw new NotFoundException(
        'Vendor not found',
      );
    }

    const exists =
      await this.prisma.wishlist.findFirst({
        where: {
          userId,
          vendorId: vendor.id,
        },
      });

    if (exists) {
      return this.mapWishlist({
        ...exists,
        vendor,
      });
    }

    const wishlist =
      await this.prisma.wishlist.create({
        data: {
          userId,
          vendorId: vendor.id,
        },

        include: {
          vendor: {
            include: {
              category: true,
              packages: true,
              reviews: true,
            },
          },
        },
      });

    return this.mapWishlist(
      wishlist,
    );
  }

  async remove(
    userId: string,
    frontendVendorId: number,
  ) {
    const vendor =
      await this.prisma.vendor.findFirst({
        where: {
          frontendVendorId,
        },
      });

    if (!vendor) {
      throw new NotFoundException(
        'Vendor not found',
      );
    }

    const wishlist =
      await this.prisma.wishlist.findFirst({
        where: {
          userId,
          vendorId: vendor.id,
        },
      });

    if (!wishlist) {
      throw new NotFoundException(
        'Wishlist item not found',
      );
    }

    await this.prisma.wishlist.delete({
      where: {
        id: wishlist.id,
      },
    });

    return {
      message:
        'Removed from wishlist',
    };
  }

  async check(
    userId: string,
    frontendVendorId: number,
  ) {
    const vendor =
      await this.prisma.vendor.findFirst({
        where: {
          frontendVendorId,
        },
      });

    if (!vendor) {
      return {
        wishlisted: false,
      };
    }

    const exists =
      await this.prisma.wishlist.findFirst({
        where: {
          userId,
          vendorId: vendor.id,
        },
      });

    return {
      wishlisted: !!exists,
    };
  }
}