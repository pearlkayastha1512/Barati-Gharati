import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePremiumPlanningRequestDto {
  @ApiProperty({ example: 'Destination Wedding' })
  @IsString()
  @IsNotEmpty()
  weddingType!: string;

  @ApiProperty({ example: 'Heritage palace with outdoor lawn' })
  @IsString()
  @IsNotEmpty()
  venuePreference!: string;

  @ApiProperty({ example: 2500000 })
  @IsNumber()
  @Min(1)
  budget!: number;

  @ApiProperty({ example: 'Jaipur' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: 350 })
  @IsInt()
  @Min(1)
  @Max(100000)
  guestCount!: number;

  @ApiProperty({ example: 'Royal Rajasthani' })
  @IsString()
  @IsNotEmpty()
  theme!: string;

  @ApiProperty({ example: ['Venue', 'Catering', 'Photography'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  requiredVendors!: string[];

  @ApiPropertyOptional({ example: 'Wheelchair access is required.' })
  @IsOptional()
  @IsString()
  specialRequirements?: string;
}
