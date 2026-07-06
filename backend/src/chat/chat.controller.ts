import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';


@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  @Post('conversation')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createConversation(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateConversationDto,
  ) {
    return this.chatService.createConversation(
      user.sub,
      dto,
    );
  }


  @Post('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
sendMessage(
  @CurrentUser() user: { sub: string },
  @Body() dto: SendMessageDto,
) {
  return this.chatService.sendMessage(
    user.sub,
    dto,
  );
}
@Get("conversations")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
getConversations(
  @CurrentUser() user: { sub: string },
) {
  return this.chatService.getConversations(
    user.sub,
  );
}

@Get("conversations/:conversationId/messages")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
getMessages(
  @Param("conversationId")
  conversationId: string,
) {
  return this.chatService.getMessages(
    conversationId,
  );
}
}