// import {
//   ForbiddenException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { CreateReviewDto } from './dto/create-review.dto';
// import { UpdateReviewDto } from './dto/update-review.dto';
// import { VendorReplyDto } from './dto/vendor-reply.dto';
// import { BookingStatus } from '@prisma/client';
// import { VendorStatus } from '@prisma/client';

// @Injectable()
// export class ReviewsService {
//   constructor(private prisma: PrismaService) {}

//   // async create(userId: string, dto: CreateReviewDto) {
//   //   const booking = await this.prisma.booking.findUnique({
//   //     where: { id: dto.bookingId },
//   //     include: { review: true },
//   //   });
    
//   //   if (!booking) throw new NotFoundException('Booking not found');
//   //   if (booking.userId !== userId)
//   //     throw new ForbiddenException('This booking does not belong to you');
//   //   if (booking.status !== BookingStatus.CONFIRMED)
//   //     throw new ForbiddenException(
//   //       'You can only review a confirmed/completed booking',
//   //     );
//   //   if (booking.review)
//   //     throw new ForbiddenException('You have already reviewed this booking');
//   //   const vendor = await this.prisma.vendor.findUnique({
//   //   where: {
//   //     id: booking.vendorId,
//   //   },
//   // });

//   async create(userId: string, dto: CreateReviewDto) {
//   const vendor = await this.prisma.vendor.findFirst({
//     where: {
//       frontendVendorId: dto.vendorId,
//       status: VendorStatus.APPROVED,
//     },
//   });

//   if (!vendor) {
//     throw new NotFoundException("Vendor not found");
//   }

//   // Prevent duplicate reviews by the same customer for this vendor
//   const existingReview = await this.prisma.review.findFirst({
//     where: {
//       userId,
//       vendorId: vendor.id,
//     },
//   });

//   if (existingReview) {
//     throw new ForbiddenException(
//       "You have already reviewed this vendor",
//     );
//   }

//   const review = await this.prisma.review.create({
//     data: {
//       userId,

//       vendorId: vendor.id,

//       rating: dto.rating,

//       comment: dto.comment,

//       // bookingId/packageId are intentionally omitted
//     },

//     include: {
//       user: {
//         select: {
//           name: true,
//         },
//       },

//       vendor: {
//         select: {
//           businessName: true,
//           frontendVendorId: true,
//         },
//       },
//     },
//   });

//   return {
//     id: review.id,

//     vendorId: review.vendor.frontendVendorId,

//     customerId: userId,

//     customerName: review.user.name,

//     vendorName: review.vendor.businessName,

//     rating: review.rating,

//     comment: review.comment,

//     reply: review.vendorReply,

//     createdAt: review.createdAt,

//     updatedAt: review.updatedAt,
//   };
// }

//   if (!vendor)
//     throw new NotFoundException(
//       'Vendor not found',
//     );

//   if (vendor.status !== VendorStatus.APPROVED)
//     throw new ForbiddenException(
//       'Vendor is not approved by admin',
//     );

//     return this.prisma.review.create({
//       data: {
//         userId,
//         bookingId: booking.id,
//         packageId: booking.packageId,
//         vendorId: booking.vendorId,
//         rating: dto.rating,
//         comment: dto.comment,
//       },
//       include: {
//         user: { select: { name: true } },
//         package: { select: { title: true } },
//       },
//     });
//   }

