import {
  Controller, Post, Get, Body, UseGuards,
  UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ChatbotService } from './chatbot.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Chatbot')
@UseGuards(JwtAuthGuard)
@Controller('chatbot')
@ApiBearerAuth()
export class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

 @Post('message')
sendMessage(
  @CurrentUser('sub') userId: string,
  @CurrentUser('role') role: string,
  @Body() dto: SendMessageDto,
) {
  return this.chatbotService.sendMessage(
    userId,
    role,
    dto.message,
  );
}

  @Post('voice-message')
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
 @Post('voice-message')
@UseInterceptors(
  FileInterceptor('audio', {
    storage: memoryStorage(),
    limits: {
      fileSize: 20 * 1024 * 1024,
    },
  }),
)
sendVoiceMessage(
  @CurrentUser('sub') userId: string,
  @CurrentUser('role') role: string,
  @UploadedFile() file: any,
) {
  if (!file) {
    throw new BadRequestException(
      'No audio file uploaded',
    );
  }

  return this.chatbotService.transcribeAndRespond(
    userId,
    role,
    file.buffer,
    file.mimetype,
  );
}
 @Get('history')
getHistory(
  @CurrentUser('sub') userId: string,
) {
  return this.chatbotService.getHistory(
    userId,
  );
}
}