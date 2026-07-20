import {
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateWeddingWebsiteDto {
  @IsOptional()
  @IsString()
  story?: string;

  @IsOptional()
  @IsString()
  heroImage?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  template?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galleryImages?: string[];

  @IsOptional()
  @IsString()
  venueName?: string;

  @IsOptional()
  @IsString()
  venueAddress?: string;
}