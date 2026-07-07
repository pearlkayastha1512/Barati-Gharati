import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { VendorReplyDto } from './dto/vendor-reply.dto';
import { BookingStatus, VendorStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: dto.bookingId,
      },
      include: {
        review: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException(
        'This booking does not belong to you',
      );
    }

    if (
      booking.status !== BookingStatus.CONFIRMED &&
      booking.status !== BookingStatus.ACCEPTED
    ) {
      throw new ForbiddenException(
        'You can only review an accepted or confirmed booking',
      );
    }

    if (booking.review) {
      throw new ForbiddenException(
        'You have already reviewed this booking',
      );
    }

    const vendor = await this.prisma.vendor.findUnique({
      where: {
        id: booking.vendorId,
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (vendor.status !== VendorStatus.APPROVED) {
      throw new ForbiddenException(
        'Vendor is not approved by admin',
      );
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        bookingId: booking.id,
        packageId: booking.packageId,
        vendorId: booking.vendorId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        package: {
          select: {
            title: true,
          },
        },
        vendor: {
          select: {
            businessName: true,
            frontendVendorId: true,
          },
        },
      },
    });

    return {
      id: review.id,
      bookingId: review.bookingId,
      packageId: review.packageId,
      vendorId: review.vendor.frontendVendorId,
      customerId: userId,
      customerName: review.user.name,
      vendorName: review.vendor.businessName,
      packageName: review.package.title,
      rating: review.rating,
      comment: review.comment,
      reply: review.vendorReply,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  private async resolveVendorInternalId(
    vendorId: string,
  ): Promise<string | null> {
    if (!vendorId) {
      return null;
    }

    const numericId = Number(vendorId);
    let vendor:
      | { id: string }
      | null = null;

    if (!Number.isNaN(numericId)) {
      vendor = await this.prisma.vendor.findUnique({
        where: {
          frontendVendorId: numericId,
        },
        select: {
          id: true,
        },
      });
    }

    if (!vendor) {
      vendor = await this.prisma.vendor.findUnique({
        where: {
          id: vendorId,
        },
        select: {
          id: true,
        },
      });
    }

    return vendor?.id ?? null;
  }

  async findAll() {
    const reviews = await this.prisma.review.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
        package: {
          select: {
            title: true,
          },
        },
        vendor: {
          select: {
            businessName: true,
            frontendVendorId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews.map((review) => ({
      id: review.id,
      bookingId: review.bookingId,
      customerId: review.userId,
      vendorId:
        review.vendor.frontendVendorId ?? 0,
      customerName: review.user.name,
      vendorName: review.vendor.businessName,
      packageName: review.package.title,
      rating: review.rating,
      comment: review.comment ?? '',
      reply: review.vendorReply,
      repliedAt: review.vendorReply
        ? review.updatedAt
        : undefined,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));
  }

  async findByVendor(vendorId: string) {
    const internalVendorId =
      await this.resolveVendorInternalId(
        vendorId,
      );

    if (!internalVendorId) {
      return [];
    }

    const reviews = await this.prisma.review.findMany({
      where: {
        vendorId: internalVendorId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        package: {
          select: {
            title: true,
          },
        },
        vendor: {
          select: {
            businessName: true,
            frontendVendorId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews.map((review) => ({
      id: review.id,
      bookingId: review.bookingId,
      customerId: review.userId,
      vendorId:
        review.vendor.frontendVendorId ?? 0,
      customerName: review.user.name,
      vendorName: review.vendor.businessName,
      packageName: review.package.title,
      rating: review.rating,
      comment: review.comment,
      reply: review.vendorReply,
      repliedAt: review.vendorReply
        ? review.updatedAt
        : undefined,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));
  }

  async getVendorAverageRating(vendorId: string) {
    const internalVendorId =
      await this.resolveVendorInternalId(
        vendorId,
      );

    if (!internalVendorId) {
      return {
        averageRating: 0,
        totalReviews: 0,
      };
    }

    const result = await this.prisma.review.aggregate({
      where: {
        vendorId: internalVendorId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      averageRating: result._avg.rating ?? 0,
      totalReviews: result._count.rating,
    };
  }

  async update(
    userId: string,
    reviewId: string,
    dto: UpdateReviewDto,
  ) {
    const review = await this.prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException(
        'You can only edit your own review',
      );
    }

    return this.prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  async remove(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException(
        'You can only delete your own review',
      );
    }

    await this.prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    return {
      message: 'Review deleted successfully',
    };
  }

  async vendorReply(
    vendorUserId: string,
    reviewId: string,
    dto: VendorReplyDto,
  ) {
    const review = await this.prisma.review.findUnique({
      where: {
        id: reviewId,
      },
      include: {
        vendor: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.vendor.userId !== vendorUserId) {
      throw new ForbiddenException(
        'You can only reply to your own reviews',
      );
    }

    return this.prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        vendorReply: dto.reply,
      },
    });
  }
}
