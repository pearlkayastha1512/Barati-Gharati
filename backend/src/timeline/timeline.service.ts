import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { UpdateTimelineStatusDto } from './dto/update-timeline-status.dto';

@Injectable()
export class TimelineService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================
  // CREATE
  // ==========================

  async create(
    userId: string,
    dto: CreateTimelineDto,
  ) {
    const task = await this.prisma.timeline.create({
      data: {
        userId,
        title: dto.title,
        date: new Date(dto.date),
        description: dto.description,
        priority: dto.priority,
      },
    });

    return {
      success: true,
      message: 'Timeline task created successfully',
      data: task,
    };
  }

  // ==========================
  // GET ALL
  // ==========================

  async findAll(userId: string) {
    const tasks = await this.prisma.timeline.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: 'asc',
      },
    });

    return {
      success: true,
      count: tasks.length,
      data: tasks,
    };
  }

  // ==========================
  // GET ONE
  // ==========================

  async findOne(
    id: string,
    userId: string,
  ) {
    const task = await this.prisma.timeline.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      throw new NotFoundException(
        'Timeline task not found',
      );
    }

    if (task.userId !== userId) {
      throw new ForbiddenException(
        'Access denied',
      );
    }

    return {
      success: true,
      data: task,
    };
  }

  // ==========================
  // UPDATE
  // ==========================

  async update(
    id: string,
    userId: string,
    dto: UpdateTimelineDto,
  ) {

    await this.findOne(id, userId);

    const updatedTask =
      await this.prisma.timeline.update({
        where: {
          id,
        },
        data: {
  ...(dto.title && {
    title: dto.title,
  }),

  ...(dto.description !==
    undefined && {
    description: dto.description,
  }),

  ...(dto.priority && {
    priority: dto.priority,
  }),

  ...(dto.date && {
    date: new Date(dto.date),
  }),
},
      });

    return {
      success: true,
      message: 'Timeline updated successfully',
      data: updatedTask,
    };
  }

  // ==========================
  // UPDATE STATUS
  // ==========================

  async updateStatus(
    id: string,
    userId: string,
    dto: UpdateTimelineStatusDto,
  ) {

    await this.findOne(id, userId);

    const updatedTask =
      await this.prisma.timeline.update({
        where: {
          id,
        },
        data: {
          status: dto.status,
        },
      });

    return {
      success: true,
      message: 'Timeline status updated successfully',
      data: updatedTask,
    };
  }

  // ==========================
  // DELETE
  // ==========================

  async remove(
    id: string,
    userId: string,
  ) {

    await this.findOne(id, userId);

    await this.prisma.timeline.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: 'Timeline deleted successfully',
    };
  }
}