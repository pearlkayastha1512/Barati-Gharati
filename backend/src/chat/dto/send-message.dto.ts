// import { IsString, IsUUID } from 'class-validator';

// export class SendMessageDto {
//   @IsUUID()
//   conversationId!: string;

//   @IsUUID()
//   receiverId!: string;

//   @IsString()
//   message!: string;
// }

import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class SendMessageDto {
  @IsUUID()
  conversationId!: string;

  @IsUUID()
  receiverId!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty({
    message: 'Message cannot be empty.',
  })
  @MinLength(1)
  @MaxLength(1000, {
    message: 'Message cannot exceed 1000 characters.',
  })
  message!: string;
}