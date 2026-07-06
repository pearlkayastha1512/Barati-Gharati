import { IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  conversationId!: string;

  @IsUUID()
  receiverId!: string;

  @IsString()
  message!: string;
}