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
import { validateMessage } from './utils/message-filter.util';
import { Role } from '@prisma/client';



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

//   async sendMessage(
//   senderId: string,
//   dto: SendMessageDto,
// ) {
//   const conversation =
//     await this.prisma.conversation.findUnique({
//       where: {
//         id: dto.conversationId,
//       },
//     });

//   if (!conversation) {
//     throw new ForbiddenException(
//       'Conversation not found',
//     );
//   }

//   const newMessage =
//   await this.prisma.message.create({
//     data: {
//       conversationId: dto.conversationId,
//       senderId,
//       receiverId: dto.receiverId,
//       message: dto.message,
//     },
//   });

//   const sender = await this.prisma.user.findUnique({
//     where: {
//       id: senderId,
//     },
//     select: {
//       name: true,
//     },
//   });

//   await this.notificationsService.create(dto.receiverId, {
//     title: 'New Message',
//     message: `${sender?.name ?? 'Someone'} sent you a message.`,
//   });

// this.chatGateway.sendMessageToConversation(
//   dto.conversationId,
//   newMessage,
// );

// return newMessage;
// }





// async sendMessage(
//   senderId: string,
//   dto: SendMessageDto,
// ) {
//   // Load sender
//   const sender = await this.prisma.user.findUnique({
//     where: {
//       id: senderId,
//     },
//     select: {
//       id: true,
//       name: true,
//       warningCount: true,
//       chatMutedUntil: true,
//       isChatFlagged: true,
//     },
//   });

//   if (!sender) {
//     throw new ForbiddenException(
//       'User not found.',
//     );
//   }

//   // Block flagged accounts
//   if (sender.isChatFlagged) {
//     throw new ForbiddenException(
//       'Your account has been flagged by the administrator due to repeated policy violations.',
//     );
//   }

//   // Check temporary mute
//   if (
//     sender.chatMutedUntil &&
//     sender.chatMutedUntil > new Date()
//   ) {
//     throw new ForbiddenException(
//       'Your chat has been temporarily disabled for 30 minutes due to repeated policy violations.',
//     );
//   }

//   const conversation =
//     await this.prisma.conversation.findUnique({
//       where: {
//         id: dto.conversationId,
//       },
//       include: {
//         vendor: {
//           select: {
//             userId: true,
//           },
//         },
//       },
//     });

//   if (!conversation) {
//     throw new ForbiddenException(
//       'Conversation not found.',
//     );
//   }

//   const isCustomer =
//     conversation.customerId === senderId;

//   const isVendor =
//     conversation.vendor.userId === senderId;

//   if (!isCustomer && !isVendor) {
//     throw new ForbiddenException(
//       'You are not allowed to send messages in this conversation.',
//     );
//   }

//   const cleanMessage = dto.message.trim();

//   try {
    
//     validateMessage(cleanMessage);
//   } catch (error) {
//     const warnings = sender.warningCount + 1;

//     // First violation
//     if (warnings === 1) {
//       await this.prisma.user.update({
//         where: {
//           id: senderId,
//         },
//         data: {
//           warningCount: 1,
//         },
//       });

//       throw new ForbiddenException(
//         'Warning: Sharing personal contact information is not allowed. A second violation will disable your chat for 30 minutes.',
//       );
//     }

//     // Second violation
//     if (warnings === 2) {
//       const muteUntil = new Date(
//         Date.now() + 30 * 60 * 1000,
//       );

//       await this.prisma.user.update({
//         where: {
//           id: senderId,
//         },
//         data: {
//           warningCount: 2,
//           chatMutedUntil: muteUntil,
//         },
//       });

//       throw new ForbiddenException(
//         'Your chat has been disabled for 30 minutes due to repeated attempts to share personal contact information.',
//       );
//     }

// // Third violation
// await this.prisma.user.update({
//   where: {
//     id: senderId,
//   },
//   data: {
//     warningCount: warnings,
//     isChatFlagged: true,
//   },
// });

// // Get all admins
// const admins = await this.prisma.user.findMany({
//   where: {
//     role: Role.ADMIN,
//   },
//   select: {
//     id: true,
//   },
// });

