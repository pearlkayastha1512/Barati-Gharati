import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryWeddingStoryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  limit = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  featured?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  published?: boolean;

  @IsOptional()
  @IsIn(['newest', 'oldest', 'title'])
  sort: 'newest' | 'oldest' | 'title' = 'newest';
}