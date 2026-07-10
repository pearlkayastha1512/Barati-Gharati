import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatGateway } from "./chat.gateway";


@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatGateway: ChatGateway,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createConversation(
    customerId: string,
    dto: CreateConversationDto,
  ) {
    const vendor = await this.prisma.vendor.findUnique({
      where: {
        id: dto.vendorId,
      },
    });

    if (!vendor) {
      throw new ForbiddenException(
        'Vendor not found',
      );
    }

    const approvedBooking =
      await this.prisma.booking.findFirst({
        where: {
          userId: customerId,
          vendorId: dto.vendorId,
          adminApproved: true,
        },
      });

    if (!approvedBooking) {
      throw new ForbiddenException(
        'Conversation unlocks after advance payment and admin approval',
      );
    }

    const existing =
      await this.prisma.conversation.findFirst({
        where: {
          customerId,
          vendorId: dto.vendorId,
        },
      });

    if (existing) {
      return existing;
    }

    return this.prisma.conversation.create({
      data: {
        customerId,
        vendorId: dto.vendorId,
      },
    });
  }

  async sendMessage(
  senderId: string,
  dto: SendMessageDto,
) {
  const conversation =
    await this.prisma.conversation.findUnique({
      where: {
        id: dto.conversationId,
      },
      include: {
        vendor: {
          select: {
            userId: true,
          },
        },
      },
    });

  if (!conversation) {
    throw new ForbiddenException(
      'Conversation not found',
    );
  }

  const isCustomer =
    senderId === conversation.customerId;
  const isVendor =
    senderId === conversation.vendor.userId;

  if (!isCustomer && !isVendor) {
    throw new ForbiddenException(
      'You are not part of this conversation',
    );
  }

  const expectedReceiverId = isCustomer
    ? conversation.vendor.userId
    : conversation.customerId;

  if (dto.receiverId !== expectedReceiverId) {
    throw new ForbiddenException(
      'Invalid message recipient',
    );
  }

  const approvedBooking =
    await this.prisma.booking.findFirst({
      where: {
        userId: conversation.customerId,
        vendorId: conversation.vendorId,
        adminApproved: true,
      },
    });

  if (!approvedBooking) {
    throw new ForbiddenException(
      'This conversation is not approved',
    );
  }

  const newMessage =
  await this.prisma.message.create({
    data: {
      conversationId: dto.conversationId,
      senderId,
      receiverId: dto.receiverId,
      message: dto.message,
    },
  });

  const sender = await this.prisma.user.findUnique({
    where: {
      id: senderId,
    },
    select: {
      name: true,
    },
  });

  await this.notificationsService.create(dto.receiverId, {
    title: 'New Message',
    message: `${sender?.name ?? 'Someone'} sent you a message.`,
  });

this.chatGateway.sendMessageToConversation(
  dto.conversationId,
  newMessage,
);

return newMessage;
}
async getConversations(userId: string) {
  const customerBookings = await this.prisma.booking.findMany({
    where: {
      userId,
      adminApproved: true,
    },
    select: {
      vendorId: true,
    },
  });

  const vendor = await this.prisma.vendor.findUnique({
    where: { userId },
    select: { id: true },
  });

  const vendorBookings = vendor
    ? await this.prisma.booking.findMany({
        where: {
          vendorId: vendor.id,
          adminApproved: true,
        },
        select: {
          userId: true,
        },
      })
    : [];

  const approvedVendorIds = customerBookings.map(
    (booking) => booking.vendorId,
  );
  const approvedCustomerIds = vendorBookings.map(
    (booking) => booking.userId,
  );

  return this.prisma.conversation.findMany({
    where: {
      OR: [
        {
          customerId: userId,
          vendorId: {
            in: approvedVendorIds,
          },
        },
        ...(vendor
          ? [{
          vendor: {
            id: vendor.id,
          },
          customerId: {
            in: approvedCustomerIds,
          },
        }]
          : []),
      ],
    },

    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },

      vendor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },

      messages: {
        orderBy: {
          createdAt: 'desc',
        },

        take: 1,
      },
    },

    orderBy: {
      updatedAt: 'desc',
    },
  });
}

async getMessages(
  conversationId: string,
  userId: string,
) {
  const conversation =
    await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        vendor: {
          select: { userId: true },
        },
      },
    });

  if (
    !conversation ||
    (
      conversation.customerId !== userId &&
      conversation.vendor.userId !== userId
    )
  ) {
    throw new ForbiddenException(
      'You are not part of this conversation',
    );
  }

  const approvedBooking =
    await this.prisma.booking.findFirst({
      where: {
        userId: conversation.customerId,
        vendorId: conversation.vendorId,
        adminApproved: true,
      },
    });

  if (!approvedBooking) {
    throw new ForbiddenException(
      'This conversation is not approved',
    );
  }

  return this.prisma.message.findMany({
    where: {
      conversationId,
    },

    orderBy: {
      createdAt: "asc",
    },
  });
}
}
