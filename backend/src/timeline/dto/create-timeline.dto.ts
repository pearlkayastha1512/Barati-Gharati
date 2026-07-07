import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  TimelinePriority,
} from "@prisma/client";


export class CreateTimelineDto {
  @ApiProperty({
    example: 'Book Venue',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    example: '2026-12-20',
  })
  @IsDateString()
  date!: string;

  @ApiProperty({
    required: false,
    example: 'Pay advance to venue.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: TimelinePriority,
    required: false,
    default: TimelinePriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TimelinePriority)
  priority?: TimelinePriority;
}