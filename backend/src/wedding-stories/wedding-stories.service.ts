








import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateWeddingStoryDto } from './dto/create-wedding-story.dto';
import { UpdateWeddingStoryDto } from './dto/update-wedding-story.dto';

@Injectable()
export class WeddingStoriesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Common include used across all APIs
   */
  private readonly storyInclude = {
    galleryImages: {
      orderBy: {
        sortOrder: 'asc' as const,
      },
    },

    timeline: {
      orderBy: {
        sortOrder: 'asc' as const,
      },
    },

    createdBy: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  };

  /**
   * ===========================================
   * CREATE STORY
   * ===========================================
   */

  async create(
    userId: string,
    dto: CreateWeddingStoryDto,
  ) {
    const existing =
      await this.prisma.weddingStory.findUnique({
        where: {
          slug: dto.slug,
        },
      });

    if (existing) {
      throw new BadRequestException(
        'Story slug already exists.',
      );
    }

    const story =
      await this.prisma.$transaction(
        async (tx) => {
          const created =
            await tx.weddingStory.create({
              data: {
                title: dto.title,
                slug: dto.slug,

                location: dto.location,

                coverImage:
                  dto.coverImage,

                story: dto.story,

                guests: dto.guests,

                vendors: dto.vendors,

                celebrationDays:
                  dto.celebrationDays,

                budget: dto.budget,

                venue: dto.venue,

                photographer:
                  dto.photographer,

                decor: dto.decor,

                featured:
                  dto.featured ??
                  false,

                published:
                  dto.published ??
                  true,

                createdById:
                  userId,
              },
            });
            

          if (
            dto.galleryImages &&
            dto.galleryImages.length
          ) {
            await tx.weddingStoryImage.createMany({
  data: dto.galleryImages.map((item) => ({
    image: item.image,
    sortOrder: item.sortOrder,
    storyId: created.id,
  })),
});
          }

          if (
            dto.timeline &&
            dto.timeline.length
          ) {
            await tx.weddingStoryTimeline.createMany(
              {
                data:
                  dto.timeline.map(
                    (
                      item,
                      index,
                    ) => ({
                      title:
                        item.title,

                      description:
                        item.description,

                      sortOrder: item.sortOrder,

                      storyId:
                        created.id,
                    }),
                  ),
              },
            );
          }

          return tx.weddingStory.findUnique(
            {
              where: {
                id: created.id,
              },

              include:
                this.storyInclude,
            },
          );
        },
      );

      

    return {
      success: true,

      message:
        'Wedding story created successfully.',

      data: story,
    };
  }

  // Remaining methods will be added below







    /**
   * ===========================================
   * GET ALL STORIES (ADMIN)
   * ===========================================
   */

  async findAll() {
    const stories =
      await this.prisma.weddingStory.findMany({
        include: this.storyInclude,

        orderBy: {
          createdAt: 'desc',
        },
      });

    return {
      success: true,
      data: stories,
    };
  }

  /**
   * ===========================================
   * GET STORY BY ID (ADMIN EDIT)
   * ===========================================
   */

  async findOne(id: string) {
    const story =
      await this.prisma.weddingStory.findUnique({
        where: {
          id,
        },

        include: this.storyInclude,
      });

    if (!story) {
      throw new NotFoundException(
        'Wedding story not found.',
      );
    }

    return {
      success: true,
      data: story,
    };
  }






  /**
 * ===========================================
 * UPDATE STORY
 * ===========================================
 */

