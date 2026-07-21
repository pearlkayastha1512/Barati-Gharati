import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreatePremiumQuotationDto {
  @ApiProperty({ example: 2250000 })
  @IsNumber()
  @Min(1)
  amount!: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  advancePercentage?: number;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsNumber()
  validityDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  inclusions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  vendorBreakdown?: Array<{ vendorId?: string; vendorName: string; category: string; cost: number; notes?: string }>;

  @ApiPropertyOptional({ example: { venue: 800000, catering: 900000 } })
  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminNotes?: string;
}

