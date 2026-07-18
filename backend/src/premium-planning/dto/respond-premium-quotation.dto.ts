import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class RespondPremiumQuotationDto {
  @ApiProperty()
  @IsBoolean()
  accept!: boolean;
}