//   async findByVendor(vendorId: string) {
//     return this.prisma.review.findMany({
//       where: { vendorId },
//       include: {
//         user: { select: { name: true } },
//         package: { select: { title: true } },
//       },
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   async getVendorAverageRating(vendorId: string) {
//     const result = await this.prisma.review.aggregate({
//       where: { vendorId },
//       _avg: { rating: true },
//       _count: { rating: true },
//     });

//     return {
//       averageRating: result._avg.rating ?? 0,
//       totalReviews: result._count.rating,
//     };
//   }

//   async update(userId: string, reviewId: string, dto: UpdateReviewDto) {
//     const review = await this.prisma.review.findUnique({
//       where: { id: reviewId },
//     });

//     if (!review) throw new NotFoundException('Review not found');
//     if (review.userId !== userId)
//       throw new ForbiddenException('You can only edit your own review');

//     return this.prisma.review.update({
//       where: { id: reviewId },
//       data: { rating: dto.rating, comment: dto.comment },
//     });
//   }

//   async remove(userId: string, reviewId: string) {
//     const review = await this.prisma.review.findUnique({
//       where: { id: reviewId },
//     });

//     if (!review) throw new NotFoundException('Review not found');
//     if (review.userId !== userId)
//       throw new ForbiddenException('You can only delete your own review');

//     await this.prisma.review.delete({ where: { id: reviewId } });
//     return { message: 'Review deleted successfully' };
//   }

//   async vendorReply(vendorUserId: string, reviewId: string, dto: VendorReplyDto) {
//     const review = await this.prisma.review.findUnique({
//       where: { id: reviewId },
//       include: { vendor: true },
//     });

//     if (!review) throw new NotFoundException('Review not found');
//     if (review.vendor.userId !== vendorUserId)
//       throw new ForbiddenException('You can only reply to your own reviews');

//     return this.prisma.review.update({
//       where: { id: reviewId },
//       data: { vendorReply: dto.reply },
//     });
//   }









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
  //added this
  private mapReview(review: any) {
  return {
    id: review.id,
    bookingId: review.bookingId,

    customerId: review.userId,

    vendorId: review.vendor.frontendVendorId ?? 0,

    customerName: review.user?.name ?? "",

    customerImage: null,

    vendorName: review.vendor?.businessName ?? "",

    rating: review.rating,

    comment: review.comment ?? "",

    reply: review.vendorReply ?? undefined,

    repliedAt: review.vendorReply
      ? review.updatedAt
      : undefined,

    createdAt: review.createdAt,

    updatedAt: review.updatedAt,
  };
}
//added this
async findByCustomer(customerId: string) {
  const reviews = await this.prisma.review.findMany({
    where: {
      userId: customerId,
    },
    include: {
      user: {
        select: {
          name: true,
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

  return reviews.map((review) =>
    this.mapReview(review),
  );
}

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

<<<<<<< Updated upstream
    const review = await this.prisma.review.create({
      data: {
        userId,
        bookingId: booking.id,
        packageId: booking.packageId,
        vendorId: booking.vendorId,
        rating: dto.rating,
        comment: dto.comment,
=======
    
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
    vendor: {
      select: {
        businessName: true,
        frontendVendorId: true,
      },
    },
  },
});

return this.mapReview(review);
  }

  async findByVendor(frontendVendorId: string) {
  const vendor = await this.prisma.vendor.findUnique({
    where: {
      frontendVendorId: Number(frontendVendorId),
    },
  });

  if (!vendor) {
    throw new NotFoundException(
      'Vendor not found',
    );
  }

  const reviews =
    await this.prisma.review.findMany({
      where: {
        vendorId: vendor.id,
>>>>>>> Stashed changes
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
<<<<<<< Updated upstream
        package: {
          select: {
            title: true,
          },
        },
=======
>>>>>>> Stashed changes
        vendor: {
          select: {
            businessName: true,
            frontendVendorId: true,
          },
        },
<<<<<<< Updated upstream
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
=======
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

  return reviews.map((review) =>
    this.mapReview(review),
  );
}
  async getVendorAverageRating(
  frontendVendorId: string,
) {
  const vendor =
    await this.prisma.vendor.findUnique({
      where: {
        frontendVendorId: Number(
          frontendVendorId,
        ),
      },
>>>>>>> Stashed changes
    });

  if (!vendor) {
    throw new NotFoundException(
      'Vendor not found',
    );
  }

<<<<<<< Updated upstream
  async update(
    userId: string,
    reviewId: string,
    dto: UpdateReviewDto,
  ) {
=======
  const result =
    await this.prisma.review.aggregate({
      where: {
        vendorId: vendor.id,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

  return {
    averageRating:
      result._avg.rating ?? 0,
    totalReviews:
      result._count.rating,
  };
}

  async update(userId: string, reviewId: string, dto: UpdateReviewDto) {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    return this.prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        rating: dto.rating,
        comment: dto.comment,
      },
    });
=======
    const updatedReview =
  await this.prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: dto.rating,
      comment: dto.comment,
    },
    include: {
      user: {
        select: {
          name: true,
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

return this.mapReview(updatedReview);
>>>>>>> Stashed changes
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
  //added this to make backend compatible
  async findAll() {
  const reviews = await this.prisma.review.findMany({
    include: {
      user: {
        select: {
          name: true,
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

  return reviews.map((review) =>
    this.mapReview(review),
  );
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

<<<<<<< Updated upstream
    return this.prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        vendorReply: dto.reply,
      },
    });
=======
    const updatedReview =
  await this.prisma.review.update({
    where: { id: reviewId },
    data: {
      vendorReply: dto.reply,
    },
    include: {
      user: {
        select: {
          name: true,
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

return this.mapReview(updatedReview);
>>>>>>> Stashed changes
  }
}