// // Notify every admin
// await Promise.all(
//   admins.map((admin) =>
//     this.notificationsService.create(admin.id, {
//       title: 'Chat Policy Violation',
//       message: `${sender.name} has been flagged for repeated attempts to share contact information.`,
//     }),
//   ),
// );

// throw new ForbiddenException(
//   'Your account has been flagged for administrator review due to repeated policy violations.',
// );

    
//   }

//   const newMessage =
//     await this.prisma.message.create({
//       data: {
//         conversationId: dto.conversationId,
//         senderId,
//         receiverId: dto.receiverId,
//         message: cleanMessage,
//       },
//     });

//   await this.notificationsService.create(
//     dto.receiverId,
//     {
//       title: 'New Message',
//       message: `${
//         sender.name ?? 'Someone'
//       } sent you a message.`,
//     },
//   );

//   this.chatGateway.sendMessageToConversation(
//     dto.conversationId,
//     newMessage,
//   );

//   return newMessage;
// }

async sendMessage(
  senderId: string,
  dto: SendMessageDto,
) {
  const sender = await this.prisma.user.findUnique({
    where: {
      id: senderId,
    },
    select: {
      id: true,
      name: true,
      warningCount: true,
      chatMutedUntil: true,
      isChatFlagged: true,
    },
  });

  if (!sender) {
    throw new ForbiddenException(
      'User not found.',
    );
  }

  // Block flagged users
  if (sender.isChatFlagged) {
    throw new ForbiddenException(
      'Your account has been flagged for administrator review due to repeated policy violations.',
    );
  }

  // Block muted users
  if (
    sender.chatMutedUntil &&
    sender.chatMutedUntil > new Date()
  ) {
    throw new ForbiddenException(
      'Your chat has been temporarily disabled for 30 minutes due to repeated policy violations.',
    );
  }

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
      'Conversation not found.',
    );
  }

  const isCustomer =
    conversation.customerId === senderId;

  const isVendor =
    conversation.vendor.userId === senderId;

  if (!isCustomer && !isVendor) {
    throw new ForbiddenException(
      'You are not allowed to send messages in this conversation.',
    );
  }

  const cleanMessage = dto.message.trim();

  try {
    validateMessage(cleanMessage);
  } catch (error) {
    const warnings = sender.warningCount + 1;

    // First violation
    if (warnings === 1) {
      await this.prisma.user.update({
        where: {
          id: senderId,
        },
        data: {
          warningCount: warnings,
        },
      });

      throw new ForbiddenException(
        '⚠️ Warning: Sharing personal contact information is not allowed. A second violation will disable your chat for 30 minutes.',
      );
    }

    // Second violation
    if (warnings === 2) {
      const muteUntil = new Date(
        Date.now() + 30 * 60 * 1000,
      );

      await this.prisma.user.update({
        where: {
          id: senderId,
        },
        data: {
          warningCount: warnings,
          chatMutedUntil: muteUntil,
        },
      });

      throw new ForbiddenException(
        '🚫 Your chat has been disabled for 30 minutes due to repeated attempts to share personal contact information.',
      );
    }

    // Third violation
    await this.prisma.user.update({
      where: {
        id: senderId,
      },
      data: {
        warningCount: warnings,
        isChatFlagged: true,
      },
    });

    // Notify all admins
    const admins = await this.prisma.user.findMany({
      where: {
        role: Role.ADMIN,
      },
      select: {
        id: true,
      },
    });

    await Promise.all(
      admins.map((admin) =>
        this.notificationsService.create(admin.id, {
          title: 'Chat Policy Violation',
          message: `${sender.name} has been flagged for repeated attempts to share contact information.`,
        }),
      ),
    );

    throw new ForbiddenException(
      '🚩 Your account has been flagged for administrator review due to repeated policy violations.',
    );
  }

  const newMessage =
    await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId,
        receiverId: dto.receiverId,
        message: cleanMessage,
      },
    });

  await this.notificationsService.create(
    dto.receiverId,
    {
      title: 'New Message',
      message: `${sender.name ?? 'Someone'} sent you a message.`,
    },
  );

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
