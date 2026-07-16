import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  IsArray,
  ArrayMaxSize,
  IsUrl,
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
  @ArrayMaxSize(5)
  @IsUrl(
    { protocols: ['https'], require_protocol: true },
    { each: true },
  )
  proofImages?: string[];
}
