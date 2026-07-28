import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { PushService } from './push.service';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationStatusDto } from './dto/update-notification-status.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pushService: PushService,
  ) {}

  // CREATE
  async create(
    userId: string,
    dto: CreateNotificationDto,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title: dto.title,
        message: dto.message,
      },
    });

    // fire push notification (fail-safe, DB creation ko block nahi karta)
    await this.pushService.sendPushToUser(
      userId,
      dto.title,
      dto.message,
      { notificationId: notification.id },
    );

    return {
      success: true,
      message: 'Notification created successfully',
      data: notification,
    };
  }

  // GET ALL
  async findAll(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      count: notifications.length,
      data: notifications,
    };
  }

  // GET ONE
  async findOne(
    id: string,
    userId: string,
  ) {
    const notification =
      await this.prisma.notification.findUnique({
        where: {
          id,
        },
      });

    if (!notification) {
      throw new NotFoundException(
        'Notification not found',
      );
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException(
        'Access denied',
      );
    }

    return {
      success: true,
      data: notification,
    };
  }

  // MARK READ / UNREAD
  async updateStatus(
    id: string,
    userId: string,
    dto: UpdateNotificationStatusDto,
  ) {
    await this.findOne(id, userId);

    const notification =
      await this.prisma.notification.update({
        where: {
          id,
        },
        data: {
          isRead: dto.isRead,
        },
      });

    return {
      success: true,
      message: 'Notification updated successfully',
      data: notification,
    };
  }

  // DELETE
  async remove(
    id: string,
    userId: string,
  ) {
    await this.findOne(id, userId);

    await this.prisma.notification.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: 'Notification deleted successfully',
    };
  }
}