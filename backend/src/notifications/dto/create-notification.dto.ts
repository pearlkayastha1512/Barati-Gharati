import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'Booking Confirmed',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    example: 'Your booking has been confirmed.',
  })
  @IsString()
  message!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  link?: string;
}