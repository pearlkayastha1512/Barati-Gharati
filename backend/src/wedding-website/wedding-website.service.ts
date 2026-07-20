import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateWeddingWebsiteDto } from './dto/update-wedding-website.dto';


@Injectable()
export class WeddingWebsiteService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private generateSlug(
    brideName: string,
    groomName: string,
  ) {
    return `${groomName}-and-${brideName}`
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');
  }

  // =====================================
  // CREATE WEBSITE
  // =====================================

  // =====================================
// CREATE WEBSITE
// =====================================

async create(userId: string) {
  const existingWebsite =
    await this.prisma.weddingWebsite.findUnique({
      where: {
        userId,
      },
    });

  if (existingWebsite) {
    return {
      success: true,
      message:
        'Wedding website already exists.',
      data: existingWebsite,
    };
  }

  const booking =
    await this.prisma.booking.findFirst({
      where: {
        userId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        vendor: true,
      },
    });

  if (!booking) {
    throw new BadRequestException(
      'Please create a booking first.',
    );
  }

  const brideName =
    booking.brideName?.trim() ||
    'Bride';

  const groomName =
    booking.groomName?.trim() ||
    'Groom';

  let slug = this.generateSlug(
    brideName,
    groomName,
  );

  const slugExists =
    await this.prisma.weddingWebsite.findUnique(
      {
        where: {
          slug,
        },
      },
    );

  if (slugExists) {
    slug = `${slug}-${Date.now()}`;
  }

const website =
  await this.prisma.weddingWebsite.create({
    data: {
      userId,

      bookingId: booking.id,

      slug,

      brideName,

      groomName,

      weddingDate:
        booking.eventDate,

      venueName:
        booking.venue ??
        booking.eventTitle ??
        '',

      venueAddress:
        [
          booking.contactAddress,
          booking.city,
          booking.contactState,
          booking.contactCountry,
        ]
          .filter(Boolean)
          .join(', '),

      template: 'classic',

      heroImage: null,

      coverImage: null,

      story:
        'Every love story is beautiful, but ours is our favorite.',

      galleryImages: [],

      isPublished: false,
    },

    include: {
      booking: true,
      events: true,
      galleries: true,
    },
  });

  return {
    success: true,
    message:
      'Wedding website created successfully.',
    data: website,
  };
}
  // =====================================
  // GET MY WEBSITE
  // =====================================

  async findMine(userId: string) {
    const website =
      await this.prisma.weddingWebsite.findUnique(
        {
          where: {
            userId,
          },

          include: {
            booking: true,
           events: true,
  galleries: true,
          },
        },
      );

    if (!website) {
      throw new NotFoundException(
        'Wedding website not found.',
      );
    }

    return {
      success: true,
      data: website,
    };
  }

  // =====================================
  // GET WEBSITE BY SLUG
  // =====================================

  async findBySlug(slug: string) {
    const website =
      await this.prisma.weddingWebsite.findUnique(
        {
          where: {
            slug,
          },

          include: {
            booking: true,
            events: true,
             galleries: true,
          },
        },
      );

    if (!website) {
      throw new NotFoundException(
        'Wedding website not found.',
      );
    }

    return {
      success: true,
      data: website,
    };
  }

  // =====================================
  // PUBLISH / UNPUBLISH
  // =====================================

async togglePublish(
  userId: string,
) {
  const website =
    await this.prisma.weddingWebsite.findUnique({
      where: {
        userId,
      },
    });

  if (!website) {
    throw new ForbiddenException(
      'You do not have permission to modify this wedding website.',
    );
  }

  const updated =
    await this.prisma.weddingWebsite.update({
      where: {
        id: website.id,
      },

      data: {
        isPublished:
          !website.isPublished,
      },
    });

  return {
    success: true,

    message:
      updated.isPublished
        ? 'Website published successfully.'
        : 'Website unpublished successfully.',

    data: updated,
  };
}

  // =====================================
  // UPDATE WEBSITE
  // =====================================

 async update(
  userId: string,
  dto: UpdateWeddingWebsiteDto,
) {
  const website =
    await this.prisma.weddingWebsite.findUnique({
      where: {
        userId,
      },
    });

  if (!website) {
    throw new ForbiddenException(
      'You do not have permission to update this wedding website.',
    );
  }

  const updated =
    await this.prisma.weddingWebsite.update({
      where: {
        id: website.id,
      },

      data: {
        story: dto.story,
        heroImage: dto.heroImage,
        coverImage: dto.coverImage,
        template: dto.template,
        galleryImages:
          dto.galleryImages,
        venueName:
          dto.venueName,
        venueAddress:
          dto.venueAddress,
      },
    });

  return {
    success: true,

    message:
      'Wedding website updated successfully.',

    data: updated,
  };
}
}