async update(
  id: string,
  dto: UpdateWeddingStoryDto,
) {
  const existing =
    await this.prisma.weddingStory.findUnique({
      where: {
        id,
      },
    });

  if (!existing) {
    throw new NotFoundException(
      'Wedding story not found.',
    );
  }

  const duplicateSlug =
    dto.slug &&
    dto.slug !== existing.slug
      ? await this.prisma.weddingStory.findUnique({
          where: {
            slug: dto.slug,
          },
        })
      : null;

  if (duplicateSlug) {
    throw new BadRequestException(
      'Story slug already exists.',
    );
  }

  const story =
    await this.prisma.$transaction(
      async (tx) => {
        await tx.weddingStory.update({
          where: {
            id,
          },

          data: {
            title: dto.title,

            slug: dto.slug,

            location: dto.location,

            coverImage:
              dto.coverImage,

            story: dto.story,

            guests: dto.guests,

            vendors: dto.vendors,

            celebrationDays:
              dto.celebrationDays,

            budget: dto.budget,

            venue: dto.venue,

            photographer:
              dto.photographer,

            decor: dto.decor,

            featured:
              dto.featured,

            published:
              dto.published,
          },
        });

        /**
         * Replace Gallery
         */
        

        if (dto.galleryImages) {
          await tx.weddingStoryImage.deleteMany({
            where: {
              storyId: id,
            },
          });

          if (dto.galleryImages.length) {
           await tx.weddingStoryImage.createMany({
  data: dto.galleryImages.map((item) => ({
    image: item.image,
    sortOrder: item.sortOrder,
    storyId: id,
  })),
});
          }
        }

        /**
         * Replace Timeline
         */

        if (dto.timeline) {
          await tx.weddingStoryTimeline.deleteMany({
            where: {
              storyId: id,
            },
          });

          if (dto.timeline.length) {
            await tx.weddingStoryTimeline.createMany({
              data:
                dto.timeline.map(
                  (
                    item,
                    index,
                  ) => ({
                    title:
                      item.title,

                    description:
                      item.description,

                   sortOrder: item.sortOrder,

                    storyId: id,
                  }),
                ),
            });
          }
        }

        return tx.weddingStory.findUnique({
          where: {
            id,
          },

          include:
            this.storyInclude,
        });
      },
    );

  return {
    success: true,

    message:
      'Wedding story updated successfully.',

    data: story,
  };
}





/**
 * ===========================================
 * DELETE STORY
 * ===========================================
 */

async remove(id: string) {
  const story =
    await this.prisma.weddingStory.findUnique({
      where: {
        id,
      },
    });

  if (!story) {
    throw new NotFoundException(
      'Wedding story not found.',
    );
  }

  await this.prisma.weddingStory.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
    message:
      'Wedding story deleted successfully.',
  };
}

/**
 * ===========================================
 * TOGGLE FEATURED
 * ===========================================
 */

async toggleFeatured(id: string) {
  const story =
    await this.prisma.weddingStory.findUnique({
      where: {
        id,
      },
    });

  if (!story) {
    throw new NotFoundException(
      'Wedding story not found.',
    );
  }

  const updated =
    await this.prisma.weddingStory.update({
      where: {
        id,
      },

      data: {
        featured: !story.featured,
      },

      include: this.storyInclude,
    });

  return {
    success: true,

    message: updated.featured
      ? 'Story marked as featured.'
      : 'Story removed from featured.',

    data: updated,
  };
}

/**
 * ===========================================
 * TOGGLE PUBLISHED
 * ===========================================
 */

async togglePublished(id: string) {
  const story =
    await this.prisma.weddingStory.findUnique({
      where: {
        id,
      },
    });

  if (!story) {
    throw new NotFoundException(
      'Wedding story not found.',
    );
  }

  const updated =
    await this.prisma.weddingStory.update({
      where: {
        id,
      },

      data: {
        published: !story.published,
      },

      include: this.storyInclude,
    });

  return {
    success: true,

    message: updated.published
      ? 'Story published successfully.'
      : 'Story unpublished successfully.',

    data: updated,
  };
}

/**
 * ===========================================
 * PUBLIC HOME STORIES
 * ===========================================
 */

async findHome() {
  const stories =
    await this.prisma.weddingStory.findMany({
      where: {
        published: true,
      },

      include: {
        galleryImages: {
          take: 4,
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },

      orderBy: [
        {
          featured: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

  return {
    success: true,
    data: stories,
  };
}

/**
 * ===========================================
 * PUBLIC STORY BY SLUG
 * ===========================================
 */

async findBySlug(slug: string) {
  const story =
    await this.prisma.weddingStory.findFirst({
      where: {
        slug,
        published: true,
      },

      include: this.storyInclude,
    });

  if (!story) {
    throw new NotFoundException(
      'Wedding story not found.',
    );
  }

  return {
    success: true,
    data: story,
  };
}
}