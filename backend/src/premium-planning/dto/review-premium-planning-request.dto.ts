import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class ReviewPremiumPlanningRequestDto {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedVendorIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
