import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatGateway } from "./chat.gateway";


@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatGateway: ChatGateway,
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
    });

  if (!conversation) {
    throw new ForbiddenException(
      'Conversation not found',
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
      status: {
        in: [BookingStatus.ACCEPTED, BookingStatus.CONFIRMED],
      },
    },
    select: {
      vendorId: true,
    },
  });

  if (customerBookings.length > 0) {
    const bookedVendorIds = customerBookings.map(
      (booking) => booking.vendorId,
    );

    const existingConversations =
      await this.prisma.conversation.findMany({
        where: {
          customerId: userId,
          vendorId: {
            in: bookedVendorIds,
          },
        },
        select: {
          vendorId: true,
        },
      });

    const existingVendorIds = existingConversations.map(
      (conversation) => conversation.vendorId,
    );

    const missingVendorIds = bookedVendorIds.filter(
      (vendorId) => !existingVendorIds.includes(vendorId),
    );

    if (missingVendorIds.length > 0) {
      await this.prisma.conversation.createMany({
        data: missingVendorIds.map((vendorId) => ({
          customerId: userId,
          vendorId,
        })),
        skipDuplicates: true,
      });
    }
  }

  return this.prisma.conversation.findMany({
    where: {
      OR: [
        {
          customerId: userId,
        },
        {
          vendor: {
            userId,
          },
        },
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
) {
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