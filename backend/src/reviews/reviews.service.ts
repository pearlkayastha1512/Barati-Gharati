import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { VendorReplyDto } from './dto/vendor-reply.dto';
import { BookingStatus } from '@prisma/client';
import { VendorStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { review: true },
    });
    
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId)
      throw new ForbiddenException('This booking does not belong to you');
    if (booking.status !== BookingStatus.CONFIRMED)
      throw new ForbiddenException(
        'You can only review a confirmed/completed booking',
      );
    if (booking.review)
      throw new ForbiddenException('You have already reviewed this booking');
    const vendor = await this.prisma.vendor.findUnique({
    where: {
      id: booking.vendorId,
    },
  });

  if (!vendor)
    throw new NotFoundException(
      'Vendor not found',
    );

  if (vendor.status !== VendorStatus.APPROVED)
    throw new ForbiddenException(
      'Vendor is not approved by admin',
    );

    return this.prisma.review.create({
      data: {
        userId,
        bookingId: booking.id,
        packageId: booking.packageId,
        vendorId: booking.vendorId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: { select: { name: true } },
        package: { select: { title: true } },
      },
    });
  }

  async findByVendor(vendorId: string) {
    return this.prisma.review.findMany({
      where: { vendorId },
      include: {
        user: { select: { name: true } },
        package: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVendorAverageRating(vendorId: string) {
    const result = await this.prisma.review.aggregate({
      where: { vendorId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      averageRating: result._avg.rating ?? 0,
      totalReviews: result._count.rating,
    };
  }

  async update(userId: string, reviewId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId)
      throw new ForbiddenException('You can only edit your own review');

    return this.prisma.review.update({
      where: { id: reviewId },
      data: { rating: dto.rating, comment: dto.comment },
    });
  }

  async remove(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId)
      throw new ForbiddenException('You can only delete your own review');

    await this.prisma.review.delete({ where: { id: reviewId } });
    return { message: 'Review deleted successfully' };
  }

  async vendorReply(vendorUserId: string, reviewId: string, dto: VendorReplyDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { vendor: true },
    });

    if (!review) throw new NotFoundException('Review not found');
    if (review.vendor.userId !== vendorUserId)
      throw new ForbiddenException('You can only reply to your own reviews');

    return this.prisma.review.update({
      where: { id: reviewId },
      data: { vendorReply: dto.reply },
    });
  }
}
