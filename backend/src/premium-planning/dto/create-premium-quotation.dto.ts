import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreatePremiumQuotationDto {
  @ApiProperty({ example: 2250000 })
  @IsNumber()
  @Min(1)
  amount!: number;

  @ApiPropertyOptional({ example: { venue: 800000, catering: 900000 } })
  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
