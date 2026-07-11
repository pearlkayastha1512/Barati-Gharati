import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  IsArray,
} from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  bookingId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  complaint?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  proofImages?: string[];
}
