import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';


import { TimelineItemDto } from './timeline-item.dto';
import { GalleryImageDto } from './gallery-image.dto';

export class CreateWeddingStoryDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  location: string;

  @IsString()
  coverImage: string;

  @IsArray()
  @IsString({ each: true })
  story: string[];

  @IsInt()
  @Min(0)
  guests: number;

  @IsInt()
  @Min(0)
  vendors: number;

  @IsInt()
  @Min(1)
  celebrationDays: number;

  @IsString()
  budget: string;

  @IsString()
  venue: string;

  @IsString()
  photographer: string;

  @IsString()
  decor: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsArray()
@ValidateNested({ each: true })
@Type(() => GalleryImageDto)
galleryImages: GalleryImageDto[];

  @IsArray()
@ValidateNested({ each: true })
@Type(() => TimelineItemDto)
timeline: TimelineItemDto[];
}