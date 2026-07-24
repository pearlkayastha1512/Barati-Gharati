import { IsInt, IsString, Min } from 'class-validator';

export class TimelineItemDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(0)
  sortOrder: number;
}