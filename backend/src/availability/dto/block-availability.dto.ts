import { IsDateString, IsOptional, IsString } from 'class-validator';

export class BlockAvailabilityDto {
  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
